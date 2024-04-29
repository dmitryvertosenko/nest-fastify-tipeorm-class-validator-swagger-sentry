import { Type, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { memoize } from 'core/utils/memoize.util';
import { Repository as CustomRepository } from '../classes/repository.class';

export const EntityRepository: <T>(entity: Type<T>) => Type<CustomRepository<typeof entity>> = memoize(
  <T>(entity: Type<T>) => {
    @Injectable()
    class Repository extends CustomRepository<typeof entity> {
      constructor(private dataSource: DataSource) {
        super(entity, dataSource.createEntityManager());
      }
    }

    Object.defineProperty(Repository, 'name', { value: `${entity.name}Repository` });

    return Repository;
  },
);
