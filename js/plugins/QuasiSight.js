//============================================================================
// Quasi Sight
// Version: 1.02
// Last Update: January 8, 2016
//============================================================================
// ** Terms of Use
// http://quasixi.com/mv/
// https://github.com/quasixi/RPG-Maker-MV/blob/master/README.md
//============================================================================
// How to install:
//  - Save this file as "QuasiSight.js" in your js/plugins/ folder
//  - Add plugin through the plugin manager
//  - - Place somewhere below QuasiMovement
//  - Configure as needed
//  - Open the Help menu for setup guide or visit one of the following:
//  - - http://quasixi.com/mv/movement/#sight
//  - - http://forums.rpgmakerweb.com/index.php?/topic/48741-quasi-movement/
//============================================================================

var Imported = Imported || {};
Imported.Quasi_Sight = 1.02;

//=============================================================================
 /*:
 * @plugindesc A line of sight script with real time shadow casting.
 * @author Quasi      Site: http://quasixi.com
 *
 * @param Show Sight
 * @desc Set to true or false to show Sights
 * Warning! The bitmaps may get stuck on screen!
 * @default false
 *
 * @help
 * =============================================================================
 * ** Giving Events Sight
 * =============================================================================
 * Giving an event sight, will allow them to act differently depending if they
 * can actually see you. Unlike other sensor plugins, this plugin does not
 * all events to see through walls or objects they can't see through.
 *   Giving Sight <Comment>
 *       <sight=shape, size, switch>
 *     Shape:  Can be; box, circle or poly
 *     Size:   The size of the view in pixels. For circles it's the radius.
 *     Switch: The self switch it triggers, can be A, B, C or D
 *
 *   Don't change direction when changing Page <Note>
 *       <retaindirection>
 *     Add this in the note field next to events name.
 *
 *   Allow events to cast shadows <Comment>
 *       <shadowcast>
 *
 * ** Event Comments are page based, so you may have to put the comments on
 * multiple pages depending on what you're aimming to do.
 * =============================================================================
 * ** Making see through Regions
 * =============================================================================
 * You might not want all impassable tiles to block their sight, like water tiles.
 * So you can create a Region Box, give it the same dimensions as the tile and
 * mark it with a tag so this plugin will know to ignore that region.
 *     See through Region <Region Tag>
 *         <noshadow>
 *
 *   Example of a Region Box that is see through:
 *       "3": [
 *         {"width": 48, "height": 48, "tag": "<noshadow>"}
 *            ]
 *
 * Or view the example RegionBoxes.json
 *   https://gist.github.com/quasixi/ff149320fd6885191d87
 * =============================================================================
 * ** FAQ
 * =============================================================================
 * ** This seems really heavy, will it cause lag?
 *  ^ I tried my best to optimize it as much as possible and I do not get any
 *    frame drops. But with MV it will depend on user hardware.
 *
 * ** Can I give players sight?
 *  ^ There are ways to force it through with the console, but it would be
 *    pointless since sight will always look for the player.
 *
 * ** Can I change what the event is looking for?
 *  ^ I was originally going to let you choose who to target for the sight. But
 *    that might lead to complications / misusage so no you can not.
 *
 * ** This is nice, but isn't it too much?
 *  ^ It probably is overkill for a normal RMMV game. But my plugins are aimming
 *    to allow people to create games that do not look like they were made with
 *    the RPG Maker engine.
 *
 * ** I Enabled 'Show Sight' but I can't see event shadows
 *  ^ For events since they can move, I set it up so you can only see the
 *    shadow of the event that you are inside of.
 *
 * ** I Enabled 'Show Sight' but I can't see anything
 *  ^ You need to enable 'Show Boxes' in Quasi Movement. Or toggle it with
 *  F10 while testing.
 *
 * Got questions? Ask on my Quasi Movement thread at RPGMaker Web, link below.
 * =============================================================================
 * Links
 *  - http://quasixi.com/mv/movement/#sight
 *  - https://github.com/quasixi/RPG-Maker-MV
 *  - http://forums.rpgmakerweb.com/index.php?/topic/48741-quasi-movement/
 */
