//=============================================================================
// Yanfly Engine Plugins - Target Extension - Selection Control
// YEP_X_SelectionControl.js
//=============================================================================

var Imported = Imported || {};
Imported.YEP_X_SelectionControl = true;

var Yanfly = Yanfly || {};
Yanfly.Sel = Yanfly.Sel || {};

//=============================================================================
 /*:
 * @plugindesc v1.00 (Requires YEP_BattleEngineCore & YEP_TargetCore.js)
 * Control what targets can and can't be selected for actions.
 * @author Yanfly Engine Plugins
 *
 * @param ---Default---
 * @default
 *
 * @param Single Multiple
 * @desc Single target magical skills to be able to select all units
 * of a battler group. NO - false     YES - true
 * @default true
 *
 * @param Disperse Damage
 * @desc Automatically disperse damage if multiple targets are
 * selected instead of single targets? NO - false     YES - true
 * @default true
 *
 * @param Actor or Enemy
 * @desc Single target skills can target either actors or enemies
 * by default? NO - false     YES - true
 * @default true
 *
 * @param Physical Front Row
 * @desc For YEP_RowFormation, set physical single-target skills
 * to target only the front row? NO - false     YES - true
 * @default false
 *
 * @param ---Text Display---
 * @default
 *
 * @param All Enemies
 * @desc Selection text for all enemies.
 * @default All Enemies
 *
 * @param All Allies
 * @desc Selection text for all allies.
 * @default All Allies
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin requires YEP_BattleEngineCore and YEP_TargetCore. Make sure this
 * plugin is located under both of those plugins in the plugin list.
 *
 * When selecting targets, RPG Maker MV has it set by default that the list of
 * valid targets is always either alive enemies, alive allies, or only dead
 * allies. Actions would not be able to target either actors or enemies or
 * change from single target to multiple targets. This extension plugin for the
 * Target Core will allow you to break free of that restriction for better
 * selection control of targets as well as insert customized conditions.
 *
 * ============================================================================
 * Notetags - General
 * ============================================================================
 *
 * To make skills and items select only certain types of battlers, you can use
 * the following notetag setup to do so:
 *
 * Skill and Item Notetags:
 *
 *   <Single or Multiple Select>
 *   This will allow the skill or item to be able to select either single
 *   targets or all targets at once. This will automatically make a skill
 *   default to single target selecting. You MUST change your scope in the
 *   database to work with this effect.
 *   *Note: Having this option will cancel out AoE Circles and AoE Rectangles
 *   to avoid conflicting issues.
 *   *Note: If there is an enemy with taunt, the option to switch between a
 *   group target and a single target will not be available.
 *   *Note: Enemy AI will NOT make use of the ability to toggle between single
 *   target and multi-target scopes.
 *
 *   <Disperse Damage>
 *   Used in conjunction with the above notetag, this will cause damage to be
 *   split evenly amongst the number of targets the skill is dispersed into.
 *   The damage dispersion effect will only occur if multiple targets are being
 *   selected after toggling.
 *
 *   <Enemy or Actor Select>
 *   <Actor or Enemy Select>
 *   This will allow the player to toggle between selecting an enemy or actor
 *   for the action's target scope. When using <Enemy or Actor Select>, it will
 *   first target enemies by default. Using <Actor or Enemy Select> will target
 *   actors by default. Using either notetag will change the action's target
 *   scope to single target.
 *   *Note: Enemy AI will NOT make use of the ability to toggle between actors
 *   or enemies for skill selection.
 *
 * *Note: If you use any <Select Condition> effects, all selection options
 * provided by default with the plugin parameters will be reset under the
 * assumption that it will no longer be an action of default nature. If this is
 * the case, you will need to use the above notetags to specify how you wish to
 * make your skill's selection methods.
 *
 * Actor, Class, Enemy, Weapon, Armor, State Notetags:
 *
 *   <Cannot Select: All>
 *   All actions cannot select this battler unless it's an action whose scope
 *
 *   <Cannot Select: Physical Hit>
 *   <Cannot Select: Magical Hit>
 *   <Cannot Select: Certain Hit>
 *   This will prevent physical, magical, or certain hit actions from being
 *   able to select the battler. They will be excluded out of multi-hit skills,
 *   as well unless it's an action whose scope targets the user itself.
 *   targets the user itself.
 *
 *   <Cannot Select: Skills>
 *   <Cannot Select: Items>
 *   This will prevent skills/items from being able to target the battler
 *   unless it's an action whose scope targets the user itself.
 *
 *   <Cannot Select: Item x>
 *   <Cannot Select: Item name>
 *   This will prevent item 'x' (or the named item) from being able to target
 *   the battler unless the item's scope targets the user itself. If you have
 *   multiple items in your database with the same name, priority will be given
 *   to the item with the highest ID.
 *
 *   <Cannot Select: Skill x>
 *   <Cannot Select: Skill name>
 *   This will prevent skill 'x' (or the named skill) from being able to target
 *   the battler unless the skill's scope targets the user itself. If you have
 *   multiple skills in your database with the same name, priority will be
 *   given to the skill with the highest ID.
 *
 *   <Cannot Select: SType x>
 *   <Cannot Select: SType name>
 *   This will prevent skills of skill type 'x' (or named) from being able to
 *   target the battler unless the skill's scope targets the user itself. If
 *   you have multiple skill types in your database with the same name, then
 *   priority will be given to the skill type with the highest ID.
 *
 *   <Cannot Select: Element x>
 *   <Cannot Select: Element name>
 *   This will prevent actions with an elemental ID of 'x' (or named) from
 *   being able to target the battler unless the action's scope targets the
 *   user itself. If you have multiple elements in your database with the same
 *   name, then priority will be given to the element with the highest ID.
 *
 * ============================================================================
 * Notetags - Select Conditions
 * ============================================================================
 *
 * To impose specific conditions on which targets are valid targets, use the
 * following notetag setup:
 *
 * ---
 *
 * Skill and Item Notetags:
 *
 *   <Select Conditions>
 *    condition
 *    condition
 *   </Select Conditions>
 *   Replace 'condition' with the desired condition setup. Insert multiple
 *   conditions to make an action require more conditions for viable targets.
 *   Using this will overwrite the default settings imposed by the plugin
 *   parameters so if you wish to use those settings, you'll have to use the
 *   associated condition with it.
 *
 * ---
 *
 * Conditions:
 *
 * ---
 *
 * Any Row
 * - Requires YEP_RowFormation.js. The battler can be targeted from any row it
 * is in as a valid target. This will conflict with the other 'Row Only' select
 * conditions.
 *
 * ---
 *
 * Back Row Only
 * - Requires YEP_RowFormation.js. This will make only the back row battlers
 * be selectable for target. The back row will refer to whatever row is in the
 * back that has living members. If row 3's enemies are all dead, but row 2
 * has living members, then row 2 will be considered the back row. This will
 * conflict with the other 'Row Only' select conditions.
 *
 * ---
 *
 * Front Row Only
 * - Requires YEP_RowFormation.js. This will make only the front row battlers
 * be selectable for target. The front row will refer to whatever row is in
 * front that has living members. If row 1's enemies are all dead, but row 2
 * has living members, then row 2 will be considered the front row. This will
 * conflict with the other 'Row Only' select conditions.
 *
 * ---
 *
 * Row x Only
 * - Requires YEP_RowFormation.js. This will make only battlers in row x be
 * selectable for target. Any battlers not in row x will be excluded from
 * target selection. This will conflict with the other 'Row Only' select
 * conditions.
 *
 * ---
 *
 * Row x Max
 * - Requires YEP_RowFormation.js. This will make all battlers who are located
 * in a lower number row up to row x be selectable for target. Any battlers in
 * a row number larger than x will be excluded from target selection.
 *
 * ---
 *
 * Row x Min
 * - Requires YEP_RowFormation.js. This will make all battlers who are located
 * in a row from row x onward selectable for target. Any battlers in a row
 * number smaller than x will be excluded from target selection.
 *
 * ---
 *
 * Param stat eval
 * ie: Param MaxHP >= 500
 * ie: Param HP% <= 0.30
 * ie: Param Level === 25
 * - This makes the selection have a check on the target's parameter values
 * before deciding if the target is a valid target for selection. You can 
 * replace 'stat' with 'MaxHP', 'MaxMP', 'MaxTP', 'HP', 'MP', 'TP', 'HP%',
 * 'MP%', 'TP%', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI', 'LUK', or 'LEVEL'. This
 * run an eval check against that parameter owned by the target.
 *
 * ---
 *
 * State: x
 * State: name
 * - The target must have state 'x' in order to be selected as a valid target.
 * If you're using the named version of the condition and you have multiple
 * states with the same name in your database, priority will be given to the
 * state with the highest ID. If the target doesn't have state 'x', then the
 * target is not a valid target for selection.
 *
 * ---
 *
 * Not State: x
 * Not State: name
 * - The target must not have state 'x' in order to be selected as a valid
 * target. If you're using the named version of the condition and you have
 * multiple states with the same name in your database, priority will be given
 * to the state with the highest ID. If the target does have state 'x', then
 * the target is not a valid target for selection.
 *
 * ---
 *
 * Not User
 * - This will remove the user from the possible selection pool making the user
 * unable to be selected as a valid target.
 *
 * ============================================================================
 * Lunatic Mode - Custom Select Condition
 * ============================================================================
 *
 * For those with JavaScript experience, you can use the following notetags to
 * make custom selection conditions for skills and items.
 *
 * Skill and Item Notetags:
 *
 *   <Custom Select Condition>
 *    if (target.name() === 'Harold') {
 *      condition = true;
 *    } else {
 *      condition = false;
 *    }
 *   </Custom Select Condition>
 *   The 'condition' variable determines if the condition will pass or not. If
 *   the variable returns 'true', the condition will pass. If the variable is
 *   'false', the condition will fail and the target will not be a valid target
 *   for the action. Even if the <Custom Select Condition> notetag passes, all
 *   other selection conditions must pass, too.
 */
