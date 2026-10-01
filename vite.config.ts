/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

import fs from 'fs';

interface StoredMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  projectId?: string;
  projectTitle?: string;
  sourcePage?: string;
  createdAt: string;
  read: boolean;
  replied: boolean;
}

const dataDir = path.resolve(__dirname, '.data');
const messagesFile = path.join(dataDir, 'messages.json');

function getDefaultSeedMessages(): StoredMessage[] {
  const now = Date.now();
  return [
    {
      id: 'msg-seed-1',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@techfin.np',
      message: 'Hi Manoj, I reviewed your Django REST API and Hospital Management portfolio project. We are looking for a Senior Django Backend Engineer for our fintech team in Kathmandu (hybrid/remote). Would you be open for an introductory call this week?',
      createdAt: new Date(now - 3600000 * 3).toISOString(),
      read: false,
      replied: false,
    },
    {
      id: 'msg-seed-2',
      name: 'Sophia Martinez',
      email: 'sophia@cloudscale.io',
      message: 'Hello Manoj! We are migrating a monolithic service to Python 3.12, Django REST Framework, Celery workers, and Redis caching. Are you available for a 3-month contract consulting engagement?',
      createdAt: new Date(now - 3600000 * 20).toISOString(),
      read: true,
      replied: false,
    },
    {
      id: 'msg-seed-3',
      name: 'Bikash Thapa',
      email: 'bthapa@innovate.com.np',
      message: 'Namaste Manoj dai! Impressed by your clean architecture and Postgres query optimization case studies. We have an e-learning platform experiencing high concurrency bottlenecks. Let us know your availability for a technical audit.',
      createdAt: new Date(now - 3600000 * 42).toISOString(),
      read: false,
      replied: false,
    },
  ];
}

