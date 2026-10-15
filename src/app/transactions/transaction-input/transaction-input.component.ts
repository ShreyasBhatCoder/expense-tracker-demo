import { Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { TransactionService } from '../transaction-service.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CATEGORIES, categoriesListProvider, ItemCategory, TransactionLog } from '../transaction.model';
import { getFormattedDate } from '../../../../utils/utils.module';
import { AddCommasPipe } from './add-commas.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transaction-input',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './transaction-input.component.html',
  styleUrl: './transaction-input.component.css',
  providers: [categoriesListProvider, AddCommasPipe]
})
export class TransactionInput implements OnInit {

  readonly categories = inject(CATEGORIES);

  private transactionService = inject(TransactionService);
  private addCommasPipe = inject(AddCommasPipe);

  form = new FormGroup({
    purchaseItem : new FormControl<string>("", Validators.required),
    itemCategory: new FormControl<string>("", Validators.required),
    dateOfPurchase: new FormControl<string>(getFormattedDate(new Date().toISOString()), Validators.required),
    amountSpent: new FormControl<number | null>(null, Validators.required)
  })

  

  ngOnInit(): void {
    const amountCtrl = this.form.get("amountSpent");
    amountCtrl?.valueChanges.subscribe((val) => {
      if(val) {
        const formattedValue = this.addCommasPipe.transform(val);
        amountCtrl.setValue(formattedValue as unknown as number, { emitEvent: false });
      }
    });
  }

  onSubmit() {

    console.log(this.form.value.dateOfPurchase, this.form.value.amountSpent);

    const newTransaction = {
      purchaseItem: this.form.value.purchaseItem!,
      itemCategory: this.form.value.itemCategory as ItemCategory,
      amountSpent: this.form.value.amountSpent!,
      dateOfPurchase: this.form.value.dateOfPurchase!,
    }
    console.log(newTransaction);
    this.transactionService.addNewTransactionLog(newTransaction);


    this.onFormReset();
  }

  onFormReset() {
    this.form.reset();
    this.form.controls.dateOfPurchase.setValue(getFormattedDate(new Date().toISOString()));
  }

}
