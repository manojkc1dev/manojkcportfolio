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
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = getDefaultSeedMessages();
      fs.writeFileSync(messagesFile, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    return parsed;
  } catch (err) {
    console.error('Error accessing messages file:', err);
    return getDefaultSeedMessages();
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

            // Add single test message
            if (data.action === 'test' || data.name) {
              const testMsg: StoredMessage = {
                id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                name: data.name || 'Prashant Joshi (Fintech Lead)',
                email: data.email || 'prashant.j@himalayantech.np',
                message: data.message || 'Hi Manoj, we need an experienced Django engineer to optimize our Celery async processing and PostgreSQL index tuning. Loved your portfolio and project structure!',
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
            res.end(JSON.stringify({ error: 'Unknown action' }));
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
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const data = JSON.parse(body || '{}');
            let list = getStoredMessages();
            list = list.filter((m) => m.id !== data.id);
            saveStoredMessages(list);

            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, messages: list }));
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
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), contactApiPlugin()],
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
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify: file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
