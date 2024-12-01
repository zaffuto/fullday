export interface QRCode {
  id: string;
  url: string;
  description?: string;
  size: number;
  fgColor: string;
  bgColor: string;
  qrStyle: 'dots' | 'squares';
  errorLevel: 'L' | 'M' | 'Q' | 'H';
  logo?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQRCodeDTO {
  url: string;
  description?: string;
  size: number;
  fgColor: string;
  bgColor: string;
  qrStyle: 'dots' | 'squares';
  errorLevel: 'L' | 'M' | 'Q' | 'H';
  logo?: string;
  userId: string;
}

export interface QRCodeRepository {
  create(data: CreateQRCodeDTO): Promise<QRCode>;
  findById(id: string): Promise<QRCode | null>;
  findByUserId(userId: string, page: number, limit: number): Promise<{
    data: QRCode[];
    total: number;
    currentPage: number;
    totalPages: number;
  }>;
  update(id: string, data: Partial<CreateQRCodeDTO>): Promise<QRCode>;
  delete(id: string): Promise<void>;
}
