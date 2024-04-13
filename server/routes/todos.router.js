// pull in the express module to handle routing with express
const express = require('express');
// pull in the pool module to communicate with the database
const pool = require('../modules/pool');

// rename the Router function to router
const router = express.Router();

/**
 * GET route for getting todos from the database
 */
router.get('/', (req, res) => {
    console.log('trying to get the todos!!');
    sqlText = `
        SELECT  * FROM todos
            ORDER BY id;
    `;
    pool.query(sqlText)
    .then((dbResult) => {
        let todos = dbResult.rows;
        console.log('successful GET just got:', todos);
        res.send(todos);
    })
    .catch((error) => {
        console.log('Whoa...server error with error:', error);
        res.sendStatus(500);
    })
});

/**
 * POST route for adding a todo to the database
 */
router.post('/:todo_id', (req, res) => {
    console.log('trying to get the todos!!');
    sqlText = `
        INSERT INTO todos
            (text)
            VALUES ($1);
    `;
    pool.query(sqlText, [todo_id])
    .then((res) => {
        console.log('successful POST, inserted a row!');
        res.sendStatus(201);
    })
    .catch((error) => {
        console.log('Whoa...server error with error:', error);
        res.sendStatus(500);
    })
});

/**
 * PUT route for updating a todo item to mark it as completed
 */
router.put('/:todo_id', (req, res) => {
    console.log('updating a todo!!');
    sqlText = `
        UPDATE todos
            SET isComplete = TRUE
            WHERE id = $1;
    `;
    pool.query(sqlText, [todo_id])
    .then((res) => {
        console.log('successful PUT, completed a todo task:');
        res.sendStatus(200);
    })
    .catch((error) => {
        console.log('Whoa...server error with error:', error);
        res.sendStatus(500);
    })
});

/**
 * DELETE route to delete a single todo item
 */
router.delete('/:todo_id', (req, res) => {
    console.log('delete a todo!!');
    sqlText = `
        DELETE FROM todos
            WHERE id = $1;
    `;
    pool.query(sqlText, [todo_id])
    .then((res) => {
        console.log('successful DELETE, deleted a todo task:');
        res.sendStatus(200);
    })
    .catch((error) => {
        console.log('Whoa...server error with error:', error);
        res.sendStatus(500);
    })
});

// export the router so we can import it into server.js
module.exports = router;
