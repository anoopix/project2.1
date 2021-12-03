"use strict";

var handleChirp = function handleChirp(e) {
  e.preventDefault();

  if ($("#maker").val() == '') {
    handleError("A message needs to be typed before it can be chirped");
    return false;
  }

  sendAjax('POST', $("#makerForm").attr("action"), $("#makerForm").serialize(), function () {
    loadChirpsFromServer();
  });
  return false;
};

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
};

var handleSearch = function handleSearch(e) {
  e.preventDefault();
  return false;
};

var SearchForm = function SearchForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "searchForm",
    name: "searchForm",
    onSubmit: handleSearch,
    action: "/maker",
    method: "GET",
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
};

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
    }, /*#__PURE__*/React.createElement("h3", {
      className: "chirpText"
    }, chirp.chirp), /*#__PURE__*/React.createElement("h3", {
      className: "dateText"
    }, "Chirped at ", chirp.date)), /*#__PURE__*/React.createElement("div", {
      className: "chirpInteract"
    }, /*#__PURE__*/React.createElement("button", {
      id: "likeBtn"
    }, "Like"), /*#__PURE__*/React.createElement("button", {
      id: "rechirpBtn"
    }, "Rechirp"), /*#__PURE__*/React.createElement("button", {
      id: "replyBtn"
    }, "Reply"), /*#__PURE__*/React.createElement("button", {
      id: "commentsBtn"
    }, "Comments")));
  });
  return /*#__PURE__*/React.createElement("div", null, chirpNodes);
};

var loadChirpsFromServer = function loadChirpsFromServer() {
  sendAjax('GET', '/getChirps', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ChirpList, {
      chirps: data.chirps
    }), document.querySelector(".chirperFeed"));
  });
};

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
  loadChirpsFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

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
