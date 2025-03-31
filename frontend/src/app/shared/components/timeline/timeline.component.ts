import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-timeline',
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css'
})
export class TimelineComponent {
  @Input() steps: string[] = [];
  @Input() currentStep!: string;

  getCurrentIndex(): number {
    return this.steps.indexOf(this.currentStep);
  }

  isCompleted(step: string): boolean {
    return this.steps.indexOf(step) <= this.getCurrentIndex();
  }
}
