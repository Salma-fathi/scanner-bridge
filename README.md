# Sudanese Local Scanner Bridge

A local solution to bridge physical document scanners with web browsers using a Python backend service and a React frontend. Enables seamless "Scan to Form" workflows without manual file uploads.

## Overview

This project provides a complete local scanner integration solution that:

- **Bridges Desktop Scanners to Web**: Connects TWAIN/WIA (Windows), SANE (Linux), and ICA (macOS) scanners directly to web applications
- **Local-First Architecture**: Runs entirely on your machine—no cloud services, no external dependencies
- **Real-Time Updates**: WebSocket connection provides live scan status and progress updates
- **Multi-Scanner Support**: Automatically detects and allows selection from multiple connected scanners
- **Image Optimization**: Converts and compresses scanned images before sending to browser
- **Zero Configuration**: Automatic scanner detection and minimal setup required

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Web Browser (React)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Scan Interface | Scanner Selection | Image Preview      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↕                                   │
│                    REST API + WebSocket                         │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│              Python Backend Service (Flask/FastAPI)             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Scanner Manager | Image Processor | WebSocket Handler  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│            Platform-Specific Scanner Drivers                    │
│  ┌──────────────┬──────────────┬──────────────────────────┐    │
│  │   TWAIN      │     WIA      │        SANE              │    │
│  │  (Windows)   │  (Windows)   │      (Linux)             │    │
│  └──────────────┴──────────────┴──────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Scanner connected and drivers installed
- For Windows: TWAIN or WIA drivers
- For Linux: SANE package
- For macOS: ICA drivers (built-in)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/scanner-bridge.git
   cd scanner-bridge
   ```

2. **Setup Python backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python app.py
   ```

3. **Setup React frontend** (in another terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the application**
   - Open http://localhost:3000 in your browser
   - Backend API runs on http://localhost:5000

## API Endpoints

### Scanner Management

- `GET /api/scanners` - List available scanners
- `POST /api/scanners/select` - Select active scanner
- `GET /api/scanners/current` - Get currently selected scanner

### Scanning Operations

- `POST /api/scan` - Trigger a scan operation
- `GET /api/scan/status` - Get current scan status
- `GET /api/scan/history` - Get scan history
- `DELETE /api/scan/{id}` - Delete a scanned image

### WebSocket

- `ws://localhost:5000/ws/scan` - Real-time scan status updates

## Features

✅ **Cross-Platform Support**
- Windows (TWAIN/WIA)
- Linux (SANE)
- macOS (ICA)

✅ **Real-Time Updates**
- WebSocket for live status
- Progress indicators
- Error notifications

✅ **Image Processing**
- Format conversion (JPEG/PNG)
- Compression and optimization
- Metadata handling

✅ **User Interface**
- Minimalist Scandinavian design
- Responsive layout
- Scanner selection interface
- Image preview and gallery

✅ **Developer-Friendly**
- RESTful API
- Clear documentation
- Example implementations
- Docker support

## Testing

### Manual Testing

1. **Scanner Detection**
   ```bash
   curl http://localhost:5000/api/scanners
   ```

2. **Trigger Scan**
   ```bash
   curl -X POST http://localhost:5000/api/scan \
     -H "Content-Type: application/json" \
     -d '{"scanner_id": "scanner_1", "format": "jpeg"}'
   ```

3. **Check Status**
   ```bash
   curl http://localhost:5000/api/scan/status
   ```

### Automated Testing

```bash
cd backend
pytest tests/
```

## Configuration

Edit `config/scanner.config.json` to customize:

```json
{
  "scanner": {
    "default_format": "jpeg",
    "compression_quality": 85,
    "max_image_size": 5242880,
    "timeout": 30
  },
  "api": {
    "host": "localhost",
    "port": 5000,
    "cors_origins": ["http://localhost:3000"]
  }
}
```

## Docker Deployment

```bash
# Build Docker image
docker build -t scanner-bridge .

# Run container
docker run -p 3000:3000 -p 5000:5000 \
  --device /dev/usb \
  --device /dev/bus/usb \
  scanner-bridge
```

## Project Structure

```
scanner-bridge/
├── backend/                 # Python Flask/FastAPI service
│   ├── app.py              # Main application
│   ├── scanner_manager.py  # Scanner detection and control
│   ├── image_processor.py  # Image conversion and optimization
│   ├── websocket_handler.py # Real-time updates
│   ├── requirements.txt     # Python dependencies
│   └── tests/              # Unit tests
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   └── App.tsx         # Main app
│   ├── package.json        # Node dependencies
│   └── public/             # Static assets
├── config/                 # Configuration files
├── docs/                   # Documentation
├── tests/                  # Integration tests
├── Dockerfile              # Docker configuration
└── README.md              # This file
```

## Troubleshooting

### Scanner Not Detected

**Windows:**
- Ensure TWAIN drivers are installed
- Check Device Manager for scanner
- Restart the backend service

**Linux:**
- Install SANE: `sudo apt-get install sane-utils`
- Add user to scanner group: `sudo usermod -a -G scanner $USER`
- Restart the backend service

**macOS:**
- Scanner should be auto-detected
- Check System Preferences > Printers & Scanners

### Connection Issues

- Verify backend is running: `curl http://localhost:5000/api/scanners`
- Check firewall settings
- Ensure ports 3000 and 5000 are not in use

### Image Quality Issues

- Adjust `compression_quality` in config
- Check scanner settings (resolution, color mode)
- Verify image format selection

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request with clear description

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation in `/docs`
- Review test cases for usage examples

## Acknowledgments

Built for the Sudanese Programming Challenge 2026, enabling practical local solutions for real-world problems in resource-constrained environments.

---

**Status**: Beta Release (v0.1.0)  
**Last Updated**: January 2026  
**Maintainer**: [Your Name]
