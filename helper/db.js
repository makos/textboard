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

module.exports.get_board = get_board;
module.exports.get_posts = get_posts;
module.exports.get_threads = get_threads;
