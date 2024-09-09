import { log } from "winston";

export default function createTokenRefresh({
    getCache, setCache, cacheConfig, makeFetch, logger
}) {
    return Object.freeze({
        checkAccessToken
    });

    async function checkAccessToken(req, res, next) {

        // Verify access token and check if it's expired
        try {
            const refreshTokenHeader = req.headers['refresh-token'];
            let refreshToken;

            if (refreshTokenHeader && refreshTokenHeader.startsWith('Bearer ')) {
                refreshToken = refreshTokenHeader.split(' ')[1];
            } else {
                logger.error("[TOKEN REFRESH] No or invalid refresh token provided in the header");
                return res.status(400).json({ error: "No or invalid refresh token provided in the header" });
            }

            // Refresh access token and update current access token with the new one
            const newAccessToken = await refreshAccessToken(refreshToken);
            if (!newAccessToken.error) {
                req.headers.authorization = `Bearer ${newAccessToken.accessToken.token}`;
                logger.info(`[TOKEN REFRESH] Successfully refreshed access token for user ID ${newAccessToken.userId}`);
                setCache({ data: newAccessToken, cacheKey: newAccessToken.accessToken.token, cacheConfig });
                res.json({ ...newAccessToken });
            } else {
                res.json({ ...newAccessToken });
            }


        } catch (error) {
            // Token verification failed or expired, handle accordingly
            logger.error(`[TOKEN REFRESH] Access token verification failed: ${error.message}`);
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }

    async function refreshAccessToken(refreshToken) {
        console.log(refreshToken, 'refreshToken');
        
        const headers = { 'authorization': "Bearer " + refreshToken, 'token-type': 'authentication' };
        const tokenPath = 'http://172.17.0.1:4002/api/v1/token/validate';
        const tokenResult = await makeFetch({ params: { refreshToken }, headers, path: tokenPath, method: 'post' });


        const tokenRes = await tokenResult.json();
        const user = tokenRes;

        if (!tokenRes.error) {
            // Generate new access token using the provided user ID
            const authHeaders = { 'token-type': 'authentication' };
            const authPath = 'http://172.17.0.1:4002/api/v1/token/generate';
            const authResult = await makeFetch({ params: { ...user }, headers: authHeaders, path: authPath, method: 'post' });
            const authData = await authResult.json();

            return authData;
        } else {
            // Handle refresh token validation error
            logger.error(`[TOKEN REFRESH] Refresh token validation failed: ${tokenRes.error}`);
            return { error: tokenRes.error };
        }
    }
}