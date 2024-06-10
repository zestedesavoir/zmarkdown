## Subscript and superscript

Both subscript and superscript constructions extend inline GFM structures. As such, they are parsed sequentially from beginning to end of stream.

### 1. Definitions

Two characters are used for subscript and superscript, respectively the tilde (character `~`, U+007E) and circumflex accent (character `^`, U+005E) characters. We also define the backslash as character `\` (U+005C), also called the escape character, and the space character as character ` ` (U+0020).

A subscript entry begins with a tilde character followed by any number of Unicode character, except the tilde character itself and ends with another tilde character.
Similarly, a superscript entry begins with a circumflex accent character followed by any number of Unicode character, except the circumflex accent character itself and ends with another circumflex accent character.

The content of the subscript or superscript entry are all the characters between the two abovedefined symbols. The following shows a simple subscript entry:

Example 1.1:

```markdown
CO~2~
```

```html
<p>CO<sub>2</sub></p>
```

And the following example shows a simple superscript entry:

Example 1.2:

```markdown
a^2^ + b^2^ = c^2^
```

```html
<p>a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup></p>
```

Tilde and circumflex accent characters may be used to define a subscript or superscript entry even inside of words:

Example 1.3:

```markdown
Literally s^e^lfies tbh lo-fi.
```

```html
<p>Literally s<sup>e</sup>lfies tbh lo-fi.</p>
```

### 2. Subscript and superscript entries

Subscript and superscript entries must always contain content, otherwise they shall not be parsed:

Example 2.1:

```markdown
a~~
```

```html
<p>a~~</p>
```

Example 2.2:

```markdown
b^^
```

```html
<p>b^^</p>
```

A whitespace is not considered as content:

Example 2.3:

```markdown
a~ ~
```

```html
<p>a~ ~</p>
```

Example 2.4:

```markdown
b^ ^
```

```html
<p>b^ ^</p>
```

Similarly, a subscript or superscript which contains only another subscript or superscript entry is not considered to have content, and should be treated as if the opening and closing characters were escaped:

Example 2.5:

```markdown
^^foo^^
```

```html
<p>^<sup>foo</sup>^</p>
```

Subscript and superscript entries may contain more than one character:

Example 2.6:

```markdown
a^1+1^ + b^1+1^ = c^1+1^
```

```html
<p>a<sup>1+1</sup> + b<sup>1+1</sup> = c<sup>1+1</sup></p>
```

Subscript and superscript entries may not start with a space character:

Example 2.7:


```markdown
a~ ~ + b~ ~
```

```html
<p>a~ ~ + b~ ~</p>
```

Example 2.8:

```markdown
a^ ^ + b^ ^
```

```html
<p>a^ ^ + b^ ^</p>
```

Since subscript and superscript are inline elements, they cannot contain any block element, such as line breaks:

Example 2.9:

```markdown
a~b

c~
```

```html
<p>a~b</p>

<p>c~</p>
```

### 3. Escaping

The tilde and circumflex accent characters can both be escaped by preceding them with a backslash character, in which case they shall not be treated as opening or closing a subscript or superscript entry.

Example 3.1:

```markdown
a\~no\~
```

```html
<p>a~no~</p>
```

Example 3.2:

```markdown
a\^no\^
```

```html
<p>a^no^</p>
```
An escaped tilde or circumflex accent character may be included inside a subscript or superscript entry, in which case it shall be included as part of the entry:

Example 3.3:

```markdown
a^\^^
```

```html
<p>a<sup>^</sup></p>
```

Lone tilde and circumflex accent characters, which not dot have matching character, do not need to be escaped:

Example 3.4:

```markdown
a ~ b
```

```html
<p>a ~ b</p>
```

### 4. Precedence rules

Subscript and superscript entries have the same precedence as any other inline, except otherwise denoted. As such, they can contain other inline constructs, such as emphasis:

Example 4.1:

```markdown
my ^*important*^ superscript
```

```html
<p>my <sup><em>important</em></sup> superscript</p>
```

Example 4.2:

```markdown
my ~*important*~ subscript
```

```html
<p>my <sub><em>important</em></sub> subscript</p>
```

Subscript and superscript entries may also be contained by other inline constructs:

Example 4.3:

```markdown
my *im~por~tant* subscript
```

```html
<p>my <em>im<sub>por</sub>tant</em> subscript</p>
```

Subscript and superscript entries can also be self-contained:

Example 4.4:

```markdown
2^2^2^^ = 16
```

```html
<p>2<sup>2<sup>2</sup></sup> = 16</p>
```

They can also be cross-contained:

Example 4.5:

```markdown
remark-~sub-^super^~
```

```html
<p>remark-<sub>sub-<sup>super</sup></sub></p>
```

