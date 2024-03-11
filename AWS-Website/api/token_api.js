const crypto = require('crypto');

async function generateToken() {
    const token = new Uint8Array(32);
    crypto.getRandomValues(token);
    return Array.from(token, b => b.toString(16).padStart(2, '0')).join('');
}

async function storeToken(user_id, token) {
    try {
        const response = await fetch(`http://3.15.116.158:80/users/${user_id}/token/${token}?key=098f6bcd4621d373cade4e832627b4f6`, {
            method: 'PUT'
        });
        return await response.json();
    } catch (error) {
        return false;
    }
}

module.exports = {
    generateToken,
    storeToken,
}