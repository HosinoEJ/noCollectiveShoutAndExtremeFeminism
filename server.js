// 必要なパッケージをインストールしてください
// npm install express marked i18next ejs i18next-fs-backend

const express = require('express');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const path = require('path');


const app = express();

app.use(express.static('public'));

// EJS設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// i18next初期化
i18next.use(Backend).init({
  lng: 'ja', // デフォルト言語
  fallbackLng: 'en',
  backend: {
    loadPath: path.join(__dirname, 'locales/{{lng}}.json'),
  }
}, (err) => {
  if (err) console.error(err);
});

app.use((req, res, next) => {
  // URLクエリ ?lng=ja などで言語変更できる簡易実装
  const lng = req.query.lng || 'ja';
  req.lng = lng;
  next();
});


// ルート
app.get('/', async (req, res) => {
  const lng = req.lng;

  // i18nextから翻訳文を取得
  const t = i18next.getFixedT(lng);


  // EJSテンプレートへ渡すデータ
  res.render('index', {
    lng,
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
