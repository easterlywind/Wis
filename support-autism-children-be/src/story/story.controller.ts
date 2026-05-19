import { Controller, Get, Post, Body, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StoryService } from './story.service';
import { GameService } from '../game/game.service';

@ApiTags('story')
@ApiBearerAuth()
@Controller('stories')
export class StoryController {
  constructor(
    private readonly storyService: StoryService,
    private readonly gameService: GameService,
  ) {}

  @Get('random')
  @ApiOperation({ summary: 'Get random stories for communication practice' })
  async getRandomStories(@Query('count') count?: string) {
    const roundCount = count ? parseInt(count, 10) : 5;
    return this.storyService.getRandomStories(roundCount);
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit story practice results' })
  async submitStoryResult(
    @Req() req,
    @Body()
    body: {
      correctCount: number;
      totalRounds: number;
      timeSpentSeconds: number;
    },
  ) {
    const userId = req.user?.sub || req.user?.id;
    // We reuse game service to calculate points and update weekly progress/level up
    // since both count as practice activities
    return this.gameService.submitGameResult(userId, body);
  }
}
