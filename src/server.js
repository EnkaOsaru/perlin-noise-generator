const express = require('express');

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => res.sendStatus(200));

app.listen(process.env.PORT);
