#! /usr/bin/env node

console.log('This script populates some test platforms, categories and games to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/inventory_app?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Platform = require("./models/platform");
var Category = require("./models/category");
var Game = require("./models/game");

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var platforms = []
var categories = []
var games = []

function platformCreate( name, cb) {
  var platform = new Platform({
    name: name
  });

  platform.save(function(err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Platform: ' + platform);
    platforms.push(platform);
    cb(null, platform);
  });
}

function categoryCreate( name, cb) {
  var category = new Category({
    name: name
  });

  category.save(function(err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Category: ' + category);
    categories.push(category);
    cb(null, category);
  });
}

function gameCreate(title, description, price, status, developer, release, platform, category, image, cb) {
  gamedetail = { 
    title: title,
    description: description,
    price: price,
    status: status,
    platform: platform
  }

  if (developer != false) gamedetail.developer = developer
  if (release != false) gamedetail.release = release
  if (category != false) gamedetail.category = category
  if (image != false) gamedetail.image = image

  var game = new Game(gamedetail);    
  game.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Game: ' + game);
    games.push(game)
    cb(null, game)
  }  );
}

function createPlatformsCategories(cb) {
    async.series([
          function(callback) {
            platformCreate("PlayStation", callback);
          },
          function(callback) {
            platformCreate("PlayStation 2", callback);
          },
          function(callback) {
            platformCreate("PlayStation Portable", callback);
          },
          function(callback) {
            platformCreate("Game Boy Advance", callback);
          },
          function(callback) {
            platformCreate("Nintendo 3DS", callback);
          },
          function(callback) {
            platformCreate("PC", callback);
          },
          function(callback) {
            categoryCreate("Role Playing Game", callback);
          },
          function(callback) {
            categoryCreate("Action", callback);
          },
          function(callback) {
            categoryCreate("Adventure", callback);
          },
          function(callback) {
            categoryCreate("Puzzle", callback);
          },
          function(callback) {
            categoryCreate("Strategy", callback);
          },
          function(callback) {
            categoryCreate("Sports", callback);
          }
        ],
        // optional callback
        cb);
}

function createGames(cb) {
    async.parallel([
          function(callback) {
            gameCreate('Final Fantasy VII', "Final Fantasy VII follows the story of mercenary Cloud Strife, who is hired by the eco-terrorist group AVALANCHE—led by Barret Wallace—to help fight the mega-corporation Shinra Electric Power Company, who attempts to drain the planet's lifeblood as an energy source to further their profits. Apathetic to the cause, Cloud initially fights for personal gain, and for the promise he made to childhood friend Tifa Lockhart. Cloud eventually joins forces with many others to save the planet, which is threatened by Shinra and Cloud's nemesis Sephiroth, and discovers a reason to fight for a cause other than his own.", 60, "Available", "Square Enix", "1997-09-07", platforms[0], [categories[0], categories[1], categories[2]], false, callback);
          },
          function(callback) {
            gameCreate('Pokemon Emerald', "The Hoenn region is unstable -- Rayquaza has awakened! Your skills as a Trainer will be challenged like they've never been challenged before as you try to maintain the balance between Kyogre & Groudon. Prove your skills by earning badges & gaining access to Battle Frontier -- The front line of Pokémon battling that offers a whole new level of competition. Never-before-experienced battles await you!", 20, "Out of stock", "Game Freak", false, platforms[3], [categories[2]], false, callback)
          },
          function(callback) {
            gameCreate('Resident Evil 4', "Resident Evil 4 marks a new chapter in the Resident Evil series. You'll rejoin Leon S. Kennedy six years after his first mission as a rookie cop from Resident Evil 2. Now a US agent, Leon is on a top secret mission to investigate the disappearance of the president's daughter. As Leon, you must make your way to a mysterious location in Europe, where new enemies await. Take them down by using enhanced aim-and-shoot features and a new action button.", 40, "Available", false, "2005-10-25", platforms[1], false, false, callback)
          },
          function(callback) {
            gameCreate("Monster Hunter Portable 3rd", "Monster Hunter Portable 3rd is a Role-Playing game, developed and published by Capcom, which was released in Japan in 2010.", 25, "Out of stock", "Capcom", "2010-12-01", platforms[3], [categories[0], categories[1]], false, callback)
          },
          function(callback) {
            gameCreate("Digimon World", "Only you can rescue the Digimon World! When you are pulled into a strange world, what awaits you on the other side? Are you the one they seek? Do you have what it takes to save Digimon World?", 10, "Available", false, false, platforms[0], false, false, callback)
          }
        ],
        // optional callback
        cb);
}

async.series([
  createPlatformsCategories,
  createGames,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('POPULATE DB SUCCESS');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




