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
const react_router_dom_1 = require("react-router-dom");
const graphql_1 = require("../generated/graphql");
const apollo_1 = require("../apollo");
const rerouteIfNotLoggedIn = (_a) => __awaiter(void 0, [_a], void 0, function* ({ request }) {
    try {
        const { error } = yield apollo_1.client.query({ query: graphql_1.MeDocument });
        if (error === null || error === void 0 ? void 0 : error.graphQLErrors) {
            return (0, react_router_dom_1.redirect)('/login');
        }
        return null;
    }
    catch (error) {
        return (0, react_router_dom_1.redirect)('/login');
    }
});
const rerouteIfLoggedIn = (_a) => __awaiter(void 0, [_a], void 0, function* ({ request }) {
    try {
        yield apollo_1.client.query({ query: graphql_1.MeDocument });
        return (0, react_router_dom_1.redirect)('/');
    }
    catch (error) {
        return null;
    }
});
const middleware = { rerouteIfNotLoggedIn, rerouteIfLoggedIn };
exports.default = middleware;
//# sourceMappingURL=middleware.js.map