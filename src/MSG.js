let msgIndex = 0;

const MSG = {
  BUTTON_DOWN: ++msgIndex,
  BUTTON_UP: ++msgIndex,
  START: ++msgIndex,
  STOP: ++msgIndex,
  MUTE: ++msgIndex,
  UNMUTE: ++msgIndex,
  RELOAD: ++msgIndex,
  CLOSE: ++msgIndex,
  LOAD_FILE: ++msgIndex,
  FILE_LOADED: ++msgIndex,
  REMOTE_CONNECTED: ++msgIndex,
  REMOTE_DISCONNECTED: ++msgIndex,
  CONNECTED: ++msgIndex,
  FRAME: ++msgIndex,
};

export default MSG;
