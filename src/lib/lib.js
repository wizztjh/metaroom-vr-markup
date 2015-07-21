import GameObject from './game-object.js'
import MetaBaseController from './meta-base-controller.js'
import MetaBaseWallController from './meta-base-wall-controller.js'
import MetaBase from './meta-base.js'

var MRM = {}
MRM.GameObject = GameObject;
MRM.MetaBaseController = MetaBaseController;
MRM.MetaBaseWallController = MetaBaseWallController;
MRM.MetaBase = MetaBase;

window.MRM = MRM
