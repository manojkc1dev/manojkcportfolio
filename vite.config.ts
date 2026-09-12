import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

function devApiPlugin(): Plugin {
  return {
    name: 'dev-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];

        if (url === '/api/health') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok', service: 'manojkc-portfolio', timestamp: new Date().toISOString() }));
          return;
        }

        if (url === '/robots.txt') {
          res.setHeader('Content-Type', 'text/plain');
          res.end(`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://manojkc1.com.np/sitemap.xml\nSitemap: https://manojkc1.com.np/sitemap-images.xml`);
          return;
        }

        if (url === '/sitemap.xml') {
          res.setHeader('Content-Type', 'application/xml');
          res.end(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://manojkc1.com.np/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://manojkc1.com.np/#about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://manojkc1.com.np/#projects</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://manojkc1.com.np/#tech-stack</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://manojkc1.com.np/#contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`);
          return;
        }

        if (url === '/sitemap-images.xml') {
          res.setHeader('Content-Type', 'application/xml');
          res.end(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://manojkc1.com.np/</loc>
    <image:image>
      <image:loc>https://manojkc1.com.np/static/images/manoj-kc-python-backend-developer.jpg</image:loc>
      <image:title>Manoj K.C. - Python and Django Backend Developer</image:title>
    </image:image>
    <image:image>
      <image:loc>https://manojkc1.com.np/static/images/calcpro-django-rest-api-calculator.png</image:loc>
      <image:title>CalcPro Calculator - Python Django &amp; React</image:title>
    </image:image>
    <image:image>
      <image:loc>https://manojkc1.com.np/static/images/shabdhabhandar-django-rest-api-calculator.png</image:loc>
      <image:title>Shabdhabhandar Dictionary - Python Django &amp; SQLite</image:title>
    </image:image>
  </url>
</urlset>`);
          return;
        }

        if (url === '/api/chat/message' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { message } = JSON.parse(body || '{}');

              if (!message || typeof message !== 'string') {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Message is required' }));
                return;
              }

              // Safeguard: Truncate input message to 500 characters
              const sanitizedMessage = message.slice(0, 500).trim();

              // Fallback dictionary for common FAQs to save API calls
              const lowerMsg = sanitizedMessage.toLowerCase();
              if (lowerMsg.includes('stack') || lowerMsg.includes('skill')) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  reply: "Manoj's core backend stack includes Python, Django, Django REST Framework (DRF), and PostgreSQL. He also works with FastAPI, SQLite, JWT Authentication, and REST APIs.",
                  source: 'cache'
                }));
                return;
              }

              if (lowerMsg.includes('contact') || lowerMsg.includes('email') || lowerMsg.includes('phone') || lowerMsg.includes('whatsapp')) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  reply: "You can reach Manoj via email at manojkc1dev@gmail.com, WhatsApp at +977-9809807760, or LinkedIn at linkedin.com/in/manojkc1.",
                  source: 'cache'
                }));
                return;
              }

              const apiKey = process.env.GEMINI_API_KEY;
              if (!apiKey) {
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    reply:
                      "Hi! I'm Manoj K.C.'s AI portfolio assistant. Manoj is a Python and Django Backend Developer based in Kathmandu, Nepal (graduated with a BIT degree in 2025). He specializes in Django REST Framework, PostgreSQL, JWT Authentication, and scalable REST APIs. His featured projects are CalcPro Calculator and Shabdhabhandar Dictionary. You can reach him directly at manojkc1dev@gmail.com or on WhatsApp at +977-9809807760.",
                    source: 'fallback'
                  })
                );
                return;
              }

              const ai = new GoogleGenAI({ apiKey });
              const prompt = `You are the AI assistant for Manoj K.C.'s portfolio. Answer questions about his skills (Python, Django, DRF, PostgreSQL, JWT Auth, REST APIs, FastAPI), projects (CalcPro Calculator, Shabdhabhandar Dictionary), experience, and backend services. Be concise, friendly, and professional. If you don't know something, say so and suggest contacting him at manojkc1dev@gmail.com or WhatsApp +977-9809807760. Speak in third person about Manoj.\n\nUser Question: ${sanitizedMessage}\nAssistant:`;

              // 15-second timeout safeguard
              const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timed out after 15s')), 15000)
              );

              const apiPromise = ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: prompt,
                config: {
                  maxOutputTokens: 300,
                  temperature: 0.7,
                }
              });

              const response: any = await Promise.race([apiPromise, timeoutPromise]);

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                reply: response.text || 'Thank you for reaching out! Please email manojkc1dev@gmail.com or message +977-9809807760.',
                source: 'gemini-1.5-flash'
              }));
            } catch (err: unknown) {
              const errMsg = err instanceof Error ? err.message : 'Chat service temporarily unavailable';
              res.setHeader('Content-Type', 'application/json');
              // Graceful fallback on error
              res.end(JSON.stringify({
                reply: "Manoj K.C. is a Python and Django Backend Developer from Kathmandu, Nepal specializing in REST APIs, PostgreSQL, and JWT auth. For immediate response, reach out to manojkc1dev@gmail.com or WhatsApp +977-9809807760.",
                source: 'local_fallback',
                warning: errMsg
              }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), devApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
