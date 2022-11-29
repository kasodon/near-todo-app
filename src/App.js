import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "./App.scss";
import logo from "./logo.svg";
import del from "./delete.svg";

function App({ isSignedIn, contractId, wallet }) {
  const [todos, setTodos] = useState();
  const [title, setTitle] = useState("");
  const [task, setTask] = useState("");
  const [deadline, setDeadline] = useState("");
  const [account, setAccount] = useState([]);
  const accountId = wallet.accountId;

  // converting NEAR date to human-readable date
  function formatDate(a) {
    const date = new Date(parseInt(a));
    return date.toLocaleDateString();
  }

  // converting NEAR blockchainTimestamp to human-readable date
  function formatDateCreated(a) {
    const string = String(a).slice(0, 13);
    const date = new Date(parseInt(string));
    return date.toLocaleDateString();
  }

  // Get todos array on page reload
  useEffect(() => {
    getTodo()
      .then(setTodos)
      .catch(alert)
      .finally(() => {});
  }, []);

  // Get smart contract account details on page reload
  useEffect(() => {
    getAccount()
      .then(setAccount)
      .catch(alert)
      .finally(() => {});
  }, []);

  // Get todo function
  async function getTodo() {
    // use the wallet to query the contract's
    const todo = await wallet.viewMethod({ method: "getTodo", contractId });
    return todo;
  }

  // Get smart contract account details function
  async function getAccount() {
    // use the wallet to query the contract's
    const account = await wallet.accountMethod({ contractId });
    return account;
  }

  // Create a task function
  function createTodo(e) {
    e.preventDefault();
    const date = new Date(deadline);
    const parsedDate = Date.parse(date);
    // use the wallet to send the greeting to the contract
    wallet
      .callMethod({
        method: "addTodo",
        args: { title: title, task: task, deadline: parsedDate },
        contractId,
      })
      .then(async () => {
        return getTodo();
      })
      .then(setTodos)
      .then(async () => {
        return getAccount();
      })
      .then(setAccount)
      .finally(() => {
        toast("Task Created Successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  }

  // Delete a task function
  function deleteTodo(index, e) {
    e.preventDefault();
    // use the wallet to send the greeting to the contract
    wallet
      .callMethod({ method: "deleteTodo", args: { id: index }, contractId })
      .then(async () => {
        return getTodo();
      })
      .then(setTodos)
      .then(async () => {
        return getAccount();
      })
      .then(setAccount)
      .finally(() => {
        toast("Task Deleted Successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  }

  return (
    <div className="App">
      <header>
        <div className="logo">
          <span>
            <img src={logo} alt="near logo" />
            <p>ToDo App</p>
          </span>
        </div>
        <div className="auth_btn">
          {!isSignedIn ? (
            <button onClick={() => wallet.signIn()}>
              Sign in with NEAR Wallet
            </button>
          ) : (
            <button onClick={() => wallet.signOut()}>
              Sign Out {accountId}
            </button>
          )}
        </div>
      </header>
      <>
        {" "}
        {isSignedIn ? (
          <>
            <div className="count">
              <div className="count_single tasks">
                <h1>{todos?.length || 0}</h1>
                <p>total tasks</p>
              </div>
              <div className="count_single storage">
                <h1>{account[1] || 0}</h1>
                <p>storage used</p>
              </div>
              <div className="count_single balance">
                <h1>{account[0] || 0} Ⓝ</h1>
                <p>account balance</p>
              </div>
            </div>
            <main>
              <form onSubmit={createTodo}>
                <span>
                  <label>
                    Title:
                    <input
                      type="text"
                      name="title"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </label>
                  <label>
                    Task:
                    <input
                      type="text"
                      name="task"
                      onChange={(e) => setTask(e.target.value)}
                    />
                  </label>
                  <label>
                    Deadline:
                    <input
                      type="date"
                      name="date"
                      onChange={(e) => setDeadline(e.target.value)}
                    />
                  </label>
                </span>
                <input type="submit" value="Create Task" />
              </form>
              <div className="todo_list">
                <h3>Tasks Created</h3>
                <div className="list">
                  {todos?.map((todo, index) => (
                    <div className="list_single" key={index}>
                      <button onClick={(e) => deleteTodo(index, e)}>
                        <img src={del} alt="near delete icon" />
                      </button>
                      <h4 className="title">{todo.title}</h4>
                      <p className="task">{todo.task}</p>
                      <p className="created">
                        Created on: {formatDateCreated(todo.timeCreated)}
                      </p>
                      <p className="timer">
                        Deadline: {formatDate(todo.deadline)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </>
        ) : (
          <>
            <div className="intro">
              <h4>
                Voila! A TODO app built on NEAR! This app will teach you how to
                work with Array data collection type on NEAR blockchain, make
                contracts calls and more. Check it out:
              </h4>
              <ol>
                <li>
                  Look in <code>App.js</code> - you'll see various methods being
                  called on <code>contract</code>. What's this?
                </li>
                <li>
                  Ultimately, this <code>contract</code> code is defined in{" "}
                  <code>./contract</code> – this is the source code for your{" "}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://docs.near.org/docs/develop/contracts/overview"
                  >
                    smart contract
                  </a>
                  .
                </li>
                <li>
                  When you run <code>npm run build</code>, the code in{" "}
                  <code>./contract/src/index</code> gets compiled to WASM. You
                  can see how this happens by looking in{" "}
                  <code>package.json</code> and <code>./contract/build.sh</code>
                  .
                </li>
                <li>
                  When you run <code>npm run deploy</code>, the code in{" "}
                  <code>./contract</code> gets deployed to the NEAR testnet. You
                  can see how this happens by looking in{" "}
                  <code>package.json</code> and{" "}
                  <code>./contract/deploy.sh</code>.
                </li>
              </ol>
              <hr />
              <p>
                To keep learning, check out{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://docs.near.org"
                >
                  the NEAR docs
                </a>{" "}
                or look through some{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://examples.near.org"
                >
                  example apps
                </a>
                . Sign In to create a task.
              </p>
            </div>
          </>
        )}
      </>
      <ToastContainer />
    </div>
  );
}

export default App;
