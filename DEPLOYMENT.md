# Scanner Bridge - Deployment Guide

This guide covers deploying Scanner Bridge to production environments.

## Local Development

For local development, see [QUICKSTART.md](QUICKSTART.md).

## Docker Deployment

### Prerequisites

- Docker 20.10+
- Docker Compose 1.29+
- Scanner connected to host machine

### Quick Start

```bash
docker-compose up
```

Access at: `http://localhost:3000`

### Production Deployment

1. **Build Image**
   ```bash
   docker build -t scanner-bridge:latest .
   ```

2. **Run Container**
   ```bash
   docker run -d \
     -p 3000:3000 \
     -p 5000:5000 \
     --device /dev/usb:/dev/usb \
     --device /dev/bus/usb:/dev/bus/usb \
     --name scanner-bridge \
     scanner-bridge:latest
   ```

3. **Verify**
   ```bash
   docker logs scanner-bridge
   curl http://localhost:5000/health
   ```

### Docker Compose Production

Edit `docker-compose.yml`:

```yaml
version: '3.8'

services:
  scanner-bridge:
    image: scanner-bridge:latest
    restart: always
    ports:
      - "3000:3000"
      - "5000:5000"
    volumes:
      - ./scans:/app/scans
      - ./cache:/app/cache
      - ./logs:/app/logs
    environment:
      - FLASK_ENV=production
      - LOG_LEVEL=INFO
    devices:
      - /dev/usb:/dev/usb
      - /dev/bus/usb:/dev/bus/usb

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - scanner-bridge
```

Run:
```bash
docker-compose -f docker-compose.yml up -d
```

## Manual Deployment

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure Environment**
   ```bash
   cp ../.env.example .env
   # Edit .env with production settings
   ```

3. **Run with Gunicorn**
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

### Frontend Setup

1. **Build**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Serve**
   ```bash
   npm install -g serve
   serve -s dist -l 3000
   ```

### Nginx Reverse Proxy

1. **Copy Configuration**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/scanner-bridge
   sudo ln -s /etc/nginx/sites-available/scanner-bridge /etc/nginx/sites-enabled/
   ```

2. **SSL Certificates**
   ```bash
   # Using Let's Encrypt
   sudo certbot certonly --standalone -d yourdomain.com
   
   # Update nginx.conf with certificate paths
   ```

3. **Restart Nginx**
   ```bash
   sudo systemctl restart nginx
   ```

## Systemd Services

### Backend Service

Create `/etc/systemd/system/scanner-bridge-backend.service`:

```ini
[Unit]
Description=Scanner Bridge Backend
After=network.target

[Service]
Type=simple
User=scanner-bridge
WorkingDirectory=/opt/scanner-bridge/backend
ExecStart=/opt/scanner-bridge/backend/venv/bin/python app.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable:
```bash
sudo systemctl enable scanner-bridge-backend
sudo systemctl start scanner-bridge-backend
```

### Frontend Service

Create `/etc/systemd/system/scanner-bridge-frontend.service`:

```ini
[Unit]
Description=Scanner Bridge Frontend
After=network.target

[Service]
Type=simple
User=scanner-bridge
WorkingDirectory=/opt/scanner-bridge/frontend
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable:
```bash
sudo systemctl enable scanner-bridge-frontend
sudo systemctl start scanner-bridge-frontend
```

## Configuration

### Environment Variables

Create `.env` file:

```bash
# Backend
FLASK_ENV=production
FLASK_PORT=5000
FLASK_HOST=0.0.0.0

# Scanner
SCANNER_DEFAULT_FORMAT=jpeg
SCANNER_COMPRESSION_QUALITY=85
SCANNER_TIMEOUT=30

# Logging
LOG_LEVEL=INFO

# CORS
CORS_ORIGINS=https://yourdomain.com
```

### Configuration File

Edit `config/scanner.config.json`:

```json
{
  "scanner": {
    "default_format": "jpeg",
    "compression_quality": 85,
    "max_image_size": 5242880,
    "timeout": 30
  },
  "api": {
    "host": "0.0.0.0",
    "port": 5000,
    "cors_origins": ["https://yourdomain.com"],
    "max_request_size": 10485760
  },
  "storage": {
    "temp_dir": "/var/scanner-bridge/temp",
    "cache_dir": "/var/scanner-bridge/cache",
    "scan_dir": "/var/scanner-bridge/scans",
    "max_cache_size": 104857600
  }
}
```

## SSL/TLS Configuration

### Self-Signed Certificate

```bash
openssl req -x509 -newkey rsa:4096 -nodes \
  -out cert.pem -keyout key.pem -days 365
