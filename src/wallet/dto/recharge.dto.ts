import { IsNumber, Min } from 'class-validator';

export class RechargeDto {
  @IsNumber()
  @Min(1000, { message: 'Số tiền tối thiểu để nạp là 1.000 VNĐ' })
  amount: number;
}
