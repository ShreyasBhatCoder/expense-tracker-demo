import { effect, inject, Injectable, signal } from '@angular/core';
import { TRANSACTION_LIST } from './dummy-transactions';
import { TransactionLog } from './transaction.model';
import { getFormattedDate } from '../../../utils/utils.module';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {

  private tx_list = signal<TransactionLog[]>(inject(TRANSACTION_LIST));

  readonly transactions = this.tx_list.asReadonly();

  addNewTransactionLog(txn: TransactionLog) {
    this.tx_list.update(txs => [...txs, txn]);
    this.saveChanges();
  }

  constructor() {
    const getTransactions = localStorage.getItem("transactionsList");
    if(getTransactions) {
      this.tx_list.set(JSON.parse(getTransactions));
    }
    // effect(() => this.saveChanges());
  }

  /*
    {
      "2026-09-15": [
        {tx1},
        {tx2}
      ],
      "2026-09-16": [{tx3}],
      ...
    }
  */

  groupByDate(txnList: TransactionLog[]): Record<string, TransactionLog[]> {
    const newData = txnList.reduce<Record<string, TransactionLog[]>>((accumulator, current) => {
      const date = getFormattedDate(current.dateOfPurchase);
      if (!accumulator[date]) {
        accumulator[date] = [];
      }
      accumulator[date].push(current);
      return accumulator;
    }, {});
    console.log(newData);
    return newData;
  }

  /*
  {
    "2026-09-15": 12000,
    "2026-09-16": 3000,
    ...
  }
  */
  aggregateAmtByDate(groupedTxList: Record<string, TransactionLog[]>): Record<string, number> {
    let result: Record<string, number> = {};
    let dates = Object.keys(groupedTxList);
    for (const date of dates) {
      result[date] = groupedTxList[date].reduce((acc, current) => acc + current.amountSpent, 0);
    }
    return result;
  }

  

  private saveChanges() {
    localStorage.setItem('transactionsList', JSON.stringify(this.tx_list()));
  }

}


