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
    itemName: 'Bus Pass',
    itemCategory: "Transportation",
    amountSpent: 3200,
    dateOfPurchase: new Date('2026-09-16T14:15:00').toString()
  },
  {
    id: 3,
    itemName: 'SIP',
    itemCategory: "Financial",
    amountSpent: 500,
    dateOfPurchase: new Date('2026-09-20T09:00:00').toString()
  }
];


export const TRANSACTION_LIST = new InjectionToken<TransactionLog[]>('TRANSACTION_LIST');


export const transactionsListProvider: Provider = {
  provide: TRANSACTION_LIST,
  useValue: transactions
}

