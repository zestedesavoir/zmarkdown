/* eslint-disable max-len */
const dedent = require('dedent')

const {
  defaultMdastConfig,
  renderAs,
} = require('../utils/renderer-tests')

const renderString = renderAs('latex')

test('html nodes', () => {
  const p = renderString(dedent`
    # foo
    **something <a> else**
  `)

  return expect(p).resolves.toMatchSnapshot()
})

test('link with special characters', () => {
  const p = renderString(dedent`
    [foo](http://example.com?a=b%c^{}#foo)
  `)

  return expect(p).resolves.toMatchSnapshot()
})

test('heading', () => {
  const p = renderString(dedent`
    # first level title
    ## second level title
    ### third level title
    #### fourth level title
    ##### fifth level title
    ###### sixth level title

    # a \ b
    # a } b
    # a } \ b
    # a \} b
  `)

  return expect(p).resolves.toMatchSnapshot()
})

test('paragraph', () => {
  const p = renderString(dedent`
    # first 1

    Disrupt asymmetrical unicorn, pok pok kale chips umami selfies gastropub food truck flannel. Blue bottle craft beer hexagon artisan. Chia gochujang crucifix, readymade hammock blog succulents sriracha raw denim scenester cray typewriter fashion axe art party. Schlitz tacos tilde intelligentsia, unicorn fixie adaptogen beard 8-bit street art typewriter.

    ## second 1

    Literally selfies tbh lo-fi. Actually health goth ennui, brooklyn retro polaroid sriracha. Kogi live-edge mixtape marfa street art synth. Godard synth truffaut selfies, vape fanny pack subway tile. Stumptown af pabst, try-hard fam ethical actually four dollar toast. Microdosing kogi brooklyn, locavore jianbing etsy sartorial YOLO. Williamsburg salvia photo booth readymade listicle man braid.

    Marfa pickled helvetica put a bird on it hot chicken williamsburg. Edison bulb asymmetrical keffiyeh schlitz iceland put a bird on it hoodie affogato. Tofu tote bag distillery viral knausgaard, health goth asymmetrical.

    Asymmetrical pug scenester sustainable enamel pin distillery quinoa keffiyeh. Flannel humblebrag PBR&B polaroid banh mi wolf. Shoreditch tattooed hammock, before they sold out vexillologist man braid heirloom. Activated charcoal craft beer cloud bread meh biodiesel pabst.

    ### third 1

    Art party keytar godard iceland neutra cronut. Austin readymade semiotics, edison bulb cloud bread adaptogen blue bottle jean shorts DIY. Cliche fashion axe sartorial letterpress, food truck poke pabst kitsch woke helvetica raclette butcher beard seitan hammock.

    Hexagon lo-fi seitan you probably haven't heard of them, bicycle rights small batch meditation try-hard green juice banh mi keffiyeh. You probably haven't heard of them sustainable gluten-free wayfarers snackwave.

    ### third 2
    #### fourth 1

    Mumblecore kombucha offal, health goth next level before they sold out gluten-free chicharrones keffiyeh. Mumblecore kickstarter hoodie fixie keffiyeh. Microdosing lo-fi taiyaki irony pok pok. Banjo brooklyn umami succulents flexitarian. Swag sartorial scenester synth viral.

    ##### fifth 1

    Banjo bespoke subway tile, street art drinking vinegar offal franzen. Pour-over green juice vaporware kale chips. Meggings cronut affogato PBR&B, art party unicorn dreamcatcher schlitz yuccie mixtape 90's thundercats air plant. Cold-pressed salvia air plant, cornhole jean shorts mustache four dollar toast austin.

    ### third 3

    Meditation heirloom chicharrones, sartorial man braid hot chicken sustainable. Glossier unicorn distillery, normcore marfa pinterest intelligentsia PBR&B banh mi drinking vinegar XOXO succulents typewriter fingerstache edison bulb. Meditation ethical cronut glossier cliche kickstarter.

    #### fourth 2

    Venmo bushwick food truck chartreuse fam. Everyday carry gastropub glossier, cold-pressed salvia migas keytar. Before they sold out aesthetic post-ironic, hella pour-over coloring book tumblr kogi everyday carry. Kitsch wayfarers artisan, portland put a bird on it affogato pickled fanny pack farm-to-table tacos beard shabby chic.

    #### fourth 3

    Chambray intelligentsia vape listicle. Pok pok snackwave cronut retro hot chicken, trust fund master cleanse keytar forage dreamcatcher. Taiyaki actually deep v, godard small batch irony lumbersexual unicorn cardigan af. Irony lumbersexual salvia, pitchfork fam snackwave man bun. Kitsch jianbing intelligentsia freegan, waistcoat raw denim cloud bread vice cray etsy listicle skateboard jean shorts.

    ##### fifth 2

    Asymmetrical normcore portland, vaporware viral tote bag DIY slow-carb kogi fanny pack. Keffiyeh ennui church-key, irony VHS man bun edison bulb listicle cloud bread try-hard cred lumbersexual lo-fi glossier.

    # first 2
    ## second 2
    ##### fifth 3

    Messenger bag locavore swag raclette brunch whatever, portland food truck. PBR&B cred mlkshk, poke letterpress waistcoat celiac. La croix letterpress forage keffiyeh.
  `)

  return expect(p).resolves.toMatchSnapshot()
})

