class MetaItemController extends MRM.MetaComponentController {
  constructor(dom){
    super(dom)
    this.setupComponent();
    this.parent = dom.parentElement.controller;

    this.metaObject = this.createMetaObject()

    this.updateMetaObject()
  }

  get propertiesSettings() {
    return {
      width: {type: Number, default: 1, attrName: 'width'},
      length: {type: Number, default: 1, attrName: 'length'},
      height: {type: Number, default: 1, attrName: 'height'},
      materialSrc: {type: String, default: '', attrName: 'material-src'},
      geometrySrc: {type: String, default: '', attrName: 'geometry-src'}
    }
  }

  get metaAttachedActions(){
    return {
      attachMetaObject: true,
      updateChildrenDisplayInline: true,
    }
  }

  get tagName() {
    return "meta-item"
  }

  get eventActionSettings(){
    return {
      "width": ["updateChildrenDisplayInline"],
      "height": ["updateChildrenDisplayInline"],
      "length": ["updateChildrenDisplayInline"],
      "meta-style": ['propagateMetaStyle'],
      "class": ["propagateMetaStyle"],
      "id": ["propagateMetaStyle"]
    }
  }

  createMetaObject(){
    var planeLength = 1;
    var planeWidth = 1;
    var group = new THREE.Group();

    return {
      group: group
    }
  }

  updateMetaObject(){
    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
    var loader = new THREE.OBJMTLLoader();
    // TODO: Refactor this
    if(!this.properties.geometrySrc){
      return;
    }
    if(this.metaStyle.metaStyle["position"] === 'absolute'){
      var group = this.metaObject.group;
      group.position.x = - (this.parent.properties.width/2) + (this.metaStyle["left"] || 0) + (this.properties.width/2);
      group.position.y = (this.parent.properties.length/2) - (this.metaStyle["top"] || 0) - (this.properties.length/2);
      if(this.metaStyle.metaStyle['rotate-x']){
        group.rotation.x = this.metaStyle.metaStyle['rotate-x'] * (Math.PI / 180);
      }else if(this.metaStyle.metaStyle['rotate-y']){
        group.rotation.y = this.metaStyle.metaStyle['rotate-y'] * (Math.PI / 180);
      }else if(this.metaStyle.metaStyle['rotate-z']){
        group.rotation.z = this.metaStyle.metaStyle['rotate-z'] * (Math.PI / 180);
      }
    }
    //TODO: why keep loading this? Don't need to keep loading if geometrySrc and materialSrc did not change
    loader.load( this.properties.geometrySrc , this.properties.materialSrc, ( object ) => {
      _.forEach(this.metaObject.group.children, (child) => {
        this.metaObject.group.remove(child);
      });
      this.metaObject.mesh = object.children[1]
      var bbox = new THREE.BoundingBoxHelper( this.metaObject.mesh, 0xff0000 );
      bbox.update();
      this.metaObject.mesh.scale.set(this.properties.width / bbox.box.size().x,
        this.properties.height / bbox.box.size().y, this.properties.length / bbox.box.size().z);
      this.metaObject.mesh.rotation.x = 90 * (Math.PI/180);
      bbox.update();
      this.metaObject.group.add( object.children[1] );
      this.metaObject.group.position.z = this.properties.height / 2;
    });
  }
}

class MetaItem extends MRM.MetaComponent {
  createdCallback() {
    this.controller = new MetaItemController(this);
    super.createdCallback();
  }
}

document.registerElement('meta-item', MetaItem);
