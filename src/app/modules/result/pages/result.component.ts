import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ResultService } from '../services/result.service';


interface City {
  name: string,
  code: string
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent {

  constructor(
    private resultService: ResultService
  ) { }

  cities!: City[];
  public dates = [];
  public images = [];

  formGroup!: FormGroup;

    ngOnInit() {
      this.resultService.getResultsDates().subscribe((data) => {
        this.dates = data;
      });

      this.formGroup = new FormGroup({
          selectedCity: new FormControl<City | null>(null)
      });
    } 

    onChange(newValue) {
      this.resultService.getResultsByDate(newValue.date).subscribe((data) => {
        this.images = data;
        console.log(this.images);
      });
    }

}
