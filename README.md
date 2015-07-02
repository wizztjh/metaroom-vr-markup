### metaroom-markup
A markup language that builds virtual reality webpage like html.

How do you represent `<table>` in virtual reality? a 3d table.
How about `<thead>`? A label on the side of the 3d table.

canvas -> webGL

svg -> x3d

html -> ?

![alt tag](demo/img/room.png)

``` html

      <meta-verse skybox=''>
        <meta-room width='600px' height='600px'>
          <meta-wall align='left'>
            <poster src='VRcollab.png'></poster>
          </meta-wall>
          <meta-wall align='right'></meta-wall>

          <meta-wall align='front'></meta-wall>
          <meta-wall align='back'></meta-wall>

          <meta-wall align='ceiling'></meta-wall>

          <meta-floor style='display: grid; grid-row: 5; grid-column: 5'>
            > or we should use
            > <meta-grid>
            >   <meta-gbox grid-x='0' grid-y='0' ></meta-gbox>
            > </meta-grid>
            > i think we should remove the meta for all the table, tr and td

            <meta-table style='grid-x: 0; grid-y: 0'>
              <meta-thead>Cashier</thead>

              <meta-tbody>
                <meta-tr>

                  <meta-td>
                    <meta-item src='cashier.obj' title='cashier' onLook='pay()'></meta-item>
                  </meta-td>

                  <meta-td>
                    <meta-item src='cashier.obj' title='cashier' onLook='pay()'></meta-item>
                  </meta-td>

                  <meta-td>
                    <meta-item src='cashier.obj' title='cashier' onLook='pay()'></meta-item>
                  </meta-td>

                </meta-tr>
                <meta-tr></meta-tr>
              </meta-tbody>
            </meta-table>

            <meta-rack height='200px' style='height: 200px'>
              <meta-rlevel>
                <meta-grid style='display: grid'>
                  <meta-gbox style='grid-x: 0; grid-y: 0'>
                    <meta-item src='red-shoe.obj' title='red shoe' onLook='addToCart()'></meta-item>
                  </meta-gbox>
                </meta-grid>
              <meta-rlevel>
            </meta-rack>

            <meta-table style='grid-x: 5; grid-y: 5'>
              <meta-thead>Contact US</thead>

              <meta-tbody>
                <meta-tr>
                  <meta-td>
                    <meta-item src='phone.obj' alt='call us by +6598144461' pickup='true'></meta-item>
                  </meta-td>
                </meta-tr>
              </meta-tbody>

            </meta-table>

            <meta-tablestyle='grid-x: 4; grid-y: 5'>
              <meta-thead>Achievements</meta-thead>
              <meta-tbody>
                <meta-tr>
                  <meta-td>
                    <meta-item src='best-game-ever-trophy.obj' alt='this is a trophy won by us on 2013' pickup='true'></meta-item>
                  </meta-td>
                </meta-tr>
              </meta-tbody>
            </meta-table>
          </meta-floor>

        </meta-room>
      </meta-verse>
```

### disclaimer
I am still prototyping this. The code might stinks

### Roadmap
- add test to all the elements
- add css to change the shader. We should support glsify
- add functional modelling for table and use css to change the arguments
- tab to change the position and look at of the user just like tabindex
- How do we do website scrolling in VR or 3D? There should be a path in the meta-room follows all the tabindex, meta-link and meta-item

### run the build
`gulp`