```

### Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

Update `nginx.conf` with certificate paths:

```nginx
ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
```

## Monitoring

### Health Check

```bash
curl https://yourdomain.com/health
```

### Logs

**Backend:**
```bash
tail -f /var/scanner-bridge/logs/scanner-bridge.log
```

**Frontend:**
```bash
journalctl -u scanner-bridge-frontend -f
```

**Nginx:**
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Metrics

Monitor using:
- Prometheus
- Grafana
- ELK Stack
- Datadog

## Backup and Recovery

### Backup

```bash
# Backup scanned documents
tar -czf scanner-bridge-backup-$(date +%Y%m%d).tar.gz \
  /var/scanner-bridge/scans

# Backup configuration
tar -czf scanner-bridge-config-$(date +%Y%m%d).tar.gz \
  /opt/scanner-bridge/config
```

### Recovery

```bash
# Restore scans
tar -xzf scanner-bridge-backup-20260108.tar.gz -C /

# Restore configuration
tar -xzf scanner-bridge-config-20260108.tar.gz -C /
```

## Security Hardening

1. **Firewall Rules**
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

2. **User Permissions**
   ```bash
   sudo useradd -m -s /bin/bash scanner-bridge
   sudo chown -R scanner-bridge:scanner-bridge /opt/scanner-bridge
   sudo chmod -R 755 /opt/scanner-bridge
   ```

3. **Rate Limiting**
   Add to nginx.conf:
   ```nginx
   limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
   limit_req zone=api burst=20 nodelay;
   ```

4. **CORS Configuration**
   - Whitelist only trusted origins
   - Use HTTPS only
   - Set appropriate headers

5. **Input Validation**
   - Validate all API inputs
   - Sanitize file paths
   - Check file sizes

## Performance Optimization

1. **Caching**
   - Enable browser caching for static assets
   - Use Redis for session caching

2. **Compression**
   - Enable gzip compression
   - Optimize image sizes

3. **Database**
   - If using database, add indexes
   - Monitor query performance

4. **Load Balancing**
   - Use multiple backend instances
   - Load balance with Nginx or HAProxy

## Troubleshooting

### Container Won't Start

```bash
docker logs scanner-bridge
docker-compose logs scanner-bridge
```

### Port Already in Use

```bash
# Find process using port
lsof -i :5000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Scanner Not Available

- Check USB device mapping
- Verify scanner drivers installed
- Check container privileges

### High Memory Usage

- Clear cache: `rm -rf /var/scanner-bridge/cache/*`
- Restart container
- Monitor with `docker stats`

## Scaling

### Horizontal Scaling

1. **Multiple Backend Instances**
   ```bash
   docker-compose scale backend=3
   ```

2. **Load Balancer**
   - Use Nginx or HAProxy
   - Distribute requests across instances

3. **Shared Storage**
   - Use NFS or S3 for scans
   - Share cache across instances

### Vertical Scaling

- Increase CPU/RAM allocation
- Optimize code performance
- Use faster storage

## Maintenance

### Regular Tasks

- Monitor logs daily
- Check disk usage weekly
- Update dependencies monthly
- Review security monthly
- Backup data weekly

### Updates

```bash
# Update Docker image
docker pull scanner-bridge:latest
docker-compose up -d

# Update dependencies
cd backend && pip install -r requirements.txt --upgrade
cd frontend && npm update
```

## Disaster Recovery

1. **Regular Backups**
   - Automated daily backups
   - Off-site backup storage
   - Test restore procedures

2. **Monitoring**
   - Alert on failures
   - Monitor resource usage
   - Track error rates

3. **Documentation**
   - Keep runbooks updated
   - Document procedures
   - Train team members

## Support

- Check [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
- Review logs for errors
- Test with curl or Postman
- Contact support if needed

---

For more information, see:
- [README](README.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API Documentation](docs/API.md)
