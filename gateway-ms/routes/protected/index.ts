export default function createProtected({
    getCache, logger, cacheConfig
}) {
    return Object.freeze({
        protectedRoute
    });

    async function protectedRoute(req, res, next) {
        try {
            const token = req.headers.authorization;
            if (token.split(' ')[0] !== 'Bearer') {
                logger.error(`[PROTECTED] Failed to access protected route - Error: Invalid token`);
                return res.status(401).json({ error: 'Invalid token' });
            }
            const bearerToken = token.split(' ')[1];

            logger.info(`[PROTECTED] Attempting to access protected route with token: ${bearerToken}`);
            const cachedData = await getCache({ cacheKey: bearerToken, cacheConfig});
         
            
            if (!cachedData) {
                logger.error(`[PROTECTED] Failed to access protected route - Error: Unauthorized`);

                return res.status(401).json({ error: 'Unauthorized' });
            }
            
           
            const responseJson = JSON.parse(cachedData);
  
            const response = {
                error: 0,
                data: {
                  ok: true,
                  username: responseJson.username,
                  userId: responseJson.userId
                }
            }

            logger.info(`[PROTECTED] User successfully accessed protected route with token: ${bearerToken}`);
            if (next) {
                return next();
            } else {
            res.json({ data: response });
            }
            
        } catch (error) {
            logger.error(`[PROTECTED] Failed to access protected route - Error: ${error.message}`);
            res.status(500).json({ error: 'An error occurred while processing your request' });
        }
    }
}