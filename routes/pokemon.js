var express = require('express');
var router = express.Router();
const db = require('../models');

//GET /pokemon - return a page with favorited Pokemon
router.get('/', function(req, res) {
    db.pokemon.findAll().then(poke => {
        res.render('result', { pokemon: poke });
        //res.json(poke);
    }).catch(err => {
        console.log(err);
        res.send("Error");
    })
});

// Create - POST /pokemon (redirect to /pokemon)
router.post('/', (req, res) => {
    db.pokemon.findOrCreate({
        where: {
            name: req.body.name
        }
    }).then(([poke, created]) => {
        if (created) {
            console.log(`Created ${poke.name}`);
            res.redirect(`/pokemon`);
        } else {
            console.log(`Found ${poke.name}`);
            res.send(`${poke.name} has already been added`);
        }
    }).catch(err => {
        console.log(err);
    });
})

// Show - GET /pokemon/:id
router.get('/:id', (req, res) => {
    db.pokemon.findOne({
        where: {
            id: req.params.id
        }
    }).then(poke => {
        console.log(`Found ${poke.id}`);
        // res.send(`Found ${poke.name}`);
        res.render('info', { poke: poke });

    }).catch(err => {
        console.log(err)
        res.send("ERROR NO ID FOUND");
    });
})

module.exports = router;