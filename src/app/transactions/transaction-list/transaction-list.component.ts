import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
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
  date = new Date();

  transactionService = inject(TransactionService);
  tx_list = this.transactionService.transactions;
}
