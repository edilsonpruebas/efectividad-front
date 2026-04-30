import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityService } from '../../services/activity';
import { ManualReportComponent } from '../../components/manual-report/manual-report';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-manual-report-container',
  standalone: true,
  imports: [CommonModule, ManualReportComponent],
  templateUrl: './manual-report-container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManualReportContainerComponent implements OnInit {

  @ViewChild('manualReportRef')
  manualReportRef!: ManualReportComponent;

  operators: any[] = [];
  processes: any[] = [];

  constructor(
    private activityService: ActivityService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.activityService.getOperators().subscribe(data => {
      this.operators = data;
      this.cdr.markForCheck();
    });

    this.activityService.getProcesses().subscribe(data => {
      this.processes = data;
      this.cdr.markForCheck();
    });
  }

  submitManualReport(payloads: any[]) {
    const requests = payloads.map(payload =>
      this.activityService.reportManual(payload)
    );

    forkJoin(requests).subscribe({
      next: () => {
        this.manualReportRef?.markSuccess();
        this.cdr.markForCheck();
      },
      error: (e) => {
        this.manualReportRef?.markError(
          e.error?.error ?? 'Error al registrar uno o más cortes en la base de datos.'
        );
        this.cdr.markForCheck();
      }
    });
  }
}