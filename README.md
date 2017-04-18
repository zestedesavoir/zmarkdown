[![Build Status](https://travis-ci.org/zestedesavoir/zmarkdown.svg?branch=master)](https://travis-ci.org/zestedesavoir/zmarkdown)
[![Coverage Status](https://coveralls.io/repos/github/zestedesavoir/zmarkdown/badge.svg?branch=master)](https://coveralls.io/github/zestedesavoir/zmarkdown?branch=master)

# zmarkdown

zmarkdown is [remark](https://github.com/wooorm/remark)-based reimplementation of [Python-ZMarkdown](https://github.com/zestedesavoir/Python-ZMarkdown).

## Install

*This project requires node >= 6.*

1. clone
2. `$ yarn` or `npm install`
3. `npm run test`

## Contribute

### Make an existing skipped test pass

* Enable a test by remove its `.skip`.
* Run tests, see how it fails.
* Write a plugin solving the issue or fix the test fixture. Each plugin is a `packages/` subfolder.
* You can inspect the AST at various transform stages, see `index.js`
* Once you wrote a plugin, `use()` it in `index.js`.
* Make sure tests are still passing and coverage isn't going down.

### Have a live view of what you're working on

* Take a look at `wip.js`
* It's easy to edit it, and if you:
* `npm run wip`, it'll auto-reload `wip.js` when you modify anything in the project and display in your terminal the HTML render and the AST!

# diff

## link title, link URL encoding

input:

`[link](<simple link> "my title")`

diff:

```diff
-<p><a href="simple link" title>link</a>
+<p><a href="simple%20link" title="my title">link</a>
```


## list item indented code block

diff:

```diff
 * list item

-        indented code
+      indented code
```

## list items with list children are wrapped

input:

```markdown
* foo
  * bar
    * baz
```

diff:

```diff
 <ul>
   <li>
-    foo
+    <p>foo</p>
     <ul>
       <li>
-        bar
+        <p>bar</p>
         <ul>
           <li>baz</li>
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

diff:

```diff
 <p>This short paragraph is wrapped at 40
 columns and a line which starts with eg
 1. does not render as a list. It's much
 better that way.</p>
 <p>An asterisk followed by a space should</p>
-* create a list anyway! That's what we
-want.</p>
+<ul><li>create a list anyway! That's what we
+want.</li></ul>
```

## del is consistent

input:

```markdown
~~foo~~

bar ~~~~ baz
```

diff:

```diff
 <p><del>foo</del></p>
-<p>bar ~~~~ baz</p>
+<p>bar <del></del> baz</p>
```

## new blockquote after blank line

input:

```markdown
>    > foo

>    > bar
```

diff:

```diff
 <blockquote>
   <blockquote>
     <p>foo</p>
+  </blockquote>
+  <blockquote>
     <p>bar</p>
   </blockquote>
 </blockquote>
```

## autourlize only for protocoled url and htmlchars

input :

```markdown
www.google.fr

http://google.fr

https://fr.wikipedia.org/wiki/Compactifi%C3%A9_d%27Alexandrov

toto@gmail.com
```

diff

```diff
- <p><a href="http://www.google.fr">www.google.fr</a></p>
+ <p>www.google.fr</p>
<p><a href="http://google.fr">http://google.fr</a></p>
- <p><a href="https://fr.wikipedia.org/wiki/Compactifi%C3%A9_d%27Alexandrov">https://fr.wikipedia.org/wiki/Compactifi%C3%A9_d%27Alexandrov</a></p>
+ <p><a href="https://fr.wikipedia.org/wiki/Compactifi%C3%A9_d&#39;Alexandrov">https://fr.wikipedia.org/wiki/Compactifi%C3%A9_d%27Alexandrov</a></p>
- <p><a href="mailto:toto@gmail.com">toto@gmail.com</a></p>
+ <p>toto@gmail.com</p>
