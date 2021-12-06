// Function used to create Login screen
// User enters their username and password
// then clicks Sign in button
const LoginWindow = (props) => {
    return(
    <form id="loginForm" name="loginForm" onSubmit={handleLogin} action="/login" method="POST" className="mainForm">
        <div className="labelInputGroup">
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
        </div>
        <div className="labelInputGroup">
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
        </div>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="formSubmit" type="submit" value="Sign in" />
    </form>
    );
};

// Function called when user clicks Sign in button
const handleLogin = (e) => {
    e.preventDefault();

    if ($("#user").val() == '' || $("#pass").val() == '') {
        handleError("A username and password must be entered!");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
};

// Function used to create Signup screen
// User enters their chosen username, password, and then retypes the password
// Clicks Signup button
const SignupWindow = (props) => {
    return(
    <form id="signupForm" name="signupForm" onSubmit={handleSignup} action="/signup" method="POST" className="mainForm">
        <div className="labelInputGroup">
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
        </div>
        <div className="labelInputGroup">
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
        </div>
        <div className="labelInputGroup">
            <label htmlFor="pass2">Retype Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
        </div>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="formSubmit" type="submit" value="Sign Up" />
    </form>
    );
};

// Function called when user clicks Signup button
const handleSignup = (e) => {
    e.preventDefault();

    if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All the fields need to be filled!");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("The passwords need to match!");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector(".main")
    );
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector(".main")
    );
};

const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    createLoginWindow(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});