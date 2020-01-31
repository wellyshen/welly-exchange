import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import Carousel from "nuka-carousel";

import { Base } from "../../types";
import fetchRate from "../../actions/fetchRate";
import formatDigits from "../../utils/formatDigits";
import Rates from "../Rates";
import Pocket from "../Pocket";
import styles from "./styles.module.scss";

interface Pocket {
  id: string;
  base: Base;
}

const outPockets: Pocket[] = [
  { id: "p-1", base: "GBP" },
  { id: "p-2", base: "USD" },
  { id: "p-3", base: "EUR" }
];
const inPockets: Pocket[] = [
  { id: "p-3", base: "EUR" },
  { id: "p-1", base: "GBP" },
  { id: "p-2", base: "USD" }
];
let timer: ReturnType<typeof setInterval>;
// Used for converting the deposit of pockets
let depositRate: number;
// Export for unit testing
export const notEnoughMsg = "😭 Not enough money.";
export const errorMsg = "😱 Something went wrong, please try again.";
export const doneMsg = "🥳 Exchange is done.";

export default () => {
  const dispatch = useDispatch();
  const [hasFetchData, setHasFetchData] = useState(false);
  const [whichInput, setWhichInput] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [outIdx, setOutIdx] = useState(0);
  const [inIdx, setInIdx] = useState(0);
  const outPocket = outPockets[outIdx];
  const inPocket = inPockets[inIdx];
  const [deposits, setDeposits] = useState({
    GBP: "100.66",
    USD: "110.66",
    EUR: "120.66"
  });

  useEffect(() => {
    if (!hasFetchData) {
      dispatch(fetchRate("EUR"));
      dispatch(fetchRate("GBP"));
      dispatch(fetchRate("USD"));
      setHasFetchData(true);

      return;
    }

    timer = setInterval(() => {
      dispatch(fetchRate("EUR"));
      dispatch(fetchRate("GBP"));
      dispatch(fetchRate("USD"));
    }, 10 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, [hasFetchData, dispatch]);

  // Memorize the callback prop to prevent Pocket component from re-render
  const setDepositRate = useCallback((rate: number) => {
    depositRate = rate;
  }, []);

  const handleExchange = () => {
    const val = parseFloat(inputVal);
    const outPocketDeposit = parseFloat(deposits[outPocket.base]);
    const inPocketDeposit = parseFloat(deposits[inPocket.base]);
    const exchangeVal = whichInput === "EXCHANGE_OUT" ? val : val * depositRate;

    if (exchangeVal > outPocketDeposit) {
      alert(notEnoughMsg);
      return;
    }

    // Make sure the value is available (API is OK)
    if (!depositRate) {
      alert(errorMsg);
      return;
    }

    alert(doneMsg);
    setInputVal("");

    const outVal = whichInput === "EXCHANGE_OUT" ? val : val * depositRate;
    const inVal = whichInput === "EXCHANGE_IN" ? val : val * depositRate;

    setDeposits({
      ...deposits,
      [outPocket.base]: formatDigits(outPocketDeposit - outVal),
      [inPocket.base]: formatDigits(inPocketDeposit + inVal)
    });
  };

  const handleCarouselChange = (which: string) => (idx: number) => {
    which === "EXCHANGE_OUT" ? setOutIdx(idx) : setInIdx(idx);
  };

  const handleInputChange = (which: string) => (val: string) => {
    setWhichInput(which);
    setInputVal(val);
  };

  const renderPockets = (pockets: Pocket[], isExchangeIn: boolean = false) =>
    pockets.map(({ id, base }) => {
      const shouldSetDepositRate =
        (isExchangeIn &&
          whichInput === "EXCHANGE_IN" &&
          inPocket.base === base) ||
        (!isExchangeIn &&
          whichInput === "EXCHANGE_OUT" &&
          outPocket.base === base);

      return (
        <Pocket
          key={id}
          base={base}
          deposit={deposits[base]}
          exchangeTo={isExchangeIn ? outPocket.base : inPocket.base}
          exchangeDisabled={
            isExchangeIn
              ? whichInput === "EXCHANGE_IN"
              : whichInput === "EXCHANGE_OUT"
          }
          isExchangeIn={isExchangeIn}
          inputVal={inputVal}
          onInputChange={handleInputChange(
            isExchangeIn ? "EXCHANGE_IN" : "EXCHANGE_OUT"
          )}
          setDepositRate={shouldSetDepositRate && setDepositRate}
        />
      );
    });

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <Rates base={outPocket.base} exchangeTo={inPocket.base} />
        <button
          data-testid="exchange"
          className={styles.exchange}
          onClick={handleExchange}
          disabled={!inputVal || outPocket.base === inPocket.base}
        >
          Exchange
        </button>
      </div>
      <div>
        <Carousel afterSlide={handleCarouselChange("EXCHANGE_OUT")}>
          {renderPockets(outPockets)}
        </Carousel>
        <Carousel afterSlide={handleCarouselChange("EXCHANGE_IN")}>
          {renderPockets(inPockets, true)}
        </Carousel>
      </div>
    </div>
  );
};
