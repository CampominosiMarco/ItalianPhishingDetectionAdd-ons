# ItalianPhishingDetectionAdd-ons
Firefox add-ons for phishing detection using Machine Learning Model:
- As described in Chapter 5 of the <a href="https://ceur-ws.org/Vol-3260/paper13.pdf">paper</a>, I created a firefox extension that uses the <a href="https://github.com/LeonardRanaldi/ItalianPhishingDetection/blob/main/models/RNN%20word%2Bchar_emb.ipynb">Machine Learning Model</a> to predict potential threats. Inside folder "model" you can find Jupyter Notebook used to create my model starting from Prof. <a href="https://github.com/LeonardRanaldi/">Leonardo Ranaldi</a>'s.
- Anyone can use this system as explained in the server-side folder using a dedicated end point:</br>
.:. To get prediction for URL @ <a href="http://www.cm-innovationlab.it:5000/api/v2/url/inference">/api/v2/url/inference</a></br>
.:. To add URL in white list @ <a href="http://www.cm-innovationlab.it:5000/api/v2/url/add">/api/v2/url/add</a></br>
.:. To add URL in black list @ <a href="http://www.cm-innovationlab.it:5000/api/v2/url/bad">/api/v2/url/bad</a></br>
.:. To correct a false positive URL from black to white list @ <a href="http://www.cm-innovationlab.it:5000/api/v2/url/correction">/api/v2/url/correction</a></br>
.:. To get JSON array containing white list of domain @ <a href="http://www.cm-innovationlab.it:5000/api/v2/list/reliable">/api/v2/list/reliable</a></br>
.:. To get JSON array containing black list of domain @ <a href="http://www.cm-innovationlab.it:5000/api/v2/list/malicious">/api/v2/list/malicious</a></br>
.:. To get JSON array containing false positive list of domain @ <a href="http://www.cm-innovationlab.it:5000/api/v2/list/fp">/api/v2/list/fp</a></br>
.:. To get JSON arrays containing black / white / false positive list of domain @ <a href="http://www.cm-innovationlab.it:5000/api/v2/list/all">/api/v2/list/all</a>
![inference example](https://user-images.githubusercontent.com/22752092/232186853-f4b4d451-0010-4a46-b61a-de5ac7bc0875.JPG)
