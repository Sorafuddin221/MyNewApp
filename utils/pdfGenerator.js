import { getPackingSlipHTML } from './packingSlipTemplate';
import { getInvoiceHTML } from './invoiceTemplate';

async function generatePdf(htmlContent) {
    let browser;
    try {
        let puppeteer;
        let launchOptions = {};

        if (process.env.NODE_ENV === 'production') {
            puppeteer = require('puppeteer-core');
            const chromium = require('@sparticuz/chromium');
            
            // A more robust set of arguments for serverless environments
            const minimal_args = [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--single-process',
                '--no-zygote',
                '--disable-gpu',
                '--hide-scrollbars',
                '--disable-web-security',
                '--autoplay-policy=user-gesture-required',
                '--disable-background-networking',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-breakpad',
                '--disable-client-side-phishing-detection',
                '--disable-component-update',
                '--disable-default-apps',
                '--disable-domain-reliability',
                '--disable-extensions',
                '--disable-features=AudioServiceOutOfProcess',
                '--disable-hang-monitor',
                '--disable-ipc-flooding-protection',
                '--disable-notifications',
                '--disable-offer-store-unmasked-wallet-cards',
                '--disable-popup-blocking',
                '--disable-print-preview',
                '--disable-prompt-on-repost',
                '--disable-renderer-backgrounding',
                '--disable-speech-api',
                '--disable-sync'
            ];
            
            console.log("Attempting to get Chromium executable path...");
            const executablePath = await chromium.executablePath();
            console.log("Chromium executable path:", executablePath);

            launchOptions = {
                args: minimal_args,
                executablePath: executablePath,
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

        console.log("Launching browser...");
        browser = await puppeteer.launch(launchOptions);
        console.log("Browser launched successfully.");

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