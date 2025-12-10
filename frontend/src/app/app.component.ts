import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./layout/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header></app-header>
    <main style="flex: 1; overflow: auto;">
      <router-outlet/>
    </main>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100%;
    }
  `]
})
export class AppComponent {
  title = 'frontend';
}
