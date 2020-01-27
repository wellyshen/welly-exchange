import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Carousel from "nuka-carousel";

import { Base } from "../../types";
import fetchRate from "../../actions/fetchRate";
import Rates from "../Rates";
import Pocket from "../Pocket";
import styles from "./styles.module.scss";

interface Pocket {
  id: string;
  deposit: number;
  base: Base;
}

const outPockets: Pocket[] = [
  { id: "p-1", base: "GBP", deposit: 100.66 },
  { id: "p-2", base: "USD", deposit: 110.66 },
  { id: "p-3", base: "EUR", deposit: 120.66 }
];
const inPockets: Pocket[] = [
  { id: "p-3", base: "EUR", deposit: 120.66 },
  { id: "p-1", base: "GBP", deposit: 100.66 },
  { id: "p-2", base: "USD", deposit: 110.66 }
];
let timer: ReturnType<typeof setInterval>;
// Export for unit testing
export const errorMsg = "😭 Not enough money.";
export const doneMsg = "🥳 Exchange is done.";

export default () => {
  const dispatch = useDispatch();
  const [hasFetchData, setHasFetchData] = useState(false);
  const [outIdx, setOutIdx] = useState(0);
  const [inIdx, setInIdx] = useState(0);
  const [whichInput, setWhichInput] = useState("");
  const [inputVal, setInputVal] = useState("");

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

  const handleExchange = () => {
    const msg =
      parseFloat(inputVal) > outPockets[outIdx].deposit ? errorMsg : doneMsg;

    alert(msg);
    setInputVal("");
  };

  const handleCarouselChange = (which: string) => (idx: number) => {
    which === "EXCHANGE_OUT" ? setOutIdx(idx) : setInIdx(idx);
  };

  const handleInputChange = (which: string) => (val: string) => {
    setWhichInput(which);
    setInputVal(val);
  };

  const renderPockets = (pockets: Pocket[], isExchangeIn: boolean = false) =>
    pockets.map(({ id, deposit, base }) => (
      <Pocket
        key={id}
        base={base}
        deposit={deposit}
        exchangeTo={
          isExchangeIn ? outPockets[outIdx].base : inPockets[inIdx].base
        }
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
      />
    ));

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <Rates
          base={outPockets[outIdx].base}
          exchangeTo={inPockets[inIdx].base}
        />
        <button
          data-testid="exchange"
          className={styles.exchange}
          onClick={handleExchange}
          disabled={!inputVal.length}
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
