# Scanner Bridge - Quick Start Guide

Get Scanner Bridge up and running in 5 minutes!

## Prerequisites

- Python 3.8+
- Node.js 16+
- Scanner connected with drivers installed

## Installation (5 minutes)

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/scanner-bridge.git
cd scanner-bridge
```

### 2. Start Backend (Terminal 1)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Expected Output:**
```
 * Running on http://127.0.0.1:5000
 * Scanner detection initialized
 * WebSocket server ready
```

### 3. Start Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

**Expected Output:**
```
Compiled successfully!
You can now view the app in the browser at http://localhost:3000
```

### 4. Open Browser

Go to: **http://localhost:3000**

## First Scan (2 minutes)

1. **Select Scanner**
   - Choose your scanner from the list
   - If no scanners appear, see [Troubleshooting](docs/TROUBLESHOOTING.md)

2. **Configure Settings**
   - Format: JPEG (default)
   - Resolution: 300 DPI (standard)
   - Color Mode: Color (default)

3. **Place Document**
   - Put document in scanner
   - Close scanner lid

4. **Click "Start Scan"**
   - Wait for scan to complete
   - Image appears in gallery

5. **View Result**
   - Image shows in gallery
   - Click to preview
   - Download or delete as needed

## Using Docker (Alternative)

```bash
docker-compose up
```

Access at: **http://localhost:3000**

## Next Steps

- Read [Full Documentation](README.md)
- Check [API Documentation](docs/API.md)
- Review [Architecture](docs/ARCHITECTURE.md)
- See [Troubleshooting](docs/TROUBLESHOOTING.md) if issues

## Common Issues

### Scanner Not Detected

**Windows:**
```bash
# Check if scanner drivers are installed
# Device Manager → Imaging devices
```

**Linux:**
```bash
sudo apt-get install sane-utils
sudo usermod -a -G scanner $USER
# Log out and back in
```

**macOS:**
```bash
# Scanner should be auto-detected
# Check System Preferences > Printers & Scanners
```

### Connection Error

```bash
# Check backend is running
curl http://localhost:5000/health

# Check frontend is running
curl http://localhost:3000
```

### Port Already in Use

```bash
# Kill process using port 5000
# Windows:
taskkill /PID <PID> /F

# Linux/macOS:
kill -9 <PID>
```

## API Quick Reference

### Get Scanners
```bash
curl http://localhost:5000/api/scanners
```

### Select Scanner
```bash
curl -X POST http://localhost:5000/api/scanners/select \
  -H "Content-Type: application/json" \
  -d '{"scanner_id": "scanner_1"}'
```

### Start Scan
```bash
curl -X POST http://localhost:5000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"scanner_id": "scanner_1", "format": "jpeg"}'
```

### Get Scan History
```bash
curl http://localhost:5000/api/scan/history
```

## Configuration

Edit `config/scanner.config.json` to customize:

```json
{
  "scanner": {
    "default_format": "jpeg",
    "compression_quality": 85,
    "resolution": 300
  },
  "api": {
    "port": 5000
  }
}
```

Restart backend after changes.

## File Structure

```
scanner-bridge/
├── backend/          # Python Flask service
├── frontend/         # React application
├── config/           # Configuration files
├── docs/             # Documentation
├── Dockerfile        # Docker configuration
└── README.md         # Full documentation
```

## Development

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## Production Deployment

### Docker

```bash
docker build -t scanner-bridge .
docker run -p 3000:3000 -p 5000:5000 scanner-bridge
```

### Manual

```bash
# Backend
cd backend
pip install -r requirements.txt
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Frontend
cd frontend
npm run build
npm install -g serve
serve -s dist -l 3000
```

## Support

- 📖 [Full Documentation](README.md)
- 🔧 [Troubleshooting](docs/TROUBLESHOOTING.md)
- 📚 [API Reference](docs/API.md)
- 🏗️ [Architecture](docs/ARCHITECTURE.md)
- 🤝 [Contributing](CONTRIBUTING.md)

## License

MIT License - See [LICENSE](LICENSE) for details

---

**Ready to scan?** Start with step 1 above and you'll be scanning documents in minutes!
