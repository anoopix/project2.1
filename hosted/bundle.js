"use strict";

// Function used to create makerForm
// User types in a chirp, and clicks Send button to submit to chirper feed
var MakerForm = function MakerForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "makerForm",
    name: "chirpForm",
    onSubmit: handleChirp,
    action: "/maker",
    method: "POST",
    className: "makerForm"
  }, /*#__PURE__*/React.createElement("textarea", {
    id: "maker",
    type: "text",
    name: "chirp",
    rows: "5",
    cols: "80",
    placeholder: "Make a chirp"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
    id: "sendBtn",
    type: "submit",
    value: "Send"
  }));
}; // Function called when user clicks Send button
// Sends out chirp to feed
// Loads new chirps into server


var handleChirp = function handleChirp(e) {
  e.preventDefault();

  if ($("#maker").val() == '') {
    handleError("A message needs to be typed before it can be chirped.");
    return false;
  }

  sendAjax('POST', $("#makerForm").attr("action"), $("#makerForm").serialize(), function () {
    loadChirpsFromServer('/getChirps');
  });
  return false;
}; // Function used to create search form
// User types in a keyword and clicks Search button


var SearchForm = function SearchForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "searchForm",
    name: "searchForm",
    onSubmit: handleSearch,
    action: "/search",
    method: "POST",
    className: "searchForm"
  }, /*#__PURE__*/React.createElement("input", {
    id: "search",
    type: "text",
    name: "search",
    placeholder: "Search keywords"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    id: "searchBtn",
    type: "submit",
    value: "Search"
  }));
}; // Function called when user click Search button
// React renders list of chirps based on searched-for keyword


var handleSearch = function handleSearch(e) {
  e.preventDefault();

  if ($("#search").val() == '') {
    handleError("One or more keywords need to be typed in order to search.");
    return false;
  }

  sendAjax('POST', $("#searchForm").attr("action"), $("#searchForm").serialize(), function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ChirpList, {
      chirps: data.chirps
    }), document.querySelector(".chirperFeed"));
  });
  return false;
}; // Function called in order to print out list of chirps


var ChirpList = function ChirpList(props) {
  if (props.chirps.length === 0) {
    return /*#__PURE__*/React.createElement("h3", {
      className: "noChirps"
    }, "No Chirps have been posted yet!");
  }

  var chirpNodes = props.chirps.map(function (chirp) {
    return /*#__PURE__*/React.createElement("div", {
      key: chirp._id,
      className: "chirp"
    }, /*#__PURE__*/React.createElement("div", {
      className: "chirpUserInfo"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/default_avatar.png",
      alt: "default avatar",
      id: "avatar"
    }), /*#__PURE__*/React.createElement("p", {
      id: "authorText"
    }, chirp.author)), /*#__PURE__*/React.createElement("div", {
      className: "chirpMain"
    }, /*#__PURE__*/React.createElement("div", {
      className: "chirpText"
    }, chirp.chirp), /*#__PURE__*/React.createElement("div", {
      className: "dateText"
    }, "Chirped at ", chirp.date)));
  });
  return /*#__PURE__*/React.createElement("div", null, chirpNodes);
}; // Function used to create Account settings button in top-left corner


var UserForm = function UserForm(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: openSettings,
    id: "settingsBtn"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/img/icon.png"
  }), "Account settings", /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  })));
}; // Function used to create settings menu


var SettingsForm = function SettingsForm(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
    className: "closebtn",
    onClick: closeSettings
  }, "\xD7"), /*#__PURE__*/React.createElement("a", {
    id: "changePassword"
  }, "Change Password"));
}; // Both of these two functions control "opening" and "closing"
// of settings menu


var openSettings = function openSettings(e) {
  document.querySelector("#settings").style.left = "0";
};

var closeSettings = function closeSettings(e) {
  document.querySelector("#settings").style.left = "-258px";
}; // Function used to create Change password screen
// Replaces anything currently in the main screen div


var ChangeWindow = function ChangeWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "changeForm",
    name: "changeForm",
    onSubmit: handleChange,
    action: "/changePass",
    method: "POST",
    className: "changeForm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "labelInputGroup"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "old"
  }, "Old password: "), /*#__PURE__*/React.createElement("input", {
    id: "old",
    type: "password",
    name: "old",
    placeholder: "old password"
  })), /*#__PURE__*/React.createElement("div", {
    className: "labelInputGroup"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "New password: "), /*#__PURE__*/React.createElement("input", {
    id: "new",
    type: "password",
    name: "new",
    placeholder: "password"
  })), /*#__PURE__*/React.createElement("div", {
    className: "labelInputGroup"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "Retype password: "), /*#__PURE__*/React.createElement("input", {
    id: "new2",
    type: "password",
    name: "new2",
    placeholder: "retype password"
  })), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "passSubmit",
    type: "submit",
    value: "Change Password"
  }));
}; // Function used to React render the Change password screen


var createChangeWindow = function createChangeWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ChangeWindow, {
    csrf: csrf
  }), document.querySelector(".main"));
}; // Function called when Change password is clicked


var handleChange = function handleChange(e) {
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
}; // Function used to React render chirps list


var loadChirpsFromServer = function loadChirpsFromServer(action) {
  console.log(action);
  sendAjax('GET', action, null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ChirpList, {
      chirps: data.chirps
    }), document.querySelector(".chirperFeed"));
  });
}; // Setup function React renders:
// The makerForm - sending out chirps
// The searchForm - searching for chirps by keyword
// The list of chirps - contain username of poster, time, and date
// The Account settings button - used to open settings menu
// The settings menu - currently used to open Change password screen


var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(MakerForm, {
    csrf: csrf
  }), document.querySelector(".makerDiv"));
  ReactDOM.render( /*#__PURE__*/React.createElement(SearchForm, {
    csrf: csrf
  }), document.querySelector(".searchDiv"));
  ReactDOM.render( /*#__PURE__*/React.createElement(ChirpList, {
    chirps: []
  }), document.querySelector(".chirperFeed"));
  ReactDOM.render( /*#__PURE__*/React.createElement(UserForm, {
    csrf: csrf
  }), document.querySelector(".userContainer"));
  ReactDOM.render( /*#__PURE__*/React.createElement(SettingsForm, {
    csrf: csrf
  }), document.querySelector("#settings"));
  var changePassword = document.querySelector("#changePassword"); // When Change password button in Settings menu is clicked,
  // the Change password screen is opened

  changePassword.addEventListener("click", function (e) {
    e.preventDefault();
    createChangeWindow(csrf);
    return false;
  }); // When maker page is setup, immediately get chirps

  loadChirpsFromServer('/getChirps');
}; // getToken function


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
}; // Called immediately when page is loaded


$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
