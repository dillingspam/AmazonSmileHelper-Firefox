var tokenInfo = false; // initialize token info

// set tokenInfo if cookie found
function setTokenInfo(cookie) {
    if (cookie) {
        console.log(cookie)
        if (cookie.domain === ".amazon.com") {
            tokenInfo = true;
        }
    }
    else {
        tokenInfo = false;
    }
}

// check for cookie based on window type then send promise getting to setTokenInfo
function getCookie(window) {
    console.log(window);
    if (window.incognito === true) {
        getting = browser.cookies.get({ name: "sess-at-main", url: "https://www.amazon.com", storeId: "firefox-private" });
    }
    else {
        getting = browser.cookies.get({ name: "sess-at-main", url: "https://www.amazon.com" });
    }
    getting.then(setTokenInfo);
}

// get current window to determine if private browsing
function getToken() {
    var gettingWindow = browser.windows.getCurrent()
    gettingWindow.then(getCookie);
}

// redirect amazon when token is true
function redirect(requestDetails) {
    console.log(tokenInfo);
    if (tokenInfo === true) {
        tokenInfo = false;
        console.log("Redirecting: " + requestDetails.url);
        return { redirectUrl: "https://smile.amazon.com" };
    }
}

browser.webRequest.onBeforeRedirect.addListener(
    getToken,
    { urls: ["https://www.amazon.com/*"] }
);

browser.webRequest.onHeadersReceived.addListener(
    redirect,
    { urls: ["https://www.amazon.com/*"] },
    ["blocking"]
);

browser.webRequest.onBeforeRequest.addListener(
    getToken,
    { urls: ["https://www.amazon.com/*"] },
    ["blocking"]
);