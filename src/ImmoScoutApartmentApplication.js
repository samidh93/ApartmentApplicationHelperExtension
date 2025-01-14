'use strict';

class ImmoScoutApartmentApplication {
    constructor(tab) {
        this.tab = tab;
        this.document = tab.document;
        this.container = null;
        this.form = null;
        console.log("Apartment application constructed");
    }

    clickContactButton() {
        try {
            const contactButton = this.document.querySelector("#contact-realtor-desk");
            if (contactButton) {
                contactButton.click();
                console.log("Clicked on contact button.");
            } else {
                console.log("Contact button not found.");
            }
        } catch (error) {
            console.error("Error in clickContactButton:", error);
        }
    }

    getContactLandlordName() {
        try {
            const landlord = this.document.querySelector('[data-qa="contactName"]');
            if (landlord) {
                const landlordName = landlord.textContent.trim();
                console.log("Landlord Name:", landlordName);
                return landlordName;
            } else {
                console.log("Landlord name not found.");
                return null;
            }
        } catch (error) {
            console.error("Error in getContactLandlordName:", error);
            return null;
        }
    }

    findContainerInFrame() {
        try {

            const containerElement = this.document.querySelector('div.absolute-reference.contentContainer');
            if (containerElement) {
                console.log("Container found:", containerElement);
                this.container = containerElement;
            } else {
                console.log("Container not found.");
            }
        } catch (error) {
            console.error("Error in findContainerInFrame:", error);
        }
    }

    findFormInFrame() {
        try {
            const formElement = this.container.querySelector('[name="contactFormContainer.form"]');
            if (formElement) {
                console.log("Form found:", formElement);
                this.form = formElement;
            } else {
                console.log("Form not found.");
            }
        } catch (error) {
            console.error("Error in findFormInFrame:", error);
        }
    }
    selectNumberOfPersons(value) {
        try {
            // Get the select element by its ID
            let selectElement = this.form.querySelector("#contactForm-numberOfPersons");

            // Loop through the options
            for (let i = 0; i < selectElement.options.length; i++) {
                // Check if the option value matches the desired value
                if (selectElement.options[i].value === value) {
                    // Set the option as selected
                    selectElement.options[i].selected = true;
                    break; // Exit the loop since we found the option
                }
            }
        } catch (error) {
            console.error("An error occurred while selecting the option:", error);
        }
    }

    createMessageLandlord(landlordName) {
        try {
            const userMessage = `
            Guten Tag ${landlordName},

            mein Name ist Sami Dhiab und ich bin an der Wohnung interessiert. 
            Ich habe bereits die Bewerbungsunterlagen hochgeladen und würde mich freuen, 
            wenn Sie mich als Mieter in Betracht ziehen würden.

            Mit freundlichen Grüßen,
            Sami Dhiab
            `;
            return userMessage;
        } catch (error) {
            console.error("Error in createMessageLandlord:", error);
            return null;
        }
    }

    fillMessageField(userMessage) {
        try {
            const messageField = this.form.querySelector('[id="contactForm-Message"]');
            if (messageField) {
                messageField.value = '';
                messageField.value = userMessage.trim();
                console.log("Filled message field with user message");
            } else {
                console.log("Message field not found.");
            }
        } catch (error) {
            console.error("Error in fillMessageField:", error);
        }
    }

    hasPets(value) {
        try {
            // Get the select element by its ID
            let selectElement = this.form.querySelector("#contactForm-hasPets");

            // Loop through the options
            for (let i = 0; i < selectElement.options.length; i++) {
                // Check if the option value matches the desired value
                if (selectElement.options[i].value === value) {
                    // Set the option as selected
                    selectElement.options[i].selected = true;
                    break; // Exit the loop since we found the option
                }
            }
        } catch (error) {
            console.error("An error occurred while selecting the option:", error);
        }
    }

    selectIncome(value) {
        try {
            // Get the select element by its ID
            let selectElement = this.form.querySelector("#contactForm-income");

            // Loop through the options
            for (let i = 0; i < selectElement.options.length; i++) {
                // Check if the option value matches the desired value
                if (selectElement.options[i].value === value) {
                    // Set the option as selected
                    selectElement.options[i].selected = true;
                    break; // Exit the loop since we found the option
                }
            }
        } catch (error) {
            console.error("An error occurred while selecting the option:", error);
        }
    }

    selectApplicationPackageCompleted(value) {
        try {
            // Get the select element by its ID
            let selectElement = this.form.querySelector("#contactForm-applicationPackageCompleted");

            // Loop through the options
            for (let i = 0; i < selectElement.options.length; i++) {
                // Check if the option value matches the desired value
                if (selectElement.options[i].value === value) {
                    // Set the option as selected
                    selectElement.options[i].selected = true;
                    break; // Exit the loop since we found the option
                }
            }
        } catch (error) {
            console.error("An error occurred while selecting the option:", error);
        }
    }

    clickSendApplicationButton() {
        try {
            const sendApplicationButton = this.form.querySelector('[data-qa="sendButtonBasic"]');
            if (sendApplicationButton) {
                sendApplicationButton.click();
                console.log("Clicked on send application button.");
            } else {
                console.log("Send application button not found.");
            }
        } catch (error) {
            console.error("Error in clickSendApplicationButton:", error);
        }
    }

    async apply() {
        try {
            this.clickContactButton();
            await delay(2000);
            this.findContainerInFrame();
            await delay(2000);
            this.findFormInFrame();
            await delay(2000);
            const landlordName = this.getContactLandlordName();
            const userMessage = this.createMessageLandlord(landlordName);
            this.fillMessageField(userMessage);
            await delay(2000);
            this.selectNumberOfPersons('TWO_PERSON');
            await delay(2000);
            this.hasPets('FALSE');
            await delay(2000);
            this.selectIncome('2000');
            await delay(2000);
            this.selectApplicationPackageCompleted('TRUE');
            await delay(2000);
            this.clickSendApplicationButton();
        } catch (error) {
            console.error("Error in apply:", error);
        }
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export { ImmoScoutApartmentApplication };
