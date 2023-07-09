# Estensione Firefox per rilevamento di phishing con modello di machine learning

Con questo progetto viene sviluppata un'[**estensione**](https://addons.mozilla.org/it/firefox/addon/italian-phishing-detection/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search) per Firefox che aiuta l'utente a contrastare attacchi di **phishing** servendosi delle predizioni di un **modello di machine learning**. L'idea nasce dal capitolo 5 del [paper](https://ceur-ws.org/Vol-3260/paper13.pdf) e utilizza il [modello di Machine Learning](https://github.com/LeonardRanaldi/ItalianPhishingDetection/blob/main/models/RNN%20word%2Bchar_emb.ipynb) creato dal Prof. [Leonardo Ranaldi](https://github.com/LeonardRanaldi/).

Il suo **funzionamento** è il seguente:

*   All'avvio del browser, l'estensione chiede ad un endpoint, in ascolto sul server, la lista dei siti legittimi.
*   Quando l'utente desidera visualizzare una pagina, l'estensione verifica se il domino è contenuto nella lista.
    1.  In caso affermativo, il sistema permette la corretta visualizzazione del sito.
    2.  Nel caso invece che non sia tra i domini  controllati, procede a bloccare il contenuto della pagina con i relativi script, chiedendo al modello una valutazione dell'URL.
        1.  Se la previsione ha un valore inferiore allo 0.5, l'estensione presenterà a video una pagina per avere la conferma dell'utente.
        2.  Se la predizione è tra 0.5 e 0.7, siamo in un range delicato dove potrebbero essere presenti dei falsi positivi e quindi, all'utente, viene richiesto di validare il dato con un'altra schermata.
        3.  Infine, nel caso di valutazione maggiore di 0.7, le opzioni sono tra reale minaccia e falso positivo.

Ogni scelta da parte dell'utente viene trasmessa al server che deve aggiornare le proprie liste.

L'estensione offre anche un comodo popup per fare inferenza sul modello, aggiungere domini alle varie liste e consultare i dati sul server.

---

## Endpoint:

Gli endpoint attivi sul server accettano richieste anche se non provengono dall'estensione, basta che rispettino i formati riportati di seguito:

#### Metodi GET

