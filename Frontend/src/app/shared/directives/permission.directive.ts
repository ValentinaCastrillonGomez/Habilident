import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { Permission } from '@habilident/types';

@Directive({
  selector: '[appPermission]'
})
export class PermissionDirective {
  private readonly authService = inject(AuthService);
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);

  @Input() set appPermission(permission: Permission) {
    this.updateView(permission);
  }

  private updateView(permission: Permission) {
    (this.authService.hasPermission(permission))
      ? this.viewContainer.createEmbeddedView(this.templateRef)
      : this.viewContainer.clear();
  }

}
