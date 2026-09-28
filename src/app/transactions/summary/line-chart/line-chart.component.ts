import { Component, computed, effect, inject, AfterViewInit, OnDestroy } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import { TransactionService } from '../../transaction-service.service';
import { ThemeService } from '../../../theme-service.service';
import { getFormattedDate } from '../../../../../utils/utils.module';

@Component({
  selector: 'app-line-chart',
  imports: [],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css',
  standalone: true,
})
export class LineChart implements AfterViewInit, OnDestroy {
  private transactionService = inject(TransactionService);
  private themeService = inject(ThemeService);

  private root!: am5.Root;
  private darkTheme!: am5.Theme;
  private xAxis!: am5xy.CategoryAxis<am5xy.AxisRenderer>;
  private series!: am5xy.LineSeries;

  readonly chartData = computed(() => {
    const rawData = this.transactionService.transactions();

    // 1. Normalize each transaction's date to 'YYYY-MM-DD' so same-day purchases share the exact same key
    const normalizedData = rawData.map(tx => ({
      ...tx,
      dateOfPurchase: getFormattedDate(tx.dateOfPurchase)
    }));

    // 2. Group by the normalized calendar date
    const grouped = this.transactionService.groupBy('dateOfPurchase', normalizedData);

    // 3. Aggregate amounts per day
    const aggregated = this.transactionService.aggregateAmtByDate(grouped);

    // 4. Transform to [{ date: '...', value: ... }]
    const transformed = this.transactionService.transformToObjArray(aggregated, 'date', 'value');

    // 5. Sort chronologically by date
    transformed.sort((a, b) => new Date(a["date"]).getTime() - new Date(b["date"]).getTime());

    // Return last 5 days
    return transformed.slice(-5);
  });


  constructor() {
    effect(() => {
      const data = this.chartData();
      if (this.xAxis && this.series) {
        this.xAxis.data.setAll(data);
        this.series.data.setAll(data);
      }
    });

    effect(() => {
      const isDark = this.themeService.isDarkMode();
      if (this.root && this.darkTheme) {
        const themes: am5.Theme[] = [am5themes_Animated.new(this.root)];
        if (isDark) {
          themes.push(this.darkTheme);
        }
        this.root.setThemes(themes);
      }
    });
  }

  ngAfterViewInit(): void {
    const root = am5.Root.new("line-chart-wrapper");
    this.darkTheme = am5themes_Dark.new(root);

    const initialThemes: am5.Theme[] = [am5themes_Animated.new(root)];
    if (this.themeService.isDarkMode()) {
      initialThemes.push(this.darkTheme);
    }
    root.setThemes(initialThemes);

    const lineChart = root.container.children.push(am5xy.XYChart.new(root, {}));

    const yAxis = lineChart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 20
    });

    // Make grid lines visible and align with data points (bullets)
    xRenderer.grid.template.setAll({
      location: 0.5,
      strokeOpacity: 0.15,
      visible: true
    });

    // Ensure labels align with the data points and show all of them with slight rotation if needed
    xRenderer.labels.template.setAll({
      location: 0.5,
      rotation: -25,
      centerY: am5.p50,
      centerX: am5.p100,
      fontSize: 11
    });

    xRenderer.labels.template.adapters.add("text", (text, target) => {
      const dataItem = target.dataItem as am5.DataItem<am5xy.ICategoryAxisDataItem>;
      const rawDate = dataItem?.get("category");
      return rawDate ? getFormattedDate(rawDate) : text;
    });

    const xAxis = lineChart.xAxes.push(am5xy.CategoryAxis.new(root, {
      renderer: xRenderer,
      categoryField: "date"
    }));

    const series = lineChart.series.push(am5xy.LineSeries.new(root, {
      name: "Series",
      valueYField: "value",
      categoryXField: "date",
      xAxis: xAxis,
      yAxis: yAxis,
      tooltip: am5.Tooltip.new(root, {
        labelText: "Total expense: ₹{valueY}",
        pointerOrientation: "down"
      })
    }));

    lineChart.set("cursor", am5xy.XYCursor.new(root, {}));

    series.bullets.push(() => am5.Bullet.new(root, {
      sprite: am5.Circle.new(root, {
        radius: 5
      })
    }));

    this.root = root;
    this.xAxis = xAxis;
    this.series = series;

    const initialData = this.chartData();
    xAxis.data.setAll(initialData);
    series.data.setAll(initialData);

    series.appear(1000);
    lineChart.appear(1000, 100);
  }

  ngOnDestroy(): void {
    if (this.root) {
      this.root.dispose();
    }
  }
}
