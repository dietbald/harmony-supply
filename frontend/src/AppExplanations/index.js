import React, { useState } from "react";

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import ReactMarkdown from "react-markdown";
import "./index.css";

export default function AppExplanations() {
  const [expandedItems, setexpandedItems] = useState([]);

  // In case the user expands a node that is barely visible, we scroll the page to display it fully
  function handleExpand(update) {
    if (update.length > expandedItems.length) {
      const newExpandedItemUUID = update[update.length - 1];
      const itemButtonBottom = document
        .getElementById(`accordion__panel-${newExpandedItemUUID}`)
        .getBoundingClientRect().bottom;
      if (itemButtonBottom > window.innerHeight) {
        window.scrollBy(0, itemButtonBottom - window.innerHeight);
      }
    }
    setexpandedItems(update);
  }

  const whatIsAFaucet_help =
    // eslint-disable-next-line
    "A `Faucet` is a tool that provides a small amount of funds to start using a cryptocurrency without having to buy some. \n\
    It's often a shity website with plenty of ads that will send you funds half the time, only after asking you to input your email to send you spam later.  \n\
    `Harmony` had none for its mainnet, so here's one, without the crap you usually get on typical faucets";


  const howMuchCanIGet_help =
    // eslint-disable-next-line
    "`Plenty enough!`  \n\
    Transactions on Harmony network are dirt cheap. Forget Ethereum, forget BSC, we're talking about fractions of a cent for most transactions.  \n\
    So this faucet will only send you `0.01 ONE` - which is enough to deposit some fund on Tranquil and [earn fresh ONE](https://medium.com/coinmonks/tranquil-finance-the-first-money-market-in-harmony-one-8cd17384475d), for instance  \n\
    With `0.01 ONE`, you can do `100` basic transactions on Harmony network ! You can even deposit or withdraw funds on `Tranquil`, even though it is a pretty expensive transaction (`50$+` on Ethereum, `1$+` on Binance Smart Chain). \n\
    The goal of this faucet is not to make you rich but just to make the onboarding to Harmony smoother.  \n\
    You can use it up to `3 times a day`, for the most clumsy of us 🙄  \n\
    Feel free to send some spare change at `0xf31822e40957fd71c102a112b53ccc2a4d4a7ec7` to replenish the faucet once you're rich";

  const howToEarnMoreMatic_help =
    "* First bring your assets from Ethereum to Harmony through [the bridge](https://bridge.harmony.one/)  \n\
    Then there's a variety of things you can do:  \n\
    * Play [CryptoRoyale](https://cryptoroyale.one/) to earn the ROY token which can be swapped on [Viperswap](https://viper.exchange/) for ONE \n\
    * Swap to other assets on [Sushiswap](https://app.sushi.com/swap), the equivalents of `Uniswap` on Harmony  \n\
    [Openswap](https://app.openswap.one/) is also available and will route your swaps through the cheapest path.  \n\
    * Depositing your assets on [Tranquil](https://app.tranquil.finance/) or [Curve](https://harmony.curve.fi/) to farm some fresh ONE  \n\
    * Enjoy the same functionalities Ethereum has, only with less friction \n\
    ";

  return (
    <Accordion allowZeroExpanded allowMultipleExpanded onChange={handleExpand}>
       <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton>What is a Faucet ?</AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <ReactMarkdown
            className="Explanations"
            children={whatIsAFaucet_help}
          ></ReactMarkdown>
        </AccordionItemPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton>How much can I get ?</AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <ReactMarkdown
            className="Explanations"
            children={howMuchCanIGet_help}
          ></ReactMarkdown>
        </AccordionItemPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton>
            How to earn (much) more ONE ?
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <ReactMarkdown
            className="Explanations"
            children={howToEarnMoreMatic_help}
          ></ReactMarkdown>
        </AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  );
}
