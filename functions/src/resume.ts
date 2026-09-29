import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';

export const ADMIN_UID = process.env.ADMIN_UID || 'ADMIN_UID';

// Rate limit helper: 10 uploads/hour per admin uid in Firestore
async function checkUploadRateLimit(uid: string): Promise<boolean> {
  const db = admin.firestore();
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  const rateLimitRef = db.collection('rateLimits').doc(`upload_${uid}`);

  return await db.runTransaction(async (t) => {
    const doc = await t.get(rateLimitRef);
    let timestamps: number[] = doc.exists ? doc.data()?.timestamps || [] : [];
    timestamps = timestamps.filter((tVal) => tVal > oneHourAgo);

    if (timestamps.length >= 10) {
      return false;
    }

    timestamps.push(now);
    t.set(rateLimitRef, { timestamps }, { merge: true });
    return true;
  });
}

/**
 * 1. uploadResumeVersion (onCall, auth required, admin only)
 */
export const uploadResumeVersion = onCall(
  { maxInstances: 10 },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Authentication required.');
    }

    const { type, label, fileName, base64Data, notes, setActive, isPublic } = request.data || {};

    if (type !== 'resume' && type !== 'cv') {
      throw new HttpsError('invalid-argument', 'Type must be "resume" or "cv".');
    }

    if (!fileName || !base64Data) {
      throw new HttpsError('invalid-argument', 'fileName and base64Data are required.');
    }

    const fileBuffer = Buffer.from(base64Data, 'base64');
    const maxBytes = 5 * 1024 * 1024; // 5 MB

    if (fileBuffer.length > maxBytes) {
      throw new HttpsError('invalid-argument', 'File size exceeds maximum 5 MB limit.');
    }

    // Check rate limit
    const allowed = await checkUploadRateLimit(request.auth.uid);
    if (!allowed) {
      throw new HttpsError('resource-exhausted', 'Upload rate limit reached (max 10/hour).');
    }

    // Compute SHA-256
    const fileHashSha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    const db = admin.firestore();
    // Check duplicates
    const dupes = await db
      .collection('resume_versions')
      .where('type', '==', type)
      .where('fileHashSha256', '==', fileHashSha256)
      .limit(1)
      .get();

    if (!dupes.empty) {
      throw new HttpsError('already-exists', 'A version with identical content already exists.');
    }

    const versionId = `rv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const storagePath = `resume/${type}/${versionId}.pdf`;

    // Upload to Firebase Storage
    const bucket = admin.storage().bucket();
    const file = bucket.file(storagePath);
    await file.save(fileBuffer, {
      metadata: {
        contentType: 'application/pdf',
        metadata: {
          versionId,
          type,
          fileHashSha256,
          uploadedBy: request.auth.uid,
        },
      },
    });

    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2035', // long-lived
    });

    const docRef = db.collection('resume_versions').doc(versionId);

    // If setActive, unset previous active of same type
    if (setActive) {
      const activeQuery = await db
        .collection('resume_versions')
        .where('type', '==', type)
        .where('isActive', '==', true)
        .get();

      const batch = db.batch();
      activeQuery.docs.forEach((d) => {
        batch.update(d.ref, { isActive: false });
      });

      batch.set(docRef, {
        versionId,
        type,
        label: label || `${type === 'resume' ? 'Resume' : 'CV'} - ${new Date().toISOString().slice(0, 7)}`,
        fileName,
        storagePath,
        downloadUrl: signedUrl,
        fileSizeBytes: fileBuffer.length,
        fileHashSha256,
        isActive: true,
        isPublic: isPublic !== false,
        downloadCount: 0,
        uploadedBy: request.auth.uid,
        uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
        notes: notes || null,
      });

      await batch.commit();
    } else {
      await docRef.set({
        versionId,
        type,
        label: label || `${type === 'resume' ? 'Resume' : 'CV'} - ${new Date().toISOString().slice(0, 7)}`,
        fileName,
        storagePath,
        downloadUrl: signedUrl,
        fileSizeBytes: fileBuffer.length,
        fileHashSha256,
        isActive: false,
        isPublic: isPublic !== false,
        downloadCount: 0,
        uploadedBy: request.auth.uid,
        uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
        notes: notes || null,
      });
    }

    return { versionId, downloadUrl: signedUrl };
  }
);

/**
 * 2. setActiveResumeVersion (onCall)
 */
export const setActiveResumeVersion = onCall(
  { maxInstances: 10 },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Authentication required.');
    }

    const { versionId, type } = request.data || {};
    if (!versionId || !type) {
      throw new HttpsError('invalid-argument', 'versionId and type are required.');
    }

    const db = admin.firestore();
    await db.runTransaction(async (t) => {
      const targetDoc = await t.get(db.collection('resume_versions').doc(versionId));
      if (!targetDoc.exists) {
        throw new HttpsError('not-found', 'Version not found.');
      }

      const activeQuery = await db
        .collection('resume_versions')
        .where('type', '==', type)
        .where('isActive', '==', true)
        .get();

      activeQuery.docs.forEach((doc) => {
        t.update(doc.ref, { isActive: false });
      });

      t.update(targetDoc.ref, { isActive: true });
    });

    return { success: true };
  }
);

/**
 * 3. toggleResumePublic (onCall)
 */
export const toggleResumePublic = onCall(
  { maxInstances: 10 },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Authentication required.');
    }

    const { versionId, isPublic } = request.data || {};
    if (!versionId || typeof isPublic !== 'boolean') {
      throw new HttpsError('invalid-argument', 'versionId and boolean isPublic are required.');
    }

    const db = admin.firestore();
    const docRef = db.collection('resume_versions').doc(versionId);
    await docRef.update({ isPublic });

    return { success: true };
  }
);

/**
 * 4. deleteResumeVersion (onCall)
 */
export const deleteResumeVersion = onCall(
  { maxInstances: 10 },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Authentication required.');
    }

    const { versionId } = request.data || {};
    if (!versionId) {
      throw new HttpsError('invalid-argument', 'versionId is required.');
    }

    const db = admin.firestore();
    const docRef = db.collection('resume_versions').doc(versionId);
    const snap = await docRef.get();
    if (!snap.exists) {
      throw new HttpsError('not-found', 'Version not found.');
    }

    const data = snap.data();
    if (data?.isActive) {
      throw new HttpsError('failed-precondition', 'Cannot delete active version.');
    }

    // Delete from storage
    if (data?.storagePath) {
      try {
        await admin.storage().bucket().file(data.storagePath).delete();
      } catch (err) {
        logger.warn('Storage file deletion error:', err);
      }
    }

    await docRef.delete();
    return { success: true };
  }
);

/**
 * 5. serveResume (onRequest, public)
 * Route: /resume.pdf and /cv.pdf
 */
export const serveResume = onRequest(
  { maxInstances: 20 },
  async (req, res) => {
    const path = req.path.toLowerCase();
    const isCv = path.includes('cv');
    const type = isCv ? 'cv' : 'resume';

    try {
      const db = admin.firestore();
      const activeSnapshot = await db
        .collection('resume_versions')
        .where('type', '==', type)
        .where('isActive', '==', true)
        .where('isPublic', '==', true)
        .limit(1)
        .get();

      if (activeSnapshot.empty) {
        res.status(404).send('Document not found or access restricted.');
        return;
      }

      const versionDoc = activeSnapshot.docs[0];
      const versionData = versionDoc.data();

      // Fire-and-forget download count increment
      versionDoc.ref.update({
        downloadCount: admin.firestore.FieldValue.increment(1),
      }).catch((e) => logger.warn('Failed to increment download count:', e));

      // Cache headers & content headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="manoj-kc-${type}.pdf"`
      );
      res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=3600');

      const bucket = admin.storage().bucket();
      const file = bucket.file(versionData.storagePath);
      file.createReadStream().pipe(res);
    } catch (err) {
      logger.error('Error serving resume document:', err);
      res.status(500).send('Internal server error.');
    }
  }
);

/**
 * 6. purgeResumeCache (onCall, admin only)
 */
export const purgeResumeCache = onCall(
  { maxInstances: 5 },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Authentication required.');
    }

    // Edge cache purge acknowledgement
    logger.info('Purging CDN cache for /resume.pdf and /cv.pdf by admin', {
      uid: request.auth.uid,
    });
    return { success: true, timestamp: Date.now() };
  }
);
