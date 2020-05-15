require('../utils/colors');

const express = require('express');

const _ = require('underscore');
const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario');

const app = express();

app.get('/', (req, res) => {
    console.log(Number('r'));
    console.log(Number('1'));
    res.send(`Prueba: ${Date.now()}`);
});

app.get('/usuarios', async function(req, res) {
    console.log('*** Call Controller "usuarios" ***'.green);
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    try {
        let usuarios = await Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)    
        .exec();

        Usuario.count({ estado: true }, (err, cuantos) => {
            res.json({
                ok: true,
                usuarios,
                cuantos
            });
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            error
        });
    }
    /*
    Usuario.find({ estado: true }, 'nombre email role estado google img')
           .skip(desde)
           .limit(limite)
           .exec((err, usuarios) => {   
               if (err) {
                   return res.status(400).json({
                       ok: false,
                       err
                   });
               }   
               Usuario.count({ estado: true }, (err, cuantos) => {
                   res.json({
                       ok: true,
                       usuarios,
                       cuantos
                   });
               });
           });
           */
});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })

});

app.delete('/usuario/:id', function(req, res) {


    let id = req.params.id;

    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});



module.exports = app;