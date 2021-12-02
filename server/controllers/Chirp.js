const models = require('../models');

const Chirp = models.Chirp;

const makerPage = (req, res) => {
    Chirp.ChirpModel.findAllChirps((err, docs) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'An error occurred. Chirps cannot be found.' });
        }

        return res.render('app', { csrfToken: req.csrfToken(), chirps: docs });
    });
};

const makeChirp = (req, res) => {
    if (!req.body.chirp) {
        return res.status(400).json({ error: 'A message needs to be typed before it can be chirped' });
    }

    const createdDate = new Date(Date.now());

    const dateToString = createdDate.toLocaleString('en-US', { timeZone: 'EST' });

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

module.exports.makerPage = makerPage;
module.exports.make = makeChirp;