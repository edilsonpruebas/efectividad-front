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

  // ✅ se añade { read: ManualReportComponent } para obtener la instancia
  // del componente y no el ElementRef del DOM
  @ViewChild('manualReportRef', { read: ManualReportComponent })
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
    this.activityService.reportManual(form).subscribe({
      next:  ()  => this.manualReportRef?.markSuccess(),
      error: (e) => this.manualReportRef?.markError(
        e.error?.error ?? 'Error al registrar el reporte'
      )
    });
  }
}