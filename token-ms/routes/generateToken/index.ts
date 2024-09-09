export default function createGenerateToken({
    sign, decode, secretKey, logger
}) {
    // Object containing invalidated JWTs (token blacklist/revocation list)
    const tokenBlacklist = {};

    return Object.freeze({
        generateToken
    });

    async function generateToken(req, res) {

        const expirationTimes = {
            authentication: '1h',
            email_verification: '30d',
        };

        try {
            const tokenType = req.headers['token-type'];
            const expiresIn = expirationTimes[tokenType];
            logger.info(`[GENERATE TOKEN] Attempting token generation. Token type: ${tokenType}, User ID: ${req.body.user.userId}`);

            if (!expiresIn) {
                logger.error(`[GENERATE TOKEN] Invalid token type: ${tokenType}`);
                return res.status(400).json({ error: 'Invalid token type: ' + tokenType });
            }
     
            const user = req.body.user;

            if (tokenType === 'authentication') {
                const refreshTokenExpiresIn = '7d'; 
                console.log('user', user);
                
                // Check if the previous refresh token is in the blacklist
                if (user.previousRefreshToken && tokenBlacklist[user.previousRefreshToken]) {
                    logger.warn(`[GENERATE TOKEN] Previous refresh token is blacklisted: ${user.previousRefreshToken}`);
                    return res.status(403).json({ error: 'Previous refresh token is blacklisted' });
                }

                // Invalidate previous refresh token if exists and add it to the token blacklist
                if (user.previousRefreshToken && !tokenBlacklist[user.previousRefreshToken]) {
                    tokenBlacklist[user.previousRefreshToken] = true;
                }

                // Generate a new refresh token
                sign({ type: 'refresh', user: {...user} }, secretKey, { expiresIn: refreshTokenExpiresIn }, (err, refreshToken) => {
                    if (err) {
                        logger.error(`[GENERATE TOKEN] Refresh token generation failed - Error: ${err.message}`);
                        return res.status(500).json({ error: err.message });
                    }
                    
                    // Generate a new access token
                    sign({ type: tokenType, user: {...user} }, secretKey, { expiresIn }, (err, token) => {
                        if (err) {
                            logger.error(`[GENERATE TOKEN] Access token generation failed - Error: ${err.message}`);
                            return res.status(500).json({ error: err.message });
                        }
                        
                        // Return both tokens
                        res.json({ accessToken: {token, created: new Date(), expiresIn: expiresIn}, refreshToken: {token: refreshToken, created: new Date(), expiresIn: refreshTokenExpiresIn}, ...user });

                        // Update user's previous access token
                        user.previousAccessToken = token;
                        user.previousRefreshToken = refreshToken;
                    });
                });
            } else {
                // Generate a token (no need to handle rotation for non-authentication tokens)
                sign({ type: tokenType, user: {...user} }, secretKey, { expiresIn }, (err, token) => {
                    if (err) {
                        logger.error(`[GENERATE TOKEN] Token generation failed - Error: ${err.message}`);
                        return res.status(500).json({ error: err.message });
                    }
                    
                    res.json({ token, user });
                });
            }
            logger.info(`[GENERATE TOKEN] Token(s) generated successfully. Token type: ${tokenType}, User ID: ${req.body}`);
        } catch (error) {
            logger.error(`[GENERATE TOKEN] Token generation failed - Error: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }
}