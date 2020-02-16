import { Injectable } from "@angular/core";
import { Post } from "./post";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable()
export class PostsService {
  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    // Send Http request . Angular HttpClient transforms it to json automatically
    // Requests  are only send if you subscribe.
    this.http
      .post("https://ng-http-tut-api.firebaseio.com/posts.json", postData)
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  // we could build a subject, or just return the request and subscribe in the
  // calling component.
  fetchPosts() {
    return (
      this.http
        .get<{ [key: string]: Post }>(
          "https://ng-http-tut-api.firebaseio.com/posts.json"
        )
        // 2. it is even better to add the type here, as the get function is a generic
        .pipe(
          map(responseData => {
            //.pipe(map((responseData: {[key: string]: Post}) => {
            // 1 .here the curly braces around the key mean signal to TS,
            // that we don't know how what key is named, we do know
            // that it is a string though.
            const postsArray: Post[] = [];
            for (const key in responseData) {
              if (responseData.hasOwnProperty(key)) {
                postsArray.push({ ...responseData[key], id: key });
              }
            }
            return postsArray;
          })
        )
    );
  }
}
