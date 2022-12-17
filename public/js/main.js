//Probably not going to be used


let myForm = document.getElementById("login-form");
let usernameElement = document.getElementById("usernameInputLogin");
let passwordElement = document.getElementById("passwordInputLogin");
let error = document.getElementById("error");

let myRegForm = document.getElementById("registration-form");
let usernameElementReg = document.getElementById("usernameInputRegister");
let passwordElementReg = document.getElementById("passwordInputRegister");
let firstNameReg = document.getElementById("firstnameInput");
let lastNameReg = document.getElementById("lastnameInput");
let collegeReg = document.getElementById("collegeInput");

let myCreateForm = document.getElementById("createevent-form");
let eventNameElement = document.getElementById("eventName");
let locationElement = document.getElementById("location");
let startElement = document.getElementById("startTime");
let endElement = document.getElementById("endTime");
let desElement = document.getElementById("description");
let capacityElement = document.getElementById("capacity");
let tagsElement = document.getElementById("tags");
let imageElement = document.getElementById("image");


if(myForm){
    myForm.addEventListener('submit', (event) => {
        event.preventDefault();
        error.hidden = true;
        //username and password check
        if (usernameElement.value === undefined || passwordElement.value === undefined) {
            myForm.reset();
            error.hidden = false;  
            error.innerHTML = "An input variable is not given";
            usernameElement.focus();
            console.log("error");
            return;
        }
        if (typeof(usernameElement.value) !== 'string' || typeof(passwordElement.value) !== 'string') {
            myForm.reset();
            error.hidden = false;  
            error.innerHTML = "All input variables must be a string";
            usernameElement.focus();
            console.log("error");
            return;
        }
        let str = usernameElement.value.trim();
        let str2 = passwordElement.value.trim();
        if (str.length === 0 || str2.length === 0) {
            myForm.reset();
            error.hidden = false;  
            error.innerHTML = "An input is an empty string";
            usernameElement.focus();
            console.log("error");
            return;
        }
        //username check
        for(x of usernameElement.value){
            let i = x.charCodeAt(0);
            if (
                !(
                    (i >= 48 && i <= 57) || //Numbers
                    (i >= 65 && i <= 90) || //Upper Case
                    (i >= 97 && i <= 122) || //Lower Case
                    false
                )
            ) {
                myForm.reset();
                error.hidden = false;  
                error.innerHTML = "Invalid username, cannot have special characters";
                usernameElement.focus();
                console.log("error");
                return;
            }
        }
        if(usernameElement.value.length < 4){
            myForm.reset();
            error.hidden = false;  
            error.innerHTML = "Username too short";
            usernameElement.focus();
            console.log("error");
            return;
        }
        //password checks
        if(passwordElement.value.length < 6){
            myForm.reset();
            error.hidden = false;  
            error.innerHTML = "Password too short";
            usernameElement.focus();
            console.log("error");
            return;
        }

        let upper_chr_present = false;
        for (let x of passwordElement.value) {
            let i = x.charCodeAt(0);
            if (
                (i >= 65 && i <= 90) || //Upper Case
                false
            ) {
                upper_chr_present = true;
                break;
            }
        }   
        if (!upper_chr_present) {
            myForm.reset();
            error.hidden = false;  
            error.innerHTML = "Password must contain an uppercase letter";
            usernameElement.focus();
            console.log("error");
            return;
        }   
        //number
        let num_chr_present = false; 
        for (let x of passwordElement.value) {
            let i = x.charCodeAt(0);
            if (
                (i >= 48 && i <= 57) || //Numbers
                false
            ) {
                num_chr_present = true;
                break;
            }
        }
        if (!num_chr_present) {
            myForm.reset();
            error.hidden = false;  
            error.innerHTML = "Password must contain an uppercase letter";
            usernameElement.focus();
            console.log("error");
            return;
        }
        //space
        if (passwordElement.value.indexOf(' ') >= 0) {
            myForm.reset();
            error.hidden = false;  
            error.innerHTML = "Password cannot contain empty spaces";
            usernameElement.focus();
            console.log("error");
            return;
        }
        //special charcter
        let special_chr_present = false;
        for (let x of passwordElement.value) {
            let i = x.charCodeAt(0);
            if (
                !(
                    (i >= 48 && i <= 57) || //Numbers
                    (i >= 65 && i <= 90) || //Upper Case
                    (i >= 97 && i <= 122) || //Lower Case
                    false
                )
            ) {
                special_chr_present = true;
            }
        }
        if (!special_chr_present) {
            myForm.reset();
            error.hidden = false;  
            error.innerHTML = "Password must conatin a special character";
            usernameElement.focus();
            console
            .log("error");
            return;
        }
    });
}

