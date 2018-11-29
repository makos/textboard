var express = require('express');
var router = express.Router();
const models = require('../models');

/* Helper functions. */
async function get_board(board_name) {
    return await models.Board.findOne({
        where: {
            name: board_name
        }
    });
}

async function get_posts(thread_id) {
    return await models.Post.findAll({
        where: {
            ThreadId: thread_id
        }
    });
}

async function get_threads(board_id) {
    return await models.Thread.findAll({
        where: {
            BoardId: board_id
        }
    });
}

/* GET list of boards - index. */
router.get('/', function (req, res, next) {
    models.Board.findAll().then(boards => {
        res.json(boards).status(200);
    });
});

// Check if board exists before every attempt to access it.
router.use('/:board_name', function (req, res, next) {
    get_board(req.params.board_name).then(matched_board => {
        if (!matched_board) {
            res.status(404).end();
        } else {
            res.locals.board_id = matched_board.id;
            next();
        }
    });
});

/* GET contents of a board. */
router.get('/:board_name', function (req, res, next) {
    get_threads(res.locals.board_id).then(threads => {
        res.json(threads).status(200);
    });
});

// Check if thread exists before any attempt to access it.
router.use('/:board_name/:thread_id', function (req, res, next) {
    get_threads(res.locals.board_id).then(threads => {
        if (req.params.thread_id > threads.length) {
            console.log("404 Not Found - thread ID " +
                req.params.thread_id +
                " not found.");
            res.status(404).end();
        } else {
            next();
        }
    })
});

/* GET contents of a thread. */
router.get('/:board_name/:thread_id', function (req, res, next) {
    get_posts(req.params.thread_id).then(posts => {
        res.json(posts).status(200);
    })
});

/* Try to POST to index page - receive 400 Bad Request error. */
router.post('/', function (req, res, next) {
    console.log("400 Bad Request - trying to POST to index page.");
    res.status(400).end();
});

// Check validity of incoming POST requests.
router.use('/:board_name', function (req, res, next) {
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
router.post('/:board_name', function (req, res, next) {
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

/* POST a reply to existing thread. */
router.post('/:board_name/:thread_id', function (req, res, next) {
    models.Thread.findOne({
        attributes: ["id"],
        where: {
            id: req.params.thread_id
        }
    }).then(thread_id => {
        models.Post.create({
            title: req.body.title,
            body: req.body.body,
            ThreadId: thread_id.id
        }).then(new_post => {
            console.log("Created new post ID ", new_post.id);
        }).catch(err => {
            console.log("Error creating post: ", err);
            res.status(500).end();
        });
    }).catch(err => {
        console.log("Error finding thread. ", err);
        res.status(500).end();
    });
    res.status(201).end();
});

module.exports = router;
