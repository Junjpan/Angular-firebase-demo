import { Component, OnDestroy } from '@angular/core';
import { AngularFireDatabase} from '@angular/fire/database';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'firebase-Angular-Demo';
  books$; // $ sign is a convention indicating it is an observable , this is equal courses$:Observable,but it is not required
  courses: any[];
  author$;
  subscription: Subscription ;
  keys: string[];

  constructor(private db: AngularFireDatabase) {
    this.subscription = db.list('/courses')
       .valueChanges()
       .subscribe(courses => {
        this.courses = courses;
        // console.log(this.courses);
       });

    this.db.list('/courses').snapshotChanges().subscribe(val => {
       this.keys = val.map((data) => {
           return data.key;
       });
         });

    this.author$ = db.object('/authors/1').valueChanges(); // It is observable.


    // use async pipe method simplify the code and don't need to implement ngOnDestroy() and subscribe()
    this.books$ = db.list('/books').valueChanges();

  // tslint:disable-next-line: max-line-length
  } // realtime database,everytime the firebase's database is changed, the broswer will get update automatically, which can potentially cause memory leak.
   // You can either use ngOnDestroy() or use async pipe to aviod this problem
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

    add(course: HTMLInputElement) {
      this.db.list('/courses').push({
        name: course.value,
        price: 150,
        isLive: true,
        sections: [
           { title: 'Components' },
           { title: 'Directives' },
           { title: 'Template' },
        ]
      });
      course.value = '' ;
    }

    update( course,  index: number ) {
    this.db.object('/courses/' + this.keys[index] + '/name')
        // tslint:disable-next-line: max-line-length
        .set(course.name + 'updated'); // you can put an object inside as well, set method will replace the value of object entirely with the object pass here.
    this.db.object('/courses/' + this.keys[index] )
        .update({isLive: false, students: 100}); // update method will only update these two propeties, if one of the propety is not
                                                  // exsit, it will be added into the database
      }

    delete(index: number) {
      this.db.object('/courses/' + this.keys[index])
          .remove();
    }
}
