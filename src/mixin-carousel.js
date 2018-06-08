export const Mixin = superclass => class extends superclass{

  static get properties() {
    return {
      selected: {
        type: Object,
        observer: '_handlePropertyChange',
      },
    };
  }

  connectedCallback(){
    super.connectedCallback();

    this.shadowRoot.addEventListener('slotchange', this._resetProperty());
    this._resetProperty();
    // requestAnimationFrame(this._initialiseListener.bind(this));
  }

  _resetProperty(){
    // console.log(this.firstElementChild);
    // this.firstElementChild.setAttribute('selected', '');
    if(!this.selected || this.selected.parentElement !== this){
      this.selected = this.firstElementChild;
    }
  }


  _handlePropertyChange(newElement, oldElement){
    // console.log(oldElement);
    if(oldElement){
      oldElement.removeAttribute('selected');
    }
    // console.log(newElement);
    if(newElement){
      newElement.setAttribute('selected', '');
    }
  }
}