//=============================================================================

if (Imported.YEP_BattleEngineCore && Imported.YEP_TargetCore) {

//=============================================================================
// Parameter Variables
//=============================================================================

Yanfly.Parameters = PluginManager.parameters('YEP_X_SelectionControl');
Yanfly.Param = Yanfly.Param || {};

Yanfly.Param.SelectSoleMulti = String(Yanfly.Parameters['Single Multiple']);
Yanfly.Param.SelectSoleMulti = eval(Yanfly.Param.SelectSoleMulti);
Yanfly.Param.SelectDisperse = String(Yanfly.Parameters['Disperse Damage']);
Yanfly.Param.SelectDisperse = eval(Yanfly.Param.SelectDisperse);
Yanfly.Param.SelectActorEnemy = String(Yanfly.Parameters['Actor or Enemy']);
Yanfly.Param.SelectActorEnemy = eval(Yanfly.Param.SelectActorEnemy);
Yanfly.Param.SelectMelee = String(Yanfly.Parameters['Physical Front Row']);
Yanfly.Param.SelectMelee = eval(Yanfly.Param.SelectMelee);

Yanfly.Param.SelectAllFoes = String(Yanfly.Parameters['All Enemies']);
Yanfly.Param.SelectAllAllies = String(Yanfly.Parameters['All Allies']);

Yanfly.Param.BECEnemySelect = true;
Yanfly.Param.BECActorSelect = true;

//=============================================================================
// DataManager
//=============================================================================

Yanfly.Sel.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
  if (!Yanfly.Sel.DataManager_isDatabaseLoaded.call(this)) return false;

  if (!Yanfly._loaded_YEP_X_SelectionControl) {
    this.processSelectNotetagsI($dataItems);
    this.processSelectNotetagsS($dataSkills);
    this.processSelectNotetagsT($dataStates);
    this.processSelectNotetagsSys($dataSystem);
    this.processSelectNotetags1($dataSkills, true);
    this.processSelectNotetags1($dataItems, false);
    this.processSelectNotetags2($dataActors);
    this.processSelectNotetags2($dataClasses);
    this.processSelectNotetags2($dataEnemies);
    this.processSelectNotetags2($dataWeapons);
    this.processSelectNotetags2($dataArmors);
    this.processSelectNotetags2($dataStates);
    Yanfly._loaded_YEP_X_SelectionControl = true;
  }
  
  return true;
};

