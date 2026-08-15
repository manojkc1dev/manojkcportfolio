# Backup and Recovery Architecture

**Date:** 2026-08-15  
**Project:** Portfolio CMS  
**Status:** DOCUMENTED - IMPLEMENTATION PENDING

---

## Executive Summary

This document outlines the backup and recovery strategy for the Portfolio CMS application. The strategy covers database backups, media file backups, code backups, and disaster recovery procedures.

**Current Status:** Documentation complete, implementation pending automation.

---

## Backup Requirements

### Critical Data to Backup

1. **PostgreSQL Database** - All CMS content, user accounts, settings
2. **Media Files** - User uploads, images, documents
3. **Static Assets** - Generated static files (optional, can be regenerated)
4. **Environment Configuration** - .env files (secure storage required)
5. **Application Code** - Git repository (remote backup)

### Backup Frequency

| Data Type | Frequency | Retention | Method |
|-----------|-----------|-----------|--------|
| PostgreSQL Database | Daily | 30 days | pg_dump |
| PostgreSQL Database | Weekly | 90 days | pg_dump |
| Media Files | Daily | 30 days | rsync/tar |
| Media Files | Weekly | 90 days | rsync/tar |
| Application Code | Per commit | Indefinite | Git remote |

---

## Database Backup Strategy

### PostgreSQL Backup Method

**Tool:** `pg_dump`

**Daily Backup Command:**
```bash
# Full database backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F c -f /backups/db/daily/portfolio_$(date +%Y%m%d_%H%M%S).dump

# Compressed SQL dump
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F p -f /backups/db/daily/portfolio_$(date +%Y%m%d_%H%M%S).sql.gz --compress=9
```

**Weekly Backup Command:**
```bash
# Full database backup (long-term retention)
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F c -f /backups/db/weekly/portfolio_weekly_$(date +%Y%m%d).dump
```

**Environment Variables Required:**
```bash
DB_HOST=postgres
DB_PORT=5432
DB_USER=portfolio_user
DB_PASSWORD=secure_password
DB_NAME=portfolio_cms
```

### Database Restore Procedure

**Restore from compressed dump:**
```bash
pg_restore -h $DB_HOST -U $DB_USER -d $DB_NAME /backups/db/daily/portfolio_20240815_020000.dump
```

**Restore from SQL dump:**
```bash
gunzip -c /backups/db/daily/portfolio_20240815_020000.sql.gz | psql -h $DB_HOST -U $DB_USER -d $DB_NAME
```

**Restore to new database (for testing):**
```bash
createdb -h $DB_HOST -U $DB_USER portfolio_cms_restore
pg_restore -h $DB_HOST -U $DB_USER -d portfolio_cms_restore /backups/db/daily/portfolio_20240815_020000.dump
```

---

## Media File Backup Strategy

### Media Backup Method

**Tool:** `rsync` or `tar`

**Daily Backup Command (rsync):**
```bash
rsync -avz --delete /app/media/ /backups/media/daily/media_$(date +%Y%m%d)/
```

**Weekly Backup Command (tar):**
```bash
tar -czf /backups/media/weekly/media_weekly_$(date +%Y%m%d).tar.gz /app/media/
```

**Media Restore Procedure:**
```bash
# Restore from rsync backup
rsync -avz /backups/media/daily/media_20240815/ /app/media/

# Restore from tar backup
tar -xzf /backups/media/weekly/media_weekly_20240815.tar.gz -C /
```

---

## Application Code Backup

### Git Remote Backup

**Primary Remote:** GitHub/GitLab/Bitbucket

**Backup Procedure:**
```bash
# Push to remote
git push origin main

# Push all branches
git push --all origin

# Push tags
git push --tags origin
```

**Additional Backup:** Create mirror repository
```bash
git clone --mirror https://github.com/user/portfolio-cms.git /backups/code/portfolio-cms-mirror.git
```

---

## Environment Configuration Backup

### Secure Storage Required

**Never commit .env files to Git**

