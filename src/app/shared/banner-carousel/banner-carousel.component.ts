import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Noticia } from 'src/app/core/modelos/noticia';

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
  @Input() public noticias: Noticia[] = [];
  @Output() onClick = new EventEmitter();

  constructor() { }

  ngOnInit(): void {

    this.clientCarrouselTimer = interval(this.intervalo).subscribe(() => {

      let step = this.stepClientCarrousel + 1;
      if (step >= this.noticias.length) {
        step = 0;
      }
      this.chooseClientCarrouselStep(step);
    });
  }

  ngOnDestroy(): void {
    if (!!this.clientCarrouselTimer) this.clientCarrouselTimer.unsubscribe;
  }

  tieneContenido(noticia: Noticia): boolean {
    return !!noticia.contenido;
  }

  onClicked(noticia: Noticia) {
    this.onClick.emit(noticia);
  }

  chooseClientCarrouselStep(step: number) {

    this.clientCarrouselTranslation = `translateX(-${step * 100}%)`;
    this.stepClientCarrousel = step;
  }

}
