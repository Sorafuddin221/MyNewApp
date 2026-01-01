
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { getPackingSlipHTML } from './packingSlipTemplate';
import { getInvoiceHTML } from './invoiceTemplate';

// Function to get Chrome executable path for Windows development
const getWindowsChromeExecutablePath = () => {
    // Only attempt to require 'fs' if on a platform that might use it
    if (typeof window === 'undefined' && process.platform === 'win32') {
        const fs = require('fs');
        const windowsPaths = [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        ];
        for (const path of windowsPaths) {
            if (fs.existsSync(path)) {
                return path;
            }
        }
    }
    return null;
};

async function generatePdf(htmlContent) {
    let browser;
    let launchOptions = {}; // Initialize as empty

    if (process.env.NODE_ENV === 'development') {
        const localChromePath = getWindowsChromeExecutablePath();
        if (localChromePath) {
            launchOptions = {
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                executablePath: localChromePath,
                headless: true,
            };
        } else {
            console.log('Local Chrome not found, falling back to @sparticuz/chromium for development.');
            launchOptions = {
                args: [...chromium.args, '--hide-scrollbars', '--disable-web-security', '--disable-dev-shm-usage'],
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
            };
        }
    } else { // Production or other non-development environments (like Vercel)
        launchOptions = {
            args: [
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
            ],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: 'new', // Explicitly set to 'new' headless mode
            ignoreHTTPSErrors: true,
        };
    }

    console.log("PDF Generator Launch Options:", {
        nodeEnv: process.env.NODE_ENV,
        platform: process.platform,
        executablePath: launchOptions.executablePath,
        args: launchOptions.args,
        headless: launchOptions.headless,
    });

    try {
        browser = await puppeteer.launch(launchOptions);

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