test('inline-code', () => {
  const p = renderString(dedent`
    a paragraph \`with inline code\`.

    \`a
    multiline
    inlinecode\`

    \`a code with \ \`

    \`a \text in \LaTeX \\\`
  `)

  return expect(p).resolves.toMatchSnapshot()
})

test('emoticon', () => {
  const p = renderString(`foo :p bar :)`)

  return expect(p).resolves.toMatchSnapshot()
})

test('table', () => {
  const p = renderString(dedent`
    1 | 2
    --|--
    1|2
    1|2
    1|2


    1 | 2 | 3
    --|---|--
    1 | 2
    1 | 2 | 3
    1 | 2 | 3
  `)

  return expect(p).resolves.toMatchSnapshot()
})

test('blockquote', () => {
  const p = renderString(dedent`
    > a quote

    > a
    > multiline
    > quote

    ---

    > a quote

    ---

    > a
    > multiline
    > quote
  `)

  return expect(p).resolves.toMatchSnapshot()
})

test('figure+caption', () => {
  const p = renderString(dedent`
    > a
    > multiline
    > quote
    Source: With Source
  `)

  return expect(p).resolves.toMatchSnapshot()
})

test('code', () => {
  const p = renderString(dedent`
    \`\`\`python
    print('bla')
    \`\`\`

    \`\`\`python hl_lines=1,2
    print('bla')
    print('bla')
    print('bla')
    \`\`\`

    \`\`\`
    a code without lang
    \`\`\`
  `)

  return expect(p).resolves.toMatchSnapshot()
})

test('code+caption', () => {
  const p = renderString(dedent`
    \`\`\`python
    print('bla')
    \`\`\`
    Code: With Source

    \`\`\`python hl_lines=1,2
    print('bla')
    print('bla')
    print('bla')
    \`\`\`
    Code: With Source
  `)

  return expect(p).resolves.toMatchSnapshot()
})

test('list', () => {
  const p = renderString(dedent`
    - an 
    - **unordered**
    - list


    1. an
    1. \`ordered\`
    1. list
  `)

  return expect(p).resolves.toMatchSnapshot()
})

test('link', () => {
  const p = renderString(dedent`
    [an external link](https://wikipedia.com)


    [an internal link](/forums)


    [an \`external\` link](https://wikipedia.com)
  `)

  return expect(p).resolves.toMatchSnapshot()
})

