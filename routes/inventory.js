var express = require('express');
var router = express.Router();

// Require controller modules.
var game_controller = require('../controllers/gameController');
var platform_controller = require('../controllers/platformController');
var category_controller = require('../controllers/categoryController');


/// GAME ROUTES ///

// GET inventory home page
router.get('/', game_controller.index);

// GET request for creating a Game. NOTE This must come before routes that display Game (uses id).
router.get('/game/create', game_controller.game_create_get);

// POST request for creating Game.
router.post('/game/create', game_controller.game_create_post);

// GET request to delete Game.
router.get('/game/:id/delete', game_controller.game_delete_get);

// POST request to delete Game.
router.post('/game/:id/delete', game_controller.game_delete_post);

// GET request to update Game.
router.get('/game/:id/update', game_controller.game_update_get);

// POST request to update Game.
router.post('/game/:id/update', game_controller.game_update_post);

// GET request for one Game.
router.get('/game/:id', game_controller.game_detail);

// GET request for list of all Game items.
router.get('/games', game_controller.game_list);

/// PLATFORM ROUTES ///

// GET request for creating a Platform. NOTE This must come before route that displays Platform (uses id).
router.get('/platform/create', platform_controller.platform_create_get);

//POST request for creating Platform.
router.post('/platform/create', platform_controller.platform_create_post);

// GET request to delete Platform.
router.get('/platform/:id/delete', platform_controller.platform_delete_get);

// POST request to delete Platform.
router.post('/platform/:id/delete', platform_controller.platform_delete_post);

// GET request to update Platform.
router.get('/platform/:id/update', platform_controller.platform_update_get);

// POST request to update Platform.
router.post('/platform/:id/update', platform_controller.platform_update_post);

// GET request for one Platform.
router.get('/platform/:id', platform_controller.platform_detail);

// GET request for list of all Platform.
router.get('/platforms', platform_controller.platform_list);

/// CATEGORY ROUTES ///

// GET request for creating a Category. NOTE This must come before route that displays Category (uses id).
router.get('/category/create', category_controller.category_create_get);

//POST request for creating Category.
router.post('/category/create', category_controller.category_create_post);

// GET request to delete Category.
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request to delete Category.
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request to update Category.
router.get('/category/:id/update', category_controller.category_update_get);

// POST request to update Category.
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one Category.
router.get('/category/:id', category_controller.category_detail);

// GET request for list of all Category.
router.get('/categories', category_controller.category_list);

module.exports = router;
