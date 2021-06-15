const { body, validationResult } = require("express-validator");

var Game = require('../models/game');
var Platform = require('../models/platform');
var Category = require('../models/category');

const async = require("async");


exports.index = function(req, res) {
    res.render("index", { title: "GamesBox" });
};

// Display list of all games.
exports.game_list = function(req, res, next) {
    Game.find({}, "title platform category image")
    .populate("platform")
    .populate("category")
    .exec(function(err, game_list) {
        if(err) { return next(err); }
        //Success
        game_list.sort((a,b) => {
            return (a.title < b.title) ? -1 : (a.title > b.title) ? 1 : 0;
        });
        res.render("game_list", { title: "All Games", game_list: game_list});

    });
};

// Display detail page for a specific game.
exports.game_detail = function(req, res, next) {
    Game.findById(req.params.id)
    .populate("platform")
    .populate("category")
    .exec(function(err, game) {
        if(err) { return next(err); }
        //Success
        res.render("game_detail", { title: game.title, game: game});

    });
};

// Display game create form on GET.
exports.game_create_get = function(req, res, next) {

    async.parallel({
        platform_list: function(callback) {
            Platform.find().exec(callback);
        }, 
        category_list: function(callback) {
            Category.find().exec(callback);
        }, 
    }, function(err, results){
        if(err) { return next(err); }
        //Success
        results.platform_list.sort((a,b) => {
            return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
        });
        results.category_list.sort((a,b) => {
            return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
        });
        res.render("game_form", { title: "Add Game", platform_list: results.platform_list, category_list: results.category_list});
    });
};

// Handle game create on POST.
exports.game_create_post = [

    // Convert categories to array
    (req, res, next) => {
        if(!(req.body.category instanceof Array)){
            if(typeof req.body.category ==='undefined')
            req.body.category = [];
            else
            req.body.category = new Array(req.body.category);
        }
        next();
    },

    // Validate and sanitize
    body("title", "Title must not be empty").trim().isLength({min:1}).escape(),
    body("description", "Description must not be empty").trim().isLength({min:1}).escape(),
    body("price", "Invalid price").trim().isInt({min:0, allow_leading_zeroes: false}).escape(),
    body("status", "Status must not be empty").trim().isLength({min:1}).escape(),
    body('release', 'Invalid release date').optional({ checkFalsy: true }).isISO8601().toDate(),
    body("platform", "Platform must not be empty").trim().isLength({min:1}).escape(),
    body("category.*").escape(),


    
    // Process request
    (req, res, next) => {
        const errors = validationResult(req);

        // Create new game instance
        let game = new Game({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            status: req.body.status,
            developer: req.body.developer,
            release: req.body.release,
            platform: req.body.platform,
            category: req.body.category,
            image: ""
        });

        if(!errors.isEmpty()) {
            // Error found. go back to form with sanitized post data
            async.parallel({
                platform_list: function(callback) {
                    Platform.find().exec(callback);
                }, 
                category_list: function(callback) {
                    Category.find().exec(callback);
                }, 
            }, function(err, results){
                if(err) { return next(err); }
                // Success
                // Sort platforms and categories
                results.platform_list.sort((a,b) => {
                    return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
                });
                results.category_list.sort((a,b) => {
                    return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
                });
                // Mark our selected categories as checked.
                for (let i = 0; i < results.category_list.length; i++) {
                    if (game.category.indexOf(results.category_list[i]._id) > -1) {
                        results.category_list[i].checked='true';
                    }
                }
                res.render("game_form", { title: "Add Game", game: game, platform_list: results.platform_list, category_list: results.category_list, errors: errors.array()});
            });
            return;
        } else {
            // No errors
            game.save(function(err){
                if(err) { return next(err); }
                // redirect to game detail page
                res.redirect(game.url);
            });
        }

    }

];

// Display game delete form on GET.
exports.game_delete_get = function(req, res, next) {
    Game.findById(req.params.id).exec(function(err, game) {
        if(err) { return next(err); }
        if(game == null) {
            res.redirect("/inventory/games");
        }
        // Success
        res.render("game_delete", { title: "Delete Game", game: game});
    });
};

