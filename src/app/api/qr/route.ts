import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { QRCodeService } from '@/application/qr/QRCodeService';
import { z } from 'zod';

const qrCodeSchema = z.object({
  url: z.string().url(),
  description: z.string().optional(),
  size: z.number().min(100).max(400),
  fgColor: z.string().regex(/^#[0-9A-F]{6}$/i),
  bgColor: z.string().regex(/^#[0-9A-F]{6}$/i),
  qrStyle: z.enum(['dots', 'squares']),
  errorLevel: z.enum(['L', 'M', 'Q', 'H']),
  logo: z.string().optional(),
});

const qrCodeService = new QRCodeService();

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = qrCodeSchema.parse(body);

    const qrCode = await qrCodeService.createQRCode({
      ...validatedData,
      userId: session.user.id,
    });

    return NextResponse.json(qrCode);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error al crear QR:', error);
    return NextResponse.json(
      { error: 'Error al crear el código QR' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit')) || 10;
    const page = Number(searchParams.get('page')) || 1;

    const result = await qrCodeService.getUserQRCodes(
      session.user.id,
      page,
      limit
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error al obtener QRs:', error);
    return NextResponse.json(
      { error: 'Error al obtener los códigos QR' },
      { status: 500 }
    );
  }
}
