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
      var text = '';
      for (var i = 0; i < indentation; i++) {
        text += '&nbsp;&nbsp;';
      }
      summary.lastChild.innerHTML = text + previous + ' (x' + dupCount + ')';
    }
    else {
      var summary = document.getElementById('summary');
      var newNode = document.createElement('div');
      newNode.setAttribute('class', message.partType);
      newNode.setAttribute('data-guid', message.partGuid);
      var text = '';
      for (var i = 0; i < indentation; i++) {
        text += '&nbsp;&nbsp;';
      }
      newNode.innerHTML = text + message.partName;
      if (message.partGuid != null) {
        newNode.onclick = function(element) {
          var elem = element.target.getAttribute('data-guid');
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(tabs[0].id, {
              code: 'window.scrollTo({ top: document.querySelector("[data-pagebreakdown-guid=\\\"' + elem + '\\\"]").offsetTop, behavior: "smooth"}); document.querySelector("[data-pagebreakdown-guid=\\\"' + elem + '\\\"]").style.backgroundColor="yellow"; setTimeout(function(){ document.querySelector("[data-pagebreakdown-guid=\\\"' + elem + '\\\"]").style.backgroundColor=""; }, 3000);'
            });
          });
        };
      }
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

