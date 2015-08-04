// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

import CSS from 'css'

class MetaStyleController extends MRM.MetaBaseController{
  constructor(dom){
    super(dom);
    this.dom = dom;
    this.setupComponent();
    this.parent = null;
    this.metaStyle = this.createGlobalMetaStyle();
  }

  createGlobalMetaStyle(){
    var parsedCSS = CSS.parse(this.dom.textContent);
    return parsedCSS.stylesheet.rules;
  }

  get propertiesSettings() {
    return {
    }
  }

  get tagName() {
    return "meta-style";
  }

  get metaChildrenNames(){
    return [];
  }
}

class MetaStyle extends MRM.MetaBase {
  createdCallback() {
    this.controller = new MetaStyleController(this);
    super.createdCallback()
  }

}

document.registerElement('meta-style', MetaStyle);
