## Keyboard entries

As a preliminary, keyboard entries extend inline GFM structures. As such, they are parsed sequentially from beginning to end of stream.

### 1. Definitions

Is refered to as a pipe character the character `|` (U+007C), in it's unescaped version, that is, not precedeed by a backslash character `\` (U+005C).

A keyboard entry begins with an opening sequence of exactly two pipe characters, and ends with a closing sequence of exactly two pipe characters.

The contents of the keyboard entry are the characters between the two characters that are the closest in the opening and closing sequence, normalized by converting line endings to spaces.

This is a simple keyboard entry:

Example 1.1:

```markdown
||Ctrl||
```

```html
<p><kbd>Ctrl</kbd></p>
```

The following example shows an invalid keyboard entry:

Example 1.2:

```markdown
||Ctrl|
```

```html
<p>||Ctrl|</p>
```

Also note that due to keyboard entries being inline elements, they cannot contain any block, such as line breaks:

Example 1.3:

```markdown
||Key
board||
```

```html
<p>||Key
board||</p>
```

### 2. Pipe sequences

A keyboard entry can itself contain a pipe character.

Example 2.1:

```markdown
|||||
```

```html
<p><kbd>|</kbd></p>
```

But not more than one, otherwise, inline parsing being from beginning to end, it might get confused with the closing sequence.

Example 2.2:

```markdown
||a||b||
```

```html
<p><kbd>a</kbd>b||</p>
```

No characters might be inserted between the two opening pipe characters.

Example 2.3:

```markdown
| |a||
```

```html
<p>| |a||</p>
```

No characters might be inserted between the two closing pipe characters.

Example 2.4:

```markdown
||a| |
```

```html
<p>||a| |</p>
```

The inside of a keyboard entry cannot start or end with a space.

Example 2.5:

```markdown
|| a||
```

```html
<p>|| a||</p>
```

Example 2.6:

```markdown
||a ||
```

```html
<p>||a ||</p>
```

No keyboard entry can exist without content.

Example 2.7:

```markdown
||||
```

```html
<p>||||</p>
```

A blank space is not considered to be content:

Example 2.8:

```markdown
|| ||
```

```html
<p>|| ||</p>
```

An backslash-escaped pipe cannot be used to make a keyboard entry:

Example 2.9:

```markdown
\||a||
```

```html
<p>||a||</p>
```

### 3. Precedence rules

Keyboard entry pipes have higher precedence than any other inline constructs except HTML tags and autolinks. Thus, for example, this is not parsed as emphasized text, since the second * is part of a keyboard entry:

Example 3.1:

```markdown
*foo||*||
```

```html
<p>*foo<kbd>*</kbd></p>
```

Intraword keyboard entries are permitted, hence plain text can be interrupted by keyboard entries:

Example 3.2:

```markdown
a key||bo||ard
```

```html
<p>a key<kbd>bo</kbd>ard</p>
```

Keyboard entry pipe sequences have higher precedence than any other inline element apart from character references. As such, they cannot contain any inline element other than character references:

Example 3.3:

```markdown
||*foo*||
```

```html
<p><kbd>*foo*</kbd></p>
```

Example 3.4:

```markdown
||https://zestedesavoir.com/||
```

```html
<p><kbd>https://zestedesavoir.com/</kbd></p>
```

However, character references are allowed inside of keyboard entries:

Example 3.5:

```markdown
||&#35;||
```

```html
<p><kbd>#</kbd></p>
```
