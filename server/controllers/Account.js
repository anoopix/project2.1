const models = require('../models');

const { Account } = models;

// Used to render notFound.handlebars page
const notFound = (req, res) => {
    res.render('notFound', { csrfToken: req.csrfToken() });
};

// Used to render login screen
const loginPage = (req, res) => {
    res.render('login', { csrfToken: req.csrfToken() });
};

// Logout function
// Redirects to main login screen
const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};

// Function used to check whether user's entered account exists in Mongo database
// and if password is correct
const login = (request, response) => {
    const req = request;
    const res = response;

    // Force cast to strings to cover up some security flaws
    const username = `${req.body.username}`;
    const password = `${req.body.pass}`;

    if (!username || !password) {
        return res.status(400).json({ error: 'All the fields need to be filled!' });
    }

    return Account.AccountModel.authenticate(username, password, (err, account) => {
        if (err || !account) {
            return res.status(401).json({ error: 'Wrong username or password' });
        }

        req.session.account = Account.AccountModel.toAPI(account);

        return res.json({ redirect: '/maker' });
    });
};

// Function used to handle user signup
// Called through handleSignup in 'login/client.js'
const signup = (request, response) => {
    const req = request;
    const res = response;

    // Cast to strings to cover up some security flaws
    req.body.username = `${req.body.username}`;
    req.body.pass = `${req.body.pass}`;
    req.body.pass2 = `${req.body.pass2}`;

    if (!req.body.username || !req.body.pass || !req.body.pass2) {
        return res.status(400).json({ error: 'All the fields need to be filled!' });
    }

    if (req.body.pass !== req.body.pass2) {
        return res.status(400).json({ error: 'The passwords need to match!' });
    }

    // Saves entered username and password into Mongo database of accounts
    return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
        const accountData = {
            username: req.body.username,
            salt,
            password: hash,
        };

        const newAccount = new Account.AccountModel(accountData);

        const savePromise = newAccount.save();

        savePromise.then(() => {
            req.session.account = Account.AccountModel.toAPI(newAccount);
            return res.json({ redirect: '/maker' });
        });

        savePromise.catch((err) => {
            console.log(err);

            if (err.code === 11000) {
                return res.status(400).json({ error: 'Username is already in use.' });
            }

            return res.status(400).json({ error: 'An error occurred' });
        });
    });
};

// Function used to change password
// Called through 'handleChange' in 'app/maker.js'
const changePass = (request, response) => {
    const req = request;
    const res = response;

    // Cast to strings to cover up some security flaws
    req.body.old = `${req.body.old}`;
    req.body.new = `${req.body.new}`;
    req.body.new2 = `${req.body.new2}`;

    if (!req.body.old || !req.body.new || !req.body.new2) {
        return res.status(400).json({ error: 'All the fields need to be filled!' });
    }

    if (req.body.new !== req.body.new2) {
        return res.status(400).json({ error: 'The passwords need to match!' });
    }

    // First checks if account exists in Mongo database
    return Account.AccountModel.authenticate(
        req.session.account.username,
        req.body.old,
        (err, account) => {
            if (err || !account) {
                return res.status(401).json({ error: 'Wrong old password' });
            }

            req.session.account = Account.AccountModel.toAPI(account);

            console.log(`1. account: ${JSON.stringify(req.session.account)}`);

            // Sets new password and updates account's current info
            return Account.AccountModel.generateHash(req.body.new, (salt, hash) => {
                const accountData = {
                    username: req.session.account.username,
                    salt,
                    password: hash,
                };

                console.log(`accountData: ${JSON.stringify(accountData)}`);

                Account.AccountModel.findOne({ _id: req.session.account._id }, (err, doc) => {
                    // This updates the document containing the user's info
                    doc.username = accountData.username;
                    doc.salt = accountData.salt;
                    doc.password = accountData.password;

                    // Then the document is saved
                    doc.save();
                });

                return res.json({ redirect: '/maker' });
            });
        },
    );
};

// getToken function
const getToken = (request, response) => {
    const req = request;
    const res = response;

    const csrfJSON = {
        csrfToken: req.csrfToken(),
    };

    res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.notFound = notFound;
module.exports.changePass = changePass;