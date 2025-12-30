
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { getPackingSlipHTML } from './packingSlipTemplate';
import { getInvoiceHTML } from './invoiceTemplate';

async function generatePdf(htmlContent) {
    let browser;

    const getLaunchOptions = async () => {
        // For local development, use the installed Chrome browser.
        if (process.env.NODE_ENV === 'development') {
            const fs = require('fs');
            const windowsPaths = [
                'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            ];

            for (const path of windowsPaths) {
                if (fs.existsSync(path)) {
                    return {
                        args: ['--no-sandbox', '--disable-setuid-sandbox'],
                        executablePath: path,
                        headless: true,
                    };
                }
            }
        }
        
        // For production or if local chrome is not found, use the serverless-optimized chromium.
        return {
            args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        };
    };

    try {
        const options = await getLaunchOptions();
        browser = await puppeteer.launch(options);

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