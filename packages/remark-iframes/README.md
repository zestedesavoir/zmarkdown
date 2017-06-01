This plugin parses `!({url})` to a "iframe" node, if compiled to HTML, renders as `<iframe src="{parsed_url"}></iframe>`.

You need to configure all iframe provider you support in the option parameter passed to the plugin :

```json
 'www.dailymotion.com': {
      tag: 'iframe',
      width: 480,
      height: 270,
      enabled: true,
      replace: {
        'video/': 'embed/video/'
      }
}
```

# Configuration fields :

- `tag` : transform to the given html tag, most of time you want iframe
- `width` and `height` : iframe size
- `enabled` : if you want to enable parsing for this provider. Usefull if you use this plugin in different environment from copy/past configuration
- `replace` : every modification we have to make to the url to render it properly.
- `removeAfter`: truncate the url after the first occurence of char. For example `http://dailymotion.com/video/?time=1&bla=2` will be parsed to `http://dailymotion.com/video/?time=1` if `removeAfter` is set to `&`.
- `append` : any string you want to append the url, for example an API key
- `removeFileName` : if set to `true` remove the filename from url.
- `domain`: any rule the url has to ensure. For now only "match" operator is accepted with regexp.
