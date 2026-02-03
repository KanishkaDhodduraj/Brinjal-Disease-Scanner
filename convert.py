import tensorflow as tf
import tensorflowjs as tfjs

print("🔄 Loading your 92% model...")
model = tf.keras.models.load_model('brinjal_leaf_model.h5')
print("✅ Converting to browser format...")

tfjs.converters.save_keras_model(model, 'tfjs_model')
print("🎉 SUCCESS! tfjs_model/ folder ready!")
print("📁 Files: tfjs_model/model.json + tfjs_model/*.bin")