const handleError = (message) => {
    $("#errorMessage").text(message);
}

const sendAjax = (action, data) => {
    $.ajax({
        cache: false,
        type: "POST",
        url: action,
        data: data,
        dataType: "json",
        success: (result, status, xhr) => {
            window.location = result.redirect;
        },
        error: (xhr, status, error) => {
            console.log(xhr.responseText);
            const messageObj = JSON.parse(xhr.responseText);

            handleError(messageObj.error);
        }
    });
}

$(document).ready(() => {
    $("#signupForm").on("submit", (e) => {
        e.preventDefault();

        if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
            handleError("All the fields need to be filled!");
            return false;
        }

        if ($("#pass").val() !== $("#pass2").val()) {
            handleError("The passwords need to match!");
            return false;
        }

        sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());

        return false;
    });

    $("#loginForm").on("submit", (e) => {
        e.preventDefault();

        if ($("#user").val() == '' || $("#pass").val() == '') {
            handleError("A username and password must be entered!");
            return false;
        }

        sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

        return false;
    });

    $("#makerForm").on("submit", (e) => {
        e.preventDefault();

        if ($("#maker").val() == '') {
            handleError("A message needs to be typed before it can be chirped");
            return false;
        }

        sendAjax($("#makerForm").attr("action"), $("#makerForm").serialize());

        return false;
    });
});