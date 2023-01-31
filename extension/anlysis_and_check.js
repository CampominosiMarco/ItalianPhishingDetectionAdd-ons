//http://www.cm-innovationlab.it:8080/Lengths.jsp?dato=451#test
//57
//http://www.cm-innovationlab.it:8080
//       www.cm-innovationlab.it:8080

//http:
//     //
//       www.cm-innovationlab.it
//                              :
//                               8080
//                                   /Lengths.jsp
//                                               ?dato=451
//                                                        #test

console.log('-------------------------Inizio estensione------------------');

const myOriginalHead = document.head.innerHTML;
const myOriginalBody = document.body.innerHTML;

class AnalysisData {
    constructor(description, value) {
        this.description = description;
        this.value = value;
    }
}

var myAnalysisArray = [];
populateArray();
//writeOnConsole();

var myTempBody = "Pagina Bloccata in attesa di controllo:<br/>";
myTempBody += "<table><tr><th>Descrizione</th><th>Valore</th></tr>";
for (index = 0; index < myAnalysisArray.length; index++){
    myTempBody += "<tr><td>" + myAnalysisArray[index].description + "</td><td>" + myAnalysisArray[index].value + "</td></tr>";
}
myTempBody += "</table><br/><br/><br/>";

myTempBody += "<div id='checkResponse'>ATTESA RISPOSTA</div>";

document.head.innerHTML = "";
document.body.innerHTML = myTempBody;

checkUrl();



function checkUrl(){
    //Link al servizio di controllo
    var url ="http://www.cm-innovationlab.it:5000/mlcheck";

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', url, true);

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
			
			
			var obj=JSON.parse(xmlhttp.response);
			
			
			var prediction = parseFloat(obj.predict);
			
			
			if (prediction <= 0.45){
				
				document.getElementById("checkResponse").innerHTML = "SITO SICURO: " + window.location.href + " (" + prediction + ") + [TASTO per ricaricare la pagina]";
			}else{
				document.getElementById("checkResponse").innerHTML = "SITO RISCHIOSO: " + window.location.href + " (" + prediction + ") + [TASTO per segnalare]";
			}
			
			

			
			
			
        }else{
    



//	console.log(this.responseText);


            document.getElementById("checkResponse").innerHTML = "KO - La pagina viene segnalata." + xmlhttp.response;
        }
    };
    xmlhttp.onerror = function() {
        console.log(xmlhttp.error);
    };
	xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({ "domain": window.location.href }));
	
}

function populateArray(){
    myAnalysisArray.push(new AnalysisData("Location", window.location.href));
    myAnalysisArray.push(new AnalysisData("Number of characters", window.location.href.length));
    myAnalysisArray.push(new AnalysisData("Depth", window.location.href.split("/").length - 3));    // 2 // iniziale
    myAnalysisArray.push(new AnalysisData("Dot", window.location.href.split(".").length - 3));        // 2 www. e .it
    myAnalysisArray.push(new AnalysisData("Dash", window.location.href.split("-").length - 1));
    myAnalysisArray.push(new AnalysisData("Ip Check", (window.location.host.split(".").length == 4 ? "Yes" : "No")));  //logica errata solo di prova
    myAnalysisArray.push(new AnalysisData("Origin", window.location.origin));
    myAnalysisArray.push(new AnalysisData("Host", window.location.host));
    myAnalysisArray.push(new AnalysisData("Scheme", window.location.protocol));
    myAnalysisArray.push(new AnalysisData("Domain Name", window.location.hostname));
    myAnalysisArray.push(new AnalysisData("Port", window.location.port));
    myAnalysisArray.push(new AnalysisData("Path Name", window.location.pathname));
    myAnalysisArray.push(new AnalysisData("Query string / Parameters", window.location.search));
    myAnalysisArray.push(new AnalysisData("Anchor / Fragment", window.location.hash));
}

function writeOnConsole(){
    const group = {};

    group.href = new AnalysisData("Location", window.location.href);
    group.hrefLength = new AnalysisData("Number of characters", window.location.href.length);
    group.depth = new AnalysisData("Depth", window.location.href.split("/").length - 3);    // 2 // iniziale
    group.dot = new AnalysisData("Dot", window.location.href.split(".").length - 3);        // 2 www. e .it
    group.dash = new AnalysisData("Dash", window.location.href.split("-").length - 1);
    group.ip = new AnalysisData("Ip Check", (window.location.host.split(".").length == 4 ? "Yes" : "No"));  //logica errata solo di prova
    group.origin = new AnalysisData("Origin", window.location.origin);
    group.host = new AnalysisData("Host", window.location.host);
    group.protocol = new AnalysisData("Scheme", window.location.protocol);
    group.hostname = new AnalysisData("Domain Name", window.location.hostname);
    group.port = new AnalysisData("Port", window.location.port);
    group.pathname = new AnalysisData("Path Name", window.location.pathname);
    group.search = new AnalysisData("Query string / Parameters", window.location.search);
    group.hash = new AnalysisData("Anchor / Fragment", window.location.hash);
    
    console.table(group);
}

console.log('-------------------------Fine estensione------------------');