export interface OrderItem {
  productId: string;
  name: string;
  brand: 'dofit' | 'asa';
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  notes?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled';
  paymentMethod: 'WhatsApp Transfer';
  brand: 'dofit' | 'asa' | 'mixed';
  notes?: string;
}

// Initial mock & real orders store
export let ordersStore: Order[] = [
  {
    id: 'ORD-9842',
    createdAt: '2026-09-13T16:20:00Z',
    customer: {
      fullName: 'Chidinma Okafor',
      phone: '+2348031234567',
      address: '14 Admiralty Way, Lekki Phase 1',
      city: 'Lagos',
      state: 'Lagos',
      notes: 'Please call before delivery',
    },
    items: [
      {
        productId: 'dw-1',
        name: '2-Piece Biker Short Set',
        brand: 'dofit',
        size: 'M',
        quantity: 1,
        unitPrice: 45000,
        totalPrice: 45000,
        image: '/images/dofit-wears/2-Piece Biker Short Set.png',
      },
      {
        productId: 'dw-5',
        name: 'Trim Tank Top',
        brand: 'dofit',
        size: 'S',
        quantity: 1,
        unitPrice: 18000,
        totalPrice: 18000,
        image: '/images/dofit-wears/Trim Tank Top.png',
      },
    ],
    subtotal: 63000,
    discount: 0,
    deliveryFee: 0, // free over 50k
    totalAmount: 63000,
    status: 'Processing',
    paymentMethod: 'WhatsApp Transfer',
    brand: 'dofit',
  },
  {
    id: 'ORD-9841',
    createdAt: '2026-09-13T14:10:00Z',
    customer: {
      fullName: 'Tunde Adeleke',
      phone: '+2348129876543',
      address: '22 Isaac John Street, GRA',
      city: 'Ikeja',
      state: 'Lagos',
      notes: 'Leave with reception if not around',
    },
    items: [
      {
        productId: 'asa-1',
        name: 'Adire Indigo Resort Shirt',
        brand: 'asa',
        size: 'L',
        quantity: 1,
        unitPrice: 52000,
        totalPrice: 52000,
        image: '/images/asa/image1.png',
      },
    ],
    subtotal: 52000,
    discount: 5200,
    deliveryFee: 0,
    totalAmount: 46800,
    status: 'Dispatched',
    paymentMethod: 'WhatsApp Transfer',
    brand: 'asa',
  },
  {
    id: 'ORD-9840',
    createdAt: '2026-09-12T18:45:00Z',
    customer: {
      fullName: 'Amina Bello',
      phone: '+2349054433221',
      address: '5 Maitama Sule Street',
      city: 'Abuja',
      state: 'FCT',
      notes: 'Urgent weekend dispatch please',
    },
    items: [
      {
        productId: 'asa-3',
        name: 'Heritage Indigo Kimono Robe',
        brand: 'asa',
        size: 'Free Size',
        quantity: 1,
        unitPrice: 65000,
        totalPrice: 65000,
        image: '/images/asa/image3.png',
      },
    ],
    subtotal: 65000,
    discount: 0,
    deliveryFee: 5000,
    totalAmount: 70000,
    status: 'Delivered',
    paymentMethod: 'WhatsApp Transfer',
    brand: 'asa',
  },
];

export function getAllOrders(): Order[] {
  return ordersStore;
}

export function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'status' | 'paymentMethod'>): Order {
  const newOrder: Order = {
    ...order,
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    status: 'Pending',
    paymentMethod: 'WhatsApp Transfer',
  };
  ordersStore = [newOrder, ...ordersStore];
  return newOrder;
}

export function updateOrderStatus(id: string, status: Order['status']): Order | null {
  const order = ordersStore.find((o) => o.id === id);
  if (order) {
    order.status = status;
    return order;
  }
  return null;
}
