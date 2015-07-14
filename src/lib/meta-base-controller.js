// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

export default class MetaBaseController{
  templateID(){
    throw 'Please define a template id';
  }

  setupComponent() {
    var template = owner.querySelector(this.templateID()).content.cloneNode(true);
    this.dom.appendChild(template);
  }
}
