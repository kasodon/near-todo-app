import { NEAR, Worker } from "near-workspaces";
import test from "ava";

test.beforeEach(async (t) => {
  // Init the worker and start a Sandbox server
  const worker = await Worker.init();

  // Prepare sandbox for tests, create accounts, deploy contracts, etx.
  const root = worker.rootAccount;

  // Deploy the contracts
  const test = await root.createSubAccount("test");
  await test.deploy("./build/contract.wasm");

  // Create test accounts
  const alice = await root.createSubAccount("alice");
  const bob = await root.createSubAccount("bob");

  // Save state for test runs, it is unique for each test
  t.context.worker = worker;
  t.context.accounts = { root, test, alice, bob };
});

test.afterEach.always(async (t) => {
  await t.context.worker.tearDown().catch((error) => {
    console.log("Failed tear down the worker:", error);
  });
});

test("should save todo list object and return object on view method", async (t) => {
  const { test, alice } = t.context.accounts;

  // Call the contract method
  await alice.call(test, "addTodo", { title: "deploy contract", task: "build a Defi project on near", deadline: 1669699272000, completed: false, accountId: alice });

  // Call the contract view method
  const result = await test.view("getTodo");

  // Check the result
  t.deepEqual(result[0].id, 1);
});
