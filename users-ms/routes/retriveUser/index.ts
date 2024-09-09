export default function createUserRetriever({
    User, logger
}) {
    return Object.freeze({
        getUser
    });

    async function getUser(req, res) {
        try {
            const { email, username } = req.params;
            logger.info(`[USER INFORMATION] Attempting get information for user with email: ${email} or username: ${username}`);
            const user = await User.findOne({ $or: [{ email }, { username }] });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            logger.info(`[USER INFORMATION] User information retrieved successfully for user with email: ${email} or username: ${username}`);
            res.json({ user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}