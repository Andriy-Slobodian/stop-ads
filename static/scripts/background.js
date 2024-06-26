let host = '';
let activeTabId = 0;

// Get Host & TabID from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  host = message.host;
  activeTabId = sender.tab?.id || 0;
});

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const requestedOrigin = details?.url || '';

    // Get requests to different origin
    if (host && requestedOrigin && !requestedOrigin.includes(host)) {

      console.log('URL: ', details.url);
      console.log(`Modified: |${new URL(details.url).origin}`);
      console.log("--------------------------------");

      void chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [
          {
            id: 1,
            priority: 1,
            action: { type: "block" },
            condition: {
              urlFilter: `*`,
              initiatorDomains: [`${requestedOrigin}`],
              excludedInitiatorDomains: [`${host}`],
              excludedRequestDomains: [`${host}`],
              resourceTypes: [ "main_frame" ]
            },
          }
        ],
        removeRuleIds: [1]
      });

      // Cancel request listener
      return { cancel: true };
    }
  },
  { urls: ["<all_urls>"] }
);

/*
chrome.runtime.onInstalled.addListener(async () => {

    // Set up the declarativeNetRequest rules
    await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [
            {
                id: 1,
                priority: 1,
                action: { type: "block" },
                condition: {
                    urlFilter: "*",
                    excludedDomains: [host],
                    resourceTypes: [
                        "main_frame",
                        "sub_frame",
                        "stylesheet",
                        "script",
                        "image",
                        "font",
                        "object",
                        "xmlhttprequest",
                        "ping",
                        "csp_report",
                        "media",
                        "websocket",
                        "other"
                    ]
                },
            },
        ],
        removeRuleIds: [1]
    });
});
*/
