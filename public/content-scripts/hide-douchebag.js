let port = null;
let videoCollections = null;
let douchebags = [];

function getDouchebags(callback) {
  chrome.storage.sync.get({ douchebags: [] }, function (obj) {
    douchebags = obj.douchebags;
    callback();
  });
}

function isDouchebag(channelName) {
  return douchebags.includes(channelName);
}

function hideDouchbags(videos) {
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const channelNameTag = video.querySelector('ytd-channel-name a');

    if (channelNameTag != null && isDouchebag(channelNameTag.textContent)) {
      video.parentNode.removeChild(video);
    }
  }
}

function checkAndHideDouchebags() {
  for (const collection of videoCollections) {
    hideDouchbags(collection);
  }
}

function createPort() {
  port = chrome.runtime.connect();

  port.onDisconnect.addListener(function () {
    port = null;

    createPort();
  });

  port.onMessage.addListener(function (message) {
    if (message.type === 'navigation') {
      const ytNavProgress = document.getElementsByTagName('yt-page-navigation-progress');

      if (ytNavProgress.length === 0) {
        checkAndHideDouchebags();
      } else {
        const progressIndicator = ytNavProgress.item(0);
        const observer = new MutationObserver(function() {
          if (!progressIndicator.hasAttribute('hidden')) {
            checkAndHideDouchebags();
            observer.disconnect();
          }
        });

        observer.observe(progressIndicator, { attributes: true, attributeFilter: ['hidden'] });
      }
    }

    checkAndHideDouchebags();
  });
}

function getVideos() {
  return [
    document.getElementsByTagName('ytd-video-renderer'),
    document.getElementsByTagName('ytd-rich-item-renderer'),
    document.getElementsByTagName('ytd-grid-video-renderer')
  ];
}

function start() {
  videoCollections = getVideos();

  getDouchebags(function () {
    checkAndHideDouchebags();

    createPort();
  });

  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area !== 'sync' || changes.douchebags == null) {
      return;
    }

    douchebags = changes.douchebags.newValue;

    checkAndHideDouchebags();
  });
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', start)
} else {
  start();
}
