# MetaRoomMarkup (Alpha stage, V0)

[What is MetaRoom Markup](http://vrcollab.com/2015/08/10/what-is-metaroom-markup.html)

MetaRoomMarkup applies the HTML/CSS way of positioning and styling to a 3D object.

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

## Markup Language Reference

### Meta Tags
MetaRoom markup tags

## meta-room
creates a structure of the room

##### Attributes
- `width` type: number, default: 1
- `height` type: number. default 1
- `depth` type: number. default 1

## meta-wall
creates a wall in the meta-room

##### Attributes
- `align` change the alignment of wall. Default is front. Can be left, right, ceiling, front and back.

##### meta-style
- `material-color` css color code

## meta-floor
creates a floor in the meta-room

##### meta-style
- `material-color` css color code

## meta-table
creates a table structure

##### meta-style
- `material-color` css color code
- `tbottom-padding`

## meta-tsurface
creates a table surface

##### meta-style
- `material-color` css color code

## meta-tbottom
creates a table side

##### Attributes
- `align` change the alignment of wall. Default is front. Can be left, right, ceiling, front and back.

##### meta-style
- `material-color` css color code

## Features
- **Smaller size**: Defines common 3D object with style instead of vertexes.
- **Display Inline**: Brings display inline to 3D VR
- **Extend**: With Web component, new meta component can be created, such as meta-elevator

[Demo](http://vrcollab.com/VRcollab/)

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

- add CSS to change the shader. We should support glsify
- add functional modeling for table and use CSS to change the arguments
- tab to change positions like tabindex
- How do we scroll in VR or 3D? There should be a path in the meta-room that follows all the tabindex, meta-link and meta-item
- meta-section to define a section and meta-label to guide user to the location along the meta-path region

### Introduction to metaroom-markup video:

[![metaroom-markup video](http://img.youtube.com/vi/eoWaB1wufn4/0.jpg)](http://www.youtube.com/watch?v=eoWaB1wufn4)


### Dev setup

    git clone git@github.com:MetaRoomMarkup/MetaRoomMarkup.git
    cd MetaRoomMarkup
    npm install
    npm install gulp -g
    bower install

Hot update during development
    gulp

Run the test
    # go to localhost:3000/test/index.html after gulp
