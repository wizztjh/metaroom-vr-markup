import CSS from 'css'

export default class MetaStyle {
  constructor (controller){
    this.metaStyle={}
    this.controller = controller
  }

  set ["material-color"](color) {
    var mesh = this.controller.metaObject.mesh
    if (mesh) {
      if(mesh.material){
        if(mesh.material.color){
          mesh.material.color.set(color);
        }else {
          for(var i = 0; i < mesh.material.materials.length; i++){
            mesh.material.materials[i].color.set(color);
          }
        }
        this.metaStyle["material-color"] = color
      }
    }
    return color;
  }

  get ["material-color"]() {
    return this.metaStyle["material-color"];
  }

  set ["tbottom-padding"](tbottomPadding) {
    this.controller.metaStyle['tbottom-padding-top'] = tbottomPadding;
    this.controller.metaStyle['tbottom-padding-bottom'] = tbottomPadding;
    return Number(tbottomPadding);
  }

  get ["tbottom-padding"]() {
    return this.metaStyle["tbottom-padding"];
  }

  set ["tbottom-padding-top"](tbottomPaddingTop) {
    var mesh = this.controller.metaObject.mesh;
    var computedProperties = this.controller.computedProperties;
    if (mesh) {
      var geometry = mesh.geometry
      if(mesh.geometry.update){
        mesh.geometry.update(computedProperties.width, computedProperties.height, computedProperties.length, geometry.tbottomThickness, geometry.tsurfaceThickness, Number(tbottomPaddingTop), this.metaStyle['tbottom-padding-bottom'] || 0);
      }
      this.metaStyle["tbottom-padding-top"] = Number(tbottomPaddingTop);
    }
    return Number(tbottomPaddingTop);
  }

  get ["tbottom-padding-top"]() {
    return this.metaStyle["tbottom-padding-top"];
  }

  set ["tbottom-padding-bottom"](tbottomPaddingBottom) {
    var mesh = this.controller.metaObject.mesh;
    var computedProperties = this.controller.computedProperties;
    if (mesh) {
      var geometry = mesh.geometry
      if(mesh.geometry.update){
        mesh.geometry.update(computedProperties.width, computedProperties.height, computedProperties.length, geometry.tbottomThickness, geometry.tsurfaceThickness, this.metaStyle['tbottom-padding-top'] || 0, Number(tbottomPaddingBottom))
      }
      this.metaStyle["tbottom-padding-bottom"] = Number(tbottomPaddingBottom);
    }
    return Number(tbottomPaddingBottom);
  }

  get ["tbottom-padding-bottom"]() {
    return this.metaStyle["tbottom-padding-bottom"];
  }

  set ["thickness"](thickness) {
    var mesh = this.controller.metaObject.mesh
    if (mesh) {
      var geometry = mesh.geometry
      if(this.controller.tagName === 'meta-table'){
        mesh.geometry.update(geometry.width, geometry.height, geometry.depth, Number(thickness), Number(thickness), geometry.tbottomPaddingTop, geometry.tbottomPaddingTop)
      }
      this.metaStyle["thickness"] = Number(thickness);
    }
    return Number(thickness);
  }

  get ["thickness"]() {
    return this.metaStyle["thickness"];
  }

  set ["frame-width"](frameWidth) {
    var controller = this.controller;
    if (controller && typeof controller.updateFrame === 'function') {
      controller.updateMetaObject();
      this.metaStyle["frame-width"] = Number(frameWidth);
    }
    return Number(frameWidth);
  }

  get ["frame-width"]() {
    return this.metaStyle["frame-width"];
  }

  set ["position"](type) {
    this.metaStyle['position'] = type;
    this.controller.updateMetaObject();
    return type;
  }

  get ["position"]() {
    return this.metaStyle["position"];
  }

  set ["top"](length) {
    this.metaStyle["top"] = Number(length);
    return length;
  }

  get ["top"]() {
    return this.metaStyle["top"];
  }

