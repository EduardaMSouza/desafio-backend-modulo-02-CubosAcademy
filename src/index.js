const Express = require('express');
const router = require('./routes');

const app = Express();
const PORT = 3000;

app.use(Express.json());

app.use(router);

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});