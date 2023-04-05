//Example of analysis:

//http://www.cm-innovationlab.it:8080/Lengths.jsp?dato=451#test
//http:
//     //
//       www.cm-innovationlab.it
//                              :
//                               8080
//                                   /Lengths.jsp
//                                               ?dato=451
//                                                        #test


//First of all is important to understand if current url is already in my reliable list, so we get it.
var myArrayReliableListFromJson = [];
var myArrayMalicoiusListFromJson = [];

const WL_URL ="http://www.cm-innovationlab.it:5000/api/v2/list/reliable";		//This is the API on my website to get "white list"

var xmlhttp = new XMLHttpRequest();
xmlhttp.open('GET', WL_URL, true);

xmlhttp.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {
        
        var obj = JSON.parse(xmlhttp.response);
        myArrayReliableListFromJson = obj.reliableList;

        proceed();      //Once array is populated analysis can start
        
    }else if (this.status >= 500) {
        console.log("[SERVER ERROR]:" + xmlhttp.response);
    }else if (this.status >= 400) {
        console.log("[CLIENT ERROR]:" + xmlhttp.response);
    }
};
xmlhttp.onerror = function() {
    console.log(xmlhttp.error);
};
xmlhttp.setRequestHeader("Content-Type", "application/json");
xmlhttp.send();

//In the second instance we save the original site
const originalHead = document.head.innerHTML;
const originalBody = document.body.innerHTML;

var myAnalysisArray = [];   //This will be an array of classes

//This class is useful to store information about url and populate table easily
class AnalysisData {
    constructor(description, value) {
        this.description = description;
        this.value = value;
    }
}

const ML_URL ="http://www.cm-innovationlab.it:5000/api/v2/url/inference";		//This is the API on my website

//Variables necessary for reload
var predictionStorage = [];

//Function for check URL using Web API
function checkUrl(predictionArgument, destination, numberOfPrediction){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', ML_URL, true);

    xmlhttp.onreadystatechange = function() {
        var output = "";
        if (this.readyState == 4 && this.status == 200) {
			
			var obj = JSON.parse(xmlhttp.response);
			var prediction = parseFloat(obj.predict);

            predictionStorage[numberOfPrediction] = prediction;
			
            output =    "<table>" +
                            "<tr>";
			if (prediction <= 0.50){

                output +=       "<td><img id='check_img' alt='NoGreenTick' src='" + browser.runtime.getURL('images/green.png') + "'/></td>" +
                                "<td>" + prediction + "</td>";

			}else if (prediction <= 0.70){
                output +=       "<td><img id='check_img' alt='NoOrangeTick' src='" + browser.runtime.getURL('images/orange.png') + "'/></td>" +
                                "<td>" + prediction + "</td>";
			}else{
                output +=       "<td><img id='check_img' alt='NoRedTick' src='" + browser.runtime.getURL('images/red.png') + "'/></td>" +
                                "<td>" + prediction + "</td>";
			}

            output +=       "</tr>" +
                        "</table>";
            
        }else if (this.status >= 500) {
            output = "<b>SERVER ERROR:</b> " + xmlhttp.response;
        }else if (this.status >= 400) {
            output = "<b>CLIENT ERROR:</b> " + xmlhttp.response;
        }
        document.getElementById(destination).innerHTML = output;
    };
    xmlhttp.onerror = function() {
        console.log(xmlhttp.error);
    };
	xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({ "domain": predictionArgument }));
}

//This function help us to store information about window location 
function populateArray(){
    myAnalysisArray.push(new AnalysisData("Location", window.location.href));
    myAnalysisArray.push(new AnalysisData("Number of characters", window.location.href.length));
    myAnalysisArray.push(new AnalysisData("Depth", window.location.href.split("/").length - 3));        // [2] backslash after schema
    myAnalysisArray.push(new AnalysisData("Dot", window.location.href.split(".").length - 3));          // [2] for dot "www." and ".it"
    myAnalysisArray.push(new AnalysisData("Dash", window.location.href.split("-").length - 1));
    myAnalysisArray.push(new AnalysisData("Ip Check", (window.location.host.split(".").length == 4 ? "Yes" : "No")));  //only for test
    myAnalysisArray.push(new AnalysisData("Origin", window.location.origin));
    myAnalysisArray.push(new AnalysisData("Host", window.location.host));
    myAnalysisArray.push(new AnalysisData("Scheme", window.location.protocol));
    myAnalysisArray.push(new AnalysisData("Domain Name", window.location.hostname));
    myAnalysisArray.push(new AnalysisData("Port", window.location.port));
    myAnalysisArray.push(new AnalysisData("Path Name", window.location.pathname));
    myAnalysisArray.push(new AnalysisData("Query string / Parameters", window.location.search));
    myAnalysisArray.push(new AnalysisData("Anchor / Fragment", window.location.hash));
}

