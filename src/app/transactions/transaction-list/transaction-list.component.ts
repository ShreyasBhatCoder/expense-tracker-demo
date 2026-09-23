import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { TRANSACTION_LIST } from '../dummy-transactions';
import { TransactionLog } from '../transaction.model';
import { TransactionService } from '../transaction-service.service';

@Component({
  selector: 'app-transaction-list',
  imports: [DatePipe],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css'
})
export class TransactionList {

  transactionService = inject(TransactionService);
  tx_list = this.transactionService.transactions;

  sortedTxList = computed(() => {
    return this.tx_list().sort((a, b) => {
      const dateA = new Date(a.dateOfPurchase).getTime();
      const dateB = new Date(b.dateOfPurchase).getTime();
      return dateA - dateB;
    })
  })
}
