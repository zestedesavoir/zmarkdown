This plugin enhance mdast quotation to add the source of quotation.

This is enabled by adding `Source:` at the end of quote bloque e.g:

```markdown
> Do it or do it not, there is no try
Source: A little green man, with a saber larger than himself
```

This removes the `Source` from the tree and add a `author` attribute to the blockquote element.
