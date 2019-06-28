const express = require('express');
const app = express();
const port = 8080; // default port to listen

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const session = require('express-session');

const path = require('path');



import * as sqlite3 from 'sqlite3';

app.set( "views", __dirname );
app.set( "view engine", "ejs" );

// create json parser
var jsonParser = bodyParser.json()
 
// create urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: true })

app.use(cookieParser());



// DB communication functions

function getPokemons(): Promise<string> {
    return new Promise((resolve, rejects) => {
        let db = new sqlite3.Database('baza.db');

        db.all('select id,name,height,weight from pokemon', [], (err, rows) => {
        if (err) throw(err);

        if( rows.length > 0){
            console.log("found " + rows.length + "pokemons.");
            resolve(rows);
        } else {
            console.log("no pokemons in db");
            rejects();
        }
        });
        db.close();
    });
}

function getPokemonById(id): Promise<string> {
    return new Promise((resolve, rejects) => {
        if (!Number.isInteger(+id)){
            console.log("given number is not integer");
            rejects();
        }
        let db = new sqlite3.Database('baza.db');

        db.all('select pokemon.id,pokemon.name, pokemon.height, ' + 
        'pokemon.weight, pokemon_types.type_id from pokemon inner ' + 
        'join pokemon_types on pokemon.id=pokemon_types.pokemon_id ' + 
        'where pokemon.id=?', [+id], (err, rows) => {
        if (err) throw(err);

        if( rows.length > 0){
            console.log("found  pokemon " + id);
            resolve(rows);
        } else {
            console.log("no pokemon with id " + id + " in db");
            rejects();
        }
        });
        db.close();
    });
}













// route for Home-Page
app.get('/', urlencodedParser, (req, res) => {
    res.redirect('/list');
});

app.get('/list.html', urlencodedParser, (req, res) => {
    res.redirect('/list');
});

app.route('/list').get(urlencodedParser, function(req,res){
    getPokemons().then((pokemon_list) => {
        res.render( "list" , {
            pokemons: pokemon_list,
        });
    });
});

app.route('/pokemon')
    .get(urlencodedParser, (req, res) => {
        getPokemonById(req.query.pokemon_id).then((pokemon_info)=>
        res.render("pokemon", {
            pokemon_info: pokemon_info,
        })).catch(()=>{
            console.log("no pokemon with id " + req.query.pokemon_id);
            res.render("pokemon_not_found")
        });
        
    })

app.use(express.static(path.join(__dirname, "public")));

// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );