module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getDiscord(res, mysql, context, complete){
        //mysql.pool.query("SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id", function(error, results, fields){
        mysql.pool.query("SELECT discord_name, id FROM discord", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.discord = results;
            complete();
        });
    }

    function getADiscord(res, mysql, context, id, complete){
        //mysql.pool.query("SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id", function(error, results, fields){
        mysql.pool.query("SELECT discord_name, id FROM discord where id = " + id, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.discord = results[0];
            complete();
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        console.log("trying here");
        var context = {};
        context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js", "deletediscord.js"];
        var mysql = req.app.get('mysql');
        getDiscord(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
              console.log("Rendering");
              console.log(context.discord);
                res.render('discord', context);
            }
        }
    });

    router.delete('/:id', function(req, res){
        console.log("I am in delete");
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM discord WHERE id = " + req.params.id;
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

    router.get('/:id', function(req, res){
        console.log(req.params);
        console.log("IM IN THE UPDATE");
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedplanet.js", "updateoffer.js", "selectoptions.js", "updatediscord.js"];
        var mysql = req.app.get('mysql');
        getADiscord(res, mysql, context, req.params.id, complete);
        //getPlanets(res, mysql, context, complete);
        function complete(){
            console.log(context.pokemon);
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-discord', context);
            }

        }
    });

    router.put('/:pid', function(req, res){
        var mysql = req.app.get('mysql');
        console.log("IN PUT")
        console.log("PID:" + req.params.pid)
        console.log(req.body)

        console.log("THPSE WERE PARAMS")
        var sql = "UPDATE discord set discord_name = '" + req.body.discord_name + "' WHERE id = " + req.params.pid
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
        var sql = "INSERT INTO discord (discord_name) VALUES ('" + req.body.discord_name + "');";
        console.log(sql);
        var inserts = [req.body.discord_name];
        sql = mysql.pool.query(sql, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/discord');
            }
        });
    });

    return router;
}();
