# 🚀 Scanner Bridge - 🇸🇩 Sudanese Dev Challenge

## 🇸🇩 Scanner Bridge v1.0:
Scanner Bridge is a high-performance, local-first integration tool designed specifically for the Sudanese technical landscape. It eliminates the "7-step scan-and-upload" headache, replacing it with a seamless, one-click experience directly within the browser.

### ✨ Key Features (Designed for the Challenge)

- **True Local-First**: 0% Cloud dependency. Works perfectly in offline environments or behind restricted networks.
- **Reactive HI (Human Interface)**: A state-of-the-art React dashboard that provides real-time hardware status and instant image rendering.
- **Universal Bridge**: Built to communicate with any TWAIN/WIA compliant scanner via a lightweight local socket.
- **Optimized for Performance**: Automatic image compression ($WebP/JPEG$) to ensure the browser remains fast even with high-DPI scans.

### 🏗️ The Technical Architecture (The Winning Edge)

To satisfy the judges, your project must follow this robust structure:

1. **The Frontend (React + Tailwind)**: Handles the user's intent and displays the results.
2. **The Local Agent (Node.js/Python)**: The "Muscle." It stays in the system tray, talks to the scanner drivers, and serves a local WebSocket/HTTP server.
3. **The Bridge**: Data is passed as a Base64 String or Blob URL, ensuring the file "appears" in the form without a manual upload.

### 🤖 Final Cursor Prompt (The "Polishing" Phase)

Use this prompt in Cursor (Cmd+K / Ctrl+K) on your main React file to reach the "Final Version" quality:

"Refactor this React application into a production-ready Scanner Dashboard.

1. **UI/UX Excellence**: 
   - Implement a Bento Box layout using Tailwind CSS.
   - Create a 'Status Bar' at the top with a pulsing green light when the local agent is detected.
   - Add a 'Scan History' sidebar that stores thumbnails of the current session using localStorage.

2. **Advanced Components**:
   - Use Framer Motion for a 'Slide-in' animation when a new scan arrives.
   - Build a 'Image Actions' overlay on the preview (Rotate, Flip, Delete).
   - Implement a 'Glassmorphism' effect for the settings panel.

3. **Error Resilience**:
   - Create a beautiful 'Empty State' with a Sudanese-themed illustration or a clean icon if no scanner is found.
   - Add a 'Troubleshooting' tooltip that guides the user to check their USB connection.

4. **Code Quality**:
   - Clean up all console logs.
   - Use TypeScript-like prop definitions for clarity.
   - Ensure all colors follow a professional 'Midnight & Emerald' theme."

### 📝 Project Setup

1. **Clone the repository**
2. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   ```
3. **Run Frontend**:
   ```bash
   npm start
   ```
4. **Setup Backend**:
   - Ensure Python 3.x is installed.
   - Install dependencies in `backend/requirements.txt`.
   - Run `python app.py`.

---
*Built with ❤️ for Sudan's Digital Future.*
