import 'express';
import { JwtPayload } from './jwt-payload.type';

declare global {
  namespace Express {
    interface Request {
      employee?: JwtPayload;
    }
  }
}

declare global {
  namespace Express {
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        buffer: Buffer;
        destination?: string;
        filename?: string;
        path?: string;
      }
    }
  }
}
