$(document).ready(() => {
    let validation = [...$(".validate")].map(element => $(element));
    //Get all error message elements

    $("#submit").bind("click", event => {
        let vals = [...$(".field")].map(element => $(element).val());
        validation.map(element => element.hide());
        event.preventDefault();
        //Hide error messages from previous registration attempts and prevent the form from being submitted

        for (let x = 0; x < 1; x ++) {
            if (vals[x].length <= 6 || vals[x].length >= 20) return validation[x].show();
            else validation[x].hide();
            //Check username and password are between 6 and 20 characters
        }

        if (vals[1] != vals[2]) return validation[3].show();
        else validation[3].hide();
        //Check password and confirm password fields match

        $.ajax(`${document.location.origin}/register`, {
            method : "POST",
            data : {
                username : vals[0],
                password : vals[1],
                //Send username and password in request body to be registered
            },
            xhrFields : {
                withCredentials : true,
                //Avoid CORS blocking errors in Chrome and Opera (and other browsers?)
            },
            success : () => document.location.href = document.location.origin,
            error : e => {
                validation[{
                    invalid_username : 0,
                    username_taken : 1,
                    invalid_password : 2,
                    database_error : 4,
                }[e.responseText]].show();
                //Show an appropriate error message for any errors encountered while registering the user
            },
        });
        //Send POST request to register endpoint of express app to register the user
    });
});