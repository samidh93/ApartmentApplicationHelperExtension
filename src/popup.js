//popup.js

document.addEventListener('DOMContentLoaded', function () {
    const executeApplicationButton = document.getElementById('executeApplication');
    executeApplicationButton.addEventListener('click', async function () {
        await sendMessageToActiveTab({ action: "Apply" });
    });

    const openImmoSearchButton = document.getElementById('openImmoSearch');
    openImmoSearchButton.addEventListener('click', async function () {
        await sendMessageToBackground({ action: "Search" });
    });

    const takeScreenshotButton = document.getElementById('takeScreenshot');
    takeScreenshotButton.addEventListener('click', async function () {
       await sendMessageToBackground({ action: "takeScreenshot" });
    });
});

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

async function sendMessageToBackground(message) {
    try {
        const response = await chrome.runtime.sendMessage(message);
        // do something with response here, not outside the function
        console.log(response);
    }
    catch (error) {
        console.error(error);
    }
}

