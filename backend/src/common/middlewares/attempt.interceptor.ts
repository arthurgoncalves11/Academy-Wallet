import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import logger from 'logger';

@Injectable()
export class AttemptInterceptor implements NestInterceptor {
  private readonly MAX_ATTEMPTS = 3;
  private readonly BLOCK_TTL = 600 * 1000;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userIdentifier = request.user?.sub || request.ip;
    const key = `attempt:${userIdentifier}:${request.route.path}`;

    logger.info(`Interceptando requisição para: ${key}`);
    logger.debug(`User identifier: ${userIdentifier}`);

    const isBlocked = await this.cacheManager.get(`block:${key}`);
    if (isBlocked) {
      logger.warn(`Acesso bloqueado para: ${key}`);
      throw new ForbiddenException(
        'Muitas tentativas. Tente novamente em 10 minutos.',
      );
    }

    return next.handle().pipe(
      tap({
        next: async () => {
          logger.info(`Sucesso - Resetando tentativas para: ${key}`);
          await this.cacheManager.del(key);
        },
        error: async (error) => {
          if (error.status !== 401 && error.status !== 403) return;

          logger.error(`Erro na requisição: ${error.message}`, error.stack);
          const attempts = await this.incrementAttempt(key);
          logger.info(`Tentativa ${attempts} registrada para: ${key}`);

          if (attempts >= this.MAX_ATTEMPTS) {
            logger.warn(`Bloqueando usuário: ${key}`);
            await this.cacheManager.set(`block:${key}`, true, this.BLOCK_TTL);
          }
        },
      }),
    );
  }

  private async incrementAttempt(key: string): Promise<number> {
    const current = (await this.cacheManager.get<number>(key)) ?? 0;
    logger.debug(`Valor atual do cache para ${key}: ${current}`);

    const newValue = current + 1;
    let ttl = this.BLOCK_TTL;

    if (current !== 0) {
      const fetchedTtl = await this.cacheManager.ttl(key);
      logger.debug(`TTL obtido para ${key}: ${fetchedTtl}`);

      ttl = fetchedTtl !== null && fetchedTtl > 0 ? fetchedTtl : this.BLOCK_TTL;
    }

    logger.info(`Atualizando cache: ${key} = ${newValue} com TTL: ${ttl}`);
    await this.cacheManager.set(key, newValue, ttl);

    return newValue;
  }
}
