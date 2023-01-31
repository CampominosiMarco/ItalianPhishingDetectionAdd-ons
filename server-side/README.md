## Configuration to run `endPoint.py` on your server:

### 1 - Check for <a href="https://www.python.org/">PYTHON</a> or install
  ```
  python3 --version
  ```
  ```
  apt install python3.8
  ```
### 2 - Check for <a href="https://pypi.org/project/pip/">PIP</a> or install
  ```
  pip3 --version
  ```
  ```
  apt install python3-pip
  ```
### 3 - Check for <a href="https://www.tensorflow.org/?hl=en">TENSORFLOW</a> or install
  ```
  pip3 show tensorflow
  ```
  ```
  pip3 install tensorflow
  ```
### 4 - Check for <a href="https://pandas.pydata.org/">PANDAS</a> or install
  ```
  pip3 show pandas
  ```
  ```
  apt install python3-pandas
  ```
### 5 - Install <a href="https://numpy.org/">NUMPY</a> 1.21 version
  ```
  pip install numpy==1.21
  ```
### 6 - Install <a href="https://scikit-learn.org/stable/">SCIKIT-LEARN</a>
  ```
  pip3 install -U scikit-learn scipy matplotlib
  ```
### 7 - Check for <a href="https://flask.palletsprojects.com/en/2.2.x/">FLASK</a> or install
  ```
  python -m flask --version
  ```
  ```
  pip install Flask
  ```
### 8 - Install SCREEN
  ```
  apt install screen
  ```

## Now you can run the below code from the folder where you saved `endPoint.py` and Machine Learning Model:
  ```
  screen
  flask --app endPoint run --host=0.0.0.0
  ```
