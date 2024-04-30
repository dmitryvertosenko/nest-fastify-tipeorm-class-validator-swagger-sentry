import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const External = (): CustomDecorator => SetMetadata('__is_external_route__', true);
