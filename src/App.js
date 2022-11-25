import { useEffect } from 'react';
import './App.scss';
import logo from './logo.svg';
import del from './delete.svg';
import { Wallet } from './near-wallet';
const CONTRACT_ADDRESS = "app.fezzy.testnet";
const wallet = new Wallet({ createAccessKeyFor: CONTRACT_ADDRESS });
const isSignedIn = wallet.startUp();

function App() {
    useEffect(() => {
        return isSignedIn
    })
  return (
    <div className="App">
        <header>
            <div className="logo"><span><img src={logo} alt="near logo" /><p>ToDo App</p></span></div>
            <div className="auth_btn">
                <button>Sign in with NEAR Wallet</button>
                <button>Sign Out</button>
            </div>
        </header>
        <div className="count">
            <div className="count_single tasks">
                <h1>2</h1>
                <p>total tasks</p>
            </div>
            <div className="count_single storage">
                <h1>500kb</h1>
                <p>storage used</p>
            </div>
            <div className="count_single balance">
                <h1>1000</h1>
                <p>account balance</p>
            </div>
        </div>
        <main>
            <form>
                <span>
                    <label>
    Title:
                        <input type="text" name="title" />
  </label>
                    <label>
    Task:
                        <input type="text" name="task" />
  </label>
                    <label>
    Deadline:
                        <input type="date" name="date" />
  </label>
                </span>
                <input type="submit" value="Create Task" />
            </form>
            <div className="todo_list">
                <h3>Tasks Created:</h3>
                <div className="list">
                    <div className="list_single">
                        <button><img src={del} alt="near delete icon" />
                        </button>
                        <h4 className="title">Clean Room</h4>
                        <p className="task">go clean the room and do some serious laundry. go clean the room and do some serious laundry. go clean the room and do some serious laundry.</p>
                        <p className="created">Created on: 20/11/2034</p>
                        <p className="timer">Timer</p>
                    </div>
                </div>
            </div>
        </main>
    </div>
  );
}

export default App;