//=============================================================================

if (!Imported.Quasi_Movement) {
  alert("Error: Quasi Sight requires Quasi Movement to work.");
  throw new Error("Error: Quasi Sight requires Quasi Movement to work.")
}
if (Imported.Quasi_Movement < 1.17) {
  alert("Error: Quasi Sight requires Quasi Movement to work.");
  throw new Error("Error: Quasi Sight requires Quasi Movement to work.")
}
(function() {
  var Sight = {};
  Sight.parameters = PluginManager.parameters('QuasiSight');
  Sight.show       = Sight.parameters['Show Sight'].toLowerCase() === "true";

  Sight.loadShadowMap = function() {
    var xhr = new XMLHttpRequest();
    var url = QuasiMovement.jFolder + 'Shadows.json';
    xhr.open('GET', url, true);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
      if (xhr.status < 400) {
        Sight.onLoadShadowMap(JSON.parse(xhr.responseText));
      }
    };
    xhr.send();
  };

  //-----------------------------------------------------------------------------
  // Game_CharacterBase
  //
  // The superclass of Game_Character. It handles basic information, such as
  // coordinates and images, shared by all characters.

  var Alias_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
    Alias_Game_CharacterBase_update.call(this);
    if (this._hasSight && this.needsSightUpdate()) {
      $gameSelfSwitches.setValue(this._sightSettings.switch, this.checkSight());
    }
  };

  Game_CharacterBase.prototype.checkSight = function() {
    this._sight.origin = {
      x: this._px,
      y: this._py,
      dir: this._direction
    };
    this._sight.target = new Point(this._sightSettings.target._px, this._sightSettings.target._py);
    if (!this.insideSightRange()) return false;
    if (this.insideTileShadow()) return false;
    if (this.insideEventShadow()) return false;
    return true;
  };

  Game_CharacterBase.prototype.insideSightRange = function() {
    this._sight.base = this._sightSettings.collider;
    if (this._sight.base.constructor === Array) {
      this._sight.base = this._sightSettings.collider[(this._direction / 2) - 1];
      var dir = { 2: 2, 4: 0, 6: 1, 8: 0 };
      var x1 = this.collider()._vertices[dir[this._direction]].x;
      var y1 = this.collider()._vertices[dir[this._direction]].y;
      this._sight.base.moveto(x1, y1);
    } else {
      this._sight.base.moveto(this.cx() - this._sight.base.width / 2, this.cy() - this._sight.base.height / 2);
    }
    if (Sight.show) {
      this._sight.base.color = 0xffffff;
      SceneManager._scene.addTempCollider(this._sight.base, 120, true);
    }
    return this._sight.base.intersects(this._sightSettings.target.collider());
  };

  Game_CharacterBase.prototype.insideTileShadow = function() {
    this._sight.tiles = $gameMap.getTileBoxesAt(this._sight.base);
    this._sight.tiles = this._sight.tiles.filter(function(tile) {
      if (tile.width !== 0 && tile.height !== 0 && !/<noshadow>/i.test(tile.note)) {
        return tile;
      }
    });
    var i, j, insideAny;
    for (i = 0, j = this._sight.tiles.length; i < j; i++) {
      var id = this._sight.tiles[i].location;
      if (!this._sight.tileShadows[id]) {
        this._sight.tileShadows[id] = {};
        var shadowData = this.shadowCast(this._sight.tiles[i]);
        var shadow = new QuasiMovement.Polygon_Collider(shadowData[0]);
        shadow.color = 0x000000;
        shadow.moveto(shadowData[1], shadowData[2]);
        this._sight.tileShadows[id].shadow = shadow;
      }
      if (this._sight.tileShadows[id].reshape) {
        SceneManager._scene.removeTempCollider(this._sight.tileShadows[id].shadow);
        this._sight.tileShadows[id].reshape = false;
        var shadowData = this.shadowCast(this._sight.tiles[i]);
        this._sight.tileShadows[id].shadow.reshape(shadowData[0]);
        this._sight.tileShadows[id].shadow.moveto(shadowData[1], shadowData[2]);
      }
      if (this._sight.tileShadows[id].shadow.halfInside(this._sightSettings.target.collider())) {
        if (Sight.show) {
          SceneManager._scene.addTempCollider(this._sight.tileShadows[id].shadow, 180, true);
        }
        insideAny = true;
      }
    }
    return insideAny;
  };

  Game_CharacterBase.prototype.insideEventShadow = function() {
    var self = this;
    var events = $gameMap.getCharactersAt(this._sight.base, function(chara) {
      if (chara.constructor !== Game_Event) {
        return true;
      }
      if (!chara.castShadow() || chara.isThrough() || chara === self || !chara.isNormalPriority()) {
        return true;
      }
      return false;
    });
    var i, j, insideAny;
    for (i = 0, j = events.length; i < j; i++) {
      if (!this._sight.objs[events[i]._eventId]) {
        this._sight.objs[events[i]._eventId] = {};
        this._sight.objs[events[i]._eventId].cache = new Point(events[i]._px, events[i]._py);
        this._sight.objs[events[i]._eventId].chara = events[i];
        var shadowData = this.shadowCast(events[i].collider());
        var shadow  = new QuasiMovement.Polygon_Collider(shadowData[0]);
        shadow.moveto(shadowData[1], shadowData[2]);
        shadow.color = 0x000000;
        this._sight.objs[events[i]._eventId].shadow = shadow;
      }
      if (this._sight.objs[events[i]._eventId].reshape) {
        SceneManager._scene.removeTempCollider(this._sight.objs[events[i]._eventId].shadow);
        this._sight.objs[events[i]._eventId].reshape = false;
        var shadowData = this.shadowCast(events[i].collider());
        this._sight.objs[events[i]._eventId].shadow.reshape(shadowData[0]);
        this._sight.objs[events[i]._eventId].shadow.moveto(shadowData[1], shadowData[2]);
      }
      if (this._sight.objs[events[i]._eventId].shadow.halfInside(this._sightSettings.target.collider())) {
        if (Sight.show) {
          SceneManager._scene.addTempCollider(this._sight.objs[events[i]._eventId].shadow, 180, true);
        }
        insideAny = true;
      }
    }
   return insideAny;
  };

  Game_CharacterBase.prototype.shadowCast = function(obj) {
    var radians = [];
    var radianWithPoint = {};
    var pointWithRadian = {};
    var points = [];
    var vertices = obj.vertices();
    var i, j;
    for (i = 0, j = vertices.length; i < j; i++) {
      var x1 = vertices[i].x;
      var y1 = vertices[i].y;
      var point = new Point(x1, y1);
      var radian = Math.atan2(this.cy() - y1, x1 - this.cx())
      radian += radian < 0 ? 2 * Math.PI : 0;
      radianWithPoint[radian] = point;
      pointWithRadian[JSON.stringify(point)] = radian;
      radians.push(radian);
      points.push(point);
    }
    radians.sort(function(a, b) {
      return a - b;
    });
    var min = radians[0];
    var max = radians[radians.length - 1];
    if (Math.abs(max - min)> Math.PI) {
      var i, j, old;
      for (i = 0, j = radians.length; i < j; i++) {
        if (radians[i] > Math.PI) {
          old = radianWithPoint[radians[i]];
          radians[i] -= 2 * Math.PI;
          radianWithPoint[radians[i]] = old;
          pointWithRadian[JSON.stringify(old)] = radians[i];
        }
      }
      radians.sort(function(a, b) {
        return a - b;
      });
      min = radians[0];
      max = radians[radians.length - 1];
    }
    var l = this._sightSettings.length * 1.5;
    var points = [];
    var x1 = radianWithPoint[max].x - radianWithPoint[min].x;
    var y1 = radianWithPoint[max].y - radianWithPoint[min].y;
    var x2 = x1 + l * Math.cos(max);
    var y2 = y1 + l * -Math.sin(max);
    var x3 = l * Math.cos(min);
    var y3 = l * -Math.sin(min);
    points.push(new Point(0, 0));
    points.push(new Point(x1, y1));
    points.push(new Point(x2, y2));
    points.push(new Point(x3, y3));
    return [points, radianWithPoint[min].x, radianWithPoint[min].y];
    /*
    // New Method that outlines object, casting the shadow
    // behind the object instead.
    // Not enabled for now because it's most likely more
    // performant and not needed.
    var minIndex = points.indexOf(radianWithPoint[min]);
    var firstHalf = points.splice(0, minIndex);
    points = points.concat(firstHalf);
    finalPoints = [];
    midPoints = [];
    points.reverse();
    var first = points.pop();
    points.unshift(first);
    var x, y, dx, dy, rad;
    var l = this._sightSettings.length;
    for (i = 0, j = points.length; i < j; i++) {
      x = points[i].x - radianWithPoint[min].x;
      y = points[i].y - radianWithPoint[min].y;
      finalPoints.push(new Point(x, y));
      if (points[i] === radianWithPoint[max]) {
        break;
      } else if (points[i] !== radianWithPoint[min]) {
        rad =  pointWithRadian[JSON.stringify(points[i])]
        dx = points[i].x - radianWithPoint[min].x;
        dy = points[i].y - radianWithPoint[min].y;
        x = dx + l * Math.cos(rad);
        y = dy + l * -Math.sin(rad);
        midPoints.push(new Point(x, y));
      }
    }
    var x1 = radianWithPoint[max].x - radianWithPoint[min].x;
    var y1 = radianWithPoint[max].y - radianWithPoint[min].y;
    var x2 = x1 + l * Math.cos(max);
    var y2 = y1 + l * -Math.sin(max);
    var x3 = l * Math.cos(min);
    var y3 = l * -Math.sin(min);
    finalPoints.push(new Point(x2, y2));
    finalPoints = finalPoints.concat(midPoints.reverse());
    finalPoints.push(new Point(x3, y3));
    return [finalPoints, radianWithPoint[min].x, radianWithPoint[min].y];
    */
  };

  Game_CharacterBase.prototype.needsSightUpdate = function() {
    if (!this._sightSettings.update) return false;
    if (!this._sightSettings.collider) {
      this.createSightShape(this._sightSettings.shape);
    }
    if (!this._sight) {
      this._sight = {};
      this._sight.tileShadows = {};
      this._sight.objs = {};
      return true;
    }
    if (this._sight.origin.x !== this._px || this._sight.origin.y !== this._py ||
        this._sight.origin.dir !== this._direction) {
      SceneManager._scene.removeTempCollider(this._sight.base);
      for (var obj in this._sight.tileShadows) {
        if (this._sight.tileShadows.hasOwnProperty(obj)) {
          this._sight.tileShadows[obj].reshape = true;
        }
      }
      for (var obj in this._sight.objs) {
        if (this._sight.objs.hasOwnProperty(obj)) {
          this._sight.objs[obj].reshape = true;
        }
      }
      return true;
    }
    if (this._sight.target.x !== this._sightSettings.target._px ||
        this._sight.target.y !== this._sightSettings.target._py) {
      return true;
    }
    var objMoved = false;
    for (var obj in this._sight.objs) {
      if (this._sight.objs.hasOwnProperty(obj)) {
        if (this._sight.objs[obj].cache.x !== this._sight.objs[obj].chara._px ||
            this._sight.objs[obj].cache.y !== this._sight.objs[obj].chara._py) {
          objMoved = true;
          this._sight.objs[obj].reshape = true;
        }
      }
    }
    return objMoved;
  };

  Game_CharacterBase.prototype.createSightShape = function(shape) {
    if (shape === "circle") {
      this._sightSettings.collider = new QuasiMovement.Circle_Collider(this._sightSettings.length * 2, this._sightSettings.length * 2);
    } else if (shape === "box") {
      this._sightSettings.collider = new QuasiMovement.Box_Collider(this._sightSettings.length, this._sightSettings.length);
    } else if (shape === "poly") {
      var w = this.collider().width;
      var h = this.collider().height;
      var lw = this._sightSettings.length - w / 2;
      var lh = this._sightSettings.length - h / 2;
      this._sightSettings.collider = [];
      for (var i = 1; i < 5; i++) {
        var dir = i * 2;
        var points = [];
        points.push(new Point(0, 0));
        var x1 = dir === 4 || dir === 6 ? 0 : w;
        var y1 = dir === 4 || dir === 6 ? h : 0;
        points.push(new Point(x1, y1));
        if (dir === 4 || dir === 6) {
          var x2 = lw;
          x2 *= dir === 4 ? -1 : 1;
          var y2 = h + lh * Math.sin(Math.PI / 4);
        } else {
          var y2 = lh;
          y2 *= dir === 8 ? -1 : 1;
          var x2 = w + lw * Math.cos(Math.PI / 4);
        }
        points.push(new Point(x2, y2));
        if (dir === 4 || dir === 6) {
          var x3 = lw;
          x3 *= dir === 4 ? -1 : 1;
          var y3 = lh * -Math.sin(Math.PI / 4);
        } else {
          var y3 = lh;
          y3 *= dir === 8 ? -1 : 1;
          var x3 = lw * -Math.cos(Math.PI / 4);
        }
        points.push(new Point(x3, y3));
        this._sightSettings.collider.push(new QuasiMovement.Polygon_Collider(points));
      }
    }
  };

  Game_CharacterBase.prototype.castShadow = function() {
    return false;
  };

  var Alias_Game_CharacterBase_reloadBoxes = Game_CharacterBase.prototype.reloadBoxes;
  Game_CharacterBase.prototype.reloadBoxes = function() {
    Alias_Game_CharacterBase_reloadBoxes.call(this);
    if (this._sight) var hadSight = true;
    this._sight = null;
    if (hadSight) this.setupSight();
  }

  //-----------------------------------------------------------------------------
  // Game_Event
  //
  // The game object class for an event. It contains functionality for event page
  // switching and running parallel process events.

  var Alias_Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
  Game_Event.prototype.setupPageSettings = function() {
    this._sight = null;
    Alias_Game_Event_setupPageSettings.call(this);
    if (/<retaindirection>/i.test(this.notes())) {
      if (!this._prevDirection) {
        this._prevDirection = this._direction;
      }
      this.setDirection(this._prevDirection);
    }
    this.setupSight();
  };

  Game_Event.prototype.setupSight = function() {
    var sight = /<sight=(.*)>/i.exec(this.comments());
    if (!sight) {
      sight = /<sight=(.*)>/i.exec(this.notes());
    }
    this._castShadow = /<shadowcast>/i.test(this.comments());
    this._hasSight = false;
    if (sight) {
      sight = QuasiMovement.stringToAry(sight[1]);
      this._sightSettings = {};
      this._sightSettings.length = sight[1];
      this._sightSettings.target = $gamePlayer;
      this._sightSettings.switch = [this._mapId, this._eventId, sight[2].toUpperCase()];
      this._sightSettings.shape  = sight[0].toLowerCase();
      sight[3] = sight[3] ? sight[3] : "true";
      this._sightSettings.update = sight[3] === "true";
      this._hasSight = true;
    }
  };

  Game_Event.prototype.castShadow = function() {
    return this._castShadow;
  };
})();
