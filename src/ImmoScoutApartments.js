'use strict';

import { ImmoScoutApartmentApplication } from './ImmoScoutApartmentApplication.js';

class ImmoScoutApartments {
    constructor() {
        console.log("ImmoScoutApartments constructed");
    }
    calculateNumberOfPages() {
        try {
            const elements = document.querySelectorAll('.p-items');
            let numberOfPages = 0;
            elements.forEach(element => {
                const value = parseInt(element.textContent, 10);
                if (value > numberOfPages) {
                    numberOfPages = value;
                }
            });
            console.log('Number of pages:', numberOfPages);
            return numberOfPages;
        } catch (error) {
            console.error("Error in calculateNumberOfPages:", error);
            return 0;
        }
    }
    clickNextPageButton() {
        return new Promise((resolve, reject) => {
            try {
                console.log("click next page")
                const nextPageButton = document.querySelector('[aria-label="Next page"]');
                if (nextPageButton) {
                    nextPageButton.click();
                    console.log('Clicked "Next page" button.');

                    // Create a MutationObserver to watch for changes in the DOM
                    const observer = new MutationObserver((mutations, observer) => {
                        // If the DOM changes, check if the new page has loaded
                        // This is a simple example, you may need to adjust the condition to fit your specific needs
                        if (document.querySelector('div.page-loaded')) {
                            // If the new page has loaded, disconnect the observer and resolve the promise
                            observer.disconnect();
                            resolve();
                        }
                    });

                    // Start observing the document with the configured parameters
                    observer.observe(document, { childList: true, subtree: true });
                } else {
                    console.log('Could not find "Next page" button.');
                    reject(new Error('Could not find "Next page" button.'));
                }
            } catch (error) {
                console.error("Error in clickNextPageButton:", error);
                reject(error);
            }
        });
    }

    extractListItems() {
        try {
            const liElements = document.querySelectorAll('li.result-list__listing');
            const itemList = [];
            liElements.forEach(li => {
                itemList.push(li.outerHTML);
            });
            return itemList;
        } catch (error) {
            console.error("Error in extractListItems:", error);
            return [];
        }
    }

    filterOutBookmarkedImmoScoutApartments(apartmentItems) {
        try {
            const filteredItems = [];
            apartmentItems.forEach(item => {
                const hasBookmarkButton = item.includes('shortlist-star--shortlisted');
                if (!hasBookmarkButton) {
                    filteredItems.push(item);
                }
            });
            return filteredItems;
        } catch (error) {
            console.error("Error in filterOutBookmarkedImmoScoutApartments:", error);
            return [];
        }
    }

    extractApartmentLinks(apartmentItems) {
        try {
            const apartmentLinks = [];
            apartmentItems.forEach(item => {
                let href = item.match(/href="([^"]*)/)[1];
                let link = "https://www.immobilienscout24.de" + href;
                if (link.includes("expose")) {
                    apartmentLinks.push(link);
                }
            });
            return apartmentLinks;
        } catch (error) {
            console.error("Error in extractApartmentLinks:", error);
            return [];
        }
    }

    async openApartmentLinksSequentially(apartmentLinks) {
        try {
            const windowObjectReference = window.open('', 'ApartmentLink');
            for (let i = 0; i < apartmentLinks.length; i++) {
                try {
                    windowObjectReference.location = apartmentLinks[i];
                    windowObjectReference.focus();
                    const apartmentApp = new ImmoScoutApartmentApplication(windowObjectReference);
                    await apartmentApp.apply();
                    //windowObjectReference.close();
                } catch (error) {
                    console.error('An error occurred:', error);
                }
            }
        } catch (error) {
            console.error("Error in openApartmentLinksSequentially:", error);
        }
    }

}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const main = () => {
    console.log('Hello from content_main.js!');
};

async function waitForDOMContentLoaded(document) {
    return new Promise(resolve => {
        console.log("Waiting for DOMContentLoaded event");
        document.addEventListener("DOMContentLoaded", resolve, { once: true });
    });
}

export { ImmoScoutApartments };
