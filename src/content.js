//content.js


function recognizeImage(imageUrl) {
  Tesseract.recognize(
    imageUrl,
    'eng',
    { logger: m => console.log(m) }
  ).then(({ data: { text } }) => {
    console.log(text);
  });
}

async function ImmoProcessPage(i, apartmentList) {
  try {
    console.log("Processing page:", i);
    const items = apartmentList.extractListItems();
    const filteredItems = apartmentList.filterOutBookmarkedImmoScoutApartments(items);
    const apartmentLinks = apartmentList.extractApartmentLinks(filteredItems);
    if (apartmentLinks.length > 0) {
      console.log(apartmentLinks);
      await apartmentList.openApartmentLinksSequentially(apartmentLinks);
    } else {
      console.log("No apartment links found on page:", i);
      console.log("Empty list");
    }
    chrome.runtime.sendMessage({ action: 'nextPage', number: i, link: window.location.href })
      .then(async (response) => {
        console.log('Response from background script:', response);
        await apartmentList.clickNextPageButton();
      })
      .catch((error) => {
        console.error('Error sending message to background script:', error);
      });
  } catch (error) {
    console.error(`Error processing page ${i}:`, error);
  }
}
async function ImmoProcessApartmentPages() {
  try {
    // Import the ImmoScoutApartments class
    const moduleUrl = chrome.runtime.getURL('src/ImmoScoutApartments.js');
    const { ImmoScoutApartments } = await import(moduleUrl);

    const apartmentList = new ImmoScoutApartments();
    const pages = apartmentList.calculateNumberOfPages();

    for (let i = 0; i < pages; i++) {
      await ImmoProcessPage(i, apartmentList);
    }
  } catch (error) {
    console.error("Error processing apartment links:", error);
  }
}

async function DeutscheWohnenManage() {
  try {
    const moduleUrl = chrome.runtime.getURL('src/DeutscheWohnenApartmentManager.js');
    const { DeutscheWohnenApartmentManager } = await import(moduleUrl);
    const manager = new DeutscheWohnenApartmentManager();
    await manager.process_all_pages();
  }
  catch (error) {
    console.error("Error managing Deutsche Wohnen apartments:", error);
  }
}

async function waitForDOMContentLoaded() {
  return new Promise(resolve => {
    console.log("Waiting for DOMContentLoaded event");
    document.addEventListener("DOMContentLoaded", resolve, { once: true });
  });
}

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
  if (message.action === "Apply") {
    try {
      console.log("Executing Applications");
      //  ImmoProcessApartmentPages();
      DeutscheWohnenManage();
    }
    catch (error) {
      console.error("Error handling message:", error);
      sendResponse({ success: false, error: error.message }); // Sending error response back to the sender
    }
  }
  else if (message.action === "Recognize") {
    console.log("Recognizing image");
    recognizeImage(message.imageUrl);
  }
  sendResponse({ "message": "Message received successfully" });
  return true;
});

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
