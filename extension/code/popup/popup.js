//This script is needed for popup of extension
var predictionPopUp;
var lastPredictionArgument;

//This function get a prediction from model and creates a little table with image and evaluation in float
function popUpCheck(predictionArgument, destination){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', INFERENCE_API, true);

    xmlhttp.onreadystatechange = function() {

        var output = "";
        if (this.readyState == 4 && this.status == 200) {

            var obj = JSON.parse(xmlhttp.response);
            predictionPopUp = parseFloat(obj.predict);
            lastPredictionArgument = predictionArgument;

            output =    "<table>" +
                            "<tr>";
                            
            if (predictionPopUp <= 0.50){
                output +=       "<td style='min-width:20px;'><img id='check_img' alt='NoGreenTick' src='" + browser.runtime.getURL('images/green.png') + "'/></td>" +
                                "<td>" + predictionPopUp + "</td>";

                document.getElementById("btnokPopup").style.display = "none";
                document.getElementById("btntpPopup").style.display = "none";
                document.getElementById("btnfpPopup").style.display = "none";
                document.getElementById("btnkoPopup").style.display = "none";
                if (!getMaliciousList().includes(predictionArgument)){
                    if (!getReliableList().includes(predictionArgument)){
                        document.getElementById("btnokPopup").style.display = "inline";
                        document.getElementById("btntpPopup").style.display = "inline";
                    }
                }else{
                    document.getElementById("btnfpPopup").style.display = "inline";
                }
            }else if (predictionPopUp <= 0.70){
                output +=       "<td style='min-width:20px;'><img id='check_img' alt='NoOrangeTick' src='" + browser.runtime.getURL('images/orange.png') + "'/></td>" +
                                "<td>" + predictionPopUp + "</td>";

                if (!getReliableList().includes(predictionArgument) && !getMaliciousList().includes(predictionArgument)){
                    document.getElementById("btnokPopup").style.display = "inline";
                    document.getElementById("btntpPopup").style.display = "none";
                    document.getElementById("btnfpPopup").style.display = "none";
                    document.getElementById("btnkoPopup").style.display = "inline";
                }else if (!getReliableList().includes(predictionArgument) && getMaliciousList().includes(predictionArgument)){
                    document.getElementById("btnokPopup").style.display = "none";
                    document.getElementById("btntpPopup").style.display = "none";
                    document.getElementById("btnfpPopup").style.display = "inline";
                    document.getElementById("btnkoPopup").style.display = "none";
                }else{
                    document.getElementById("btnokPopup").style.display = "none";
                    document.getElementById("btntpPopup").style.display = "none";
                    document.getElementById("btnfpPopup").style.display = "none";
                    document.getElementById("btnkoPopup").style.display = "none";
                }
            }else{
                output +=       "<td style='min-width:20px;'><img id='check_img' alt='NoRedTick' src='" + browser.runtime.getURL('images/red.png') + "'/></td>" +
                                "<td>" + predictionPopUp + "</td>";

                document.getElementById("btnokPopup").style.display = "none";
                document.getElementById("btntpPopup").style.display = "none";
                document.getElementById("btnfpPopup").style.display = "none";
                document.getElementById("btnkoPopup").style.display = "none";
                if (!getReliableList().includes(predictionArgument)){
                    document.getElementById("btnfpPopup").style.display = "inline";
                    if (!getMaliciousList().includes(predictionArgument)){
                        document.getElementById("btnkoPopup").style.display = "inline";
                    }
                }
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
    xmlhttp.send(JSON.stringify({ "domain" : predictionArgument }));
}

//This function is called from listener to prpare the prediction
function evaluation(){
    if (document.getElementById("inputURL").value != ""){

        //Variables reset
        predictionPopUp = 0.0;
        lastPredictionArgument = "";
        document.getElementById("textReport").innerHTML = "";

        //This standard Regular Expression is necessary to identify a string as URL
        var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
        var regex = new RegExp(expression);
        var originalURL = document.getElementById("inputURL").value;
        
        if (!originalURL.match(regex)) {
            document.getElementById("btnokPopup").style.display = "none";
            document.getElementById("btntpPopup").style.display = "none";
            document.getElementById("btnfpPopup").style.display = "none";
            document.getElementById("btnkoPopup").style.display = "none";
            document.getElementById("checkResponsePopup").innerHTML = "Attention! Please insert a valid URL.";
            return;
        }

        //User can check for a domain without schema so it's necessary to check it
        const tempArray = originalURL.split("://");

        let onlyDomain //Extract only domain without www. to get a standard prediction
        if (tempArray.length == 2){
            onlyDomain = tempArray[1].split("/")[0].split(":")[0].replace("www.", "");	
        }else{
            onlyDomain = tempArray[0].split("/")[0].split(":")[0].replace("www.", "");	
        }

        //Set a title of input field as domain
        document.getElementById("inputURL").title = onlyDomain;

        popUpCheck(onlyDomain, 'checkResponsePopup');
    }
}

//Now it's important to set listener on button and on input field change (this one is more user friendly)
document.getElementById("startPrediction").addEventListener("click", evaluation);
document.getElementById("inputURL").addEventListener("change", evaluation);

//With this function we add site to blackList
function reportAsMalicious(){
 //   if(predictionPopUp > 0.50 && lastPredictionArgument == document.getElementById("inputURL").title){

        notifyMaliciousDomain(lastPredictionArgument);
        document.getElementById("textReport").innerHTML = "Domain correctly identified as 'malicious'.";

 //   }else if (predictionPopUp < 0.50){
 //       document.getElementById("textReport").innerHTML = "Results is less than 0.50, so you can't identify this url as 'malicious'.";
 //   }
}

//With this function we add site to whiteList
function reportAsSafe(){
  //  if(predictionPopUp < 0.70 && lastPredictionArgument == document.getElementById("inputURL").title){

        notifyReliableDomain(lastPredictionArgument);
        document.getElementById("textReport").innerHTML = "Domain correctly identified as 'safe'.";

  //  }else if (predictionPopUp > 0.70){
  //      document.getElementById("textReport").innerHTML = "Results is greater than 0.70, so you can't identify this url as 'safe'.";
  //  }
}

//With this function we correct url from malicious to reliable list (only if prediction >0.70)
function falsePositive(){
    correctionFromMaliciousToReliable(lastPredictionArgument);
    document.getElementById("textReport").innerHTML = "Domain correctly identified as 'false positive'.";
}

//Listener on button
document.getElementById("btnokPopup").addEventListener("click", reportAsSafe);
document.getElementById("btntpPopup").addEventListener("click", reportAsMalicious);
document.getElementById("btnfpPopup").addEventListener("click", falsePositive);
document.getElementById("btnkoPopup").addEventListener("click", reportAsMalicious);

//Listener on list to force refresh without cache
document.getElementById("forceReload").addEventListener("click", forceReload);

//This is a brute force solution to bypass cache in case of problems with refresh
function forceReload() {
	browser.tabs.reload({bypassCache: true});
}