if(myRegForm){
    myRegForm.addEventListener('submit', (event) => {
        event.preventDefault();
        error.hidden = true;
        //username, password, first, and last name checks
        if (usernameElementReg.value === undefined || passwordElementReg.value === undefined || firstNameReg.value === undefined || lastNameReg === undefined) {
            myRegForm.reset();
            error.hidden = false;  
            error.innerHTML = "An input variable is not given";
            usernameElementReg.focus();
            console.log("error");
            return;
        }
        if (typeof(usernameElementReg.value) !== 'string' || typeof(passwordElementReg.value) !== 'string' || typeof(firstNameReg.value) !== 'string' || typeof(lastNameReg.value) !== 'string') {
            myRegForm.reset();
            error.hidden = false;  
            error.innerHTML = "All input variables must be a string";
            usernameElementReg.focus();
            console.log("error");
            return;
        }
        let str = usernameElementReg.value.trim();
        let str2 = passwordElementReg.value.trim();
        let str3 = firstNameReg.value.trim();
        let str4 = lastNameReg.value.trim();
        if (str.length === 0 || str2.length === 0 || str3.length === 0 || str4.length === 0) {
            myRegForm.reset();
            error.hidden = false;  
            error.innerHTML = "An input is an empty string";
            usernameElementReg.focus();
            console.log("error");
            return;
        }
        //username checks
        for(x of usernameElementReg.value){
            let i = x.charCodeAt(0);
            if (
                !(
                    (i >= 48 && i <= 57) || //Numbers
                    (i >= 65 && i <= 90) || //Upper Case
                    (i >= 97 && i <= 122) || //Lower Case
                    false
                )
            ) {
                myRegForm.reset();
                error.hidden = false;  
                error.innerHTML = "Invalid username, cannot have special characters";
                usernameElementReg.focus();
                console.log("error");
                return;
            }
        }
        if(usernameElementReg.value.length < 4){
            myRegForm.reset();
            error.hidden = false;  
            error.innerHTML = "Username too short";
            usernameElementReg.focus();
            console.log("error");
            return;
        }
        //password checks
        if(passwordElementReg.value.length < 6){
            myRegForm.reset();
            error.hidden = false;  
            error.innerHTML = "Password too short";
            usernameElementReg.focus();
            console.log("error");
            return;
        }

        let upper_chr_present = false;
        for (let x of passwordElementReg.value) {
            let i = x.charCodeAt(0);
            if (
                (i >= 65 && i <= 90) || //Upper Case
                false
            ) {
                upper_chr_present = true;
                break;
            }
        }   
        if (!upper_chr_present) {
            myRegForm.reset();
            error.hidden = false;  
            error.innerHTML = "Password must contain an uppercase letter";
            usernameElementReg.focus();
            console.log("error");
            return;
        }   
        //number
        let num_chr_present = false; 
        for (let x of passwordElementReg.value) {
            let i = x.charCodeAt(0);
            if (
                (i >= 48 && i <= 57) || //Numbers
                false
            ) {
                num_chr_present = true;
                break;
            }
        }
        if (!num_chr_present) {
            myRegForm.reset();
            error.hidden = false;  
            error.innerHTML = "Password must contain an uppercase letter";
            usernameElementReg.focus();
            console.log("error");
            return;
        }
        //space
        if (passwordElementReg.value.indexOf(' ') >= 0) {
            myRegForm.reset();
            error.hidden = false;  
            error.innerHTML = "Password cannot contain empty spaces";
            usernameElementReg.focus();
            console.log("error");
            return;
        }
        //special charcter
        let special_chr_present = false;
        for (let x of passwordElementReg.value) {
            let i = x.charCodeAt(0);
            if (
                !(
                    (i >= 48 && i <= 57) || //Numbers
                    (i >= 65 && i <= 90) || //Upper Case
                    (i >= 97 && i <= 122) || //Lower Case
                    false
                )
            ) {
                special_chr_present = true;
            }
        }
        if (!special_chr_present) {
            myRegForm.reset();
            error.hidden = false;  
            error.innerHTML = "Password must conatin a special character";
            usernameElementReg.focus();
            console.log("error");
            return;
        }

        for (let x of firstNameReg.value.trim()) {
            let i = x.charCodeAt(0);
            if (
                !(
                    (i >= 65 && i <= 90) || //Upper Case
                    (i >= 97 && i <= 122) || //Lower Case
                    i == 32 || //Space
                    false
                )
            ) {
                myRegForm.reset();
                error.hidden = false;  
                error.innerHTML = "First name is invalid";
                usernameElementReg.focus();
                console.log("error");
                return;
            }
        }

        for (let x of lastNameReg.value.trim()) {
            let i = x.charCodeAt(0);
            if (
                !(
                    (i >= 65 && i <= 90) || //Upper Case
                    (i >= 97 && i <= 122) || //Lower Case
                    i == 32 || //Space
                    false
                )
            ) {
                myRegForm.reset();
                error.hidden = false;  
                error.innerHTML = "Last name is invalid";
                usernameElementReg.focus();
                console.log("error");
                return;
            }
        }


    });
}

