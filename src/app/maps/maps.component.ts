import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapsService } from '../services/maps.service';
import { Geolocation } from '@capacitor/geolocation';
import { DOCUMENT } from '@angular/common';
import { Direccion } from '../interfaces/direccion';

declare let google: any;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
})
export class MapsComponent implements OnInit {
  @Input() position: Direccion = {
    lat: -2.898116,
    lng: -78.99958149999999,
  };
  @ViewChild('map') divMap: ElementRef;
  @ViewChild('search') search: ElementRef;

  label = {
    titulo: 'Ubicacion',
    subtitulo: 'Ubicacion a enviar',
  };

  map: any;
  marker: any;
  positionSet: any;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document,
    private mapsService: MapsService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.init();
  }

  async init() {
    this.mapsService
      .init(this.renderer, this.document)
      .then(() => {
        this.initMap();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  initMap() {
    const pos = this.position;
    const latLng = new google.maps.LatLng(pos.lat, pos.lng);
    const mapOptions = {
      center: latLng,
      zoom: 15,
      disableDefaultUI: true,
      clickableIcons: false,
    };

    this.map = new google.maps.Map(this.divMap.nativeElement, mapOptions);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
      this.search.nativeElement
    );
    const autocomplete = new google.maps.places.Autocomplete(
      this.search.nativeElement
    );
    autocomplete.bindTo('bounds', this.map);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);
      }
      this.addMarker({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    });
    autocomplete.setComponentRestrictions({
      country: ['mx'],
    });
    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      draggable: true,
    });
    this.clickHandlerEvent();
    if (this.label.titulo.length) {
      this.addMarker(pos);
    }
  }

  clickHandlerEvent() {
    this.map.addListener('click', (event) => {
      const position = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      this.addMarker(position);
    });
  }

  addMarker(position) {
    const latLng = new google.maps.LatLng(position.lat, position.lng);
    this.marker.setPosition(latLng);
    this.map.panTo(latLng);
    this.positionSet = position;
  }

  async mylocation() {
    Geolocation.getCurrentPosition().then((position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.addMarker(pos);
    });
  }

  aceptar() {
    this.modalController.dismiss({ pos: this.positionSet });
  }
}
