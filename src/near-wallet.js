// near api js
import { providers, utils } from "near-api-js";

// wallet selector UI
import "@near-wallet-selector/modal-ui/styles.css";
import { setupModal } from "@near-wallet-selector/modal-ui";
import LedgerIconUrl from "@near-wallet-selector/ledger/assets/ledger-icon.png";
import MyNearIconUrl from "@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png";

// wallet selector options
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";

import { Buffer } from "buffer/index";
window.Buffer = Buffer;

const THIRTY_TGAS = "30000000000000";
const TODO_AMOUNT = "100000000000000000000000";
const NO_DEPOSIT = "0";

// Wallet that simplifies using the wallet selector
export class Wallet {
  walletSelector;
  wallet;
  network;
  createAccessKeyFor;

  constructor({ createAccessKeyFor = undefined, network = "testnet" }) {
    // Login to a wallet passing a contractId will create a local
    // key, so the user skips signing non-payable transactions.
    // Omitting the accountId will result in the user being
    // asked to sign all transactions.
    this.createAccessKeyFor = createAccessKeyFor;
    this.network = "testnet";
  }

  // To be called when the website loads
  async startUp() {
    this.walletSelector = await setupWalletSelector({
      network: this.network,
      modules: [
        setupMyNearWallet({ iconUrl: MyNearIconUrl }),
        setupLedger({ iconUrl: LedgerIconUrl }),
      ],
    });

    const isSignedIn = this.walletSelector.isSignedIn();

    if (isSignedIn) {
      this.wallet = await this.walletSelector.wallet();
      this.accountId =
        this.walletSelector.store.getState().accounts[0].accountId;
    }

    return isSignedIn;
  }

  // Sign-in method
  signIn() {
    const description = "Please select a wallet to sign in.";
    const modal = setupModal(this.walletSelector, {
      contractId: this.createAccessKeyFor,
      description,
    });
    modal.show();
  }

  // Sign-out method
  signOut() {
    this.wallet.signOut();
    this.wallet = this.accountId = this.createAccessKeyFor = null;
    window.location.replace(window.location.origin + window.location.pathname);
  }

  // Make a read-only call to retrieve information from the network
  async viewMethod({ contractId, method, args = {} }) {
    const { network } = this.walletSelector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    let res = await provider.query({
      request_type: "call_function",
      account_id: contractId,
      method_name: method,
      args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
      finality: "optimistic",
    });
    return JSON.parse(Buffer.from(res?.result).toString());
  }

  // Make a read-only call to retrieve information from the network
  async accountMethod({ contractId }) {
    const { network } = this.walletSelector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    let res = await provider.query({
      request_type: "view_account",
      account_id: contractId,
      finality: "optimistic",
    });

    let acct = [];

    const data = Object.entries(res);
    acct.push(this.formatAmount(data[0][1]));
    acct.push(this.formatNearBytes(data[6][1]));
    return acct;
  }

  // Call a method that changes the contract's state
  async callMethod({
    contractId,
    method,
    args = {},
    gas = THIRTY_TGAS,
    deposit = NO_DEPOSIT,
  }) {
    // Sign a transaction with the "FunctionCall" action
    const outcome = await this.wallet.signAndSendTransaction({
      signerId: this.accountId,
      receiverId: contractId,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: method,
            args,
            gas,
            deposit,
          },
        },
      ],
    });

    return providers.getTransactionLastResult(outcome);
  }

  // Call a method that changes the contract's state
  async createMethod({ contractId, method, args = {}, gas = THIRTY_TGAS, deposit = TODO_AMOUNT }) {
    // Sign a transaction with the "FunctionCall" action
    const outcome = await this.wallet.signAndSendTransaction({
      signerId: this.accountId,
      receiverId: contractId,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: method,
            args,
            gas,
            deposit,
          },
        },
      ],
    });

    return providers.getTransactionLastResult(outcome);
  }

  // Format amount from Yocto near to NEAR
  formatAmount(amount) {
    let formatted = amount.toLocaleString("fullwide", { useGrouping: false });
    formatted = utils.format.formatNearAmount(formatted);
    return Math.floor(formatted * 100) / 100;
  }

  // Format storage bytes to human-readable num
  formatNearBytes(b) {
    const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    let l = 0,
      n = parseInt(b, 10) || 0;

    while (n >= 1024 && ++l) {
      n = n / 1024;
    }

    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
  }
}
