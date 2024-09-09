export default function createRegister({
    makeFetch, logger
}) {
    return Object.freeze({
        register
    });

    async function register(req, res) {
        try {
            const destinationPath = 'http://172.17.0.1:4003/api/v1/user/register'
            const params = req.body;


            logger.info(`[REGISTER] Attempting to register user with email: ${params.email}`);
            const results = await makeFetch({ params, path: destinationPath, method: 'post'})
            const resultsJson = await results.json();
            console.log(resultsJson);
            
            res.json(resultsJson);
            logger.info(`[REGISTER] User registered successfully with email: ${params.email}`);
        } catch (error) {
            logger.error(`[REGISTER] Registration failed - Error: ${error.message}`);
            res.status(500).json({ error: 'An error occurred while processing your request' });
        }
    }
}