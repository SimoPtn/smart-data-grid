import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'smart-data-grid-theme';

  private readonly themeSubject = new BehaviorSubject<Theme>('light');
  readonly theme$ = this.themeSubject.asObservable();

  initTheme(): void {
    const stored = localStorage.getItem(this.storageKey) as Theme | null;

    if (stored) {
      this.applyTheme(stored);
      return;
    }

    this.applyTheme('light');
  }

  toggleTheme(): void {
    const current = this.getCurrentTheme();
    const next = current === 'dark' ? 'light' : 'dark';

    this.applyTheme(next);
  }

  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  private applyTheme(theme: Theme): void {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);

    this.themeSubject.next(theme);
    localStorage.setItem(this.storageKey, theme);
  }
}