import dotenv from 'dotenv';
import express from 'express';
const app = express();

app.use(express.static('public'));

app.get('', (req, res) => {
  res.sendFile(`${process.cwd()}/index.html`);
});

app.get('/status/ping', (req, res) => {
  res.send({ msg: 'pong' }).status(200);
});

const portNum = process.env.PORT || 3000;

app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
});
