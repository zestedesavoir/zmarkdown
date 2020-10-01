# International Radiotelephony Spelling Alphabet[^wiki]

Here's the NATO phonetic alphabet[^wiki]: Alfa, Bravo, Charlie, Delta, Echo, Foxtrot, Golf, Hotel, India, Juliet, Kilo, Lima, Mike, November, Oscar, Papa, Quebec, Romeo, Sierra, Tango, Uniform, Victor[^name][^consecutive], Whiskey, X-ray, Yankee, and Zulu.

And here's some more text.

[^wiki]: Read more about it here.
[^wiki]: And here.
[^wiki2]: Here's another good article on the subject.
[^name]: A great first name.
[^consecutive]: I know.

The NATO phonetic alphabet[^wi\-ki].

[^wi\-ki]: Read more about it somewhere else.

This example checks that ^[the generated] IDs do not overwrite the user's IDs[^1].

[^1]: Old behavior would, for "generated", generate a footnote with an ID set to `1`, thus overwriting this footnote.

The NATO phonetic alphabet[^wiki3].

  [^wiki3]: Read more about it somewhere else.

This is an example of an inline footnote.^[This is the _actual_ footnote.]

This one isn't even [defined][^foofoofoo].

[^both][invalid], ^[this too][].

1. [foo][bar]
2. [^foo][bar]
3. [foo][^bar]
4. [^foo][^bar]

A footnote[^2].

[^2]: Including ^[another **footnote**]

A footnote[^toString] and [^__proto__] and [^constructor].

[^toString]: See `Object.prototype.toString()`.
[^constructor]: See `Object.prototype.valueOf()`.
[^__proto__]: See `Object.prototype.__proto__()`.

foo[^abc] bar. foo[^xyz] bar

[^abc]: Baz baz

[^xyz]: Baz

Lorem ipsum dolor sit amet[^3].

Nulla finibus[^4] neque et diam rhoncus convallis.

[^3]: Consectetur **adipiscing** elit. Praesent dictum purus ullamcorper ligula semper pellentesque[^3].

    -   Containing a list.

[^4]: Nam dictum sapien nec sem ultrices fermentum. Nulla **facilisi**. In et feugiat massa.

[^5]: Nunc dapibus ipsum ut mi _ultrices_, non euismod velit pretium.

Here is some text containing a footnote[^somesamplefootnote]. You can then continue your thought...

[^somesamplefootnote]: Here is the text of the footnote itself.

Even go to a new [paragraph] and the footnotes will go to the bottom of the document[^documentdetails].

[^documentdetails]: Depending on the **final** form of your document, of course. See the documentation and experiment.

    This footnote has a second [paragraph].

[paragraph]: http://example.com

# my heading^[ref def]

or

# my heading[^ref]

[^ref]: def

First^[the generated] and then a manual numbered def[^def].


[^def]: hello

* one^[the first]
* two[^2nd]
* three[^3rd]
* four^[the last]

[^2nd]: second
[^3rd]: third

This nested footnote would not work:

[[^foo2]][baz]

[bar]: https://bar.com "bar"
[baz]: https://baz.com "baz"

[^foo2]: A footnote.

## New list continuation

1. [^foo]

[^foo]: bar baz.


# mytitle A[^footnoteRef]

[^footnoteRef]: reference in title

# mytitle B^[footnoterawhead inner]

# myti*tle C^[foo inner]*

a paragraph^[footnoteRawPar inner]