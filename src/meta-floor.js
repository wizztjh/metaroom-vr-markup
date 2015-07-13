// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

class MetaFloorController{
  constructor(metaFloor){
    this.metaFloor = metaFloor;
    this.setupComponent();
  }

  setupComponent() {
    var template = owner.querySelector("#meta-floor").content.cloneNode(true);
    this.metaFloor.appendChild(template);
  }
}

class MetaFloor extends HTMLElement {
  createdCallback() {
    this.controller = new MetaFloorController(this);
  }
}

document.registerElement('meta-floor', MetaFloor);


// Polymer({
//   is: 'meta-floor',
//   behaviors: [MRM.fireMetaEventsBehavior, MRM.createBaseWallBehavior],
//
//   update: function(){
//     var mesh = this.metaObject.mesh;
//     mesh.rotation.x = 90 * (Math.PI/180);
//     mesh.position.set(0, -5, 0);
//   }
// })
