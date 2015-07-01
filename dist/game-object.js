(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var GameObject = (function () {
  function GameObject() {
    _classCallCheck(this, GameObject);

    var self = this;
    this.metaObjects = new Map();

    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.domElement.id = 'hpml-webgl-canvas';

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xffff99, 0.0075);

    this.camera = new THREE.PerspectiveCamera(75, this.getWidth() / this.getHeight(), 0.3, 10000);

    this.controls = new THREE.VRControls(this.camera);

    this.effect = new THREE.VREffect(this.renderer);
    this.effect.setSize(this.getWidth(), this.getHeight());

    this.manager = new WebVRManager(this.renderer, this.effect, { hideButton: false });

    this.clock = new THREE.Clock(true);
    this.clock.start();

    function animate() {
      self.controls.update();
      // Render the scene through the manager.
      self.manager.render(self.scene, self.camera);
      requestAnimationFrame(animate);
    }
    animate();
    // Object.keys(initObjs).forEach(function(name){
    //   returnObject = initObjs[name].apply(self)
    //   self.add(name, returnObject);
    // });
    // window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  _createClass(GameObject, [{
    key: 'getWidth',
    value: function getWidth() {
      return window.innerWidth;
    }
  }, {
    key: 'getHeight',
    value: function getHeight() {
      return window.innerHeight;
    }
  }, {
    key: 'add',
    value: function add(metaObject) {
      this.scene.add(metaObject.mesh);
      this.metaObjects.set(metaObject.mesh.uuid, metaObject);
    }
  }, {
    key: 'remove',
    value: function remove(metaObject) {
      this.scene.remove(metaObject.mesh);
      this.metaObjects['delete'](metaObject.mesh.uuid);
    }
  }]);

  return GameObject;
})();

window.GameObject = GameObject;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdGVlamlhaGVuL3dvcmtzcGFjZS9NZXRhcm9vbU1hcmt1cC9zcmMvZ2FtZS1vYmplY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7SUNBTSxVQUFVO0FBQ0gsV0FEUCxVQUFVLEdBQ0Q7MEJBRFQsVUFBVTs7QUFFWixRQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDOztBQUU3QixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQzlELFFBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztBQUVyRCxRQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsbUJBQW1CLENBQUE7O0FBRWpELFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDL0IsUUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFFLFFBQVEsRUFBRSxNQUFNLENBQUUsQ0FBQzs7QUFFdkQsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRTlGLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFbEQsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2hELFFBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQzs7QUFFdkQsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQzs7QUFFakYsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDbEMsUUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQTs7QUFFbEIsYUFBUyxPQUFPLEdBQUc7QUFDakIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7QUFFdkIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0MsMkJBQXFCLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDaEM7QUFDRCxXQUFPLEVBQUUsQ0FBQzs7Ozs7O0dBTVg7O2VBckNHLFVBQVU7O1dBdUNOLG9CQUFHO0FBQ1QsYUFBTyxNQUFNLENBQUMsVUFBVSxDQUFDO0tBQzFCOzs7V0FFUSxxQkFBRztBQUNWLGFBQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQztLQUMzQjs7O1dBRUUsYUFBQyxVQUFVLEVBQUU7QUFDZCxVQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7S0FDekQ7OztXQUVLLGdCQUFDLFVBQVUsRUFBRTtBQUNqQixVQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkMsVUFBSSxDQUFDLFdBQVcsVUFBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDOUM7OztTQXZERyxVQUFVOzs7QUF5RGhCLE1BQU0sQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIEdhbWVPYmplY3R7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMubWV0YU9iamVjdHMgPSBuZXcgTWFwKCk7XG5cbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IGZhbHNlIH0pO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG5cbiAgICB0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQuaWQgPSAnaHBtbC13ZWJnbC1jYW52YXMnXG5cbiAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgdGhpcy5zY2VuZS5mb2cgPSBuZXcgVEhSRUUuRm9nRXhwMiggMHhmZmZmOTksIDAuMDA3NSApO1xuXG4gICAgdGhpcy5jYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHRoaXMuZ2V0V2lkdGgoKSAvIHRoaXMuZ2V0SGVpZ2h0KCksIDAuMywgMTAwMDApO1xuXG4gICAgdGhpcy5jb250cm9scyA9IG5ldyBUSFJFRS5WUkNvbnRyb2xzKHRoaXMuY2FtZXJhKTtcblxuICAgIHRoaXMuZWZmZWN0ID0gbmV3IFRIUkVFLlZSRWZmZWN0KHRoaXMucmVuZGVyZXIpO1xuICAgIHRoaXMuZWZmZWN0LnNldFNpemUodGhpcy5nZXRXaWR0aCgpLCB0aGlzLmdldEhlaWdodCgpKTtcblxuICAgIHRoaXMubWFuYWdlciA9IG5ldyBXZWJWUk1hbmFnZXIodGhpcy5yZW5kZXJlciwgdGhpcy5lZmZlY3QsIHtoaWRlQnV0dG9uOiBmYWxzZX0pO1xuXG4gICAgdGhpcy5jbG9jayA9IG5ldyBUSFJFRS5DbG9jayh0cnVlKVxuICAgIHRoaXMuY2xvY2suc3RhcnQoKVxuXG4gICAgZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgICAgIHNlbGYuY29udHJvbHMudXBkYXRlKCk7XG4gICAgICAvLyBSZW5kZXIgdGhlIHNjZW5lIHRocm91Z2ggdGhlIG1hbmFnZXIuXG4gICAgICBzZWxmLm1hbmFnZXIucmVuZGVyKHNlbGYuc2NlbmUsIHNlbGYuY2FtZXJhKTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbiAgICB9XG4gICAgYW5pbWF0ZSgpO1xuICAgIC8vIE9iamVjdC5rZXlzKGluaXRPYmpzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpe1xuICAgIC8vICAgcmV0dXJuT2JqZWN0ID0gaW5pdE9ianNbbmFtZV0uYXBwbHkoc2VsZilcbiAgICAvLyAgIHNlbGYuYWRkKG5hbWUsIHJldHVybk9iamVjdCk7XG4gICAgLy8gfSk7XG4gICAgLy8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMub25XaW5kb3dSZXNpemUuYmluZCh0aGlzKSwgZmFsc2UpO1xuICB9XG5cbiAgZ2V0V2lkdGgoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5pbm5lcldpZHRoO1xuICB9XG5cbiAgZ2V0SGVpZ2h0KCkge1xuICAgIHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIH1cblxuICBhZGQobWV0YU9iamVjdCkge1xuICAgIHRoaXMuc2NlbmUuYWRkKG1ldGFPYmplY3QubWVzaCk7XG4gICAgdGhpcy5tZXRhT2JqZWN0cy5zZXQoIG1ldGFPYmplY3QubWVzaC51dWlkLCBtZXRhT2JqZWN0KTtcbiAgfVxuXG4gIHJlbW92ZShtZXRhT2JqZWN0KSB7XG4gICAgdGhpcy5zY2VuZS5yZW1vdmUobWV0YU9iamVjdC5tZXNoKTtcbiAgICB0aGlzLm1ldGFPYmplY3RzLmRlbGV0ZShtZXRhT2JqZWN0Lm1lc2gudXVpZClcbiAgfVxufVxud2luZG93LkdhbWVPYmplY3QgPSBHYW1lT2JqZWN0XG4iXX0=
