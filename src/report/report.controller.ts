import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { CreateReportDto } from './dtos/create-report.dto';
import { Request } from 'express';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/utils/enums/role.enum';
import { Report } from './schemas/report.schema';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('create-report')
  async createPost(
    @Body() createReportDto: CreateReportDto,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    const { id } = request['user'];
    return this.reportService.createReport(id, createReportDto);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Get('get-reports')
  async getReports(): Promise<Report[]> {
    return this.reportService.getReports();
  }
}
