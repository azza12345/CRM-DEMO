import { Component } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  public version = environment.versionNmber;
}
