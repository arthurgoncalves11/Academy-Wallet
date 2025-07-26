import { Request, Response } from 'express';

export default function ContentTypeMiddleware(req: Request, res: Response) {
  const contentType = req.headers['content-type'];
  if (!contentType || !contentType.includes('application/json')) {
    return res.status(415).json({
      statusCode: 415,
      message: 'Unsupported media type',
    });
  }
}
