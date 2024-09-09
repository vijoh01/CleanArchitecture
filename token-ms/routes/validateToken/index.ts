export default function createValidateToken({
    verify, secretKey, logger
}) {
    return Object.freeze({
        validateToken
    });

    async function validateToken(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1];

            if (!token) {
                logger.error('[VALIDATE TOKEN] Token not provided');
                return res.status(400).json({ error: 'Token not provided' });
            }

            verify(token, secretKey, (err, decodedToken) => {
                if (err) {
                    logger.error(`[VALIDATE TOKEN] Invalid token - Error: ${err}`);
                    return res.status(401).json({ error: 'Invalid token' });
                }

                logger.info(`[VALIDATE TOKEN] Token validated successfully! Token type: ${decodedToken.type}, User ID: ${decodedToken.userId}`);
                console.log(decodedToken, 'decodedToken');
                
                res.json({ ...decodedToken });
            });
        } catch (error) {
            logger.error(`[VALIDATE TOKEN] Validation failed - Error: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }
}