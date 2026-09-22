import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TransactionInput } from './transactions/transaction-input/transaction-input.component';
import { Header } from './header/header.component';
import { Transactions } from './transactions/transactions.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Transactions],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class App {
  protected readonly title = signal('transaction-dashboard');
}
