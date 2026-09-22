import { Component, inject } from '@angular/core';
import { TransactionInput } from './transaction-input/transaction-input.component';
import { TransactionList } from './transaction-list/transaction-list.component';
import { Summary } from './summary/summary.component';
import { TRANSACTION_LIST, transactionsListProvider } from './dummy-transactions';
import { TransactionService } from './transaction-service.service';

@Component({
  selector: 'app-transactions',
  imports: [TransactionInput, TransactionList, Summary],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
  host: {
    class: "flex flex-col gap-4 mb-10"
  },
  providers: [transactionsListProvider, TransactionService]
})
export class Transactions {}
