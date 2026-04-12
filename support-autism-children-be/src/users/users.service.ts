import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class UsersService {
  constructor(
      private prisma: PrismaService
    ) {}
  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        birthDate: true,
        avatarUrl: true,
        totalPoints: true,
        streakDays: true,
        accuracyRate: true,
        totalPracticeMinutes: true,
        currentLevel: true,
        lastActiveDate: true,
      },
    });
  }

  findOne(id_user: string) {
    return this.prisma.user.findUnique({
      where: { id : id_user },
      select: {
        id: true,
        email: true,
        name: true,
        birthDate: true,
        avatarUrl: true,
        totalPoints: true,
        streakDays: true,
        accuracyRate: true,
        totalPracticeMinutes: true,
        currentLevel: true,
        lastActiveDate: true,
        unlockedLevels: true,
        attemptQuizzes: true,
        practices: true
      },
    });
  }

  update(id_user: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
    where: { id: id_user },
    data: updateUserDto, 
    select: {
      name: true,
      birthDate: true,
      avatarUrl: true,
    },
  });
  }

  remove(id_user: string) {
     return this.prisma.user.delete({
    where: { id: (id_user) },
    select: { id: true, email: true, name: true },
  });
  }
}
