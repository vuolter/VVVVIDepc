VVVVIDepc
=========

#### Enhanced Player Controls for vvvvid.it

If you're looking for something more *minimal* or you're still in love with your keyboard,
this userscript is for you too!

No ads skippers here, but... also no compatibility issues with them. Peace.


Features
--------

- [x] Add hotkeys support
- [x] Customizable hotkeys
- [x] Reduce info on screen while playing
- [x] Clean playback UI
- [x] Fix volume controls

### Available hotkeys:

- `Space` to play/pause video playback.
- `ArrowLeft` to rewind video (keep pressed to gradually increase speed).
- `ArrowRight` to fast-forward video (keep pressed to gradually increase speed).
- `b` to play before (previous) video in playlist.
- `n` to play next video in playlist.
- `ArrowUp` to increase audio volume.
- `ArrowDown` to reduce audio volume.
- `m` to mute/unmute audio volume.
- `f` to fullscreen video.
- `t` to show/hide video title.
- `p` to show/hide playlist bar.
- `Enter` to rate video.
- `a` to save video to watch later list.

Press any other key to show the playback controls.


Script Settings
---------------

Values of name of keys to use as hotkeys (Strings):

    var PAUSE_KEY = "Space";
    var REW_KEY = "ArrowLeft";
    var FF_KEY = "ArrowRight";
    var VOLUP_KEY = "ArrowUp";
    var VOLDOWN_KEY = "ArrowDown";
    var WATCHLATER_KEY = "a";
    var PREV_KEY = "b";
    var NEXT_KEY = "n";
    var MUTE_KEY = "m";
    var RATE_KEY = "Enter";
    var PLAYLIST_KEY = "p";
    var FULLSCREEN_KEY = "f";
    var TITLE_KEY = "t";

> **Note:**
> Hotkey value is case-sensitive.
> Application, system and function key names are not supported
> (e.g. `Escape`, `F11`, `Tab`, `Alt`, etc.).

Show/hide video title within player controls (Boolean, default to true):

    var SHOW_TITLE = true;

Show/hide video actions within player controls (Boolean, default to false):

    var SHOW_ACTIONS = false;

Value of gain to add/subtract to current volume when key is pressed (Number, range 0 to 1):

    var VOLUME_INCREMENT = 0.1;

Min/max seconds of time to add/subtract to the current playback position when key is pressed (Numbers, greater than 0):

    var MIN_POSITION_INCREMENT = 10;
    var MAX_POSITION_INCREMENT = 120;

Value to multiply with seconds of time to add/subtract when key is pressed (Number, greater than 1):

    var POSITION_INCREMENT_MULTIPLIER = 1.03;


----------------------------
###### © 2019 Walter Purcaro
