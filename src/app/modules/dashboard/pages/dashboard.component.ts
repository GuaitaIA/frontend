import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { StatisticsService } from '../services/statistics.service';
import { DatePipe } from '@angular/common';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

    public detections: any = [];

    data: any;

    options: any;

    date: Date | undefined;

    constructor(
        private statisticsService: StatisticsService,
        private datePipe: DatePipe
    ) { }

    ngOnInit() {
        this.date = new Date();
        this.statisticsService.getStatistics().subscribe(
            response => {
                this.detections = response;
                console.log('DashboardComponent: ngOnInit: response', response);

                this.data = {
                    labels: this.obtenerEtiquetas(this.detections![1]),
                    datasets: [
                        {
                            label: 'Positivos',
                            backgroundColor: documentStyle.getPropertyValue('--green-500'),
                            borderColor: documentStyle.getPropertyValue('--green-500'),
                            data: this.obtenerDetecciones(this.detections![1])
                        },
                        {
                            label: 'Negatius',
                            backgroundColor: documentStyle.getPropertyValue('--red-500'),
                            borderColor: documentStyle.getPropertyValue('--red-500'),
                            data: this.obtenerNoDetecciones(this.detections![1])
                        }
                    ]
                };
            },
            error => {
                console.log('DashboardComponent: ngOnInit: error', error);
            }
        );

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }

            }
        };
    }

    // Función para obtener las etiquetas
    obtenerEtiquetas(resultados): string[] {
        return resultados.map(resultado => {
            const fecha = new Date(resultado.hour);
            return this.datePipe.transform(fecha, 'HH:mm:ss');
        });
    }

    // Función para obtener los datos de detecciones
    obtenerDetecciones(resultados): number[] {
        return resultados.map(resultado => resultado.total_detections);
    }

    // Función para obtener los datos de no detecciones
    obtenerNoDetecciones(resultados): number[] {
        return resultados.map(resultado => resultado.total_not_detections);
    }

    onChange(newValue) {
        const documentStyle = getComputedStyle(document.documentElement);
        this.statisticsService.getStatistics(this.convertirFecha(newValue)).subscribe(
            response => {
                this.detections = response;
                console.log('DashboardComponent: ngOnInit: response', response);

                this.data = {
                    labels: this.obtenerEtiquetas(this.detections![1]),
                    datasets: [
                        {
                            label: 'Positivos',
                            backgroundColor: documentStyle.getPropertyValue('--green-500'),
                            borderColor: documentStyle.getPropertyValue('--green-500'),
                            data: this.obtenerDetecciones(this.detections![1])
                        },
                        {
                            label: 'Negatius',
                            backgroundColor: documentStyle.getPropertyValue('--red-500'),
                            borderColor: documentStyle.getPropertyValue('--red-500'),
                            data: this.obtenerNoDetecciones(this.detections![1])
                        }
                    ]
                };
            },
            error => {
                console.log('DashboardComponent: ngOnInit: error', error);
            }
        );
    }

    convertirFecha(fechaOriginal: string): string {
        // Convierte la cadena de fecha a un objeto Date
        const fecha = new Date(fechaOriginal);
    
        // Aplica el formato deseado ('yyyy-MM-dd' en este caso)
        const fechaFormateada = this.datePipe.transform(fecha, 'yyyy-MM-dd');
    
        return fechaFormateada || ''; // Asegúrate de manejar el caso en que la conversión falle
      }
    
    
}
