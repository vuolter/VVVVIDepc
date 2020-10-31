// ==UserScript==
// @name            VVVVIDepc - Enhanced Player Controls for vvvvid.it
// @name:it         VVVVIDepc - Migliora il player video di vvvvid.it
// @namespace       https://github.com/vuolter/VVVVIDepc
// @match           *://www.vvvvid.it/*
// @version         2.0.3
// @author          Walter Purcaro
// @copyright       2019, Walter Purcaro (https://vuolter.com)
// @description     Add hotkeys support and drastically improve playback UI
// @description:it  Aggiunge diversi tasti di scelta rapida e migliora l'aspetto dell'interfaccia utente
// @license         ISC
// @homepageURL     https://github.com/vuolter/VVVVIDepc
// @downloadURL     https://github.com/vuolter/VVVVIDepc/raw/master/VVVVIDepc.user.js
// @supportURL      https://github.com/vuolter/VVVVIDepc/issues
// @run-at          document-idle
// @grant           none
// ==/UserScript==

"use strict";

// *** SETTINGS START ***

// General Settings
const ENABLE_HOTKEYS = false; // NOTE: VVVVID now supports some key bindings on its own
const SHOW_TITLE = true; // shows video title within player controls
const SHOW_ACTIONS = false; // shows video actions within player controls

// Hotkey Mapping (application, system and function keys are not supported)
const PAUSE_KEY = "Space";
const REW_KEY = "ArrowLeft";
const FF_KEY = "ArrowRight";
const VOLUP_KEY = "ArrowUp";
const VOLDOWN_KEY = "ArrowDown";
// const SHARE_KEY = "s";  // NOTE: disabled because breaks texting
const WATCHLATER_KEY = "a";
const PREV_KEY = "b";
const NEXT_KEY = "n";
const MUTE_KEY = "m";
const RATE_KEY = "Enter";
const PLAYLIST_KEY = "p";
const FULLSCREEN_KEY = "f";
const TITLE_KEY = "t";

// Additional Settings
const VOLUME_INCREMENT = 0.1; // range 0-1, decimals

const MIN_POSITION_INCREMENT = 10; // in seconds
const MAX_POSITION_INCREMENT = 120; // in seconds
const POSITION_INCREMENT_MULTIPLIER = 1.03; // range 1+

// *** SETTINGS END ***

var _uiMod = false;
var _timedDelay = 2000;
var _timedId;
var _posInc;

function _changeUI(visibility, height) {
  $(".player-info-container-opaque").css("visibility", visibility);
  $(".menu-bottom-opaque").css("visibility", visibility);
  $(".playerControls-opaque").css("height", height);
  $("#channelsContainer").css("visibility", visibility);
  $(".pull-right").css("visibility", visibility);
}

function _displayElement(element, visible) {
  if (visible) $(element).addClass("active").removeClass("inactive");
  else $(element).addClass("inactive").removeClass("active");
}

function _displayTitle(visible) {
  _displayElement("#player-video-info", visible);
}

function _displayNavbar(visible) {
  _displayElement(".navbar-bottom", visible);
}

function _displayActions(visible) {
  _displayElement("#player-video-actions", visible);
}

// NOTE: not working, depends just on _displayNavbar :(
function _displayPlayerControls(visible) {
  _displayElement("#playerControls", visible);
}

function _displayUI(showTitle, showPlayer, showActions) {
  _displayTitle(showTitle);
  _displayPlayerControls(showPlayer);
  _displayActions(showActions);
  _displayNavbar(showPlayer || showActions);
}

function customizeUI() {
  const pco_height = $(".playerControls-opaque").css("height");
  const mbo_height = $(".menu-bottom-opaque").css("height");
  const height = parseFloat(pco_height) + parseFloat(mbo_height);
  _changeUI("hidden", height);
  _uiMod = true;
}

function restoreUI() {
  _changeUI("visible", "");
  _uiMod = false;
}

