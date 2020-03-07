import { Injectable } from "@angular/core";
import { Post } from "./post";
import { HttpClient } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { Subject, throwError } from 'rxjs';

@Injectable()
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    // Send Http request . Angular HttpClient transforms it to json automatically
    // Requests  are only sent if you subscribe.
    this.http
      .post("https://ng-http-tut-api.firebaseio.com/posts.json", postData)
      .subscribe(responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message);
      });
  }

  // we could build a subject, or just return the request and subscribe in the
  // calling component.
  fetchPosts() {
    return (
      this.http
        // 2. it is even better to add the type here, as the get function is a generic
        .get<{ [key: string]: Post }>(
            //.pipe(map((responseData: {[key: string]: Post}) => {
            // 1 .here the brackets around the key mean signal to TS,
            // that we don't know how what key is named, we do know
            // that it is a string though.
          "https://ng-http-tut-api.firebaseio.com/posts.json"
        )
        .pipe(
          map(responseData => {
            const postsArray: Post[] = [];
            for (const key in responseData) {
              if (responseData.hasOwnProperty(key)) {
                postsArray.push({ ...responseData[key], id: key });
              }
            }
            return postsArray;
          }),
          catchError(errRes => {
            // send to analytic server etc. not relatet to UI, behind the 
            // scenes stuff. but we have to wrap it with throwError
            return throwError(errRes);
          })

        )
    );
  }

  deletePosts() {
    return this.http.delete('https://ng-http-tut-api.firebaseio.com/posts.json')
  }
}
