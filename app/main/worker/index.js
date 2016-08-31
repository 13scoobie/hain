'use strict';

const co = require('co');
const logger = require('../shared/logger');
const globalProxyAgent = require('./global-proxy-agent');
const apiProxy = require('./api-proxy');
const PreferencesObject = require('../shared/preferences-object');

const rpc = require('./rpc');

// Create a local copy of app-pref object
const appPrefCopy = new PreferencesObject(null, 'hain', {});

const workerContext = {
  app: apiProxy.appProxy,
  toast: apiProxy.toastProxy,
  shell: apiProxy.shellProxy,
  logger: apiProxy.loggerProxy,
  globalPreferences: appPrefCopy
};

let plugins = null;

function handleExceptions() {
  process.on('uncaughtException', (err) => logger.error(err));
}

rpc.define('initialize', (payload) => {
  const { initialAppPref } = payload;
  return co(function* () {
    handleExceptions();
    // appPrefCopy.update(initialAppPref);
    // globalProxyAgent.initialize(appPrefCopy);

    plugins = require('./plugins')(workerContext);
    yield* plugins.initialize();

    rpc.call('notifyPluginsLoaded');
  }).catch((e) => {
    const err = e.stack || e;
    rpc.call('onError', err);
    logger.error(err);
  });
});

rpc.define('searchAll', (payload) => {
  const { query, ticket } = payload;
  const resFunc = (obj) => {
    const resultData = {
      ticket,
      type: obj.type,
      payload: obj.payload
    };
    rpc.call('requestAddResults', resultData);
  };
  plugins.searchAll(query, resFunc);
});

rpc.define('execute', (__payload) => {
  const { pluginId, id, payload } = __payload;
  plugins.execute(pluginId, id, payload);
});

rpc.define('renderPreview', (__payload) => {
  const { ticket, pluginId, id, payload } = __payload;
  const render = (html) => {
    const previewData = { ticket, html };
    rpc.call('requestRenderPreview', previewData);
  };
  plugins.renderPreview(pluginId, id, payload, render);
});

rpc.define('buttonAction', (__payload) => {
  const { pluginId, id, payload } = __payload;
  plugins.buttonAction(pluginId, id, payload);
});

// const msgHandlers = {
//   execute: (_payload) => {
//   },
//   renderPreview: (_payload) => {
//   },
//   buttonAction: (_payload) => {
//   },
//   getPluginPrefIds: (payload) => {
//     const prefIds = plugins.getPrefIds();
//     procMsg.send('on-get-plugin-pref-ids', prefIds);
//   },
//   getPreferences: (payload) => {
//     const prefId = payload;
//     const pref = plugins.getPreferences(prefId);
//     procMsg.send('on-get-preferences', pref);
//   },
//   updatePreferences: (payload) => {
//     const { prefId, model } = payload;
//     plugins.updatePreferences(prefId, model);
//   },
//   commitPreferences: (payload) => {
//     plugins.commitPreferences();
//   },
//   resetPreferences: (payload) => {
//     const prefId = payload;
//     const pref = plugins.resetPreferences(prefId);
//     procMsg.send('on-get-preferences', pref);
//   },
//   updateGlobalPreferences: (payload) => {
//     const model = payload;
//     globalPrefObj.update(model);
//   }
// };
