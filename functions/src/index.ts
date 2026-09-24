import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Export v2 Cloud Functions
export { contact } from './contact.js';
export { sitemap } from './sitemap.js';
export { robots } from './robots.js';
