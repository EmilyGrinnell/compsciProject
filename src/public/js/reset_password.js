$(document).ready(() => {
    $("#submit").click(event => {
        $(".validate").hide();
        event.preventDefault();
        //Hide all error messages from previous attempts and prevent the form being submitted

        let vals = [...$(".field")].map(x => $(x).val());
        //Get all field values

        if (vals[0].length < 6 || vals[0].length > 20) return $("#new_password_validate").show();
        else if (vals[0] != vals[1]) return $("#new_password_confirm_validate").show();
        //Ensure new password is between 6 and 20 characters

        $.ajax(`${document.location.origin}/set_new_password`, {
            method : "POST",
            data : {
                token : (new URLSearchParams(document.location.search)).get("token"),
                password : vals[0],
                //Send password in request body to be updated in the database
            },
            xhrFields : {
                withCredentials : true,
                //Avoid CORS blocking errors
            },
            success : () => document.location.href = document.location.origin,
                //Redirect the user to index page on success
            error : e => {
                $($(".validate")[[
                    "invalid_password",
                    "invalid_token",
                    "invalid_email",
                    "database_error",
                ].indexOf(e.responseText)]).show();
                //Show an appropriate error message if the password reset fails
            },
        })
    });
});