import tensorflow.keras as k

model = k.models.load_model('30epoche')

from sklearn.feature_extraction.text import CountVectorizer
from tensorflow.keras.preprocessing.text import Tokenizer

def create_char_vectorizer(input_array):
    to_characters = Tokenizer(char_level=True, oov_token='<OOV>', filters='\t\n')
    to_characters.fit_on_texts(input_array)

    return to_characters

def create_word_vectorizer(input_array):
    word_vectorizer = CountVectorizer(
        stop_words=None,
  #      min_df=5,
        token_pattern=r'&\w+;|[:/&?=.\[\]\\]|%\w{2}|[-_\w\d]+',
        analyzer='word',
        max_features=500
    )
    word_vectorizer.fit(input_array)

    return word_vectorizer

import numpy as np
from tensorflow.keras.preprocessing.sequence import pad_sequences
from flask import Flask, request

myEndPoint = Flask(__name__)

@myEndPoint.route("/mlcheck",methods = ['POST'])
def predict_url():
    if request.is_json:
        siteToCheck = request.get_json()

        input_data_array = np.array([siteToCheck["domain"]])

        word_vectorizer = create_word_vectorizer(input_data_array)
        char_vectorizer = create_char_vectorizer(input_data_array)

        word_tokenizer = word_vectorizer.build_tokenizer()
        char_tokenizer = char_vectorizer.texts_to_sequences(input_data_array)

        word_padded = pad_sequences([[word_vectorizer.vocabulary_.get(a, -1) + 2 for a in word_tokenizer(siteToCheck["domain"])]], maxlen=200, padding='post', truncating='post')
        char_padded = pad_sequences(char_tokenizer, maxlen=200, padding='post', truncating='post')

        prediction_data_input = [word_padded, char_padded]

        prediction = model.predict(prediction_data_input)

        return {"predict": str(prediction[0][0])}, 200
    
    return {"error": "Request must be JSON"}, 415
