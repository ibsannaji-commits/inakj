import { create } from 'zustand';

export type CartItem = {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  unit: string;
  sellerId?: string;
};

type CartState = {
  items: CartItem[];
  total: number;
  add: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  updateQty: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

function calcTotal(items: CartItem[]) {
  return items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  total: 0,

  add: (item) => {
    const items = [...get().items];
    const idx = items.findIndex((i) => i.productId === item.productId);
    const qty = item.quantity ?? 1;
    if (idx >= 0) {
      items[idx] = {
        ...items[idx],
        quantity: items[idx].quantity + qty,
      };
    } else {
      items.push({
        productId: item.productId,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: qty,
        unit: item.unit,
        sellerId: item.sellerId,
      });
    }
    set({ items, total: calcTotal(items) });
  },

  updateQty: (productId, quantity) => {
    let items = get().items.map((i) =>
      i.productId === productId ? { ...i, quantity } : i
    );
    items = items.filter((i) => i.quantity > 0);
    set({ items, total: calcTotal(items) });
  },

  remove: (productId) => {
    const items = get().items.filter((i) => i.productId !== productId);
    set({ items, total: calcTotal(items) });
  },

  clear: () => set({ items: [], total: 0 }),
}));
