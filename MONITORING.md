# Monitoring and Alerting Architecture

**Date:** 2026-08-15  
**Project:** Portfolio CMS  
**Status:** DOCUMENTED - IMPLEMENTATION PENDING

---

## Executive Summary

This document outlines the monitoring and alerting strategy for the Portfolio CMS application. The strategy covers application monitoring, infrastructure monitoring, security monitoring, and operational alerting.

**Current Status:** Documentation complete, implementation pending integration with monitoring tools.

---

## Monitoring Requirements

### Critical Metrics to Monitor

1. **Application Health**
   - HTTP response times
   - Error rates (4xx, 5xx)
   - Request throughput
   - Database query performance
   - Cache hit rates

2. **Security Events**
   - Authentication failures
   - Authorization failures
   - Rate limit violations
   - Suspicious activity patterns
   - Failed login attempts

3. **Infrastructure Health**
   - Server CPU usage
   - Memory usage
   - Disk usage
   - Network latency
   - Container health

4. **Business Metrics**
   - User registrations
   - Content creation rates
   - API usage patterns
   - Media upload volumes

---

## Application Monitoring

### Django Application Logging

**Current Logging Configuration:**
- Location: `backend/logs/django.log`
- Format: Structured JSON logs recommended
- Levels: DEBUG, INFO, WARNING, ERROR, CRITICAL

**Log Format Recommendation:**
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'json': {
            '()': 'pythonjsonlogger.jsonlogger.JsonFormatter',
            'format': '%(asctime)s %(name)s %(levelname)s %(message)s'
        }
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/var/log/django/django.log',
            'maxBytes': 1024 * 1024 * 100,  # 100MB
            'backupCount': 10,
            'formatter': 'json'
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'json'
        }
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': False
        },
        'apps': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': False
        }
    }
}
```

### Key Application Events to Log

**Authentication Events:**
- User login success/failure
- User logout
- Password change
- MFA enable/disable
- Token refresh/revocation

**Authorization Events:**
- Permission denied (403)
- Unauthorized access attempts (401)
- RBAC violations
- IDOR attempts

**Data Events:**
- CRUD operations on critical data
- Bulk operations
- Data exports
- Configuration changes

**Security Events:**
- Rate limit violations
- Suspicious API patterns
- Failed authentication attempts (>5/min)
- Admin access attempts

---

## Infrastructure Monitoring

### Docker Container Monitoring

**Container Health Checks:**

**Backend Health Check:**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8000/health/"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

**Frontend Health Check:**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:80/"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

**PostgreSQL Health Check:**
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U portfolio_user"]
  interval: 10s
  timeout: 5s
  retries: 5
```

### System Metrics to Monitor

**CPU Usage:**
- Alert if >80% for 5 minutes
- Critical if >90% for 2 minutes

**Memory Usage:**
- Alert if >80% for 5 minutes
- Critical if >90% for 2 minutes

**Disk Usage:**
- Alert if >80%
- Critical if >90%

**Network Latency:**
- Alert if >500ms average response time
- Critical if >1s average response time

---

## Security Monitoring

### Authentication Monitoring

**Failed Login Attempts:**
- Alert if >5 failed attempts per IP per minute
- Alert if >20 failed attempts per user per hour
- Critical if >100 failed attempts per hour globally

**Successful Login Anomalies:**
- Alert if login from unusual location
- Alert if login from unusual device
- Alert if login at unusual time

### Authorization Monitoring

**Permission Denied Events:**
- Log all 403 responses
- Alert if >10 403 responses per user per hour
- Critical if >100 403 responses per hour globally

**Unauthorized Access Attempts:**
- Log all 401 responses
- Alert if >20 401 responses per IP per minute
- Critical if >100 401 responses per minute globally

### Rate Limiting Monitoring

**Rate Limit Violations:**
- Log all rate limit violations
- Alert if >50 violations per hour
- Critical if >200 violations per hour

---

## Database Monitoring

### PostgreSQL Performance Metrics

**Query Performance:**
- Slow query log (>1 second)
- Alert if >10 slow queries per minute
- Critical if >50 slow queries per minute

**Connection Pool:**
- Monitor active connections
- Alert if >80% of max connections
- Critical if >90% of max connections

**Database Size:**
- Monitor database growth
- Alert if growth >1GB per day
- Alert if total size >80% of allocated space

**Replication Lag:**
- Monitor replication lag (if using replicas)
- Alert if lag >5 seconds
- Critical if lag >30 seconds

---

## Monitoring Tools

### Recommended Monitoring Stack

**Option 1: Prometheus + Grafana**
- Open source
- Flexible query language
- Rich visualization
- Alertmanager for notifications

**Option 2: Datadog**
- SaaS solution
- Easy setup
- Comprehensive integrations
- ML-based anomaly detection

**Option 3: New Relic**
- SaaS solution
- APM focused
- Distributed tracing
- Error tracking

**Option 4: CloudWatch (AWS)**
- Native AWS integration
- Cost-effective for AWS deployments
- Limited customization

### Prometheus Configuration Example

