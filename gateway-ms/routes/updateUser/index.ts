export default function createUpdateUser({
    makeFetch,
    logger
}) {
    return Object.freeze({
        updateUser
    });

    async function updateUser(req, res) {
        try {
            const { userId } = req.params;
            const updateFields = req.body;
            const destinationPath = `http://172.17.0.1:4003/api/v1/user/${userId}`;

            logger.info(`[UPDATE USER] Attempting to update user with ID: ${userId} ${JSON.stringify(req.body)}`);

            // Log incoming request body
            logger.debug(`[UPDATE USER] Request body: ${JSON.stringify(req.body)}`);

            const results = await makeFetch({ path: destinationPath, method: 'PATCH', params: updateFields });

            if (!results.ok) {
                const errorMessage = await results.text();
                throw new Error(errorMessage || 'Failed to update user information');
            }

            const updatedUserData = await results.json();

            logger.info("[UPDATE USER] User updated successfully");
            res.json(updatedUserData);
        } catch (error) {
            logger.error(`[UPDATE USER] Error updating user: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }
}