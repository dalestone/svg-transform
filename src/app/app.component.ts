import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as hammerjs from 'hammerjs';
import * as svgPanZoom from 'svg-pan-zoom';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('svgContainer') svgContainer: ElementRef;

  constructor(private httpClient: HttpClient) {

  }

  ngOnInit() {
    this.getSvg();
  }

  getSvg() {
    this.httpClient.get('/assets/usaTerritories2High.svg', {
      responseType: 'text'
    }).subscribe((svg: string) => {
      let parser = new DOMParser();
      let element = parser.parseFromString(svg, 'image/svg+xml');
      let svgElem = element.querySelector('svg');

      this.svgContainer.nativeElement.innerHTML = svgElem.innerHTML;
      // https://github.com/ariutta/svg-pan-zoom
      let pan = svgPanZoom(this.svgContainer.nativeElement, {      
        // onZoom: () => {
        //   console.log('svg zooming...', pan.getZoom());                  
        // },           
        // customEventsHandler: {
        //   haltEventListeners: [],
        //   init: (options) => {
        //     options.instance.zoomIn();
        //   },
        //   destroy: () => {

        //   }
        // },
        // controlIconsEnabled: false             
      })

      pan.setOnZoom(() => {
        console.log('svg zooming...', pan.getZoom());                  
      })

      // let hammer = new Hammer(this.svgContainer.nativeElement);
      // hammer.on('tap', () => {
      //   console.log('svg tapped');
      // })
    });
  }

}