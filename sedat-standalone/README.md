# Fahrschule Sedat - Standalone Installation

## 📋 Requirements
- Node.js version 18 or higher
- Download from: https://nodejs.org/

## 🚀 How to Run

### Option 1: Double-click
Simply double-click `start.bat` and the site will open at http://localhost:3000

### Option 2: Manual start
Open Command Prompt or PowerShell in this folder and run:
```bash
node server.js
```

Then open your browser at: http://localhost:3000

## 🛑 How to Stop
Press `Ctrl+C` in the terminal window

## 📱 Access from Phone
1. Make sure your computer and phone are on the same WiFi
2. Find your computer's IP address:
   - Open Command Prompt
   - Run: `ipconfig`
   - Look for "IPv4 Address" (usually starts with 192.168.x.x)
3. On your phone, open browser and go to: `http://YOUR_IP:3000`

## ℹ️ Info
This is a standalone Next.js build. All necessary files are included.
No installation or `npm install` required!

## 🔧 Troubleshooting
- **"node is not recognized"**: Install Node.js from nodejs.org
- **Port 3000 already in use**: Change port by editing server.js (line with PORT=3000)
- **Site not loading**: Check firewall settings or try http://127.0.0.1:3000
