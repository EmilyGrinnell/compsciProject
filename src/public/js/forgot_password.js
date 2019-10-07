$(document).ready(() => {
    $("#submit").click(event => {
        $(".response").hide();
        event.preventDefault();
        //Hide all previous error and success messages and prevent the form being submitted

        if (!/^\w+@\w+\.\w+$/.test($("#email").val())) return $("#email_validate").show();
        //Check the given email address is valid

        $.ajax(`${document.location.origin}/reset_password?email=${$("#email").val()}`, {
            xhrFields : {
                withCredentials : true,
                //Avoid CORS blocking errors
            },
            success : () => $("#success").show(),
                //Show a success message if the reset email was sent successfully
            error : e => {
                $($(".validate")[[
                    "invalid_email",
                    "email_not_used",
                    "email_error",
                ].indexOf(e.responseText)]).show();
                //Show an appropriate error message if the reset email could not be sent
            },
        });
    });
});