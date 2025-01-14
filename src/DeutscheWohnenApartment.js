'use strict';

import { BaseApartment } from './BaseApartment.js';


class DeutscheWohnenElementLocator {
    // Your code here
    constructor() {
    }

    getApartmentLink() {
        // Your code here
        let url = document.location.href;
        console.log("URL: "+url );
        let id = url.split("/").pop();
        console.log("ID: "+id);
        return url;
    }
    getApartmentID() {
        // Your code here
        let ID = document.querySelector("#object-detail > div.object-detail__content-container > div.object-detail__header.module.fade-in-early > p").innerHTML;
        // extract ID from string Objektnummer: 89-1710200004
        ID = ID.split(":").pop().trim();
        console.log("ID: "+ID);
        return ID;
    }
    getApartmentRooms() {

        let rooms = document.querySelector("#object-detail > div.object-detail__content-container > div:nth-child(2) > table > tbody > tr:nth-child(4) > td:nth-child(2)").innerHTML;
        console.log("rooms: "+rooms);
        return rooms;
    }
    getApartmentLocation() {
        // get only text from this:                  
        let location = document.querySelector("#object-detail > div.object-detail__content-container > div.object-detail__header.module.fade-in-early > div").textContent;
        console.log("location: "+location.trim()   );
        return location.trim();
    }

    getApartmentPrice() {
        let price = document.querySelector("#object-detail > div.object-detail__content-container > div:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(2)").innerHTML;
        console.log("price: "+price);
        return price;
    }
}


class DeutscheWohnenApartment extends BaseApartment {
    BaseUrl = "https://www.deutsche-wohnen.com/expose/object/"
    // Your code here
    constructor() {
       const ElementLocator = new DeutscheWohnenElementLocator();
        super(ElementLocator.getApartmentID(), ElementLocator.getApartmentLink(), ElementLocator.getApartmentRooms(), ElementLocator.getApartmentPrice(), ElementLocator.getApartmentLocation());
    }
}

export { DeutscheWohnenApartment, DeutscheWohnenElementLocator };