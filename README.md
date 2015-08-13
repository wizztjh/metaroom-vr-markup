## MetaRoom markup
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/wizztjh/metaroom-markup?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

MetaRoom markup is a 3D markup language that focuses on building 3D VR webpages.
Building a 3D VR webpage is not only about building games but in most cases, it is related to building a storefront, art gallery and showroom to provide users a sense of what the company is doing and selling.
With this, it will bring a sense of immersion and awe to a user that can’t be provided by a 2D webpage.

To build this type of 3D VR webpage, we need something that is more modular than a cube and cone to build a virtual storefront, such as a table, rack, room, wall, picture and text which is more helpful.
With the standardization of it, we can customize the table style using table-padding-top.

``` html
<meta-table class='nice-table'>
  <meta-tsurface></meta-tsurface>
</meta-table>
```

``` css
// style.metastyle

.nice-table {
  table-padding-top: 0.4;
  table-padding-bottom: 0.4;
}
```

![alt tag](demo/img/meta-style-example.png)

As such, we do not need to send down the 3D object vertexes down to the client.

Normally, to create a 3D VR webpage using WebGL or game engine, we would need to set all of the x and y position of the 3D items. However, with MetaRoom markup, we will add all of the meta-item on a meta-floor and then automatically, all of the meta-item will be displayed inline just like in web development.

### Features
- **Smaller size**: Defines common 3D object with style instead of vertexes.
- **Display Inline**: Brings display inline to 3D VR
- **Extend**: With Web component, new meta component can be created, such as meta-elevator

[Demo](http://wizztjh.github.io/metaroom-markup/)

![alt tag](demo/img/room.png)

### How metaroom-markup would look like

``` html

<meta-verse skybox=''>
  <meta-room width='10' height='30' length='10'>
    <meta-wall align='left'>
      <meta-picture src='VRcollab.png'></meta-picture>
    </meta-wall>

    <meta-floor>
      <meta-table>
        <meta-tsurface>
          <meta-item src='cashier.obj' title='cashier' onLook='pay()'></meta-item>
          <meta-item src='cashier.obj' title='cashier' onLook='pay()'></meta-item>
          <meta-item src='cashier.obj' title='cashier' onLook='pay()'></meta-item>
        </meta-tsurface>

        <meta-tside align='front'>
          <meta-text>
            Cashier
          </meta-text>
        <meta-tside>

      </meta-table>

      <meta-rack height='10' >
        <meta-tsurface>
          <meta-item src='red-shoe.obj' title='red shoe' onLook='addToCart()'></meta-item>
        </meta-tsurface>

        <meta-tsurface>
          <meta-item src='blue-shoe.obj' title='red shoe' onLook='addToCart()'></meta-item>
        </meta-tsurface>
      </meta-rack>

      <meta-table>
        <meta-tside>Contact US</meta-tside>
        <meta-tbottom>
          <meta-item src='phone.obj' alt='call us by +6598144461' pickup='true'></meta-item>
        </meta-tbottom>
      </meta-table>

      <meta-table>
        <meta-tside>Achievements</meta-tside>
        <meta-tsurface>
          <meta-item src='best-game-ever-trophy.obj' alt='this is a trophy won by us on 2013' pickup='true'></meta-item>
        </meta-tsurface>
      </meta-table>
    </meta-floor>

  </meta-room>
</meta-verse>
```

### disclaimer
it is a prototype.

### Roadmap

- add css to change the shader. We should support glsify
- add functional modelling for table and use css to change the arguments
- tab to change the position and look at of the user just like tabindex
- How do we do website scrolling in VR or 3D? There should be a path in the meta-room follows all the tabindex, meta-link and meta-item
- meta-section to define a section and meta-label to guide user to the location along meta-path region

### Introduction to metaroom-markup video:

[![metaroom-markup video](http://img.youtube.com/vi/eoWaB1wufn4/0.jpg)](http://www.youtube.com/watch?v=eoWaB1wufn4)


### Dev setup

    git clone https://github.com/wizztjh/metaroom-markup.git
    cd metaroom-markup
    npm install
    npm install gulp -g
    bower install

Hot update during development
    gulp

Demo
    # go to localhost:3000/demo/metaroom-markup-standard-spec.html

Run the test
    # go to localhost:3000/test/index.html after gulp
