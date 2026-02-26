#!/usr/bin/env python3
import os, sys, traceback, tensorflow as tf, numpy as np, base64, io
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image

# Initialize
app = Flask(__name__, static_folder='.')
CORS(app)
model = None

print("\n[STARTUP] Loading model...")
print(f"[INFO] Working directory: {os.getcwd()}")
print(f"[INFO] Looking for: brinjal_leaf_model.h5")

# Check if file exists
if os.path.exists('brinjal_leaf_model.h5'):
    print("[INFO] Model file found!")
else:
    print("[WARN] Model file not found in current directory")
    print(f"[INFO] Files in directory: {os.listdir('.')}")

try:
    model = tf.keras.models.load_model('brinjal_leaf_model.h5')
    print("[OK] Model loaded successfully!")
except Exception as e:
    print(f"[ERROR] Model loading failed: {e}")
    import traceback
    traceback.print_exc()
    model = None

# Routes
@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

def is_plant_image(image_array):
    """Check if image contains plant/vegetation (green, brown, yellow colors)"""
    # image_array is (224, 224, 3) normalized 0-1
    r = image_array[:,:,0]
    g = image_array[:,:,1]
    b = image_array[:,:,2]
    
    # Check for green pixels (healthy plant leaves)
    green_pixels = np.sum((g > r + 0.05) & (g > b + 0.05))
    green_ratio = green_pixels / (224 * 224)
    
    # Check for brown/soil pixels (plant beds, stems)
    brown_pixels = np.sum((r > 0.25) & (g > 0.12) & (g < 0.45) & (b < 0.25))
    brown_ratio = brown_pixels / (224 * 224)
    
    # Check for yellow/orange pixels (diseased plants, flowers)
    yellow_pixels = np.sum((r > 0.35) & (g > 0.25) & (b < 0.25))
    yellow_ratio = yellow_pixels / (224 * 224)
    
    # Check for any vegetative color (combined plant indicators)
    plant_content = green_ratio + brown_ratio + yellow_ratio
    
    # More lenient threshold - accepts plant images with various conditions
    return plant_content > 0.08  # At least 8% plant-like colors

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return '', 204
    try:
        data = request.get_json(force=True)
        if data.get('test'):
            return jsonify({'status': 'server_ready'}), 200
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 503
        if 'image' not in data:
            return jsonify({'error': 'No image'}), 400
        
        # Decode image
        image_data = data['image'].split(',')[1] if ',' in data['image'] else data['image']
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        image = image.resize((224, 224))
        
        # Get image array for processing
        img_array = np.array(image) / 255.0
        
        # Check if it's actually a plant image
        if not is_plant_image(img_array):
            return jsonify({'error': 'Please upload a brinjal/plant image. This does not appear to be a plant image.'}), 400
        
        # Predict disease only if it's a plant image
        img_array_batch = np.expand_dims(img_array, axis=0)
        prediction = model.predict(img_array_batch, verbose=0)
        probability = float(prediction[0][0])
        
        # 0 = diseased (damping_off), 1 = healthy
        is_healthy = probability > 0.5
        
        # Confidence calculation
        confidence = probability * 100 if is_healthy else (1 - probability) * 100
        
        print(f"[PREDICT] Probability: {probability:.4f}, Res: {'Healthy' if is_healthy else 'Diseased'}, Conf: {confidence:.1f}%")
        return jsonify({'probability': probability, 'is_healthy': is_healthy, 'confidence': confidence}), 200
    except Exception as e:
        print(f"[ERROR] Prediction failed: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/<path:path>')
def static_files(path):
    try:
        return send_from_directory('.', path)
    except:
        return send_from_directory('.', 'index.html')

# Start server
if __name__ == '__main__':
    print("[STARTUP] Starting Flask server...")
    print(f"[INFO] Model: {'LOADED' if model else 'NOT LOADED'}")
    print(f"[INFO] URL: http://127.0.0.1:5000/")
    print("[INFO] Press Ctrl+C to stop\n")
    
    try:
        print("[SERVER] Using Flask development server on 0.0.0.0:5000")
        app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False, threaded=True)
    except Exception as e:
        print(f"[ERROR] {e}")
        traceback.print_exc()
        sys.exit(1)
