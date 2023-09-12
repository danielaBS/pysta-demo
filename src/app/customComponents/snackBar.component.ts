
import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

@Component({
    selector: 'snack-bar-component',
    template: `
    <span class="example-pizza-party">
    ✅ {{data}}
    </span> 
    `,
    styles: [`
      .example-pizza-party {
        color: white;
        font-size:18px
      }
    `],
  })
  export class SnackBarComponent { 
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) { }   
  }