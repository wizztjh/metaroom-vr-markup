import CSS from 'css'

export default class MetaStyle {
  constructor (controller){
    this.metaStyle={}
    this.controller = controller
  }

  set ["material-color"](color) {
    var mesh = this.controller.metaObject.mesh
    if (mesh) {
      mesh.material.color.set(color)
      this.metaStyle["material-color"] = color
    }
    return color;
  }

  get ["material-color"]() {
    return this.metaStyle["material-color"];
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
