"""
Scanner Bridge Backend - Main Application
Provides REST API and WebSocket for scanner control and image processing
"""

import os
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any
from functools import wraps

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from werkzeug.exceptions import HTTPException

from scanner_manager import ScannerManager
from image_processor import ImageProcessor
from websocket_handler import WebSocketHandler

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max request size
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:*"]}})

# Initialize extensions
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize managers
scanner_manager = ScannerManager()
image_processor = ImageProcessor()
websocket_handler = WebSocketHandler(socketio)

# Create necessary directories
Path("./temp").mkdir(exist_ok=True)
Path("./cache").mkdir(exist_ok=True)
Path("./scans").mkdir(exist_ok=True)

# Store active connections
active_connections: Dict[str, Any] = {}


def handle_errors(f):
    """Decorator to handle errors consistently"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except HTTPException as e:
            logger.error(f"HTTP Error: {e}")
            return jsonify({"error": str(e), "code": e.code}), e.code
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}", exc_info=True)
            return jsonify({"error": "Internal server error", "details": str(e)}), 500
    return decorated_function


# ============================================================================
# HEALTH CHECK ENDPOINTS
# ============================================================================

@app.route('/health', methods=['GET'])
@handle_errors
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "0.1.0"
    }), 200


@app.route('/api/status', methods=['GET'])
@handle_errors
def api_status():
    """Get API status and configuration"""
    return jsonify({
        "api": "running",
        "scanners_detected": len(scanner_manager.list_scanners()),
        "temp_dir": "./temp",
        "cache_dir": "./cache",
        "timestamp": datetime.now().isoformat()
    }), 200


# ============================================================================
# SCANNER MANAGEMENT ENDPOINTS
# ============================================================================

@app.route('/api/scanners', methods=['GET'])
@handle_errors
def list_scanners():
    """List all available scanners"""
    try:
        scanners = scanner_manager.list_scanners()
        logger.info(f"Listed {len(scanners)} scanners")
        return jsonify({
            "scanners": scanners,
            "count": len(scanners),
            "timestamp": datetime.now().isoformat()
        }), 200
    except Exception as e:
        logger.error(f"Error listing scanners: {str(e)}")
        return jsonify({
            "error": "Failed to list scanners",
            "details": str(e),
            "scanners": []
        }), 500


@app.route('/api/scanners/refresh', methods=['POST'])
@handle_errors
def refresh_scanners():
    """Refresh scanner list"""
    try:
        scanner_manager.refresh_scanner_list()
        scanners = scanner_manager.list_scanners()
        
        # Notify connected clients
        socketio.emit('scanners_updated', {
            'scanners': scanners,
            'timestamp': datetime.now().isoformat()
        })
        
        logger.info("Scanner list refreshed")
        return jsonify({
            "status": "refreshed",
            "scanners": scanners,
            "count": len(scanners)
        }), 200
    except Exception as e:
        logger.error(f"Error refreshing scanners: {str(e)}")
        return jsonify({"error": "Failed to refresh scanners", "details": str(e)}), 500


@app.route('/api/scanners/<scanner_id>', methods=['GET'])
@handle_errors
def get_scanner_info(scanner_id: str):
    """Get detailed information about a specific scanner"""
    try:
        info = scanner_manager.get_scanner_info(scanner_id)
        if not info:
            return jsonify({"error": "Scanner not found"}), 404
        
        return jsonify({
            "scanner": info,
            "timestamp": datetime.now().isoformat()
        }), 200
    except Exception as e:
        logger.error(f"Error getting scanner info: {str(e)}")
        return jsonify({"error": "Failed to get scanner info", "details": str(e)}), 500


@app.route('/api/scanners/select', methods=['POST'])
@handle_errors
def select_scanner():
    """Select active scanner"""
    data = request.get_json()
    scanner_id = data.get('scanner_id')
    
    if not scanner_id:
        return jsonify({"error": "scanner_id is required"}), 400
    
    try:
        success = scanner_manager.select_scanner(scanner_id)
        if not success:
            return jsonify({"error": "Scanner not found"}), 404
        
        logger.info(f"Selected scanner: {scanner_id}")
        socketio.emit('scanner_selected', {
            'scanner_id': scanner_id,
            'timestamp': datetime.now().isoformat()
        })
        
        return jsonify({
            "status": "selected",
            "scanner_id": scanner_id,
            "timestamp": datetime.now().isoformat()
        }), 200
    except Exception as e:
        logger.error(f"Error selecting scanner: {str(e)}")
        return jsonify({"error": "Failed to select scanner", "details": str(e)}), 500


@app.route('/api/scanners/current', methods=['GET'])
@handle_errors
def get_current_scanner():
    """Get currently selected scanner"""
    current = scanner_manager.get_current_scanner()
    if not current:
        return jsonify({"error": "No scanner selected"}), 404
    
    return jsonify({
        "scanner": current,
        "timestamp": datetime.now().isoformat()
    }), 200


# ============================================================================
# SCANNING OPERATIONS ENDPOINTS
# ============================================================================

@app.route('/api/scan', methods=['POST'])
@handle_errors
def start_scan():
    """Start a new scan operation"""
    data = request.get_json()
    scanner_id = data.get('scanner_id') or scanner_manager.get_current_scanner_id()
    
    if not scanner_id:
        return jsonify({"error": "No scanner selected"}), 400
    
    scan_params = {
        'format': data.get('format', 'jpeg'),
        'resolution': data.get('resolution', 300),
        'color_mode': data.get('color_mode', 'color'),
        'compression_quality': data.get('compression_quality', 85)
    }
    
    try:
        scan_id = scanner_manager.start_scan(scanner_id, scan_params)
        
        logger.info(f"Scan started: {scan_id} on scanner {scanner_id}")
        socketio.emit('scan_started', {
            'scan_id': scan_id,
            'scanner_id': scanner_id,
            'timestamp': datetime.now().isoformat()
        })
        
        return jsonify({
            "scan_id": scan_id,
            "status": "scanning",
            "scanner_id": scanner_id,
            "timestamp": datetime.now().isoformat()
        }), 200
    except Exception as e:
        logger.error(f"Error starting scan: {str(e)}")
        return jsonify({"error": "Failed to start scan", "details": str(e)}), 500


@app.route('/api/scan/status', methods=['GET'])
@handle_errors
def get_scan_status():
    """Get current scan status"""
    status = scanner_manager.get_scan_status()
    return jsonify({
        "status": status,
        "timestamp": datetime.now().isoformat()
    }), 200


@app.route('/api/scan/<scan_id>', methods=['GET'])
@handle_errors
def get_scan_image(scan_id: str):
    """Get a specific scanned image"""
    try:
        image_path = scanner_manager.get_scan_image(scan_id)
        if not image_path or not os.path.exists(image_path):
            return jsonify({"error": "Scan not found"}), 404
        
        return send_file(image_path, mimetype='image/jpeg')
    except Exception as e:
        logger.error(f"Error retrieving scan: {str(e)}")
        return jsonify({"error": "Failed to retrieve scan", "details": str(e)}), 500


@app.route('/api/scan/<scan_id>/info', methods=['GET'])
@handle_errors
def get_scan_info(scan_id: str):
    """Get metadata about a scan"""
    try:
        info = scanner_manager.get_scan_info(scan_id)
        if not info:
            return jsonify({"error": "Scan not found"}), 404
        
        return jsonify({
            "scan": info,
            "timestamp": datetime.now().isoformat()
        }), 200
    except Exception as e:
        logger.error(f"Error getting scan info: {str(e)}")
        return jsonify({"error": "Failed to get scan info", "details": str(e)}), 500


@app.route('/api/scan/history', methods=['GET'])
@handle_errors
def get_scan_history():
    """Get scan history"""
    limit = request.args.get('limit', 50, type=int)
    try:
        history = scanner_manager.get_scan_history(limit)
        return jsonify({
            "history": history,
            "count": len(history),
            "timestamp": datetime.now().isoformat()
        }), 200
    except Exception as e:
        logger.error(f"Error getting scan history: {str(e)}")
        return jsonify({"error": "Failed to get scan history", "details": str(e)}), 500


@app.route('/api/scan/<scan_id>', methods=['DELETE'])
@handle_errors
def delete_scan(scan_id: str):
    """Delete a scanned image"""
    try:
        success = scanner_manager.delete_scan(scan_id)
        if not success:
            return jsonify({"error": "Scan not found"}), 404
        
        logger.info(f"Deleted scan: {scan_id}")
        socketio.emit('scan_deleted', {
            'scan_id': scan_id,
            'timestamp': datetime.now().isoformat()
        })
        
        return jsonify({
            "status": "deleted",
            "scan_id": scan_id,
            "timestamp": datetime.now().isoformat()
        }), 200
    except Exception as e:
        logger.error(f"Error deleting scan: {str(e)}")
        return jsonify({"error": "Failed to delete scan", "details": str(e)}), 500


# ============================================================================
# IMAGE PROCESSING ENDPOINTS
# ============================================================================

@app.route('/api/image/convert', methods=['POST'])
@handle_errors
def convert_image():
    """Convert image format"""
    data = request.get_json()
    scan_id = data.get('scan_id')
    target_format = data.get('format', 'jpeg')
    
    if not scan_id:
        return jsonify({"error": "scan_id is required"}), 400
    
    try:
        image_path = scanner_manager.get_scan_image(scan_id)
        if not image_path:
            return jsonify({"error": "Scan not found"}), 404
        
        converted_path = image_processor.convert_image(image_path, target_format)
        return send_file(converted_path, mimetype=f'image/{target_format}')
    except Exception as e:
        logger.error(f"Error converting image: {str(e)}")
        return jsonify({"error": "Failed to convert image", "details": str(e)}), 500


@app.route('/api/image/optimize', methods=['POST'])
@handle_errors
def optimize_image():
    """Optimize image (compress, resize, etc)"""
    data = request.get_json()
    scan_id = data.get('scan_id')
    quality = data.get('quality', 85)
    max_width = data.get('max_width', None)
    
    if not scan_id:
        return jsonify({"error": "scan_id is required"}), 400
    
    try:
        image_path = scanner_manager.get_scan_image(scan_id)
        if not image_path:
            return jsonify({"error": "Scan not found"}), 404
        
        optimized_path = image_processor.optimize_image(
            image_path,
            quality=quality,
            max_width=max_width
        )
        return send_file(optimized_path, mimetype='image/jpeg')
    except Exception as e:
        logger.error(f"Error optimizing image: {str(e)}")
        return jsonify({"error": "Failed to optimize image", "details": str(e)}), 500


# ============================================================================
# WEBSOCKET EVENTS
# ============================================================================

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    client_id = request.sid
    active_connections[client_id] = {
        'connected_at': datetime.now().isoformat(),
        'ip': request.remote_addr
    }
    logger.info(f"Client connected: {client_id}")
    emit('connected', {'client_id': client_id, 'timestamp': datetime.now().isoformat()})


@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    client_id = request.sid
    if client_id in active_connections:
        del active_connections[client_id]
    logger.info(f"Client disconnected: {client_id}")


@socketio.on('request_scanners')
def handle_request_scanners():
    """Handle scanner list request via WebSocket"""
    try:
        scanners = scanner_manager.list_scanners()
        emit('scanners_list', {
            'scanners': scanners,
            'count': len(scanners),
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error in request_scanners: {str(e)}")
        emit('error', {'message': 'Failed to get scanners', 'details': str(e)})


@socketio.on('request_status')
def handle_request_status():
    """Handle status request via WebSocket"""
    try:
        status = scanner_manager.get_scan_status()
        emit('status_update', {
            'status': status,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error in request_status: {str(e)}")
        emit('error', {'message': 'Failed to get status', 'details': str(e)})


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({"error": "Internal server error"}), 500


# ============================================================================
# INITIALIZATION
# ============================================================================

def init_app():
    """Initialize the application"""
    logger.info("Initializing Scanner Bridge Backend...")
    
    # Initialize scanner manager
    scanner_manager.initialize()
    logger.info("Scanner manager initialized")
    
    # Load configuration
    config_path = Path("../config/scanner.config.json")
    if config_path.exists():
        with open(config_path, 'r') as f:
            config = json.load(f)
            logger.info(f"Configuration loaded from {config_path}")
    else:
        logger.warning("Configuration file not found, using defaults")
    
    logger.info("Scanner Bridge Backend ready")


if __name__ == '__main__':
    init_app()
    
    # Run the application
    logger.info("Starting Flask application...")
    socketio.run(
        app,
        host='127.0.0.1',
        port=5000,
        debug=True,
        allow_unsafe_werkzeug=True
    )
