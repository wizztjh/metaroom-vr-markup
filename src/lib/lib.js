import GameObject from './game-object.js'
import MetaBaseController from './meta-base-controller.js'
import MetaBase from './meta-base.js'

import MetaComponentController from './meta-component-controller.js'
import MetaComponent from './meta-component.js'

import MetaBaseWallController from './meta-base-wall-controller.js'
import MetaStyle from './meta-style.js'

var MRM = {}
MRM.GameObject = GameObject;
MRM.MetaBaseController = MetaBaseController;
MRM.MetaBase = MetaBase;

MRM.MetaComponentController = MetaComponentController;
MRM.MetaComponent = MetaComponent;

MRM.MetaBaseWallController = MetaBaseWallController;

MRM.MetaStyle = MetaStyle;

window.MRM = MRM
