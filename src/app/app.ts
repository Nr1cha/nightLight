import { Component, signal } from '@angular/core';
import { ColorPickerComponent } from './color-picker/color-picker.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ColorPickerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('nightlight-app');
}
