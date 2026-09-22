import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { getFormattedDate } from "../../../../utils/utils.module";
import { TransactionService } from '../transaction-service.service';

@Component({
  selector: 'app-summary',
  imports: [CurrencyPipe, BaseChartDirective],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css',
  providers: [provideCharts(withDefaultRegisterables())]
})
export class Summary {
  transactionService = inject(TransactionService);
  tx_list = this.transactionService.transactions;

  data = computed<ChartConfiguration['data']>(() => {
    // 1. Slice the last 5 transactions first to optimize performance
    const lastFiveTx = this.tx_list().slice(-5);

    return {
      // 2. Map only the sliced items
      labels: lastFiveTx.map(tx => getFormattedDate(tx.dateOfPurchase)),
      datasets: [
        {
          type: 'line',
          label: 'Amount Spent (in ₹)',
          data: lastFiveTx.map(tx => tx.amountSpent),
          backgroundColor: '#612d53',
          borderColor: '#612d53',
          borderWidth: 1,
          tension: 0,
          fill: false
        }
      ]
    };
  });

  getCumulativeSum() {
    let cumulativeAmt: number = 0
    for (let i = 0; i < this.tx_list().length; i++) {
      cumulativeAmt += this.tx_list()[i].amountSpent;
    }
    return cumulativeAmt;
  }

  averageSpend() {
    const list = this.tx_list();
    return list.length ? Math.round(this.getCumulativeSum() / list.length) : 0;
  };
}
