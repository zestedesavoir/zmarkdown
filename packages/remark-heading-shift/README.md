# remark-heading-shift [![Build Status][build-badge]][build-status] [![Coverage Status][coverage-badge]][coverage-status]

This plugin increments headings by `shift`. It guards against shifting too far backwards or forwards.

`shift` defaults to `1`, it can be a positive or negative value, it will never shift a heading past `6` (because `h6` is the smallest HTML heading) in case of a positive `shift`, or lower than `1` (`h0` is not a valid HTML heading) in case of a negative `shift`.

For example, the following markdown:

    ## foo
    #### bar
    ##### baz

Yields:

    (shift=1)
    ### foo
    ##### bar
    ###### baz


    (shift=3)
    ##### foo
    ###### bar
    ###### baz


    (shift=-2)
    # foo
    ## bar
    ### baz

## License

[MIT][license] © [Zeste de Savoir][zds]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/zestedesavoir/zmarkdown.svg

[build-status]: https://travis-ci.org/zestedesavoir/zmarkdown

[coverage-badge]: https://img.shields.io/coveralls/zestedesavoir/zmarkdown.svg

[coverage-status]: https://coveralls.io/github/zestedesavoir/zmarkdown

[license]: https://github.com/zestedesavoir/zmarkdown/blob/master/packages/remark-heading-shift/LICENSE-MIT

[zds]: https://zestedesavoir.com
