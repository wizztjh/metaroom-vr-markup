suite('GameObject instance', function() {
  test('has a renderer', function() {
    var gameObject = new MRM.GameObject();

    expect(gameObject).to.have.property("renderer");
  });
});
