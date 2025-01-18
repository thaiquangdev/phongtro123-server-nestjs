import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Report } from './schemas/report.schema';
import { Model } from 'mongoose';
import { CreateReportDto } from './dtos/create-report.dto';

@Injectable()
export class ReportService {
  constructor(@InjectModel(Report.name) private reportModel: Model<Report>) {}

  // tạo mới một phản ánh
  async createReport(
    userId: string,
    createReportDto: CreateReportDto,
  ): Promise<{ message: string }> {
    const newReport = await this.reportModel.create({
      post: createReportDto.postId,
      user: userId,
      reason: createReportDto.reason,
    });
    await newReport.save();
    return {
      message: 'Bạn đã phản ánh bài viết này thành công',
    };
  }

  // lấy ra danh sách phản ánh
  async getReports(): Promise<Report[]> {
    const reports = await this.reportModel.find();
    return reports;
  }

  // xóa phản ánh
  async deleteReport(rid: string) {
    const report = await this.reportModel.findById(rid);
    if (!report) {
      throw new BadRequestException(`Không tìm thấy phản ảnh với id ${rid}`);
    }
    await this.reportModel.deleteOne({ _id: rid });
    return {
      message: 'Xóa phản ánh thành công',
    };
  }
}
