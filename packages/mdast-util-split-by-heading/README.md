# mdast-util-split-by-heading [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]


**mdast-util-split-by-heading** splits a markdown AST into several markdown ASTs based on their headings.

It is useful when you want to split a document with many headings into several documents, for instance one by chapter.

## Installation

[npm][]:

```bash
npm install mdast-util-split-by-heading
```

## Usage

```javascript
const unified = require('unified')
const parse = require('remark-parse')
const split = require('mdast-util-split-by-heading')

var tree = unified()
  .use(parse)
  .parse('# part\n\n## chapter \n\n Hello world \n\n # part *2*')

console.log(split(tree))
```

## API

### `split(node, options = { splitDepth: 1 })`

Splits a MDAST tree into separate trees by [heading depth](https://github.com/syntax-tree/mdast#heading).

#### `options.splitDepth = 1`

An integer greater or equal to 1 determining the heading depth you want to match when splitting.

## Examples:

```js
import dedent from 'dedent'
import unified from 'unified'
import reParse from 'remark-parse'
import split from 'mdast-util-split-by-heading'

const doSplit = (text, options) => {
  const { splitDepth = 1 } = options
  return split(
    unified().use(reParse).parse(text),
    { splitDepth: splitDepth }
  )
}

const text = dedent `
  a global introduction

  # hello

  a paragraph

  > a quote to *ensure this is parsed*

  ## a sub title

  other paragraph

  # conclusion title

  paragraph
  `

doSplit(text)
/*
{
  "introduction": {
    "type": "root",
    "children": [
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "value": "a global introduction",
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 22,
                "offset": 21
              },
              "indent": []
            }
          }
        ],
        "position": {
          "start": {
            "line": 1,
            "column": 1,
            "offset": 0
          },
          "end": {
            "line": 1,
            "column": 22,
            "offset": 21
          },
          "indent": []
        }
      }
    ]
  },
  "trees": [
    {
      "title": {
        "type": "root",
        "children": {
          "type": "heading",
          "depth": 1,
          "children": [
            {
              "type": "text",
              "value": "hello",
              "position": {
                "start": {
                  "line": 3,
                  "column": 3,
                  "offset": 25
                },
                "end": {
                  "line": 3,
                  "column": 8,
                  "offset": 30
                },
                "indent": []
              }
            }
          ],
          "position": {
            "start": {
              "line": 3,
              "column": 1,
              "offset": 23
            },
            "end": {
              "line": 3,
              "column": 8,
              "offset": 30
            },
            "indent": []
          }
        }
      },
      "children": {
        "type": "root",
        "children": [
          {
            "type": "paragraph",
            "children": [
              {
                "type": "text",
                "value": "a paragraph",
                "position": {
                  "start": {
                    "line": 5,
                    "column": 1,
                    "offset": 32
                  },
                  "end": {
                    "line": 5,
                    "column": 12,
                    "offset": 43
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 5,
                "column": 1,
                "offset": 32
              },
              "end": {
                "line": 5,
                "column": 12,
                "offset": 43
              },
              "indent": []
            }
          },
          {
            "type": "blockquote",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "a quote to ",
                    "position": {
                      "start": {
                        "line": 7,
                        "column": 3,
                        "offset": 47
                      },
                      "end": {
                        "line": 7,
                        "column": 14,
                        "offset": 58
                      },
                      "indent": []
                    }
                  },
                  {
                    "type": "emphasis",
                    "children": [
                      {
                        "type": "text",
                        "value": "ensure this is parsed",
                        "position": {
                          "start": {
                            "line": 7,
                            "column": 15,
                            "offset": 59
                          },
                          "end": {
                            "line": 7,
                            "column": 36,
                            "offset": 80
                          },
                          "indent": []
                        }
                      }
                    ],
                    "position": {
                      "start": {
                        "line": 7,
                        "column": 14,
                        "offset": 58
                      },
                      "end": {
                        "line": 7,
                        "column": 37,
                        "offset": 81
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 7,
                    "column": 3,
                    "offset": 47
                  },
                  "end": {
                    "line": 7,
                    "column": 37,
                    "offset": 81
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 7,
                "column": 1,
                "offset": 45
              },
              "end": {
                "line": 7,
                "column": 37,
                "offset": 81
              },
              "indent": []
            }
          },
          {
            "type": "heading",
            "depth": 2,
            "children": [
              {
                "type": "text",
                "value": "a sub title",
                "position": {
                  "start": {
                    "line": 9,
                    "column": 4,
                    "offset": 86
                  },
                  "end": {
                    "line": 9,
                    "column": 15,
                    "offset": 97
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 9,
                "column": 1,
                "offset": 83
              },
              "end": {
                "line": 9,
                "column": 15,
                "offset": 97
              },
              "indent": []
            }
          },
          {
            "type": "paragraph",
            "children": [
              {
                "type": "text",
                "value": "other paragraph",
                "position": {
                  "start": {
                    "line": 11,
                    "column": 1,
                    "offset": 99
                  },
                  "end": {
                    "line": 11,
                    "column": 16,
                    "offset": 114
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 11,
                "column": 1,
                "offset": 99
              },
              "end": {
                "line": 11,
                "column": 16,
                "offset": 114
              },
              "indent": []
            }
          }
        ]
      }
    },
    {
      "title": {
        "type": "root",
        "children": {
          "type": "heading",
          "depth": 1,
          "children": [
            {
              "type": "text",
              "value": "conclusion title",
              "position": {
                "start": {
                  "line": 13,
                  "column": 3,
                  "offset": 118
                },
                "end": {
                  "line": 13,
                  "column": 19,
                  "offset": 134
                },
                "indent": []
              }
            }
          ],
          "position": {
            "start": {
              "line": 13,
              "column": 1,
              "offset": 116
            },
            "end": {
              "line": 13,
              "column": 19,
              "offset": 134
            },
            "indent": []
          }
        }
      },
      "children": {
        "type": "root",
        "children": [
          {
            "type": "paragraph",
            "children": [
              {
                "type": "text",
                "value": "paragraph",
                "position": {
                  "start": {
                    "line": 15,
                    "column": 1,
                    "offset": 136
                  },
                  "end": {
                    "line": 15,
                    "column": 10,
                    "offset": 145
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 15,
                "column": 1,
                "offset": 136
              },
              "end": {
                "line": 15,
                "column": 10,
                "offset": 145
              },
              "indent": []
            }
          }
        ]
      }
    }
  ]
}
*/
```

## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/zestedesavoir/zmarkdown.svg

[build-status]: https://travis-ci.org/zestedesavoir/zmarkdown

[coverage-badge]: https://img.shields.io/coveralls/zestedesavoir/zmarkdown.svg

[coverage-status]: https://coveralls.io/github/zestedesavoir/zmarkdown

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/rebber/LICENSE-MIT

[rebber-plugins]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/rebber-plugins

[zds]: https://zestedesavoir.com

[npm]: https://www.npmjs.com/package/rebber

[mdast]: https://github.com/syntax-tree/mdast/blob/master/readme.md

[remark]: https://github.com/remarkjs/remark
