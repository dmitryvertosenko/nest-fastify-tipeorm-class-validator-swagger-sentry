import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiBasicAuth } from '@nestjs/swagger';

export const OpenApi = (dto: new () => any) => applyDecorators(ApiBody({ type: dto }), ApiBasicAuth('api-key'));
