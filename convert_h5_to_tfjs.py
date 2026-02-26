#!/usr/bin/env python3
"""
Convert Keras H5 model to TensorFlow.js format using tfjs CLI
"""
import os
import subprocess
import sys

# Install tensorflowjs CLI if needed
print("Installing tensorflowjs CLI...")
os.system("pip install -q tensorflowjs")

h5_path = r"C:\Users\D.Kanishka\OneDrive\Desktop\Brinjal-Disease-Scanner\www\brinjal_leaf_model.h5"
output_dir = r"C:\Users\D.Kanishka\OneDrive\Desktop\Brinjal-Disease-Scanner\www\brinjal_tfjs_model"

# Create output directory if it doesn't exist
os.makedirs(output_dir, exist_ok=True)

# Use tensorflowjs_converter via command line
cmd = f'tensorflowjs_converter --input_format=keras "{h5_path}" "{output_dir}"'

print(f"Running: {cmd}")
result = os.system(cmd)

if result == 0:
    print("✅ Conversion successful!")
    # List files
    print("\nFiles created:")
    for f in os.listdir(output_dir):
        print(f"  - {f}")
else:
    print("❌ Conversion failed")
    sys.exit(1)
