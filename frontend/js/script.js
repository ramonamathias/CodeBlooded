// Initialize Socket.IO connection
const socket = io();
let currentMode = 'text';
let analysisCount = 0;

// Socket event handlers
socket.on('connect', function() {
  console.log('Connected to server');
  document.getElementById('connectionStatus').className = 'h-2 w-2 rounded-full bg-green-400';
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
  document.getElementById('connectionStatus').className = 'h-2 w-2 rounded-full bg-red-400';
});

socket.on('detection_update', function(data) {
  updateRecentResults(data);
});

// Mode switching
function toggleMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(mode + 'Btn').classList.add('active');
  document.querySelectorAll('.detection-mode').forEach(div => {
    div.classList.remove('active');
    div.classList.add('hidden');
  });
  document.getElementById(mode + 'Mode').classList.remove('hidden');
  document.getElementById(mode + 'Mode').classList.add('active');
}

// Text analysis
function analyzeText() {
  const text = document.getElementById('textInput').value.trim();
  if (!text) {
    alert('Please enter some text to analyze');
    return;
  }

  const btn = document.getElementById('analyzeTextBtn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Analyzing...';
  btn.disabled = true;

  fetch('/api/detect-text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text })
  })
  .then(response => response.json())
  .then(data => {
    displayTextResults(data);
    analysisCount++;
    document.getElementById('todayCount').textContent = analysisCount;
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error analyzing text. Please try again.');
  })
  .finally(() => {
    btn.innerHTML = '<i class="fas fa-brain mr-2"></i>Analyze Text';
    btn.disabled = false;
  });
}

// Image analysis
function analyzeImage() {
  const imageInput = document.getElementById('imageInput');
  const file = imageInput.files[0];
  if (!file) {
    alert('Please select an image to analyze');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const btn = document.getElementById('analyzeImageBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Analyzing...';
    btn.disabled = true;

    fetch('/api/detect-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: e.target.result })
    })
    .then(response => response.json())
    .then(data => {
      displayImageResults(data);
      analysisCount++;
      document.getElementById('todayCount').textContent = analysisCount;
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error analyzing image. Please try again.');
    })
    .finally(() => {
      btn.innerHTML = '<i class="fas fa-search mr-2"></i>Analyze Image';
      btn.disabled = false;
    });
  };
  reader.readAsDataURL(file);
}

// Display text results
function displayTextResults(data) {
  const resultsSection = document.getElementById('resultsSection');
  const resultsContent = document.getElementById('resultsContent');

  const statusClass = data.is_ai_generated ? 'text-red-400' : 'text-green-400';
  const statusText = data.is_ai_generated ? 'AI Generated Content Detected' : 'Human-Written Content';
  const statusIcon = data.is_ai_generated ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle';

  resultsContent.innerHTML = `
    <div class="border rounded-lg p-6 mb-6 ${data.is_ai_generated ? 'border-red-500 bg-red-900 bg-opacity-20' : 'border-green-500 bg-green-900 bg-opacity-20'}">
      <div class="flex items-center mb-4">
        <i class="${statusIcon} ${statusClass} text-2xl mr-3"></i>
        <div>
          <div class="font-bold text-lg ${statusClass}">${statusText}</div>
          <div class="text-sm text-gray-400">Confidence: ${(data.confidence_score * 100).toFixed(1)}%</div>
        </div>
      </div>
    </div>
  `;
  resultsSection.classList.remove('hidden');
  resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Display image results
function displayImageResults(data) {
  const resultsSection = document.getElementById('resultsSection');
  const resultsContent = document.getElementById('resultsContent');

  const statusClass = data.is_ai_generated ? 'text-red-400' : 'text-green-400';
  const statusText = data.is_ai_generated ? 'AI Manipulation Detected' : 'Authentic Image';
  const statusIcon = data.is_ai_generated ? 'fas fa-exclamation-triangle' : 'fas fa-shield-check';

  resultsContent.innerHTML = `
    <div class="border rounded-lg p-6 mb-6 ${data.is_ai_generated ? 'border-red-500 bg-red-900 bg-opacity-20' : 'border-green-500 bg-green-900 bg-opacity-20'}">
      <div class="flex items-center mb-4">
        <i class="${statusIcon} ${statusClass} text-2xl mr-3"></i>
        <div>
          <div class="font-bold text-lg ${statusClass}">${statusText}</div>
          <div class="text-sm text-gray-400">Confidence: ${(data.confidence_score * 100).toFixed(1)}%</div>
        </div>
      </div>
    </div>
  `;
  resultsSection.classList.remove('hidden');
  resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Handle image upload
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('previewImg').src = e.target.result;
      document.getElementById('imageDropZone').classList.add('hidden');
      document.getElementById('imagePreview').classList.remove('hidden');
      document.getElementById('analyzeImageBtn').disabled = false;
    };
    reader.readAsDataURL(file);
  }
}

// Update recent results
function updateRecentResults(data) {
  const container = document.getElementById('recentResults');
  const timestamp = new Date().toLocaleTimeString();
  const statusClass = data.result.is_ai_generated ? 'text-red-400' : 'text-green-400';
  const statusText = data.result.is_ai_generated ? 'AI Detected' : 'Human Content';

  const resultItem = document.createElement('div');
  resultItem.className = 'bg-gray-800 p-3 rounded-lg border-l-4 ' + (data.result.is_ai_generated ? 'border-red-500' : 'border-green-500');
  resultItem.innerHTML = `
    <div class="flex justify-between items-center">
      <div>
        <div class="font-medium ${statusClass}">${statusText}</div>
        <div class="text-xs text-gray-400">${data.type.toUpperCase()} • ${timestamp}</div>
      </div>
      <div class="text-sm font-bold ${statusClass}">
        ${(data.result.confidence_score * 100).toFixed(0)}%
      </div>
    </div>
  `;

  if (container.children.length === 1 && container.children[0].textContent.includes('No analyses yet')) {
    container.innerHTML = '';
  }
  container.insertBefore(resultItem, container.firstChild);
  while (container.children.length > 5) {
    container.removeChild(container.lastChild);
  }
}

// Open AR Viewer
function openARViewer() {
  window.open('/ar-viewer', '_blank', 'width=800,height=600');
}

// Text counter
document.getElementById('textInput').addEventListener('input', function() {
  const text = this.value;
  document.getElementById('textCharCount').textContent = text.length;
  document.getElementById('textWordCount').textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
});
