interface ICaches {
  isFlexGapSupported: {
    memoized: boolean
    value: boolean
  }
}

const caches: ICaches = {
  isFlexGapSupported: {
    memoized: false,
    value: false,
  },
}

function getRandomId() {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0]
  return uint32.toString(16)
}

function checkFlexGap() {
  if (caches.isFlexGapSupported?.memoized) {
    return caches.isFlexGapSupported.value
  }
  const flex = document.createElement('div')
  flex.style.display = 'flex'
  flex.style.flexDirection = 'column'
  flex.style.rowGap = '1px'

  flex.appendChild(document.createElement('div'))
  flex.appendChild(document.createElement('div'))

  document.body.appendChild(flex)
  const isSupported = flex.scrollHeight === 1
  flex.parentNode?.removeChild(flex)

  caches.isFlexGapSupported = {
    memoized: true,
    value: isSupported,
  }

  return isSupported
}

const utils = {
  getRandomId,
  checkFlexGap,
}

export default utils
