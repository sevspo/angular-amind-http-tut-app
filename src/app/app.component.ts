import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  isFetching = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts()
  }

  onCreatePost(postData: Post ) {
    // Send Http request . Angular HttpClient transforms it to json automatically
    // Requests  are only send if you subscribe.

    this.http.post('https://ng-http-tut-api.firebaseio.com/posts.json', postData)
    .subscribe(responseData =>{
      console.log(responseData)
    });
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts()
  }

  onClearPosts() {
    // Send Http request
  }

  private fetchPosts() {
    this.isFetching = true;
    this.http.get<{ [key: string]: Post }>('https://ng-http-tut-api.firebaseio.com/posts.json')
    // 2. it is even better to add the type here, as the get function is a generic
    .pipe(map(responseData => {
    //.pipe(map((responseData: {[key: string]: Post}) => {
      // 1 .here the curly braces around the key mean signal to TS, 
      // that we don't know how what key is named, we do know 
      // that it is a string though.
      const postsArray: Post[] = [];
      for (const key in responseData) {
        if (responseData.hasOwnProperty(key)) {
        postsArray.push({...responseData[key], id: key})
        }
      }
      return postsArray;
    }))
    .subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    });
  }
}
