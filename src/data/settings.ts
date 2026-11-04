export interface SiteSettings {
  maintenanceMode: boolean;
  maintenanceHeadline: string;
  maintenanceMessage: string;
  allowOrders: boolean;
  ordersPausedMessage: string;
  whatsappNumber: string;
  announcementEnabled: boolean;
  announcementText: string;
  announcementColor: 'pink' | 'gold' | 'cyan';
  updatedAt: string;
  updatedBy?: string;
}

export const defaultSettings: SiteSettings = {
  maintenanceMode: false,
  maintenanceHeadline: 'DOFIT WEARS & ÀṢÀ · PRIVATE VAULT',
  maintenanceMessage: 'We are currently preparing our next exclusive drop. Orders and browsing will reopen shortly.',
  allowOrders: true,
  ordersPausedMessage: 'Order intake is momentarily paused for live dispatch processing. We will resume shortly!',
  whatsappNumber: '2349016946854',
  announcementEnabled: false,
  announcementText: '⚡ Free Express Lagos Delivery on orders above ₦50,000 · Same-Day Dispatch Live',
  announcementColor: 'pink',
  updatedAt: new Date().toISOString(),
};

export let siteSettingsStore: SiteSettings = { ...defaultSettings };

export function updateSettings(newSettings: Partial<SiteSettings>, by?: string): SiteSettings {
  siteSettingsStore = {
    ...siteSettingsStore,
    ...newSettings,
    updatedAt: new Date().toISOString(),
    updatedBy: by || siteSettingsStore.updatedBy,
  };
  return siteSettingsStore;
}

