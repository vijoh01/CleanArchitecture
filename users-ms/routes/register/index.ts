export default function createRegisterUser({
    bcrypt, User, logger
}) {
    return Object.freeze({
        registerUser
    });

    async function registerUser(req, res) {
        try {
            const { username, email, password } = req.body;
            logger.info(`[REGISTER USER] Attempting to register user with username: ${username}, email: ${email}`);

            // Log incoming request body
            logger.debug(`[REGISTER USER] Request body: ${JSON.stringify(req.body)}`);

            if (username.length < 5) {
                return res.status(400).json({ error: 'Username must be at least 5 characters long' });
            }

            if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }

            if (!password.match(/^(?=.*[0-9])(?=.*[A-Z]).{6,}$/)) {
                return res.status(400).json({ error: 'Password must contain at least one number, one uppercase letter, and be at least 6 characters long' });
            }

            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                logger.error("[REGISTER USER] Username or email already exists");
                return res.status(400).json({ error: 'Username or email already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                username,
                email,
                password: hashedPassword
            });

            await newUser.save();

            logger.info("[REGISTER USER] User registered successfully");
            res.json({ message: 'User registered successfully' });
        } catch (error) {
            logger.error(`[REGISTER USER] Error during registration: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    };
}