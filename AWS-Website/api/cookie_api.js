function getCookie(req, name) {
    const cookieStr = req.headers.cookie;
    if (!cookieStr) {
        return null;
    }
    const cookies = cookieStr.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${name}=`)) {
            return cookie.substring(`${name}=`.length, cookie.length);
        }
    }
    return null;
}

function serializeCookieOptions(options) {
    const serialized = [];
    for (const [key, value] of Object.entries(options)) {
        if (value === true) {
            serialized.push(key);
        } else if (value !== false) {
            serialized.push(`${key}=${value}`);
        }
    }
    return serialized.join('; ');
}

function setCookie(res, name, value, options) {
    const cookie = `${name}=${value}; ${serializeCookieOptions(options)}`;
    res.setHeader('Set-Cookie', cookie);
}

module.exports = {
    getCookie,
    serializeCookieOptions,
    setCookie,
}