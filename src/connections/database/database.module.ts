import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule, InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DatabaseService } from './database.service';

@Module({
  imports: [TypeOrmModule.forRoot(new DatabaseService().typeOrmModuleConfig)],
})
export class DatabaseModule implements OnModuleInit {
  constructor(
    @InjectDataSource()
    private readonly dataSourse: DataSource,
  ) {}

  async onModuleInit() {
    await this.dataSourse.runMigrations({ transaction: 'each' });
  }
}
