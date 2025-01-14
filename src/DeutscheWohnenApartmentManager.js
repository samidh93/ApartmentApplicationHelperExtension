'use strict';

import { DeutscheWohnenApartment } from './DeutscheWohnenApartment.js';

class DeutscheWohnenApartmentManager {
    constructor() {
        console.log("DeutscheWohnenApartmentManager constructed");
    }

    async process_all_pages() {
        let pages = this.listPages();
        for (let i = 0; i < pages; i++) {
            try {
                this.process_page();
                //this.clickNextPageButton();
                break;
            } catch (error) {
                console.error("Error in process_all_pages:", error);
            }

        }
    }

    async process_page() {
        let IDs = this.listApartmentsIDs();
        for (let id of IDs) {
            try {
                let data = await this.getApartmentStored(id);
                if (data === null) {
                    console.log("Apartment not stored, adding it");
                    let apartment = new DeutscheWohnenApartment();
                    // You may want to do something with the 'apartment' object here
                } else {
                    console.log("Apartment already stored");
                    // You may want to do something with the 'data' object here
                }
            } catch (error) {
                console.error("Error retrieving apartment from storage: ", error);
            }
        }
        // list id stored
        this.listIDstored();
    }

    getApartmentStored(id) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(id, function (data) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else if (Object.keys(data).length === 0) {
                    resolve(null);
                } else {
                    resolve(data);
                    console.log('Apartment details retrieved from storage ID: ' + id);
                    console.log("data: ");
                    console.log(data);
                }
            });
        });
    }

    deleteApartmentStored(id) {
        chrome.storage.sync.get(id, function (result) {
            if (Object.keys(result).length) {
                chrome.storage.sync.remove(id, function () {
                    console.log('Apartment details removed from storage ID: ' + id);
                });
            } else {
                console.log('delete error:: No apartment details found in storage for ID: ' + id);
            }
        });
    }
    listIDstored() {
        chrome.storage.sync.get(null, function (items) {
            if (Object.keys(items).length === 0) {
                console.log("list items failed:: No items stored.");
            } else {
                console.log("Stored items: ");
                console.log(items);
            }
        });
    }
    saveApartmentToStorage(apartment) {
        const apartmentObject = apartment.toObject();
        chrome.storage.sync.set({ [apartment._id]: apartmentObject }, function () {
            console.log('Apartment details saved to storage');
            console.log(apartmentObject);
        });
    }

    listApartmentsIDs() {
        // <li class="object-list__item">
        let hrefs = []  // Array to store hrefs
        let IDs = []  // Array to store IDs
        let apartmentList = document.querySelectorAll("li.object-list__item").forEach((apartment) => {
            // get href <a href="/expose/object/89-1710200004" >
            let href = apartment.querySelector("a").getAttribute("href");
            hrefs.push(href);
            let id = href.split("/")[3];
            IDs.push(id);
            console.log("listing apartment ID: " + id);
        });
        return IDs;
    }

    listPages() {
        let pagesNum = 0;
        try {
            let pages = document.querySelectorAll("li.pagination__item").forEach((page) => {
                // check if it is a number
                if (page.innerText.match(/^\d+$/)) {
                    pagesNum++;
                }
            });
            console.log("Number of pages: " + pagesNum);
        }
        catch (error) {
            console.error("Error in listPages:", error);
        }
        return pagesNum;
    }

    clickNextPageButton() {
        return new Promise((resolve, reject) => {
            try {
                // Find the next button element
                const nextPageButton = document.querySelector('.pagination__icon--next').parentElement;
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

}

export { DeutscheWohnenApartmentManager };