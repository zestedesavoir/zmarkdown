This plugin replaces the footnote references with a number sequence (starting from 1) in the same order as the footnote references (like `mdast-util-to-hast`, starting from version 6.0.0).

This is useful if you want your footnotes to be superscript numbers without having to manually enter them while keeping the benefit of using strings that make sense to you in your Markdown source.

Be careful when using an older version of `mdast-util-to-hast` than 6.0.0, your footnotes order may not match the references given. If it is the case, then you can either downgrade `remark-numbered-footnotes` to version 1.x.x or upgrade `mdast-util-to-hast` to version 6.0.0.
