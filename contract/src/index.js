"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
// Find all our documentation at https://docs.near.org
var near_sdk_js_1 = require("near-sdk-js");
var model_1 = require("./model");
var TodoNear = /** @class */ (function () {
    function TodoNear() {
        this.todo = new near_sdk_js_1.Vector("a");
    }
    TodoNear.prototype.getTodo = function () {
        return this.todo.toArray();
    };
    TodoNear.prototype.deleteTodo = function (_a) {
        var id = _a.id;
        this.todo.swapRemove(id);
    };
    TodoNear.prototype.addTodo = function (_a) {
        var title = _a.title, task = _a.task, deadline = _a.deadline, completed = _a.completed, accountId = _a.accountId;
        var nearAttachedAmount = near_sdk_js_1.near.attachedDeposit();
        (0, near_sdk_js_1.assert)(nearAttachedAmount >= model_1.TODO_AMOUNT, "Must attach upto 0.1 NEAR");
        var id = this.getTodo().length + 1;
        var timeCreated = near_sdk_js_1.near.blockTimestamp().toString();
        var object = { id: id, title: title, task: task, deadline: deadline, completed: completed, accountId: accountId, timeCreated: timeCreated };
        this.todo.push(object);
    };
    TodoNear.prototype.updateTodo = function (_a) {
        var index = _a.index, title = _a.title, task = _a.task, deadline = _a.deadline, completed = _a.completed, accountId = _a.accountId;
        var id = index + 1;
        var timeCreated = near_sdk_js_1.near.blockTimestamp().toString();
        var object = { id: id, title: title, task: task, deadline: deadline, completed: completed, accountId: accountId, timeCreated: timeCreated };
        this.todo.replace(index, object);
    };
    __decorate([
        (0, near_sdk_js_1.view)({})
    ], TodoNear.prototype, "getTodo");
    __decorate([
        (0, near_sdk_js_1.call)({})
    ], TodoNear.prototype, "deleteTodo");
    __decorate([
        (0, near_sdk_js_1.call)({ payableFunction: true })
    ], TodoNear.prototype, "addTodo");
    __decorate([
        (0, near_sdk_js_1.call)({})
    ], TodoNear.prototype, "updateTodo");
    TodoNear = __decorate([
        (0, near_sdk_js_1.NearBindgen)({})
    ], TodoNear);
    return TodoNear;
}());
