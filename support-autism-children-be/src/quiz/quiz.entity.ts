import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Question } from '../question/question.entity';

export class Quiz {
  @ApiProperty()
  id: string;

  @ApiProperty()
  levelId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional({ type: () => [Question] })
  questions?: Question[];
}
