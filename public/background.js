let port = null;
let shouldNotify = false;

function notify(type) {
  if (port == null) {
    shouldNotify = true;
    return;
  }

  port.postMessage({ type });
}

chrome.runtime.onConnect.addListener(function(clientPort) {
  port = clientPort;

  port.onDisconnect.addListener(function() {
    port = null;
  });

  if (shouldNotify) {
    notify();
  }
});

function webRequestCompletedCallback(details) {
  notify('request');
}

chrome.webRequest.onCompleted.addListener(
  webRequestCompletedCallback,
  {
    urls: [
      "https://www.youtube.com/",
      "https://www.youtube.com/?*",
      "https://www.youtube.com/feed/trending",
      "https://www.youtube.com/feed/trending?*",
      "https://www.youtube.com/feed/trending/",
      "https://www.youtube.com/feed/trending/?*",
      "https://www.youtube.com/youtubei/v1/browse",
      "https://www.youtube.com/youtubei/v1/browse?*",
      "https://www.youtube.com/youtubei/v1/browse/",
      "https://www.youtube.com/youtubei/v1/browse/?*",
    ]
  }
);
