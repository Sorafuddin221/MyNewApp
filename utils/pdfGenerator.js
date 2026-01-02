import chromium from '@sparticuz/chromium';
import html_to_pdf from 'html-pdf-node';
import { getPackingSlipHTML } from './packingSlipTemplate';
import { getInvoiceHTML } from './invoiceTemplate';

async function generatePdf(htmlContent) {
    let file = { content: htmlContent };

    // These are the recommended arguments for serverless environments
    const chromiumArgs = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--single-process',
        '--no-zygote',
        '--disable-gpu',
        '--hide-scrollbars',
        '--disable-web-security',
        '--disable-dev-shm-usage',
        '--disable-features=site-per-process',
        '--disable-speech-api',
        '--disable-webrtc',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-cast',
        '--disable-cloud-import',
        '--disable-popup-blocking',
        '--disable-session-crashed-bubble',
        '--disable-component-update',
        '--disable-default-apps',
        '--disable-domain-reliability',
        '--disable-field-trial-config',
        '--disable-hang-monitor',
        '--disable-ipc-flooding-protection',
        '--disable-notifications',
        '--disable-offer-store-unmasked-wallet-cards',
        '--disable-print-preview',
        '--disable-reloader-for-per-site-ct-stack-filtering',
        '--disable-tab-for-desktop-share',
        '--disable-translate',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-extensions',
        '--disable-logging',
        '--log-level=3',
    ];

    let pdfOptions = {
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px'
        },
        args: chromiumArgs,
        executablePath: await chromium.executablePath(),
        headless: 'new', // Use 'new' headless mode
        ignoreHTTPSErrors: true,
    };
    
    // Add logging to see what html-pdf-node will use
    console.log("PDF Generator Launch Options (html-pdf-node):", {
        executablePath: pdfOptions.executablePath,
        args: pdfOptions.args,
        headless: pdfOptions.headless,
    });

    try {
        const pdfBuffer = await html_to_pdf.generatePdf(file, pdfOptions);
        return pdfBuffer;
    } catch (error) {
        console.error('Error generating PDF with html-pdf-node:', error);
        throw new Error('Could not generate PDF.');
    }
}

export async function generatePackingSlipPdf(order, settings) {
    const htmlContent = getPackingSlipHTML(order, settings);
    return await generatePdf(htmlContent);
}

export async function generateInvoicePdf(order, settings) {
    const htmlContent = getInvoiceHTML(order, settings);
    return await generatePdf(htmlContent);
}