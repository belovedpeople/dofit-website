export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
  source: string;
  status: 'active' | 'unsubscribed';
}

// In-memory cache of subscribers for local / serverless fallback
export let subscribersStore: Subscriber[] = [
  {
    id: 'sub-1',
    email: 'tobi.alabi@gmail.com',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    source: 'Website Footer (Stay Plugged In)',
    status: 'active',
  },
  {
    id: 'sub-2',
    email: 'kemi.adeyemi@yahoo.com',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    source: 'Àṣà Capsule VIP Drop',
    status: 'active',
  },
  {
    id: 'sub-3',
    email: 'chioma.nwosu@outlook.com',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    source: 'Activewear Drop Notification',
    status: 'active',
  },
];

export function getAllSubscribers(): Subscriber[] {
  return [...subscribersStore].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function addSubscriber(email: string, source = 'Stay Plugged In'): { subscriber: Subscriber; isNew: boolean } {
  const cleanEmail = email.trim().toLowerCase();
  const existing = subscribersStore.find((s) => s.email.toLowerCase() === cleanEmail);

  if (existing) {
    return { subscriber: existing, isNew: false };
  }

  const newSub: Subscriber = {
    id: `sub-${Date.now()}`,
    email: cleanEmail,
    createdAt: new Date().toISOString(),
    source,
    status: 'active',
  };

  subscribersStore.unshift(newSub);
  return { subscriber: newSub, isNew: true };
}

export function deleteSubscriber(id: string): boolean {
  const initialLength = subscribersStore.length;
  subscribersStore = subscribersStore.filter((s) => s.id !== id);
  return subscribersStore.length < initialLength;
}
