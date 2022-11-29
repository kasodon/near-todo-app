// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view, Vector } from "near-sdk-js";

@NearBindgen({})
class TodoNear {
  constructor() {
    this.todo = new Vector("a");
  }

  @view({})
  getTodo() {
    return this.todo.toArray();
  }

  @call({})
  deleteTodo({ id }) {
    this.todo.swapRemove(id);
  }

  @call({})
  addTodo({ title, task, deadline }) {
    const id = this.getTodo().length + 1;
    const timeCreated = near.blockTimestamp().toString();
    const object = { id, title, task, deadline, timeCreated };
    this.todo.push(object);
  }

  @call({})
  updateTodo({ index, title, task, deadline, completed }) {
    const id = this.getTodo().length + 1;
    const timeCreated = near.blockTimestamp().toString();
    const object = { id, title, task, deadline, completed, timeCreated };
    this.todo.replace(index, object);
  }
}
