// background.js
'use strict';

import { fetchData } from './api.js';


// Function to execute the code interacting with DOM elements
async function openImmoSearch() {
    try {
        const searchLink = "https://www.immobilienscout24.de/Suche/de/berlin/berlin/wohnung-mieten?haspromotion=false&numberofrooms=2.0-&price=-1000.0&livingspace=50.0-&exclusioncriteria=swapflat&pricetype=rentpermonth&enteredFrom=saved_search";
        // Send a message to the background script to open the search link in a new tab
        chrome.tabs.create({ url: searchLink });
    } catch (error) {
        console.error("Error opening Immo Search:", error);
    }
}
async function takeScreenshot() {
    try {
        chrome.tabs.captureVisibleTab(null, {}, async function (imageUrl) {
            // forward the image to the content script
            await sendMessageToActiveTab({ action: "Recognize", imageUrl: imageUrl });
        });
    } catch (error) {
        console.error("Error taking screenshot:", error);
    }
}

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    if (message.action === "takeScreenshot") {
        console.log("Taking screenshot");
        // Proceed with taking screenshot
        try {
            await takeScreenshot();
        } catch (error) {
            console.error("Error handling message:", error);
            sendResponse({ success: false, error: error.message }); // Sending error response back to the sender
        }
    }
    else if (message.action === "nextPage") {
        // Proceed with opening next page
        try {
            console.log("Opening next page number: ", message.number, "Link: ", message.link);
             await sendMessageToActiveTab({ action: "Apply" });
             sendResponse({ success: true }); // Sending error response back to the sender

        } catch (error) {
            console.error("Error handling message:", error);
            sendResponse({ success: false, error: error.message }); // Sending error response back to the sender
        }
    }

    else if (message.action === "Search") {
        console.log("Opening Immo Search");
        await openImmoSearch();
    }

    else if (message.action === "fetchData") {
        console.log("Fetching data");
        try {
            const Data = await fetchData();
            console.log("Data received:", Data);
            sendResponse({ success: true }); // Sending response back to the sender
        } catch (error) {
            console.error("Error fetching data:", error);
            sendResponse({ success: false, error: error.message }); // Sending error response back to the sender
        }
    }
    return true; // Indicate that we will send a response asynchronously

});

chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
        showReadme();
    }
});

chrome.action.onClicked.addListener(() => {
    showReadme();
});

function showReadme() {
    chrome.tabs.create({ url: './html/index.html' });
}

async function sendMessageToActiveTab(message) {
    try {
        const tab = await chrome.tabs.query({ active: true, currentWindow: true });
        const response = await chrome.tabs.sendMessage(tab[0].id, message);
        // do something with response here, not outside the function
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

function downloadImage(imageUrl, filename) {
    chrome.downloads.download({
        url: imageUrl,
        filename: filename
    });
}