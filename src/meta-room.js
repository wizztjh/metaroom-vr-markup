// Shim & native-safe ownerDocument lookup
var owner = (document._currentScript || document.currentScript).ownerDocument;

class MetaRoomController{
  constructor(metaRoom){
    this.metaRoom = metaRoom;
    this.setupComponent();
  }

  setupComponent() {
    var template = owner.querySelector("#meta-room").content.cloneNode(true);
    this.metaRoom.appendChild(template);
  }
}

class MetaRoom extends HTMLElement {
  createdCallback() {
    this.controller = new MetaRoomController(this);
  }
}

document.registerElement('meta-room', MetaRoom);
