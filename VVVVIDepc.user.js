// Copyright © 2019 Walter Purcaro <vuolter@gmail.com>
//
// ==UserScript==
// @name        VVVVID Enhanced Player Controls
// @namespace   https://github.com/vuolter/VVVVIDepc
// @match       *://www.vvvvid.it/*
// @version     1.0.0
// @author      Walter Purcaro
// @description Add hotkeys support and reduce info on screen while playing. Available hotkeys: "Space" to play/pause video playback, "Arrow Left" to rewind video (keep pressed to increase speed), "Arrow Right" to fast-forward video (keep pressed to increase speed), "Arrow Up" to increase audio volume, "Arrow Down" to reduce audio volume. Press any button to show the playback controls.
// @run-at      document-idle
// @grant       none
// ==/UserScript==

'use strict';

// *** SETTINGS SECTION START ***

var SHOW_TITLE = true;  // shows video title within player controls
var VOLUME_INCREMENT = 0.1;  // range 0-1, decimals
var MIN_POSITION_INCREMENT = 10;  // in seconds
var MAX_POSITION_INCREMENT = 120;  // in seconds
var POSITION_INCREMENT_MULTIPLIER = 1.03;  // range 1-?

// *** SETTINGS SECTION END ***

var _playerInfoContainerOpaque;
var _menuBottomOpaque;
var _playerControlsOpaque;
var _channelsContainer;
var _playlistBtn;

var _playerVideoInfo;
var _navbar;

var _playerControlsOpaque_top;

var _initFlag = false;
var _timedDelay = 2000;
var _timedId;
var _posInc;

// function isFullscreen() { return 1 >= outerHeight - innerHeight; }

// fix fullscreen UI bug
// document.addEventListener("fullscreenChange", function() {
  // if (isFullscreen() && !_player.getInFullscreen())
    // player.setFullscreen()
// });

function _init() {
  _playerInfoContainerOpaque = document.getElementsByClassName('player-info-container-opaque')[0];
  _menuBottomOpaque = document.getElementsByClassName('menu-bottom-opaque')[0];
  _playerControlsOpaque = document.getElementsByClassName("playerControls-opaque")[0];
  _channelsContainer = document.getElementById('channelsContainer');
  _playlistBtn = document.getElementsByClassName('pull-right')[0];

  _playerVideoInfo = document.getElementById('player-video-info');
  _navbar = document.getElementsByClassName('navbar navbar-bottom hide hide-out')[0];

  _playerControlsOpaque_top = getComputedStyle(document.querySelector('.playerControls-opaque')).top;
}

function _changeUI(visibility, top) {
  _playerInfoContainerOpaque.style.visibility = visibility;
  _menuBottomOpaque.style.visibility = visibility;
  _playerControlsOpaque.style.top = top;
  _channelsContainer.style.visibility = visibility;
  _playlistBtn.style.visibility = visibility;
}

function _toggleUI(status) {
  if (SHOW_TITLE)
    _playerVideoInfo.className = "player-info hide " + status;
  _navbar.className = "navbar navbar-bottom hide hide-out " + status;
}

function customizeUI() {
  var half_top = parseFloat(_playerControlsOpaque_top) / 2 + 'px';
  _changeUI("hidden", half_top);
}

function restoreUI() {
  _changeUI("visible", _playerControlsOpaque_top);
}

function showUI() {
  customizeUI();
  _toggleUI("active");
}

function hideUI() {
  _toggleUI("inactive");
}

function getPosInc() {
  _posInc = Math.min(MAX_POSITION_INCREMENT, _posInc * POSITION_INCREMENT_MULTIPLIER);
  return _posInc;
}

function clearPosInc() {
  _posInc = MIN_POSITION_INCREMENT;
  return _posInc;
}

document.addEventListener('mousemove', function(event) {
  clearTimeout(_timedId);
  restoreUI();
});

document.addEventListener('keyup', function(event) {
  showUI();
  _timedId = setTimeout(hideUI, _timedDelay);
});

document.addEventListener('keydown', function(event) {
  if (!_initFlag) {
    _init();
    _initFlag = true;
  }

  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
    return;

  // console.log(event.code);
  // console.log(event.repeat);

  if (!event.repeat) {
    clearTimeout(_timedId);
    showUI();
  }

  var player = window.vvvvid.player;

  switch (event.code) {
    case "Space":
      if (!event.repeat)
        player.setPlayPause();
      break;

    case "ArrowLeft":
      var pos = player.getPosition();
      var inc = event.repeat ? getPosInc() : clearPosInc();
      player.setSeek(pos - inc);
      break;

    case "ArrowUp":
      var vol = Math.min(100, player.getVolume() + VOLUME_INCREMENT);
      player.setVolume(vol);
      break;

    case "ArrowRight":
      var pos = player.getPosition();
      var inc = event.repeat ? getPosInc() : clearPosInc();
      player.setSeek(pos + inc);
      break;

    case "ArrowDown":
      var vol = Math.max(0.001, player.getVolume() - VOLUME_INCREMENT);  // NOTE: if volume is set to 0 UI shows wrong value
      player.setVolume(vol);
      break;
  }
});