DataManager.processSelectNotetagsI = function(group) {
  if (Yanfly.ItemIdRef) return;
  Yanfly.ItemIdRef = {};
  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    if (obj.name.length <= 0) continue;
    Yanfly.ItemIdRef[obj.name.toUpperCase()] = n;
  }
};

DataManager.processSelectNotetagsS = function(group) {
  if (Yanfly.SkillIdRef) return;
  Yanfly.SkillIdRef = {};
  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    if (obj.name.length <= 0) continue;
    Yanfly.SkillIdRef[obj.name.toUpperCase()] = n;
  }
};

DataManager.processSelectNotetagsT = function(group) {
  if (Yanfly.StateIdRef) return;
  Yanfly.StateIdRef = {};
  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    if (obj.name.length <= 0) continue;
    Yanfly.StateIdRef[obj.name.toUpperCase()] = n;
  }
};

DataManager.processSelectNotetagsSys = function(group) {
  Yanfly.STypeIdRef = {};
  for (var i = 1; i < group.skillTypes.length; ++i) {
    var name = group.skillTypes[i].toUpperCase();
    name = name.replace(/\\I\[(\d+)\]/gi, '');
    Yanfly.STypeIdRef[name] = i;
  }
  Yanfly.ElementIdRef = {};
  for (var i = 1; i < group.elements.length; ++i) {
    var name = group.elements[i].toUpperCase();
    name = name.replace(/\\I\[(\d+)\]/gi, '');
    Yanfly.ElementIdRef[name] = i;
  }
};

DataManager.processSelectNotetags1 = function(group, isSkill) {
  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    var notedata = obj.note.split(/[\r\n]+/);

    obj.selectConditions = [];
    var changed = false;
    var evalMode = 'none';
    obj.selectConditionEval = '';

    for (var i = 0; i < notedata.length; i++) {
      var line = notedata[i];
      if (line.match(/<(?:SELECT CONDITION|SELECT CONDITIONS)>/i)) {
        evalMode = 'select conditions';
        obj.selectConditions = [];
        changed = true;
      } else if (line.match(/<\/(?:SELECT CONDITION|SELECT CONDITIONS)>/i)) {
        evalMode = 'none';
      } else if (evalMode === 'select conditions') {
        obj.selectConditions.push(line.trim());
      } else if (line.match(/<CUSTOM SELECT CONDITION>/i)) {
        evalMode = 'custom select condition';
      } else if (line.match(/<\/CUSTOM SELECT CONDITION>/i)) {
        evalMode = 'none';
      } else if (evalMode === 'custom select condition') {
        obj.selectConditionEval += line + '\n';
      }
    }

    for (var i = 0; i < notedata.length; i++) {
      var line = notedata[i];
      if (line.match(/<SINGLE OR MULTIPLE SELECT>/i)) {
        obj.selectConditions.push('SINGLE OR MULTIPLE SELECT');
        changed = true;
      } else if (line.match(/<DISPERSE DAMAGE>/i)) {
        obj.selectConditions.push('DISPERSE DAMAGE SELECT');
        changed = true;
      } else if (line.match(/<ENEMY OR ACTOR SELECT>/i)) {
        obj.selectConditions.push('ENEMY OR ACTOR SELECT');
        obj.scope = 1;
        changed = true;
      } else if (line.match(/<ACTOR OR ENEMY SELECT>/i)) {
        obj.selectConditions.push('ACTOR OR ENEMY SELECT');
        obj.scope = 7;
        changed = true;
      }
    }

    if (!changed) {
      if (isSkill && obj.hitType === Game_Action.HITTYPE_MAGICAL) {
        if (Yanfly.Param.SelectSoleMulti && [1, 7].contains(obj.scope)) {
          obj.selectConditions.push('SINGLE OR MULTIPLE SELECT');
        }
      } else if (isSkill && obj.hitType === Game_Action.HITTYPE_PHYSICAL) {
        if (Yanfly.Param.SelectMelee && [1].contains(obj.scope)) {
          obj.selectConditions.push('FRONT ROW ONLY');
        }
      }
      if (Yanfly.Param.SelectActorEnemy) {
        if (obj.scope === 1) obj.selectConditions.push('ENEMY OR ACTOR SELECT');
        if (obj.scope === 7) obj.selectConditions.push('ACTOR OR ENEMY SELECT');
      }
      if (Yanfly.Param.SelectDisperse) {
        obj.selectConditions.push('DISPERSE DAMAGE SELECT');
      }
    }

    this.removeAoeEffects(obj);
  }
};

DataManager.removeAoeEffects = function(obj) {
  if (obj.selectConditions.contains('SINGLE OR MULTIPLE SELECT')) {
    obj.aoeCircleRadius = 0;
    obj.aoeRectColumn = 0;
    obj.aoeRectRow = 0;
    obj.aoeRectAll = false;
  }
};

DataManager.processSelectNotetags2 = function(group, isSkill) {
  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    var notedata = obj.note.split(/[\r\n]+/);

    obj.cannotSelect = [];

    for (var i = 0; i < notedata.length; i++) {
      var line = notedata[i];
      if (line.match(/<CANNOT SELECT:[ ](.*)>/i)) {
        var text = String(RegExp.$1).trim();
        obj.cannotSelect.push(text);
      }
    }
  }
};

//=============================================================================
// BattleManager
//=============================================================================

Yanfly.Sel.BattleManager_makeActionTargets = BattleManager.makeActionTargets;
BattleManager.makeActionTargets = function(string) {
    this._action.bypassForceSelectedUnit(true);
    var targets = Yanfly.Sel.BattleManager_makeActionTargets.call(this, string);
    this._action.bypassForceSelectedUnit(false);
    return targets;
};

