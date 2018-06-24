const app  = require('./index.js');
const mumoConfig = require('./config.js').get(process.env.NODE_ENV);

const port = mumoConfig.PORT;

app.listen(port, () => {
    console.log(
        `\nAPI working on http://localhost:${port}\n`
    )
})
