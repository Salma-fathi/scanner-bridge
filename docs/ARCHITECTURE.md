# Scanner Bridge - Architecture Documentation

## System Overview

Scanner Bridge is a local solution that bridges physical document scanners with web browsers through a Python backend service and a React frontend application.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Web Browser (React)                         │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Header Component                                      │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │  ScannerSelector  │  ScanInterface  │  ImageGallery   │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │  Footer Component                                      │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  State Management (Zustand)                                    │
│  API Service Layer (Axios + Socket.io)                        │
└─────────────────────────────────────────────────────────────────┘
                              ↕
                    REST API + WebSocket
                    (Port 5000)
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│              Python Backend Service (Flask)                     │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  API Routes Layer                                      │   │
│  │  - /api/scanners/*                                     │   │
│  │  - /api/scan/*                                         │   │
│  │  - /api/image/*                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                              ↕                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Business Logic Layer                                  │   │
│  │  - ScannerManager                                      │   │
│  │  - ImageProcessor                                      │   │
│  │  - WebSocketHandler                                    │   │
│  └────────────────────────────────────────────────────────┘   │
│                              ↕                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Hardware Abstraction Layer                            │   │
│  │  - Platform Detection                                  │   │
│  │  - Scanner Enumeration                                 │   │
│  │  - Scan Operations                                     │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│            Platform-Specific Scanner Drivers                    │
│                                                                 │
│  ┌──────────────┬──────────────┬──────────────────────────┐   │
│  │   TWAIN      │     WIA      │        SANE              │   │
│  │  (Windows)   │  (Windows)   │      (Linux)             │   │
│  │              │              │                          │   │
│  │   ICA        │              │                          │   │
│  │  (macOS)     │              │                          │   │
│  └──────────────┴──────────────┴──────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    Physical Scanners                            │
│                    (USB/Network)                                │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend (React)

#### Components

1. **Header Component**
   - Application branding
   - Version information
   - Status indicators

2. **ScannerSelector Component**
   - Lists available scanners
   - Allows scanner selection
   - Shows scanner capabilities
   - Displays connection status

3. **ScanInterface Component**
   - Scan settings (format, resolution, color mode)
   - Scan button and progress indicator
   - Error handling and feedback

4. **ImageGallery Component**
   - Displays scanned images
   - Image preview functionality
   - Delete operations
   - Scan history

5. **Footer Component**
   - Links and resources
   - Copyright information
   - Support information

#### State Management

Uses Zustand for global state:
- Scanner list and selection
- Current scan status
- Scan history
- UI state (modals, previews)
- Error messages

#### API Service Layer

- **api.ts**: Axios instance with base configuration
- **scannerAPI**: Scanner-related endpoints
- **scanAPI**: Scan operation endpoints
- **imageAPI**: Image processing endpoints
- **wsAPI**: WebSocket connection and events

### Backend (Python/Flask)

#### Application Structure

```
backend/
├── app.py                  # Main Flask application
├── scanner_manager.py      # Scanner detection and control
├── image_processor.py      # Image processing operations
├── websocket_handler.py    # WebSocket event handling
├── requirements.txt        # Python dependencies
└── tests/                  # Unit tests
```

#### API Endpoints

**Scanner Management:**
- `GET /api/scanners` - List available scanners
- `POST /api/scanners/select` - Select active scanner
- `GET /api/scanners/current` - Get current scanner
- `GET /api/scanners/<id>` - Get scanner details
- `POST /api/scanners/refresh` - Refresh scanner list

**Scan Operations:**
- `POST /api/scan` - Start scan
- `GET /api/scan/status` - Get scan status
- `GET /api/scan/<id>` - Get scanned image
- `GET /api/scan/<id>/info` - Get scan metadata
- `GET /api/scan/history` - Get scan history
- `DELETE /api/scan/<id>` - Delete scan

**Image Processing:**
- `POST /api/image/convert` - Convert image format
- `POST /api/image/optimize` - Optimize image

**Health:**
- `GET /health` - Health check
- `GET /api/status` - API status

#### WebSocket Events

**Client → Server:**
- `request_scanners` - Request scanner list
- `request_status` - Request scan status

**Server → Client:**
- `connect` - Connection established
- `scanners_updated` - Scanner list changed
- `scanner_selected` - Scanner selected
- `scan_started` - Scan operation started
- `scan_progress` - Scan progress update
- `scan_completed` - Scan completed
- `scan_error` - Scan error occurred

#### Core Modules

**ScannerManager**
- Platform detection (Windows, Linux, macOS)
- Scanner enumeration
- Scanner selection
- Scan operation management
- Scan history tracking

**ImageProcessor**
- Image format conversion
- Image optimization and compression
- Image rotation and cropping
- Metadata extraction

**WebSocketHandler**
- Connection management
- Event broadcasting
- Client communication

## Data Flow

### Scanner Detection Flow

```
1. App Initialization
   ↓
2. ScannerManager.initialize()
   ↓
3. Platform Detection
   ↓
4. Platform-Specific Scanner Enumeration
   ├─ Windows: WIA/TWAIN enumeration
   ├─ Linux: SANE enumeration
   └─ macOS: ICA enumeration
   ↓
5. Scanner List Populated
   ↓
6. Frontend Updated via WebSocket
```

### Scan Operation Flow

```
1. User Clicks "Start Scan"
   ↓
2. Frontend Sends POST /api/scan
   ↓
3. Backend Validates Scanner
   ↓
4. ScannerManager.start_scan()
   ↓
5. Hardware Scan Operation
   ↓
6. Image Captured and Processed
   ↓
7. Image Saved to Disk
   ↓
8. Metadata Stored
   ↓
9. WebSocket Update Sent
   ↓
10. Frontend Receives Update
    ↓
11. Image Displayed in Gallery
```

## Technology Stack

### Frontend
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Zustand**: State management
- **Axios**: HTTP client
- **Socket.io Client**: WebSocket client
- **Vite**: Build tool

### Backend
- **Python 3.8+**: Runtime
- **Flask**: Web framework
- **Flask-CORS**: CORS support
- **Flask-SocketIO**: WebSocket support
- **Pillow**: Image processing
- **python-socketio**: WebSocket library

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Reverse proxy (optional)

## Configuration

### Backend Configuration (config/scanner.config.json)

```json
{
  "scanner": {
    "default_format": "jpeg",
    "compression_quality": 85,
    "max_image_size": 5242880,
    "timeout": 30,
    "resolution": 300,
    "color_mode": "color"
  },
  "api": {
    "host": "127.0.0.1",
    "port": 5000,
    "cors_origins": ["http://localhost:3000"],
    "max_request_size": 10485760
  },
  "storage": {
    "temp_dir": "./temp",
    "cache_dir": "./cache",
    "scan_dir": "./scans",
    "max_cache_size": 104857600
  }
}
```

## Error Handling

### Frontend Error Handling
- Try-catch blocks in API calls
- User-friendly error messages
- Error state in Zustand store
- Toast notifications (can be added)

### Backend Error Handling
- Exception catching in routes
- HTTP status codes
- Detailed error responses
- Logging of errors

## Security Considerations

1. **CORS Configuration**: Limited to localhost by default
2. **Input Validation**: Scanner ID and parameters validated
3. **File Operations**: Safe path handling
4. **Resource Limits**: Max file size and cache size limits
5. **Error Messages**: No sensitive information exposed

## Performance Optimization

1. **Image Compression**: Configurable quality settings
2. **Caching**: Processed images cached
3. **Lazy Loading**: Images loaded on demand
4. **WebSocket**: Real-time updates without polling
5. **Async Operations**: Non-blocking scan operations

## Testing Strategy

### Unit Tests
- Scanner manager functionality
- Image processor operations
- API endpoint validation

### Integration Tests
- End-to-end scan workflow
- WebSocket communication
- File operations

### Manual Testing
- Scanner detection
- Scan operations
- Image preview
- Error handling

## Deployment

### Local Development
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Docker Deployment
```bash
docker-compose up
```

### Production Considerations
- Use production WSGI server (gunicorn)
- Enable HTTPS/SSL
- Configure proper CORS origins
- Set up logging and monitoring
- Use environment variables for secrets

## Future Enhancements

1. **Multi-page Scanning**: Support scanning multiple pages
2. **OCR Integration**: Extract text from scanned documents
3. **Cloud Storage**: Upload to cloud services
4. **Advanced Editing**: Crop, rotate, enhance images
5. **Batch Operations**: Scan multiple documents
6. **Authentication**: User login and permissions
7. **Mobile Support**: Mobile app or responsive design
8. **Database Integration**: Persistent storage
9. **API Documentation**: Swagger/OpenAPI
10. **Performance Monitoring**: Analytics and metrics
