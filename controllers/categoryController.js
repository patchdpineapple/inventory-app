var Category = require('../models/category');
var Game = require('../models/game');

const async = require("async");

// Display list of all categories.
exports.category_list = function(req, res) {
    Category.find()
    .exec(function(err, category_list) {
        if(err) { return next(err); }
        //Success
        category_list.sort((a,b) => {
            return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
        });
        res.render("category_list", { title: "All Categories", category_list: category_list});
    });
};

// Display detail page for a specific category.
exports.category_detail = function(req, res) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id).exec(callback);
        },
        game_list: function(callback) {
            Game.find({"category": req.params.id}, "title platform image")
                .populate("platform")
                .exec(callback);
        },
    }, function(err, results){
        if(err) { return next(err);}
        if(results.category == null) {
            var err = new Error("Category not found");
            err.status = 404;
            return next(err);
        }
        //Success
        res.render("category_detail", { title: "Category detail", category: results.category, game_list: results.game_list  });
    });
};

// Display category create form on GET.
exports.category_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Category create GET');
};

// Handle category create on POST.
exports.category_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Category create POST');
};

// Display category delete form on GET.
exports.category_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Category delete GET');
};

// Handle category delete on POST.
exports.category_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Category delete POST');
};

// Display category update form on GET.
exports.category_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Category update GET');
};

// Handle category update on POST.
exports.category_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Category update POST');
};
