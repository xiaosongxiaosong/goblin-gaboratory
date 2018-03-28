chrome.app.runtime.onLaunched.addListener(() => {
  chrome.app.window.create('./index.html', {
    bounds: {
      width: 1024,
      height: 768,
    },
    state: 'maximized',
  });
});