function showUI(showTitle, showPlayer, showActions) {
  if (!_uiMod) customizeUI();

  if (showPlayer) {
    showTitle = SHOW_TITLE;
    showActions = SHOW_ACTIONS;
  }

  _displayUI(showTitle, showPlayer, showActions);
}

function hideUI() {
  _displayUI(false, false, false);
}

function getPosInc() {
  _posInc = Math.min(
    MAX_POSITION_INCREMENT,
    _posInc * POSITION_INCREMENT_MULTIPLIER
  );
  return _posInc;
}

function resetPosInc() {
  _posInc = MIN_POSITION_INCREMENT;
  return _posInc;
}

function restoreUIHandler() {
  clearTimeout(_timedId);
  if (_uiMod) restoreUI();
}

function hideUIHandler() {
  _timedId = setTimeout(hideUI, _timedDelay);
}

function hotkeyHandler(event) {
  // console.log("Keydown key: " + event.key);
  // console.log("Keydown repeat: " + event.repeat);

  // skip if application or system key
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

  // skip if function key
  if (event.key.match(/F\d{1,2}/)) return;

  const key = event.key == " " ? "Space" : event.key; // convert " " to "Space"
  const longPress = event.repeat;

  let showTitle = false;
  let showPlayer = false;
  let showActions = false;

  const p = window.vvvvid.playerObj;

  switch (key) {
    case PAUSE_KEY:
      if (!longPress) {
        p.player.setPlayPause();
        showPlayer = true;
      }
      break;

    case TITLE_KEY:
      if (!longPress) showTitle = true;
      break;

    case PREV_KEY:
      if (!longPress) p.movePrev();
      break;

    case NEXT_KEY:
      if (!longPress) p.moveNext();
      break;

    case MUTE_KEY:
      if (!longPress) {
        $(p.player.getVolume() ? ".ppmute" : ".ppunmute").trigger("click");
        showPlayer = true;
      }
      break;

    case RATE_KEY:
      if (!longPress) {
        $(".player-action-rate-image").trigger("click");
        showActions = true;
      }
      break;

    case WATCHLATER_KEY:
      if (!longPress) {
        $(".player-action-addwtl-image").trigger("click");
        showActions = true;
      }
      break;

    // case SHARE_KEY:
    // if (!longPress) {
    // $(".player-action-share-image").trigger("click");
    // showActions = true;
    // }
    // break;

    case PLAYLIST_KEY:
      if (!longPress) {
        $(".playlist-btn").trigger("click");
        showPlayer = true;
      }
      break;

    case FULLSCREEN_KEY:
      if (!longPress) p.player.setFullscreen();
      break;

    case REW_KEY:
      const pos = p.player.getPosition();
      const inc = longPress ? getPosInc() : resetPosInc();
      p.player.setSeek(pos - inc);
      showPlayer = true;
      break;

    case FF_KEY:
      const pos = p.player.getPosition();
      const inc = longPress ? getPosInc() : resetPosInc();
      p.player.setSeek(pos + inc);
      showPlayer = true;
      break;

    case VOLUP_KEY:
      const vol = Math.min(100, p.player.getVolume() + VOLUME_INCREMENT);
      p.player.setVolume(vol);
      showPlayer = true;
      break;

    case VOLDOWN_KEY:
      const vol = Math.max(0.001, p.player.getVolume() - VOLUME_INCREMENT); // NOTE: if volume is set to 0 ui shows wrong value
      p.player.setVolume(vol);
      if (vol == 0.001) $(".ppmute").trigger("click");
      showPlayer = true;
      break;

    default:
      showPlayer = true;
  }

  if (!longPress) {
    clearTimeout(_timedId);
    showUI(showTitle, showPlayer, showActions);
  }
}

document.addEventListener("mousemove", restoreUIHandler);
document.addEventListener("keyup", hideUIHandler);
if (ENABLE_HOTKEYS) {
  document.addEventListener("keydown", hotkeyHandler);
}
