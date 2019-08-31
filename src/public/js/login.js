$(document).ready(() => {
    $("#steam_login_button").attr("href", `https://steamcommunity.com/openid/login
        ?openid.ns=http://specs.openid.net/auth/2.0
        &openid.mode=checkid_setup
        &openid.return_to=${document.location.origin}/html/authenticate.html
        &openid.realm=${document.location.origin}
        &openid.identity=http://specs.openid.net/auth/2.0/identifier_select
        &openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select
    `.replace(/ /g, ""));
});