const express = require('express');
const router = require('./routes/route');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/deploy', router);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
