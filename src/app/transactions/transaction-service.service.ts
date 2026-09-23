import { inject, Injectable, signal } from '@angular/core';
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
  }

}


