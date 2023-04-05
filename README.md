# ItalianPhishingDetectionAdd-ons
Firefox add-ons for phishing detection using Machine Learning Model:
- As described in Chapter 5 of the <a href="https://ceur-ws.org/Vol-3260/paper13.pdf">paper</a>, I created a firefox extension that uses the <a href="https://github.com/LeonardRanaldi/ItalianPhishingDetection/blob/main/models/RNN%20word%2Bchar_emb.ipynb">Machine Learning Model</a> to predict potential threats. Inside folder "model" you can find Jupyter Notebook used to create my model starting from Dr. <a href="https://github.com/LeonardRanaldi/">Leonardo Ranaldi</a>'s.
- Anyone can use this system as explained in the server-side folder using a dedicated end point:</br>
.:. To get prediction for URL @ <a target="_blank" href="http://www.cm-innovationlab.it:5000/api/v2/url/inference">/api/v2/url/inference</a></br>
.:. To add URL in white list @ <a target="_blank" href="http://www.cm-innovationlab.it:5000/api/v2/url/add">/api/v2/url/add</a></br>
.:. To add URL in black list @ <a target="_blank" href="http://www.cm-innovationlab.it:5000/api/v2/url/bad">/api/v2/url/bad</a></br>
.:. To correct a false positive URL from black to white list @ <a target="_blank" href="http://www.cm-innovationlab.it:5000/api/v2/url/correction">/api/v2/url/correction</a></br>
.:. To get JSON array containing white list of domain @ <a target="_blank" href="http://www.cm-innovationlab.it:5000/api/v2/list/reliable">/api/v2/list/reliable</a></br>
.:. To get JSON array containing black list of domain @ <a target="_blank" href="http://www.cm-innovationlab.it:5000/api/v2/list/malicious">/api/v2/list/malicious</a></br>
.:. To get JSON arrays containing black / white list of domain @ <a target="_blank" href="http://www.cm-innovationlab.it:5000/api/v2/list/all">/api/v2/list/all</a>
