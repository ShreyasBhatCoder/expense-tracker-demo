import { Component, effect, computed, inject, AfterViewInit, OnDestroy } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark"; 
import { TransactionService } from '../../transaction-service.service';

@Component({
  selector: 'app-pie-chart',
  imports: [],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css',
  standalone: true
})
export class PieChart implements AfterViewInit, OnDestroy {
  private transactionService = inject(TransactionService);

  // 1. Maintain internal references to the chart structure
  private root!: am5.Root;
  private series!: am5percent.PieSeries;

  // 2. Build a truly reactive computed pipeline
  readonly chartData = computed(() => {
    // Reading the service's transaction list signal establishes the reactive dependency
    const rawData = this.transactionService.transactions();

    const grouped = this.transactionService.groupBy('itemCategory', rawData);
    const aggregated = this.transactionService.aggregateAmtByDate(grouped);
    const transformed = this.transactionService.transformToObjArray(aggregated, 'itemCategory', 'amountSpent');

    // Return the cleanly mapped format for amCharts
    return transformed.map((item) => ({
      itemCategory: item["itemCategory"],
      amountSpent: item["amountSpent"],
    }));
  });

  constructor() {
    // 3. Effect now ONLY updates data, it NEVER recreates the root element
    effect(() => {
      const dataUpdate = this.chartData(); // Tracks changes to the data

      // Only set data if the series has been fully initialized in AfterViewInit
      if (this.series && this.root) {
        // TYPE-SAFE COLOR FIX: Supply a fresh ColorSet instance to wipe the old sequence memory completely
        this.series.set("colors", am5.ColorSet.new(this.root, {}));
        
        // Push the update safely
        this.series.data.setAll(dataUpdate); 
        
        // Re-trigger layout interpolation animations smoothly
        this.series.appear(600, 100); 
      }
    });
  }

  ngAfterViewInit() {
    // 1. Initialize the chart layout ONCE
    const root = am5.Root.new("pie-chart-wrapper");

    // Activate animated theme
    root.setThemes([am5themes_Animated.new(root), am5themes_Dark.new(root)]);

    const chart = root.container.children.push(am5percent.PieChart.new(root, {}));

    // 2. Add colors to the series configuration
    const series = chart.series.push(am5percent.PieSeries.new(root, {
      name: "Purchases by Item Category",
      valueField: "amountSpent",
      categoryField: "itemCategory",
      // CRUCIAL: Assigns unique colors to every slice automatically
      colors: am5.ColorSet.new(root, {})
    }));

    // Save references for the effect and cleanup cycles
    this.root = root;
    this.series = series;

    // 3. Load the initial data
    const initialData = this.chartData();
    this.series.data.setAll(initialData);

    // 4. CRUCIAL: Trigger the entry animations for the chart and series
    series.appear(1000, 100);
    chart.appear(1000, 100);
  }


  ngOnDestroy() {
    // 5. Clean up chart memory structures when component unmounts
    if (this.root) {
      this.root.dispose();
    }
  }
}
