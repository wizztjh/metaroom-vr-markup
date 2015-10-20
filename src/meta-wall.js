class MetaWallController extends MRM.MetaBaseWallController{
  constructor(dom){
    super(dom)
    this.dom = dom;
    this.metaObject = this.createMetaObject();
    this.setupComponent();

    this.updateMetaObject();
  }

  get tagName() {
    return "meta-wall"
  }

  get propertiesSettings(){
    return {
      align: { type: String, default: "front", attrName: "align" },
      width: { type: Number, default: 1 },
      length: { type: Number, default: 1 },
      roomWidth: {
        type: Number,
        default: 1,
        onChange: "updateMetaObject"
      },
      roomHeight: {
        type: Number,
        default: 1,
        onChange: "updateMetaObject"
      },
      roomLength: {
        type: Number,
        default: 1,
        onChange: "updateMetaObject"
      }
    };
  }

  get metaAttachedActions(){
    return {
      attachMetaObject: true,
      assignRoomDimension: true
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

  get metaChildrenNames(){
    return ["meta-board", "meta-picture", "meta-text", "meta-table", "meta-item", "meta-video"]
  }

  updateMetaObject(){
    var mesh = this.metaObject.mesh;
    var group = this.metaObject.group;
    // TODO: sets the properties.width and height of wall for refference

    if(this.metaStyle['geometry-segment-x'] || this.metaStyle['geometry-segment-y']){
      mesh.geometry.dispose();
      mesh.geometry = new THREE.PlaneGeometry(1, 1, this.metaStyle['geometry-segment-x'] || 1, this.metaStyle['geometry-segment-y'] || 1);
    }
    if(this.metaStyle['thickness']){
      mesh.geometry.dispose();
      mesh.geometry = this.createBoxGeometry();
    }

    switch(this.properties.align) {
      case 'left':
      case 'right':
      mesh.scale.set(this.properties.roomLength, this.properties.roomHeight , this.metaStyle["thickness"] * 4|| 0);
      this.properties.width = this.properties.roomLength
      this.properties.length = this.properties.roomHeight
      break;

      case 'ceiling':
      mesh.scale.set(this.properties.roomWidth, this.properties.roomLength , this.metaStyle["thickness"] * 4 || 0);
      this.properties.width = this.properties.roomWidth
      this.properties.length = this.properties.roomLength
      break;

      case 'front':
      case 'back':
      mesh.scale.set(this.properties.roomWidth, this.properties.roomHeight , this.metaStyle["thickness"] * 4|| 0);
      this.properties.width = this.properties.roomWidth
      this.properties.length = this.properties.roomHeight
      break;

    }

    switch (this.properties.align) {
      case 'left':
        group.rotation.x = 0
        group.rotation.y = 90 * (Math.PI/180);
        group.rotation.z = 0
        group.position.set(-(this.properties.roomWidth/2) - (this.metaStyle['thickness']/2 || 0), this.properties.roomHeight/2, 0);
        break;
      case 'front':
        group.position.set(0, (this.properties.roomHeight/2), -(this.properties.roomLength/2) - (this.metaStyle['thickness']/2 || 0));
        group.rotation.x = 0
        group.rotation.y = 0
        group.rotation.z = 0
        break;
      case 'back':
        group.position.set(0, (this.properties.roomHeight/2), this.properties.roomLength/2 + (this.metaStyle['thickness']/2 || 0));
        group.rotation.x = 0
        group.rotation.y = 180 * (Math.PI/180);
        group.rotation.z = 0
        break;
      case 'ceiling':
        group.rotation.x = 90 * (Math.PI/180);
        group.rotation.y = 0
        group.rotation.z = 0

        group.position.set(0, (this.properties.roomHeight) + (this.metaStyle['thickness']/2 || 0), 0);
        break;
      case 'right':
        group.rotation.x = 0
        group.rotation.y = 270 * (Math.PI/180);
        group.rotation.z = 0
        group.position.set(this.properties.roomWidth/2 + (this.metaStyle['thickness']/2 || 0), this.properties.roomHeight/2, 0);
        break;
    }
    var eventToTriggerOnResize = this.updateChildrenDisplayInline();
    if(eventToTriggerOnResize){
      this.dom.dispatchEvent(eventToTriggerOnResize);
    }
  }

}

class MetaWall extends MRM.MetaComponent {
  createdCallback() {
    this.controller = new MetaWallController(this);
    super.createdCallback();
  }

  metaDetached(e) {
    var targetController = e.detail.controller;

    if (this.controller.isChildren(targetController.tagName) ){
      e.stopPropagation();
      this.controller.metaObject.group.remove(targetController.metaObject.group);
      this.controller.updateChildrenDisplayInline();
    }
  }

  metaChildAttributeChanged(e){
    var targetController = e.detail.controller;
    var attrName = e.detail.attrName

    if (this.controller.isChildren(targetController.tagName) ){
      if(targetController.isAllowedAttribute(attrName)) {
        if (e.detail.actions.updateChildrenDisplayInline) {

          this.controller.updateChildrenDisplayInline()
          delete e.detail.actions.updateChildrenDisplayInline

        }
      }
    }
  }
}

document.registerElement('meta-wall', MetaWall);
