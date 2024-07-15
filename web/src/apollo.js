"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const client_1 = require("@apollo/client");
const cache = new client_1.InMemoryCache({});
const link = new client_1.HttpLink({
    uri: `${process.env.REACT_APP_SERVER_URL}/graphql`,
    credentials: 'include'
});
exports.client = new client_1.ApolloClient({
    link,
    cache
});
//# sourceMappingURL=apollo.js.map