const { body, validationResult } = require("express-validator");

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
        // Sort game list
        results.game_list.sort((a,b) => {
            return (a.title < b.title) ? -1 : (a.title > b.title) ? 1 : 0;
        });
        res.render("platform_detail", { title: "Platform detail", platform: results.platform, game_list: results.game_list  });
    });
};

// Display platform create form on GET.
exports.platform_create_get = function(req, res) {
    res.render("platform_form", { title: "Add Platform" });
};

// Handle platform create on POST.
exports.platform_create_post = [

    //validate and sanitize
    body("name", "Name not found").trim().isLength({min:1}).escape(),

    //process request
    (req, res, next) => {
        const errors = validationResult(req);

        //create new model instance
        const platform = new Platform({
            name: req.body.name
        });

        if(!errors.isEmpty()) {
            res.render("platform_form", { title: "Add Category", platform: platform, errors: errors.array()});
            return;
        }
        else {
            //find if category name already exists
            Platform.findOne({"name":req.body.name})
            .exec(function(err, found_platform) {
                if(err) { return next(err); }
                if(found_platform) {
                    res.redirect(found_platform.url);
                } else {
                    platform.save(function(err){
                        if(err) { return next(err); }
                        //Save success. Redirect to detail page
                        res.redirect(platform.url);

                    });
                }

            });
        }

    }
];

// Display platform delete form on GET.
exports.platform_delete_get = function(req, res, next) {
    async.parallel({
        platform: function(callback) {
            Platform.findById(req.params.id).exec(callback);
        }, 
        game_list: function(callback) {
            Game.find({"platform": req.params.id}, "title platform image")
                .populate("platform")
                .exec(callback);
        }
    }, function(err, results) {
        if(err) { return next(err);}
        if(results.platform == null) {
            res.redirect("/inventory/platforms");
        }
        // Success
        // Sort game list
        results.game_list.sort((a,b) => {
            return (a.title < b.title) ? -1 : (a.title > b.title) ? 1 : 0;
        });
        res.render("platform_delete", { title: "Delete Platform", platform: results.platform, game_list: results.game_list  });
    });
};

// Handle platform delete on POST.
exports.platform_delete_post = function(req, res, next) {
    async.parallel({
        platform: function(callback) {
            Platform.findById(req.body.platformid).exec(callback);
        }, 
        game_list: function(callback) {
            Game.find({"platform": req.body.platformid}, "title platform image")
                .populate("platform")
                .exec(callback);
        }
    }, function(err, results) {
        if(err) { return next(err);}
        // Success
        if(results.game_list.length > 0) {
            // Platform has games, render back delete page
            res.render("platform_delete", { title: "Delete Platform", platform: results.platform, game_list: results.game_list  });
        } else {
            Platform.findByIdAndRemove(req.body.platformid, function deletePlatform(err) {
                if(err) { return next(err); }
                // Success, redirect to all platforms page
                res.redirect("/inventory/platforms");
            });
        }
        
    });
};

// Display platform update form on GET.
exports.platform_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Platform update GET');
};

// Handle platform update on POST.
exports.platform_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Platform update POST');
};
