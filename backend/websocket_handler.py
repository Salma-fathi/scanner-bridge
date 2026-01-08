"""
WebSocket Handler - Manages real-time communication with clients
"""

import logging
from datetime import datetime
from typing import Dict, Any

logger = logging.getLogger(__name__)


class WebSocketHandler:
    """Handles WebSocket connections and events"""
    
    def __init__(self, socketio):
        """Initialize WebSocket handler"""
        self.socketio = socketio
        self.connections: Dict[str, Dict[str, Any]] = {}
    
    def register_connection(self, client_id: str, metadata: Dict[str, Any] = None):
        """Register a new connection"""
        self.connections[client_id] = {
            'connected_at': datetime.now().isoformat(),
            'metadata': metadata or {},
            'subscriptions': []
        }
        logger.info(f"Registered connection: {client_id}")
    
    def unregister_connection(self, client_id: str):
        """Unregister a connection"""
        if client_id in self.connections:
            del self.connections[client_id]
            logger.info(f"Unregistered connection: {client_id}")
    
    def broadcast_scanner_update(self, scanners: list):
        """Broadcast scanner list update to all clients"""
        try:
            self.socketio.emit('scanners_updated', {
                'scanners': scanners,
                'timestamp': datetime.now().isoformat()
            }, broadcast=True)
            logger.info("Broadcasted scanner update")
        except Exception as e:
            logger.error(f"Error broadcasting scanner update: {str(e)}")
    
    def broadcast_scan_started(self, scan_id: str, scanner_id: str):
        """Broadcast scan started event"""
        try:
            self.socketio.emit('scan_started', {
                'scan_id': scan_id,
                'scanner_id': scanner_id,
                'timestamp': datetime.now().isoformat()
            }, broadcast=True)
            logger.info(f"Broadcasted scan started: {scan_id}")
        except Exception as e:
            logger.error(f"Error broadcasting scan started: {str(e)}")
    
    def broadcast_scan_progress(self, scan_id: str, progress: int, status: str):
        """Broadcast scan progress update"""
        try:
            self.socketio.emit('scan_progress', {
                'scan_id': scan_id,
                'progress': progress,
                'status': status,
                'timestamp': datetime.now().isoformat()
            }, broadcast=True)
            logger.debug(f"Broadcasted scan progress: {scan_id} - {progress}%")
        except Exception as e:
            logger.error(f"Error broadcasting scan progress: {str(e)}")
    
    def broadcast_scan_completed(self, scan_id: str, image_path: str, file_size: int):
        """Broadcast scan completed event"""
        try:
            self.socketio.emit('scan_completed', {
                'scan_id': scan_id,
                'image_path': image_path,
                'file_size': file_size,
                'timestamp': datetime.now().isoformat()
            }, broadcast=True)
            logger.info(f"Broadcasted scan completed: {scan_id}")
        except Exception as e:
            logger.error(f"Error broadcasting scan completed: {str(e)}")
    
    def broadcast_scan_error(self, scan_id: str, error_message: str):
        """Broadcast scan error event"""
        try:
            self.socketio.emit('scan_error', {
                'scan_id': scan_id,
                'error': error_message,
                'timestamp': datetime.now().isoformat()
            }, broadcast=True)
            logger.error(f"Broadcasted scan error: {scan_id} - {error_message}")
        except Exception as e:
            logger.error(f"Error broadcasting scan error: {str(e)}")
    
    def broadcast_scanner_selected(self, scanner_id: str):
        """Broadcast scanner selected event"""
        try:
            self.socketio.emit('scanner_selected', {
                'scanner_id': scanner_id,
                'timestamp': datetime.now().isoformat()
            }, broadcast=True)
            logger.info(f"Broadcasted scanner selected: {scanner_id}")
        except Exception as e:
            logger.error(f"Error broadcasting scanner selected: {str(e)}")
    
    def send_to_client(self, client_id: str, event: str, data: Dict[str, Any]):
        """Send event to specific client"""
        try:
            self.socketio.emit(event, data, to=client_id)
            logger.debug(f"Sent event to client {client_id}: {event}")
        except Exception as e:
            logger.error(f"Error sending to client {client_id}: {str(e)}")
    
    def get_connection_count(self) -> int:
        """Get number of active connections"""
        return len(self.connections)
    
    def get_connections(self) -> Dict[str, Dict[str, Any]]:
        """Get all active connections"""
        return self.connections.copy()
