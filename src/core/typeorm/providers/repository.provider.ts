import { DataSource } from 'typeorm';
import { EntityRepository } from '../utils/entity-repository.util';

// TODO: need fix or improve this method
export const RepositoryProvider = (entity: any) => ({
  provide: `${EntityRepository(entity).name}`,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(EntityRepository(entity)),
  inject: ['DATA_SOURCE'],
});
