import tensorflow as tf
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
import io
import base64
import os
import os

app = Flask(__name__, static_folder='.')
CORS(app)  # Enable CORS for all routes

# Global model variable
model = None

# Load the model
print("Loading model...")
print("Current working directory:", os.getcwd())
print("Files in directory:", os.listdir('.'))
try:
    model = tf.keras.models.load_model('brinjal_leaf_model.h5')
    print("Model loaded with CORS enabled")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    model = None

@app.route('/')
def index():
    return send_from_directory('.', 'demo.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/predict', methods=['POST'])
def predict():
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
        image = image.resize((224, 224))
        img_array = np.array(image) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Predict
        prediction = model.predict(img_array)
        probability = float(prediction[0][0])
        
        # Determine result
        is_healthy = probability >= 0.5
        confidence = abs(probability - 0.5) * 200
        
        return jsonify({
            'probability': probability,
            'is_healthy': is_healthy,
            'confidence': confidence
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=False)