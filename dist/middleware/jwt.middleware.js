"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_jwt_1 = require("express-jwt");
function authJwt() {
    const secret = process.env.JWT_SECRET;
    const api = process.env.API_URL;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const middleware = (0, express_jwt_1.expressjwt)({
        secret,
        algorithms: ['HS256'],
        isRevoked: void isRevoked,
    }).unless({
        // This all are public api
        // /\/api\/v1\/product(.*)/ this find all after product/feature..etc
        path: [
            { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/product(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/category(.*)/, methods: ['GET', 'OPTIONS'] },
            `${api}/login`,
            `${api}/register`,
        ],
        // path: [{ url: `${api}/product`, methods: ['GET', 'OPTIONS'] }, `${api}/login`, `${api}/register`],
    });
    return ((req, res, next) => {
        middleware(req, res, next).catch(next);
    });
}
// async function isRevoked(req: JwtRequest, payload: any, done: any) {
//   if (!payload.isAdmin) {
//     done(null, true);
//   }
//   done();
// }
function isRevoked(req, payload, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!(payload === null || payload === void 0 ? void 0 : payload.isAdmin)) {
                return done(null, true); // Revoke if user is not an admin
            }
            done(null, false); // Allow access if user is an admin
        }
        catch (error) {
            done(error); // Handle unexpected errors
        }
    });
}
exports.default = authJwt;
// order
