import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { TransactionService } from '../transaction-service.service';
import { FormsModule } from '@angular/forms';
import { CATEGORIES, categoriesListProvider, ItemCategory } from '../transaction.model';

@Component({
  selector: 'app-transaction-input',
  imports: [FormsModule],
  templateUrl: './transaction-input.component.html',
  styleUrl: './transaction-input.component.css',
  providers: [categoriesListProvider]
})
export class TransactionInput {
  transactionService = inject(TransactionService);
  readonly categories = inject(CATEGORIES);

  form = viewChild<ElementRef<HTMLFormElement>>("form");

  onSubmit(
    item: string, 
    category: string, 
    dateOfPurchase: string | null, 
    amount: string
  ) {
    const lastId = this.transactionService.transactions()[this.transactionService.transactions().length - 1];

    this.transactionService.addNewTransactionLog({
      id: lastId.id + 1,
      itemName: item,
      itemCategory: category as ItemCategory,
      amountSpent: +amount,
      dateOfPurchase: dateOfPurchase ? dateOfPurchase : new Date().toString(),
    });

    this.form()!.nativeElement.reset();
  }

}
