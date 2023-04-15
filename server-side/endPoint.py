import tensorflow.keras as k

print('Model Loading...')
model = k.models.load_model('30epoche')
print('Model Loaded!')

from sklearn.feature_extraction.text import CountVectorizer
from tensorflow.keras.preprocessing.text import Tokenizer
import pandas as pd

def create_char_vectorizer(input_array):
    to_characters = Tokenizer(char_level=True, oov_token='<OOV>', filters='\t\n')
    to_characters.fit_on_texts(input_array)

    return to_characters

def create_word_vectorizer(input_array):
    word_vectorizer = CountVectorizer(
        stop_words=None,
        min_df=5,
        token_pattern=r'&\w+;|[:/&?=.\[\]\\]|%\w{2}|[-_\w\d]+',
        analyzer='word',
        max_features=500
    )
    word_vectorizer.fit(input_array)

    return word_vectorizer

dataForVector = pd.read_csv("dataForVector.csv")

word_vectorizer = create_word_vectorizer(dataForVector['Domain'])
char_vectorizer = create_char_vectorizer(dataForVector['Domain'])

import numpy as np
from tensorflow.keras.preprocessing.sequence import pad_sequences
from flask import Flask, request

myEndPoint = Flask(__name__)

@myEndPoint.route("/api/v2/url/inference",methods = ['POST'])
def predict_url():
    if request.is_json:
        siteToCheck = request.get_json()

        input_data_array = np.array([siteToCheck["domain"]])

        word_tokenizer = word_vectorizer.build_tokenizer()
        char_tokenizer = char_vectorizer.texts_to_sequences(input_data_array)

        word_padded = pad_sequences([[word_vectorizer.vocabulary_.get(a, -1) + 2 for a in word_tokenizer(siteToCheck["domain"])]], maxlen=200, padding='post', truncating='post')
        char_padded = pad_sequences(char_tokenizer, maxlen=200, padding='post', truncating='post')

        prediction_data_input = [word_padded, char_padded]

        prediction = model.predict(prediction_data_input)

        return {"predict": str(prediction[0][0])}, 200
    
    return {"error": "Request must be JSON"}, 415

reliableList = ["google.it", "google.com", "github.com", "webstudenti.unimarconi.it", "cm-innovationlab.it"]

maliciousList = []

falsePositiveList = []

@myEndPoint.route("/api/v2/url/add",methods = ['POST'])
def add():
    if request.is_json:
        siteToAdd = request.get_json()

        if siteToAdd["add"] not in reliableList and siteToAdd["add"] not in maliciousList:
            reliableList.append(siteToAdd["add"])

        return {"reliableList": reliableList}, 200
    
    return {"error": "Request must be JSON"}, 415
    
@myEndPoint.route("/api/v2/url/bad",methods = ['POST'])
def bad():
    if request.is_json:
        siteToAdd = request.get_json()
        
        if siteToAdd["add"] not in maliciousList and siteToAdd["add"] not in reliableList:
            maliciousList.append(siteToAdd["add"])

        return {"maliciousList": maliciousList}, 200
    
    return {"error": "Request must be JSON"}, 415

@myEndPoint.route("/api/v2/url/correction",methods = ['POST'])
def correction():
    if request.is_json:
        siteToAdd = request.get_json()

        reliableList.append(siteToAdd["add"])
        falsePositiveList.append(siteToAdd["add"])
        if siteToAdd["add"] in maliciousList:
            maliciousList.remove(siteToAdd["add"])

        return {"reliableList": reliableList, "maliciousList": maliciousList}, 200
    
    return {"error": "Request must be JSON"}, 415

@myEndPoint.route("/api/v2/list/reliable",methods = ['GET'])
def getReliableList():
    return {"reliableList": reliableList}, 200

@myEndPoint.route("/api/v2/list/malicious",methods = ['GET'])
def getMaliciousList():
    return {"maliciousList": maliciousList}, 200
    
@myEndPoint.route("/api/v2/list/all",methods = ['GET'])
def getAllLists():
    return {"reliableList": reliableList, "maliciousList": maliciousList, "falsePositiveList": falsePositiveList}, 200
	
@myEndPoint.route("/api/v2/list/fp",methods = ['GET'])
def getFalsePositiveList():
    return {"falsePositiveList": falsePositiveList}, 200

print('App Loaded!')