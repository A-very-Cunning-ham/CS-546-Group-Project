(function ($) {
  var myNewTaskForm = $('#makecomment-form');
  var newNameInput = $('#comment');
  var todoArea = $('#allComments');

  myNewTaskForm.submit(function (event) {
    event.preventDefault();

    var newName = newNameInput.val();

    if (newName) {
        var requestConfig = {
          method: 'POST',
          url: myNewTaskForm[0].action,
          contentType: 'application/json',
          data: JSON.stringify({
            comment: newName
          })
        };

        $.ajax(requestConfig).then(function (responseMessage) {
          console.log(responseMessage);
          myNewTaskForm[0].reset();
          var newElement = $(responseMessage);
          todoArea.append(newElement);
        });
      
    }
  });
})(jQuery);


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
let error2 = document.getElementById("error2");


if(myForm){
    myForm.addEventListener('submit', (event) => {
        error.hidden = true;
        //username and password check
        if(usernameElement.value.trim() && passwordElement.value.trim()){
            if (typeof(usernameElement.value) !== 'string' || typeof(passwordElement.value) !== 'string') {
                event.preventDefault();
                myForm.reset();
                error.hidden = false;  
                error.innerHTML = "All input variables must be a string";
                usernameElement.focus();
                console.log("error");
                return;
            }
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
                    event.preventDefault();
                    myForm.reset();
                    error.hidden = false;  
                    error.innerHTML = "Invalid username, cannot have special characters";
                    usernameElement.focus();
                    console.log("error");
                    return;
                }
            }
            if(usernameElement.value.length < 4){
                event.preventDefault();
                myForm.reset();
                error.hidden = false;  
                error.innerHTML = "Username too short";
                usernameElement.focus();
                console.log("error");
                return;
            }
            //password checks
            if(passwordElement.value.length < 6){
                event.preventDefault();
                myForm.reset();
                error.hidden = false;  
                error.innerHTML = "Password too short";
                usernameElement.focus();
                console.log("error");
                return;
            }else{
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
                    event.preventDefault();
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
                    event.preventDefault();
                    myForm.reset();
                    error.hidden = false;  
                    error.innerHTML = "Password must contain a number";
                    usernameElement.focus();
                    console.log("error");
                    return;
                }
                //space
                if (passwordElement.value.indexOf(' ') >= 0) {
                    event.preventDefault();
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
                    event.preventDefault();
                    myForm.reset();
                    error.hidden = false;  
                    error.innerHTML = "Password must conatin a special character";
                    usernameElement.focus();
                    console.log("error");
                    return;
                }
            }
        }
        else{
            event.preventDefault();
            myForm.reset();
            error.hidden = false;  
            error.innerHTML = "Cannot leave a blank";
            usernameElement.focus();
            console.log("error");
            return;
        }
    });
}

