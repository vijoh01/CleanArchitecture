
import { generateToken, validateToken } from '../routes';
import { validationResult } from 'express-validator';
import * as sanitizeHtml from 'sanitize-html';

const baseUrl = '/api/v1/token';

// Method to fetch users
const createToken = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        generateToken(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const checkToken = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        validateToken(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const routes = [
    { path: `${baseUrl}/validate`, method: 'post', component: checkToken },
    { path: `${baseUrl}/generate`, method: 'post', component: createToken },
];

export {
    routes
}