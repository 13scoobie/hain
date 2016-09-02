# PluginContext

PluginContext is a object which has following properties:

**Environment Variables:**
* `MAIN_PLUGIN_REPO` String
* `DEV_PLUGIN_REPO` String
* `INTERNAL_PLUGIN_REPO` String
* `__PLUGIN_PREINSTALL_DIR` String
* `__PLUGIN_PREUNINSTALL_FILE` String
* `CURRENT_API_VERSION` String
* `COMPATIBLE_API_VERSIONS` Array&lt;String&gt;

**Plugin API:**
* `app` [App](plugin-context-app.md) - Provides functions to control the app
* `clipboard` [Clipboard](plugin-context-clipboard.md) - Provides electron's clipboard API
* `toast` [Toast](plugin-context-toast.md) - Provides toast API
* `shell` [Shell](plugin-context-shell.md) - Provides electron's shell API
* `logger` [Logger](plugin-context-logger.md) - Provides logging API
* `localStorage` [node-persist Object](https://github.com/simonlast/node-persist) - Provides a storage for each plugins

**Preference Objects:**
* `globalPreferences` [PreferencesObject](preferences-object.md) - Contains Global preferences
* `preferences` [PreferencesObject](preferences-object.md) - Contains Plugin's own preferences


**Example**
```javascript
'use strict';

module.exports = (pluginContext) => {
  const app = pluginContext.app;
  const toast = pluginContext.toast;
  const logger = pluginContext.logger;
  
  function startup() { ... }
  
  function search(query, res) { ... }
  
  function execute(id, payload) {
    if (id === '1') {
      toast.enqueue('This is message', 1500);
    } else if (id == '2') {
      app.close();
    } else if (id == '3') {
      logger.log('this is log');
    }
  }
  
  return { startup, search, execute };
};
```

## Related Docs
* [App](plugin-context-app.md)
* [Clipboard](plugin-context-clipboard.md)
* [Toast](plugin-context-toast.md)
* [Shell](plugin-context-shell.md)
* [Logger](plugin-context-logger.md)
* [PreferencesObject](preferences-object.md)