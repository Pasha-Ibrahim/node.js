const endpoint = "https://dummyjson.com/todos";

const todos = document.getElementById("todos");
axios.get(endpoint).then((res) => {
  if (res.status === 200) {
    localStorage.setItem("todos", JSON.stringify(res.data));
    renderTodos();
  }
});

function renderTodos() {
  const allTodos = localStorage.getItem("todos");
  todos.innerHTML = "";

  JSON.parse(allTodos).todos.forEach((todo) => {
    todos.innerHTML += `<div class="todo">
     <h2> ${todo.todo}<button onclick="deleteTodo(${todo.id})">Delete</button></h2>
 </div>`;
  });
}

function deleteTodo(bd) {
  const allTodos = JSON.parse(localStorage.getItem("todos"));
  allTodos.todos = allTodos.todos.filter((todo) => todo.id !== bd);
  localStorage.setItem("todos", JSON.stringify(allTodos));
  renderTodos();
}
