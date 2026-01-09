# Scanner Bridge - Troubleshooting Guide

## Common Issues and Solutions

### Scanner Not Detected

#### Windows

**Problem:** Scanner is not appearing in the scanner list.

**Solutions:**

1. **Check Driver Installation**
   - Open Device Manager (devmgmt.msc)
   - Look for your scanner under "Imaging devices"
   - If there's a yellow warning icon, update the driver

2. **Reinstall TWAIN/WIA Drivers**
   - Download latest drivers from manufacturer website
   - Uninstall current drivers
   - Restart computer
   - Install new drivers
   - Restart the Scanner Bridge service

3. **Check USB Connection**
   - Try different USB port
   - Use USB 2.0 port if available
   - Check cable for damage

4. **Restart Services**
   ```bash
   # Stop the backend service
   # Restart the backend service
   python app.py
   ```

#### Linux

**Problem:** Scanner not detected on Linux.

**Solutions:**

1. **Install SANE**
   ```bash
   sudo apt-get update
   sudo apt-get install sane-utils libusb-1.0-0 libusb-dev
   ```

2. **Add User to Scanner Group**
   ```bash
   sudo usermod -a -G scanner $USER
   # Log out and log back in for changes to take effect
   ```

3. **Test SANE**
   ```bash
   scanimage -A
   ```

4. **Check USB Permissions**
   ```bash
   ls -la /dev/bus/usb/*/
   ```

5. **Restart SANE Daemon**
   ```bash
   sudo systemctl restart saned
   ```

#### macOS

**Problem:** Scanner not detected on macOS.

**Solutions:**

1. **Check System Preferences**
   - Go to System Preferences > Printers & Scanners
   - Verify scanner appears in the list

2. **Restart Image Capture**
   ```bash
   killall -9 "Image Capture"
   ```

3. **Check USB Connection**
   - Try different USB port
   - Verify cable connection

4. **Update Scanner Firmware**
   - Visit manufacturer website
   - Download latest firmware
   - Follow manufacturer's update instructions

### Connection Issues

#### Backend Not Responding

**Problem:** "Cannot connect to backend" error.

**Solutions:**

1. **Verify Backend is Running**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Check Port 5000**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # Linux/macOS
   lsof -i :5000
   ```

3. **Kill Process Using Port 5000**
   ```bash
   # Windows
   taskkill /PID <PID> /F
   
   # Linux/macOS
   kill -9 <PID>
   ```

4. **Restart Backend**
   ```bash
   cd backend
   python app.py
   ```

#### Frontend Cannot Connect to Backend

**Problem:** Frontend shows connection error.

**Solutions:**

1. **Check CORS Configuration**
   - Verify `config/scanner.config.json` has correct CORS origins
   - Should include `http://localhost:3000`

2. **Check Firewall**
   - Ensure port 5000 is not blocked
   - Add exception for port 5000 if needed

3. **Check Backend Logs**
   - Look for error messages in backend console
   - Check `logs/scanner-bridge.log` if available

4. **Verify Frontend URL**
   - Frontend should be at `http://localhost:3000`
   - Check browser address bar

### Scan Operation Issues

#### Scan Fails to Complete

**Problem:** Scan starts but doesn't complete.

**Solutions:**

1. **Check Scanner Status**
   - Ensure scanner is not in use by another application
   - Check scanner display for error messages
   - Try scanning with manufacturer's software first

2. **Increase Timeout**
   - Edit `config/scanner.config.json`
   - Increase `timeout` value (default: 30 seconds)
   - Restart backend

3. **Check Disk Space**
   ```bash
   df -h
   ```
   - Ensure sufficient space in `./temp` and `./scans` directories

4. **Check Permissions**
   - Verify write permissions to `./temp` and `./scans` directories
   ```bash
   ls -la ./temp
   ls -la ./scans
   ```

#### Scan Quality Issues

**Problem:** Scanned images are too dark, too light, or low quality.

**Solutions:**

1. **Adjust Scanner Settings**
   - Use manufacturer's software to test different settings
   - Check brightness and contrast settings
   - Try different color modes

2. **Increase Resolution**
   - In the Scanner Bridge UI, select higher DPI
   - Note: Higher DPI = larger file size and longer scan time

3. **Adjust Compression Quality**
   - Edit `config/scanner.config.json`
   - Increase `compression_quality` (0-100, default: 85)
   - Restart backend

4. **Check Lighting**
   - Ensure good lighting on document
   - Avoid shadows on document

### Image Processing Issues

#### Image Conversion Fails

**Problem:** Cannot convert image to different format.

**Solutions:**

1. **Check PIL/Pillow Installation**
   ```bash
   cd backend
   python -c "from PIL import Image; print('PIL OK')"
   ```

2. **Reinstall PIL**
   ```bash
   pip install --upgrade Pillow
   ```

3. **Check File Permissions**
   - Verify write permissions to `./cache` directory

4. **Check Disk Space**
   - Ensure sufficient space for converted images

#### Image Optimization Too Slow

**Problem:** Image optimization takes too long.

