import logo from "./logo.svg";
import "./App.css";
import LoadButton from "./LoadButton";
import AppExplanations from "./AppExplanations";
import AccountManager from "./controller/accountManager";
import faucetClaim from "./controller/faucet";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "react-global-configuration";
import configuration from "./config.json";
import HCaptcha from "@hcaptcha/react-hcaptcha";

config.set(configuration);

const accountManager = new AccountManager();

function App() {
  const [account, setAccount] = useState("Not connected");
  const [balance, setBalance] = useState(0);
  const [remainingDonations, setRemainingDonations] = useState(0);
  const [givenDonationsToday, setGivenDonationsToday] = useState(0);

  const [distributorBalance, setDistributorBalance] = useState(0);
  const [contractBalance, setContractBalance] = useState(0);

  const [txLink, setTxLink] = useState("");
  const [captcha, setCaptcha] = useState("");

  return (
    <div className="App">
      <ToastContainer hideProgressBar={true} />
      <div className="App-banner">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="App-title">Harmony Faucet</p>
      </div>
      <header className="App-header">
        <div className="Commands">
          <LoadButton
            text="Connect"
            loadingText="Loading..."
            color="#00AEE9"
            hidden={account !== "Not connected"}
            onClick={() =>
              accountManager.connect().then((account) => {
                if (!account) {
                  toast.error(
                    `Wrong network: Please select ONE/Harmony network first`
                  );
                } else {
                  setAccount(account);
                  accountManager.getBalance(false).then((balance) => {
                    setBalance(balance);
                  });
                  accountManager
                    .getNumberOfDonationsRemaining()
                    .then((donations) => {
                      setRemainingDonations(donations);
                    });

                  accountManager
                    .getNumberOfDonationsToday()
                    .then((donations) => {
                      setGivenDonationsToday(donations);
                    });

                  accountManager.getContractBalance().then((balance) => {
                    setContractBalance(balance);
                  });
                  accountManager.getDistributorBalance().then((balance) => {
                    setDistributorBalance(balance);
                  });
                }
              })
            }
          />
          <LoadButton
            text={
              Number(balance) >= config.get("maxAmount")
                ? "Balance too high"
                : remainingDonations < 1
                ? "No donations left"
                : "Receive"
            }
            loadingText="Sending..."
            color="#00AEE9"
            disabled={
              Number(balance) >= config.get("maxAmount") || captcha === ""
            }
            hidden={account === "Not connected"}
            onClick={() =>
              faucetClaim(account, captcha)
                .then((response) => {
                  console.log(response);
                  if (response.data.statusCode === 200) {
                    toast.success("Transaction sent!");
                    setTxLink(response.data.hash);
                    accountManager.getBalance(false).then((balance) => {
                      setBalance(balance);
                    });

                    setCaptcha("");
                  } else {
                    toast.error(
                      "Transaction failed!" +
                        JSON.parse(response.data.body).errorMessage
                    );
                  }
                })
                .catch((error) => {
                  toast.error(`${error.response.data.err.message} 🙅`);
                })
            }
          />
        </div>
        <form id="receive" action="" method="POST">
          <HCaptcha
            theme="light"
            sitekey={config.get("hcaptchasitekey")}
            onVerify={(token, ekey) => {
              setCaptcha(token);
            }}
          />
        </form>

        <p hidden={account === "Not connected"}>
          {"Your Wallet address : " + account}
        </p>
        <p hidden={account === "Not connected"}>
          {"Your balance: " +
            String(accountManager.getFormattedBalance(balance, 18))}
        </p>
        <p hidden={account === "Not connected"}>
          {"There are " +
            String(remainingDonations) +
            " donations left for today"}
          {remainingDonations < 1
            ? ", try again tomorrow or ask for donations"
            : ""}
        </p>

        <p hidden={account === "Not connected"}>
          {"Today harmony.supply donated " +
            String(accountManager.getFormattedBalance(givenDonationsToday, 18))}
        </p>

        <a
          hidden={txLink === ""}
          target="_blank"
          rel="noopener noreferrer"
          href={txLink}
        >
          {txLink}
        </a>
        <br/>
        <AppExplanations></AppExplanations>
        <div className="App-footer">
          <div>
            <a href="https://discord.gg/sGcXqMNZ">
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 448 512"
                height="50px"
                width="50px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M297.216 243.2c0 15.616-11.52 28.416-26.112 28.416-14.336 0-26.112-12.8-26.112-28.416s11.52-28.416 26.112-28.416c14.592 0 26.112 12.8 26.112 28.416zm-119.552-28.416c-14.592 0-26.112 12.8-26.112 28.416s11.776 28.416 26.112 28.416c14.592 0 26.112-12.8 26.112-28.416.256-15.616-11.52-28.416-26.112-28.416zM448 52.736V512c-64.494-56.994-43.868-38.128-118.784-107.776l13.568 47.36H52.48C23.552 451.584 0 428.032 0 398.848V52.736C0 23.552 23.552 0 52.48 0h343.04C424.448 0 448 23.552 448 52.736zm-72.96 242.688c0-82.432-36.864-149.248-36.864-149.248-36.864-27.648-71.936-26.88-71.936-26.88l-3.584 4.096c43.52 13.312 63.744 32.512 63.744 32.512-60.811-33.329-132.244-33.335-191.232-7.424-9.472 4.352-15.104 7.424-15.104 7.424s21.248-20.224 67.328-33.536l-2.56-3.072s-35.072-.768-71.936 26.88c0 0-36.864 66.816-36.864 149.248 0 0 21.504 37.12 78.08 38.912 0 0 9.472-11.52 17.152-21.248-32.512-9.728-44.8-30.208-44.8-30.208 3.766 2.636 9.976 6.053 10.496 6.4 43.21 24.198 104.588 32.126 159.744 8.96 8.96-3.328 18.944-8.192 29.44-15.104 0 0-12.8 20.992-46.336 30.464 7.68 9.728 16.896 20.736 16.896 20.736 56.576-1.792 78.336-38.912 78.336-38.912z"></path>
              </svg>
            </a>
          </div>
          <p>
            A modest Web App built by{" "}
            <a
              href="https://github.com/dietbald"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dietbald
            </a>{" "}
            with React, hosted on Github.
            <a href="https://github.com/dietbald/harmony-supply/">
              PRs welcomed and appreciated ✨
            </a>
          </p>
          <p>
            Harmony donation:
            <a
              h
              href="https://explorer.harmony.one/address/0xf31822e40957fd71c102a112b53ccc2a4d4a7ec7"
              target="_blanc"
              rel="noopener noreferrer"
            >
              0xf31822e40957fd71c102a112b53ccc2a4d4a7ec7
            </a>
          </p>

          <p hidden={account === "Not connected"}>
            {"Available in faucet balance: " +
              String(accountManager.getFormattedBalance(contractBalance, 18))}
          </p>

          <p hidden={account === "Not connected"}>
            {"Available in distributor balance: " +
              String(
                accountManager.getFormattedBalance(distributorBalance, 18)
              )}
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;
