//This script contains all lists and relative XMLHttpRequest function
var reliableList;
var maliciousList;

//This function download all lists from server
function downloadAllLists(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', ALL_API, true);

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
			
			var obj = JSON.parse(xmlhttp.response);

			reliableList = obj.reliableList;
			maliciousList = obj.maliciousList;
            
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
}

//Initialization
downloadAllLists();

//This function update reliable list from server
function updateReliableList(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', RELIABLE_API, true);

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
			
			var obj = JSON.parse(xmlhttp.response);

			reliableList = obj.reliableList;
            
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
}

//This function update malicious list from server
function updateMaliciousList(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', MALICIOUS_API, true);

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
			
			var obj = JSON.parse(xmlhttp.response);

            maliciousList = obj.maliciousList;
            
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
}

function getReliableList(){
	return reliableList;
}

function getMaliciousList(){
	return maliciousList;
}

function getReliableListWithUpdate(){
    updateReliableList();
    return reliableList;
}

function getMaliciousListWithUpdate(){
    updateMaliciousList();
    return maliciousList;
}

//This function add a domain to malicious list on server
function notifyMaliciousDomain(domainOnly){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', BAD_API, true);

    xmlhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            
            var obj = JSON.parse(xmlhttp.response);
            maliciousList = obj.maliciousList;

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
    xmlhttp.send(JSON.stringify({ "add" : domainOnly }));
}

//This function add a domain to reliable list on server
function notifyReliableDomain(domainOnly){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', ADD_API, true);

    xmlhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            
            var obj = JSON.parse(xmlhttp.response);
            reliableList = obj.reliableList;

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
    xmlhttp.send(JSON.stringify({ "add" : domainOnly }));
}

//This function is useful to correct a domain from reliable to malicious list on server
function correctionFromMaliciousToReliable(domainOnly){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', CORRECTION_API, true);

    xmlhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            
            var obj = JSON.parse(xmlhttp.response);
            reliableList = obj.reliableList;
            maliciousList = obj.maliciousList;

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
    xmlhttp.send(JSON.stringify({ "add" : domainOnly }));
}