// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

export default class MetaBaseController{
  startObserverProperties(){
    Object.observe(this.properties, changes => {
      changes.forEach( change => {
        if ( this.isAllowedAttribute(change.name) ){
          this.updateMetaObject()
        }

      })
    })
  }
  templateID(){
    throw 'Please define a template id';
  }

  setupComponent() {
    var template = document.importNode( owner.querySelector(this.templateID()).content, true)
    this.dom.appendChild(template);
  }

  get allowedAttributes() {
    throw 'Please define the allowed attributes array'
  }

  isAllowedAttribute(attrName) {
    return this.allowedAttributes.indexOf(attrName) != -1
  }

}
