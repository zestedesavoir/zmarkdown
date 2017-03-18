# diff

## link title, link URL encoding

`[link](<simple link> "my title")`

becomes
`<p><a href="simple%20link" title="my title">link</a>`

instead of
`<p><a href="simple link" title>link</a>`

## list item indented code block

before:

```
* list item

        indented code
```

after:

```
* list item

      indented code
```

## list items with list children are wrapped

before:

```html
<ul>
  <li>Tab
    <ul>
      <li>Tab
        <ul>
          <li>Tab</li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
```

after:

```html
<ul>
  <li>
    <p>Tab</p>
    <ul>
      <li>
        <p>Tab</p>
        <ul>
          <li>Tab</li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
```
