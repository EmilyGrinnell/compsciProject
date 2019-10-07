$(document).ready(() => {
    let validation = $(".validate");
    //Get all error validation elements

    $("#steam_login_button").attr("href", `https://steamcommunity.com/openid/login
        ?openid.ns=http://specs.openid.net/auth/2.0
        &openid.mode=checkid_setup
        &openid.return_to=${document.location.origin}/html/authenticate.html
        &openid.realm=${document.location.origin}
        &openid.identity=http://specs.openid.net/auth/2.0/identifier_select
        &openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select
    `.replace(/ /g, ""));
    //Generate and set link for Steam login button

    $("#submit").bind("click", event => {
        event.preventDefault();
        validation.hide();
        //Prevent the form being submitted and hide previous error messages

        $.ajax(`${document.location.origin}/login`, {
            method : "POST",
            xhrFields : {
                withCredentials : true,
                //Avoid CORS blocking errors
            },
            data : {
                username : $("#username").val(),
                password : $("#password").val(),
                //Send username and password in request body
            },
            success : () => document.location.href = document.location.origin,
                //Redirect user back to index page on successful login
            error : e => {
                $($(".validate")[[
                    "invalid_login",
                    "database_error",
                ].indexOf(e.responseText)]).show();
                //Show an appropriate error message if the login request fails
            },
        });
    });
});