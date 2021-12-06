const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let ChirpModel = {};

const convertId = mongoose.Types.ObjectId;
const setChirp = (chirp) => _.escape(chirp).trim();

// All of the information within a chirp
// All three of the first properties are strings to be printed within each
// displayed chirp
// 1. Contains actual chirped message
// 2. Author of chirp (username of account currently in session)
// 3. Date and time (string to be printed)
const ChirpSchema = new mongoose.Schema({
    chirp: {
        type: String,
        required: true,
        trim: true,
        set: setChirp,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: String,
        required: true,
        trim: true,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    createdData: {
        type: Date,
        default: Date.now,
    },
});

// toAPI
// Chirp, author, date
ChirpSchema.statics.toAPI = (doc) => ({
    chirp: doc.chirp,
    author: doc.author,
    date: doc.date,
});

// Finds all of the chirps in the Mongo database
// Selects chirped message, author, and date of each chirp to be used by client
ChirpSchema.statics.findAllChirps = (callback) => ChirpModel.find({}).select('chirp author date').lean().exec(callback);

// Finds every chirp in MongoDB that pertains to searched keyword
ChirpSchema.statics.findBySearch = (searchedTerm, callback) => {
    // Checks if the string of the chirped message contains the searched term
    const search = {
        chirp: { $regex: searchedTerm, $options: 'i' },
    };

    return ChirpModel.find(search).select('chirp author date').lean().exec(callback);
};

// Unused function!!!
// Meant to find the chirps that were only posted by the user in session
ChirpSchema.statics.findByOwner = (ownerId, callback) => {
    const search = {
        owner: convertId(ownerId),
    };

    return ChirpModel.find(search).select('chirp author date').lean().exec(callback);
};

ChirpModel = mongoose.model('Chirp', ChirpSchema);

module.exports.ChirpModel = ChirpModel;
module.exports.ChirpSchema = ChirpSchema;