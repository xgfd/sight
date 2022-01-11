import {
  BrowserWindow,
  dialog,
  Menu,
  MenuItemConstructorOptions,
  shell,
  systemPreferences,
} from 'electron';
import fs from 'fs';
import contextMenu from 'electron-context-menu';
import { BUILTIN, CUSTOM, IMAGE_CACHE, getPyPath } from './constants';

const isMac = process.platform === 'darwin';

if (isMac) {
  systemPreferences.setUserDefault(
    'NSDisabledDictationMenuItem',
    'boolean',
    true as any
  );

  systemPreferences.setUserDefault(
    'NSDisabledCharacterPaletteMenuItem',
    'boolean',
    true as any
  );
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    contextMenu({
      showSaveImage: true,
      showSearchWithGoogle: false,
      showLookUpSelection: false,
    });

    const template = this.buildMenuTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  buildMenuTemplate(): MenuItemConstructorOptions[] {
    const subMenuApp: MenuItemConstructorOptions = { role: 'appMenu' };
    const subMenuFile: MenuItemConstructorOptions = isMac
      ? {
          label: 'File',
          submenu: [
            {
              label: 'Open',
              accelerator: 'Command+O',
              click: () => {
                this.mainWindow.webContents.send('OPEN');
              },
            },
            {
              label: 'Save',
              accelerator: 'Command+S',
              click: () => {
                this.mainWindow.webContents.send('SAVE');
              },
            },
            {
              label: 'Save As Python',
              accelerator: 'Shift+Command+S',
              click: () => {
                this.mainWindow.webContents.send('EXPORT_PYTHON');
              },
            },
            { type: 'separator' },
            {
              label: 'Clear Cache',
              click: () => {
                fs.rmSync(IMAGE_CACHE, { recursive: true });
                fs.mkdirSync(IMAGE_CACHE, { recursive: true });
                dialog.showMessageBox({
                  message:
                    'Cache is cleared. Run your workflow again to see changes.',
                });
              },
            },
          ],
        }
      : {
          label: '&File',
          submenu: [
            {
              label: '&Open',
              accelerator: 'Ctrl+O',
              click: () => {
                this.mainWindow.webContents.send('OPEN');
              },
            },
            {
              label: '&Save',
              accelerator: 'Ctrl+S',
              click: () => {
                this.mainWindow.webContents.send('SAVE');
              },
            },
            {
              label: 'Save &As Python',
              accelerator: 'Shift+Ctrl+S',
              click: () => {
                this.mainWindow.webContents.send('EXPORT_PYTHON');
              },
            },
            { type: 'separator' },
            {
              label: 'Clear Cache',
              click: () => {
                fs.rmSync(IMAGE_CACHE, { recursive: true });
                fs.mkdirSync(IMAGE_CACHE, { recursive: true });
                dialog.showMessageBox({
                  message:
                    'Cache is cleared. Run your workflow again to see changes.',
                });
              },
            },
          ],
        };

    const subMenuEdit: MenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ],
    };

    const subMenuView: MenuItemConstructorOptions = { role: 'viewMenu' };

    const subMenuWindow: MenuItemConstructorOptions = { role: 'windowMenu' };

    const subMenuHelp: MenuItemConstructorOptions = {
      role: 'help',
      submenu: [
        ...(!isMac ? [{ role: 'about' } as MenuItemConstructorOptions] : []),
        {
          label: 'Documentation',
          click() {
            shell.openExternal(
              'https://github.com/xgfd/sight-release/blob/main/README.md'
            );
          },
        },
        {
          label: 'Issues',
          click() {
            shell.openExternal('https://github.com/xgfd/sight-release/issues');
          },
        },
        {
          label: 'Environment',
          click: () => {
            getPyPath((pyPath) =>
              dialog.showMessageBox({
                message: `Python: ${pyPath}\n\nBuilt-in functions: ${BUILTIN}\n\nCustom functions: ${CUSTOM}\n\nImage cache: ${IMAGE_CACHE}`,
              })
            );
          },
        },
      ],
    };

    return [
      ...(isMac ? [subMenuApp] : []),
      subMenuFile,
      subMenuEdit,
      subMenuView,
      subMenuWindow,
      subMenuHelp,
    ];
  }
}
