export class AuthResponseDto {
  data: {
    token: string;
    expiresIn: number;
  };
  message: string;

  constructor(token: string, expiresIn: number, message: string) {
    this.data.token = token;
    this.data.expiresIn = expiresIn;
    this.message = message;
  }
}
