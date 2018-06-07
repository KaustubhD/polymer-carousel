import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { Mixin } from './mixin-carousel.js'; 

/**
 * `polymer-carousel`
 * A custom made carousel element
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class PolymerCarousel extends Mixin(PolymerElement) {

  // connectedCallback(){
  //   super.connectedCallback();

  //   this._resetProperty();
  // }

  // _resetProperty(){
  //   // console.log(this.firstElementChild);
  //   // this.firstElementChild.setAttribute('selected', '');
  //   if(!this.selected || this.selected.parentElement !== this){
  //     this.selected = this.firstElementChild;
  //   }
  // }

  _handlePropertyChange(newElement, oldElement){
    // // console.log(oldElement);
    // if(oldElement){
    //   oldElement.removeAttribute('selected');
    // }
    // // console.log(newElement);
    // if(newElement){
    //   newElement.setAttribute('selected', '');
    // }

    super._handlePropertyChange(newElement, oldElement);

    if(newElement){
      this.$.prevBut.disabled = !newElement.previousElementSibling;
      this.$.nextBut.disabled = !newElement.nextElementSibling;

      this._loadImages(newElement);
      this._loadImages(newElement.nextElementSibling);
      this._loadImages(newElement.previousElementSibling);
    }
    else{
      this.$.prevBut.disabled = true;
      this.$.nextBut.disabled = true;
    }
  }

  previous(){
    let prevElement = this.selected && this.selected.previousElementSibling;
    console.log('From Previous :');
    console.log(prevElement);
    if(prevElement){
      let current = this.selected;

      this._transitionMaker(current, 0);
      this._transitionMaker(prevElement, -this.offsetWidth);

      this.selected = prevElement;

      this._transitionMaker(current, this.offsetWidth, true);
      this._transitionMaker(prevElement, 0, true);
    }
  }

  next(){
    let nextElement = this.selected && this.selected.nextElementSibling;
    console.log('From Next :');
    console.log(nextElement);
    if(nextElement){
      let current = this.selected;
      
      this._transitionMaker(current, 0);
      this._transitionMaker(nextElement, this.offsetWidth);

      this.selected = nextElement;

      this._transitionMaker(nextElement, 0, true);
      this._transitionMaker(current, -this.offsetWidth, true);
    }
  }

  ready(){
    super.ready();
    // console.log('Readied !!!');
    requestAnimationFrame(this._initialiseListener.bind(this));
  }

  _initialiseListener(){
    this.addEventListener('transitionend', this._resetChildrenStyles.bind(this));
  }

  _resetChildrenStyles(){
    let element = this.firstElementChild; // First image of carousel parent
    while(element){
      element.style.display = '';
      element.style.transition = '';
      element.style.transform = '';
      element = element.nextElementSibling;
    } 
  }

  _loadImages(img){
    if(img && !img.src){
      img.src = img.getAttribute('data-src');
    }
  }

  _transitionMaker(element, positionTo, isMoving){
    element.style.display = 'block';
    element.style.transition = isMoving ? 'all 15s' : '';
    element.style.transform = 'translateX(' + positionTo + 'px)';
  }


  static get template() {
    return html`
      <style>
        :host {
          display: block;
          position: relative;
          overflow: hidden;
        }
        div > ::slotted(:not([selected])){
          display: none;
        }
        button{
          position: absolute;
          top: calc(50% - 20px);
          color: #ddd;
          line-height: 40px;
          font-size: 40px;
          border: none;
          background: none;
          opacity: 0.7;
        }
        #prevBut{
          left: 5px;
        }
        #nextBut{
          right: 5px;
        }
        button[disabled]{
          opacity: 0.3;
        }
      </style>
      <div>
        <slot></slot>
      </div>
      <button id="prevBut" on-click="previous">&#x276E;</button>
      <button id="nextBut" on-click="next">&#x276F;</button>
    `;
  }
  
  // static get properties() {
  //   return {
  //     selected: {
  //       type: Object,
  //       observer: '_handlePropertyChange',
  //     },
  //   };
  // }
}

window.customElements.define('polymer-carousel', PolymerCarousel);
