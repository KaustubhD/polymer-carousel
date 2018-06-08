import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { Mixin } from './mixin-carousel.js'; 

/**
 * `polymer-carousel`
 * A custom made carousel element
 *
 * @customElement
 * @polymer
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
    if(prevElement && this,_touchDirection){
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
    if(nextElement && !this._touchDirection){
      let current = this.selected;
      
      this._transitionMaker(current, 0);
      this._transitionMaker(nextElement, this.offsetWidth);

      this.selected = nextElement;

      this._transitionMaker(current, -this.offsetWidth, true);
      this._transitionMaker(nextElement, 0, true);
    }
  }

  ready(){
    super.ready();
    // console.log('Readied !!!');
    requestAnimationFrame(this._initialiseListeners.bind(this));
  }

  _initialiseListeners(){
    this.addEventListener('transitionend', this._resetChildrenStyles.bind(this));
    this.addEventListener('touchstart', this._touchstart.bind(this));
    this.addEventListener('touchmove', this._touchmove.bind(this));
    this.addEventListener('touchend', this._touchend.bind(this));
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
    element.style.transition = isMoving ? 'transform 0.5s' : '';
    element.style.transform = 'translate3d(' + positionTo + 'px, 0, 0)';
  }

  _touchstart(e){
    console.log('Touch Detected');
    if(this.childElementCount < 2){
     return; 
    }

    if(!this._touchDirection){
      this._startX = e.changedTouches[0].clientX;
      this._startY = e.changedTouches[0].clientY;
    }
  }

  _touchmove(e){
    if(this.childElementCount < 2){
      return; 
    }

    if(!this._touchDirection){
      const absX = Math.abs(e.changedTouches[0].clientX - this._startX);
      const absY = Math.abs(e.changedTouches[0].clientY - this._startY);
      this._touchDirection = absX > absY ? 'horizontal' : 'vertical';
    }

    if(this._touchDirection === 'horizontal'){
      e.preventDefault();

      let dx = Math.round(e.changedTouches[0].clientX - this._startX);
      const prevElement = this.selected.previousElementSibling;
      const nextElement = this.selected.nextElementSibling;

      if((!prevElement && dx > 0) || (!nextElement && dx < 0)){
        dx = 0;
      }

      this._transitionMaker(this.selected, dx);
      if(prevElement){
        this._transitionMaker(prevElement, dx - this.offsetWidth);
      }
      if(nextElement){
        this._transitionMaker(nextElement, dx + this.offsetWidth);
      }
    }
  }

  _touchend(e){
    if(this.childElementCount < 2){
      return; 
    }

    if(e.touches.length){ // length of array of pending touches
      return; // Do not end if there are still touches left to process
    }

    if(this._touchDirection === 'horizontal'){
      let dx = Math.round(e.changedTouches[0].clientX - this._startX);
      const prevElement = this.selected.previousElementSibling;
      const nextElement = this.selected.nextElementSibling;

      if((!prevElement && dx > 0) || (!nextElement && dx < 0)){
        dx = 0;
      }
      if(dx > 0){
        if(dx > 100){ // Offset length of a swipe to make a change
          if(dx === this.offsetWidth){
            // No transition (Since we are already in the final state)
            this._resetChildrenStyles();
          }
          else{
            this._transitionMaker(prevElement, 0, true);
            this._transitionMaker(this.selected, this.offsetWidth, true);
          }
          this.selected = prevElement;
        }
        else{
          this._transitionMaker(prevElement, -this.offsetWidth, true);
          this._transitionMaker(this.selected, 0, true);
        }
      }
      else if(dx < 0){
        if(dx < -100){
          if(dx === -this.offsetWidth){
            // No transition (Since we are already in the final state)
            this._resetChildrenStyles();
          }
          else{
            this._transitionMaker(this.selected, -this.offsetWidth, true);
            this._transitionMaker(nextElement, 0, true);
          }
          this.selected = nextElement;
        }
        else{
          this._transitionMaker(this.selected, 0, true);
          this._transitionMaker(nextElement, this.offsetWidth, true);
        }
      }
      else{
        this._resetChildrenStyles();
      }
    }

    this._touchDirection = null;
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
        button:hover{
          opacity: 1;
        }
        button:focus{
          outline: none;
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

customElements.define('polymer-carousel', PolymerCarousel);
