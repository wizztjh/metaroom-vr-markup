// Shim & native-safe ownerDocument lookup
//TODO: Move child element of meta-verse inside meta-verse-content #98917702
var owner = (document._currentScript || document.currentScript).ownerDocument;

class MetaVerseController{
  constructor(dom){
    this.dom = dom;
    this.gameObject = new MRM.GameObject();
    this.globalMetaStyle = {}

    this.setupComponent();
  }

  setupComponent() {
    var template = owner.querySelector("#meta-verse").content.cloneNode(true);

    // NOTE: Add a canvas to the template
    template.appendChild( this.gameObject.renderer.domElement );

    this.dom.appendChild(template);
  }

  // TODO: rename to update global metaStyle
  updateMetaStyle(metaStyles) {
    if(metaStyles){
      metaStyles.forEach((metaStyle) => {
        metaStyle.selectors.forEach((selector) => {
          this.globalMetaStyle[selector] = this.globalMetaStyle[selector] || {}

          metaStyle.declarations.forEach((declaration) => {
            this.globalMetaStyle[selector][declaration.property] = declaration.value
          })

        })
      });
    }
  }

  getAllMetaChildren(){
    return document.querySelectorAll("meta-style, meta-room, meta-wall, meta-floor, meta-board, meta-picture, meta-text, meta-table, meta-tsurface");
  }

  triggerMetaReady(){
    var metaVerse = this;
    var metaChildren = this.getAllMetaChildren();
    var count = metaChildren.length;
    var event = new CustomEvent('meta-ready', {});

    function dispatchWhenAllReady(){
      count--;
      if(count <= 0){
        metaVerse.dom.dispatchEvent(event);
      }
    }

    if (count ===0 ) {
      dispatchWhenAllReady();
    } else {
      [].forEach.call(metaChildren, function(metaTag){
        if(metaTag.controller){
          dispatchWhenAllReady();
        } else {
          metaTag.addEventListener('meta-ready', function(){
            dispatchWhenAllReady();
          })
        }
      });
    }
  }

  propagateMetaStyle(){
    var globalMetaStyle = this.globalMetaStyle
    var metaChildren = this.getAllMetaChildren();

    [].forEach.call(metaChildren, function(metaTag){
      if(metaTag.controller) {
        if(metaTag.controller.metaStyle.clear){
          metaTag.controller.metaStyle.clear()
        }
      }
    });

    // NOTE: we sort and reverse because we want to prioritize id -> class -> meta tag
    Object.keys(globalMetaStyle).sort().reverse().forEach((selector) => {
      [].forEach.call( this.dom.querySelectorAll(selector), function(metaComponent){
        var metaStyleProperties = globalMetaStyle[selector]

        Object.keys(metaStyleProperties).forEach(function(property){
          metaComponent.controller.metaStyle[property] = metaStyleProperties[property]
        });
      })

    })
  }

}

class MetaVerse extends HTMLElement {
  createdCallback() {
    this.controller = new MetaVerseController(this);

    this.addEventListener('meta-ready', (e) => {
      this.controller.propagateMetaStyle();
    })
    //TODO: refactor this whole mess, we need to trigger the meta ready after we listen to meta-ready
    this.controller.triggerMetaReady()

    //TODO: Since `this` inside this event listerner is the dom itself, lets move it to Metaverse HTMLElement
    this.addEventListener('meta-attached', function(e){
      var controller = e.detail.controller;

      controller.parent = this;
      //TODO: need to find a better way to store the objects, it should be tree form
      if(controller.tagName == 'meta-room') {
        this.controller.gameObject.add(controller.metaObject);
      } else if(controller.tagName == 'meta-style') {
        this.controller.updateMetaStyle(controller.metaStyle);
      }
    }, false);

    this.addEventListener('meta-attribute-change', function(e){
      var targetController = e.detail.controller;
      var attrName = e.detail.attrName

      if (e.detail.actions.propagateMetaStyle) {
        this.controller.propagateMetaStyle()
        delete e.detail.actions.propagateMetaStyle
      }
    }, false);

    this.addEventListener('meta-detached', function(e){
      var controller = e.detail.controller;
      if(controller.tagName == 'meta-room') {
        this.controller.gameObject.remove(e.detail.controller.metaObject);
      }
      // TODO: do something if meta-style is removed
    }, false);
  }

}

document.registerElement('meta-verse', MetaVerse);
