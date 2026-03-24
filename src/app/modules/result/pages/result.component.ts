import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ResultService } from '../services/result.service';
import { environment } from '../../../../environments/environment';


interface City {
  name: string,
  code: string
}

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app-result',
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss'],
    standalone: false
})
export class ResultComponent {
  public readonly apiHost = environment.apiHost;

  constructor(
    private resultService: ResultService
  ) { }

  cities!: City[];
  public dates = [];
  public images = [];
  public date = '';

  formGroup!: FormGroup;

    ngOnInit() {
      this.formGroup = new FormGroup({
          selectedCity: new FormControl<City | null>(null)
      });

      this.resultService.getResultsDates().subscribe((data) => {
        this.dates = [...data].sort((left, right) => right.date.localeCompare(left.date));

        if (this.dates.length) {
          const latestDate = this.dates[0];
          this.formGroup.patchValue({ selectedCity: latestDate }, { emitEvent: false });
          this.onChange(latestDate);
        }
      });
    } 

    onChange(newValue) {
      if (!newValue?.date) {
        this.images = [];
        return;
      }

      this.date = newValue.date;
      this.resultService.getResultsByDate(newValue.date).subscribe((data) => {
        this.images = data;
      });
    }

    getRsultByDate() {
      this.resultService.getResultsByDate(this.date).subscribe((data) => {
        this.images = data;
      });
    }

    toggleResult(id, value) {
      this.resultService.updateResult(id, value).subscribe((data) => {
        this.getRsultByDate();
      });
    }

}