function getStoredMessages(): StoredMessage[] {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(messagesFile)) {
      const initial = getDefaultSeedMessages();
      fs.writeFileSync(messagesFile, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const content = fs.readFileSync(messagesFile, 'utf-8');
    const parsed = JSON.parse(content || '[]');
    if (!Array.isArray(parsed)) {
      const initial = getDefaultSeedMessages();
      fs.writeFileSync(messagesFile, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    return parsed;
  } catch (err) {
    console.error('Error accessing messages file:', err);
    return [];
  }
}

function saveStoredMessages(list: StoredMessage[]): void {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(messagesFile, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving messages file:', err);
  }
}

const contactApiPlugin = (): Plugin => ({
  name: 'contact-api-handler',
  configureServer(server) {
    // 1. Submit contact message (/api/contact)
    server.middlewares.use('/api/contact', (req, res) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const data = JSON.parse(body || '{}');

            // Honeypot detection
            if (data.hp_field || data._gotcha || data._hp) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Spam detected' }));
              return;
            }

            // Validation
            const name = typeof data.name === 'string' ? data.name.trim() : '';
            const email = typeof data.email === 'string' ? data.email.trim() : '';
            const message = typeof data.message === 'string' ? data.message.trim() : '';

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!name || !email || !emailRegex.test(email) || message.length < 10 || message.length > 2000) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Validation failed. Ensure name, valid email, and message (10-2000 chars) are provided.' }));
              return;
            }

            const newMsg: StoredMessage = {
              id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              name,
              email,
              message,
              projectId: typeof data.projectId === 'string' ? data.projectId.trim() : undefined,
              projectTitle: typeof data.projectTitle === 'string' ? data.projectTitle.trim() : undefined,
              sourcePage: typeof data.sourcePage === 'string' ? data.sourcePage.trim() : undefined,
              createdAt: new Date().toISOString(),
              read: false,
              replied: false,
            };

            const list = getStoredMessages();
            list.unshift(newMsg);
            saveStoredMessages(list);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                message: "Thanks! I'll get back to you within 24 hours.",
                data: newMsg,
              })
            );
          } catch {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
          }
        });
      } else {
        res.statusCode = 405;
        res.end();
      }
    });

    // 2. Fetch and manage messages (/api/messages)
    server.middlewares.use('/api/messages', (req, res) => {
      res.setHeader('Content-Type', 'application/json');

      if (req.method === 'GET') {
        const list = getStoredMessages();
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, messages: list }));
        return;
      }

      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const data = JSON.parse(body || '{}');

            // Reset/Seed sample messages
            if (data.action === 'seed' || data.action === 'reset') {
              const fresh = getDefaultSeedMessages();
              saveStoredMessages(fresh);
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, messages: fresh }));
              return;
            }

            // Add custom message if provided
            if (data.name && data.email) {
              const testMsg: StoredMessage = {
                id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                name: data.name,
                email: data.email,
                message: data.message || 'New contact inquiry.',
                createdAt: new Date().toISOString(),
                read: false,
                replied: false,
              };
              const list = getStoredMessages();
              list.unshift(testMsg);
              saveStoredMessages(list);
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, message: testMsg, messages: list }));
              return;
            }

            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Missing name or email' }));
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
          }
        });
        return;
      }

      if (req.method === 'PATCH') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const data = JSON.parse(body || '{}');
            const list = getStoredMessages();
            const target = list.find((m) => m.id === data.id);
            if (!target) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Message not found' }));
              return;
            }

            if (typeof data.read === 'boolean') target.read = data.read;
            if (typeof data.replied === 'boolean') target.replied = data.replied;
            saveStoredMessages(list);

            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, message: target, messages: list }));
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
          }
        });
        return;
      }

      if (req.method === 'DELETE') {
        const url = new URL(req.url || '', 'http://localhost');
        const queryId = url.searchParams.get('id');

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            let targetId = queryId;
            if (!targetId && body) {
              const data = JSON.parse(body);
              targetId = data.id;
            }

            if (!targetId) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing id to delete' }));
              return;
            }

            let list = getStoredMessages();
            list = list.filter((m) => m.id !== targetId);
            saveStoredMessages(list);

            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, deletedId: targetId, messages: list }));
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
          }
        });
        return;
      }

      res.statusCode = 405;
      res.end();
    });

    // 3. Upload and manage local resume file (/api/upload-resume)
    const resumeMetaFile = path.join(dataDir, 'resume-meta.json');
    const resumeBinaryFile = path.join(dataDir, 'resume-file.bin');

    server.middlewares.use('/api/upload-resume', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store');

      if (req.method === 'GET') {
        try {
          if (fs.existsSync(resumeMetaFile)) {
            const meta = JSON.parse(fs.readFileSync(resumeMetaFile, 'utf-8') || '{}');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, hasFile: true, meta }));
            return;
          }
        } catch (e) {
          console.error('Error reading resume meta:', e);
        }
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, hasFile: false }));
        return;
      }

      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const data = JSON.parse(body || '{}');
            const { fileName, mimeType, fileData, size, isActive } = data;

            if (!fileName || !fileData) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing fileName or fileData' }));
              return;
            }

            if (!fs.existsSync(dataDir)) {
              fs.mkdirSync(dataDir, { recursive: true });
            }

            // Extract base64 part if formatted as data URL
            let base64Content = fileData;
            if (fileData.includes(';base64,')) {
              base64Content = fileData.split(';base64,')[1];
            }

            const buffer = Buffer.from(base64Content, 'base64');
            fs.writeFileSync(resumeBinaryFile, buffer);

            const meta = {
              fileName: fileName.trim(),
              mimeType: mimeType || 'application/pdf',
              size: size || buffer.length,
              uploadedAt: new Date().toISOString(),
              isActive: isActive ?? true,
              url: '/api/active-resume',
            };

            fs.writeFileSync(resumeMetaFile, JSON.stringify(meta, null, 2), 'utf-8');

            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, meta }));
          } catch (err) {
            console.error('Error uploading resume:', err);
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Failed to process resume upload' }));
          }
        });
        return;
      }

      if (req.method === 'DELETE') {
        try {
          if (fs.existsSync(resumeMetaFile)) fs.unlinkSync(resumeMetaFile);
          if (fs.existsSync(resumeBinaryFile)) fs.unlinkSync(resumeBinaryFile);
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, message: 'Uploaded resume removed' }));
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Failed to remove resume' }));
        }
        return;
      }

      res.statusCode = 405;
      res.end();
    });

    // 4. Download active uploaded resume (/api/active-resume)
    server.middlewares.use('/api/active-resume', (req, res) => {
      try {
        if (fs.existsSync(resumeMetaFile) && fs.existsSync(resumeBinaryFile)) {
          const meta = JSON.parse(fs.readFileSync(resumeMetaFile, 'utf-8') || '{}');
          const fileBuffer = fs.readFileSync(resumeBinaryFile);

          res.setHeader('Content-Type', meta.mimeType || 'application/octet-stream');
          res.setHeader(
            'Content-Disposition',
            `attachment; filename="${encodeURIComponent(meta.fileName || 'Manoj_KC_Resume.pdf')}"`
          );
          res.setHeader('Content-Length', fileBuffer.length);
          res.statusCode = 200;
          res.end(fileBuffer);
          return;
        }
      } catch (err) {
        console.error('Error serving active resume:', err);
      }

      // If no custom upload, redirect to /resume.pdf
      res.statusCode = 302;
      res.setHeader('Location', '/resume.pdf');
      res.end();
    });

    // 5. Explicit download sitemap endpoint (/api/download-sitemap)
    server.middlewares.use('/api/download-sitemap', (req, res) => {
      try {
        const sitemapPath = path.resolve(__dirname, 'public/sitemap.xml');
        if (fs.existsSync(sitemapPath)) {
          const sitemapContent = fs.readFileSync(sitemapPath);
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.setHeader('Content-Disposition', 'attachment; filename="sitemap.xml"');
          res.setHeader('Content-Length', sitemapContent.length);
          res.statusCode = 200;
          res.end(sitemapContent);
          return;
        }
      } catch (err) {
        console.error('Error serving sitemap download:', err);
      }
      res.statusCode = 404;
      res.end('Sitemap not found');
    });
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), contactApiPlugin()],
    optimizeDeps: {
      include: ['docx', 'mammoth', 'pdf-parse', 'mermaid'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.ts',
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: true,
    },
  };
});
