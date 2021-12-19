import logo from "./logo.svg";
import "./App.css";
import packageJson from "../package.json";
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
                }
              })
            }
          />
          <LoadButton
            text={
              Number(balance) >= config.get("maxAmount")
                ? "Balance too high"
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
        <p hidden={account === "Not connected"}>{account}</p>
        <p hidden={account === "Not connected"}>
          {"Your balance: " +
            String(accountManager.getFormattedBalance(balance, 18))}
        </p>
        <a
          hidden={txLink === ""}
          target="_blank"
          rel="noopener noreferrer"
          href={txLink}
        >
          {txLink}
        </a>
        <br></br>
        <AppExplanations></AppExplanations>
        <div className="App-footer">
          <p>
            A modest Web App built by{" "}
            <a
              href="https://github.com/dietbald"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dietbald
            </a>{" "}
            with React, hosted on Github. v{`${packageJson.version}`}.{" "}
            <a href="https://github.com/dietbald/harmony-supply/">
              PRs welcomed and appreciated ✨
            </a>
          </p>
          <p>
            Ethereum/Harmony donation: TODO{" "}
            <a
              h
              href="https://explorer.harmony.one/address/0x1dab45eebadb42712b91c7b6b1454cc805b682eb"
              target="_blanc"
              rel="noopener noreferrer"
            >
              0x1dab45EEBADb42712B91C7B6B1454cC805b682EB
            </a>
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;
