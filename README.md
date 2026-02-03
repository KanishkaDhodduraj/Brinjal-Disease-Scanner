# 🌾 Brinjal Disease Scanner

AI-powered application to detect damping-off disease in brinjal (eggplant) nurseries.

## 🚀 Quick Start

### Option 1: One-Click Start (Recommended)
1. Double-click `start_app.bat` in the project root
2. The server will start automatically and open your browser

### Option 2: Manual Start
1. Open command prompt in the `www` folder
2. Run: `python prediction_server.py`
3. Open `http://localhost:5000/` in your browser

## 📱 How to Use

1. **Upload Image**: Click "📸 Camera" or "📁 Gallery" to select a brinjal nursery photo
2. **AI Analysis**: The app will analyze the image using a custom-trained neural network
3. **Get Results**: See if damping-off disease is detected with confidence percentage

## 🧠 AI Model

- **Framework**: TensorFlow/Keras
- **Architecture**: Convolutional Neural Network (CNN)
- **Input**: 224x224 RGB images
- **Classes**: Healthy vs Damping-off disease
- **Accuracy**: Trained on custom brinjal dataset

## 🛠️ Technical Details

- **Backend**: Flask API server with TensorFlow
- **Frontend**: HTML/CSS/JavaScript with responsive design
- **Image Processing**: PIL for preprocessing, base64 encoding
- **CORS**: Enabled for cross-origin requests

## 📂 Project Structure

```
Brinjal-Disease-Scanner/
├── www/
│   ├── demo.html          # Main web interface
│   ├── prediction_server.py  # Flask API server
│   ├── brinjal_leaf_model.h5  # Trained TensorFlow model
│   ├── app.js             # Alternative interface
│   └── test-images/       # Sample images for testing
├── data/
│   ├── train/             # Training dataset
│   └── test/              # Test dataset
├── train_model.py         # Model training script
├── convert_model.py       # Model conversion utilities
└── start_app.bat          # One-click launcher
```

## 🔧 Troubleshooting

**"Model not loaded" error:**
- Make sure the Flask server is running
- Check that `brinjal_leaf_model.h5` exists in the `www` folder
- Ensure TensorFlow is properly installed

**Server won't start:**
- Install required packages: `pip install tensorflow flask flask-cors pillow`
- Check Python version (3.7+ recommended)

**Browser issues:**
- Try refreshing the page
- Clear browser cache
- Use a modern browser (Chrome, Firefox, Edge)

## 📊 Model Training

To retrain the model with new data:

1. Add images to `data/train/healthy/` and `data/train/diseased/`
2. Run: `python train_model.py`
3. Convert for deployment: `python convert_model.py`

## 📝 License

Custom AI model trained on brinjal disease datasets for research and agricultural use.