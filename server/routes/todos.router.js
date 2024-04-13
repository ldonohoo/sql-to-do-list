// pull in the express module to handle routing with express
const express = require('express');
// pull in the pool module to communicate with the database
const pool = require('../modules/pool');

// rename the Router function to router
const router = express.Router();

/**
 * GET route for getting todos from the database
 *     - RUN an SQL select statement to select all todos from the
 *          todo table
 *     - return the todos object via the response to the client 
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
    .catch((dbErr) => {
        console.log('Whoa...server error in todos GET:', dbErr);
        res.sendStatus(500);
    })
});

/**
 * POST route for adding a todo to the database
 *   - pull the todo to be added from the request.body 
 *   - run an SQL INSERT statement to insert the single todo item
 *          into the todos table
 */
router.post('/', (req, res) => {
    console.log('trying to get the todos!!');
    let text = req.body.text;
    console.log('req.body.text', req.body.text);
    sqlText = `
        INSERT INTO todos
            (text)
            VALUES ($1);
    `;
    pool.query(sqlText, [text])
    // here, res.sendStatus is the express variable, don't overwrite with
    //      .then variable???
    .then((dbRes) => {
        console.log('successful POST, inserted a row!', dbRes);
        res.sendStatus(201);
    })
    .catch((dbErr) => {
        console.log('Whoa...server error in POST for /todos:', dbErr);
        res.sendStatus(500);
    })
});

/**
 * PUT route for updating a todo item to mark it as completed
 *  - read in the todo id from the parameter passed in on the url
 *  - run an SQL UPDATE command to update the completed status for 
 *      the todo item to TRUE
 */
router.put('/:todo_id', (req, res) => {
    let todoId = req.params.todo_id;
    console.log('updating todo #', todoId);
    sqlText = `
        UPDATE todos
            SET "isComplete" = TRUE
            WHERE id = $1;
    `;
    console.log('sqlText:', sqlText);
    pool.query(sqlText, [todoId])
    .then((dbRes) => {
        console.log('successful PUT, completed a todo task:', dbRes);
        res.sendStatus(200);
    })
    .catch((dbErr) => {
        console.log('Whoa...server error in PUT/update in /todos (chg of completed status):', dbErr);
        res.sendStatus(500);
    })
});

/**
 * DELETE route to delete a single todo item
 *  - read in todo id from parameter passed in on the url
 *  - run an SQL DELETE on the todos table
 *      WHERE the id passed in is equal to id
 */
router.delete('/:todo_id', (req, res) => {
    let todoId = req.params.todo_id;
    console.log('delete a todo!!');
    sqlText = `
        DELETE FROM todos
            WHERE id = $1;
    `;
    pool.query(sqlText, [todoId])
    .then((dbRes) => {
        console.log('successful DELETE, deleted a todo task:', dbRes);
        res.sendStatus(200);
    })
    .catch((dbErr) => {
        console.log('Whoa...server error in DELETE of /todos:', dbErr);
        res.sendStatus(500);
    })
});

// export the router so we can import it into server.js
module.exports = router;
