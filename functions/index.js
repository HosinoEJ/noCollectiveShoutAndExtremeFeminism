import express from 'express';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';
import serverless from 'serverless-http';

// Cloudflare Pages Functions 環境
const app = express();

// 靜態檔案
app.use(express.static('public'));

// EJS 設定
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// i18next 初始化
await i18next.use(Backend).init({
  lng: 'ja', // 預設語言
  fallbackLng: 'en',
  backend: {
    loadPath: path.join(process.cwd(), 'locales/{{lng}}.json'),
  }
});

// 語言切換中介層
app.use((req, res, next) => {
  const lng = req.query.lng || 'ja';
  req.lng = lng;
  next();
});

// 路由
app.get('/', (req, res) => {
  const lng = req.lng;
  res.render('index', { lng });
});

// 導出給 Cloudflare Pages
export const onRequest = serverless(app);
