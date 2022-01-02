import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const HARMONY_MAIN_NETWORK = 1666600000;
const HARMONY_TEST_NETWORK = 1666700000;

class AccountManager {
  constructor() {
    this.connected = false;
    this.busy = false;
    this.web3Provider = null;
    this.web3 = null;
    this.balance = 0;
    this.network = 0;
  }

  async connect() {
    if (!this.connected) {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            infuraId: "https://api.harmony.one", // required
          },
        },
      };

      const web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions, // required
      });

      this.web3Provider = await web3Modal.connect();
      try {
        // Request account access
        this.account = await this.web3Provider.request({
          method: "eth_requestAccounts",
          params: [],
        });
      } catch (error) {
        // User denied account access...
        console.error(`User denied account access: ${error}`);
      }
      this.web3 = new Web3(this.web3Provider);
      this.network = await this.web3.eth.net.getId();
      console.log(this.network);
      if (
        this.network === HARMONY_MAIN_NETWORK ||
        this.network === HARMONY_TEST_NETWORK
      ) {
        this.connected = true;
        console.log(`connected: ${this.account} ${typeof this.account}`);
        return this.account;
      }
    }
  }

  getFormattedBalance(balance, decimals) {
    if (!balance) return "";
    let balance_BN = this.web3.utils.toBN(balance);
    let decimals_BN = this.web3.utils.toBN(10 ** decimals);
    let before_comma = balance_BN.div(decimals_BN).toString();
    let after_comma = balance_BN.mod(decimals_BN).toString();
    after_comma = after_comma.padStart(decimals, "0");
    return before_comma + "." + after_comma + " ONE";
  }

  async getBalance(formatted = true) {
    const decimals = 18;
    this.balance = await this.web3.eth.getBalance(String(this.account));
    this.formatted_balance = this.getFormattedBalance(this.balance, decimals);
    return formatted ? this.formatted_balance : this.balance;
  }

  async getContractBalance() {
    return await this.web3.eth.getBalance(
      String("0xf31822e40957fd71c102a112b53ccc2a4d4a7ec7")
    );
  }
}

export default AccountManager;
