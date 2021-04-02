"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.createAccessToken = void 0;
require("dotenv/config");
const jsonwebtoken_1 = require("jsonwebtoken");
const createAccessToken = (user) => {
    return jsonwebtoken_1.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m'
    });
};
exports.createAccessToken = createAccessToken;
const createRefreshToken = (user) => {
    return jsonwebtoken_1.sign({ userId: user.id, tokenVersion: user.tokenVersion }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '30d'
    });
};
exports.createRefreshToken = createRefreshToken;
//# sourceMappingURL=auth.js.map