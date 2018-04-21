const jwt = require('jsonwebtoken');
const uuid = require('node-uuid');
const config = require('./config.json');

class UserManager {
    /**
     * Instantiates a new UserManager object with a secret defined in
     * config.json.
     */
    constructor() {
        this.secret = config.secret;
    }

    /**
     * Returns a promise that, when fulfilled, returns a token that can be used
     * to authenticate for the new created user.
     *
     * @returns {Promise}
     */
    createUser() {
        return new Promise((resolve, reject) => {
            try {
                let userID = uuid.v1();
                let token = jwt.sign({id: userID}, this.secret, {
                    expiresIn: 86400
                });
                resolve(token);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Returns a promise that, when fulfilled, will return an object with the
     * decoded data from the signed token.
     *
     * @param token {string}    A string of a token that will be verified.
     * @returns {Promise}
     */
    verifyUser(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.secret, (err, decoded) => {
                if (err) reject(err);
                resolve(decoded);
            });
        })
    }
}

module.exports = UserManager;