import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  apiKey = environment.mapsKey;
  mapsLoaded = false;

  constructor() {}

  init(renderer: any, document: any): Promise<void> {
    if (this.mapsLoaded) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = renderer.createElement('script');
      script.id = 'googleMaps';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.mapsLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject();
      };
      renderer.appendChild(document.body, script);
    });
  }
}
