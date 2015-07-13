// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

class MetaWallController{
  constructor(metaWall){
    this.metaWall = metaWall;
    this.metaObject = {
      mesh: this.createMesh()
    }
    this.setupComponent();
    this.alignChange(this.metaWall.getAttribute('align'));
  }

  setupComponent() {
    var template = owner.querySelector("#meta-wall").content.cloneNode(true);
    this.metaWall.appendChild(template);
  }
  createMesh() {
    var planeHeight = 20;
    var planeWidth = 20;
    var texture = THREE.ImageUtils.loadTexture(
      'img/box.png'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(planeHeight, planeWidth);

    var geometry = new THREE.PlaneGeometry(planeWidth, planeHeight,1,1);
    var material = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0xffffff,
      side: THREE.DoubleSide
    });

    return new THREE.Mesh(geometry, material);
  }

  alignChange(align) {
    var mesh = this.metaObject.mesh;
    switch (align) {
      case 'left':
        mesh.rotation.y = 90 * (Math.PI/180);
        mesh.position.set(-5, 0, 0);
        break;
      case 'front':
        mesh.position.set(0, 0, -5);
        break;
      case 'back':
        mesh.position.set(0, 0, 5);
        break;
      case 'ceiling':
        mesh.rotation.x = 90 * (Math.PI/180);
        mesh.position.set(0, 5, 0);
        break;
      case 'right':
        mesh.rotation.y = 90 * (Math.PI/180);
        mesh.position.set(5, 0, 0);
        break;
    }
  }
}

class MetaWall extends HTMLElement {
  createdCallback() {
    this.controller = new MetaWallController(this);
  }

  attachedCallback() {
    console.log("attachedCallback asdasdasdasdasdasdasdasdasd executing---")
    var event = new CustomEvent('meta-attached', {
      'detail': {'target': this},
      bubbles: true
    });
    this.dispatchEvent(event);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    console.log('attributeChangedCallback', arguments);
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