//=============================================================================
// Game_BattlerBase
//=============================================================================

Yanfly.Sel.Game_BattlerBase_canUse = Game_BattlerBase.prototype.canUse;
Game_BattlerBase.prototype.canUse = function(item) {
    var value = Yanfly.Sel.Game_BattlerBase_canUse.call(this, item);
    if (!value) return false;
    if (!$gameParty.inBattle()) return true;
    return this.hasValidTargets(item);
};

Game_BattlerBase.prototype.hasValidTargets = function(item) {
    var action = new Game_Action(this);
    action.setItemObject(item);
    var targets = []
    if (action.isSpanBothParties()) {
      targets = targets.concat(this.friendsUnit().aliveMembers());
      targets = targets.concat(this.opponentsUnit().aliveMembers());
    } else if (action.isForOpponent()) {
      targets = targets.concat(this.opponentsUnit().aliveMembers());
    } else if (action.isForFriend()) {
      targets = targets.concat(this.friendsUnit().members());
    } else {
      return true;
    }
    var length = targets.length;
    for (var i = 0; i < length; ++i) {
      var target = targets[i];
      if (!target) continue;
      if (action.checkAllSelectionConditions(this, target)) {
        return true;
      }
    }
    return false;
};

//=============================================================================
// Game_Battler
//=============================================================================

Yanfly.Sel.Game_Battler_isSelected = Game_Battler.prototype.isSelected;
Game_Battler.prototype.isSelected = function() {
    if ($gameParty.inBattle()) {
      var action = BattleManager.inputtingAction();
      if (action && action.item()) {
        if (!this.isSelectable(action)) return false;
      };
    }
    return Yanfly.Sel.Game_Battler_isSelected.call(this);
};

Game_Battler.prototype.isSelectable = function(action) {
    if (!action) return true;
    var length = this.states().length;
    for (var i = 0; i < length; ++i) {
      var obj = this.states()[i];
      if (!obj) continue;
      if (!this.isSelectableObj(obj, action)) return false;
    }
    return true;
};

Game_Battler.prototype.isSelectableObj = function(obj, action) {
    var array = obj.cannotSelect;
    var length = array.length;
    for (var i = 0; i < length; ++i) {
      var line = array[i];
      if (!this.checkActionSelectable(line, action)) return false;
    }
    return true;
};

Game_Battler.prototype.checkActionSelectable = function(line, action) {
    if (action.isForUser()) return true;
    // ALL
    if (line.toUpperCase() === 'ALL') return false;
    // PHYSICAL HIT
    if (line.toUpperCase() === 'PHYSICAL HIT') return !action.isPhysical();
    // MAGICAL HIT
    if (line.toUpperCase() === 'MAGICAL HIT') return !action.isMagical();
    // CERTAIN HIT
    if (line.toUpperCase() === 'CERTAIN HIT') return !action.isCertainHit();
    // SKILLS
    if (line.toUpperCase() === 'SKILLS') return !action.isSkill();
    // ITEMS
    if (line.toUpperCase() === 'ITEMS') return !action.isItem();
    // NOT USER
    if (line.toUpperCase() === 'NOT USER') return action.subject() !== this;
    // ITEM X
    if (line.match(/ITEM[ ](.*)/i)) {
      if (action.isItem()) {
        var text = String(RegExp.$1).toUpperCase().trim();
        if (text.match(/(\d+)/i)) {
          var id = parseInt(RegExp.$1);
          return action.item().id !== id;
        } else if (Yanfly.ItemIdRef[text]) {
          var id = Yanfly.ItemIdRef[text];
          return action.item().id !== id;
        } else {
          return true;
        }
      }
    }
    // SKILL X
    if (line.match(/SKILL[ ](.*)/i)) {
      if (action.isSkill()) {
        var text = String(RegExp.$1).toUpperCase().trim();
        if (text.match(/(\d+)/i)) {
          var id = parseInt(RegExp.$1);
          return action.item().id !== id;
        } else if (Yanfly.SkillIdRef[text]) {
          var id = Yanfly.SkillIdRef[text];
          return action.item().id !== id;
        } else {
          return true;
        }
      }
    }
    // STYPE X
    if (line.match(/STYPE[ ](.*)/i)) {
      if (action.isSkill()) {
        var text = String(RegExp.$1).toUpperCase().trim();
        if (text.match(/(\d+)/i)) {
          var id = parseInt(RegExp.$1);
          return action.item().stypeId !== id;
        } else if (Yanfly.STypeIdRef[text]) {
          var id = Yanfly.STypeIdRef[text];
          return action.item().stypeId !== id;
        } else {
          return true;
        }
      }
    }
    // ELEMENT X
    if (line.match(/ELEMENT[ ](.*)/i)) {
      var text = String(RegExp.$1).toUpperCase().trim();
      if (text.match(/(\d+)/i)) {
        var id = parseInt(RegExp.$1);
        return action.item().damage.elementId !== id;
      } else if (Yanfly.STypeIdRef[text]) {
        var id = Yanfly.STypeIdRef[text];
        return action.item().damage.elementId !== id;
      } else {
        return true;
      }
    }
    // ALL CLEARED
    return true;
};

//=============================================================================
// Game_Actors
//=============================================================================

Game_Actors.prototype.isSelectable = function(action) {
    if (!Game_Battler.prototype.isSelectable.call(this, action)) return false;
    var length = this.equips().length;
    for (var i = 0; i < length; ++i) {
      var obj = this.equips()[i];
      if (!obj) continue;
      if (!this.isSelectableObj(obj, action)) return false;
    }
    if (!this.isSelectableObj(this.actor(), action)) return false;
    if (!this.isSelectableObj(this.currentClass(), action)) return false;
    return true;
};

//=============================================================================
// Game_Unit
//=============================================================================

