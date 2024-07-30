# predict.py
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64
import sys
import json

model = tf.keras.applications.MobileNetV2(weights='imagenet')

def preprocess_image(image_data):
    img = Image.open(io.BytesIO(base64.b64decode(image_data)))
    img = img.resize((224, 224))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
    return img_array

def predict(image_data):
    processed_image = preprocess_image(image_data)
    predictions = model.predict(processed_image)
    decoded_predictions = tf.keras.applications.mobilenet_v2.decode_predictions(predictions, top=5)
    return decoded_predictions

if __name__ == '__main__':
    image_data = sys.argv[1]
    predictions = predict(image_data)
    ingredients = [pred[1] for pred in predictions[0]]
    print(json.dumps(ingredients))

