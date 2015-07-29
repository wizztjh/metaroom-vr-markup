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
    expect(J[metaObjectName].scale.y, 'height').to.equal(scale.y);
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
    ,   parentHeight = parent.controller.metaObject.mesh.scale.y

    ,   firstMetaComponent = J[firstMetaComponentName]
    ,   secondMetaComponent = J[secondMetaComponentName]

    ,   firstMetaComponentWidth = firstMetaComponent.controller.metaObject.mesh.scale.x
    ,   secondMetaComponentWidth = secondMetaComponent.controller.metaObject.mesh.scale.x

    ,   firstMetaComponentHeight = firstMetaComponent.controller.metaObject.mesh.scale.y
    ,   secondMetaComponentHeight = secondMetaComponent.controller.metaObject.mesh.scale.y

    ,   firstMetaComponentGroup = firstMetaComponent.controller.metaObject.group
    ,   secondMetaComponentGroup = secondMetaComponent.controller.metaObject.group;

    var rightCornerX = -parentWidth/2 + firstMetaComponentWidth/2
    ,   baseLineY = (parentHeight/2) - firstMetaComponentHeight;

    expect(firstMetaComponentGroup.position.x, firstMetaComponentName + ' x').to.equal( rightCornerX );
    expect(firstMetaComponentGroup.position.y, firstMetaComponentName + ' y').to.equal( baseLineY + (firstMetaComponentHeight / 2));

    expect(secondMetaComponentGroup.position.x, secondMetaComponentName + ' x').to.equal( rightCornerX + firstMetaComponentWidth/2 + secondMetaComponentWidth/2 );
    expect(secondMetaComponentGroup.position.y, secondMetaComponentName + ' y').to.equal( baseLineY + (secondMetaComponentHeight / 2) );
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
