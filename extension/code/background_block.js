//For more info:
//		https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background
//		https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onHeadersReceived
//		https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/web_accessible_resources
//		https://content-security-policy.com/

var myfilter = "<all_urls>";	//This is default filter, it blocks all urls

function logURL(headerDetails) {	//This is callback of listener

	var onlyDomain = headerDetails.url.split("://")[1].split("/")[0].split(":")[0].replace("www.", "");	//Extract only domain without www.

	if (getReliableList().includes(onlyDomain) ){

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

//This listener is important to refresh reliable list
browser.tabs.onUpdated.addListener(updateLists);

function updateLists() {
	updateReliableList();
}

//This listener is le last chance to refresh reliable list
browser.windows.onFocusChanged.addListener(updateLists);