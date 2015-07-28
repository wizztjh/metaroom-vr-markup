// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

export default class MetaBaseController{
  constructor(dom) {
    this.dom = dom;
    this.properties = {}
    this.propertiesKey.forEach((key) => {
      var settings = this.propertiesSettings[key]
      this.properties[key] = settings.type(this.dom.getAttribute(settings.attrName) || settings.default)
    });
  }

  templateID(){
    throw 'Please define a template id';
  }

  setupComponent() {
    var template = document.importNode( owner.querySelector(this.templateID()).content, true)
    this.dom.appendChild(template);
  }

  get propertiesSettings() {
    throw 'Please define the propertiesSettings'
  }

  get propertiesKey() {
    return Object.keys(this.propertiesSettings);
  }

  isAllowedAttribute(attrName) {
    return this.propertiesKey.indexOf(attrName) != -1
  }

}
