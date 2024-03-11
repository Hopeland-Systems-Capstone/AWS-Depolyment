const crypto = require('crypto');

const cookie_api = require('./cookie_api');
global.crypto = require('crypto');

async function checkLoggedIn(req, res) {

    const token = cookie_api.getCookie(req, 'token');
    if (token !== null && token != '') {

        const user_id = await getUserIdByToken(token);
        console.log("User connected with token " + token + " associated with user_id " + user_id);
        
        if (user_id === null || user_id == -1) {
            console.log("Token resulted in invalid user. Logging out.");
            cookie_api.setCookie(res, 'token', '', { maxAge: 0, path: '/' });
            return false;
        }

        return true;

    } else {
        console.log("Not logged in");
        return false;
    }
}

async function hashPassword(password) {
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function getUserIdByToken(token) {
    try {
        const response = await fetch(`http://3.15.116.158:80/users/token/${token}?key=098f6bcd4621d373cade4e832627b4f6`);
        return await response.json();
    } catch (error) {
        return -1;
    }
}

async function getUserIdByEmail(email) {
    try {
        const response = await fetch(`http://3.15.116.158:80/users/email/${email}?key=098f6bcd4621d373cade4e832627b4f6`);
        return await response.json();
    } catch (error) {
        return -1;
    }
}

async function checkPassword(user_id, hashed_password) {
    try {
        const response = await fetch(`http://3.15.116.158:80/users/${user_id}/password/${hashed_password}?key=098f6bcd4621d373cade4e832627b4f6`);
        const isPasswordCorrect = await response.json();
        return isPasswordCorrect;
    } catch (error) {
        return false;
    }
}

module.exports = {
    hashPassword,
    checkLoggedIn,
    getUserIdByToken,
    getUserIdByEmail,
    checkPassword,
}