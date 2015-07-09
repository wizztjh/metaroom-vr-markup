import GameObject from './game-object.js'
import fireMetaEventsBehavior from './fire-meta-events-behavior.js'
import createBaseWallBehavior from './create-base-wall-behavior.js'

var MRM = {}
MRM.GameObject = GameObject;
MRM.fireMetaEventsBehavior = fireMetaEventsBehavior;
MRM.createBaseWallBehavior = createBaseWallBehavior;

window.MRM = MRM
