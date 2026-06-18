# TruthGuard AI — Multi-Modal Authentication & Detection Platform

TruthGuard AI is an advanced, full-stack content verification platform designed to combat deepfakes and synthetic media. It provides a clean web interface where users can analyze both text blocks and images simultaneously to detect AI-generated content with high precision.

## Key Features
- **Multi-Modal Analysis:** Separate, specialized processing streams for text analysis and image analysis.
- **Real-Time Statistical Dashboard:** Tracks total scan counts, AI-flagged detections, and human-content ratios dynamically.
- **High-Accuracy Engine:** Out-of-the-box algorithmic or model-driven evaluation layer boasting high calibration accuracy.
- **Lightweight Architecture:** Quick Python-based Flask backend serving a responsive, native frontend.

## Tech Stack
- **Backend:** Python, Flask, Flask-CORS
- **Frontend:** HTML5, CSS3, JavaScript (ES6)

## Getting Started

### 1. Install Dependencies
Run this command in your terminal to install the core server packages:

```bash
pip install flask flask-cors
2. Start the Application
Navigate into the backend directory and spin up the development server:

Bash
cd backend
python app.py
3. Open the Interface
Once the server is running, open your web browser and navigate to:
http://127.0.0.1:5000