# ItalianPhishingDetectionAdd-ons
Firefox add-ons for phishing detection using Machine Learning Model:
- As described in Chapter 5 of the <a href="https://ceur-ws.org/Vol-3260/paper13.pdf">paper</a>, I created a firefox extension that uses the <a href="https://github.com/LeonardRanaldi/ItalianPhishingDetection/blob/main/models/RNN%20word%2Bchar_emb.ipynb">Machine Learning Model</a> to predict potential threats. Inside folder "model" you can find Jupyter Notebook used to create my model starting from Dr. <a href="https://github.com/LeonardRanaldi/">Leonardo Ranaldi</a>'s.
- Anyone can use this system as explained in the server-side folder using a dedicated end point on <a href="http://www.cm-innovationlab.it:5000/mlcheck">my site (/mlcheck)</a> to get prediction for url.
- Anyone can use this system as explained in the server-side folder using a dedicated end point on <a href="http://www.cm-innovationlab.it:5000/myList">my site (/myList)</a> to get array containing white list of urls.
