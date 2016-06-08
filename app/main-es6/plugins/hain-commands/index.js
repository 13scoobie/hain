'use strict';

const pkg = require('../../../package.json');
const checkForUpdate = require('./check-update');

const CONTRIBUTORS_URL = 'https://github.com/appetizermonster/hain/graphs/contributors';
const COMMANDS = ['/reload', '/restart', '/quit', '/about', '/preferences', '/update'];
const NAME = 'hain-commands';

module.exports = (context) => {
  const app = context.app;
  const matchutil = context.matchutil;
  const toast = context.toast;
  const shell = context.shell;

  function handleUpdate(res) {
    res.add({
      id: '__temp__',
      title: 'Checking for update...',
      icon: '#fa fa-spinner fa-spin',
      desc: NAME
    });
    checkForUpdate().then(ret => {
      res.remove('__temp__');
      if (ret.version !== pkg.version) {
        return res.add({
          id: 'goUpdate',
          payload: ret.url,
          title: `There is a new version ${ret.version}`,
          desc: 'Go download page'
        });
      }
      res.add({
        title: 'There is no update',
        desc: NAME
      });
    }, () => {
      res.remove('__temp__');
      res.add({
        title: 'Sorry, Failed to check for update',
        desc: NAME
      });
    });
  }

  function startup() {
    checkForUpdate().then(ret => {
      if (ret.version !== pkg.version) {
        toast.enqueue('New Version Available! Please Enter `/update`', 2500);
      }
    });
  }

  function search(query, res) {
    const query_lower = query.toLowerCase();
    const basicCommandResults = {
      '/reload': 'Reload Plugins',
      '/restart': 'Restart Hain',
      '/about': `Hain v${pkg.version}`,
      '/quit': 'Quit Hain',
      '/preferences': 'Open Preferences'
    };

    const commandResult = basicCommandResults[query_lower];
    if (commandResult !== undefined)
      return res.add({
        id: query_lower,
        title: commandResult,
        desc: NAME
      });

    if (query_lower === '/update') {
      return handleUpdate(res);
    }

    return res.add(_makeCommandsHelp(query));
  }

  function execute(id, payload) {
    const commands = {
      '/reload': () => {
        app.reloadPlugins();
      },
      '/restart': () => {
        toast.enqueue('Hain will be restarted, it will takes seconds');
        setTimeout(() => app.restart(), 1000);
        app.setQuery('');
      },
      '/quit': () => app.quit(),
      '/about': () => {
        shell.openExternal(CONTRIBUTORS_URL);
        app.close(true);
      },
      '/preferences': () => {
        app.openPreferences();
        app.close(true);
      },
      'goUpdate': () => {
        shell.openExternal(payload);
        app.close();
      },
      'redirect': () => app.setQuery(payload)
    };
    const func = commands[id];
    if (func !== undefined)
      func();
  }

  function _makeCommandsHelp(query) {
    const ret = matchutil.head(COMMANDS, query).map((x) => {
      return {
        id: 'redirect',
        payload: x.elem,
        redirect: x.elem,
        title: matchutil.makeStringBoldHtml(x.elem, x.matches),
        desc: NAME,
        score: 0
      };
    });
    return ret;
  }

  return { startup, search, execute };
};
