export default class MetaBase extends HTMLElement{
  createdCallback() {
    if(typeof this.metaAttached == 'function') {
      this.addEventListener('meta-attached', this.metaAttached , false);
    }

    if(typeof this.metaDetached == 'function') {
      this.addEventListener('meta-detached', this.metaDetached, false);
    }
  }

  attachedCallback() {
    var event = new CustomEvent('meta-attached', {
      'detail': {'controller': this.controller},
      bubbles: true
    });
    this.dispatchEvent(event);
  }

  detachedCallback() {
    var event = new CustomEvent('meta-detached', {
      'detail': {'controller': this.controller},
      bubbles: true
    });
    this.controller.metaVerse.dispatchEvent(event);
  }
}
