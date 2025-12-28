import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/orderModel'; // Assuming this is the correct path to your order model
import { generatePackingSlipPdf } from '@/utils/pdfGenerator';

export async function GET(request, { params }) {
    await dbConnect();
    const { orderId } = params;

    try {
        const order = await Order.findById(orderId).populate('orderItems.product');

        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        const pdfBuffer = await generatePackingSlipPdf(order);

        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', `attachment; filename="packing-slip-${orderId}.pdf"`);

        return new NextResponse(pdfBuffer, { headers });

    } catch (error) {
        console.error('Error generating packing slip:', error);
        return NextResponse.json({ message: 'Error generating packing slip', error: error.message, stack: error.stack }, { status: 500 });
    }
}
