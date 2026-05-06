import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get random stories for communication practice.
   */
  async getRandomStories(count = 5) {
    const stories = await this.prisma.story.findMany({
      include: { emotion: true },
    });

    if (stories.length === 0) {
      return { totalStories: 0, stories: [] };
    }

    // Shuffle and pick
    const shuffled = stories.sort(() => Math.random() - 0.5).slice(0, count);
    
    // For each story, we also need to generate 3 wrong distractors for the question
    const allEmotions = await this.prisma.emotion.findMany({
      select: { id: true, name: true, iconUrl: true },
    });

    const rounds = shuffled.map((story, i) => {
      const correct = allEmotions.find(e => e.id === story.correctEmotionId);
      
      const distractors = allEmotions
        .filter(e => e.id !== story.correctEmotionId)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
        
      const options = [correct, ...distractors].sort(() => Math.random() - 0.5);

      return {
        roundIndex: i,
        id: story.id,
        title: story.title,
        content: story.content,
        imageUrl: story.imageUrl,
        explanation: story.explanation,
        correctEmotionId: story.correctEmotionId,
        correctEmotionName: correct?.name || '',
        options: options.map(o => ({
          id: o?.id || '',
          name: o?.name || '',
        }))
      };
    });

    return { totalRounds: rounds.length, rounds };
  }
}
