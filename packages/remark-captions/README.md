This plugin enhance mdast quotation to add the source of quotation.

This is enabled by adding `Source:` at the end of quote bloque e.g:

```markdown
> Do it or do it not, there is no try
Source: A little green man, with a saber larger than himself
```

This removes the `Source` from the tree and add a `author` attribute to the blockquote element.

This plugin also enables "external caption" which can be configured through the `opts` object passed to plugin.

This object has to be formed as a dictionary associating the type of node to caption and the prefix.

By default, it features :

```javascript
const legendBlock = {
  table: 'Table:',
  code: 'Code:',
}
```

This enables you to deal with such a code:

    ```
    a_highlighted_code('blah')
    ```
    Code: My code caption

Table are also supported with such a code :

```markdown
head1| head2
-----|------
bla|bla
Table: figcapt1
```

Associated with `remark-rehype` this generates a HTML tree encapsulated inside `<figure>` tag

```html
<figure>
  <table>
    <thead>
      <tr>
        <th>head1</th>
        <th>head2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>bla</td>
        <td>bla</td>
      </tr>
    </tbody>
  </table>
  <figcaption>figcapt1</figcaption>
</figure>
```