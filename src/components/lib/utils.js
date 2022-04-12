export function getRandomId() {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  return uint32.toString(16);
}

let caches = {};

export function checkFlexGap() {
  if (caches.isFlexGapSupported?.memoized) {
    return caches.isFlexGapSupported.value;
  }
  var flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";

  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));

  document.body.appendChild(flex);
  var isSupported = flex.scrollHeight === 1;
  flex.parentNode.removeChild(flex);

  caches.isFlexGapSupported = {
    memoized: true,
    value: isSupported,
  };

  return isSupported;
}
