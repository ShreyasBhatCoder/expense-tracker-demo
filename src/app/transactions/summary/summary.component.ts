import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { TransactionService } from '../transaction-service.service';
import { ThemeService } from '../../theme-service.service';
import { slice } from '../../../../utils/utils.module';

@Component({
  selector: 'app-summary',
  imports: [CurrencyPipe, BaseChartDirective],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css',
  providers: [provideCharts(withDefaultRegisterables())]
})
export class Summary {
  
  transactionService = inject(TransactionService);
  themeService = inject(ThemeService);
  
  tx_list = this.transactionService.transactions;
  isDark = this.themeService.isDarkMode; // 3. Alias the dark mode signal

  data = computed<ChartConfiguration['data']>(() => {
    const groupedData = this.transactionService.groupByDate(this.tx_list().sort((a, b) => {
      const dateA = Date.parse(a.dateOfPurchase);
      const dateB = Date.parse(b.dateOfPurchase);
      return dateA - dateB;
    }));
    const txDisplayGrp = slice(groupedData, -5);
    const aggregatedAmt = this.transactionService.aggregateAmtByDate(txDisplayGrp);

    // Dynamic colors based on theme signal status
    const datasetBgColor = this.isDark() ? 'rgba(129, 140, 248, 0.1)' : 'rgba(97, 45, 83, 0.1)';
    const datasetBorderColor = this.isDark() ? '#818cf8' : '#612d53';

    return {
      labels: Object.keys(aggregatedAmt),
      datasets: [
        {
          type: 'line',
          label: 'Amount Spent (in ₹)',
          data: Object.values(aggregatedAmt),
          backgroundColor: datasetBgColor,
          borderColor: datasetBorderColor,
          borderWidth: 1,
          tension: 0,
          fill: false,
        }
      ]
    };
  });

  // 4. Change chartOptions into a reactive computed signal
    // Change chartOptions into a reactive computed signal with dynamic keys
  chartOptions = computed<ChartConfiguration["options"]>(() => {
    const isDarkTheme = this.isDark; // Track dependency
    const textColor = isDarkTheme() ? "#f1f5f9" : "#1e293b"; 
    const gridColor = isDarkTheme() ? "rgba(241, 245, 249, 0.15)" : "rgba(30, 41, 59, 0.1)";
    
    // Create a dynamic scale ID key string based on the theme state
    const currentThemeKey = isDarkTheme() ? 'dark' : 'light';

    return {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        // Adding the key property forces Chart.js to re-render the axis completely
        x: {
          key: currentThemeKey, 
          grid: {
            display: true,
            offset: false,
            color: gridColor
          },
          ticks: {
            maxTicksLimit: 5,
            maxRotation: 45,
            minRotation: 45,
            padding: 15,
            color: textColor
          }
        },
        y: {
          key: currentThemeKey,
          grid: { color: gridColor },
          ticks: { color: textColor }
        }
      }
    };
  });


  get getCumulativeSum() {
    let cumulativeAmt: number = 0;
    for (let i = 0; i < this.tx_list().length; i++) {
      cumulativeAmt += this.tx_list()[i].amountSpent;
    }
    return cumulativeAmt;
  }

  get averageSpend() {
    const list = this.tx_list();
    return list.length ? Math.round(this.getCumulativeSum / list.length) : 0;
  }
}
