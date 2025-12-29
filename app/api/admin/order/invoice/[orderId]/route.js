import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/orderModel';
import Settings from '@/models/settingsModel';
import { generateInvoicePdf } from '@/utils/pdfGenerator';

export async function GET(request, { params }) {
    await dbConnect();
    const awaitedParams = await params;
    const { orderId } = awaitedParams;

    try {
        const order = await Order.findById(orderId).populate('orderItems.product').populate('user');
        const settings = await Settings.findOne({});

        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        const pdfBuffer = await generateInvoicePdf(order, settings);

        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', `attachment; filename="invoice-${orderId}.pdf"`);

        return new NextResponse(pdfBuffer, { headers });

    } catch (error) {
        console.error('Error generating invoice:', error);
        return NextResponse.json({ message: 'Error generating invoice', error: error.message, stack: error.stack }, { status: 500 });
    }
}
