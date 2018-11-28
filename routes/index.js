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

/* GET contents of a board. */
router.get('/:board_name', function (req, res, next) {
    get_board(req.params.board_name).then(matched_board => {
        if (!matched_board) {
            res.status(404).end();
        } else {
            get_threads(matched_board.id).then(threads => {
                res.json(threads).status(200);
            });
        }
    });
});

/* GET contents of a thread. */
router.get('/:board_name/:thread_id', function (req, res, next) {
    get_board(req.params.board_name).then(matched_board => {
        if (!matched_board) {
            res.status(404).end();
        } else {
            get_posts(req.params.thread_id).then(posts => {
                res.json(posts).status(200);
            })
        }
    })
});

/* Try to POST to index page - receive 400 Bad Request error. */
router.post('/', function (req, res, next) {
    res.status(400).end();
});

/* POST a new thread to board. */
router.post('/:board', function (req, res, next) {
})

module.exports = router;
