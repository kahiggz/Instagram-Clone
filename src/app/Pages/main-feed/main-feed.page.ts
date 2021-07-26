import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ImagesService } from 'src/app/Services/Images/images.service';
import { UsersService } from 'src/app/Services/Users/users.service';




@Component({
  selector: 'app-main-feed',
  templateUrl: './main-feed.page.html',
  styleUrls: ['./main-feed.page.scss'],
})
export class MainFeedPage implements OnInit {
  users: any;
  images: any;
  combined: any;
  page: number;
  newUsers: any;
  newImages: any;
  newCombined: any;
  set = {
    slidesPerView: 5,
    spaceBetween: 10,
    slidesOffsetBefore: 0,
  };


  constructor(
    private router: Router,
    private usersService: UsersService,
    private imagesService: ImagesService,
    public loadingController: LoadingController,
    public modalController: ModalController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loadData();
  }

  async loadData() {
    this.page = Math.floor((Math.random() * 100) + 1);
    if (this.page >= 90) {
      this.page = this.page - 40;
    }

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();

    this.usersService.getUsers(this.page).subscribe((resp: any) => {
      console.log('Users', resp.results);
      this.users = resp.results;

      this.imagesService.getImages(this.page).subscribe((resp: any) => {
        console.log('Images', resp);
        this.images = resp;

        this.combined = this.users.map((user, index) => {
          return { user: user, picture: this.images[index] };
        });
        console.log(this.combined);

      });

      loading.dismiss();
    });
  }

  moreData(event) {
    this.page++
    console.log('page increments', this.page)

    this.usersService.getUsers(this.page).subscribe((resp: any) => {

      this.newUsers = resp.results;
      this.imagesService.getImages(this.page).subscribe((resp: any) => {

        this.newImages = resp;

        this.newCombined = this.newUsers.map((newUser, index) => {
          return { user: newUser, picture: this.newImages[index] };
        });
        console.log('new combined', this.newCombined);
        this.combined.push(...this.newCombined)

      });
      event.target.complete();
    });
  }

  refresh(event) {
    this.loadData().then(() => {
      event.target.complete();
    });
  }

  profile(user){
    console.log(user)
    this.router.navigate(['/profile', { user: JSON.stringify(user) }]);

  }



}
