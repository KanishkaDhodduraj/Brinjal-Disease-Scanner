import tensorflow as tf
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
import io
import base64
import os

# Get the directory of the current script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__, static_folder=BASE_DIR)
CORS(app)  # Enable CORS for all routes

# Global model variable
model = None

# Get the directory of the current script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load the model with robust path handling
print(f"Loading model from {BASE_DIR}...")
try:
    model_path = os.path.join(BASE_DIR, 'brinjal_leaf_model.h5')
    if not os.path.exists(model_path):
        # Fallback to root directory if not in www
        parent_dir = os.path.dirname(BASE_DIR)
        model_path = os.path.join(parent_dir, 'brinjal_leaf_model.h5')
        
    print(f"Using model path: {model_path}")
    model = tf.keras.models.load_model(model_path)
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    model = None

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    try:
        return send_from_directory('.', path)
    except:
        return send_from_directory('.', 'index.html')

@app.route('/predict', methods=['POST'])
def predict():
    print(">>> Prediction request received")
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
            
        data = request.get_json()
        
        # Handle test requests
        if data.get('test'):
            return jsonify({'status': 'server_ready'})
        
        # Get image from request
        image_data = data['image']
        image_data = base64.b64decode(image_data.split(',')[1])
        
        # Convert to PIL Image
        image = Image.open(io.BytesIO(image_data))
        
        # Preprocess
        image = image.resize((160, 160))
        img_array = np.array(image) / 255.0
        
        # Check for white image (mean pixel value near 1.0)
        mean_val = np.mean(img_array)
        print(f"Image mean pixel value: {mean_val}")
        
        if mean_val > 0.95: # Check if image is mostly white
            # More robust check: are almost all pixels white?
            if np.all(img_array > 0.95):
                return jsonify({'error': 'Invalid image: Image is too white/blank'}), 400

        # REAL MODEL PREDICTION
        img_array = np.expand_dims(img_array, axis=0) # Add batch dimension
        prediction = model.predict(img_array)
        probability = float(prediction[0][0])
        
        # Class mapping: 0 = diseased (damping_off), 1 = healthy
        is_healthy = probability > 0.5
        
        # Calculate confidence percentage
        confidence = probability * 100 if is_healthy else (1 - probability) * 100
        
        print(f"Prediction: {'Healthy' if is_healthy else 'Diseased'}, Probability: {probability:.4f}, Confidence: {confidence:.2f}%")
        
        return jsonify({
            'probability': probability,
            'is_healthy': is_healthy,
            'confidence': float(confidence)
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    print("\n" + "="*60)
    print("BRINJAL DISEASE SCANNER SERVER")
    print("="*60)
    print(f"Model loaded: {model is not None}")
    print(f"Working directory: {os.getcwd()}")
    print("Starting Flask server...")
    print("Listen Address: http://127.0.0.1:5000")
    print("="*60 + "\n")
    
    try:
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=False,
            use_reloader=False,
            threaded=True
        )
    except Exception as e:
        print(f"\n❌ ERROR: {e}\n")
        import traceback
        traceback.print_exc()