
import chromium from '@sparticuz/chromium';
import html_to_pdf from 'html-pdf-node';
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
    let file = { content: htmlContent };

    let pdfOptions = {
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px'
        },
        args: [], // Will be populated with aggressive arguments
        executablePath: '', // Will be populated from chromium.executablePath() or local Chrome
        headless: 'new', // Default to new headless mode
        ignoreHTTPSErrors: true,
    };

    // Determine Puppeteer launch options for html-pdf-node
    if (process.env.NODE_ENV === 'development') {
        const localChromePath = getWindowsChromeExecutablePath();
        if (localChromePath) {
            pdfOptions.executablePath = localChromePath;
            pdfOptions.args = ['--no-sandbox', '--disable-setuid-sandbox'];
            pdfOptions.headless = true; // Use boolean headless for local
        } else {
            console.log('Local Chrome not found, falling back to @sparticuz/chromium for development.');
            pdfOptions.args = [...chromium.args, '--hide-scrollbars', '--disable-web-security', '--disable-dev-shm-usage'];
            pdfOptions.executablePath = await chromium.executablePath();
            pdfOptions.headless = chromium.headless;
        }
    } else { // Production or other non-development environments (like Vercel)
        pdfOptions.args = [
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
        pdfOptions.executablePath = await chromium.executablePath();
        pdfOptions.headless = 'new';
    }

    // Add logging to see what html-pdf-node will use
    console.log("PDF Generator Launch Options (html-pdf-node):", {
        nodeEnv: process.env.NODE_ENV,
        platform: process.platform,
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