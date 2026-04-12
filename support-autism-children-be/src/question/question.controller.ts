import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './question.dto';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Question } from './question.entity';

@ApiTags('questions')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Question created', type: Question })
  create(@Body() dto: CreateQuestionDto) {
    return this.questionService.create(dto);
  }

  @ApiBearerAuth()
  @Get()
  @ApiResponse({ status: 200, description: 'All questions', type: [Question] })
  findAll() {
    return this.questionService.findAll();
  }

  @Get('quiz/:quizId')
  async findAllByQuiz(@Param('quizId') quizId: string) {
    return this.questionService.findAllByQuizId(quizId);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Single question', type: Question })
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }
}
