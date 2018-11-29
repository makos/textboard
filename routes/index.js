var express = require('express');
var router = express.Router();
const models = require('../models');

/* GET list of boards - index. */
router.get('/', function (req, res, next) {
    models.Board.findAll().then(boards => {
        res.json(boards).status(200);
    });
});

/* Try to POST to index page - receive 400 Bad Request error. */
router.post('/', function (req, res, next) {
    console.log("400 Bad Request - trying to POST to index page.");
    res.status(400).end();
});

module.exports = router;
