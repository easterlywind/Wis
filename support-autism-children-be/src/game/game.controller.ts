import { Controller, Get, Post, Body, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GameService } from './game.service';

@ApiTags('game')
@ApiBearerAuth()
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('emotion-match')
  @ApiOperation({ summary: 'Get random emotion matching game rounds' })
  async getEmotionMatch(@Query('count') count?: string) {
    const roundCount = count ? parseInt(count, 10) : 10;
    return this.gameService.generateEmotionMatch(roundCount);
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit game results' })
  async submitGameResult(
    @Req() req,
    @Body() body: { correctCount: number; totalRounds: number; timeSpentSeconds: number },
  ) {
    const userId = req.user?.sub || req.user?.id;
    return this.gameService.submitGameResult(userId, body);
  }

  @Get('weekly-progress')
  @ApiOperation({ summary: 'Get weekly activity progress' })
  async getWeeklyProgress(@Req() req) {
    const userId = req.user?.sub || req.user?.id;
    return this.gameService.getWeeklyProgress(userId);
  }
}
