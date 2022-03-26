import logo from "./components/logos/logo.svg";
import "./App.css";
import LoadButton from "./components/LoadButton";
import AppExplanations from "./components/AppExplanations";
import AccountManager from "./components/controller/accountManager";
import faucetClaim from "./components/controller/faucet";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "react-global-configuration";
import configuration from "./config.json";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import Particles from "react-tsparticles";
import particlesConfig from './components/ConfigParticles/particlesConfig';
import intrepid from "./components/logos/intrepidlogo.png";
import dietbald from "./components/logos/dietbaldlogo.png";
import harmony from "./components/logos/harmonylogo.png";





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
      <div style={{ position: 'absolute'}}>
        <Particles 
        params={particlesConfig} />
      </div>
      <ToastContainer hideProgressBar={true} />
      <div className="App-banner">
        <img src={logo} width="300" height="300" className="App-logo" alt="logo" />
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
                ? "High Balance"
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
            theme="dark"
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
          
            <a 
            href="https://staking.harmony.one/validators/mainnet/one1rfzf38ymc447qhmgrhcglewctl5nj9u6q6syjk"
              target="_blank"
              rel="noopener noreferrer">
              <img src={intrepid} className="intrepidLogo" alt="logo"/>
            </a>

            <a 
            href="https://github.com/dietbald"
              target="_blank"
              rel="noopener noreferrer">
              <img src={dietbald} width="80" height="80" className="dietbaldLogo" alt="logo"/>
            </a>

            <a 
            href="https://www.harmony.one/"
              target="_blank"
              rel="noopener noreferrer">
              <img src={harmony} width="80" height="80" className="harmonyLogo" alt="logo"/>
            </a>


          
          <p>
            A modest Web App built by{" "}
            <a
              href="https://github.com/dietbald"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dietbald 
            </a>{" "}
            with React, hosted on Github.{" "}
            <a href="https://github.com/dietbald/harmony-supply/">
              PRs welcomed and appreciated ✨
            </a>
          </p>
          <p>
            App contributions and funding by:{" "}
            <a
              h
              href="https://www.intrepidstaking.io/"
              target="_blanc"
              rel="noopener noreferrer"
            >
               Intrepid.one | Community Validator.
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
