import { InjectionToken, Provider } from "@angular/core";
import { TransactionLog } from "./transaction.model";

export const transactions: TransactionLog[] = [
  {
    id: 1,
    itemName: 'Mechanical Keyboard',
    amountSpent: 4500,
    dateOfPurchase: new Date('2026-09-15T10:30:00')
  },
  {
    id: 2,
    itemName: 'Wireless Ergonomic Mouse',
    amountSpent: 3200,
    dateOfPurchase: new Date('2026-09-16T14:15:00')
  },
  {
    id: 3,
    itemName: '27-inch 4K Monitor',
    amountSpent: 28500,
    dateOfPurchase: new Date('2026-09-18T09:00:00')
  },
  {
    id: 4,
    itemName: 'USB-C Multi-port Hub',
    amountSpent: 1800,
    dateOfPurchase: new Date('2026-09-20T16:45:00')
  }
];


export const TRANSACTION_LIST = new InjectionToken<TransactionLog[]>('TRANSACTION_LIST');


export const transactionsListProvider: Provider = {
  provide: TRANSACTION_LIST,
  useValue: transactions
}
