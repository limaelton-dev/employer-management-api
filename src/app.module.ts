import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Meeting } from './entities/meeting.entity';
import { EmployeesModule } from './employees/employees.module';
import { ReportsModule } from './reports/reports.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot({
      redis: 'redis://localhost:6379',
      defaultJobOptions: {
        removeOnComplete: 100, //deixo os ultimos 100 jobs salvos
        removeOnFail: 1000, //deixo os ultimos 1000 jobs que obtiveram erros salvos
        attempts: 3, //numero de tentativas em caso de falha
        backoff: {
          type: 'exponential',
          delay: 1000
        }
      }
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([
      Task,
      Meeting,
    ]),
    EmployeesModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