test('mix-1', () => {
  const p = renderString(dedent`
    (for convenience, · are replaced with simple single spaces in the tests)
    # first 1
    
    foo··
    bar
    
    Disrupt ~~asymmetrical~~ unicorn, pok pok kale chips umami selfies gastropub food truck flannel. Blue **bottle craft** beer hexagon artisan. Chia gochujang crucifix, ^ready^ ^made^ hammock _blog succulents_ sriracha raw denim scenester cray typewriter fashion axe ~art~ *party*. Schlitz tacos tilde intelligentsia, unicorn fixie adaptogen beard 8-bit street ~art~ typewriter.
    
    ## *second* 1
    
    **Literally selfies tbh lo-fi. Actually health goth ennui, brooklyn retro polaroid sriracha. Kogi live-edge mixtape marfa street ~art~ synth. Godard synth truffaut selfies, vape fanny ~~pack~~ subway tile. Stumptown af pabst, try-hard fam ethical actually four dollar toast. Microdosing kogi brooklyn, locavore jianbing etsy sartorial _YOLO_. Williamsburg salvia photo booth ^readymade^ listicle man braid.**
    
    ---
    
    > Marfa pickled helvetica put a bird on it hot chicken williamsburg.
    > Edison bulb asymmetrical \`keffiyeh\` schlitz iceland put a bird on it hoodie affogato.
    >
    > Tofu tote bag distillery viral knausgaard, health goth asymmetrical.
    Source: Guru
    
    Asymmetrical pug scenester sustainable enamel pin distillery quinoa keffiyeh. Flannel humblebrag PBR&B polaroid banh mi wolf. Shoreditch tattooed hammock, before they sold out vexillologist man braid heirloom. Activated charcoal craft beer cloud bread meh biodiesel pabst.
    
    ### ~~third~~ 1
    
    Art party keytar godard iceland neutra cronut. Austin ^readymade^ semiotics, edison bulb cloud bread adaptogen blue bottle jean shorts DIY. Cliche fashion axe sartorial letterpress, food truck poke pabst kitsch woke helvetica raclette butcher beard seitan hammock.
    
    \`foo
    bar\`
    
    > \`fo\o
    > bar\`
    
    Hexagon lo-fi seitan you probably haven't heard of them, bicycle rights small batch meditation try-hard green juice banh mi keffiyeh. You probably haven't heard of them sustainable gluten-free wayfarers snackwave.
    
    ### third 2
    #### ~~fo~~u**r**t*h* _1_
    
    Mumblecore kombucha offal, health goth next level before they sold out gluten-free chicharrones keffiyeh. Mumblecore kickstarter hoodie fixie keffiyeh. Microdosing lo-fi taiyaki irony pok pok. Banjo brooklyn umami succulents flexitarian. Swag sartorial scenester synth viral.
    
    ##### fifth 1
    
    Banjo bespoke subway tile, street ~a*r*~^t^ drinking vinegar offal franzen. Pour-over green juice vaporware kale chips. Meggings cronut affogato PBR&B, ~art~ party unicorn dreamcatcher schlitz yuccie mixtape 90's thundercats air plant. Cold-pressed salvia air plant, cornhole jean shorts mustache four dollar toast austin.
    
    ### third 3
    
    Meditation heirloom chicharrones, sartorial man braid hot chicken sustainable. Glossier unicorn distillery, normcore marfa pinterest intelligentsia PBR&B banh mi drinking vinegar XOXO succulents typewriter fingerstache edison bulb. Meditation ethical cronut glossier cliche kickstarter.
    
    #### fourth 2
    
    Venmo bushwick food truck chartreuse fam. Everyday carry gastropub glossier, cold-pressed salvia migas keytar. Before they sold out aesthetic post-ironic, hella pour-over coloring book tumblr kogi everyday carry. Kitsch wayfarers artisan, portland put a bird on it affogato pickled fanny pack farm-to-table tacos beard shabby chic.
    
    #### fourth 3
    
    Chambray intelligentsia vape listicle. Pok pok snackwave cronut retro hot chicken, trust fund master cleanse keytar forage dreamcatcher. Taiyaki actually deep v, godard small batch irony lumbersexual unicorn cardigan af. Irony lumbersexual salvia, pitchfork fam snackwave man bun. Kitsch jianbing intelligentsia freegan, waistcoat raw denim cloud bread vice cray etsy listicle skateboard jean shorts.
    
    ##### fifth 2
    
    Asymmetrical normcore portland, vaporware viral tote bag DIY slow-carb kogi fanny pack. Keffiyeh ennui church-key, irony VHS man bun edison bulb listicle cloud bread try-hard cred lumbersexual lo-fi glossier.
    
    # first 2
    ## second 2
    ##### fifth 3
    
    Messenger bag locavore swag raclette brunch whatever, portland food truck. PBR&B cred mlkshk, poke letterpress waistcoat celiac. La croix letterpress forage keffiyeh.  
  `.replace(/·/g, ' '))

  return expect(p).resolves.toMatchSnapshot()
})

test('mix-2', () => {
  const p = renderString(dedent`
    (for convenience, · are replaced with simple single spaces in the tests)
    # first 1
    
    > Code inside quote
    > \`\`\`python
    > print('bla')
    > \`\`\`
    > Code: code source
    Source: Quotation Source
    
    \`\`\`python
    print('bla')
    \`\`\`
    Code: First ||CTRL||+||S||
    Code: Second
    
    \`\`\`python
    print('code without caption')
    \`\`\`
  `.replace(/·/g, ' '))

  return expect(p).resolves.toMatchSnapshot()
})

test('mix-3', () => {
  const p = renderString(dedent`
    # right-aligned list

    ->
    - item
    - item
    ->
    
    # centered list
    
    ->
    - item
    - item
    - item
    <-
    
    
    # left list
    
    <-
    - item
    - item
    - item
    <-
  `.replace(/·/g, ' '))

  return expect(p).resolves.toMatchSnapshot()
})

