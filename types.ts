
export interface InvoiceItem {
  id: string;
  description: string;
  price: number;
  quantity: number;
}

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  rc: string;
  nif: string;
  nis: string;
  ai: string;
  bankName: string;
  bankAccount: string;
}

export interface ClientInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  nif?: string;
}

export type PaymentMethod = 'CASH' | 'TRANSFER' | 'CHECK';

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  company: CompanyInfo;
  client: ClientInfo;
  items: InvoiceItem[];
  tvaRate: number;
  paymentMethod: PaymentMethod;
  notes: string;
  total?: number;
}
