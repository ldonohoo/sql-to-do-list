console.log('JS is sourced!');

function addTodoItem(event) {
    // prevent the default form behavior of clearing form
    event.preventDefault();
    // get the text from the todo input box
    let todoTextElement = document.getElementById('todo-text');
    let todoText = todoTextElement.value;
    // add/POST the todo item to the database
    axios({
        method: 'POST',
        url: '/todos',
        data: {text: todoText}
    })
    .then( response => {
        getTodoItems();
    })
    .catch( error => {
        console.log('Error adding todo Item:', error);
    });
}   

function getTodoItems() {
    axios({
        method: 'GET',
        url: '/get'
    })
    .then( response => {
        let todoItems = response.body;
        renderTodoItems(todoItems);
    })
}


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
    for (todo of todos) {
        HTMLstring = `
            <li data-testid="toDoItem">
                <button data-testid="completeButton" onclick="checkItem(${todo.id})></button>
                <button onclick="uncheckItem(${todo.id})></button>
                

            </li>
            `



    }



}







// run a fetch and render to see the current todo list items
getTodoItems();