module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getPokemon(res, mysql, context, complete){
        //mysql.pool.query("SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id", function(error, results, fields){
        mysql.pool.query("SELECT pokedex.id, pokedex.dex_id, pokedex.pokemon_name, pokedex.regional, pokedex.shiny, pokedex.special FROM pokedex", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.pokemon = results;
            complete();
        });
    }

    function getAPokemon(res, mysql, context, id, complete){
        //mysql.pool.query("SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id", function(error, results, fields){
        mysql.pool.query("SELECT pokedex.id, pokedex.dex_id, pokedex.pokemon_name, pokedex.regional, pokedex.shiny, pokedex.special FROM pokedex WHERE id = '" + id + "'", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.pokemon = results[0];
            complete();
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js", "deletepokemon.js"];
        var mysql = req.app.get('mysql');
        getPokemon(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
          //    console.log("Rendering");
           //   console.log(context.pokemon);
                res.render('pokedex', context);
            }
        }
    });

    router.delete('/:pid', function(req, res){
        console.log("I am in delete");
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM pokedex WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    router.post('/remove', function(req, res){
        console.log("I am in delete");
        console.log(req.body);
        console.log(req.body.remove_id);
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM pokedex WHERE id = ?";
        var inserts = [req.body.remove_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.redirect('/pokedex');
                res.status(202).end();
            }
        })
    })

    router.get('/:pid', function(req, res){
        console.log(req.params);
        console.log("IM IN THE UPDATE");
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedplanet.js", "updateoffer.js", "selectoptions.js", "updatepokedex.js"];
        var mysql = req.app.get('mysql');
        getAPokemon(res, mysql, context, req.params.pid, complete);
        //getPlanets(res, mysql, context, complete);
        function complete(){
            console.log(context.pokemon);
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-pokedex', context);
            }

        }
    });

    router.put('/:pid', function(req, res){
        var mysql = req.app.get('mysql');
        console.log("IN PUT")
        console.log("PID:" + req.params.pid)
        console.log(req.body)

        console.log("THPSE WERE PARAMS")
        var sql = "UPDATE pokedex set pokemon_name = '" + req.body.pokemon_name + "', regional = " + req.body.regional + ", shiny = " + req.body.shiny + ", special = " + req.body.special + " WHERE id = " + req.params.pid
        console.log(sql);
        sql = mysql.pool.query(sql,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    router.post('/', function(req, res){
        console.log("im in ur post")
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO pokedex (dex_id, pokemon_name, shiny, regional, special) VALUES (" + req.body.dex_id + ", '" + req.body.pokemon_name + "', " + req.body.regional + ", " + req.body.shiny + ", " + req.body.special + ");";
         console.log(sql);
        var inserts = [req.body.trainer_name, req.body.pokemon_name, req.body.shiny, req.body.regional];
        sql = mysql.pool.query(sql, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/pokedex');
            }
        });
    });

    return router;
}();
