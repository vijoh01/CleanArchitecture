export default function createUserAuthenticator({
    bcrypt, User, logger
}) {
    return Object.freeze({
        authenticateUser
    });

    async function authenticateUser(req, res) {
        try {
            const { username, password } = req.body;
            logger.info(`[AUTH] Attempting to authenticate user with username: ${username}`);
            const user = await User.findOne({ username });
            console.log(user, 'user');
            
            if (!user) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            res.json({ message: 'User authenticated successfully', data: user});
            logger.info(`[AUTH] user authenticated successfully with username: ${username}`);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}