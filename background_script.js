var tokenInfo = 0; // initialize token info

// receives promise getting from getTokenLength and sets tokenInfo length if cookie found or 0 if not
function setTokenInfo(cookie) {
    if (cookie) {
        if (cookie.domain === ".amazon.com") {
            tokenInfo = cookie.value.length;
        }
    }
    else {
        tokenInfo = 0;
    }
}

// get amazon token cookie and send promise getting to setTokenInfo
function getTokenLength() {
    var getting = browser.cookies.get({ name: "session-token", url: "https://www.amazon.com" });
    getting.then(setTokenInfo);
}

// when signed into amazon token is longer than 220 then reset tokenInfo and redirect
function redirect(requestDetails) {
    console.log(tokenInfo);
    if (tokenInfo >= 220) {
        tokenInfo = 0;
        console.log("Redirecting: " + requestDetails.url);
        return { redirectUrl: "https://smile.amazon.com" };
    }
}

browser.webRequest.onBeforeRedirect.addListener(
    getTokenLength,
    { urls: ["https://www.amazon.com/*"] },
);

browser.webRequest.onHeadersReceived.addListener(
    redirect,
    { urls: ["https://www.amazon.com/*"] },
    ["blocking"]
);

browser.webRequest.onBeforeRequest.addListener(
    getTokenLength,
    { urls: ["https://www.amazon.com/*"] },
    ["blocking"]
);