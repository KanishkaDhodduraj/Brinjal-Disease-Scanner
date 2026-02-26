import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
import numpy as np
import os

# 1. Dataset Configuration
train_dir = 'data/train/'
test_dir = 'data/test/'
img_size = (160, 160) # Reduced for memory stability
batch_size = 16       # Reduced for memory stability

print("Preparing Data (with nursery-specific augmentation)...")

# Enhanced augmentation
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    brightness_range=[0.8, 1.2],
    fill_mode='nearest'
)

test_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=img_size,
    batch_size=batch_size,
    class_mode='binary'
)

test_generator = test_datagen.flow_from_directory(
    test_dir,
    target_size=img_size,
    batch_size=batch_size,
    class_mode='binary',
    shuffle=False
)

# 2. Class Balancing
counts = np.unique(train_generator.classes, return_counts=True)[1]
class_weights = {
    0: (1.0 / counts[0]) * (sum(counts) / 2.0),
    1: (1.0 / counts[1]) * (sum(counts) / 2.0)
}
print(f"Class Weights: {class_weights}")

# 3. Model Building
print("Building MobileNetV2 (160x160)...")
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(160, 160, 3))
base_model.trainable = False

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(256, activation='relu')(x) # Smaller dense layer
x = Dropout(0.5)(x)
predictions = Dense(1, activation='sigmoid')(x)

model = Model(inputs=base_model.input, outputs=predictions)
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# 4. Training
print("Phase 1 Training (5 epochs)...")
model.fit(
    train_generator,
    epochs=5,
    validation_data=test_generator,
    class_weight=class_weights
)

print("Phase 2 Fine-tuning (2 epochs)...")
base_model.trainable = True
for layer in base_model.layers[:120]: # Freeze more layers
    layer.trainable = False

model.compile(optimizer=tf.keras.optimizers.Adam(1e-5), loss='binary_crossentropy', metrics=['accuracy'])
model.fit(
    train_generator,
    epochs=2,
    validation_data=test_generator,
    class_weight=class_weights
)

# 5. Save
model.save('brinjal_leaf_model.h5')
www_path = os.path.join('www', 'brinjal_leaf_model.h5')
model.save(www_path)
print(f"Model saved and copied to {www_path}")
