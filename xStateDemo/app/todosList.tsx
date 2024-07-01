import { Todo } from "@/components/Todo";
import { useSyncExternalStore } from "react";
import { createActor } from "xstate";
import { todoMachine } from "../machines/todos/todo/todo";
import { buildTodosMachine } from "../machines/todos/todos";

export default function Page() {
  const todosMachine = buildTodosMachine(todoMachine);

  const todosActor = createActor(todosMachine);

  todosActor.start();

  const todos = useSyncExternalStore(
    (listener) => todosActor.subscribe(listener).unsubscribe,
    () => todosActor.getSnapshot()
  );

  return (
    <div className="app">
      <h2>Todos</h2>
      <form
        className="newTodo"
        onSubmit={(event) => {
          event.preventDefault();
          todosActor.send({
            type: "Add a todo",
          });
        }}
      >
        <input
          value={todos.context.newTodoLabel}
          onChange={(event) =>
            todosActor.send({
              type: "Update new todo's label",
              label: event.target.value,
            })
          }
          placeholder="New todo"
        />
        <button>Add todo</button>
      </form>
      <div className="todosTable">
        {todos.context.todos.map((todo) => {
          return <Todo key={todo.id} todoRef={todo} />;
        })}
      </div>
      <button
        className="toggle"
        onClick={() => {
          todosActor.send({ type: "Disable" });
        }}
      >
        DISABLE
      </button>
    </div>
  );
}