if(myRegForm){
    myRegForm.addEventListener('submit', (event) => {
        error.hidden = true;
        if(usernameElementReg.value.trim() && passwordElementReg.value.trim() && firstNameReg.value.trim() && lastNameReg.value.trim()){
            if (typeof(usernameElementReg.value) !== 'string' || typeof(passwordElementReg.value) !== 'string' || typeof(firstNameReg.value) !== 'string' || typeof(lastNameReg.value) !== 'string') {
                event.preventDefault();
                usernameElementReg.value = '';
                myRegForm.reset();
                error.hidden = false;  
                error.innerHTML = "All input variables must be a string";
                usernameElementReg.focus();
                console.log("error");
                return;
            }
            if(usernameElementReg.value.length < 4){
                event.preventDefault();
                usernameElementReg.value = '';
                myRegForm.reset();
                error.hidden = false;  
                error.innerHTML = "Username too short";
                usernameElementReg.focus();
                console.log("error");
                return;
            }else{
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
                        event.preventDefault();
                        myRegForm.reset();
                        error.hidden = false;  
                        error.innerHTML = "Invalid username, cannot have special characters";
                        usernameElementReg.focus();
                        console.log("error");
                        return;
                    }
                }
            }
        //password checks
            if(passwordElementReg.value.length < 6){
                event.preventDefault();
                passwordElementReg.value = '';
                myRegForm.reset();
                error.hidden = false;  
                error.innerHTML = "Password too short";
                usernameElementReg.focus();
                console.log("error");
                return;
            }else{
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
                    event.preventDefault();
                    passwordElementReg.value = '';
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
                    event.preventDefault();
                    passwordElementReg.value = '';
                    myRegForm.reset();
                    error.hidden = false;  
                    error.innerHTML = "Password must contain an uppercase letter";
                    usernameElementReg.focus();
                    console.log("error");
                    return;
                } 
                //space
                if (passwordElementReg.value.indexOf(' ') >= 0) {
                    event.preventDefault();
                    passwordElementReg.value = '';
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
                    event.preventDefault();
                    passwordElementReg.value = '';
                    myRegForm.reset();
                    error.hidden = false;  
                    error.innerHTML = "Password must conatin a special character";
                    usernameElementReg.focus();
                    console.log("error");
                    return;
                }
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
                    event.preventDefault();
                    firstNameReg.value = '';
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
                    event.preventDefault();
                    lastNameReg.value = '';
                    myRegForm.reset();
                    error.hidden = false;  
                    error.innerHTML = "Last name is invalid";
                    usernameElementReg.focus();
                    console.log("error");
                    return;
                }
            }
        }
        else{
            event.preventDefault();
            usernameElementReg.value = '';
            passwordElementReg.value = '';
            firstNameReg.value = '';
            lastNameReg.value = '';
            myRegForm.reset();
            error.hidden = false;  
            error.innerHTML = "Cannot leave blank inputs";
            usernameElementReg.focus();
            console.log("error");
            return;
        }


    });
}

if(myCreateForm){
    myCreateForm.addEventListener('submit', (event) => {
        error2.hidden = true;
        // error.hidden = false;
        // error.innerHTML = "Errors checking";
        // console.log("error");
        //name, loc, description, tags checks
        if (eventNameElement.value.trim() && locationElement.value.trim() && desElement.value.trim() && tagsElement.value.trim()) {
            if (typeof(eventNameElement.value) !== 'string' || typeof(locationElement.value) !== 'string' || typeof(desElement.value) !== 'string' || typeof(tagsElement.value) !== 'string') {
                event.preventDefault();
                myCreateForm.reset();
                error2.hidden = false;  
                error2.innerHTML = "All input variables must be a string";
                eventNameElement.focus();
                console.log("error2");
                return;
            }
            //cap check
            if (isNaN(capacityElement.value)) {
                event.preventDefault();
                myCreateForm.reset();
                error2.hidden = false;  
                error2.innerHTML = "Capacity must be a number";
                eventNameElement.focus();
                console.log("error2");
                return;
            }
            capacity = parseFloat(capacityElement.value);

            if (capacity < 1 || capacity % 1 > 0) {
                event.preventDefault();
                myCreateForm.reset();
                error2.hidden = false;  
                error2.innerHTML = "Invalid capacity";
                eventNameElement.focus();
                console.log("error2");
                return;
            }
            //date check
            if (Date.parse(startElement.value) >= Date.parse(endElement.value)) {
                event.preventDefault();
                myCreateForm.reset();
                error2.hidden = false;  
                error2.innerHTML = "Start time must be before end time";
                eventNameElement.focus();
                console.log("error2");
                return;
            }
            //image check
            if (imageElement.value.size > 1024 * 1024 * 5) {
                event.preventDefault();
                myCreateForm.reset();
                error2.hidden = false;  
                error2.innerHTML = "Image size must be smaller than 5";
                eventNameElement.focus();
                console.log("error2");
                return;
            }
        
            if (!imageElement.mimetype.includes("image")) {
                event.preventDefault();
                myCreateForm.reset();
                error2.hidden = false;  
                error2.innerHTML = "File must be an image";
                eventNameElement.focus();
                console.log("error2");
                return;
            }
        }
        else{
            event.preventDefault();
            eventNameElement.value = '';
            locationElement.value = '';
            desElement.value = '';
            tagsElement.value = '';
            myCreateForm.reset();
            error2.hidden = false;  
            error2.innerHTML = "Cannot leave blank inputs";
            eventNameElement.focus();
            console.log("error");
            return;
        }
    });
}