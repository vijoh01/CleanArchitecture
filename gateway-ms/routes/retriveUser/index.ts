export default function createRetrieveUser({
    getCache, makeFetch, logger
}) {
    return Object.freeze({
        retriveUser
    });

    async function retriveUser(req, res) {
        try {
            console.log("test");
            
            const {username, email} = req.params;
            const destinationPath = `http://172.17.0.1:4003/api/v1/user/username/${username}/email/${email}`


            logger.info(`[RETRIVE USER] Attempting to get user with username: ${username} and email: ${email}`);
            const results = await makeFetch({ path: destinationPath, method: 'get'})
            const resultsJson = await results.json();
            console.log(resultsJson);
            
            res.json(resultsJson);
            logger.info(`[RETRIVE USER] User successfully retrieved with username: ${username} and email: ${email}`);
        } catch (error) {
            logger.error(`[RETRIVE USER] Registration failed - Error: ${error.message}`);
            res.status(500).json({ error: 'An error occurred while processing your request' });
        }
    }
}