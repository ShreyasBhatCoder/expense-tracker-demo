import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { TransactionService } from '../transaction-service.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-input',
  imports: [FormsModule],
  templateUrl: './transaction-input.component.html',
  styleUrl: './transaction-input.component.css'
})
export class TransactionInput {
  transactionService = inject(TransactionService);
  form = viewChild<ElementRef<HTMLFormElement>>("form");

  onSubmit(item: string, amount: string) {
    const lastId = this.transactionService.transactions()[this.transactionService.transactions().length - 1];
    
    this.transactionService.addNewTransactionLog({
      id: lastId.id + 1,
      itemName: item,
      amountSpent: +amount,
      dateOfPurchase: new Date(),
    });

    this.form()!.nativeElement.reset();
  }

}
