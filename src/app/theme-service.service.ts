import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  isDarkMode = signal<boolean>(false);

  toggleDarkMode() {
    this.isDarkMode.update((currentValue) => !currentValue);
    document.body.classList.toggle('dark', this.isDarkMode());
  }
}