**Backup Method:** Encrypted storage

**Encrypt .env file:**
```bash
gpg --symmetric --cipher-algo AES256 .env
# Creates .env.gpg
```

**Decrypt .env file:**
```bash
gpg --decrypt .env.gpg > .env
```

**Store encrypted .env.gpg in secure location:**
- Password manager (1Password, LastPass, Bitwarden)
- Encrypted cloud storage (AWS S3 with KMS, Google Cloud Storage with encryption)
- Secure internal backup system

---

## Backup Storage Locations

### Local Storage

**Directory Structure:**
```
/backups/
├── db/
│   ├── daily/
│   │   ├── portfolio_20240815_020000.dump
│   │   ├── portfolio_20240816_020000.dump
│   │   └── ...
│   └── weekly/
│       ├── portfolio_weekly_20240815.dump
│       └── ...
├── media/
│   ├── daily/
│   │   ├── media_20240815/
│   │   ├── media_20240816/
│   │   └── ...
│   └── weekly/
│       ├── media_weekly_20240815.tar.gz
│       └── ...
└── code/
    └── portfolio-cms-mirror.git/
```

### Remote Storage (Recommended)

**Cloud Storage Options:**
- AWS S3 (with lifecycle policies for retention)
- Google Cloud Storage
- Azure Blob Storage
- Backblaze B2

**S3 Backup Script Example:**
```bash
# Upload database backup to S3
aws s3 cp /backups/db/daily/portfolio_$(date +%Y%m%d_%H%M%S).dump s3://portfolio-cms-backups/db/daily/

# Upload media backup to S3
aws s3 sync /backups/media/daily/media_$(date +%Y%m%d)/ s3://portfolio-cms-backups/media/daily/media_$(date +%Y%m%d)/
```

---

## Backup Automation

### Cron Job Configuration

**Daily Database Backup (2:00 AM):**
```cron
0 2 * * * pg_dump -h postgres -U portfolio_user -d portfolio_cms -F c -f /backups/db/daily/portfolio_$(date +\%Y\%m\%d_\%H\%M\%S).dump
```

**Daily Media Backup (3:00 AM):**
```cron
0 3 * * * rsync -avz --delete /app/media/ /backups/media/daily/media_$(date +\%Y\%m\%d)/
```

**Weekly Database Backup (Sunday 2:00 AM):**
```cron
0 2 * * 0 pg_dump -h postgres -U portfolio_user -d portfolio_cms -F c -f /backups/db/weekly/portfolio_weekly_$(date +\%Y\%m\%d).dump
```

**Weekly Media Backup (Sunday 3:00 AM):**
```cron
0 3 * * 0 tar -czf /backups/media/weekly/media_weekly_$(date +\%Y\%m\%d).tar.gz /app/media/
```

**Cleanup Old Backups (Daily 4:00 AM):**
```cron
0 4 * * * find /backups/db/daily/ -type f -mtime +30 -delete
0 4 * * * find /backups/media/daily/ -type d -mtime +30 -exec rm -rf {} +
```

### Docker Container Backup Script

**Create backup script:**
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
docker exec postgres pg_dump -U portfolio_user portfolio_cms > /backups/db/daily/portfolio_$DATE.sql

# Media backup
docker exec backend tar -czf - /app/media > /backups/media/daily/media_$DATE.tar.gz

