import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AlertsComponent {

}
