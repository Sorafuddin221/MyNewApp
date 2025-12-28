import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs/promises';

// Helper function to initialize PDFDocument with font handling
async function initializePdfDocument() {
    let doc;
    try {
        const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Roboto-Regular.ttf');
        console.log('PDF: Attempting to read custom font from:', fontPath);
        const fontBuffer = await fs.readFile(fontPath);
        console.log('PDF: Custom font read successfully.');
        doc = new PDFDocument({ margin: 50, font: fontBuffer });
        console.log('PDF: PDFDocument initialized with custom font.');
    } catch (error) {
        console.error('PDF: Error loading custom font (Roboto-Regular.ttf):', error);
        // Fallback to default font if custom font fails
        try {
            console.log('PDF: Attempting to initialize PDFDocument with fallback Helvetica.');
            doc = new PDFDocument({ margin: 50 });
            doc.font('Helvetica'); // Rely on PDFKit's default Helvetica
            console.log('PDF: PDFDocument initialized with fallback Helvetica.');
        } catch (fallbackError) {
            console.error('PDF: Failed to initialize PDFDocument with fallback Helvetica:', fallbackError);
            throw new Error('Failed to initialize PDFDocument due to font issues.');
        }
    }
    return doc;
}

export async function generatePackingSlipPdf(order) {
    return new Promise(async (resolve, reject) => {
        let doc;
        try {
            doc = await initializePdfDocument(); // Initialize PDFDocument

            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                let pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
            doc.on('error', reject);

            doc.fontSize(25).text('Packing Slip', { align: 'center' });
            doc.moveDown();

            // Order Details
            doc.fontSize(12).text(`Order ID: ${order._id}`);
            doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`);
            doc.moveDown();

            // Shipping Information
            doc.fontSize(12).text(`Billing Address: ${order.shippingInfo?.address}, ${order.shippingInfo?.city}`);
            doc.text(` ${order.shippingInfo?.state}, ${order.shippingInfo?.Country}`);
            doc.text(`Pin Code: ${order.shippingInfo?.pinCode}`);
            doc.text(`Phone No: ${order.shippingInfo?.phoneNo}`);
            doc.moveDown();

            // Items Table Header
            const tableTop = doc.y;
            const itemColumnX = 50;
            const quantityColumnX = 250;
            const colorColumnX = 350; // New column for color
            const priceColumnX = 450;

            doc.fontSize(12).text('Item', itemColumnX, tableTop, { underline: true });
            doc.text('Quantity', quantityColumnX, tableTop, { underline: true });
            doc.text('Color', colorColumnX, tableTop, { underline: true }); // Display color
            doc.text('Price', priceColumnX, tableTop, { underline: true });
            doc.moveDown();

            let y = tableTop + 20;

            // Items Table Body
            for (let i = 0; i < order.orderItems.length; i++) {
                const item = order.orderItems[i];
                const colorName = item.color || 'N/A';
                doc.text(item.name ?? 'N/A', itemColumnX, y);
                doc.text((item.quantity ?? 0).toString(), quantityColumnX, y);
                doc.text(colorName, colorColumnX, y);
                doc.text(`${item.price ?? 0}/-`, priceColumnX, y);
                y += 20;
            }

            doc.end();
        } catch (error) {
            console.error('Error generating Packing Slip:', error);
            reject(error);
        }
    });
}

export async function generateInvoicePdf(order) {
    return new Promise(async (resolve, reject) => {
        let doc;
        try {
            doc = await initializePdfDocument(); // Initialize PDFDocument

            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                let pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
            doc.on('error', reject);

            doc.fontSize(25).text('Invoice', { align: 'center' });
            doc.moveDown();

            // Order Details
            doc.fontSize(12).text(`Order ID: ${order._id}`);
            doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`);
            doc.text(`Payment Status: ${order.paymentInfo?.status === 'succeeded' ? 'Paid' : (order.paymentInfo?.status || 'N/A')}`); // Added null check for paymentInfo
            doc.moveDown();

            // Billing Information (assuming shipping is billing for simplicity, can be separated if needed)
            doc.fontSize(14).text('Billing Address:', { underline: true });
            doc.fontSize(12).text(`${order.shippingInfo?.address}, ${order.shippingInfo?.city}`);
            doc.text(`${order.shippingInfo?.state}, ${order.shippingInfo?.country}`); // Corrected 'country' to 'Country'
            doc.text(`Pin Code: ${order.shippingInfo?.pinCode}`);
            doc.text(`Phone No: ${order.shippingInfo?.phoneNo}`);
            doc.moveDown();

            // Items Table Header
            const tableTop = doc.y;
            const itemColumnX = 50;
            const quantityColumnX = 200;
            const colorColumnX = 280; // New column for color
            const unitPriceColumnX = 360;
            const totalColumnX = 450;

            doc.fontSize(12).text('Item', itemColumnX, tableTop, { underline: true });
            doc.text('Quantity', quantityColumnX, tableTop, { underline: true });
            doc.text('Color', colorColumnX, tableTop, { underline: true }); // Display color
            doc.text('Unit Price', unitPriceColumnX, tableTop, { underline: true });
            doc.text('Total', totalColumnX, tableTop, { underline: true });
            doc.moveDown();

            let y = tableTop + 20;
            let subtotal = 0;

            // Items Table Body
            for (let i = 0; i < order.orderItems.length; i++) {
                const item = order.orderItems[i];
                const itemTotal = (item.price ?? 0) * (item.quantity ?? 0);
                subtotal += itemTotal;
                const colorName = item.color || 'N/A';

                doc.text(item.name ?? 'N/A', itemColumnX, y);
                doc.text((item.quantity ?? 0).toString(), quantityColumnX, y);
                doc.text(colorName, colorColumnX, y); // Display color name
                doc.text(`${item.price ?? 0}/-`, unitPriceColumnX, y);
                doc.text(`${itemTotal}/-`, totalColumnX, y);
                y += 20;
            }
            doc.moveDown();

            // Totals
            doc.fontSize(12).text(`Subtotal: ${subtotal}/-`, 350);
            doc.fontSize(12).text(`Shipping: ${order.shippingPrice ?? 0}/-`, 350);
            doc.fontSize(14).text(`Total Amount: ${order.totalPrice ?? 0}/-`, 350);

            doc.end();
        } catch (error) {
            console.error('Error generating Invoice:', error);
            reject(error);
        }
    });
}