**Solutions:**

1. **Reduce Image Size**
   - Scan at lower resolution
   - Use smaller paper size

2. **Reduce Quality**
   - Lower `compression_quality` in config
   - Trade-off: lower quality for faster processing

3. **Increase System Resources**
   - Close other applications
   - Ensure sufficient RAM available

### WebSocket Issues

#### Real-time Updates Not Working

**Problem:** WebSocket connection fails or updates not received.

**Solutions:**

1. **Check WebSocket Connection**
   - Open browser console (F12)
   - Look for WebSocket connection messages
   - Should see "WebSocket connected" message

2. **Check Firewall**
   - Ensure WebSocket port (5000) is not blocked
   - Some firewalls block WebSocket connections

3. **Check Browser Compatibility**
   - Use modern browser (Chrome, Firefox, Safari, Edge)
   - WebSocket requires modern browser

4. **Restart Services**
   - Restart backend
   - Refresh frontend page

### Performance Issues

#### Slow Scan Performance

**Problem:** Scanning takes too long.

**Solutions:**

1. **Reduce Resolution**
   - Lower DPI setting
   - Faster scan, smaller file

2. **Use Faster Color Mode**
   - Black & White is fastest
   - Grayscale is faster than Color

3. **Check System Resources**
   - Close other applications
   - Check CPU and memory usage
   - Ensure sufficient disk space

4. **Check Scanner**
   - Some scanners are inherently slower
   - Check manufacturer specifications
   - Ensure scanner is not overheating

#### High Memory Usage

**Problem:** Backend uses too much memory.

**Solutions:**

1. **Clear Cache**
   - Delete old files in `./cache` directory
   - Backend will recreate as needed

2. **Reduce Cache Size**
   - Edit `config/scanner.config.json`
   - Reduce `max_cache_size` value

3. **Restart Backend**
   - Backend memory usage resets on restart

4. **Check for Memory Leaks**
   - Monitor memory usage over time
   - Report issue if memory keeps increasing

### Docker Issues

#### Container Won't Start

**Problem:** Docker container fails to start.

**Solutions:**

1. **Check Docker Logs**
   ```bash
   docker logs scanner-bridge
   ```

2. **Check Port Availability**
   ```bash
   docker ps -a
   # Look for port conflicts
   ```

3. **Rebuild Image**
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up
   ```

4. **Check Disk Space**
   - Ensure sufficient disk space for Docker
   - Run `docker system prune` to clean up

#### Scanner Not Available in Docker

**Problem:** Scanner not detected when running in Docker.

**Solutions:**

1. **Check Device Mapping**
   - Verify `docker-compose.yml` includes device mappings:
   ```yaml
   devices:
     - /dev/usb:/dev/usb
     - /dev/bus/usb:/dev/bus/usb
   ```

2. **Check USB Permissions**
   - May need to run Docker with elevated permissions
   - On Linux: `sudo docker-compose up`

3. **Check Scanner Connection**
   - Verify scanner is connected to host machine
   - Not all USB devices work in Docker containers

### Development Issues

#### TypeScript Compilation Errors

**Problem:** Frontend won't compile due to TypeScript errors.

**Solutions:**

1. **Check Node Version**
   ```bash
   node --version
   # Should be 16 or higher
   ```

2. **Reinstall Dependencies**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check TypeScript Configuration**
   - Verify `tsconfig.json` is correct
   - Run `npm run type-check`

#### Python Import Errors

**Problem:** Backend fails with import errors.

**Solutions:**

1. **Check Python Version**
   ```bash
   python --version
   # Should be 3.8 or higher
   ```

2. **Reinstall Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt --force-reinstall
   ```

3. **Check Virtual Environment**
   ```bash
   # Deactivate current environment
   deactivate
   
   # Remove and recreate
   rm -rf venv
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

### Getting Help

If you encounter an issue not listed here:

1. **Check Logs**
   - Backend logs in console or `logs/scanner-bridge.log`
   - Frontend logs in browser console (F12)

2. **Enable Debug Mode**
   - Set `LOG_LEVEL=DEBUG` in environment
   - Provides more detailed logging

3. **Test with Manufacturer Software**
   - Verify scanner works with official software
   - Helps isolate whether issue is with scanner or Scanner Bridge

4. **Report Issue**
   - Open GitHub issue with:
     - Operating system and version
     - Scanner model and driver version
     - Error messages and logs
     - Steps to reproduce

### Performance Optimization Tips

1. **Use Appropriate Resolution**
   - 300 DPI is standard for documents
   - 600 DPI for fine details
   - 75 DPI for quick previews

2. **Choose Right Color Mode**
   - Black & White for text documents
   - Grayscale for mixed content
   - Color only when necessary

3. **Optimize Image Format**
   - JPEG for photographs
   - PNG for graphics
   - TIFF for archival

4. **Regular Maintenance**
   - Clean scanner glass regularly
   - Update drivers periodically
   - Clear cache directory occasionally

5. **System Optimization**
   - Close unnecessary applications
   - Ensure good disk performance
   - Monitor system resources
