import { Component, OnInit, OnDestroy } from "@angular/core";
import { PostsService } from "./posts.service";
import { Subscription } from 'rxjs';
import { Post } from "./post";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.onFetchPosts();
  }

  onCreatePost(postData: Post) {
    // Call the method in the service
    this.postsService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request to the serve
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(data => {
      this.loadedPosts = data;
      this.isFetching = false;
    }, error => {
      this.error = error.message;
    });
    this.errorSub = this.postsService.error.subscribe(emessage => {
      this.error = emessage;
    })
  }

  onClearPosts() {
    // Send Http request to the server
    this.postsService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }

  // onDeletePost(post: Post) {
  //   console.log(post.target)
  // }

  // private fetchPosts() {
  //   //this.isFetching = true;
  // }

  onHandleError() {
    this.isFetching = false;
    this.error = null;
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }
}
