export default class MetaBase extends HTMLElement{
  createdCallback() {
    if(typeof this.metaAttached == 'function') {
      this.addEventListener('meta-attached', this.metaAttached , false);
    }

    if(typeof this.metaDetached == 'function') {
      this.addEventListener('meta-detached', this.metaDetached, false);
    }

    // TODO: we will name the metaAttached to metaChildAttached, metaChildAttributeChanged
    if(typeof this.metaChildAttributeChanged == 'function') {
      this.addEventListener('meta-attribute-change', this.metaChildAttributeChanged, false);
    }

    if(typeof this.metaSizeAttributeChanged === 'function') {
      this.addEventListener('size-attributes-change', this.metaSizeAttributeChanged, false);
    }
  }
}
