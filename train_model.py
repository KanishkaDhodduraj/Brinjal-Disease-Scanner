import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
import os
import shutil

print("🔄 Loading your dataset...")

# Added Data Augmentation to prevent "soil detection" issues
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=30,      # Rotate images to learn from all angles
    width_shift_range=0.2,  # Shift sideways
    height_shift_range=0.2, # Shift up/down
    shear_range=0.2,        # Distort shapes slightly
    zoom_range=0.2,         # Zoom in/out (helper for varying distances)
    horizontal_flip=True,   # Mirror images
    fill_mode='nearest'     # Fill empty space after rotation
)

test_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_directory(
    'data/train/',
    target_size=(224, 224),
    batch_size=32,
    class_mode='binary'
)

test_generator = test_datagen.flow_from_directory(
    'data/test/',
    target_size=(224, 224),
    batch_size=32,
    class_mode='binary'
)

print("🧠 Building model for brinjal leaves...")
model = tf.keras.Sequential([
    tf.keras.layers.Conv2D(32, (3,3), activation='relu', input_shape=(224,224,3)),
    tf.keras.layers.MaxPooling2D(2,2),
    tf.keras.layers.Conv2D(64, (3,3), activation='relu'),
    tf.keras.layers.MaxPooling2D(2,2),
    tf.keras.layers.Conv2D(128, (3,3), activation='relu'),
    tf.keras.layers.MaxPooling2D(2,2),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dropout(0.5),
    tf.keras.layers.Dense(512, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

print("🚀 TRAINING STARTED (15 epochs for better accuracy)...")
history = model.fit(train_generator, epochs=15, validation_data=test_generator)

test_loss, test_acc = model.evaluate(test_generator)
print(f"🎉 FINAL ACCURACY: {test_acc*100:.1f}%")

# Save to root folder
model.save('brinjal_leaf_model.h5')
print("✅ Model saved to local directory!")

# Save to www folder for Python server
www_model_path = os.path.join('www', 'brinjal_leaf_model.h5')
if not os.path.exists('www'):
    os.makedirs('www')

model.save(www_model_path)
print(f"✅ Model copy saved to {www_model_path} (for server use)!")