import { CreateQRCodeDTO, QRCode } from '@/domain/qr/entities/QRCode';
import { CreateQRCodeUseCase } from '@/domain/qr/usecases/CreateQRCode';
import { GetUserQRCodesUseCase } from '@/domain/qr/usecases/GetUserQRCodes';
import { PrismaQRCodeRepository } from '@/infrastructure/repositories/PrismaQRCodeRepository';

export class QRCodeService {
  private createQRCodeUseCase: CreateQRCodeUseCase;
  private getUserQRCodesUseCase: GetUserQRCodesUseCase;

  constructor() {
    const repository = new PrismaQRCodeRepository();
    this.createQRCodeUseCase = new CreateQRCodeUseCase(repository);
    this.getUserQRCodesUseCase = new GetUserQRCodesUseCase(repository);
  }

  async createQRCode(data: CreateQRCodeDTO): Promise<QRCode> {
    return this.createQRCodeUseCase.execute(data);
  }

  async getUserQRCodes(userId: string, page?: number, limit?: number) {
    return this.getUserQRCodesUseCase.execute(userId, page, limit);
  }
}
