const express = require("express");
const router = express.Router();

const auth_api = require('../api/auth_api');
const token_api = require('../api/token_api');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user_id = await auth_api.getUserIdByEmail(email);

    if (user_id === -2 || user_id === -1) {
        res.status(401).send('Unauthorized');
        return;
    }
    
    //const hashed_password = await auth_api.hashPassword(password);
    const isPasswordCorrect = await auth_api.checkPassword(user_id, password);
    
    if (isPasswordCorrect) {
        const token = await token_api.generateToken();
        await token_api.storeToken(user_id, token);
        
        const expirationDate = new Date(Date.now() + (86400 * 1000)); // Calculate expiration date 1 day from now
        res.cookie('token', token, { expires: expirationDate, path: '/' });

        res.status(200).send('OK');
        return;
    } else {
        res.status(401).send('Unauthorized');
        return;
    }
});

module.exports = router;