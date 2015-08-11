// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

export default class MetaBaseController{
  setupComponent() {
    var template = document.importNode( owner.querySelector("#" + this.tagName).content, true)
    this.dom.appendChild(template);
  }

  isChildren(tagName){
    return this.metaChildrenNames.indexOf(tagName) != -1;
  }

  get metaChildrenNames(){
    return []
  }
}
