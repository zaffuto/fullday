import { CreateQRCodeDTO, QRCode, QRCodeRepository } from '../entities/QRCode';

export class CreateQRCodeUseCase {
  constructor(private qrCodeRepository: QRCodeRepository) {}

  async execute(data: CreateQRCodeDTO): Promise<QRCode> {
    // Aquí podríamos agregar validaciones de negocio adicionales
    return this.qrCodeRepository.create(data);
  }
}
