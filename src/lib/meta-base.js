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

    if(this.controller.parent) {
      this.controller.parent.dispatchEvent(event);
    } else {
      console.debug('no parent for', this.controller.tagName)
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {

    //TODO: move this to controller
    if(this.controller.isAllowedAttribute(attrName)){
      var value = this.controller.propertiesSettings[attrName].type(newValue)
      this.controller.properties[attrName] = value
      if (this.controller.updateMetaObject){
        this.controller.updateMetaObject()
      }
    }

    // TODO: maybe we can add a new propertiesSettings `bubbleUp` to enable the event bubbling when attribute changes
    var event = new CustomEvent('meta-attribute-change', {
      'detail': {
        'attrName': attrName,
        'oldValue': oldValue,
        'newValue': newValue,
        'controller': this.controller
      },
      bubbles: true
    });

    this.dispatchEvent(event);
  }

}
