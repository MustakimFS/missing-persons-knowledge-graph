import string

import nltk
import pandas as pd
import re

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

from nltk.classify import NaiveBayesClassifier
from nltk.probability import FreqDist
from nltk.collocations import *

nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('stopwords')
nltk.download('wordnet')

clean_cali = "../../output/cleaned_up_cali.csv"

df = pd.read_csv(clean_cali)
text_col = df['Circumstances of Disappearance']
text_col_city = df['City']


def preprocess_text_loc(text):
    text = text.lower()

    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in string.punctuation]

    stop_words = set(stopwords.words('english'))


    ## Check nltk.phrases?
    ## Longest common substring.
    ## X-was abducted-from their-workplace

    # Find patterns - Clusters
    # String edit distance - Make clusters


def preprocess_text(text):
    text = text.lower()

    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in string.punctuation]
    custom_stopwords = [
        'last', 'seen', 'california', 'missing', "'s", 'since', 'day',
        'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september',
        'october', 'november', 'december'
    ]
    stop_words = set(stopwords.words('english')).union(set(custom_stopwords))

    tokens = [word for word in tokens if word not in stop_words]
    

    bigrams = list(nltk.trigrams(tokens))

    return bigrams


if __name__ == "__main__":

    words_list = []
    for text in text_col:
        words_list.extend(preprocess_text(str(text)))

    fdist = FreqDist(words_list)

    with open("../../output/word_frequencies.txt", "w") as file:
        file.write("Most Common Words:\n")
        for word, freq in fdist.most_common(200):
            file.write(f"{word}: {freq}\n")
