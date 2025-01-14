'use strict';
// Base class for storing ImmoScoutApartments
class BaseApartment {
    constructor(id, link, rooms, price, location) {
      this._id = id;
      this._link = link;
      this._rooms = rooms;
      this._price = price;
      this._location = location;
    }
  
  
    // Method to convert apartment details to an object
    toObject() {
      return {
        id: this._id,
        link: this._link,
        rooms: this._rooms,
        price: this._price,
        location: this._location
      };
    }
  
    // Method to save apartment details to chrome storage
    saveToStorage() {
      const apartmentObject = this.toObject();
      chrome.storage.sync.set({ [this._id]: apartmentObject }, function() {
        console.log('Apartment details saved to storage');
        console.log(apartmentObject);
      });
    }

    // Method to get apartment details from chrome storage
    getFromStorage() {
      return new Promise((resolve, reject) => {
        chrome.storage.sync.get(this._id, function(data) {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(data);
            console.log('Apartment details retrieved from storage');
            console.log(data);
          }
        });
      });
    }
  }
  

  export  {BaseApartment};