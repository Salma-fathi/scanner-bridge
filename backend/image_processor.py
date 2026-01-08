"""
Image Processor - Handles image conversion and optimization
"""

import os
import logging
from pathlib import Path
from typing import Optional
from datetime import datetime

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

logger = logging.getLogger(__name__)


class ImageProcessor:
    """Handles image processing operations"""
    
    def __init__(self):
        """Initialize image processor"""
        self.cache_dir = Path("./cache")
        self.cache_dir.mkdir(exist_ok=True)
        self.supported_formats = ['jpeg', 'jpg', 'png', 'tiff', 'bmp', 'gif']
    
    def convert_image(self, source_path: str, target_format: str) -> str:
        """Convert image to target format"""
        if not HAS_PIL:
            logger.warning("PIL not available, returning original image")
            return source_path
        
        try:
            source_path = str(source_path)
            if not os.path.exists(source_path):
                raise FileNotFoundError(f"Source file not found: {source_path}")
            
            # Normalize format
            target_format = target_format.lower().replace('.', '')
            if target_format not in self.supported_formats:
                raise ValueError(f"Unsupported format: {target_format}")
            
            # Open image
            image = Image.open(source_path)
            
            # Convert RGBA to RGB if needed
            if image.mode == 'RGBA' and target_format in ['jpeg', 'jpg']:
                background = Image.new('RGB', image.size, (255, 255, 255))
                background.paste(image, mask=image.split()[3])
                image = background
            elif image.mode not in ['RGB', 'L', '1']:
                image = image.convert('RGB')
            
            # Generate output path
            output_path = self.cache_dir / f"{Path(source_path).stem}_converted.{target_format}"
            
            # Save in target format
            save_kwargs = {}
            if target_format in ['jpeg', 'jpg']:
                save_kwargs['quality'] = 85
                save_kwargs['optimize'] = True
            
            image.save(str(output_path), format=target_format.upper(), **save_kwargs)
            logger.info(f"Image converted: {source_path} -> {output_path}")
            
            return str(output_path)
            
        except Exception as e:
            logger.error(f"Error converting image: {str(e)}")
            raise
    
    def optimize_image(
        self,
        source_path: str,
        quality: int = 85,
        max_width: Optional[int] = None,
        max_height: Optional[int] = None
    ) -> str:
        """Optimize image (compress, resize, etc)"""
        if not HAS_PIL:
            logger.warning("PIL not available, returning original image")
            return source_path
        
        try:
            source_path = str(source_path)
            if not os.path.exists(source_path):
                raise FileNotFoundError(f"Source file not found: {source_path}")
            
            # Open image
            image = Image.open(source_path)
            
            # Convert to RGB if needed
            if image.mode == 'RGBA':
                background = Image.new('RGB', image.size, (255, 255, 255))
                background.paste(image, mask=image.split()[3])
                image = background
            elif image.mode not in ['RGB', 'L', '1']:
                image = image.convert('RGB')
            
            # Resize if needed
            if max_width or max_height:
                max_width = max_width or image.width
                max_height = max_height or image.height
                image.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
            
            # Generate output path
            output_path = self.cache_dir / f"{Path(source_path).stem}_optimized.jpg"
            
            # Save optimized image
            image.save(
                str(output_path),
                format='JPEG',
                quality=quality,
                optimize=True
            )
            
            logger.info(f"Image optimized: {source_path} -> {output_path}")
            return str(output_path)
            
        except Exception as e:
            logger.error(f"Error optimizing image: {str(e)}")
            raise
    
    def rotate_image(self, source_path: str, angle: int) -> str:
        """Rotate image by specified angle"""
        if not HAS_PIL:
            logger.warning("PIL not available, returning original image")
            return source_path
        
        try:
            source_path = str(source_path)
            if not os.path.exists(source_path):
                raise FileNotFoundError(f"Source file not found: {source_path}")
            
            image = Image.open(source_path)
            rotated = image.rotate(angle, expand=True)
            
            output_path = self.cache_dir / f"{Path(source_path).stem}_rotated.jpg"
            rotated.save(str(output_path), format='JPEG', quality=85)
            
            logger.info(f"Image rotated: {source_path} -> {output_path}")
            return str(output_path)
            
        except Exception as e:
            logger.error(f"Error rotating image: {str(e)}")
            raise
    
    def crop_image(
        self,
        source_path: str,
        left: int,
        top: int,
        right: int,
        bottom: int
    ) -> str:
        """Crop image to specified bounds"""
        if not HAS_PIL:
            logger.warning("PIL not available, returning original image")
            return source_path
        
        try:
            source_path = str(source_path)
            if not os.path.exists(source_path):
                raise FileNotFoundError(f"Source file not found: {source_path}")
            
            image = Image.open(source_path)
            cropped = image.crop((left, top, right, bottom))
            
            output_path = self.cache_dir / f"{Path(source_path).stem}_cropped.jpg"
            cropped.save(str(output_path), format='JPEG', quality=85)
            
            logger.info(f"Image cropped: {source_path} -> {output_path}")
            return str(output_path)
            
        except Exception as e:
            logger.error(f"Error cropping image: {str(e)}")
            raise
    
    def get_image_info(self, image_path: str) -> dict:
        """Get image information"""
        if not HAS_PIL:
            return {"error": "PIL not available"}
        
        try:
            image_path = str(image_path)
            if not os.path.exists(image_path):
                raise FileNotFoundError(f"Image not found: {image_path}")
            
            image = Image.open(image_path)
            file_stat = os.stat(image_path)
            
            return {
                "width": image.width,
                "height": image.height,
                "format": image.format,
                "mode": image.mode,
                "size_bytes": file_stat.st_size,
                "size_mb": round(file_stat.st_size / (1024 * 1024), 2),
                "dpi": image.info.get('dpi', (72, 72)),
                "created": datetime.fromtimestamp(file_stat.st_ctime).isoformat(),
                "modified": datetime.fromtimestamp(file_stat.st_mtime).isoformat()
            }
        except Exception as e:
            logger.error(f"Error getting image info: {str(e)}")
            return {"error": str(e)}
    
    def cleanup_cache(self, max_age_hours: int = 24):
        """Clean up old cached images"""
        try:
            import time
            current_time = time.time()
            max_age_seconds = max_age_hours * 3600
            
            deleted_count = 0
            for file_path in self.cache_dir.glob('*'):
                if file_path.is_file():
                    file_age = current_time - file_path.stat().st_mtime
                    if file_age > max_age_seconds:
                        file_path.unlink()
                        deleted_count += 1
            
            logger.info(f"Cache cleanup: deleted {deleted_count} files")
            return deleted_count
            
        except Exception as e:
            logger.error(f"Error cleaning cache: {str(e)}")
            return 0
