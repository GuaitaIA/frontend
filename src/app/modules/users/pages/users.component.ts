import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { MessageService } from 'primeng/api';

interface Product {
  name: string;
  code: number;
  category: string;
  quantity: number;
}

interface Zones {
  id: number;
  name: string;
}

interface Roles {
  id: number;
  name: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent {

  products!: Product[];
  zones!: Zones[];
  roles!: Roles[];

  visible: boolean = false;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    // generate rondom Products
    this.products = this.generateProducts();

    this.zones = [
      { id: 1, name: 'Europe/Madrid' },
    ];

    this.roles = [
      { id: 1, name: 'superadmin' },
      { id: 2, name: 'user' },
    ];

    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      role: ['', Validators.required],
      zones_id: ['', Validators.required],
      password: ['test', Validators.required],
    });
  }

  generateProducts(): Product[] {
    let products: Product[] = [];
    for (let i = 0; i < 100; i++) {
      products.push({
        name: 'Product ' + i,
        code: i,
        category: 'Category ' + i % 8,
        quantity: Math.floor(Math.random() * 1000)
      });
    }
    return products;
  }

  add() {
    this.visible = true;
  }

  submit() {
    if(this.form.valid) {
      this.usersService.create(this.form.value).subscribe(
        (response) => {
          console.log(response);
          this.visible = false;
          this.messageService.add({ severity: 'success', summary: 'Usuario', detail: 'Usuario creado correctamente' });
        }, (error) => {
          console.log(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el usuario' });
        });
    }
  }

}
