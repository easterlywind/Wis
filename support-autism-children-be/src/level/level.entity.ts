import { Quiz, UnlockedLevel, AttemptQuiz } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Level {
    @ApiProperty({ description: 'Unique identifier for the level' })
    id: string;

    @ApiProperty({ description: 'Name of the level' })
    name: string;

    @ApiPropertyOptional({ description: 'Optional description of the level' })
    description?: string;

    @ApiProperty({ description: 'Difficulty rating of the level', example: 1 })
    difficulty: number;

    @ApiProperty({ description: 'Required points to unlock the level', example: 0 })
    requiredPoints: number;

    @ApiProperty({
        type: [Object],
        description: 'List of quizzes belonging to this level',
    })
    quizzes: Quiz[];
}
