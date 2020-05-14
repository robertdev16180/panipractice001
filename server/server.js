require('./config/config');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

/**
 * parse application/x-www-form-urlencoded:
 * No json para enviar datos. Para enviar formularios HTML.
 */
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json('Hello World');
});

app.get('/usuario', (req, res) => {
    res.json('get Usuario LOCAL!!!');
});

app.post('/usuario', (req, res) => {

    let body = req.body;

    if (body.nombre === undefined) {

        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });

    } else {
        res.json({
            persona: body
        });
    }

});

app.put('/usuario/:id', (req, res) => {
    
    let id = req.params.id;
    let body = req.body;
    console.log('params: ', req.params);
    console.log('body: ', body);
    res.json({
        id
    });
});

app.delete('/usuario', (req, res) => {
    res.json('delete Usuario');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});