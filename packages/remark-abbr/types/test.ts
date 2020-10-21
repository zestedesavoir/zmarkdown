import remark = require("remark");
import remarkAbbr = require("remark-abbr");

remark()
  .use(remarkAbbr);

const options: remarkAbbr.Options = {};
remark()
  .use(remarkAbbr, options);
