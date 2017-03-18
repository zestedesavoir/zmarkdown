[![Build Status](https://travis-ci.org/zestedesavoir/zmarkdown.svg?branch=master)](https://travis-ci.org/zestedesavoir/zmarkdown)
[![Coverage Status](https://coveralls.io/repos/zestedesavoir/zmarkdown/badge.svg)](https://coveralls.io/r/zestedesavoir/zmarkdown)

# zmarkdown

zmarkdown is [remark](https://github.com/wooorm/remark)-based reimplementation of [Python-ZMarkdown](https://github.com/zestedesavoir/Python-ZMarkdown).

## Install

*This project requires node >= 6.*

1. clone
2. `$ yarn` or `npm install`
3. `npm run test`

## Contribute

* Enable a test by remove its `.skip`.
* Run tests, see how it fails.
* Write a plugin solving the issue or fix the test fixture. Each plugin is a `packages/` subfolder.
* Once you wrote a plugin, `use()` it in `index.js`.
* Make sure tests are still passing and coverage isn't going down.

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
