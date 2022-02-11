var signIn = false; // initialize token info

// set signIn if cookie found
function cookieStatus(cookie) {
    if (cookie) {
        if (cookie.domain === ".amazon.com") {
            signIn = true;
        }
    }
    else {
        signIn = false;
    }
}

// check for cookie based on window type then send promise getting to cookieStatus
function getCookie(window) {
    if (window.incognito === true) {
        getting = browser.cookies.get({ name: "sess-at-main", url: "https://www.amazon.com", storeId: "firefox-private" });
    }
    else {
        getting = browser.cookies.get({ name: "sess-at-main", url: "https://www.amazon.com" });
    }
    getting.then(cookieStatus);
}

// get current window to determine if private browsing
function getActiveWindow(details) {
    var gettingWindow = browser.windows.getCurrent()
    gettingWindow.then(getCookie);
}

// redirect amazon when token is true
function redirect(requestDetails) {
    console.log(signIn);
    if (signIn === true) {
        signIn = false;
        console.log("Redirecting: " + requestDetails.url);
        return { redirectUrl: requestDetails.url.replace('https://www.amazon.com', 'https://smile.amazon.com') };
    }
}

browser.webRequest.onBeforeRedirect.addListener(
    getActiveWindow,
    { urls: ["https://www.amazon.com/*"], types: ["main_frame"] }
);

browser.webRequest.onHeadersReceived.addListener(
    redirect,
    { urls: ["https://www.amazon.com/*"] },
    ["blocking"]
);

browser.webRequest.onBeforeRequest.addListener(
    getActiveWindow,
    { urls: ["https://www.amazon.com/*"], types: ["main_frame"] },
    ["blocking"]
);