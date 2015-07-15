// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

class MetaRoomController extends MRM.MetaBaseController{
  constructor(dom){
    super();
    this.dom = dom;
    this.setupComponent();
  }

  templateID() {
    return "#meta-room";
  }

}

class MetaRoom extends HTMLElement {
  createdCallback() {
    this.controller = new MetaRoomController(this);
  }
}

document.registerElement('meta-room', MetaRoom);
