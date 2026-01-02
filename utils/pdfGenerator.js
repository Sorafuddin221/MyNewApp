import { getPackingSlipHTML } from './packingSlipTemplate';
import { getInvoiceHTML } from './invoiceTemplate';

async function generatePdf(htmlContent) {
    let browser;
    try {
        let puppeteer;
        let launchOptions = {};

        // Check if we are in a production (serverless) environment
        if (process.env.NODE_ENV === 'production') {
            puppeteer = require('puppeteer-core');
            const chromium = require('@sparticuz/chromium');
            
            launchOptions = {
                args: chromium.args,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
            };
        } else {
            // Use the full puppeteer package for local development
            puppeteer = require('puppeteer');
            launchOptions = {
                headless: true
            };
        }

        browser = await puppeteer.launch(launchOptions);

        const page = await browser.newPage();
        
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0'
        });
        
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
        console.error('Error generating PDF with puppeteer:', error);
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