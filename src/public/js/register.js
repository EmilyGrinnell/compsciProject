$(document).ready(() => {
    let validation = [...$(".validate")].map(element => $(element));
    //Get all error message elements

    $("#submit").bind("click", event => {
        let vals = [...$(".field")].map(element => $(element).val());
        validation.map(element => element.hide());
        event.preventDefault();
        //Hide error messages from previous registration attempts and prevent the form from being submitted

        for (let x = 0; x < 2; x += 2) {
            if (vals[x].length <= 6 || vals[x].length >= 20) return validation[x || 4].show();
            else validation[x || 4].hide();
            //Check username and password are between 6 and 20 characters
        }

        if (vals[2] != vals[3]) return validation[5].show();
        else validation[5].hide();
        //Check password and confirm password fields match

        if (!/^\w+@\w+\.\w+$/.test(vals[1])) return validation[2].show();
        //Check email field is a valid email address

        $.ajax(`${document.location.origin}/register`, {
            method : "POST",
            data : {
                username : vals[0],
                email : vals[1],
                password : vals[2],
                //Send username and password in request body to be registered
            },
            xhrFields : {
                withCredentials : true,
                //Avoid CORS blocking errors in Chrome and Opera (and other browsers?)
            },
            success : () => document.location.href = document.location.origin,
                //Redirect user to index page on success
            error : e => {
                validation[{
                    invalid_username : 0,
                    username_taken : 1,
                    invalid_email : 2,
                    email_taken : 3,
                    invalid_password : 4,
                    database_error : 6,
                }[e.responseText]].show();
                //Show an appropriate error message for any errors encountered while registering the user
            },
        });
        //Send POST request to register endpoint of express app to register the user
    });
});