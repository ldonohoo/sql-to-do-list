/**
 * Lisa Donohoo
 * Prime Digital Academy
 * Tier II- SQL todo list - BASE version
 */

/**
 * Add a todo item to the todo list
 *  - get todo text from the input box on the screen
 *  - use axios to issue a HTTP POST request to the server in order
 *      to add an item to our database
 */
function addTodoItem(event) {
    // prevent the default form behavior of clearing form
    event.preventDefault();
    // get the text from the todo input box
    let todoTextElement = document.getElementById('todo-text');
    let todoText = todoTextElement.value;
    // add/POST the todo item to the database
    console.log('todoText:', todoText)
    axios({
        method: 'POST',
        url: '/todos',
        data: {text: todoText}
    })
    .then((response) => {
        // clear out input field on successful POST
        todoTextElement.value = '';
        // then fetch and render todo items
        getTodoItems();
    })
    .catch((error) => {
        console.log('Error adding todo Item:', error);
    });
}   

/**
 * Get todo items from database and re-render the screen
 *  - use axios to issue a HTTP GET request to the server in order
 *      to get the current todo items from the database
 *  - call renderTodoItems() to clear and redraw the current todo list
 */
function getTodoItems() {
    console.log('getting todo items:');
    axios({
        method: 'GET',
        url: '/todos'
    })
    .then((response) => {
        let todoItems = response.data;
        console.log('response.data', response.data);
        renderTodoItems(todoItems);
    })
    .catch((error) => {
        console.log('There was an error in the HTTP GET request:', error);
    })
}

/** 
 * Complete an item on the todo list
 *  - use axios to issue an HTTP PUT request to server to update the completed
 *      status of an item in the database
 *  - refetch and render screen with getItems()
 * 
 *  (id is passed from the <li> element generated when item is rendered)
 */
function completeItem(todoId) {
    axios({
        method: 'PUT',
        url: `/todos/${todoId}`
    })
    .then(response => {
        console.log('PUT/update of item to completed sucessful!', response);
        getTodoItems();
    })
    .catch(error => {
        console.log('Error in PUT/update completing item', error);
    })
}

/**
 * Delete an item from the todo list
 *  - use axios to issue an HTTP DELETE request to server to delete an
 *      item from the database
 *  - refetch and render screen with getItems()
 * 
 *  (id is passed from the <li> element generated when item is rendered)
 */
function deleteItem(todoId) {
    axios({
        method: 'DELETE',
        url: `/todos/${todoId}`
    })
    .then(response => {
        console.log('Item deleted!', response);
        getTodoItems();
    })
    .catch(error => {
        console.log('Error deleting item', error);
    })
}

/**
 * Clears the todo list displayed on the screen and re-renders
 *      it from the todo list data just pulled by getItems()
 *      - this function also adds button functionality to
 *        the current HTML/dom:
 *          - complete button added to each item
 *          - delete button added to each item
 */
function renderTodoItems(todoItems) {
    // check for empty list
    if (todoItems.length < 1) {
        // if no todo items, end render function
        return;
    }
    // get element to put todos into
    let todoListElement = document.getElementById('todo-list');
    // clear out the todo list
    todoListElement.innerHTML = '';
    let HTMLstring = '';
    let checkboxClass = '';
    // go through each todo in 'todoItems' to build our todo list
    for (todo of todoItems) {
        // if item is completed, add 'completed' to the class list for that item
        //      -else do not add a class to that todo item
        checkboxClass = (todo.isComplete) ? 'completed' : 'not-completed';
        checkboxEmoji = (todo.isComplete) ? '✔' : '';
        HTMLstring = `
            <li id="todo-item"
                class="${checkboxClass}"
                data-testid="toDoItem">
                <button id="check-item-button" 
                        data-testid="completeButton" 
                        onclick="completeItem(${todo.id})"
                        class="${checkboxClass}">${checkboxEmoji}
                </button>
                ${todo.text}
                <button id="delete-item-button" 
                         data-testid="deleteButton"
                         onclick="deleteItem(${todo.id})">delete
                </button>                                  
            </li>
            `
        todoListElement.innerHTML += HTMLstring;
    }
}


// ------------     MAIN LOGIC   ----------------------------

// run a fetch and render on inital page load to see the current todo list items
getTodoItems();