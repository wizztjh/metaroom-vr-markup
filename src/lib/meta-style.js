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

      mesh.geometry.update(geometry.width, geometry.height, geometry.depth, Number(thickness), Number(thickness), geometry.tbottomPaddingTop, geometry.tbottomPaddingTop)
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
      controller.updateFrame(frameWidth);
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