test('mix-4', () => {
  const p = renderString(dedent`
    +-------+----------+------+
    | Sub   | Headings | ABBR |
    +=======+==========+======+
    | cell  | column spanning |
    | spans +----------+------+
    | rows  | normal   | cell |
    +-------+----------+------+
    | multi | cells can be    |
    | line  | *formatted*     |
    |       | **paragraphs**  |
    | cells |                 |
    | too   |                 |
    +-------+-----------------+
    Table: The new table ABBR [^foot] with ||CTRL|| + ||S||
    
    *[ABBR]: abbreviation
    
    [^foot]: a foot
    
    +-----------+---------------------------------------------------------------+
    | title     |  image                                                        |
    +===========+===============================================================+
    | space     | ![space](https://i.ytimg.com/vi/lt0WQ8JzLz4/maxresdefault.jpg)|
    +-----------+---------------------------------------------------------------+
    
    +-----------+--------------------+
    | title     | code               |
    +===========+====================+
    | inline    | \`inline\` br        |
    |           | \`inline\`           |
    +-----------+--------------------+
    | block     | \`\`\`python          |
    |           | print('bla')       |
    |           | \`\`\`                |
    +-----------+--------------------+  
  `.replace(/·/g, ' '))

  return expect(p).resolves.toMatchSnapshot()
})

test('mix-5', () => {
  const p = renderString(dedent`
    ![](http://www.numerama.com/content/uploads/2016/07/espace.jpg)
    Figure: espace[^node]
    
    [^node]: Two things are infinite: the universe and human stupidity.  
  `.replace(/·/g, ' '))

  return expect(p).resolves.toMatchSnapshot()
})

test('mix-6', () => {
  const p = renderString(dedent`
    !(https://www.youtube.com/watch?v=8TQIvdFl4aU)
    Video: a caption
    
    !(https://www.youtube.com/watch?v=8TQIvdFl4aU)
    
    no caption
  `.replace(/·/g, ' '))

  return expect(p).resolves.toMatchSnapshot()
})

test('footnotes', () => {
  const p = renderString(dedent`
    # mytitle A[^footnoteRef]

    [^footnoteRef]: reference in title

    # mytitle B^[footnoterawhead inner]

    # myti*tle C^[foo inner]*

    a paragraph^[footnoteRawPar inner]
  `)
  return expect(p).resolves.toMatchSnapshot()
})

test('math', () => {
  const p = renderString(dedent`
    A sentence ($S$) with *italic* and inline math ($C_L$) and $$b$$ another.

    $$
    L = \frac{1}{2} \rho v^2 S C_L
    $$

    hehe
  `)
  return expect(p).resolves.toMatchSnapshot()
})

test('ping', () => {
  defaultMdastConfig.ping.pingUsername = () => true

  const p = renderString(dedent`
    Hello @you and @you_too, and @**also you**
  `)

  return expect(p).resolves.toMatchSnapshot()
})

test('custom-blocks', () => {
  defaultMdastConfig.ping.pingUsername = () => false

  const p = renderString(dedent`
    [[i]]
    | info

    [[a]]
    | warning

    [[s]]
    | secret

    [[s]]
    | imbricated spoilers
    | [[s]]
    | | and another
    | | [[s]]
    | | | and that's it

    [[s]]
    | imbricated spoilers
    | [[s]]
    | | second level
    | [[s]]
    | | second level too

    [[s]]
    | imbricated spoilers
    | [[s]]
    | | second level
    |
    | with text in between
    |
    | [[s]]
    | | second level too

    [[s]]
    | imbricated spoilers
    |
    | \`\`\`markdown
    | and here is some code
    | \`\`\`
    |
    | [[s]]
    | | second level

    [[s]]
    | do not over-flattenize
    | [[s]]
    | | expected to be flattened
    | 
    | first level
    | 
    | [[q]]
    | | this remains a question

    [[s]]
    | flattenize children of children
    | [[q]]
    | | this remains a question
    | | [[s]]
    | | | but the content in it is flattened to the question

    [[q]]
    | question \`coded\`

    [[e]]
    | **error**
    | foo bar··
    | baz
  `.replace(/·/g, ' '))

  return expect(p).resolves.toMatchSnapshot()
})

test('regression: code block without language', () => {
  const p = renderString(dedent`
    \`\`\`
    a
    \`\`\`
  `)

  return expect(p).resolves.toMatchSnapshot()
})

test('properly loads extensions - mhchem', () => {
  const markdown = '$\\ce{H2O}$'
  const result = renderString(markdown)

  return expect(result).resolves.toContain(markdown)
})

test('codes in notes', () => {
  const p = renderString(dedent`
    hello [^note][^note-caption]

    [^note]:
        test
        \`\`\`javascript
        console.log('hello')
        \`\`\`
    
    [^note-caption]:
        test
        \`\`\`javascript
        console.log('hello')
        \`\`\`
        Code: with a legend
  `.replace(/·/g, ' '))

  return expect(p).resolves.toMatchSnapshot()
})
