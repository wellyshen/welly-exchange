import { Base } from "../types";

const symbols = {
  GBP: "£",
  EUR: "€",
  USD: "$"
};

export default (base: Base): string => symbols[base];
