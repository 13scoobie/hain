# package.json Format

Hain plugin is just a nodejs module.
All plugin configurations must be located in package.json

* `name` String - Plugin name, must be prefixed with `hain-plugin-` (**required**)
* `version` String - Plugin version 'x.y.z' (**required**)
* `hain` Object - (**required**)
  - `prefix` String - Plugin command prefix, e.g. '/g' (optional, default is `null`)
  - `usage` String - Plugin usage to be displayed in the empty ResultList. e.g. 'type /g' (optional, default is `prefix` value)
  - `icon` String - Icon URL, see [Icon URL Format](icon-url-format.md) (**required**)
  - `redirect` String - Query to redirect user input when user did select intro help (optional, default is `undefined`)
  - `group` String - Default result group name (optional, default is `name` value)

**And...**
* `keywords` Array\<String\> - Add Base API version `hain-0.3.0` for sharing your plugin (**required**)



**Example**
```json
{
  "name": "hain-plugin-google",
  "version": "0.0.1",
  "keywords": [
    "hain-0.3.0"
  ],
  "hain": {
    "prefix": "/g",
    "usage": "type /g something to google it",
    "icon": "#fa fa-google",
    "redirect": "/g "
  }
}
```

## Related Docs
* [Plugin Skeleton](plugin-skeleton.md)
* [Icon URL Format](icon-url-format.md)