Yanfly.Sel.Game_Unit_aliveMembers = Game_Unit.prototype.aliveMembers;
Game_Unit.prototype.aliveMembers = function() {
  var members = Yanfly.Sel.Game_Unit_aliveMembers.call(this);
  if ($gameTemp._selectionFilterInProgress) return members;
  if ($gameTemp._selectionFilter) return this.filterSelection(members);
  return members;
};

Yanfly.Sel.Game_Unit_deadMembers = Game_Unit.prototype.deadMembers;
Game_Unit.prototype.deadMembers = function() {
  var members = Yanfly.Sel.Game_Unit_deadMembers.call(this);
  if ($gameTemp._selectionFilterInProgress) return members;
  if ($gameTemp._selectionFilter) return this.filterSelection(members);
  return members;
};

Game_Unit.prototype.filterSelection = function(members) {
  $gameTemp._selectionFilterInProgress = true;
  var user = $gameTemp._selectionSubject;
  var action = $gameTemp._selectionAction;
  var length = members.length;
  var targets = [];
  for (var i = 0; i < length; ++i) {
    var target = members[i];
    if (!target) continue;
    if (action.checkAllSelectionConditions(user, target)) {
      targets.push(target);
    }
  }
  $gameTemp._selectionFilterInProgress = false;
  targets = this.filterTauntMembers(user, action, targets);
  return targets;
};

Game_Unit.prototype.filterTauntMembers = function(user, action, targets) {
  if (!Imported.YEP_Taunt) return targets;
  if (user.opponentsUnit() !== this) return targets;
  $gameTemp._tauntAction = action;
  var tauntMembers = [];
  if (action.isPhysical() && this.physicalTauntMembers().length > 0) {
    tauntMembers = this.physicalTauntMembers();
  } else if (action.isMagical() && this.magicalTauntMembers().length > 0) {
    tauntMembers = this.magicalTauntMembers();
  } else if (action.isCertainHit() && this.certainTauntMembers().length > 0) {
    tauntMembers = this.certainTauntMembers();
  }
  var common = Yanfly.Util.getCommonElements(targets, tauntMembers);
  if (common.length > 0) targets = common;
  return targets;
};

//=============================================================================
// Game_Action
//=============================================================================

Yanfly.Sel.Game_Action_clear = Game_Action.prototype.clear;
Game_Action.prototype.clear = function() {
    Yanfly.Sel.Game_Action_clear.call(this);
    this._selectedTargetType = '';
    this._selectedDmgMod = 1;
    this._forcedSelectedUnit = false;
    this._bypassForceSelectedUnit = false;
};

Yanfly.Sel.Game_Action_mDV = Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue = function(target, critical) {
    var value = Yanfly.Sel.Game_Action_mDV.call(this, target, critical);
    value *= this._selectedDmgMod;
    return Math.round(value);
};

Game_Action.prototype.selectConditions = function() {
    if (!this.item()) return [];
    return this.item().selectConditions;
};

Game_Action.prototype.matchSelectConditions = function(line) {
    var conditions = this.selectConditions().slice();
    var length = conditions.length;
    for (var i = 0; i < length; ++i) {
      var condition = conditions[i];
      if (condition.match(line)) return true;
    }
    return false;
};

Game_Action.prototype.isSingleOrMultiple = function() {
    return this.matchSelectConditions(/SINGLE OR MULTIPLE SELECT/i);
};

Game_Action.prototype.isDisperseDamage = function() {
    return this.matchSelectConditions(/DISPERSE DAMAGE SELECT/i);
};

Game_Action.prototype.isForEnemyOrActor = function() {
    return this.matchSelectConditions(/ENEMY OR ACTOR SELECT/i);
};

Game_Action.prototype.isForActorOrEnemy = function() {
    return this.matchSelectConditions(/ACTOR OR ENEMY SELECT/i);
};

Game_Action.prototype.isSpanBothParties = function() {
    if (this.isForEnemyOrActor()) return true;
    if (this.isForActorOrEnemy()) return true;
    return false;
};

Yanfly.Sel.Game_Action_needsSelection = Game_Action.prototype.needsSelection;
Game_Action.prototype.needsSelection = function() {
    if (this.isSingleOrMultiple()) return true;
    return Yanfly.Sel.Game_Action_needsSelection.call(this);
};

Yanfly.Sel.Game_Action_setTarget = Game_Action.prototype.setTarget;
Game_Action.prototype.setTarget = function(targetIndex) {
    if (typeof targetIndex === 'string') {
      if (targetIndex.match(/ACTOR[ ](\d+)[ ]SELECT/i)) {
        targetIndex = parseInt(RegExp.$1);
        this.chooseSelectionUnit('party');
      } else if (targetIndex.match(/ENEMY[ ](\d+)[ ]SELECT/i)) {
        targetIndex = parseInt(RegExp.$1);
        this.chooseSelectionUnit('troop');
      } else {
        this._selectedTargetType = targetIndex;
        targetIndex = -1;
      }
    }
    Yanfly.Sel.Game_Action_setTarget.call(this, targetIndex);
};

Game_Action.prototype.chooseSelectionUnit = function(unit) {
    if (this.isForEverybody()) return;
    this._forcedSelectedUnit = unit;
};

Game_Action.prototype.isForceSelectedUnit = function() {
    if (this._bypassForceSelectedUnit) return false;
    return this._forcedSelectedUnit;
};

Game_Action.prototype.bypassForceSelectedUnit = function(value) {
    this._bypassForceSelectedUnit = value;
};

Yanfly.Sel.Game_Action_friendsUnit = Game_Action.prototype.friendsUnit;
Game_Action.prototype.friendsUnit = function() {
    if (this.isForceSelectedUnit()) return this.forcedSelectedUnit();
    return Yanfly.Sel.Game_Action_friendsUnit.call(this);
};

Yanfly.Sel.Game_Action_opponentsUnit = Game_Action.prototype.opponentsUnit;
Game_Action.prototype.opponentsUnit = function() {
    if (this.isForceSelectedUnit()) return this.forcedSelectedUnit();
    return Yanfly.Sel.Game_Action_opponentsUnit.call(this);
};

