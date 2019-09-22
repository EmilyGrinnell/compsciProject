$(document).ready(() => {
    $("#account_link").attr("href", `${document.location.origin}/html/account.html`);
    //Generate and set link to account page for linking Steam accounts

    $.ajax(`${document.location.origin}/authenticate${document.location.search}`, {
        xhrFields : {
            withCredentials : true,
            //Avoid CORS blocking error
        },
        success : () => document.location.href = document.location.origin,
        //Redirect back to index page after successful Steam login
        error : e => {
            [...$(".error")].map(element => $(element))[["request_error", "database_error", "no_linked_steam", "invalid_login"].indexOf(e.responseText)].show();
            //Display an appropriate error if the login fails
        },
    });
});