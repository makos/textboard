var express = require('express');
var router = express.Router({ mergeParams: true });
const models = require('../models');
const helper = require('../helper/db');

// Check if board exists before every attempt to access it.
router.use('/', function (req, res, next) {
    helper.get_board(req.params.board_name).then(matched_board => {
        if (!matched_board) {
            res.status(404).end();
        } else {
            res.locals.board_id = matched_board.id;
            next();
        }
    });
});

/* GET contents of a board. */
router.get('/', function (req, res, next) {
    helper.get_threads(res.locals.board_id).then(threads => {
        res.json(threads).status(200);
    });
});

// Check validity of incoming POST requests.
router.use('/', function (req, res, next) {
    if (!req.body.title && !req.body.body) {
        console.log("400 Bad Request - no 'title' or 'body' key.");
        res.status(400).end();
    } else if (!req.body.title) {
        req.body.title = "";
        next();
    } else if (req.body.body.length < 1) {
        console.log("400 Bad Request - body is too short.");
        res.status(400).end();
    } else {
        next();
    }
});

/* POST a new thread to board. */
router.post('/', function (req, res, next) {
    models.Thread.create({
        BoardId: res.locals.board_id
    }).then(new_thread => {
        console.log("Created thread ID ", new_thread.id);
        models.Post.create({
            title: req.body.title,
            body: req.body.body,
            ThreadId: new_thread.id
        }).then(new_post => {
            console.log("Created new post ID ", new_post.id);
        }).catch(err => {
            console.log("Error creating post: ", err);
            res.status(500).end();
        });
    }).catch(err => {
        console.log("Error creating thread: ", err);
        res.status(500).end();
    });
    res.status(201).end();
});

module.exports = router;
