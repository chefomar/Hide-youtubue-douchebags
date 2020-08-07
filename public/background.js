let tabs = [];

function notify(type) {
  for (const tab of tabs) {
    tab.port.postMessage({ type });
  }
}

chrome.runtime.onConnect.addListener(function(clientPort) {
  tabs.push({ tab: clientPort.sender.tab.id, port: clientPort });

  clientPort.onDisconnect.addListener(function() {
    tabs = tabs.filter(tab => tab.port.sender.tab.id !== clientPort.sender.tab.id);
  });
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
