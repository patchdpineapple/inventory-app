var Platform = require('../models/platform');

// Display list of all platforms.
exports.platform_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Platform list');
};

// Display detail page for a specific platform.
exports.platform_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Platform detail: ' + req.params.id);
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
