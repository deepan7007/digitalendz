import { Component } from '@angular/core';
import { NbLoginComponent, NbAuthResult } from '@nebular/auth';

@Component({
  selector: 'ngx-login',
    templateUrl: './login.component.html',
})
export class LoginComponent extends NbLoginComponent {

  login(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    this.service.authenticate(this.strategy, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;
      
      if (result.isSuccess()) {
        let value = JSON.parse(JSON.stringify(result)).response.body.data.payload;
        localStorage.setItem("module_list", JSON.stringify(value));
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