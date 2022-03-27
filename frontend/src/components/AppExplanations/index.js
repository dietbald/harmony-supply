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
    "A `Faucet` is a tool that provides a small amount of funds to start using a cryptocurrency without having to buy some. You will need gas (small amount of coin) \n\
     in order to make transactions or to collect your staking rewards! Use this faucet by simply filling out the captcha and connecting. \n\
     Always be cautious of other faucets as most contain many ads or spam and can sometimes be unsafe! \n\
    This is a bare-bones, no BS faucet, but most importantly is that it's safe!";
    ;
    


  const howMuchCanIGet_help =
    // eslint-disable-next-line
    "`Plenty enough!`  \n\
    Since transactions on the Harmony network are VERY cheap. Harmony Faucet will only send you `0.01 ONE`, which should be enough to \n\
    do `100` basic transactions on Harmony network. You can use Harmony Faucet up to `3 times a day`. \n\
    You will get a 'Balance too High' message if you already have sufficent gas in your wallet. \n\
    Feel free to send some spare ONEs to `0xf31822e40957fd71c102a112b53ccc2a4d4a7ec7` in order to replenish the faucet once you're rich.";

  const howToEarnMoreMatic_help =
    "* `Stake` your ONEs on the Harmony blockchain and earn almost 10% APR on your coins. \n\
    Staking helps decentralize and grow Harmony's Blockchain! In order to stake you need a compatible wallet with at least 100 ONEs in it. \n\
    Go to `https://staking.harmony.one/validators/mainnet` and select a validator on the list to begin staking! \n\
    We reccommend staking with `Intrepid.one | Community Validator` as their commission fees help fund the Harmony Faucet!";
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
            How to earn more ONE ?
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
