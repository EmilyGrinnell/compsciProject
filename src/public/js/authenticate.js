$(document).ready(() => {
    $.ajax(`${document.location.origin}/authenticate${document.location.search}`, {
        xhrFields : {
            withCredentials : true,
            //Avoid CORS blocking error
        },
        success : () => document.location.href = (new URLSearchParams(document.location.search)).get("redirect_url") || document.location.origin,
            //Redirect back to requested redirect URL or index page upon successful login
        error : e => {
            [...$(".error")].map(element => $(element))[["request_error", "database_error", "no_linked_steam", "invalid_login"].indexOf(e.responseText)].show();
            //Display an appropriate error if the login fails
        },
    });
});