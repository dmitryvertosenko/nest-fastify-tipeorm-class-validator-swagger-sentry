import { HttpStatus } from '@nestjs/common';

export interface HttpExeptionBody {
  response: {
    statusCode: number;
    message: string | string[];
    error: string;
  };
  status: HttpStatus;
}
