var express = require('express');
var router = express.Router({ mergeParams: true });
const models = require('../models');
const helper = require('../helper/db');

// Check if thread exists before any attempt to access it.
router.use('/', function (req, res, next) {
    helper.get_threads(res.locals.board_id).then(threads => {
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
router.get('/', function (req, res, next) {
    helper.get_posts(req.params.thread_id).then(posts => {
        res.json(posts).status(200);
    })
});

/* POST a reply to existing thread. */
router.post('/', function (req, res, next) {
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
