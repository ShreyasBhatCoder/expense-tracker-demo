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
    if (getTransactions) {
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

  groupBy(
    property: keyof TransactionLog,
    txnList: TransactionLog[]
  ): Record<string, TransactionLog[]> {
    const newData = txnList.reduce<Record<string, TransactionLog[]>>((accumulator, current) => {
      const propVal = current[property];
      if (!accumulator[propVal as string]) {
        accumulator[propVal as string] = [];
      }
      accumulator[propVal as string].push(current);
      return accumulator;
    }, {});
    // console.log(newData);
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
    let keys = Object.keys(groupedTxList);
    for (const key of keys) {
      result[key] = groupedTxList[key].reduce((acc, current) => acc + current.amountSpent!, 0);
    }
    return result;
  }


  /*
  [
    { "date": "2026-09-15", "value": 12000 },
    { "date": "2026-09-16", "value": 3000 },
    ...
  ]
  */

  transformToObjArray(aggregatedData: Record<string, number>, keyPropName: string, valuePropName: string) {
    let result: { [key: string]: any }[] = [];
    let dataKeys = Object.keys(aggregatedData); // Extract actual data keys ("Shopping", etc.)

    for (const dataKey of dataKeys) {
      result.push({
        [keyPropName]: dataKey,
        [valuePropName]: aggregatedData[dataKey]
      });
    }
    return result;
  }






  private saveChanges() {
    localStorage.setItem('transactionsList', JSON.stringify(this.tx_list()));
  }

}


