/**
 * Page Breakdown Tool: popup script
 *
 * @author etaub 
 * @since Jun 2018
 **/

(function(window, document, chrome) {

  var indentation = 0;
  var previous = '';
  var dupCount = 0;

  function load() {
    chrome.tabs.executeScript({
      file: 'content.js'
    });
  }

  function add(message) {
    if (message.messageType === 'startNode') {
      indentation += 1;
    }
    else if (message.messageType === 'endNode') {
      indentation -= 1;
    }
    else if (message.partName === previous) {
      dupCount++;
      var summary = document.getElementById('summary');
      summary.lastChild.innerHTML = previous + ' (x' + dupCount + ')';
    }
    else {
      var summary = document.getElementById('summary');
      var newNode = document.createElement('div');
      newNode.setAttribute('class', message.partType);
      var text = '';
      for (var i = 0; i < indentation; i++) {
        text += '&nbsp;&nbsp;';
      }
      newNode.innerHTML = text + message.partName;
      previous = message.partName;
      dupCount = 0;
      summary.appendChild(newNode);
    }
  }

  document.addEventListener('DOMContentLoaded', load);
  chrome.runtime.onMessage.addListener(function(message) {
    add(message);
  });

})(window, document, chrome);

