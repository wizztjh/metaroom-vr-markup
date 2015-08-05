export default class MetaStyle {
  constructor (controller){
    this.metaStyle={}
    this.controller = controller
  }

  set ["material-color"](color) {
    console.log("material-color set", color, this.controller.tagName)
    this.controller.metaObject.mesh.material.color.set(color)
    this.metaStyle["material-color"] = color
    return color;
  }

  get ["material-color"]() {
    return this.metaStyle["material-color"];
  }

}
