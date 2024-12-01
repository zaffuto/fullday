import { PrismaClient } from '@prisma/client';
import { CreateQRCodeDTO, QRCode, QRCodeRepository } from '@/domain/qr/entities/QRCode';

export class PrismaQRCodeRepository implements QRCodeRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: CreateQRCodeDTO): Promise<QRCode> {
    return this.prisma.qRCode.create({
      data,
    });
  }

  async findById(id: string): Promise<QRCode | null> {
    return this.prisma.qRCode.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.qRCode.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.qRCode.count({
        where: { userId },
      }),
    ]);

    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, data: Partial<CreateQRCodeDTO>): Promise<QRCode> {
    return this.prisma.qRCode.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.qRCode.delete({
      where: { id },
    });
  }
}
