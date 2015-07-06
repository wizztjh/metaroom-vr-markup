suite('GameObject', function() {
  test('is awesome', function() {
    var gameObject = new MRM.GameObject()

    expect(gameObject).to.have.property("renderer");
  });
});
