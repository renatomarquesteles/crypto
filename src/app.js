const express = require('express');
const request = require('request');
const path = require('path');

const formatCurrency = require('./presenters/formatCurrency');

const app = express();
const port = 3000;

const mercadoBitcoinUrl = 'https://www.mercadobitcoin.net/api';

app.get('/', (req,res) => {
  res.sendFile(path.resolve(__dirname, 'pages', 'home.html'));
})

app.get('/:moeda', (req, res) => {
  const moeda = req.params.moeda;
  request(`${mercadoBitcoinUrl}/${moeda}/ticker`, (error, response, body) => {
    try {
      const { ticker } = JSON.parse(body);

      const data = new Date(ticker.date * 1000);
      const dataFormatada = `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;

      res.send(`
        <h1>${moeda.toUpperCase()}</h1>
        <ul>
          <li>Maior preço unitário de negociação das últimas 24 horas: ${formatCurrency(ticker.high)}</li>
          <li>Menor preço unitário de negociação das últimas 24 horas: ${formatCurrency(ticker.low)}</li>
          <li>Quantidade negociada nas últimas 24 horas: ${ticker.vol}</li>
          <li>Preço unitário da última negociação: ${formatCurrency(ticker.last)}</li>
          <li>Maior preço de oferta de compra das últimas 24 horas: ${formatCurrency(ticker.buy)}</li>
          <li>Menor preço de oferta de venda das últimas 24 horas: ${formatCurrency(ticker.sell)}</li>
          <li>Data e hora da informação: ${dataFormatada}</li>
        </ul>
        <a href="/">Voltar</a>
      `);
    } catch (err) {
      res.send(`
        <h2>Moeda não encontrada.</h2>
        <a href="/">Voltar</a>
      `)
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
