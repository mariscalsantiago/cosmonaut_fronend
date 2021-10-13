import { interval, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-banner-carousel',
  templateUrl: './banner-carousel.component.html',
  styleUrls: ['./banner-carousel.component.scss']
})
export class BannerCarouselComponent implements OnInit, OnDestroy {

  clientCarrouselTranslation: string = 'translateX(0%)';
  stepClientCarrousel: number = 0;
  clientCarrouselTimer: Subscription | undefined = undefined;

  @Input() public intervalo: number = 4000;
  @Input() public banners: string[] = [];

  constructor() { }

  ngOnInit(): void {

    this.clientCarrouselTimer = interval(this.intervalo).subscribe(() => {

      let step = this.stepClientCarrousel + 1;
      if (step >= this.banners.length) {
        step = 0;
      }
      this.chooseClientCarrouselStep(step);
    });
  }

  ngOnDestroy(): void {
    if (!!this.clientCarrouselTimer) this.clientCarrouselTimer.unsubscribe;
  }

  chooseClientCarrouselStep(step: number) {

    this.clientCarrouselTranslation = `translateX(-${step * 100}%)`;
    this.stepClientCarrousel = step;
  }

}
