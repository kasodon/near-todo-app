import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.scss";
import "react-toastify/dist/ReactToastify.css";
import { Wallet } from "./near-wallet";
const CONTRACT_ADDRESS = "cra-todolist.testnet"; // Your smart contract accountId
const wallet = new Wallet({ createAccessKeyFor: CONTRACT_ADDRESS });

const root = ReactDOM.createRoot(document.getElementById("root"));

window.onload = async () => {
  const isSignedIn = await wallet.startUp();
  root.render(
    <React.StrictMode>
      <App
        isSignedIn={isSignedIn}
        contractId={CONTRACT_ADDRESS}
        wallet={wallet}
      />
    </React.StrictMode>
  );
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
