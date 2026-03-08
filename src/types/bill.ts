export interface BillItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Bill {
  id: string;
  customerName: string;
  customerAddress?: string;
  customerPhone?: string;
  items: BillItem[];
  subtotal: number;
  vat: number;
  total: number;
  status: 'paid' | 'pending';
  createdAt: string;
  updatedAt: string;
  note?: string;
}
