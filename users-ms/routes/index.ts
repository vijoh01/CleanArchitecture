import createRegisterUser from './register';
import createUserAuthenticator from './auth';
import { logger } from "../libs/logger";
import * as bcrypt from 'bcrypt';
import User from '../schemas/UserSchema';
import createUserRetriever from './retriveUser';
import createUpdateUser from './update';


const register = createRegisterUser({
    bcrypt, User, logger
}).registerUser;

const auth = createUserAuthenticator({
    bcrypt, User, logger
}).authenticateUser;

const retriveUser = createUserRetriever({
    User, logger
}).getUser;

const updateUser = createUpdateUser({
    User, logger
}).updateUser;



export { register, auth, retriveUser, updateUser }