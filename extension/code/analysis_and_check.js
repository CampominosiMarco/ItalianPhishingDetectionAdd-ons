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

//First of all is important to understand if current url is already in my reliable list, so we update lists
downloadAllLists();
responseTime();

//We save the original site
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

//This is the domain name
var domainOnly = window.location.hostname.replace("www.", "");

populateArray();    //We start analyzing current url
    
//Create a header
var extensionHeader = 	    "<!DOCTYPE html>" +
                            "<html>" +
                                "<head>" +
                                    "<title>Machine Learning Predict Page</title>" +
                                    "<link rel='stylesheet' href='" + browser.runtime.getURL('style.css') + "'>" +
                                "</head>";

//Create a menu
var extensionMenu = "<div class='topnav'>" +
                        "<a href='" + PAPER + "'>Paper</a>" +
                        "<a href='" + RANALDI_MODEL + "'>Prof. Ranaldi ML Model</a>" +
                        "<a href='" + RELIABLE_API + "'>Reliable list (JSON)</a>" +
                        "<a href='" + MALICIOUS_API + "'>Malicious list (JSON)</a>" +
                        "<a href='" + ALL_API + "'>All lists (JSON)</a>" +
                        "<a href='" + FIREFOX_PRIVACY_SETTINGS + "'>Firefox Privacy Settings</a>" +
                        "<a href='" + FIREFOX_FILE_TYPES_BEHAVIOR + "'>Firefox File Types Behavior</a>" +
                    "</div>";

//Create a main title
var extensionTitle1 = "<div>" +
                        "<img id='logo_access_denied' alt='NoAccessDeniedLogo' src='" + browser.runtime.getURL('images/accessDenied.png') + "'/>" +
                        "<span id='span_access_denied'>  Page Blocked awaiting verification:</span>" +
                    "</div>";

var extensionTitle2 = "<div>" +
                        "<img id='logo_access_denied' alt='NoAccessDeniedLogo' src='" + browser.runtime.getURL('images/accessDenied.png') + "'/>" +
                        "<span id='span_access_denied'>  Page Blocked: Malicious Domain!</span>" +
                    "</div>";

//Create a table
var extensionTable = "<h1>Lightweight URL-based phishing detection (Section 2.1)</h1>" +
    
                    "<table>" +
                        "<tr>" +
                            "<th>Description</th>" +
                            "<th>Value</th>" +
                        "</tr>";

for (index = 0; index < myAnalysisArray.length; index++){
    extensionTable += 	"<tr>" +
                            "<td><b>" + myAnalysisArray[index].description + "</b></td>" +
                            "<td>" + myAnalysisArray[index].value + "</td>" +
                        "</tr>";
}

extensionTable += 		"</table>";

//Create a domainCheck with button
var extensionCheck =    "<b>Domain Name Check</b> (" + domainOnly + ")" +
                        "<br/><br/>" +
                        "<div id='checkResponse'></div>" +
                        "<br/><br/>" +

                        "<button class='ok' id='btnok' title='If you are sure, you can add this domain as reliable.'>Add as Reliable</button>" +
                        "<button class='tp' id='btntp' title='With this button you can report a TRUE POSITIVE domain!'>Report as True Positive</button>" +
                        "<button class='fp' id='btnfp' title='With this button you can report a FALSE POSITIVE domain!'>Report as False Positive</button>" +
                        "<button class='ko' id='btnko' title='With this button you can report a malicious domain!'>Report as Malicious</button>";

//This is the main function with which we can hide original page and check url
function worstOption(type){

    //Create a new header
    document.head.innerHTML = extensionHeader;

    var title = "";
    if (type == "malicious"){
        title = extensionTitle2;
    }else if (type == "prediction"){
        title = extensionTitle1;
    }

    //Create a new body
    document.body.innerHTML =    extensionMenu +

                                "</br></br>" +

                                title +

                                "</br>" +

                                extensionTable +

                                "<br/><br/><br/>" +

                                extensionCheck +

                                "<br/><br/><br/>" +
                                "</html>";
    
    document.getElementById("btnok").style.display = "none";
    document.getElementById("btntp").style.display = "none";
    document.getElementById("btnfp").style.display = "none";
    document.getElementById("btnko").style.display = "none";

    
    //Listener are necessary because all scripts are blocked. This is the easiest way.
    document.getElementById("btnok").addEventListener("click", reportAsSafe);
    document.getElementById("btntp").addEventListener("click", reportAsMalicious);
    document.getElementById("btnfp").addEventListener("click", falsePositive);
    document.getElementById("btnko").addEventListener("click", reportAsMalicious);

}

//This is the minor option
function minorOption(){

    //Create a new header
    document.head.innerHTML = extensionHeader;

    //Create a new body
    document.body.innerHTML =    extensionMenu +

                                "</br></br>" +

                                "<h1>This page is not included yet in reliable list, do you want to add it?</h1>" +
            
                                "<br/>" +

                                extensionCheck +

                                "<br/><br/><br/>" +
                                "</html>";
    
    document.getElementById("btnok").style.display = "none";
    document.getElementById("btntp").style.display = "none";
    document.getElementById("btnfp").style.display = "none";
    document.getElementById("btnko").style.display = "none";

    
    //Listener are necessary because all scripts are blocked. This is the easiest way.
    document.getElementById("btnok").addEventListener("click", reportAsSafe);
    document.getElementById("btntp").addEventListener("click", reportAsMalicious);
    document.getElementById("btnfp").addEventListener("click", falsePositive);
    document.getElementById("btnko").addEventListener("click", reportAsMalicious);

}

