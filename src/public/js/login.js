$(document).ready(() => {
    let validation = [...$(".validate")].map(element => $(element));
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
        //Prevent the form being submitted

        $.ajax(`${document.location.origin}/login`, {
            method : "POST",
            xhrFields : {
                withCredentials : true,
            },
            data : {
                username : $("#username").val(),
                password : $("#password").val(),
            },
            success : () => document.location.href = document.location.origin,
            error : e => document.write(e.responseText),
        });
    });
});