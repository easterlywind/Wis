import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DrawingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Save a new drawing from base64 string
   */
  async saveDrawing(userId: string, emotionId: string, base64Image: string) {
    // 1. Verify emotion exists
    const emotion = await this.prisma.emotion.findUnique({
      where: { id: emotionId },
    });
    if (!emotion) {
      throw new BadRequestException('Emotion not found');
    }

    // 2. Process base64 image
    // Typically format is: data:image/png;base64,iVBORw0KGgo...
    const matches = base64Image.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new BadRequestException('Invalid base64 image format');
    }

    const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // 3. Setup directory and filename
    const uploadDir = path.join(process.cwd(), 'media_drawing');

    // Ensure directory exists
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const filename = `${userId}_${uuidv4()}.${extension}`;
    const filePath = path.join(uploadDir, filename);
    const publicUrl = `media_drawing/${filename}`;

    // 4. Save file
    await fs.writeFile(filePath, buffer);

    // 5. Save to database
    const drawing = await this.prisma.drawing.create({
      data: {
        userId,
        emotionId,
        imageUrl: publicUrl,
      },
    });

    return drawing;
  }

  /**
   * Get all drawings of a user
   */
  async getMyDrawings(userId: string) {
    return this.prisma.drawing.findMany({
      where: { userId },
      include: { emotion: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get random emotions to draw
   */
  async getRandomEmotions(count = 3) {
    const allEmotions = await this.prisma.emotion.findMany({
      select: { id: true, name: true, iconUrl: true },
    });

    if (allEmotions.length === 0) return [];

    return allEmotions.sort(() => Math.random() - 0.5).slice(0, count);
  }
}
