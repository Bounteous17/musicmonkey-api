const http = require('http');
const app  = require('./index.js');

const port = process.env.PORT || 8080;

const server = http.createServer(app);

app.listen(process.env.PORT, () => {
    console.log(
        `\nAPI working on http://localhost:${port}\n`
    )
})
