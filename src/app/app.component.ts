import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ComponentsModule } from "./web/components/components.module";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ ComponentsModule,RouterModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'wasi-front';
}
