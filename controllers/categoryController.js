const { body, validationResult } = require("express-validator");

var Category = require('../models/category');
var Game = require('../models/game');

const async = require("async");

// Display list of all categories.
exports.category_list = function(req, res, next) {
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
exports.category_detail = function(req, res, next) {
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
        // Success
        // Sort game list
        results.game_list.sort((a,b) => {
            return (a.title < b.title) ? -1 : (a.title > b.title) ? 1 : 0;
        });
        res.render("category_detail", { title: "Category detail", category: results.category, game_list: results.game_list  });
    });
};

// Display category create form on GET.
exports.category_create_get = function(req, res) {
    res.render("category_form", { title: "Add Category" });
};

// Handle category create on POST.
exports.category_create_post = [

    //validate and sanitize
    body("name", "Category name not found").trim().isLength({min:1}).escape(),

    //process request
    (req, res, next) => {
        const errors = validationResult(req);

        //create new model instance
        const category = new Category({
            name: req.body.name
        });

        if(!errors.isEmpty()) {
            res.render("category_form", { title: "Add Category", category: category, errors: errors.array()});
            return;
        }
        else {
            //find if category name already exists
            Category.findOne({"name":req.body.name})
            .exec(function(err, found_category) {
                if(err) { return next(err); }
                if(found_category) {
                    res.redirect(found_category.url);
                } else {
                    category.save(function(err){
                        if(err) { return next(err); }
                        //Save success. Redirect to detail page
                        res.redirect(category.url);

                    });
                }

            });
        }

    }
];

// Display category delete form on GET.
exports.category_delete_get = function(req, res, next) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id).exec(callback);
        }, 
        game_list: function(callback) {
            Game.find({"category": req.params.id}, "title platform image")
                .populate("platform")
                .exec(callback);
        }
    }, function(err, results) {
        if(err) { return next(err);}
        if(results.category == null) {
            res.redirect("/inventory/categories");
        }
        // Success
        // Sort game list
        results.game_list.sort((a,b) => {
            return (a.title < b.title) ? -1 : (a.title > b.title) ? 1 : 0;
        });
        res.render("category_delete", { title: "Delete Category", category: results.category, game_list: results.game_list  });
    });
};

// Handle category delete on POST.
exports.category_delete_post = function(req, res, next) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.body.categoryid).exec(callback);
        }, 
        game_list: function(callback) {
            Game.find({"category": req.body.categoryid}, "title platform image")
                .populate("platform")
                .exec(callback);
        }
    }, function(err, results) {
        if(err) { return next(err);}
        // Success
        if(results.game_list.length > 0) {
            // Category has dependencies, render back delete page
            res.render("category_delete", { title: "Delete Category", category: results.category, game_list: results.game_list  });
            return;
        } else {
            Category.findByIdAndRemove(req.body.categoryid, function deleteCategory(err) {
                if(err) { return next(err); }
                // Success, redirect to all categories page
                res.redirect("/inventory/categories");
            });
        }

       
    });
};

// Display category update form on GET.
exports.category_update_get = function(req, res, next) {
    Category.findById(req.params.id)
        .exec(function(err, category) {
            if(err) { return next(err); }
            if(category == null) {
                var err = new Error('Category not found');
                err.status = 404;
                return next(err);
            }
            // Success
            res.render('category_form', { title: "Update Category", category: category });
        });
};

// Handle category update on POST.
exports.category_update_post = [

    //validate and sanitize
    body("name", "Category name not found").trim().isLength({min:1}).escape(),

    //process request
    (req, res, next) => {
        const errors = validationResult(req);

        //create new model instance
        const category = new Category({
            name: req.body.name,
            _id: req.params.id
        });

        if(!errors.isEmpty()) {
            res.render("category_form", { title: "Update Category", category: category, errors: errors.array()});
            return;
        }
        else {
            //find if category name already exists
            Category.findOne({"name":req.body.name})
            .exec(function(err, found_category) {
                if(err) { return next(err); }
                if(found_category) {
                    res.redirect(found_category.url);
                } else {
                    Category.findByIdAndUpdate(req.params.id, category, {}, function updateCategory(err, updatedcategory) {
                        if(err) { return next(err); }
                        //Update success, redirect to detail page
                        res.redirect(updatedcategory.url);
                    });
                }

            });
        }

    }
];
