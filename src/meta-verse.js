// Shim & native-safe ownerDocument lookup
//TODO: Move child element of meta-verse inside meta-verse-content #98917702
var owner = (document._currentScript || document.currentScript).ownerDocument;

class MetaVerseController{
  constructor(metaVerse){
    this.metaVerse = metaVerse;
    this.gameObject = new MRM.GameObject();

    this.setupComponent();
  }

  setupComponent() {
    var template = owner.querySelector("#meta-verse").content.cloneNode(true);

    // NOTE: Add a canvas to the template
    template.appendChild( this.gameObject.renderer.domElement );

    this.metaVerse.appendChild(template);
  }
}

class MetaVerse extends HTMLElement {
  createdCallback() {
    this.controller = new MetaVerseController(this);

    //TODO: Since `this` inside this event listerner is the dom itself, lets move it to Metaverse HTMLElement
    this.addEventListener('meta-attached', function(e){
      var controller = e.detail.controller;

      controller.metaVerse = this;
      //TODO: need to find a better way to store the objects, it should be tree form
      this.controller.gameObject.add(controller.metaObject);
    }, false);

    this.addEventListener('meta-detached', function(e){
      this.controller.gameObject.remove(e.detail.controller.metaObject);
    }, false);
  }
}

document.registerElement('meta-verse', MetaVerse);
