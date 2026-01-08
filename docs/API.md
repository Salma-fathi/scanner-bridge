# Scanner Bridge API Documentation

## Base URL

```
http://localhost:5000
```

## Authentication

Currently, no authentication is required. All endpoints are public.

## Response Format

All responses are in JSON format.

### Success Response

```json
{
  "data": { /* response data */ },
  "timestamp": "2026-01-08T10:30:00Z"
}
```

### Error Response

```json
{
  "error": "Error message",
  "code": 400,
  "details": "Additional error details"
}
```

## Endpoints

### Health Check

#### GET /health

Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-08T10:30:00Z",
  "version": "0.1.0"
}
```

#### GET /api/status

Get API status and configuration.

**Response:**
```json
{
  "api": "running",
  "scanners_detected": 2,
  "temp_dir": "./temp",
  "cache_dir": "./cache",
  "timestamp": "2026-01-08T10:30:00Z"
}
```

### Scanner Management

#### GET /api/scanners

List all available scanners.

**Response:**
```json
{
  "scanners": [
    {
      "id": "scanner_1",
      "name": "HP ScanJet Pro 3000 s3",
      "manufacturer": "HP",
      "model": "ScanJet Pro 3000 s3",
      "status": "available",
      "platform": "windows",
      "driver_type": "WIA",
      "capabilities": {
        "formats": ["jpeg", "png", "tiff"],
        "resolutions": [75, 150, 300, 600, 1200],
        "color_modes": ["bw", "gray", "color"],
        "duplex": true
      }
    }
  ],
  "count": 1,
  "timestamp": "2026-01-08T10:30:00Z"
}
```

#### POST /api/scanners/select

Select active scanner.

**Request Body:**
```json
{
  "scanner_id": "scanner_1"
}
```

**Response:**
```json
{
  "status": "selected",
  "scanner_id": "scanner_1",
  "timestamp": "2026-01-08T10:30:00Z"
}
```

#### GET /api/scanners/current

Get currently selected scanner.

**Response:**
```json
{
  "scanner": {
    "id": "scanner_1",
    "name": "HP ScanJet Pro 3000 s3",
    "manufacturer": "HP",
    "model": "ScanJet Pro 3000 s3",
    "status": "available",
    "platform": "windows",
    "driver_type": "WIA",
    "capabilities": { /* ... */ }
  },
  "timestamp": "2026-01-08T10:30:00Z"
}
```

#### GET /api/scanners/{scanner_id}

Get detailed information about a specific scanner.

**Response:**
```json
{
  "scanner": { /* scanner details */ },
  "timestamp": "2026-01-08T10:30:00Z"
}
```

#### POST /api/scanners/refresh

Refresh scanner list.

**Response:**
```json
{
  "status": "refreshed",
  "scanners": [ /* scanner list */ ],
  "count": 2
}
```

### Scan Operations

#### POST /api/scan

Start a new scan operation.

**Request Body:**
```json
{
  "scanner_id": "scanner_1",
  "format": "jpeg",
  "resolution": 300,
  "color_mode": "color",
  "compression_quality": 85
}
```

**Response:**
```json
{
  "scan_id": "scan_20260108_103000_a1b2c3d4",
  "status": "scanning",
  "scanner_id": "scanner_1",
  "timestamp": "2026-01-08T10:30:00Z"
}
```

#### GET /api/scan/status

Get current scan status.

**Response:**
```json
{
  "status": "idle",
  "timestamp": "2026-01-08T10:30:00Z"
}
```

**Possible Status Values:**
- `idle` - No scan in progress
- `scanning` - Scan in progress
- `processing` - Processing scanned image
- `completed` - Scan completed
- `error` - Error occurred

#### GET /api/scan/{scan_id}

Get scanned image (returns image file).

**Response:** Binary image data

**Example:**
```bash
curl http://localhost:5000/api/scan/scan_20260108_103000_a1b2c3d4 > image.jpg
```

#### GET /api/scan/{scan_id}/info

Get scan metadata.

**Response:**
```json
{
  "scan": {
    "scan_id": "scan_20260108_103000_a1b2c3d4",
    "scanner_id": "scanner_1",
    "timestamp": "2026-01-08T10:30:00Z",
    "format": "jpeg",
    "resolution": 300,
    "color_mode": "color",
    "file_path": "./scans/scan_20260108_103000_a1b2c3d4.jpeg",
    "file_size": 245678,
    "status": "completed"
  },
  "timestamp": "2026-01-08T10:30:00Z"
}
```

#### GET /api/scan/history

Get scan history.

**Query Parameters:**
- `limit` (optional, default: 50) - Number of scans to return

**Response:**
```json
{
  "history": [
    {
      "scan_id": "scan_20260108_103000_a1b2c3d4",
      "scanner_id": "scanner_1",
      "timestamp": "2026-01-08T10:30:00Z",
      "format": "jpeg",
      "resolution": 300,
      "color_mode": "color",
      "file_path": "./scans/scan_20260108_103000_a1b2c3d4.jpeg",
      "file_size": 245678,
      "status": "completed"
    }
  ],
  "count": 1,
  "timestamp": "2026-01-08T10:30:00Z"
}
```

#### DELETE /api/scan/{scan_id}

Delete a scanned image.

**Response:**
```json
{
  "status": "deleted",
  "scan_id": "scan_20260108_103000_a1b2c3d4",
  "timestamp": "2026-01-08T10:30:00Z"
}
```

### Image Processing

#### POST /api/image/convert

Convert image to different format.

**Request Body:**
```json
{
  "scan_id": "scan_20260108_103000_a1b2c3d4",
  "format": "png"
}
```

**Response:** Binary image data in requested format

#### POST /api/image/optimize

Optimize image (compress, resize, etc).

**Request Body:**
```json
{
  "scan_id": "scan_20260108_103000_a1b2c3d4",
  "quality": 85,
  "max_width": 1000
}
```

**Response:** Binary optimized image data

## WebSocket Events

### Connection

```javascript
const socket = io('ws://localhost:5000');

