import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { Component, inject } from '@angular/core';
import { NotificationService } from '@core/services/notification.service';
import { MaterialModule } from '@shared/modules/material/material.module';

@Component({
  selector: 'app-notifications',
  imports: [
    MaterialModule,
    CdkMenu, CdkMenuItem
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  private readonly notificationService = inject(NotificationService);

  notifications = this.notificationService.notifications;

  async open(formatId: string) {
    // const format = await this.formatsService.get(formatId);
    // const dialogRef = this.dialog.open(RecordComponent, { data: { format } });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) this.notificationService.loadNotifications();
    // });
  }

}
