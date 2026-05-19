import { Controller, Get, Post, Body, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DrawingService } from './drawing.service';
import { GameService } from '../game/game.service';

@ApiTags('drawing')
@ApiBearerAuth()
@Controller('drawings')
export class DrawingController {
  constructor(
    private readonly drawingService: DrawingService,
    private readonly gameService: GameService,
  ) {}

  @Post('save')
  @ApiOperation({ summary: 'Save a new drawing from base64 string' })
  async saveDrawing(
    @Req() req,
    @Body() body: { emotionId: string; base64Image: string },
  ) {
    const userId = req.user?.sub || req.user?.id;
    const drawing = await this.drawingService.saveDrawing(
      userId,
      body.emotionId,
      body.base64Image,
    );

    // Also submit game result to add points for creativity activity (1 point per drawing)
    await this.gameService.submitGameResult(userId, {
      correctCount: 1,
      totalRounds: 1,
      timeSpentSeconds: 60, // Dummy time
    });

    return drawing;
  }

  @Get('my')
  @ApiOperation({ summary: 'Get all drawings of current user' })
  async getMyDrawings(@Req() req) {
    const userId = req.user?.sub || req.user?.id;
    return this.drawingService.getMyDrawings(userId);
  }

  @Get('emotions')
  @ApiOperation({ summary: 'Get random emotions for drawing suggestions' })
  async getRandomEmotions() {
    return this.drawingService.getRandomEmotions(3);
  }
}
