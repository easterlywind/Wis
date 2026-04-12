import { Controller, Req, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { LevelService } from './level.service';
import { CreateLevelDto, UnlockLevel } from './level.dtos';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('levels')
@ApiBearerAuth()
@Controller('levels')
export class LevelController {
    constructor(private readonly levelService: LevelService) { }

    @Post()
    @ApiOperation({ summary: 'Tạo level mới' })
    @ApiResponse({ status: 201, description: 'Level được tạo thành công' })
    create(@Body() dto: CreateLevelDto) {
        return this.levelService.create(dto);
    }

    @Post('/unlock')
    @ApiOperation({ summary: 'Mở khóa level cho user' })
    @ApiResponse({ status: 201, description: 'Level đã được mở khóa' })
    unlockLevel(@Body() dto: UnlockLevel) {
        return this.levelService.unlockLevel(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách levels với trạng thái unlock' })
    @ApiResponse({ status: 200, description: 'Danh sách levels' })
    findAllUnlockedLevels(@Req() req) {
        const userId = req.user.userId;
        return this.levelService.findAllLevelsByUserId(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Lấy tất cả quiz trong level' })
    @ApiResponse({ status: 200, description: 'Danh sách quiz của level' })
    async findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
        const userId = req.user.userId;
        return this.levelService.getAllQuizByLevelId(userId, id);
    }
}
