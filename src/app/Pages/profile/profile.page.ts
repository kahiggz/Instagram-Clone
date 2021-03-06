import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ImagesService } from 'src/app/Services/Images/images.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any;
  Images: Object;
  page: number;
  followers: number;
  following: number;
  posts: number;
  segmentModel = "home";
  

  constructor(private route: ActivatedRoute,
    private imagesService: ImagesService,
    private router: Router,
    public loadingController: LoadingController,

    ) {
    this.user = JSON.parse(this.route.snapshot.paramMap.get('user')) || 0;
  }

  ngOnInit() {
  }
 
  ionViewDidEnter() {
    this.getImages();
  }

  async getImages() {

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present(); 
    
    this.page = Math.floor((Math.random() * 100) + 1);
    if (this.page >= 90) {
      this.page = this.page - 40;
    }

    this.imagesService.getImages(this.page).subscribe((resp:any) => {


      this.Images = resp;
      this.posts = resp.length;
      this.followers = this.getFollowers();
      this.following = this.getFollowing();
      console.log(this.Images);
      loading.dismiss();

    });
  }

  getFollowers() {
    return Math.floor((Math.random() * 100000) + 1);
  }

  getFollowing() {
    return Math.floor((Math.random() * 10000) + 1);
  }

  viewPost(id){
  
    this.router.navigate(['/posts', ({ user: JSON.stringify(this.user),images:JSON.stringify(this.Images),selectedId:JSON.stringify(id)})]);

  }

  segmentChanged(ev: any) {
    // console.log('Segment changed', ev);
  }

}
