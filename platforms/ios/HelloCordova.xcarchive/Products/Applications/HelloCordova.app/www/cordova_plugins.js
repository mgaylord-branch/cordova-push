cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "innomobile-branch-cordova-sdk.Branch",
      "file": "plugins/innomobile-branch-cordova-sdk/src/index.js",
      "pluginId": "innomobile-branch-cordova-sdk",
      "clobbers": [
        "Branch"
      ]
    },
    {
      "id": "phonegap-plugin-push.PushNotification",
      "file": "plugins/phonegap-plugin-push/www/push.js",
      "pluginId": "phonegap-plugin-push",
      "clobbers": [
        "PushNotification"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.3",
    "innomobile-branch-cordova-sdk": "3.1.7",
    "phonegap-plugin-push": "2.2.3"
  };
});