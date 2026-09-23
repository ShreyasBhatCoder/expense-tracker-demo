import { InjectionToken, Provider } from "@angular/core";

export type ItemCategory = "Foods" | "Utilities" | "Transportation" | "Shopping" | "Health" | "Financial" | "Misc"; 

export type TransactionLog = {
    id: number;
    itemName: string;
    itemCategory: ItemCategory;
    amountSpent: number;
    dateOfPurchase: string;
}

export const categories: ItemCategory[] = [
  "Foods",
  "Utilities",
  "Transportation",
  "Shopping",
  "Health",
  "Financial",
  "Misc"
];
export const CATEGORIES = new InjectionToken<ItemCategory[]>('CATEGORIES');

export const categoriesListProvider: Provider = {
  provide: CATEGORIES,
  useValue: categories
}