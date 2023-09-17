const CONFIG = {
  DOCUMENT_URL:
    "https://moskva.mts.ru/personal/mobilnaya-svyaz/tarifi/vse-tarifi/mobile-tv-inet",
  // EVERY SUCCESSFULY UPDATE SHOULD HAPPEN AT LEAST ONCE EVERY HOUR
  UPDATE_INTERVAL: 1000 * 60 * 60,
  UPDATE_STATUS: {
    DONE: "done",
    FAILED: "failed",
    RUNNING: "running",
  },
  BASE_URL: "http://localhost:3000/",
};

export default CONFIG;
