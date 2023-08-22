const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) =>{
    const token = req.body.token || req.query.token || req.params.token || req.hraders["x-access-token"];
    if(!token)
        return res.status(403).send("token required");
    try{
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    }catch (err) {
        return res.status(400).send("invalid token");
    }
    return next();
};

module.exports = verifyToken;