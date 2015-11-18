class MetaItemController extends MRM.MetaComponentController {
  constructor(dom){
    super(dom)
    this.setupComponent();
    this.parent = dom.parentElement.controller;

    this.metaObject = this.createMetaObject()
    this.computedProperties = {};
    this.computedPropertiesKey.forEach((key) => {
      var settings = this.computedPropertiesSettings[key];
      var value = settings.type(this.properties[key] || settings.default)
      Object.defineProperty(this.computedProperties, key, {
        get: function(){
          return value
        },
        set: (inputValue) => {
          var onChangeFunction = settings.onChange;
          value = settings.type(inputValue)
          if(typeof onChangeFunction === "function") {
            if(oldValue !== value) {
              onChangeFunction.call(this, value, oldValue, key)
            }
          }
        }
      });
    });
    this.updateMetaObject();
  }

  get propertiesSettings() {
    return {
      width: {
        type: Number,
        default: null,
        attrName: 'width',
        onChange: (value)=>{
          this.computedProperties.width = value;
        }
      },
      length: {
        type: Number,
        default: null,
        attrName: 'length',
        onChange: (value)=>{
          this.computedProperties.length = value;
        }
      },
      height: {
        type: Number,
        default: null,
        attrName: 'height',
        onChange: (value)=>{
          this.computedProperties.height = value;
        }
      },
      materialSrc: {type: String, default: '', attrName: 'material-src'},
      src: {type: String, default: '', attrName: 'src'}
    }
  }

  get computedPropertiesSettings(){
    return {
      width: {
        type: Number,
        default: 0.1
      },
      length: {
        type: Number,
        default: 0.1
      },
      height: {
        type: Number,
        default: 0.1
      }
    };
  }

  get computedPropertiesKey(){
    return Object.keys(this.computedPropertiesSettings);
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
    var scope = this, material;
    // TODO: Refactor this
    if(!this.properties.src){
      return;
    }
    var url = this.properties.src;
    var loader = THREE.Loader.Handlers.get(url);
    this.metaObject.group.position.z = this.properties.height / 2;
    if(this.metaStyle.metaStyle["position"] === 'absolute'){
      this.setAbsolutePostion();
    }

    function daeLoaderCallback(collada){
      scope.clearGroup();
      scope.metaObject.mesh = collada.scene;
      scope.scaleMetaObject();
      scope.metaObject.group.add( scope.metaObject.mesh );
      var event = new CustomEvent('size-attributes-change', {
        'detail': {
          'controller': scope,
        },
        bubbles: true
      });
      scope.dom.dispatchEvent(event);
      var loadCompleteEvent = new CustomEvent('item-load-complete', {
        bubbles: false,
        'detail': {
          'controller': scope
        }
      });
      scope.dom.dispatchEvent(loadCompleteEvent);
    }

    function objLoaderCallback(object){
      scope.clearGroup();
      scope.metaObject.mesh = object;
      scope.scaleMetaObject();
      scope.metaObject.group.add( scope.metaObject.mesh );
      var event = new CustomEvent('size-attributes-change', {
        'detail': {
          'controller': scope,
        },
        bubbles: true
      });
      scope.dom.dispatchEvent(event);
      var loadCompleteEvent = new CustomEvent('item-load-complete', {
        bubbles: false,
        'detail': {
          'controller': scope
        }
      });
      scope.dom.dispatchEvent(loadCompleteEvent);
    }

    function plyLoaderCallback(geometry){
      var mesh;
      scope.clearGroup();
      if(scope.properties.materialSrc){
        var materialLoader = THREE.Loader.Handlers.get(scope.properties.materialSrc);
        materialLoader.load(scope.properties.materialSrc, function(materials) {
          var material = materials.create( object.material.name );
					if ( material ) object.material = material;
          scope.metaObject.mesh = new THREE.Mesh(geometry, material);
        });
      }else{
        scope.metaObject.mesh = new THREE.Mesh( geometry );
      }
      scope.scaleMetaObject();
      scope.metaObject.group.add( scope.metaObject.mesh );
      var event = new CustomEvent('size-attributes-change', {
        'detail': {
          'controller': scope,
        },
        bubbles: true
      });
      scope.dom.dispatchEvent(event);
      var loadCompleteEvent = new CustomEvent('item-load-complete', {
        bubbles: false,
        'detail': {
          'controller': scope
        }
      });
      scope.dom.dispatchEvent(loadCompleteEvent);
    }

    function objmtlLoaderCallback(object){
      scope.clearGroup();
      scope.metaObject.mesh = object;
      scope.scaleMetaObject();
      scope.metaObject.group.add( scope.metaObject.mesh );
      var event = new CustomEvent('size-attributes-change', {
        'detail': {
          'controller': scope,
        },
        bubbles: true
      });
      scope.dom.dispatchEvent(event);
      var loadCompleteEvent = new CustomEvent('item-load-complete', {
        bubbles: false,
        'detail': {
          'controller': scope
        }
      });
      scope.dom.dispatchEvent(loadCompleteEvent);
    }

    //TODO: why keep loading this? Don't need to keep loading if geometrySrc and materialSrc did not change
    if(loader instanceof THREE.ColladaLoader){
      loader.load(url, daeLoaderCallback);
    }
    else if (loader instanceof THREE.PLYLoader) {
      loader.load(url, plyLoaderCallback);
    }
    else if(loader instanceof THREE.OBJLoader){
      if(scope.properties.materialSrc){
        loader = new THREE.OBJMTLLoader();
        loader.load(url, scope.properties.materialSrc, objmtlLoaderCallback);
      }else{
        loader.load(url, objLoaderCallback);
      }
    }
  }

  scaleMetaObject(){
    var bbox;
    if(this.metaObject.box === undefined){
      bbox = new THREE.BoundingBoxHelper( this.metaObject.mesh, 0xff0000 );
      bbox.update();
      this.metaObject.box = bbox;
    }
    else {
      bbox = this.metaObject.box;
    }
    this.metaObject.mesh.rotation.x = 90 * (Math.PI/180);
    if(this.properties.width){
      if(this.properties.length === 0){
        //width set, but length is not set
        this.computedProperties.length = (this.properties.width / this.metaObject.box.box.size().x);
      }else{
        //width and length are set
        this.computedProperties.length = this.properties.length / this.metaObject.box.box.size().z;
      }
      if (this.properties.height === 0) {
        //width set, but height is not set
        this.computedProperties.height = ( this.properties.width / this.metaObject.box.box.size().x);
      }
      else{
        // width, length and height are set
        this.computedProperties.height = this.properties.height / this.metaObject.box.box.size().y;
      }
      this.computedProperties.width = this.properties.width / this.metaObject.box.box.size().x;
    }
    else if (this.properties.length) {
      //length set, but width is undefined as it reached this flow
      this.computedProperties.width = (this.properties.length / this.metaObject.box.box.size().z);
      if (this.properties.height === 0) {
        //length set, but height is not set
        this.computedProperties.height = (this.properties.length / this.metaObject.box.box.size().z);
      }
      else{
        // length, height are set and width is not set
        this.computedProperties.height = this.properties.height / this.metaObject.box.box.size().y;
      }
      this.computedProperties.length = this.properties.length / this.metaObject.box.box.size().z;
    }
    else if (this.properties.height) {
      //height is set, but both width and length are not set
      this.computedProperties.width = (this.properties.height / this.metaObject.box.box.size().y);
      this.computedProperties.length = (this.properties.height / this.metaObject.box.box.size().y);
      this.computedProperties.height = this.properties.height / this.metaObject.box.box.size().y;
    }
    else {
      //width, length and height are not set
      this.computedProperties.width = this.metaObject.box.box.size().x;
      this.computedProperties.height = this.metaObject.box.box.size().y;
      this.computedProperties.length = this.metaObject.box.box.size().z;
      this.metaObject.newBbox = bbox;
      this.metaObject.group.position.z = bbox.box.size().z / 2;
      return;
    }
    this.metaObject.mesh.scale.x = this.computedProperties.width;
    this.metaObject.mesh.scale.y = this.computedProperties.height;
    this.metaObject.mesh.scale.z = this.computedProperties.length;
    var newBbox = new THREE.BoundingBoxHelper( this.metaObject.mesh, 0xff0000 );
    newBbox.update();
    this.computedProperties.width = newBbox.box.size().x;
    this.computedProperties.length = newBbox.box.size().y;
    this.computedProperties.height = newBbox.box.size().z;
    this.metaObject.group.position.z = newBbox.box.size().z / 2;
    this.metaObject.newBbox = newBbox;
    // this.metaObject.group.add( newBbox );
  }

  clearGroup(){
    _.forEach(this.metaObject.group.children, (child) => {
      this.metaObject.group.remove(child);
    });
  }

  setAbsolutePostion(){
    var group = this.metaObject.group,
        width = this.properties.width || this.computedProperties.width,
        length = this.properties.length || this.computedProperties.length,
        height = this.properties.height || this.computedProperties.height;
    if(this.metaStyle.metaStyle.hasOwnProperty('left')){
      group.position.x = - (this.parent.properties.width/2) + (this.metaStyle["left"] || 0) + (width/2);
    }
    else if(this.metaStyle.metaStyle.hasOwnProperty('right')){
      group.position.x = - (- (this.parent.properties.width/2) + (this.metaStyle["right"] || 0) + (width/2));
    }
    if(this.metaStyle.metaStyle.hasOwnProperty('top')){
      group.position.y = (this.parent.properties.length/2) - (this.metaStyle["top"] || 0) - (length/2);
    }
    else if(this.metaStyle.metaStyle.hasOwnProperty('bottom')){
      group.position.y = - ((this.parent.properties.length/2) - (this.metaStyle["bottom"] || 0) - (length/2));
    }
    group.position.z = (this.parent.properties.height/2 || 0) + (this.metaStyle["z"] || 0) + (height/2 || 0);
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
}

class MetaItem extends MRM.MetaComponent {
  createdCallback() {
    this.controller = new MetaItemController(this);
    super.createdCallback();
    if(typeof this.itemLoadComplete === 'function') {
      this.addEventListener('item-load-complete', this.itemLoadComplete, false);
    }
  }

  itemLoadComplete(e){
    var targetController = e.detail.controller;
    if(targetController.metaStyle.metaStyle["position"] === 'absolute'){
      targetController.setAbsolutePostion();
    }
  }
}

document.registerElement('meta-item', MetaItem);
