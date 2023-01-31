/*

function logURL(requestDetails) {
  console.log(`Loading: ${requestDetails.url}`);
}

browser.webRequest.onBeforeRequest.addListener(
  logURL,
  {urls: ["<all_urls>"]}
);

*/


//https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background

//ESEMPIO PRESO DA https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onHeadersReceived

function logURL2(headerDetails) {
  console.log(`received: ${headerDetails.url}`);




  const setCSP = {
    name: "Content-Security-Policy",
    value: "default-src 'none'"//'none'"		http://example.com
  };
  headerDetails.responseHeaders.push(setCSP);

  

  
  //FUNZIONA
  
	for (var j = 0; j < headerDetails.responseHeaders.length; j++){

	console.log(headerDetails.responseHeaders[j]);

	}

  


console.log(`received: ${headerDetails.statusCode}`);




//FONDAMENTALE PER AGGIORNARE LA RISPOSTA CON IL CSP

  return { responseHeaders: headerDetails.responseHeaders };


  
}

browser.webRequest.onHeadersReceived.addListener(
  logURL2,
  { urls: ["<all_urls>"] },
  ["blocking", "responseHeaders"]//"blocking", //FONDAMENTALE IL BLOCKING CON I PERMESSI DEL MAINIFEST
);
