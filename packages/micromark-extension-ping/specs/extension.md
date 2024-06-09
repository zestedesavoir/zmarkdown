## User mentions (aka. pings)

### 1. Definitions

For pings, an at symbol is the character `@` (U+0040), in it's unescaped version, that is, not precedeed by a backslash character `\` (U+005C). Similarly, we define a star character as an unescaped `*` (U+002A) character.

A ping always starts with an at symbol, which may be followed by an opening star sequence, consisting of two consecutive star characters. If the ping has an opening star sequence, it ends with a closing star sequence, which is exactly the same as the opening sequence. Otherwise, the ping ends on any whitespace character or newline.

The contents of the ping are the characters between the two characters that are the closest in the opening and closing sequence. If the ping does not contain star sequences, then the content are the characters between the at symbol and the ending whitespace or newline.

The following examples show two working pings:

Example 1.1:

```markdown
@foo
```

```html
<p><a href="/@foo">@foo</a></p>
```

Example 1.2:

```markdown
@**foo bar**
```

```html
<p><a href="/@foo%20bar">@foo bar</a></p>
```

### 2. Opening and closing sequences

Any opening or closing sequence must always contain exactly two stars:

Example 2.1:

```markdown
@*foo bar**
```

```html
<p>@<em>foo bar</em>*</p>
```

Example 2.2:

```markdown
@**foo bar*
```

```html
<p>@*<em>foo bar</em></p>
```

An opening star sequence not closed by a closing sequence is invalid:

Example 2.3:

```markdown
@**foo bar
```

```html
<p>@**foo bar</p>
```

Escaped stars cannot form an opening or closing sequence:

Example 2.4:

```markdown
@\**foo bar**
```

```html
<p>@**foo bar**</p>
```

Example 2.5:

```markdown
@**foo bar\**
```

```html
<p>@*<em>foo bar*</em></p>
```

Escaped at symbols can neither form an opening or closing sequence:

Example 2.6:

```markdown
\@foo
```

```html
<p>@foo</p>
```

### 3. Ping contents

Content is mandatory for pings, therefore, pings without content do not exist:

Example 3.1:

```markdown
@
```

```html
<p>@</p>
```

Example 3.2:

```markdown
@****
```

```html
<p>@****</p>
```

Any non-special, non-whitespace Unicode character can be part of a ping:

Example 3.3:

```markdown
@Moté
```

```html
<p><a href="/@Mot%C3%A9">@Moté</a></p>
```

As such, all pings can contain a star character, lonely or surrounded:

Example 3.4:

```markdown
@*
```

```html
<p><a href="/@*">@*</a></p>
```

Example 3.5:

```markdown
@foo*bar
```

```html
<p><a href="/@foo*bar">@foo*bar</a></p>
```

A lonely star inside star sequences must be escaped:

Example 3.6:

```markdown
@*****
```

```html
<p>@*****</p>
```

Example 3.7:

```markdown
@**\***
```

```html
<p><a href="/@*">@*</a></p>
```

Whitespace characters are forbidden inside pings without opening and closing sequence, as they cannot be separated from end of ping:

Example 3.8:

```markdown
@foo bar
```

```html
<p><a href="/@foo">@foo</a> bar</p>
```

### 4. Precedence rules

Pings have higher precedence than any other inline constructs, especially emphasis and strong emphasis; as such, they cannot contain any inline construct.

Example 4.1:

```markdown
@**[link](hello)**
```

```html
<p><a href="/@%5Blink%5D(hello)">@[link](hello)</a></p>
```

Pings can also be contained by some inline elements, namely emphasis and strong emphasis:

Example 4.2:

```markdown
**@foo**
```

```html
<p><strong><a href="/@foo">@foo</a></strong></p>
```

It should be noted that rules concerning inline elements apply. As such, intertwined constructs are parsed in the order of the text:

Example 4.3:

```markdown
**@**foo**
```

```html
<p><strong>@</strong>foo**</p>
```

Characters escape and references are parsed inside of pings that are surrounded by star sequences only:

Example 4.4:

```markdown
@**&#35;**
```

```html
<p><a href="/@#">@#</a></p>
```

Example 4.5:

```markdown
@&#35;
```

```html
<p><a href="/@&amp;amp;#35;">@&amp;#35;</a></p>
```