Game_Action.prototype.forcedSelectedUnit = function() {
    if (this._forcedSelectedUnit === 'party') {
      return $gameParty;
    } else if (this._forcedSelectedUnit === 'troop') {
      return $gameTroop;
    } else {
      return false;
    }
};

Game_Action.prototype.setSelectionFilter = function(enabled) {
    $gameTemp._taunt = false;
    $gameTemp._selectionFilter = enabled ? true : undefined;
    $gameTemp._selectionSubject = enabled ? this.subject() : undefined;
    $gameTemp._selectionAction = enabled ? this : undefined;
};

Yanfly.Sel.Game_Action_makeTargets = Game_Action.prototype.makeTargets;
Game_Action.prototype.makeTargets = function() {
    if ($gameParty.inBattle()) this.setSelectionFilter(true);
    var targets = this.makeTargetChoices();
    if ($gameParty.inBattle()) {
      this.setSelectionFilter(false);
      var group = this.filterSelection(this.subject(), targets);
      if (group.length <= 0 && this._targetIndex >= 0) {
        group = this.fallbackFilter();
      }
      return group;
    } else {
      return targets;
    }
};

Game_Action.prototype.fallbackFilter = function() {
    this._targetIndex = -1;
    return this.makeTargets();
};

Game_Action.prototype.makeTargetChoices = function() {
    if (this._selectedTargetType === 'ALL ENEMIES') {
      var targets = this.opponentsUnit().aliveMembers();
      var mod = Math.max(1, targets.length);
      if (this.isDisperseDamage()) this._selectedDmgMod = 1 / mod;
    } else if (this._selectedTargetType === 'ALL ALLIES') {
      var targets = this.friendsUnit().aliveMembers();
      var mod = Math.max(1, targets.length);
      if (this.isDisperseDamage()) this._selectedDmgMod = 1 / mod;
    } else {
      var targets = Yanfly.Sel.Game_Action_makeTargets.call(this);
    }
    return targets;
};

Game_Action.prototype.filterSelection = function(user, group) {
    if (!$gameParty.inBattle()) return group;
    var targets = [];
    var length = group.length;
    for (var i = 0; i < length; ++i) {
      var target = group[i];
      if (!target) continue;
      if (this.checkAllSelectionConditions(user, target)) targets.push(target);
    }
    return targets;
}

Game_Action.prototype.checkAllSelectionConditions = function(user, target) {
    if (!target.isSelectable(this)) return false;
    var conditions = this.item().selectConditions;
    var length = conditions.length;
    for (var i = 0; i < length; ++i) {
      var line = conditions[i];
      if (!line) continue;
      if (!this.meetSelectionCondition(line, user, target)) return false;
    }
    if (!this.meetSelectionConditionEval(user, target)) return false;
    return true;
};

Game_Action.prototype.meetSelectionCondition = function(line, user, target) {
    // Back Row Only - Requires YEP_RowFormation.js
    if (line.match(/Back ROW ONLY/i)) {
      return this.selectConditionBackRow(target);
    }
    // Front Row Only - Requires YEP_RowFormation.js
    if (line.match(/FRONT ROW ONLY/i)) {
      return this.selectConditionFrontRow(target);
    }
    // Row x Only - Requires YEP_RowFormation.js
    if (line.match(/ROW[ ](\d+)[ ]ONLY/i)) {
      var id = parseInt(RegExp.$1);
      return this.selectConditionSpecificRow(target, id);
    }
    // Row x Max - Requires YEP_RowFormation.js
    if (line.match(/ROW[ ](\d+)[ ]MAX/i)) {
      var id = parseInt(RegExp.$1);
      return this.selectConditionRowMax(target, id);
    }
    // Row x Min - Requires YEP_RowFormation.js
    if (line.match(/ROW[ ](\d+)[ ]MIN/i)) {
      var id = parseInt(RegExp.$1);
      return this.selectConditionRowMin(target, id);
    }
    // Parameter Eval
    if (line.match(/PARAM[ ](.*?)[ ](.*)/i)) {
      var param = String(RegExp.$1).toUpperCase().trim();
      var code = String(RegExp.$2).trim();
      return this.selectConditionParam(user, target, param, code);
    }
    // Not State
    if (line.match(/NOT STATE:[ ](.*)/i)) {
      var text = String(RegExp.$1).toUpperCase().trim();
      return this.selectConditionNotState(target, text);
    }
    // State
    if (line.match(/STATE:[ ](.*)/i)) {
      var text = String(RegExp.$1).toUpperCase().trim();
      return this.selectConditionState(target, text);
    }
    return true;
};

Game_Action.prototype.meetSelectionConditionEval = function(user, target) {
    if (this.item().selectConditionEval === '') return true;
    var condition = true;
    var item = this.item();
    var skill = this.skill();
    var a = user;
    var subject = user;
    var b = target;
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    eval(this.item().selectConditionEval);
    return condition;
};

Game_Action.prototype.selectConditionBackRow = function(target) {
    if (!Imported.YEP_RowFormation) return true;
    if (target.isActor() === this.subject().isActor()) return true;
    var unit = target.friendsUnit();
    for (var i = Yanfly.Param.RowMaximum; i > 0; --i) {
      if (unit.rowAliveSize(i) <= 0) continue;
      return unit.rowMembers(i).contains(target);
    }
    return true;
};

Game_Action.prototype.selectConditionFrontRow = function(target) {
    if (!Imported.YEP_RowFormation) return true;
    if (target.isActor() === this.subject().isActor()) return true;
    var length = Yanfly.Param.RowMaximum + 1;
    var unit = target.friendsUnit();
    for (var i = 1; i < length; ++i) {
      if (unit.rowAliveSize(i) <= 0) continue;
      return unit.rowMembers(i).contains(target);
    }
    return true;
};

Game_Action.prototype.selectConditionSpecificRow = function(target, rowId) {
    if (!Imported.YEP_RowFormation) return true;
    if (target.isActor() === this.subject().isActor()) return true;
    return target.row() === rowId;
};

