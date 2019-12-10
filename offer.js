module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getOffers(res, mysql, context, complete){
        //mysql.pool.query("SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id", function(error, results, fields){
        mysql.pool.query("SELECT pokedex.pokemon_name, discord.discord_name, trainer.trainer_name, pokedex.shiny, pokedex.special, pokedex.regional, offering.trainer_id, offering.pokemon_id FROM pokedex JOIN offering on offering.pokemon_id = pokedex.id LEFT JOIN trainer on trainer.id = offering.trainer_id LEFT JOIN discord on discord.id = trainer.discord_id ORDER BY pokedex.dex_id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.offers = results;
            complete();
        });
    }

    function getOffer(res, mysql, context, tid, pid, complete){
      console.log("SELECT pokedex.pokemon_name, discord.discord_name, trainer.trainer_name, pokedex.shiny, pokedex.special, pokedex.regional, offering.trainer_id, offering.pokemon_id FROM pokedex JOIN offering on offering.pokemon_id = pokedex.id LEFT JOIN trainer on trainer.id = offering.trainer_id LEFT JOIN discord on discord.id = trainer.discord_id WHERE trainer_id = " + tid + " AND pokemon_id = " + pid);
        //mysql.pool.query("SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id", function(error, results, fields){
        mysql.pool.query("SELECT pokedex.pokemon_name, discord.discord_name, trainer.trainer_name, pokedex.shiny, pokedex.special, pokedex.regional, offering.trainer_id, offering.pokemon_id FROM pokedex JOIN offering on offering.pokemon_id = pokedex.id LEFT JOIN trainer on trainer.id = offering.trainer_id LEFT JOIN discord on discord.id = trainer.discord_id WHERE trainer_id = " + tid + " AND pokemon_id = " + pid, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            console.log(results[0])
            context.offer = results[0];
            complete();
        });
    }


     function getTrainer(res, mysql, context, complete){
        console.log("trainer");
            mysql.pool.query("SELECT trainer.trainer_name FROM trainer ORDER BY trainer.trainer_name", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.trainer = results;
            complete();
        });
    }

     function getPokemon(res, mysql, context, complete){
        console.log("pokemon");
            mysql.pool.query("SELECT pokedex.pokemon_name FROM pokedex GROUP BY pokedex.pokemon_name ORDER BY pokedex.dex_id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.pokemon = results;
            complete();
        });
    }



    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        console.log("trying here");
        var context = {};
        context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js", "deleteoffer.js"];
        var mysql = req.app.get('mysql');
        getTrainer(res, mysql, context, complete);
        getPokemon(res, mysql, context, complete);
        getOffers(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
              console.log("Rendering");
              console.log(context.offers);
                res.render('offer', context);
            }

        }
    });

    router.get('/:tid/:pid', function(req, res){
        console.log(req.params);
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedplanet.js", "updateoffer.js", "selectoptions.js"];
        var mysql = req.app.get('mysql');
        getOffer(res, mysql, context, req.params.tid, req.params.pid, complete);
        getTrainer(res, mysql, context, complete);
        getPokemon(res, mysql, context, complete);
        //getPlanets(res, mysql, context, complete);
        function complete(){
            console.log("OFFERS");
            console.log(context.offer);
            callbackCount++;
            if(callbackCount >= 3){
                res.render('update-offer', context);
            }

        }
    });

    router.delete('/:pid/:tid', function(req, res){
        console.log("IN DELETE");
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM offering WHERE pokemon_id = " + req.params.pid + " AND trainer_id = " + req.params.tid;
        console.log(sql);
        sql = mysql.pool.query(sql, function(error, results, fields){
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

    router.put('/:pid/:tid', function(req, res){
        var mysql = req.app.get('mysql');
        console.log("IN PUT")
        console.log("TID:" + req.params.tid)
        console.log(req.body)

        console.log("THPSE WERE PARAMS")
        var sql = "UPDATE offering set trainer_id = (SELECT trainer.id from trainer WHERE trainer.trainer_name = '" + req.body.trainer_name + "'), pokemon_id = (SELECT pokedex.id from pokedex where pokedex.pokemon_name = '" + req.body.pokemon_name + "' AND pokedex.special = " + req.body.special + " AND pokedex.shiny = " + req.body.shiny + " AND pokedex.regional = " + req.body.regional + ") WHERE trainer_id = " + req.params.tid + " AND pokemon_id = " + req.params.pid;
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
        if (req.body['add']){
            var mysql = req.app.get('mysql');
            var sql = "INSERT INTO offering VALUES ((SELECT trainer.id FROM trainer WHERE trainer.trainer_name = '" +
             req.body.trainer_name + "'), (SELECT pokedex.id FROM pokedex WHERE pokedex.pokemon_name = '" +
             req.body.pokemon_name + "' and pokedex.special = " +
             req.body.special + " and pokedex.shiny = " +
             req.body.shiny + " and pokedex.regional = " +
             req.body.regional +
             "));";
             console.log(sql);
            var inserts = [req.body.trainer_name, req.body.pokemon_name, req.body.shiny, req.body.special];
            sql = mysql.pool.query(sql, function(error, results, fields){
                if(error){
                    console.log(JSON.stringify(error))
                    res.write(JSON.stringify(error));
                    res.end();
                }else{
                    res.redirect('/offer');
                }
            });
        }else if (req.body['search']){
            console.log(req.body);
            var callbackCount = 0;
            var context = {};
            context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js", "deleteoffer.js"];
            var mysql = req.app.get('mysql');
            var sql = "SELECT pokedex.pokemon_name, discord.discord_name, trainer.trainer_name, pokedex.shiny, pokedex.special, offering.trainer_id, offering.pokemon_id FROM pokedex JOIN offering on offering.pokemon_id = pokedex.id LEFT JOIN trainer on trainer.id = offering.trainer_id LEFT JOIN discord on discord.id = trainer.discord_id WHERE " +
            req.body.searchType + " = '" + req.body.searchInput + "' ORDER BY pokedex.dex_id;";
            sql = mysql.pool.query(sql, function(error, results, fields){
                if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.offers = results;
            })
            console.log(sql);
            getTrainer(res, mysql, context, complete);
            getPokemon(res, mysql, context, complete);
            function complete(){
                callbackCount++;
                if(callbackCount >= 2){
                    res.render('offer', context);
                }

            }
            }
    });

    return router;
}();
