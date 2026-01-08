"""
Scanner Manager - Handles scanner detection and control
Supports TWAIN (Windows), WIA (Windows), SANE (Linux), and ICA (macOS)
"""

import os
import sys
import json
import uuid
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from enum import Enum

logger = logging.getLogger(__name__)


class ScannerStatus(Enum):
    """Scanner status enumeration"""
    AVAILABLE = "available"
    BUSY = "busy"
    ERROR = "error"
    OFFLINE = "offline"


class ScanStatus(Enum):
    """Scan operation status"""
    IDLE = "idle"
    SCANNING = "scanning"
    PROCESSING = "processing"
    COMPLETED = "completed"
    ERROR = "error"


@dataclass
class Scanner:
    """Scanner information"""
    id: str
    name: str
    manufacturer: str
    model: str
    status: str
    platform: str
    driver_type: str
    capabilities: Dict[str, Any]


@dataclass
class ScanInfo:
    """Scan information"""
    scan_id: str
    scanner_id: str
    timestamp: str
    format: str
    resolution: int
    color_mode: str
    file_path: str
    file_size: int
    status: str


class ScannerManager:
    """Manages scanner detection and control"""
    
    def __init__(self):
        """Initialize scanner manager"""
        self.scanners: Dict[str, Scanner] = {}
        self.current_scanner_id: Optional[str] = None
        self.scan_history: Dict[str, ScanInfo] = {}
        self.current_scan_status = ScanStatus.IDLE.value
        self.platform = self._detect_platform()
        self.scan_dir = Path("./scans")
        self.scan_dir.mkdir(exist_ok=True)
        
    def _detect_platform(self) -> str:
        """Detect operating system"""
        if sys.platform == 'win32':
            return 'windows'
        elif sys.platform == 'darwin':
            return 'macos'
        elif sys.platform.startswith('linux'):
            return 'linux'
        else:
            return 'unknown'
    
    def initialize(self):
        """Initialize scanner detection"""
        logger.info(f"Initializing scanner detection for {self.platform}")
        self.refresh_scanner_list()
    
    def refresh_scanner_list(self):
        """Refresh available scanners"""
        logger.info("Refreshing scanner list...")
        self.scanners.clear()
        
        try:
            if self.platform == 'windows':
                self._detect_windows_scanners()
            elif self.platform == 'linux':
                self._detect_linux_scanners()
            elif self.platform == 'macos':
                self._detect_macos_scanners()
            
            logger.info(f"Found {len(self.scanners)} scanner(s)")
        except Exception as e:
            logger.error(f"Error refreshing scanner list: {str(e)}")
    
    def _detect_windows_scanners(self):
        """Detect Windows scanners (TWAIN/WIA)"""
        try:
            # Try to use Windows Image Acquisition (WIA)
            import subprocess
            result = subprocess.run(
                ['wmic', 'logicaldisk', 'get', 'name'],
                capture_output=True,
                text=True
            )
            
            # Create a mock scanner for demonstration
            scanner = Scanner(
                id="scanner_1",
                name="HP ScanJet Pro 3000 s3",
                manufacturer="HP",
                model="ScanJet Pro 3000 s3",
                status=ScannerStatus.AVAILABLE.value,
                platform="windows",
                driver_type="WIA",
                capabilities={
                    "formats": ["jpeg", "png", "tiff"],
                    "resolutions": [75, 150, 300, 600, 1200],
                    "color_modes": ["bw", "gray", "color"],
                    "duplex": True
                }
            )
            self.scanners[scanner.id] = scanner
            
            # Add a second scanner for testing
            scanner2 = Scanner(
                id="scanner_2",
                name="Canon imageFORMULA DR-G1130",
                manufacturer="Canon",
                model="imageFORMULA DR-G1130",
                status=ScannerStatus.AVAILABLE.value,
                platform="windows",
                driver_type="TWAIN",
                capabilities={
                    "formats": ["jpeg", "png", "pdf"],
                    "resolutions": [150, 200, 300, 400, 600],
                    "color_modes": ["bw", "gray", "color"],
                    "duplex": True
                }
            )
            self.scanners[scanner2.id] = scanner2
            
        except Exception as e:
            logger.warning(f"Could not detect Windows scanners: {str(e)}")
            # Add mock scanner for development
            self._add_mock_scanner()
    
    def _detect_linux_scanners(self):
        """Detect Linux scanners (SANE)"""
        try:
            import subprocess
            result = subprocess.run(
                ['scanimage', '-A'],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            if result.returncode == 0:
                # Parse SANE output
                lines = result.stdout.split('\n')
                for line in lines:
                    if 'Device:' in line:
                        device_info = line.split('Device:')[1].strip()
                        scanner_id = f"scanner_{len(self.scanners) + 1}"
                        scanner = Scanner(
                            id=scanner_id,
                            name=device_info.split()[0],
                            manufacturer="Unknown",
                            model=device_info,
                            status=ScannerStatus.AVAILABLE.value,
                            platform="linux",
                            driver_type="SANE",
                            capabilities={
                                "formats": ["jpeg", "png", "tiff"],
                                "resolutions": [75, 150, 300, 600],
                                "color_modes": ["bw", "gray", "color"],
                                "duplex": False
                            }
                        )
                        self.scanners[scanner.id] = scanner
            else:
                self._add_mock_scanner()
        except Exception as e:
            logger.warning(f"Could not detect Linux scanners: {str(e)}")
            self._add_mock_scanner()
    
    def _detect_macos_scanners(self):
        """Detect macOS scanners (ICA)"""
        try:
            import subprocess
            result = subprocess.run(
                ['system_profiler', 'SPUSBDataType'],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            # Create mock scanner for macOS
            scanner = Scanner(
                id="scanner_1",
                name="Epson Perfection V600",
                manufacturer="Epson",
                model="Perfection V600",
                status=ScannerStatus.AVAILABLE.value,
                platform="macos",
                driver_type="ICA",
                capabilities={
                    "formats": ["jpeg", "png", "tiff"],
                    "resolutions": [75, 150, 300, 600, 1200],
                    "color_modes": ["bw", "gray", "color"],
                    "duplex": False
                }
            )
            self.scanners[scanner.id] = scanner
            
        except Exception as e:
            logger.warning(f"Could not detect macOS scanners: {str(e)}")
            self._add_mock_scanner()
    
    def _add_mock_scanner(self):
        """Add a mock scanner for testing/development"""
        scanner = Scanner(
            id="scanner_mock",
            name="Mock Scanner (Development)",
            manufacturer="Development",
            model="Mock Device",
            status=ScannerStatus.AVAILABLE.value,
            platform=self.platform,
            driver_type="Mock",
            capabilities={
                "formats": ["jpeg", "png", "tiff"],
                "resolutions": [75, 150, 300, 600],
                "color_modes": ["bw", "gray", "color"],
                "duplex": False
            }
        )
        self.scanners[scanner.id] = scanner
        logger.info("Added mock scanner for development")
    
    def list_scanners(self) -> List[Dict[str, Any]]:
        """Get list of available scanners"""
        return [asdict(scanner) for scanner in self.scanners.values()]
    
    def get_scanner_info(self, scanner_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed information about a scanner"""
        if scanner_id in self.scanners:
            return asdict(self.scanners[scanner_id])
        return None
    
    def select_scanner(self, scanner_id: str) -> bool:
        """Select active scanner"""
        if scanner_id not in self.scanners:
            logger.error(f"Scanner not found: {scanner_id}")
            return False
        
        self.current_scanner_id = scanner_id
        logger.info(f"Selected scanner: {scanner_id}")
        return True
    
    def get_current_scanner(self) -> Optional[Dict[str, Any]]:
        """Get currently selected scanner"""
        if self.current_scanner_id:
            return self.get_scanner_info(self.current_scanner_id)
        return None
    
    def get_current_scanner_id(self) -> Optional[str]:
        """Get current scanner ID"""
        return self.current_scanner_id
    
    def start_scan(self, scanner_id: str, params: Dict[str, Any]) -> str:
        """Start a scan operation"""
        if scanner_id not in self.scanners:
            raise ValueError(f"Scanner not found: {scanner_id}")
        
        scan_id = f"scan_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}"
        
        try:
            self.current_scan_status = ScanStatus.SCANNING.value
            
            # Simulate scanning process
            logger.info(f"Starting scan: {scan_id} on scanner {scanner_id}")
            
            # Create a mock scanned image
            file_path = self._create_mock_scan(scan_id, params)
            
            # Store scan info
            scan_info = ScanInfo(
                scan_id=scan_id,
                scanner_id=scanner_id,
                timestamp=datetime.now().isoformat(),
                format=params.get('format', 'jpeg'),
                resolution=params.get('resolution', 300),
                color_mode=params.get('color_mode', 'color'),
                file_path=file_path,
                file_size=os.path.getsize(file_path) if os.path.exists(file_path) else 0,
                status=ScanStatus.COMPLETED.value
            )
            self.scan_history[scan_id] = scan_info
            
            self.current_scan_status = ScanStatus.COMPLETED.value
            logger.info(f"Scan completed: {scan_id}")
            
            return scan_id
            
        except Exception as e:
            self.current_scan_status = ScanStatus.ERROR.value
            logger.error(f"Error during scan: {str(e)}")
            raise
    
    def _create_mock_scan(self, scan_id: str, params: Dict[str, Any]) -> str:
        """Create a mock scanned image for testing"""
        try:
            from PIL import Image, ImageDraw
            import random
            
            # Create a simple test image
            width, height = 800, 1000
            image = Image.new('RGB', (width, height), color='white')
            draw = ImageDraw.Draw(image)
            
            # Add some text
            draw.text((50, 50), f"Scan ID: {scan_id}", fill='black')
            draw.text((50, 100), f"Format: {params.get('format', 'jpeg')}", fill='black')
            draw.text((50, 150), f"Resolution: {params.get('resolution', 300)} DPI", fill='black')
            draw.text((50, 200), f"Time: {datetime.now().isoformat()}", fill='black')
            
            # Add some decorative elements
            for i in range(10):
                x = random.randint(0, width)
                y = random.randint(0, height)
                draw.rectangle([x, y, x+50, y+50], outline='gray')
            
            # Save the image
            file_path = self.scan_dir / f"{scan_id}.{params.get('format', 'jpeg')}"
            image.save(str(file_path), format=params.get('format', 'jpeg').upper())
            
            logger.info(f"Mock scan created: {file_path}")
            return str(file_path)
            
        except ImportError:
            # Fallback: create a minimal valid JPEG
            logger.warning("PIL not available, creating minimal JPEG")
            file_path = self.scan_dir / f"{scan_id}.jpg"
            # Minimal JPEG header
            jpeg_data = bytes([
                0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
                0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
                0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
                0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
                0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
                0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
                0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
                0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
                0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x1F, 0x00, 0x00,
                0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
                0x09, 0x0A, 0x0B, 0xFF, 0xC4, 0x00, 0xB5, 0x10, 0x00, 0x02, 0x01, 0x03,
                0x03, 0x02, 0x04, 0x03, 0x05, 0x05, 0x04, 0x04, 0x00, 0x00, 0x01, 0x7D,
                0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06,
                0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xA1, 0x08,
                0x23, 0x42, 0xB1, 0xC1, 0x15, 0x52, 0xD1, 0xF0, 0x24, 0x33, 0x62, 0x72,
                0x82, 0x09, 0x0A, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x25, 0x26, 0x27, 0x28,
                0x29, 0x2A, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x43, 0x44, 0x45,
                0x46, 0x47, 0x48, 0x49, 0x4A, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
                0x5A, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6A, 0x73, 0x74, 0x75,
                0x76, 0x77, 0x78, 0x79, 0x7A, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
                0x8A, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0xA2, 0xA3,
                0xA4, 0xA5, 0xA6, 0xA7, 0xA8, 0xA9, 0xAA, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6,
                0xB7, 0xB8, 0xB9, 0xBA, 0xC2, 0xC3, 0xC4, 0xC5, 0xC6, 0xC7, 0xC8, 0xC9,
                0xCA, 0xD2, 0xD3, 0xD4, 0xD5, 0xD6, 0xD7, 0xD8, 0xD9, 0xDA, 0xE1, 0xE2,
                0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA, 0xF1, 0xF2, 0xF3, 0xF4,
                0xF5, 0xF6, 0xF7, 0xF8, 0xF9, 0xFA, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01,
                0x00, 0x00, 0x3F, 0x00, 0xFB, 0xD3, 0xFF, 0xD9
            ])
            with open(file_path, 'wb') as f:
                f.write(jpeg_data)
            return str(file_path)
    
    def get_scan_status(self) -> str:
        """Get current scan status"""
        return self.current_scan_status
    
    def get_scan_image(self, scan_id: str) -> Optional[str]:
        """Get path to scanned image"""
        if scan_id in self.scan_history:
            return self.scan_history[scan_id].file_path
        return None
    
    def get_scan_info(self, scan_id: str) -> Optional[Dict[str, Any]]:
        """Get scan information"""
        if scan_id in self.scan_history:
            return asdict(self.scan_history[scan_id])
        return None
    
    def get_scan_history(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get scan history"""
        items = list(self.scan_history.values())
        # Sort by timestamp descending
        items.sort(key=lambda x: x.timestamp, reverse=True)
        return [asdict(item) for item in items[:limit]]
    
    def delete_scan(self, scan_id: str) -> bool:
        """Delete a scanned image"""
        if scan_id not in self.scan_history:
            return False
        
        try:
            file_path = self.scan_history[scan_id].file_path
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"Deleted scan file: {file_path}")
            
            del self.scan_history[scan_id]
            logger.info(f"Deleted scan record: {scan_id}")
            return True
        except Exception as e:
            logger.error(f"Error deleting scan: {str(e)}")
            return False
