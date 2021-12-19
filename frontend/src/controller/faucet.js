import axios from "axios";
import config from "react-global-configuration";

async function claimFaucet(account, captcha) {
  console.log(captcha);
  let apiUrl = config.get("apiurl");
  console.log("Sending request...", apiUrl);

  var data = JSON.stringify({ address: account, captcha: captcha });

  return await axios
    .post(apiUrl, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      crossDomain: true,
    })
    .then((response) => {
        return response;
     /* if (response.status === 200) {
        return config.get("explorer") + "/tx/" + response.data.hash;
      }*/
    });
}

export default claimFaucet;
