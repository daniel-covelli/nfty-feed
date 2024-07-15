"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const react_router_dom_1 = require("react-router-dom");
const App_1 = require("./App");
const Error_1 = __importDefault(require("./pages/Error"));
const Login_1 = require("./pages/Login");
const Layout_1 = __importDefault(require("./components/shared/Layout"));
const Register_1 = require("./pages/Register");
const Profile_1 = require("./pages/Profile");
const middleware_1 = __importDefault(require("./utils/middleware"));
exports.routes = [
    {
        path: '/',
        loader: middleware_1.default.rerouteIfNotLoggedIn,
        children: [
            { index: true, element: <App_1.App /> },
            {
                element: (<Layout_1.default>
            <react_router_dom_1.Outlet />
          </Layout_1.default>),
                children: [
                    {
                        path: '/at/:id',
                        element: <Profile_1.Profile />
                    }
                ]
            }
        ]
    },
    {
        loader: middleware_1.default.rerouteIfLoggedIn,
        element: (<Layout_1.default>
        <react_router_dom_1.Outlet />
      </Layout_1.default>),
        children: [
            {
                path: 'register',
                element: <Register_1.Register />
            },
            {
                path: 'login',
                element: <Login_1.Login />
            }
        ]
    },
    {
        path: '/error',
        element: <Error_1.default />
    }
];
//# sourceMappingURL=routes.js.map