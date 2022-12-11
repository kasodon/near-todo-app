// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, view, Vector, assert } from "near-sdk-js";
import { addTodo, updateTodo, TODO_AMOUNT } from './model';

@NearBindgen({})
class TodoNear {
  contract: string = "todolist.testnet";
  todo;

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

  @call({ payableFunction: true })
  addTodo({ title, task, deadline, completed, accountId }: addTodo) {
    const nearAttachedAmount: bigint = near.attachedDeposit() as bigint;
    let toTransfer = nearAttachedAmount;
    assert(nearAttachedAmount >= TODO_AMOUNT, "Must attach upto 0.1 NEAR");
    const id = this.getTodo().length + 1;
    const timeCreated = near.blockTimestamp().toString();
    const object = { id, title, task, deadline, completed, accountId, timeCreated };
    this.todo.push(object);
    const promise = near.promiseBatchCreate(this.contract);
    near.promiseBatchActionTransfer(promise, toTransfer);
  }

  @call({})
  updateTodo({ index, title, task, deadline, completed, accountId }: updateTodo) {
    const id = index + 1;
    const timeCreated = near.blockTimestamp().toString();
    const object = { id, title, task, deadline, completed, accountId, timeCreated };
    this.todo.replace(index, object);
  }
}
