import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [LevelController],
  providers: [PrismaService, LevelService],
})
export class LevelModule {}
