import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as hammerjs from 'hammerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('svgContainer') svgContainer: ElementRef;
  transform = {
    translate: 'translate(0,0)',
    scale: 'scale(1)',
    set: (translate: string, scale: string) => {
      this.transform.translate = translate;
      this.transform.scale = scale;
    },
    get: () => {
      return `${this.transform.translate} ${this.transform.scale}`
    }    
  };

  constructor(private httpClient: HttpClient) {

  }

  ngOnInit() {
    this.getSvg();
  }

  getSvg() {
    this.httpClient.get('/assets/usaTerritories2High.svg', {
      responseType: 'text'
    }).subscribe((svg:string) => {
      let parser = new DOMParser();      
      let element = parser.parseFromString(svg, 'image/svg+xml');
      let svgElem = element.querySelector('svg');
      let transformGrp = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      transformGrp.innerHTML = svgElem.innerHTML;
      transformGrp.setAttribute('id', 'pan');
      transformGrp.setAttribute('transform', `${this.transform.translate} ${this.transform.scale}`);


      this.svgContainer.nativeElement.innerHTML = transformGrp.outerHTML;
      this.setGestures(this.svgContainer.nativeElement);
    });
  }

  setGestures(element: any) {
    let hammer = new Hammer(element);
    let g = document.getElementById('pan');

    hammer.on('pan', (ev:any) => {
      let pt = this.svgContainer.nativeElement.createSVGPoint();
      pt.x = ev.srcEvent.clientX;
      pt.y = ev.srcEvent.clientY;

      let svgPt = pt.matrixTransform(this.svgContainer.nativeElement.getScreenCTM().inverse());

      // translate.substring(translate.indexOf('(') + 1, translate.indexOf(')')).split(',').map(t => +t);
      // [-337.32086181640625, -158.29409790039062]

      let x = svgPt.x - ev.srcEvent.clientX;
      let y = svgPt.y - ev.srcEvent.clientY;

      this.setTransform(g, x, y, 1);      
    });
  }
  
  setTransform(element, x, y, scale) {
    element.setAttribute('transform', `translate(${x},${y}) scale(${scale})`);
  }    
}
