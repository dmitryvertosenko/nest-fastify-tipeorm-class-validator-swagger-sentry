import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'connections/database/database.module';
import { AuthModule } from 'modules/auth/auth.module';
import { UsersModule } from 'modules/users/users.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, AuthModule, UsersModule],
})
export class AppModule {}
