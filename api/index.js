const express = require('express');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const path = require('path');
const serverless = require('serverless-http');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

i18next.use(Backend).init({
  lng: 'ja',
  fallbackLng: 'en',
  backend: {
    loadPath: path.join(__dirname, '..', 'locales/{{lng}}.json'),
  }
}, (err) => {
  if (err) console.error(err);
});

app.use((req, res, next) => {
  const lng = req.query.lng || 'ja';
  req.lng = lng;
  next();
});

app.get('/', (req, res) => {
  const lng = req.lng;
  const t = i18next.getFixedT(lng);
  res.render('index', { lng });
});

module.exports = app;
module.exports.handler = serverless(app);