// Handle game delete on POST.
exports.game_delete_post = function(req, res, next) {
    Game.findByIdAndRemove(req.body.gameid, function deleteGame(err) {
        if(err) { return next(err); }
        // Success, redirect to all games page
        res.redirect("/inventory/games");
    });
};

// Display game update form on GET.
exports.game_update_get = function(req, res, next) {
    async.parallel({
        game: function(callback) {
            Game.findById(req.params.id)
            .populate("platform")
            .populate("category")
            .exec(callback);
        }, 
        platform_list: function(callback) {
            Platform.find().exec(callback);
        }, 
        category_list: function(callback) {
            Category.find().exec(callback);
        }, 
    }, function(err, results){
        if(err) { return next(err); }
        if(results.game == null) {
            var err = new Error('Game not found');
            err.status = 404;
            return next(err);
        }
        //Success
        
        // Mark our selected categories as checked.
        for (let i = 0; i < results.category_list.length; i++) {
            for (let x = 0; x < results.game.category.length; x++) {
                if(results.game.category[x]._id.toString() == results.category_list[i]._id.toString()) {
                    results.category_list[i].checked = "true";
                }
            }
        }
        // Sort
        results.platform_list.sort((a,b) => {
            return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
        });
        results.category_list.sort((a,b) => {
            return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
        });
        // Render page
        res.render("game_form", { title: "Update Game", game: results.game, platform_list: results.platform_list, category_list: results.category_list});
    });
};

// Handle game update on POST.
exports.game_update_post = [

    // Convert categories to array
    (req, res, next) => {
        if(!(req.body.category instanceof Array)){
            if(typeof req.body.category ==='undefined')
                req.body.category = [];
            else
                req.body.category = new Array(req.body.category);
        }
        next();
    },

    // Validate and sanitize
    body("title", "Title must not be empty").trim().isLength({min:1}).escape(),
    body("description", "Description must not be empty").trim().isLength({min:1}).escape(),
    body("price", "Invalid price").trim().isInt({min:0, allow_leading_zeroes: false}).escape(),
    body("status", "Status must not be empty").trim().isLength({min:1}).escape(),
    body('release', 'Invalid release date').optional({ checkFalsy: true }).isISO8601().toDate(),
    body("platform", "Platform must not be empty").trim().isLength({min:1}).escape(),
    body("category.*").escape(),


    
    // Process request
    (req, res, next) => {
        const errors = validationResult(req);

        // Create new game instance
        let game = new Game({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            status: req.body.status,
            developer: req.body.developer,
            release: req.body.release,
            platform: req.body.platform,
            category: (typeof req.body.category==='undefined') ? [] : req.body.category,
            image: "",
            _id: req.params.id
        });

        if(!errors.isEmpty()) {
            // Error found. go back to form with sanitized post data
            async.parallel({
                platform_list: function(callback) {
                    Platform.find().exec(callback);
                }, 
                category_list: function(callback) {
                    Category.find().exec(callback);
                }, 
            }, function(err, results){
                if(err) { return next(err); }
                // Success
                // Sort platforms and categories
                results.platform_list.sort((a,b) => {
                    return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
                });
                results.category_list.sort((a,b) => {
                    return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
                });
                // Mark our selected categories as checked.
                for (let i = 0; i < results.category_list.length; i++) {
                    if (game.category.indexOf(results.category_list[i]._id) > -1) {
                        results.category_list[i].checked='true';
                    }
                }
                res.render("game_form", { title: "Update Game", game: game, platform_list: results.platform_list, category_list: results.category_list, errors: errors.array()});
            });
            return;
        } else {
            // No errors
            Game.findByIdAndUpdate(req.params.id, game, {}, function updateGame(err, updatedgame) {
                if(err) { return next(err); }
                // Success, redirect to game detail page
                res.redirect(updatedgame.url);
            });
        }
    }
];
