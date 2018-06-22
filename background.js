/**
 * Page Breakdown Tool: background script
 * 
 * @author etaub 
 * @since Jun 2018
 **/

(function(window, document, chrome) {

  chrome.runtime.onInstalled.addListener(function() {
    console.log("Page Breakdown Tool installed");

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostSuffix: 'tripadvisor.com' },
          })
        ],
        actions: [
          new chrome.declarativeContent.ShowPageAction()
        ]
      }]);
    });
  });

})(window, document, chrome);