//With this function we add site to whiteList so (after restarting browser) this is visible
function reload(){

    var result = ((predictionStorage[0] + predictionStorage[1] + predictionStorage[2]) / 3);
    if(result < 0.45){

        const ADD_URL ="http://www.cm-innovationlab.it:5000/api/v2/url/add";		//This is the API on my website to add new page in "white list"

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', ADD_URL, true);
    
        xmlhttp.onreadystatechange = function() {
    
            if (this.readyState == 4 && this.status == 200) {
                
                var obj = JSON.parse(xmlhttp.response);
                myArrayReliableListFromJson = obj.reliableList;
    
                alert("Restarting your browser you can see correctly this page.");

                document.head.innerHTML = originalHead;
                document.body.innerHTML = originalBody;

            }else if (this.status >= 500) {
                console.log("[SERVER ERROR]:" + xmlhttp.response);
            }else if (this.status >= 400) {
                console.log("[CLIENT ERROR]:" + xmlhttp.response);
            }
        };
        xmlhttp.onerror = function() {
            console.log(xmlhttp.error);
        };
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify({ "add": window.location.hostname.replace("www.", "") }));
    }else{
        alert("Results average [" + result + "] is greater than 0.40, so you can't identify this url as 'safe'.");
    }
}

//With this function we add site to blackList
function report(){

    var result = ((predictionStorage[0] + predictionStorage[1] + predictionStorage[2]) / 3);
    if(result > 0.70){

        const BAD_URL ="http://www.cm-innovationlab.it:5000/api/v2/url/bad";		//This is the API on my website to add new page in "black list"

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', BAD_URL, true);
    
        xmlhttp.onreadystatechange = function() {
    
            if (this.readyState == 4 && this.status == 200) {
                
                var obj = JSON.parse(xmlhttp.response);
                myArrayMalicoiusListFromJson = obj.maliciousList;

                alert("You can implement this function as you want.\nFor example with XmlHttpRequest you can send notification to www.acn.gov.it.");

            }else if (this.status >= 500) {
                console.log("[SERVER ERROR]:" + xmlhttp.response);
            }else if (this.status >= 400) {
                console.log("[CLIENT ERROR]:" + xmlhttp.response);
            }
        };
        xmlhttp.onerror = function() {
            console.log(xmlhttp.error);
        };
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify({ "add": window.location.hostname.replace("www.", "") }));
    }else{
        alert("Results average [" + result + "] is less than 0.70, so you can't identify this url as 'malicious'.");
    }
}

