
import puppeteer from 'puppeteer';
import { getPackingSlipHTML } from './packingSlipTemplate';
import { getInvoiceHTML } from './invoiceTemplate';

async function generatePdf(htmlContent) {
    let browser;
    try {
        const chromium = require('chrome-aws-lambda'); // Import chrome-aws-lambda

        browser = await chromium.puppeteer.launch({ // Use chromium.puppeteer
            args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'], // Add necessary args
            executablePath: await chromium.executablePath, // Set executablePath
            headless: chromium.headless, // Use chromium.headless
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });
        return pdfBuffer;
    } catch (error) {
        console.error('Error generating PDF with Puppeteer:', error);
        throw new Error('Could not generate PDF.');
    } finally {
        if (browser) {
            await browser.close();
        }
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