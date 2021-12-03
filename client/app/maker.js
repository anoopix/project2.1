const handleChirp = (e) => {
    e.preventDefault();

    if ($("#maker").val() == '') {
        handleError("A message needs to be typed before it can be chirped");
        return false;
    }

    sendAjax('POST', $("#makerForm").attr("action"), $("#makerForm").serialize(), function() {
        loadChirpsFromServer();
    });

    return false;
};

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

const handleSearch = (e) => {
    e.preventDefault();

    return false;
};

const SearchForm = (props) => {
    return(
    <form id="searchForm" name="searchForm" onSubmit={handleSearch} action="/maker" method="GET" className="searchForm">
        <input id="search" type="text" name="search" placeholder="Search keywords" />
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input id="searchBtn" type="submit" value="Search" />
    </form>
    );
};

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
              <h3 className="chirpText">{chirp.chirp}</h3>
              <h3 className="dateText">Chirped at {chirp.date}</h3>
            </div>
            <div className="chirpInteract">
              <button id="likeBtn">Like</button>
              <button id="rechirpBtn">Rechirp</button>
              <button id="replyBtn">Reply</button>
              <button id="commentsBtn">Comments</button>
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

const loadChirpsFromServer = () => {
    sendAjax('GET', '/getChirps', null, (data) => {
        ReactDOM.render(
            <ChirpList chirps={data.chirps} />,
            document.querySelector(".chirperFeed")
        );
    });
};

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

    loadChirpsFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});