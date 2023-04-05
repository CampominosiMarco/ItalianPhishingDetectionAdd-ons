
//https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_action


function openPage() {
	browser.tabs.create({
		url: "https://github.com/CampominosiMarco/ItalianPhishingDetectionAdd-ons",
	});
}

browser.browserAction.onClicked.addListener(openPage);




//For more info:
//		https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background
//		https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onHeadersReceived
//		https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/web_accessible_resources
//		https://content-security-policy.com/

var myArrayListFromJson = [];	//This is array containing my "white pages"
var myfilter = "<all_urls>";	//This is default filter, it blocks all urls
const WL_URL ="http://www.cm-innovationlab.it:5000/api/v2/list/reliable";		//This is the API on my website to get "white list"

function initializeReliableList(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', WL_URL, true);

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
			
			var obj = JSON.parse(xmlhttp.response);
			myArrayListFromJson = obj.reliableList;
            
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

function logURL(headerDetails) {	//This is callback of listener

	if (myArrayListFromJson.length === 0){
		initializeReliableList();	//First of all is necessary to get my personal authorized list
	}

	if (myArrayListFromJson.includes(headerDetails.url.split("://")[1].split("/")[0].split(":")[0].replace("www.", ""))){	//Extract only domain without www.

		myfilter = "";	//If url is included in our list is necessary to set an empty filter because is impossible to exclude it from <all_urls>

	}else{

		//Otherwise we set a specific CSP to update response
		const CSP_default = {
			name: "Content-Security-Policy",
			value: "default-src 'none';"	//Default policy, used in any case (JavaScript, Fonts, CSS, Frames etc.) except if overridden by a more precise directive.
		};
	
		headerDetails.responseHeaders.push(CSP_default);
		return { responseHeaders: headerDetails.responseHeaders };	//needed to update response with new CSP
	}
}

browser.webRequest.onHeadersReceived.addListener(				//addListener(callback, filter, extraInfoSpec)
	logURL,
	{ urls: [myfilter] },										//filter example -> "*://*.cm-innovationlab.it/*"
	["blocking", "responseHeaders"]								//"blocking" is needed for manifest.json permissions
);