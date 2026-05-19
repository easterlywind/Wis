import { Controller, Post, Body, Req } from '@nestjs/common';
import { PracticeService } from './practice.service';
import { SubmitPracticeDto } from './practice.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('practices')
@ApiBearerAuth()
@Controller('practices')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post('submit')
  @ApiOperation({ summary: 'Nộp kết quả thực hành qua Camera' })
  @ApiResponse({ status: 201, description: 'Đã lưu kết quả thực hành' })
  async submitPractice(@Req() req, @Body() dto: SubmitPracticeDto) {
    return this.practiceService.submitPractice(req.user.userId, dto);
  }
}
