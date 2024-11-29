export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
};

export type QRCode = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  qrUrl: string;
  userId: string;
  type: 'BASIC' | 'PREMIUM';
  status: 'ACTIVE' | 'INACTIVE';
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
};
