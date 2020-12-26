require('dotenv').config();
const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: 'com.minjunkim.paypaperviewer',
    appPath: `${appOutDir}/${appName}.app`,
    appleApiKey: process.env.APPLE_DEVELOPER_API_KEY_ID,
    appleApiIssuer: process.env.APPLE_DEVELOPER_API_ISSUER_ID,
  });
};
