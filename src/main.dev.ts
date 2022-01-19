/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import { app, BrowserWindow, dialog, shell } from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import fs from 'fs';
import path from 'path';
import 'regenerator-runtime/runtime';
import { IMAGE_CACHE } from './constants';
import MenuBuilder from './menu';

const mainRemote = require('@electron/remote/main');

mainRemote.initialize();

function initAutoUpdater() {
  autoUpdater.on('error', (error) => {
    dialog.showErrorBox(
      'Error: ',
      error == null ? 'unknown' : (error.stack || error).toString()
    );
  });

  autoUpdater.on('update-available', () => {
    return dialog
      .showMessageBox({
        type: 'info',
        title: 'Found Updates',
        message: 'Found updates, do you want update now?',
        buttons: ['Sure', 'No'],
      })
      .then((buttonIndex) => {
        if (buttonIndex.response === 0) {
          autoUpdater.downloadUpdate();
        }
        return null;
      });
  });

  // autoUpdater.on('update-not-available', () => {
  //   dialog.showMessageBox({
  //     title: 'No Updates',
  //     message: 'Current version is up-to-date.',
  //   });
  // });

  autoUpdater.on('update-downloaded', () => {
    return dialog
      .showMessageBox({
        type: 'info',
        title: 'Install Updates',
        message: 'Updates downloaded. Restart now to install updates?',
        buttons: ['Sure', 'No'],
      })
      .then((buttonIndex) => {
        if (buttonIndex.response === 0) {
          setImmediate(() => autoUpdater.quitAndInstall());
        }
        return null;
      });
    // dialog.showMessageBox({
    //   title: 'Install Updates',
    //   message:
    //     'Updates downloaded, application will be updated the next time the application starts.',
    // });
  });

  log.transports.file.level = 'info';
  autoUpdater.logger = log;
  autoUpdater.autoDownload = false;
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const createWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1224,
    height: 900,
    icon: getAssetPath('icon.png'),
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    require('electron-debug')({ showDevTools: false });
    installExtension(REACT_DEVELOPER_TOOLS);
  }

  mainRemote.enable(mainWindow.webContents);

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    fs.rmSync(IMAGE_CACHE, { recursive: true, force: true });
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  initAutoUpdater();
  // Remove this if your app does not use auto updates
  autoUpdater.checkForUpdates();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
