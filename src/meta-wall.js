// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

class MetaWallController{
  constructor(metaWall){
    this.metaWall = metaWall;
    this.setupComponent();
  }

  setupComponent() {
    var template = owner.querySelector("#meta-wall").content.cloneNode(true);
    this.metaWall.appendChild(template);
  }
}

class MetaWall extends HTMLElement {
  createdCallback() {
    this.controller = new MetaWallController(this);
  }
}

document.registerElement('meta-wall', MetaWall);

//
// Polymer({
//     is: 'meta-wall',
//     behaviors: [MRM.fireMetaEventsBehavior, MRM.createBaseWallBehavior],
//
//     properties: {
//       roomWidth: {
//         type: Number,
//         notify: true
//       },
//       align: {
//         type: String,
//         notify: true
//       }
//     },
//
//     observers: ['update(align)'],
//
//     update: function(align){
//       var mesh = this.metaObject.mesh;
//       switch (align) {
//         case 'left':
//           mesh.rotation.y = 90 * (Math.PI/180);
//           mesh.position.set(-5, 0, 0);
//           break;
//         case 'front':
//           mesh.position.set(0, 0, -5);
//           break;
//         case 'back':
//           mesh.position.set(0, 0, 5);
//           break;
//         case 'ceiling':
//           mesh.rotation.x = 90 * (Math.PI/180);
//           mesh.position.set(0, 5, 0);
//           break;
//         case 'right':
//           mesh.rotation.y = 90 * (Math.PI/180);
//           mesh.position.set(5, 0, 0);
//           break;
//       }
//     },
// });
