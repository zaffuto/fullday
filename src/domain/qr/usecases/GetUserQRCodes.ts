import { QRCode, QRCodeRepository } from '../entities/QRCode';

export class GetUserQRCodesUseCase {
  constructor(private qrCodeRepository: QRCodeRepository) {}

  async execute(userId: string, page: number = 1, limit: number = 10) {
    return this.qrCodeRepository.findByUserId(userId, page, limit);
  }
}
