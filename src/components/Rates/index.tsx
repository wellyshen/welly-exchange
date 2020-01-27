import React, { memo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import { Base } from "../../types";
import getSymbols from "../../utils/getSymbols";
import formatDigits from "../../utils/formatDigits";
import fetchRate from "../../actions/fetchRate";
import styles from "./styles.module.scss";

interface Props {
  base: Base;
  exchangeTo: Base;
}

const Rates = ({ base, exchangeTo }: Props) => {
  const dispatch = useDispatch();
  const { readyStatus, data } = useSelector(
    state => (state as any)[`${base.toLowerCase()}Rate`],
    shallowEqual
  );

  const handleRetry = () => {
    dispatch(fetchRate(base));
  };

  const renderLabel = () => {
    switch (readyStatus) {
      case "success":
        let rate = data.rates[exchangeTo] || 1;
        rate = formatDigits(rate, 4);

        return `${getSymbols(base)}1 = ${getSymbols(exchangeTo)}${rate}`;
      case "failure":
        return "Error, tap to retry";
      default:
        return "Loading...";
    }
  };

  return (
    <button
      data-testid="rates"
      className={styles.rates}
      onClick={handleRetry}
      disabled={readyStatus !== "failure"}
    >
      {renderLabel()}
    </button>
  );
};

export default memo(Rates);
