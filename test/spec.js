//TODO: abstract out the jlet to a bower
var J = {}
var fixtureHTML = ""

//sharedBehaviors start
//TODO: we should move all the sharedBehaviors to different files
function shouldBehaveLikeAMetaObjectThatPositions(metaObjectName, position){
  it("sets the position of the object according to the attributes", function(){
    expect(J[metaObjectName].position.x, 'x').to.equal(position.x);
    expect(J[metaObjectName].position.y, 'y').to.equal(position.y);
    });
}
function shouldBehaveLikeAMetaObjectThatScales(metaObjectName, scale){
  it("sets the dimension of the object", function(){
    expect(J[metaObjectName].scale.x, 'width').to.equal(scale.x);
    expect(J[metaObjectName].scale.y, 'length').to.equal(scale.y);
  });
}

function shouldBehaveLikeAPlaneAddingMetaTag(metaTagName, metaParentName){
  it("adds a plane to "+ metaParentName +" group", function(){
    var metaChildrenUUID = J[metaParentName].controller.metaObject.group.children.map(function(child){
      return child.uuid;
    });

    var metaObjectUUID = J[metaTagName].controller.metaObject.group.uuid;

    expect(metaChildrenUUID).to.include(metaObjectUUID);
  });
}

function shouldBehaveLikeARemoveableMetaObject(metaTagName, metaParentName){
  describe("when the "+ metaTagName +" is removed", function(){
    beforeEach(function(){
      J[metaTagName].remove();
    });

    it("removes the meta object", function(){
      metaObjectUUID = J[metaTagName].controller.metaObject.group.uuid;

      metaParentChildrenUUID = J[metaParentName].controller.metaObject.group.children.map(function(child){
        return child.uuid;
      });

      expect(metaParentChildrenUUID).to.not.include(metaObjectUUID);
    });

  });
}

function shouldBehaveLikeAInlineMetaComponent(parentName, firstMetaComponentName, secondMetaComponentName){
  it("alines from the top left corner", function () {
    var parent = J[parentName]
    ,   parentWidth = parent.controller.metaObject.mesh.scale.x
    ,   parentLength = parent.controller.metaObject.mesh.scale.y

    ,   firstMetaComponent = J[firstMetaComponentName]
    ,   secondMetaComponent = J[secondMetaComponentName]

    ,   firstMetaComponentWidth = firstMetaComponent.controller.metaObject.mesh.scale.x
    ,   secondMetaComponentWidth = secondMetaComponent.controller.metaObject.mesh.scale.x

    ,   firstMetaComponentLength = firstMetaComponent.controller.metaObject.mesh.scale.y
    ,   secondMetaComponentLength = secondMetaComponent.controller.metaObject.mesh.scale.y

    ,   firstMetaComponentGroup = firstMetaComponent.controller.metaObject.group
    ,   secondMetaComponentGroup = secondMetaComponent.controller.metaObject.group;

    var rightCornerX = -parentWidth/2 + firstMetaComponentWidth/2
    ,   baseLineY = (parentLength/2) - firstMetaComponentLength;

    expect(firstMetaComponentGroup.position.x, firstMetaComponentName + ' x').to.equal( rightCornerX );
    expect(firstMetaComponentGroup.position.y, firstMetaComponentName + ' y').to.equal( baseLineY + (firstMetaComponentLength / 2));

    expect(secondMetaComponentGroup.position.x, secondMetaComponentName + ' x').to.equal( rightCornerX + firstMetaComponentWidth/2 + secondMetaComponentWidth/2 );
    expect(secondMetaComponentGroup.position.y, secondMetaComponentName + ' y').to.equal( baseLineY + (secondMetaComponentLength / 2) );
  });
}

function shouldBehaveLikeAMetaComponentThatTriggersEventWhenIDUpdates(componentName){
  describe("when id is updated", function(){
    it("triggers an event with propagateMetaStyle action", function(){
      var metaAttributeChangeEventSpy = sinon.spy();
      var event;

      J[componentName].addEventListener('meta-attribute-change', metaAttributeChangeEventSpy, false)
      J[componentName].setAttribute("id", "picture1");

      expect(metaAttributeChangeEventSpy).to.have.been.called

      event = metaAttributeChangeEventSpy.args[0][0]

      expect(event).to.have.deep.property("detail.actions.propagateMetaStyle")
    });
  });
}

function shouldBehaveLikeAMetaComponentThatTriggersEventWhenClassUpdates(componentName){
  describe("when class is updated", function(){
    it("triggers an event with propagateMetaStyle action", function(){
      var metaAttributeChangeEventSpy = sinon.spy();
      var event;

      J[componentName].addEventListener('meta-attribute-change', metaAttributeChangeEventSpy, false)
      J[componentName].setAttribute("class", "picture1");

      expect(metaAttributeChangeEventSpy).to.have.been.called

      event = metaAttributeChangeEventSpy.args[0][0]

      expect(event).to.have.deep.property("detail.actions.propagateMetaStyle")
    });
  });
}

//sharedBehaviors end

afterEach(function(){
  J = {}
});

function jlet(name, callback){
  var value, called = false;
  var memoizer = function() {
    if (called) {
      return value;
    } else {
      called = true;
    }

    return value = callback();
  };

  Object.defineProperty(J, name, {
    get: function(){
      return memoizer()
    },
    set: function(){
    },
    configurable: true
  });
}

before(function(){
  fixtureHTML = fixture.innerHTML
});


beforeEach(function(){
  var fixture = document.querySelector('#fixture');

  fixture.innerHTML = fixtureHTML
});

function inNextTick(callback){
  return function(done){
    setTimeout(function(){
      callback(done)
    })
  };
}

function asyncBeforeEach(callback){
  beforeEach(function(done){
    callback()
    setTimeout(function(){ done() })
  })
}
