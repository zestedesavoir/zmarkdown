const {
  defaultMdastConfig,
  defaultHtmlConfig,
  configOverride,
  renderString,
} = require('../utils/renderer-tests')

describe('heading-shift', () => {
  it(`shifts in range`, () => {
    const newMdastConfig = configOverride(defaultMdastConfig, { headingShifter: 1 })
    return expect(renderString(newMdastConfig, defaultHtmlConfig)('### should be h4')).resolves.toMatchSnapshot()
  })

  it(`shifts past range`, () => {
    const newMdastConfig = configOverride(defaultMdastConfig, { headingShifter: 10 })
    return expect(renderString(newMdastConfig, defaultHtmlConfig)('### should be h6')).resolves.toMatchSnapshot()
  })

  it(`shifts before range`, () => {
    const newMdastConfig = configOverride(defaultMdastConfig, { headingShifter: -10 })
    return expect(renderString(newMdastConfig, defaultHtmlConfig)('### should be h1')).resolves.toMatchSnapshot()
  })
})

describe('basic', () => {
  it(`renders amps-and-angle-encoding.txt`, () => {
    const input = `AT&T has an ampersand in their name.

AT&amp;T is another way to write it.

This & that.

4 < 5.

6 > 5.

Here's a [link] [1] with an ampersand in the URL.

Here's a link with an amersand in the link text: [AT&T] [2].

Here's an inline [link](/script?foo=1&bar=2).

Here's an inline [link](</script?foo=1&bar=2>).


[1]: http://example.com/?foo=1&bar=2
[2]: http://att.com/  "AT&T"`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders angle-links-and-img.txt`, () => {
    const input = `[link](<simple link> "my title")
![image](<http://example.com/image.jpg>)
[link](<http://example.com/(()((())923)(>)
![image](<link(()))(>)
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders auto-links.txt`, () => {
    const input = `Link: <http://example.com/>.

Https link: <https://example.com>

Ftp link: <ftp://example.com>

With an ampersand: <http://example.com/?foo=1&bar=2>

* In a list?
* <http://example.com/>
* It should.

> Blockquoted: <http://example.com/>

Auto-links should not occur here: \`<http://example.com/>\`

	or here: <http://example.com/>
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders backlash-escapes.txt`, () => {
    const input = `These should all get escaped:

Backslash: \\\\

Backtick: \\\`

Asterisk: \\*

Underscore: \\_

Left brace: \\{

Right brace: \\}

Left bracket: \\[

Right bracket: \\]

Left paren: \\(

Right paren: \\)

Greater-than: \\>

Hash: \\#

Period: \\.

Bang: \\!

Plus: \\+

Minus: \\-



These should not, because they occur within a code block:

	Backslash: \\\\

	Backtick: \\\`

	Asterisk: \\*

	Underscore: \\_

	Left brace: \\{

	Right brace: \\}

	Left bracket: \\[

	Right bracket: \\]

	Left paren: \\(

	Right paren: \\)

	Greater-than: \\>

	Hash: \\#

	Period: \\.

	Bang: \\!

	Plus: \\+

	Minus: \\-


Nor should these, which occur in code spans:

Backslash: \`\\\\\`

Backtick: \`\` \\\` \`\`

Asterisk: \`\\*\`

Underscore: \`\\_\`

Left brace: \`\\{\`

Right brace: \`\\}\`

Left bracket: \`\\[\`

Right bracket: \`\\]\`

Left paren: \`\\(\`

Right paren: \`\\)\`

Greater-than: \`\\>\`

Hash: \`\\#\`

Period: \`\\.\`

Bang: \`\\!\`

Plus: \`\\+\`

Minus: \`\\-\`
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders blockquotes-with-code-blocks.txt`, () => {
    const input = `> Example:
> 
>     sub status {
>         print "working";
>     }
> 
> Or:
> 
>     sub status {
>         return "working";
>     }
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders codeblock-in-list.txt`, () => {
    const input = `* A list item with a code block

        Some *code*

* Another list item

        More code

        And more code
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders hard-wrapped.txt`, () => {
    const input = `In Markdown 1.0.0 and earlier. Version
8. This line turns into a list item.
Because a hard-wrapped line in the
middle of a paragraph looked like a
list item.

Here's one with a bullet.
* criminey.
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders horizontal-rules.txt`, () => {
    const input = `Dashes:

---

 ---
 
  ---

   ---

	---

- - -

 - - -
 
  - - -

   - - -

	- - -


Asterisks:

***

 ***
 
  ***

   ***

	***

* * *

 * * *
 
  * * *

   * * *

	* * *


Underscores:

___

 ___
 
  ___

   ___

    ___

_ _ _

 _ _ _
 
  _ _ _

   _ _ _

    _ _ _
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders inline-html-advanced.txt`, () => {
    const input = `Simple block on one line:

<div>foo</div>

And nested without indentation:

<div>
<div>
<div>
foo
</div>
</div>
<div>bar</div>
</div>
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders inline-html-comments.txt`, () => {
    const input = `Paragraph one.

<!-- This is a simple comment -->

<!--
	This is another comment.
-->

Paragraph two.

<!-- one comment block -- -- with two comments -->

The end.
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders inline-html-simple.txt`, () => {
    const input = `Here's a simple block:

<div>
	foo
</div>

This should be a code block, though:

	<div>
		foo
	</div>

As should this:

	<div>foo</div>

Now, nested:

<div>
	<div>
		<div>
			foo
		</div>
	</div>
</div>

This should just be an HTML comment:

<!-- Comment -->

Multiline:

<!--
Blah
Blah
-->

Code block:

	<!-- Comment -->

Just plain comment, with trailing spaces on the line:

<!-- foo -->   

Code:

	<hr />
	
Hr's:

<hr>

<hr/>

<hr />

<hr>   

<hr/>  

<hr /> 

<hr class="foo" id="bar" />

<hr class="foo" id="bar"/>

<hr class="foo" id="bar" >

<some [weird](http://example.com) stuff>
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders links-inline.txt`, () => {
    const input = `Just a [URL](/url/).

[URL and title](/url/ "title").

[URL and title](/url/  "title preceded by two spaces").

[URL and title](/url/	"title preceded by a tab").

[Empty]().
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders links-reference.txt`, () => {
    const input = `Foo [bar] [1].

Foo [bar][1].

Foo [bar]
[1].

[1]: /url/  "Title"


With [embedded [brackets]] [b].


Indented [once][].

Indented [twice][].

Indented [thrice][].

Indented [four][] times.

 [once]: /url

  [twice]: /url

   [thrice]: /url

    [four]: /url


[b]: /url/

With [angle brackets][].

And [without][].

[angle brackets]: <http://example.com/> "Angle Brackets"
[without]: http://example.com/ "Without angle brackets."

With [line
breaks][]

and [line 
breaks][] with one space.

and [line  
breaks[] with two spaces.

[line breaks]: http://example.com "Yes this works"

[short ref]

[short 
ref]

[short ref]: http://example.com "No more hanging empty bracket!"

[a ref]

[a ref]: http://example.com
    "Title on next line."
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders nested-blockquotes.txt`, () => {
    const input = `> foo
>
> > bar
>
> foo
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders ordered-and-unordered-list.txt`, () => {
    const input = `Unordered

Asterisks tight:

*	asterisk 1
*	asterisk 2
*	asterisk 3


Asterisks loose:

*	asterisk 1

*	asterisk 2

*	asterisk 3

* * *

Pluses tight:

+	Plus 1
+	Plus 2
+	Plus 3


Pluses loose:

+	Plus 1

+	Plus 2

+	Plus 3

* * *


Minuses tight:

-	Minus 1
-	Minus 2
-	Minus 3


Minuses loose:

-	Minus 1

-	Minus 2

-	Minus 3


---

Ordered

Tight:

1.	First
2.	Second
3.	Third

and:

1. One
2. Two
3. Three


Loose using tabs:

1.	First

2.	Second

3.	Third

and using spaces:

1. One

2. Two

3. Three

Multiple paragraphs:

1.	Item 1, graf one.

	Item 2. graf two. The quick brown fox jumped over the lazy dog's
	back.

2.	Item 2.

3.	Item 3.



---

Nested

*	Tab
	*	Tab
		*	Tab

Here's another:

1. First
2. Second:
	* Fee
	* Fie
	* Foe
3. Third

Same thing but with paragraphs:

1. First

2. Second:
	* Fee
	* Fie
	* Foe

3. Third
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders strong-and-em-together.txt`, () => {
    const input = `***This is strong and em.***

So is ***this*** word.

___This is strong and em.___

So is ___this___ word.
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders tabs.txt`, () => {
    const input = `+	this is a list item
	indented with tabs

+   this is a list item
    indented with spaces

Code:

	this code block is indented by one tab

And:

		this code block is indented by two tabs

And:

	+	this is an example list item
		indented with tabs
	
	+   this is an example list item
	    indented with spaces
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders tidyness.txt`, () => {
    const input = `> A list within a blockquote:
> 
> *	asterisk 1
> *	asterisk 2
> *	asterisk 3
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

})

describe('extensions', () => {
  it(`renders abbr.txt`, () => {
    const input = `An ABBR: "REF".
ref and REFERENCE should be ignored.

*[REF]: Reference
*[ABBR]: This gets overriden by the next one.
*[ABBR]: Abbreviation

The HTML specification
is maintained by the W3C.

*[HTML]: Hyper Text Markup Language
*[W3C]:  World Wide Web Consortium

`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders footnote.txt`, () => {
    const input = `This is the body with a footnote[^1] or two[^2] or more[^3] [^4] [^5].

Also a reference that does not exist[^6].

[^1]: Footnote that ends with a list:

    * item 1
    * item 2

[^2]: > This footnote is a blockquote.

[^3]: A simple oneliner.

[^4]: A footnote with multiple paragraphs.

    Paragraph two.

[^5]: First line of first paragraph.
Second line of first paragraph is not intended.
Nor is third...
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders footnote_many_footnotes.txt`, () => {
    const input = `Something[^1]

Something[^2]

Something[^3]

Something[^4]

Something[^5]

Something[^6]

Something[^7]

Something[^8]

Something[^9]

Something[^10]

Something[^11]

Something[^12]

Something[^13]

Something[^14]

Something[^15]

Something[^16]

Something[^17]

Something[^18]

Something[^19]

Something[^20]

Something[^21]

Something[^22]

Something[^23]

Something[^24]

Something[^25]

Something[^26]

Something[^27]

Something[^28]

Something[^29]

Something[^30]

Something[^31]

Something[^32]

Something[^33]

Something[^34]

Something[^35]

Something[^36]

Something[^37]

Something[^38]

Something[^39]

Something[^40]

Something[^41]

Something[^42]

Something[^43]

Something[^44]

Something[^45]

Something[^46]

Something[^47]

Something[^48]

Something[^49]

Something[^50]

Something[^51]

Something[^52]

Something[^53]

Something[^54]

Something[^55]

Something[^56]

Something[^57]

Something[^58]

Something[^59]

Something[^60]

Something[^61]

Something[^62]

Something[^63]

Something[^64]

Something[^65]

Something[^66]

Something[^67]

Something[^68]

Something[^69]

Something[^70]

Something[^71]

Something[^72]

Something[^73]

Something[^74]

Something[^75]

Something[^76]

Something[^77]

Something[^78]

Something[^79]

Something[^80]

Something[^81]

Something[^82]

Something[^83]

Something[^84]

Something[^85]

Something[^86]

Something[^87]

Something[^88]

Something[^89]

Something[^90]

Something[^91]

Something[^92]

Something[^93]

Something[^94]

Something[^95]

Something[^96]

Something[^97]

Something[^98]

Something[^99]

Something[^100]

Something[^101]

Something[^102]

Something[^103]

Something[^104]

Something[^105]

Something[^106]

Something[^107]

Something[^108]

Something[^109]

Something[^110]

Something[^111]

Something[^112]

Something[^113]

Something[^114]

Something[^115]

Something[^116]

Something[^117]

Something[^118]

Something[^119]

Something[^120]

Something[^121]

Something[^122]

Something[^123]

Something[^124]

Something[^125]

Something[^126]

Something[^127]

Something[^128]

Something[^129]

Something[^130]

Something[^131]

Something[^132]

Something[^133]

Something[^134]

Something[^135]

Something[^136]

Something[^137]

Something[^138]

Something[^139]

Something[^140]

Something[^141]

Something[^142]

Something[^143]

Something[^144]

Something[^145]

Something[^146]

Something[^147]

Something[^148]

Something[^149]

Something[^150]

[^1]: Another thing

[^2]: Another thing

[^3]: Another thing

[^4]: Another thing

[^5]: Another thing

[^6]: Another thing

[^7]: Another thing

[^8]: Another thing

[^9]: Another thing

[^10]: Another thing

[^11]: Another thing

[^12]: Another thing

[^13]: Another thing

[^14]: Another thing

[^15]: Another thing

[^16]: Another thing

[^17]: Another thing

[^18]: Another thing

[^19]: Another thing

[^20]: Another thing

[^21]: Another thing

[^22]: Another thing

[^23]: Another thing

[^24]: Another thing

[^25]: Another thing

[^26]: Another thing

[^27]: Another thing

[^28]: Another thing

[^29]: Another thing

[^30]: Another thing

[^31]: Another thing

[^32]: Another thing

[^33]: Another thing

[^34]: Another thing

[^35]: Another thing

[^36]: Another thing

[^37]: Another thing

[^38]: Another thing

[^39]: Another thing

[^40]: Another thing

[^41]: Another thing

[^42]: Another thing

[^43]: Another thing

[^44]: Another thing

[^45]: Another thing

[^46]: Another thing

[^47]: Another thing

[^48]: Another thing

[^49]: Another thing

[^50]: Another thing

[^51]: Another thing

[^52]: Another thing

[^53]: Another thing

[^54]: Another thing

[^55]: Another thing

[^56]: Another thing

[^57]: Another thing

[^58]: Another thing

[^59]: Another thing

[^60]: Another thing

[^61]: Another thing

[^62]: Another thing

[^63]: Another thing

[^64]: Another thing

[^65]: Another thing

[^66]: Another thing

[^67]: Another thing

[^68]: Another thing

[^69]: Another thing

[^70]: Another thing

[^71]: Another thing

[^72]: Another thing

[^73]: Another thing

[^74]: Another thing

[^75]: Another thing

[^76]: Another thing

[^77]: Another thing

[^78]: Another thing

[^79]: Another thing

[^80]: Another thing

[^81]: Another thing

[^82]: Another thing

[^83]: Another thing

[^84]: Another thing

[^85]: Another thing

[^86]: Another thing

[^87]: Another thing

[^88]: Another thing

[^89]: Another thing

[^90]: Another thing

[^91]: Another thing

[^92]: Another thing

[^93]: Another thing

[^94]: Another thing

[^95]: Another thing

[^96]: Another thing

[^97]: Another thing

[^98]: Another thing

[^99]: Another thing

[^100]: Another thing

[^101]: Another thing

[^102]: Another thing

[^103]: Another thing

[^104]: Another thing

[^105]: Another thing

[^106]: Another thing

[^107]: Another thing

[^108]: Another thing

[^109]: Another thing

[^110]: Another thing

[^111]: Another thing

[^112]: Another thing

[^113]: Another thing

[^114]: Another thing

[^115]: Another thing

[^116]: Another thing

[^117]: Another thing

[^118]: Another thing

[^119]: Another thing

[^120]: Another thing

[^121]: Another thing

[^122]: Another thing

[^123]: Another thing

[^124]: Another thing

[^125]: Another thing

[^126]: Another thing

[^127]: Another thing

[^128]: Another thing

[^129]: Another thing

[^130]: Another thing

[^131]: Another thing

[^132]: Another thing

[^133]: Another thing

[^134]: Another thing

[^135]: Another thing

[^136]: Another thing

[^137]: Another thing

[^138]: Another thing

[^139]: Another thing

[^140]: Another thing

[^141]: Another thing

[^142]: Another thing

[^143]: Another thing

[^144]: Another thing

[^145]: Another thing

[^146]: Another thing

[^147]: Another thing

[^148]: Another thing

[^149]: Another thing

[^150]: Another thing
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders tables-2.txt`, () => {
    const input = `foo|bar|baz
---|---|---
   | Q |
 W |   | W
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders tables.txt`, () => {
    const input = `First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell

| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |

| Item      | Value |
| :-------- | -----:|
| Computer  | $1600 |
| Phone     |   $12 |
| Pipe      |    $1 |

| Function name | Description                    |
| ------------- | ------------------------------ |
| \`help()\`      | Display the help window.       |
| \`destroy()\`   | **Destroy your computer!**     |

|foo|bar|baz|
|:--|:-:|--:|
|   | Q |   |
|W  |   |  W|

Three spaces in front of a table:

   First Header | Second Header
   ------------ | -------------
   Content Cell | Content Cell
   Content Cell | Content Cell

   | First Header | Second Header |
   | ------------ | ------------- |
   | Content Cell | Content Cell  |
   | Content Cell | Content Cell  |

Four spaces is a code block:

    First Header | Second Header
    ------------ | -------------
    Content Cell | Content Cell
    Content Cell | Content Cell
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders fenced_code.txt`, () => {
    const input = `index 0000000..6e956a9

\`\`\`
--- /dev/null
+++ b/test/data/stripped_text/mike-30-lili
@@ -0,0 +1,27 @@
+Summary:
+ drift_mod.py |    1 +
+ 1 files changed, 1 insertions(+), 0 deletions(-)
+
+commit da4bfb04debdd994683740878d09988b2641513d
+Author: Mike Dirolf <mike@dirolf.com>
+Date:   Tue Jan 17 13:42:28 2012 -0500
+
+\`\`\`
+minor: just wanted to push something.
+\`\`\`
+
+diff --git a/drift_mod.py b/drift_mod.py
+index 34dfba6..8a88a69 100644
+
+\`\`\`
+--- a/drift_mod.py
++++ b/drift_mod.py
+@@ -281,6 +281,7 @@ CONTEXT_DIFF_LINE_PATTERN = re.compile(r'^('
+                                        '|\\+ .*'
+                                        '|- .*'
+                                        ')$')
++
+ def wrap_context_diffs(message_text):
+     return _wrap_diff(CONTEXT_DIFF_HEADER_PATTERN,
+                       CONTEXT_DIFF_LINE_PATTERN,
+\`\`\`
\`\`\`
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders github_flavored.txt`, () => {
    const input = `index 0000000..6e956a9

\`\`\`diff
--- /dev/null
+++ b/test/data/stripped_text/mike-30-lili
@@ -0,0 +1,27 @@
+Summary:
+ drift_mod.py |    1 +
+ 1 files changed, 1 insertions(+), 0 deletions(-)
+
+commit da4bfb04debdd994683740878d09988b2641513d
+Author: Mike Dirolf <mike@dirolf.com>
+Date:   Tue Jan 17 13:42:28 2012 -0500
+
+\`\`\`
+minor: just wanted to push something.
+\`\`\`
+
+diff --git a/drift_mod.py b/drift_mod.py
+index 34dfba6..8a88a69 100644
+
+\`\`\`
+--- a/drift_mod.py
++++ b/drift_mod.py
+@@ -281,6 +281,7 @@ CONTEXT_DIFF_LINE_PATTERN = re.compile(r'^('
+                                        '|\\+ .*'
+                                        '|- .*'
+                                        ')$')
++
+ def wrap_context_diffs(message_text):
+     return _wrap_diff(CONTEXT_DIFF_HEADER_PATTERN,
+                       CONTEXT_DIFF_LINE_PATTERN,
+\`\`\`
\`\`\`

Test support for foo+bar lexer names.

\`\`\`html+jinja
<title>{% block title %}{% endblock %}</title>
<ul>
{% for user in users %}
  <li><a href="{{ user.url }}">{{ user.username }}</a></li>
{% endfor %}
</ul>
\`\`\`

Test support for foo+bar lexer names in citation.

> \`\`\`html+jinja
> <title>{% block title %}{% endblock %}</title>
> <ul>
>
> {% for user in users %}
>   <li><a href="{{ user.url }}">{{ user.username }}</a></li>
> {% endfor %}
>
> </ul>
> \`\`\`

Test support for foo+bar lexer names with hightlight.

\`\`\`html+jinja hl_lines="2-4"
<title>{% block title %}{% endblock %}</title>
<ul>

{% for user in users %}
  <li><a href="{{ user.url }}">{{ user.username }}</a></li>
{% endfor %}

</ul>
\`\`\`

Test support for foo+bar lexer names with linenostart.

\`\`\`html+jinja linenostart=10
<title>{% block title %}{% endblock %}</title>
<ul>

{% for user in users %}
  <li><a href="{{ user.url }}">{{ user.username }}</a></li>
{% endfor %}

</ul>
\`\`\`

Test support for foo+bar lexer names with both.

\`\`\`html+jinja hl_lines="2-4" linenostart=10
<title>{% block title %}{% endblock %}</title>
<ul>
{% for user in users %}
  <li><a href="{{ user.url }}">{{ user.username }}</a></li>
{% endfor %}
</ul>
\`\`\`

Code without matching end

~~~~html

~~~

Code into paragraph
\`\`\`html+jinja hl_lines= "2-4" linenostart=10
<title>{% block title %}{% endblock %}</title>
<ul>
{% for user in users %}
  <li><a href="{{ user.url }}">{{ user.username }}</a></li>
{% endfor %}
</ul>
\`\`\`
with end
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

})

describe('misc', () => {
  it(`renders CRLF_line_ends.txt`, () => {
    const input = `foo

<div>
bar
</div>
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders adjacent-headers.txt`, () => {
    const input = `# this is a huge header #
## this is a smaller header ##
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders amp-in-url.txt`, () => {
    const input = `[link](http://www.freewisdom.org/this&that)
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders ampersand.txt`, () => {
    const input = `&

AT&T


`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders arabic.txt`, () => {
    const input = `
بايثون
=====

**بايثون** لغة برمجة حديثة بسيطة، واضحة، سريعة ، تستخدم أسلوب البرمجة الكائنية (OOP) وقابلة للتطوير بالإضافة إلى أنها مجانية و مفتوحة المصدر. صُنفت بالأساس كلغة تفسيرية ، بايثون مصممة أصلاً للأداء بعض المهام الخاصة أو المحدودة. إلا أنه يمكن استخدامها بايثون لإنجاز المشاريع الضخمه كأي لغة برمجية أخرى،  غالباً ما يُنصح المبتدئين في ميدان البرمجة بتعلم هذه اللغة لأنها من بين أسهل اللغات البرمجية تعلماً.

نشأت بايثون في مركز CWI (مركز العلوم والحاسب الآلي) بأمستردام على يد جويدو فان رُزوم. تم تطويرها بلغة C. أطلق فان رُزوم اسم "بايثون" على لغته تعبيرًا عن إعجابه بفِرقَة مسرحية هزلية شهيرة من بريطانيا، كانت تطلق على نفسها اسم مونتي بايثون Monty Python.

تتميز بايثون بمجتمعها النشط ، كما أن لها الكثير من المكتبات البرمجية ذات الأغراض الخاصة والتي برمجها أشخاص من مجتمع هذه اللغة ، مثلاً مكتبة PyGame التي توفر مجموعه من الوظائف من اجل برمجة الالعاب. ويمكن لبايثون التعامل مع العديد من أنواع قواعد البيانات مثل MySQL وغيره.

## أمثلة
مثال Hello World!

    print "Hello World!"


مثال لاستخراج المضروب Factorial :

    num = 1
    x = raw_input('Insert the number please ')
    x = int(x)

    if x > 69:
     print 'Math Error !'
    else:
     while x > 1:
      num *= x
      x = x-1

     print num



## وصلات خارجية
* [الموقع الرسمي للغة بايثون](http://www.python.org)

 بذرة حاس
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders autolinks_with_asterisks.txt`, () => {
    const input = `<http://some.site/weird*url*thing>

`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders backtick-escape.txt`, () => {
    const input = `\\\`This also should not be in code.\\\`
\\\\\`This should be in code.\\\\\`
\\\`And finally this should not be in code.\`
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders blank-block-quote.txt`, () => {
    const input = `
aaaaaaaaaaa

> 

bbbbbbbbbbb
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders blank_lines_in_codeblocks.txt`, () => {
    const input = `Preserve blank lines in code blocks with tabs:

    a code block
    
    two tabbed lines
    
    
    three tabbed lines
    
    
    
    four tabbed lines
    
    
    
    
    five tabbed lines
    
    
    
    
    
    six tabbed lines
    
    
    
    
    
    
    End of tabbed block
    
    
    
    
    
    
And without tabs:

    a code block

    two blank lines


    three blank lines



    four blank lines




    five blank lines





    six blank lines






    End of block






End of document`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders block_html5.txt`, () => {
    const input = `<section>
    <header>
        <hgroup>
            <h1>Hello :-)</h1>
        </hgroup>
    </header>
    <figure>
        <img src="image.png" alt="" />
        <figcaption>Caption</figcaption>
    </figure>
    <footer>
        <p>Some footer</p>
    </footer>
</section><figure></figure>
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders block_html_attr.txt`, () => {
    const input = `<blockquote>
Raw HTML processing should not confuse this with the blockquote below
</blockquote>
<div id="current-content">
    <div id="primarycontent" class="hfeed">
        <div id="post-">
            <div class="page-head">
                <h2>Header2</h2>
            </div>
            <div class="entry-content">
                <h3>Header3</h3>
                    <p>Paragraph</p>
                <h3>Header3</h3>
                    <p>Paragraph</p>
                    <blockquote>
                        <p>Paragraph</p>
                    </blockquote>
                    <p>Paragraph</p>
                    <p><a href="/somelink">linktext</a></p>
            </div>
        </div><!-- #post-ID -->
        <!-- add contact form here -->
    </div><!-- #primarycontent -->
</div><!-- #current-content -->
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders block_html_simple.txt`, () => {
    const input = `<p>foo</p>
<ul>
<li>
<p>bar</p>
</li>
<li>
<p>baz</p>
</li>
</ul>
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders blockquote-below-paragraph.txt`, () => {
    const input = `Paragraph
> Block quote
> Yep

Paragraph
>no space
>Nope

Paragraph one
> blockquote
More blockquote.
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders blockquote-hr.txt`, () => {
    const input = `This is a paragraph.

---

> Block quote with horizontal lines.
>
> ---
>
> > Double block quote.
> >
> > ---
> >
> > End of the double block quote.

> A new paragraph.
> With multiple lines.
Even a lazy line.
>
> ---
>
> The last line.
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders blockquote.txt`, () => {
    const input = `> blockquote with no whitespace before \`>\`.

foo

 > blockquote with one space before the \`>\`.

bar

  > blockquote with 2 spaces.

baz

   > this has three spaces so its a paragraph.

blah

    > this one had four so it's a code block.

>   > this nested blockquote has 0 on level one and 3 (one after the first \`>\` + 2 more) on level 2.

>    > and this has 4 on level 2 - another code block.
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders bold_links.txt`, () => {
    const input = `**bold [link](http://example.com)**
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders br.txt`, () => {
    const input = `Output:

    <p>Some of these words <em>are emphasized</em>.
    Some of these words <em>are emphasized also</em>.</p>

    <p>Use two asterisks for <strong>strong emphasis</strong>.
    Or, if you prefer, <strong>use two underscores instead</strong>.</p>



Unordered (bulleted) lists use asterisks, pluses, and hyphens (\`*\`,
\`+\`, and \`-\`) as list markers. These three markers are
interchangable; this:
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders bracket_re.txt`, () => {
    const input = `
[x
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
xxx xxx xxx xxx xxx xxx xxx xxx
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders brackets-in-img-title.txt`, () => {
    const input = `![alt](local-img.jpg)
![alt](local-img.jpg "")
![alt](local-img.jpg "normal title")

![alt](local-img.jpg "(just title in brackets)")
![alt](local-img.jpg "title with brackets (I think)")

![alt](local-img.jpg "(")
![alt](local-img.jpg "(open only")
![alt](local-img.jpg ")")
![alt](local-img.jpg "close only)")

`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders code-first-line.txt`, () => {
    const input = `    print "This is a code block."
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders comments.txt`, () => {
    const input = `X<0

X>0

<!-- A comment -->

<div>as if</div>

<!-- comment -->
__no blank line__
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders div.txt`, () => {
    const input = `<div id="sidebar">

   _foo_

</div>

And now in uppercase:

<DIV>
foo
</DIV>
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders em-around-links.txt`, () => {
    const input = `  - *[Python in Markdown](https://pythonhosted.org/Markdown/) by some
    great folks* - This *does* work as expected.
  - _[Python in Markdown](https://pythonhosted.org/Markdown/) by some
    great folks_ - This *does* work as expected.
  - [_Python in Markdown_](https://pythonhosted.org/Markdown/) by some
    great folks - This *does* work as expected.
  - [_Python in Markdown_](https://pythonhosted.org/Markdown/) _by some
    great folks_ - This *does* work as expected.

_[Python in Markdown](https://pythonhosted.org/Markdown/) by some
great folks_ - This *does* work as expected.
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders em_strong.txt`, () => {
    const input = `One asterisk: *

One underscore: _

Two asterisks: **

With spaces: * *

Two underscores __

with spaces: _ _

three asterisks: ***

with spaces: * * *

three underscores: ___

with spaces: _ _ _

One char: _a_
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders email.txt`, () => {
    const input = `
asdfasdfadsfasd <yuri@freewisdom.org> or you can say 
instead <mailto:yuri@freewisdom.org>

<bob&sue@example.com>
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders escaped_chars_in_js.txt`, () => {
    const input = `<span id="e116142240">[javascript protected email address]</span>
<script type="text/javascript">
    var a="gqMjyw7lZCaKk6p0J3uAUYS1.dbIW2hXzDHmiVNotOPRe_Ev@c4Gs58+LBr-F9QTfxn";
    var b=a.split("").sort().join("");
    var c="F_-F6F_-FMe_";
    var d="";
    for(var e=0;e<c.length;e++)
    d+=b.charAt(a.indexOf(c.charAt(e)));
        document
            .getElementById("e116142240")
            .innerHTML="<a href=\\"mailto:"+d+"\\">"+d+"</a>";
</script>
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders h1.txt`, () => {
    const input = `Header
------  

Header 2 
========

### H3   

H1  
=

H2
--  
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders image-2.txt`, () => {
    const input = `[*link!*](http://src.com/)

*[link](http://www.freewisdom.org)*
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders image.txt`, () => {
    const input = `
![Poster](http://humane_man.jpg "The most humane man.")

![Poster][]

[Poster]:http://humane_man.jpg "The most humane man."

![Blank]()`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders image_in_links.txt`, () => {
    const input = `

[![altname](path/to/img_thumb.png)](path/to/image.png)
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders ins-at-start-of-paragraph.txt`, () => {
    const input = `<ins>Hello, fellow developer</ins> this ins should be wrapped in a p.
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders inside_html.txt`, () => {
    const input = `<a href="stuff"> __ok__? </a>
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders lazy-block-quote.txt`, () => {
    const input = `> Line one of lazy block quote.
Line two of lazy block quote.

> Line one of paragraph two.
Line two of paragraph two.
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders link-with-parenthesis.txt`, () => {
    const input = `[ZIP archives](http://en.wikipedia.org/wiki/ZIP_(file_format) "ZIP (file format) - Wikipedia, the free encyclopedia")
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders lists.txt`, () => {
    const input = `
* A multi-paragraph list, 
unindented.



Simple tight list

* Uno
* Due
* Tri

A singleton tight list:

* Uno

A lose list:

* One

* Two

* Three

A lose list with paragraphs

* One one one one

    one one one one

* Two two two two
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders lists2.txt`, () => {
    const input = `* blah blah blah
sdf asdf asdf asdf asdf
asda asdf asdfasd
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders lists3.txt`, () => {
    const input = `* blah blah blah
    sdf asdf asdf asdf asdf
    asda asdf asdfasd
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders lists4.txt`, () => {
    const input = `
* item1
* item2
    1. Number 1
    2. Number 2
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders lists5.txt`, () => {
    const input = `> This is a test of a block quote
> With just two lines

A paragraph

> This is a more difficult case
> With a list item inside the quote
>
> * Alpha
> * Beta
> Etc.

`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders lists6.txt`, () => {
    const input = `Test five or more spaces as start of list:

*     five spaces

not first item:

* one space
*     five spaces

loose list:

* one space

*     five spaces
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders lists8.txt`, () => {
    const input = `1. > Four-score and seven years ago...

2. > We have nothing to fear...

3. > This is it...

---

* > Four-score and sever years ago
  > our fathers brought forth

* > We have nothing to fear
  > but fear itself

* > This is it
  > as far as I'm concerned
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders mismatched-tags.txt`, () => {
    const input = `<p>Some text</p><div>some more text</div>

and a bit more

<p>And this output</p> *Compatible with PHP Markdown Extra 1.2.2 and Markdown.pl1.0.2b8:*

<!-- comment --><p><div>text</div><br /></p><br />

Should be in p
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders missing-link-def.txt`, () => {
    const input = `This is a [missing link][empty] and a [valid][link] and [missing][again].

[link]: http://example.com

`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders multi-line-tags.txt`, () => {
    const input = `
<div>

asdf asdfasd

</div>

<div>

foo bar

</div>
No blank line.
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders multi-paragraph-block-quote.txt`, () => {
    const input = `> This is line one of paragraph one
> This is line two of paragraph one

> This is line one of paragraph two



> This is another blockquote.
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders nested-lists.txt`, () => {
    const input = `* item 1

    paragraph 2

* item 2

    * item 2-1
    * item 2-2

        * item 2-2-1

    * item 2-3

        * item 2-3-1

* item 3

plain text

* item 1
    * item 1-1
    * item 1-2
        * item 1-2-1
* item 2
* item 3
* item 4
    * item 4-1
    * item 4-2
    * item 4-3

        Code under item 4-3

    Paragraph under item 4
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders nested-patterns.txt`, () => {
    const input = `___[link](http://example.com)___
***[link](http://example.com)***
**[*link*](http://example.com)**
__[_link_](http://example.com)__
__[*link*](http://example.com)__
**[_link_](http://example.com)**
[***link***](http://example.com)

***I am ___italic_ and__ bold* I am \`just\` bold**

Example __*bold italic*__ on the same line __*bold italic*__.

Example **_bold italic_** on the same line **_bold italic_**.
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders normalize.txt`, () => {
    const input = `
[Link](http://www.stuff.com/q?x=1&y=2<>)
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders numeric-entity.txt`, () => {
    const input = `
<user@gmail.com>

This is an entity: &#234; 
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders para-with-hr.txt`, () => {
    const input = `Here is a paragraph, followed by a horizontal rule.
***
Followed by another paragraph.

Here is another paragraph, followed by:
*** not an HR.
Followed by more of the same paragraph.
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders php.txt`, () => {
    const input = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
            "http://www.w3.org/TR/html4/strict.dtd">

<b>This should have a p tag</b>

<!--This is a comment -->

<div>This shouldn't</div>

<?php echo "block_level";?>

 <?php echo "not_block_level";?>

`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders smart_em.txt`, () => {
    const input = `_emphasis_

this_is_not_emphasis

[_punctuation with emphasis_]

[_punctuation_with_emphasis_]

[punctuation_without_emphasis]
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders span.txt`, () => {
    const input = `
<span id="someId"> Foo *bar* Baz </span>

<div><b>*foo*</b></div>

<div id="someId"> Foo *bar* Baz </div>

<baza id="someId"> Foo *bar* Baz </baza>


`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders strong-with-underscores.txt`, () => {
    const input = `__this_is_strong__
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders strongintags.txt`, () => {
    const input = `this is a [**test**](http://example.com/)

this is a second **[test](http://example.com)**

reference **[test][]**
reference [**test**][]


`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders underscores.txt`, () => {
    const input = `THIS_SHOULD_STAY_AS_IS

Here is some _emphasis_, ok?

Ok, at least _this_ should work.

THIS__SHOULD__STAY

Here is some __strong__ stuff.

THIS___SHOULD___STAY?
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

})

describe('options', () => {
  it(`renders no-attributes.txt`, () => {
    const input = `Regression *test* for issue 87

It's run with enable_attributes=False so this {@id=explanation} should not become an attribute
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

})

describe('php', () => {
  it(`renders Code Spans.txt`, () => {
    const input = `From \`<!--\` to \`-->\`
on two lines.

From \`<!--\`
to \`-->\`
on three lines.
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders Code block on second line.txt`, () => {
    const input = `
    Codeblock on second line
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders Horizontal Rules.txt`, () => {
    const input = `Horizontal rules:

- - -
 
* * *
 
***
 
---
 
___

Not horizontal rules (testing for a bug in 1.0.1j):

+++

,,,

===

???

AAA

jjj

j j j

n n n
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders Inline HTML comments.txt`, () => {
    const input = `Paragraph one.

<!-- double--dash (invalid SGML comment) -->

Paragraph two.

<!-- enclosed tag </div> -->

The end.
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders MD5 Hashes.txt`, () => {
    const input = `The MD5 value for \`+\` is "26b17225b626fb9238849fd60eabdf60".

<p>test</p>

The MD5 value for \`<p>test</p>\` is:

6205333b793f34273d75379350b36826
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

})

describe('pl', () => {
  it(`renders Amps and angle encoding.txt`, () => {
    const input = `AT&T has an ampersand in their name.

AT&amp;T is another way to write it.

This & that.

4 < 5.

6 > 5.

Here's a [link] [1] with an ampersand in the URL.

Here's a link with an amersand in the link text: [AT&T] [2].

Here's an inline [link](/script?foo=1&bar=2).

Here's an inline [link](</script?foo=1&bar=2>).


[1]: http://example.com/?foo=1&bar=2
[2]: http://att.com/  "AT&T"`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders Auto links.txt`, () => {
    const input = `Link: <http://example.com/>.

With an ampersand: <http://example.com/?foo=1&bar=2>

* In a list?
* <http://example.com/>
* It should.

> Blockquoted: <http://example.com/>

Auto-links should not occur here: \`<http://example.com/>\`

	or here: <http://example.com/>`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders Blockquotes with code blocks.txt`, () => {
    const input = `> Example:
> 
>     sub status {
>         print "working";
>     }
> 
> Or:
> 
>     sub status {
>         return "working";
>     }
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders Horizontal rules.txt`, () => {
    const input = `Dashes:

---

 ---
 
  ---

   ---

	---

- - -

 - - -
 
  - - -

   - - -

	- - -


Asterisks:

***

 ***
 
  ***

   ***

	***

* * *

 * * *
 
  * * *

   * * *

	* * *


Underscores:

___

 ___
 
  ___

   ___

    ___

_ _ _

 _ _ _
 
  _ _ _

   _ _ _

    _ _ _
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders Inline HTML comments.txt`, () => {
    const input = `Paragraph one.

<!-- This is a simple comment -->

<!--
	This is another comment.
-->

Paragraph two.

<!-- one comment block -- -- with two comments -->

The end.
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders Links, shortcut references.txt`, () => {
    const input = `This is the [simple case].

[simple case]: /simple



This one has a [line
break].

This one has a [line 
break] with a line-ending space.

[line break]: /foo


[this] [that] and the [other]

[this]: /this
[that]: /that
[other]: /other
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders Nested blockquotes.txt`, () => {
    const input = `> foo
>
> > bar
>
> foo
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders Ordered and unordered lists.txt`, () => {
    const input = `Asterisks tight:

*	asterisk 1
*	asterisk 2
*	asterisk 3


Asterisks loose:

*	asterisk 1

*	asterisk 2

*	asterisk 3

* * *

Pluses tight:

+	Plus 1
+	Plus 2
+	Plus 3


Pluses loose:

+	Plus 1

+	Plus 2

+	Plus 3

* * *


Minuses tight:

-	Minus 1
-	Minus 2
-	Minus 3


Minuses loose:

-	Minus 1

-	Minus 2

-	Minus 3


Tight:

1.	First
2.	Second
3.	Third

and:

1. One
2. Two
3. Three


Loose using tabs:

1.	First

2.	Second

3.	Third

and using spaces:

1. One

2. Two

3. Three

Multiple paragraphs:

1.	Item 1, graf one.

	Item 2. graf two. The quick brown fox jumped over the lazy dog's
	back.

2.	Item 2.

3.	Item 3.



*	Tab
	*	Tab
		*	Tab

Here's another:

1. First
2. Second:
	* Fee
	* Fie
	* Foe
3. Third

Same thing but with paragraphs:

1. First

2. Second:
	* Fee
	* Fie
	* Foe

3. Third


This was an error in Markdown 1.0.1:

*	this

	*	sub

	that
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders Strong and em together.txt`, () => {
    const input = `***This is strong and em.***

So is ***this*** word.

___This is strong and em.___

So is ___this___ word.
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders Tabs.txt`, () => {
    const input = `+	this is a list item
	indented with tabs

+   this is a list item
    indented with spaces

Code:

	this code block is indented by one tab

And:

		this code block is indented by two tabs

And:

	+	this is an example list item
		indented with tabs
	
	+   this is an example list item
	    indented with spaces
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders Tidyness.txt`, () => {
    const input = `> A list within a blockquote:
> 
> *	asterisk 1
> *	asterisk 2
> *	asterisk 3
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

})

describe('zds', () => {
  it(`renders align.txt`, () => {
    const input = `A simple paragraph

->A centered paragraph<-

a simple paragraph

->A right aligned paragraph->

an other simple paragraph

A simple paragraph

->A centered paragraph<-

a simple paragraph

->A right aligned paragraph->

an other simple paragraph

->A centered paragraph.

Containing two paragraph<-

an other simple paragraph

->A right aligned paragraph.

Containing two paragraph<-

an other simple paragraph

->A centered paragraph.<-
->An other centered paragraph.<-

a simple paragraph

->A started block without end.
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders comments.txt`, () => {
    const input = `Blabla<--COMMENTS hahaha COMMENTS-->Balbla

\`\`\`
Blabla<--COMMENTS hahaha COMMENTS-->Balbla
\`\`\`

<--COMMENTS Unfinished block
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders customblock.txt`, () => {
    const input = `[[s]]
| Secret Block

[[s]]
|Secret Block

[[secret]]
| another

> [[s]]
> | > Blockquote in secret block in blockquote

[[i]]
| Information Block

[[information]]
| an other

[[q]]
| Question Block

[[question]]
| an other

[[a]]
| Attention Block

[[attention]]
| an other

[[e]]
| Erreur Block

[[erreur]]
| an other


[[se]]
| not a block

[[secretsecret]]
| not a block

[[SECRET]]
| not a block

[[s]]
| Multiline block
|
| > with blockquote !

| Not a block

content before
[[s]]
|A Block
with content after

[[erreur  | a **title**]]
| content

[[neutre  | a **title**]]
| content
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders delext.txt`, () => {
    const input = `Blabla ~~truc~~ kxcvj ~~sdv sd~~ sdff

sdf ~~~~ df

sfdgs ~ ~ dfg ~~ dgsg ~ qs
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders emoticons.txt`, () => {
    const input = `Lolilol :) Hey :D

:)

> Citation

:D Ce n'est pas une légende

![toto](https://zestedesavoir.com/media/galleries/3014/bee33fae-2216-463a-8b85-d1d9efe2c374.png)

:D ce n'est pas une légende non plus`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders grid_tables.txt`, () => {
    const input = `# Grid table

## Basic example

+-------+----------+------+
| Table Headings   | Here |
+-------+----------+------+
| Sub   | Headings | Too  |
+=======+==========+======+
| cell  | column spanning |
+ spans +----------+------+
| rows  | normal   | cell |
+-------+----------+------+
| multi | cells can be    |
| line  | *formatted*     |
|       | **paragraphs**  |
| cells |                 |
| too   |                 |
+-------+-----------------+

+---+---+---+
| A | B | C |
+===+===+===+
| D | E     |
|   +---+---+
|   | F | G |
+---+---+---+

+---+-------+
| A | B     |
|   +---+---+
|   | C | D |
|   +---+---+
|   | E     |
+---+-------+

+-----------+
| A         |
+---+---+---+
| B | C | D |
|   +---+   |
|   | E |   |
+---+---+---+

+---+---+---+
| C | D | E |
|   |   +---+
|   |   | F |
|   +---+---+
|   | G | H |
|   |   +---+
|   |   | I |
+---+---+---+

+---+---+---+
| A | B | C |
+---+   |   |
| D |   |   |
+---+---+   |
| E | F |   |
+---+   |   |
| G |   |   |
+---+---+---+

+---+---+---+---+
| A | B | C | D |
+---+---+---+---+
| E     | F     |
+-------+-------+
| G             |
+---------------+

+---------------+
| A             |
+-------+-------+
| B     | C     |
+---+---+---+---+
| D | E | F | G |
+---+---+---+---+


+---+---+---+---+---+---+
| A | B | C | D | E | F |
|   |   +---+---+   |   |
|   |   | G     |   |   |
|   +---+-------+---+   |
|   | H             |   |
+---+---------------+---+
| I                     |
+-----------------------+

+---+-------------------+
| A | B                 |
+===+===================+
| C |                   |
|   | +---+---+---+---+ |
|   | | D | E | F | G | |
|   | +---+---+---+---+ |
|   | | H             | |
|   | +---------------+ |
|   |                   |
+---+-------------------+

+---+---------------------------------------------------------------+---+
| H |                                                               |He |
+---+---+---------------------------------------+---+---+---+---+---+---+
|Li |Be |                                       | B | C | N | O | F |Ne |
+---+---+                                       +---+---+---+---+---+---+
|Na |Mg |                                       |Al |Si | P | S |Cl |Ar |
+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
| K |Ca |Sc |Ti | V |Cr |Mn |Fe |Co |Ni |Cu |Zn |Ga |Ge |As |Se |Br |Kr |
+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
|Rb |Sr | Y |Zr |Nb |Mo |Tc |Ru |Rh |Pd |Ag |Cd |In |Sn |Sb |Te | I |Xe |
+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
|Cs |Ba |LAN|Hf |Ta | W |Re |Os |Ir |Pt |Au |Hg |Tl |Pb |Bi |Po |At |Rn |
+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
|Fr |Ra |ACT|                                                           |
+---+---+---+-----------------------------------------------------------+
|                                                                       |
+-----------+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
|Lanthanide |La |Ce |Pr |Nd |Pm |Sm |Eu |Gd |Tb |Dy |Ho |Er |Tm |Yb |Lu |
+-----------+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
|Actinide   |Ac |Th |Pa | U |Np |Pu |Am |Cm |Bk |Cf |Es |Fm |Md |No |Lw |
+-----------+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+

+---------+
| A       |
+---------+
Text at the end

+---------+
| A       |
+---------+
Text at the

## specific tests

In this examples, the second row should always be a full-cell

+---------------+
| A             |
+---------------+
| B | C         |
+---+---+---+---+
| D | E | F | G |
+---+---+---+---+

+---+-----------+
| A |           |
+---+-----------+
| B | C         |
+-------+---+---+
| D   E | F | G |
+-------+---+---+

+---+---+---+---+
| A | B | C | D |
+---+---+---+---+
| B | C         |
|               |
+---+---+---+---+
| D | E | F | G |
+---+---+---+---+

+---+---+---+---+
| A | B | C | D |
+---+---+---+---+
| B  | C        |
+---+---+---+---+
| D | E | F | G |
+---+---+---+---+

## Failing example

+--- A ---+

+---------+
+---------+

+---------+
| A       |
|         |

+---------+
| A       |
+=========+
| B       |
+=========+

+--- A ---+
|         |
+---------+
|         |
+---------+

Bug #107

+-----+-------+-------+-------+-------+-------+
|     | case1         | case2         | case3 |
+-----+-------+-------+-------+-------+-------+
|     | case4 | case5 | case6 | case7 |       |
+=====+=======+=======+=======+=======+=======+
|  X  |    X  |   X   |   X   |   X   |   X   |
+-----+-------+-------+-------+-------+-------+
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders math.txt without custom config`, () => {
    const input = `inline $simple$ math

*inline* $$doubledisplay$$ math

$$
display
$$

$$again$$
`
    const newMdastConfig = configOverride(defaultMdastConfig, { math: {} })
    const newHtmlConfig = configOverride(defaultHtmlConfig, { katex: {} })

    return renderString(newMdastConfig, newHtmlConfig)(input).then((html) => {
      expect((html.match(/katex-mathml/g) || []).length).toBe(4)
      expect((html.match(/span class="katex-display"/g) || []).length).toBe(1)
      expect((html.match(/inlineMath math-display/g) || []).length).toBe(0)
      expect((html.match(/div class="math/g) || []).length).toBe(1)
    })
  })

  it(`renders math.txt`, () => {
    const input = `inline $simple$ math

*inline* $$doubledisplay$$ math

$$
display
$$

$$again$$
`

    return renderString(input).then((html) => {
      expect((html.match(/katex-mathml/g) || []).length).toBe(4)
      expect((html.match(/span class="katex-display"/g) || []).length).toBe(3)
      expect((html.match(/math-inline math-display/g) || []).length).toBe(2)
      expect((html.match(/div class="math/g) || []).length).toBe(1)
    })
  })

  it(`renders kbd.txt`, () => {
    const input = `Blabla ||ok|| kxcvj ||ok foo|| sdff

sdf |||| df

sfdgs | | dfg || dgsg | qs

With two pipes: \\||key|| you'll get ||key||.

It parses inline elements inside:

* ||hell[~~o~~](#he)?||

but not block elements inside:

* ||hello: [[secret]]?||
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders subsuperscript.txt`, () => {
    const input = `Foo ^sup^ kxcvj ^sup *string*^ bar

not ^ here

neither \\^ here ^ because it's escaped

Foo ~sup~ kxcvj ~sup *string*~ bar

not ~ here

neither \\~ here ~ because it's escaped

foo ^^a^^ bar
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders urlize.txt`, () => {
    const input = `http://www.google.fr

https://www.google.fr

www.google.fr

google.fr

<http://www.google.fr>

Voici mon super lien qui termine une phrase http://www.google.fr.

https://fr.wikipedia.org/wiki/Compactifié_d'Alexandrov

https://fr.wikipedia.org/wiki/Compactifi%C3%A9_d%27Alexandrov

javascript:alert%28'Hello%20world!'%29

vbscript:msgbox%28%22Hello%20world!%22%29

livescript:alert%28'Hello%20world!'%29

mocha:[code])

jAvAsCrIpT:alert%28'Hello%20world!'%29

ja&#32;vas&#32;cr&#32;ipt:alert%28'Hello%20world!'%29

ja&#00032;vas&#32;cr&#32;ipt:alert%28'Hello%20world!'%29

ja&#x00020;vas&#32;cr&#32;ipt:alert%28'Hello%20world!'%29

ja%09&#x20;%0Avas&#32;cr&#x0a;ipt:alert%28'Hello%20world!'%29

ja%20vas%20cr%20ipt:alert%28'Hello%20world!'%29

live%20script:alert%28'Hello%20world!'%29

javascript:alert%29'XSS'%29

[sur isocpp.org](https://isocpp.org/std/status)
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })

  it(`renders video.txt`, () => {
    const input = `!(https://www.youtube.com/watch?v=FdltlrKFr1w)

!(https://www.dailymotion.com/video/x2y6lhm)

!(http://vimeo.com/133693532)

!(https://screen.yahoo.com/weatherman-gives-forecast-using-taylor-191821481.html)

!(https://youtu.be/FdltlrKFr1w)

!(http://youtube.com/watch?v=FdltlrKFr1w)

!(http://jsfiddle.net/Sandhose/BcKhe/1/)

!(http://jsfiddle.net/zgjhjv9j/)

!(http://jsfiddle.net/zgjhjv9j/1/)

!(https://www.youtube.com/watch?v=1Bh4DZ2xGmw&ab_channel=DestinationPr%C3%A9pa)

!(http://www.ina.fr/video/MAN9062216517/qui-a-vole-le-bolero-de-ravel-e01-la-naissance-du-bolero-et-la-mort-de-ravel-video.html)

This one should not be allowed:

!(http://jsfiddle.net/Sandhose/BcKhe/)

!(https://www.youtube.com/watch?v=FdltlrKFr1w)
with text after
`

    return expect(renderString(input)).resolves.toMatchSnapshot()
  })
})