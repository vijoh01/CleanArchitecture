import createGenerateToken from './generateToken';
import createValidateToken from './validateToken';
import { logger } from '../libs/logger';
import { sign, verify, decode } from 'jsonwebtoken';

const validateToken = createValidateToken({
    verify, secretKey: process.env.NODE_SECRET_KEY, logger
}).validateToken;

const generateToken = createGenerateToken({
    sign, decode, secretKey: process.env.NODE_SECRET_KEY, logger
}).generateToken;


export { validateToken, generateToken }