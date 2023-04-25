## Estensione Firefox per rilevamento di phishing

Con questo progetto viene sviluppata un'**estensione** per Firefox che aiuta l'utente a contrastare attacchi di **phishing** servendosi delle predizioni di un **modello di machine learning**. L'idea nasce dal capitolo 5 del [paper](https://ceur-ws.org/Vol-3260/paper13.pdf) e utilizza il [modello di Machine Learning](https://github.com/LeonardRanaldi/ItalianPhishingDetection/blob/main/models/RNN%20word%2Bchar_emb.ipynb) creato dal Prof. [Leonardo Ranaldi](https://github.com/LeonardRanaldi/).

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

## Video Tutorial:

*   [Installazione / Installation](https://www.cm-innovationlab.it/1%20-%20Installazione.mp4)
*   [Popup Link](https://www.cm-innovationlab.it/2%20-%20Link%20popup.mp4)
*   [Dominio Legittimo / Reliable Domain](https://www.cm-innovationlab.it/3%20-%20Dominio%20Legittimo.mp4)
*   [Dominio Malevolo / Malicious Domain](https://www.cm-innovationlab.it/4%20-%20Dominio%20Malevolo.mp4)