*   Per avere un array JSON contenente i domini in white list @ [/api/v2/list/reliable](http://www.cm-innovationlab.it:5000/api/v2/list/reliable)

```javascript
{ "reliableList": "['google.it','cm-innovationlab.it']" }
```

*   Per avere un array JSON contenente i domini in black list @ [/api/v2/list/malicious](http://www.cm-innovationlab.it:5000/api/v2/list/malicious)

```javascript
{ "maliciousList": "['google.com','cm-innovationlab.com']" }
```

*   Per avere un array JSON contenente i domini indicati come falsi positivi @ [/api/v2/list/fp](http://www.cm-innovationlab.it:5000/api/v2/list/fp)

```javascript
{ "falsePositiveList": "['google.it','cm-innovationlab.it']" }
```

*   Per avere un array JSON contenente tutte le liste: black, white e falsi positivi @ [/api/v2/list/all](http://www.cm-innovationlab.it:5000/api/v2/list/all)

```javascript
{ "reliableList": "['google.it','cm-innovationlab.it']",
  "maliciousList": "['google.com','cm-innovationlab.com']",
  "falsePositiveList": "['google.it','cm-innovationlab.it']" }  
```

#### Metodi POST

*   Per ottenere predizioni dal modello @ [/api/v2/url/inference](http://www.cm-innovationlab.it:5000/api/v2/url/inference)

```javascript
POST { "domain" : "google.com" }
RESPONSE { "predict": "0.123456789" }
```

*   Per aggiungere un dominio tra quelli legittimi @ [/api/v2/url/add](http://www.cm-innovationlab.it:5000/api/v2/url/add)

```javascript
POST { "add" : "google.com" }
RESPONSE { "reliableList": "['google.com',...]" }
```

*   Per aggiungere un dominio tra quelli malevoli @ [/api/v2/url/bad](http://www.cm-innovationlab.it:5000/api/v2/url/bad)

```javascript
POST { "add" : "google.com" }
RESPONSE { "maliciousList": "['google.com',...]" }
```

*   Per correggere un dominio trasferendolo dalla lista dei malevoli a quella dei legittimi @ [/api/v2/url/correction](http://www.cm-innovationlab.it:5000/api/v2/url/correction)

```javascript
POST { "add" : "google.com" }
RESPONSE { "reliableList": "['google.it',...]",
  		   "maliciousList": "['google.com',...]" }  
```

---

## Repository folders:

1.  **extension**: contiene tutti i file dell'estensione e una guida per l'installazione.
2.  **model**: contiene un file Jupyter Notebook con il modello utilizzato partendo da quello del Prof. Ranaldi.
3.  **server-side**: contiene il codice da utilizzare lato server con una guida dettagliata sulla configurazione necessaria.

---

# Video Tutorial:

*   [Installazione / Installation](https://www.cm-innovationlab.it/1%20-%20Installazione.mp4)
*   [Popup Link](https://www.cm-innovationlab.it/2%20-%20Link%20popup.mp4)
*   [Dominio Legittimo / Reliable Domain](https://www.cm-innovationlab.it/3%20-%20Dominio%20Legittimo.mp4)
*   [Dominio Malevolo / Malicious Domain](https://www.cm-innovationlab.it/4%20-%20Dominio%20Malevolo.mp4)

---

# Screenshots:

![Popup](https://user-images.githubusercontent.com/22752092/234303893-72c65e6a-05d8-473b-aa4e-aa2ba6c66508.png)
![Popup 2](https://user-images.githubusercontent.com/22752092/234303904-cb81cd14-76e1-44f7-bf71-78e22574edf7.png)

![Popup 3](https://user-images.githubusercontent.com/22752092/234303896-41a3591a-dc76-49d8-ade7-c3c65385bd8a.png)
![Popup 4](https://user-images.githubusercontent.com/22752092/234303900-bd7e8dd8-6ad4-41ec-8341-a2b373175403.png)

![ext 2 ok](https://user-images.githubusercontent.com/22752092/234303876-edcd04d6-e1bb-4f89-a4f9-d11333fe2b6b.png)
![ext 1 ko](https://user-images.githubusercontent.com/22752092/234303906-d300e8fd-5ad8-4781-b8b6-06ad5b160d08.png)

---

# Phishing Detection Add-ons for Firefox with machine learning model

With this project, an [**extension**](https://addons.mozilla.org/it/firefox/addon/italian-phishing-detection/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search) for Firefox is developed to help users to against **phishing** attacks using the predictions of a **machine learning model**. The idea comes from chapter 5 of the [paper](https://ceur-ws.org/Vol-3260/paper13.pdf) and uses the [Machine Learning model](https://github.com/LeonardRanaldi/ItalianPhishingDetection/blob/main/models/RNN%20word%2Bchar_emb.ipynb) created by Prof. [Leonardo Ranaldi](https://github.com/LeonardRanaldi/).

How does it **work**:

*   At browser opening, the extension asks an endpoint on server for the list of legitimate sites.
*   When user wants to view a page, the extension checks if the domain is included in the list.
    1.  If so, the system allows the correct visualization of the site.
    2.  If, on the other hand, it is not among the controlled domains, it proceeds to block the page content with the relative scripts, asking the model for an evaluation of the URL.
        1.  If the prediction has a value lower than 0.5, the extension will display a page for user confirmation.
        2.  If the prediction is between 0.5 and 0.7, we are in a delicate range where there may be false positives and therefore the user is asked to validate the data with another screen.
        3.  Finally, in the case of evaluation greater than 0.7, the options are between real threat and false positive.

Each choice by the user is transmitted to the server which must update its lists.

The extension also offers a popup to make inferences on the model, add domains to the lists and consult the data on the server.

---

## Endpoint:

Active endpoints on server accept requests beyond the extension, as long as respect the following formats:

#### GET Methods

*   To get JSON array with white list domains @ [/api/v2/list/reliable](http://www.cm-innovationlab.it:5000/api/v2/list/reliable)

```javascript
{ "reliableList": "['google.it','cm-innovationlab.it']" }
```

*   To get JSON array with black list domains @ [/api/v2/list/malicious](http://www.cm-innovationlab.it:5000/api/v2/list/malicious)

```javascript
{ "maliciousList": "['google.com','cm-innovationlab.com']" }
```

*   To get JSON array with false positive list domains @ [/api/v2/list/fp](http://www.cm-innovationlab.it:5000/api/v2/list/fp)

```javascript
{ "falsePositiveList": "['google.it','cm-innovationlab.it']" }
```

*   To get JSON array with all lists @ [/api/v2/list/all](http://www.cm-innovationlab.it:5000/api/v2/list/all)

```javascript
{ "reliableList": "['google.it','cm-innovationlab.it']",
  "maliciousList": "['google.com','cm-innovationlab.com']",
  "falsePositiveList": "['google.it','cm-innovationlab.it']" }  
```

#### POST Methods

*   To get prediction from model @ [/api/v2/url/inference](http://www.cm-innovationlab.it:5000/api/v2/url/inference)

```javascript
POST { "domain" : "google.com" }
RESPONSE { "predict": "0.123456789" }
```

*   To add domain in reliable list @ [/api/v2/url/add](http://www.cm-innovationlab.it:5000/api/v2/url/add)

```javascript
POST { "add" : "google.com" }
RESPONSE { "reliableList": "['google.com',...]" }
```

*   To add domain in malicious list @ [/api/v2/url/bad](http://www.cm-innovationlab.it:5000/api/v2/url/bad)

```javascript
POST { "add" : "google.com" }
RESPONSE { "maliciousList": "['google.com',...]" }
```

*   To correct domain from malicious to reliable list @ [/api/v2/url/correction](http://www.cm-innovationlab.it:5000/api/v2/url/correction)

```javascript
POST { "add" : "google.com" }
RESPONSE { "reliableList": "['google.it',...]",
             "maliciousList": "['google.com',...]" }  
```

---

## Repository folders:

1.  **extension**: contains all the extension files and an installation guide.
2.  **model**: contains a Jupyter Notebook file with the model used starting from Prof. Ranaldi's one.
3.  **server-side**: contains the code to be used on server side with a guide on configuration.