**prometheus.yml:**
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'django'
    static_configs:
      - targets: ['backend:8000']
    metrics_path: '/metrics'

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx:80']

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']
```

**Alert Rules:**
```yaml
groups:
  - name: django_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(django_errors_total[5m]) > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(django_http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
```

---

## Alert Configuration

### Alert Channels

**Email Alerts:**
- Primary: devops@example.com
- Secondary: oncall@example.com
- Critical: all-team@example.com

**Slack Alerts:**
- Channel: #portfolio-cms-alerts
- Critical: #portfolio-cms-critical

**PagerDuty:**
- Service: Portfolio CMS
- Escalation policy: On-call → Team Lead → Engineering Manager

### Alert Severity Levels

**INFO:**
- Informational events
- No immediate action required
- Example: Scheduled maintenance completed

**WARNING:**
- Potential issues detected
- Monitor closely
- Example: High memory usage

**ERROR:**
- Actual issues detected
- Investigate within 1 hour
- Example: Application error rate increased

**CRITICAL:**
- Production-impacting issues
- Immediate action required
- Example: Application down, database unavailable

### Alert Escalation Policy

**Level 1 (INFO):**
- Log only
- No notification

**Level 2 (WARNING):**
- Email to devops team
- Slack message
- Monitor for escalation

**Level 3 (ERROR):**
- Email to devops team
- Slack message with @mention
- Create incident ticket
- Investigate within 1 hour

**Level 4 (CRITICAL):**
- Page on-call engineer
- Slack message to all channels
- Create high-priority incident
- Immediate investigation required

---

## Log Aggregation

### Centralized Logging

**Recommended Tools:**
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Splunk
- CloudWatch Logs
- Loki + Grafana

**Log Shipping Configuration:**

**Filebeat Configuration:**
```yaml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/log/django/*.log
    json.keys_under_root: true
    json.add_error_key: true

output.elasticsearch:
  hosts: ["elasticsearch:9200"]
  index: "portfolio-cms-%{+yyyy.MM.dd}"
```

---

## Performance Monitoring

### Application Performance Monitoring (APM)

**Key Metrics:**
- Response time percentiles (p50, p95, p99)
- Throughput (requests per second)
- Error rate
- Database query performance
- External API call performance

**Distributed Tracing:**
- Track requests across services
- Identify performance bottlenecks
- Debug production issues

**Recommended APM Tools:**
- Sentry (error tracking + performance)
- Datadog APM
- New Relic APM
- Jaeger (open source tracing)

---

## Backup Monitoring

### Backup Status Monitoring

**Metrics to Monitor:**
- Backup success/failure rate
- Backup file size trends
- Backup duration
- Storage space utilization

**Alert Triggers:**
- Backup failure
- Backup file too small (<10MB for database)
- Storage space below threshold (<20%)
- Backup duration exceeds threshold (>1 hour)

### Backup Verification Monitoring

**Automated Verification:**
- Daily backup integrity check
- Weekly restore test
- Monthly full disaster recovery drill

**Alert on Verification Failure:**
- Backup file corrupted
- Restore test failed
- Data integrity check failed

---

## Monitoring Dashboard

### Recommended Dashboards

**Dashboard 1: Application Health**
- Request rate
- Response time (p95)
- Error rate
- Active users
- Database connections

**Dashboard 2: Infrastructure Health**
- CPU usage
- Memory usage
- Disk usage
- Network I/O
- Container health

**Dashboard 3: Security Overview**
- Failed login attempts
- Permission denied events
- Rate limit violations
- Suspicious activity
- Active sessions

**Dashboard 4: Business Metrics**
- User registrations
- Content creation
- API usage
- Media uploads
- Page views

---

## Implementation Checklist

- [ ] Configure structured logging
- [ ] Set up log aggregation (ELK/Loki)
- [ ] Configure Prometheus metrics
- [ ] Set up Grafana dashboards
- [ ] Configure Alertmanager
- [ ] Set up alert channels (email, Slack, PagerDuty)
- [ ] Configure APM (Sentry/Datadog)
- [ ] Set up database monitoring
- [ ] Configure backup monitoring
- [ ] Set up security event monitoring
- [ ] Create monitoring runbooks
- [ ] Train team on monitoring tools

---

## Monitoring Runbooks

### Runbook: High Error Rate

**Symptoms:** Error rate >5%

**Investigation Steps:**
1. Check error logs for patterns
2. Identify affected endpoints
3. Check database connectivity
4. Check external service status
5. Check recent deployments

**Resolution Steps:**
1. If deployment issue, rollback
2. If database issue, restart/reconnect
3. If external service, implement fallback
4. If code issue, deploy hotfix

### Runbook: High Response Time

**Symptoms:** p95 response time >1s

**Investigation Steps:**
1. Check slow query log
2. Check database connection pool
3. Check cache hit rate
4. Check external API performance
5. Check resource utilization

**Resolution Steps:**
1. Optimize slow queries
2. Increase connection pool size
3. Implement caching
4. Optimize external API calls
5. Scale infrastructure

### Runbook: Database Connection Issues

**Symptoms:** Database connection errors

**Investigation Steps:**
1. Check PostgreSQL status
2. Check connection pool settings
3. Check network connectivity
4. Check database resource limits
5. Check connection limits

**Resolution Steps:**
1. Restart PostgreSQL if needed
2. Increase connection pool size
3. Fix network issues
4. Increase resource limits
5. Implement connection retry logic

---

## Contact Information

**Primary Contact:** [DevOps Team]  
**Secondary Contact:** [On-call Engineer]  
**Emergency Contact:** [Engineering Manager]

---

**Last Updated:** 2026-08-15  
**Next Review:** 2026-09-15
