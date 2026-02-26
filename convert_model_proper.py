#!/usr/bin/env python3
"""
Convert H5 model to SavedModel and then to TensorFlow.js format
"""
import os
import json
import numpy as np

try:
    import tensorflow as tf
    print("✅ TensorFlow found")
except ImportError:
    print("❌ TensorFlow not found")
    exit(1)

h5_path = r"C:\Users\D.Kanishka\OneDrive\Desktop\Brinjal-Disease-Scanner\www\brinjal_leaf_model.h5"
saved_model_dir = r"C:\Users\D.Kanishka\OneDrive\Desktop\Brinjal-Disease-Scanner\www\saved_model"
output_dir = r"C:\Users\D.Kanishka\OneDrive\Desktop\Brinjal-Disease-Scanner\www\brinjal_tfjs_model"

print(f"Loading H5 model from: {h5_path}")
try:
    model = tf.keras.models.load_model(h5_path)
    print("✅ Model loaded successfully")
    print(f"  Input shape: {model.input_shape}")
    print(f"  Output shape: {model.output_shape}")
    print(f"  Layers: {len(model.layers)}")
    
    # Save as SavedModel (Keras 3 syntax)
    print(f"\nSaving as SavedModel to: {saved_model_dir}")
    os.makedirs(saved_model_dir, exist_ok=True)
    # Use the proper path with .keras extension or export as SavedModel directly
    tf.saved_model.save(model, saved_model_dir)
    print("✅ SavedModel saved successfully")
    
    # Now use tensorflowjs to convert
    print("\nConverting to TensorFlow.js format...")
    import subprocess
    cmd = f'tensorflowjs_converter --input_format=tf_saved_model --output_format=tfjs_graph_model "{saved_model_dir}" "{output_dir}"'
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    
    if result.returncode == 0:
        print("✅ Conversion successful!")
        print("\nFiles created:")
        if os.path.exists(output_dir):
            for f in sorted(os.listdir(output_dir)):
                fpath = os.path.join(output_dir, f)
                size = os.path.getsize(fpath) / (1024*1024)  # MB
                print(f"  - {f} ({size:.2f} MB)")
    else:
        print(f"❌ tensorflowjs_converter failed: {result.stderr}")
        # Try alternate approach
        print("\nTrying alternate conversion method...")
        
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
