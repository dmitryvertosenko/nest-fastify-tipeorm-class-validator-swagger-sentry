import { InjectRepository as BaseInjectRepository } from '@nestjs/typeorm';
import { EntityRepository } from '../utils/entity-repository.util';

export const InjectRepository = (entity: new () => any) => BaseInjectRepository(EntityRepository(entity));
