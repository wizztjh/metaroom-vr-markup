// Shim & native-safe ownerDocument lookup
//TODO: Move child element of meta-verse inside meta-verse-content #98917702
var owner = (document._currentScript || document.currentScript).ownerDocument;

class MetaVerseController{
  constructor(dom){
    this.dom = dom;
    this.gameObject = new MRM.GameObject();
    this.globalMetaStyle = {}

    this.setupComponent();
    this.triggerMetaReady();
  }

  setupComponent() {
    var template = owner.querySelector("#meta-verse").content.cloneNode(true);

    // NOTE: Add a canvas to the template
    template.appendChild( this.gameObject.renderer.domElement );

    this.dom.appendChild(template);
  }

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

    if (count ===0 ) {
      var event = new CustomEvent('meta-ready', {});
      metaVerse.dom.dispatchEvent(event);
    } else {
      [].forEach.call(metaChildren, function(metaTag){
        if(metaTag.controller){
          count--;
          if(count <= 0){
            var event = new CustomEvent('meta-ready', {});
            metaVerse.dom.dispatchEvent(event);
          }
        } else {
          metaTag.addEventListener('meta-ready', function(){
            count--;
            if(count <= 0){
              var event = new CustomEvent('meta-ready', {});
              metaVerse.dom.dispatchEvent(event);
            }
          })
        }
      });
    }

  }
}

class MetaVerse extends HTMLElement {
  createdCallback() {
    this.addEventListener('meta-ready', (e) => {
      var globalMetaStyle = this.controller.globalMetaStyle
      Object.keys(globalMetaStyle).forEach((selector) => {
        [].forEach.call( this.querySelectorAll(selector), function(metaComponent){

          var metaStyleProperties = globalMetaStyle[selector]
          Object.keys(metaStyleProperties).forEach(function(property){
            metaComponent.controller.metaStyle[property] = metaStyleProperties[property]
          });
        })

      })
    })
    this.controller = new MetaVerseController(this);

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

    // this.addEventListener('meta-detached', function(e){
    //   var controller = e.detail.controller;
    //   if(controller.tagName == 'meta-room') {
    //     this.controller.gameObject.remove(e.detail.controller.metaObject);
    //   }
    //   // TODO: do something if meta-style is removed
    // }, false);
  }

  attachedCallback(){

  }
}

document.registerElement('meta-verse', MetaVerse);