//This is the main function with which we can hide original page and check url
function proceed(){
    if (!myArrayReliableListFromJson.includes(window.location.hostname.replace("www.", ""))){   //Only if domain isn't in our list

        populateArray();    //We start analyzing current url
        
        //Create a new header
        document.head.innerHTML = 	"<!DOCTYPE html>" +
                                    "<html>" +
                                        "<head>" +
                                            "<title>Machine Learning Predict Page</title>" +
                                            "<link rel='stylesheet' href='" + browser.runtime.getURL('style.css') + "'>" +
                                        "</head>";

        //Create a new body
        var myTempBody =    
        
                            "<div class='topnav'>" +
                              //  "<a class='active' href='#home'>Home</a>" +
                                "<a href='https://ceur-ws.org/Vol-3260/paper13.pdf'>Paper</a>" +
                                "<a href='https://github.com/LeonardRanaldi/ItalianPhishingDetection/blob/main/models/RNN%20word%2Bchar_emb.ipynb'>Prof. Ranaldi ML Model</a>" +
                                "<a href='http://www.cm-innovationlab.it:5000/api/v2/list/reliable'>Json OK list</a>" +
                                "<a href='http://www.cm-innovationlab.it:5000/api/v2/list/malicious'>Json KO list</a>" +
                                "<a href='http://www.cm-innovationlab.it:5000/api/v2/list/all'>Json complete list</a>" +
                                "<a href='https://support.mozilla.org/en-US/kb/block-deceptive-content-and-dangerous-downloads-firefox'>Firefox Privacy Settings</a>" +
                                "<a href='' id='falsePositive'>Notify False Positive</a>" +



                            "</div>" +

//https://reference.codeproject.com/dom/xmlhttprequest/how_to_check_the_secruity_state_of_an_xmlhttprequest_over_ssl


                            "</br>" +

                            "<div>" +
                                "<img id='logo_access_denied' alt='NoAccessDeniedLogo' src='" + browser.runtime.getURL('images/accessDenied.png') + "'/>" +
                                "<span id='span_access_denied'>  Page Blocked awaiting verification:</span>" +
                            "</div>" +
        
                            "</br>" +

                            "<h1>Lightweight URL-based phishing detection (Section 2.1)</h1>" +
        
                            "<table>" +
                                "<tr>" +
                                    "<th>Description</th>" +
                                    "<th>Value</th>" +
                                "</tr>";
        
        for (index = 0; index < myAnalysisArray.length; index++){
            myTempBody += 		"<tr>" +
                                    "<td><b>" + myAnalysisArray[index].description + "</b></td>" +
                                    "<td>" + myAnalysisArray[index].value + "</td>" +
                                "</tr>";
        }
        
        myTempBody += 		"</table>" +
        
                            "<br/><br/><br/>" +
        
                            "<b>Location Check</b> (" + window.location.href + ")" +
                            "<br/><br/>" +
                            "<div id='checkResponse0'>Response 0</div>" +
                            "<br/>" +
                            "<b>Origin Check</b> (" + window.location.origin + ")" +
                            "<br/><br/>" +
                            "<div id='checkResponse1'>Response 1</div>" +
                            "<br/>" +
                            "<b>Domain Name Check</b> (" + window.location.hostname + ")" +
                            "<br/><br/>" +
                            "<div id='checkResponse2'>Response 2</div>" +
        
                            "<br/><br/>" +
        
                            "<button class='ok' id='btnok'>Add & Reload</button>" +
                            "<button class='ko' id='btnko'>Report</button>" +
        
                            "<br/><br/><br/>";
        
        document.body.innerHTML = myTempBody + "</html>";
        
        //Populate div component with XmlHttpRequest
        checkUrl(window.location.href, 'checkResponse0', 0);
        checkUrl(window.location.origin, 'checkResponse1', 1);
        checkUrl(window.location.hostname, 'checkResponse2', 2);
        
        //Listener are necessary because all scripts are blocked. This is the easiest way.
        document.getElementById("btnok").addEventListener("click", reload);
        document.getElementById("btnko").addEventListener("click", report);


        //Listener to notify False Positive Domain
        function notFalse(){
            const CORRECTION_URL ="http://www.cm-innovationlab.it:5000/api/v2/url/correction";		//This is the API on my website to add new page in "white list"
    
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('POST', CORRECTION_URL, true);
        
            xmlhttp.onreadystatechange = function() {
        
                if (this.readyState == 4 && this.status == 200) {
                    
                    var obj = JSON.parse(xmlhttp.response);
                    myArrayReliableListFromJson = obj.reliableList;
                    myArrayMalicoiusListFromJson = obj.maliciousList;
        
                    alert("Restarting your browser you can see correctly this page.");
    
                    document.head.innerHTML = originalHead;
                    document.body.innerHTML = originalBody;
    
                }else if (this.status >= 500) {
                    console.log("[SERVER ERROR]:" + xmlhttp.response);
                }else if (this.status >= 400) {
                    console.log("[CLIENT ERROR]:" + xmlhttp.response);
                }
            };
            xmlhttp.onerror = function() {
                console.log(xmlhttp.error);
            };
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.send(JSON.stringify({ "add": window.location.hostname.replace("www.", "") }));
        }

        document.getElementById("falsePositive").addEventListener("click", notFalse);
    }
}