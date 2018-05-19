const express= require('express');
const { parse } = require('url');
const next = require('next');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express()
  server.use(bodyParser.urlencoded({extended: true}));
  server.use(bodyParser.json());
  server.use(cookieParser());

  server.use(async (req, res, next) => {
    if (req.path != '/login' && !(req.path && req.path.startsWith('/_next')) && !req.cookies['token']) {
      res.writeHead(302, {
        Location: '/login'
      })
      res.end();
      res.finished = true;
    } else {
      next();
    }
  });

  server.get('/', (req, res) => {
    return app.render(req, res, '/b', {
      ...req.query,
      subreddit: req.params.subreddit
    })
  });

  server.get('/studies/:id', (req, res) => {
    return app.render(req, res, '/study', {
      ...req.query,
      subreddit: req.params.subreddit
    })
  });

  server.get('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });
  server.listen(3000);
})