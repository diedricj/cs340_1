module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getTeams(res, mysql, context, complete){
        //mysql.pool.query("SELECT bsg_people.character_id as id, fname, lname, bsg_planets.name AS homeworld, age FROM bsg_people INNER JOIN bsg_planets ON homeworld = bsg_planets.planet_id", function(error, results, fields){

        mysql.pool.query("SELECT team_name, id, team_color FROM team", function(error, results, fields){

            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.teams = results;
            complete();
        });
    }

    router.delete('/:id', function(req, res){
        console.log("I am in delete");
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM team WHERE id = " + req.params.id;
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

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        console.log("trying here");
        var context = {};
        context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js", "deleteteams.js"];
        var mysql = req.app.get('mysql');
        getTeams(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
              console.log("Rendering");
              console.log(context.teams);
                res.render('teams', context);
            }

        }
    });

    router.post('/', function(req, res){
        if (req.body['add']){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO team (team_name, team_color) VALUES ('" + req.body.team_name + "', '" + req.body.team_color + "');";
        console.log(sql);
        var inserts = [req.body.team_name, req.body.team_color];
        sql = mysql.pool.query(sql, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/teams');
             }
        });
        } else if (req.body['search']){
            console.log("Searching");
            var callbackCount = 0;
            var context = {};
            context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js", "deleteteams.js"];
            var mysql = req.app.get('mysql');
            var sql =  "SELECT team.team_name, team.team_color, id FROM team WHERE team.team_name = '" + req.body.searchInput + "';";
            console.log(sql);
           sql = mysql.pool.query(sql, function(error, results, fields){
                if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.teams = results;
            complete();
            })
            function complete(){
                callbackCount++;
                if(callbackCount >= 1){
                    res.render('teams', context);
                }

            }
        }
    });

    return router;
}();
