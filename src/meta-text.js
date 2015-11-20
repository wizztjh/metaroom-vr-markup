class MetaTextController extends MRM.MetaComponentController {
  constructor(dom){
    super(dom)
    this.setupComponent();
    this.parent = dom.parentElement.controller;

    this.properties.text = this.dom.innerText || '';

    this.metaObject = this.createMetaObject();
    this.computedProperties = {};
    this.computedPropertiesKey.forEach((key) => {
      var settings = this.computedPropertiesSettings[key];
      var value = settings.type(this.properties[key] || settings.default)
      Object.defineProperty(this.computedProperties, key, {
        get: function(){
          return value
        },
        set: (inputValue) => {
          value = settings.type(inputValue)
        }
      })
    });
    this.metaObject.mesh.position.set(0,0,0.2)

    this.updateMetaObject()
  }

  get computedPropertiesSettings(){
    return {
      width: {
        type: Number,
        default: null,
      },
      length: {
        type: Number,
        default: null,
      },
    };
  }

  get computedPropertiesKey(){
    return Object.keys(this.computedPropertiesSettings);
  }

  get propertiesSettings() {
    return {
      width: {
        type: Number,
        default: 1,
        attrName: 'width',
        onChange: (value)=>{
          this.computedProperties.width = value;
        }
      },
      length: {
        type: Number,
        default: 1,
        attrName: 'length',
        onChange: (value)=>{
          this.computedProperties.length = value;
        }
      }
    }
  }

  get eventActionSettings(){
    return {
      "width": ["updateChildrenDisplayInline"],
      "length": ["updateChildrenDisplayInline"],
      "meta-style": ['propagateMetaStyle'],
      "class": ["propagateMetaStyle"],
      "id": ["propagateMetaStyle"]
    }
  }

  get metaAttachedActions(){
    return {
      "attachMetaObject": true,
      "updateChildrenDisplayInline": true
    }
  }

  get tagName() {
    return "meta-text"
  }

  createMetaObject(){
    var planeLength = 1;
    var planeWidth = 1;

    var canvas1 = document.createElement('canvas');
    var context1 = canvas1.getContext('2d');
    context1.fillStyle = "rgba(255, 0, 0, 0.95)";
    context1.font = "26px Arial"

    context1.fillText(this.properties.text, 0, 50);

    var texture = new THREE.Texture(canvas1);
    texture.needsUpdate = true;
    var geometry = new THREE.PlaneGeometry(planeWidth, planeLength,1,1);
    var material = new THREE.MeshPhongMaterial({
      map: texture,
      color: 0x333333,
      side: THREE.DoubleSide
    });

    var mesh = new THREE.Mesh(geometry, material);
    var group = new THREE.Group();

    group.add(mesh);

    return {
      mesh: mesh,
      group: group
    }
  }

  updateMetaObject(){
    var mesh = this.metaObject.mesh;
    var group = this.metaObject.group;

    if(this.parent){
      group.position.z = this.parent.metaStyle['thickness']/2 || group.position.z;
    }
    if(this.metaStyle.metaStyle["position"] === 'absolute'){
      this.setAbsolutePostion();
    }
    if(this.metaStyle.metaStyle["frame-width"] || this.metaStyle.metaStyle["frame-thickness"]){
      this.updateFrame();
    }
    mesh.scale.x = this.computedProperties.width;
    mesh.scale.y = this.computedProperties.length;
  }

  setAbsolutePostion(){
    var group = this.metaObject.group;
    if(this.metaStyle.metaStyle.hasOwnProperty('left')){
      group.position.x = - (this.parent.properties.width/2) + (this.metaStyle["left"] || 0) + (this.properties.width/2);
    }
    else if(this.metaStyle.metaStyle.hasOwnProperty('right')){
      group.position.x = - (- (this.parent.properties.width/2) + (this.metaStyle["right"] || 0) + (this.properties.width/2));
    }
    if(this.metaStyle.metaStyle.hasOwnProperty('top')){
      group.position.y = (this.parent.properties.length/2) - (this.metaStyle["top"] || 0) - (this.properties.length/2);
    }
    else if(this.metaStyle.metaStyle.hasOwnProperty('bottom')){
      group.position.y = - ((this.parent.properties.length/2) - (this.metaStyle["bottom"] || 0) - (this.properties.length/2));
    }
    group.position.z = (this.parent.properties.height/2 || 0) + (this.metaStyle["z"] || 0) + (this.properties.height/2 || 0);
    if(this.metaStyle.metaStyle['rotate-x']){
      group.rotation.x = this.metaStyle.metaStyle['rotate-x'] * (Math.PI / 180);
    }
    if(this.metaStyle.metaStyle['rotate-y']){
      group.rotation.y = this.metaStyle.metaStyle['rotate-y'] * (Math.PI / 180);
    }
    if(this.metaStyle.metaStyle['rotate-z']){
      group.rotation.z = this.metaStyle.metaStyle['rotate-z'] * (Math.PI / 180);
    }
  }

  updateFrame(){
    var frameWidth = this.metaStyle.metaStyle["frame-width"] || 0.1;
    var frameThickness = this.metaStyle.metaStyle["frame-thickness"] || 0.3;
    var frameColor = this.metaStyle.metaStyle["frame-color"] || this.metaStyle.metaStyle['material-color'] || white;
    var length = this.properties.length;
    var width = this.properties.width;
    var frameShape = new THREE.Shape();
    frameShape.moveTo( 0,0 );
    frameShape.lineTo( 0, length );
    frameShape.lineTo( width, length );
    frameShape.lineTo( width, 0 );
    frameShape.lineTo( 0, 0 );

    var frameHole = new THREE.Path();
    frameHole.moveTo(frameWidth + 0, frameWidth + 0);
    frameHole.lineTo(width - frameWidth, frameWidth + 0 );
    frameHole.lineTo(width - frameWidth, length - frameWidth);
    frameHole.lineTo(frameWidth + 0, length - frameWidth);
    frameShape.holes.push(frameHole);

    var extrudeSettings = { amount: frameThickness, bevelEnabled: false};
    var geometry = new THREE.ExtrudeGeometry( frameShape, extrudeSettings );
    var material = new THREE.MeshPhongMaterial( { color: frameColor, wireframe: false } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.scale.set(1, 1, 1);
    mesh.position.set( -this.properties.width / 2, -this.properties.length / 2, 0);
    this.computedProperties.width = width - (2 * frameWidth);
    this.computedProperties.length = length - (2 * frameWidth);
    if(this.metaObject.group.children.length > 1){
      this.metaObject.group.children.pop();
    }
    this.metaObject.group.add(mesh);
  }
}

class MetaText extends MRM.MetaComponent {
  createdCallback() {
    this.controller = new MetaTextController(this);
    super.createdCallback();
  }
}

document.registerElement('meta-text', MetaText);
