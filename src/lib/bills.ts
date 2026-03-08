import { Bill, BillItem } from '@/types/bill';

const STORAGE_KEY = 'checkbill_bills';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function getAllBills(): Bill[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as Bill[];
  } catch {
    return [];
  }
}

export function getBillById(id: string): Bill | undefined {
  const bills = getAllBills();
  return bills.find((b) => b.id === id);
}

export function saveBill(bill: Bill): void {
  const bills = getAllBills();
  const idx = bills.findIndex((b) => b.id === bill.id);
  if (idx >= 0) {
    bills[idx] = bill;
  } else {
    bills.unshift(bill);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
}

export function deleteBill(id: string): void {
  const bills = getAllBills().filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
}

export function calculateBillTotals(items: BillItem[]): {
  subtotal: number;
  vat: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = subtotal * 0.07;
  const total = subtotal + vat;
  return { subtotal, vat, total };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function createEmptyBillItem(): BillItem {
  return {
    id: generateId(),
    name: '',
    quantity: 1,
    price: 0,
  };
}

export function getTodayBills(): Bill[] {
  const today = new Date().toDateString();
  return getAllBills().filter((b) => new Date(b.createdAt).toDateString() === today);
}
