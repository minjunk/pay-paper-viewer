import {
  Menu, MenuItem, MenuItemConstructorOptions,
} from 'electron';
import savePdfDialog from './savePdfDialog';

const isMac = process.platform === 'darwin';

const appMenu = (appName: string): Menu => {
  const template = ([
    isMac && {
      role: 'appMenu',
      label: appName,
      submenu: [
        { role: 'about' },
        {
          role: 'quit',
          label: '종료',
        },
      ],
    },
    {
      role: 'fileMenu',
      label: '파일',
      submenu: ([
        isMac && {
          role: 'close',
          label: '창 닫기',
          accelerator: 'CommandOrControl+W',
        },
        isMac && { type: 'separator' },
        {
          id: 'export-pdf',
          label: 'PDF로 내보내기...',
          enabled: false,
        },
        {
          id: 'print',
          label: '프린트...',
          accelerator: 'CommandOrControl+P',
          enabled: false,
        },
      ] as MenuItemConstructorOptions[]).filter(Boolean),
    },
  ] as MenuItemConstructorOptions[]).filter(Boolean);
  return Menu.buildFromTemplate(template);
};

export function switchMenuOption(
  menuId: string,
  switchOptions: MenuItemConstructorOptions,
): MenuItem | null {
  const menu = Menu.getApplicationMenu();
  if (menu) {
    const menuItem = menu.getMenuItemById(menuId);
    Object.assign(menuItem, switchOptions);
    return menuItem;
  }
  return null;
}

export function switchPaperActionMenu(enabledOptions: {
  title: string;
  exportPdf(filePath: string): void;
  print(): void;
} | null = null): void {
  if (enabledOptions !== null) {
    switchMenuOption('export-pdf', {
      enabled: true,
      click: async () => {
        const { filePath } = await savePdfDialog(enabledOptions.title);
        enabledOptions.exportPdf(filePath);
      },
    });
    switchMenuOption('print', {
      enabled: true,
      click: () => enabledOptions.print(),
    });
  } else {
    switchMenuOption('export-pdf', { enabled: false, click() {} });
    switchMenuOption('print', { enabled: false });
  }
}

export default appMenu;
