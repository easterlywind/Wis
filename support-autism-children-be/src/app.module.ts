import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuestionModule } from './question/question.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { LevelModule } from './level/level.module';
import { QuizModule } from './quiz/quiz.module'; 
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    PrismaModule,
    AuthModule,
    QuestionModule,
    LevelModule,
    QuizModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// export class AppModule {}

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware)
    .exclude("auth/(.*)")
    .forRoutes('*path');
  }
}
