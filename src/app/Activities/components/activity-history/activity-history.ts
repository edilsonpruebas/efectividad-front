import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common'; 

@Component({
  selector: 'app-activity-history',
  imports: [FormsModule, NgFor, NgIf, DatePipe],
  templateUrl: './activity-history.html',
  styleUrls: ['./activity-history.css']
})
export class ActivityHistoryComponent {
  @Input() history: any[] = [];
}