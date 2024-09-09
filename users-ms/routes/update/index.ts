export default function createUpdateUser({
    User,
    logger
}) {
    return Object.freeze({
        updateUser
    });

    async function updateUser(req, res) {
        try {
            const { userId } = req.params;
            const updateFields = req.body;
            logger.info(`[UPDATE USER] Attempting to update user with ID: ${userId} updated fields: ${JSON.stringify(updateFields)}`);
            // Log incoming request body
            logger.debug(`[UPDATE USER] Request body: ${JSON.stringify(req.body)}`);
            const existingUser = await User.findById(userId);
            if (!existingUser) {
                logger.error("[UPDATE USER] User not found");
                return res.status(404).json({ error: 'User not found' });
            } 
            // Update user parameters dynamically
            for (const key in updateFields) {
                console.log(key);
                
                existingUser[key] = updateFields[key];
            }
          
            
            await existingUser.save();

            logger.info("[UPDATE USER] User updated successfully");
            res.json({ message: 'User updated successfully' });
        } catch (error) {
            logger.error(`[UPDATE USER] Error during user update: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    };
}