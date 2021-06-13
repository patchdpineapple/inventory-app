var Game = require('../models/game');

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
exports.game_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Game create GET');
};

// Handle game create on POST.
exports.game_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Game create POST');
};

// Display game delete form on GET.
exports.game_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Game delete GET');
};

// Handle game delete on POST.
exports.game_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Game delete POST');
};

// Display game update form on GET.
exports.game_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Game update GET');
};

// Handle game update on POST.
exports.game_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Game update POST');
};
