export interface BroadcastNotification {
  id: string;
  title: string;
  body: string;
  url: string;
  tag?: string;
  category: 'Drop Alert' | 'Flash Sale' | 'Restock' | 'Exclusive';
  createdAt: string;
  senderName?: string;
}

export let broadcastsStore: BroadcastNotification[] = [
  {
    id: 'broadcast-1',
    title: '🔥 Midnight Charcoal Restock Live!',
    body: 'The 2-Piece Long-Sleeve Leggings Set is back in all sizes. Claim yours before it sells out.',
    url: '/shop?brand=dofit',
    tag: 'restock-drop',
    category: 'Restock',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    senderName: 'Lead Admin',
  },
  {
    id: 'broadcast-2',
    title: '⚡ Secret 20% Voucher for App Users',
    body: 'Use voucher code DOFIT20 at checkout for ₦10,000+ off your next outfit.',
    url: '/shop',
    tag: 'exclusive-voucher',
    category: 'Exclusive',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    senderName: 'Lead Admin',
  },
];

export function getAllBroadcasts(): BroadcastNotification[] {
  return [...broadcastsStore].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getLatestBroadcast(): BroadcastNotification | null {
  const all = getAllBroadcasts();
  return all[0] || null;
}

export function addBroadcast(data: {
  title: string;
  body: string;
  url?: string;
  category?: 'Drop Alert' | 'Flash Sale' | 'Restock' | 'Exclusive';
  senderName?: string;
}): BroadcastNotification {
  const newBroadcast: BroadcastNotification = {
    id: `broadcast-${Date.now()}`,
    title: data.title.trim(),
    body: data.body.trim(),
    url: data.url?.trim() || '/shop',
    tag: `dofit-${Date.now()}`,
    category: data.category || 'Drop Alert',
    createdAt: new Date().toISOString(),
    senderName: data.senderName || 'Admin Desk',
  };

  broadcastsStore.unshift(newBroadcast);
  return newBroadcast;
}

export function deleteBroadcast(id: string): boolean {
  const index = broadcastsStore.findIndex((b) => b.id === id);
  if (index !== -1) {
    broadcastsStore.splice(index, 1);
    return true;
  }
  return false;
}


