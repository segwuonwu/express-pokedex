require('dotenv').config();
const express = require('express');
const axios = require('axios');
const ejsLayouts = require('express-ejs-layouts');
const db = require('./models');
const app = express();
const port = process.env.PORT || 3000;

app.use(require('morgan')('dev'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(ejsLayouts);

// GET / - main index of site
app.get('/', function(req, res) {
    var pokemonUrl = 'http://pokeapi.co/api/v2/pokemon/';
    // Use request to call the API
    axios.get(pokemonUrl).then(function(apiResponse) {
        var pokemon = apiResponse.data.results;
        res.render('index', { pokemon: pokemon.slice(0, 151) });
    })
});

// Index - GET /pokemon
app.get('/pokemon', (req, res) => {
    db.pokemon.findAll().then(poke => {
        console.log(poke)
        res.json(poke);
    }).catch(err => {
        console.log(err);
        res.send("Error");
    })
})

// Create - POST /pokemon (redirect to /pokemon)
app.post('/pokemon', (req, res) => {
    db.pokemon.findOrCreate({
        where: {
            name: req.body.name
        },
        defaults: {
            name: req.body.name,
        }
    }).then(([poke, created]) => {
        if (created) {
            console.log(`Created ${pokemon.name}`);
            res.redirect(`/pokemon`); ///${pokemon.id}
        } else {
            console.log(`Found ${pokemon.name}`);
        }
        res.send("Pokemon was created successfully!!");
    }).catch(err => {
        console.log(err);

    });

})

// db.pokemon.create({
//     name: 'Pikachu'
// }).then(function(poke) {
//     console.log('Created: ', poke.name)
// })

// db.pokemon.findAll().then(function(poke) {
//     console.log('Found: ', poke.name)
// })

// Imports all routes from the pokemon routes file
app.use('/pokemon', require('./routes/pokemon'));

var server = app.listen(port, function() {
    console.log('...listening on', port);
});

module.exports = server;