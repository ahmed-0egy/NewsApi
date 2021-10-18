const express = require('express');
const app = express();
const port = 3000;

const path = require('path');
const hbs = require('hbs');
const publicDirectory = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsDirectory = path.join(__dirname, '../templates/partials');

app.use(express.static(publicDirectory));
app.use(express.json());

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsDirectory);

require('./db/news-database');
const reporterRouter = require('./routers/reporters');
const newsRouter = require('./routers/news');
app.use(reporterRouter);
app.use(newsRouter);

app.listen(port, ()=>{
    console.log('server is running');
});