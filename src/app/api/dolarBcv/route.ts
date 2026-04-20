import * as cheerio from 'cheerio';
import https from 'https';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const html = await new Promise<string>((resolve, reject) => {
            https.get('https://www.bcv.org.ve/', { rejectUnauthorized: false }, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => resolve(data));
            }).on('error', reject);
        });

        const $ = cheerio.load(html);
        const priceText = $('#dolar .centrado strong').text().trim();
        
        if (!priceText) {
            return NextResponse.json({ error: 'No se pudo encontrar el contenedor de precio' }, { status: 500 });
        }

        const cleanPrice = priceText.replace(',', '.');
        const price = parseFloat(cleanPrice);

        if (isNaN(price)) {
            return NextResponse.json({ error: 'No se pudo parsear el precio' }, { status: 500 });
        }

        return NextResponse.json({ price });

    } catch (error) {
        console.error('Error al obtener el precio del BCV:', error);
        return NextResponse.json({ error: 'Error al obtener el precio del BCV' }, { status: 500 });
    }
}