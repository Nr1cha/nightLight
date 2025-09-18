import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
})
export class ColorPickerComponent implements AfterViewInit {
  @ViewChild('spectrumCanvas') spectrumCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('saturationCanvas') saturationCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('brightnessCanvas') brightnessCanvas!: ElementRef<HTMLCanvasElement>;

  selectedColor = { h: 0, s: 1, v: 1 }; // HSV color model
  rgbColor = 'rgb(255, 0, 0)'; // Initial RGB color

  ngAfterViewInit() {
    this.drawSpectrum();
    this.drawSaturation();
    this.drawBrightness();
    this.addEventListeners();
  }

  drawSpectrum() {
    const ctx = this.spectrumCanvas.nativeElement.getContext('2d')!;
    const width = this.spectrumCanvas.nativeElement.width;
    const height = this.spectrumCanvas.nativeElement.height;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const h = (x / width) * 360;
        ctx.fillStyle = `hsl(${h}, 100%, 50%)`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  drawSaturation() {
    const ctx = this.saturationCanvas.nativeElement.getContext('2d')!;
    const width = this.saturationCanvas.nativeElement.width;
    const height = this.saturationCanvas.nativeElement.height;

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, `hsl(${this.selectedColor.h}, 0%, 50%)`);
    gradient.addColorStop(1, `hsl(${this.selectedColor.h}, 100%, 50%)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  drawBrightness() {
    const ctx = this.brightnessCanvas.nativeElement.getContext('2d')!;
    const width = this.brightnessCanvas.nativeElement.width;
    const height = this.brightnessCanvas.nativeElement.height;

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, `hsl(${this.selectedColor.h}, ${this.selectedColor.s * 100}%, 0%)`);
    gradient.addColorStop(1, `hsl(${this.selectedColor.h}, ${this.selectedColor.s * 100}%, 100%)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  addEventListeners() {
    const spectrum = this.spectrumCanvas.nativeElement;
    const saturation = this.saturationCanvas.nativeElement;
    const brightness = this.brightnessCanvas.nativeElement;

    spectrum.addEventListener('mousedown', (e: MouseEvent) => this.handleSpectrumClick(e));
    saturation.addEventListener('mousedown', (e: MouseEvent) => this.handleSaturationClick(e));
    brightness.addEventListener('mousedown', (e: MouseEvent) => this.handleBrightnessClick(e));
  }

  handleSpectrumClick(event: MouseEvent) {
    const rect = this.spectrumCanvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    this.selectedColor.h = (x / rect.width) * 360;
    this.drawSaturation();
    this.drawBrightness();
    this.updateColor();
  }

  handleSaturationClick(event: MouseEvent) {
    const rect = this.saturationCanvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    this.selectedColor.s = x / rect.width;
    this.drawBrightness();
    this.updateColor();
  }

  handleBrightnessClick(event: MouseEvent) {
    const rect = this.brightnessCanvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    this.selectedColor.v = x / rect.width;
    this.updateColor();
  }

  updateColor() {
    const { h, s, v } = this.selectedColor;
    const rgb = this.hsvToRgb(h, s, v);
    this.rgbColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }

  hsvToRgb(h: number, s: number, v: number) {
    let r, g, b;
    const i = Math.floor(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
      default:
        r = g = b = 0;
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }
}
