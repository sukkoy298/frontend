import { chromium } from 'playwright';

export async function GET() {
    try {
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            ignoreHTTPSErrors: true,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });

        const page = await context.newPage();

        await page.goto('https://bcv.org.ve', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForSelector('#dolar', { timeout: 30000 });

        const priceText = await page.$eval('#dolar .centrado strong', el => el.textContent?.trim() || '');

        await browser.close();

        const cleanPrice = priceText.replace(',', '.');
        const price = parseFloat(cleanPrice);

        if (isNaN(price)) {
            return new Response(JSON.stringify({ error: 'No se pudo parsear el precio' }), { status: 500 });
        }

        return new Response(JSON.stringify({ price }));

    } catch (error) {
        console.error('Error al obtener el precio:', error);
        return new Response(JSON.stringify({ error: 'Error al obtener el precio del BCV' }), { status: 500 });
    }
}