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
