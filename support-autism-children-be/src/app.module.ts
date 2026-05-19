import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
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
import { PracticeModule } from './practice/practice.module';
import { GameModule } from './game/game.module';
import { StoryModule } from './story/story.module';
import { DrawingModule } from './drawing/drawing.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    PrismaModule,
    AuthModule,
    QuestionModule,
    LevelModule,
    QuizModule,
    PracticeModule,
    GameModule,
    StoryModule,
    DrawingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/refresh', method: RequestMethod.POST },
      )
      .forRoutes('*path');
  }
}
