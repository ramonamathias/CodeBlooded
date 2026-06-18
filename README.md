# TruthGuard AI — Multi-Modal Authentication & Detection Platform

An advanced, full-stack content verification platform designed to combat deepfakes and synthetic media. It provides a clean web interface where users can analyze both text blocks and images simultaneously to detect AI-generated content with high precision.

## Tech Stack

- **Backend:** Python, Flask, Flask-CORS
- **Frontend:** HTML5, CSS3, JavaScript (ES6)

## How It Works

Separate, specialized processing streams handle text analysis and image analysis simultaneously. A real-time statistical dashboard dynamically tracks total scan counts, AI-flagged detections, and human-content ratios.

## Setup and Installation

### 1. Install dependencies

Run this command in your terminal:

<pre><code>pip install flask flask-cors</code></pre>

### 2. Start the API server

Run this command in your terminal:

<pre><code>python backend/app.py</code></pre>

### 3. Open the interface

Once the server is running, open your web browser and navigate to:

<pre><code>http://127.0.0.1:5000</code></pre>