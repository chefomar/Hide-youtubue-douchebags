/* global chrome */
function getDouchebags(callback) {
  chrome.storage.sync.get({ douchebags: [] }, function(obj) {
    callback(obj.douchebags);
  });
}

function saveDouchebag(douchebagName, callback) {
  getDouchebags(function(douchebags) {
    if (!douchebags.includes(douchebagName)) {
      chrome.storage.sync.set({ douchebags: [ ...douchebags, douchebagName ] }, callback);
    }
  });
}

function deleteDouchebag(douchebagName, callback) {
  getDouchebags(function(douchebags) {
    if (douchebags.includes(douchebagName)) {
      chrome.storage.sync.set(
        { douchebags: douchebags.filter(douchebag => douchebag !== douchebagName) },
        callback
      );
    }
  });
}

export { getDouchebags, saveDouchebag, deleteDouchebag };
