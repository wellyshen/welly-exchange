export default (val: string | number, decimal = 2): string => {
  if (!val && val !== 0) return "";

  if (typeof val !== "string") val = val.toString();
  
  const decimals = val.split(".")[1];

  if (!decimals || decimals.length <= decimal) return val;

  return parseFloat(val).toFixed(decimal);
};
