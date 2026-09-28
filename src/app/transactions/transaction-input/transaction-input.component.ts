import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { TransactionService } from '../transaction-service.service';
import { FormsModule } from '@angular/forms';
import { CATEGORIES, categoriesListProvider, ItemCategory } from '../transaction.model';
import { getFormattedDate } from '../../../../utils/utils.module';
import { AddCommasPipe } from './add-commas.pipe';

@Component({
  selector: 'app-transaction-input',
  imports: [FormsModule, AddCommasPipe],
  templateUrl: './transaction-input.component.html',
  styleUrl: './transaction-input.component.css',
  providers: [categoriesListProvider]
})
export class TransactionInput {
  transactionService = inject(TransactionService);
  readonly categories = inject(CATEGORIES);

  
  // Validation rules: purchaseItem, itemCategory, and amountSpent should NOT be empty
  purchaseItem: string = "";
  itemCategory: string = "";
  dateOfPurchase: string = getFormattedDate(new Date().toISOString());
  amountSpent: number | null = null;



  onAmountChange(value: string) {
    const cleanValue = value ? value.replace(/,/g, '') : '';
    this.amountSpent = cleanValue ? parseFloat(cleanValue) : null;
  }



  onSubmit() {
    const lastId = this.transactionService.transactions()[this.transactionService.transactions().length - 1];

    this.transactionService.addNewTransactionLog({
      id: lastId.id + 1,
      itemName: this.purchaseItem,
      itemCategory: this.itemCategory as ItemCategory,
      amountSpent: this.amountSpent,
      dateOfPurchase: this.dateOfPurchase
    });

    this.onFormReset();
  }

  onFormReset() {
    this.purchaseItem = "";
    this.itemCategory = "";
    this.dateOfPurchase = getFormattedDate(new Date().toISOString());
    this.amountSpent = null;
  }

}
