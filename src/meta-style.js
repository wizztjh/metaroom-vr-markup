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
    this.mutationObserver = new MutationObserver((mutations) => {
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
    this.mutationObserver.observe(dom, { subtree: true , childList: true, characterData: true});
  }

  get metaAttachedActions(){
    return {
      updateMetaStyle: true
    }
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
  // TODO: refactor attachedCallback and detachedCallback to a Behavior shared by MetaStyle and MetaComponent
  attachedCallback() {
    var event = new CustomEvent('meta-ready', {});
    this.dispatchEvent(event);

    var event = new CustomEvent('meta-attached', {
      'detail': {
        'controller': this.controller,
        'actions': this.controller.metaAttachedActions
      },
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

  createdCallback() {
    this.controller = new MetaStyleController(this);
    super.createdCallback()
  }

  detachedCallback(){
    // TODO: write test for this
    this.controller.mutationObserver.disconnect();
  }
}

document.registerElement('meta-style', MetaStyle);
