import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  NotFoundException,
  BadRequestException,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './quiz.dto';
import { SubmitQuizDto } from './submit-quiz.dto';
import { Quiz } from './quiz.entity';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Quiz được tạo thành công',
    type: Quiz,
  })
  @ApiResponse({ status: 404, description: 'Level không tồn tại' })
  async create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Danh sách quiz',
  })
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;

    if (isNaN(pageNum) || pageNum < 1)
      throw new BadRequestException('page phải là số dương');
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100)
      throw new BadRequestException('limit phải từ 1 đến 100');

    return this.quizService.findAll(pageNum, limitNum);
  }

  @Get('random')
  @ApiResponse({
    status: 200,
    description: 'Trả về quiz + câu hỏi đã được xáo trộn ngẫu nhiên',
    type: Quiz,
  })
  @ApiResponse({
    status: 404,
    description: 'Hiện tại chưa có quiz nào để chơi',
  })
  async getRandomQuiz() {
    return this.quizService.getRandomQuiz();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Chi tiết quiz', type: Quiz })
  @ApiResponse({ status: 404, description: 'Quiz không tồn tại' })
  async findOne(@Param('id') id: string) {
    return this.quizService.findOne(id);
  }

  @Get('level/:levelId/random')
  @ApiResponse({
    status: 200,
    description: 'Quiz ngẫu nhiên + câu hỏi đã xáo trộn',
  })
  @ApiResponse({
    status: 404,
    description: 'Level không tồn tại hoặc không có quiz',
  })
  async getRandomQuizByLevel(@Param('levelId') levelId: string) {
    return this.quizService.getRandomQuizByLevel(levelId);
  }

  @Post(':id/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Nộp kết quả quiz' })
  @ApiResponse({ status: 200, description: 'Kết quả đã được lưu' })
  async submitQuiz(
    @Param('id') quizId: string,
    @Body() submitDto: SubmitQuizDto,
    @Req() req,
  ) {
    const userId = req.user?.userId || req.user?.sub;
    return this.quizService.submitQuiz(userId, quizId, submitDto);
  }
}
