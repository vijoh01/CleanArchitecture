
import User from '../schemas/UserSchema';
import { register, auth, retriveUser, updateUser} from '../routes';
import { validationResult } from 'express-validator';
import * as sanitizeHtml from 'sanitize-html';
import { log } from 'winston';

const baseUrl = '/api/v1/user';

// Method to fetch users
User.getRetriveUser = async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        retriveUser(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

User.updateUser = async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        updateUser(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Method to register a new user
User.registerUser = async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        for (const key in req.body) {
            req.body[key] = sanitizeHtml(req.body[key], {
                allowedTags: [],
                allowedAttributes: {}
            });
        }

        register(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Method to authenticate a user
User.authUser = async function (req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        for (const key in req.body) {
            req.body[key] = sanitizeHtml(req.body[key], {
                allowedTags: [],
                allowedAttributes: {}
            });
        }

        auth(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const routes = [
    { path: `${baseUrl}/username/:username?/email/:email?`, method: 'get', component: User.getRetriveUser },
    { path: `${baseUrl}/:userId?`, method: 'patch', component: User.updateUser },
    { path: `${baseUrl}/register`, method: 'post', component: User.registerUser },
    { path: `${baseUrl}/auth`, method: 'post', component: User.authUser }
];

export {
    routes
}