/**
 * Page Breakdown Tool: content script
 *
 * @author etaub
 * @since Jun 2018
 **/

(function(window, document, chrome) {

  function processNode(tw) {
    var n = tw.currentNode;
    chrome.runtime.sendMessage({ 'messageType': 'startNode' });
    var partName = n.getAttribute('data-pagebreakdown-name');
    var partType = n.getAttribute('data-pagebreakdown-type');
    if (n.nodeName === 'DIV') {
      chrome.runtime.sendMessage({
        'messageType': 'processNode', 
        'partName': partName,
        'partType': partType
      });
    }
    for (var child = tw.firstChild(); child != null; child = tw.nextSibling()) {
      processNode(tw);
    }
    tw.currentNode = n;
    chrome.runtime.sendMessage({ 'messageType': 'endNode' });
  }

  var tw = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, { 
    acceptNode: function(node) { 
      return node.nodeName === 'DIV' && node.hasAttribute('data-pagebreakdown-name') 
        ? NodeFilter.FILTER_ACCEPT 
        : NodeFilter.FILTER_SKIP;
    }}
  );
  processNode(tw);

})(window, document, chrome);

