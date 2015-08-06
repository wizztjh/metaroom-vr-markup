//TODO: abstract out the jlet to a bower
var J = {}
var fixtureHTML = ""

var shouldBehaveLikeA ={}

//sharedBehaviors start
//TODO: we should move all the sharedBehaviors to different files
shouldBehaveLikeA["Surface"] = function (metaObjectName, childrenTagName){
  describe("for children " + childrenTagName, function () {

    describe("#updateChildrenDisplayInline", function(){
      beforeEach(function(){
        jlet("childrens", function(){
          return [
            {
              controller: {
                properties: {
                  width: 5,
                  length: 4
                },
                metaObject: {
                  mesh: {},
                  group: {
                    position: { x: 0, y:0 }
                  }
                }
              }
            }
          ]
        })
        sinon.stub(J[metaObjectName].controller, 'getMetaChildren').returns(J.childrens)

        J[metaObjectName].controller.properties.width =10
        J[metaObjectName].controller.properties.length =20
      })
      describe("when one children", function(){
        it("align on the top left", function(){
          J[metaObjectName].controller.updateChildrenDisplayInline()
          expect(J.childrens[0].controller.metaObject.group.position).to.deep.equal({x: -2.5, y: 8})
        });
      })
    });

    describe('when children bubble up a meta attached event', function(){
      beforeEach(function(){
        sinon.stub(J[metaObjectName].controller, 'updateChildrenDisplayInline')
        sinon.stub(J[metaObjectName].controller.metaObject.group, 'add');
        J[metaObjectName].metaAttached({
          stopPropagation: sinon.spy(),
          detail: {
            controller: {
              tagName: childrenTagName,
              isAllowedAttribute: function(){ return true },
              parent: {},
              metaObject: {
                group: {
                  position: {x:1}
                }
              }
            }
          }
        });
      });

      it("added it to the meta object group", function(){
        assert.isTrue(J[metaObjectName].controller.metaObject.group.add.called);
        expect(J[metaObjectName].controller.metaObject.group.add).to.have.been.calledWith({ position: {x: 1}})
      });

      it("updates inline display of its children", function(){
        expect(J[metaObjectName].controller.updateChildrenDisplayInline).to.have.been.called;
      });
    })

    describe('when child attribute updated and with event action', function(){
      it("updates the child position", function(){
        updateChildSpy = sinon.spy(J[metaObjectName].controller, 'updateChildrenDisplayInline')

        J[metaObjectName].metaChildAttributeChanged({
          stopPropagation: sinon.spy(),
          detail: {
            controller: {
              tagName: "meta-picture",
              isAllowedAttribute: function(){ return true }
            },
            attrName: 'width',
            actions: {"updateChildrenDisplayInline": true}
          }
        })

        assert.isTrue(updateChildSpy.called);
      });
    });
  });

}

shouldBehaveLikeA["MetaObject that scales"] = function (metaObjectName, scale){
  it("sets the dimension of the object", function(){
    expect(J[metaObjectName].scale.x, 'width').to.equal(scale.x);
    expect(J[metaObjectName].scale.y, 'length').to.equal(scale.y);
  });
}

shouldBehaveLikeA["Plane Adding MetaTag"] = function(metaTagName, metaParentName){
  it("adds a plane to "+ metaParentName +" group", function(){
    var metaChildrenUUID = J[metaParentName].controller.metaObject.group.children.map(function(child){
      return child.uuid;
    });

    var metaObjectUUID = J[metaTagName].controller.metaObject.group.uuid;

    expect(metaChildrenUUID).to.include(metaObjectUUID);
  });
}

shouldBehaveLikeA["Removeable MetaObject"] = function(metaTagName, metaParentName){
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

shouldBehaveLikeA["Inline MetaComponent"] = function (parentName, firstMetaComponentName, secondMetaComponentName){
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

shouldBehaveLikeA["MetaComponent That Triggers Event When ID Updates"] = function(componentName){
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

shouldBehaveLikeA["MetaComponent That Triggers Event When Class Updates"] = function(componentName){
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
