var Platform = require('../models/platform');
var Game = require('../models/game');

const async = require("async");

// Display list of all platforms.
exports.platform_list = function(req, res, next) {
    Platform.find()
    .exec(function(err, platform_list) {
        if(err) { return next(err); }
        //Success
        platform_list.sort((a,b) => {
            return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
        });
        res.render("platform_list", { title: "All Platforms", platform_list: platform_list});
    });
};

// Display detail page for a specific platform.
exports.platform_detail = function(req, res, next) {
    async.parallel({
        platform: function(callback) {
            Platform.findById(req.params.id).exec(callback);
        },
        game_list: function(callback) {
            Game.find({"platform": req.params.id}, "title platform image")
                .populate("platform")
                .exec(callback);
        },
    }, function(err, results){
        if(err) { return next(err);}
        if(results.platform == null) {
            var err = new Error("Platform not found");
            err.status = 404;
            return next(err);
        }
        //Success
        res.render("platform_detail", { title: "Platform detail", platform: results.platform, game_list: results.game_list  });
    });
};

// Display platform create form on GET.
exports.platform_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Platform create GET');
};

// Handle platform create on POST.
exports.platform_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Platform create POST');
};

// Display platform delete form on GET.
exports.platform_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Platform delete GET');
};

// Handle platform delete on POST.
exports.platform_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Platform delete POST');
};

// Display platform update form on GET.
exports.platform_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Platform update GET');
};

// Handle platform update on POST.
exports.platform_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Platform update POST');
};
