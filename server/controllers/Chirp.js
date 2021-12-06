const models = require('../models');

const { Chirp } = models;

// Function used to load all of the chirps in the Mongo database
const makerPage = (req, res) => {
    Chirp.ChirpModel.findAllChirps((err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred. Chirps cannot be found.' });
        }

        return res.render('app', { csrfToken: req.csrfToken(), chirps: docs });
    });
};

// Function used to enter data into a chirp object
// Actual chirp message, author (username), date
// Sends newly made chirp into Mongo database
// Then redirects page to show updated list of chirps
const makeChirp = (req, res) => {
    if (!req.body.chirp) {
        return res.status(400).json({ error: 'A message needs to be typed before it can be chirped.' });
    }

    // Records exact date and time that chirp was made
    // Adds that as string into chirpData, to be printed underneath actual message
    const createdDate = new Date(Date.now());
    const dateToString = createdDate.toLocaleString('en-US', { timeZone: 'America/New_York' });

    const chirpData = {
        chirp: req.body.chirp,
        author: req.session.account.username,
        date: dateToString,
        owner: req.session.account._id,
    };

    const newChirp = new Chirp.ChirpModel(chirpData);

    const chirpPromise = newChirp.save();

    chirpPromise.then(() => res.json({ redirect: '/maker' }));

    chirpPromise.catch((err) => {
        console.log(err);

        return res.status(400).json({ error: 'An error occurred. Chirp has not been sent.' });
    });

    return chirpPromise;
};

// Function used to load up all of the chirps currently in the Mongo database
const getChirps = (request, response) => {
    const req = request;
    const res = response;

    return Chirp.ChirpModel.findAllChirps((err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred. Chirps cannot be found.' });
        }

        return res.json({ chirps: docs });
    });
};

// POST
// Function called to bring up chirps that user searched for
// by keyword
const search = (req, res) => {
    if (!req.body.search) {
        return res.status(400).json({ error: 'One or more keywords need to be typed before you can search.' });
    }

    // Keyword typed in search textbox
    const searchedTerm = req.body.search;

    return Chirp.ChirpModel.findBySearch(searchedTerm, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred. Chirps cannot be found.' });
        }

        return res.json({ chirps: docs });
    });
};

// Not currently used!!!
// getYours function
// Function called to bring up chirps that were only posted by the user
const getYours = (request, response) => {
    const req = request;
    const res = response;

    return Chirp.ChirpModel.findByOwner(req.session.account._id, (err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred' });
        }

        return res.json({ chirps: docs });
    });
};

module.exports.makerPage = makerPage;
module.exports.getChirps = getChirps;
module.exports.make = makeChirp;
module.exports.search = search;
module.exports.getYours = getYours;