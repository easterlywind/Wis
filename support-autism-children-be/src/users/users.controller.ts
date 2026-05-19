import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo người dùng mới' })
  @ApiResponse({ status: 201, description: 'Tạo thành công' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả người dùng' })
  @ApiResponse({ status: 200, description: 'Danh sách người dùng' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin người dùng theo ID' })
  @ApiResponse({ status: 200, description: 'Thông tin người dùng' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa người dùng' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  @Get('me/stats')
  @ApiOperation({ summary: 'Lấy thống kê tổng quan của người dùng hiện tại' })
  @ApiResponse({ status: 200, description: 'Thống kê người dùng' })
  getMyStats(@Req() req) {
    const userId = req.user?.userId || req.user?.sub;
    return this.usersService.getUserStats(userId);
  }

  @Get('me/stats/emotions')
  @ApiOperation({ summary: 'Thống kê độ chính xác theo từng cảm xúc' })
  @ApiResponse({ status: 200, description: 'Thống kê theo cảm xúc' })
  getMyEmotionStats(@Req() req) {
    const userId = req.user?.userId || req.user?.sub;
    return this.usersService.getEmotionStats(userId);
  }

  @Get('me/stats/history')
  @ApiOperation({ summary: 'Lịch sử hoạt động theo ngày' })
  @ApiResponse({ status: 200, description: 'Lịch sử hoạt động' })
  getMyHistory(@Req() req) {
    const userId = req.user?.userId || req.user?.sub;
    return this.usersService.getActivityHistory(userId);
  }
}
