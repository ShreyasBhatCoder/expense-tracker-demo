import { InjectionToken, Provider } from "@angular/core";
import { ItemCategory, TransactionLog } from "./transaction.model";

export const transactions: TransactionLog[] = [
  {
    id: 1,
    itemName: 'Mechanical Keyboard',
    itemCategory: "Shopping",
    amountSpent: 4500,
    dateOfPurchase: new Date('2026-09-15T10:30:00').toString()
  },
  {
    id: 2,
    itemName: 'Wireless Ergonomic Mouse',
    itemCategory: "Shopping",
    amountSpent: 3200,
    dateOfPurchase: new Date('2026-09-16T14:15:00').toString()
  },
  {
    id: 3,
    itemName: '27-inch 4K Monitor',
    itemCategory: "Shopping",
    amountSpent: 28500,
    dateOfPurchase: new Date('2026-09-20T09:00:00').toString()
  },
  {
    id: 4,
    itemName: 'USB-C Multi-port Hub',
    itemCategory: "Shopping",
    amountSpent: 1800,
    dateOfPurchase: new Date('2026-09-20T16:45:00').toString()
  },
  {
    id: 5,
    itemName: 'Bus Pass',
    itemCategory: "Transportation",
    amountSpent: 2000,
    dateOfPurchase: new Date('2026-09-17T16:45:00').toString()
  }
];


export const TRANSACTION_LIST = new InjectionToken<TransactionLog[]>('TRANSACTION_LIST');


export const transactionsListProvider: Provider = {
  provide: TRANSACTION_LIST,
  useValue: transactions
}

