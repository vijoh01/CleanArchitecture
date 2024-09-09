
import { authUser, protectedRoute, registerUser, retriveUser, refresh, updateUser } from '../routes';

const baseUrl = '/api/v1/services';

const routes = [
    { path: `${baseUrl}/username/:username?/email/:email?`, middleware: protectedRoute, method: 'get', component: retriveUser },
    { path: `${baseUrl}/token/refresh`, method: 'post', component: refresh },
    { path: `${baseUrl}/register`, method: 'post', component: registerUser },
    { path: `${baseUrl}/auth`, method: 'post', component: authUser },
    { path: `${baseUrl}/user/:userId?`, method: 'patch', component: updateUser},
    { path: `${baseUrl}/protected`, method: 'post', component: protectedRoute }
];

export {
    routes
}