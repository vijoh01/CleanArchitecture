export default function createServer({
  json, urlencoded, app, cors, compression, helmet, logger, validationResult, sanitizeHtml
}) {
  return Object.freeze({ server })

  function server({ hostname, port, routes }) {
    app.use(helmet());
    app.use(compression());
    app.use(json());
    //app.use(urlencoded({ extended: true }));
    app.use(cors({
      origin: '*'
    }));
  
    app.use((req, res, next) => {
      logger.info(`[EXPRESS] Connection received: ${req.protocol}://${req.hostname}${req.path}:${req.method}`);
      next();
    });

    for (let route of routes) {
      if (route.middleware) {
        app[route.method](`${route.path}`, route.middleware, (req, res) => handleRoute(req, res, route));
      } else {
        app[route.method](`${route.path}`, (req, res) => handleRoute(req, res, route));
      }
    }

    const handleRoute = (req, res, route) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        if (req.body) {
          for (const key in req.body) {
            req.body[key] = sanitizeHtml(req.body[key], {
              allowedTags: [],
              allowedAttributes: {}
            });
          }
        }

        route.component(req, res);
      } catch (error) {
        logger.error(`[EXPRESS] Error processing route: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while processing your request' });
      }
    }

    app.listen(port, hostname, () => {
      logger.info(`[EXPRESS] Server running at http://${hostname}:${port}/`);
      return;
    });
  }
}