export interface Voucher {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

export const initialVouchers: Voucher[] = [];

export let vouchersStore: Voucher[] = [...initialVouchers];

export function getAllVouchers(): Voucher[] {
  return vouchersStore;
}

export function createVoucher(data: Omit<Voucher, 'id' | 'usedCount' | 'createdAt'>): Voucher {
  const newVoucher: Voucher = {
    ...data,
    id: `vch-${Date.now()}`,
    code: data.code.trim().toUpperCase(),
    usedCount: 0,
    createdAt: new Date().toISOString(),
  };
  vouchersStore.unshift(newVoucher);
  return newVoucher;
}

export function updateVoucher(id: string, updates: Partial<Voucher>): Voucher | null {
  const idx = vouchersStore.findIndex((v) => v.id === id);
  if (idx === -1) return null;
  vouchersStore[idx] = { ...vouchersStore[idx], ...updates };
  return vouchersStore[idx];
}

export function deleteVoucher(id: string): boolean {
  const idx = vouchersStore.findIndex((v) => v.id === id);
  if (idx === -1) return false;
  vouchersStore.splice(idx, 1);
  return true;
}

export function incrementVoucherUsage(code: string): void {
  const v = vouchersStore.find((item) => item.code.toUpperCase() === code.toUpperCase());
  if (v) {
    v.usedCount += 1;
  }
}
