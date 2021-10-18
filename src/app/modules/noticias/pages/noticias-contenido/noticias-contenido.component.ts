import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';

@Component({
  selector: 'app-noticias-contenido',
  templateUrl: './noticias-contenido.component.html',
  styleUrls: ['./noticias-contenido.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NoticiasContenidoComponent implements OnInit {

  titulo = `Las 100 cosas que debes saber del Parguita`;
  noticia = `
    <h3>HOLA MUNDOOOOOOOO</h3>
    <span>Lorem ipsum dolor sit amet</span>
    <hr>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eu tortor nisl. Ut tristique purus accumsan urna ornare hendrerit. Vestibulum egestas tellus ullamcorper elit fringilla suscipit. Donec sodales lacus orci, quis rhoncus lectus auctor eu. Nullam pharetra nisl ut diam molestie, id scelerisque neque accumsan. In volutpat sapien odio, eget sollicitudin magna lacinia at. Mauris viverra justo ut leo tempor dictum. Aliquam sagittis metus vel finibus cursus. Integer gravida tincidunt nisi nec sollicitudin. In magna purus, rhoncus et finibus vel, sodales viverra risus. Nullam id tincidunt eros. Nam sed eros a arcu maximus mollis. Vestibulum mollis tincidunt aliquet.</p>
    <p>Donec egestas mi ac ultricies faucibus. Vestibulum finibus orci pulvinar, sodales metus vitae, varius augue. Etiam placerat purus sed lacus aliquam gravida. Aenean ut laoreet dui. Praesent maximus eros in lacus semper, eu feugiat ex posuere. Donec malesuada libero eu lacinia ullamcorper. Etiam bibendum odio purus, sit amet aliquam ligula vulputate quis. Donec vel ornare lorem, at malesuada mauris.</p>
  `;

  constructor(
    private router: ActivatedRoute,
    public configuracion: ConfiguracionesService
  ) { }

  ngOnInit(): void {

    this.router.params.subscribe(datos => {
      console.log(datos);
    });
  }

}
