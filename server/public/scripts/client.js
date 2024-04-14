/**
 * Lisa Donohoo
 * Prime Digital Academy
 * Tier II- SQL todo list - BASE version
 */


/**
 * Format the timestamp from SQL into a pretty date
 *      - take SQL generated datetimestamp, convert into javascript Date type
 *      - reformat date into default english US string
 */
function formatDate(dateString) {
    let formattedDate = '';
    if (dateString) {
        // convert SQL datetimestamp (dateString) to javascript date format
        let newDate = new Date(dateString);
        // reformat javascript date format into MM/DD/YYYY (default english US)
        formattedDate = new Intl.DateTimeFormat('en-US').format(newDate);
    }
    return formattedDate;
}

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
    let todoTextElement = document.getElementById('todo-text-input');
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
function toggleCompleteItem(todoId, createTimeStamp) {
    axios({
        method: 'PUT',
        url: `/todos/${todoId}`
    })
    .then(response => {
        console.log('PUT/update item to toggle completed status!', response);
        getTodoItems();
    })
    .catch(error => {
        console.log('Error in PUT/update toggling completed status of item', error);
    })
}

function activateDeleteModal(todoId) {
    console.log('todoid:', todoId);
    saveTodoId = todoId;
    deleteModal.show();
}

/**
 * Delete an item from the todo list
 *  - use axios to issue an HTTP DELETE request to server to delete an
 *      item from the database
 *  - refetch and render screen with getItems()
 * 
 *  (id is passed from the <li> element generated when item is rendered)
 */
function deleteTodoItem() {
    console.log(saveTodoId);
    axios({
        method: 'DELETE',
        url: `/todos/${saveTodoId}`
    })
    .then(response => {
        console.log('Item deleted!', response);
        getTodoItems();
    })
    .catch(error => {
        console.log('Error deleting item', error);
    })
    deleteModal.hide();
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
        //      -else do not add a class to that todo item✔
        checkboxClass = (todo.isComplete) ? 'completed' : '';
        checkboxEmoji = (todo.isComplete) ? '✔️' : '';
        formattedDate = (todo.isComplete) ? 'completed<br>' + formatDate(todo.completedAt) : '';
        HTMLstring = `
        <div id="todo-item"
             class="${checkboxClass}"
             data-testid="toDoItem">
            <button id="check-item-button" 
                    data-testid="completeButton" 
                    onclick="toggleCompleteItem(${todo.id})"
                    class="btn ${checkboxClass}">${checkboxEmoji}
            </button>
            <button type="button"
                    id="delete-item-button" 
                    class="btn btn-danger"
                    onclick="activateDeleteModal(${todo.id})"
                    data-todoid="${todo.id}"
                    data-testid="deleteButton"
                    title="delete this item">X
            </button>
            <span id="todo-text" class="${checkboxClass} background-color2">${todo.text}</span>
            <div id="completed-date" class="background-color1">${formattedDate}</div> 
        </div>
        `;
        todoListElement.innerHTML += HTMLstring;
    }

}
/**
 * Clears the todo textarea for the user
 */
function clearTodoText() {
    // get the todo input box
    let todoTextElement = document.getElementById('todo-text-input');
    todoTextElement.value = ''; 
}

// ------------     MAIN LOGIC   ----------------------------


// define modal for deleting an item (bootstrap modal)
let deleteModal = new bootstrap.Modal(document.getElementById('delete-modal'), {});

// global variable because I can't figure out how in the world to pass a 
//      data attribute through bootstrap modal (!!!)
let saveTodoId = '';

// run a fetch and render on inital page load to see the current todo list items
getTodoItems();