  set ["left"](width) {
    this.metaStyle["left"] = Number(width);
    return width;
  }

  get ["left"]() {
    return this.metaStyle["left"];
  }

  set ["material-texture"](textureSrc) {
    var mesh = this.controller.metaObject.mesh
    if (mesh) {
      var texture = THREE.ImageUtils.loadTexture( textureSrc, undefined, (tex) =>{
        texture = tex;
        if(this.metaStyle["material-texture-repeat"] === 'repeat'){
          var imageWidth = texture.image.width, imageHeight = texture.image.height,
            width = this.controller.properties.width * 5 / imageWidth, height = this.controller.properties.length * 5 / imageHeight;
          texture.needsUpdate = true;
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          if(width < 1){
            width = this.controller.properties.width;
          }
          if(height < 1){
            height = this.controller.properties.length;
          }
          texture.repeat.set( width, height );
          mesh.material.map = texture;
          mesh.material.needsUpdate = true;
        }else{
          mesh.material.map = texture;
          mesh.material.needsUpdate = true;
        }
      });
      this.metaStyle["material-texture"] = textureSrc;
      return mesh.material;
    }
  }

  get ["material-texture"]() {
    return this.metaStyle["material-texture"];
  }

  set ["material-texture-repeat"](type){
    var mesh = this.controller.metaObject.mesh
    if (mesh) {
      var texture = mesh.material.map;
      if(texture){
        var width = texture.image.width, height = texture.image.height;
        texture.needsUpdate = true;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( Math.ceil(width/100), Math.ceil(width/100) );
        mesh.material.map = texture;
        mesh.material.needsUpdate = true;
      }
      this.metaStyle["material-texture-repeat"] = type;
    }
    return type;
  }

  get ["material-texture-repeat"](){
    return this.metaStyle["material-texture-repeat"];
  }

  set ["material-type"](type) {
    var mesh = this.controller.metaObject.mesh
    if (mesh) {
      switch (type) {
        case 'phong':
          mesh.material = new THREE.MeshPhongMaterial({color: this.metaStyle["material-color"]});
          break;
        default:
          mesh.material = new THREE.MeshBasicMaterial({color: this.metaStyle["material-color"]});
      }
      this.metaStyle["material-type"] = type;
      return mesh.material;
    }
  }

  get ["material-type"]() {
    return this.metaStyle["material-type"];
  }

  set ["rotate-x"](angleInDegrees) {
    this.metaStyle["rotate-x"] = Number(angleInDegrees);
    return angleInDegrees;
  }

  get ["rotate-x"]() {
    return this.metaStyle["rotate-x"];
  }

  set ["rotate-y"](angleInDegrees) {
    this.metaStyle["rotate-y"] = Number(angleInDegrees);
    return angleInDegrees;
  }

  get ["rotate-y"]() {
    return this.metaStyle["rotate-y"];
  }

  set ["rotate-z"](angleInDegrees) {
    this.metaStyle["rotate-z"] = Number(angleInDegrees);
    return angleInDegrees;
  }

  get ["rotate-z"]() {
    return this.metaStyle["rotate-z"];
  }

  set ["skybox-texture"](file) {
    this.metaStyle["skybox-texture"] = (file);
    return file;
  }

  get ["skybox-texture"]() {
    return this.metaStyle["skybox-texture"];
  }

  clear(){
    //TODO: need to set everything back to default
    this.metaStyle = {}
    this["material-color"] = 'white';
  }

  applyMetaStyleAttribute(){
    var metaStyleAttribute = this.controller.dom.getAttribute('meta-style');
    if (!metaStyleAttribute) {
      return
    }
    var cssString = `body {${metaStyleAttribute}}`
    var parsedCSSRules = CSS.parse(cssString).stylesheet.rules;
    var declarations = parsedCSSRules[0].declarations

    _.forEach(declarations, (declaration) => {
      this[declaration.property] = declaration.value
    })

  }

}
