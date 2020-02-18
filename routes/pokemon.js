var express = require('express');
var router = express.Router();
var models = require('../models');
var axios = require('axios');

// GET /pokemon - return a page with favorited Pokemon
router.get('/', function(req, res) {
    // TODO: Get all records from the DB and render to view
    models.pokemon.findAll().then(function(pokemon) { // models.pokemon is the name of the table
            res.render('pokemon/index', { pokemons: pokemon });
        }).catch(err => {
            res.send("ERROR");
        })
        // res.send('Render a page of favorites here');
});

// POST /pokemon - receive the name of a pokemon and add it to the database
router.post('/', function(req, res) {
    // TODO: Get form data and add a new record to DB
    models.pokemon.create({
        name: req.body.name,
        nickname: null,
        type: null
    }).then(function() {
        res.redirect('/pokemon')
    }).catch(err => {
        res.send("ERROR");
    })
});

//GET /pokemon/:id
router.get('/:id', function(req, res) {
    // query model for pokemon with given ID in pokemon db
    var num = req.params.id;

    models.pokemon.findOne({
        where: {
            id: num
        }
    }).then(function(pokemon) {
        // get name of db queried pokemon
        var pokemonUrl = `http://pokeapi.co/api/v2/pokemon/${pokemon.name}`;
        // pass to api call via api url
        axios.get(pokemonUrl)
            .then(function(result) {
                var pokeInfo = result.data;
                res.render('pokemon/show', { pokemon: pokeInfo });
            })
            .catch(err => { console.log(err) })
            .finally(function() {
                console.log("Made it to the end successfully!!!")
            })
    })
})

module.exports = router;