Game_Action.prototype.selectConditionRowMax = function(target, rowId) {
    if (!Imported.YEP_RowFormation) return true;
    if (target.isActor() === this.subject().isActor()) return true;
    return target.row() <= rowId;
};

Game_Action.prototype.selectConditionRowMin = function(target, rowId) {
    if (!Imported.YEP_RowFormation) return true;
    if (target.isActor() === this.subject().isActor()) return true;
    return target.row() >= rowId;
};

Game_Action.prototype.selectConditionParam = function(user, target, param, code) {
    if (['MAXHP', 'MHP'].contains(param)) {
      code = 'target.mhp ' + code;
    } else if (['MAXMP', 'MMP'].contains(param)) {
      code = 'target.mmp ' + code;
    } else if (['MAXTP', 'MTP'].contains(param)) {
      code = 'target.maxTp() ' + code;
    } else if (['HP'].contains(param)) {
      code = 'target.hp ' + code;
    } else if (['MP'].contains(param)) {
      code = 'target.mp ' + code;
    } else if (['TP'].contains(param)) {
      code = 'target.tp ' + code;
    } else if (['ATK', 'STR'].contains(param)) {
      code = 'target.atk ' + code;
    } else if (['DEF'].contains(param)) {
      code = 'target.def ' + code;
    } else if (['MAT', 'INT', 'SPI'].contains(param)) {
      code = 'target.mat ' + code;
    } else if (['MDF', 'RES'].contains(param)) {
      code = 'target.mdf ' + code;
    } else if (['AGI'].contains(param)) {
      code = 'target.agi ' + code;
    } else if (['LUK'].contains(param)) {
      code = 'target.luk ' + code;
    } else if (['LEVEL'].contains(param)) {
      code = 'target.level ' + code;
    } else if (['HP%'].contains(param)) {
      code = 'target.hpRate() ' + code;
    } else if (['MP%'].contains(param)) {
      code = 'target.mpRate() ' + code;
    } else if (['TP%'].contains(param)) {
      code = 'target.tpRate() ' + code;
    } else {
      return;
    }
    var item = this.item();
    var skill = this.item();
    var a = user;
    var subject = user;
    var b = target;
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    return eval(code);
};

Game_Action.prototype.selectConditionNotState = function(target, text) {
    if (text.match(/(\d+)/i)) {
      var id = parseInt(RegExp.$1);
    } else if (Yanfly.StateIdRef[text]) {
      var id = Yanfly.StateIdRef[text];
    } else {
      return false;
    }
    var state = $dataStates[id];
    if (!state) return false;
    return !target.states().contains(state);
};

Game_Action.prototype.selectConditionState = function(target, text) {
    if (text.match(/(\d+)/i)) {
      var id = parseInt(RegExp.$1);
    } else if (Yanfly.StateIdRef[text]) {
      var id = Yanfly.StateIdRef[text];
    } else {
      return false;
    }
    var state = $dataStates[id];
    if (!state) return false;
    return target.states().contains(state);
};

//=============================================================================
// Window_Help
//=============================================================================

Yanfly.Sel.Window_Help_setBattler = Window_Help.prototype.setBattler;
Window_Help.prototype.setBattler = function(battler) {
    if (typeof battler === 'string') return this.drawSelectionControl(battler);
    Yanfly.Sel.Window_Help_setBattler.call(this, battler);
};

Window_Help.prototype.drawSelectionControl = function(battler) {
    this.contents.clear();
    this.clear();
    var wx = 0;
    var wy = (this.contents.height - this.lineHeight()) / 2;
    var text = '';
    if (battler === 'ALL ENEMIES') text = Yanfly.Param.SelectAllFoes;
    if (battler === 'ALL ALLIES') text = Yanfly.Param.SelectAllAllies;
    this.drawText(text, wx, wy, this.contents.width, 'center');
};

//=============================================================================
// Window_BattleEnemy
//=============================================================================

Window_BattleEnemy.prototype.action = function() {
    return BattleManager.inputtingAction();
};

Window_BattleEnemy.prototype.actorWindow = function() {
    return SceneManager._scene._statusWindow;
};

Yanfly.Sel.Window_BattleEnemy_allowedTargets =
    Window_BattleEnemy.prototype.allowedTargets;
Window_BattleEnemy.prototype.allowedTargets = function() {
    this._inputLock = false;
    this._selectDead = false;
    if (!this.action()) return [];
    if (!this.action().item()) return [];
    var targets = [];
    this.action().setSelectionFilter(true);
    if (this.action().isSpanBothParties()) {
      targets = targets.concat($gameTroop.aliveMembers());
      targets = targets.concat($gameParty.members());
    } else if (this.action().isForOpponent()) {
      targets = targets.concat($gameTroop.aliveMembers());
    } else {
      targets = targets.concat($gameParty.members());
    }
    this.action().setSelectionFilter(false);
    return targets;
};

Window_BattleEnemy.prototype.sortTargets = function() {
    this._enemies.sort(function(a, b) {
      if (a.isActor() && b.isActor()) {
        return a.index() - b.index();
      }
      if (a.spritePosX() === b.spritePosX()) {
        return a.spritePosY() - b.spritePosY();
      }
      return a.spritePosX() - b.spritePosX();
    });
};

Yanfly.Sel.Window_BattleEnemy_autoSelect =
    Window_BattleEnemy.prototype.autoSelect;
Window_BattleEnemy.prototype.autoSelect = function() {
    if (this.action().isForOpponent()) {
      Yanfly.Sel.Window_BattleEnemy_autoSelect.call(this);
    } else {
      this.actorAutoSelect();
    }
};

Window_BattleEnemy.prototype.actorAutoSelect = function() {
    if (!this.action()) return this.select(0);
    var index = 0;
    this._inputLock = false;
    this._selectDead = false;
    if (this.action().isForUser()) {
      index = this._enemies.indexOf(BattleManager.actor());
      this._inputLock = true;
    } else if (this.action().isForDeadFriend()) {
      this._selectDead = true;
      index = this.autoSelectFirstDeadActor();
      if (this.action().isForAll()) this._inputLock = true;
    } else {
      index = this._enemies.indexOf($gameParty.aliveMembers()[0]);
    }
    this.select(index);
};