//With this function we add site to whiteList
function reportAsSafe(){
 //   if(prediction < 0.70){
        notifyReliableDomain(domainOnly);
        alert("Domain correctly identified as 'safe'.\nIf you have problem refreshing page, please use 'Reload bypassing cache' function in popup menu.");
        window.location.reload();  
 //   }else{
 //       alert("Results is greater than 0.70, so you can't identify this url as 'safe'.");
 //   }
}

//With this function we add site to blackList
function reportAsMalicious(){
///    if(prediction > 0.50){
        notifyMaliciousDomain(domainOnly);
        alert("Domain correctly identified as 'malicious'.\nIf you have problem refreshing page, please use 'Reload bypassing cache' function in popup menu.");
        window.location.reload();
//    }else{
//        alert("Results is less than 0.50, so you can't identify this url as 'malicious'.");
//    }
}

//With this function we correct url from malicious to reliable list (only if prediction >0.70)
function falsePositive(){
    correctionFromMaliciousToReliable(domainOnly);
    alert("Domain correctly identified as 'false positive'.\nIf you have problem refreshing page, please use 'Reload bypassing cache' function in popup menu.");
    window.location.reload();
}

//Now we get prediction
var prediction;
var resultTable = "";
inference(domainOnly);
responseTime();

function inference(predictionArgument){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', INFERENCE_API, true);

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
			
			var obj = JSON.parse(xmlhttp.response);
			prediction = parseFloat(obj.predict);

            if (!getReliableList().includes(predictionArgument)){
                if (getMaliciousList().includes(predictionArgument)){ 
                    worstOption("malicious");
                }else if (prediction >= 0.50){ 
                    worstOption("prediction");
                }else{ 
                    minorOption();
                }

                resultTable =    "<table>" +
                                    "<tr>";
                if (prediction <= 0.50){
                    resultTable +=       "<td><img id='check_img' alt='NoGreenTick' src='" + browser.runtime.getURL('images/green.png') + "'/></td>" +
                                        "<td>" + prediction + "</td>";

                    document.getElementById("btnok").style.display = "none";
                    document.getElementById("btntp").style.display = "none";
                    document.getElementById("btnfp").style.display = "none";
                    document.getElementById("btnko").style.display = "none";
                    if (!getMaliciousList().includes(predictionArgument)){
                        if (!getReliableList().includes(predictionArgument)){
                            document.getElementById("btnok").style.display = "inline";
                            document.getElementById("btntp").style.display = "inline";
                        }
                    }else{
                        document.getElementById("btnfp").style.display = "inline";
                    }
                }else if (prediction <= 0.70){
                    resultTable +=       "<td><img id='check_img' alt='NoOrangeTick' src='" + browser.runtime.getURL('images/orange.png') + "'/></td>" +
                                        "<td>" + prediction + "</td>";

                    if (!getReliableList().includes(predictionArgument) && !getMaliciousList().includes(predictionArgument)){
                        document.getElementById("btnok").style.display = "inline";
                        document.getElementById("btntp").style.display = "none";
                        document.getElementById("btnfp").style.display = "none";
                        document.getElementById("btnko").style.display = "inline";
                    }else if (!getReliableList().includes(predictionArgument) && getMaliciousList().includes(predictionArgument)){
                        document.getElementById("btnok").style.display = "none";
                        document.getElementById("btntp").style.display = "none";
                        document.getElementById("btnfp").style.display = "inline";
                        document.getElementById("btnko").style.display = "none";
                    }else{
                        document.getElementById("btnok").style.display = "none";
                        document.getElementById("btntp").style.display = "none";
                        document.getElementById("btnfp").style.display = "none";
                        document.getElementById("btnko").style.display = "none";
                    }
                }else{
                    resultTable +=       "<td><img id='check_img' alt='NoRedTick' src='" + browser.runtime.getURL('images/red.png') + "'/></td>" +
                                        "<td>" + prediction + "</td>";

                    document.getElementById("btnok").style.display = "none";
                    document.getElementById("btntp").style.display = "none";
                    document.getElementById("btnfp").style.display = "none";
                    document.getElementById("btnko").style.display = "none";
                    if (!getReliableList().includes(predictionArgument)){
                        document.getElementById("btnfp").style.display = "inline";
                        if (!getMaliciousList().includes(predictionArgument)){
                            document.getElementById("btnko").style.display = "inline";
                        }
                    }
                }
                resultTable +=       "</tr>" +
                                "</table>";

                document.getElementById("checkResponse").innerHTML = resultTable;
            }

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
    xmlhttp.send(JSON.stringify({ "domain" : predictionArgument }));
}