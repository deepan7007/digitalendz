import { Component } from '@angular/core';
import { NbLoginComponent, NbAuthResult } from '@nebular/auth';

@Component({
  selector: 'ngx-login',
  styles: ['{::ng-deep .navigation .link nb-icon { display: none !important; }'],
  templateUrl: './login.component.html',
})
export class LoginComponent extends NbLoginComponent {

  login(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    this.service.authenticate(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      console.log(result);
      let value = JSON.parse(JSON.stringify(result)).response.body.data.payload;
      console.log(value);
      localStorage.setItem("module_list", JSON.stringify(value));
      this.submitted = false;

      if (result.isSuccess()) {
        this.messages = result.getMessages();
      } else {
        this.errors = result.getErrors();
      }

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
      this.cd.detectChanges();
    });
  }
}