Window_BattleEnemy.prototype.autoSelectFirstDeadActor = function() {
    var length = this._enemies.length;
    for (var i = 0; i < length; ++i) {
      var member = this._enemies[i];
      if (member && member.isActor() && member.isDead()) return i;
    }
    return 0;
};

Window_BattleEnemy.prototype.furthestRight = function() {
    var index = -1;
    var length = this._enemies.length;
    for (var i = 0; i < length; ++i) {
      var target = this._enemies[i];
      if (!target) continue;
      if (typeof target === 'string') {
        continue;
      } else if (target && target.isEnemy()) {
        index = i;
      }
    }
    return Math.max(0, index);
};

Window_BattleEnemy.prototype.isOkEnabled = function() {
    if (this._selectDead) return this.enemy().isDead();
    return Window_Selectable.prototype.isOkEnabled.call(this);
};

Yanfly.Sel.Window_BattleEnemy_sortTargets = 
  Window_BattleEnemy.prototype.sortTargets;
Window_BattleEnemy.prototype.sortTargets = function() {
    Yanfly.Sel.Window_BattleEnemy_sortTargets.call(this);
    if (this.action()) this.addExtraSelectTargets();
};

Window_BattleEnemy.prototype.addExtraSelectTargets = function() {
  var action = this.action();
  if (action.isSingleOrMultiple()) {
    var enemyCount = 0;
    var allyCount = 0;
    var length = this._enemies.length;
    for (var i = 0; i < length; ++i) {
      var target = this._enemies[i];
      if (!target) continue;
      if (target.isEnemy()) enemyCount += 1;
      if (target.isActor()) allyCount += 1;
    }
    if (enemyCount > 1) {
      var add = true;
      if (Imported.YEP_Taunt) {
        var unit = $gameTroop;
        if (action.isPhysical() &&
        unit.physicalTauntMembers().length > 1) {
          add = false;
        } else if (action.isMagical() &&
        unit.magicalTauntMembers().length > 1) {
          add = false;
        } else if (action.isCertainHit() &&
        unit.certainTauntMembers().length > 1) {
          add = false;
        }
      }
      if (add) this._enemies.unshift('ALL ENEMIES');
    }
    if (allyCount > 1) {
      this._enemies.push('ALL ALLIES');
    }
  }
};

Yanfly.Sel.Window_BattleEnemy_isMouseOverEnemy =
    Window_BattleEnemy.prototype.isMouseOverEnemy;
Window_BattleEnemy.prototype.isMouseOverEnemy = function(enemy) {
    if (typeof enemy === 'string') return false;
    return Yanfly.Sel.Window_BattleEnemy_isMouseOverEnemy.call(this, enemy);
};

Yanfly.Sel.Window_BattleEnemy_isClickedEnemy =
    Window_BattleEnemy.prototype.isClickedEnemy;
Window_BattleEnemy.prototype.isClickedEnemy = function(enemy) {
    if (typeof enemy === 'string') return false;
    return Yanfly.Sel.Window_BattleEnemy_isClickedEnemy.call(this, enemy);
};

Yanfly.Sel.Window_BattleEnemy_hide = Window_BattleEnemy.prototype.hide;
Window_BattleEnemy.prototype.hide = function() {
    Yanfly.Sel.Window_BattleEnemy_hide.call(this);
    $gameParty.select(null);
    if (BattleManager.actor()) {
      this.actorWindow().select(BattleManager.actor().index());
    }
};

Yanfly.Sel.Window_BattleEnemy_select =
    Window_BattleEnemy.prototype.select;
Window_BattleEnemy.prototype.select = function(index) {
    $gameTroop.select(null);
    $gameParty.select(null);
    Yanfly.Sel.Window_BattleEnemy_select.call(this, index);
    if (this.enemy() === 'ALL ENEMIES') {
      var length = this._enemies.length;
      for (var i = 0; i < length; ++i) {
        var target = this._enemies[i];
        if (!target) continue;
        if (typeof target === 'string') continue;
        if (target.isEnemy()) target.select();
      }
    } else if (this.enemy() === 'ALL ALLIES') {
      var length = this._enemies.length;
      for (var i = 0; i < length; ++i) {
        var target = this._enemies[i];
        if (!target) continue;
        if (typeof target === 'string') continue;
        if (target.isActor()) target.select();
      }
    } else if (this.enemy() && this.enemy().isActor()) {
      $gameParty.select(this.enemy());
      this.actorWindow().select(this.enemy().index());
    }
};

Yanfly.Sel.Window_BattleEnemy_enemyIndex =
    Window_BattleEnemy.prototype.enemyIndex;
Window_BattleEnemy.prototype.enemyIndex = function() {
    if (typeof this.enemy() === 'string') return this.enemy();
    if (this.action().isSpanBothParties()) {
      var index = this.enemy().index();
      if (this.enemy().isActor()) return 'ACTOR ' + index + ' SELECT';
      if (this.enemy().isEnemy()) return 'ENEMY ' + index + ' SELECT';
    }
    return Yanfly.Sel.Window_BattleEnemy_enemyIndex.call(this);
};

//=============================================================================
// Scene_Battle
//=============================================================================

Scene_Battle.prototype.selectActorSelection = function() {
    this.selectEnemySelection();
};

//=============================================================================
// Utilities
//=============================================================================

Yanfly.Util = Yanfly.Util || {};

Yanfly.Util.getCommonElements = function(array1, array2) {
    var elements = [];
    var length = array1.length;
    for (var i = 0; i < length; ++i) {
      var element = array1[i];
      if (array2.contains(element)) elements.push(element);
    }
    return elements;
};

//=============================================================================
// End of File
//=============================================================================
}; // Imported.YEP_BattleEngineCore && Imported.YEP_TargetCore