export default function createAuth({
    cacheConfig, setCache, makeFetch, logger
}) {
    return Object.freeze({
        auth
    });

    async function auth(req, res) {
        try {
            const destinationPath = 'http://172.17.0.1:4003/api/v1/user/auth'
            const params = req.body;

            logger.info(`[AUTH] Attempting to authenticate user with email: ${params.email}`);
            const results = await makeFetch({ params, path: destinationPath, method: 'post' })
            const resultsJson = await results.json();
            console.log(resultsJson, 'resultsJson');

            if (resultsJson?.error) {
                return res.status(401).json({ error: resultsJson?.error });
            }
            logger.info(`[AUTH] ${resultsJson?.message} for user with email: ${params.email}`);

            const headers = {
                'token-type': 'authentication'
            };

            if (!resultsJson.data) {
                res.status(500).json({ error: 'No data found for user' });
                console.log('No data found for user');
                return;
            }

            const user = {
                userId: resultsJson.data._id,
                username: resultsJson.data.username,
                email: resultsJson.data.email,
                role: resultsJson.data.role
            }
            console.log(user, 'user');

            const tokenPath = 'http://172.17.0.1:4002/api/v1/token/generate'
            const tokenResult = await makeFetch({ params: { user }, headers, path: tokenPath, method: 'post' })

            const tokenRes = await tokenResult.json();

            const data = {
                accessToken:
                    {...tokenRes.accessToken},
                refreshToken: {
                    token: tokenRes.refreshToken.token, 
                    created: tokenRes.refreshToken.created, 
                    expiresIn: tokenRes.refreshToken.expiresIn
                },
                userId: tokenRes.userId,
                username: tokenRes.username,
                email: tokenRes.email,
                role: tokenRes.role
            }

            
            setCache({ data, cacheKey: tokenRes.accessToken.token, cacheConfig })
            

            res.json(data);

        } catch (error) {
            logger.error(`[AUTH] Authentication failed - Error: ${error.message}`);
            res.status(500).json({ error: 'An error occurred while processing your request' });
        }
    }
}