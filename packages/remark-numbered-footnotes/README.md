This plugin changes how [mdast][mdast] footnotes are displayed by using sequential numbers as footnote references instead of user-specified strings.

The footnotes numbers generated doesn't match the global number given by rehype in the ordered list; this behaviour should be considered normal and can be changed by post-visting the HAST tree.