socket.on('connect', () => {
  console.log('Connected');
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});
```

### Scanner Events

#### scanners_updated

Emitted when scanner list changes.

```json
{
  "scanners": [ /* scanner list */ ],
  "timestamp": "2026-01-08T10:30:00Z"
}
```

#### scanner_selected

Emitted when scanner is selected.

```json
{
  "scanner_id": "scanner_1",
  "timestamp": "2026-01-08T10:30:00Z"
}
```

### Scan Events

#### scan_started

Emitted when scan operation starts.

```json
{
  "scan_id": "scan_20260108_103000_a1b2c3d4",
  "scanner_id": "scanner_1",
  "timestamp": "2026-01-08T10:30:00Z"
}
```

#### scan_progress

Emitted during scan operation.

```json
{
  "scan_id": "scan_20260108_103000_a1b2c3d4",
  "progress": 50,
  "status": "scanning",
  "timestamp": "2026-01-08T10:30:00Z"
}
```

#### scan_completed

Emitted when scan completes.

```json
{
  "scan_id": "scan_20260108_103000_a1b2c3d4",
  "image_path": "./scans/scan_20260108_103000_a1b2c3d4.jpeg",
  "file_size": 245678,
  "timestamp": "2026-01-08T10:30:00Z"
}
```

#### scan_error

Emitted when scan error occurs.

```json
{
  "scan_id": "scan_20260108_103000_a1b2c3d4",
  "error": "Scanner not available",
  "timestamp": "2026-01-08T10:30:00Z"
}
```

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |

## Rate Limiting

Currently, no rate limiting is implemented.

## CORS

CORS is enabled for:
- `http://localhost:3000`
- `http://localhost:*`
- `http://127.0.0.1:3000`

## Examples

### cURL Examples

**List Scanners:**
```bash
curl http://localhost:5000/api/scanners
```

**Select Scanner:**
```bash
curl -X POST http://localhost:5000/api/scanners/select \
  -H "Content-Type: application/json" \
  -d '{"scanner_id": "scanner_1"}'
```

**Start Scan:**
```bash
curl -X POST http://localhost:5000/api/scan \
  -H "Content-Type: application/json" \
  -d '{
    "scanner_id": "scanner_1",
    "format": "jpeg",
    "resolution": 300,
    "color_mode": "color"
  }'
```

**Get Scan Image:**
```bash
curl http://localhost:5000/api/scan/scan_20260108_103000_a1b2c3d4 > image.jpg
```

### JavaScript Examples

**Fetch Scanners:**
```javascript
const response = await fetch('http://localhost:5000/api/scanners');
const data = await response.json();
console.log(data.scanners);
```

**Start Scan:**
```javascript
const response = await fetch('http://localhost:5000/api/scan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    scanner_id: 'scanner_1',
    format: 'jpeg',
    resolution: 300
  })
});
const data = await response.json();
console.log(data.scan_id);
```

**WebSocket Connection:**
```javascript
const socket = io('ws://localhost:5000');

socket.on('scan_completed', (data) => {
  console.log('Scan completed:', data.scan_id);
});

socket.emit('request_scanners');
```

## Pagination

Pagination is supported on the history endpoint:

```bash
curl "http://localhost:5000/api/scan/history?limit=10"
```

## Versioning

Current API version: **v1** (implied, no version prefix in URLs)

Future versions may use URL prefixes like `/api/v2/...`
