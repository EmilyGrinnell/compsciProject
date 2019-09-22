$(document).ready(() => {
    $("#account_link").attr("href", `${document.location.origin}/html/account.html`);

    $.ajax(`${document.location.origin}/authenticate${document.location.search}`, {
        xhrFields : {
            withCredentials : true,
        },
        success : () => document.location.href = document.location.origin,
        error : e => {
            [...$(".error")].map(element => $(element))[["request_error", "database_error", "no_linked_steam", "invalid_login"].indexOf(e.responseText)].show();
        },
    });
});