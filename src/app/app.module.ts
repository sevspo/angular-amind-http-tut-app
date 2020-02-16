import { BrowserModule } from '@angular/platform-browser';
// ngModule is an example of how we import a module int the module and with imports it provides its classes to the templates of all components in the module.
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PostsService } from './posts.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  providers: [ PostsService ],
  bootstrap: [AppComponent]
})
export class AppModule {}