if(myCreateForm){
    myRegForm.addEventListener('submit', (event) => {
        event.preventDefault();
        error.hidden = true;
        //name, loc, description, tags checks
        if (eventNameElement.value === undefined || location.value === undefined || desElement.value === undefined || tagsElement.value === undefined) {
            myCreateForm.reset();
            error.hidden = false;  
            error.innerHTML = "An input variable is not given";
            eventNameElement.focus();
            console.log("error");
            return;
        }
        if (typeof(eventNameElement.value) !== 'string' || typeof(locationElement.value) !== 'string' || typeof(desElement.value) !== 'string' || typeof(tagsElement.value) !== 'string') {
            myCreateForm.reset();
            error.hidden = false;  
            error.innerHTML = "All input variables must be a string";
            eventNameElement.focus();
            console.log("error");
            return;
        }
        let str = eventNameElement.value.trim();
        let str2 = locationElement.value.trim();
        let str3 = desElement.value.trim();
        let str4 = tagsElement.trim();
        if (str.length === 0 || str2.length === 0 || str3.length === 0 || str4.length === 0) {
            myCreateForm.reset();
            error.hidden = false;  
            error.innerHTML = "An input is an empty string";
            eventNameElement.focus();
            console.log("error");
            return;
        }
        //cap check
        if (isNaN(capacityElement.value)) {
            myCreateForm.reset();
            error.hidden = false;  
            error.innerHTML = "Capacity must be a number";
            eventNameElement.focus();
            console.log("error");
            return;
        }
        capacity = parseFloat(capacityElement.value);

        if (capacity < 1 || capacity % 1 > 0) {
            myCreateForm.reset();
            error.hidden = false;  
            error.innerHTML = "Invalid capacity";
            eventNameElement.focus();
            console.log("error");
            return;
        }
        //date check
        if (Date.parse(startElement.value) >= Date.parse(endElement.value)) {
            myCreateForm.reset();
            error.hidden = false;  
            error.innerHTML = "Start time must be before end time";
            eventNameElement.focus();
            console.log("error");
            return;
        }
        //image check
        if (imageElement.value.size > 1024 * 1024 * 5) {
            myCreateForm.reset();
            error.hidden = false;  
            error.innerHTML = "Image size must be smaller than 5";
            eventNameElement.focus();
            console.log("error");
            return;
        }
    
        if (!imageElement.value.mimetype.includes("image")) {
            myCreateForm.reset();
            error.hidden = false;  
            error.innerHTML = "File must be an image";
            eventNameElement.focus();
            console.log("error");
            return;
        }
    });
}