import tensorflow as tf
import tensorflowjs as tfjs

# Load your 92% accurate model
model = tf.keras.models.load_model('brinjal_leaf_model.h5')

# Convert directly to TF.js
tfjs.converters.save_keras_model(model, 'model_tfjs/')

print("✅ model_tfjs/ folder READY for website!")