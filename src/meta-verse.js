// Shim & native-safe ownerDocument lookup
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

    this.metaVerse.addEventListener('meta-attached', function(){
      var target = e.detail.target;

      target.metaVerse = this;
      //TODO: need to find a better way to store the objects, it should be tree form
      this.gameObject.add(target.metaObject);

      console.log('trigged',e.type, e)
    });

    this.metaVerse.addEventListener('meta-detached', function(){
      this.gameObject.remove(e.detail.target.metaObject);
      console.log('trigged',e.type, e);
    });
  }
}

class MetaVerse extends HTMLElement {
  createdCallback() {
    this.controller = new MetaVerseController(this);
  }
}

document.registerElement('meta-verse', MetaVerse);
