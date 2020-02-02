This plugin replaces the footnote references with a number sequence (starting from 1) in the same order as the footnote definitions (**not** the footnote references).

Reordering the definitions (usually put at the end of the document in the Markdown source) will therefore let you reorder the sequence.

This is useful if you want your footnotes to be superscript numbers without having to manually enter them while keeping the benefit of using strings that make sense to you in your Markdown source.

# Warning

If you are using this plugin, your project is most certainly relying on [mdast-util-to-hast](https://github.com/syntax-tree/mdast-util-to-hast). Run `npm ls mdast-util-to-hast` if you're unsure.
Starting from `mdast-util-to-hast@6.0.0`, the [footnote order changed](https://github.com/syntax-tree/mdast-util-to-hast/commit/fd38c45421bbec497f56e5c624eb8652d3a3bba4). Before `6.0.0`, footnotes were following the order in which they were defined, starting from `6.0.0` they follow the order of the references.

```md
a[^first_footnote_reference]

b[^`b` second footnote reference but first footnote definition]

c[^last_footnote_reference]

[^last_footnote_reference]: `c` last footnote reference but second footnote definition
[^first_footnote_reference]: `a` first footnote reference but last footnote definition
```

Before `6.0.0`:

![image](https://user-images.githubusercontent.com/2022803/73589529-7207e980-44d7-11ea-8c67-cd8a20d961fe.png)

After `6.0.0`:

![image](https://user-images.githubusercontent.com/2022803/73589535-7cc27e80-44d7-11ea-90e0-3e0e0dbac87c.png)

In the HTML ordered list, the list items 1/2/3 don't match the footnote references numbers anymore.

To avoid this issue you can either use older versions of your dependencies (not recommended) or visit the HAST tree after `mdast-util-to-hast` to fix the footnote orders (recommended).
[Here is an example](https://github.com/zestedesavoir/zmarkdown/blob/7edd73057aba4eba52600106c6f8511619f045bd/packages/zmarkdown/common.js#L175-L206).
This way the above markdown will always generate HTML with matching footnote list items and footnote numbered references as can be seen below:

![image](https://user-images.githubusercontent.com/2022803/73589529-7207e980-44d7-11ea-8c67-cd8a20d961fe.png)
