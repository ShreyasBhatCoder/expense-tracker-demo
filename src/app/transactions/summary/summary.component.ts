import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Chart, ChartConfiguration } from 'chart.js';
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
    const txDisplayGrp = this.tx_list().sort((a, b) => {
      const dateA = new Date(a.dateOfPurchase).getTime();
      const dateB = new Date(b.dateOfPurchase).getTime();
      return dateA - dateB;
    }).slice(-5);

    return {
      // 2. Map only the sliced items
      labels: txDisplayGrp.map(tx => getFormattedDate(tx.dateOfPurchase)),
      datasets: [
        {
          type: 'line',
          label: 'Amount Spent (in ₹)',
          data: txDisplayGrp.map(tx => tx.amountSpent),
          backgroundColor: '#612d53', // Light-mode
          // backgroundColor: 'rgba(129, 140, 248, 0.1)', // Dark-mode
          borderColor: '#612d53', // Light-mode
          // borderColor: '#818cf8', // Dark-mode
          borderWidth: 1,
          tension: 0,
          fill: false,
        }
      ]
    };
  });

  chartOptions: ChartConfiguration["options"] = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        // labels: {
        //   color: "#f1f5f9"
        // }
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          offset: false,
          // color: "#f1f5f9" // Dark-mode
        },
        ticks: {
          maxTicksLimit: 5,
          maxRotation: 45,
          minRotation: 45,
          padding: 15,
          // color: "#f1f5f9" // Dark-mode
        }
      },
      // Dark-mode
      // y: {
      //   grid: {color: "#f1f5f9"},
      //   ticks: {color: "#f1f5f9"}
      // }
    }
  };

  
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
