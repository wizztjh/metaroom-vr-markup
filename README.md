## MetaRoom markup

[What is MetaRoom Markup](http://vrcollab.com/2015/08/10/what-is-metaroom-markup.html)

MetaRoom Markup applies HTML/CSS way of position and styling to 3D object.

For example we can style the table with table-padding-top and table-padding-bottom to control the table 3D object.

``` html
<meta-table class='nice-table'>
  <meta-tsurface></meta-tsurface>
</meta-table>
```

``` css
.nice-table {
  table-padding-top: 0.4;
  table-padding-bottom: 0.4;
}
```

![alt tag](demo/img/meta-style-example.png)

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
