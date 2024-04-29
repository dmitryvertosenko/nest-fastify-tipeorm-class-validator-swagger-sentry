import { Logger } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import * as fs from 'fs';

export class DatabaseService {
  configsPath = './dist/connections/database/configs/';

  private env: { [k: string]: string | undefined };

  constructor() {
    this.env = config().parsed;

    this.generateOrmConfigFile();
  }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];

    if (!value && throwOnMissing) {
      throw new Error(`Error: Can't configure DB connection - missing env.${key}`);
    }

    return value;
  }

  public get isProduction() {
    return /^PROD/.test(this.getValue('MODE', false));
  }

  public get dataSorceConfig(): DataSourceOptions {
    return <DataSourceOptions>{
      type: this.getValue('DB_TYPE'),
      host: this.getValue('DB_HOST'),
      port: parseInt(this.getValue('DB_PORT')),
      username: this.getValue('DB_USER'),
      password: this.getValue('DB_PASSWORD'),
      database: this.getValue('DB_NAME'),
      entities: ['./dist/modules/**/*.entity{.ts,.js}'],
      migrationsTableName: 'migrations',
      migrations: ['./dist/connections/database/migrations/*{.ts,.js}'],
    };
  }

  public get typeOrmModuleConfig(): TypeOrmModuleOptions {
    return <TypeOrmModuleOptions>(<unknown>{
      ...this.dataSorceConfig,
      cli: {
        migrationsDir: './src/connections/database/migrations',
      },
      keepConnectionAlive: true,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      logger: 'advanced-console',
      ssl: this.isProduction,
    });
  }

  public generateOrmConfigFile() {
    try {
      // fs.unlinkSync('ormconfig.json');
      fs.mkdirSync(this.configsPath, { recursive: true });

      fs.writeFileSync(this.configsPath + 'ormconfig.json', JSON.stringify(this.typeOrmModuleConfig, null, 2));
      Logger.log(`😎 ORM config was created successfully.`, `DatabaseService`);

      fs.writeFileSync(
        this.configsPath + 'migration.config.ts',
        `import { DataSource } from 'typeorm';\n\nconst datasource = new DataSource({\n${Object.entries(
          this.dataSorceConfig,
        ).reduce(
          (acc, [key, value]) =>
            acc.concat(
              `  ${key}: ${
                !Number.isInteger(value) ? (Array.isArray(value) ? `['${value}']` : `'${value}'`) : value
              },\n`,
            ),
          '',
        )}});\n\ndatasource.initialize();\n\nexport default datasource;\n`,
      );
      Logger.log(`😎 Migration config was created successfully.`, `DatabaseService`);
    } catch (error) {
      Logger.error(`😱 Error: ${error.message}`, `DatabaseService`);
    }
  }
}
