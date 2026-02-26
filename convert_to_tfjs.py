#!/usr/bin/env python3
"""
Convert Keras H5 model to TensorFlow.js format
"""
import os
import sys

try:
    import tensorflow as tf
    from tensorflowjs.converters import convert_tf_saved_model
    print("✅ TensorFlow and tensorflowjs-converter found")
except ImportError as e:
    print(f"❌ Missing package: {e}")
    print("Installing tensorflowjs...")
    os.system("pip install tensorflowjs")
    from tensorflowjs.converters import convert_tf_saved_model

# Paths
h5_model_path = r"C:\Users\D.Kanishka\OneDrive\Desktop\Brinjal-Disease-Scanner\www\brinjal_leaf_model.h5"
output_dir = r"C:\Users\D.Kanishka\OneDrive\Desktop\Brinjal-Disease-Scanner\www\brinjal_tfjs_model"

print(f"Loading model from: {h5_model_path}")
print(f"Output directory: {output_dir}")

try:
    # Load the H5 model
    model = tf.keras.models.load_model(h5_model_path)
    print("✅ Model loaded successfully")
    print(f"Model input shape: {model.input_shape}")
    print(f"Model output shape: {model.output_shape}")
    
    # Create a temporary SavedModel directory
    saved_model_dir = os.path.join(os.path.dirname(h5_model_path), "temp_saved_model")
    
    # Save as SavedModel format (intermediate step)
    print("Saving model to SavedModel format...")
    model.save(saved_model_dir, save_format='tf')
    print("✅ SavedModel created")
    
    # Convert to TensorFlow.js
    print("Converting to TensorFlow.js...")
    convert_tf_saved_model(saved_model_dir, output_dir)
    print(f"✅ Conversion complete! Model saved to: {output_dir}")
    
    # Clean up temp directory
    import shutil
    shutil.rmtree(saved_model_dir, ignore_errors=True)
    print("✅ Cleanup complete")
    
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
