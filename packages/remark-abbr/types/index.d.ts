// Minimum TypeScript Version: 3.4

import { Plugin } from "unified";

declare namespace remarkAbbr {
  type Abbr = Plugin<[Options?]>;

  interface Options {
    expandFirst?: boolean;
  }
}

declare const remarkAbbr: remarkAbbr.Abbr;
export = remarkAbbr;
