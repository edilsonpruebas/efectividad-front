import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityService } from '../../services/activity';
import { ManualReportComponent } from '../../components/manual-report/manual-report';
import { forkJoin } from 'rxjs'; // ⬅️ Importación requerida

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
    this.activityService.getOperators().subscribe(data => this.operators = data);
    this.activityService.getProcesses().subscribe(data => this.processes = data);
  }

  // Recibe un arreglo de payloads
  submitManualReport(payloads: any[]) {
    // Mapeamos el arreglo de datos a un arreglo de peticiones HTTP (Observables)
    const requests = payloads.map(payload => 
      this.activityService.reportManual(payload)
    );

    // forkJoin ejecuta todas las peticiones en paralelo
    forkJoin(requests).subscribe({
      next: (results) => {
        // Se ejecuta solo si TODOS los cortes se guardaron correctamente en la BD
        this.manualReportRef?.markSuccess();
      },
      error: (e) => {
        // Si falla aunque sea un corte, se captura el error
        this.manualReportRef?.markError(
          e.error?.error ?? 'Error al registrar uno o más cortes en la base de datos.'
        );
      }
    });
  }
}