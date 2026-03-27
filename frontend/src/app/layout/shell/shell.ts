import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemeService } from '../../core/services/theme';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, MatIconModule, MatSlideToggleModule],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly themeService = inject(ThemeService);

  readonly theme$ = this.themeService.theme$;

  onToggleTheme(): void {
    this.themeService.toggleTheme();
  }
}