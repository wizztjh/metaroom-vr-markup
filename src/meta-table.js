// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

class MetaTableController extends MRM.MetaComponentController{
  constructor(dom){
    super(dom);
    this.dom = dom;
    this.setupComponent();
    this.parent = null;
    this.metaObject = this.createMetaObject();

    this.updateMetaObject();
  }

  createMetaObject(){
    var group = new THREE.Group();
    // need to have table geometry, set all visible none

    var height = this.properties.height || 1;
    var width = this.properties.width || 1;
    var depth = this.properties.length || 1;
    var geometry = new THREE.TableGeometry(width, height, depth, 0.03, 0.01, 0.01);

    var materials = [new THREE.MeshPhongMaterial( { visible: false } ),
      new THREE.MeshPhongMaterial( { visible: false } ),
      new THREE.MeshPhongMaterial( { visible: false } ),
      new THREE.MeshPhongMaterial( { visible: false } ),
      new THREE.MeshPhongMaterial( { visible: false } ),
      new THREE.MeshPhongMaterial( { visible: false } ),
      new THREE.MeshPhongMaterial( { visible: false } ),
      new THREE.MeshPhongMaterial( { visible: false } ),
      new THREE.MeshPhongMaterial( { visible: false } ),
      ];

    var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));

    mesh.rotation.x = 90 * (Math.PI/180);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    var group = new THREE.Group();
    group.add( mesh );


    return {
      group: group,
      mesh: mesh
    }
  }

  get metaAttachedActions(){
    return {
      "attachMetaObject": true,
      "updateChildrenDisplayInline": true
    }
  }

  get eventActionSettings(){
    return {
      "width": ["updateChildrenDisplayInline"],
      "length": ["updateChildrenDisplayInline"],
      "class": ["propagateMetaStyle"],
      "id": ["propagateMetaStyle"]
    }
  }

  get propertiesSettings() {
    return {
      width: {
        type: Number,
        default: 1,
        attrName: 'width',
        onChange: (value)=>{
          this.forEachMetaChildren((child)=>{
            child.controller.properties.tableWidth = value
          })
        }
      },
      height: {
        type: Number,
        default: 1,
        attrName: 'height',
        onChange: (value)=>{
          this.forEachMetaChildren((child)=>{
            child.controller.properties.tableHeight = value
          })
        }
      },
      length: {
        type: Number,
        default: 1,
        attrName: 'length',
        onChange: (value)=>{
          this.forEachMetaChildren((child)=>{
            child.controller.properties.tableLength = value
          })
        }
      },
      tsurfaceThickness: {
        type: Number,
        default: 1,
        onChange: "updateDimension"
      },
      tbottomThickness: {
        type: Number,
        default: 1,
        onChange: "updateDimension"
      },
      tbottomPadding: {
        type: Number,
        default: 1,
        onChange: "updateDimension"
      },
      "left": {
        type: Boolean,
        default: false,
        facesStartIndexes: [2, 3, 4],
        onChange: "updateFaceVisibility",
        querySelector: "meta-tbottom[align= left]"
      },
      "right": {
        type: Boolean,
        default: false,
        facesStartIndexes: [0, 6, 7],
        onChange: "updateFaceVisibility",
        querySelector: "meta-tbottom[align= right]"
      },
      "front": {
        type: Boolean,
        default: false,
        facesStartIndexes: [0, 1, 2],
        onChange: "updateFaceVisibility",
        querySelector: "meta-tbottom[align= front]"
      },
      "back": {
        type: Boolean,
        default: false,
        facesStartIndexes: [4, 5, 6],
        onChange: "updateFaceVisibility",
        querySelector: "meta-tbottom[align= back]"
      },
      "surface": {
        type: Boolean,
        default: false,
        facesStartIndexes: [8],
        onChange: "updateFaceVisibility",
        querySelector: "meta-tsurface"
      }
    }
  }

  get tagName() {
    return "meta-table";
  }

  get metaChildrenNames(){
    return ['meta-tsurface', 'meta-tbottom']
  }

  updateMetaObject (){
    this.metaObject.group.position.z = this.properties.height / 2;
    var geometry = this.metaObject.mesh.geometry,
        tbottomPadding = this.metaStyle['tbottom-padding'] || geometry.parameters.tbottomPadding,
        tsurfaceThickness = geometry.parameters.tsurfaceThickness,
        tbottomThickness = geometry.parameters.tbottomThickness;

    geometry.update(this.properties.width, this.properties.height, this.properties.length, tsurfaceThickness, tbottomThickness, tbottomPadding);
  }

  updateTableDimension(targetController){
    targetController.properties.tableWidth = this.properties.width
    targetController.properties.tableHeight = this.properties.height
    targetController.properties.tableLength = this.properties.length
  }

  updateTbottomVisibility(targetController, oldValue, newValue){
    oldValue = oldValue || "front"
    this.properties[oldValue] = false;
    this.properties[targetController.properties.align] = true;
  }

  updateTSurfaceVisibility(targetController){
    this.properties['surface'] = true;
  }

  updateFaceVisibility(value, oldValue, key){
    this.metaObject.mesh.material.materials.forEach(function(material){
      material.visible = false
    });

    _.forEach(this.dom.querySelectorAll(":scope > meta-tbottom, :scope > meta-tsurface"), (element) => {
      var controller = element.controller
      if(!controller) {
        return;
      }
      if (controller.tagName === 'meta-tbottom') {
        switch(controller.properties.align) {
          case 'left':
            // TODO: use propertiesSettings face name
            this.metaObject.mesh.material.materials[2].visible = true;
            this.metaObject.mesh.material.materials[3].visible = true;
            this.metaObject.mesh.material.materials[4].visible = true;
          break;
          case 'right':
            this.metaObject.mesh.material.materials[0].visible = true;
            this.metaObject.mesh.material.materials[6].visible = true;
            this.metaObject.mesh.material.materials[7].visible = true;
          break;
          case 'front':
            this.metaObject.mesh.material.materials[0].visible = true;
            this.metaObject.mesh.material.materials[1].visible = true;
            this.metaObject.mesh.material.materials[2].visible = true;
          break;
          case 'back':
            this.metaObject.mesh.material.materials[4].visible = true;
            this.metaObject.mesh.material.materials[5].visible = true;
            this.metaObject.mesh.material.materials[6].visible = true;
          break;
        }
      } else if (controller.tagName === 'meta-tsurface'){
        this.metaObject.mesh.material.materials[8].visible = true;
      }
    });
  }
}

class MetaTable extends MRM.MetaComponent {
  createdCallback() {
    this.controller = new MetaTableController(this);
    super.createdCallback()
  }

  metaDetached(e) {
    var targetController = e.detail.controller;
    if (this.controller.isChildren(targetController.tagName) ){
      e.stopPropagation();
      if(targetController.tagName === 'meta-tsurface'){
        this.controller.properties['surface'] = false;
      }else{
        this.controller.properties[targetController.properties.align] = false;
      }
      this.controller.metaObject.group.remove(targetController.metaObject.group);
    }
  }

}

document.registerElement('meta-table', MetaTable);
