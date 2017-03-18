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

## hard wrap is Commonmark compliant

input:

```markdown
This short paragraph is wrapped at 40
columns and a line which starts with eg
1. does not render as a list. It's much
better that way.

An asterisk followed by a space should
* create a list anyway! That's what we
want.
```

before:

```html
<p>This short paragraph is wrapped at 40
columns and a line which starts with eg
1. does not render as a list. It's much
better that way.</p>
<p>An asterisk followed by a space should
* create a list anyway! That's what we
want.</p>
```

after:

```html
<p>This short paragraph is wrapped at 40
columns and a line which starts with eg
1. does not render as a list. It's much
better that way.</p>
<p>An asterisk followed by a space should</p>
<ul><li>create a list anyway! That's what we
want.</li></ul>
```
