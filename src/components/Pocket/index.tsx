import React, { ChangeEvent, useRef, useEffect, memo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import { Base } from "../../types";
import getSymbols from "../../utils/getSymbols";
import formatDigits from "../../utils/formatDigits";
import fetchRate from "../../actions/fetchRate";
import styles from "./styles.module.scss";

interface Props {
  base: Base;
  deposit: string;
  exchangeTo: Base;
  exchangeDisabled: boolean;
  isExchangeIn?: boolean;
  inputVal: string;
  onInputChange: (val: string) => void;
  setDepositRate: ((rate: number) => void) | false;
}

const Pocket = ({
  base,
  deposit,
  exchangeTo,
  exchangeDisabled,
  isExchangeIn,
  inputVal,
  onInputChange,
  setDepositRate
}: Props) => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const baseRateData = useSelector(
    state => (state as any)[`${base.toLowerCase()}Rate`],
    shallowEqual
  );
  const exchangeRateData = useSelector(
    state => (state as any)[`${exchangeTo.toLowerCase()}Rate`],
    shallowEqual
  );

  useEffect(() => {
    const { readyStatus, data } = baseRateData;

    if (setDepositRate && readyStatus === "success")
      setDepositRate(data.rates[exchangeTo]);
  }, [baseRateData, setDepositRate, exchangeTo]);

  // Override the default event of Carousel component
  // See: https://github.com/FormidableLabs/nuka-carousel/issues/406
  const handleInputClick = () => {
    // @ts-ignore
    // istanbul ignore next
    inputRef.current.focus();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Only accept digit and one dot
    val = val.replace(/[^.\d]/g, "").replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2");

    onInputChange(val);
  };

  const handleRetry = (base: Base) => () => {
    dispatch(fetchRate(base));
  };

  const getInputVal = (rate: number) => {
    if (!inputVal) return "";
    // When user enter "." at the beginning, pre-pend zero for better UX
    if (inputVal === ".") inputVal = "0" + inputVal;

    const preFix = isExchangeIn ? "+" : "-";
    const val = exchangeDisabled ? inputVal : parseFloat(inputVal) * rate;

    return preFix + formatDigits(val);
  };

  const renderInput = () => {
    const { readyStatus, data } = exchangeRateData;

    switch (readyStatus) {
      case "success":
        const rate = data.rates[base] || 1;
        return (
          <input
            data-testid="input"
            className={styles.input}
            value={getInputVal(rate)}
            onChange={handleInputChange}
            onClick={handleInputClick}
            type="text"
            // @ts-ignore
            ref={inputRef}
          />
        );
      case "failure":
        return (
          <div
            data-testid="retry-input"
            className={styles.base}
            onClick={handleRetry(exchangeTo)}
          >
            Error, tap to retry
          </div>
        );
      default:
        return <div className={styles.base}>Loading...</div>;
    }
  };

  const renderRateInfo = () => {
    const { readyStatus, data } = baseRateData;

    switch (readyStatus) {
      case "success":
        const rate = formatDigits(data.rates[exchangeTo] || 1);
        return `${getSymbols(base)}1 = ${getSymbols(exchangeTo)}${rate}`;
      case "failure":
        return (
          <div data-testid="retry-rate" onClick={handleRetry(base)}>
            Error, tap to retry
          </div>
        );
      default:
        return "Loading...";
    }
  };

  return (
    <div className={styles.pocket}>
      <div>
        <div className={styles.base}>{base}</div>
        <div data-testid="deposit">{`You have ${getSymbols(base)}${deposit}`}</div>
      </div>
      <div className={styles.inputWrapper}>
        {renderInput()}
        {isExchangeIn && <div data-testid="rate-info">{renderRateInfo()}</div>}
      </div>
    </div>
  );
};

Pocket.defaultProps = {
  isExchangeIn: false
};

export default memo(Pocket);
