export function getRandomId() {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  return uint32.toString(16);
}

let caches = {};

export function checkFlexGap() {
  if (caches.isFlexGapSupported?.memoized) {
    return caches.isFlexGapSupported.value;
  }
  // create flex container with row-gap set
  var flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";

  // create two, elements inside it
  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));

  // append to the DOM (needed to obtain scrollHeight)
  document.body.appendChild(flex);
  var isSupported = flex.scrollHeight === 1; // flex container should be 1px high from the row-gap
  flex.parentNode.removeChild(flex);

  caches.isFlexGapSupported = {
    memoized: true,
    value: isSupported,
  };

  return isSupported;
}
