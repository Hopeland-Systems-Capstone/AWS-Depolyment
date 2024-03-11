const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 80;

const auth_api = require('./api/auth_api.js')

app.use(cookieParser());
app.use(bodyParser.json());
app.use(authMiddleware);
app.use(express.static('public', { index: 'index.html' }));

const routeMap = {
    '/index.html': '/login',
    '/main.html': '/dashboard',
    '/gateways.html': '/gateways',
    '/sensors.html': '/sensors',
    '/map.html': '/map',
    '/reports.html': '/reports',
    '/profileBasicInfo.html': '/profile',
    '/profileBillingInfo.html': '/billing',
    '/profileBillingHistory.html': '/billing-history',
    '/profileDateTime.html': '/time',
    '/profileChangePassword.html': '/password',
    '/profileAlarmRecipients.html': '/alarm-recipients'
};

const ignoredSubstrings = ['/images', '/js', '/css', 'favicon.ico'];

async function authMiddleware(req, res, next) {
    console.log(req.path);
    const shouldIgnore = ignoredSubstrings.some(substr => req.path.includes(substr));
    if (shouldIgnore) {
        const url = routeMap[req.path];
        if (url) {
            res.redirect(url);
        } else {
            next();
        }
    } else {
        const loggedIn = await auth_api.checkLoggedIn(req, res);
        if (loggedIn) {
            const url = routeMap[req.path];
            if (req.path === '/' || req.path === '/login' || req.path === '/index.html') {
                res.redirect('/dashboard');
            } else if (url) {
                res.redirect(url);
            } else {
                next();
            }
        } else {
            if (req.path !== "/login") {
                res.redirect("/login");
            } else {
                const url = routeMap[req.path];
                if (url) {
                    res.redirect(url);
                } else {
                    next();
                }
            }
        }
    }
}

//Routes
app.use("/", require("./routes/auth.js"));
app.use("/", require("./routes/data.js"));


for (const htmlFile in routeMap) {
    app.get(routeMap[htmlFile], (req, res) => {
        res.sendFile(__dirname + `/public/${htmlFile}`);
    });
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
