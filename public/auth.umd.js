!(function (e, t) {
  'object' == typeof exports && 'undefined' != typeof module
    ? t(exports)
    : 'function' == typeof define && define.amd
    ? define(['exports'], t)
    : t(
        (((e =
          'undefined' != typeof globalThis ? globalThis : e || self).arcana =
          e.arcana || {}),
        (e.arcana.auth = {}))
      )
})(this, function (e) {
  'use strict'
  /*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ var t =
    function (e, n) {
      return (
        (t =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (e, t) {
              e.__proto__ = t
            }) ||
          function (e, t) {
            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
          }),
        t(e, n)
      )
    }
  function n(e, n) {
    function r() {
      this.constructor = e
    }
    t(e, n),
      (e.prototype =
        null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
  }
  var r = function () {
    return (
      (r =
        Object.assign ||
        function (e) {
          for (var t, n = 1, r = arguments.length; n < r; n++)
            for (var i in (t = arguments[n]))
              Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i])
          return e
        }),
      r.apply(this, arguments)
    )
  }
  function i(e, t, n, r) {
    return new (n || (n = Promise))(function (i, o) {
      function s(e) {
        try {
          c(r.next(e))
        } catch (e) {
          o(e)
        }
      }
      function a(e) {
        try {
          c(r.throw(e))
        } catch (e) {
          o(e)
        }
      }
      function c(e) {
        var t
        e.done
          ? i(e.value)
          : ((t = e.value),
            t instanceof n
              ? t
              : new n(function (e) {
                  e(t)
                })).then(s, a)
      }
      c((r = r.apply(e, t || [])).next())
    })
  }
  function o(e) {
    var t = 'function' == typeof Symbol && Symbol.iterator,
      n = t && e[t],
      r = 0
    if (n) return n.call(e)
    if (e && 'number' == typeof e.length)
      return {
        next: function () {
          return (
            e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }
          )
        },
      }
    throw new TypeError(
      t ? 'Object is not iterable.' : 'Symbol.iterator is not defined.'
    )
  }
  function s(e, t) {
    var n = 'function' == typeof Symbol && e[Symbol.iterator]
    if (!n) return e
    var r,
      i,
      o = n.call(e),
      s = []
    try {
      for (; (void 0 === t || t-- > 0) && !(r = o.next()).done; )
        s.push(r.value)
    } catch (e) {
      i = { error: e }
    } finally {
      try {
        r && !r.done && (n = o.return) && n.call(o)
      } finally {
        if (i) throw i.error
      }
    }
    return s
  }
  function a() {
    for (var e = [], t = 0; t < arguments.length; t++)
      e = e.concat(s(arguments[t]))
    return e
  }
  var c = {},
    u = {},
    l = v
  ;(v.default = v), (v.stable = b), (v.stableStringify = b)
  var d = '[...]',
    p = '[Circular]',
    h = [],
    f = []
  function g() {
    return {
      depthLimit: Number.MAX_SAFE_INTEGER,
      edgesLimit: Number.MAX_SAFE_INTEGER,
    }
  }
  function v(e, t, n, r) {
    var i
    void 0 === r && (r = g()), m(e, '', 0, [], void 0, 0, r)
    try {
      i = 0 === f.length ? JSON.stringify(e, t, n) : JSON.stringify(e, x(t), n)
    } catch (e) {
      return JSON.stringify(
        '[unable to serialize, circular reference is too complex to analyze]'
      )
    } finally {
      for (; 0 !== h.length; ) {
        var o = h.pop()
        4 === o.length
          ? Object.defineProperty(o[0], o[1], o[3])
          : (o[0][o[1]] = o[2])
      }
    }
    return i
  }
  function _(e, t, n, r) {
    var i = Object.getOwnPropertyDescriptor(r, n)
    void 0 !== i.get
      ? i.configurable
        ? (Object.defineProperty(r, n, { value: e }), h.push([r, n, t, i]))
        : f.push([t, n, e])
      : ((r[n] = e), h.push([r, n, t]))
  }
  function m(e, t, n, r, i, o, s) {
    var a
    if (((o += 1), 'object' == typeof e && null !== e)) {
      for (a = 0; a < r.length; a++) if (r[a] === e) return void _(p, e, t, i)
      if (void 0 !== s.depthLimit && o > s.depthLimit) return void _(d, e, t, i)
      if (void 0 !== s.edgesLimit && n + 1 > s.edgesLimit)
        return void _(d, e, t, i)
      if ((r.push(e), Array.isArray(e)))
        for (a = 0; a < e.length; a++) m(e[a], a, a, r, e, o, s)
      else {
        var c = Object.keys(e)
        for (a = 0; a < c.length; a++) {
          var u = c[a]
          m(e[u], u, a, r, e, o, s)
        }
      }
      r.pop()
    }
  }
  function y(e, t) {
    return e < t ? -1 : e > t ? 1 : 0
  }
  function b(e, t, n, r) {
    void 0 === r && (r = g())
    var i,
      o = w(e, '', 0, [], void 0, 0, r) || e
    try {
      i = 0 === f.length ? JSON.stringify(o, t, n) : JSON.stringify(o, x(t), n)
    } catch (e) {
      return JSON.stringify(
        '[unable to serialize, circular reference is too complex to analyze]'
      )
    } finally {
      for (; 0 !== h.length; ) {
        var s = h.pop()
        4 === s.length
          ? Object.defineProperty(s[0], s[1], s[3])
          : (s[0][s[1]] = s[2])
      }
    }
    return i
  }
  function w(e, t, n, r, i, o, s) {
    var a
    if (((o += 1), 'object' == typeof e && null !== e)) {
      for (a = 0; a < r.length; a++) if (r[a] === e) return void _(p, e, t, i)
      try {
        if ('function' == typeof e.toJSON) return
      } catch (e) {
        return
      }
      if (void 0 !== s.depthLimit && o > s.depthLimit) return void _(d, e, t, i)
      if (void 0 !== s.edgesLimit && n + 1 > s.edgesLimit)
        return void _(d, e, t, i)
      if ((r.push(e), Array.isArray(e)))
        for (a = 0; a < e.length; a++) w(e[a], a, a, r, e, o, s)
      else {
        var c = {},
          u = Object.keys(e).sort(y)
        for (a = 0; a < u.length; a++) {
          var l = u[a]
          w(e[l], l, a, r, e, o, s), (c[l] = e[l])
        }
        if (void 0 === i) return c
        h.push([i, t, e]), (i[t] = c)
      }
      r.pop()
    }
  }
  function x(e) {
    return (
      (e =
        void 0 !== e
          ? e
          : function (e, t) {
              return t
            }),
      function (t, n) {
        if (f.length > 0)
          for (var r = 0; r < f.length; r++) {
            var i = f[r]
            if (i[1] === t && i[0] === n) {
              ;(n = i[2]), f.splice(r, 1)
              break
            }
          }
        return e.call(this, t, n)
      }
    )
  }
  Object.defineProperty(u, '__esModule', { value: !0 }),
    (u.EthereumProviderError = u.EthereumRpcError = void 0)
  const E = l
  class S extends Error {
    constructor(e, t, n) {
      if (!Number.isInteger(e)) throw new Error('"code" must be an integer.')
      if (!t || 'string' != typeof t)
        throw new Error('"message" must be a nonempty string.')
      super(t), (this.code = e), void 0 !== n && (this.data = n)
    }
    serialize() {
      const e = { code: this.code, message: this.message }
      return (
        void 0 !== this.data && (e.data = this.data),
        this.stack && (e.stack = this.stack),
        e
      )
    }
    toString() {
      return E.default(this.serialize(), C, 2)
    }
  }
  u.EthereumRpcError = S
  function C(e, t) {
    if ('[Circular]' !== t) return t
  }
  u.EthereumProviderError = class extends S {
    constructor(e, t, n) {
      if (
        !(function (e) {
          return Number.isInteger(e) && e >= 1e3 && e <= 4999
        })(e)
      )
        throw new Error(
          '"code" must be an integer such that: 1000 <= code <= 4999'
        )
      super(e, t, n)
    }
  }
  var k = {},
    L = {}
  Object.defineProperty(L, '__esModule', { value: !0 }),
    (L.errorValues = L.errorCodes = void 0),
    (L.errorCodes = {
      rpc: {
        invalidInput: -32e3,
        resourceNotFound: -32001,
        resourceUnavailable: -32002,
        transactionRejected: -32003,
        methodNotSupported: -32004,
        limitExceeded: -32005,
        parse: -32700,
        invalidRequest: -32600,
        methodNotFound: -32601,
        invalidParams: -32602,
        internal: -32603,
      },
      provider: {
        userRejectedRequest: 4001,
        unauthorized: 4100,
        unsupportedMethod: 4200,
        disconnected: 4900,
        chainDisconnected: 4901,
      },
    }),
    (L.errorValues = {
      '-32700': {
        standard: 'JSON RPC 2.0',
        message:
          'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.',
      },
      '-32600': {
        standard: 'JSON RPC 2.0',
        message: 'The JSON sent is not a valid Request object.',
      },
      '-32601': {
        standard: 'JSON RPC 2.0',
        message: 'The method does not exist / is not available.',
      },
      '-32602': {
        standard: 'JSON RPC 2.0',
        message: 'Invalid method parameter(s).',
      },
      '-32603': {
        standard: 'JSON RPC 2.0',
        message: 'Internal JSON-RPC error.',
      },
      '-32000': { standard: 'EIP-1474', message: 'Invalid input.' },
      '-32001': { standard: 'EIP-1474', message: 'Resource not found.' },
      '-32002': { standard: 'EIP-1474', message: 'Resource unavailable.' },
      '-32003': { standard: 'EIP-1474', message: 'Transaction rejected.' },
      '-32004': { standard: 'EIP-1474', message: 'Method not supported.' },
      '-32005': { standard: 'EIP-1474', message: 'Request limit exceeded.' },
      4001: { standard: 'EIP-1193', message: 'User rejected the request.' },
      4100: {
        standard: 'EIP-1193',
        message:
          'The requested account and/or method has not been authorized by the user.',
      },
      4200: {
        standard: 'EIP-1193',
        message:
          'The requested method is not supported by this Ethereum provider.',
      },
      4900: {
        standard: 'EIP-1193',
        message: 'The provider is disconnected from all chains.',
      },
      4901: {
        standard: 'EIP-1193',
        message: 'The provider is disconnected from the specified chain.',
      },
    }),
    (function (e) {
      Object.defineProperty(e, '__esModule', { value: !0 }),
        (e.serializeError =
          e.isValidCode =
          e.getMessageFromCode =
          e.JSON_RPC_SERVER_ERROR_MESSAGE =
            void 0)
      const t = L,
        n = u,
        r = t.errorCodes.rpc.internal,
        i = { code: r, message: o(r) }
      function o(
        n,
        r = 'Unspecified error message. This is a bug, please report it.'
      ) {
        if (Number.isInteger(n)) {
          const r = n.toString()
          if (l(t.errorValues, r)) return t.errorValues[r].message
          if (a(n)) return e.JSON_RPC_SERVER_ERROR_MESSAGE
        }
        return r
      }
      function s(e) {
        if (!Number.isInteger(e)) return !1
        const n = e.toString()
        return !!t.errorValues[n] || !!a(e)
      }
      function a(e) {
        return e >= -32099 && e <= -32e3
      }
      function c(e) {
        return e && 'object' == typeof e && !Array.isArray(e)
          ? Object.assign({}, e)
          : e
      }
      function l(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
      }
      ;(e.JSON_RPC_SERVER_ERROR_MESSAGE = 'Unspecified server error.'),
        (e.getMessageFromCode = o),
        (e.isValidCode = s),
        (e.serializeError = function (
          e,
          { fallbackError: t = i, shouldIncludeStack: r = !1 } = {}
        ) {
          var a, u
          if (!t || !Number.isInteger(t.code) || 'string' != typeof t.message)
            throw new Error(
              'Must provide fallback error with integer number code and string message.'
            )
          if (e instanceof n.EthereumRpcError) return e.serialize()
          const d = {}
          if (
            e &&
            'object' == typeof e &&
            !Array.isArray(e) &&
            l(e, 'code') &&
            s(e.code)
          ) {
            const t = e
            ;(d.code = t.code),
              t.message && 'string' == typeof t.message
                ? ((d.message = t.message), l(t, 'data') && (d.data = t.data))
                : ((d.message = o(d.code)), (d.data = { originalError: c(e) }))
          } else {
            d.code = t.code
            const n = null === (a = e) || void 0 === a ? void 0 : a.message
            ;(d.message = n && 'string' == typeof n ? n : t.message),
              (d.data = { originalError: c(e) })
          }
          const p = null === (u = e) || void 0 === u ? void 0 : u.stack
          return r && e && p && 'string' == typeof p && (d.stack = p), d
        })
    })(k)
  var O = {}
  Object.defineProperty(O, '__esModule', { value: !0 }), (O.ethErrors = void 0)
  const A = u,
    N = k,
    I = L
  function R(e, t) {
    const [n, r] = M(t)
    return new A.EthereumRpcError(e, n || N.getMessageFromCode(e), r)
  }
  function T(e, t) {
    const [n, r] = M(t)
    return new A.EthereumProviderError(e, n || N.getMessageFromCode(e), r)
  }
  function M(e) {
    if (e) {
      if ('string' == typeof e) return [e]
      if ('object' == typeof e && !Array.isArray(e)) {
        const { message: t, data: n } = e
        if (t && 'string' != typeof t)
          throw new Error('Must specify string message.')
        return [t || void 0, n]
      }
    }
    return []
  }
  ;(O.ethErrors = {
    rpc: {
      parse: (e) => R(I.errorCodes.rpc.parse, e),
      invalidRequest: (e) => R(I.errorCodes.rpc.invalidRequest, e),
      invalidParams: (e) => R(I.errorCodes.rpc.invalidParams, e),
      methodNotFound: (e) => R(I.errorCodes.rpc.methodNotFound, e),
      internal: (e) => R(I.errorCodes.rpc.internal, e),
      server: (e) => {
        if (!e || 'object' != typeof e || Array.isArray(e))
          throw new Error(
            'Ethereum RPC Server errors must provide single object argument.'
          )
        const { code: t } = e
        if (!Number.isInteger(t) || t > -32005 || t < -32099)
          throw new Error(
            '"code" must be an integer such that: -32099 <= code <= -32005'
          )
        return R(t, e)
      },
      invalidInput: (e) => R(I.errorCodes.rpc.invalidInput, e),
      resourceNotFound: (e) => R(I.errorCodes.rpc.resourceNotFound, e),
      resourceUnavailable: (e) => R(I.errorCodes.rpc.resourceUnavailable, e),
      transactionRejected: (e) => R(I.errorCodes.rpc.transactionRejected, e),
      methodNotSupported: (e) => R(I.errorCodes.rpc.methodNotSupported, e),
      limitExceeded: (e) => R(I.errorCodes.rpc.limitExceeded, e),
    },
    provider: {
      userRejectedRequest: (e) =>
        T(I.errorCodes.provider.userRejectedRequest, e),
      unauthorized: (e) => T(I.errorCodes.provider.unauthorized, e),
      unsupportedMethod: (e) => T(I.errorCodes.provider.unsupportedMethod, e),
      disconnected: (e) => T(I.errorCodes.provider.disconnected, e),
      chainDisconnected: (e) => T(I.errorCodes.provider.chainDisconnected, e),
      custom: (e) => {
        if (!e || 'object' != typeof e || Array.isArray(e))
          throw new Error(
            'Ethereum Provider custom errors must provide single object argument.'
          )
        const { code: t, message: n, data: r } = e
        if (!n || 'string' != typeof n)
          throw new Error('"message" must be a nonempty string')
        return new A.EthereumProviderError(t, n, r)
      },
    },
  }),
    (function (e) {
      Object.defineProperty(e, '__esModule', { value: !0 }),
        (e.getMessageFromCode =
          e.serializeError =
          e.EthereumProviderError =
          e.EthereumRpcError =
          e.ethErrors =
          e.errorCodes =
            void 0)
      const t = u
      Object.defineProperty(e, 'EthereumRpcError', {
        enumerable: !0,
        get: function () {
          return t.EthereumRpcError
        },
      }),
        Object.defineProperty(e, 'EthereumProviderError', {
          enumerable: !0,
          get: function () {
            return t.EthereumProviderError
          },
        })
      const n = k
      Object.defineProperty(e, 'serializeError', {
        enumerable: !0,
        get: function () {
          return n.serializeError
        },
      }),
        Object.defineProperty(e, 'getMessageFromCode', {
          enumerable: !0,
          get: function () {
            return n.getMessageFromCode
          },
        })
      const r = O
      Object.defineProperty(e, 'ethErrors', {
        enumerable: !0,
        get: function () {
          return r.ethErrors
        },
      })
      const i = L
      Object.defineProperty(e, 'errorCodes', {
        enumerable: !0,
        get: function () {
          return i.errorCodes
        },
      })
    })(c)
  var j,
    P = {},
    U = { exports: {} },
    D = 'object' == typeof Reflect ? Reflect : null,
    z =
      D && 'function' == typeof D.apply
        ? D.apply
        : function (e, t, n) {
            return Function.prototype.apply.call(e, t, n)
          }
  j =
    D && 'function' == typeof D.ownKeys
      ? D.ownKeys
      : Object.getOwnPropertySymbols
      ? function (e) {
          return Object.getOwnPropertyNames(e).concat(
            Object.getOwnPropertySymbols(e)
          )
        }
      : function (e) {
          return Object.getOwnPropertyNames(e)
        }
  var F =
    Number.isNaN ||
    function (e) {
      return e != e
    }
  function H() {
    H.init.call(this)
  }
  ;(U.exports = H),
    (U.exports.once = function (e, t) {
      return new Promise(function (n, r) {
        function i(n) {
          e.removeListener(t, o), r(n)
        }
        function o() {
          'function' == typeof e.removeListener && e.removeListener('error', i),
            n([].slice.call(arguments))
        }
        K(e, t, o, { once: !0 }),
          'error' !== t &&
            (function (e, t, n) {
              'function' == typeof e.on && K(e, 'error', t, n)
            })(e, i, { once: !0 })
      })
    }),
    (H.EventEmitter = H),
    (H.prototype._events = void 0),
    (H.prototype._eventsCount = 0),
    (H.prototype._maxListeners = void 0)
  var B = 10
  function q(e) {
    if ('function' != typeof e)
      throw new TypeError(
        'The "listener" argument must be of type Function. Received type ' +
          typeof e
      )
  }
  function W(e) {
    return void 0 === e._maxListeners ? H.defaultMaxListeners : e._maxListeners
  }
  function $(e, t, n, r) {
    var i, o, s, a
    if (
      (q(n),
      void 0 === (o = e._events)
        ? ((o = e._events = Object.create(null)), (e._eventsCount = 0))
        : (void 0 !== o.newListener &&
            (e.emit('newListener', t, n.listener ? n.listener : n),
            (o = e._events)),
          (s = o[t])),
      void 0 === s)
    )
      (s = o[t] = n), ++e._eventsCount
    else if (
      ('function' == typeof s
        ? (s = o[t] = r ? [n, s] : [s, n])
        : r
        ? s.unshift(n)
        : s.push(n),
      (i = W(e)) > 0 && s.length > i && !s.warned)
    ) {
      s.warned = !0
      var c = new Error(
        'Possible EventEmitter memory leak detected. ' +
          s.length +
          ' ' +
          String(t) +
          ' listeners added. Use emitter.setMaxListeners() to increase limit'
      )
      ;(c.name = 'MaxListenersExceededWarning'),
        (c.emitter = e),
        (c.type = t),
        (c.count = s.length),
        (a = c),
        console && console.warn && console.warn(a)
    }
    return e
  }
  function G() {
    if (!this.fired)
      return (
        this.target.removeListener(this.type, this.wrapFn),
        (this.fired = !0),
        0 === arguments.length
          ? this.listener.call(this.target)
          : this.listener.apply(this.target, arguments)
      )
  }
  function Z(e, t, n) {
    var r = { fired: !1, wrapFn: void 0, target: e, type: t, listener: n },
      i = G.bind(r)
    return (i.listener = n), (r.wrapFn = i), i
  }
  function V(e, t, n) {
    var r = e._events
    if (void 0 === r) return []
    var i = r[t]
    return void 0 === i
      ? []
      : 'function' == typeof i
      ? n
        ? [i.listener || i]
        : [i]
      : n
      ? (function (e) {
          for (var t = new Array(e.length), n = 0; n < t.length; ++n)
            t[n] = e[n].listener || e[n]
          return t
        })(i)
      : Y(i, i.length)
  }
  function J(e) {
    var t = this._events
    if (void 0 !== t) {
      var n = t[e]
      if ('function' == typeof n) return 1
      if (void 0 !== n) return n.length
    }
    return 0
  }
  function Y(e, t) {
    for (var n = new Array(t), r = 0; r < t; ++r) n[r] = e[r]
    return n
  }
  function K(e, t, n, r) {
    if ('function' == typeof e.on) r.once ? e.once(t, n) : e.on(t, n)
    else {
      if ('function' != typeof e.addEventListener)
        throw new TypeError(
          'The "emitter" argument must be of type EventEmitter. Received type ' +
            typeof e
        )
      e.addEventListener(t, function i(o) {
        r.once && e.removeEventListener(t, i), n(o)
      })
    }
  }
  Object.defineProperty(H, 'defaultMaxListeners', {
    enumerable: !0,
    get: function () {
      return B
    },
    set: function (e) {
      if ('number' != typeof e || e < 0 || F(e))
        throw new RangeError(
          'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
            e +
            '.'
        )
      B = e
    },
  }),
    (H.init = function () {
      ;(void 0 !== this._events &&
        this._events !== Object.getPrototypeOf(this)._events) ||
        ((this._events = Object.create(null)), (this._eventsCount = 0)),
        (this._maxListeners = this._maxListeners || void 0)
    }),
    (H.prototype.setMaxListeners = function (e) {
      if ('number' != typeof e || e < 0 || F(e))
        throw new RangeError(
          'The value of "n" is out of range. It must be a non-negative number. Received ' +
            e +
            '.'
        )
      return (this._maxListeners = e), this
    }),
    (H.prototype.getMaxListeners = function () {
      return W(this)
    }),
    (H.prototype.emit = function (e) {
      for (var t = [], n = 1; n < arguments.length; n++) t.push(arguments[n])
      var r = 'error' === e,
        i = this._events
      if (void 0 !== i) r = r && void 0 === i.error
      else if (!r) return !1
      if (r) {
        var o
        if ((t.length > 0 && (o = t[0]), o instanceof Error)) throw o
        var s = new Error(
          'Unhandled error.' + (o ? ' (' + o.message + ')' : '')
        )
        throw ((s.context = o), s)
      }
      var a = i[e]
      if (void 0 === a) return !1
      if ('function' == typeof a) z(a, this, t)
      else {
        var c = a.length,
          u = Y(a, c)
        for (n = 0; n < c; ++n) z(u[n], this, t)
      }
      return !0
    }),
    (H.prototype.addListener = function (e, t) {
      return $(this, e, t, !1)
    }),
    (H.prototype.on = H.prototype.addListener),
    (H.prototype.prependListener = function (e, t) {
      return $(this, e, t, !0)
    }),
    (H.prototype.once = function (e, t) {
      return q(t), this.on(e, Z(this, e, t)), this
    }),
    (H.prototype.prependOnceListener = function (e, t) {
      return q(t), this.prependListener(e, Z(this, e, t)), this
    }),
    (H.prototype.removeListener = function (e, t) {
      var n, r, i, o, s
      if ((q(t), void 0 === (r = this._events))) return this
      if (void 0 === (n = r[e])) return this
      if (n === t || n.listener === t)
        0 == --this._eventsCount
          ? (this._events = Object.create(null))
          : (delete r[e],
            r.removeListener && this.emit('removeListener', e, n.listener || t))
      else if ('function' != typeof n) {
        for (i = -1, o = n.length - 1; o >= 0; o--)
          if (n[o] === t || n[o].listener === t) {
            ;(s = n[o].listener), (i = o)
            break
          }
        if (i < 0) return this
        0 === i
          ? n.shift()
          : (function (e, t) {
              for (; t + 1 < e.length; t++) e[t] = e[t + 1]
              e.pop()
            })(n, i),
          1 === n.length && (r[e] = n[0]),
          void 0 !== r.removeListener && this.emit('removeListener', e, s || t)
      }
      return this
    }),
    (H.prototype.off = H.prototype.removeListener),
    (H.prototype.removeAllListeners = function (e) {
      var t, n, r
      if (void 0 === (n = this._events)) return this
      if (void 0 === n.removeListener)
        return (
          0 === arguments.length
            ? ((this._events = Object.create(null)), (this._eventsCount = 0))
            : void 0 !== n[e] &&
              (0 == --this._eventsCount
                ? (this._events = Object.create(null))
                : delete n[e]),
          this
        )
      if (0 === arguments.length) {
        var i,
          o = Object.keys(n)
        for (r = 0; r < o.length; ++r)
          'removeListener' !== (i = o[r]) && this.removeAllListeners(i)
        return (
          this.removeAllListeners('removeListener'),
          (this._events = Object.create(null)),
          (this._eventsCount = 0),
          this
        )
      }
      if ('function' == typeof (t = n[e])) this.removeListener(e, t)
      else if (void 0 !== t)
        for (r = t.length - 1; r >= 0; r--) this.removeListener(e, t[r])
      return this
    }),
    (H.prototype.listeners = function (e) {
      return V(this, e, !0)
    }),
    (H.prototype.rawListeners = function (e) {
      return V(this, e, !1)
    }),
    (H.listenerCount = function (e, t) {
      return 'function' == typeof e.listenerCount
        ? e.listenerCount(t)
        : J.call(e, t)
    }),
    (H.prototype.listenerCount = J),
    (H.prototype.eventNames = function () {
      return this._eventsCount > 0 ? j(this._events) : []
    }),
    Object.defineProperty(P, '__esModule', { value: !0 })
  const X = U.exports
  function Q(e, t, n) {
    try {
      Reflect.apply(e, t, n)
    } catch (e) {
      setTimeout(() => {
        throw e
      })
    }
  }
  class ee extends X.EventEmitter {
    emit(e, ...t) {
      let n = 'error' === e
      const r = this._events
      if (void 0 !== r) n = n && void 0 === r.error
      else if (!n) return !1
      if (n) {
        let e
        if ((t.length > 0 && ([e] = t), e instanceof Error)) throw e
        const n = new Error('Unhandled error.' + (e ? ` (${e.message})` : ''))
        throw ((n.context = e), n)
      }
      const i = r[e]
      if (void 0 === i) return !1
      if ('function' == typeof i) Q(i, this, t)
      else {
        const e = i.length,
          n = (function (e) {
            const t = e.length,
              n = new Array(t)
            for (let r = 0; r < t; r += 1) n[r] = e[r]
            return n
          })(i)
        for (let r = 0; r < e; r += 1) Q(n[r], this, t)
      }
      return !0
    }
  }
  var te = (P.default = ee)
  class ne extends Error {
    constructor(e, t) {
      super(e), (this.message = t)
    }
  }
  const re = new ne('user_not_logged_in', 'User is not logged in'),
    ie = new ne(
      'wallet_not_initialized',
      'Wallet is not initialized. Please run `await wallet.init(...)` before calling functions'
    )
  new ne('invalid_constructor_params', 'App Id is invalid.')
  const oe = { NOTSET: 0, DEBUG: 1, INFO: 2, WARNING: 3, ERROR: 4, NOLOGS: 5 },
    se = {}
  let ae = oe.NOLOGS,
    ce = null
  const ue = (e) => {
      ae = e
    },
    le = (e) => (se[e] || (se[e] = new de(ae, e)), se[e])
  class de {
    constructor(e, t) {
      ;(this.logLevel = e),
        (this.prefix = '[ARCANA_AUTH]'),
        t && (this.prefix += `[${t}]`)
    }
    log(e, t, n = {}) {
      this.internalLog(oe[e], t, n)
    }
    info(e, t = {}) {
      this.internalLog(oe.INFO, e, t)
    }
    debug(e, t = {}) {
      this.internalLog(oe.DEBUG, e, t)
    }
    warn(e, t = {}) {
      this.internalLog(oe.WARNING, e, t)
    }
    error(e, t = {}) {
      var n
      t instanceof Error &&
        this.internalLog(oe.ERROR, e, `${t.name}: ${t.message}: ${t.stack}`),
        this.internalLog(oe.ERROR, e, t),
        (n = JSON.stringify({ message: e, params: t })),
        ce && ce(n)
    }
    internalLog(e, t, n) {
      const r = `${this.prefix} - ${this.getLogLevelName(
        e
      )} ${this.getTime()} ${t} \n[PARAMS]: ${JSON.stringify(n)}\n          `
      this.consoleLog(e, r)
    }
    getLogLevelName(e) {
      switch (e) {
        case oe.DEBUG:
          return 'DEBUG'
        case oe.INFO:
          return 'INFO'
        case oe.WARNING:
          return 'WARN'
        case oe.ERROR:
          return 'ERROR'
        default:
          return 'NOTSET'
      }
    }
    getTime() {
      return new Date().toLocaleTimeString()
    }
    consoleLog(e, t) {
      if (!(e < this.logLevel))
        switch (e) {
          case oe.DEBUG:
            console.debug(t)
            break
          case oe.WARNING:
            console.warn(t)
            break
          case oe.ERROR:
            console.error(t)
            break
          case oe.INFO:
            console.info(t)
            break
          default:
            console.log(t)
        }
    }
  }
  var pe, he, fe
  !(function (e) {
    ;(e[(e.CREATED = 0)] = 'CREATED'),
      (e[(e.RUNNING = 1)] = 'RUNNING'),
      (e[(e.DONE = 2)] = 'DONE')
  })(pe || (pe = {})),
    (function (e) {
      ;(e[(e.NoUI = 0)] = 'NoUI'), (e[(e.UI = 1)] = 'UI')
    })(he || (he = {})),
    (e.AppMode = void 0),
    ((fe = e.AppMode || (e.AppMode = {}))[(fe.NoUI = 0)] = 'NoUI'),
    (fe[(fe.Widget = 1)] = 'Widget'),
    (fe[(fe.Full = 2)] = 'Full')
  const ge = {
    [he.UI]: [e.AppMode.Widget, e.AppMode.Full],
    [he.NoUI]: [e.AppMode.NoUI],
  }
  var ve
  !(function (e) {
    ;(e.Fatal = 'fatal'),
      (e.Error = 'error'),
      (e.Warning = 'warning'),
      (e.Log = 'log'),
      (e.Info = 'info'),
      (e.Debug = 'debug'),
      (e.Critical = 'critical')
  })(ve || (ve = {}))
  var _e,
    me,
    ye = { exports: {} },
    be = (ye.exports = {})
  function we() {
    throw new Error('setTimeout has not been defined')
  }
  function xe() {
    throw new Error('clearTimeout has not been defined')
  }
  function Ee(e) {
    if (_e === setTimeout) return setTimeout(e, 0)
    if ((_e === we || !_e) && setTimeout)
      return (_e = setTimeout), setTimeout(e, 0)
    try {
      return _e(e, 0)
    } catch (t) {
      try {
        return _e.call(null, e, 0)
      } catch (t) {
        return _e.call(this, e, 0)
      }
    }
  }
  !(function () {
    try {
      _e = 'function' == typeof setTimeout ? setTimeout : we
    } catch (e) {
      _e = we
    }
    try {
      me = 'function' == typeof clearTimeout ? clearTimeout : xe
    } catch (e) {
      me = xe
    }
  })()
  var Se,
    Ce = [],
    ke = !1,
    Le = -1
  function Oe() {
    ke &&
      Se &&
      ((ke = !1),
      Se.length ? (Ce = Se.concat(Ce)) : (Le = -1),
      Ce.length && Ae())
  }
  function Ae() {
    if (!ke) {
      var e = Ee(Oe)
      ke = !0
      for (var t = Ce.length; t; ) {
        for (Se = Ce, Ce = []; ++Le < t; ) Se && Se[Le].run()
        ;(Le = -1), (t = Ce.length)
      }
      ;(Se = null),
        (ke = !1),
        (function (e) {
          if (me === clearTimeout) return clearTimeout(e)
          if ((me === xe || !me) && clearTimeout)
            return (me = clearTimeout), clearTimeout(e)
          try {
            me(e)
          } catch (t) {
            try {
              return me.call(null, e)
            } catch (t) {
              return me.call(this, e)
            }
          }
        })(e)
    }
  }
  function Ne(e, t) {
    ;(this.fun = e), (this.array = t)
  }
  function Ie() {}
  function Re() {
    return (
      !(
        'undefined' != typeof __SENTRY_BROWSER_BUNDLE__ &&
        __SENTRY_BROWSER_BUNDLE__
      ) &&
      '[object process]' ===
        Object.prototype.toString.call(void 0 !== ye.exports ? ye.exports : 0)
    )
  }
  ;(be.nextTick = function (e) {
    var t = new Array(arguments.length - 1)
    if (arguments.length > 1)
      for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n]
    Ce.push(new Ne(e, t)), 1 !== Ce.length || ke || Ee(Ae)
  }),
    (Ne.prototype.run = function () {
      this.fun.apply(null, this.array)
    }),
    (be.title = 'browser'),
    (be.browser = !0),
    (be.env = {}),
    (be.argv = []),
    (be.version = ''),
    (be.versions = {}),
    (be.on = Ie),
    (be.addListener = Ie),
    (be.once = Ie),
    (be.off = Ie),
    (be.removeListener = Ie),
    (be.removeAllListeners = Ie),
    (be.emit = Ie),
    (be.prependListener = Ie),
    (be.prependOnceListener = Ie),
    (be.listeners = function (e) {
      return []
    }),
    (be.binding = function (e) {
      throw new Error('process.binding is not supported')
    }),
    (be.cwd = function () {
      return '/'
    }),
    (be.chdir = function (e) {
      throw new Error('process.chdir is not supported')
    }),
    (be.umask = function () {
      return 0
    })
  var Te = {}
  function Me() {
    return Re()
      ? global
      : 'undefined' != typeof window
      ? window
      : 'undefined' != typeof self
      ? self
      : Te
  }
  function je(e, t, n) {
    var r = n || Me(),
      i = (r.__SENTRY__ = r.__SENTRY__ || {})
    return i[e] || (i[e] = t())
  }
  var Pe = Object.prototype.toString
  function Ue(e) {
    switch (Pe.call(e)) {
      case '[object Error]':
      case '[object Exception]':
      case '[object DOMException]':
        return !0
      default:
        return Ge(e, Error)
    }
  }
  function De(e, t) {
    return Pe.call(e) === '[object ' + t + ']'
  }
  function ze(e) {
    return De(e, 'ErrorEvent')
  }
  function Fe(e) {
    return De(e, 'DOMError')
  }
  function He(e) {
    return De(e, 'String')
  }
  function Be(e) {
    return null === e || ('object' != typeof e && 'function' != typeof e)
  }
  function qe(e) {
    return De(e, 'Object')
  }
  function We(e) {
    return 'undefined' != typeof Event && Ge(e, Event)
  }
  function $e(e) {
    return Boolean(e && e.then && 'function' == typeof e.then)
  }
  function Ge(e, t) {
    try {
      return e instanceof t
    } catch (e) {
      return !1
    }
  }
  function Ze(e, t) {
    try {
      for (
        var n = e, r = [], i = 0, o = 0, s = ' > '.length, a = void 0;
        n &&
        i++ < 5 &&
        !(
          'html' === (a = Ve(n, t)) ||
          (i > 1 && o + r.length * s + a.length >= 80)
        );

      )
        r.push(a), (o += a.length), (n = n.parentNode)
      return r.reverse().join(' > ')
    } catch (e) {
      return '<unknown>'
    }
  }
  function Ve(e, t) {
    var n,
      r,
      i,
      o,
      s,
      a = e,
      c = []
    if (!a || !a.tagName) return ''
    c.push(a.tagName.toLowerCase())
    var u =
      t && t.length
        ? t
            .filter(function (e) {
              return a.getAttribute(e)
            })
            .map(function (e) {
              return [e, a.getAttribute(e)]
            })
        : null
    if (u && u.length)
      u.forEach(function (e) {
        c.push('[' + e[0] + '="' + e[1] + '"]')
      })
    else if ((a.id && c.push('#' + a.id), (n = a.className) && He(n)))
      for (r = n.split(/\s+/), s = 0; s < r.length; s++) c.push('.' + r[s])
    var l = ['type', 'name', 'title', 'alt']
    for (s = 0; s < l.length; s++)
      (i = l[s]), (o = a.getAttribute(i)) && c.push('[' + i + '="' + o + '"]')
    return c.join('')
  }
  var Je =
    Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array
      ? function (e, t) {
          return (e.__proto__ = t), e
        }
      : function (e, t) {
          for (var n in t)
            Object.prototype.hasOwnProperty.call(e, n) || (e[n] = t[n])
          return e
        })
  var Ye = (function (e) {
      function t(t) {
        var n = this.constructor,
          r = e.call(this, t) || this
        return (
          (r.message = t),
          (r.name = n.prototype.constructor.name),
          Je(r, n.prototype),
          r
        )
      }
      return n(t, e), t
    })(Error),
    Ke = 'undefined' == typeof __SENTRY_DEBUG__ || __SENTRY_DEBUG__,
    Xe = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+))?@)([\w.-]+)(?::(\d+))?\/(.+)/
  function Qe(e, t) {
    void 0 === t && (t = !1)
    var n = e.host,
      r = e.path,
      i = e.pass,
      o = e.port,
      s = e.projectId
    return (
      e.protocol +
      '://' +
      e.publicKey +
      (t && i ? ':' + i : '') +
      '@' +
      n +
      (o ? ':' + o : '') +
      '/' +
      (r ? r + '/' : r) +
      s
    )
  }
  function et(e) {
    return (
      'user' in e && !('publicKey' in e) && (e.publicKey = e.user),
      {
        user: e.publicKey || '',
        protocol: e.protocol,
        publicKey: e.publicKey || '',
        pass: e.pass || '',
        host: e.host,
        port: e.port || '',
        path: e.path || '',
        projectId: e.projectId,
      }
    )
  }
  function tt(e) {
    var t =
      'string' == typeof e
        ? (function (e) {
            var t = Xe.exec(e)
            if (!t) throw new Ye('Invalid Sentry Dsn: ' + e)
            var n = s(t.slice(1), 6),
              r = n[0],
              i = n[1],
              o = n[2],
              a = void 0 === o ? '' : o,
              c = n[3],
              u = n[4],
              l = void 0 === u ? '' : u,
              d = '',
              p = n[5],
              h = p.split('/')
            if (
              (h.length > 1 && ((d = h.slice(0, -1).join('/')), (p = h.pop())),
              p)
            ) {
              var f = p.match(/^\d+/)
              f && (p = f[0])
            }
            return et({
              host: c,
              pass: a,
              path: d,
              projectId: p,
              port: l,
              protocol: r,
              publicKey: i,
            })
          })(e)
        : et(e)
    return (
      (function (e) {
        if (Ke) {
          var t = e.port,
            n = e.projectId,
            r = e.protocol
          if (
            (['protocol', 'publicKey', 'host', 'projectId'].forEach(function (
              t
            ) {
              if (!e[t]) throw new Ye('Invalid Sentry Dsn: ' + t + ' missing')
            }),
            !n.match(/^\d+$/))
          )
            throw new Ye('Invalid Sentry Dsn: Invalid projectId ' + n)
          if (
            !(function (e) {
              return 'http' === e || 'https' === e
            })(r)
          )
            throw new Ye('Invalid Sentry Dsn: Invalid protocol ' + r)
          if (t && isNaN(parseInt(t, 10)))
            throw new Ye('Invalid Sentry Dsn: Invalid port ' + t)
        }
      })(t),
      t
    )
  }
  var nt,
    rt = ['fatal', 'error', 'warning', 'log', 'info', 'debug', 'critical'],
    it = Me(),
    ot = 'Sentry Logger ',
    st = ['debug', 'info', 'warn', 'error', 'log', 'assert']
  function at(e) {
    var t = Me()
    if (!('console' in t)) return e()
    var n = t.console,
      r = {}
    st.forEach(function (e) {
      var i = n[e] && n[e].__sentry_original__
      e in t.console && i && ((r[e] = n[e]), (n[e] = i))
    })
    try {
      return e()
    } finally {
      Object.keys(r).forEach(function (e) {
        n[e] = r[e]
      })
    }
  }
  function ct() {
    var e = !1,
      t = {
        enable: function () {
          e = !0
        },
        disable: function () {
          e = !1
        },
      }
    return (
      Ke
        ? st.forEach(function (n) {
            t[n] = function () {
              for (var t = [], r = 0; r < arguments.length; r++)
                t[r] = arguments[r]
              e &&
                at(function () {
                  var e
                  ;(e = it.console)[n].apply(e, a([ot + '[' + n + ']:'], t))
                })
            }
          })
        : st.forEach(function (e) {
            t[e] = function () {}
          }),
      t
    )
  }
  function ut(e, t) {
    return (
      void 0 === t && (t = 0),
      'string' != typeof e || 0 === t || e.length <= t
        ? e
        : e.substr(0, t) + '...'
    )
  }
  function lt(e, t) {
    if (!Array.isArray(e)) return ''
    for (var n = [], r = 0; r < e.length; r++) {
      var i = e[r]
      try {
        n.push(String(i))
      } catch (e) {
        n.push('[value cannot be serialized]')
      }
    }
    return n.join(t)
  }
  function dt(e, t) {
    return (
      !!He(e) &&
      (De(t, 'RegExp')
        ? t.test(e)
        : 'string' == typeof t && -1 !== e.indexOf(t))
    )
  }
  function pt(e, t, n) {
    if (t in e) {
      var r = e[t],
        i = n(r)
      if ('function' == typeof i)
        try {
          ft(i, r)
        } catch (e) {}
      e[t] = i
    }
  }
  function ht(e, t, n) {
    Object.defineProperty(e, t, { value: n, writable: !0, configurable: !0 })
  }
  function ft(e, t) {
    var n = t.prototype || {}
    ;(e.prototype = t.prototype = n), ht(e, '__sentry_original__', t)
  }
  function gt(e) {
    return e.__sentry_original__
  }
  function vt(e) {
    var t = e
    if (Ue(e))
      t = r({ message: e.message, name: e.name, stack: e.stack }, mt(e))
    else if (We(e)) {
      var n = e
      ;(t = r(
        {
          type: n.type,
          target: _t(n.target),
          currentTarget: _t(n.currentTarget),
        },
        mt(n)
      )),
        'undefined' != typeof CustomEvent &&
          Ge(e, CustomEvent) &&
          (t.detail = n.detail)
    }
    return t
  }
  function _t(e) {
    try {
      return (
        (t = e),
        'undefined' != typeof Element && Ge(t, Element)
          ? Ze(e)
          : Object.prototype.toString.call(e)
      )
    } catch (e) {
      return '<unknown>'
    }
    var t
  }
  function mt(e) {
    var t = {}
    for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n])
    return t
  }
  function yt(e, t) {
    void 0 === t && (t = 40)
    var n = Object.keys(vt(e))
    if ((n.sort(), !n.length)) return '[object has no keys]'
    if (n[0].length >= t) return ut(n[0], t)
    for (var r = n.length; r > 0; r--) {
      var i = n.slice(0, r).join(', ')
      if (!(i.length > t)) return r === n.length ? i : ut(i, t)
    }
    return ''
  }
  function bt(e) {
    var t, n
    if (qe(e)) {
      var r = {}
      try {
        for (var i = o(Object.keys(e)), s = i.next(); !s.done; s = i.next()) {
          var a = s.value
          void 0 !== e[a] && (r[a] = bt(e[a]))
        }
      } catch (e) {
        t = { error: e }
      } finally {
        try {
          s && !s.done && (n = i.return) && n.call(i)
        } finally {
          if (t) throw t.error
        }
      }
      return r
    }
    return Array.isArray(e) ? e.map(bt) : e
  }
  nt = Ke ? je('logger', ct) : ct()
  function wt(e) {
    if (!e.length) return []
    var t = e,
      n = t[0].function || '',
      i = t[t.length - 1].function || ''
    return (
      (-1 === n.indexOf('captureMessage') &&
        -1 === n.indexOf('captureException')) ||
        (t = t.slice(1)),
      -1 !== i.indexOf('sentryWrapped') && (t = t.slice(0, -1)),
      t
        .slice(0, 50)
        .map(function (e) {
          return r(r({}, e), {
            filename: e.filename || t[0].filename,
            function: e.function || '?',
          })
        })
        .reverse()
    )
  }
  var xt = '<anonymous>'
  function Et(e) {
    try {
      return (e && 'function' == typeof e && e.name) || xt
    } catch (e) {
      return xt
    }
  }
  function St() {
    if (!('fetch' in Me())) return !1
    try {
      return new Headers(), new Request(''), new Response(), !0
    } catch (e) {
      return !1
    }
  }
  function Ct(e) {
    return (
      e && /^function fetch\(\)\s+\{\s+\[native code\]\s+\}$/.test(e.toString())
    )
  }
  function kt() {
    if (!St()) return !1
    try {
      return new Request('_', { referrerPolicy: 'origin' }), !0
    } catch (e) {
      return !1
    }
  }
  var Lt,
    Ot = Me(),
    At = {},
    Nt = {}
  function It(e) {
    if (!Nt[e])
      switch (((Nt[e] = !0), e)) {
        case 'console':
          !(function () {
            if (!('console' in Ot)) return
            st.forEach(function (e) {
              e in Ot.console &&
                pt(Ot.console, e, function (t) {
                  return function () {
                    for (var n = [], r = 0; r < arguments.length; r++)
                      n[r] = arguments[r]
                    Tt('console', { args: n, level: e }),
                      t && t.apply(Ot.console, n)
                  }
                })
            })
          })()
          break
        case 'dom':
          !(function () {
            if (!('document' in Ot)) return
            var e = Tt.bind(null, 'dom'),
              t = Dt(e, !0)
            Ot.document.addEventListener('click', t, !1),
              Ot.document.addEventListener('keypress', t, !1),
              ['EventTarget', 'Node'].forEach(function (t) {
                var n = Ot[t] && Ot[t].prototype
                n &&
                  n.hasOwnProperty &&
                  n.hasOwnProperty('addEventListener') &&
                  (pt(n, 'addEventListener', function (t) {
                    return function (n, r, i) {
                      if ('click' === n || 'keypress' == n)
                        try {
                          var o = this,
                            s = (o.__sentry_instrumentation_handlers__ =
                              o.__sentry_instrumentation_handlers__ || {}),
                            a = (s[n] = s[n] || { refCount: 0 })
                          if (!a.handler) {
                            var c = Dt(e)
                            ;(a.handler = c), t.call(this, n, c, i)
                          }
                          a.refCount += 1
                        } catch (e) {}
                      return t.call(this, n, r, i)
                    }
                  }),
                  pt(n, 'removeEventListener', function (e) {
                    return function (t, n, r) {
                      if ('click' === t || 'keypress' == t)
                        try {
                          var i = this,
                            o = i.__sentry_instrumentation_handlers__ || {},
                            s = o[t]
                          s &&
                            ((s.refCount -= 1),
                            s.refCount <= 0 &&
                              (e.call(this, t, s.handler, r),
                              (s.handler = void 0),
                              delete o[t]),
                            0 === Object.keys(o).length &&
                              delete i.__sentry_instrumentation_handlers__)
                        } catch (e) {}
                      return e.call(this, t, n, r)
                    }
                  }))
              })
          })()
          break
        case 'xhr':
          !(function () {
            if (!('XMLHttpRequest' in Ot)) return
            var e = XMLHttpRequest.prototype
            pt(e, 'open', function (e) {
              return function () {
                for (var t = [], n = 0; n < arguments.length; n++)
                  t[n] = arguments[n]
                var r = this,
                  i = t[1],
                  o = (r.__sentry_xhr__ = {
                    method: He(t[0]) ? t[0].toUpperCase() : t[0],
                    url: t[1],
                  })
                He(i) &&
                  'POST' === o.method &&
                  i.match(/sentry_key/) &&
                  (r.__sentry_own_request__ = !0)
                var s = function () {
                  if (4 === r.readyState) {
                    try {
                      o.status_code = r.status
                    } catch (e) {}
                    Tt('xhr', {
                      args: t,
                      endTimestamp: Date.now(),
                      startTimestamp: Date.now(),
                      xhr: r,
                    })
                  }
                }
                return (
                  'onreadystatechange' in r &&
                  'function' == typeof r.onreadystatechange
                    ? pt(r, 'onreadystatechange', function (e) {
                        return function () {
                          for (var t = [], n = 0; n < arguments.length; n++)
                            t[n] = arguments[n]
                          return s(), e.apply(r, t)
                        }
                      })
                    : r.addEventListener('readystatechange', s),
                  e.apply(r, t)
                )
              }
            }),
              pt(e, 'send', function (e) {
                return function () {
                  for (var t = [], n = 0; n < arguments.length; n++)
                    t[n] = arguments[n]
                  return (
                    this.__sentry_xhr__ &&
                      void 0 !== t[0] &&
                      (this.__sentry_xhr__.body = t[0]),
                    Tt('xhr', {
                      args: t,
                      startTimestamp: Date.now(),
                      xhr: this,
                    }),
                    e.apply(this, t)
                  )
                }
              })
          })()
          break
        case 'fetch':
          !(function () {
            if (
              !(function () {
                if (!St()) return !1
                var e = Me()
                if (Ct(e.fetch)) return !0
                var t = !1,
                  n = e.document
                if (n && 'function' == typeof n.createElement)
                  try {
                    var r = n.createElement('iframe')
                    ;(r.hidden = !0),
                      n.head.appendChild(r),
                      r.contentWindow &&
                        r.contentWindow.fetch &&
                        (t = Ct(r.contentWindow.fetch)),
                      n.head.removeChild(r)
                  } catch (e) {
                    Ke &&
                      nt.warn(
                        'Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ',
                        e
                      )
                  }
                return t
              })()
            )
              return
            pt(Ot, 'fetch', function (e) {
              return function () {
                for (var t = [], n = 0; n < arguments.length; n++)
                  t[n] = arguments[n]
                var i = {
                  args: t,
                  fetchData: { method: Mt(t), url: jt(t) },
                  startTimestamp: Date.now(),
                }
                return (
                  Tt('fetch', r({}, i)),
                  e.apply(Ot, t).then(
                    function (e) {
                      return (
                        Tt(
                          'fetch',
                          r(r({}, i), { endTimestamp: Date.now(), response: e })
                        ),
                        e
                      )
                    },
                    function (e) {
                      throw (
                        (Tt(
                          'fetch',
                          r(r({}, i), { endTimestamp: Date.now(), error: e })
                        ),
                        e)
                      )
                    }
                  )
                )
              }
            })
          })()
          break
        case 'history':
          !(function () {
            if (
              !(function () {
                var e = Me(),
                  t = e.chrome,
                  n = t && t.app && t.app.runtime,
                  r =
                    'history' in e &&
                    !!e.history.pushState &&
                    !!e.history.replaceState
                return !n && r
              })()
            )
              return
            var e = Ot.onpopstate
            function t(e) {
              return function () {
                for (var t = [], n = 0; n < arguments.length; n++)
                  t[n] = arguments[n]
                var r = t.length > 2 ? t[2] : void 0
                if (r) {
                  var i = Lt,
                    o = String(r)
                  ;(Lt = o), Tt('history', { from: i, to: o })
                }
                return e.apply(this, t)
              }
            }
            ;(Ot.onpopstate = function () {
              for (var t = [], n = 0; n < arguments.length; n++)
                t[n] = arguments[n]
              var r = Ot.location.href,
                i = Lt
              if (((Lt = r), Tt('history', { from: i, to: r }), e))
                try {
                  return e.apply(this, t)
                } catch (e) {}
            }),
              pt(Ot.history, 'pushState', t),
              pt(Ot.history, 'replaceState', t)
          })()
          break
        case 'error':
          ;(zt = Ot.onerror),
            (Ot.onerror = function (e, t, n, r, i) {
              return (
                Tt('error', { column: r, error: i, line: n, msg: e, url: t }),
                !!zt && zt.apply(this, arguments)
              )
            })
          break
        case 'unhandledrejection':
          ;(Ft = Ot.onunhandledrejection),
            (Ot.onunhandledrejection = function (e) {
              return (
                Tt('unhandledrejection', e), !Ft || Ft.apply(this, arguments)
              )
            })
          break
        default:
          return void (Ke && nt.warn('unknown instrumentation type:', e))
      }
  }
  function Rt(e, t) {
    ;(At[e] = At[e] || []), At[e].push(t), It(e)
  }
  function Tt(e, t) {
    var n, r
    if (e && At[e])
      try {
        for (var i = o(At[e] || []), s = i.next(); !s.done; s = i.next()) {
          var a = s.value
          try {
            a(t)
          } catch (t) {
            Ke &&
              nt.error(
                'Error while triggering instrumentation handler.\nType: ' +
                  e +
                  '\nName: ' +
                  Et(a) +
                  '\nError:',
                t
              )
          }
        }
      } catch (e) {
        n = { error: e }
      } finally {
        try {
          s && !s.done && (r = i.return) && r.call(i)
        } finally {
          if (n) throw n.error
        }
      }
  }
  function Mt(e) {
    return (
      void 0 === e && (e = []),
      'Request' in Ot && Ge(e[0], Request) && e[0].method
        ? String(e[0].method).toUpperCase()
        : e[1] && e[1].method
        ? String(e[1].method).toUpperCase()
        : 'GET'
    )
  }
  function jt(e) {
    return (
      void 0 === e && (e = []),
      'string' == typeof e[0]
        ? e[0]
        : 'Request' in Ot && Ge(e[0], Request)
        ? e[0].url
        : String(e[0])
    )
  }
  var Pt, Ut
  function Dt(e, t) {
    return (
      void 0 === t && (t = !1),
      function (n) {
        if (
          n &&
          Ut !== n &&
          !(function (e) {
            if ('keypress' !== e.type) return !1
            try {
              var t = e.target
              if (!t || !t.tagName) return !0
              if (
                'INPUT' === t.tagName ||
                'TEXTAREA' === t.tagName ||
                t.isContentEditable
              )
                return !1
            } catch (e) {}
            return !0
          })(n)
        ) {
          var r = 'keypress' === n.type ? 'input' : n.type
          ;(void 0 === Pt ||
            (function (e, t) {
              if (!e) return !0
              if (e.type !== t.type) return !0
              try {
                if (e.target !== t.target) return !0
              } catch (e) {}
              return !1
            })(Ut, n)) &&
            (e({ event: n, name: r, global: t }), (Ut = n)),
            clearTimeout(Pt),
            (Pt = Ot.setTimeout(function () {
              Pt = void 0
            }, 1e3))
        }
      }
    )
  }
  var zt = null
  var Ft = null
  function Ht() {
    var e = Me(),
      t = e.crypto || e.msCrypto
    if (void 0 !== t && t.getRandomValues) {
      var n = new Uint16Array(8)
      t.getRandomValues(n),
        (n[3] = (4095 & n[3]) | 16384),
        (n[4] = (16383 & n[4]) | 32768)
      var r = function (e) {
        for (var t = e.toString(16); t.length < 4; ) t = '0' + t
        return t
      }
      return (
        r(n[0]) +
        r(n[1]) +
        r(n[2]) +
        r(n[3]) +
        r(n[4]) +
        r(n[5]) +
        r(n[6]) +
        r(n[7])
      )
    }
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (e) {
      var t = (16 * Math.random()) | 0
      return ('x' === e ? t : (3 & t) | 8).toString(16)
    })
  }
  function Bt(e) {
    if (!e) return {}
    var t = e.match(
      /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/
    )
    if (!t) return {}
    var n = t[6] || '',
      r = t[8] || ''
    return { host: t[4], path: t[5], protocol: t[2], relative: t[5] + n + r }
  }
  function qt(e) {
    return e.exception && e.exception.values ? e.exception.values[0] : void 0
  }
  function Wt(e) {
    var t = e.message,
      n = e.event_id
    if (t) return t
    var r = qt(e)
    return r
      ? r.type && r.value
        ? r.type + ': ' + r.value
        : r.type || r.value || n || '<unknown>'
      : n || '<unknown>'
  }
  function $t(e, t, n) {
    var r = (e.exception = e.exception || {}),
      i = (r.values = r.values || []),
      o = (i[0] = i[0] || {})
    o.value || (o.value = t || ''), o.type || (o.type = n || 'Error')
  }
  function Gt(e, t) {
    var n = qt(e)
    if (n) {
      var i = n.mechanism
      if (
        ((n.mechanism = r(r(r({}, { type: 'generic', handled: !0 }), i), t)),
        t && 'data' in t)
      ) {
        var o = r(r({}, i && i.data), t.data)
        n.mechanism.data = o
      }
    }
  }
  function Zt(e) {
    if (e && e.__sentry_captured__) return !0
    try {
      ht(e, '__sentry_captured__', !0)
    } catch (e) {}
    return !1
  }
  function Vt(e, t, n) {
    void 0 === t && (t = 1 / 0), void 0 === n && (n = 1 / 0)
    try {
      return Yt('', e, t, n)
    } catch (e) {
      return { ERROR: '**non-serializable** (' + e + ')' }
    }
  }
  function Jt(e, t, n) {
    void 0 === t && (t = 3), void 0 === n && (n = 102400)
    var r,
      i = Vt(e, t)
    return (
      (r = i),
      (function (e) {
        return ~-encodeURI(e).split(/%..|./).length
      })(JSON.stringify(r)) > n
        ? Jt(e, t - 1, n)
        : i
    )
  }
  function Yt(e, t, n, r, i) {
    var o, a
    void 0 === n && (n = 1 / 0),
      void 0 === r && (r = 1 / 0),
      void 0 === i &&
        ((o = 'function' == typeof WeakSet),
        (a = o ? new WeakSet() : []),
        (i = [
          function (e) {
            if (o) return !!a.has(e) || (a.add(e), !1)
            for (var t = 0; t < a.length; t++) if (a[t] === e) return !0
            return a.push(e), !1
          },
          function (e) {
            if (o) a.delete(e)
            else
              for (var t = 0; t < a.length; t++)
                if (a[t] === e) {
                  a.splice(t, 1)
                  break
                }
          },
        ]))
    var c,
      u = s(i, 2),
      l = u[0],
      d = u[1],
      p = t
    if (p && 'function' == typeof p.toJSON)
      try {
        return p.toJSON()
      } catch (e) {}
    if (
      null === t ||
      (['number', 'boolean', 'string'].includes(typeof t) &&
        ('number' != typeof (c = t) || c == c))
    )
      return t
    var h = (function (e, t) {
      try {
        return 'domain' === e && t && 'object' == typeof t && t._events
          ? '[Domain]'
          : 'domainEmitter' === e
          ? '[DomainEmitter]'
          : 'undefined' != typeof global && t === global
          ? '[Global]'
          : 'undefined' != typeof window && t === window
          ? '[Window]'
          : 'undefined' != typeof document && t === document
          ? '[Document]'
          : (function (e) {
              return (
                qe(e) &&
                'nativeEvent' in e &&
                'preventDefault' in e &&
                'stopPropagation' in e
              )
            })(t)
          ? '[SyntheticEvent]'
          : 'number' == typeof t && t != t
          ? '[NaN]'
          : void 0 === t
          ? '[undefined]'
          : 'function' == typeof t
          ? '[Function: ' + Et(t) + ']'
          : 'symbol' == typeof t
          ? '[' + String(t) + ']'
          : 'bigint' == typeof t
          ? '[BigInt: ' + String(t) + ']'
          : '[object ' + Object.getPrototypeOf(t).constructor.name + ']'
      } catch (e) {
        return '**non-serializable** (' + e + ')'
      }
    })(e, t)
    if (!h.startsWith('[object ')) return h
    if (0 === n) return h.replace('object ', '')
    if (l(t)) return '[Circular ~]'
    var f = Array.isArray(t) ? [] : {},
      g = 0,
      v = Ue(t) || We(t) ? vt(t) : t
    for (var _ in v)
      if (Object.prototype.hasOwnProperty.call(v, _)) {
        if (g >= r) {
          f[_] = '[MaxProperties ~]'
          break
        }
        var m = v[_]
        ;(f[_] = Yt(_, m, n - 1, r, i)), (g += 1)
      }
    return d(t), f
  }
  function Kt(e) {
    return new Qt(function (t) {
      t(e)
    })
  }
  function Xt(e) {
    return new Qt(function (t, n) {
      n(e)
    })
  }
  var Qt = (function () {
    function e(e) {
      var t = this
      ;(this._state = 0),
        (this._handlers = []),
        (this._resolve = function (e) {
          t._setResult(1, e)
        }),
        (this._reject = function (e) {
          t._setResult(2, e)
        }),
        (this._setResult = function (e, n) {
          0 === t._state &&
            ($e(n)
              ? n.then(t._resolve, t._reject)
              : ((t._state = e), (t._value = n), t._executeHandlers()))
        }),
        (this._executeHandlers = function () {
          if (0 !== t._state) {
            var e = t._handlers.slice()
            ;(t._handlers = []),
              e.forEach(function (e) {
                e[0] ||
                  (1 === t._state && e[1](t._value),
                  2 === t._state && e[2](t._value),
                  (e[0] = !0))
              })
          }
        })
      try {
        e(this._resolve, this._reject)
      } catch (e) {
        this._reject(e)
      }
    }
    return (
      (e.prototype.then = function (t, n) {
        var r = this
        return new e(function (e, i) {
          r._handlers.push([
            !1,
            function (n) {
              if (t)
                try {
                  e(t(n))
                } catch (e) {
                  i(e)
                }
              else e(n)
            },
            function (t) {
              if (n)
                try {
                  e(n(t))
                } catch (e) {
                  i(e)
                }
              else i(t)
            },
          ]),
            r._executeHandlers()
        })
      }),
      (e.prototype.catch = function (e) {
        return this.then(function (e) {
          return e
        }, e)
      }),
      (e.prototype.finally = function (t) {
        var n = this
        return new e(function (e, r) {
          var i, o
          return n
            .then(
              function (e) {
                ;(o = !1), (i = e), t && t()
              },
              function (e) {
                ;(o = !0), (i = e), t && t()
              }
            )
            .then(function () {
              o ? r(i) : e(i)
            })
        })
      }),
      e
    )
  })()
  function en(e) {
    var t = []
    function n(e) {
      return t.splice(t.indexOf(e), 1)[0]
    }
    return {
      $: t,
      add: function (r) {
        if (!(void 0 === e || t.length < e))
          return Xt(new Ye('Not adding Promise due to buffer limit reached.'))
        var i = r()
        return (
          -1 === t.indexOf(i) && t.push(i),
          i
            .then(function () {
              return n(i)
            })
            .then(null, function () {
              return n(i).then(null, function () {})
            }),
          i
        )
      },
      drain: function (e) {
        return new Qt(function (n, r) {
          var i = t.length
          if (!i) return n(!0)
          var o = setTimeout(function () {
            e && e > 0 && n(!1)
          }, e)
          t.forEach(function (e) {
            Kt(e).then(function () {
              --i || (clearTimeout(o), n(!0))
            }, r)
          })
        })
      },
    }
  }
  function tn(e) {
    return 'warn' === e
      ? ve.Warning
      : (function (e) {
          return -1 !== rt.indexOf(e)
        })(e)
      ? e
      : ve.Log
  }
  function nn(e) {
    return e >= 200 && e < 300
      ? 'success'
      : 429 === e
      ? 'rate_limit'
      : e >= 400 && e < 500
      ? 'invalid'
      : e >= 500
      ? 'failed'
      : 'unknown'
  }
  var rn = {
    nowSeconds: function () {
      return Date.now() / 1e3
    },
  }
  var on = Re()
      ? (function () {
          try {
            return ((e = module), (t = 'perf_hooks'), e.require(t)).performance
          } catch (e) {
            return
          }
          var e, t
        })()
      : (function () {
          var e = Me().performance
          if (e && e.now)
            return {
              now: function () {
                return e.now()
              },
              timeOrigin: Date.now() - e.now(),
            }
        })(),
    sn =
      void 0 === on
        ? rn
        : {
            nowSeconds: function () {
              return (on.timeOrigin + on.now()) / 1e3
            },
          },
    an = rn.nowSeconds.bind(rn),
    cn = sn.nowSeconds.bind(sn)
  function un(e, t) {
    return void 0 === t && (t = []), [e, t]
  }
  function ln(e) {
    var t = s(e, 2),
      n = t[0],
      r = t[1],
      i = JSON.stringify(n)
    return r.reduce(function (e, t) {
      var n = s(t, 2),
        r = n[0],
        i = n[1],
        o = Be(i) ? String(i) : JSON.stringify(i)
      return e + '\n' + JSON.stringify(r) + '\n' + o
    }, i)
  }
  !(function () {
    var e = Me().performance
    if (e && e.now) {
      var t = 36e5,
        n = e.now(),
        r = Date.now(),
        i = e.timeOrigin ? Math.abs(e.timeOrigin + n - r) : t,
        o = i < t,
        s = e.timing && e.timing.navigationStart,
        a = 'number' == typeof s ? Math.abs(s + n - r) : t
      ;(o || a < t) && i <= a && e.timeOrigin
    }
  })()
  function dn(e, t) {
    return e[t] || e.all || 0
  }
  function pn(e, t, n) {
    return void 0 === n && (n = Date.now()), dn(e, t) > n
  }
  function hn(e, t, n) {
    var i, s, a, c
    void 0 === n && (n = Date.now())
    var u = r({}, e),
      l = t['x-sentry-rate-limits'],
      d = t['retry-after']
    if (l)
      try {
        for (
          var p = o(l.trim().split(',')), h = p.next();
          !h.done;
          h = p.next()
        ) {
          var f = h.value.split(':', 2),
            g = parseInt(f[0], 10),
            v = 1e3 * (isNaN(g) ? 60 : g)
          if (f[1])
            try {
              for (
                var _ = ((a = void 0), o(f[1].split(';'))), m = _.next();
                !m.done;
                m = _.next()
              ) {
                u[m.value] = n + v
              }
            } catch (e) {
              a = { error: e }
            } finally {
              try {
                m && !m.done && (c = _.return) && c.call(_)
              } finally {
                if (a) throw a.error
              }
            }
          else u.all = n + v
        }
      } catch (e) {
        i = { error: e }
      } finally {
        try {
          h && !h.done && (s = p.return) && s.call(p)
        } finally {
          if (i) throw i.error
        }
      }
    else
      d &&
        (u.all =
          n +
          (function (e, t) {
            void 0 === t && (t = Date.now())
            var n = parseInt('' + e, 10)
            if (!isNaN(n)) return 1e3 * n
            var r = Date.parse('' + e)
            return isNaN(r) ? 6e4 : r - t
          })(d, n))
    return u
  }
  var fn = (function () {
    function e() {
      ;(this._notifyingListeners = !1),
        (this._scopeListeners = []),
        (this._eventProcessors = []),
        (this._breadcrumbs = []),
        (this._user = {}),
        (this._tags = {}),
        (this._extra = {}),
        (this._contexts = {}),
        (this._sdkProcessingMetadata = {})
    }
    return (
      (e.clone = function (t) {
        var n = new e()
        return (
          t &&
            ((n._breadcrumbs = a(t._breadcrumbs)),
            (n._tags = r({}, t._tags)),
            (n._extra = r({}, t._extra)),
            (n._contexts = r({}, t._contexts)),
            (n._user = t._user),
            (n._level = t._level),
            (n._span = t._span),
            (n._session = t._session),
            (n._transactionName = t._transactionName),
            (n._fingerprint = t._fingerprint),
            (n._eventProcessors = a(t._eventProcessors)),
            (n._requestSession = t._requestSession)),
          n
        )
      }),
      (e.prototype.addScopeListener = function (e) {
        this._scopeListeners.push(e)
      }),
      (e.prototype.addEventProcessor = function (e) {
        return this._eventProcessors.push(e), this
      }),
      (e.prototype.setUser = function (e) {
        return (
          (this._user = e || {}),
          this._session && this._session.update({ user: e }),
          this._notifyScopeListeners(),
          this
        )
      }),
      (e.prototype.getUser = function () {
        return this._user
      }),
      (e.prototype.getRequestSession = function () {
        return this._requestSession
      }),
      (e.prototype.setRequestSession = function (e) {
        return (this._requestSession = e), this
      }),
      (e.prototype.setTags = function (e) {
        return (
          (this._tags = r(r({}, this._tags), e)),
          this._notifyScopeListeners(),
          this
        )
      }),
      (e.prototype.setTag = function (e, t) {
        var n
        return (
          (this._tags = r(r({}, this._tags), (((n = {})[e] = t), n))),
          this._notifyScopeListeners(),
          this
        )
      }),
      (e.prototype.setExtras = function (e) {
        return (
          (this._extra = r(r({}, this._extra), e)),
          this._notifyScopeListeners(),
          this
        )
      }),
      (e.prototype.setExtra = function (e, t) {
        var n
        return (
          (this._extra = r(r({}, this._extra), (((n = {})[e] = t), n))),
          this._notifyScopeListeners(),
          this
        )
      }),
      (e.prototype.setFingerprint = function (e) {
        return (this._fingerprint = e), this._notifyScopeListeners(), this
      }),
      (e.prototype.setLevel = function (e) {
        return (this._level = e), this._notifyScopeListeners(), this
      }),
      (e.prototype.setTransactionName = function (e) {
        return (this._transactionName = e), this._notifyScopeListeners(), this
      }),
      (e.prototype.setTransaction = function (e) {
        return this.setTransactionName(e)
      }),
      (e.prototype.setContext = function (e, t) {
        var n
        return (
          null === t
            ? delete this._contexts[e]
            : (this._contexts = r(
                r({}, this._contexts),
                (((n = {})[e] = t), n)
              )),
          this._notifyScopeListeners(),
          this
        )
      }),
      (e.prototype.setSpan = function (e) {
        return (this._span = e), this._notifyScopeListeners(), this
      }),
      (e.prototype.getSpan = function () {
        return this._span
      }),
      (e.prototype.getTransaction = function () {
        var e = this.getSpan()
        return e && e.transaction
      }),
      (e.prototype.setSession = function (e) {
        return (
          e ? (this._session = e) : delete this._session,
          this._notifyScopeListeners(),
          this
        )
      }),
      (e.prototype.getSession = function () {
        return this._session
      }),
      (e.prototype.update = function (t) {
        if (!t) return this
        if ('function' == typeof t) {
          var n = t(this)
          return n instanceof e ? n : this
        }
        return (
          t instanceof e
            ? ((this._tags = r(r({}, this._tags), t._tags)),
              (this._extra = r(r({}, this._extra), t._extra)),
              (this._contexts = r(r({}, this._contexts), t._contexts)),
              t._user && Object.keys(t._user).length && (this._user = t._user),
              t._level && (this._level = t._level),
              t._fingerprint && (this._fingerprint = t._fingerprint),
              t._requestSession && (this._requestSession = t._requestSession))
            : qe(t) &&
              ((this._tags = r(r({}, this._tags), t.tags)),
              (this._extra = r(r({}, this._extra), t.extra)),
              (this._contexts = r(r({}, this._contexts), t.contexts)),
              t.user && (this._user = t.user),
              t.level && (this._level = t.level),
              t.fingerprint && (this._fingerprint = t.fingerprint),
              t.requestSession && (this._requestSession = t.requestSession)),
          this
        )
      }),
      (e.prototype.clear = function () {
        return (
          (this._breadcrumbs = []),
          (this._tags = {}),
          (this._extra = {}),
          (this._user = {}),
          (this._contexts = {}),
          (this._level = void 0),
          (this._transactionName = void 0),
          (this._fingerprint = void 0),
          (this._requestSession = void 0),
          (this._span = void 0),
          (this._session = void 0),
          this._notifyScopeListeners(),
          this
        )
      }),
      (e.prototype.addBreadcrumb = function (e, t) {
        var n = 'number' == typeof t ? Math.min(t, 100) : 100
        if (n <= 0) return this
        var i = r({ timestamp: an() }, e)
        return (
          (this._breadcrumbs = a(this._breadcrumbs, [i]).slice(-n)),
          this._notifyScopeListeners(),
          this
        )
      }),
      (e.prototype.clearBreadcrumbs = function () {
        return (this._breadcrumbs = []), this._notifyScopeListeners(), this
      }),
      (e.prototype.applyToEvent = function (e, t) {
        if (
          (this._extra &&
            Object.keys(this._extra).length &&
            (e.extra = r(r({}, this._extra), e.extra)),
          this._tags &&
            Object.keys(this._tags).length &&
            (e.tags = r(r({}, this._tags), e.tags)),
          this._user &&
            Object.keys(this._user).length &&
            (e.user = r(r({}, this._user), e.user)),
          this._contexts &&
            Object.keys(this._contexts).length &&
            (e.contexts = r(r({}, this._contexts), e.contexts)),
          this._level && (e.level = this._level),
          this._transactionName && (e.transaction = this._transactionName),
          this._span)
        ) {
          e.contexts = r({ trace: this._span.getTraceContext() }, e.contexts)
          var n = this._span.transaction && this._span.transaction.name
          n && (e.tags = r({ transaction: n }, e.tags))
        }
        return (
          this._applyFingerprint(e),
          (e.breadcrumbs = a(e.breadcrumbs || [], this._breadcrumbs)),
          (e.breadcrumbs = e.breadcrumbs.length > 0 ? e.breadcrumbs : void 0),
          (e.sdkProcessingMetadata = this._sdkProcessingMetadata),
          this._notifyEventProcessors(a(gn(), this._eventProcessors), e, t)
        )
      }),
      (e.prototype.setSDKProcessingMetadata = function (e) {
        return (
          (this._sdkProcessingMetadata = r(
            r({}, this._sdkProcessingMetadata),
            e
          )),
          this
        )
      }),
      (e.prototype._notifyEventProcessors = function (e, t, n, i) {
        var o = this
        return (
          void 0 === i && (i = 0),
          new Qt(function (s, a) {
            var c = e[i]
            if (null === t || 'function' != typeof c) s(t)
            else {
              var u = c(r({}, t), n)
              $e(u)
                ? u
                    .then(function (t) {
                      return o._notifyEventProcessors(e, t, n, i + 1).then(s)
                    })
                    .then(null, a)
                : o
                    ._notifyEventProcessors(e, u, n, i + 1)
                    .then(s)
                    .then(null, a)
            }
          })
        )
      }),
      (e.prototype._notifyScopeListeners = function () {
        var e = this
        this._notifyingListeners ||
          ((this._notifyingListeners = !0),
          this._scopeListeners.forEach(function (t) {
            t(e)
          }),
          (this._notifyingListeners = !1))
      }),
      (e.prototype._applyFingerprint = function (e) {
        ;(e.fingerprint = e.fingerprint
          ? Array.isArray(e.fingerprint)
            ? e.fingerprint
            : [e.fingerprint]
          : []),
          this._fingerprint &&
            (e.fingerprint = e.fingerprint.concat(this._fingerprint)),
          e.fingerprint && !e.fingerprint.length && delete e.fingerprint
      }),
      e
    )
  })()
  function gn() {
    return je('globalEventProcessors', function () {
      return []
    })
  }
  function vn(e) {
    gn().push(e)
  }
  var _n = (function () {
      function e(e) {
        ;(this.errors = 0),
          (this.sid = Ht()),
          (this.duration = 0),
          (this.status = 'ok'),
          (this.init = !0),
          (this.ignoreDuration = !1)
        var t = cn()
        ;(this.timestamp = t), (this.started = t), e && this.update(e)
      }
      return (
        (e.prototype.update = function (e) {
          if (
            (void 0 === e && (e = {}),
            e.user &&
              (!this.ipAddress &&
                e.user.ip_address &&
                (this.ipAddress = e.user.ip_address),
              this.did ||
                e.did ||
                (this.did = e.user.id || e.user.email || e.user.username)),
            (this.timestamp = e.timestamp || cn()),
            e.ignoreDuration && (this.ignoreDuration = e.ignoreDuration),
            e.sid && (this.sid = 32 === e.sid.length ? e.sid : Ht()),
            void 0 !== e.init && (this.init = e.init),
            !this.did && e.did && (this.did = '' + e.did),
            'number' == typeof e.started && (this.started = e.started),
            this.ignoreDuration)
          )
            this.duration = void 0
          else if ('number' == typeof e.duration) this.duration = e.duration
          else {
            var t = this.timestamp - this.started
            this.duration = t >= 0 ? t : 0
          }
          e.release && (this.release = e.release),
            e.environment && (this.environment = e.environment),
            !this.ipAddress && e.ipAddress && (this.ipAddress = e.ipAddress),
            !this.userAgent && e.userAgent && (this.userAgent = e.userAgent),
            'number' == typeof e.errors && (this.errors = e.errors),
            e.status && (this.status = e.status)
        }),
        (e.prototype.close = function (e) {
          e
            ? this.update({ status: e })
            : 'ok' === this.status
            ? this.update({ status: 'exited' })
            : this.update()
        }),
        (e.prototype.toJSON = function () {
          return bt({
            sid: '' + this.sid,
            init: this.init,
            started: new Date(1e3 * this.started).toISOString(),
            timestamp: new Date(1e3 * this.timestamp).toISOString(),
            status: this.status,
            errors: this.errors,
            did:
              'number' == typeof this.did || 'string' == typeof this.did
                ? '' + this.did
                : void 0,
            duration: this.duration,
            attrs: {
              release: this.release,
              environment: this.environment,
              ip_address: this.ipAddress,
              user_agent: this.userAgent,
            },
          })
        }),
        e
      )
    })(),
    mn = 'undefined' == typeof __SENTRY_DEBUG__ || __SENTRY_DEBUG__,
    yn = (function () {
      function e(e, t, n) {
        void 0 === t && (t = new fn()),
          void 0 === n && (n = 4),
          (this._version = n),
          (this._stack = [{}]),
          (this.getStackTop().scope = t),
          e && this.bindClient(e)
      }
      return (
        (e.prototype.isOlderThan = function (e) {
          return this._version < e
        }),
        (e.prototype.bindClient = function (e) {
          ;(this.getStackTop().client = e),
            e && e.setupIntegrations && e.setupIntegrations()
        }),
        (e.prototype.pushScope = function () {
          var e = fn.clone(this.getScope())
          return this.getStack().push({ client: this.getClient(), scope: e }), e
        }),
        (e.prototype.popScope = function () {
          return !(this.getStack().length <= 1) && !!this.getStack().pop()
        }),
        (e.prototype.withScope = function (e) {
          var t = this.pushScope()
          try {
            e(t)
          } finally {
            this.popScope()
          }
        }),
        (e.prototype.getClient = function () {
          return this.getStackTop().client
        }),
        (e.prototype.getScope = function () {
          return this.getStackTop().scope
        }),
        (e.prototype.getStack = function () {
          return this._stack
        }),
        (e.prototype.getStackTop = function () {
          return this._stack[this._stack.length - 1]
        }),
        (e.prototype.captureException = function (e, t) {
          var n = (this._lastEventId = t && t.event_id ? t.event_id : Ht()),
            i = t
          if (!t) {
            var o = void 0
            try {
              throw new Error('Sentry syntheticException')
            } catch (e) {
              o = e
            }
            i = { originalException: e, syntheticException: o }
          }
          return (
            this._invokeClient(
              'captureException',
              e,
              r(r({}, i), { event_id: n })
            ),
            n
          )
        }),
        (e.prototype.captureMessage = function (e, t, n) {
          var i = (this._lastEventId = n && n.event_id ? n.event_id : Ht()),
            o = n
          if (!n) {
            var s = void 0
            try {
              throw new Error(e)
            } catch (e) {
              s = e
            }
            o = { originalException: e, syntheticException: s }
          }
          return (
            this._invokeClient(
              'captureMessage',
              e,
              t,
              r(r({}, o), { event_id: i })
            ),
            i
          )
        }),
        (e.prototype.captureEvent = function (e, t) {
          var n = t && t.event_id ? t.event_id : Ht()
          return (
            'transaction' !== e.type && (this._lastEventId = n),
            this._invokeClient('captureEvent', e, r(r({}, t), { event_id: n })),
            n
          )
        }),
        (e.prototype.lastEventId = function () {
          return this._lastEventId
        }),
        (e.prototype.addBreadcrumb = function (e, t) {
          var n = this.getStackTop(),
            i = n.scope,
            o = n.client
          if (i && o) {
            var s = (o.getOptions && o.getOptions()) || {},
              a = s.beforeBreadcrumb,
              c = void 0 === a ? null : a,
              u = s.maxBreadcrumbs,
              l = void 0 === u ? 100 : u
            if (!(l <= 0)) {
              var d = an(),
                p = r({ timestamp: d }, e),
                h = c
                  ? at(function () {
                      return c(p, t)
                    })
                  : p
              null !== h && i.addBreadcrumb(h, l)
            }
          }
        }),
        (e.prototype.setUser = function (e) {
          var t = this.getScope()
          t && t.setUser(e)
        }),
        (e.prototype.setTags = function (e) {
          var t = this.getScope()
          t && t.setTags(e)
        }),
        (e.prototype.setExtras = function (e) {
          var t = this.getScope()
          t && t.setExtras(e)
        }),
        (e.prototype.setTag = function (e, t) {
          var n = this.getScope()
          n && n.setTag(e, t)
        }),
        (e.prototype.setExtra = function (e, t) {
          var n = this.getScope()
          n && n.setExtra(e, t)
        }),
        (e.prototype.setContext = function (e, t) {
          var n = this.getScope()
          n && n.setContext(e, t)
        }),
        (e.prototype.configureScope = function (e) {
          var t = this.getStackTop(),
            n = t.scope,
            r = t.client
          n && r && e(n)
        }),
        (e.prototype.run = function (e) {
          var t = wn(this)
          try {
            e(this)
          } finally {
            wn(t)
          }
        }),
        (e.prototype.getIntegration = function (e) {
          var t = this.getClient()
          if (!t) return null
          try {
            return t.getIntegration(e)
          } catch (t) {
            return (
              mn &&
                nt.warn(
                  'Cannot retrieve integration ' +
                    e.id +
                    ' from the current Hub'
                ),
              null
            )
          }
        }),
        (e.prototype.startSpan = function (e) {
          return this._callExtensionMethod('startSpan', e)
        }),
        (e.prototype.startTransaction = function (e, t) {
          return this._callExtensionMethod('startTransaction', e, t)
        }),
        (e.prototype.traceHeaders = function () {
          return this._callExtensionMethod('traceHeaders')
        }),
        (e.prototype.captureSession = function (e) {
          if ((void 0 === e && (e = !1), e)) return this.endSession()
          this._sendSessionUpdate()
        }),
        (e.prototype.endSession = function () {
          var e = this.getStackTop(),
            t = e && e.scope,
            n = t && t.getSession()
          n && n.close(), this._sendSessionUpdate(), t && t.setSession()
        }),
        (e.prototype.startSession = function (e) {
          var t = this.getStackTop(),
            n = t.scope,
            i = t.client,
            o = (i && i.getOptions()) || {},
            s = o.release,
            a = o.environment,
            c = (Me().navigator || {}).userAgent,
            u = new _n(
              r(
                r(
                  r({ release: s, environment: a }, n && { user: n.getUser() }),
                  c && { userAgent: c }
                ),
                e
              )
            )
          if (n) {
            var l = n.getSession && n.getSession()
            l && 'ok' === l.status && l.update({ status: 'exited' }),
              this.endSession(),
              n.setSession(u)
          }
          return u
        }),
        (e.prototype._sendSessionUpdate = function () {
          var e = this.getStackTop(),
            t = e.scope,
            n = e.client
          if (t) {
            var r = t.getSession && t.getSession()
            r && n && n.captureSession && n.captureSession(r)
          }
        }),
        (e.prototype._invokeClient = function (e) {
          for (var t, n = [], r = 1; r < arguments.length; r++)
            n[r - 1] = arguments[r]
          var i = this.getStackTop(),
            o = i.scope,
            s = i.client
          s && s[e] && (t = s)[e].apply(t, a(n, [o]))
        }),
        (e.prototype._callExtensionMethod = function (e) {
          for (var t = [], n = 1; n < arguments.length; n++)
            t[n - 1] = arguments[n]
          var r = bn(),
            i = r.__SENTRY__
          if (i && i.extensions && 'function' == typeof i.extensions[e])
            return i.extensions[e].apply(this, t)
          mn &&
            nt.warn(
              'Extension method ' + e + " couldn't be found, doing nothing."
            )
        }),
        e
      )
    })()
  function bn() {
    var e = Me()
    return (e.__SENTRY__ = e.__SENTRY__ || { extensions: {}, hub: void 0 }), e
  }
  function wn(e) {
    var t = bn(),
      n = Sn(t)
    return Cn(t, e), n
  }
  function xn() {
    var e = bn()
    return (
      (En(e) && !Sn(e).isOlderThan(4)) || Cn(e, new yn()),
      Re()
        ? (function (e) {
            try {
              var t = bn().__SENTRY__,
                n =
                  t &&
                  t.extensions &&
                  t.extensions.domain &&
                  t.extensions.domain.active
              if (!n) return Sn(e)
              if (!En(n) || Sn(n).isOlderThan(4)) {
                var r = Sn(e).getStackTop()
                Cn(n, new yn(r.client, fn.clone(r.scope)))
              }
              return Sn(n)
            } catch (t) {
              return Sn(e)
            }
          })(e)
        : Sn(e)
    )
  }
  function En(e) {
    return !!(e && e.__SENTRY__ && e.__SENTRY__.hub)
  }
  function Sn(e) {
    return je(
      'hub',
      function () {
        return new yn()
      },
      e
    )
  }
  function Cn(e, t) {
    return !!e && (((e.__SENTRY__ = e.__SENTRY__ || {}).hub = t), !0)
  }
  function kn(e) {
    for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n]
    var r = xn()
    if (r && r[e]) return r[e].apply(r, a(t))
    throw new Error(
      'No hub defined or ' +
        e +
        ' was not found on the hub, please open a bug report.'
    )
  }
  function Ln(e, t) {
    return kn('captureException', e, {
      captureContext: t,
      originalException: e,
      syntheticException: new Error('Sentry syntheticException'),
    })
  }
  function On(e) {
    kn('withScope', e)
  }
  function An(e, t, n) {
    return { initDsn: e, metadata: t || {}, dsn: tt(e), tunnel: n }
  }
  function Nn(e) {
    var t = e.protocol ? e.protocol + ':' : '',
      n = e.port ? ':' + e.port : ''
    return t + '//' + e.host + n + (e.path ? '/' + e.path : '') + '/api/'
  }
  function In(e, t) {
    return '' + Nn(e) + e.projectId + '/' + t + '/'
  }
  function Rn(e) {
    return (
      (t = { sentry_key: e.publicKey, sentry_version: '7' }),
      Object.keys(t)
        .map(function (e) {
          return encodeURIComponent(e) + '=' + encodeURIComponent(t[e])
        })
        .join('&')
    )
    var t
  }
  function Tn(e) {
    return (
      (function (e) {
        return In(e, 'store')
      })(e) +
      '?' +
      Rn(e)
    )
  }
  function Mn(e, t) {
    return (
      t ||
      (function (e) {
        return In(e, 'envelope')
      })(e) +
        '?' +
        Rn(e)
    )
  }
  var jn = 'undefined' == typeof __SENTRY_DEBUG__ || __SENTRY_DEBUG__,
    Pn = []
  function Un(e) {
    return e.reduce(function (e, t) {
      return (
        e.every(function (e) {
          return t.name !== e.name
        }) && e.push(t),
        e
      )
    }, [])
  }
  function Dn(e) {
    var t = {}
    return (
      (function (e) {
        var t = (e.defaultIntegrations && a(e.defaultIntegrations)) || [],
          n = e.integrations,
          r = a(Un(t))
        Array.isArray(n)
          ? (r = a(
              r.filter(function (e) {
                return n.every(function (t) {
                  return t.name !== e.name
                })
              }),
              Un(n)
            ))
          : 'function' == typeof n &&
            ((r = n(r)), (r = Array.isArray(r) ? r : [r]))
        var i = r.map(function (e) {
            return e.name
          }),
          o = 'Debug'
        return (
          -1 !== i.indexOf(o) && r.push.apply(r, a(r.splice(i.indexOf(o), 1))),
          r
        )
      })(e).forEach(function (e) {
        ;(t[e.name] = e),
          (function (e) {
            ;-1 === Pn.indexOf(e.name) &&
              (e.setupOnce(vn, xn),
              Pn.push(e.name),
              jn && nt.log('Integration installed: ' + e.name))
          })(e)
      }),
      ht(t, 'initialized', !0),
      t
    )
  }
  var zn = "Not capturing exception because it's already been captured.",
    Fn = (function () {
      function e(e, t) {
        ;(this._integrations = {}),
          (this._numProcessing = 0),
          (this._backend = new e(t)),
          (this._options = t),
          t.dsn && (this._dsn = tt(t.dsn))
      }
      return (
        (e.prototype.captureException = function (e, t, n) {
          var r = this
          if (!Zt(e)) {
            var i = t && t.event_id
            return (
              this._process(
                this._getBackend()
                  .eventFromException(e, t)
                  .then(function (e) {
                    return r._captureEvent(e, t, n)
                  })
                  .then(function (e) {
                    i = e
                  })
              ),
              i
            )
          }
          jn && nt.log(zn)
        }),
        (e.prototype.captureMessage = function (e, t, n, r) {
          var i = this,
            o = n && n.event_id,
            s = Be(e)
              ? this._getBackend().eventFromMessage(String(e), t, n)
              : this._getBackend().eventFromException(e, n)
          return (
            this._process(
              s
                .then(function (e) {
                  return i._captureEvent(e, n, r)
                })
                .then(function (e) {
                  o = e
                })
            ),
            o
          )
        }),
        (e.prototype.captureEvent = function (e, t, n) {
          if (!(t && t.originalException && Zt(t.originalException))) {
            var r = t && t.event_id
            return (
              this._process(
                this._captureEvent(e, t, n).then(function (e) {
                  r = e
                })
              ),
              r
            )
          }
          jn && nt.log(zn)
        }),
        (e.prototype.captureSession = function (e) {
          this._isEnabled()
            ? 'string' != typeof e.release
              ? jn &&
                nt.warn(
                  'Discarded session because of missing or non-string release'
                )
              : (this._sendSession(e), e.update({ init: !1 }))
            : jn && nt.warn('SDK not enabled, will not capture session.')
        }),
        (e.prototype.getDsn = function () {
          return this._dsn
        }),
        (e.prototype.getOptions = function () {
          return this._options
        }),
        (e.prototype.getTransport = function () {
          return this._getBackend().getTransport()
        }),
        (e.prototype.flush = function (e) {
          var t = this
          return this._isClientDoneProcessing(e).then(function (n) {
            return t
              .getTransport()
              .close(e)
              .then(function (e) {
                return n && e
              })
          })
        }),
        (e.prototype.close = function (e) {
          var t = this
          return this.flush(e).then(function (e) {
            return (t.getOptions().enabled = !1), e
          })
        }),
        (e.prototype.setupIntegrations = function () {
          this._isEnabled() &&
            !this._integrations.initialized &&
            (this._integrations = Dn(this._options))
        }),
        (e.prototype.getIntegration = function (e) {
          try {
            return this._integrations[e.id] || null
          } catch (t) {
            return (
              jn &&
                nt.warn(
                  'Cannot retrieve integration ' +
                    e.id +
                    ' from the current Client'
                ),
              null
            )
          }
        }),
        (e.prototype._updateSessionFromEvent = function (e, t) {
          var n,
            i,
            s = !1,
            a = !1,
            c = t.exception && t.exception.values
          if (c) {
            a = !0
            try {
              for (var u = o(c), l = u.next(); !l.done; l = u.next()) {
                var d = l.value.mechanism
                if (d && !1 === d.handled) {
                  s = !0
                  break
                }
              }
            } catch (e) {
              n = { error: e }
            } finally {
              try {
                l && !l.done && (i = u.return) && i.call(u)
              } finally {
                if (n) throw n.error
              }
            }
          }
          var p = 'ok' === e.status
          ;((p && 0 === e.errors) || (p && s)) &&
            (e.update(
              r(r({}, s && { status: 'crashed' }), {
                errors: e.errors || Number(a || s),
              })
            ),
            this.captureSession(e))
        }),
        (e.prototype._sendSession = function (e) {
          this._getBackend().sendSession(e)
        }),
        (e.prototype._isClientDoneProcessing = function (e) {
          var t = this
          return new Qt(function (n) {
            var r = 0,
              i = setInterval(function () {
                0 == t._numProcessing
                  ? (clearInterval(i), n(!0))
                  : ((r += 1), e && r >= e && (clearInterval(i), n(!1)))
              }, 1)
          })
        }),
        (e.prototype._getBackend = function () {
          return this._backend
        }),
        (e.prototype._isEnabled = function () {
          return !1 !== this.getOptions().enabled && void 0 !== this._dsn
        }),
        (e.prototype._prepareEvent = function (e, t, n) {
          var i = this,
            o = this.getOptions(),
            s = o.normalizeDepth,
            a = void 0 === s ? 3 : s,
            c = o.normalizeMaxBreadth,
            u = void 0 === c ? 1e3 : c,
            l = r(r({}, e), {
              event_id: e.event_id || (n && n.event_id ? n.event_id : Ht()),
              timestamp: e.timestamp || an(),
            })
          this._applyClientOptions(l), this._applyIntegrationsMetadata(l)
          var d = t
          n && n.captureContext && (d = fn.clone(d).update(n.captureContext))
          var p = Kt(l)
          return (
            d && (p = d.applyToEvent(l, n)),
            p.then(function (e) {
              return (
                e &&
                  (e.sdkProcessingMetadata = r(r({}, e.sdkProcessingMetadata), {
                    normalizeDepth: Vt(a) + ' (' + typeof a + ')',
                  })),
                'number' == typeof a && a > 0 ? i._normalizeEvent(e, a, u) : e
              )
            })
          )
        }),
        (e.prototype._normalizeEvent = function (e, t, n) {
          if (!e) return null
          var i = r(
            r(
              r(
                r(
                  r({}, e),
                  e.breadcrumbs && {
                    breadcrumbs: e.breadcrumbs.map(function (e) {
                      return r(r({}, e), e.data && { data: Vt(e.data, t, n) })
                    }),
                  }
                ),
                e.user && { user: Vt(e.user, t, n) }
              ),
              e.contexts && { contexts: Vt(e.contexts, t, n) }
            ),
            e.extra && { extra: Vt(e.extra, t, n) }
          )
          return (
            e.contexts &&
              e.contexts.trace &&
              (i.contexts.trace = e.contexts.trace),
            (i.sdkProcessingMetadata = r(r({}, i.sdkProcessingMetadata), {
              baseClientNormalized: !0,
            })),
            i
          )
        }),
        (e.prototype._applyClientOptions = function (e) {
          var t = this.getOptions(),
            n = t.environment,
            r = t.release,
            i = t.dist,
            o = t.maxValueLength,
            s = void 0 === o ? 250 : o
          'environment' in e ||
            (e.environment = 'environment' in t ? n : 'production'),
            void 0 === e.release && void 0 !== r && (e.release = r),
            void 0 === e.dist && void 0 !== i && (e.dist = i),
            e.message && (e.message = ut(e.message, s))
          var a = e.exception && e.exception.values && e.exception.values[0]
          a && a.value && (a.value = ut(a.value, s))
          var c = e.request
          c && c.url && (c.url = ut(c.url, s))
        }),
        (e.prototype._applyIntegrationsMetadata = function (e) {
          var t = Object.keys(this._integrations)
          t.length > 0 &&
            ((e.sdk = e.sdk || {}),
            (e.sdk.integrations = a(e.sdk.integrations || [], t)))
        }),
        (e.prototype._sendEvent = function (e) {
          this._getBackend().sendEvent(e)
        }),
        (e.prototype._captureEvent = function (e, t, n) {
          return this._processEvent(e, t, n).then(
            function (e) {
              return e.event_id
            },
            function (e) {
              jn && nt.error(e)
            }
          )
        }),
        (e.prototype._processEvent = function (e, t, n) {
          var r = this,
            i = this.getOptions(),
            o = i.beforeSend,
            s = i.sampleRate,
            a = this.getTransport()
          function c(e, t) {
            a.recordLostEvent && a.recordLostEvent(e, t)
          }
          if (!this._isEnabled())
            return Xt(new Ye('SDK not enabled, will not capture event.'))
          var u = 'transaction' === e.type
          return !u && 'number' == typeof s && Math.random() > s
            ? (c('sample_rate', 'event'),
              Xt(
                new Ye(
                  "Discarding event because it's not included in the random sample (sampling rate = " +
                    s +
                    ')'
                )
              ))
            : this._prepareEvent(e, n, t)
                .then(function (n) {
                  if (null === n)
                    throw (
                      (c('event_processor', e.type || 'event'),
                      new Ye(
                        'An event processor returned null, will not send event.'
                      ))
                    )
                  return (t && t.data && !0 === t.data.__sentry__) || u || !o
                    ? n
                    : (function (e) {
                        var t =
                          '`beforeSend` method has to return `null` or a valid event.'
                        if ($e(e))
                          return e.then(
                            function (e) {
                              if (!qe(e) && null !== e) throw new Ye(t)
                              return e
                            },
                            function (e) {
                              throw new Ye('beforeSend rejected with ' + e)
                            }
                          )
                        if (!qe(e) && null !== e) throw new Ye(t)
                        return e
                      })(o(n, t))
                })
                .then(function (t) {
                  if (null === t)
                    throw (
                      (c('before_send', e.type || 'event'),
                      new Ye(
                        '`beforeSend` returned `null`, will not send event.'
                      ))
                    )
                  var i = n && n.getSession && n.getSession()
                  return (
                    !u && i && r._updateSessionFromEvent(i, t),
                    r._sendEvent(t),
                    t
                  )
                })
                .then(null, function (e) {
                  if (e instanceof Ye) throw e
                  throw (
                    (r.captureException(e, {
                      data: { __sentry__: !0 },
                      originalException: e,
                    }),
                    new Ye(
                      'Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.\nReason: ' +
                        e
                    ))
                  )
                })
        }),
        (e.prototype._process = function (e) {
          var t = this
          ;(this._numProcessing += 1),
            e.then(
              function (e) {
                return (t._numProcessing -= 1), e
              },
              function (e) {
                return (t._numProcessing -= 1), e
              }
            )
        }),
        e
      )
    })()
  function Hn(e) {
    if (e.metadata && e.metadata.sdk) {
      var t = e.metadata.sdk
      return { name: t.name, version: t.version }
    }
  }
  function Bn(e, t) {
    return t
      ? ((e.sdk = e.sdk || {}),
        (e.sdk.name = e.sdk.name || t.name),
        (e.sdk.version = e.sdk.version || t.version),
        (e.sdk.integrations = a(
          e.sdk.integrations || [],
          t.integrations || []
        )),
        (e.sdk.packages = a(e.sdk.packages || [], t.packages || [])),
        e)
      : e
  }
  function qn(e, t) {
    var n = Hn(t),
      i = 'aggregates' in e ? 'sessions' : 'session'
    return [
      un(
        r(
          r({ sent_at: new Date().toISOString() }, n && { sdk: n }),
          !!t.tunnel && { dsn: Qe(t.dsn) }
        ),
        [[{ type: i }, e]]
      ),
      i,
    ]
  }
  var Wn = (function () {
      function e() {}
      return (
        (e.prototype.sendEvent = function (e) {
          return Kt({
            reason:
              'NoopTransport: Event has been skipped because no Dsn is configured.',
            status: 'skipped',
          })
        }),
        (e.prototype.close = function (e) {
          return Kt(!0)
        }),
        e
      )
    })(),
    $n = (function () {
      function e(e) {
        ;(this._options = e),
          this._options.dsn ||
            (jn && nt.warn('No DSN provided, backend will not do anything.')),
          (this._transport = this._setupTransport())
      }
      return (
        (e.prototype.eventFromException = function (e, t) {
          throw new Ye('Backend has to implement `eventFromException` method')
        }),
        (e.prototype.eventFromMessage = function (e, t, n) {
          throw new Ye('Backend has to implement `eventFromMessage` method')
        }),
        (e.prototype.sendEvent = function (e) {
          if (
            this._newTransport &&
            this._options.dsn &&
            this._options._experiments &&
            this._options._experiments.newTransport
          ) {
            var t = (function (e, t) {
              var n = Hn(t),
                i = e.type || 'event',
                o = (e.sdkProcessingMetadata || {}).transactionSampling || {},
                s = o.method,
                a = o.rate
              return (
                Bn(e, t.metadata.sdk),
                (e.tags = e.tags || {}),
                (e.extra = e.extra || {}),
                (e.sdkProcessingMetadata &&
                  e.sdkProcessingMetadata.baseClientNormalized) ||
                  ((e.tags.skippedNormalization = !0),
                  (e.extra.normalizeDepth = e.sdkProcessingMetadata
                    ? e.sdkProcessingMetadata.normalizeDepth
                    : 'unset')),
                delete e.sdkProcessingMetadata,
                un(
                  r(
                    r(
                      {
                        event_id: e.event_id,
                        sent_at: new Date().toISOString(),
                      },
                      n && { sdk: n }
                    ),
                    !!t.tunnel && { dsn: Qe(t.dsn) }
                  ),
                  [[{ type: i, sample_rates: [{ id: s, rate: a }] }, e]]
                )
              )
            })(
              e,
              An(
                this._options.dsn,
                this._options._metadata,
                this._options.tunnel
              )
            )
            this._newTransport.send(t).then(null, function (e) {
              jn && nt.error('Error while sending event:', e)
            })
          } else
            this._transport.sendEvent(e).then(null, function (e) {
              jn && nt.error('Error while sending event:', e)
            })
        }),
        (e.prototype.sendSession = function (e) {
          if (this._transport.sendSession)
            if (
              this._newTransport &&
              this._options.dsn &&
              this._options._experiments &&
              this._options._experiments.newTransport
            ) {
              var t = s(
                qn(
                  e,
                  An(
                    this._options.dsn,
                    this._options._metadata,
                    this._options.tunnel
                  )
                ),
                1
              )[0]
              this._newTransport.send(t).then(null, function (e) {
                jn && nt.error('Error while sending session:', e)
              })
            } else
              this._transport.sendSession(e).then(null, function (e) {
                jn && nt.error('Error while sending session:', e)
              })
          else
            jn &&
              nt.warn(
                "Dropping session because custom transport doesn't implement sendSession"
              )
        }),
        (e.prototype.getTransport = function () {
          return this._transport
        }),
        (e.prototype._setupTransport = function () {
          return new Wn()
        }),
        e
      )
    })()
  function Gn(e, t, n) {
    void 0 === n && (n = en(e.bufferSize || 30))
    var r = {}
    return {
      send: function (e) {
        var i = (function (e) {
            var t = s(e, 2),
              n = s(t[1], 1)
            return s(n[0], 1)[0].type
          })(e),
          o = 'event' === i ? 'error' : i,
          a = { category: o, body: ln(e) }
        return pn(r, o)
          ? Xt({ status: 'rate_limit', reason: Zn(r, o) })
          : n.add(function () {
              return t(a).then(function (e) {
                var t = e.body,
                  n = e.headers,
                  i = e.reason,
                  s = nn(e.statusCode)
                return (
                  n && (r = hn(r, n)),
                  'success' === s
                    ? Kt({ status: s, reason: i })
                    : Xt({
                        status: s,
                        reason:
                          i ||
                          t ||
                          ('rate_limit' === s
                            ? Zn(r, o)
                            : 'Unknown transport error'),
                      })
                )
              })
            })
      },
      flush: function (e) {
        return n.drain(e)
      },
    }
  }
  function Zn(e, t) {
    return (
      'Too many ' +
      t +
      ' requests, backing off until: ' +
      new Date(dn(e, t)).toISOString()
    )
  }
  var Vn,
    Jn = '6.19.7',
    Yn = (function () {
      function e() {
        this.name = e.id
      }
      return (
        (e.prototype.setupOnce = function () {
          ;(Vn = Function.prototype.toString),
            (Function.prototype.toString = function () {
              for (var e = [], t = 0; t < arguments.length; t++)
                e[t] = arguments[t]
              var n = gt(this) || this
              return Vn.apply(n, e)
            })
        }),
        (e.id = 'FunctionToString'),
        e
      )
    })(),
    Kn = [/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/],
    Xn = (function () {
      function e(t) {
        void 0 === t && (t = {}), (this._options = t), (this.name = e.id)
      }
      return (
        (e.prototype.setupOnce = function (t, n) {
          t(function (t) {
            var r = n()
            if (r) {
              var i = r.getIntegration(e)
              if (i) {
                var o = r.getClient(),
                  s = o ? o.getOptions() : {},
                  c = (function (e, t) {
                    void 0 === e && (e = {})
                    void 0 === t && (t = {})
                    return {
                      allowUrls: a(
                        e.whitelistUrls || [],
                        e.allowUrls || [],
                        t.whitelistUrls || [],
                        t.allowUrls || []
                      ),
                      denyUrls: a(
                        e.blacklistUrls || [],
                        e.denyUrls || [],
                        t.blacklistUrls || [],
                        t.denyUrls || []
                      ),
                      ignoreErrors: a(
                        e.ignoreErrors || [],
                        t.ignoreErrors || [],
                        Kn
                      ),
                      ignoreInternal:
                        void 0 === e.ignoreInternal || e.ignoreInternal,
                    }
                  })(i._options, s)
                return (function (e, t) {
                  if (
                    t.ignoreInternal &&
                    (function (e) {
                      try {
                        return 'SentryError' === e.exception.values[0].type
                      } catch (e) {}
                      return !1
                    })(e)
                  )
                    return (
                      jn &&
                        nt.warn(
                          'Event dropped due to being internal Sentry Error.\nEvent: ' +
                            Wt(e)
                        ),
                      !0
                    )
                  if (
                    (function (e, t) {
                      if (!t || !t.length) return !1
                      return (function (e) {
                        if (e.message) return [e.message]
                        if (e.exception)
                          try {
                            var t =
                                (e.exception.values && e.exception.values[0]) ||
                                {},
                              n = t.type,
                              r = void 0 === n ? '' : n,
                              i = t.value,
                              o = void 0 === i ? '' : i
                            return ['' + o, r + ': ' + o]
                          } catch (t) {
                            return (
                              jn &&
                                nt.error(
                                  'Cannot extract message for event ' + Wt(e)
                                ),
                              []
                            )
                          }
                        return []
                      })(e).some(function (e) {
                        return t.some(function (t) {
                          return dt(e, t)
                        })
                      })
                    })(e, t.ignoreErrors)
                  )
                    return (
                      jn &&
                        nt.warn(
                          'Event dropped due to being matched by `ignoreErrors` option.\nEvent: ' +
                            Wt(e)
                        ),
                      !0
                    )
                  if (
                    (function (e, t) {
                      if (!t || !t.length) return !1
                      var n = er(e)
                      return (
                        !!n &&
                        t.some(function (e) {
                          return dt(n, e)
                        })
                      )
                    })(e, t.denyUrls)
                  )
                    return (
                      jn &&
                        nt.warn(
                          'Event dropped due to being matched by `denyUrls` option.\nEvent: ' +
                            Wt(e) +
                            '.\nUrl: ' +
                            er(e)
                        ),
                      !0
                    )
                  if (
                    !(function (e, t) {
                      if (!t || !t.length) return !0
                      var n = er(e)
                      return (
                        !n ||
                        t.some(function (e) {
                          return dt(n, e)
                        })
                      )
                    })(e, t.allowUrls)
                  )
                    return (
                      jn &&
                        nt.warn(
                          'Event dropped due to not being matched by `allowUrls` option.\nEvent: ' +
                            Wt(e) +
                            '.\nUrl: ' +
                            er(e)
                        ),
                      !0
                    )
                  return !1
                })(t, c)
                  ? null
                  : t
              }
            }
            return t
          })
        }),
        (e.id = 'InboundFilters'),
        e
      )
    })()
  function Qn(e) {
    void 0 === e && (e = [])
    for (var t = e.length - 1; t >= 0; t--) {
      var n = e[t]
      if (n && '<anonymous>' !== n.filename && '[native code]' !== n.filename)
        return n.filename || null
    }
    return null
  }
  function er(e) {
    try {
      if (e.stacktrace) return Qn(e.stacktrace.frames)
      var t
      try {
        t = e.exception.values[0].stacktrace.frames
      } catch (e) {}
      return t ? Qn(t) : null
    } catch (t) {
      return jn && nt.error('Cannot extract url for event ' + Wt(e)), null
    }
  }
  var tr = Object.freeze({
      __proto__: null,
      FunctionToString: Yn,
      InboundFilters: Xn,
    }),
    nr = '?'
  function rr(e, t, n, r) {
    var i = { filename: e, function: t, in_app: !0 }
    return void 0 !== n && (i.lineno = n), void 0 !== r && (i.colno = r), i
  }
  var ir =
      /^\s*at (?:(.*?) ?\((?:address at )?)?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
    or = /\((\S*)(?::(\d+))(?::(\d+))\)/,
    sr = [
      30,
      function (e) {
        var t = ir.exec(e)
        if (t) {
          if (t[2] && 0 === t[2].indexOf('eval')) {
            var n = or.exec(t[2])
            n && ((t[2] = n[1]), (t[3] = n[2]), (t[4] = n[3]))
          }
          var r = s(vr(t[1] || nr, t[2]), 2),
            i = r[0]
          return rr(r[1], i, t[3] ? +t[3] : void 0, t[4] ? +t[4] : void 0)
        }
      },
    ],
    ar =
      /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:file|https?|blob|chrome|webpack|resource|moz-extension|capacitor).*?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i,
    cr = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
    ur = [
      50,
      function (e) {
        var t,
          n = ar.exec(e)
        if (n) {
          if (n[3] && n[3].indexOf(' > eval') > -1) {
            var r = cr.exec(n[3])
            r &&
              ((n[1] = n[1] || 'eval'),
              (n[3] = r[1]),
              (n[4] = r[2]),
              (n[5] = ''))
          }
          var i = n[3],
            o = n[1] || nr
          return (
            (o = (t = s(vr(o, i), 2))[0]),
            rr((i = t[1]), o, n[4] ? +n[4] : void 0, n[5] ? +n[5] : void 0)
          )
        }
      },
    ],
    lr =
      /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
    dr = [
      40,
      function (e) {
        var t = lr.exec(e)
        return t ? rr(t[2], t[1] || nr, +t[3], t[4] ? +t[4] : void 0) : void 0
      },
    ],
    pr = / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i,
    hr = [
      10,
      function (e) {
        var t = pr.exec(e)
        return t ? rr(t[2], t[3] || nr, +t[1]) : void 0
      },
    ],
    fr =
      / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^)]+))\(.*\))? in (.*):\s*$/i,
    gr = [
      20,
      function (e) {
        var t = fr.exec(e)
        return t ? rr(t[5], t[3] || t[4] || nr, +t[1], +t[2]) : void 0
      },
    ],
    vr = function (e, t) {
      var n = -1 !== e.indexOf('safari-extension'),
        r = -1 !== e.indexOf('safari-web-extension')
      return n || r
        ? [
            -1 !== e.indexOf('@') ? e.split('@')[0] : nr,
            n ? 'safari-extension:' + t : 'safari-web-extension:' + t,
          ]
        : [e, t]
    }
  function _r(e) {
    var t = yr(e),
      n = { type: e && e.name, value: wr(e) }
    return (
      t.length && (n.stacktrace = { frames: t }),
      void 0 === n.type &&
        '' === n.value &&
        (n.value = 'Unrecoverable error caught'),
      n
    )
  }
  function mr(e) {
    return { exception: { values: [_r(e)] } }
  }
  function yr(e) {
    var t = e.stacktrace || e.stack || '',
      n = (function (e) {
        if (e) {
          if ('number' == typeof e.framesToPop) return e.framesToPop
          if (br.test(e.message)) return 1
        }
        return 0
      })(e)
    try {
      return (function () {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t]
        var n = e
          .sort(function (e, t) {
            return e[0] - t[0]
          })
          .map(function (e) {
            return e[1]
          })
        return function (e, t) {
          var r, i, s, a
          void 0 === t && (t = 0)
          var c = []
          try {
            for (
              var u = o(e.split('\n').slice(t)), l = u.next();
              !l.done;
              l = u.next()
            ) {
              var d = l.value
              try {
                for (
                  var p = ((s = void 0), o(n)), h = p.next();
                  !h.done;
                  h = p.next()
                ) {
                  var f = (0, h.value)(d)
                  if (f) {
                    c.push(f)
                    break
                  }
                }
              } catch (e) {
                s = { error: e }
              } finally {
                try {
                  h && !h.done && (a = p.return) && a.call(p)
                } finally {
                  if (s) throw s.error
                }
              }
            }
          } catch (e) {
            r = { error: e }
          } finally {
            try {
              l && !l.done && (i = u.return) && i.call(u)
            } finally {
              if (r) throw r.error
            }
          }
          return wt(c)
        }
      })(
        hr,
        gr,
        sr,
        dr,
        ur
      )(t, n)
    } catch (e) {}
    return []
  }
  var br = /Minified React error #\d+;/i
  function wr(e) {
    var t = e && e.message
    return t
      ? t.error && 'string' == typeof t.error.message
        ? t.error.message
        : t
      : 'No error message'
  }
  function xr(e, t, n, i) {
    var o
    if (ze(e) && e.error) return mr(e.error)
    if (Fe(e) || De(e, 'DOMException')) {
      var s = e
      if ('stack' in e) o = mr(e)
      else {
        var a = s.name || (Fe(s) ? 'DOMError' : 'DOMException'),
          c = s.message ? a + ': ' + s.message : a
        $t((o = Er(c, t, n)), c)
      }
      return (
        'code' in s &&
          (o.tags = r(r({}, o.tags), { 'DOMException.code': '' + s.code })),
        o
      )
    }
    return Ue(e)
      ? mr(e)
      : qe(e) || We(e)
      ? ((o = (function (e, t, n) {
          var r = {
            exception: {
              values: [
                {
                  type: We(e)
                    ? e.constructor.name
                    : n
                    ? 'UnhandledRejection'
                    : 'Error',
                  value:
                    'Non-Error ' +
                    (n ? 'promise rejection' : 'exception') +
                    ' captured with keys: ' +
                    yt(e),
                },
              ],
            },
            extra: { __serialized__: Jt(e) },
          }
          if (t) {
            var i = yr(t)
            i.length && (r.stacktrace = { frames: i })
          }
          return r
        })(e, t, i)),
        Gt(o, { synthetic: !0 }),
        o)
      : ($t((o = Er(e, t, n)), '' + e, void 0), Gt(o, { synthetic: !0 }), o)
  }
  function Er(e, t, n) {
    var r = { message: e }
    if (n && t) {
      var i = yr(t)
      i.length && (r.stacktrace = { frames: i })
    }
    return r
  }
  var Sr,
    Cr = 'undefined' == typeof __SENTRY_DEBUG__ || __SENTRY_DEBUG__,
    kr = Me()
  function Lr() {
    if (Sr) return Sr
    if (Ct(kr.fetch)) return (Sr = kr.fetch.bind(kr))
    var e = kr.document,
      t = kr.fetch
    if (e && 'function' == typeof e.createElement)
      try {
        var n = e.createElement('iframe')
        ;(n.hidden = !0), e.head.appendChild(n)
        var r = n.contentWindow
        r && r.fetch && (t = r.fetch), e.head.removeChild(n)
      } catch (e) {
        Cr &&
          nt.warn(
            'Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ',
            e
          )
      }
    return (Sr = t.bind(kr))
  }
  function Or(e, t) {
    if (
      '[object Navigator]' ===
        Object.prototype.toString.call(kr && kr.navigator) &&
      'function' == typeof kr.navigator.sendBeacon
    )
      return kr.navigator.sendBeacon.bind(kr.navigator)(e, t)
    if (St()) {
      var n = Lr()
      n(e, {
        body: t,
        method: 'POST',
        credentials: 'omit',
        keepalive: !0,
      }).then(null, function (e) {
        console.error(e)
      })
    } else;
  }
  function Ar(e) {
    return 'event' === e ? 'error' : e
  }
  var Nr = Me(),
    Ir = (function () {
      function e(e) {
        var t = this
        ;(this.options = e),
          (this._buffer = en(30)),
          (this._rateLimits = {}),
          (this._outcomes = {}),
          (this._api = An(e.dsn, e._metadata, e.tunnel)),
          (this.url = Tn(this._api.dsn)),
          this.options.sendClientReports &&
            Nr.document &&
            Nr.document.addEventListener('visibilitychange', function () {
              'hidden' === Nr.document.visibilityState && t._flushOutcomes()
            })
      }
      return (
        (e.prototype.sendEvent = function (e) {
          return this._sendRequest(
            (function (e, t) {
              var n,
                i = Hn(t),
                o = e.type || 'event',
                s = 'transaction' === o || !!t.tunnel,
                a = (e.sdkProcessingMetadata || {}).transactionSampling || {},
                c = a.method,
                u = a.rate
              Bn(e, t.metadata.sdk),
                (e.tags = e.tags || {}),
                (e.extra = e.extra || {}),
                (e.sdkProcessingMetadata &&
                  e.sdkProcessingMetadata.baseClientNormalized) ||
                  ((e.tags.skippedNormalization = !0),
                  (e.extra.normalizeDepth = e.sdkProcessingMetadata
                    ? e.sdkProcessingMetadata.normalizeDepth
                    : 'unset')),
                delete e.sdkProcessingMetadata
              try {
                n = JSON.stringify(e)
              } catch (t) {
                ;(e.tags.JSONStringifyError = !0),
                  (e.extra.JSONStringifyError = t)
                try {
                  n = JSON.stringify(Vt(e))
                } catch (e) {
                  var l = e
                  n = JSON.stringify({
                    message: 'JSON.stringify error after renormalization',
                    extra: { message: l.message, stack: l.stack },
                  })
                }
              }
              var d = {
                body: n,
                type: o,
                url: s ? Mn(t.dsn, t.tunnel) : Tn(t.dsn),
              }
              if (s) {
                var p = un(
                  r(
                    r(
                      {
                        event_id: e.event_id,
                        sent_at: new Date().toISOString(),
                      },
                      i && { sdk: i }
                    ),
                    !!t.tunnel && { dsn: Qe(t.dsn) }
                  ),
                  [[{ type: o, sample_rates: [{ id: c, rate: u }] }, d.body]]
                )
                d.body = ln(p)
              }
              return d
            })(e, this._api),
            e
          )
        }),
        (e.prototype.sendSession = function (e) {
          return this._sendRequest(
            (function (e, t) {
              var n = s(qn(e, t), 2),
                r = n[0],
                i = n[1]
              return { body: ln(r), type: i, url: Mn(t.dsn, t.tunnel) }
            })(e, this._api),
            e
          )
        }),
        (e.prototype.close = function (e) {
          return this._buffer.drain(e)
        }),
        (e.prototype.recordLostEvent = function (e, t) {
          var n
          if (this.options.sendClientReports) {
            var r = Ar(t) + ':' + e
            Cr && nt.log('Adding outcome: ' + r),
              (this._outcomes[r] =
                (null != (n = this._outcomes[r]) ? n : 0) + 1)
          }
        }),
        (e.prototype._flushOutcomes = function () {
          if (this.options.sendClientReports) {
            var e = this._outcomes
            if (((this._outcomes = {}), Object.keys(e).length)) {
              Cr && nt.log('Flushing outcomes:\n' + JSON.stringify(e, null, 2))
              var t,
                n,
                r,
                i = Mn(this._api.dsn, this._api.tunnel),
                o = Object.keys(e).map(function (t) {
                  var n = s(t.split(':'), 2),
                    r = n[0]
                  return { reason: n[1], category: r, quantity: e[t] }
                }),
                a =
                  ((t = o),
                  un(
                    (n = this._api.tunnel && Qe(this._api.dsn))
                      ? { dsn: n }
                      : {},
                    [
                      [
                        { type: 'client_report' },
                        { timestamp: r || an(), discarded_events: t },
                      ],
                    ]
                  ))
              try {
                Or(i, ln(a))
              } catch (e) {
                Cr && nt.error(e)
              }
            } else Cr && nt.log('No outcomes to flush')
          }
        }),
        (e.prototype._handleResponse = function (e) {
          var t = e.requestType,
            n = e.response,
            r = e.headers,
            i = e.resolve,
            o = e.reject,
            s = nn(n.status)
          ;(this._rateLimits = hn(this._rateLimits, r)),
            this._isRateLimited(t) &&
              Cr &&
              nt.warn(
                'Too many ' +
                  t +
                  ' requests, backing off until: ' +
                  this._disabledUntil(t)
              ),
            'success' !== s ? o(n) : i({ status: s })
        }),
        (e.prototype._disabledUntil = function (e) {
          var t = Ar(e)
          return new Date(dn(this._rateLimits, t))
        }),
        (e.prototype._isRateLimited = function (e) {
          var t = Ar(e)
          return pn(this._rateLimits, t)
        }),
        e
      )
    })(),
    Rr = (function (e) {
      function t(t, n) {
        void 0 === n && (n = Lr())
        var r = e.call(this, t) || this
        return (r._fetch = n), r
      }
      return (
        n(t, e),
        (t.prototype._sendRequest = function (e, t) {
          var n = this
          if (this._isRateLimited(e.type))
            return (
              this.recordLostEvent('ratelimit_backoff', e.type),
              Promise.reject({
                event: t,
                type: e.type,
                reason:
                  'Transport for ' +
                  e.type +
                  ' requests locked till ' +
                  this._disabledUntil(e.type) +
                  ' due to too many requests.',
                status: 429,
              })
            )
          var r = {
            body: e.body,
            method: 'POST',
            referrerPolicy: kt() ? 'origin' : '',
          }
          return (
            void 0 !== this.options.fetchParameters &&
              Object.assign(r, this.options.fetchParameters),
            void 0 !== this.options.headers &&
              (r.headers = this.options.headers),
            this._buffer
              .add(function () {
                return new Qt(function (t, i) {
                  n._fetch(e.url, r)
                    .then(function (r) {
                      var o = {
                        'x-sentry-rate-limits': r.headers.get(
                          'X-Sentry-Rate-Limits'
                        ),
                        'retry-after': r.headers.get('Retry-After'),
                      }
                      n._handleResponse({
                        requestType: e.type,
                        response: r,
                        headers: o,
                        resolve: t,
                        reject: i,
                      })
                    })
                    .catch(i)
                })
              })
              .then(void 0, function (t) {
                throw (
                  (t instanceof Ye
                    ? n.recordLostEvent('queue_overflow', e.type)
                    : n.recordLostEvent('network_error', e.type),
                  t)
                )
              })
          )
        }),
        t
      )
    })(Ir),
    Tr = (function (e) {
      function t() {
        return (null !== e && e.apply(this, arguments)) || this
      }
      return (
        n(t, e),
        (t.prototype._sendRequest = function (e, t) {
          var n = this
          return this._isRateLimited(e.type)
            ? (this.recordLostEvent('ratelimit_backoff', e.type),
              Promise.reject({
                event: t,
                type: e.type,
                reason:
                  'Transport for ' +
                  e.type +
                  ' requests locked till ' +
                  this._disabledUntil(e.type) +
                  ' due to too many requests.',
                status: 429,
              }))
            : this._buffer
                .add(function () {
                  return new Qt(function (t, r) {
                    var i = new XMLHttpRequest()
                    for (var o in ((i.onreadystatechange = function () {
                      if (4 === i.readyState) {
                        var o = {
                          'x-sentry-rate-limits': i.getResponseHeader(
                            'X-Sentry-Rate-Limits'
                          ),
                          'retry-after': i.getResponseHeader('Retry-After'),
                        }
                        n._handleResponse({
                          requestType: e.type,
                          response: i,
                          headers: o,
                          resolve: t,
                          reject: r,
                        })
                      }
                    }),
                    i.open('POST', e.url),
                    n.options.headers))
                      Object.prototype.hasOwnProperty.call(
                        n.options.headers,
                        o
                      ) && i.setRequestHeader(o, n.options.headers[o])
                    i.send(e.body)
                  })
                })
                .then(void 0, function (t) {
                  throw (
                    (t instanceof Ye
                      ? n.recordLostEvent('queue_overflow', e.type)
                      : n.recordLostEvent('network_error', e.type),
                    t)
                  )
                })
        }),
        t
      )
    })(Ir)
  var Mr = (function (e) {
      function t() {
        return (null !== e && e.apply(this, arguments)) || this
      }
      return (
        n(t, e),
        (t.prototype.eventFromException = function (e, t) {
          return (function (e, t, n) {
            var r = xr(e, (t && t.syntheticException) || void 0, n)
            return (
              Gt(r),
              (r.level = ve.Error),
              t && t.event_id && (r.event_id = t.event_id),
              Kt(r)
            )
          })(e, t, this._options.attachStacktrace)
        }),
        (t.prototype.eventFromMessage = function (e, t, n) {
          return (
            void 0 === t && (t = ve.Info),
            (function (e, t, n, r) {
              void 0 === t && (t = ve.Info)
              var i = Er(e, (n && n.syntheticException) || void 0, r)
              return (
                (i.level = t),
                n && n.event_id && (i.event_id = n.event_id),
                Kt(i)
              )
            })(e, t, n, this._options.attachStacktrace)
          )
        }),
        (t.prototype._setupTransport = function () {
          if (!this._options.dsn) return e.prototype._setupTransport.call(this)
          var t,
            n,
            i = r(r({}, this._options.transportOptions), {
              dsn: this._options.dsn,
              tunnel: this._options.tunnel,
              sendClientReports: this._options.sendClientReports,
              _metadata: this._options._metadata,
            }),
            o = An(i.dsn, i._metadata, i.tunnel),
            s = Mn(o.dsn, o.tunnel)
          if (this._options.transport) return new this._options.transport(i)
          if (St()) {
            var a = r({}, i.fetchParameters)
            return (
              (this._newTransport =
                ((t = { requestOptions: a, url: s }),
                void 0 === n && (n = Lr()),
                Gn({ bufferSize: t.bufferSize }, function (e) {
                  var i = r(
                    { body: e.body, method: 'POST', referrerPolicy: 'origin' },
                    t.requestOptions
                  )
                  return n(t.url, i).then(function (e) {
                    return e.text().then(function (t) {
                      return {
                        body: t,
                        headers: {
                          'x-sentry-rate-limits': e.headers.get(
                            'X-Sentry-Rate-Limits'
                          ),
                          'retry-after': e.headers.get('Retry-After'),
                        },
                        reason: e.statusText,
                        statusCode: e.status,
                      }
                    })
                  })
                }))),
              new Rr(i)
            )
          }
          return (
            (this._newTransport = (function (e) {
              return Gn({ bufferSize: e.bufferSize }, function (t) {
                return new Qt(function (n, r) {
                  var i = new XMLHttpRequest()
                  for (var o in ((i.onreadystatechange = function () {
                    if (4 === i.readyState) {
                      var e = {
                        body: i.response,
                        headers: {
                          'x-sentry-rate-limits': i.getResponseHeader(
                            'X-Sentry-Rate-Limits'
                          ),
                          'retry-after': i.getResponseHeader('Retry-After'),
                        },
                        reason: i.statusText,
                        statusCode: i.status,
                      }
                      n(e)
                    }
                  }),
                  i.open('POST', e.url),
                  e.headers))
                    Object.prototype.hasOwnProperty.call(e.headers, o) &&
                      i.setRequestHeader(o, e.headers[o])
                  i.send(t.body)
                })
              })
            })({ url: s, headers: i.headers })),
            new Tr(i)
          )
        }),
        t
      )
    })($n),
    jr = Me(),
    Pr = 0
  function Ur() {
    return Pr > 0
  }
  function Dr() {
    ;(Pr += 1),
      setTimeout(function () {
        Pr -= 1
      })
  }
  function zr(e, t, n) {
    if ((void 0 === t && (t = {}), 'function' != typeof e)) return e
    try {
      var i = e.__sentry_wrapped__
      if (i) return i
      if (gt(e)) return e
    } catch (t) {
      return e
    }
    var o = function () {
      var i = Array.prototype.slice.call(arguments)
      try {
        n && 'function' == typeof n && n.apply(this, arguments)
        var o = i.map(function (e) {
          return zr(e, t)
        })
        return e.apply(this, o)
      } catch (e) {
        throw (
          (Dr(),
          On(function (n) {
            n.addEventProcessor(function (e) {
              return (
                t.mechanism && ($t(e, void 0, void 0), Gt(e, t.mechanism)),
                (e.extra = r(r({}, e.extra), { arguments: i })),
                e
              )
            }),
              Ln(e)
          }),
          e)
        )
      }
    }
    try {
      for (var s in e)
        Object.prototype.hasOwnProperty.call(e, s) && (o[s] = e[s])
    } catch (e) {}
    ft(o, e), ht(e, '__sentry_wrapped__', o)
    try {
      Object.getOwnPropertyDescriptor(o, 'name').configurable &&
        Object.defineProperty(o, 'name', {
          get: function () {
            return e.name
          },
        })
    } catch (e) {}
    return o
  }
  function Fr(e) {
    if ((void 0 === e && (e = {}), jr.document))
      if (e.eventId)
        if (e.dsn) {
          var t = jr.document.createElement('script')
          ;(t.async = !0),
            (t.src = (function (e, t) {
              var n = tt(e),
                r = Nn(n) + 'embed/error-page/',
                i = 'dsn=' + Qe(n)
              for (var o in t)
                if ('dsn' !== o)
                  if ('user' === o) {
                    if (!t.user) continue
                    t.user.name &&
                      (i += '&name=' + encodeURIComponent(t.user.name)),
                      t.user.email &&
                        (i += '&email=' + encodeURIComponent(t.user.email))
                  } else
                    i +=
                      '&' +
                      encodeURIComponent(o) +
                      '=' +
                      encodeURIComponent(t[o])
              return r + '?' + i
            })(e.dsn, e)),
            e.onLoad && (t.onload = e.onLoad)
          var n = jr.document.head || jr.document.body
          n && n.appendChild(t)
        } else Cr && nt.error('Missing dsn option in showReportDialog call')
      else Cr && nt.error('Missing eventId option in showReportDialog call')
  }
  var Hr = (function () {
    function e(t) {
      ;(this.name = e.id),
        (this._installFunc = { onerror: Br, onunhandledrejection: qr }),
        (this._options = r({ onerror: !0, onunhandledrejection: !0 }, t))
    }
    return (
      (e.prototype.setupOnce = function () {
        Error.stackTraceLimit = 50
        var e,
          t = this._options
        for (var n in t) {
          var r = this._installFunc[n]
          r &&
            t[n] &&
            ((e = n),
            Cr && nt.log('Global Handler attached: ' + e),
            r(),
            (this._installFunc[n] = void 0))
        }
      }),
      (e.id = 'GlobalHandlers'),
      e
    )
  })()
  function Br() {
    Rt('error', function (e) {
      var t = s(Gr(), 2),
        n = t[0],
        r = t[1]
      if (n.getIntegration(Hr)) {
        var i = e.msg,
          o = e.url,
          a = e.line,
          c = e.column,
          u = e.error
        if (!(Ur() || (u && u.__sentry_own_request__))) {
          var l =
            void 0 === u && He(i)
              ? (function (e, t, n, r) {
                  var i =
                      /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/i,
                    o = ze(e) ? e.message : e,
                    s = 'Error',
                    a = o.match(i)
                  a && ((s = a[1]), (o = a[2]))
                  return Wr(
                    { exception: { values: [{ type: s, value: o }] } },
                    t,
                    n,
                    r
                  )
                })(i, o, a, c)
              : Wr(xr(u || i, void 0, r, !1), o, a, c)
          ;(l.level = ve.Error), $r(n, u, l, 'onerror')
        }
      }
    })
  }
  function qr() {
    Rt('unhandledrejection', function (e) {
      var t = s(Gr(), 2),
        n = t[0],
        r = t[1]
      if (n.getIntegration(Hr)) {
        var i = e
        try {
          'reason' in e
            ? (i = e.reason)
            : 'detail' in e && 'reason' in e.detail && (i = e.detail.reason)
        } catch (e) {}
        if (Ur() || (i && i.__sentry_own_request__)) return !0
        var o = Be(i)
          ? {
              exception: {
                values: [
                  {
                    type: 'UnhandledRejection',
                    value:
                      'Non-Error promise rejection captured with value: ' +
                      String(i),
                  },
                ],
              },
            }
          : xr(i, void 0, r, !0)
        ;(o.level = ve.Error), $r(n, i, o, 'onunhandledrejection')
      }
    })
  }
  function Wr(e, t, n, r) {
    var i = (e.exception = e.exception || {}),
      o = (i.values = i.values || []),
      s = (o[0] = o[0] || {}),
      a = (s.stacktrace = s.stacktrace || {}),
      c = (a.frames = a.frames || []),
      u = isNaN(parseInt(r, 10)) ? void 0 : r,
      l = isNaN(parseInt(n, 10)) ? void 0 : n,
      d =
        He(t) && t.length > 0
          ? t
          : (function () {
              var e = Me()
              try {
                return e.document.location.href
              } catch (e) {
                return ''
              }
            })()
    return (
      0 === c.length &&
        c.push({ colno: u, filename: d, function: '?', in_app: !0, lineno: l }),
      e
    )
  }
  function $r(e, t, n, r) {
    Gt(n, { handled: !1, type: r }), e.captureEvent(n, { originalException: t })
  }
  function Gr() {
    var e = xn(),
      t = e.getClient()
    return [e, t && t.getOptions().attachStacktrace]
  }
  var Zr = [
      'EventTarget',
      'Window',
      'Node',
      'ApplicationCache',
      'AudioTrackList',
      'ChannelMergerNode',
      'CryptoOperation',
      'EventSource',
      'FileReader',
      'HTMLUnknownElement',
      'IDBDatabase',
      'IDBRequest',
      'IDBTransaction',
      'KeyOperation',
      'MediaController',
      'MessagePort',
      'ModalWindow',
      'Notification',
      'SVGElementInstance',
      'Screen',
      'TextTrack',
      'TextTrackCue',
      'TextTrackList',
      'WebSocket',
      'WebSocketWorker',
      'Worker',
      'XMLHttpRequest',
      'XMLHttpRequestEventTarget',
      'XMLHttpRequestUpload',
    ],
    Vr = (function () {
      function e(t) {
        ;(this.name = e.id),
          (this._options = r(
            {
              XMLHttpRequest: !0,
              eventTarget: !0,
              requestAnimationFrame: !0,
              setInterval: !0,
              setTimeout: !0,
            },
            t
          ))
      }
      return (
        (e.prototype.setupOnce = function () {
          var e = Me()
          this._options.setTimeout && pt(e, 'setTimeout', Jr),
            this._options.setInterval && pt(e, 'setInterval', Jr),
            this._options.requestAnimationFrame &&
              pt(e, 'requestAnimationFrame', Yr),
            this._options.XMLHttpRequest &&
              'XMLHttpRequest' in e &&
              pt(XMLHttpRequest.prototype, 'send', Kr)
          var t = this._options.eventTarget
          t && (Array.isArray(t) ? t : Zr).forEach(Xr)
        }),
        (e.id = 'TryCatch'),
        e
      )
    })()
  function Jr(e) {
    return function () {
      for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n]
      var r = t[0]
      return (
        (t[0] = zr(r, {
          mechanism: {
            data: { function: Et(e) },
            handled: !0,
            type: 'instrument',
          },
        })),
        e.apply(this, t)
      )
    }
  }
  function Yr(e) {
    return function (t) {
      return e.apply(this, [
        zr(t, {
          mechanism: {
            data: { function: 'requestAnimationFrame', handler: Et(e) },
            handled: !0,
            type: 'instrument',
          },
        }),
      ])
    }
  }
  function Kr(e) {
    return function () {
      for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n]
      var r = this,
        i = ['onload', 'onerror', 'onprogress', 'onreadystatechange']
      return (
        i.forEach(function (e) {
          e in r &&
            'function' == typeof r[e] &&
            pt(r, e, function (t) {
              var n = {
                  mechanism: {
                    data: { function: e, handler: Et(t) },
                    handled: !0,
                    type: 'instrument',
                  },
                },
                r = gt(t)
              return r && (n.mechanism.data.handler = Et(r)), zr(t, n)
            })
        }),
        e.apply(this, t)
      )
    }
  }
  function Xr(e) {
    var t = Me(),
      n = t[e] && t[e].prototype
    n &&
      n.hasOwnProperty &&
      n.hasOwnProperty('addEventListener') &&
      (pt(n, 'addEventListener', function (t) {
        return function (n, r, i) {
          try {
            'function' == typeof r.handleEvent &&
              (r.handleEvent = zr(r.handleEvent.bind(r), {
                mechanism: {
                  data: { function: 'handleEvent', handler: Et(r), target: e },
                  handled: !0,
                  type: 'instrument',
                },
              }))
          } catch (e) {}
          return t.apply(this, [
            n,
            zr(r, {
              mechanism: {
                data: {
                  function: 'addEventListener',
                  handler: Et(r),
                  target: e,
                },
                handled: !0,
                type: 'instrument',
              },
            }),
            i,
          ])
        }
      }),
      pt(n, 'removeEventListener', function (e) {
        return function (t, n, r) {
          var i = n
          try {
            var o = i && i.__sentry_wrapped__
            o && e.call(this, t, o, r)
          } catch (e) {}
          return e.call(this, t, i, r)
        }
      }))
  }
  var Qr = (function () {
    function e(t) {
      ;(this.name = e.id),
        (this._options = r(
          { console: !0, dom: !0, fetch: !0, history: !0, sentry: !0, xhr: !0 },
          t
        ))
    }
    return (
      (e.prototype.addSentryBreadcrumb = function (e) {
        this._options.sentry &&
          xn().addBreadcrumb(
            {
              category:
                'sentry.' +
                ('transaction' === e.type ? 'transaction' : 'event'),
              event_id: e.event_id,
              level: e.level,
              message: Wt(e),
            },
            { event: e }
          )
      }),
      (e.prototype.setupOnce = function () {
        this._options.console && Rt('console', ei),
          this._options.dom &&
            Rt(
              'dom',
              (function (e) {
                function t(t) {
                  var n,
                    r = 'object' == typeof e ? e.serializeAttribute : void 0
                  'string' == typeof r && (r = [r])
                  try {
                    n = t.event.target ? Ze(t.event.target, r) : Ze(t.event, r)
                  } catch (e) {
                    n = '<unknown>'
                  }
                  0 !== n.length &&
                    xn().addBreadcrumb(
                      { category: 'ui.' + t.name, message: n },
                      { event: t.event, name: t.name, global: t.global }
                    )
                }
                return t
              })(this._options.dom)
            ),
          this._options.xhr && Rt('xhr', ti),
          this._options.fetch && Rt('fetch', ni),
          this._options.history && Rt('history', ri)
      }),
      (e.id = 'Breadcrumbs'),
      e
    )
  })()
  function ei(e) {
    var t = {
      category: 'console',
      data: { arguments: e.args, logger: 'console' },
      level: tn(e.level),
      message: lt(e.args, ' '),
    }
    if ('assert' === e.level) {
      if (!1 !== e.args[0]) return
      ;(t.message =
        'Assertion failed: ' + (lt(e.args.slice(1), ' ') || 'console.assert')),
        (t.data.arguments = e.args.slice(1))
    }
    xn().addBreadcrumb(t, { input: e.args, level: e.level })
  }
  function ti(e) {
    if (e.endTimestamp) {
      if (e.xhr.__sentry_own_request__) return
      var t = e.xhr.__sentry_xhr__ || {},
        n = t.method,
        r = t.url,
        i = t.status_code,
        o = t.body
      xn().addBreadcrumb(
        {
          category: 'xhr',
          data: { method: n, url: r, status_code: i },
          type: 'http',
        },
        { xhr: e.xhr, input: o }
      )
    } else;
  }
  function ni(e) {
    e.endTimestamp &&
      ((e.fetchData.url.match(/sentry_key/) && 'POST' === e.fetchData.method) ||
        (e.error
          ? xn().addBreadcrumb(
              {
                category: 'fetch',
                data: e.fetchData,
                level: ve.Error,
                type: 'http',
              },
              { data: e.error, input: e.args }
            )
          : xn().addBreadcrumb(
              {
                category: 'fetch',
                data: r(r({}, e.fetchData), { status_code: e.response.status }),
                type: 'http',
              },
              { input: e.args, response: e.response }
            )))
  }
  function ri(e) {
    var t = Me(),
      n = e.from,
      r = e.to,
      i = Bt(t.location.href),
      o = Bt(n),
      s = Bt(r)
    o.path || (o = i),
      i.protocol === s.protocol && i.host === s.host && (r = s.relative),
      i.protocol === o.protocol && i.host === o.host && (n = o.relative),
      xn().addBreadcrumb({ category: 'navigation', data: { from: n, to: r } })
  }
  var ii = (function () {
    function e(t) {
      void 0 === t && (t = {}),
        (this.name = e.id),
        (this._key = t.key || 'cause'),
        (this._limit = t.limit || 5)
    }
    return (
      (e.prototype.setupOnce = function () {
        vn(function (t, n) {
          var r = xn().getIntegration(e)
          return r
            ? (function (e, t, n, r) {
                if (
                  !(
                    n.exception &&
                    n.exception.values &&
                    r &&
                    Ge(r.originalException, Error)
                  )
                )
                  return n
                var i = oi(t, r.originalException, e)
                return (n.exception.values = a(i, n.exception.values)), n
              })(r._key, r._limit, t, n)
            : t
        })
      }),
      (e.id = 'LinkedErrors'),
      e
    )
  })()
  function oi(e, t, n, r) {
    if ((void 0 === r && (r = []), !Ge(t[n], Error) || r.length + 1 >= e))
      return r
    var i = _r(t[n])
    return oi(e, t[n], n, a([i], r))
  }
  var si = Me(),
    ai = (function () {
      function e() {
        this.name = e.id
      }
      return (
        (e.prototype.setupOnce = function () {
          vn(function (t) {
            if (xn().getIntegration(e)) {
              if (!si.navigator && !si.location && !si.document) return t
              var n =
                  (t.request && t.request.url) ||
                  (si.location && si.location.href),
                i = (si.document || {}).referrer,
                o = (si.navigator || {}).userAgent,
                s = r(
                  r(r({}, t.request && t.request.headers), i && { Referer: i }),
                  o && { 'User-Agent': o }
                ),
                a = r(r({}, n && { url: n }), { headers: s })
              return r(r({}, t), { request: a })
            }
            return t
          })
        }),
        (e.id = 'UserAgent'),
        e
      )
    })(),
    ci = (function () {
      function e() {
        this.name = e.id
      }
      return (
        (e.prototype.setupOnce = function (t, n) {
          t(function (t) {
            var r = n().getIntegration(e)
            if (r) {
              try {
                if (
                  (function (e, t) {
                    if (!t) return !1
                    if (
                      (function (e, t) {
                        var n = e.message,
                          r = t.message
                        if (!n && !r) return !1
                        if ((n && !r) || (!n && r)) return !1
                        if (n !== r) return !1
                        if (!li(e, t)) return !1
                        if (!ui(e, t)) return !1
                        return !0
                      })(e, t)
                    )
                      return !0
                    if (
                      (function (e, t) {
                        var n = di(t),
                          r = di(e)
                        if (!n || !r) return !1
                        if (n.type !== r.type || n.value !== r.value) return !1
                        if (!li(e, t)) return !1
                        if (!ui(e, t)) return !1
                        return !0
                      })(e, t)
                    )
                      return !0
                    return !1
                  })(t, r._previousEvent)
                )
                  return (
                    Cr &&
                      nt.warn(
                        'Event dropped due to being a duplicate of previously captured event.'
                      ),
                    null
                  )
              } catch (e) {
                return (r._previousEvent = t)
              }
              return (r._previousEvent = t)
            }
            return t
          })
        }),
        (e.id = 'Dedupe'),
        e
      )
    })()
  function ui(e, t) {
    var n = pi(e),
      r = pi(t)
    if (!n && !r) return !0
    if ((n && !r) || (!n && r)) return !1
    if (r.length !== n.length) return !1
    for (var i = 0; i < r.length; i++) {
      var o = r[i],
        s = n[i]
      if (
        o.filename !== s.filename ||
        o.lineno !== s.lineno ||
        o.colno !== s.colno ||
        o.function !== s.function
      )
        return !1
    }
    return !0
  }
  function li(e, t) {
    var n = e.fingerprint,
      r = t.fingerprint
    if (!n && !r) return !0
    if ((n && !r) || (!n && r)) return !1
    try {
      return !(n.join('') !== r.join(''))
    } catch (e) {
      return !1
    }
  }
  function di(e) {
    return e.exception && e.exception.values && e.exception.values[0]
  }
  function pi(e) {
    var t = e.exception
    if (t)
      try {
        return t.values[0].stacktrace.frames
      } catch (e) {
        return
      }
    else if (e.stacktrace) return e.stacktrace.frames
  }
  var hi = Object.freeze({
      __proto__: null,
      GlobalHandlers: Hr,
      TryCatch: Vr,
      Breadcrumbs: Qr,
      LinkedErrors: ii,
      UserAgent: ai,
      Dedupe: ci,
    }),
    fi = (function (e) {
      function t(t) {
        void 0 === t && (t = {})
        return (
          (t._metadata = t._metadata || {}),
          (t._metadata.sdk = t._metadata.sdk || {
            name: 'sentry.javascript.browser',
            packages: [{ name: 'npm:@sentry/browser', version: Jn }],
            version: Jn,
          }),
          e.call(this, Mr, t) || this
        )
      }
      return (
        n(t, e),
        (t.prototype.showReportDialog = function (e) {
          void 0 === e && (e = {}),
            Me().document &&
              (this._isEnabled()
                ? Fr(r(r({}, e), { dsn: e.dsn || this.getDsn() }))
                : Cr &&
                  nt.error(
                    'Trying to call showReportDialog with Sentry Client disabled'
                  ))
        }),
        (t.prototype._prepareEvent = function (t, n, r) {
          return (
            (t.platform = t.platform || 'javascript'),
            e.prototype._prepareEvent.call(this, t, n, r)
          )
        }),
        (t.prototype._sendEvent = function (t) {
          var n = this.getIntegration(Qr)
          n && n.addSentryBreadcrumb(t), e.prototype._sendEvent.call(this, t)
        }),
        t
      )
    })(Fn),
    gi = [
      new Xn(),
      new Yn(),
      new Vr(),
      new Qr(),
      new Hr(),
      new ii(),
      new ci(),
      new ai(),
    ]
  function vi(e) {
    if (
      (void 0 === e && (e = {}),
      void 0 === e.defaultIntegrations && (e.defaultIntegrations = gi),
      void 0 === e.release)
    ) {
      var t = Me()
      t.SENTRY_RELEASE &&
        t.SENTRY_RELEASE.id &&
        (e.release = t.SENTRY_RELEASE.id)
    }
    void 0 === e.autoSessionTracking && (e.autoSessionTracking = !0),
      void 0 === e.sendClientReports && (e.sendClientReports = !0),
      (function (e, t) {
        !0 === t.debug &&
          (jn
            ? nt.enable()
            : console.warn(
                '[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.'
              ))
        var n = xn(),
          r = n.getScope()
        r && r.update(t.initialScope)
        var i = new e(t)
        n.bindClient(i)
      })(fi, e),
      e.autoSessionTracking &&
        (function () {
          if (void 0 === Me().document)
            return void (
              Cr &&
              nt.warn(
                'Session tracking in non-browser environment with @sentry/browser is not supported.'
              )
            )
          var e = xn()
          if (!e.captureSession) return
          _i(e),
            Rt('history', function (e) {
              var t = e.from,
                n = e.to
              void 0 !== t && t !== n && _i(xn())
            })
        })()
  }
  function _i(e) {
    e.startSession({ ignoreDuration: !0 }), e.captureSession()
  }
  var mi = {},
    yi = Me()
  yi.Sentry && yi.Sentry.Integrations && (mi = yi.Sentry.Integrations),
    r(r(r({}, mi), tr), hi)
  const bi = {
      light:
        "data:image/svg+xml,%3Csvg fill='none' height='28' viewBox='0 0 31 28' width='31' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m1.34515 2.72906.891.454zm1.38353-1.38391.45399.891zm0 24.64295.45399-.891zm-1.38353-1.3837-.89101.454zm27.81005 0-.891-.454zm-1.3845 1.3837-.454-.891zm1.3845-23.25904-.891.454zm-1.3845-1.38391.454-.89101zm-27.529957 19.58745c-.359422.4193-.3108602 1.0506.108466 1.41.419326.3594 1.050621.3109 1.410051-.1084zm8.308557-8.1568-.75926-.6507zm3.8696.0269.7682-.6402zm4.2218 5.0662-.7682.6402zm3.7381.1695.7071.7071zm4.5567-.5781.7809-.6247zm3.7844 6.3312c.345.4313.9743.5012 1.4055.1562.4313-.345.5012-.9743.1562-1.4056zm-6.123-7.6922-.2772-.9608zm1.0429.0578.3817-.9243zm-5.7012 2.9691-.3687.9296zm1.0332.0468-.2831-.9591zm-9.01853-7.7124-.33415-.9425zm1.08013.0075.3473-.9378zm17.4666-5.40151v15.20001h2v-15.20001zm-4.0664 19.26671h-18.36662v2h18.36662zm-22.4336-4.0667v-15.20001h-2v15.20001zm4.06698-19.2666h18.36662v-2h-18.36662zm-4.06698 4.06659c0-.90325.00078-1.52052.03982-1.99837.03809-.46616.10756-.71093.19633-.88516l-1.78201-.90799c-.256369.50316-.359478 1.0404-.4076753 1.63028-.0472425.57819-.0464647 1.29099-.0464647 2.16124zm4.06698-6.06659c-.87026 0-1.58324-.00077714-2.1616.0464623-.58997.0481876-1.12747.1512737-1.63069.4076777l.90798 1.78201c.17417-.08874.41907-.15823.88552-.19633.47806-.03904 1.09554-.03982 1.99879-.03982zm-3.83083 3.18306c.20786-.40795.53909-.73931.94652-.94691l-.90798-1.78201c-.78427.399604-1.42121 1.03718-1.82055 1.82093zm3.83083 22.15024c-.90323 0-1.52071-.0008-1.99877-.0398-.46644-.0381-.71136-.1076-.88554-.1964l-.90798 1.782c.5032.2564 1.04069.3595 1.63067.4077.57837.0473 1.29134.0465 2.16162.0465zm-6.06698-4.0667c0 .8702-.00077757 1.5831.0464639 2.1614.0481939.5899.1512951 1.1272.4076761 1.6304l1.78201-.908c-.08876-.1742-.15823-.419-.19633-.8853-.03904-.4779-.03982-1.0953-.03982-1.9985zm3.18267 3.8305c-.40753-.2076-.73871-.5389-.94652-.9467l-1.78201.908c.399395.7838 1.03639 1.4212 1.82055 1.8207zm25.31733-3.8305c0 .9033-.0007 1.5207-.0397 1.9987-.038.4663-.1074.711-.1961.8851l1.782.908c.2564-.5033.3594-1.0408.4075-1.6306.0472-.5782.0463-1.2911.0463-2.1612zm-4.0664 6.0667c.8703 0 1.583.0008 2.1611-.0465.5898-.0482 1.1269-.1513 1.63-.4077l-.908-1.782c-.1743.0888-.419.1583-.885.1964-.4777.039-1.0948.0398-1.9981.0398zm3.8306-3.1829c-.2075.4072-.5393.7387-.9475.9467l.908 1.782c.7834-.3992 1.4218-1.0362 1.8215-1.8207zm2.2358-18.08381c0-.87015.0009-1.58296-.0463-2.16108-.0481-.58982-.1511-1.12717-.4075-1.63044l-1.782.90799c.0887.17412.1581.41878.1961.885.039.47792.0397 1.09518.0397 1.99853zm-6.0664-4.06659c.9033 0 1.5204.00078 1.9981.03982.466.03808.7107.10753.885.19633l.908-1.78201c-.5032-.256346-1.0402-.3594702-1.63-.4076737-.5781-.04724454-1.2908-.0464663-2.1611-.0464663zm5.6126.27507c-.3997-.78441-1.0379-1.421666-1.8215-1.82093l-.908 1.78201c.4081.20794.74.53963.9475.94691zm-28.28694 19.95913 7.54929-8.8076-1.51851-1.3015-7.549297 8.8075zm9.89134-8.7913 4.2219 5.0662 1.5364-1.2804-4.2218-5.0662zm9.4353 5.3026.7871-.787-1.4143-1.4142-.787.787zm3.0688-.6605 4.5652 5.7065 1.5617-1.2494-4.5652-5.7065zm-2.2817-.1265c.3586-.3586.5837-.5825.7657-.7359.1741-.1468.2329-.1618.2355-.1625l-.5545-1.9216c-.3895.1124-.6999.3271-.9701.5549-.2623.2212-.5568.5168-.8909.8509zm3.8434-1.1229c-.2953-.3691-.5554-.6954-.792-.9443-.2435-.2563-.5284-.5039-.9029-.6585l-.7634 1.8485c.0027.0012.0597.0227.2167.1879.164.1726.3632.42.6799.8158zm-2.8422.2245c.1268-.0366.2618-.0292.3839.0212l.7634-1.8485c-.5404-.2232-1.14-.2565-1.7018-.0943zm-7.0017 1.449c.2967.3561.5587.6719.7958.9123.2447.248.5298.4869.9016.6344l.7374-1.8591c-.0028-.0011-.0587-.0213-.2153-.18-.1642-.1664-.3639-.4049-.6831-.788zm3.7992-1.1778c-.3523.3524-.573.5719-.7516.7226-.1704.1439-.2282.1591-.2314.16l.5661 1.9182c.3834-.1131.6889-.325.9553-.5498.2582-.218.5478-.5088.8758-.8368zm-2.1018 2.7245c.537.213 1.1311.2398 1.6849.0763l-.5661-1.9182c-.1252.037-.2603.0308-.3814-.0172zm-8.26135-6.6292c.34723-.4051.5662-.6593.74545-.8353.1726-.1694.2328-.188.2334-.1882l-.66828-1.885c-.39752.1409-.70386.3885-.966.6458-.25541.2507-.53935.5835-.86308.9612zm3.87855-1.2641c-.3184-.3821-.5977-.7188-.8495-.9729-.2585-.2609-.5614-.5128-.9569-.6593l-.6945 1.8756c.0007.0002.0605.0196.2307.1914.1768.1784.3921.4357.7337.8456zm-2.8997.2406c.1287-.0456.2707-.0446.3988.0028l.6945-1.8756c-.5672-.2099-1.1915-.2144-1.76158-.0122zm9.7126-2.9031c-.3222 0-.5833-.26117-.5833-.58333h-2c0 1.42673 1.1566 2.58333 2.5833 2.58333zm.5833-.58333c0 .32216-.2611.58333-.5833.58333v2c1.4267 0 2.5833-1.1566 2.5833-2.58333zm-.5833-.58334c.3222 0 .5833.26117.5833.58334h2c0-1.42674-1.1566-2.58334-2.5833-2.58334zm0-2c-1.4267 0-2.5833 1.1566-2.5833 2.58334h2c0-.32217.2611-.58334.5833-.58334z' fill='%23101010'/%3E%3C/svg%3E",
      dark: "data:image/svg+xml,%3Csvg width='31' height='28' viewBox='0 0 31 28' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.34515 2.72906L2.23615 3.18306L1.34515 2.72906ZM2.72868 1.34515L3.18267 2.23615L2.72868 1.34515ZM2.72868 25.9881L3.18267 25.0971L3.18267 25.0971L2.72868 25.9881ZM1.34515 24.6044L0.45414 25.0584L0.45414 25.0584L1.34515 24.6044ZM29.1552 24.6044L28.2642 24.1504L29.1552 24.6044ZM27.7707 25.9881L27.3167 25.0971L27.7707 25.9881ZM29.1552 2.72906L28.2642 3.18306L28.2642 3.18306L29.1552 2.72906ZM27.7707 1.34515L28.2247 0.45414L28.2247 0.45414L27.7707 1.34515ZM0.240743 20.9326C-0.118679 21.3519 -0.0701172 21.9832 0.349209 22.3426C0.768535 22.702 1.39983 22.6535 1.75926 22.2342L0.240743 20.9326ZM8.5493 12.7758L7.79004 12.1251L7.79004 12.1251L8.5493 12.7758ZM12.4189 12.8027L13.1871 12.1625L13.1871 12.1625L12.4189 12.8027ZM16.6407 17.8689L15.8725 18.5091L15.8725 18.5091L16.6407 17.8689ZM20.3788 18.0384L21.0859 18.7455L21.0859 18.7455L20.3788 18.0384ZM24.9355 17.4603L25.7164 16.8356L25.7164 16.8356L24.9355 17.4603ZM28.7199 23.7915C29.0649 24.2228 29.6942 24.2927 30.1254 23.9477C30.5567 23.6027 30.6266 22.9734 30.2816 22.5421L28.7199 23.7915ZM22.5969 16.0993L22.3197 15.1385L22.3197 15.1385L22.5969 16.0993ZM23.6398 16.1571L24.0215 15.2328L23.6398 16.1571ZM17.9386 19.1262L17.5699 20.0558L17.5699 20.0558L17.9386 19.1262ZM18.9718 19.173L18.6887 18.2139L18.6887 18.2139L18.9718 19.173ZM9.95327 11.4606L9.61912 10.5181L9.61912 10.5181L9.95327 11.4606ZM11.0334 11.4681L11.3807 10.5303L11.3807 10.5303L11.0334 11.4681ZM28.5 6.06659V21.2666H30.5V6.06659H28.5ZM24.4336 25.3333H6.06698V27.3333H24.4336V25.3333ZM2 21.2666V6.06659H0V21.2666H2ZM6.06698 2H24.4336V0H6.06698V2ZM2 6.06659C2 5.16334 2.00078 4.54607 2.03982 4.06822C2.07791 3.60206 2.14738 3.35729 2.23615 3.18306L0.45414 2.27507C0.197771 2.77823 0.094662 3.31547 0.0464647 3.90535C-0.000777803 4.48354 0 5.19634 0 6.06659H2ZM6.06698 0C5.19672 0 4.48374 -0.000777136 3.90538 0.0464623C3.31541 0.0946499 2.77791 0.197736 2.27469 0.45414L3.18267 2.23615C3.35684 2.14741 3.60174 2.07792 4.06819 2.03982C4.54625 2.00078 5.16373 2 6.06698 2V0ZM2.23615 3.18306C2.44401 2.77511 2.77524 2.44375 3.18267 2.23615L2.27469 0.45414C1.49042 0.853744 0.85348 1.49132 0.45414 2.27507L2.23615 3.18306ZM6.06698 25.3333C5.16375 25.3333 4.54627 25.3325 4.06821 25.2935C3.60177 25.2554 3.35685 25.1859 3.18267 25.0971L2.27469 26.8791C2.77789 27.1355 3.31538 27.2386 3.90536 27.2868C4.48373 27.3341 5.1967 27.3333 6.06698 27.3333V25.3333ZM0 21.2666C0 22.1368 -0.000777574 22.8497 0.0464639 23.428C0.0946578 24.0179 0.197759 24.5552 0.45414 25.0584L2.23615 24.1504C2.14739 23.9762 2.07792 23.7314 2.03982 23.2651C2.00078 22.7872 2 22.1698 2 21.2666H0ZM3.18267 25.0971C2.77514 24.8895 2.44396 24.5582 2.23615 24.1504L0.45414 25.0584C0.853535 25.8422 1.49053 26.4796 2.27469 26.8791L3.18267 25.0971ZM28.5 21.2666C28.5 22.1699 28.4993 22.7873 28.4603 23.2653C28.4223 23.7316 28.3529 23.9763 28.2642 24.1504L30.0462 25.0584C30.3026 24.5551 30.4056 24.0176 30.4537 23.4278C30.5009 22.8496 30.5 22.1367 30.5 21.2666H28.5ZM24.4336 27.3333C25.3039 27.3333 26.0166 27.3341 26.5947 27.2868C27.1845 27.2386 27.7216 27.1355 28.2247 26.8791L27.3167 25.0971C27.1424 25.1859 26.8977 25.2554 26.4317 25.2935C25.954 25.3325 25.3369 25.3333 24.4336 25.3333V27.3333ZM28.2642 24.1504C28.0567 24.5576 27.7249 24.8891 27.3167 25.0971L28.2247 26.8791C29.0081 26.4799 29.6465 25.8429 30.0462 25.0584L28.2642 24.1504ZM30.5 6.06659C30.5 5.19644 30.5009 4.48363 30.4537 3.90551C30.4056 3.31569 30.3026 2.77834 30.0462 2.27507L28.2642 3.18306C28.3529 3.35718 28.4223 3.60184 28.4603 4.06806C28.4993 4.54598 28.5 5.16324 28.5 6.06659H30.5ZM24.4336 2C25.3369 2 25.954 2.00078 26.4317 2.03982C26.8977 2.0779 27.1424 2.14735 27.3167 2.23615L28.2247 0.45414C27.7215 0.197794 27.1845 0.0946698 26.5947 0.0464663C26.0166 -0.000778238 25.3039 0 24.4336 0V2ZM30.0462 2.27507C29.6465 1.49066 29.0083 0.853404 28.2247 0.45414L27.3167 2.23615C27.7248 2.44409 28.0567 2.77578 28.2642 3.18306L30.0462 2.27507ZM1.75926 22.2342L9.30855 13.4266L7.79004 12.1251L0.240743 20.9326L1.75926 22.2342ZM11.6506 13.4429L15.8725 18.5091L17.4089 17.2287L13.1871 12.1625L11.6506 13.4429ZM21.0859 18.7455L21.873 17.9585L20.4587 16.5443L19.6717 17.3313L21.0859 18.7455ZM24.1547 18.085L28.7199 23.7915L30.2816 22.5421L25.7164 16.8356L24.1547 18.085ZM21.873 17.9585C22.2316 17.5999 22.4567 17.376 22.6387 17.2226C22.8128 17.0758 22.8716 17.0608 22.8742 17.0601L22.3197 15.1385C21.9302 15.2509 21.6198 15.4656 21.3496 15.6934C21.0873 15.9146 20.7928 16.2102 20.4587 16.5443L21.873 17.9585ZM25.7164 16.8356C25.4211 16.4665 25.161 16.1402 24.9244 15.8913C24.6809 15.635 24.396 15.3874 24.0215 15.2328L23.2581 17.0813C23.2608 17.0825 23.3178 17.104 23.4748 17.2692C23.6388 17.4418 23.838 17.6892 24.1547 18.085L25.7164 16.8356ZM22.8742 17.0601C23.001 17.0235 23.136 17.0309 23.2581 17.0813L24.0215 15.2328C23.4811 15.0096 22.8815 14.9763 22.3197 15.1385L22.8742 17.0601ZM15.8725 18.5091C16.1692 18.8652 16.4312 19.181 16.6683 19.4214C16.913 19.6694 17.1981 19.9083 17.5699 20.0558L18.3073 18.1967C18.3045 18.1956 18.2486 18.1754 18.092 18.0167C17.9278 17.8503 17.7281 17.6118 17.4089 17.2287L15.8725 18.5091ZM19.6717 17.3313C19.3194 17.6837 19.0987 17.9032 18.9201 18.0539C18.7497 18.1978 18.6919 18.213 18.6887 18.2139L19.2548 20.1321C19.6382 20.019 19.9437 19.8071 20.2101 19.5823C20.4683 19.3643 20.7579 19.0735 21.0859 18.7455L19.6717 17.3313ZM17.5699 20.0558C18.1069 20.2688 18.701 20.2956 19.2548 20.1321L18.6887 18.2139C18.5635 18.2509 18.4284 18.2447 18.3073 18.1967L17.5699 20.0558ZM9.30855 13.4266C9.65578 13.0215 9.87475 12.7673 10.054 12.5913C10.2266 12.4219 10.2868 12.4033 10.2874 12.4031L9.61912 10.5181C9.2216 10.659 8.91526 10.9066 8.65312 11.1639C8.39771 11.4146 8.11377 11.7474 7.79004 12.1251L9.30855 13.4266ZM13.1871 12.1625C12.8687 11.7804 12.5894 11.4437 12.3376 11.1896C12.0791 10.9287 11.7762 10.6768 11.3807 10.5303L10.6862 12.4059C10.6869 12.4061 10.7467 12.4255 10.9169 12.5973C11.0937 12.7757 11.309 13.033 11.6506 13.4429L13.1871 12.1625ZM10.2874 12.4031C10.4161 12.3575 10.5581 12.3585 10.6862 12.4059L11.3807 10.5303C10.8135 10.3204 10.1892 10.3159 9.61912 10.5181L10.2874 12.4031ZM20 9.5C19.6778 9.5 19.4167 9.23883 19.4167 8.91667H17.4167C17.4167 10.3434 18.5733 11.5 20 11.5V9.5ZM20.5833 8.91667C20.5833 9.23883 20.3222 9.5 20 9.5V11.5C21.4267 11.5 22.5833 10.3434 22.5833 8.91667H20.5833ZM20 8.33333C20.3222 8.33333 20.5833 8.5945 20.5833 8.91667H22.5833C22.5833 7.48993 21.4267 6.33333 20 6.33333V8.33333ZM20 6.33333C18.5733 6.33333 17.4167 7.48993 17.4167 8.91667H19.4167C19.4167 8.5945 19.6778 8.33333 20 8.33333V6.33333Z' fill='%23F7F7F7'/%3E%3C/svg%3E%0A",
    },
    wi = (e, t) =>
      i(void 0, void 0, void 0, function* () {
        const n = yield xi(t)
        try {
          const t = yield ((r = n),
          (o = e),
          i(void 0, void 0, void 0, function* () {
            const e = {
                method: 'eth_call',
                params: [{ to: Oi(o), data: '0x5b648b0a' }, 'latest'],
                id: 44,
                jsonrpc: '2.0',
              },
              t = yield fetch(r, {
                method: 'POST',
                body: JSON.stringify(e),
                headers: { 'Content-Type': 'application/json' },
              })
            if (t.status >= 400) throw new Error('Could not fetch wallet type')
            try {
              const e = yield t.json()
              if ('0x' == e.result) throw new Error('Invalid app address')
              return parseInt(e.result, 16)
            } catch (e) {
              throw (
                (le('fetchWalletType').error('error fetch wallet type', e),
                new Error('Could not fetch wallet type'))
              )
            }
          }))
          return t
        } catch (e) {
          throw (
            (le('WalletProvider').error('getWalletType', e),
            new Error('Error occurred during getting wallet type'))
          )
        }
        var r, o
      }),
    xi = (e) =>
      i(void 0, void 0, void 0, function* () {
        try {
          const t = new URL('/api/v1/get-config/', e),
            n = yield fetch(t.toString())
          if (n.status < 400) {
            return (yield n.json()).RPC_URL
          }
          {
            const e = yield n.text()
            throw (
              (le('AuthProvider').error('getArcanaRpc', { err: e }),
              new Error('Error during fetching config from gateway url'))
            )
          }
        } catch (e) {
          throw (
            (le('WalletProvider').error('getConfig', e),
            new Error('Error occurred during getting arcana RPC url'))
          )
        }
      }),
    Ei = (e, t, ...n) => {
      const r = document.createElement(e)
      t && (Object.assign(r, t), t.style && Object.assign(r.style, t.style))
      for (const e of n)
        'string' != typeof e
          ? r.appendChild(e)
          : r.appendChild(document.createTextNode(e))
      return r
    },
    Si = (e, t) => {
      t.right && (e.style.right = t.right),
        t.left && (e.style.left = t.left),
        (e.style.bottom = t.bottom)
    },
    Ci = (e, t) => {
      const n = e ? '20px' : '30px'
      return { bottom: n, [t]: n }
    }
  const ki = (e) => (
      vi({ dsn: e, maxBreadcrumbs: 5, debug: !0, defaultIntegrations: !1 }),
      (e) => {
        var t, n, i
        ;(t = e),
          (i = new Error(t)),
          kn(
            'captureMessage',
            t,
            'string' == typeof n ? n : void 0,
            r(
              { originalException: t, syntheticException: i },
              'string' != typeof n ? { captureContext: n } : void 0
            )
          )
      }
    ),
    Li = '0x',
    Oi = (e) => (e.startsWith(Li) ? e : `0x${e}`),
    Ai = (e, t) => {
      e.target.src = bi[t]
    },
    Ni = () => window.location.origin + window.location.pathname,
    Ii = 4294967295
  let Ri = Math.floor(Math.random() * Ii)
  const Ti = [
    'eth_sign',
    'personal_sign',
    'eth_decrypt',
    'eth_signTypedData_v4',
    'eth_signTransaction',
    'eth_sendTransaction',
    'wallet_switchEthereumChain',
    'wallet_addEthereumChain',
  ]
  class Mi extends Error {
    constructor(e, t, n = '') {
      super(t), (this.code = e), (this.message = t), (this.data = n)
    }
  }
  class ji extends te {
    constructor(e, t) {
      super(),
        (this.iframe = e),
        (this.rpcConfig = t),
        (this.logger = le('ArcanaProvider')),
        (this.onResponse = (e, t) => {
          this.subscriber.emit(`result:${e}:${t.id}`, t)
        }),
        (this.handleEvents = (e, t) => {
          switch (e) {
            case 'accountsChanged':
              this.emit(e, [t])
              break
            case 'chainChanged':
              this.emit('chainChanged', t)
              break
            case 'connect':
              this.iframe.showWidgetBubble(), this.emit('connect', t)
              break
            case 'disconnect':
              this.emit('disconnect', t)
              break
            case 'message':
              this.emit('message', t)
          }
        }),
        (this.subscriber = new te())
    }
    init(e) {
      return i(this, void 0, void 0, function* () {
        const { communication: t } = yield this.iframe.setConnectionMethods({
          onEvent: this.handleEvents,
          onMethodResponse: (e, t) => {
            this.onResponse(e, t)
          },
          getParentUrl: Ni,
          getAppMode: () => {
            var e
            return null === (e = this.iframe) || void 0 === e
              ? void 0
              : e.appMode
          },
          getAppConfig: this.iframe.getAppConfig,
          getRpcConfig: () => this.rpcConfig,
          sendPendingRequestCount: this.iframe.onReceivingPendingRequestCount,
          triggerSocialLogin: e.loginWithSocial,
          triggerPasswordlessLogin: e.loginWithLink,
          openPopup: () => this.iframe.show(),
          closePopup: () => this.iframe.hide(),
          getPopupState: () => this.iframe.getState(),
        })
        this.communication = t
      })
    }
    isLoggedIn() {
      return i(this, void 0, void 0, function* () {
        try {
          return (yield this.getCommunication('isLoggedIn')).isLoggedIn()
        } catch (e) {
          return this.logger.error('isLoggedIn', e), !1
        }
      })
    }
    isConnected() {
      return i(this, void 0, void 0, function* () {
        return yield this.isLoggedIn()
      })
    }
    isLoginAvailable(e) {
      return i(this, void 0, void 0, function* () {
        const t = yield this.getCommunication('isLoginAvailable'),
          n = yield t.isLoginAvailable(e)
        return this.logger.info('loginAvailable', { [e]: n }), n
      })
    }
    requestUserInfo() {
      return i(this, void 0, void 0, function* () {
        const e = yield this.getCommunication('getUserInfo')
        if (!(yield e.isLoggedIn()))
          throw (this.logger.error('requestUserInfo', re), re)
        return yield e.getUserInfo()
      })
    }
    getPublicKey(e, t) {
      return i(this, void 0, void 0, function* () {
        const n = yield this.getCommunication('getPublicKey')
        return yield n.getPublicKey(e, t)
      })
    }
    getAvailableLogins() {
      return i(this, void 0, void 0, function* () {
        const e = yield this.getCommunication('getAvailableLogins')
        return yield e.getAvailableLogins()
      })
    }
    triggerLogout() {
      return i(this, void 0, void 0, function* () {
        const e = yield this.getCommunication('triggerLogout')
        yield e.triggerLogout()
      })
    }
    getCommunication(e = 'sendRequest') {
      return i(this, void 0, void 0, function* () {
        if (this.communication) {
          const t = yield this.communication.promise
          if (!t[e])
            throw new ne(
              'fn_not_available',
              `The requested fn ${e} is not available in this context`
            )
          return t
        }
        throw new ne(
          'connection_not_available',
          'The connection is not available yet'
        )
      })
    }
    openPermissionScreen(e) {
      Ti.includes(e) && this.iframe.show()
    }
    request(e) {
      return i(this, void 0, void 0, function* () {
        if (!e || 'object' != typeof e || Array.isArray(e))
          throw c.ethErrors.rpc.invalidRequest({
            message: 'Invalid request arguments',
            data: e,
          })
        const { method: t, params: n } = e
        if (!t)
          throw c.ethErrors.rpc.invalidRequest({
            message: 'Invalid method argument',
            data: e,
          })
        this.openPermissionScreen(t)
        const r = {
          method: t,
          params: n,
          jsonrpc: '2.0',
          id: ((Ri = (Ri + 1) % Ii), Ri),
        }
        return new Promise((e, n) => {
          this.getCommunication().then(
            (o) =>
              i(this, void 0, void 0, function* () {
                this.getResponse(t, r.id).then(e, n), yield o.sendRequest(r)
              }),
            n
          )
        })
      })
    }
    getResponse(e, t) {
      return new Promise((n, r) => {
        this.subscriber.once(`result:${e}:${t}`, (e) =>
          e.error ? r(Pi(e.error)) : n(e.result)
        )
      })
    }
  }
  const Pi = (e) => {
    switch ((le('ArcanaProvider').error('getError', e), e)) {
      case 'user_deny':
        return new Mi(4001, 'User rejected the request.')
      case 'operation_not_supported':
        return new Mi(
          4200,
          'The requested method is not supported by this provider.'
        )
      case 'all_disconnected':
        return new Mi(
          4900,
          'The provider is disconnected from all chains. Login is pending.'
        )
      default:
        return 'string' != typeof e
          ? new Mi(e.code, e.message, e.data)
          : c.ethErrors.rpc.internal(e)
    }
  }
  var Ui, Di, zi, Fi, Hi
  !(function (e) {
    ;(e.Call = 'call'),
      (e.Reply = 'reply'),
      (e.Syn = 'syn'),
      (e.SynAck = 'synAck'),
      (e.Ack = 'ack')
  })(Ui || (Ui = {})),
    (function (e) {
      ;(e.Fulfilled = 'fulfilled'), (e.Rejected = 'rejected')
    })(Di || (Di = {})),
    (function (e) {
      ;(e.ConnectionDestroyed = 'ConnectionDestroyed'),
        (e.ConnectionTimeout = 'ConnectionTimeout'),
        (e.NoIframeSrc = 'NoIframeSrc')
    })(zi || (zi = {})),
    (function (e) {
      e.DataCloneError = 'DataCloneError'
    })(Fi || (Fi = {})),
    (function (e) {
      e.Message = 'message'
    })(Hi || (Hi = {}))
  const Bi = { 'http:': '80', 'https:': '443' },
    qi = /^(https?:)?\/\/([^/:]+)?(:(\d+))?/,
    Wi = ['file:', 'data:']
  const $i = ({ name: e, message: t, stack: n }) => ({
    name: e,
    message: t,
    stack: n,
  })
  let Gi = 0
  var Zi = () => ++Gi
  const Vi = (e) => (e ? e.split('.') : []),
    Ji = (e, t, n) => {
      const r = Vi(t)
      return (
        r.reduce(
          (e, t, i) => (
            void 0 === e[t] && (e[t] = {}),
            i === r.length - 1 && (e[t] = n),
            e[t]
          ),
          e
        ),
        e
      )
    },
    Yi = (e, t) => {
      const n = {}
      return (
        Object.keys(e).forEach((r) => {
          const i = e[r],
            o = ((e, t) => {
              const n = Vi(t || '')
              return n.push(e), ((e) => e.join('.'))(n)
            })(r, t)
          'object' == typeof i && Object.assign(n, Yi(i, o)),
            'function' == typeof i && (n[o] = i)
        }),
        n
      )
    }
  var Ki = (e, t, n, r, i) => {
      const {
        localName: o,
        local: s,
        remote: a,
        originForSending: c,
        originForReceiving: u,
      } = t
      let l = !1
      i(`${o}: Connecting call sender`)
      const d =
          (e) =>
          (...t) => {
            let n
            i(`${o}: Sending ${e}() call`)
            try {
              a.closed && (n = !0)
            } catch (e) {
              n = !0
            }
            if ((n && r(), l)) {
              const t = new Error(
                `Unable to send ${e}() call due to destroyed connection`
              )
              throw ((t.code = zi.ConnectionDestroyed), t)
            }
            return new Promise((n, r) => {
              const l = Zi(),
                d = (t) => {
                  if (
                    t.source !== a ||
                    t.data.penpal !== Ui.Reply ||
                    t.data.id !== l
                  )
                    return
                  if ('*' !== u && t.origin !== u)
                    return void i(
                      `${o} received message from origin ${t.origin} which did not match expected origin ${u}`
                    )
                  const c = t.data
                  i(`${o}: Received ${e}() reply`),
                    s.removeEventListener(Hi.Message, d)
                  let p = c.returnValue
                  c.returnValueIsError &&
                    (p = ((e) => {
                      const t = new Error()
                      return Object.keys(e).forEach((n) => (t[n] = e[n])), t
                    })(p)),
                    (c.resolution === Di.Fulfilled ? n : r)(p)
                }
              s.addEventListener(Hi.Message, d)
              const p = { penpal: Ui.Call, id: l, methodName: e, args: t }
              a.postMessage(p, c)
            })
          },
        p = n.reduce((e, t) => ((e[t] = d(t)), e), {})
      return (
        Object.assign(
          e,
          ((e) => {
            const t = {}
            for (const n in e) Ji(t, n, e[n])
            return t
          })(p)
        ),
        () => {
          l = !0
        }
      )
    },
    Xi = (e, t, n, r, i) => {
      const { destroy: o, onDestroy: s } = r
      let a, c
      const u = {}
      return (r) => {
        if ('*' !== t && r.origin !== t)
          return void i(
            `Parent: Handshake - Received ACK message from origin ${r.origin} which did not match expected origin ${t}`
          )
        i('Parent: Handshake - Received ACK')
        const l = {
          localName: 'Parent',
          local: window,
          remote: r.source,
          originForSending: n,
          originForReceiving: t,
        }
        a && a(),
          (a = ((e, t, n) => {
            const {
              localName: r,
              local: i,
              remote: o,
              originForSending: s,
              originForReceiving: a,
            } = e
            let c = !1
            const u = (e) => {
              if (e.source !== o || e.data.penpal !== Ui.Call) return
              if ('*' !== a && e.origin !== a)
                return void n(
                  `${r} received message from origin ${e.origin} which did not match expected origin ${a}`
                )
              const i = e.data,
                { methodName: u, args: l, id: d } = i
              n(`${r}: Received ${u}() call`)
              const p = (e) => (t) => {
                if ((n(`${r}: Sending ${u}() reply`), c))
                  return void n(
                    `${r}: Unable to send ${u}() reply due to destroyed connection`
                  )
                const i = {
                  penpal: Ui.Reply,
                  id: d,
                  resolution: e,
                  returnValue: t,
                }
                e === Di.Rejected &&
                  t instanceof Error &&
                  ((i.returnValue = $i(t)), (i.returnValueIsError = !0))
                try {
                  o.postMessage(i, s)
                } catch (e) {
                  if (e.name === Fi.DataCloneError) {
                    const t = {
                      penpal: Ui.Reply,
                      id: d,
                      resolution: Di.Rejected,
                      returnValue: $i(e),
                      returnValueIsError: !0,
                    }
                    o.postMessage(t, s)
                  }
                  throw e
                }
              }
              new Promise((e) => e(t[u].apply(t, l))).then(
                p(Di.Fulfilled),
                p(Di.Rejected)
              )
            }
            return (
              i.addEventListener(Hi.Message, u),
              () => {
                ;(c = !0), i.removeEventListener(Hi.Message, u)
              }
            )
          })(l, e, i)),
          s(a),
          c &&
            c.forEach((e) => {
              delete u[e]
            }),
          (c = r.data.methodNames)
        const d = Ki(u, l, c, o, i)
        return s(d), u
      }
    }
  var Qi = (e) => {
    let {
      iframe: t,
      methods: n = {},
      childOrigin: r,
      timeout: i,
      debug: o = !1,
    } = e
    const s = (
        (e) =>
        (...t) => {
          e && console.log('[Penpal]', ...t)
        }
      )(o),
      a = ((e, t) => {
        const n = []
        let r = !1
        return {
          destroy(i) {
            r ||
              ((r = !0),
              t(`${e}: Destroying connection`),
              n.forEach((e) => {
                e(i)
              }))
          },
          onDestroy(e) {
            r ? e() : n.push(e)
          },
        }
      })('Parent', s),
      { onDestroy: c, destroy: u } = a
    r ||
      (((e) => {
        if (!e.src && !e.srcdoc) {
          const e = new Error(
            'Iframe must have src or srcdoc property defined.'
          )
          throw ((e.code = zi.NoIframeSrc), e)
        }
      })(t),
      (r = ((e) => {
        if (e && Wi.find((t) => e.startsWith(t))) return 'null'
        const t = document.location,
          n = qi.exec(e)
        let r, i, o
        return (
          n
            ? ((r = n[1] ? n[1] : t.protocol), (i = n[2]), (o = n[4]))
            : ((r = t.protocol), (i = t.hostname), (o = t.port)),
          `${r}//${i}${o && o !== Bi[r] ? `:${o}` : ''}`
        )
      })(t.src)))
    const l = 'null' === r ? '*' : r,
      d = Yi(n),
      p = ((e, t, n, r) => (i) => {
        if (!i.source) return
        if ('*' !== n && i.origin !== n)
          return void e(
            `Parent: Handshake - Received SYN message from origin ${i.origin} which did not match expected origin ${n}`
          )
        e('Parent: Handshake - Received SYN, responding with SYN-ACK')
        const o = { penpal: Ui.SynAck, methodNames: Object.keys(t) }
        i.source.postMessage(o, r)
      })(s, d, r, l),
      h = Xi(d, r, l, a, s),
      f = new Promise((e, n) => {
        const r = ((e, t) => {
            let n
            return (
              void 0 !== e &&
                (n = window.setTimeout(() => {
                  const n = new Error(`Connection timed out after ${e}ms`)
                  ;(n.code = zi.ConnectionTimeout), t(n)
                }, e)),
              () => {
                clearTimeout(n)
              }
            )
          })(i, u),
          o = (n) => {
            if (n.source === t.contentWindow && n.data)
              if (n.data.penpal !== Ui.Syn)
                if (n.data.penpal !== Ui.Ack);
                else {
                  const t = h(n)
                  t && (r(), e(t))
                }
              else p(n)
          }
        window.addEventListener(Hi.Message, o),
          s('Parent: Awaiting handshake'),
          ((e, t) => {
            const { destroy: n, onDestroy: r } = t,
              i = setInterval(() => {
                e.isConnected || (clearInterval(i), n())
              }, 6e4)
            r(() => {
              clearInterval(i)
            })
          })(t, a),
          c((e) => {
            window.removeEventListener(Hi.Message, o), e && n(e)
          })
      })
    return {
      promise: f,
      destroy() {
        u()
      },
    }
  }
  const eo =
      'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACuSURBVHgB7ZTBCYAwDEW/TtBRHMGNHMG6iSO4gW5kN9AUeghiNan1UOiDoNIkj0IiUKkUjTFmoOiUNT1S8IUUB8UulVLeGGrGWE4bO3DObfSYfB+K9U0aJDZ8NkiFGtm3m7Kb+bD4ypM0u+xJ+pssIp1/ld1Ik2Qt9Bzs3VEsUKASXkZ/g3BlkrgbEMnKZJOxs7xSyehnk2r27LOU/bzFo8+kovxYA6us6VGpFM0JJh9YsfU7O7QAAAAASUVORK5CYII=)',
    to =
      'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACsSURBVHgB7ZTNCcQgEEZHbWhLSEdbwlrKlrAdbEnJRfy5JAoZCCEJMxM9BHwgevDzgc4I0Ok8mhDCO6X04mS89wNIKME85iwdqdIY46dkygwScthSpShbhwUpFGk1GUVaXXYlbSY7kjrnvk1le6lUpoGJ1nrGtVJqMsb8oBXbN8vX+uf2qViG18jp09sypLqUUvrVpJw+uy3Fz5tT+puWIe0/O8AyMwN0Oo9mAWX8dJ7PBgbsAAAAAElFTkSuQmCC)',
    no = {
      position: 'absolute',
      width: '117px',
      height: '117px',
      border: 'none',
      borderRadius: '50%',
      boxShadow: '4px 5px 4px rgba(0, 0, 0, 0.25)',
      margin: '0 auto',
      cursor: 'pointer',
      display: 'none',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    ro = {
      width: '28px',
      height: '28px',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      marginLeft: '5px',
    },
    io = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 16px',
      borderRadius: '10px 10px 0px 0px',
      zIndex: '1',
    },
    oo = {
      light: Object.assign(Object.assign({}, no), {
        backgroundColor: '#ededed',
      }),
      dark: Object.assign(Object.assign({}, no), {
        backgroundColor: '#000000',
      }),
      bubbleLogo: { width: '60px', objectFit: 'contain' },
      closeButton: Object.assign(Object.assign({}, ro), {
        width: '20px',
        height: '20px',
        position: 'absolute',
        top: '-15px',
        right: '0px',
        backgroundImage: eo,
        backgroundPosition: 'center',
      }),
      reqCountBadge: {
        width: '25px',
        height: '25px',
        borderRadius: '50%',
        background:
          'linear-gradient(159.35deg, #F3A2A2 -22.29%, #FFB1B1 102.13%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: '12px',
        position: 'absolute',
        top: '-10px',
        left: '10px',
      },
    },
    so = {
      container: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 5px 4px rgba(0, 0, 0, 0.25)',
        borderRadius: '10px',
      },
      header: {
        container: {
          light: Object.assign(Object.assign({}, io), {
            boxShadow: '2px 2px 2px 0px #0000000D, -2px -2px 1px 0px #FFFFFFB2',
            background: '#F9F9F9',
          }),
          dark: Object.assign(Object.assign({}, io), {
            boxShadow: '0 5px 4px -4px #181818',
            background: '#262626',
          }),
        },
        logo: { height: '25px' },
        closeButton: {
          light: Object.assign(Object.assign({}, ro), { backgroundImage: eo }),
          dark: Object.assign(Object.assign({}, ro), { backgroundImage: to }),
        },
      },
      body: { flex: 1, display: 'flex' },
      iframe: {
        width: '100%',
        height: '100%',
        border: 'none',
        borderRadius: '0px 0px 10px 10px',
      },
    }
  class ao {
    constructor(t) {
      ;(this.params = t),
        (this.getAppConfig = () => this.params.appConfig),
        (this.show = () => {
          switch (this.appMode) {
            case e.AppMode.Full:
            case e.AppMode.Widget:
              this.openWidgetIframe()
            case e.AppMode.NoUI:
          }
        }),
        (this.hide = () => {
          switch (this.appMode) {
            case e.AppMode.Full:
            case e.AppMode.Widget:
              this.closeWidgetIframe()
            case e.AppMode.NoUI:
          }
        }),
        this.checkSecureOrigin()
    }
    setConnectionMethods(e) {
      return i(this, void 0, void 0, function* () {
        try {
          return (
            this.iframeCommunication ||
              ((this.iframeCommunication = Qi({
                iframe: this.iframe,
                methods: Object.assign({}, e),
                childOrigin: this.params.iframeUrl,
              })),
              yield this.iframeCommunication.promise),
            { iframe: this.iframe, communication: this.iframeCommunication }
          )
        } catch (e) {
          throw new Error('Could not set connection methods')
        }
      })
    }
    setWalletType(e, t) {
      ;(this.appMode = (function (e, t) {
        const n = ge[e]
        return void 0 !== t
          ? n.includes(t)
            ? t
            : (le('WalletProvider').warn('verifyMode-mismatch', {
                a: t,
                allowedModes: n,
              }),
              n[0])
          : n[0]
      })(e, t)),
        this.initWalletUI()
    }
    getState() {
      return this.state
    }
    showWidgetBubble() {
      this.appMode === e.AppMode.Full &&
        (this.widgetBubble.style.display = 'flex')
    }
    onReceivingPendingRequestCount(e) {
      const t = document.getElementById('req-count-badge')
      t &&
        (e > 0
          ? ((t.style.display = 'flex'), (t.textContent = `${e}`))
          : (t.style.display = 'none'))
    }
    constructWidgetIframeStructure(e) {
      const {
          appConfig: { themeConfig: t },
        } = this.params,
        { theme: n, assets: r } = t,
        i = Ei('img', {
          src: r.logo.horizontal,
          style: so.header.logo,
          onerror: (e) => Ai(e, n),
        }),
        o = Ei('button', {
          onclick: () => this.closeWidgetIframe(),
          style: e ? so.header.closeButton[n] : { display: 'none' },
        })
      return {
        widgetIframeHeader: Ei('div', { style: so.header.container[n] }, i, o),
        widgetIframeBody: Ei('div', { style: so.body }),
      }
    }
    createWidgetIframe(e) {
      const t = new URL(`/${this.params.appId}/login`, this.params.iframeUrl)
      this.iframe = Ei('iframe', {
        style: so.iframe,
        src: t.toString(),
        allow: 'clipboard-write',
      })
      const { widgetIframeHeader: n, widgetIframeBody: r } =
        this.constructWidgetIframeStructure(e)
      return (
        r.appendChild(this.iframe), Ei('div', { style: so.container }, n, r)
      )
    }
    createWidgetBubble() {
      const {
          appConfig: { themeConfig: e },
        } = this.params,
        { theme: t, assets: n } = e,
        r = Ei('img', {
          src: n.logo.vertical,
          style: oo.bubbleLogo,
          onerror: (e) => Ai(e, t),
        }),
        i = Ei('p', {
          id: 'req-count-badge',
          style: Object.assign(Object.assign({}, oo.reqCountBadge), {
            display: 'none',
          }),
        }),
        o = Ei('button', {
          onclick: (e) => {
            e.stopPropagation(), this.onCloseBubbleClick()
          },
          style: oo.closeButton,
        })
      return Ei(
        'button',
        { onclick: () => this.openWidgetIframe(), style: oo[t] },
        i,
        r,
        o
      )
    }
    initWalletUI() {
      const t = this.appMode === e.AppMode.Full
      ;(this.widgetIframeContainer = this.createWidgetIframe(t)),
        (this.widgetBubble = this.createWidgetBubble()),
        this.resizeWidgetUI(),
        window.addEventListener('resize', () => this.resizeWidgetUI()),
        (this.widgetIframeContainer.style.display = 'none'),
        document.body.appendChild(this.widgetBubble),
        document.body.appendChild(this.widgetIframeContainer)
    }
    onCloseBubbleClick() {
      this.widgetBubble.style.display = 'none'
    }
    resizeWidgetUI() {
      const { matches: e } = window.matchMedia('(max-width: 768px)')
      var t, n
      ;(t = this.widgetIframeContainer),
        (n = ((e) => {
          const t = { height: '', width: '' }
          return (t.height = '80vh'), (t.width = e ? '235px' : '360px'), t
        })(e)),
        (t.style.height = n.height),
        (t.style.width = n.width),
        Si(this.widgetBubble, Ci(e, this.params.position)),
        Si(this.widgetIframeContainer, Ci(e, this.params.position))
    }
    closeWidgetIframe() {
      const t = this.appMode === e.AppMode.Full
      ;(this.widgetBubble.style.display = t ? 'flex' : 'none'),
        (this.widgetIframeContainer.style.display = 'none'),
        (this.state = 'closed')
    }
    openWidgetIframe() {
      ;(this.widgetBubble.style.display = 'none'),
        (this.widgetIframeContainer.style.display = 'flex'),
        (this.state = 'open')
    }
    checkSecureOrigin() {
      const e =
          'localhost' === location.hostname ||
          '127.0.0.1' === location.hostname,
        t = 'https:' === location.protocol
      if (!(e || t)) throw new Error('Insecure origin')
    }
  }
  var co
  ;(e.CHAIN = void 0),
    ((co = e.CHAIN || (e.CHAIN = {})).ETHEREUM_MAINNET = '0x1'),
    (co.ETHEREUM_SEPOLIA = '0xAA36A7'),
    (co.ETHEREUM_GOERLI = '0x5'),
    (co.POLYGON_MAINNET = '0x89'),
    (co.POLYGON_MUMBAI_TESTNET = '0x13881'),
    (co.ARCANA_TESTNET = '0x9DD5'),
    (co.ARCANA_DEV = '0x9DD4')
  const uo = {
      [e.CHAIN.ETHEREUM_MAINNET]: {
        chainId: e.CHAIN.ETHEREUM_MAINNET,
        rpcUrls: ['https://cloudflare-eth.com/'],
        chainName: 'Ethereum Mainnet',
        blockExplorerUrls: ['https://etherscan.io/'],
        nativeCurrency: { symbol: 'ETH', decimals: 18 },
      },
      [e.CHAIN.ETHEREUM_SEPOLIA]: {
        chainId: e.CHAIN.ETHEREUM_SEPOLIA,
        rpcUrls: ['https://rpc.sepolia.org'],
        chainName: 'Ethereum Sepolia (Testnet)',
        blockExplorerUrls: ['https://sepolia.etherscan.io/'],
        nativeCurrency: { symbol: 'ETH', decimals: 18 },
      },
      [e.CHAIN.ETHEREUM_GOERLI]: {
        chainId: e.CHAIN.ETHEREUM_GOERLI,
        rpcUrls: [
          'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        ],
        chainName: 'Ethereum Goerli (Testnet)',
        blockExplorerUrls: ['https://goerli.etherscan.io/'],
        nativeCurrency: { symbol: 'ETH', decimals: 18 },
      },
      [e.CHAIN.POLYGON_MAINNET]: {
        chainId: e.CHAIN.POLYGON_MAINNET,
        rpcUrls: ['https://polygon-rpc.com'],
        chainName: 'Polygon Mainnet',
        blockExplorerUrls: ['https://polygonscan.com'],
        nativeCurrency: { symbol: 'matic', decimals: 18 },
      },
      [e.CHAIN.POLYGON_MUMBAI_TESTNET]: {
        chainId: e.CHAIN.POLYGON_MUMBAI_TESTNET,
        rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
        chainName: 'Polygon Mumbai (Testnet)',
        blockExplorerUrls: ['https://mumbai-explorer.matic.today'],
        nativeCurrency: { symbol: 'matic', decimals: 18 },
      },
      [e.CHAIN.ARCANA_TESTNET]: {
        chainId: e.CHAIN.ARCANA_TESTNET,
        rpcUrls: ['https://blockchain001-testnet.arcana.network/'],
        chainName: 'Arcana (Testnet)',
        blockExplorerUrls: ['https://explorer.beta.arcana.network/'],
      },
      [e.CHAIN.ARCANA_DEV]: {
        chainId: e.CHAIN.ARCANA_DEV,
        rpcUrls: ['https://blockchain-dev.arcana.network'],
        chainName: 'Arcana Dev',
        blockExplorerUrls: ['https://explorer.dev.arcana.network/'],
      },
    },
    lo = (e) => {
      if (uo[e]) return uo[e]
      throw new Error('Unsupported chainId!')
    },
    po = {
      authUrl: 'https://verify.dev.arcana.network',
      gatewayUrl: 'https://gateway-dev.arcana.network',
      walletUrl: 'https://wallet.dev.arcana.network',
      sentryDsn:
        'https://68615fda056a4337bcc9b7e3062562c3@o1011868.ingest.sentry.io/6449849',
    },
    ho = {
      authUrl: 'https://verify.beta.arcana.network',
      gatewayUrl: 'https://gateway001-testnet.arcana.network',
      walletUrl: 'https://wallet.beta.arcana.network',
      sentryDsn:
        'https://4e27545e4faf43318301625d79a6dc34@o1011868.ingest.sentry.io/6451353',
    }
  class fo {
    constructor(e) {
      this.url = e
    }
    open() {
      const e = vo()
      return (
        (this.window = window.open(this.url, '_blank', e)),
        this.getWindowResponse()
      )
    }
    getWindowResponse() {
      return new Promise((e, t) => {
        let n = !1
        const r = window.setInterval(() => {
            var e
            !n &&
              (null === (e = this.window) || void 0 === e
                ? void 0
                : e.closed) &&
              t('User closed the popup')
          }, 500),
          o = (s) =>
            i(this, void 0, void 0, function* () {
              var i, a, c
              if (
                !(null === (i = null == s ? void 0 : s.data) || void 0 === i
                  ? void 0
                  : i.status)
              )
                return
              const u = s.data
              return (
                (n = !0),
                this.clear(o, r),
                'success' === u.status
                  ? (null === (a = this.window) || void 0 === a || a.close(),
                    e('success'))
                  : 'error' == u.status
                  ? (null === (c = this.window) || void 0 === c || c.close(),
                    t(u.error))
                  : 'done' === u.status
                  ? e('done')
                  : void console.log('Unexpected event')
              )
            })
        window.addEventListener('message', o, !1)
      })
    }
    clear(e, t) {
      window.removeEventListener('message', e), window.clearInterval(t)
    }
  }
  const go = {
      titlebar: 0,
      toolbar: 0,
      status: 0,
      menubar: 0,
      resizable: 0,
      height: 1200,
      width: 700,
      popup: 1,
    },
    vo = () => {
      const e = []
      for (const t in go) e.push(`${t}=${go[t]}`)
      return e.join(',')
    }
  var _o,
    mo,
    yo,
    bo,
    wo,
    xo = {},
    Eo = [],
    So = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i
  function Co(e, t) {
    for (var n in t) e[n] = t[n]
    return e
  }
  function ko(e) {
    var t = e.parentNode
    t && t.removeChild(e)
  }
  function Lo(e, t, n, r, i) {
    var o = {
      type: e,
      props: t,
      key: n,
      ref: r,
      __k: null,
      __: null,
      __b: 0,
      __e: null,
      __d: void 0,
      __c: null,
      __h: null,
      constructor: void 0,
      __v: null == i ? ++yo : i,
    }
    return null == i && null != mo.vnode && mo.vnode(o), o
  }
  function Oo(e) {
    return e.children
  }
  function Ao(e, t) {
    ;(this.props = e), (this.context = t)
  }
  function No(e, t) {
    if (null == t) return e.__ ? No(e.__, e.__.__k.indexOf(e) + 1) : null
    for (var n; t < e.__k.length; t++)
      if (null != (n = e.__k[t]) && null != n.__e) return n.__e
    return 'function' == typeof e.type ? No(e) : null
  }
  function Io(e) {
    var t, n
    if (null != (e = e.__) && null != e.__c) {
      for (e.__e = e.__c.base = null, t = 0; t < e.__k.length; t++)
        if (null != (n = e.__k[t]) && null != n.__e) {
          e.__e = e.__c.base = n.__e
          break
        }
      return Io(e)
    }
  }
  function Ro(e) {
    ;((!e.__d && (e.__d = !0) && bo.push(e) && !To.__r++) ||
      wo !== mo.debounceRendering) &&
      ((wo = mo.debounceRendering) || setTimeout)(To)
  }
  function To() {
    for (var e; (To.__r = bo.length); )
      (e = bo.sort(function (e, t) {
        return e.__v.__b - t.__v.__b
      })),
        (bo = []),
        e.some(function (e) {
          var t, n, r, i, o, s
          e.__d &&
            ((o = (i = (t = e).__v).__e),
            (s = t.__P) &&
              ((n = []),
              ((r = Co({}, i)).__v = i.__v + 1),
              Ho(
                s,
                i,
                r,
                t.__n,
                void 0 !== s.ownerSVGElement,
                null != i.__h ? [o] : null,
                n,
                null == o ? No(i) : o,
                i.__h
              ),
              Bo(n, i),
              i.__e != o && Io(i)))
        })
  }
  function Mo(e, t, n, r, i, o, s, a, c, u) {
    var l,
      d,
      p,
      h,
      f,
      g,
      v,
      _ = (r && r.__k) || Eo,
      m = _.length
    for (n.__k = [], l = 0; l < t.length; l++)
      if (
        null !=
        (h = n.__k[l] =
          null == (h = t[l]) || 'boolean' == typeof h
            ? null
            : 'string' == typeof h ||
              'number' == typeof h ||
              'bigint' == typeof h
            ? Lo(null, h, null, null, h)
            : Array.isArray(h)
            ? Lo(Oo, { children: h }, null, null, null)
            : h.__b > 0
            ? Lo(h.type, h.props, h.key, h.ref ? h.ref : null, h.__v)
            : h)
      ) {
        if (
          ((h.__ = n),
          (h.__b = n.__b + 1),
          null === (p = _[l]) || (p && h.key == p.key && h.type === p.type))
        )
          _[l] = void 0
        else
          for (d = 0; d < m; d++) {
            if ((p = _[d]) && h.key == p.key && h.type === p.type) {
              _[d] = void 0
              break
            }
            p = null
          }
        Ho(e, h, (p = p || xo), i, o, s, a, c, u),
          (f = h.__e),
          (d = h.ref) &&
            p.ref != d &&
            (v || (v = []),
            p.ref && v.push(p.ref, null, h),
            v.push(d, h.__c || f, h)),
          null != f
            ? (null == g && (g = f),
              'function' == typeof h.type && h.__k === p.__k
                ? (h.__d = c = jo(h, c, e))
                : (c = Po(e, h, p, _, f, c)),
              'function' == typeof n.type && (n.__d = c))
            : c && p.__e == c && c.parentNode != e && (c = No(p))
      }
    for (n.__e = g, l = m; l--; ) null != _[l] && $o(_[l], _[l])
    if (v) for (l = 0; l < v.length; l++) Wo(v[l], v[++l], v[++l])
  }
  function jo(e, t, n) {
    for (var r, i = e.__k, o = 0; i && o < i.length; o++)
      (r = i[o]) &&
        ((r.__ = e),
        (t =
          'function' == typeof r.type ? jo(r, t, n) : Po(n, r, r, i, r.__e, t)))
    return t
  }
  function Po(e, t, n, r, i, o) {
    var s, a, c
    if (void 0 !== t.__d) (s = t.__d), (t.__d = void 0)
    else if (null == n || i != o || null == i.parentNode)
      e: if (null == o || o.parentNode !== e) e.appendChild(i), (s = null)
      else {
        for (a = o, c = 0; (a = a.nextSibling) && c < r.length; c += 2)
          if (a == i) break e
        e.insertBefore(i, o), (s = o)
      }
    return void 0 !== s ? s : i.nextSibling
  }
  function Uo(e, t, n) {
    '-' === t[0]
      ? e.setProperty(t, n)
      : (e[t] =
          null == n ? '' : 'number' != typeof n || So.test(t) ? n : n + 'px')
  }
  function Do(e, t, n, r, i) {
    var o
    e: if ('style' === t)
      if ('string' == typeof n) e.style.cssText = n
      else {
        if (('string' == typeof r && (e.style.cssText = r = ''), r))
          for (t in r) (n && t in n) || Uo(e.style, t, '')
        if (n) for (t in n) (r && n[t] === r[t]) || Uo(e.style, t, n[t])
      }
    else if ('o' === t[0] && 'n' === t[1])
      (o = t !== (t = t.replace(/Capture$/, ''))),
        (t = t.toLowerCase() in e ? t.toLowerCase().slice(2) : t.slice(2)),
        e.l || (e.l = {}),
        (e.l[t + o] = n),
        n
          ? r || e.addEventListener(t, o ? Fo : zo, o)
          : e.removeEventListener(t, o ? Fo : zo, o)
    else if ('dangerouslySetInnerHTML' !== t) {
      if (i) t = t.replace(/xlink(H|:h)/, 'h').replace(/sName$/, 's')
      else if (
        'href' !== t &&
        'list' !== t &&
        'form' !== t &&
        'tabIndex' !== t &&
        'download' !== t &&
        t in e
      )
        try {
          e[t] = null == n ? '' : n
          break e
        } catch (e) {}
      'function' == typeof n ||
        (null == n || (!1 === n && -1 == t.indexOf('-'))
          ? e.removeAttribute(t)
          : e.setAttribute(t, n))
    }
  }
  function zo(e) {
    this.l[e.type + !1](mo.event ? mo.event(e) : e)
  }
  function Fo(e) {
    this.l[e.type + !0](mo.event ? mo.event(e) : e)
  }
  function Ho(e, t, n, r, i, o, s, a, c) {
    var u,
      l,
      d,
      p,
      h,
      f,
      g,
      v,
      _,
      m,
      y,
      b,
      w,
      x = t.type
    if (void 0 !== t.constructor) return null
    null != n.__h &&
      ((c = n.__h), (a = t.__e = n.__e), (t.__h = null), (o = [a])),
      (u = mo.__b) && u(t)
    try {
      e: if ('function' == typeof x) {
        ;(v = t.props),
          (_ = (u = x.contextType) && r[u.__c]),
          (m = u ? (_ ? _.props.value : u.__) : r),
          n.__c
            ? (g = (l = t.__c = n.__c).__ = l.__E)
            : ('prototype' in x && x.prototype.render
                ? (t.__c = l = new x(v, m))
                : ((t.__c = l = new Ao(v, m)),
                  (l.constructor = x),
                  (l.render = Go)),
              _ && _.sub(l),
              (l.props = v),
              l.state || (l.state = {}),
              (l.context = m),
              (l.__n = r),
              (d = l.__d = !0),
              (l.__h = []),
              (l._sb = [])),
          null == l.__s && (l.__s = l.state),
          null != x.getDerivedStateFromProps &&
            (l.__s == l.state && (l.__s = Co({}, l.__s)),
            Co(l.__s, x.getDerivedStateFromProps(v, l.__s))),
          (p = l.props),
          (h = l.state)
        for (u = 0; u < l._sb.length; u++) l.__h.push(l._sb[u]), (l._sb = [])
        if (d)
          null == x.getDerivedStateFromProps &&
            null != l.componentWillMount &&
            l.componentWillMount(),
            null != l.componentDidMount && l.__h.push(l.componentDidMount)
        else {
          if (
            (null == x.getDerivedStateFromProps &&
              v !== p &&
              null != l.componentWillReceiveProps &&
              l.componentWillReceiveProps(v, m),
            (!l.__e &&
              null != l.shouldComponentUpdate &&
              !1 === l.shouldComponentUpdate(v, l.__s, m)) ||
              t.__v === n.__v)
          ) {
            ;(l.props = v),
              (l.state = l.__s),
              t.__v !== n.__v && (l.__d = !1),
              (l.__v = t),
              (t.__e = n.__e),
              (t.__k = n.__k),
              t.__k.forEach(function (e) {
                e && (e.__ = t)
              }),
              l.__h.length && s.push(l)
            break e
          }
          null != l.componentWillUpdate && l.componentWillUpdate(v, l.__s, m),
            null != l.componentDidUpdate &&
              l.__h.push(function () {
                l.componentDidUpdate(p, h, f)
              })
        }
        if (
          ((l.context = m),
          (l.props = v),
          (l.__v = t),
          (l.__P = e),
          (y = mo.__r),
          (b = 0),
          'prototype' in x && x.prototype.render)
        )
          (l.state = l.__s),
            (l.__d = !1),
            y && y(t),
            (u = l.render(l.props, l.state, l.context))
        else
          do {
            ;(l.__d = !1),
              y && y(t),
              (u = l.render(l.props, l.state, l.context)),
              (l.state = l.__s)
          } while (l.__d && ++b < 25)
        ;(l.state = l.__s),
          null != l.getChildContext && (r = Co(Co({}, r), l.getChildContext())),
          d ||
            null == l.getSnapshotBeforeUpdate ||
            (f = l.getSnapshotBeforeUpdate(p, h)),
          (w =
            null != u && u.type === Oo && null == u.key ? u.props.children : u),
          Mo(e, Array.isArray(w) ? w : [w], t, n, r, i, o, s, a, c),
          (l.base = t.__e),
          (t.__h = null),
          l.__h.length && s.push(l),
          g && (l.__E = l.__ = null),
          (l.__e = !1)
      } else null == o && t.__v === n.__v ? ((t.__k = n.__k), (t.__e = n.__e)) : (t.__e = qo(n.__e, t, n, r, i, o, s, c))
      ;(u = mo.diffed) && u(t)
    } catch (e) {
      ;(t.__v = null),
        (c || null != o) &&
          ((t.__e = a), (t.__h = !!c), (o[o.indexOf(a)] = null)),
        mo.__e(e, t, n)
    }
  }
  function Bo(e, t) {
    mo.__c && mo.__c(t, e),
      e.some(function (t) {
        try {
          ;(e = t.__h),
            (t.__h = []),
            e.some(function (e) {
              e.call(t)
            })
        } catch (e) {
          mo.__e(e, t.__v)
        }
      })
  }
  function qo(e, t, n, r, i, o, s, a) {
    var c,
      u,
      l,
      d = n.props,
      p = t.props,
      h = t.type,
      f = 0
    if (('svg' === h && (i = !0), null != o))
      for (; f < o.length; f++)
        if (
          (c = o[f]) &&
          'setAttribute' in c == !!h &&
          (h ? c.localName === h : 3 === c.nodeType)
        ) {
          ;(e = c), (o[f] = null)
          break
        }
    if (null == e) {
      if (null === h) return document.createTextNode(p)
      ;(e = i
        ? document.createElementNS('http://www.w3.org/2000/svg', h)
        : document.createElement(h, p.is && p)),
        (o = null),
        (a = !1)
    }
    if (null === h) d === p || (a && e.data === p) || (e.data = p)
    else {
      if (
        ((o = o && _o.call(e.childNodes)),
        (u = (d = n.props || xo).dangerouslySetInnerHTML),
        (l = p.dangerouslySetInnerHTML),
        !a)
      ) {
        if (null != o)
          for (d = {}, f = 0; f < e.attributes.length; f++)
            d[e.attributes[f].name] = e.attributes[f].value
        ;(l || u) &&
          ((l && ((u && l.__html == u.__html) || l.__html === e.innerHTML)) ||
            (e.innerHTML = (l && l.__html) || ''))
      }
      if (
        ((function (e, t, n, r, i) {
          var o
          for (o in n)
            'children' === o || 'key' === o || o in t || Do(e, o, null, n[o], r)
          for (o in t)
            (i && 'function' != typeof t[o]) ||
              'children' === o ||
              'key' === o ||
              'value' === o ||
              'checked' === o ||
              n[o] === t[o] ||
              Do(e, o, t[o], n[o], r)
        })(e, p, d, i, a),
        l)
      )
        t.__k = []
      else if (
        ((f = t.props.children),
        Mo(
          e,
          Array.isArray(f) ? f : [f],
          t,
          n,
          r,
          i && 'foreignObject' !== h,
          o,
          s,
          o ? o[0] : n.__k && No(n, 0),
          a
        ),
        null != o)
      )
        for (f = o.length; f--; ) null != o[f] && ko(o[f])
      a ||
        ('value' in p &&
          void 0 !== (f = p.value) &&
          (f !== e.value ||
            ('progress' === h && !f) ||
            ('option' === h && f !== d.value)) &&
          Do(e, 'value', f, d.value, !1),
        'checked' in p &&
          void 0 !== (f = p.checked) &&
          f !== e.checked &&
          Do(e, 'checked', f, d.checked, !1))
    }
    return e
  }
  function Wo(e, t, n) {
    try {
      'function' == typeof e ? e(t) : (e.current = t)
    } catch (e) {
      mo.__e(e, n)
    }
  }
  function $o(e, t, n) {
    var r, i
    if (
      (mo.unmount && mo.unmount(e),
      (r = e.ref) && ((r.current && r.current !== e.__e) || Wo(r, null, t)),
      null != (r = e.__c))
    ) {
      if (r.componentWillUnmount)
        try {
          r.componentWillUnmount()
        } catch (e) {
          mo.__e(e, t)
        }
      ;(r.base = r.__P = null), (e.__c = void 0)
    }
    if ((r = e.__k))
      for (i = 0; i < r.length; i++)
        r[i] && $o(r[i], t, n || 'function' != typeof e.type)
    n || null == e.__e || ko(e.__e), (e.__ = e.__e = e.__d = void 0)
  }
  function Go(e, t, n) {
    return this.constructor(e, n)
  }
  function Zo(e, t, n) {
    var r, i, o
    mo.__ && mo.__(e, t),
      (i = (r = 'function' == typeof n) ? null : (n && n.__k) || t.__k),
      (o = []),
      Ho(
        t,
        (e = ((!r && n) || t).__k =
          (function (e, t, n) {
            var r,
              i,
              o,
              s = {}
            for (o in t)
              'key' == o ? (r = t[o]) : 'ref' == o ? (i = t[o]) : (s[o] = t[o])
            if (
              (arguments.length > 2 &&
                (s.children = arguments.length > 3 ? _o.call(arguments, 2) : n),
              'function' == typeof e && null != e.defaultProps)
            )
              for (o in e.defaultProps)
                void 0 === s[o] && (s[o] = e.defaultProps[o])
            return Lo(e, s, r, i, null)
          })(Oo, null, [e])),
        i || xo,
        xo,
        void 0 !== t.ownerSVGElement,
        !r && n ? [n] : i ? null : t.firstChild ? _o.call(t.childNodes) : null,
        o,
        !r && n ? n : i ? i.__e : t.firstChild,
        r
      ),
      Bo(o, e)
  }
  ;(_o = Eo.slice),
    (mo = {
      __e: function (e, t, n, r) {
        for (var i, o, s; (t = t.__); )
          if ((i = t.__c) && !i.__)
            try {
              if (
                ((o = i.constructor) &&
                  null != o.getDerivedStateFromError &&
                  (i.setState(o.getDerivedStateFromError(e)), (s = i.__d)),
                null != i.componentDidCatch &&
                  (i.componentDidCatch(e, r || {}), (s = i.__d)),
                s)
              )
                return (i.__E = i)
            } catch (t) {
              e = t
            }
        throw e
      },
    }),
    (yo = 0),
    (Ao.prototype.setState = function (e, t) {
      var n
      ;(n =
        null != this.__s && this.__s !== this.state
          ? this.__s
          : (this.__s = Co({}, this.state))),
        'function' == typeof e && (e = e(Co({}, n), this.props)),
        e && Co(n, e),
        null != e && this.__v && (t && this._sb.push(t), Ro(this))
    }),
    (Ao.prototype.forceUpdate = function (e) {
      this.__v && ((this.__e = !0), e && this.__h.push(e), Ro(this))
    }),
    (Ao.prototype.render = Oo),
    (bo = []),
    (To.__r = 0)
  var Vo = 0
  function Jo(e, t, n, r, i) {
    var o,
      s,
      a = {}
    for (s in t) 'ref' == s ? (o = t[s]) : (a[s] = t[s])
    var c = {
      type: e,
      props: a,
      key: n,
      ref: o,
      __k: null,
      __: null,
      __b: 0,
      __e: null,
      __d: void 0,
      __c: null,
      __h: null,
      constructor: void 0,
      __v: --Vo,
      __source: i,
      __self: r,
    }
    if ('function' == typeof e && (o = e.defaultProps))
      for (s in o) void 0 === a[s] && (a[s] = o[s])
    return mo.vnode && mo.vnode(c), c
  }
  const Yo = 'https://auth-icons.s3.ap-south-1.amazonaws.com',
    Ko = {
      google: `${Yo}/google-icon.png`,
      twitter: `${Yo}/twitter-icon.png`,
      github: `${Yo}/github-icon.png`,
      github_light: `${Yo}/github-dark-icon.png`,
      twitch: `${Yo}/twitch-icon.png`,
      discord: `${Yo}/discord-icon.png`,
    }
  const Xo = {
    light: `${Yo}/arcana-logo-dark.png`,
    dark: `${Yo}/arcana-logo.png`,
  }
  function Qo(e) {
    const { stroke: t = 8, secondaryColor: n } = e
    return Jo(
      'div',
      Object.assign(
        { 'aria-label': 'oval-loading' },
        {
          children: Jo(
            'svg',
            Object.assign(
              {
                width: 80,
                height: 80,
                viewBox: es(Number(t), 20),
                xmlns: 'http://www.w3.org/2000/svg',
                className: 'xar-loader-circle',
                'data-testid': 'oval-svg',
              },
              {
                children: Jo(
                  'g',
                  Object.assign(
                    { fill: 'none', fillRule: 'evenodd' },
                    {
                      children: Jo(
                        'g',
                        Object.assign(
                          {
                            transform: 'translate(1 1)',
                            'stroke-width': t,
                            'data-testid': 'oval-secondary-group',
                          },
                          {
                            children: [
                              Jo('circle', {
                                strokeOpacity: '.5',
                                cx: '0',
                                cy: '0',
                                r: 20,
                                stroke: n,
                                'stroke-width': t,
                                opacity: 0.3,
                              }),
                              Jo(
                                'path',
                                Object.assign(
                                  { d: ts(20) },
                                  {
                                    children: Jo('animateTransform', {
                                      attributeName: 'transform',
                                      type: 'rotate',
                                      from: '0 0 0',
                                      to: '360 0 0',
                                      dur: '1s',
                                      repeatCount: 'indefinite',
                                    }),
                                  }
                                )
                              ),
                            ],
                          }
                        )
                      ),
                    }
                  )
                ),
              }
            )
          ),
        }
      )
    )
  }
  const es = (e, t) => {
      const n = -t - e / 2 + 1,
        r = 2 * t + e
      return [n, n, r, r].join(' ')
    },
    ts = (e) => ['M' + e + ' 0c0-9.94-8.06', e, e, e].join('-')
  !(function (e, t) {
    void 0 === t && (t = {})
    var n = t.insertAt
    if (e && 'undefined' != typeof document) {
      var r = document.head || document.getElementsByTagName('head')[0],
        i = document.createElement('style')
      ;(i.type = 'text/css'),
        'top' === n && r.firstChild
          ? r.insertBefore(i, r.firstChild)
          : r.appendChild(i),
        i.styleSheet
          ? (i.styleSheet.cssText = e)
          : i.appendChild(document.createTextNode(e))
    }
  })(
    "@import url('https://fonts.googleapis.com/css2?family=Sora:wght@100;400;600;700&display=block');\n\n.xar-light-mode {\n  --fg: #101010;\n  --bg: #f7f7f7;\n  --background: #ffffff;\n  --inputShadow: inset -1px -7px 7px rgba(255, 255, 255, 0.7),\n    inset 3px 1px 6px rgba(174, 174, 192, 0.2);\n}\n\n.xar-dark-mode {\n  --fg: #f7f7f7;\n  --bg: #101010;\n  --background: #262626;\n  --inputShadow: inset -2px -2px 4px rgb(57 57 57 / 44%),\n    inset 5px 5px 10px rgb(11 11 11 / 50%);\n}\n\n#xar-modal {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: fixed;\n  z-index: 99999;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  overflow: auto;\n  background: rgba(10, 10, 10, 0.7);\n  backdrop-filter: blur(16px);\n  font-family: Sora, sans-serif;\n}\n\n.xar-header-logo__container {\n  width: 80px;\n  height: 80px;\n  border-radius: 60px;\n  margin: 0 auto;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border: 2px solid var(--bg);\n}\n\n.xar-header-logo {\n  max-width: 70px;\n  max-height: 70px;\n  margin: 0 auto;\n  display: inline-block;\n}\n\n.xar-header-heading {\n  font-family: 'Montserrat', sans-serif;\n  text-align: center;\n}\n\n.xar-header-subtext {\n  font-family: 'Sora', sans-serif;\n  font-size: 12px;\n  font-weight: 400;\n}\n\n.xar-email-login {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n}\n\n.xar-email-login > *:not(:first-child) {\n  margin-top: 20px;\n}\n\n.xar-email-login__label {\n  text-align: left;\n  font-size: 14px;\n  color: #8d8d8d;\n  font-weight: 400;\n}\n\n.xar-email-login__input {\n  height: 45px;\n  padding: 0 16px;\n  font-size: 14px;\n  font-weight: 400;\n  color: var(--fg);\n  background: var(--bg);\n  border: none;\n  border-radius: 10px;\n  outline: none;\n  box-shadow: var(--inputShadow);\n}\n\n.xar-social-container {\n  display: flex;\n  justify-content: center;\n}\n\n.xar-social-icon__wrapper {\n  display: flex;\n  background: var(--fg);\n  width: 42px;\n  height: 42px;\n  border-radius: 25px;\n  align-items: center;\n  margin-left: 10px;\n  margin-right: 10px;\n}\n\n.xar-social-icon__wrapper:hover {\n  cursor: pointer;\n  transition: all 0.5s;\n  transform: scale(1.15, 1.15);\n}\n\n.xar-social-icon {\n  margin: 0 auto;\n  width: 24px;\n  height: 24px;\n}\n\n.xar-container {\n  padding: 30px 30px;\n  width: 325px;\n  min-height: 480px;\n  background-color: var(--background);\n  color: var(--fg);\n  margin: 0 auto;\n  font-family: 'Sora', sans-serif;\n  box-shadow: 4px 5px 4px rgba(0, 0, 0, 0.25);\n  border-radius: 10px;\n  box-sizing: content-box;\n}\n\n.xar-inner-container {\n  min-height: inherit;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n}\n\n.xar-inner-container > *:not(:first-child) {\n  margin-top: 20px;\n}\n\n.xar-btn {\n  width: 100%;\n  height: 2.75rem;\n  font-size: 14px;\n  font-weight: 600;\n  text-transform: uppercase;\n  color: var(--bg);\n  background: var(--fg);\n  border: none;\n  border-radius: 10px;\n}\n\n.xar-btn:hover {\n  cursor: pointer;\n  transition: all 0.5s;\n  transform: scale(1.05, 1.15);\n}\n\n.xar-footer {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-top: 10px;\n}\n\n.xar-footer-text {\n  font-size: 12px;\n  font-weight: 400;\n}\n\n.xar-footer-img__link {\n  width: 60px;\n  height: 15px;\n  margin-left: 5px;\n}\n\n.xar-separator {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  text-align: center;\n}\n\n.xar-separator:before,\n.xar-separator:after {\n  content: '';\n  flex: 1 1 auto;\n  border-bottom: 1px solid #000;\n}\n\n.xar-separator:before {\n  margin-right: 1rem;\n}\n\n.xar-separator:after {\n  margin-left: 1rem;\n}\n\n.xar-action__link {\n  text-transform: uppercase;\n  text-decoration: underline;\n  color: #13a3fd;\n  font-weight: 700;\n  font-size: 15px;\n  line-height: 19px;\n  cursor: pointer;\n}\n\n.xar-loader__text {\n  font-size: 20px;\n  font-weight: 700;\n}\n\n.xar-loader-circle {\n  stroke: var(--fg);\n}\n"
  )
  const ns = ({ mode: e, logo: t }) =>
      Jo(Oo, {
        children: [
          Jo(
            'div',
            Object.assign(
              { className: 'xar-header-logo__container' },
              {
                children: Jo('img', {
                  className: 'xar-header-logo',
                  src: t,
                  alt: 'app-logo',
                  onError: (t) => {
                    const n = ((e) => bi[e])(e)
                    t.target instanceof HTMLImageElement && (t.target.src = n)
                  },
                }),
              }
            )
          ),
          Jo(
            'div',
            Object.assign(
              { className: 'xar-header-text' },
              {
                children: [
                  Jo(
                    'h1',
                    Object.assign(
                      { className: 'xar-header-heading' },
                      { children: 'Welcome' }
                    )
                  ),
                  Jo(
                    'p',
                    Object.assign(
                      { className: 'xar-header-subtext' },
                      {
                        children:
                          'We’ll email you a login link for a password-free sign in.',
                      }
                    )
                  ),
                ],
              }
            )
          ),
        ],
      }),
    rs = ({ loginWithLink: e, email: t, setEmail: n }) =>
      Jo(
        'form',
        Object.assign(
          { className: 'xar-email-login' },
          {
            children: [
              Jo(
                'label',
                Object.assign(
                  { className: 'xar-email-login__label', htmlFor: '' },
                  { children: 'Email' }
                )
              ),
              Jo('input', {
                value: t,
                onInput: (e) => {
                  n(e.currentTarget.value)
                },
                className: 'xar-email-login__input',
                type: 'text',
              }),
              Jo(
                'button',
                Object.assign(
                  {
                    onClick: (n) =>
                      i(void 0, void 0, void 0, function* () {
                        n.preventDefault(), t && (yield e(t))
                      }),
                    className: 'xar-btn',
                  },
                  { children: 'Get Link' }
                )
              ),
            ],
          }
        )
      ),
    is = ({ text: e }) =>
      Jo('div', Object.assign({ className: 'xar-separator' }, { children: e })),
    os = ({ loginWithSocial: e, loginList: t, mode: n }) =>
      Jo(
        'div',
        Object.assign(
          { className: 'xar-social-container' },
          {
            children: t.map((t) => {
              return Jo(
                'div',
                Object.assign(
                  {
                    className: 'xar-social-icon__wrapper',
                    onClick: () => ((t) => e(t))(t),
                  },
                  {
                    children: Jo('img', {
                      src:
                        ((r = t),
                        (i = n),
                        'github' === r && 'light' === i
                          ? Ko.github_light
                          : Ko[r]),
                      alt: `${t} logo`,
                      className: 'xar-social-icon',
                    }),
                  }
                )
              )
              var r, i
            }),
          }
        )
      ),
    ss = ({ mode: e }) => {
      const t = Xo[e]
      return Jo(
        'div',
        Object.assign(
          { className: 'xar-footer' },
          {
            children: [
              Jo(
                'p',
                Object.assign(
                  { className: 'xar-footer-text' },
                  { children: 'Powered by' }
                )
              ),
              Jo(
                'a',
                Object.assign(
                  {
                    href: 'https://arcana.network',
                    className: 'xar-footer-img__link',
                  },
                  { children: Jo('img', { src: t, alt: 'arcana logo' }) }
                )
              ),
            ],
          }
        )
      )
    },
    as = (e) =>
      Jo(Oo, {
        children: [
          Jo(Qo, { stroke: 8, secondaryColor: '#8D8D8D' }),
          e.text
            ? Jo(
                'p',
                Object.assign(
                  { className: 'xar-loader__text' },
                  { children: e.text }
                )
              )
            : '',
          e.children ? Jo(Oo, { children: e.children }) : '',
        ],
      }),
    cs = ({ children: e, mode: t }) =>
      Jo(
        'div',
        Object.assign(
          { class: 'xar-container' },
          {
            children: [
              Jo(
                'div',
                Object.assign({ class: 'xar-inner-container' }, { children: e })
              ),
              Jo(ss, { mode: t }),
            ],
          }
        )
      ),
    us = ({ text: e, method: t }) =>
      Jo(
        'div',
        Object.assign(
          { class: 'xar-action-container' },
          {
            children: Jo(
              'p',
              Object.assign(
                { onClick: () => t(), className: 'xar-action__link' },
                { children: e }
              )
            ),
          }
        )
      ),
    ls = 'xar-modal',
    ds = (e) =>
      Jo(
        'div',
        Object.assign(
          {
            id: ls,
            onClick: (t) => {
              var n
              ;(null === (n = t.target) || void 0 === n ? void 0 : n.id) ==
                ls &&
                e.closeFunc &&
                e.closeFunc(new Error('User closed the connect modal'))
            },
          },
          { children: e.children }
        )
      )
  var ps,
    hs,
    fs,
    gs,
    vs = 0,
    _s = [],
    ms = [],
    ys = mo.__b,
    bs = mo.__r,
    ws = mo.diffed,
    xs = mo.__c,
    Es = mo.unmount
  function Ss(e, t) {
    mo.__h && mo.__h(hs, e, vs || t), (vs = 0)
    var n = hs.__H || (hs.__H = { __: [], __h: [] })
    return e >= n.__.length && n.__.push({ __V: ms }), n.__[e]
  }
  function Cs(e, t, n) {
    var r = Ss(ps++, 2)
    if (
      ((r.t = e),
      !r.__c &&
        ((r.__ = [
          n ? n(t) : Is(void 0, t),
          function (e) {
            var t = r.__N ? r.__N[0] : r.__[0],
              n = r.t(t, e)
            t !== n && ((r.__N = [n, r.__[1]]), r.__c.setState({}))
          },
        ]),
        (r.__c = hs),
        !hs.u))
    ) {
      hs.u = !0
      var i = hs.shouldComponentUpdate
      hs.shouldComponentUpdate = function (e, t, n) {
        if (!r.__c.__H) return !0
        var o = r.__c.__H.__.filter(function (e) {
          return e.__c
        })
        if (
          o.every(function (e) {
            return !e.__N
          })
        )
          return !i || i.call(this, e, t, n)
        var s = !1
        return (
          o.forEach(function (e) {
            if (e.__N) {
              var t = e.__[0]
              ;(e.__ = e.__N), (e.__N = void 0), t !== e.__[0] && (s = !0)
            }
          }),
          !(!s && r.__c.props === e) && (!i || i.call(this, e, t, n))
        )
      }
    }
    return r.__N || r.__
  }
  function ks() {
    for (var e; (e = _s.shift()); )
      if (e.__P && e.__H)
        try {
          e.__H.__h.forEach(As), e.__H.__h.forEach(Ns), (e.__H.__h = [])
        } catch (t) {
          ;(e.__H.__h = []), mo.__e(t, e.__v)
        }
  }
  ;(mo.__b = function (e) {
    'function' != typeof e.type || e.__m || e.type === Oo
      ? e.__m || (e.__m = e.__ && e.__.__m ? e.__.__m : '')
      : (e.__m =
          (e.__ && e.__.__m ? e.__.__m : '') +
          (e.__ && e.__.__k ? e.__.__k.indexOf(e) : 0)),
      (hs = null),
      ys && ys(e)
  }),
    (mo.__r = function (e) {
      bs && bs(e), (ps = 0)
      var t = (hs = e.__c).__H
      t &&
        (fs === hs
          ? ((t.__h = []),
            (hs.__h = []),
            t.__.forEach(function (e) {
              e.__N && (e.__ = e.__N), (e.__V = ms), (e.__N = e.i = void 0)
            }))
          : (t.__h.forEach(As), t.__h.forEach(Ns), (t.__h = []))),
        (fs = hs)
    }),
    (mo.diffed = function (e) {
      ws && ws(e)
      var t = e.__c
      t &&
        t.__H &&
        (t.__H.__h.length &&
          ((1 !== _s.push(t) && gs === mo.requestAnimationFrame) ||
            ((gs = mo.requestAnimationFrame) || Os)(ks)),
        t.__H.__.forEach(function (e) {
          e.i && (e.__H = e.i),
            e.__V !== ms && (e.__ = e.__V),
            (e.i = void 0),
            (e.__V = ms)
        })),
        (fs = hs = null)
    }),
    (mo.__c = function (e, t) {
      t.some(function (e) {
        try {
          e.__h.forEach(As),
            (e.__h = e.__h.filter(function (e) {
              return !e.__ || Ns(e)
            }))
        } catch (n) {
          t.some(function (e) {
            e.__h && (e.__h = [])
          }),
            (t = []),
            mo.__e(n, e.__v)
        }
      }),
        xs && xs(e, t)
    }),
    (mo.unmount = function (e) {
      Es && Es(e)
      var t,
        n = e.__c
      n &&
        n.__H &&
        (n.__H.__.forEach(function (e) {
          try {
            As(e)
          } catch (e) {
            t = e
          }
        }),
        (n.__H = void 0),
        t && mo.__e(t, n.__v))
    })
  var Ls = 'function' == typeof requestAnimationFrame
  function Os(e) {
    var t,
      n = function () {
        clearTimeout(r), Ls && cancelAnimationFrame(t), setTimeout(e)
      },
      r = setTimeout(n, 100)
    Ls && (t = requestAnimationFrame(n))
  }
  function As(e) {
    var t = hs,
      n = e.__c
    'function' == typeof n && ((e.__c = void 0), n()), (hs = t)
  }
  function Ns(e) {
    var t = hs
    ;(e.__c = e.__()), (hs = t)
  }
  function Is(e, t) {
    return 'function' == typeof t ? t(e) : t
  }
  const Rs = {
      SOCIAL: 'Please complete the login to proceed',
      LINK: 'Please complete the login by clicking on email',
    },
    Ts = { text: '', loading: !1, type: '' },
    Ms = (e, t) =>
      'SOCIAL' == t || 'LINK' == t
        ? { text: Rs[t], type: t, loading: !0 }
        : 'RESET' == t
        ? Ts
        : e,
    js = (e) => {
      const [t, n] = Cs(Ms, Ts),
        [r, o] = (function (e) {
          return (vs = 1), Cs(Is, e)
        })(''),
        s = () =>
          i(void 0, void 0, void 0, function* () {
            r &&
              (n('LINK'),
              e.loginWithLink(r).finally(() => {
                n('RESET')
              }))
          })
      return t.loading
        ? Jo(ds, {
            children: Jo(
              cs,
              Object.assign(
                { mode: e.mode },
                {
                  children: Jo(
                    as,
                    Object.assign(
                      { text: t.text, mode: e.mode },
                      {
                        children:
                          'LINK' == t.type
                            ? Jo(Oo, {
                                children: [
                                  Jo(us, {
                                    method: () => s(),
                                    text: 'Send the email again',
                                  }),
                                  Jo(us, {
                                    method: () => n('RESET'),
                                    text: 'Change email id',
                                  }),
                                ],
                              })
                            : null,
                      }
                    )
                  ),
                }
              )
            ),
          })
        : Jo(
            ds,
            Object.assign(
              { closeFunc: e.closeFunc },
              {
                children: Jo(
                  cs,
                  Object.assign(
                    { mode: e.mode },
                    {
                      children: [
                        Jo(ns, { mode: e.mode, logo: e.logo }),
                        Jo(rs, { email: r, setEmail: o, loginWithLink: s }),
                        Jo(is, { text: 'or continue with' }),
                        Jo(os, {
                          loginWithSocial: (t) =>
                            i(void 0, void 0, void 0, function* () {
                              n('SOCIAL'),
                                e.loginWithSocial(t).finally(() => {
                                  n('RESET')
                                })
                            }),
                          loginList: e.loginList,
                          mode: e.mode,
                        }),
                      ],
                    }
                  )
                ),
              }
            )
          )
    }
  class Ps {
    constructor(e) {
      ;(this.status = 'closed'),
        (this.close = (e) => {
          'closed' !== this.status &&
            (this.onClose(e),
            (this.status = 'closed'),
            Zo(null, this.container))
        }),
        (this.params = {
          loginList: e.loginList.filter((e) => 'passwordless' !== e),
          loginWithSocial: e.loginWithSocial,
          loginWithLink: e.loginWithLink,
          mode: e.mode,
          closeFunc: this.close,
          logo: e.logo,
        }),
        this.createContainer()
    }
    open(e) {
      'open' !== this.status &&
        ((this.onClose = e),
        (this.status = 'open'),
        Zo(Jo(js, Object.assign({}, this.params)), this.container))
    }
    createContainer() {
      ;(this.container = document.createElement('div')),
        this.container.setAttribute('id', 'xar-login-container'),
        this.container.classList.add(`xar-${this.params.mode}-mode`),
        document.body.appendChild(this.container)
    }
  }
  ;(e.AuthProvider = class {
    constructor(t, n) {
      if (
        ((this.initStatus = pe.CREATED),
        (this.initPromises = []),
        (this.loginWithSocial = (e) =>
          i(this, void 0, void 0, function* () {
            if (this.initStatus === pe.DONE) {
              if (!(yield this._provider.isLoginAvailable(e)))
                throw new Error(`${e} login is not available`)
              const t = this.getLoginUrl(e)
              return this.beginLogin(t)
            }
            throw (this.logger.error('requestSocialLogin', ie), ie)
          })),
        (this.loginWithLink = (e) => {
          if (this.initStatus === pe.DONE) {
            const t = this.getLoginUrl('passwordless', e)
            return this.beginLogin(t)
          }
          throw (this.logger.error('requestPasswordlessLogin', ie), ie)
        }),
        null == t)
      )
        throw new Error('appAddress is required')
      var r
      ;(this.appId = ((e) => (e.startsWith(Li) ? e.substring(2) : e))(t)),
        (this.params = ((e) => {
          const t = { network: 'testnet', debug: !1 }
          return (
            (null == e ? void 0 : e.network) && (t.network = e.network),
            void 0 !== (null == e ? void 0 : e.debug) && (t.debug = e.debug),
            (null == e ? void 0 : e.chainConfig) &&
              (t.chainConfig = e.chainConfig),
            (null == e ? void 0 : e.redirectUrl) &&
              (t.redirectUrl = e.redirectUrl),
            t
          )
        })(n)),
        (this.networkConfig = ((e) => {
          if ('string' == typeof e && 'testnet' == e) return ho
          if ('string' == typeof e && 'dev' == e) return po
          if (
            ((t = e),
            'string' != typeof t &&
              'object' == typeof t &&
              t.gatewayUrl &&
              'object' == typeof t &&
              t.walletUrl &&
              'object' == typeof t &&
              t.authUrl)
          )
            return e
          var t
          throw new Error('Invalid network config passed')
        })(this.params.network)),
        (this.rpcConfig = ((t, n) => {
          if (
            (function (e) {
              return void 0 !== e && !('object' != typeof e || !e.chainId)
            })(t)
          ) {
            const e = lo(t.chainId)
            return t.rpcUrl && (e.rpcUrls = [t.rpcUrl]), e
          }
          if (
            'string' == typeof n &&
            (function (e) {
              return 'string' == typeof e && ('testnet' == e || 'dev' == e)
            })(n)
          )
            switch (n) {
              case 'testnet':
                return lo(e.CHAIN.ARCANA_TESTNET)
              case 'dev':
                return lo(e.CHAIN.ARCANA_DEV)
            }
          return lo(e.CHAIN.ARCANA_TESTNET)
        })(this.params.chainConfig, this.params.network)),
        (this.logger = le('AuthProvider')),
        this.params.debug
          ? (ue(oe.DEBUG),
            this.networkConfig.sentryDsn &&
              ((r = ki(this.networkConfig.sentryDsn)), (ce = r)))
          : ue(oe.NOLOGS)
    }
    init(t) {
      return i(this, void 0, void 0, function* () {
        if (this.initStatus === pe.CREATED) {
          this.initStatus = pe.RUNNING
          const { appMode: n, position: r } = ((t) => {
            const n = { appMode: e.AppMode.NoUI, position: 'right' }
            return (
              void 0 !== (null == t ? void 0 : t.appMode) &&
                (n.appMode = t.appMode),
              void 0 !== (null == t ? void 0 : t.position) &&
                (n.position = t.position),
              n
            )
          })(t)
          if (this.iframeWrapper) return this
          yield this.setAppConfig(),
            (this.iframeWrapper = new ao({
              appId: this.appId,
              iframeUrl: this.networkConfig.walletUrl,
              appConfig: this.appConfig,
              position: r,
            }))
          const i = yield wi(this.appId, this.networkConfig.gatewayUrl)
          return (
            this.iframeWrapper.setWalletType(i, n),
            (this._provider = new ji(this.iframeWrapper, this.rpcConfig)),
            yield this._provider.init({
              loginWithLink: this.loginWithLink,
              loginWithSocial: this.loginWithSocial,
            }),
            this.setProviders(),
            (this.initStatus = pe.DONE),
            this.resolveInitPromises(),
            this
          )
        }
        return this.initStatus === pe.RUNNING ? yield this.waitForInit() : this
      })
    }
    connect() {
      return i(this, void 0, void 0, function* () {
        if (
          (this.initStatus !== pe.DONE && (yield this.init()),
          yield this.isLoggedIn())
        )
          return this._provider
        const e = yield this.getLogins()
        return (
          this.connectCtrl ||
            (this.connectCtrl = new Ps({
              loginWithLink: this.loginWithLink,
              loginWithSocial: this.loginWithSocial,
              loginList: e,
              mode: this.theme,
              logo: this.logo.vertical,
            })),
          new Promise((e, t) => {
            this.connectCtrl.open((e) => {
              if (e) return t(e)
            }),
              this.waitForConnect()
                .then((t) => {
                  this.connectCtrl.close(), e(t)
                })
                .catch(t)
          })
        )
      })
    }
    getUser() {
      if (this.initStatus === pe.DONE) return this._provider.requestUserInfo()
      throw (this.logger.error('requestUserInfo', ie), ie)
    }
    isLoggedIn() {
      return i(this, void 0, void 0, function* () {
        if (this.initStatus === pe.DONE) {
          return this._provider.isLoggedIn()
        }
        throw ie
      })
    }
    logout() {
      if (this.initStatus === pe.DONE) return this._provider.triggerLogout()
      throw (this.logger.error('logout', ie), ie)
    }
    getPublicKey(e) {
      return i(this, void 0, void 0, function* () {
        if (this.initStatus === pe.DONE) {
          if (!e || '' === e)
            throw new ne(
              'email_required',
              `Email is required in getPublicKey, got ${e}`
            )
          return yield this._provider.getPublicKey(e, 'google')
        }
        throw (this.logger.error('requestPublicKey', ie), ie)
      })
    }
    getLogins() {
      return i(this, void 0, void 0, function* () {
        if (this.initStatus === pe.DONE)
          return yield this._provider.getAvailableLogins()
        throw (this.logger.error('getLogins', ie), ie)
      })
    }
    getProvider() {
      if (this.initStatus === pe.DONE) return this._provider
      throw (this.logger.error('getProvider', ie), ie)
    }
    getLoginUrl(e, t) {
      return ((e) => {
        const t = new URL('/init', e.authUrl),
          n = new URLSearchParams()
        return (
          n.append('loginType', e.loginType),
          n.append('appId', e.appId),
          n.append('parentUrl', encodeURIComponent(e.redirectUrl)),
          e.email && n.append('email', e.email),
          (t.hash = n.toString()),
          t.toString()
        )
      })({
        loginType: e,
        appId: this.appId,
        email: t,
        authUrl: this.networkConfig.authUrl,
        redirectUrl: this.params.redirectUrl ? this.params.redirectUrl : Ni(),
      })
    }
    beginLogin(e) {
      return i(this, void 0, void 0, function* () {
        const t = new fo(e)
        return yield t.open(), yield this.waitForConnect()
      })
    }
    waitForConnect() {
      return new Promise((e) => {
        this._provider.on('connect', () => e(this._provider))
      })
    }
    setAppConfig() {
      return i(this, void 0, void 0, function* () {
        const e = yield (function (e, t) {
            return i(this, void 0, void 0, function* () {
              const n = new URL(`/api/v1/get-app-theme/?id=${e}`, t)
              return yield (yield fetch(n.toString())).json()
            })
          })(this.appId, this.networkConfig.gatewayUrl),
          t = (function (e, t, n) {
            const r = new URL(`/api/v2/app/${e}/logo?type=${t}`, n)
            return {
              horizontal: `${r.toString()}&orientation=horizontal`,
              vertical: `${r.toString()}&orientation=vertical`,
            }
          })(this.appId, e.theme, this.networkConfig.gatewayUrl)
        this.appConfig = {
          name: e.name,
          themeConfig: {
            assets: {
              logo: { horizontal: t.horizontal, vertical: t.vertical },
            },
            theme: e.theme,
          },
        }
      })
    }
    waitForInit() {
      return i(this, void 0, void 0, function* () {
        const e = new Promise((e) => {
          this.initPromises.push(e)
        })
        return yield e
      })
    }
    resolveInitPromises() {
      return i(this, void 0, void 0, function* () {
        const e = this.initPromises
        this.initPromises = []
        for (const t of e) t(this)
      })
    }
    get provider() {
      if (this._provider) return this._provider
      throw (this.logger.error('provider', ie), ie)
    }
    get logo() {
      if (this.initStatus === pe.DONE)
        return this.appConfig.themeConfig.assets.logo
      throw (this.logger.error('logo', ie), ie)
    }
    get theme() {
      if (this.initStatus === pe.DONE) return this.appConfig.themeConfig.theme
      throw (this.logger.error('theme', ie), ie)
    }
    setProviders() {
      window.arcana || (window.arcana = {}),
        (window.arcana.provider = this._provider)
    }
  }),
    Object.defineProperty(e, '__esModule', { value: !0 })
})
