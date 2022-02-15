import BN from "bn.js";

export const numCommaFormatted = (x: BN | number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
