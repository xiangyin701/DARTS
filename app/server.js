const express= require('express');
const { parse } = require('url');
const next = require('next');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const publicPath = [
  '/',
  '/how-it-works',
  '/how-it-works/',
  '/our-team/',
  '/our-team',
  '/contact-us',
  '/contact-us/',
  '/how-to-use',
  '/how-to-use/'

]

app.prepare().then(() => {
  const server = express()
  server.use(bodyParser.urlencoded({extended: true}));
  server.use(bodyParser.json());
  server.use(cookieParser());

  server.use(async (req, res, next) => {
    if (req.path && !(req.path.startsWith('/_next') || req.path.startsWith('/static') 
        || publicPath.includes(req.path)) && !req.cookies['token']) {
      res.writeHead(302, {
        Location: '/'
      })
      res.end();
      res.finished = true;
    } else {
      next();
    }
  });

  server.get('/', (req, res) => {
    if (req.cookies['token']) {
      res.writeHead(302, {
        Location: `/usergroup`
      })
      res.end();
      res.finished = true;
    } else {
      return app.render(req, res, '/home', {
        ...req.query
      });
    }
  });

  server.get('/usergroups', (req, res) => {
    return app.render(req, res, '/usergroups', {
      ...req.query,
    })
  });

  server.get('/usergroup', (req, res) => {
    return app.render(req, res, '/usergroups', {
      ...req.query,
    })
  });

  server.get('/usergroup/:id', (req, res) => {
    return app.render(req, res, '/usergroup', {
      ...req.query,
    })
  });

  server.get('/usergroup/:id/studys', (req, res) => {
    return app.render(req, res, '/usergroup', {
      ...req.query,
    })
  });

  server.get('/usergroup/:groupId/study/:studyId', (req, res) => {
    return app.render(req, res, '/study',{
    ...req.query,
    })
  });

  server.get('/usergroup/:groupId/study/:studyId/experiment/:expId', (req, res) => {
    return app.render(req, res, '/exp', {
      ...req.query,
    })
  });


  server.get('/how-to-use', (req, res) => {
    return app.render(req, res, '/how-to-use', {
      ...req.query,
    })
  });



  server.get('*', (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  server.listen(3000);
})

