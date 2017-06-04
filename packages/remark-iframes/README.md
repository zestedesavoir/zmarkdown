This plugin parses `!(input_url)` to an "iframe" node. When compiled to HTML, it renders as `<iframe src="output_url"></iframe>`.

You need to configure all iframe providers you want to support in the option parameter passed to the plugin :

```js
{
  'www.jsfiddle.net': {
    tag: 'iframe',
    width: 560,
    height: 560,
    disabled: false,
    replace: [
      ['http://', 'https://'],
    ],
    append: 'embedded/result,js,html,css/',
    match: /https?:\/\/(www\.)?jsfiddle\.net\/([\w\d]+\/[\w\d]+\/\d+\/?|[\w\d]+\/\d+\/?|[\w\d]+\/?)$/,
  },
}
```

# Configuration fields :

- `tag`: Transforms to the given html tag, you most probably want `iframe`.
- `width` and `height`: iframe size, set as `width="" height=""` HTML attributes.
- `disabled`: Can be used to disabled this provider.
- `replace`: Rules passed to `String.prototype.replace` with the `input_url`. It's a list `[[from, to]]`, rules are applied sequentially on the output of the previous rule.
- `removeAfter`: Truncates the url after the first occurence of char. For example `http://dailymotion.com/video/?time=1&bla=2` will result in `http://dailymotion.com/video/?time=1` if `removeAfter` is set to `&`.
- `append`: Any string you want to append to the url, for example an API key.
- `removeFileName`: If set to `true`, removes the filename (i.e last fragment before query string) from url.
- `match`: a regular expression passed to `String.prototype.test`, used to validate the url.
