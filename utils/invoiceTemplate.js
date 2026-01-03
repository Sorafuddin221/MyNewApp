
export const getInvoiceHTML = (order, settings) => {
    const { _id, createdAt, shippingInfo, orderItems, user, itemPrice, taxPrice, shippingPrice, totalPrice, paymentInfo } = order;

    const modernDate = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
                background-color: #f9f9f9;
            }
            .container {
                max-width: 800px;
                margin: auto;
                background: #fff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #eee;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .header h1 {
                font-size: 2.5em;
                margin: 0;
                color: #2c3e50;
            }
            .header .invoice-details {
                text-align: right;
            }
            .header .invoice-details p {
                margin: 5px 0;
                font-size: 0.9em;
                color: #7f8c8d;
            }
            .billing-info {
                margin-bottom: 30px;
            }
            .billing-info h2 {
                font-size: 1.5em;
                margin-bottom: 15px;
                color: #34495e;
                border-bottom: 1px solid #ecf0f1;
                padding-bottom: 10px;
            }
            .billing-info p {
                margin: 4px 0;
                line-height: 1.6;
            }
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            .items-table th, .items-table td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            .items-table th {
                background-color: #f2f2f2;
                font-weight: 600;
                color: #34495e;
            }
            .items-table tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            .totals {
                margin-top: 30px;
                text-align: right;
            }
            .totals p {
                margin: 8px 0;
                font-size: 1.1em;
            }
            .totals .grand-total {
                font-size: 1.4em;
                font-weight: bold;
                color: #2c3e50;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 0.9em;
                color: #95a5a6;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="company-details">
                    ${settings.siteLogoUrl ? `<img src="${settings.siteLogoUrl}" alt="YaMart BD" style="max-height: 80px; margin-bottom: 10px;">` : ''}
                    <p>${settings.siteTitle}</p>
                    <p>123 Main St, Anytown, USA 12345</p>
                </div>
                <h1>Invoice</h1>
                <div class="invoice-details">
                    <p><strong>Invoice ID:</strong> #${_id}</p>
                    <p><strong>Invoice Date:</strong> ${modernDate}</p>
                    <p><strong>Payment Status:</strong> ${paymentInfo?.status === 'succeeded' ? 'Paid' : 'Unpaid'}</p>
                </div>
            </div>
            <div class="billing-info">
                <h2>Bill To</h2>
                <p><strong>Name:</strong> ${user?.name}</p>
                <p><strong>Address:</strong> ${shippingInfo?.address}, ${shippingInfo?.city}, ${shippingInfo?.state} - ${shippingInfo?.pinCode}</p>
                <p><strong>Country:</strong> ${shippingInfo?.Country}</p>
                <p><strong>Phone:</strong> ${shippingInfo?.phoneNo}</p>
            </div>
            <h2>Items</h2>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Color</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderItems.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>${item.color || 'N/A'}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>$${(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="totals">
                <p><strong>Subtotal:</strong> $${itemPrice.toFixed(2)}</p>
                <p><strong>Tax:</strong> $${taxPrice.toFixed(2)}</p>
                <p><strong>Shipping:</strong> $${shippingPrice.toFixed(2)}</p>
                <p class="grand-total"><strong>Total:</strong> $${totalPrice.toFixed(2)}</p>
            </div>
            <div class="footer">
                <p>Thank you for your business!</p>
            </div>
        </div>
    </body>
    </html>
    `;
};
