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

  @ViewChild('manualReportRef')
  manualReportRef!: ManualReportComponent;

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
    console.log('1. submitManualReport llamado', form);

    this.activityService.reportManual(form).subscribe({
      next: (res) => {
        console.log('2. next ejecutado', res);
        console.log('3. manualReportRef existe?', !!this.manualReportRef);
        this.manualReportRef?.markSuccess();
        console.log('4. markSuccess llamado');
      },
      error: (e) => {
        console.log('2. error ejecutado', e);
        console.log('3. manualReportRef existe?', !!this.manualReportRef);
        this.manualReportRef?.markError(
          e.error?.error ?? 'Error al registrar el reporte'
        );
        console.log('4. markError llamado');
      }
    });
  }
}