# Upload to S3
aws s3 cp /backups/db/daily/portfolio_$DATE.sql s3://portfolio-cms-backups/db/daily/
aws s3 cp /backups/media/daily/media_$DATE.tar.gz s3://portfolio-cms-backups/media/daily/
```

**Make executable:**
```bash
chmod +x backup.sh
```

**Run via cron:**
```cron
0 2 * * * /path/to/backup.sh
```

---

## Disaster Recovery Procedures

### Scenario 1: Database Corruption

**Symptoms:** Application errors, data inconsistency, database won't start

**Recovery Steps:**
1. Stop application: `docker-compose down`
2. Identify last good backup
3. Restore database: `pg_restore -h postgres -U portfolio_user -d portfolio_cms /backups/db/daily/portfolio_latest.dump`
4. Verify data integrity
5. Start application: `docker-compose up -d`
6. Test critical functionality

### Scenario 2: Media File Loss

**Symptoms:** Missing images, broken uploads, 404 errors for media

**Recovery Steps:**
1. Stop application: `docker-compose down`
2. Restore media: `rsync -avz /backups/media/daily/media_latest/ /app/media/`
3. Verify file permissions
4. Start application: `docker-compose up -d`
5. Test media uploads and display

### Scenario 3: Complete Server Failure

**Symptoms:** Server inaccessible, hardware failure

**Recovery Steps:**
1. Provision new server
2. Install Docker and Docker Compose
3. Clone application code from Git
4. Restore environment configuration from secure storage
5. Start services: `docker-compose up -d`
6. Restore database from remote backup
7. Restore media from remote backup
8. Update DNS if needed
9. Test all functionality

### Scenario 4: Accidental Data Deletion

**Symptoms:** User reports missing data, incorrect content

**Recovery Steps:**
1. Identify when deletion occurred
2. Find backup from before deletion
3. Restore to temporary database
4. Export affected data
5. Import to production database
6. Verify data integrity

---

## Backup Verification

### Automated Verification

**Daily Verification Script:**
```bash
#!/bin/bash
# verify_backup.sh

# Check if backup file exists and is not empty
BACKUP_FILE="/backups/db/daily/portfolio_$(date +%Y%m%d)_020000.dump"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "ERROR: Backup file not found: $BACKUP_FILE"
    exit 1
fi

if [ ! -s "$BACKUP_FILE" ]; then
    echo "ERROR: Backup file is empty: $BACKUP_FILE"
    exit 1
fi

# Verify backup integrity
pg_restore --list "$BACKUP_FILE" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "SUCCESS: Backup verification passed"
else
    echo "ERROR: Backup verification failed"
    exit 1
fi
```

### Monthly Restore Test

**Procedure:**
1. Create test database
2. Restore latest backup to test database
3. Run data integrity checks
4. Test critical queries
5. Document results

---

## Security Considerations

### Backup Encryption

**Encrypt sensitive backups:**
```bash
gpg --symmetric --cipher-algo AES256 /backups/db/daily/portfolio_latest.dump
```

**Store encryption keys separately from backups**

### Access Control

**Backup directory permissions:**
```bash
chmod 700 /backups/
chmod 700 /backups/db/
chmod 700 /backups/media/
```

**Only allow backup user access**

### Audit Logging

**Log all backup operations:**
```bash
echo "$(date): Backup completed successfully" >> /var/log/backup.log
echo "$(date): Backup failed with error: $?" >> /var/log/backup.log
```

---

## Monitoring and Alerts

### Backup Status Monitoring

**Metrics to monitor:**
- Backup success/failure rate
- Backup file size trends
- Backup duration
- Storage space utilization

**Alert triggers:**
- Backup failure
- Backup file too small
- Storage space below threshold
- Backup duration exceeds threshold

### Monitoring Tools

**Options:**
- Prometheus + Grafana
- Datadog
- New Relic
- CloudWatch (AWS)
- Custom monitoring scripts

---

## Implementation Checklist

- [ ] Configure PostgreSQL backup script
- [ ] Configure media backup script
- [ ] Set up cron jobs for automated backups
- [ ] Configure remote storage (S3/GCS/Azure)
- [ ] Implement backup encryption
- [ ] Set up backup verification
- [ ] Configure monitoring and alerts
- [ ] Document disaster recovery procedures
- [ ] Test restore procedures
- [ ] Train team on recovery procedures

---

## Contact Information

**Primary Contact:** [Your Name]  
**Secondary Contact:** [Backup Administrator]  
**Emergency Contact:** [On-call Engineer]

---

**Last Updated:** 2026-08-15  
**Next Review:** 2026-09-15
