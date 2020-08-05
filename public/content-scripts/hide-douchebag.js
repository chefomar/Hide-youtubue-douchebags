let port = null;
let videos = [];
let douchebags = [];

function createPort(callback) {
  port = chrome.runtime.connect();

  port.onDisconnect.addListener(function () {
    port = null;

    createPort(callback);
  });

  port.onMessage.addListener(() => callback());
}

function getDouchebags(callback) {
  chrome.storage.sync.get({ douchebags: [] }, callback);
}

function getVideos() {
  return document.querySelectorAll('ytd-video-renderer, ytd-rich-item-renderer, ytd-grid-video-renderer');
}

function getChannelName(video) {
  const channelNameNode = video.querySelector('ytd-channel-name a');

  if (channelNameNode == null) {
    return '';
  }

  return channelNameNode.textContent;
}

function isDouchebag(channelName) {
  return douchebags.indexOf(channelName) >= 0;
}

function hideDouchbags() {
  videos = getVideos();

  for (const video of videos) {
    if (isDouchebag(getChannelName(video))) {
      video.parentNode.removeChild(video);
    }
  }
}

// navigation
function listenToNavigationChanges() {
  const ytNavigationProgress = document.querySelector('yt-page-navigation-progress');

  const observer = new MutationObserver(function () {
    if (ytNavigationProgress.hasAttribute('hidden')) {
      // navigation complete
      hideDouchbags();
    }
  });

  observer.observe(ytNavigationProgress, { attributes: true, attributeFilter: ['hidden', 'aria-valuenow', 'aria-valuemax'] });
}

// request
function onRequestCompleted() {
  hideDouchbags();
}

// storage change
function listenToStorageChange() {
  chrome.storage.onChanged.addListener(function(changes, area) {
    if (area !== 'sync' || changes.douchebags == null) {
      return;
    }

    douchebags = [...changes.douchebags.newValue];

    hideDouchbags();
  });
}

// start
function onStart() {
  getDouchebags(
    function (obj) {
      douchebags = obj.douchebags;

      hideDouchbags();

      createPort(onRequestCompleted);

      listenToStorageChange();

      const youtube = document.querySelector('ytd-app');

      const observer = new MutationObserver(function () {
        if (document.querySelector('yt-page-navigation-progress') != null) {
          listenToNavigationChanges();
          observer.disconnect();
        }
      });

      observer.observe(youtube, { childList: true });
    }
  );
}

function ready() {
  onStart();

  document.removeEventListener('readystatechange', ready);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} else {
  onStart();
}
