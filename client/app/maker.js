// Function used to create makerForm
// User types in a chirp, and clicks Send button to submit to chirper feed
const MakerForm = (props) => {
    return(
    <form id="makerForm" name="chirpForm" onSubmit={handleChirp} action="/maker" method="POST" className="makerForm">
        <textarea id="maker" type="text" name="chirp" rows="5" cols="80" placeholder="Make a chirp"></textarea>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <br/>
        <input id="sendBtn" type="submit" value="Send" />
    </form>
    );
};

// Function called when user clicks Send button
// Sends out chirp to feed
// Loads new chirps into server
const handleChirp = (e) => {
    e.preventDefault();

    if ($("#maker").val() == '') {
        handleError("A message needs to be typed before it can be chirped.");
        return false;
    }

    sendAjax('POST', $("#makerForm").attr("action"), $("#makerForm").serialize(), function() {
        loadChirpsFromServer('/getChirps');
    });

    return false;
};

// Function used to create search form
// User types in a keyword and clicks Search button
const SearchForm = (props) => {
    return(
    <form id="searchForm" name="searchForm" onSubmit={handleSearch} action="/search" method="POST" className="searchForm">
        <input id="search" type="text" name="search" placeholder="Search keywords" />
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input id="searchBtn" type="submit" value="Search" />
    </form>
    );
};

// Function called when user click Search button
// React renders list of chirps based on searched-for keyword
const handleSearch = (e) => {

    e.preventDefault();

    if ($("#search").val() == '') {
        handleError("One or more keywords need to be typed in order to search.");
        return false;
    }

    sendAjax('POST', $("#searchForm").attr("action"), $("#searchForm").serialize(), function(data) {
        ReactDOM.render(
            <ChirpList chirps={data.chirps} />,
            document.querySelector(".chirperFeed")
        );
    });

    return false;
};

// Function called in order to print out list of chirps
const ChirpList = function(props) {
    if(props.chirps.length === 0){
        return(
            <h3 className="noChirps">No Chirps have been posted yet!</h3>
        );
    }

    const chirpNodes = props.chirps.map(function(chirp){
        return(
        <div key={chirp._id} className="chirp">
            <div className="chirpUserInfo">
              <img src="/assets/img/default_avatar.png" alt="default avatar" id="avatar" />
              <p id="authorText">{chirp.author}</p>
            </div>
            <div className="chirpMain">
                <div className="chirpText">
                    {chirp.chirp}
                </div>
                <div className="dateText">
                    Chirped at {chirp.date}
                </div>
            </div>
        </div>
        );
    });

    return(
    <div>
        {chirpNodes}
    </div>
    );
};

// Function used to create Account settings button in top-left corner
const UserForm = (props) => {
    return(
        <div>
            <button onClick={openSettings} id="settingsBtn">
                <img src="/assets/img/icon.png" />Account settings
                <input type="hidden" name="_csrf" value={props.csrf} />
            </button>
        </div>
    );
};

// Function used to create settings menu
const SettingsForm = (props) => {
    return(
        <div>
            <a className="closebtn" onClick={closeSettings}>&times;</a>
            <a id="changePassword">Change Password</a>
        </div>
    );
};

// Both of these two functions control "opening" and "closing"
// of settings menu
const openSettings = (e) => {
    document.querySelector("#settings").style.left = "0";
};
const closeSettings = (e) => {
    document.querySelector("#settings").style.left = "-258px";
};

// Function used to create Change password screen
// Replaces anything currently in the main screen div
const ChangeWindow = (props) => {
    return(
    <form id="changeForm" name="changeForm" onSubmit={handleChange} action="/changePass" method="POST" className="changeForm">
        <div className="labelInputGroup">
            <label htmlFor="old">Old password: </label>
            <input id="old" type="password" name="old" placeholder="old password" />
        </div>
        <div className="labelInputGroup">
            <label htmlFor="pass">New password: </label>
            <input id="new" type="password" name="new" placeholder="password" />
        </div>
        <div className="labelInputGroup">
            <label htmlFor="pass2">Retype password: </label>
            <input id="new2" type="password" name="new2" placeholder="retype password" />
        </div>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="passSubmit" type="submit" value="Change Password" />
    </form>
    );
};

// Function used to React render the Change password screen
const createChangeWindow = (csrf) => {
    ReactDOM.render(
        <ChangeWindow csrf={csrf} />,
        document.querySelector(".main")
    );
};

// Function called when Change password is clicked
const handleChange = (e) => {
    e.preventDefault();

    if ($("#old").val() == '' || $("#new").val() == '' || $("#new2").val() == '') {
        handleError("All the fields need to be filled!");
        return false;
    }

    if ($("#new").val() !== $("#new2").val()) {
        handleError("The passwords need to match!");
        return false;
    }

    sendAjax('POST', $("#changeForm").attr("action"), $("#changeForm").serialize(), redirect);

    return false;
};

// Function used to React render chirps list
const loadChirpsFromServer = (action) => {
    console.log(action);
    sendAjax('GET', action, null, (data) => {
        ReactDOM.render(
            <ChirpList chirps={data.chirps} />,
            document.querySelector(".chirperFeed")
        );
    });
};

// Setup function React renders:
// The makerForm - sending out chirps
// The searchForm - searching for chirps by keyword
// The list of chirps - contain username of poster, time, and date
// The Account settings button - used to open settings menu
// The settings menu - currently used to open Change password screen
const setup = function(csrf){
    ReactDOM.render(
        <MakerForm csrf={csrf} />, document.querySelector(".makerDiv")
    );

    ReactDOM.render(
        <SearchForm csrf={csrf} />, document.querySelector(".searchDiv")
    );

    ReactDOM.render(
        <ChirpList chirps={[]} />, document.querySelector(".chirperFeed")
    );

    ReactDOM.render(
        <UserForm csrf={csrf} />, document.querySelector(".userContainer")
    );

    ReactDOM.render(
        <SettingsForm csrf={csrf} />, document.querySelector("#settings")
    );

    const changePassword = document.querySelector("#changePassword");

    // When Change password button in Settings menu is clicked,
    // the Change password screen is opened
    changePassword.addEventListener("click", (e) => {
        e.preventDefault();
        createChangeWindow(csrf);
        return false;
    });

    // When maker page is setup, immediately get chirps
    loadChirpsFromServer('/getChirps');
};

// getToken function
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

// Called immediately when page is loaded
$(document).ready(function(){
    getToken();
});