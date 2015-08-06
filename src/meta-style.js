// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

import CSS from 'css'

class MetaStyleController extends MRM.MetaComponentController{
  constructor(dom){
    super(dom);
    this.dom = dom;
    this.setupComponent();
    this.parent = null;
    this.metaStyle = this.createGlobalMetaStyle();

    var observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        this.metaStyle = this.createGlobalMetaStyle();
        var event = new CustomEvent('meta-attribute-change', {
          'detail': {
            'controller': this,
            'actions': {propagateMetaStyle: true }
          },
          bubbles: true
        });
        this.dom.dispatchEvent(event);
      });
    });
    var config = { subtree: true , childList: true, characterData: true};
    // TODO: disconnect the observer in detach
    observer.observe(dom, config);
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

class MetaStyle extends MRM.MetaComponent {
  createdCallback() {
    this.controller = new MetaStyleController(this);
    super.createdCallback()
  }
}

document.registerElement('meta-style', MetaStyle);
