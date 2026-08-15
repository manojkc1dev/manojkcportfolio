# BACKUP STRATEGY

**Date:** 2024-08-08  
**Status:** Documented - Implementation Pending

---

## BACKUP REQUIREMENTS

### Database Backups

**Frequency:**
- Daily automated backups at 2:00 AM UTC
- Weekly full backups on Sunday
- Manual backup before major changes

**Retention:**
- Daily backups: 7 days
- Weekly backups: 4 weeks
- Monthly backups: 12 months

**Backup Method:**
```bash
# PostgreSQL backup using pg_dump
docker-compose exec -T db pg_dump -U portfolio_user portfolio_cms > backup_$(date +%Y%m%d).sql

# Compressed backup
docker-compose exec -T db pg_dump -U portfolio_user portfolio_cms | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Media Backups

**Frequency:** Daily automated backups

**Backup Method:**
```bash
# Backup media directory
tar -czf media_backup_$(date +%Y%m%d).tar.gz backend/media/
```

### Code Backups

**Method:** Git version control
- All code changes committed to Git
- Remote repository backup (GitHub/GitLab)
- Branch strategy: main, develop, feature branches

---

## BACKUP STORAGE

### Local Storage

**Location:** `/backups/`
- Database backups: `/backups/database/`
- Media backups: `/backups/media/`
- Code backups: Git repository

### Remote Storage (Recommended)

**Options:**
- AWS S3 with lifecycle policies
- Google Cloud Storage
- Azure Blob Storage
- Backblaze B2

**Configuration Example (AWS S3):**
```bash
# Install AWS CLI
pip install awscli

# Configure AWS credentials
aws configure

# Upload backup to S3
aws s3 cp backup_$(date +%Y%m%d).sql.gz s3://portfolio-cms-backups/database/
```

---

## RESTORE PROCEDURES

### Database Restore

```bash
# Stop application
docker-compose stop backend

# Restore from backup
gunzip < backup_20240808.sql.gz | docker-compose exec -T db psql -U portfolio_user portfolio_cms

# Restart application
docker-compose start backend
```

### Media Restore

```bash
# Extract media backup
tar -xzf media_backup_20240808.tar.gz

# Restore to media directory
cp -r media/* backend/media/
```

### Code Restore

```bash
# Restore from Git
git checkout <commit-hash>

# Or restore from specific branch
git checkout main
```

---

## AUTOMATION

### Cron Jobs

```cron
# Daily database backup at 2:00 AM UTC
0 2 * * * cd /path/to/portfolio-cms && docker-compose exec -T db pg_dump -U portfolio_user portfolio_cms | gzip > /backups/database/backup_$(date +\%Y\%m\%d).sql.gz

# Daily media backup at 3:00 AM UTC
0 3 * * * cd /path/to/portfolio-cms && tar -czf /backups/media/media_backup_$(date +\%Y\%m\%d).tar.gz backend/media/

# Cleanup old backups (older than 7 days)
0 4 * * * find /backups/database/ -name "backup_*.sql.gz" -mtime +7 -delete
0 4 * * * find /backups/media/ -name "media_backup_*.tar.gz" -mtime +7 -delete
```

### Docker Compose Backup Service

```yaml
backup:
  image: postgres:15-alpine
  volumes:
    - ./backups:/backups
    - postgres_data:/var/lib/postgresql/data
  depends_on:
    - db
  command: >
    sh -c "pg_dump -U portfolio_user -h db portfolio_cms | gzip > /backups/backup_$(date +%Y%m%d_%H%M%S).sql.gz"
```

---

## MONITORING

### Backup Verification

**Daily Checks:**
- Verify backup files exist
- Check backup file sizes
- Test restore procedure weekly

**Alerts:**
- Email notification on backup failure
- Slack notification for critical failures
- Monitoring dashboard for backup status

---

## DISASTER RECOVERY

### Recovery Time Objective (RTO): 4 hours
### Recovery Point Objective (RPO): 24 hours

### Disaster Recovery Plan

1. **Assess Impact:** Determine scope of data loss
2. **Identify Backup:** Locate most recent valid backup
3. **Restore Database:** Follow database restore procedure
4. **Restore Media:** Follow media restore procedure
5. **Verify Application:** Test all critical functionality
6. **Monitor:** Monitor for issues for 24 hours

---

## SECURITY

### Backup Encryption

**Method:** GPG encryption for sensitive backups

```bash
# Encrypt backup
gpg --symmetric --cipher-algo AES256 backup_20240808.sql.gz

# Decrypt backup
gpg --decrypt backup_20240808.sql.gz.gpg > backup_20240808.sql.gz
```

### Access Control

- Backup storage: Restricted access
- Encryption keys: Secure key management
- Backup logs: Audit trail

---

**Documented:** 2024-08-08  
**Status:** Strategy Documented - Implementation Pending
