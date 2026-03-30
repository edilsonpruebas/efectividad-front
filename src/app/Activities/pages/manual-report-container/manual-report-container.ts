import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityService } from '../../services/activity';
import { ManualReportComponent } from '../../components/manual-report/manual-report';

@Component({
  selector: 'app-manual-report-container',
  standalone: true,
  imports: [CommonModule, ManualReportComponent],
  templateUrl: './manual-report-container.html',
})
export class ManualReportContainerComponent implements OnInit {

  @ViewChild('manualReportRef') manualReportRef!: ManualReportComponent;

  operators: any[] = [];
  processes: any[] = [];

  constructor(private activityService: ActivityService) {}

  ngOnInit() {
    this.activityService.getOperators()
      .subscribe(data => this.operators = data);

    this.activityService.getProcesses()
      .subscribe(data => this.processes = data);
  }

  submitManualReport(form: any) {
    this.activityService.reportManual(form).subscribe({
      next:  ()  => this.manualReportRef.markSuccess(),
      error: (e) => this.manualReportRef.markError(
        e.error?.error ?? 'Error al registrar el reporte'
      )
    });
  }
}