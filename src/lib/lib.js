import GameObject from './game-object.js'
import MetaBaseController from './meta-base-controller.js'
import MetaBaseWallController from './meta-base-wall-controller.js'
import MetaBase from './meta-base.js'
import MetaStyle from './meta-style.js'

var MRM = {}
MRM.GameObject = GameObject;
MRM.MetaBaseController = MetaBaseController;
MRM.MetaBaseWallController = MetaBaseWallController;
MRM.MetaBase = MetaBase;
MRM.MetaStyle = MetaStyle;

window.MRM = MRM
