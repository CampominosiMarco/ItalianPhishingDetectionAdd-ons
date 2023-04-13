function waitFor(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

//This is one of highest time of response from server
function responseTime() {
    waitFor(450);
}