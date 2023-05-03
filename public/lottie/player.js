!(function (t, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? e(exports)
    : 'function' == typeof define && define.amd
    ? define(['exports'], e)
    : e(
        ((t = 'undefined' != typeof globalThis ? globalThis : t || self)[
          'dotlottie-player'
        ] = {})
      );
})(this, function (exports) {
  'use strict';
  function _taggedTemplateLiteral(t, e) {
    return (
      e || (e = t.slice(0)),
      Object.freeze(
        Object.defineProperties(t, { raw: { value: Object.freeze(e) } })
      )
    );
  }
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
  ***************************************************************************** */ function __decorate(
    t,
    e,
    r,
    i
  ) {
    var s,
      n = arguments.length,
      a =
        n < 3
          ? e
          : null === i
          ? (i = Object.getOwnPropertyDescriptor(e, r))
          : i;
    if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
      a = Reflect.decorate(t, e, r, i);
    else
      for (var o = t.length - 1; o >= 0; o--)
        (s = t[o]) && (a = (n < 3 ? s(a) : n > 3 ? s(e, r, a) : s(e, r)) || a);
    return n > 3 && a && Object.defineProperty(e, r, a), a;
    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
  }
  const isCEPolyfill =
      'undefined' != typeof window &&
      null != window.customElements &&
      void 0 !== window.customElements.polyfillWrapFlushCallback,
    removeNodes = (t, e, r = null) => {
      for (; e !== r; ) {
        const r = e.nextSibling;
        t.removeChild(e), (e = r);
      }
    },
    marker = `{{lit-${String(Math.random()).slice(2)}}}`,
    nodeMarker = `\x3c!--${marker}--\x3e`,
    markerRegex = new RegExp(`${marker}|${nodeMarker}`),
    boundAttributeSuffix = '$lit$';
  class Template {
    constructor(t, e) {
      (this.parts = []), (this.element = e);
      const r = [],
        i = [],
        s = document.createTreeWalker(e.content, 133, null, !1);
      let n = 0,
        a = -1,
        o = 0;
      const {
        strings: h,
        values: { length: l },
      } = t;
      for (; o < l; ) {
        const t = s.nextNode();
        if (null !== t) {
          if ((a++, 1 === t.nodeType)) {
            if (t.hasAttributes()) {
              const e = t.attributes,
                { length: r } = e;
              let i = 0;
              for (let t = 0; t < r; t++)
                endsWith(e[t].name, boundAttributeSuffix) && i++;
              for (; i-- > 0; ) {
                const e = h[o],
                  r = lastAttributeNameRegex.exec(e)[2],
                  i = r.toLowerCase() + boundAttributeSuffix,
                  s = t.getAttribute(i);
                t.removeAttribute(i);
                const n = s.split(markerRegex);
                this.parts.push({
                  type: 'attribute',
                  index: a,
                  name: r,
                  strings: n,
                }),
                  (o += n.length - 1);
              }
            }
            'TEMPLATE' === t.tagName &&
              (i.push(t), (s.currentNode = t.content));
          } else if (3 === t.nodeType) {
            const e = t.data;
            if (e.indexOf(marker) >= 0) {
              const i = t.parentNode,
                s = e.split(markerRegex),
                n = s.length - 1;
              for (let e = 0; e < n; e++) {
                let r,
                  n = s[e];
                if ('' === n) r = createMarker();
                else {
                  const t = lastAttributeNameRegex.exec(n);
                  null !== t &&
                    endsWith(t[2], boundAttributeSuffix) &&
                    (n =
                      n.slice(0, t.index) +
                      t[1] +
                      t[2].slice(0, -boundAttributeSuffix.length) +
                      t[3]),
                    (r = document.createTextNode(n));
                }
                i.insertBefore(r, t),
                  this.parts.push({ type: 'node', index: ++a });
              }
              '' === s[n]
                ? (i.insertBefore(createMarker(), t), r.push(t))
                : (t.data = s[n]),
                (o += n);
            }
          } else if (8 === t.nodeType)
            if (t.data === marker) {
              const e = t.parentNode;
              (null !== t.previousSibling && a !== n) ||
                (a++, e.insertBefore(createMarker(), t)),
                (n = a),
                this.parts.push({ type: 'node', index: a }),
                null === t.nextSibling ? (t.data = '') : (r.push(t), a--),
                o++;
            } else {
              let e = -1;
              for (; -1 !== (e = t.data.indexOf(marker, e + 1)); )
                this.parts.push({ type: 'node', index: -1 }), o++;
            }
        } else s.currentNode = i.pop();
      }
      for (const t of r) t.parentNode.removeChild(t);
    }
  }
  const endsWith = (t, e) => {
      const r = t.length - e.length;
      return r >= 0 && t.slice(r) === e;
    },
    isTemplatePartActive = (t) => -1 !== t.index,
    createMarker = () => document.createComment(''),
    lastAttributeNameRegex =
      /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/,
    walkerNodeFilter = 133;
  function removeNodesFromTemplate(t, e) {
    const {
        element: { content: r },
        parts: i,
      } = t,
      s = document.createTreeWalker(r, walkerNodeFilter, null, !1);
    let n = nextActiveIndexInTemplateParts(i),
      a = i[n],
      o = -1,
      h = 0;
    const l = [];
    let p = null;
    for (; s.nextNode(); ) {
      o++;
      const t = s.currentNode;
      for (
        t.previousSibling === p && (p = null),
          e.has(t) && (l.push(t), null === p && (p = t)),
          null !== p && h++;
        void 0 !== a && a.index === o;

      )
        (a.index = null !== p ? -1 : a.index - h),
          (n = nextActiveIndexInTemplateParts(i, n)),
          (a = i[n]);
    }
    l.forEach((t) => t.parentNode.removeChild(t));
  }
  const countNodes = (t) => {
      let e = 11 === t.nodeType ? 0 : 1;
      const r = document.createTreeWalker(t, walkerNodeFilter, null, !1);
      for (; r.nextNode(); ) e++;
      return e;
    },
    nextActiveIndexInTemplateParts = (t, e = -1) => {
      for (let r = e + 1; r < t.length; r++) {
        const e = t[r];
        if (isTemplatePartActive(e)) return r;
      }
      return -1;
    };
  function insertNodeIntoTemplate(t, e, r = null) {
    const {
      element: { content: i },
      parts: s,
    } = t;
    if (null == r) return void i.appendChild(e);
    const n = document.createTreeWalker(i, walkerNodeFilter, null, !1);
    let a = nextActiveIndexInTemplateParts(s),
      o = 0,
      h = -1;
    for (; n.nextNode(); ) {
      h++;
      for (
        n.currentNode === r &&
        ((o = countNodes(e)), r.parentNode.insertBefore(e, r));
        -1 !== a && s[a].index === h;

      ) {
        if (o > 0) {
          for (; -1 !== a; )
            (s[a].index += o), (a = nextActiveIndexInTemplateParts(s, a));
          return;
        }
        a = nextActiveIndexInTemplateParts(s, a);
      }
    }
  }
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */ const directives = new WeakMap(),
    isDirective = (t) => 'function' == typeof t && directives.has(t),
    noChange = {},
    nothing = {};
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  class TemplateInstance {
    constructor(t, e, r) {
      (this.__parts = []),
        (this.template = t),
        (this.processor = e),
        (this.options = r);
    }
    update(t) {
      let e = 0;
      for (const r of this.__parts) void 0 !== r && r.setValue(t[e]), e++;
      for (const t of this.__parts) void 0 !== t && t.commit();
    }
    _clone() {
      const t = isCEPolyfill
          ? this.template.element.content.cloneNode(!0)
          : document.importNode(this.template.element.content, !0),
        e = [],
        r = this.template.parts,
        i = document.createTreeWalker(t, 133, null, !1);
      let s,
        n = 0,
        a = 0,
        o = i.nextNode();
      for (; n < r.length; )
        if (((s = r[n]), isTemplatePartActive(s))) {
          for (; a < s.index; )
            a++,
              'TEMPLATE' === o.nodeName &&
                (e.push(o), (i.currentNode = o.content)),
              null === (o = i.nextNode()) &&
                ((i.currentNode = e.pop()), (o = i.nextNode()));
          if ('node' === s.type) {
            const t = this.processor.handleTextExpression(this.options);
            t.insertAfterNode(o.previousSibling), this.__parts.push(t);
          } else
            this.__parts.push(
              ...this.processor.handleAttributeExpressions(
                o,
                s.name,
                s.strings,
                this.options
              )
            );
          n++;
        } else this.__parts.push(void 0), n++;
      return (
        isCEPolyfill && (document.adoptNode(t), customElements.upgrade(t)), t
      );
    }
  }
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */ const commentMarker = ` ${marker} `;
  class TemplateResult {
    constructor(t, e, r, i) {
      (this.strings = t),
        (this.values = e),
        (this.type = r),
        (this.processor = i);
    }
    getHTML() {
      const t = this.strings.length - 1;
      let e = '',
        r = !1;
      for (let i = 0; i < t; i++) {
        const t = this.strings[i],
          s = t.lastIndexOf('\x3c!--');
        r = (s > -1 || r) && -1 === t.indexOf('--\x3e', s + 1);
        const n = lastAttributeNameRegex.exec(t);
        e +=
          null === n
            ? t + (r ? commentMarker : nodeMarker)
            : t.substr(0, n.index) +
              n[1] +
              n[2] +
              boundAttributeSuffix +
              n[3] +
              marker;
      }
      return (e += this.strings[t]), e;
    }
    getTemplateElement() {
      const t = document.createElement('template');
      return (t.innerHTML = this.getHTML()), t;
    }
  }
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */ const isPrimitive = (t) =>
      null === t || !('object' == typeof t || 'function' == typeof t),
    isIterable = (t) => Array.isArray(t) || !(!t || !t[Symbol.iterator]);
  class AttributeCommitter {
    constructor(t, e, r) {
      (this.dirty = !0),
        (this.element = t),
        (this.name = e),
        (this.strings = r),
        (this.parts = []);
      for (let t = 0; t < r.length - 1; t++) this.parts[t] = this._createPart();
    }
    _createPart() {
      return new AttributePart(this);
    }
    _getValue() {
      const t = this.strings,
        e = t.length - 1;
      let r = '';
      for (let i = 0; i < e; i++) {
        r += t[i];
        const e = this.parts[i];
        if (void 0 !== e) {
          const t = e.value;
          if (isPrimitive(t) || !isIterable(t))
            r += 'string' == typeof t ? t : String(t);
          else for (const e of t) r += 'string' == typeof e ? e : String(e);
        }
      }
      return (r += t[e]), r;
    }
    commit() {
      this.dirty &&
        ((this.dirty = !1),
        this.element.setAttribute(this.name, this._getValue()));
    }
  }
  class AttributePart {
    constructor(t) {
      (this.value = void 0), (this.committer = t);
    }
    setValue(t) {
      t === noChange ||
        (isPrimitive(t) && t === this.value) ||
        ((this.value = t), isDirective(t) || (this.committer.dirty = !0));
    }
    commit() {
      for (; isDirective(this.value); ) {
        const t = this.value;
        (this.value = noChange), t(this);
      }
      this.value !== noChange && this.committer.commit();
    }
  }
  class NodePart {
    constructor(t) {
      (this.value = void 0), (this.__pendingValue = void 0), (this.options = t);
    }
    appendInto(t) {
      (this.startNode = t.appendChild(createMarker())),
        (this.endNode = t.appendChild(createMarker()));
    }
    insertAfterNode(t) {
      (this.startNode = t), (this.endNode = t.nextSibling);
    }
    appendIntoPart(t) {
      t.__insert((this.startNode = createMarker())),
        t.__insert((this.endNode = createMarker()));
    }
    insertAfterPart(t) {
      t.__insert((this.startNode = createMarker())),
        (this.endNode = t.endNode),
        (t.endNode = this.startNode);
    }
    setValue(t) {
      this.__pendingValue = t;
    }
    commit() {
      if (null === this.startNode.parentNode) return;
      for (; isDirective(this.__pendingValue); ) {
        const t = this.__pendingValue;
        (this.__pendingValue = noChange), t(this);
      }
      const t = this.__pendingValue;
      t !== noChange &&
        (isPrimitive(t)
          ? t !== this.value && this.__commitText(t)
          : t instanceof TemplateResult
          ? this.__commitTemplateResult(t)
          : t instanceof Node
          ? this.__commitNode(t)
          : isIterable(t)
          ? this.__commitIterable(t)
          : t === nothing
          ? ((this.value = nothing), this.clear())
          : this.__commitText(t));
    }
    __insert(t) {
      this.endNode.parentNode.insertBefore(t, this.endNode);
    }
    __commitNode(t) {
      this.value !== t && (this.clear(), this.__insert(t), (this.value = t));
    }
    __commitText(t) {
      const e = this.startNode.nextSibling,
        r = 'string' == typeof (t = null == t ? '' : t) ? t : String(t);
      e === this.endNode.previousSibling && 3 === e.nodeType
        ? (e.data = r)
        : this.__commitNode(document.createTextNode(r)),
        (this.value = t);
    }
    __commitTemplateResult(t) {
      const e = this.options.templateFactory(t);
      if (this.value instanceof TemplateInstance && this.value.template === e)
        this.value.update(t.values);
      else {
        const r = new TemplateInstance(e, t.processor, this.options),
          i = r._clone();
        r.update(t.values), this.__commitNode(i), (this.value = r);
      }
    }
    __commitIterable(t) {
      Array.isArray(this.value) || ((this.value = []), this.clear());
      const e = this.value;
      let r,
        i = 0;
      for (const s of t)
        (r = e[i]),
          void 0 === r &&
            ((r = new NodePart(this.options)),
            e.push(r),
            0 === i ? r.appendIntoPart(this) : r.insertAfterPart(e[i - 1])),
          r.setValue(s),
          r.commit(),
          i++;
      i < e.length && ((e.length = i), this.clear(r && r.endNode));
    }
    clear(t = this.startNode) {
      removeNodes(this.startNode.parentNode, t.nextSibling, this.endNode);
    }
  }
  class BooleanAttributePart {
    constructor(t, e, r) {
      if (
        ((this.value = void 0),
        (this.__pendingValue = void 0),
        2 !== r.length || '' !== r[0] || '' !== r[1])
      )
        throw new Error(
          'Boolean attributes can only contain a single expression'
        );
      (this.element = t), (this.name = e), (this.strings = r);
    }
    setValue(t) {
      this.__pendingValue = t;
    }
    commit() {
      for (; isDirective(this.__pendingValue); ) {
        const t = this.__pendingValue;
        (this.__pendingValue = noChange), t(this);
      }
      if (this.__pendingValue === noChange) return;
      const t = !!this.__pendingValue;
      this.value !== t &&
        (t
          ? this.element.setAttribute(this.name, '')
          : this.element.removeAttribute(this.name),
        (this.value = t)),
        (this.__pendingValue = noChange);
    }
  }
  class PropertyCommitter extends AttributeCommitter {
    constructor(t, e, r) {
      super(t, e, r),
        (this.single = 2 === r.length && '' === r[0] && '' === r[1]);
    }
    _createPart() {
      return new PropertyPart(this);
    }
    _getValue() {
      return this.single ? this.parts[0].value : super._getValue();
    }
    commit() {
      this.dirty &&
        ((this.dirty = !1), (this.element[this.name] = this._getValue()));
    }
  }
  class PropertyPart extends AttributePart {}
  let eventOptionsSupported = !1;
  (() => {
    try {
      const t = {
        get capture() {
          return (eventOptionsSupported = !0), !1;
        },
      };
      window.addEventListener('test', t, t),
        window.removeEventListener('test', t, t);
    } catch (t) {}
  })();
  class EventPart {
    constructor(t, e, r) {
      (this.value = void 0),
        (this.__pendingValue = void 0),
        (this.element = t),
        (this.eventName = e),
        (this.eventContext = r),
        (this.__boundHandleEvent = (t) => this.handleEvent(t));
    }
    setValue(t) {
      this.__pendingValue = t;
    }
    commit() {
      for (; isDirective(this.__pendingValue); ) {
        const t = this.__pendingValue;
        (this.__pendingValue = noChange), t(this);
      }
      if (this.__pendingValue === noChange) return;
      const t = this.__pendingValue,
        e = this.value,
        r =
          null == t ||
          (null != e &&
            (t.capture !== e.capture ||
              t.once !== e.once ||
              t.passive !== e.passive)),
        i = null != t && (null == e || r);
      r &&
        this.element.removeEventListener(
          this.eventName,
          this.__boundHandleEvent,
          this.__options
        ),
        i &&
          ((this.__options = getOptions(t)),
          this.element.addEventListener(
            this.eventName,
            this.__boundHandleEvent,
            this.__options
          )),
        (this.value = t),
        (this.__pendingValue = noChange);
    }
    handleEvent(t) {
      'function' == typeof this.value
        ? this.value.call(this.eventContext || this.element, t)
        : this.value.handleEvent(t);
    }
  }
  const getOptions = (t) =>
    t &&
    (eventOptionsSupported
      ? { capture: t.capture, passive: t.passive, once: t.once }
      : t.capture);
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */ function templateFactory(t) {
    let e = templateCaches.get(t.type);
    void 0 === e &&
      ((e = { stringsArray: new WeakMap(), keyString: new Map() }),
      templateCaches.set(t.type, e));
    let r = e.stringsArray.get(t.strings);
    if (void 0 !== r) return r;
    const i = t.strings.join(marker);
    return (
      (r = e.keyString.get(i)),
      void 0 === r &&
        ((r = new Template(t, t.getTemplateElement())), e.keyString.set(i, r)),
      e.stringsArray.set(t.strings, r),
      r
    );
  }
  const templateCaches = new Map(),
    parts = new WeakMap(),
    render = (t, e, r) => {
      let i = parts.get(e);
      void 0 === i &&
        (removeNodes(e, e.firstChild),
        parts.set(
          e,
          (i = new NodePart(
            Object.assign({ templateFactory: templateFactory }, r)
          ))
        ),
        i.appendInto(e)),
        i.setValue(t),
        i.commit();
    };
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  class DefaultTemplateProcessor {
    handleAttributeExpressions(t, e, r, i) {
      const s = e[0];
      if ('.' === s) {
        return new PropertyCommitter(t, e.slice(1), r).parts;
      }
      if ('@' === s) return [new EventPart(t, e.slice(1), i.eventContext)];
      if ('?' === s) return [new BooleanAttributePart(t, e.slice(1), r)];
      return new AttributeCommitter(t, e, r).parts;
    }
    handleTextExpression(t) {
      return new NodePart(t);
    }
  }
  const defaultTemplateProcessor = new DefaultTemplateProcessor();
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */ 'undefined' != typeof window &&
    (window.litHtmlVersions || (window.litHtmlVersions = [])).push('1.2.1');
  const html = (t, ...e) =>
      new TemplateResult(t, e, 'html', defaultTemplateProcessor),
    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */ getTemplateCacheKey = (t, e) => `${t}--${e}`;
  let compatibleShadyCSSVersion = !0;
  void 0 === window.ShadyCSS
    ? (compatibleShadyCSSVersion = !1)
    : void 0 === window.ShadyCSS.prepareTemplateDom &&
      (console.warn(
        'Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1.'
      ),
      (compatibleShadyCSSVersion = !1));
  const shadyTemplateFactory = (t) => (e) => {
      const r = getTemplateCacheKey(e.type, t);
      let i = templateCaches.get(r);
      void 0 === i &&
        ((i = { stringsArray: new WeakMap(), keyString: new Map() }),
        templateCaches.set(r, i));
      let s = i.stringsArray.get(e.strings);
      if (void 0 !== s) return s;
      const n = e.strings.join(marker);
      if (((s = i.keyString.get(n)), void 0 === s)) {
        const r = e.getTemplateElement();
        compatibleShadyCSSVersion && window.ShadyCSS.prepareTemplateDom(r, t),
          (s = new Template(e, r)),
          i.keyString.set(n, s);
      }
      return i.stringsArray.set(e.strings, s), s;
    },
    TEMPLATE_TYPES = ['html', 'svg'],
    removeStylesFromLitTemplates = (t) => {
      TEMPLATE_TYPES.forEach((e) => {
        const r = templateCaches.get(getTemplateCacheKey(e, t));
        void 0 !== r &&
          r.keyString.forEach((t) => {
            const {
                element: { content: e },
              } = t,
              r = new Set();
            Array.from(e.querySelectorAll('style')).forEach((t) => {
              r.add(t);
            }),
              removeNodesFromTemplate(t, r);
          });
      });
    },
    shadyRenderSet = new Set(),
    prepareTemplateStyles = (t, e, r) => {
      shadyRenderSet.add(t);
      const i = r ? r.element : document.createElement('template'),
        s = e.querySelectorAll('style'),
        { length: n } = s;
      if (0 === n) return void window.ShadyCSS.prepareTemplateStyles(i, t);
      const a = document.createElement('style');
      for (let t = 0; t < n; t++) {
        const e = s[t];
        e.parentNode.removeChild(e), (a.textContent += e.textContent);
      }
      removeStylesFromLitTemplates(t);
      const o = i.content;
      r
        ? insertNodeIntoTemplate(r, a, o.firstChild)
        : o.insertBefore(a, o.firstChild),
        window.ShadyCSS.prepareTemplateStyles(i, t);
      const h = o.querySelector('style');
      if (window.ShadyCSS.nativeShadow && null !== h)
        e.insertBefore(h.cloneNode(!0), e.firstChild);
      else if (r) {
        o.insertBefore(a, o.firstChild);
        const t = new Set();
        t.add(a), removeNodesFromTemplate(r, t);
      }
    },
    render$1 = (t, e, r) => {
      if (!r || 'object' != typeof r || !r.scopeName)
        throw new Error('The `scopeName` option is required.');
      const i = r.scopeName,
        s = parts.has(e),
        n = compatibleShadyCSSVersion && 11 === e.nodeType && !!e.host,
        a = n && !shadyRenderSet.has(i),
        o = a ? document.createDocumentFragment() : e;
      if (
        (render(
          t,
          o,
          Object.assign({ templateFactory: shadyTemplateFactory(i) }, r)
        ),
        a)
      ) {
        const t = parts.get(o);
        parts.delete(o);
        const r =
          t.value instanceof TemplateInstance ? t.value.template : void 0;
        prepareTemplateStyles(i, o, r),
          removeNodes(e, e.firstChild),
          e.appendChild(o),
          parts.set(e, t);
      }
      !s && n && window.ShadyCSS.styleElement(e.host);
    };
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  var _a;
  window.JSCompiler_renameProperty = (t, e) => t;
  const defaultConverter = {
      toAttribute(t, e) {
        switch (e) {
          case Boolean:
            return t ? '' : null;
          case Object:
          case Array:
            return null == t ? t : JSON.stringify(t);
        }
        return t;
      },
      fromAttribute(t, e) {
        switch (e) {
          case Boolean:
            return null !== t;
          case Number:
            return null === t ? null : Number(t);
          case Object:
          case Array:
            return JSON.parse(t);
        }
        return t;
      },
    },
    notEqual = (t, e) => e !== t && (e == e || t == t),
    defaultPropertyDeclaration = {
      attribute: !0,
      type: String,
      converter: defaultConverter,
      reflect: !1,
      hasChanged: notEqual,
    },
    STATE_HAS_UPDATED = 1,
    STATE_UPDATE_REQUESTED = 4,
    STATE_IS_REFLECTING_TO_ATTRIBUTE = 8,
    STATE_IS_REFLECTING_TO_PROPERTY = 16,
    finalized = 'finalized';
  class UpdatingElement extends HTMLElement {
    constructor() {
      super(),
        (this._updateState = 0),
        (this._instanceProperties = void 0),
        (this._updatePromise = new Promise(
          (t) => (this._enableUpdatingResolver = t)
        )),
        (this._changedProperties = new Map()),
        (this._reflectingProperties = void 0),
        this.initialize();
    }
    static get observedAttributes() {
      this.finalize();
      const t = [];
      return (
        this._classProperties.forEach((e, r) => {
          const i = this._attributeNameForProperty(r, e);
          void 0 !== i && (this._attributeToPropertyMap.set(i, r), t.push(i));
        }),
        t
      );
    }
    static _ensureClassProperties() {
      if (
        !this.hasOwnProperty(
          JSCompiler_renameProperty('_classProperties', this)
        )
      ) {
        this._classProperties = new Map();
        const t = Object.getPrototypeOf(this)._classProperties;
        void 0 !== t && t.forEach((t, e) => this._classProperties.set(e, t));
      }
    }
    static createProperty(t, e = defaultPropertyDeclaration) {
      if (
        (this._ensureClassProperties(),
        this._classProperties.set(t, e),
        e.noAccessor || this.prototype.hasOwnProperty(t))
      )
        return;
      const r = 'symbol' == typeof t ? Symbol() : '__' + t,
        i = this.getPropertyDescriptor(t, r, e);
      void 0 !== i && Object.defineProperty(this.prototype, t, i);
    }
    static getPropertyDescriptor(t, e, r) {
      return {
        get() {
          return this[e];
        },
        set(r) {
          const i = this[t];
          (this[e] = r), this._requestUpdate(t, i);
        },
        configurable: !0,
        enumerable: !0,
      };
    }
    static getPropertyOptions(t) {
      return (
        (this._classProperties && this._classProperties.get(t)) ||
        defaultPropertyDeclaration
      );
    }
    static finalize() {
      const t = Object.getPrototypeOf(this);
      if (
        (t.hasOwnProperty(finalized) || t.finalize(),
        (this[finalized] = !0),
        this._ensureClassProperties(),
        (this._attributeToPropertyMap = new Map()),
        this.hasOwnProperty(JSCompiler_renameProperty('properties', this)))
      ) {
        const t = this.properties,
          e = [
            ...Object.getOwnPropertyNames(t),
            ...('function' == typeof Object.getOwnPropertySymbols
              ? Object.getOwnPropertySymbols(t)
              : []),
          ];
        for (const r of e) this.createProperty(r, t[r]);
      }
    }
    static _attributeNameForProperty(t, e) {
      const r = e.attribute;
      return !1 === r
        ? void 0
        : 'string' == typeof r
        ? r
        : 'string' == typeof t
        ? t.toLowerCase()
        : void 0;
    }
    static _valueHasChanged(t, e, r = notEqual) {
      return r(t, e);
    }
    static _propertyValueFromAttribute(t, e) {
      const r = e.type,
        i = e.converter || defaultConverter,
        s = 'function' == typeof i ? i : i.fromAttribute;
      return s ? s(t, r) : t;
    }
    static _propertyValueToAttribute(t, e) {
      if (void 0 === e.reflect) return;
      const r = e.type,
        i = e.converter;
      return ((i && i.toAttribute) || defaultConverter.toAttribute)(t, r);
    }
    initialize() {
      this._saveInstanceProperties(), this._requestUpdate();
    }
    _saveInstanceProperties() {
      this.constructor._classProperties.forEach((t, e) => {
        if (this.hasOwnProperty(e)) {
          const t = this[e];
          delete this[e],
            this._instanceProperties || (this._instanceProperties = new Map()),
            this._instanceProperties.set(e, t);
        }
      });
    }
    _applyInstanceProperties() {
      this._instanceProperties.forEach((t, e) => (this[e] = t)),
        (this._instanceProperties = void 0);
    }
    connectedCallback() {
      this.enableUpdating();
    }
    enableUpdating() {
      void 0 !== this._enableUpdatingResolver &&
        (this._enableUpdatingResolver(),
        (this._enableUpdatingResolver = void 0));
    }
    disconnectedCallback() {}
    attributeChangedCallback(t, e, r) {
      e !== r && this._attributeToProperty(t, r);
    }
    _propertyToAttribute(t, e, r = defaultPropertyDeclaration) {
      const i = this.constructor,
        s = i._attributeNameForProperty(t, r);
      if (void 0 !== s) {
        const t = i._propertyValueToAttribute(e, r);
        if (void 0 === t) return;
        (this._updateState =
          this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE),
          null == t ? this.removeAttribute(s) : this.setAttribute(s, t),
          (this._updateState =
            this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE);
      }
    }
    _attributeToProperty(t, e) {
      if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) return;
      const r = this.constructor,
        i = r._attributeToPropertyMap.get(t);
      if (void 0 !== i) {
        const t = r.getPropertyOptions(i);
        (this._updateState =
          this._updateState | STATE_IS_REFLECTING_TO_PROPERTY),
          (this[i] = r._propertyValueFromAttribute(e, t)),
          (this._updateState =
            this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY);
      }
    }
    _requestUpdate(t, e) {
      let r = !0;
      if (void 0 !== t) {
        const i = this.constructor,
          s = i.getPropertyOptions(t);
        i._valueHasChanged(this[t], e, s.hasChanged)
          ? (this._changedProperties.has(t) ||
              this._changedProperties.set(t, e),
            !0 !== s.reflect ||
              this._updateState & STATE_IS_REFLECTING_TO_PROPERTY ||
              (void 0 === this._reflectingProperties &&
                (this._reflectingProperties = new Map()),
              this._reflectingProperties.set(t, s)))
          : (r = !1);
      }
      !this._hasRequestedUpdate &&
        r &&
        (this._updatePromise = this._enqueueUpdate());
    }
    requestUpdate(t, e) {
      return this._requestUpdate(t, e), this.updateComplete;
    }
    async _enqueueUpdate() {
      this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
      try {
        await this._updatePromise;
      } catch (t) {}
      const t = this.performUpdate();
      return null != t && (await t), !this._hasRequestedUpdate;
    }
    get _hasRequestedUpdate() {
      return this._updateState & STATE_UPDATE_REQUESTED;
    }
    get hasUpdated() {
      return this._updateState & STATE_HAS_UPDATED;
    }
    performUpdate() {
      this._instanceProperties && this._applyInstanceProperties();
      let t = !1;
      const e = this._changedProperties;
      try {
        (t = this.shouldUpdate(e)), t ? this.update(e) : this._markUpdated();
      } catch (e) {
        throw ((t = !1), this._markUpdated(), e);
      }
      t &&
        (this._updateState & STATE_HAS_UPDATED ||
          ((this._updateState = this._updateState | STATE_HAS_UPDATED),
          this.firstUpdated(e)),
        this.updated(e));
    }
    _markUpdated() {
      (this._changedProperties = new Map()),
        (this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED);
    }
    get updateComplete() {
      return this._getUpdateComplete();
    }
    _getUpdateComplete() {
      return this._updatePromise;
    }
    shouldUpdate(t) {
      return !0;
    }
    update(t) {
      void 0 !== this._reflectingProperties &&
        this._reflectingProperties.size > 0 &&
        (this._reflectingProperties.forEach((t, e) =>
          this._propertyToAttribute(e, this[e], t)
        ),
        (this._reflectingProperties = void 0)),
        this._markUpdated();
    }
    updated(t) {}
    firstUpdated(t) {}
  }
  (_a = finalized), (UpdatingElement[_a] = !0);
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const legacyCustomElement = (t, e) => (window.customElements.define(t, e), e),
    standardCustomElement = (t, e) => {
      const { kind: r, elements: i } = e;
      return {
        kind: r,
        elements: i,
        finisher(e) {
          window.customElements.define(t, e);
        },
      };
    },
    customElement = (t) => (e) =>
      'function' == typeof e
        ? legacyCustomElement(t, e)
        : standardCustomElement(t, e),
    standardProperty = (t, e) =>
      'method' === e.kind && e.descriptor && !('value' in e.descriptor)
        ? Object.assign(Object.assign({}, e), {
            finisher(r) {
              r.createProperty(e.key, t);
            },
          })
        : {
            kind: 'field',
            key: Symbol(),
            placement: 'own',
            descriptor: {},
            initializer() {
              'function' == typeof e.initializer &&
                (this[e.key] = e.initializer.call(this));
            },
            finisher(r) {
              r.createProperty(e.key, t);
            },
          },
    legacyProperty = (t, e, r) => {
      e.constructor.createProperty(r, t);
    };
  function property(t) {
    return (e, r) =>
      void 0 !== r ? legacyProperty(t, e, r) : standardProperty(t, e);
  }
  function query(t) {
    return (e, r) => {
      const i = {
        get() {
          return this.renderRoot.querySelector(t);
        },
        enumerable: !0,
        configurable: !0,
      };
      return void 0 !== r ? legacyQuery(i, e, r) : standardQuery(i, e);
    };
  }
  const legacyQuery = (t, e, r) => {
      Object.defineProperty(e, r, t);
    },
    standardQuery = (t, e) => ({
      kind: 'method',
      placement: 'prototype',
      key: e.key,
      descriptor: t,
    }),
    /**
  @license
  Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at
  http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
  http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
  found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
  part of the polymer project is also subject to an additional IP rights grant
  found at http://polymer.github.io/PATENTS.txt
  */ supportsAdoptingStyleSheets =
      'adoptedStyleSheets' in Document.prototype &&
      'replace' in CSSStyleSheet.prototype,
    constructionToken = Symbol();
  class CSSResult {
    constructor(t, e) {
      if (e !== constructionToken)
        throw new Error(
          'CSSResult is not constructable. Use `unsafeCSS` or `css` instead.'
        );
      this.cssText = t;
    }
    get styleSheet() {
      return (
        void 0 === this._styleSheet &&
          (supportsAdoptingStyleSheets
            ? ((this._styleSheet = new CSSStyleSheet()),
              this._styleSheet.replaceSync(this.cssText))
            : (this._styleSheet = null)),
        this._styleSheet
      );
    }
    toString() {
      return this.cssText;
    }
  }
  const textFromCSSResult = (t) => {
      if (t instanceof CSSResult) return t.cssText;
      if ('number' == typeof t) return t;
      throw new Error(
        `Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`
      );
    },
    css = (t, ...e) => {
      const r = e.reduce(
        (e, r, i) => e + textFromCSSResult(r) + t[i + 1],
        t[0]
      );
      return new CSSResult(r, constructionToken);
    };
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  (window.litElementVersions || (window.litElementVersions = [])).push('2.3.1');
  const renderNotImplemented = {};
  class LitElement extends UpdatingElement {
    static getStyles() {
      return this.styles;
    }
    static _getUniqueStyles() {
      if (this.hasOwnProperty(JSCompiler_renameProperty('_styles', this)))
        return;
      const t = this.getStyles();
      if (void 0 === t) this._styles = [];
      else if (Array.isArray(t)) {
        const e = (t, r) =>
            t.reduceRight(
              (t, r) => (Array.isArray(r) ? e(r, t) : (t.add(r), t)),
              r
            ),
          r = e(t, new Set()),
          i = [];
        r.forEach((t) => i.unshift(t)), (this._styles = i);
      } else this._styles = [t];
    }
    initialize() {
      super.initialize(),
        this.constructor._getUniqueStyles(),
        (this.renderRoot = this.createRenderRoot()),
        window.ShadowRoot &&
          this.renderRoot instanceof window.ShadowRoot &&
          this.adoptStyles();
    }
    createRenderRoot() {
      return this.attachShadow({ mode: 'open' });
    }
    adoptStyles() {
      const t = this.constructor._styles;
      0 !== t.length &&
        (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow
          ? supportsAdoptingStyleSheets
            ? (this.renderRoot.adoptedStyleSheets = t.map((t) => t.styleSheet))
            : (this._needsShimAdoptedStyleSheets = !0)
          : window.ShadyCSS.ScopingShim.prepareAdoptedCssText(
              t.map((t) => t.cssText),
              this.localName
            ));
    }
    connectedCallback() {
      super.connectedCallback(),
        this.hasUpdated &&
          void 0 !== window.ShadyCSS &&
          window.ShadyCSS.styleElement(this);
    }
    update(t) {
      const e = this.render();
      super.update(t),
        e !== renderNotImplemented &&
          this.constructor.render(e, this.renderRoot, {
            scopeName: this.localName,
            eventContext: this,
          }),
        this._needsShimAdoptedStyleSheets &&
          ((this._needsShimAdoptedStyleSheets = !1),
          this.constructor._styles.forEach((t) => {
            const e = document.createElement('style');
            (e.textContent = t.cssText), this.renderRoot.appendChild(e);
          }));
    }
    render() {
      return renderNotImplemented;
    }
  }
  (LitElement.finalized = !0), (LitElement.render = render$1);
  var commonjsGlobal =
    'undefined' != typeof globalThis
      ? globalThis
      : 'undefined' != typeof window
      ? window
      : 'undefined' != typeof global
      ? global
      : 'undefined' != typeof self
      ? self
      : {};
  function createCommonjsModule(t, e, r) {
    return (
      t(
        (r = {
          path: e,
          exports: {},
          require: function (t, e) {
            return commonjsRequire(t, null == e ? r.path : e);
          },
        }),
        r.exports
      ),
      r.exports
    );
  }
  function commonjsRequire() {
    throw new Error(
      'Dynamic requires are not currently supported by @rollup/plugin-commonjs'
    );
  }
  var lottie_svg = createCommonjsModule(function (module) {
      'undefined' != typeof navigator &&
        (function (t, e) {
          module.exports
            ? (module.exports = e(t))
            : ((t.lottie = e(t)), (t.bodymovin = t.lottie));
        })(window || {}, function (window) {
          var svgNS = 'http://www.w3.org/2000/svg',
            locationHref = '',
            initialDefaultFrame = -999999,
            subframeEnabled = !0,
            expressionsPlugin,
            isSafari = /^((?!chrome|android).)*safari/i.test(
              navigator.userAgent
            ),
            bm_pow = Math.pow,
            bm_sqrt = Math.sqrt,
            bm_floor = Math.floor,
            bm_min = Math.min,
            BMMath = {};
          function ProjectInterface() {
            return {};
          }
          !(function () {
            var t,
              e = [
                'abs',
                'acos',
                'acosh',
                'asin',
                'asinh',
                'atan',
                'atanh',
                'atan2',
                'ceil',
                'cbrt',
                'expm1',
                'clz32',
                'cos',
                'cosh',
                'exp',
                'floor',
                'fround',
                'hypot',
                'imul',
                'log',
                'log1p',
                'log2',
                'log10',
                'max',
                'min',
                'pow',
                'random',
                'round',
                'sign',
                'sin',
                'sinh',
                'sqrt',
                'tan',
                'tanh',
                'trunc',
                'E',
                'LN10',
                'LN2',
                'LOG10E',
                'LOG2E',
                'PI',
                'SQRT1_2',
                'SQRT2',
              ],
              r = e.length;
            for (t = 0; t < r; t += 1) BMMath[e[t]] = Math[e[t]];
          })(),
            (BMMath.random = Math.random),
            (BMMath.abs = function (t) {
              if ('object' === typeof t && t.length) {
                var e,
                  r = createSizedArray(t.length),
                  i = t.length;
                for (e = 0; e < i; e += 1) r[e] = Math.abs(t[e]);
                return r;
              }
              return Math.abs(t);
            });
          var defaultCurveSegments = 150,
            degToRads = Math.PI / 180,
            roundCorner = 0.5519;
          function BMEnterFrameEvent(t, e, r, i) {
            (this.type = t),
              (this.currentTime = e),
              (this.totalTime = r),
              (this.direction = i < 0 ? -1 : 1);
          }
          function BMCompleteEvent(t, e) {
            (this.type = t), (this.direction = e < 0 ? -1 : 1);
          }
          function BMCompleteLoopEvent(t, e, r, i) {
            (this.type = t),
              (this.currentLoop = r),
              (this.totalLoops = e),
              (this.direction = i < 0 ? -1 : 1);
          }
          function BMSegmentStartEvent(t, e, r) {
            (this.type = t), (this.firstFrame = e), (this.totalFrames = r);
          }
          function BMDestroyEvent(t, e) {
            (this.type = t), (this.target = e);
          }
          function BMRenderFrameErrorEvent(t, e) {
            (this.type = 'renderFrameError'),
              (this.nativeError = t),
              (this.currentTime = e);
          }
          function BMConfigErrorEvent(t) {
            (this.type = 'configError'), (this.nativeError = t);
          }
          var createElementID =
              ((_count = 0),
              function () {
                return '__lottie_element_' + ++_count;
              }),
            _count;
          function HSVtoRGB(t, e, r) {
            var i, s, n, a, o, h, l, p;
            switch (
              ((h = r * (1 - e)),
              (l = r * (1 - (o = 6 * t - (a = Math.floor(6 * t))) * e)),
              (p = r * (1 - (1 - o) * e)),
              a % 6)
            ) {
              case 0:
                (i = r), (s = p), (n = h);
                break;
              case 1:
                (i = l), (s = r), (n = h);
                break;
              case 2:
                (i = h), (s = r), (n = p);
                break;
              case 3:
                (i = h), (s = l), (n = r);
                break;
              case 4:
                (i = p), (s = h), (n = r);
                break;
              case 5:
                (i = r), (s = h), (n = l);
            }
            return [i, s, n];
          }
          function RGBtoHSV(t, e, r) {
            var i,
              s = Math.max(t, e, r),
              n = Math.min(t, e, r),
              a = s - n,
              o = 0 === s ? 0 : a / s,
              h = s / 255;
            switch (s) {
              case n:
                i = 0;
                break;
              case t:
                (i = e - r + a * (e < r ? 6 : 0)), (i /= 6 * a);
                break;
              case e:
                (i = r - t + 2 * a), (i /= 6 * a);
                break;
              case r:
                (i = t - e + 4 * a), (i /= 6 * a);
            }
            return [i, o, h];
          }
          function addSaturationToRGB(t, e) {
            var r = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
            return (
              (r[1] += e),
              r[1] > 1 ? (r[1] = 1) : r[1] <= 0 && (r[1] = 0),
              HSVtoRGB(r[0], r[1], r[2])
            );
          }
          function addBrightnessToRGB(t, e) {
            var r = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
            return (
              (r[2] += e),
              r[2] > 1 ? (r[2] = 1) : r[2] < 0 && (r[2] = 0),
              HSVtoRGB(r[0], r[1], r[2])
            );
          }
          function addHueToRGB(t, e) {
            var r = RGBtoHSV(255 * t[0], 255 * t[1], 255 * t[2]);
            return (
              (r[0] += e / 360),
              r[0] > 1 ? (r[0] -= 1) : r[0] < 0 && (r[0] += 1),
              HSVtoRGB(r[0], r[1], r[2])
            );
          }
          var rgbToHex = (function () {
            var t,
              e,
              r = [];
            for (t = 0; t < 256; t += 1)
              (e = t.toString(16)), (r[t] = 1 == e.length ? '0' + e : e);
            return function (t, e, i) {
              return (
                t < 0 && (t = 0),
                e < 0 && (e = 0),
                i < 0 && (i = 0),
                '#' + r[t] + r[e] + r[i]
              );
            };
          })();
          function BaseEvent() {}
          BaseEvent.prototype = {
            triggerEvent: function (t, e) {
              if (this._cbs[t])
                for (var r = this._cbs[t].length, i = 0; i < r; i++)
                  this._cbs[t][i](e);
            },
            addEventListener: function (t, e) {
              return (
                this._cbs[t] || (this._cbs[t] = []),
                this._cbs[t].push(e),
                function () {
                  this.removeEventListener(t, e);
                }.bind(this)
              );
            },
            removeEventListener: function (t, e) {
              if (e) {
                if (this._cbs[t]) {
                  for (var r = 0, i = this._cbs[t].length; r < i; )
                    this._cbs[t][r] === e &&
                      (this._cbs[t].splice(r, 1), (r -= 1), (i -= 1)),
                      (r += 1);
                  this._cbs[t].length || (this._cbs[t] = null);
                }
              } else this._cbs[t] = null;
            },
          };
          var createTypedArray =
            'function' == typeof Uint8ClampedArray &&
            'function' == typeof Float32Array
              ? function (t, e) {
                  return 'float32' === t
                    ? new Float32Array(e)
                    : 'int16' === t
                    ? new Int16Array(e)
                    : 'uint8c' === t
                    ? new Uint8ClampedArray(e)
                    : void 0;
                }
              : function (t, e) {
                  var r,
                    i = 0,
                    s = [];
                  switch (t) {
                    case 'int16':
                    case 'uint8c':
                      r = 1;
                      break;
                    default:
                      r = 1.1;
                  }
                  for (i = 0; i < e; i += 1) s.push(r);
                  return s;
                };
          function createSizedArray(t) {
            return Array.apply(null, { length: t });
          }
          function createNS(t) {
            return document.createElementNS(svgNS, t);
          }
          function createTag(t) {
            return document.createElement(t);
          }
          function DynamicPropertyContainer() {}
          DynamicPropertyContainer.prototype = {
            addDynamicProperty: function (t) {
              -1 === this.dynamicProperties.indexOf(t) &&
                (this.dynamicProperties.push(t),
                this.container.addDynamicProperty(this),
                (this._isAnimated = !0));
            },
            iterateDynamicProperties: function () {
              this._mdf = !1;
              var t,
                e = this.dynamicProperties.length;
              for (t = 0; t < e; t += 1)
                this.dynamicProperties[t].getValue(),
                  this.dynamicProperties[t]._mdf && (this._mdf = !0);
            },
            initDynamicPropertyContainer: function (t) {
              (this.container = t),
                (this.dynamicProperties = []),
                (this._mdf = !1),
                (this._isAnimated = !1);
            },
          };
          var getBlendMode =
              ((blendModeEnums = {
                0: 'source-over',
                1: 'multiply',
                2: 'screen',
                3: 'overlay',
                4: 'darken',
                5: 'lighten',
                6: 'color-dodge',
                7: 'color-burn',
                8: 'hard-light',
                9: 'soft-light',
                10: 'difference',
                11: 'exclusion',
                12: 'hue',
                13: 'saturation',
                14: 'color',
                15: 'luminosity',
              }),
              function (t) {
                return blendModeEnums[t] || '';
              }),
            blendModeEnums,
            Matrix = (function () {
              var t = Math.cos,
                e = Math.sin,
                r = Math.tan,
                i = Math.round;
              function s() {
                return (
                  (this.props[0] = 1),
                  (this.props[1] = 0),
                  (this.props[2] = 0),
                  (this.props[3] = 0),
                  (this.props[4] = 0),
                  (this.props[5] = 1),
                  (this.props[6] = 0),
                  (this.props[7] = 0),
                  (this.props[8] = 0),
                  (this.props[9] = 0),
                  (this.props[10] = 1),
                  (this.props[11] = 0),
                  (this.props[12] = 0),
                  (this.props[13] = 0),
                  (this.props[14] = 0),
                  (this.props[15] = 1),
                  this
                );
              }
              function n(r) {
                if (0 === r) return this;
                var i = t(r),
                  s = e(r);
                return this._t(i, -s, 0, 0, s, i, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
              }
              function a(r) {
                if (0 === r) return this;
                var i = t(r),
                  s = e(r);
                return this._t(1, 0, 0, 0, 0, i, -s, 0, 0, s, i, 0, 0, 0, 0, 1);
              }
              function o(r) {
                if (0 === r) return this;
                var i = t(r),
                  s = e(r);
                return this._t(i, 0, s, 0, 0, 1, 0, 0, -s, 0, i, 0, 0, 0, 0, 1);
              }
              function h(r) {
                if (0 === r) return this;
                var i = t(r),
                  s = e(r);
                return this._t(i, -s, 0, 0, s, i, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
              }
              function l(t, e) {
                return this._t(1, e, t, 1, 0, 0);
              }
              function p(t, e) {
                return this.shear(r(t), r(e));
              }
              function c(i, s) {
                var n = t(s),
                  a = e(s);
                return this._t(n, a, 0, 0, -a, n, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
                  ._t(1, 0, 0, 0, r(i), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
                  ._t(n, -a, 0, 0, a, n, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
              }
              function f(t, e, r) {
                return (
                  r || 0 === r || (r = 1),
                  1 === t && 1 === e && 1 === r
                    ? this
                    : this._t(t, 0, 0, 0, 0, e, 0, 0, 0, 0, r, 0, 0, 0, 0, 1)
                );
              }
              function d(t, e, r, i, s, n, a, o, h, l, p, c, f, d, u, m) {
                return (
                  (this.props[0] = t),
                  (this.props[1] = e),
                  (this.props[2] = r),
                  (this.props[3] = i),
                  (this.props[4] = s),
                  (this.props[5] = n),
                  (this.props[6] = a),
                  (this.props[7] = o),
                  (this.props[8] = h),
                  (this.props[9] = l),
                  (this.props[10] = p),
                  (this.props[11] = c),
                  (this.props[12] = f),
                  (this.props[13] = d),
                  (this.props[14] = u),
                  (this.props[15] = m),
                  this
                );
              }
              function u(t, e, r) {
                return (
                  (r = r || 0),
                  0 !== t || 0 !== e || 0 !== r
                    ? this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t, e, r, 1)
                    : this
                );
              }
              function m(t, e, r, i, s, n, a, o, h, l, p, c, f, d, u, m) {
                var y = this.props;
                if (
                  1 === t &&
                  0 === e &&
                  0 === r &&
                  0 === i &&
                  0 === s &&
                  1 === n &&
                  0 === a &&
                  0 === o &&
                  0 === h &&
                  0 === l &&
                  1 === p &&
                  0 === c
                )
                  return (
                    (y[12] = y[12] * t + y[15] * f),
                    (y[13] = y[13] * n + y[15] * d),
                    (y[14] = y[14] * p + y[15] * u),
                    (y[15] = y[15] * m),
                    (this._identityCalculated = !1),
                    this
                  );
                var g = y[0],
                  v = y[1],
                  _ = y[2],
                  b = y[3],
                  S = y[4],
                  P = y[5],
                  x = y[6],
                  k = y[7],
                  w = y[8],
                  E = y[9],
                  A = y[10],
                  T = y[11],
                  C = y[12],
                  I = y[13],
                  F = y[14],
                  M = y[15];
                return (
                  (y[0] = g * t + v * s + _ * h + b * f),
                  (y[1] = g * e + v * n + _ * l + b * d),
                  (y[2] = g * r + v * a + _ * p + b * u),
                  (y[3] = g * i + v * o + _ * c + b * m),
                  (y[4] = S * t + P * s + x * h + k * f),
                  (y[5] = S * e + P * n + x * l + k * d),
                  (y[6] = S * r + P * a + x * p + k * u),
                  (y[7] = S * i + P * o + x * c + k * m),
                  (y[8] = w * t + E * s + A * h + T * f),
                  (y[9] = w * e + E * n + A * l + T * d),
                  (y[10] = w * r + E * a + A * p + T * u),
                  (y[11] = w * i + E * o + A * c + T * m),
                  (y[12] = C * t + I * s + F * h + M * f),
                  (y[13] = C * e + I * n + F * l + M * d),
                  (y[14] = C * r + I * a + F * p + M * u),
                  (y[15] = C * i + I * o + F * c + M * m),
                  (this._identityCalculated = !1),
                  this
                );
              }
              function y() {
                return (
                  this._identityCalculated ||
                    ((this._identity = !(
                      1 !== this.props[0] ||
                      0 !== this.props[1] ||
                      0 !== this.props[2] ||
                      0 !== this.props[3] ||
                      0 !== this.props[4] ||
                      1 !== this.props[5] ||
                      0 !== this.props[6] ||
                      0 !== this.props[7] ||
                      0 !== this.props[8] ||
                      0 !== this.props[9] ||
                      1 !== this.props[10] ||
                      0 !== this.props[11] ||
                      0 !== this.props[12] ||
                      0 !== this.props[13] ||
                      0 !== this.props[14] ||
                      1 !== this.props[15]
                    )),
                    (this._identityCalculated = !0)),
                  this._identity
                );
              }
              function g(t) {
                for (var e = 0; e < 16; ) {
                  if (t.props[e] !== this.props[e]) return !1;
                  e += 1;
                }
                return !0;
              }
              function v(t) {
                var e;
                for (e = 0; e < 16; e += 1) t.props[e] = this.props[e];
              }
              function _(t) {
                var e;
                for (e = 0; e < 16; e += 1) this.props[e] = t[e];
              }
              function b(t, e, r) {
                return {
                  x:
                    t * this.props[0] +
                    e * this.props[4] +
                    r * this.props[8] +
                    this.props[12],
                  y:
                    t * this.props[1] +
                    e * this.props[5] +
                    r * this.props[9] +
                    this.props[13],
                  z:
                    t * this.props[2] +
                    e * this.props[6] +
                    r * this.props[10] +
                    this.props[14],
                };
              }
              function S(t, e, r) {
                return (
                  t * this.props[0] +
                  e * this.props[4] +
                  r * this.props[8] +
                  this.props[12]
                );
              }
              function P(t, e, r) {
                return (
                  t * this.props[1] +
                  e * this.props[5] +
                  r * this.props[9] +
                  this.props[13]
                );
              }
              function x(t, e, r) {
                return (
                  t * this.props[2] +
                  e * this.props[6] +
                  r * this.props[10] +
                  this.props[14]
                );
              }
              function k() {
                var t =
                    this.props[0] * this.props[5] -
                    this.props[1] * this.props[4],
                  e = this.props[5] / t,
                  r = -this.props[1] / t,
                  i = -this.props[4] / t,
                  s = this.props[0] / t,
                  n =
                    (this.props[4] * this.props[13] -
                      this.props[5] * this.props[12]) /
                    t,
                  a =
                    -(
                      this.props[0] * this.props[13] -
                      this.props[1] * this.props[12]
                    ) / t,
                  o = new Matrix();
                return (
                  (o.props[0] = e),
                  (o.props[1] = r),
                  (o.props[4] = i),
                  (o.props[5] = s),
                  (o.props[12] = n),
                  (o.props[13] = a),
                  o
                );
              }
              function w(t) {
                return this.getInverseMatrix().applyToPointArray(
                  t[0],
                  t[1],
                  t[2] || 0
                );
              }
              function E(t) {
                var e,
                  r = t.length,
                  i = [];
                for (e = 0; e < r; e += 1) i[e] = w(t[e]);
                return i;
              }
              function A(t, e, r) {
                var i = createTypedArray('float32', 6);
                if (this.isIdentity())
                  (i[0] = t[0]),
                    (i[1] = t[1]),
                    (i[2] = e[0]),
                    (i[3] = e[1]),
                    (i[4] = r[0]),
                    (i[5] = r[1]);
                else {
                  var s = this.props[0],
                    n = this.props[1],
                    a = this.props[4],
                    o = this.props[5],
                    h = this.props[12],
                    l = this.props[13];
                  (i[0] = t[0] * s + t[1] * a + h),
                    (i[1] = t[0] * n + t[1] * o + l),
                    (i[2] = e[0] * s + e[1] * a + h),
                    (i[3] = e[0] * n + e[1] * o + l),
                    (i[4] = r[0] * s + r[1] * a + h),
                    (i[5] = r[0] * n + r[1] * o + l);
                }
                return i;
              }
              function T(t, e, r) {
                return this.isIdentity()
                  ? [t, e, r]
                  : [
                      t * this.props[0] +
                        e * this.props[4] +
                        r * this.props[8] +
                        this.props[12],
                      t * this.props[1] +
                        e * this.props[5] +
                        r * this.props[9] +
                        this.props[13],
                      t * this.props[2] +
                        e * this.props[6] +
                        r * this.props[10] +
                        this.props[14],
                    ];
              }
              function C(t, e) {
                if (this.isIdentity()) return t + ',' + e;
                var r = this.props;
                return (
                  Math.round(100 * (t * r[0] + e * r[4] + r[12])) / 100 +
                  ',' +
                  Math.round(100 * (t * r[1] + e * r[5] + r[13])) / 100
                );
              }
              function I() {
                for (var t = 0, e = this.props, r = 'matrix3d('; t < 16; )
                  (r += i(1e4 * e[t]) / 1e4),
                    (r += 15 === t ? ')' : ','),
                    (t += 1);
                return r;
              }
              function F(t) {
                return (t < 1e-6 && t > 0) || (t > -1e-6 && t < 0)
                  ? i(1e4 * t) / 1e4
                  : t;
              }
              function M() {
                var t = this.props;
                return (
                  'matrix(' +
                  F(t[0]) +
                  ',' +
                  F(t[1]) +
                  ',' +
                  F(t[4]) +
                  ',' +
                  F(t[5]) +
                  ',' +
                  F(t[12]) +
                  ',' +
                  F(t[13]) +
                  ')'
                );
              }
              return function () {
                (this.reset = s),
                  (this.rotate = n),
                  (this.rotateX = a),
                  (this.rotateY = o),
                  (this.rotateZ = h),
                  (this.skew = p),
                  (this.skewFromAxis = c),
                  (this.shear = l),
                  (this.scale = f),
                  (this.setTransform = d),
                  (this.translate = u),
                  (this.transform = m),
                  (this.applyToPoint = b),
                  (this.applyToX = S),
                  (this.applyToY = P),
                  (this.applyToZ = x),
                  (this.applyToPointArray = T),
                  (this.applyToTriplePoints = A),
                  (this.applyToPointStringified = C),
                  (this.toCSS = I),
                  (this.to2dCSS = M),
                  (this.clone = v),
                  (this.cloneFromProps = _),
                  (this.equals = g),
                  (this.inversePoints = E),
                  (this.inversePoint = w),
                  (this.getInverseMatrix = k),
                  (this._t = this.transform),
                  (this.isIdentity = y),
                  (this._identity = !0),
                  (this._identityCalculated = !1),
                  (this.props = createTypedArray('float32', 16)),
                  this.reset();
              };
            })();
          /*!
   Transformation Matrix v2.0
   (c) Epistemex 2014-2015
   www.epistemex.com
   By Ken Fyrstenberg
   Contributions by leeoniya.
   License: MIT, header required.
   */ !(function (t, e) {
            var r = this,
              i = e.pow(256, 6),
              s = e.pow(2, 52),
              n = 2 * s;
            function a(t) {
              var e,
                r = t.length,
                i = this,
                s = 0,
                n = (i.i = i.j = 0),
                a = (i.S = []);
              for (r || (t = [r++]); s < 256; ) a[s] = s++;
              for (s = 0; s < 256; s++)
                (a[s] = a[(n = 255 & (n + t[s % r] + (e = a[s])))]), (a[n] = e);
              i.g = function (t) {
                for (var e, r = 0, s = i.i, n = i.j, a = i.S; t--; )
                  (e = a[(s = 255 & (s + 1))]),
                    (r =
                      256 * r +
                      a[255 & ((a[s] = a[(n = 255 & (n + e))]) + (a[n] = e))]);
                return (i.i = s), (i.j = n), r;
              };
            }
            function o(t, e) {
              return (e.i = t.i), (e.j = t.j), (e.S = t.S.slice()), e;
            }
            function h(t, e) {
              for (var r, i = t + '', s = 0; s < i.length; )
                e[255 & s] = 255 & ((r ^= 19 * e[255 & s]) + i.charCodeAt(s++));
              return l(e);
            }
            function l(t) {
              return String.fromCharCode.apply(0, t);
            }
            (e.seedrandom = function (p, c, f) {
              var d = [],
                u = h(
                  (function t(e, r) {
                    var i,
                      s = [],
                      n = typeof e;
                    if (r && 'object' == n)
                      for (i in e)
                        try {
                          s.push(t(e[i], r - 1));
                        } catch (t) {}
                    return s.length ? s : 'string' == n ? e : e + '\0';
                  })(
                    (c = !0 === c ? { entropy: !0 } : c || {}).entropy
                      ? [p, l(t)]
                      : null === p
                      ? (function () {
                          try {
                            void 0;
                            var e = new Uint8Array(256);
                            return (
                              (r.crypto || r.msCrypto).getRandomValues(e), l(e)
                            );
                          } catch (e) {
                            var i = r.navigator,
                              s = i && i.plugins;
                            return [+new Date(), r, s, r.screen, l(t)];
                          }
                        })()
                      : p,
                    3
                  ),
                  d
                ),
                m = new a(d),
                y = function () {
                  for (var t = m.g(6), e = i, r = 0; t < s; )
                    (t = 256 * (t + r)), (e *= 256), (r = m.g(1));
                  for (; t >= n; ) (t /= 2), (e /= 2), (r >>>= 1);
                  return (t + r) / e;
                };
              return (
                (y.int32 = function () {
                  return 0 | m.g(4);
                }),
                (y.quick = function () {
                  return m.g(4) / 4294967296;
                }),
                (y.double = y),
                h(l(m.S), t),
                (
                  c.pass ||
                  f ||
                  function (t, r, i, s) {
                    return (
                      s &&
                        (s.S && o(s, m),
                        (t.state = function () {
                          return o(m, {});
                        })),
                      i ? ((e.random = t), r) : t
                    );
                  }
                )(y, u, 'global' in c ? c.global : this == e, c.state)
              );
            }),
              h(e.random(), t);
          })([], BMMath);
          var BezierFactory = (function () {
            var t = {
                getBezierEasing: function (t, r, i, s, n) {
                  var a =
                    n ||
                    ('bez_' + t + '_' + r + '_' + i + '_' + s).replace(
                      /\./g,
                      'p'
                    );
                  if (e[a]) return e[a];
                  var o = new h([t, r, i, s]);
                  return (e[a] = o), o;
                },
              },
              e = {};
            var r = 'function' == typeof Float32Array;
            function i(t, e) {
              return 1 - 3 * e + 3 * t;
            }
            function s(t, e) {
              return 3 * e - 6 * t;
            }
            function n(t) {
              return 3 * t;
            }
            function a(t, e, r) {
              return ((i(e, r) * t + s(e, r)) * t + n(e)) * t;
            }
            function o(t, e, r) {
              return 3 * i(e, r) * t * t + 2 * s(e, r) * t + n(e);
            }
            function h(t) {
              (this._p = t),
                (this._mSampleValues = r
                  ? new Float32Array(11)
                  : new Array(11)),
                (this._precomputed = !1),
                (this.get = this.get.bind(this));
            }
            return (
              (h.prototype = {
                get: function (t) {
                  var e = this._p[0],
                    r = this._p[1],
                    i = this._p[2],
                    s = this._p[3];
                  return (
                    this._precomputed || this._precompute(),
                    e === r && i === s
                      ? t
                      : 0 === t
                      ? 0
                      : 1 === t
                      ? 1
                      : a(this._getTForX(t), r, s)
                  );
                },
                _precompute: function () {
                  var t = this._p[0],
                    e = this._p[1],
                    r = this._p[2],
                    i = this._p[3];
                  (this._precomputed = !0),
                    (t === e && r === i) || this._calcSampleValues();
                },
                _calcSampleValues: function () {
                  for (var t = this._p[0], e = this._p[2], r = 0; r < 11; ++r)
                    this._mSampleValues[r] = a(0.1 * r, t, e);
                },
                _getTForX: function (t) {
                  for (
                    var e = this._p[0],
                      r = this._p[2],
                      i = this._mSampleValues,
                      s = 0,
                      n = 1;
                    10 !== n && i[n] <= t;
                    ++n
                  )
                    s += 0.1;
                  var h = s + 0.1 * ((t - i[--n]) / (i[n + 1] - i[n])),
                    l = o(h, e, r);
                  return l >= 0.001
                    ? (function (t, e, r, i) {
                        for (var s = 0; s < 4; ++s) {
                          var n = o(e, r, i);
                          if (0 === n) return e;
                          e -= (a(e, r, i) - t) / n;
                        }
                        return e;
                      })(t, h, e, r)
                    : 0 === l
                    ? h
                    : (function (t, e, r, i, s) {
                        var n,
                          o,
                          h = 0;
                        do {
                          (n = a((o = e + (r - e) / 2), i, s) - t) > 0
                            ? (r = o)
                            : (e = o);
                        } while (Math.abs(n) > 1e-7 && ++h < 10);
                        return o;
                      })(t, s, s + 0.1, e, r);
                },
              }),
              t
            );
          })();
          function extendPrototype(t, e) {
            var r,
              i,
              s = t.length;
            for (r = 0; r < s; r += 1)
              for (var n in (i = t[r].prototype))
                i.hasOwnProperty(n) && (e.prototype[n] = i[n]);
          }
          function getDescriptor(t, e) {
            return Object.getOwnPropertyDescriptor(t, e);
          }
          function createProxyFunction(t) {
            function e() {}
            return (e.prototype = t), e;
          }
          function bezFunction() {
            function t(t, e, r, i, s, n) {
              var a = t * i + e * s + r * n - s * i - n * t - r * e;
              return a > -0.001 && a < 0.001;
            }
            var e = function (t, e, r, i) {
              var s,
                n,
                a,
                o,
                h,
                l,
                p = defaultCurveSegments,
                c = 0,
                f = [],
                d = [],
                u = bezier_length_pool.newElement();
              for (a = r.length, s = 0; s < p; s += 1) {
                for (h = s / (p - 1), l = 0, n = 0; n < a; n += 1)
                  (o =
                    bm_pow(1 - h, 3) * t[n] +
                    3 * bm_pow(1 - h, 2) * h * r[n] +
                    3 * (1 - h) * bm_pow(h, 2) * i[n] +
                    bm_pow(h, 3) * e[n]),
                    (f[n] = o),
                    null !== d[n] && (l += bm_pow(f[n] - d[n], 2)),
                    (d[n] = f[n]);
                l && (c += l = bm_sqrt(l)),
                  (u.percents[s] = h),
                  (u.lengths[s] = c);
              }
              return (u.addedLength = c), u;
            };
            function r(t) {
              (this.segmentLength = 0), (this.points = new Array(t));
            }
            function i(t, e) {
              (this.partialLength = t), (this.point = e);
            }
            var s,
              n =
                ((s = {}),
                function (e, n, a, o) {
                  var h = (
                    e[0] +
                    '_' +
                    e[1] +
                    '_' +
                    n[0] +
                    '_' +
                    n[1] +
                    '_' +
                    a[0] +
                    '_' +
                    a[1] +
                    '_' +
                    o[0] +
                    '_' +
                    o[1]
                  ).replace(/\./g, 'p');
                  if (!s[h]) {
                    var l,
                      p,
                      c,
                      f,
                      d,
                      u,
                      m,
                      y = defaultCurveSegments,
                      g = 0,
                      v = null;
                    2 === e.length &&
                      (e[0] != n[0] || e[1] != n[1]) &&
                      t(e[0], e[1], n[0], n[1], e[0] + a[0], e[1] + a[1]) &&
                      t(e[0], e[1], n[0], n[1], n[0] + o[0], n[1] + o[1]) &&
                      (y = 2);
                    var _ = new r(y);
                    for (c = a.length, l = 0; l < y; l += 1) {
                      for (
                        m = createSizedArray(c), d = l / (y - 1), u = 0, p = 0;
                        p < c;
                        p += 1
                      )
                        (f =
                          bm_pow(1 - d, 3) * e[p] +
                          3 * bm_pow(1 - d, 2) * d * (e[p] + a[p]) +
                          3 * (1 - d) * bm_pow(d, 2) * (n[p] + o[p]) +
                          bm_pow(d, 3) * n[p]),
                          (m[p] = f),
                          null !== v && (u += bm_pow(m[p] - v[p], 2));
                      (g += u = bm_sqrt(u)),
                        (_.points[l] = new i(u, m)),
                        (v = m);
                    }
                    (_.segmentLength = g), (s[h] = _);
                  }
                  return s[h];
                });
            function a(t, e) {
              var r = e.percents,
                i = e.lengths,
                s = r.length,
                n = bm_floor((s - 1) * t),
                a = t * e.addedLength,
                o = 0;
              if (n === s - 1 || 0 === n || a === i[n]) return r[n];
              for (var h = i[n] > a ? -1 : 1, l = !0; l; )
                if (
                  (i[n] <= a && i[n + 1] > a
                    ? ((o = (a - i[n]) / (i[n + 1] - i[n])), (l = !1))
                    : (n += h),
                  n < 0 || n >= s - 1)
                ) {
                  if (n === s - 1) return r[n];
                  l = !1;
                }
              return r[n] + (r[n + 1] - r[n]) * o;
            }
            var o = createTypedArray('float32', 8);
            return {
              getSegmentsLength: function (t) {
                var r,
                  i = segments_length_pool.newElement(),
                  s = t.c,
                  n = t.v,
                  a = t.o,
                  o = t.i,
                  h = t._length,
                  l = i.lengths,
                  p = 0;
                for (r = 0; r < h - 1; r += 1)
                  (l[r] = e(n[r], n[r + 1], a[r], o[r + 1])),
                    (p += l[r].addedLength);
                return (
                  s &&
                    h &&
                    ((l[r] = e(n[r], n[0], a[r], o[0])),
                    (p += l[r].addedLength)),
                  (i.totalLength = p),
                  i
                );
              },
              getNewSegment: function (t, e, r, i, s, n, h) {
                var l,
                  p = a((s = s < 0 ? 0 : s > 1 ? 1 : s), h),
                  c = a((n = n > 1 ? 1 : n), h),
                  f = t.length,
                  d = 1 - p,
                  u = 1 - c,
                  m = d * d * d,
                  y = p * d * d * 3,
                  g = p * p * d * 3,
                  v = p * p * p,
                  _ = d * d * u,
                  b = p * d * u + d * p * u + d * d * c,
                  S = p * p * u + d * p * c + p * d * c,
                  P = p * p * c,
                  x = d * u * u,
                  k = p * u * u + d * c * u + d * u * c,
                  w = p * c * u + d * c * c + p * u * c,
                  E = p * c * c,
                  A = u * u * u,
                  T = c * u * u + u * c * u + u * u * c,
                  C = c * c * u + u * c * c + c * u * c,
                  I = c * c * c;
                for (l = 0; l < f; l += 1)
                  (o[4 * l] =
                    Math.round(
                      1e3 * (m * t[l] + y * r[l] + g * i[l] + v * e[l])
                    ) / 1e3),
                    (o[4 * l + 1] =
                      Math.round(
                        1e3 * (_ * t[l] + b * r[l] + S * i[l] + P * e[l])
                      ) / 1e3),
                    (o[4 * l + 2] =
                      Math.round(
                        1e3 * (x * t[l] + k * r[l] + w * i[l] + E * e[l])
                      ) / 1e3),
                    (o[4 * l + 3] =
                      Math.round(
                        1e3 * (A * t[l] + T * r[l] + C * i[l] + I * e[l])
                      ) / 1e3);
                return o;
              },
              getPointInSegment: function (t, e, r, i, s, n) {
                var o = a(s, n),
                  h = 1 - o;
                return [
                  Math.round(
                    1e3 *
                      (h * h * h * t[0] +
                        (o * h * h + h * o * h + h * h * o) * r[0] +
                        (o * o * h + h * o * o + o * h * o) * i[0] +
                        o * o * o * e[0])
                  ) / 1e3,
                  Math.round(
                    1e3 *
                      (h * h * h * t[1] +
                        (o * h * h + h * o * h + h * h * o) * r[1] +
                        (o * o * h + h * o * o + o * h * o) * i[1] +
                        o * o * o * e[1])
                  ) / 1e3,
                ];
              },
              buildBezierData: n,
              pointOnLine2D: t,
              pointOnLine3D: function (e, r, i, s, n, a, o, h, l) {
                if (0 === i && 0 === a && 0 === l) return t(e, r, s, n, o, h);
                var p,
                  c = Math.sqrt(
                    Math.pow(s - e, 2) + Math.pow(n - r, 2) + Math.pow(a - i, 2)
                  ),
                  f = Math.sqrt(
                    Math.pow(o - e, 2) + Math.pow(h - r, 2) + Math.pow(l - i, 2)
                  ),
                  d = Math.sqrt(
                    Math.pow(o - s, 2) + Math.pow(h - n, 2) + Math.pow(l - a, 2)
                  );
                return (
                  (p =
                    c > f
                      ? c > d
                        ? c - f - d
                        : d - f - c
                      : d > f
                      ? d - f - c
                      : f - c - d) > -1e-4 && p < 1e-4
                );
              },
            };
          }
          !(function () {
            for (
              var t = 0, e = ['ms', 'moz', 'webkit', 'o'], r = 0;
              r < e.length && !window.requestAnimationFrame;
              ++r
            )
              (window.requestAnimationFrame =
                window[e[r] + 'RequestAnimationFrame']),
                (window.cancelAnimationFrame =
                  window[e[r] + 'CancelAnimationFrame'] ||
                  window[e[r] + 'CancelRequestAnimationFrame']);
            window.requestAnimationFrame ||
              (window.requestAnimationFrame = function (e, r) {
                var i = new Date().getTime(),
                  s = Math.max(0, 16 - (i - t)),
                  n = setTimeout(function () {
                    e(i + s);
                  }, s);
                return (t = i + s), n;
              }),
              window.cancelAnimationFrame ||
                (window.cancelAnimationFrame = function (t) {
                  clearTimeout(t);
                });
          })();
          var bez = bezFunction();
          function dataFunctionManager() {
            function t(s, n, a) {
              var o,
                h,
                l,
                c,
                f,
                d,
                u = s.length;
              for (h = 0; h < u; h += 1)
                if ('ks' in (o = s[h]) && !o.completed) {
                  if (
                    ((o.completed = !0),
                    o.tt && (s[h - 1].td = o.tt),
                    o.hasMask)
                  ) {
                    var m = o.masksProperties;
                    for (c = m.length, l = 0; l < c; l += 1)
                      if (m[l].pt.k.i) i(m[l].pt.k);
                      else
                        for (d = m[l].pt.k.length, f = 0; f < d; f += 1)
                          m[l].pt.k[f].s && i(m[l].pt.k[f].s[0]),
                            m[l].pt.k[f].e && i(m[l].pt.k[f].e[0]);
                  }
                  0 === o.ty
                    ? ((o.layers = e(o.refId, n)), t(o.layers, n))
                    : 4 === o.ty
                    ? r(o.shapes)
                    : 5 == o.ty && p(o);
                }
            }
            function e(t, e) {
              for (var r = 0, i = e.length; r < i; ) {
                if (e[r].id === t)
                  return e[r].layers.__used
                    ? JSON.parse(JSON.stringify(e[r].layers))
                    : ((e[r].layers.__used = !0), e[r].layers);
                r += 1;
              }
            }
            function r(t) {
              var e, s, n;
              for (e = t.length - 1; e >= 0; e -= 1)
                if ('sh' == t[e].ty)
                  if (t[e].ks.k.i) i(t[e].ks.k);
                  else
                    for (n = t[e].ks.k.length, s = 0; s < n; s += 1)
                      t[e].ks.k[s].s && i(t[e].ks.k[s].s[0]),
                        t[e].ks.k[s].e && i(t[e].ks.k[s].e[0]);
                else 'gr' == t[e].ty && r(t[e].it);
            }
            function i(t) {
              var e,
                r = t.i.length;
              for (e = 0; e < r; e += 1)
                (t.i[e][0] += t.v[e][0]),
                  (t.i[e][1] += t.v[e][1]),
                  (t.o[e][0] += t.v[e][0]),
                  (t.o[e][1] += t.v[e][1]);
            }
            function s(t, e) {
              var r = e ? e.split('.') : [100, 100, 100];
              return (
                t[0] > r[0] ||
                (!(r[0] > t[0]) &&
                  (t[1] > r[1] ||
                    (!(r[1] > t[1]) &&
                      (t[2] > r[2] || (!(r[2] > t[2]) && void 0)))))
              );
            }
            var n,
              a = (function () {
                var t = [4, 4, 14];
                function e(t) {
                  var e,
                    r,
                    i,
                    s = t.length;
                  for (e = 0; e < s; e += 1)
                    5 === t[e].ty &&
                      ((r = t[e]),
                      (i = void 0),
                      (i = r.t.d),
                      (r.t.d = { k: [{ s: i, t: 0 }] }));
                }
                return function (r) {
                  if (s(t, r.v) && (e(r.layers), r.assets)) {
                    var i,
                      n = r.assets.length;
                    for (i = 0; i < n; i += 1)
                      r.assets[i].layers && e(r.assets[i].layers);
                  }
                };
              })(),
              o =
                ((n = [4, 7, 99]),
                function (t) {
                  if (t.chars && !s(n, t.v)) {
                    var e,
                      r,
                      a,
                      o,
                      h,
                      l = t.chars.length;
                    for (e = 0; e < l; e += 1)
                      if (t.chars[e].data && t.chars[e].data.shapes)
                        for (
                          a = (h = t.chars[e].data.shapes[0].it).length, r = 0;
                          r < a;
                          r += 1
                        )
                          (o = h[r].ks.k).__converted ||
                            (i(h[r].ks.k), (o.__converted = !0));
                  }
                }),
              h = (function () {
                var t = [4, 1, 9];
                function e(t) {
                  var r,
                    i,
                    s,
                    n = t.length;
                  for (r = 0; r < n; r += 1)
                    if ('gr' === t[r].ty) e(t[r].it);
                    else if ('fl' === t[r].ty || 'st' === t[r].ty)
                      if (t[r].c.k && t[r].c.k[0].i)
                        for (s = t[r].c.k.length, i = 0; i < s; i += 1)
                          t[r].c.k[i].s &&
                            ((t[r].c.k[i].s[0] /= 255),
                            (t[r].c.k[i].s[1] /= 255),
                            (t[r].c.k[i].s[2] /= 255),
                            (t[r].c.k[i].s[3] /= 255)),
                            t[r].c.k[i].e &&
                              ((t[r].c.k[i].e[0] /= 255),
                              (t[r].c.k[i].e[1] /= 255),
                              (t[r].c.k[i].e[2] /= 255),
                              (t[r].c.k[i].e[3] /= 255));
                      else
                        (t[r].c.k[0] /= 255),
                          (t[r].c.k[1] /= 255),
                          (t[r].c.k[2] /= 255),
                          (t[r].c.k[3] /= 255);
                }
                function r(t) {
                  var r,
                    i = t.length;
                  for (r = 0; r < i; r += 1) 4 === t[r].ty && e(t[r].shapes);
                }
                return function (e) {
                  if (s(t, e.v) && (r(e.layers), e.assets)) {
                    var i,
                      n = e.assets.length;
                    for (i = 0; i < n; i += 1)
                      e.assets[i].layers && r(e.assets[i].layers);
                  }
                };
              })(),
              l = (function () {
                var t = [4, 4, 18];
                function e(t) {
                  var r, i, s;
                  for (r = t.length - 1; r >= 0; r -= 1)
                    if ('sh' == t[r].ty)
                      if (t[r].ks.k.i) t[r].ks.k.c = t[r].closed;
                      else
                        for (s = t[r].ks.k.length, i = 0; i < s; i += 1)
                          t[r].ks.k[i].s && (t[r].ks.k[i].s[0].c = t[r].closed),
                            t[r].ks.k[i].e &&
                              (t[r].ks.k[i].e[0].c = t[r].closed);
                    else 'gr' == t[r].ty && e(t[r].it);
                }
                function r(t) {
                  var r,
                    i,
                    s,
                    n,
                    a,
                    o,
                    h = t.length;
                  for (i = 0; i < h; i += 1) {
                    if ((r = t[i]).hasMask) {
                      var l = r.masksProperties;
                      for (n = l.length, s = 0; s < n; s += 1)
                        if (l[s].pt.k.i) l[s].pt.k.c = l[s].cl;
                        else
                          for (o = l[s].pt.k.length, a = 0; a < o; a += 1)
                            l[s].pt.k[a].s && (l[s].pt.k[a].s[0].c = l[s].cl),
                              l[s].pt.k[a].e && (l[s].pt.k[a].e[0].c = l[s].cl);
                    }
                    4 === r.ty && e(r.shapes);
                  }
                }
                return function (e) {
                  if (s(t, e.v) && (r(e.layers), e.assets)) {
                    var i,
                      n = e.assets.length;
                    for (i = 0; i < n; i += 1)
                      e.assets[i].layers && r(e.assets[i].layers);
                  }
                };
              })();
            function p(t, e) {
              0 !== t.t.a.length || 'm' in t.t.p || (t.singleShape = !0);
            }
            var c = {
              completeData: function (e, r) {
                e.__complete ||
                  (h(e),
                  a(e),
                  o(e),
                  l(e),
                  t(e.layers, e.assets),
                  (e.__complete = !0));
              },
            };
            return (
              (c.checkColors = h),
              (c.checkChars = o),
              (c.checkShapes = l),
              (c.completeLayers = t),
              c
            );
          }
          var dataManager = dataFunctionManager(),
            FontManager = (function () {
              var t = { w: 0, size: 0, shapes: [] },
                e = [];
              function r(t, e) {
                var r = createTag('span');
                r.style.fontFamily = e;
                var i = createTag('span');
                (i.innerHTML = 'giItT1WQy@!-/#'),
                  (r.style.position = 'absolute'),
                  (r.style.left = '-10000px'),
                  (r.style.top = '-10000px'),
                  (r.style.fontSize = '300px'),
                  (r.style.fontVariant = 'normal'),
                  (r.style.fontStyle = 'normal'),
                  (r.style.fontWeight = 'normal'),
                  (r.style.letterSpacing = '0'),
                  r.appendChild(i),
                  document.body.appendChild(r);
                var s = i.offsetWidth;
                return (
                  (i.style.fontFamily =
                    (function (t) {
                      var e,
                        r = t.split(','),
                        i = r.length,
                        s = [];
                      for (e = 0; e < i; e += 1)
                        'sans-serif' !== r[e] &&
                          'monospace' !== r[e] &&
                          s.push(r[e]);
                      return s.join(',');
                    })(t) +
                    ', ' +
                    e),
                  { node: i, w: s, parent: r }
                );
              }
              function i(t, e) {
                var r = createNS('text');
                return (
                  (r.style.fontSize = '100px'),
                  r.setAttribute('font-family', e.fFamily),
                  r.setAttribute('font-style', e.fStyle),
                  r.setAttribute('font-weight', e.fWeight),
                  (r.textContent = '1'),
                  e.fClass
                    ? ((r.style.fontFamily = 'inherit'),
                      r.setAttribute('class', e.fClass))
                    : (r.style.fontFamily = e.fFamily),
                  t.appendChild(r),
                  (createTag('canvas').getContext('2d').font =
                    e.fWeight + ' ' + e.fStyle + ' 100px ' + e.fFamily),
                  r
                );
              }
              e = e.concat([
                2304, 2305, 2306, 2307, 2362, 2363, 2364, 2364, 2366, 2367,
                2368, 2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377,
                2378, 2379, 2380, 2381, 2382, 2383, 2387, 2388, 2389, 2390,
                2391, 2402, 2403,
              ]);
              var s = function () {
                (this.fonts = []),
                  (this.chars = null),
                  (this.typekitLoaded = 0),
                  (this.isLoaded = !1),
                  (this.initTime = Date.now()),
                  (this.setIsLoadedBinded = this.setIsLoaded.bind(this)),
                  (this.checkLoadedFontsBinded =
                    this.checkLoadedFonts.bind(this));
              };
              return (
                (s.getCombinedCharacterCodes = function () {
                  return e;
                }),
                (s.prototype = {
                  addChars: function (t) {
                    if (t) {
                      this.chars || (this.chars = []);
                      var e,
                        r,
                        i,
                        s = t.length,
                        n = this.chars.length;
                      for (e = 0; e < s; e += 1) {
                        for (r = 0, i = !1; r < n; )
                          this.chars[r].style === t[e].style &&
                            this.chars[r].fFamily === t[e].fFamily &&
                            this.chars[r].ch === t[e].ch &&
                            (i = !0),
                            (r += 1);
                        i || (this.chars.push(t[e]), (n += 1));
                      }
                    }
                  },
                  addFonts: function (t, e) {
                    if (t) {
                      if (this.chars)
                        return (this.isLoaded = !0), void (this.fonts = t.list);
                      var s,
                        n = t.list,
                        a = n.length,
                        o = a;
                      for (s = 0; s < a; s += 1) {
                        var h,
                          l,
                          p = !0;
                        if (
                          ((n[s].loaded = !1),
                          (n[s].monoCase = r(n[s].fFamily, 'monospace')),
                          (n[s].sansCase = r(n[s].fFamily, 'sans-serif')),
                          n[s].fPath)
                        ) {
                          if ('p' === n[s].fOrigin || 3 === n[s].origin) {
                            if (
                              ((h = document.querySelectorAll(
                                'style[f-forigin="p"][f-family="' +
                                  n[s].fFamily +
                                  '"], style[f-origin="3"][f-family="' +
                                  n[s].fFamily +
                                  '"]'
                              )).length > 0 && (p = !1),
                              p)
                            ) {
                              var c = createTag('style');
                              c.setAttribute('f-forigin', n[s].fOrigin),
                                c.setAttribute('f-origin', n[s].origin),
                                c.setAttribute('f-family', n[s].fFamily),
                                (c.type = 'text/css'),
                                (c.innerHTML =
                                  '@font-face {font-family: ' +
                                  n[s].fFamily +
                                  "; font-style: normal; src: url('" +
                                  n[s].fPath +
                                  "');}"),
                                e.appendChild(c);
                            }
                          } else if (
                            'g' === n[s].fOrigin ||
                            1 === n[s].origin
                          ) {
                            for (
                              h = document.querySelectorAll(
                                'link[f-forigin="g"], link[f-origin="1"]'
                              ),
                                l = 0;
                              l < h.length;
                              l++
                            )
                              -1 !== h[l].href.indexOf(n[s].fPath) && (p = !1);
                            if (p) {
                              var f = createTag('link');
                              f.setAttribute('f-forigin', n[s].fOrigin),
                                f.setAttribute('f-origin', n[s].origin),
                                (f.type = 'text/css'),
                                (f.rel = 'stylesheet'),
                                (f.href = n[s].fPath),
                                document.body.appendChild(f);
                            }
                          } else if (
                            't' === n[s].fOrigin ||
                            2 === n[s].origin
                          ) {
                            for (
                              h = document.querySelectorAll(
                                'script[f-forigin="t"], script[f-origin="2"]'
                              ),
                                l = 0;
                              l < h.length;
                              l++
                            )
                              n[s].fPath === h[l].src && (p = !1);
                            if (p) {
                              var d = createTag('link');
                              d.setAttribute('f-forigin', n[s].fOrigin),
                                d.setAttribute('f-origin', n[s].origin),
                                d.setAttribute('rel', 'stylesheet'),
                                d.setAttribute('href', n[s].fPath),
                                e.appendChild(d);
                            }
                          }
                        } else (n[s].loaded = !0), (o -= 1);
                        (n[s].helper = i(e, n[s])),
                          (n[s].cache = {}),
                          this.fonts.push(n[s]);
                      }
                      0 === o
                        ? (this.isLoaded = !0)
                        : setTimeout(this.checkLoadedFonts.bind(this), 100);
                    } else this.isLoaded = !0;
                  },
                  getCharData: function (e, r, i) {
                    for (var s = 0, n = this.chars.length; s < n; ) {
                      if (
                        this.chars[s].ch === e &&
                        this.chars[s].style === r &&
                        this.chars[s].fFamily === i
                      )
                        return this.chars[s];
                      s += 1;
                    }
                    return (
                      (('string' == typeof e && 13 !== e.charCodeAt(0)) ||
                        !e) &&
                        console &&
                        console.warn &&
                        console.warn(
                          'Missing character from exported characters list: ',
                          e,
                          r,
                          i
                        ),
                      t
                    );
                  },
                  getFontByName: function (t) {
                    for (var e = 0, r = this.fonts.length; e < r; ) {
                      if (this.fonts[e].fName === t) return this.fonts[e];
                      e += 1;
                    }
                    return this.fonts[0];
                  },
                  measureText: function (t, e, r) {
                    var i = this.getFontByName(e),
                      s = t.charCodeAt(0);
                    if (!i.cache[s + 1]) {
                      var n = i.helper;
                      if (' ' === t) {
                        n.textContent = '|' + t + '|';
                        var a = n.getComputedTextLength();
                        n.textContent = '||';
                        var o = n.getComputedTextLength();
                        i.cache[s + 1] = (a - o) / 100;
                      } else
                        (n.textContent = t),
                          (i.cache[s + 1] = n.getComputedTextLength() / 100);
                    }
                    return i.cache[s + 1] * r;
                  },
                  checkLoadedFonts: function () {
                    var t,
                      e,
                      r,
                      i = this.fonts.length,
                      s = i;
                    for (t = 0; t < i; t += 1)
                      this.fonts[t].loaded
                        ? (s -= 1)
                        : 'n' === this.fonts[t].fOrigin ||
                          0 === this.fonts[t].origin
                        ? (this.fonts[t].loaded = !0)
                        : ((e = this.fonts[t].monoCase.node),
                          (r = this.fonts[t].monoCase.w),
                          e.offsetWidth !== r
                            ? ((s -= 1), (this.fonts[t].loaded = !0))
                            : ((e = this.fonts[t].sansCase.node),
                              (r = this.fonts[t].sansCase.w),
                              e.offsetWidth !== r &&
                                ((s -= 1), (this.fonts[t].loaded = !0))),
                          this.fonts[t].loaded &&
                            (this.fonts[
                              t
                            ].sansCase.parent.parentNode.removeChild(
                              this.fonts[t].sansCase.parent
                            ),
                            this.fonts[
                              t
                            ].monoCase.parent.parentNode.removeChild(
                              this.fonts[t].monoCase.parent
                            )));
                    0 !== s && Date.now() - this.initTime < 5e3
                      ? setTimeout(this.checkLoadedFontsBinded, 20)
                      : setTimeout(this.setIsLoadedBinded, 10);
                  },
                  setIsLoaded: function () {
                    this.isLoaded = !0;
                  },
                }),
                s
              );
            })(),
            PropertyFactory = (function () {
              var t = initialDefaultFrame,
                e = Math.abs;
              function r(t, e) {
                var r,
                  s = this.offsetTime;
                'multidimensional' === this.propType &&
                  (r = createTypedArray('float32', this.pv.length));
                for (
                  var n,
                    a,
                    o,
                    h,
                    l,
                    p,
                    c,
                    f,
                    d = e.lastIndex,
                    u = d,
                    m = this.keyframes.length - 1,
                    y = !0;
                  y;

                ) {
                  if (
                    ((n = this.keyframes[u]),
                    (a = this.keyframes[u + 1]),
                    u === m - 1 && t >= a.t - s)
                  ) {
                    n.h && (n = a), (d = 0);
                    break;
                  }
                  if (a.t - s > t) {
                    d = u;
                    break;
                  }
                  u < m - 1 ? (u += 1) : ((d = 0), (y = !1));
                }
                var g,
                  v = a.t - s,
                  _ = n.t - s;
                if (n.to) {
                  n.bezierData ||
                    (n.bezierData = bez.buildBezierData(
                      n.s,
                      a.s || n.e,
                      n.to,
                      n.ti
                    ));
                  var b = n.bezierData;
                  if (t >= v || t < _) {
                    var S = t >= v ? b.points.length - 1 : 0;
                    for (h = b.points[S].point.length, o = 0; o < h; o += 1)
                      r[o] = b.points[S].point[o];
                  } else {
                    n.__fnct
                      ? (f = n.__fnct)
                      : ((f = BezierFactory.getBezierEasing(
                          n.o.x,
                          n.o.y,
                          n.i.x,
                          n.i.y,
                          n.n
                        ).get),
                        (n.__fnct = f)),
                      (l = f((t - _) / (v - _)));
                    var P,
                      x = b.segmentLength * l,
                      k =
                        e.lastFrame < t && e._lastKeyframeIndex === u
                          ? e._lastAddedLength
                          : 0;
                    for (
                      c =
                        e.lastFrame < t && e._lastKeyframeIndex === u
                          ? e._lastPoint
                          : 0,
                        y = !0,
                        p = b.points.length;
                      y;

                    ) {
                      if (
                        ((k += b.points[c].partialLength),
                        0 === x || 0 === l || c === b.points.length - 1)
                      ) {
                        for (h = b.points[c].point.length, o = 0; o < h; o += 1)
                          r[o] = b.points[c].point[o];
                        break;
                      }
                      if (x >= k && x < k + b.points[c + 1].partialLength) {
                        for (
                          P = (x - k) / b.points[c + 1].partialLength,
                            h = b.points[c].point.length,
                            o = 0;
                          o < h;
                          o += 1
                        )
                          r[o] =
                            b.points[c].point[o] +
                            (b.points[c + 1].point[o] - b.points[c].point[o]) *
                              P;
                        break;
                      }
                      c < p - 1 ? (c += 1) : (y = !1);
                    }
                    (e._lastPoint = c),
                      (e._lastAddedLength = k - b.points[c].partialLength),
                      (e._lastKeyframeIndex = u);
                  }
                } else {
                  var w, E, A, T, C;
                  if (
                    ((m = n.s.length), (g = a.s || n.e), this.sh && 1 !== n.h)
                  )
                    if (t >= v) (r[0] = g[0]), (r[1] = g[1]), (r[2] = g[2]);
                    else if (t <= _)
                      (r[0] = n.s[0]), (r[1] = n.s[1]), (r[2] = n.s[2]);
                    else {
                      !(function (t, e) {
                        var r = e[0],
                          i = e[1],
                          s = e[2],
                          n = e[3],
                          a = Math.atan2(
                            2 * i * n - 2 * r * s,
                            1 - 2 * i * i - 2 * s * s
                          ),
                          o = Math.asin(2 * r * i + 2 * s * n),
                          h = Math.atan2(
                            2 * r * n - 2 * i * s,
                            1 - 2 * r * r - 2 * s * s
                          );
                        (t[0] = a / degToRads),
                          (t[1] = o / degToRads),
                          (t[2] = h / degToRads);
                      })(
                        r,
                        (function (t, e, r) {
                          var i,
                            s,
                            n,
                            a,
                            o,
                            h = [],
                            l = t[0],
                            p = t[1],
                            c = t[2],
                            f = t[3],
                            d = e[0],
                            u = e[1],
                            m = e[2],
                            y = e[3];
                          (s = l * d + p * u + c * m + f * y) < 0 &&
                            ((s = -s), (d = -d), (u = -u), (m = -m), (y = -y));
                          1 - s > 1e-6
                            ? ((i = Math.acos(s)),
                              (n = Math.sin(i)),
                              (a = Math.sin((1 - r) * i) / n),
                              (o = Math.sin(r * i) / n))
                            : ((a = 1 - r), (o = r));
                          return (
                            (h[0] = a * l + o * d),
                            (h[1] = a * p + o * u),
                            (h[2] = a * c + o * m),
                            (h[3] = a * f + o * y),
                            h
                          );
                        })(i(n.s), i(g), (t - _) / (v - _))
                      );
                    }
                  else
                    for (u = 0; u < m; u += 1)
                      1 !== n.h &&
                        (t >= v
                          ? (l = 1)
                          : t < _
                          ? (l = 0)
                          : (n.o.x.constructor === Array
                              ? (n.__fnct || (n.__fnct = []),
                                n.__fnct[u]
                                  ? (f = n.__fnct[u])
                                  : ((w =
                                      void 0 === n.o.x[u]
                                        ? n.o.x[0]
                                        : n.o.x[u]),
                                    (E =
                                      void 0 === n.o.y[u]
                                        ? n.o.y[0]
                                        : n.o.y[u]),
                                    (A =
                                      void 0 === n.i.x[u]
                                        ? n.i.x[0]
                                        : n.i.x[u]),
                                    (T =
                                      void 0 === n.i.y[u]
                                        ? n.i.y[0]
                                        : n.i.y[u]),
                                    (f = BezierFactory.getBezierEasing(
                                      w,
                                      E,
                                      A,
                                      T
                                    ).get),
                                    (n.__fnct[u] = f)))
                              : n.__fnct
                              ? (f = n.__fnct)
                              : ((w = n.o.x),
                                (E = n.o.y),
                                (A = n.i.x),
                                (T = n.i.y),
                                (f = BezierFactory.getBezierEasing(
                                  w,
                                  E,
                                  A,
                                  T
                                ).get),
                                (n.__fnct = f)),
                            (l = f((t - _) / (v - _))))),
                        (g = a.s || n.e),
                        (C = 1 === n.h ? n.s[u] : n.s[u] + (g[u] - n.s[u]) * l),
                        'multidimensional' === this.propType
                          ? (r[u] = C)
                          : (r = C);
                }
                return (e.lastIndex = d), r;
              }
              function i(t) {
                var e = t[0] * degToRads,
                  r = t[1] * degToRads,
                  i = t[2] * degToRads,
                  s = Math.cos(e / 2),
                  n = Math.cos(r / 2),
                  a = Math.cos(i / 2),
                  o = Math.sin(e / 2),
                  h = Math.sin(r / 2),
                  l = Math.sin(i / 2);
                return [
                  o * h * a + s * n * l,
                  o * n * a + s * h * l,
                  s * h * a - o * n * l,
                  s * n * a - o * h * l,
                ];
              }
              function s() {
                var e = this.comp.renderedFrame - this.offsetTime,
                  r = this.keyframes[0].t - this.offsetTime,
                  i =
                    this.keyframes[this.keyframes.length - 1].t -
                    this.offsetTime;
                if (
                  !(
                    e === this._caching.lastFrame ||
                    (this._caching.lastFrame !== t &&
                      ((this._caching.lastFrame >= i && e >= i) ||
                        (this._caching.lastFrame < r && e < r)))
                  )
                ) {
                  this._caching.lastFrame >= e &&
                    ((this._caching._lastKeyframeIndex = -1),
                    (this._caching.lastIndex = 0));
                  var s = this.interpolateValue(e, this._caching);
                  this.pv = s;
                }
                return (this._caching.lastFrame = e), this.pv;
              }
              function n(t) {
                var r;
                if ('unidimensional' === this.propType)
                  (r = t * this.mult),
                    e(this.v - r) > 1e-5 && ((this.v = r), (this._mdf = !0));
                else
                  for (var i = 0, s = this.v.length; i < s; )
                    (r = t[i] * this.mult),
                      e(this.v[i] - r) > 1e-5 &&
                        ((this.v[i] = r), (this._mdf = !0)),
                      (i += 1);
              }
              function a() {
                if (
                  this.elem.globalData.frameId !== this.frameId &&
                  this.effectsSequence.length
                )
                  if (this.lock) this.setVValue(this.pv);
                  else {
                    (this.lock = !0), (this._mdf = this._isFirstFrame);
                    var t,
                      e = this.effectsSequence.length,
                      r = this.kf ? this.pv : this.data.k;
                    for (t = 0; t < e; t += 1) r = this.effectsSequence[t](r);
                    this.setVValue(r),
                      (this._isFirstFrame = !1),
                      (this.lock = !1),
                      (this.frameId = this.elem.globalData.frameId);
                  }
              }
              function o(t) {
                this.effectsSequence.push(t),
                  this.container.addDynamicProperty(this);
              }
              function h(t, e, r, i) {
                (this.propType = 'unidimensional'),
                  (this.mult = r || 1),
                  (this.data = e),
                  (this.v = r ? e.k * r : e.k),
                  (this.pv = e.k),
                  (this._mdf = !1),
                  (this.elem = t),
                  (this.container = i),
                  (this.comp = t.comp),
                  (this.k = !1),
                  (this.kf = !1),
                  (this.vel = 0),
                  (this.effectsSequence = []),
                  (this._isFirstFrame = !0),
                  (this.getValue = a),
                  (this.setVValue = n),
                  (this.addEffect = o);
              }
              function l(t, e, r, i) {
                (this.propType = 'multidimensional'),
                  (this.mult = r || 1),
                  (this.data = e),
                  (this._mdf = !1),
                  (this.elem = t),
                  (this.container = i),
                  (this.comp = t.comp),
                  (this.k = !1),
                  (this.kf = !1),
                  (this.frameId = -1);
                var s,
                  h = e.k.length;
                (this.v = createTypedArray('float32', h)),
                  (this.pv = createTypedArray('float32', h));
                createTypedArray('float32', h);
                for (
                  this.vel = createTypedArray('float32', h), s = 0;
                  s < h;
                  s += 1
                )
                  (this.v[s] = e.k[s] * this.mult), (this.pv[s] = e.k[s]);
                (this._isFirstFrame = !0),
                  (this.effectsSequence = []),
                  (this.getValue = a),
                  (this.setVValue = n),
                  (this.addEffect = o);
              }
              function p(e, i, h, l) {
                (this.propType = 'unidimensional'),
                  (this.keyframes = i.k),
                  (this.offsetTime = e.data.st),
                  (this.frameId = -1),
                  (this._caching = {
                    lastFrame: t,
                    lastIndex: 0,
                    value: 0,
                    _lastKeyframeIndex: -1,
                  }),
                  (this.k = !0),
                  (this.kf = !0),
                  (this.data = i),
                  (this.mult = h || 1),
                  (this.elem = e),
                  (this.container = l),
                  (this.comp = e.comp),
                  (this.v = t),
                  (this.pv = t),
                  (this._isFirstFrame = !0),
                  (this.getValue = a),
                  (this.setVValue = n),
                  (this.interpolateValue = r),
                  (this.effectsSequence = [s.bind(this)]),
                  (this.addEffect = o);
              }
              function c(e, i, h, l) {
                this.propType = 'multidimensional';
                var p,
                  c,
                  f,
                  d,
                  u,
                  m = i.k.length;
                for (p = 0; p < m - 1; p += 1)
                  i.k[p].to &&
                    i.k[p].s &&
                    i.k[p + 1] &&
                    i.k[p + 1].s &&
                    ((c = i.k[p].s),
                    (f = i.k[p + 1].s),
                    (d = i.k[p].to),
                    (u = i.k[p].ti),
                    ((2 === c.length &&
                      (c[0] !== f[0] || c[1] !== f[1]) &&
                      bez.pointOnLine2D(
                        c[0],
                        c[1],
                        f[0],
                        f[1],
                        c[0] + d[0],
                        c[1] + d[1]
                      ) &&
                      bez.pointOnLine2D(
                        c[0],
                        c[1],
                        f[0],
                        f[1],
                        f[0] + u[0],
                        f[1] + u[1]
                      )) ||
                      (3 === c.length &&
                        (c[0] !== f[0] || c[1] !== f[1] || c[2] !== f[2]) &&
                        bez.pointOnLine3D(
                          c[0],
                          c[1],
                          c[2],
                          f[0],
                          f[1],
                          f[2],
                          c[0] + d[0],
                          c[1] + d[1],
                          c[2] + d[2]
                        ) &&
                        bez.pointOnLine3D(
                          c[0],
                          c[1],
                          c[2],
                          f[0],
                          f[1],
                          f[2],
                          f[0] + u[0],
                          f[1] + u[1],
                          f[2] + u[2]
                        ))) &&
                      ((i.k[p].to = null), (i.k[p].ti = null)),
                    c[0] === f[0] &&
                      c[1] === f[1] &&
                      0 === d[0] &&
                      0 === d[1] &&
                      0 === u[0] &&
                      0 === u[1] &&
                      (2 === c.length ||
                        (c[2] === f[2] && 0 === d[2] && 0 === u[2])) &&
                      ((i.k[p].to = null), (i.k[p].ti = null)));
                (this.effectsSequence = [s.bind(this)]),
                  (this.keyframes = i.k),
                  (this.offsetTime = e.data.st),
                  (this.k = !0),
                  (this.kf = !0),
                  (this._isFirstFrame = !0),
                  (this.mult = h || 1),
                  (this.elem = e),
                  (this.container = l),
                  (this.comp = e.comp),
                  (this.getValue = a),
                  (this.setVValue = n),
                  (this.interpolateValue = r),
                  (this.frameId = -1);
                var y = i.k[0].s.length;
                for (
                  this.v = createTypedArray('float32', y),
                    this.pv = createTypedArray('float32', y),
                    p = 0;
                  p < y;
                  p += 1
                )
                  (this.v[p] = t), (this.pv[p] = t);
                (this._caching = {
                  lastFrame: t,
                  lastIndex: 0,
                  value: createTypedArray('float32', y),
                }),
                  (this.addEffect = o);
              }
              return {
                getProp: function (t, e, r, i, s) {
                  var n;
                  if (e.k.length)
                    if ('number' == typeof e.k[0]) n = new l(t, e, i, s);
                    else
                      switch (r) {
                        case 0:
                          n = new p(t, e, i, s);
                          break;
                        case 1:
                          n = new c(t, e, i, s);
                      }
                  else n = new h(t, e, i, s);
                  return n.effectsSequence.length && s.addDynamicProperty(n), n;
                },
              };
            })(),
            TransformPropertyFactory = (function () {
              var t = [0, 0];
              function e(t, e, r) {
                if (
                  ((this.elem = t),
                  (this.frameId = -1),
                  (this.propType = 'transform'),
                  (this.data = e),
                  (this.v = new Matrix()),
                  (this.pre = new Matrix()),
                  (this.appliedTransformations = 0),
                  this.initDynamicPropertyContainer(r || t),
                  e.p && e.p.s
                    ? ((this.px = PropertyFactory.getProp(
                        t,
                        e.p.x,
                        0,
                        0,
                        this
                      )),
                      (this.py = PropertyFactory.getProp(t, e.p.y, 0, 0, this)),
                      e.p.z &&
                        (this.pz = PropertyFactory.getProp(
                          t,
                          e.p.z,
                          0,
                          0,
                          this
                        )))
                    : (this.p = PropertyFactory.getProp(
                        t,
                        e.p || { k: [0, 0, 0] },
                        1,
                        0,
                        this
                      )),
                  e.rx)
                ) {
                  if (
                    ((this.rx = PropertyFactory.getProp(
                      t,
                      e.rx,
                      0,
                      degToRads,
                      this
                    )),
                    (this.ry = PropertyFactory.getProp(
                      t,
                      e.ry,
                      0,
                      degToRads,
                      this
                    )),
                    (this.rz = PropertyFactory.getProp(
                      t,
                      e.rz,
                      0,
                      degToRads,
                      this
                    )),
                    e.or.k[0].ti)
                  ) {
                    var i,
                      s = e.or.k.length;
                    for (i = 0; i < s; i += 1)
                      e.or.k[i].to = e.or.k[i].ti = null;
                  }
                  (this.or = PropertyFactory.getProp(
                    t,
                    e.or,
                    1,
                    degToRads,
                    this
                  )),
                    (this.or.sh = !0);
                } else
                  this.r = PropertyFactory.getProp(
                    t,
                    e.r || { k: 0 },
                    0,
                    degToRads,
                    this
                  );
                e.sk &&
                  ((this.sk = PropertyFactory.getProp(
                    t,
                    e.sk,
                    0,
                    degToRads,
                    this
                  )),
                  (this.sa = PropertyFactory.getProp(
                    t,
                    e.sa,
                    0,
                    degToRads,
                    this
                  ))),
                  (this.a = PropertyFactory.getProp(
                    t,
                    e.a || { k: [0, 0, 0] },
                    1,
                    0,
                    this
                  )),
                  (this.s = PropertyFactory.getProp(
                    t,
                    e.s || { k: [100, 100, 100] },
                    1,
                    0.01,
                    this
                  )),
                  e.o
                    ? (this.o = PropertyFactory.getProp(t, e.o, 0, 0.01, t))
                    : (this.o = { _mdf: !1, v: 1 }),
                  (this._isDirty = !0),
                  this.dynamicProperties.length || this.getValue(!0);
              }
              return (
                (e.prototype = {
                  applyToMatrix: function (t) {
                    var e = this._mdf;
                    this.iterateDynamicProperties(),
                      (this._mdf = this._mdf || e),
                      this.a &&
                        t.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
                      this.s && t.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                      this.sk && t.skewFromAxis(-this.sk.v, this.sa.v),
                      this.r
                        ? t.rotate(-this.r.v)
                        : t
                            .rotateZ(-this.rz.v)
                            .rotateY(this.ry.v)
                            .rotateX(this.rx.v)
                            .rotateZ(-this.or.v[2])
                            .rotateY(this.or.v[1])
                            .rotateX(this.or.v[0]),
                      this.data.p.s
                        ? this.data.p.z
                          ? t.translate(this.px.v, this.py.v, -this.pz.v)
                          : t.translate(this.px.v, this.py.v, 0)
                        : t.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
                  },
                  getValue: function (e) {
                    if (this.elem.globalData.frameId !== this.frameId) {
                      if (
                        (this._isDirty &&
                          (this.precalculateMatrix(), (this._isDirty = !1)),
                        this.iterateDynamicProperties(),
                        this._mdf || e)
                      ) {
                        if (
                          (this.v.cloneFromProps(this.pre.props),
                          this.appliedTransformations < 1 &&
                            this.v.translate(
                              -this.a.v[0],
                              -this.a.v[1],
                              this.a.v[2]
                            ),
                          this.appliedTransformations < 2 &&
                            this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                          this.sk &&
                            this.appliedTransformations < 3 &&
                            this.v.skewFromAxis(-this.sk.v, this.sa.v),
                          this.r && this.appliedTransformations < 4
                            ? this.v.rotate(-this.r.v)
                            : !this.r &&
                              this.appliedTransformations < 4 &&
                              this.v
                                .rotateZ(-this.rz.v)
                                .rotateY(this.ry.v)
                                .rotateX(this.rx.v)
                                .rotateZ(-this.or.v[2])
                                .rotateY(this.or.v[1])
                                .rotateX(this.or.v[0]),
                          this.autoOriented)
                        ) {
                          var r,
                            i,
                            s = this.elem.globalData.frameRate;
                          if (
                            this.p &&
                            this.p.keyframes &&
                            this.p.getValueAtTime
                          )
                            this.p._caching.lastFrame + this.p.offsetTime <=
                            this.p.keyframes[0].t
                              ? ((r = this.p.getValueAtTime(
                                  (this.p.keyframes[0].t + 0.01) / s,
                                  0
                                )),
                                (i = this.p.getValueAtTime(
                                  this.p.keyframes[0].t / s,
                                  0
                                )))
                              : this.p._caching.lastFrame + this.p.offsetTime >=
                                this.p.keyframes[this.p.keyframes.length - 1].t
                              ? ((r = this.p.getValueAtTime(
                                  this.p.keyframes[this.p.keyframes.length - 1]
                                    .t / s,
                                  0
                                )),
                                (i = this.p.getValueAtTime(
                                  (this.p.keyframes[this.p.keyframes.length - 1]
                                    .t -
                                    0.05) /
                                    s,
                                  0
                                )))
                              : ((r = this.p.pv),
                                (i = this.p.getValueAtTime(
                                  (this.p._caching.lastFrame +
                                    this.p.offsetTime -
                                    0.01) /
                                    s,
                                  this.p.offsetTime
                                )));
                          else if (
                            this.px &&
                            this.px.keyframes &&
                            this.py.keyframes &&
                            this.px.getValueAtTime &&
                            this.py.getValueAtTime
                          ) {
                            (r = []), (i = []);
                            var n = this.px,
                              a = this.py;
                            n._caching.lastFrame + n.offsetTime <=
                            n.keyframes[0].t
                              ? ((r[0] = n.getValueAtTime(
                                  (n.keyframes[0].t + 0.01) / s,
                                  0
                                )),
                                (r[1] = a.getValueAtTime(
                                  (a.keyframes[0].t + 0.01) / s,
                                  0
                                )),
                                (i[0] = n.getValueAtTime(
                                  n.keyframes[0].t / s,
                                  0
                                )),
                                (i[1] = a.getValueAtTime(
                                  a.keyframes[0].t / s,
                                  0
                                )))
                              : n._caching.lastFrame + n.offsetTime >=
                                n.keyframes[n.keyframes.length - 1].t
                              ? ((r[0] = n.getValueAtTime(
                                  n.keyframes[n.keyframes.length - 1].t / s,
                                  0
                                )),
                                (r[1] = a.getValueAtTime(
                                  a.keyframes[a.keyframes.length - 1].t / s,
                                  0
                                )),
                                (i[0] = n.getValueAtTime(
                                  (n.keyframes[n.keyframes.length - 1].t -
                                    0.01) /
                                    s,
                                  0
                                )),
                                (i[1] = a.getValueAtTime(
                                  (a.keyframes[a.keyframes.length - 1].t -
                                    0.01) /
                                    s,
                                  0
                                )))
                              : ((r = [n.pv, a.pv]),
                                (i[0] = n.getValueAtTime(
                                  (n._caching.lastFrame + n.offsetTime - 0.01) /
                                    s,
                                  n.offsetTime
                                )),
                                (i[1] = a.getValueAtTime(
                                  (a._caching.lastFrame + a.offsetTime - 0.01) /
                                    s,
                                  a.offsetTime
                                )));
                          } else r = i = t;
                          this.v.rotate(-Math.atan2(r[1] - i[1], r[0] - i[0]));
                        }
                        this.data.p && this.data.p.s
                          ? this.data.p.z
                            ? this.v.translate(this.px.v, this.py.v, -this.pz.v)
                            : this.v.translate(this.px.v, this.py.v, 0)
                          : this.v.translate(
                              this.p.v[0],
                              this.p.v[1],
                              -this.p.v[2]
                            );
                      }
                      this.frameId = this.elem.globalData.frameId;
                    }
                  },
                  precalculateMatrix: function () {
                    if (
                      !this.a.k &&
                      (this.pre.translate(
                        -this.a.v[0],
                        -this.a.v[1],
                        this.a.v[2]
                      ),
                      (this.appliedTransformations = 1),
                      !this.s.effectsSequence.length)
                    ) {
                      if (
                        (this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                        (this.appliedTransformations = 2),
                        this.sk)
                      ) {
                        if (
                          this.sk.effectsSequence.length ||
                          this.sa.effectsSequence.length
                        )
                          return;
                        this.pre.skewFromAxis(-this.sk.v, this.sa.v),
                          (this.appliedTransformations = 3);
                      }
                      if (this.r) {
                        if (this.r.effectsSequence.length) return;
                        this.pre.rotate(-this.r.v),
                          (this.appliedTransformations = 4);
                      } else
                        this.rz.effectsSequence.length ||
                          this.ry.effectsSequence.length ||
                          this.rx.effectsSequence.length ||
                          this.or.effectsSequence.length ||
                          (this.pre
                            .rotateZ(-this.rz.v)
                            .rotateY(this.ry.v)
                            .rotateX(this.rx.v)
                            .rotateZ(-this.or.v[2])
                            .rotateY(this.or.v[1])
                            .rotateX(this.or.v[0]),
                          (this.appliedTransformations = 4));
                    }
                  },
                  autoOrient: function () {},
                }),
                extendPrototype([DynamicPropertyContainer], e),
                (e.prototype.addDynamicProperty = function (t) {
                  this._addDynamicProperty(t),
                    this.elem.addDynamicProperty(t),
                    (this._isDirty = !0);
                }),
                (e.prototype._addDynamicProperty =
                  DynamicPropertyContainer.prototype.addDynamicProperty),
                {
                  getTransformProperty: function (t, r, i) {
                    return new e(t, r, i);
                  },
                }
              );
            })();
          function ShapePath() {
            (this.c = !1),
              (this._length = 0),
              (this._maxLength = 8),
              (this.v = createSizedArray(this._maxLength)),
              (this.o = createSizedArray(this._maxLength)),
              (this.i = createSizedArray(this._maxLength));
          }
          (ShapePath.prototype.setPathData = function (t, e) {
            (this.c = t), this.setLength(e);
            for (var r = 0; r < e; )
              (this.v[r] = point_pool.newElement()),
                (this.o[r] = point_pool.newElement()),
                (this.i[r] = point_pool.newElement()),
                (r += 1);
          }),
            (ShapePath.prototype.setLength = function (t) {
              for (; this._maxLength < t; ) this.doubleArrayLength();
              this._length = t;
            }),
            (ShapePath.prototype.doubleArrayLength = function () {
              (this.v = this.v.concat(createSizedArray(this._maxLength))),
                (this.i = this.i.concat(createSizedArray(this._maxLength))),
                (this.o = this.o.concat(createSizedArray(this._maxLength))),
                (this._maxLength *= 2);
            }),
            (ShapePath.prototype.setXYAt = function (t, e, r, i, s) {
              var n;
              switch (
                ((this._length = Math.max(this._length, i + 1)),
                this._length >= this._maxLength && this.doubleArrayLength(),
                r)
              ) {
                case 'v':
                  n = this.v;
                  break;
                case 'i':
                  n = this.i;
                  break;
                case 'o':
                  n = this.o;
              }
              (!n[i] || (n[i] && !s)) && (n[i] = point_pool.newElement()),
                (n[i][0] = t),
                (n[i][1] = e);
            }),
            (ShapePath.prototype.setTripleAt = function (
              t,
              e,
              r,
              i,
              s,
              n,
              a,
              o
            ) {
              this.setXYAt(t, e, 'v', a, o),
                this.setXYAt(r, i, 'o', a, o),
                this.setXYAt(s, n, 'i', a, o);
            }),
            (ShapePath.prototype.reverse = function () {
              var t = new ShapePath();
              t.setPathData(this.c, this._length);
              var e = this.v,
                r = this.o,
                i = this.i,
                s = 0;
              this.c &&
                (t.setTripleAt(
                  e[0][0],
                  e[0][1],
                  i[0][0],
                  i[0][1],
                  r[0][0],
                  r[0][1],
                  0,
                  !1
                ),
                (s = 1));
              var n,
                a = this._length - 1,
                o = this._length;
              for (n = s; n < o; n += 1)
                t.setTripleAt(
                  e[a][0],
                  e[a][1],
                  i[a][0],
                  i[a][1],
                  r[a][0],
                  r[a][1],
                  n,
                  !1
                ),
                  (a -= 1);
              return t;
            });
          var ShapePropertyFactory = (function () {
              function t(t, e, r) {
                var i,
                  s,
                  n,
                  a,
                  o,
                  h,
                  l,
                  p,
                  c,
                  f = r.lastIndex,
                  d = this.keyframes;
                if (t < d[0].t - this.offsetTime)
                  (i = d[0].s[0]), (n = !0), (f = 0);
                else if (t >= d[d.length - 1].t - this.offsetTime)
                  (i = d[d.length - 1].s
                    ? d[d.length - 1].s[0]
                    : d[d.length - 2].e[0]),
                    (n = !0);
                else {
                  for (
                    var u, m, y = f, g = d.length - 1, v = !0;
                    v &&
                    ((u = d[y]), !((m = d[y + 1]).t - this.offsetTime > t));

                  )
                    y < g - 1 ? (y += 1) : (v = !1);
                  if (((f = y), !(n = 1 === u.h))) {
                    if (t >= m.t - this.offsetTime) p = 1;
                    else if (t < u.t - this.offsetTime) p = 0;
                    else {
                      var _;
                      u.__fnct
                        ? (_ = u.__fnct)
                        : ((_ = BezierFactory.getBezierEasing(
                            u.o.x,
                            u.o.y,
                            u.i.x,
                            u.i.y
                          ).get),
                          (u.__fnct = _)),
                        (p = _(
                          (t - (u.t - this.offsetTime)) /
                            (m.t - this.offsetTime - (u.t - this.offsetTime))
                        ));
                    }
                    s = m.s ? m.s[0] : u.e[0];
                  }
                  i = u.s[0];
                }
                for (
                  h = e._length, l = i.i[0].length, r.lastIndex = f, a = 0;
                  a < h;
                  a += 1
                )
                  for (o = 0; o < l; o += 1)
                    (c = n
                      ? i.i[a][o]
                      : i.i[a][o] + (s.i[a][o] - i.i[a][o]) * p),
                      (e.i[a][o] = c),
                      (c = n
                        ? i.o[a][o]
                        : i.o[a][o] + (s.o[a][o] - i.o[a][o]) * p),
                      (e.o[a][o] = c),
                      (c = n
                        ? i.v[a][o]
                        : i.v[a][o] + (s.v[a][o] - i.v[a][o]) * p),
                      (e.v[a][o] = c);
              }
              function e() {
                var t = this.comp.renderedFrame - this.offsetTime,
                  e = this.keyframes[0].t - this.offsetTime,
                  r =
                    this.keyframes[this.keyframes.length - 1].t -
                    this.offsetTime,
                  i = this._caching.lastFrame;
                return (
                  (-999999 !== i && ((i < e && t < e) || (i > r && t > r))) ||
                    ((this._caching.lastIndex =
                      i < t ? this._caching.lastIndex : 0),
                    this.interpolateShape(t, this.pv, this._caching)),
                  (this._caching.lastFrame = t),
                  this.pv
                );
              }
              function r() {
                this.paths = this.localShapeCollection;
              }
              function i(t) {
                (function (t, e) {
                  if (t._length !== e._length || t.c !== e.c) return !1;
                  var r,
                    i = t._length;
                  for (r = 0; r < i; r += 1)
                    if (
                      t.v[r][0] !== e.v[r][0] ||
                      t.v[r][1] !== e.v[r][1] ||
                      t.o[r][0] !== e.o[r][0] ||
                      t.o[r][1] !== e.o[r][1] ||
                      t.i[r][0] !== e.i[r][0] ||
                      t.i[r][1] !== e.i[r][1]
                    )
                      return !1;
                  return !0;
                })(this.v, t) ||
                  ((this.v = shape_pool.clone(t)),
                  this.localShapeCollection.releaseShapes(),
                  this.localShapeCollection.addShape(this.v),
                  (this._mdf = !0),
                  (this.paths = this.localShapeCollection));
              }
              function s() {
                if (this.elem.globalData.frameId !== this.frameId)
                  if (this.effectsSequence.length)
                    if (this.lock) this.setVValue(this.pv);
                    else {
                      (this.lock = !0), (this._mdf = !1);
                      var t,
                        e = this.kf
                          ? this.pv
                          : this.data.ks
                          ? this.data.ks.k
                          : this.data.pt.k,
                        r = this.effectsSequence.length;
                      for (t = 0; t < r; t += 1) e = this.effectsSequence[t](e);
                      this.setVValue(e),
                        (this.lock = !1),
                        (this.frameId = this.elem.globalData.frameId);
                    }
                  else this._mdf = !1;
              }
              function n(t, e, i) {
                (this.propType = 'shape'),
                  (this.comp = t.comp),
                  (this.container = t),
                  (this.elem = t),
                  (this.data = e),
                  (this.k = !1),
                  (this.kf = !1),
                  (this._mdf = !1);
                var s = 3 === i ? e.pt.k : e.ks.k;
                (this.v = shape_pool.clone(s)),
                  (this.pv = shape_pool.clone(this.v)),
                  (this.localShapeCollection =
                    shapeCollection_pool.newShapeCollection()),
                  (this.paths = this.localShapeCollection),
                  this.paths.addShape(this.v),
                  (this.reset = r),
                  (this.effectsSequence = []);
              }
              function a(t) {
                this.effectsSequence.push(t),
                  this.container.addDynamicProperty(this);
              }
              function o(t, i, s) {
                (this.propType = 'shape'),
                  (this.comp = t.comp),
                  (this.elem = t),
                  (this.container = t),
                  (this.offsetTime = t.data.st),
                  (this.keyframes = 3 === s ? i.pt.k : i.ks.k),
                  (this.k = !0),
                  (this.kf = !0);
                var n = this.keyframes[0].s[0].i.length;
                this.keyframes[0].s[0].i[0].length;
                (this.v = shape_pool.newElement()),
                  this.v.setPathData(this.keyframes[0].s[0].c, n),
                  (this.pv = shape_pool.clone(this.v)),
                  (this.localShapeCollection =
                    shapeCollection_pool.newShapeCollection()),
                  (this.paths = this.localShapeCollection),
                  this.paths.addShape(this.v),
                  (this.lastFrame = -999999),
                  (this.reset = r),
                  (this._caching = { lastFrame: -999999, lastIndex: 0 }),
                  (this.effectsSequence = [e.bind(this)]);
              }
              (n.prototype.interpolateShape = t),
                (n.prototype.getValue = s),
                (n.prototype.setVValue = i),
                (n.prototype.addEffect = a),
                (o.prototype.getValue = s),
                (o.prototype.interpolateShape = t),
                (o.prototype.setVValue = i),
                (o.prototype.addEffect = a);
              var h = (function () {
                  var t = roundCorner;
                  function e(t, e) {
                    (this.v = shape_pool.newElement()),
                      this.v.setPathData(!0, 4),
                      (this.localShapeCollection =
                        shapeCollection_pool.newShapeCollection()),
                      (this.paths = this.localShapeCollection),
                      this.localShapeCollection.addShape(this.v),
                      (this.d = e.d),
                      (this.elem = t),
                      (this.comp = t.comp),
                      (this.frameId = -1),
                      this.initDynamicPropertyContainer(t),
                      (this.p = PropertyFactory.getProp(t, e.p, 1, 0, this)),
                      (this.s = PropertyFactory.getProp(t, e.s, 1, 0, this)),
                      this.dynamicProperties.length
                        ? (this.k = !0)
                        : ((this.k = !1), this.convertEllToPath());
                  }
                  return (
                    (e.prototype = {
                      reset: r,
                      getValue: function () {
                        this.elem.globalData.frameId !== this.frameId &&
                          ((this.frameId = this.elem.globalData.frameId),
                          this.iterateDynamicProperties(),
                          this._mdf && this.convertEllToPath());
                      },
                      convertEllToPath: function () {
                        var e = this.p.v[0],
                          r = this.p.v[1],
                          i = this.s.v[0] / 2,
                          s = this.s.v[1] / 2,
                          n = 3 !== this.d,
                          a = this.v;
                        (a.v[0][0] = e),
                          (a.v[0][1] = r - s),
                          (a.v[1][0] = n ? e + i : e - i),
                          (a.v[1][1] = r),
                          (a.v[2][0] = e),
                          (a.v[2][1] = r + s),
                          (a.v[3][0] = n ? e - i : e + i),
                          (a.v[3][1] = r),
                          (a.i[0][0] = n ? e - i * t : e + i * t),
                          (a.i[0][1] = r - s),
                          (a.i[1][0] = n ? e + i : e - i),
                          (a.i[1][1] = r - s * t),
                          (a.i[2][0] = n ? e + i * t : e - i * t),
                          (a.i[2][1] = r + s),
                          (a.i[3][0] = n ? e - i : e + i),
                          (a.i[3][1] = r + s * t),
                          (a.o[0][0] = n ? e + i * t : e - i * t),
                          (a.o[0][1] = r - s),
                          (a.o[1][0] = n ? e + i : e - i),
                          (a.o[1][1] = r + s * t),
                          (a.o[2][0] = n ? e - i * t : e + i * t),
                          (a.o[2][1] = r + s),
                          (a.o[3][0] = n ? e - i : e + i),
                          (a.o[3][1] = r - s * t);
                      },
                    }),
                    extendPrototype([DynamicPropertyContainer], e),
                    e
                  );
                })(),
                l = (function () {
                  function t(t, e) {
                    (this.v = shape_pool.newElement()),
                      this.v.setPathData(!0, 0),
                      (this.elem = t),
                      (this.comp = t.comp),
                      (this.data = e),
                      (this.frameId = -1),
                      (this.d = e.d),
                      this.initDynamicPropertyContainer(t),
                      1 === e.sy
                        ? ((this.ir = PropertyFactory.getProp(
                            t,
                            e.ir,
                            0,
                            0,
                            this
                          )),
                          (this.is = PropertyFactory.getProp(
                            t,
                            e.is,
                            0,
                            0.01,
                            this
                          )),
                          (this.convertToPath = this.convertStarToPath))
                        : (this.convertToPath = this.convertPolygonToPath),
                      (this.pt = PropertyFactory.getProp(t, e.pt, 0, 0, this)),
                      (this.p = PropertyFactory.getProp(t, e.p, 1, 0, this)),
                      (this.r = PropertyFactory.getProp(
                        t,
                        e.r,
                        0,
                        degToRads,
                        this
                      )),
                      (this.or = PropertyFactory.getProp(t, e.or, 0, 0, this)),
                      (this.os = PropertyFactory.getProp(
                        t,
                        e.os,
                        0,
                        0.01,
                        this
                      )),
                      (this.localShapeCollection =
                        shapeCollection_pool.newShapeCollection()),
                      this.localShapeCollection.addShape(this.v),
                      (this.paths = this.localShapeCollection),
                      this.dynamicProperties.length
                        ? (this.k = !0)
                        : ((this.k = !1), this.convertToPath());
                  }
                  return (
                    (t.prototype = {
                      reset: r,
                      getValue: function () {
                        this.elem.globalData.frameId !== this.frameId &&
                          ((this.frameId = this.elem.globalData.frameId),
                          this.iterateDynamicProperties(),
                          this._mdf && this.convertToPath());
                      },
                      convertStarToPath: function () {
                        var t,
                          e,
                          r,
                          i,
                          s = 2 * Math.floor(this.pt.v),
                          n = (2 * Math.PI) / s,
                          a = !0,
                          o = this.or.v,
                          h = this.ir.v,
                          l = this.os.v,
                          p = this.is.v,
                          c = (2 * Math.PI * o) / (2 * s),
                          f = (2 * Math.PI * h) / (2 * s),
                          d = -Math.PI / 2;
                        d += this.r.v;
                        var u = 3 === this.data.d ? -1 : 1;
                        for (this.v._length = 0, t = 0; t < s; t += 1) {
                          (r = a ? l : p), (i = a ? c : f);
                          var m = (e = a ? o : h) * Math.cos(d),
                            y = e * Math.sin(d),
                            g =
                              0 === m && 0 === y
                                ? 0
                                : y / Math.sqrt(m * m + y * y),
                            v =
                              0 === m && 0 === y
                                ? 0
                                : -m / Math.sqrt(m * m + y * y);
                          (m += +this.p.v[0]),
                            (y += +this.p.v[1]),
                            this.v.setTripleAt(
                              m,
                              y,
                              m - g * i * r * u,
                              y - v * i * r * u,
                              m + g * i * r * u,
                              y + v * i * r * u,
                              t,
                              !0
                            ),
                            (a = !a),
                            (d += n * u);
                        }
                      },
                      convertPolygonToPath: function () {
                        var t,
                          e = Math.floor(this.pt.v),
                          r = (2 * Math.PI) / e,
                          i = this.or.v,
                          s = this.os.v,
                          n = (2 * Math.PI * i) / (4 * e),
                          a = -Math.PI / 2,
                          o = 3 === this.data.d ? -1 : 1;
                        for (
                          a += this.r.v, this.v._length = 0, t = 0;
                          t < e;
                          t += 1
                        ) {
                          var h = i * Math.cos(a),
                            l = i * Math.sin(a),
                            p =
                              0 === h && 0 === l
                                ? 0
                                : l / Math.sqrt(h * h + l * l),
                            c =
                              0 === h && 0 === l
                                ? 0
                                : -h / Math.sqrt(h * h + l * l);
                          (h += +this.p.v[0]),
                            (l += +this.p.v[1]),
                            this.v.setTripleAt(
                              h,
                              l,
                              h - p * n * s * o,
                              l - c * n * s * o,
                              h + p * n * s * o,
                              l + c * n * s * o,
                              t,
                              !0
                            ),
                            (a += r * o);
                        }
                        (this.paths.length = 0), (this.paths[0] = this.v);
                      },
                    }),
                    extendPrototype([DynamicPropertyContainer], t),
                    t
                  );
                })(),
                p = (function () {
                  function t(t, e) {
                    (this.v = shape_pool.newElement()),
                      (this.v.c = !0),
                      (this.localShapeCollection =
                        shapeCollection_pool.newShapeCollection()),
                      this.localShapeCollection.addShape(this.v),
                      (this.paths = this.localShapeCollection),
                      (this.elem = t),
                      (this.comp = t.comp),
                      (this.frameId = -1),
                      (this.d = e.d),
                      this.initDynamicPropertyContainer(t),
                      (this.p = PropertyFactory.getProp(t, e.p, 1, 0, this)),
                      (this.s = PropertyFactory.getProp(t, e.s, 1, 0, this)),
                      (this.r = PropertyFactory.getProp(t, e.r, 0, 0, this)),
                      this.dynamicProperties.length
                        ? (this.k = !0)
                        : ((this.k = !1), this.convertRectToPath());
                  }
                  return (
                    (t.prototype = {
                      convertRectToPath: function () {
                        var t = this.p.v[0],
                          e = this.p.v[1],
                          r = this.s.v[0] / 2,
                          i = this.s.v[1] / 2,
                          s = bm_min(r, i, this.r.v),
                          n = s * (1 - roundCorner);
                        (this.v._length = 0),
                          2 === this.d || 1 === this.d
                            ? (this.v.setTripleAt(
                                t + r,
                                e - i + s,
                                t + r,
                                e - i + s,
                                t + r,
                                e - i + n,
                                0,
                                !0
                              ),
                              this.v.setTripleAt(
                                t + r,
                                e + i - s,
                                t + r,
                                e + i - n,
                                t + r,
                                e + i - s,
                                1,
                                !0
                              ),
                              0 !== s
                                ? (this.v.setTripleAt(
                                    t + r - s,
                                    e + i,
                                    t + r - s,
                                    e + i,
                                    t + r - n,
                                    e + i,
                                    2,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t - r + s,
                                    e + i,
                                    t - r + n,
                                    e + i,
                                    t - r + s,
                                    e + i,
                                    3,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t - r,
                                    e + i - s,
                                    t - r,
                                    e + i - s,
                                    t - r,
                                    e + i - n,
                                    4,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t - r,
                                    e - i + s,
                                    t - r,
                                    e - i + n,
                                    t - r,
                                    e - i + s,
                                    5,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t - r + s,
                                    e - i,
                                    t - r + s,
                                    e - i,
                                    t - r + n,
                                    e - i,
                                    6,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t + r - s,
                                    e - i,
                                    t + r - n,
                                    e - i,
                                    t + r - s,
                                    e - i,
                                    7,
                                    !0
                                  ))
                                : (this.v.setTripleAt(
                                    t - r,
                                    e + i,
                                    t - r + n,
                                    e + i,
                                    t - r,
                                    e + i,
                                    2
                                  ),
                                  this.v.setTripleAt(
                                    t - r,
                                    e - i,
                                    t - r,
                                    e - i + n,
                                    t - r,
                                    e - i,
                                    3
                                  )))
                            : (this.v.setTripleAt(
                                t + r,
                                e - i + s,
                                t + r,
                                e - i + n,
                                t + r,
                                e - i + s,
                                0,
                                !0
                              ),
                              0 !== s
                                ? (this.v.setTripleAt(
                                    t + r - s,
                                    e - i,
                                    t + r - s,
                                    e - i,
                                    t + r - n,
                                    e - i,
                                    1,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t - r + s,
                                    e - i,
                                    t - r + n,
                                    e - i,
                                    t - r + s,
                                    e - i,
                                    2,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t - r,
                                    e - i + s,
                                    t - r,
                                    e - i + s,
                                    t - r,
                                    e - i + n,
                                    3,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t - r,
                                    e + i - s,
                                    t - r,
                                    e + i - n,
                                    t - r,
                                    e + i - s,
                                    4,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t - r + s,
                                    e + i,
                                    t - r + s,
                                    e + i,
                                    t - r + n,
                                    e + i,
                                    5,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t + r - s,
                                    e + i,
                                    t + r - n,
                                    e + i,
                                    t + r - s,
                                    e + i,
                                    6,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t + r,
                                    e + i - s,
                                    t + r,
                                    e + i - s,
                                    t + r,
                                    e + i - n,
                                    7,
                                    !0
                                  ))
                                : (this.v.setTripleAt(
                                    t - r,
                                    e - i,
                                    t - r + n,
                                    e - i,
                                    t - r,
                                    e - i,
                                    1,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t - r,
                                    e + i,
                                    t - r,
                                    e + i - n,
                                    t - r,
                                    e + i,
                                    2,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t + r,
                                    e + i,
                                    t + r - n,
                                    e + i,
                                    t + r,
                                    e + i,
                                    3,
                                    !0
                                  )));
                      },
                      getValue: function (t) {
                        this.elem.globalData.frameId !== this.frameId &&
                          ((this.frameId = this.elem.globalData.frameId),
                          this.iterateDynamicProperties(),
                          this._mdf && this.convertRectToPath());
                      },
                      reset: r,
                    }),
                    extendPrototype([DynamicPropertyContainer], t),
                    t
                  );
                })();
              var c = {
                getShapeProp: function (t, e, r) {
                  var i;
                  return (
                    3 === r || 4 === r
                      ? (i = (3 === r ? e.pt : e.ks).k.length
                          ? new o(t, e, r)
                          : new n(t, e, r))
                      : 5 === r
                      ? (i = new p(t, e))
                      : 6 === r
                      ? (i = new h(t, e))
                      : 7 === r && (i = new l(t, e)),
                    i.k && t.addDynamicProperty(i),
                    i
                  );
                },
                getConstructorFunction: function () {
                  return n;
                },
                getKeyframedConstructorFunction: function () {
                  return o;
                },
              };
              return c;
            })(),
            ShapeModifiers =
              ((ob = {}),
              (modifiers = {}),
              (ob.registerModifier = function (t, e) {
                modifiers[t] || (modifiers[t] = e);
              }),
              (ob.getModifier = function (t, e, r) {
                return new modifiers[t](e, r);
              }),
              ob),
            ob,
            modifiers;
          function ShapeModifier() {}
          function TrimModifier() {}
          function RoundCornersModifier() {}
          function PuckerAndBloatModifier() {}
          function RepeaterModifier() {}
          function ShapeCollection() {
            (this._length = 0),
              (this._maxLength = 4),
              (this.shapes = createSizedArray(this._maxLength));
          }
          function DashProperty(t, e, r, i) {
            (this.elem = t),
              (this.frameId = -1),
              (this.dataProps = createSizedArray(e.length)),
              (this.renderer = r),
              (this.k = !1),
              (this.dashStr = ''),
              (this.dashArray = createTypedArray(
                'float32',
                e.length ? e.length - 1 : 0
              )),
              (this.dashoffset = createTypedArray('float32', 1)),
              this.initDynamicPropertyContainer(i);
            var s,
              n,
              a = e.length || 0;
            for (s = 0; s < a; s += 1)
              (n = PropertyFactory.getProp(t, e[s].v, 0, 0, this)),
                (this.k = n.k || this.k),
                (this.dataProps[s] = { n: e[s].n, p: n });
            this.k || this.getValue(!0), (this._isAnimated = this.k);
          }
          function GradientProperty(t, e, r) {
            (this.data = e), (this.c = createTypedArray('uint8c', 4 * e.p));
            var i = e.k.k[0].s
              ? e.k.k[0].s.length - 4 * e.p
              : e.k.k.length - 4 * e.p;
            (this.o = createTypedArray('float32', i)),
              (this._cmdf = !1),
              (this._omdf = !1),
              (this._collapsable = this.checkCollapsable()),
              (this._hasOpacity = i),
              this.initDynamicPropertyContainer(r),
              (this.prop = PropertyFactory.getProp(t, e.k, 1, null, this)),
              (this.k = this.prop.k),
              this.getValue(!0);
          }
          (ShapeModifier.prototype.initModifierProperties = function () {}),
            (ShapeModifier.prototype.addShapeToModifier = function () {}),
            (ShapeModifier.prototype.addShape = function (t) {
              if (!this.closed) {
                t.sh.container.addDynamicProperty(t.sh);
                var e = {
                  shape: t.sh,
                  data: t,
                  localShapeCollection:
                    shapeCollection_pool.newShapeCollection(),
                };
                this.shapes.push(e),
                  this.addShapeToModifier(e),
                  this._isAnimated && t.setAsAnimated();
              }
            }),
            (ShapeModifier.prototype.init = function (t, e) {
              (this.shapes = []),
                (this.elem = t),
                this.initDynamicPropertyContainer(t),
                this.initModifierProperties(t, e),
                (this.frameId = initialDefaultFrame),
                (this.closed = !1),
                (this.k = !1),
                this.dynamicProperties.length
                  ? (this.k = !0)
                  : this.getValue(!0);
            }),
            (ShapeModifier.prototype.processKeys = function () {
              this.elem.globalData.frameId !== this.frameId &&
                ((this.frameId = this.elem.globalData.frameId),
                this.iterateDynamicProperties());
            }),
            extendPrototype([DynamicPropertyContainer], ShapeModifier),
            extendPrototype([ShapeModifier], TrimModifier),
            (TrimModifier.prototype.initModifierProperties = function (t, e) {
              (this.s = PropertyFactory.getProp(t, e.s, 0, 0.01, this)),
                (this.e = PropertyFactory.getProp(t, e.e, 0, 0.01, this)),
                (this.o = PropertyFactory.getProp(t, e.o, 0, 0, this)),
                (this.sValue = 0),
                (this.eValue = 0),
                (this.getValue = this.processKeys),
                (this.m = e.m),
                (this._isAnimated =
                  !!this.s.effectsSequence.length ||
                  !!this.e.effectsSequence.length ||
                  !!this.o.effectsSequence.length);
            }),
            (TrimModifier.prototype.addShapeToModifier = function (t) {
              t.pathsData = [];
            }),
            (TrimModifier.prototype.calculateShapeEdges = function (
              t,
              e,
              r,
              i,
              s
            ) {
              var n = [];
              e <= 1
                ? n.push({ s: t, e: e })
                : t >= 1
                ? n.push({ s: t - 1, e: e - 1 })
                : (n.push({ s: t, e: 1 }), n.push({ s: 0, e: e - 1 }));
              var a,
                o,
                h = [],
                l = n.length;
              for (a = 0; a < l; a += 1) {
                var p, c;
                if ((o = n[a]).e * s < i || o.s * s > i + r);
                else
                  (p = o.s * s <= i ? 0 : (o.s * s - i) / r),
                    (c = o.e * s >= i + r ? 1 : (o.e * s - i) / r),
                    h.push([p, c]);
              }
              return h.length || h.push([0, 0]), h;
            }),
            (TrimModifier.prototype.releasePathsData = function (t) {
              var e,
                r = t.length;
              for (e = 0; e < r; e += 1) segments_length_pool.release(t[e]);
              return (t.length = 0), t;
            }),
            (TrimModifier.prototype.processShapes = function (t) {
              var e, r, i;
              if (this._mdf || t) {
                var s = (this.o.v % 360) / 360;
                if (
                  (s < 0 && (s += 1),
                  (e = (this.s.v > 1 ? 1 : this.s.v < 0 ? 0 : this.s.v) + s) >
                    (r = (this.e.v > 1 ? 1 : this.e.v < 0 ? 0 : this.e.v) + s))
                ) {
                  var n = e;
                  (e = r), (r = n);
                }
                (e = 1e-4 * Math.round(1e4 * e)),
                  (r = 1e-4 * Math.round(1e4 * r)),
                  (this.sValue = e),
                  (this.eValue = r);
              } else (e = this.sValue), (r = this.eValue);
              var a,
                o,
                h,
                l,
                p,
                c,
                f = this.shapes.length,
                d = 0;
              if (r === e)
                for (a = 0; a < f; a += 1)
                  this.shapes[a].localShapeCollection.releaseShapes(),
                    (this.shapes[a].shape._mdf = !0),
                    (this.shapes[a].shape.paths =
                      this.shapes[a].localShapeCollection),
                    this._mdf && (this.shapes[a].pathsData.length = 0);
              else if ((1 === r && 0 === e) || (0 === r && 1 === e)) {
                if (this._mdf)
                  for (a = 0; a < f; a += 1)
                    (this.shapes[a].pathsData.length = 0),
                      (this.shapes[a].shape._mdf = !0);
              } else {
                var u,
                  m,
                  y = [];
                for (a = 0; a < f; a += 1)
                  if (
                    (u = this.shapes[a]).shape._mdf ||
                    this._mdf ||
                    t ||
                    2 === this.m
                  ) {
                    if (
                      ((h = (i = u.shape.paths)._length),
                      (c = 0),
                      !u.shape._mdf && u.pathsData.length)
                    )
                      c = u.totalShapeLength;
                    else {
                      for (
                        l = this.releasePathsData(u.pathsData), o = 0;
                        o < h;
                        o += 1
                      )
                        (p = bez.getSegmentsLength(i.shapes[o])),
                          l.push(p),
                          (c += p.totalLength);
                      (u.totalShapeLength = c), (u.pathsData = l);
                    }
                    (d += c), (u.shape._mdf = !0);
                  } else u.shape.paths = u.localShapeCollection;
                var g,
                  v = e,
                  _ = r,
                  b = 0;
                for (a = f - 1; a >= 0; a -= 1)
                  if ((u = this.shapes[a]).shape._mdf) {
                    for (
                      (m = u.localShapeCollection).releaseShapes(),
                        2 === this.m && f > 1
                          ? ((g = this.calculateShapeEdges(
                              e,
                              r,
                              u.totalShapeLength,
                              b,
                              d
                            )),
                            (b += u.totalShapeLength))
                          : (g = [[v, _]]),
                        h = g.length,
                        o = 0;
                      o < h;
                      o += 1
                    ) {
                      (v = g[o][0]),
                        (_ = g[o][1]),
                        (y.length = 0),
                        _ <= 1
                          ? y.push({
                              s: u.totalShapeLength * v,
                              e: u.totalShapeLength * _,
                            })
                          : v >= 1
                          ? y.push({
                              s: u.totalShapeLength * (v - 1),
                              e: u.totalShapeLength * (_ - 1),
                            })
                          : (y.push({
                              s: u.totalShapeLength * v,
                              e: u.totalShapeLength,
                            }),
                            y.push({ s: 0, e: u.totalShapeLength * (_ - 1) }));
                      var S = this.addShapes(u, y[0]);
                      if (y[0].s !== y[0].e) {
                        if (y.length > 1)
                          if (
                            u.shape.paths.shapes[u.shape.paths._length - 1].c
                          ) {
                            var P = S.pop();
                            this.addPaths(S, m),
                              (S = this.addShapes(u, y[1], P));
                          } else
                            this.addPaths(S, m), (S = this.addShapes(u, y[1]));
                        this.addPaths(S, m);
                      }
                    }
                    u.shape.paths = m;
                  }
              }
            }),
            (TrimModifier.prototype.addPaths = function (t, e) {
              var r,
                i = t.length;
              for (r = 0; r < i; r += 1) e.addShape(t[r]);
            }),
            (TrimModifier.prototype.addSegment = function (
              t,
              e,
              r,
              i,
              s,
              n,
              a
            ) {
              s.setXYAt(e[0], e[1], 'o', n),
                s.setXYAt(r[0], r[1], 'i', n + 1),
                a && s.setXYAt(t[0], t[1], 'v', n),
                s.setXYAt(i[0], i[1], 'v', n + 1);
            }),
            (TrimModifier.prototype.addSegmentFromArray = function (
              t,
              e,
              r,
              i
            ) {
              e.setXYAt(t[1], t[5], 'o', r),
                e.setXYAt(t[2], t[6], 'i', r + 1),
                i && e.setXYAt(t[0], t[4], 'v', r),
                e.setXYAt(t[3], t[7], 'v', r + 1);
            }),
            (TrimModifier.prototype.addShapes = function (t, e, r) {
              var i,
                s,
                n,
                a,
                o,
                h,
                l,
                p,
                c = t.pathsData,
                f = t.shape.paths.shapes,
                d = t.shape.paths._length,
                u = 0,
                m = [],
                y = !0;
              for (
                r
                  ? ((o = r._length), (p = r._length))
                  : ((r = shape_pool.newElement()), (o = 0), (p = 0)),
                  m.push(r),
                  i = 0;
                i < d;
                i += 1
              ) {
                for (
                  h = c[i].lengths,
                    r.c = f[i].c,
                    n = f[i].c ? h.length : h.length + 1,
                    s = 1;
                  s < n;
                  s += 1
                )
                  if (u + (a = h[s - 1]).addedLength < e.s)
                    (u += a.addedLength), (r.c = !1);
                  else {
                    if (u > e.e) {
                      r.c = !1;
                      break;
                    }
                    e.s <= u && e.e >= u + a.addedLength
                      ? (this.addSegment(
                          f[i].v[s - 1],
                          f[i].o[s - 1],
                          f[i].i[s],
                          f[i].v[s],
                          r,
                          o,
                          y
                        ),
                        (y = !1))
                      : ((l = bez.getNewSegment(
                          f[i].v[s - 1],
                          f[i].v[s],
                          f[i].o[s - 1],
                          f[i].i[s],
                          (e.s - u) / a.addedLength,
                          (e.e - u) / a.addedLength,
                          h[s - 1]
                        )),
                        this.addSegmentFromArray(l, r, o, y),
                        (y = !1),
                        (r.c = !1)),
                      (u += a.addedLength),
                      (o += 1);
                  }
                if (f[i].c && h.length) {
                  if (((a = h[s - 1]), u <= e.e)) {
                    var g = h[s - 1].addedLength;
                    e.s <= u && e.e >= u + g
                      ? (this.addSegment(
                          f[i].v[s - 1],
                          f[i].o[s - 1],
                          f[i].i[0],
                          f[i].v[0],
                          r,
                          o,
                          y
                        ),
                        (y = !1))
                      : ((l = bez.getNewSegment(
                          f[i].v[s - 1],
                          f[i].v[0],
                          f[i].o[s - 1],
                          f[i].i[0],
                          (e.s - u) / g,
                          (e.e - u) / g,
                          h[s - 1]
                        )),
                        this.addSegmentFromArray(l, r, o, y),
                        (y = !1),
                        (r.c = !1));
                  } else r.c = !1;
                  (u += a.addedLength), (o += 1);
                }
                if (
                  (r._length &&
                    (r.setXYAt(r.v[p][0], r.v[p][1], 'i', p),
                    r.setXYAt(
                      r.v[r._length - 1][0],
                      r.v[r._length - 1][1],
                      'o',
                      r._length - 1
                    )),
                  u > e.e)
                )
                  break;
                i < d - 1 &&
                  ((r = shape_pool.newElement()), (y = !0), m.push(r), (o = 0));
              }
              return m;
            }),
            ShapeModifiers.registerModifier('tm', TrimModifier),
            extendPrototype([ShapeModifier], RoundCornersModifier),
            (RoundCornersModifier.prototype.initModifierProperties = function (
              t,
              e
            ) {
              (this.getValue = this.processKeys),
                (this.rd = PropertyFactory.getProp(t, e.r, 0, null, this)),
                (this._isAnimated = !!this.rd.effectsSequence.length);
            }),
            (RoundCornersModifier.prototype.processPath = function (t, e) {
              var r = shape_pool.newElement();
              r.c = t.c;
              var i,
                s,
                n,
                a,
                o,
                h,
                l,
                p,
                c,
                f,
                d,
                u,
                m,
                y = t._length,
                g = 0;
              for (i = 0; i < y; i += 1)
                (s = t.v[i]),
                  (a = t.o[i]),
                  (n = t.i[i]),
                  s[0] === a[0] &&
                  s[1] === a[1] &&
                  s[0] === n[0] &&
                  s[1] === n[1]
                    ? (0 !== i && i !== y - 1) || t.c
                      ? ((o = 0 === i ? t.v[y - 1] : t.v[i - 1]),
                        (l = (h = Math.sqrt(
                          Math.pow(s[0] - o[0], 2) + Math.pow(s[1] - o[1], 2)
                        ))
                          ? Math.min(h / 2, e) / h
                          : 0),
                        (p = u = s[0] + (o[0] - s[0]) * l),
                        (c = m = s[1] - (s[1] - o[1]) * l),
                        (f = p - (p - s[0]) * roundCorner),
                        (d = c - (c - s[1]) * roundCorner),
                        r.setTripleAt(p, c, f, d, u, m, g),
                        (g += 1),
                        (o = i === y - 1 ? t.v[0] : t.v[i + 1]),
                        (l = (h = Math.sqrt(
                          Math.pow(s[0] - o[0], 2) + Math.pow(s[1] - o[1], 2)
                        ))
                          ? Math.min(h / 2, e) / h
                          : 0),
                        (p = f = s[0] + (o[0] - s[0]) * l),
                        (c = d = s[1] + (o[1] - s[1]) * l),
                        (u = p - (p - s[0]) * roundCorner),
                        (m = c - (c - s[1]) * roundCorner),
                        r.setTripleAt(p, c, f, d, u, m, g),
                        (g += 1))
                      : (r.setTripleAt(s[0], s[1], a[0], a[1], n[0], n[1], g),
                        (g += 1))
                    : (r.setTripleAt(
                        t.v[i][0],
                        t.v[i][1],
                        t.o[i][0],
                        t.o[i][1],
                        t.i[i][0],
                        t.i[i][1],
                        g
                      ),
                      (g += 1));
              return r;
            }),
            (RoundCornersModifier.prototype.processShapes = function (t) {
              var e,
                r,
                i,
                s,
                n,
                a,
                o = this.shapes.length,
                h = this.rd.v;
              if (0 !== h)
                for (r = 0; r < o; r += 1) {
                  if (
                    ((n = this.shapes[r]).shape.paths,
                    (a = n.localShapeCollection),
                    n.shape._mdf || this._mdf || t)
                  )
                    for (
                      a.releaseShapes(),
                        n.shape._mdf = !0,
                        e = n.shape.paths.shapes,
                        s = n.shape.paths._length,
                        i = 0;
                      i < s;
                      i += 1
                    )
                      a.addShape(this.processPath(e[i], h));
                  n.shape.paths = n.localShapeCollection;
                }
              this.dynamicProperties.length || (this._mdf = !1);
            }),
            ShapeModifiers.registerModifier('rd', RoundCornersModifier),
            extendPrototype([ShapeModifier], PuckerAndBloatModifier),
            (PuckerAndBloatModifier.prototype.initModifierProperties =
              function (t, e) {
                (this.getValue = this.processKeys),
                  (this.amount = PropertyFactory.getProp(
                    t,
                    e.a,
                    0,
                    null,
                    this
                  )),
                  (this._isAnimated = !!this.amount.effectsSequence.length);
              }),
            (PuckerAndBloatModifier.prototype.processPath = function (t, e) {
              var r = e / 100,
                i = [0, 0],
                s = t._length,
                n = 0;
              for (n = 0; n < s; n += 1)
                (i[0] += t.v[n][0]), (i[1] += t.v[n][1]);
              (i[0] /= s), (i[1] /= s);
              var a,
                o,
                h,
                l,
                p,
                c,
                f = shape_pool.newElement();
              for (f.c = t.c, n = 0; n < s; n += 1)
                (a = t.v[n][0] + (i[0] - t.v[n][0]) * r),
                  (o = t.v[n][1] + (i[1] - t.v[n][1]) * r),
                  (h = t.o[n][0] + (i[0] - t.o[n][0]) * -r),
                  (l = t.o[n][1] + (i[1] - t.o[n][1]) * -r),
                  (p = t.i[n][0] + (i[0] - t.i[n][0]) * -r),
                  (c = t.i[n][1] + (i[1] - t.i[n][1]) * -r),
                  f.setTripleAt(a, o, h, l, p, c, n);
              return f;
            }),
            (PuckerAndBloatModifier.prototype.processShapes = function (t) {
              var e,
                r,
                i,
                s,
                n,
                a,
                o = this.shapes.length,
                h = this.amount.v;
              if (0 !== h)
                for (r = 0; r < o; r += 1) {
                  if (
                    ((n = this.shapes[r]).shape.paths,
                    (a = n.localShapeCollection),
                    n.shape._mdf || this._mdf || t)
                  )
                    for (
                      a.releaseShapes(),
                        n.shape._mdf = !0,
                        e = n.shape.paths.shapes,
                        s = n.shape.paths._length,
                        i = 0;
                      i < s;
                      i += 1
                    )
                      a.addShape(this.processPath(e[i], h));
                  n.shape.paths = n.localShapeCollection;
                }
              this.dynamicProperties.length || (this._mdf = !1);
            }),
            ShapeModifiers.registerModifier('pb', PuckerAndBloatModifier),
            extendPrototype([ShapeModifier], RepeaterModifier),
            (RepeaterModifier.prototype.initModifierProperties = function (
              t,
              e
            ) {
              (this.getValue = this.processKeys),
                (this.c = PropertyFactory.getProp(t, e.c, 0, null, this)),
                (this.o = PropertyFactory.getProp(t, e.o, 0, null, this)),
                (this.tr = TransformPropertyFactory.getTransformProperty(
                  t,
                  e.tr,
                  this
                )),
                (this.so = PropertyFactory.getProp(t, e.tr.so, 0, 0.01, this)),
                (this.eo = PropertyFactory.getProp(t, e.tr.eo, 0, 0.01, this)),
                (this.data = e),
                this.dynamicProperties.length || this.getValue(!0),
                (this._isAnimated = !!this.dynamicProperties.length),
                (this.pMatrix = new Matrix()),
                (this.rMatrix = new Matrix()),
                (this.sMatrix = new Matrix()),
                (this.tMatrix = new Matrix()),
                (this.matrix = new Matrix());
            }),
            (RepeaterModifier.prototype.applyTransforms = function (
              t,
              e,
              r,
              i,
              s,
              n
            ) {
              var a = n ? -1 : 1,
                o = i.s.v[0] + (1 - i.s.v[0]) * (1 - s),
                h = i.s.v[1] + (1 - i.s.v[1]) * (1 - s);
              t.translate(i.p.v[0] * a * s, i.p.v[1] * a * s, i.p.v[2]),
                e.translate(-i.a.v[0], -i.a.v[1], i.a.v[2]),
                e.rotate(-i.r.v * a * s),
                e.translate(i.a.v[0], i.a.v[1], i.a.v[2]),
                r.translate(-i.a.v[0], -i.a.v[1], i.a.v[2]),
                r.scale(n ? 1 / o : o, n ? 1 / h : h),
                r.translate(i.a.v[0], i.a.v[1], i.a.v[2]);
            }),
            (RepeaterModifier.prototype.init = function (t, e, r, i) {
              for (
                this.elem = t,
                  this.arr = e,
                  this.pos = r,
                  this.elemsData = i,
                  this._currentCopies = 0,
                  this._elements = [],
                  this._groups = [],
                  this.frameId = -1,
                  this.initDynamicPropertyContainer(t),
                  this.initModifierProperties(t, e[r]);
                r > 0;

              )
                (r -= 1), this._elements.unshift(e[r]);
              this.dynamicProperties.length ? (this.k = !0) : this.getValue(!0);
            }),
            (RepeaterModifier.prototype.resetElements = function (t) {
              var e,
                r = t.length;
              for (e = 0; e < r; e += 1)
                (t[e]._processed = !1),
                  'gr' === t[e].ty && this.resetElements(t[e].it);
            }),
            (RepeaterModifier.prototype.cloneElements = function (t) {
              t.length;
              var e = JSON.parse(JSON.stringify(t));
              return this.resetElements(e), e;
            }),
            (RepeaterModifier.prototype.changeGroupRender = function (t, e) {
              var r,
                i = t.length;
              for (r = 0; r < i; r += 1)
                (t[r]._render = e),
                  'gr' === t[r].ty && this.changeGroupRender(t[r].it, e);
            }),
            (RepeaterModifier.prototype.processShapes = function (t) {
              var e, r, i, s, n;
              if (this._mdf || t) {
                var a,
                  o = Math.ceil(this.c.v);
                if (this._groups.length < o) {
                  for (; this._groups.length < o; ) {
                    var h = {
                      it: this.cloneElements(this._elements),
                      ty: 'gr',
                    };
                    h.it.push({
                      a: { a: 0, ix: 1, k: [0, 0] },
                      nm: 'Transform',
                      o: { a: 0, ix: 7, k: 100 },
                      p: { a: 0, ix: 2, k: [0, 0] },
                      r: {
                        a: 1,
                        ix: 6,
                        k: [
                          { s: 0, e: 0, t: 0 },
                          { s: 0, e: 0, t: 1 },
                        ],
                      },
                      s: { a: 0, ix: 3, k: [100, 100] },
                      sa: { a: 0, ix: 5, k: 0 },
                      sk: { a: 0, ix: 4, k: 0 },
                      ty: 'tr',
                    }),
                      this.arr.splice(0, 0, h),
                      this._groups.splice(0, 0, h),
                      (this._currentCopies += 1);
                  }
                  this.elem.reloadShapes();
                }
                for (n = 0, i = 0; i <= this._groups.length - 1; i += 1)
                  (a = n < o),
                    (this._groups[i]._render = a),
                    this.changeGroupRender(this._groups[i].it, a),
                    (n += 1);
                this._currentCopies = o;
                var l = this.o.v,
                  p = l % 1,
                  c = l > 0 ? Math.floor(l) : Math.ceil(l),
                  f = (this.tr.v.props, this.pMatrix.props),
                  d = this.rMatrix.props,
                  u = this.sMatrix.props;
                this.pMatrix.reset(),
                  this.rMatrix.reset(),
                  this.sMatrix.reset(),
                  this.tMatrix.reset(),
                  this.matrix.reset();
                var m,
                  y,
                  g = 0;
                if (l > 0) {
                  for (; g < c; )
                    this.applyTransforms(
                      this.pMatrix,
                      this.rMatrix,
                      this.sMatrix,
                      this.tr,
                      1,
                      !1
                    ),
                      (g += 1);
                  p &&
                    (this.applyTransforms(
                      this.pMatrix,
                      this.rMatrix,
                      this.sMatrix,
                      this.tr,
                      p,
                      !1
                    ),
                    (g += p));
                } else if (l < 0) {
                  for (; g > c; )
                    this.applyTransforms(
                      this.pMatrix,
                      this.rMatrix,
                      this.sMatrix,
                      this.tr,
                      1,
                      !0
                    ),
                      (g -= 1);
                  p &&
                    (this.applyTransforms(
                      this.pMatrix,
                      this.rMatrix,
                      this.sMatrix,
                      this.tr,
                      -p,
                      !0
                    ),
                    (g -= p));
                }
                for (
                  i = 1 === this.data.m ? 0 : this._currentCopies - 1,
                    s = 1 === this.data.m ? 1 : -1,
                    n = this._currentCopies;
                  n;

                ) {
                  if (
                    ((y = (r = (e = this.elemsData[i].it)[e.length - 1]
                      .transform.mProps.v.props).length),
                    (e[e.length - 1].transform.mProps._mdf = !0),
                    (e[e.length - 1].transform.op._mdf = !0),
                    (e[e.length - 1].transform.op.v =
                      this.so.v +
                      (this.eo.v - this.so.v) *
                        (i / (this._currentCopies - 1))),
                    0 !== g)
                  ) {
                    for (
                      ((0 !== i && 1 === s) ||
                        (i !== this._currentCopies - 1 && -1 === s)) &&
                        this.applyTransforms(
                          this.pMatrix,
                          this.rMatrix,
                          this.sMatrix,
                          this.tr,
                          1,
                          !1
                        ),
                        this.matrix.transform(
                          d[0],
                          d[1],
                          d[2],
                          d[3],
                          d[4],
                          d[5],
                          d[6],
                          d[7],
                          d[8],
                          d[9],
                          d[10],
                          d[11],
                          d[12],
                          d[13],
                          d[14],
                          d[15]
                        ),
                        this.matrix.transform(
                          u[0],
                          u[1],
                          u[2],
                          u[3],
                          u[4],
                          u[5],
                          u[6],
                          u[7],
                          u[8],
                          u[9],
                          u[10],
                          u[11],
                          u[12],
                          u[13],
                          u[14],
                          u[15]
                        ),
                        this.matrix.transform(
                          f[0],
                          f[1],
                          f[2],
                          f[3],
                          f[4],
                          f[5],
                          f[6],
                          f[7],
                          f[8],
                          f[9],
                          f[10],
                          f[11],
                          f[12],
                          f[13],
                          f[14],
                          f[15]
                        ),
                        m = 0;
                      m < y;
                      m += 1
                    )
                      r[m] = this.matrix.props[m];
                    this.matrix.reset();
                  } else
                    for (this.matrix.reset(), m = 0; m < y; m += 1)
                      r[m] = this.matrix.props[m];
                  (g += 1), (n -= 1), (i += s);
                }
              } else
                for (n = this._currentCopies, i = 0, s = 1; n; )
                  (r = (e = this.elemsData[i].it)[e.length - 1].transform.mProps
                    .v.props),
                    (e[e.length - 1].transform.mProps._mdf = !1),
                    (e[e.length - 1].transform.op._mdf = !1),
                    (n -= 1),
                    (i += s);
            }),
            (RepeaterModifier.prototype.addShape = function () {}),
            ShapeModifiers.registerModifier('rp', RepeaterModifier),
            (ShapeCollection.prototype.addShape = function (t) {
              this._length === this._maxLength &&
                ((this.shapes = this.shapes.concat(
                  createSizedArray(this._maxLength)
                )),
                (this._maxLength *= 2)),
                (this.shapes[this._length] = t),
                (this._length += 1);
            }),
            (ShapeCollection.prototype.releaseShapes = function () {
              var t;
              for (t = 0; t < this._length; t += 1)
                shape_pool.release(this.shapes[t]);
              this._length = 0;
            }),
            (DashProperty.prototype.getValue = function (t) {
              if (
                (this.elem.globalData.frameId !== this.frameId || t) &&
                ((this.frameId = this.elem.globalData.frameId),
                this.iterateDynamicProperties(),
                (this._mdf = this._mdf || t),
                this._mdf)
              ) {
                var e = 0,
                  r = this.dataProps.length;
                for (
                  'svg' === this.renderer && (this.dashStr = ''), e = 0;
                  e < r;
                  e += 1
                )
                  'o' != this.dataProps[e].n
                    ? 'svg' === this.renderer
                      ? (this.dashStr += ' ' + this.dataProps[e].p.v)
                      : (this.dashArray[e] = this.dataProps[e].p.v)
                    : (this.dashoffset[0] = this.dataProps[e].p.v);
              }
            }),
            extendPrototype([DynamicPropertyContainer], DashProperty),
            (GradientProperty.prototype.comparePoints = function (t, e) {
              for (var r = 0, i = this.o.length / 2; r < i; ) {
                if (Math.abs(t[4 * r] - t[4 * e + 2 * r]) > 0.01) return !1;
                r += 1;
              }
              return !0;
            }),
            (GradientProperty.prototype.checkCollapsable = function () {
              if (this.o.length / 2 != this.c.length / 4) return !1;
              if (this.data.k.k[0].s)
                for (var t = 0, e = this.data.k.k.length; t < e; ) {
                  if (!this.comparePoints(this.data.k.k[t].s, this.data.p))
                    return !1;
                  t += 1;
                }
              else if (!this.comparePoints(this.data.k.k, this.data.p))
                return !1;
              return !0;
            }),
            (GradientProperty.prototype.getValue = function (t) {
              if (
                (this.prop.getValue(),
                (this._mdf = !1),
                (this._cmdf = !1),
                (this._omdf = !1),
                this.prop._mdf || t)
              ) {
                var e,
                  r,
                  i,
                  s = 4 * this.data.p;
                for (e = 0; e < s; e += 1)
                  (r = e % 4 == 0 ? 100 : 255),
                    (i = Math.round(this.prop.v[e] * r)),
                    this.c[e] !== i && ((this.c[e] = i), (this._cmdf = !t));
                if (this.o.length)
                  for (
                    s = this.prop.v.length, e = 4 * this.data.p;
                    e < s;
                    e += 1
                  )
                    (r = e % 2 == 0 ? 100 : 1),
                      (i =
                        e % 2 == 0
                          ? Math.round(100 * this.prop.v[e])
                          : this.prop.v[e]),
                      this.o[e - 4 * this.data.p] !== i &&
                        ((this.o[e - 4 * this.data.p] = i), (this._omdf = !t));
                this._mdf = !t;
              }
            }),
            extendPrototype([DynamicPropertyContainer], GradientProperty);
          var buildShapeString = function (t, e, r, i) {
              if (0 === e) return '';
              var s,
                n = t.o,
                a = t.i,
                o = t.v,
                h = ' M' + i.applyToPointStringified(o[0][0], o[0][1]);
              for (s = 1; s < e; s += 1)
                h +=
                  ' C' +
                  i.applyToPointStringified(n[s - 1][0], n[s - 1][1]) +
                  ' ' +
                  i.applyToPointStringified(a[s][0], a[s][1]) +
                  ' ' +
                  i.applyToPointStringified(o[s][0], o[s][1]);
              return (
                r &&
                  e &&
                  ((h +=
                    ' C' +
                    i.applyToPointStringified(n[s - 1][0], n[s - 1][1]) +
                    ' ' +
                    i.applyToPointStringified(a[0][0], a[0][1]) +
                    ' ' +
                    i.applyToPointStringified(o[0][0], o[0][1])),
                  (h += 'z')),
                h
              );
            },
            ImagePreloader = (function () {
              var t = (function () {
                var t = createTag('canvas');
                (t.width = 1), (t.height = 1);
                var e = t.getContext('2d');
                return (
                  (e.fillStyle = 'rgba(0,0,0,0)'), e.fillRect(0, 0, 1, 1), t
                );
              })();
              function e() {
                (this.loadedAssets += 1),
                  this.loadedAssets === this.totalImages &&
                    this.imagesLoadedCb &&
                    this.imagesLoadedCb(null);
              }
              function r(t, e, r) {
                var i = '';
                if (t.e) i = t.p;
                else if (e) {
                  var s = t.p;
                  -1 !== s.indexOf('images/') && (s = s.split('/')[1]),
                    (i = e + s);
                } else (i = r), (i += t.u ? t.u : ''), (i += t.p);
                return i;
              }
              function i(t) {
                (this._imageLoaded = e.bind(this)),
                  (this.assetsPath = ''),
                  (this.path = ''),
                  (this.totalImages = 0),
                  (this.loadedAssets = 0),
                  (this.imagesLoadedCb = null),
                  (this.images = []);
              }
              return (
                (i.prototype = {
                  loadAssets: function (t, e) {
                    this.imagesLoadedCb = e;
                    var r,
                      i = t.length;
                    for (r = 0; r < i; r += 1)
                      t[r].layers ||
                        ((this.totalImages += 1),
                        this.images.push(this._createImageData(t[r])));
                  },
                  setAssetsPath: function (t) {
                    this.assetsPath = t || '';
                  },
                  setPath: function (t) {
                    this.path = t || '';
                  },
                  loaded: function () {
                    return this.totalImages === this.loadedAssets;
                  },
                  destroy: function () {
                    (this.imagesLoadedCb = null), (this.images.length = 0);
                  },
                  getImage: function (t) {
                    for (var e = 0, r = this.images.length; e < r; ) {
                      if (this.images[e].assetData === t)
                        return this.images[e].img;
                      e += 1;
                    }
                  },
                  createImgData: function (e) {
                    var i = r(e, this.assetsPath, this.path),
                      s = createTag('img');
                    (s.crossOrigin = 'anonymous'),
                      s.addEventListener('load', this._imageLoaded, !1),
                      s.addEventListener(
                        'error',
                        function () {
                          (n.img = t), this._imageLoaded();
                        }.bind(this),
                        !1
                      ),
                      (s.src = i);
                    var n = { img: s, assetData: e };
                    return n;
                  },
                  createImageData: function (e) {
                    var i = r(e, this.assetsPath, this.path),
                      s = createNS('image');
                    s.addEventListener('load', this._imageLoaded, !1),
                      s.addEventListener(
                        'error',
                        function () {
                          (n.img = t), this._imageLoaded();
                        }.bind(this),
                        !1
                      ),
                      s.setAttributeNS(
                        'http://www.w3.org/1999/xlink',
                        'href',
                        i
                      );
                    var n = { img: s, assetData: e };
                    return n;
                  },
                  imageLoaded: e,
                  setCacheType: function (t) {
                    this._createImageData =
                      'svg' === t
                        ? this.createImageData.bind(this)
                        : this.createImgData.bind(this);
                  },
                }),
                i
              );
            })(),
            featureSupport = (function () {
              var t = { maskType: !0 };
              return (
                (/MSIE 10/i.test(navigator.userAgent) ||
                  /MSIE 9/i.test(navigator.userAgent) ||
                  /rv:11.0/i.test(navigator.userAgent) ||
                  /Edge\/\d./i.test(navigator.userAgent)) &&
                  (t.maskType = !1),
                t
              );
            })(),
            filtersFactory = (function () {
              var t = {};
              return (
                (t.createFilter = function (t) {
                  var e = createNS('filter');
                  return (
                    e.setAttribute('id', t),
                    e.setAttribute('filterUnits', 'objectBoundingBox'),
                    e.setAttribute('x', '0%'),
                    e.setAttribute('y', '0%'),
                    e.setAttribute('width', '100%'),
                    e.setAttribute('height', '100%'),
                    e
                  );
                }),
                (t.createAlphaToLuminanceFilter = function () {
                  var t = createNS('feColorMatrix');
                  return (
                    t.setAttribute('type', 'matrix'),
                    t.setAttribute('color-interpolation-filters', 'sRGB'),
                    t.setAttribute(
                      'values',
                      '0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1'
                    ),
                    t
                  );
                }),
                t
              );
            })(),
            assetLoader = (function () {
              function t(t) {
                return t.response && 'object' == typeof t.response
                  ? t.response
                  : t.response && 'string' == typeof t.response
                  ? JSON.parse(t.response)
                  : t.responseText
                  ? JSON.parse(t.responseText)
                  : void 0;
              }
              return {
                load: function (e, r, i) {
                  var s,
                    n = new XMLHttpRequest();
                  n.open('GET', e, !0);
                  try {
                    n.responseType = 'json';
                  } catch (t) {}
                  n.send(),
                    (n.onreadystatechange = function () {
                      if (4 == n.readyState)
                        if (200 == n.status) (s = t(n)), r(s);
                        else
                          try {
                            (s = t(n)), r(s);
                          } catch (t) {
                            i && i(t);
                          }
                    });
                },
              };
            })();
          function TextAnimatorProperty(t, e, r) {
            (this._isFirstFrame = !0),
              (this._hasMaskedPath = !1),
              (this._frameId = -1),
              (this._textData = t),
              (this._renderType = e),
              (this._elem = r),
              (this._animatorsData = createSizedArray(this._textData.a.length)),
              (this._pathData = {}),
              (this._moreOptions = { alignment: {} }),
              (this.renderedLetters = []),
              (this.lettersChangedFlag = !1),
              this.initDynamicPropertyContainer(r);
          }
          function TextAnimatorDataProperty(t, e, r) {
            var i = { propType: !1 },
              s = PropertyFactory.getProp,
              n = e.a;
            (this.a = {
              r: n.r ? s(t, n.r, 0, degToRads, r) : i,
              rx: n.rx ? s(t, n.rx, 0, degToRads, r) : i,
              ry: n.ry ? s(t, n.ry, 0, degToRads, r) : i,
              sk: n.sk ? s(t, n.sk, 0, degToRads, r) : i,
              sa: n.sa ? s(t, n.sa, 0, degToRads, r) : i,
              s: n.s ? s(t, n.s, 1, 0.01, r) : i,
              a: n.a ? s(t, n.a, 1, 0, r) : i,
              o: n.o ? s(t, n.o, 0, 0.01, r) : i,
              p: n.p ? s(t, n.p, 1, 0, r) : i,
              sw: n.sw ? s(t, n.sw, 0, 0, r) : i,
              sc: n.sc ? s(t, n.sc, 1, 0, r) : i,
              fc: n.fc ? s(t, n.fc, 1, 0, r) : i,
              fh: n.fh ? s(t, n.fh, 0, 0, r) : i,
              fs: n.fs ? s(t, n.fs, 0, 0.01, r) : i,
              fb: n.fb ? s(t, n.fb, 0, 0.01, r) : i,
              t: n.t ? s(t, n.t, 0, 0, r) : i,
            }),
              (this.s = TextSelectorProp.getTextSelectorProp(t, e.s, r)),
              (this.s.t = e.s.t);
          }
          function LetterProps(t, e, r, i, s, n) {
            (this.o = t),
              (this.sw = e),
              (this.sc = r),
              (this.fc = i),
              (this.m = s),
              (this.p = n),
              (this._mdf = { o: !0, sw: !!e, sc: !!r, fc: !!i, m: !0, p: !0 });
          }
          function TextProperty(t, e) {
            (this._frameId = initialDefaultFrame),
              (this.pv = ''),
              (this.v = ''),
              (this.kf = !1),
              (this._isFirstFrame = !0),
              (this._mdf = !1),
              (this.data = e),
              (this.elem = t),
              (this.comp = this.elem.comp),
              (this.keysIndex = 0),
              (this.canResize = !1),
              (this.minimumFontSize = 1),
              (this.effectsSequence = []),
              (this.currentData = {
                ascent: 0,
                boxWidth: this.defaultBoxWidth,
                f: '',
                fStyle: '',
                fWeight: '',
                fc: '',
                j: '',
                justifyOffset: '',
                l: [],
                lh: 0,
                lineWidths: [],
                ls: '',
                of: '',
                s: '',
                sc: '',
                sw: 0,
                t: 0,
                tr: 0,
                sz: 0,
                ps: null,
                fillColorAnim: !1,
                strokeColorAnim: !1,
                strokeWidthAnim: !1,
                yOffset: 0,
                finalSize: 0,
                finalText: [],
                finalLineHeight: 0,
                __complete: !1,
              }),
              this.copyData(this.currentData, this.data.d.k[0].s),
              this.searchProperty() || this.completeTextData(this.currentData);
          }
          (TextAnimatorProperty.prototype.searchProperties = function () {
            var t,
              e,
              r = this._textData.a.length,
              i = PropertyFactory.getProp;
            for (t = 0; t < r; t += 1)
              (e = this._textData.a[t]),
                (this._animatorsData[t] = new TextAnimatorDataProperty(
                  this._elem,
                  e,
                  this
                ));
            this._textData.p && 'm' in this._textData.p
              ? ((this._pathData = {
                  f: i(this._elem, this._textData.p.f, 0, 0, this),
                  l: i(this._elem, this._textData.p.l, 0, 0, this),
                  r: this._textData.p.r,
                  m: this._elem.maskManager.getMaskProperty(this._textData.p.m),
                }),
                (this._hasMaskedPath = !0))
              : (this._hasMaskedPath = !1),
              (this._moreOptions.alignment = i(
                this._elem,
                this._textData.m.a,
                1,
                0,
                this
              ));
          }),
            (TextAnimatorProperty.prototype.getMeasures = function (t, e) {
              if (
                ((this.lettersChangedFlag = e),
                this._mdf ||
                  this._isFirstFrame ||
                  e ||
                  (this._hasMaskedPath && this._pathData.m._mdf))
              ) {
                this._isFirstFrame = !1;
                var r,
                  i,
                  s,
                  n,
                  a,
                  o,
                  h,
                  l,
                  p,
                  c,
                  f,
                  d,
                  u,
                  m,
                  y,
                  g,
                  v,
                  _,
                  b,
                  S = this._moreOptions.alignment.v,
                  P = this._animatorsData,
                  x = this._textData,
                  k = this.mHelper,
                  w = this._renderType,
                  E = this.renderedLetters.length,
                  A = (this.data, t.l);
                if (this._hasMaskedPath) {
                  if (
                    ((b = this._pathData.m),
                    !this._pathData.n || this._pathData._mdf)
                  ) {
                    var T,
                      C = b.v;
                    for (
                      this._pathData.r && (C = C.reverse()),
                        a = { tLength: 0, segments: [] },
                        n = C._length - 1,
                        g = 0,
                        s = 0;
                      s < n;
                      s += 1
                    )
                      (T = bez.buildBezierData(
                        C.v[s],
                        C.v[s + 1],
                        [C.o[s][0] - C.v[s][0], C.o[s][1] - C.v[s][1]],
                        [
                          C.i[s + 1][0] - C.v[s + 1][0],
                          C.i[s + 1][1] - C.v[s + 1][1],
                        ]
                      )),
                        (a.tLength += T.segmentLength),
                        a.segments.push(T),
                        (g += T.segmentLength);
                    (s = n),
                      b.v.c &&
                        ((T = bez.buildBezierData(
                          C.v[s],
                          C.v[0],
                          [C.o[s][0] - C.v[s][0], C.o[s][1] - C.v[s][1]],
                          [C.i[0][0] - C.v[0][0], C.i[0][1] - C.v[0][1]]
                        )),
                        (a.tLength += T.segmentLength),
                        a.segments.push(T),
                        (g += T.segmentLength)),
                      (this._pathData.pi = a);
                  }
                  if (
                    ((a = this._pathData.pi),
                    (o = this._pathData.f.v),
                    (f = 0),
                    (c = 1),
                    (l = 0),
                    (p = !0),
                    (m = a.segments),
                    o < 0 && b.v.c)
                  )
                    for (
                      a.tLength < Math.abs(o) && (o = -Math.abs(o) % a.tLength),
                        c = (u = m[(f = m.length - 1)].points).length - 1;
                      o < 0;

                    )
                      (o += u[c].partialLength),
                        (c -= 1) < 0 &&
                          (c = (u = m[(f -= 1)].points).length - 1);
                  (d = (u = m[f].points)[c - 1]),
                    (y = (h = u[c]).partialLength);
                }
                (n = A.length), (r = 0), (i = 0);
                var I,
                  F,
                  M,
                  D,
                  R = 1.2 * t.finalSize * 0.714,
                  z = !0;
                M = P.length;
                var L,
                  O,
                  N,
                  B,
                  V,
                  G,
                  j,
                  U,
                  W,
                  H,
                  q,
                  Z,
                  Y,
                  X = -1,
                  K = o,
                  J = f,
                  $ = c,
                  Q = -1,
                  tt = '',
                  et = this.defaultPropsArray;
                if (2 === t.j || 1 === t.j) {
                  var rt = 0,
                    it = 0,
                    st = 2 === t.j ? -0.5 : -1,
                    nt = 0,
                    at = !0;
                  for (s = 0; s < n; s += 1)
                    if (A[s].n) {
                      for (rt && (rt += it); nt < s; )
                        (A[nt].animatorJustifyOffset = rt), (nt += 1);
                      (rt = 0), (at = !0);
                    } else {
                      for (F = 0; F < M; F += 1)
                        (I = P[F].a).t.propType &&
                          (at && 2 === t.j && (it += I.t.v * st),
                          (L = P[F].s.getMult(
                            A[s].anIndexes[F],
                            x.a[F].s.totalChars
                          )).length
                            ? (rt += I.t.v * L[0] * st)
                            : (rt += I.t.v * L * st));
                      at = !1;
                    }
                  for (rt && (rt += it); nt < s; )
                    (A[nt].animatorJustifyOffset = rt), (nt += 1);
                }
                for (s = 0; s < n; s += 1) {
                  if ((k.reset(), (V = 1), A[s].n))
                    (r = 0),
                      (i += t.yOffset),
                      (i += z ? 1 : 0),
                      (o = K),
                      (z = !1),
                      0,
                      this._hasMaskedPath &&
                        ((c = $),
                        (d = (u = m[(f = J)].points)[c - 1]),
                        (y = (h = u[c]).partialLength),
                        (l = 0)),
                      (Y = H = Z = tt = ''),
                      (et = this.defaultPropsArray);
                  else {
                    if (this._hasMaskedPath) {
                      if (Q !== A[s].line) {
                        switch (t.j) {
                          case 1:
                            o += g - t.lineWidths[A[s].line];
                            break;
                          case 2:
                            o += (g - t.lineWidths[A[s].line]) / 2;
                        }
                        Q = A[s].line;
                      }
                      X !== A[s].ind &&
                        (A[X] && (o += A[X].extra),
                        (o += A[s].an / 2),
                        (X = A[s].ind)),
                        (o += (S[0] * A[s].an) / 200);
                      var ot = 0;
                      for (F = 0; F < M; F += 1)
                        (I = P[F].a).p.propType &&
                          ((L = P[F].s.getMult(
                            A[s].anIndexes[F],
                            x.a[F].s.totalChars
                          )).length
                            ? (ot += I.p.v[0] * L[0])
                            : (ot += I.p.v[0] * L)),
                          I.a.propType &&
                            ((L = P[F].s.getMult(
                              A[s].anIndexes[F],
                              x.a[F].s.totalChars
                            )).length
                              ? (ot += I.a.v[0] * L[0])
                              : (ot += I.a.v[0] * L));
                      for (p = !0; p; )
                        l + y >= o + ot || !u
                          ? ((v = (o + ot - l) / h.partialLength),
                            (N = d.point[0] + (h.point[0] - d.point[0]) * v),
                            (B = d.point[1] + (h.point[1] - d.point[1]) * v),
                            k.translate(
                              (-S[0] * A[s].an) / 200,
                              (-S[1] * R) / 100
                            ),
                            (p = !1))
                          : u &&
                            ((l += h.partialLength),
                            (c += 1) >= u.length &&
                              ((c = 0),
                              m[(f += 1)]
                                ? (u = m[f].points)
                                : b.v.c
                                ? ((c = 0), (u = m[(f = 0)].points))
                                : ((l -= h.partialLength), (u = null))),
                            u && ((d = h), (y = (h = u[c]).partialLength)));
                      (O = A[s].an / 2 - A[s].add), k.translate(-O, 0, 0);
                    } else
                      (O = A[s].an / 2 - A[s].add),
                        k.translate(-O, 0, 0),
                        k.translate(
                          (-S[0] * A[s].an) / 200,
                          (-S[1] * R) / 100,
                          0
                        );
                    for (A[s].l / 2, F = 0; F < M; F += 1)
                      (I = P[F].a).t.propType &&
                        ((L = P[F].s.getMult(
                          A[s].anIndexes[F],
                          x.a[F].s.totalChars
                        )),
                        (0 === r && 0 === t.j) ||
                          (this._hasMaskedPath
                            ? L.length
                              ? (o += I.t.v * L[0])
                              : (o += I.t.v * L)
                            : L.length
                            ? (r += I.t.v * L[0])
                            : (r += I.t.v * L)));
                    for (
                      A[s].l / 2,
                        t.strokeWidthAnim && (j = t.sw || 0),
                        t.strokeColorAnim &&
                          (G = t.sc ? [t.sc[0], t.sc[1], t.sc[2]] : [0, 0, 0]),
                        t.fillColorAnim &&
                          t.fc &&
                          (U = [t.fc[0], t.fc[1], t.fc[2]]),
                        F = 0;
                      F < M;
                      F += 1
                    )
                      (I = P[F].a).a.propType &&
                        ((L = P[F].s.getMult(
                          A[s].anIndexes[F],
                          x.a[F].s.totalChars
                        )).length
                          ? k.translate(
                              -I.a.v[0] * L[0],
                              -I.a.v[1] * L[1],
                              I.a.v[2] * L[2]
                            )
                          : k.translate(
                              -I.a.v[0] * L,
                              -I.a.v[1] * L,
                              I.a.v[2] * L
                            ));
                    for (F = 0; F < M; F += 1)
                      (I = P[F].a).s.propType &&
                        ((L = P[F].s.getMult(
                          A[s].anIndexes[F],
                          x.a[F].s.totalChars
                        )).length
                          ? k.scale(
                              1 + (I.s.v[0] - 1) * L[0],
                              1 + (I.s.v[1] - 1) * L[1],
                              1
                            )
                          : k.scale(
                              1 + (I.s.v[0] - 1) * L,
                              1 + (I.s.v[1] - 1) * L,
                              1
                            ));
                    for (F = 0; F < M; F += 1) {
                      if (
                        ((I = P[F].a),
                        (L = P[F].s.getMult(
                          A[s].anIndexes[F],
                          x.a[F].s.totalChars
                        )),
                        I.sk.propType &&
                          (L.length
                            ? k.skewFromAxis(-I.sk.v * L[0], I.sa.v * L[1])
                            : k.skewFromAxis(-I.sk.v * L, I.sa.v * L)),
                        I.r.propType &&
                          (L.length
                            ? k.rotateZ(-I.r.v * L[2])
                            : k.rotateZ(-I.r.v * L)),
                        I.ry.propType &&
                          (L.length
                            ? k.rotateY(I.ry.v * L[1])
                            : k.rotateY(I.ry.v * L)),
                        I.rx.propType &&
                          (L.length
                            ? k.rotateX(I.rx.v * L[0])
                            : k.rotateX(I.rx.v * L)),
                        I.o.propType &&
                          (L.length
                            ? (V += (I.o.v * L[0] - V) * L[0])
                            : (V += (I.o.v * L - V) * L)),
                        t.strokeWidthAnim &&
                          I.sw.propType &&
                          (L.length ? (j += I.sw.v * L[0]) : (j += I.sw.v * L)),
                        t.strokeColorAnim && I.sc.propType)
                      )
                        for (W = 0; W < 3; W += 1)
                          L.length
                            ? (G[W] = G[W] + (I.sc.v[W] - G[W]) * L[0])
                            : (G[W] = G[W] + (I.sc.v[W] - G[W]) * L);
                      if (t.fillColorAnim && t.fc) {
                        if (I.fc.propType)
                          for (W = 0; W < 3; W += 1)
                            L.length
                              ? (U[W] = U[W] + (I.fc.v[W] - U[W]) * L[0])
                              : (U[W] = U[W] + (I.fc.v[W] - U[W]) * L);
                        I.fh.propType &&
                          (U = L.length
                            ? addHueToRGB(U, I.fh.v * L[0])
                            : addHueToRGB(U, I.fh.v * L)),
                          I.fs.propType &&
                            (U = L.length
                              ? addSaturationToRGB(U, I.fs.v * L[0])
                              : addSaturationToRGB(U, I.fs.v * L)),
                          I.fb.propType &&
                            (U = L.length
                              ? addBrightnessToRGB(U, I.fb.v * L[0])
                              : addBrightnessToRGB(U, I.fb.v * L));
                      }
                    }
                    for (F = 0; F < M; F += 1)
                      (I = P[F].a).p.propType &&
                        ((L = P[F].s.getMult(
                          A[s].anIndexes[F],
                          x.a[F].s.totalChars
                        )),
                        this._hasMaskedPath
                          ? L.length
                            ? k.translate(0, I.p.v[1] * L[0], -I.p.v[2] * L[1])
                            : k.translate(0, I.p.v[1] * L, -I.p.v[2] * L)
                          : L.length
                          ? k.translate(
                              I.p.v[0] * L[0],
                              I.p.v[1] * L[1],
                              -I.p.v[2] * L[2]
                            )
                          : k.translate(
                              I.p.v[0] * L,
                              I.p.v[1] * L,
                              -I.p.v[2] * L
                            ));
                    if (
                      (t.strokeWidthAnim && (H = j < 0 ? 0 : j),
                      t.strokeColorAnim &&
                        (q =
                          'rgb(' +
                          Math.round(255 * G[0]) +
                          ',' +
                          Math.round(255 * G[1]) +
                          ',' +
                          Math.round(255 * G[2]) +
                          ')'),
                      t.fillColorAnim &&
                        t.fc &&
                        (Z =
                          'rgb(' +
                          Math.round(255 * U[0]) +
                          ',' +
                          Math.round(255 * U[1]) +
                          ',' +
                          Math.round(255 * U[2]) +
                          ')'),
                      this._hasMaskedPath)
                    ) {
                      if (
                        (k.translate(0, -t.ls),
                        k.translate(0, (S[1] * R) / 100 + i, 0),
                        x.p.p)
                      ) {
                        _ =
                          (h.point[1] - d.point[1]) / (h.point[0] - d.point[0]);
                        var ht = (180 * Math.atan(_)) / Math.PI;
                        h.point[0] < d.point[0] && (ht += 180),
                          k.rotate((-ht * Math.PI) / 180);
                      }
                      k.translate(N, B, 0),
                        (o -= (S[0] * A[s].an) / 200),
                        A[s + 1] &&
                          X !== A[s + 1].ind &&
                          ((o += A[s].an / 2),
                          (o += (t.tr / 1e3) * t.finalSize));
                    } else {
                      switch (
                        (k.translate(r, i, 0),
                        t.ps && k.translate(t.ps[0], t.ps[1] + t.ascent, 0),
                        t.j)
                      ) {
                        case 1:
                          k.translate(
                            A[s].animatorJustifyOffset +
                              t.justifyOffset +
                              (t.boxWidth - t.lineWidths[A[s].line]),
                            0,
                            0
                          );
                          break;
                        case 2:
                          k.translate(
                            A[s].animatorJustifyOffset +
                              t.justifyOffset +
                              (t.boxWidth - t.lineWidths[A[s].line]) / 2,
                            0,
                            0
                          );
                      }
                      k.translate(0, -t.ls),
                        k.translate(O, 0, 0),
                        k.translate(
                          (S[0] * A[s].an) / 200,
                          (S[1] * R) / 100,
                          0
                        ),
                        (r += A[s].l + (t.tr / 1e3) * t.finalSize);
                    }
                    'html' === w
                      ? (tt = k.toCSS())
                      : 'svg' === w
                      ? (tt = k.to2dCSS())
                      : (et = [
                          k.props[0],
                          k.props[1],
                          k.props[2],
                          k.props[3],
                          k.props[4],
                          k.props[5],
                          k.props[6],
                          k.props[7],
                          k.props[8],
                          k.props[9],
                          k.props[10],
                          k.props[11],
                          k.props[12],
                          k.props[13],
                          k.props[14],
                          k.props[15],
                        ]),
                      (Y = V);
                  }
                  E <= s
                    ? ((D = new LetterProps(Y, H, q, Z, tt, et)),
                      this.renderedLetters.push(D),
                      (E += 1),
                      (this.lettersChangedFlag = !0))
                    : ((D = this.renderedLetters[s]),
                      (this.lettersChangedFlag =
                        D.update(Y, H, q, Z, tt, et) ||
                        this.lettersChangedFlag));
                }
              }
            }),
            (TextAnimatorProperty.prototype.getValue = function () {
              this._elem.globalData.frameId !== this._frameId &&
                ((this._frameId = this._elem.globalData.frameId),
                this.iterateDynamicProperties());
            }),
            (TextAnimatorProperty.prototype.mHelper = new Matrix()),
            (TextAnimatorProperty.prototype.defaultPropsArray = []),
            extendPrototype([DynamicPropertyContainer], TextAnimatorProperty),
            (LetterProps.prototype.update = function (t, e, r, i, s, n) {
              (this._mdf.o = !1),
                (this._mdf.sw = !1),
                (this._mdf.sc = !1),
                (this._mdf.fc = !1),
                (this._mdf.m = !1),
                (this._mdf.p = !1);
              var a = !1;
              return (
                this.o !== t && ((this.o = t), (this._mdf.o = !0), (a = !0)),
                this.sw !== e && ((this.sw = e), (this._mdf.sw = !0), (a = !0)),
                this.sc !== r && ((this.sc = r), (this._mdf.sc = !0), (a = !0)),
                this.fc !== i && ((this.fc = i), (this._mdf.fc = !0), (a = !0)),
                this.m !== s && ((this.m = s), (this._mdf.m = !0), (a = !0)),
                !n.length ||
                  (this.p[0] === n[0] &&
                    this.p[1] === n[1] &&
                    this.p[4] === n[4] &&
                    this.p[5] === n[5] &&
                    this.p[12] === n[12] &&
                    this.p[13] === n[13]) ||
                  ((this.p = n), (this._mdf.p = !0), (a = !0)),
                a
              );
            }),
            (TextProperty.prototype.defaultBoxWidth = [0, 0]),
            (TextProperty.prototype.copyData = function (t, e) {
              for (var r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
              return t;
            }),
            (TextProperty.prototype.setCurrentData = function (t) {
              t.__complete || this.completeTextData(t),
                (this.currentData = t),
                (this.currentData.boxWidth =
                  this.currentData.boxWidth || this.defaultBoxWidth),
                (this._mdf = !0);
            }),
            (TextProperty.prototype.searchProperty = function () {
              return this.searchKeyframes();
            }),
            (TextProperty.prototype.searchKeyframes = function () {
              return (
                (this.kf = this.data.d.k.length > 1),
                this.kf && this.addEffect(this.getKeyframeValue.bind(this)),
                this.kf
              );
            }),
            (TextProperty.prototype.addEffect = function (t) {
              this.effectsSequence.push(t), this.elem.addDynamicProperty(this);
            }),
            (TextProperty.prototype.getValue = function (t) {
              if (
                (this.elem.globalData.frameId !== this.frameId &&
                  this.effectsSequence.length) ||
                t
              ) {
                this.currentData.t = this.data.d.k[this.keysIndex].s.t;
                var e = this.currentData,
                  r = this.keysIndex;
                if (this.lock) this.setCurrentData(this.currentData);
                else {
                  (this.lock = !0), (this._mdf = !1);
                  var i,
                    s = this.effectsSequence.length,
                    n = t || this.data.d.k[this.keysIndex].s;
                  for (i = 0; i < s; i += 1)
                    n =
                      r !== this.keysIndex
                        ? this.effectsSequence[i](n, n.t)
                        : this.effectsSequence[i](this.currentData, n.t);
                  e !== n && this.setCurrentData(n),
                    (this.pv = this.v = this.currentData),
                    (this.lock = !1),
                    (this.frameId = this.elem.globalData.frameId);
                }
              }
            }),
            (TextProperty.prototype.getKeyframeValue = function () {
              for (
                var t = this.data.d.k,
                  e = this.elem.comp.renderedFrame,
                  r = 0,
                  i = t.length;
                r <= i - 1 && (t[r].s, !(r === i - 1 || t[r + 1].t > e));

              )
                r += 1;
              return (
                this.keysIndex !== r && (this.keysIndex = r),
                this.data.d.k[this.keysIndex].s
              );
            }),
            (TextProperty.prototype.buildFinalText = function (t) {
              for (
                var e,
                  r = FontManager.getCombinedCharacterCodes(),
                  i = [],
                  s = 0,
                  n = t.length;
                s < n;

              )
                (e = t.charCodeAt(s)),
                  -1 !== r.indexOf(e)
                    ? (i[i.length - 1] += t.charAt(s))
                    : e >= 55296 &&
                      e <= 56319 &&
                      (e = t.charCodeAt(s + 1)) >= 56320 &&
                      e <= 57343
                    ? (i.push(t.substr(s, 2)), ++s)
                    : i.push(t.charAt(s)),
                  (s += 1);
              return i;
            }),
            (TextProperty.prototype.completeTextData = function (t) {
              t.__complete = !0;
              var e,
                r,
                i,
                s,
                n,
                a,
                o,
                h = this.elem.globalData.fontManager,
                l = this.data,
                p = [],
                c = 0,
                f = l.m.g,
                d = 0,
                u = 0,
                m = 0,
                y = [],
                g = 0,
                v = 0,
                _ = h.getFontByName(t.f),
                b = 0,
                S = _.fStyle ? _.fStyle.split(' ') : [],
                P = 'normal',
                x = 'normal';
              for (r = S.length, e = 0; e < r; e += 1)
                switch (S[e].toLowerCase()) {
                  case 'italic':
                    x = 'italic';
                    break;
                  case 'bold':
                    P = '700';
                    break;
                  case 'black':
                    P = '900';
                    break;
                  case 'medium':
                    P = '500';
                    break;
                  case 'regular':
                  case 'normal':
                    P = '400';
                    break;
                  case 'light':
                  case 'thin':
                    P = '200';
                }
              (t.fWeight = _.fWeight || P),
                (t.fStyle = x),
                (t.finalSize = t.s),
                (t.finalText = this.buildFinalText(t.t)),
                (r = t.finalText.length),
                (t.finalLineHeight = t.lh);
              var k,
                w = (t.tr / 1e3) * t.finalSize;
              if (t.sz)
                for (var E, A, T = !0, C = t.sz[0], I = t.sz[1]; T; ) {
                  (E = 0),
                    (g = 0),
                    (r = (A = this.buildFinalText(t.t)).length),
                    (w = (t.tr / 1e3) * t.finalSize);
                  var F = -1;
                  for (e = 0; e < r; e += 1)
                    (k = A[e].charCodeAt(0)),
                      (i = !1),
                      ' ' === A[e]
                        ? (F = e)
                        : (13 !== k && 3 !== k) ||
                          ((g = 0),
                          (i = !0),
                          (E += t.finalLineHeight || 1.2 * t.finalSize)),
                      h.chars
                        ? ((o = h.getCharData(A[e], _.fStyle, _.fFamily)),
                          (b = i ? 0 : (o.w * t.finalSize) / 100))
                        : (b = h.measureText(A[e], t.f, t.finalSize)),
                      g + b > C && ' ' !== A[e]
                        ? (-1 === F ? (r += 1) : (e = F),
                          (E += t.finalLineHeight || 1.2 * t.finalSize),
                          A.splice(e, F === e ? 1 : 0, '\r'),
                          (F = -1),
                          (g = 0))
                        : ((g += b), (g += w));
                  (E += (_.ascent * t.finalSize) / 100),
                    this.canResize &&
                    t.finalSize > this.minimumFontSize &&
                    I < E
                      ? ((t.finalSize -= 1),
                        (t.finalLineHeight = (t.finalSize * t.lh) / t.s))
                      : ((t.finalText = A), (r = t.finalText.length), (T = !1));
                }
              (g = -w), (b = 0);
              var M,
                D = 0;
              for (e = 0; e < r; e += 1)
                if (
                  ((i = !1),
                  13 === (k = (M = t.finalText[e]).charCodeAt(0)) || 3 === k
                    ? ((D = 0),
                      y.push(g),
                      (v = g > v ? g : v),
                      (g = -2 * w),
                      (s = ''),
                      (i = !0),
                      (m += 1))
                    : (s = M),
                  h.chars
                    ? ((o = h.getCharData(
                        M,
                        _.fStyle,
                        h.getFontByName(t.f).fFamily
                      )),
                      (b = i ? 0 : (o.w * t.finalSize) / 100))
                    : (b = h.measureText(s, t.f, t.finalSize)),
                  ' ' === M ? (D += b + w) : ((g += b + w + D), (D = 0)),
                  p.push({
                    l: b,
                    an: b,
                    add: d,
                    n: i,
                    anIndexes: [],
                    val: s,
                    line: m,
                    animatorJustifyOffset: 0,
                  }),
                  2 == f)
                ) {
                  if (((d += b), '' === s || ' ' === s || e === r - 1)) {
                    for (('' !== s && ' ' !== s) || (d -= b); u <= e; )
                      (p[u].an = d), (p[u].ind = c), (p[u].extra = b), (u += 1);
                    (c += 1), (d = 0);
                  }
                } else if (3 == f) {
                  if (((d += b), '' === s || e === r - 1)) {
                    for ('' === s && (d -= b); u <= e; )
                      (p[u].an = d), (p[u].ind = c), (p[u].extra = b), (u += 1);
                    (d = 0), (c += 1);
                  }
                } else (p[c].ind = c), (p[c].extra = 0), (c += 1);
              if (((t.l = p), (v = g > v ? g : v), y.push(g), t.sz))
                (t.boxWidth = t.sz[0]), (t.justifyOffset = 0);
              else
                switch (((t.boxWidth = v), t.j)) {
                  case 1:
                    t.justifyOffset = -t.boxWidth;
                    break;
                  case 2:
                    t.justifyOffset = -t.boxWidth / 2;
                    break;
                  default:
                    t.justifyOffset = 0;
                }
              t.lineWidths = y;
              var R,
                z,
                L = l.a;
              a = L.length;
              var O,
                N,
                B = [];
              for (n = 0; n < a; n += 1) {
                for (
                  (R = L[n]).a.sc && (t.strokeColorAnim = !0),
                    R.a.sw && (t.strokeWidthAnim = !0),
                    (R.a.fc || R.a.fh || R.a.fs || R.a.fb) &&
                      (t.fillColorAnim = !0),
                    N = 0,
                    O = R.s.b,
                    e = 0;
                  e < r;
                  e += 1
                )
                  ((z = p[e]).anIndexes[n] = N),
                    ((1 == O && '' !== z.val) ||
                      (2 == O && '' !== z.val && ' ' !== z.val) ||
                      (3 == O && (z.n || ' ' == z.val || e == r - 1)) ||
                      (4 == O && (z.n || e == r - 1))) &&
                      (1 === R.s.rn && B.push(N), (N += 1));
                l.a[n].s.totalChars = N;
                var V,
                  G = -1;
                if (1 === R.s.rn)
                  for (e = 0; e < r; e += 1)
                    G != (z = p[e]).anIndexes[n] &&
                      ((G = z.anIndexes[n]),
                      (V = B.splice(
                        Math.floor(Math.random() * B.length),
                        1
                      )[0])),
                      (z.anIndexes[n] = V);
              }
              (t.yOffset = t.finalLineHeight || 1.2 * t.finalSize),
                (t.ls = t.ls || 0),
                (t.ascent = (_.ascent * t.finalSize) / 100);
            }),
            (TextProperty.prototype.updateDocumentData = function (t, e) {
              e = void 0 === e ? this.keysIndex : e;
              var r = this.copyData({}, this.data.d.k[e].s);
              (r = this.copyData(r, t)),
                (this.data.d.k[e].s = r),
                this.recalculate(e),
                this.elem.addDynamicProperty(this);
            }),
            (TextProperty.prototype.recalculate = function (t) {
              var e = this.data.d.k[t].s;
              (e.__complete = !1),
                (this.keysIndex = 0),
                (this._isFirstFrame = !0),
                this.getValue(e);
            }),
            (TextProperty.prototype.canResizeFont = function (t) {
              (this.canResize = t),
                this.recalculate(this.keysIndex),
                this.elem.addDynamicProperty(this);
            }),
            (TextProperty.prototype.setMinimumFontSize = function (t) {
              (this.minimumFontSize = Math.floor(t) || 1),
                this.recalculate(this.keysIndex),
                this.elem.addDynamicProperty(this);
            });
          var TextSelectorProp = (function () {
              var t = Math.max,
                e = Math.min,
                r = Math.floor;
              function i(t, e) {
                (this._currentTextLength = -1),
                  (this.k = !1),
                  (this.data = e),
                  (this.elem = t),
                  (this.comp = t.comp),
                  (this.finalS = 0),
                  (this.finalE = 0),
                  this.initDynamicPropertyContainer(t),
                  (this.s = PropertyFactory.getProp(
                    t,
                    e.s || { k: 0 },
                    0,
                    0,
                    this
                  )),
                  (this.e =
                    'e' in e
                      ? PropertyFactory.getProp(t, e.e, 0, 0, this)
                      : { v: 100 }),
                  (this.o = PropertyFactory.getProp(
                    t,
                    e.o || { k: 0 },
                    0,
                    0,
                    this
                  )),
                  (this.xe = PropertyFactory.getProp(
                    t,
                    e.xe || { k: 0 },
                    0,
                    0,
                    this
                  )),
                  (this.ne = PropertyFactory.getProp(
                    t,
                    e.ne || { k: 0 },
                    0,
                    0,
                    this
                  )),
                  (this.a = PropertyFactory.getProp(t, e.a, 0, 0.01, this)),
                  this.dynamicProperties.length || this.getValue();
              }
              return (
                (i.prototype = {
                  getMult: function (i) {
                    this._currentTextLength !==
                      this.elem.textProperty.currentData.l.length &&
                      this.getValue();
                    var s = 0,
                      n = 0,
                      a = 1,
                      o = 1;
                    this.ne.v > 0
                      ? (s = this.ne.v / 100)
                      : (n = -this.ne.v / 100),
                      this.xe.v > 0
                        ? (a = 1 - this.xe.v / 100)
                        : (o = 1 + this.xe.v / 100);
                    var h = BezierFactory.getBezierEasing(s, n, a, o).get,
                      l = 0,
                      p = this.finalS,
                      c = this.finalE,
                      f = this.data.sh;
                    if (2 === f)
                      l = h(
                        (l =
                          c === p
                            ? i >= c
                              ? 1
                              : 0
                            : t(0, e(0.5 / (c - p) + (i - p) / (c - p), 1)))
                      );
                    else if (3 === f)
                      l = h(
                        (l =
                          c === p
                            ? i >= c
                              ? 0
                              : 1
                            : 1 - t(0, e(0.5 / (c - p) + (i - p) / (c - p), 1)))
                      );
                    else if (4 === f)
                      c === p
                        ? (l = 0)
                        : (l = t(0, e(0.5 / (c - p) + (i - p) / (c - p), 1))) <
                          0.5
                        ? (l *= 2)
                        : (l = 1 - 2 * (l - 0.5)),
                        (l = h(l));
                    else if (5 === f) {
                      if (c === p) l = 0;
                      else {
                        var d = c - p,
                          u = -d / 2 + (i = e(t(0, i + 0.5 - p), c - p)),
                          m = d / 2;
                        l = Math.sqrt(1 - (u * u) / (m * m));
                      }
                      l = h(l);
                    } else
                      6 === f
                        ? (c === p
                            ? (l = 0)
                            : ((i = e(t(0, i + 0.5 - p), c - p)),
                              (l =
                                (1 +
                                  Math.cos(
                                    Math.PI + (2 * Math.PI * i) / (c - p)
                                  )) /
                                2)),
                          (l = h(l)))
                        : (i >= r(p) &&
                            (l = t(
                              0,
                              e(i - p < 0 ? e(c, 1) - (p - i) : c - i, 1)
                            )),
                          (l = h(l)));
                    return l * this.a.v;
                  },
                  getValue: function (t) {
                    this.iterateDynamicProperties(),
                      (this._mdf = t || this._mdf),
                      (this._currentTextLength =
                        this.elem.textProperty.currentData.l.length || 0),
                      t &&
                        2 === this.data.r &&
                        (this.e.v = this._currentTextLength);
                    var e = 2 === this.data.r ? 1 : 100 / this.data.totalChars,
                      r = this.o.v / e,
                      i = this.s.v / e + r,
                      s = this.e.v / e + r;
                    if (i > s) {
                      var n = i;
                      (i = s), (s = n);
                    }
                    (this.finalS = i), (this.finalE = s);
                  },
                }),
                extendPrototype([DynamicPropertyContainer], i),
                {
                  getTextSelectorProp: function (t, e, r) {
                    return new i(t, e, r);
                  },
                }
              );
            })(),
            pool_factory = function (t, e, r, i) {
              var s = 0,
                n = t,
                a = createSizedArray(n);
              return {
                newElement: function () {
                  return s ? a[(s -= 1)] : e();
                },
                release: function (t) {
                  s === n && ((a = pooling.double(a)), (n *= 2)),
                    r && r(t),
                    (a[s] = t),
                    (s += 1);
                },
              };
            },
            pooling = {
              double: function (t) {
                return t.concat(createSizedArray(t.length));
              },
            },
            point_pool = pool_factory(8, function () {
              return createTypedArray('float32', 2);
            }),
            shape_pool =
              ((factory = pool_factory(
                4,
                function () {
                  return new ShapePath();
                },
                function (t) {
                  var e,
                    r = t._length;
                  for (e = 0; e < r; e += 1)
                    point_pool.release(t.v[e]),
                      point_pool.release(t.i[e]),
                      point_pool.release(t.o[e]),
                      (t.v[e] = null),
                      (t.i[e] = null),
                      (t.o[e] = null);
                  (t._length = 0), (t.c = !1);
                }
              )),
              (factory.clone = function (t) {
                var e,
                  r = factory.newElement(),
                  i = void 0 === t._length ? t.v.length : t._length;
                for (r.setLength(i), r.c = t.c, e = 0; e < i; e += 1)
                  r.setTripleAt(
                    t.v[e][0],
                    t.v[e][1],
                    t.o[e][0],
                    t.o[e][1],
                    t.i[e][0],
                    t.i[e][1],
                    e
                  );
                return r;
              }),
              factory),
            factory,
            shapeCollection_pool = (function () {
              var t = {
                  newShapeCollection: function () {
                    var t;
                    t = e ? i[(e -= 1)] : new ShapeCollection();
                    return t;
                  },
                  release: function (t) {
                    var s,
                      n = t._length;
                    for (s = 0; s < n; s += 1) shape_pool.release(t.shapes[s]);
                    (t._length = 0),
                      e === r && ((i = pooling.double(i)), (r *= 2));
                    (i[e] = t), (e += 1);
                  },
                },
                e = 0,
                r = 4,
                i = createSizedArray(r);
              return t;
            })(),
            segments_length_pool = pool_factory(
              8,
              function () {
                return { lengths: [], totalLength: 0 };
              },
              function (t) {
                var e,
                  r = t.lengths.length;
                for (e = 0; e < r; e += 1)
                  bezier_length_pool.release(t.lengths[e]);
                t.lengths.length = 0;
              }
            ),
            bezier_length_pool = pool_factory(8, function () {
              return {
                addedLength: 0,
                percents: createTypedArray('float32', defaultCurveSegments),
                lengths: createTypedArray('float32', defaultCurveSegments),
              };
            });
          function BaseRenderer() {}
          function SVGRenderer(t, e) {
            (this.animationItem = t),
              (this.layers = null),
              (this.renderedFrame = -1),
              (this.svgElement = createNS('svg'));
            var r = '';
            if (e && e.title) {
              var i = createNS('title'),
                s = createElementID();
              i.setAttribute('id', s),
                (i.textContent = e.title),
                this.svgElement.appendChild(i),
                (r += s);
            }
            if (e && e.description) {
              var n = createNS('desc'),
                a = createElementID();
              n.setAttribute('id', a),
                (n.textContent = e.description),
                this.svgElement.appendChild(n),
                (r += ' ' + a);
            }
            r && this.svgElement.setAttribute('aria-labelledby', r);
            var o = createNS('defs');
            this.svgElement.appendChild(o);
            var h = createNS('g');
            this.svgElement.appendChild(h),
              (this.layerElement = h),
              (this.renderConfig = {
                preserveAspectRatio:
                  (e && e.preserveAspectRatio) || 'xMidYMid meet',
                imagePreserveAspectRatio:
                  (e && e.imagePreserveAspectRatio) || 'xMidYMid slice',
                progressiveLoad: (e && e.progressiveLoad) || !1,
                hideOnTransparent: !e || !1 !== e.hideOnTransparent,
                viewBoxOnly: (e && e.viewBoxOnly) || !1,
                viewBoxSize: (e && e.viewBoxSize) || !1,
                className: (e && e.className) || '',
                id: (e && e.id) || '',
                focusable: e && e.focusable,
                filterSize: {
                  width: (e && e.filterSize && e.filterSize.width) || '100%',
                  height: (e && e.filterSize && e.filterSize.height) || '100%',
                  x: (e && e.filterSize && e.filterSize.x) || '0%',
                  y: (e && e.filterSize && e.filterSize.y) || '0%',
                },
              }),
              (this.globalData = {
                _mdf: !1,
                frameNum: -1,
                defs: o,
                renderConfig: this.renderConfig,
              }),
              (this.elements = []),
              (this.pendingElements = []),
              (this.destroyed = !1),
              (this.rendererType = 'svg');
          }
          function MaskElement(t, e, r) {
            (this.data = t),
              (this.element = e),
              (this.globalData = r),
              (this.storedData = []),
              (this.masksProperties = this.data.masksProperties || []),
              (this.maskElement = null);
            var i,
              s = this.globalData.defs,
              n = this.masksProperties ? this.masksProperties.length : 0;
            (this.viewData = createSizedArray(n)), (this.solidPath = '');
            var a,
              o,
              h,
              l,
              p,
              c,
              f,
              d = this.masksProperties,
              u = 0,
              m = [],
              y = createElementID(),
              g = 'clipPath',
              v = 'clip-path';
            for (i = 0; i < n; i++)
              if (
                ((('a' !== d[i].mode && 'n' !== d[i].mode) ||
                  d[i].inv ||
                  100 !== d[i].o.k ||
                  d[i].o.x) &&
                  ((g = 'mask'), (v = 'mask')),
                ('s' != d[i].mode && 'i' != d[i].mode) || 0 !== u
                  ? (l = null)
                  : ((l = createNS('rect')).setAttribute('fill', '#ffffff'),
                    l.setAttribute('width', this.element.comp.data.w || 0),
                    l.setAttribute('height', this.element.comp.data.h || 0),
                    m.push(l)),
                (a = createNS('path')),
                'n' != d[i].mode)
              ) {
                var _;
                if (
                  ((u += 1),
                  a.setAttribute(
                    'fill',
                    's' === d[i].mode ? '#000000' : '#ffffff'
                  ),
                  a.setAttribute('clip-rule', 'nonzero'),
                  0 !== d[i].x.k
                    ? ((g = 'mask'),
                      (v = 'mask'),
                      (f = PropertyFactory.getProp(
                        this.element,
                        d[i].x,
                        0,
                        null,
                        this.element
                      )),
                      (_ = createElementID()),
                      (p = createNS('filter')).setAttribute('id', _),
                      (c = createNS('feMorphology')).setAttribute(
                        'operator',
                        'erode'
                      ),
                      c.setAttribute('in', 'SourceGraphic'),
                      c.setAttribute('radius', '0'),
                      p.appendChild(c),
                      s.appendChild(p),
                      a.setAttribute(
                        'stroke',
                        's' === d[i].mode ? '#000000' : '#ffffff'
                      ))
                    : ((c = null), (f = null)),
                  (this.storedData[i] = {
                    elem: a,
                    x: f,
                    expan: c,
                    lastPath: '',
                    lastOperator: '',
                    filterId: _,
                    lastRadius: 0,
                  }),
                  'i' == d[i].mode)
                ) {
                  h = m.length;
                  var b = createNS('g');
                  for (o = 0; o < h; o += 1) b.appendChild(m[o]);
                  var S = createNS('mask');
                  S.setAttribute('mask-type', 'alpha'),
                    S.setAttribute('id', y + '_' + u),
                    S.appendChild(a),
                    s.appendChild(S),
                    b.setAttribute(
                      'mask',
                      'url(' + locationHref + '#' + y + '_' + u + ')'
                    ),
                    (m.length = 0),
                    m.push(b);
                } else m.push(a);
                d[i].inv &&
                  !this.solidPath &&
                  (this.solidPath = this.createLayerSolidPath()),
                  (this.viewData[i] = {
                    elem: a,
                    lastPath: '',
                    op: PropertyFactory.getProp(
                      this.element,
                      d[i].o,
                      0,
                      0.01,
                      this.element
                    ),
                    prop: ShapePropertyFactory.getShapeProp(
                      this.element,
                      d[i],
                      3
                    ),
                    invRect: l,
                  }),
                  this.viewData[i].prop.k ||
                    this.drawPath(
                      d[i],
                      this.viewData[i].prop.v,
                      this.viewData[i]
                    );
              } else
                (this.viewData[i] = {
                  op: PropertyFactory.getProp(
                    this.element,
                    d[i].o,
                    0,
                    0.01,
                    this.element
                  ),
                  prop: ShapePropertyFactory.getShapeProp(
                    this.element,
                    d[i],
                    3
                  ),
                  elem: a,
                  lastPath: '',
                }),
                  s.appendChild(a);
            for (
              this.maskElement = createNS(g), n = m.length, i = 0;
              i < n;
              i += 1
            )
              this.maskElement.appendChild(m[i]);
            u > 0 &&
              (this.maskElement.setAttribute('id', y),
              this.element.maskedElement.setAttribute(
                v,
                'url(' + locationHref + '#' + y + ')'
              ),
              s.appendChild(this.maskElement)),
              this.viewData.length && this.element.addRenderableComponent(this);
          }
          function HierarchyElement() {}
          function FrameElement() {}
          function TransformElement() {}
          function RenderableElement() {}
          function RenderableDOMElement() {}
          function ProcessedElement(t, e) {
            (this.elem = t), (this.pos = e);
          }
          function SVGStyleData(t, e) {
            (this.data = t),
              (this.type = t.ty),
              (this.d = ''),
              (this.lvl = e),
              (this._mdf = !1),
              (this.closed = !0 === t.hd),
              (this.pElem = createNS('path')),
              (this.msElem = null);
          }
          function SVGShapeData(t, e, r) {
            (this.caches = []),
              (this.styles = []),
              (this.transformers = t),
              (this.lStr = ''),
              (this.sh = r),
              (this.lvl = e),
              (this._isAnimated = !!r.k);
            for (var i = 0, s = t.length; i < s; ) {
              if (t[i].mProps.dynamicProperties.length) {
                this._isAnimated = !0;
                break;
              }
              i += 1;
            }
          }
          function SVGTransformData(t, e, r) {
            (this.transform = { mProps: t, op: e, container: r }),
              (this.elements = []),
              (this._isAnimated =
                this.transform.mProps.dynamicProperties.length ||
                this.transform.op.effectsSequence.length);
          }
          function SVGStrokeStyleData(t, e, r) {
            this.initDynamicPropertyContainer(t),
              (this.getValue = this.iterateDynamicProperties),
              (this.o = PropertyFactory.getProp(t, e.o, 0, 0.01, this)),
              (this.w = PropertyFactory.getProp(t, e.w, 0, null, this)),
              (this.d = new DashProperty(t, e.d || {}, 'svg', this)),
              (this.c = PropertyFactory.getProp(t, e.c, 1, 255, this)),
              (this.style = r),
              (this._isAnimated = !!this._isAnimated);
          }
          function SVGFillStyleData(t, e, r) {
            this.initDynamicPropertyContainer(t),
              (this.getValue = this.iterateDynamicProperties),
              (this.o = PropertyFactory.getProp(t, e.o, 0, 0.01, this)),
              (this.c = PropertyFactory.getProp(t, e.c, 1, 255, this)),
              (this.style = r);
          }
          function SVGGradientFillStyleData(t, e, r) {
            this.initDynamicPropertyContainer(t),
              (this.getValue = this.iterateDynamicProperties),
              this.initGradientData(t, e, r);
          }
          function SVGGradientStrokeStyleData(t, e, r) {
            this.initDynamicPropertyContainer(t),
              (this.getValue = this.iterateDynamicProperties),
              (this.w = PropertyFactory.getProp(t, e.w, 0, null, this)),
              (this.d = new DashProperty(t, e.d || {}, 'svg', this)),
              this.initGradientData(t, e, r),
              (this._isAnimated = !!this._isAnimated);
          }
          function ShapeGroupData() {
            (this.it = []), (this.prevViewData = []), (this.gr = createNS('g'));
          }
          (BaseRenderer.prototype.checkLayers = function (t) {
            var e,
              r,
              i = this.layers.length;
            for (this.completeLayers = !0, e = i - 1; e >= 0; e--)
              this.elements[e] ||
                ((r = this.layers[e]).ip - r.st <= t - this.layers[e].st &&
                  r.op - r.st > t - this.layers[e].st &&
                  this.buildItem(e)),
                (this.completeLayers =
                  !!this.elements[e] && this.completeLayers);
            this.checkPendingElements();
          }),
            (BaseRenderer.prototype.createItem = function (t) {
              switch (t.ty) {
                case 2:
                  return this.createImage(t);
                case 0:
                  return this.createComp(t);
                case 1:
                  return this.createSolid(t);
                case 3:
                  return this.createNull(t);
                case 4:
                  return this.createShape(t);
                case 5:
                  return this.createText(t);
                case 13:
                  return this.createCamera(t);
              }
              return this.createNull(t);
            }),
            (BaseRenderer.prototype.createCamera = function () {
              throw new Error(
                "You're using a 3d camera. Try the html renderer."
              );
            }),
            (BaseRenderer.prototype.buildAllItems = function () {
              var t,
                e = this.layers.length;
              for (t = 0; t < e; t += 1) this.buildItem(t);
              this.checkPendingElements();
            }),
            (BaseRenderer.prototype.includeLayers = function (t) {
              this.completeLayers = !1;
              var e,
                r,
                i = t.length,
                s = this.layers.length;
              for (e = 0; e < i; e += 1)
                for (r = 0; r < s; ) {
                  if (this.layers[r].id == t[e].id) {
                    this.layers[r] = t[e];
                    break;
                  }
                  r += 1;
                }
            }),
            (BaseRenderer.prototype.setProjectInterface = function (t) {
              this.globalData.projectInterface = t;
            }),
            (BaseRenderer.prototype.initItems = function () {
              this.globalData.progressiveLoad || this.buildAllItems();
            }),
            (BaseRenderer.prototype.buildElementParenting = function (t, e, r) {
              for (
                var i = this.elements, s = this.layers, n = 0, a = s.length;
                n < a;

              )
                s[n].ind == e &&
                  (i[n] && !0 !== i[n]
                    ? (r.push(i[n]),
                      i[n].setAsParent(),
                      void 0 !== s[n].parent
                        ? this.buildElementParenting(t, s[n].parent, r)
                        : t.setHierarchy(r))
                    : (this.buildItem(n), this.addPendingElement(t))),
                  (n += 1);
            }),
            (BaseRenderer.prototype.addPendingElement = function (t) {
              this.pendingElements.push(t);
            }),
            (BaseRenderer.prototype.searchExtraCompositions = function (t) {
              var e,
                r = t.length;
              for (e = 0; e < r; e += 1)
                if (t[e].xt) {
                  var i = this.createComp(t[e]);
                  i.initExpressions(),
                    this.globalData.projectInterface.registerComposition(i);
                }
            }),
            (BaseRenderer.prototype.setupGlobalData = function (t, e) {
              (this.globalData.fontManager = new FontManager()),
                this.globalData.fontManager.addChars(t.chars),
                this.globalData.fontManager.addFonts(t.fonts, e),
                (this.globalData.getAssetData =
                  this.animationItem.getAssetData.bind(this.animationItem)),
                (this.globalData.getAssetsPath =
                  this.animationItem.getAssetsPath.bind(this.animationItem)),
                (this.globalData.imageLoader =
                  this.animationItem.imagePreloader),
                (this.globalData.frameId = 0),
                (this.globalData.frameRate = t.fr),
                (this.globalData.nm = t.nm),
                (this.globalData.compSize = { w: t.w, h: t.h });
            }),
            extendPrototype([BaseRenderer], SVGRenderer),
            (SVGRenderer.prototype.createNull = function (t) {
              return new NullElement(t, this.globalData, this);
            }),
            (SVGRenderer.prototype.createShape = function (t) {
              return new SVGShapeElement(t, this.globalData, this);
            }),
            (SVGRenderer.prototype.createText = function (t) {
              return new SVGTextElement(t, this.globalData, this);
            }),
            (SVGRenderer.prototype.createImage = function (t) {
              return new IImageElement(t, this.globalData, this);
            }),
            (SVGRenderer.prototype.createComp = function (t) {
              return new SVGCompElement(t, this.globalData, this);
            }),
            (SVGRenderer.prototype.createSolid = function (t) {
              return new ISolidElement(t, this.globalData, this);
            }),
            (SVGRenderer.prototype.configAnimation = function (t) {
              this.svgElement.setAttribute(
                'xmlns',
                'http://www.w3.org/2000/svg'
              ),
                this.renderConfig.viewBoxSize
                  ? this.svgElement.setAttribute(
                      'viewBox',
                      this.renderConfig.viewBoxSize
                    )
                  : this.svgElement.setAttribute(
                      'viewBox',
                      '0 0 ' + t.w + ' ' + t.h
                    ),
                this.renderConfig.viewBoxOnly ||
                  (this.svgElement.setAttribute('width', t.w),
                  this.svgElement.setAttribute('height', t.h),
                  (this.svgElement.style.width = '100%'),
                  (this.svgElement.style.height = '100%'),
                  (this.svgElement.style.transform = 'translate3d(0,0,0)')),
                this.renderConfig.className &&
                  this.svgElement.setAttribute(
                    'class',
                    this.renderConfig.className
                  ),
                this.renderConfig.id &&
                  this.svgElement.setAttribute('id', this.renderConfig.id),
                void 0 !== this.renderConfig.focusable &&
                  this.svgElement.setAttribute(
                    'focusable',
                    this.renderConfig.focusable
                  ),
                this.svgElement.setAttribute(
                  'preserveAspectRatio',
                  this.renderConfig.preserveAspectRatio
                ),
                this.animationItem.wrapper.appendChild(this.svgElement);
              var e = this.globalData.defs;
              this.setupGlobalData(t, e),
                (this.globalData.progressiveLoad =
                  this.renderConfig.progressiveLoad),
                (this.data = t);
              var r = createNS('clipPath'),
                i = createNS('rect');
              i.setAttribute('width', t.w),
                i.setAttribute('height', t.h),
                i.setAttribute('x', 0),
                i.setAttribute('y', 0);
              var s = createElementID();
              r.setAttribute('id', s),
                r.appendChild(i),
                this.layerElement.setAttribute(
                  'clip-path',
                  'url(' + locationHref + '#' + s + ')'
                ),
                e.appendChild(r),
                (this.layers = t.layers),
                (this.elements = createSizedArray(t.layers.length));
            }),
            (SVGRenderer.prototype.destroy = function () {
              (this.animationItem.wrapper.innerHTML = ''),
                (this.layerElement = null),
                (this.globalData.defs = null);
              var t,
                e = this.layers ? this.layers.length : 0;
              for (t = 0; t < e; t++)
                this.elements[t] && this.elements[t].destroy();
              (this.elements.length = 0),
                (this.destroyed = !0),
                (this.animationItem = null);
            }),
            (SVGRenderer.prototype.updateContainerSize = function () {}),
            (SVGRenderer.prototype.buildItem = function (t) {
              var e = this.elements;
              if (!e[t] && 99 != this.layers[t].ty) {
                e[t] = !0;
                var r = this.createItem(this.layers[t]);
                (e[t] = r),
                  expressionsPlugin &&
                    (0 === this.layers[t].ty &&
                      this.globalData.projectInterface.registerComposition(r),
                    r.initExpressions()),
                  this.appendElementInPos(r, t),
                  this.layers[t].tt &&
                    (this.elements[t - 1] && !0 !== this.elements[t - 1]
                      ? r.setMatte(e[t - 1].layerId)
                      : (this.buildItem(t - 1), this.addPendingElement(r)));
              }
            }),
            (SVGRenderer.prototype.checkPendingElements = function () {
              for (; this.pendingElements.length; ) {
                var t = this.pendingElements.pop();
                if ((t.checkParenting(), t.data.tt))
                  for (var e = 0, r = this.elements.length; e < r; ) {
                    if (this.elements[e] === t) {
                      t.setMatte(this.elements[e - 1].layerId);
                      break;
                    }
                    e += 1;
                  }
              }
            }),
            (SVGRenderer.prototype.renderFrame = function (t) {
              if (this.renderedFrame !== t && !this.destroyed) {
                null === t
                  ? (t = this.renderedFrame)
                  : (this.renderedFrame = t),
                  (this.globalData.frameNum = t),
                  (this.globalData.frameId += 1),
                  (this.globalData.projectInterface.currentFrame = t),
                  (this.globalData._mdf = !1);
                var e,
                  r = this.layers.length;
                for (
                  this.completeLayers || this.checkLayers(t), e = r - 1;
                  e >= 0;
                  e--
                )
                  (this.completeLayers || this.elements[e]) &&
                    this.elements[e].prepareFrame(t - this.layers[e].st);
                if (this.globalData._mdf)
                  for (e = 0; e < r; e += 1)
                    (this.completeLayers || this.elements[e]) &&
                      this.elements[e].renderFrame();
              }
            }),
            (SVGRenderer.prototype.appendElementInPos = function (t, e) {
              var r = t.getBaseElement();
              if (r) {
                for (var i, s = 0; s < e; )
                  this.elements[s] &&
                    !0 !== this.elements[s] &&
                    this.elements[s].getBaseElement() &&
                    (i = this.elements[s].getBaseElement()),
                    (s += 1);
                i
                  ? this.layerElement.insertBefore(r, i)
                  : this.layerElement.appendChild(r);
              }
            }),
            (SVGRenderer.prototype.hide = function () {
              this.layerElement.style.display = 'none';
            }),
            (SVGRenderer.prototype.show = function () {
              this.layerElement.style.display = 'block';
            }),
            (MaskElement.prototype.getMaskProperty = function (t) {
              return this.viewData[t].prop;
            }),
            (MaskElement.prototype.renderFrame = function (t) {
              var e,
                r = this.element.finalTransform.mat,
                i = this.masksProperties.length;
              for (e = 0; e < i; e++)
                if (
                  ((this.viewData[e].prop._mdf || t) &&
                    this.drawPath(
                      this.masksProperties[e],
                      this.viewData[e].prop.v,
                      this.viewData[e]
                    ),
                  (this.viewData[e].op._mdf || t) &&
                    this.viewData[e].elem.setAttribute(
                      'fill-opacity',
                      this.viewData[e].op.v
                    ),
                  'n' !== this.masksProperties[e].mode &&
                    (this.viewData[e].invRect &&
                      (this.element.finalTransform.mProp._mdf || t) &&
                      this.viewData[e].invRect.setAttribute(
                        'transform',
                        r.getInverseMatrix().to2dCSS()
                      ),
                    this.storedData[e].x && (this.storedData[e].x._mdf || t)))
                ) {
                  var s = this.storedData[e].expan;
                  this.storedData[e].x.v < 0
                    ? ('erode' !== this.storedData[e].lastOperator &&
                        ((this.storedData[e].lastOperator = 'erode'),
                        this.storedData[e].elem.setAttribute(
                          'filter',
                          'url(' +
                            locationHref +
                            '#' +
                            this.storedData[e].filterId +
                            ')'
                        )),
                      s.setAttribute('radius', -this.storedData[e].x.v))
                    : ('dilate' !== this.storedData[e].lastOperator &&
                        ((this.storedData[e].lastOperator = 'dilate'),
                        this.storedData[e].elem.setAttribute('filter', null)),
                      this.storedData[e].elem.setAttribute(
                        'stroke-width',
                        2 * this.storedData[e].x.v
                      ));
                }
            }),
            (MaskElement.prototype.getMaskelement = function () {
              return this.maskElement;
            }),
            (MaskElement.prototype.createLayerSolidPath = function () {
              var t = 'M0,0 ';
              return (
                (t += ' h' + this.globalData.compSize.w),
                (t += ' v' + this.globalData.compSize.h),
                (t += ' h-' + this.globalData.compSize.w),
                (t += ' v-' + this.globalData.compSize.h + ' ')
              );
            }),
            (MaskElement.prototype.drawPath = function (t, e, r) {
              var i,
                s,
                n = ' M' + e.v[0][0] + ',' + e.v[0][1];
              for (s = e._length, i = 1; i < s; i += 1)
                n +=
                  ' C' +
                  e.o[i - 1][0] +
                  ',' +
                  e.o[i - 1][1] +
                  ' ' +
                  e.i[i][0] +
                  ',' +
                  e.i[i][1] +
                  ' ' +
                  e.v[i][0] +
                  ',' +
                  e.v[i][1];
              if (
                (e.c &&
                  s > 1 &&
                  (n +=
                    ' C' +
                    e.o[i - 1][0] +
                    ',' +
                    e.o[i - 1][1] +
                    ' ' +
                    e.i[0][0] +
                    ',' +
                    e.i[0][1] +
                    ' ' +
                    e.v[0][0] +
                    ',' +
                    e.v[0][1]),
                r.lastPath !== n)
              ) {
                var a = '';
                r.elem &&
                  (e.c && (a = t.inv ? this.solidPath + n : n),
                  r.elem.setAttribute('d', a)),
                  (r.lastPath = n);
              }
            }),
            (MaskElement.prototype.destroy = function () {
              (this.element = null),
                (this.globalData = null),
                (this.maskElement = null),
                (this.data = null),
                (this.masksProperties = null);
            }),
            (HierarchyElement.prototype = {
              initHierarchy: function () {
                (this.hierarchy = []),
                  (this._isParent = !1),
                  this.checkParenting();
              },
              setHierarchy: function (t) {
                this.hierarchy = t;
              },
              setAsParent: function () {
                this._isParent = !0;
              },
              checkParenting: function () {
                void 0 !== this.data.parent &&
                  this.comp.buildElementParenting(this, this.data.parent, []);
              },
            }),
            (FrameElement.prototype = {
              initFrame: function () {
                (this._isFirstFrame = !1),
                  (this.dynamicProperties = []),
                  (this._mdf = !1);
              },
              prepareProperties: function (t, e) {
                var r,
                  i = this.dynamicProperties.length;
                for (r = 0; r < i; r += 1)
                  (e ||
                    (this._isParent &&
                      'transform' === this.dynamicProperties[r].propType)) &&
                    (this.dynamicProperties[r].getValue(),
                    this.dynamicProperties[r]._mdf &&
                      ((this.globalData._mdf = !0), (this._mdf = !0)));
              },
              addDynamicProperty: function (t) {
                -1 === this.dynamicProperties.indexOf(t) &&
                  this.dynamicProperties.push(t);
              },
            }),
            (TransformElement.prototype = {
              initTransform: function () {
                (this.finalTransform = {
                  mProp: this.data.ks
                    ? TransformPropertyFactory.getTransformProperty(
                        this,
                        this.data.ks,
                        this
                      )
                    : { o: 0 },
                  _matMdf: !1,
                  _opMdf: !1,
                  mat: new Matrix(),
                }),
                  this.data.ao && (this.finalTransform.mProp.autoOriented = !0),
                  this.data.ty;
              },
              renderTransform: function () {
                if (
                  ((this.finalTransform._opMdf =
                    this.finalTransform.mProp.o._mdf || this._isFirstFrame),
                  (this.finalTransform._matMdf =
                    this.finalTransform.mProp._mdf || this._isFirstFrame),
                  this.hierarchy)
                ) {
                  var t,
                    e = this.finalTransform.mat,
                    r = 0,
                    i = this.hierarchy.length;
                  if (!this.finalTransform._matMdf)
                    for (; r < i; ) {
                      if (this.hierarchy[r].finalTransform.mProp._mdf) {
                        this.finalTransform._matMdf = !0;
                        break;
                      }
                      r += 1;
                    }
                  if (this.finalTransform._matMdf)
                    for (
                      t = this.finalTransform.mProp.v.props,
                        e.cloneFromProps(t),
                        r = 0;
                      r < i;
                      r += 1
                    )
                      (t = this.hierarchy[r].finalTransform.mProp.v.props),
                        e.transform(
                          t[0],
                          t[1],
                          t[2],
                          t[3],
                          t[4],
                          t[5],
                          t[6],
                          t[7],
                          t[8],
                          t[9],
                          t[10],
                          t[11],
                          t[12],
                          t[13],
                          t[14],
                          t[15]
                        );
                }
              },
              globalToLocal: function (t) {
                var e = [];
                e.push(this.finalTransform);
                for (var r = !0, i = this.comp; r; )
                  i.finalTransform
                    ? (i.data.hasMask && e.splice(0, 0, i.finalTransform),
                      (i = i.comp))
                    : (r = !1);
                var s,
                  n,
                  a = e.length;
                for (s = 0; s < a; s += 1)
                  (n = e[s].mat.applyToPointArray(0, 0, 0)),
                    (t = [t[0] - n[0], t[1] - n[1], 0]);
                return t;
              },
              mHelper: new Matrix(),
            }),
            (RenderableElement.prototype = {
              initRenderable: function () {
                (this.isInRange = !1),
                  (this.hidden = !1),
                  (this.isTransparent = !1),
                  (this.renderableComponents = []);
              },
              addRenderableComponent: function (t) {
                -1 === this.renderableComponents.indexOf(t) &&
                  this.renderableComponents.push(t);
              },
              removeRenderableComponent: function (t) {
                -1 !== this.renderableComponents.indexOf(t) &&
                  this.renderableComponents.splice(
                    this.renderableComponents.indexOf(t),
                    1
                  );
              },
              prepareRenderableFrame: function (t) {
                this.checkLayerLimits(t);
              },
              checkTransparency: function () {
                this.finalTransform.mProp.o.v <= 0
                  ? !this.isTransparent &&
                    this.globalData.renderConfig.hideOnTransparent &&
                    ((this.isTransparent = !0), this.hide())
                  : this.isTransparent &&
                    ((this.isTransparent = !1), this.show());
              },
              checkLayerLimits: function (t) {
                this.data.ip - this.data.st <= t &&
                this.data.op - this.data.st > t
                  ? !0 !== this.isInRange &&
                    ((this.globalData._mdf = !0),
                    (this._mdf = !0),
                    (this.isInRange = !0),
                    this.show())
                  : !1 !== this.isInRange &&
                    ((this.globalData._mdf = !0),
                    (this.isInRange = !1),
                    this.hide());
              },
              renderRenderable: function () {
                var t,
                  e = this.renderableComponents.length;
                for (t = 0; t < e; t += 1)
                  this.renderableComponents[t].renderFrame(this._isFirstFrame);
              },
              sourceRectAtTime: function () {
                return { top: 0, left: 0, width: 100, height: 100 };
              },
              getLayerSize: function () {
                return 5 === this.data.ty
                  ? {
                      w: this.data.textData.width,
                      h: this.data.textData.height,
                    }
                  : { w: this.data.width, h: this.data.height };
              },
            }),
            extendPrototype(
              [
                RenderableElement,
                createProxyFunction({
                  initElement: function (t, e, r) {
                    this.initFrame(),
                      this.initBaseData(t, e, r),
                      this.initTransform(t, e, r),
                      this.initHierarchy(),
                      this.initRenderable(),
                      this.initRendererElement(),
                      this.createContainerElements(),
                      this.createRenderableComponents(),
                      this.createContent(),
                      this.hide();
                  },
                  hide: function () {
                    this.hidden ||
                      (this.isInRange && !this.isTransparent) ||
                      (((this.baseElement || this.layerElement).style.display =
                        'none'),
                      (this.hidden = !0));
                  },
                  show: function () {
                    this.isInRange &&
                      !this.isTransparent &&
                      (this.data.hd ||
                        ((this.baseElement || this.layerElement).style.display =
                          'block'),
                      (this.hidden = !1),
                      (this._isFirstFrame = !0));
                  },
                  renderFrame: function () {
                    this.data.hd ||
                      this.hidden ||
                      (this.renderTransform(),
                      this.renderRenderable(),
                      this.renderElement(),
                      this.renderInnerContent(),
                      this._isFirstFrame && (this._isFirstFrame = !1));
                  },
                  renderInnerContent: function () {},
                  prepareFrame: function (t) {
                    (this._mdf = !1),
                      this.prepareRenderableFrame(t),
                      this.prepareProperties(t, this.isInRange),
                      this.checkTransparency();
                  },
                  destroy: function () {
                    (this.innerElem = null), this.destroyBaseElement();
                  },
                }),
              ],
              RenderableDOMElement
            ),
            (SVGStyleData.prototype.reset = function () {
              (this.d = ''), (this._mdf = !1);
            }),
            (SVGShapeData.prototype.setAsAnimated = function () {
              this._isAnimated = !0;
            }),
            extendPrototype([DynamicPropertyContainer], SVGStrokeStyleData),
            extendPrototype([DynamicPropertyContainer], SVGFillStyleData),
            (SVGGradientFillStyleData.prototype.initGradientData = function (
              t,
              e,
              r
            ) {
              (this.o = PropertyFactory.getProp(t, e.o, 0, 0.01, this)),
                (this.s = PropertyFactory.getProp(t, e.s, 1, null, this)),
                (this.e = PropertyFactory.getProp(t, e.e, 1, null, this)),
                (this.h = PropertyFactory.getProp(
                  t,
                  e.h || { k: 0 },
                  0,
                  0.01,
                  this
                )),
                (this.a = PropertyFactory.getProp(
                  t,
                  e.a || { k: 0 },
                  0,
                  degToRads,
                  this
                )),
                (this.g = new GradientProperty(t, e.g, this)),
                (this.style = r),
                (this.stops = []),
                this.setGradientData(r.pElem, e),
                this.setGradientOpacity(e, r),
                (this._isAnimated = !!this._isAnimated);
            }),
            (SVGGradientFillStyleData.prototype.setGradientData = function (
              t,
              e
            ) {
              var r = createElementID(),
                i = createNS(1 === e.t ? 'linearGradient' : 'radialGradient');
              i.setAttribute('id', r),
                i.setAttribute('spreadMethod', 'pad'),
                i.setAttribute('gradientUnits', 'userSpaceOnUse');
              var s,
                n,
                a,
                o = [];
              for (a = 4 * e.g.p, n = 0; n < a; n += 4)
                (s = createNS('stop')), i.appendChild(s), o.push(s);
              t.setAttribute(
                'gf' === e.ty ? 'fill' : 'stroke',
                'url(' + locationHref + '#' + r + ')'
              ),
                (this.gf = i),
                (this.cst = o);
            }),
            (SVGGradientFillStyleData.prototype.setGradientOpacity = function (
              t,
              e
            ) {
              if (this.g._hasOpacity && !this.g._collapsable) {
                var r,
                  i,
                  s,
                  n = createNS('mask'),
                  a = createNS('path');
                n.appendChild(a);
                var o = createElementID(),
                  h = createElementID();
                n.setAttribute('id', h);
                var l = createNS(
                  1 === t.t ? 'linearGradient' : 'radialGradient'
                );
                l.setAttribute('id', o),
                  l.setAttribute('spreadMethod', 'pad'),
                  l.setAttribute('gradientUnits', 'userSpaceOnUse'),
                  (s = t.g.k.k[0].s ? t.g.k.k[0].s.length : t.g.k.k.length);
                var p = this.stops;
                for (i = 4 * t.g.p; i < s; i += 2)
                  (r = createNS('stop')).setAttribute(
                    'stop-color',
                    'rgb(255,255,255)'
                  ),
                    l.appendChild(r),
                    p.push(r);
                a.setAttribute(
                  'gf' === t.ty ? 'fill' : 'stroke',
                  'url(' + locationHref + '#' + o + ')'
                ),
                  (this.of = l),
                  (this.ms = n),
                  (this.ost = p),
                  (this.maskId = h),
                  (e.msElem = a);
              }
            }),
            extendPrototype(
              [DynamicPropertyContainer],
              SVGGradientFillStyleData
            ),
            extendPrototype(
              [SVGGradientFillStyleData, DynamicPropertyContainer],
              SVGGradientStrokeStyleData
            );
          var SVGElementsRenderer = (function () {
            var t = new Matrix(),
              e = new Matrix();
            function r(t, e, r) {
              (r || e.transform.op._mdf) &&
                e.transform.container.setAttribute('opacity', e.transform.op.v),
                (r || e.transform.mProps._mdf) &&
                  e.transform.container.setAttribute(
                    'transform',
                    e.transform.mProps.v.to2dCSS()
                  );
            }
            function i(r, i, s) {
              var n,
                a,
                o,
                h,
                l,
                p,
                c,
                f,
                d,
                u,
                m,
                y = i.styles.length,
                g = i.lvl;
              for (p = 0; p < y; p += 1) {
                if (((h = i.sh._mdf || s), i.styles[p].lvl < g)) {
                  for (
                    f = e.reset(),
                      u = g - i.styles[p].lvl,
                      m = i.transformers.length - 1;
                    !h && u > 0;

                  )
                    (h = i.transformers[m].mProps._mdf || h), u--, m--;
                  if (h)
                    for (
                      u = g - i.styles[p].lvl, m = i.transformers.length - 1;
                      u > 0;

                    )
                      (d = i.transformers[m].mProps.v.props),
                        f.transform(
                          d[0],
                          d[1],
                          d[2],
                          d[3],
                          d[4],
                          d[5],
                          d[6],
                          d[7],
                          d[8],
                          d[9],
                          d[10],
                          d[11],
                          d[12],
                          d[13],
                          d[14],
                          d[15]
                        ),
                        u--,
                        m--;
                } else f = t;
                if (((a = (c = i.sh.paths)._length), h)) {
                  for (o = '', n = 0; n < a; n += 1)
                    (l = c.shapes[n]) &&
                      l._length &&
                      (o += buildShapeString(l, l._length, l.c, f));
                  i.caches[p] = o;
                } else o = i.caches[p];
                (i.styles[p].d += !0 === r.hd ? '' : o),
                  (i.styles[p]._mdf = h || i.styles[p]._mdf);
              }
            }
            function s(t, e, r) {
              var i = e.style;
              (e.c._mdf || r) &&
                i.pElem.setAttribute(
                  'fill',
                  'rgb(' +
                    bm_floor(e.c.v[0]) +
                    ',' +
                    bm_floor(e.c.v[1]) +
                    ',' +
                    bm_floor(e.c.v[2]) +
                    ')'
                ),
                (e.o._mdf || r) && i.pElem.setAttribute('fill-opacity', e.o.v);
            }
            function n(t, e, r) {
              a(t, e, r), o(t, e, r);
            }
            function a(t, e, r) {
              var i,
                s,
                n,
                a,
                o,
                h = e.gf,
                l = e.g._hasOpacity,
                p = e.s.v,
                c = e.e.v;
              if (e.o._mdf || r) {
                var f = 'gf' === t.ty ? 'fill-opacity' : 'stroke-opacity';
                e.style.pElem.setAttribute(f, e.o.v);
              }
              if (e.s._mdf || r) {
                var d = 1 === t.t ? 'x1' : 'cx',
                  u = 'x1' === d ? 'y1' : 'cy';
                h.setAttribute(d, p[0]),
                  h.setAttribute(u, p[1]),
                  l &&
                    !e.g._collapsable &&
                    (e.of.setAttribute(d, p[0]), e.of.setAttribute(u, p[1]));
              }
              if (e.g._cmdf || r) {
                i = e.cst;
                var m = e.g.c;
                for (n = i.length, s = 0; s < n; s += 1)
                  (a = i[s]).setAttribute('offset', m[4 * s] + '%'),
                    a.setAttribute(
                      'stop-color',
                      'rgb(' +
                        m[4 * s + 1] +
                        ',' +
                        m[4 * s + 2] +
                        ',' +
                        m[4 * s + 3] +
                        ')'
                    );
              }
              if (l && (e.g._omdf || r)) {
                var y = e.g.o;
                for (
                  n = (i = e.g._collapsable ? e.cst : e.ost).length, s = 0;
                  s < n;
                  s += 1
                )
                  (a = i[s]),
                    e.g._collapsable ||
                      a.setAttribute('offset', y[2 * s] + '%'),
                    a.setAttribute('stop-opacity', y[2 * s + 1]);
              }
              if (1 === t.t)
                (e.e._mdf || r) &&
                  (h.setAttribute('x2', c[0]),
                  h.setAttribute('y2', c[1]),
                  l &&
                    !e.g._collapsable &&
                    (e.of.setAttribute('x2', c[0]),
                    e.of.setAttribute('y2', c[1])));
              else if (
                ((e.s._mdf || e.e._mdf || r) &&
                  ((o = Math.sqrt(
                    Math.pow(p[0] - c[0], 2) + Math.pow(p[1] - c[1], 2)
                  )),
                  h.setAttribute('r', o),
                  l && !e.g._collapsable && e.of.setAttribute('r', o)),
                e.e._mdf || e.h._mdf || e.a._mdf || r)
              ) {
                o ||
                  (o = Math.sqrt(
                    Math.pow(p[0] - c[0], 2) + Math.pow(p[1] - c[1], 2)
                  ));
                var g = Math.atan2(c[1] - p[1], c[0] - p[0]),
                  v = o * (e.h.v >= 1 ? 0.99 : e.h.v <= -1 ? -0.99 : e.h.v),
                  _ = Math.cos(g + e.a.v) * v + p[0],
                  b = Math.sin(g + e.a.v) * v + p[1];
                h.setAttribute('fx', _),
                  h.setAttribute('fy', b),
                  l &&
                    !e.g._collapsable &&
                    (e.of.setAttribute('fx', _), e.of.setAttribute('fy', b));
              }
            }
            function o(t, e, r) {
              var i = e.style,
                s = e.d;
              s &&
                (s._mdf || r) &&
                s.dashStr &&
                (i.pElem.setAttribute('stroke-dasharray', s.dashStr),
                i.pElem.setAttribute('stroke-dashoffset', s.dashoffset[0])),
                e.c &&
                  (e.c._mdf || r) &&
                  i.pElem.setAttribute(
                    'stroke',
                    'rgb(' +
                      bm_floor(e.c.v[0]) +
                      ',' +
                      bm_floor(e.c.v[1]) +
                      ',' +
                      bm_floor(e.c.v[2]) +
                      ')'
                  ),
                (e.o._mdf || r) &&
                  i.pElem.setAttribute('stroke-opacity', e.o.v),
                (e.w._mdf || r) &&
                  (i.pElem.setAttribute('stroke-width', e.w.v),
                  i.msElem && i.msElem.setAttribute('stroke-width', e.w.v));
            }
            return {
              createRenderFunction: function (t) {
                t.ty;
                switch (t.ty) {
                  case 'fl':
                    return s;
                  case 'gf':
                    return a;
                  case 'gs':
                    return n;
                  case 'st':
                    return o;
                  case 'sh':
                  case 'el':
                  case 'rc':
                  case 'sr':
                    return i;
                  case 'tr':
                    return r;
                }
              },
            };
          })();
          function BaseElement() {}
          function NullElement(t, e, r) {
            this.initFrame(),
              this.initBaseData(t, e, r),
              this.initFrame(),
              this.initTransform(t, e, r),
              this.initHierarchy();
          }
          function SVGBaseElement() {}
          function IShapeElement() {}
          function ITextElement() {}
          function ICompElement() {}
          function IImageElement(t, e, r) {
            (this.assetData = e.getAssetData(t.refId)),
              this.initElement(t, e, r),
              (this.sourceRect = {
                top: 0,
                left: 0,
                width: this.assetData.w,
                height: this.assetData.h,
              });
          }
          function ISolidElement(t, e, r) {
            this.initElement(t, e, r);
          }
          function SVGCompElement(t, e, r) {
            (this.layers = t.layers),
              (this.supports3d = !0),
              (this.completeLayers = !1),
              (this.pendingElements = []),
              (this.elements = this.layers
                ? createSizedArray(this.layers.length)
                : []),
              this.initElement(t, e, r),
              (this.tm = t.tm
                ? PropertyFactory.getProp(this, t.tm, 0, e.frameRate, this)
                : { _placeholder: !0 });
          }
          function SVGTextElement(t, e, r) {
            (this.textSpans = []),
              (this.renderType = 'svg'),
              this.initElement(t, e, r);
          }
          function SVGShapeElement(t, e, r) {
            (this.shapes = []),
              (this.shapesData = t.shapes),
              (this.stylesList = []),
              (this.shapeModifiers = []),
              (this.itemsData = []),
              (this.processedElements = []),
              (this.animatedContents = []),
              this.initElement(t, e, r),
              (this.prevViewData = []);
          }
          function SVGTintFilter(t, e) {
            this.filterManager = e;
            var r = createNS('feColorMatrix');
            if (
              (r.setAttribute('type', 'matrix'),
              r.setAttribute('color-interpolation-filters', 'linearRGB'),
              r.setAttribute(
                'values',
                '0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0'
              ),
              r.setAttribute('result', 'f1'),
              t.appendChild(r),
              (r = createNS('feColorMatrix')).setAttribute('type', 'matrix'),
              r.setAttribute('color-interpolation-filters', 'sRGB'),
              r.setAttribute(
                'values',
                '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0'
              ),
              r.setAttribute('result', 'f2'),
              t.appendChild(r),
              (this.matrixFilter = r),
              100 !== e.effectElements[2].p.v || e.effectElements[2].p.k)
            ) {
              var i,
                s = createNS('feMerge');
              t.appendChild(s),
                (i = createNS('feMergeNode')).setAttribute(
                  'in',
                  'SourceGraphic'
                ),
                s.appendChild(i),
                (i = createNS('feMergeNode')).setAttribute('in', 'f2'),
                s.appendChild(i);
            }
          }
          function SVGFillFilter(t, e) {
            this.filterManager = e;
            var r = createNS('feColorMatrix');
            r.setAttribute('type', 'matrix'),
              r.setAttribute('color-interpolation-filters', 'sRGB'),
              r.setAttribute(
                'values',
                '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0'
              ),
              t.appendChild(r),
              (this.matrixFilter = r);
          }
          function SVGGaussianBlurEffect(t, e) {
            t.setAttribute('x', '-100%'),
              t.setAttribute('y', '-100%'),
              t.setAttribute('width', '300%'),
              t.setAttribute('height', '300%'),
              (this.filterManager = e);
            var r = createNS('feGaussianBlur');
            t.appendChild(r), (this.feGaussianBlur = r);
          }
          function SVGStrokeEffect(t, e) {
            (this.initialized = !1),
              (this.filterManager = e),
              (this.elem = t),
              (this.paths = []);
          }
          function SVGTritoneFilter(t, e) {
            this.filterManager = e;
            var r = createNS('feColorMatrix');
            r.setAttribute('type', 'matrix'),
              r.setAttribute('color-interpolation-filters', 'linearRGB'),
              r.setAttribute(
                'values',
                '0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0'
              ),
              r.setAttribute('result', 'f1'),
              t.appendChild(r);
            var i = createNS('feComponentTransfer');
            i.setAttribute('color-interpolation-filters', 'sRGB'),
              t.appendChild(i),
              (this.matrixFilter = i);
            var s = createNS('feFuncR');
            s.setAttribute('type', 'table'),
              i.appendChild(s),
              (this.feFuncR = s);
            var n = createNS('feFuncG');
            n.setAttribute('type', 'table'),
              i.appendChild(n),
              (this.feFuncG = n);
            var a = createNS('feFuncB');
            a.setAttribute('type', 'table'),
              i.appendChild(a),
              (this.feFuncB = a);
          }
          function SVGProLevelsFilter(t, e) {
            this.filterManager = e;
            var r = this.filterManager.effectElements,
              i = createNS('feComponentTransfer');
            (r[10].p.k ||
              0 !== r[10].p.v ||
              r[11].p.k ||
              1 !== r[11].p.v ||
              r[12].p.k ||
              1 !== r[12].p.v ||
              r[13].p.k ||
              0 !== r[13].p.v ||
              r[14].p.k ||
              1 !== r[14].p.v) &&
              (this.feFuncR = this.createFeFunc('feFuncR', i)),
              (r[17].p.k ||
                0 !== r[17].p.v ||
                r[18].p.k ||
                1 !== r[18].p.v ||
                r[19].p.k ||
                1 !== r[19].p.v ||
                r[20].p.k ||
                0 !== r[20].p.v ||
                r[21].p.k ||
                1 !== r[21].p.v) &&
                (this.feFuncG = this.createFeFunc('feFuncG', i)),
              (r[24].p.k ||
                0 !== r[24].p.v ||
                r[25].p.k ||
                1 !== r[25].p.v ||
                r[26].p.k ||
                1 !== r[26].p.v ||
                r[27].p.k ||
                0 !== r[27].p.v ||
                r[28].p.k ||
                1 !== r[28].p.v) &&
                (this.feFuncB = this.createFeFunc('feFuncB', i)),
              (r[31].p.k ||
                0 !== r[31].p.v ||
                r[32].p.k ||
                1 !== r[32].p.v ||
                r[33].p.k ||
                1 !== r[33].p.v ||
                r[34].p.k ||
                0 !== r[34].p.v ||
                r[35].p.k ||
                1 !== r[35].p.v) &&
                (this.feFuncA = this.createFeFunc('feFuncA', i)),
              (this.feFuncR || this.feFuncG || this.feFuncB || this.feFuncA) &&
                (i.setAttribute('color-interpolation-filters', 'sRGB'),
                t.appendChild(i),
                (i = createNS('feComponentTransfer'))),
              (r[3].p.k ||
                0 !== r[3].p.v ||
                r[4].p.k ||
                1 !== r[4].p.v ||
                r[5].p.k ||
                1 !== r[5].p.v ||
                r[6].p.k ||
                0 !== r[6].p.v ||
                r[7].p.k ||
                1 !== r[7].p.v) &&
                (i.setAttribute('color-interpolation-filters', 'sRGB'),
                t.appendChild(i),
                (this.feFuncRComposed = this.createFeFunc('feFuncR', i)),
                (this.feFuncGComposed = this.createFeFunc('feFuncG', i)),
                (this.feFuncBComposed = this.createFeFunc('feFuncB', i)));
          }
          function SVGDropShadowEffect(t, e) {
            var r = e.container.globalData.renderConfig.filterSize;
            t.setAttribute('x', r.x),
              t.setAttribute('y', r.y),
              t.setAttribute('width', r.width),
              t.setAttribute('height', r.height),
              (this.filterManager = e);
            var i = createNS('feGaussianBlur');
            i.setAttribute('in', 'SourceAlpha'),
              i.setAttribute('result', 'drop_shadow_1'),
              i.setAttribute('stdDeviation', '0'),
              (this.feGaussianBlur = i),
              t.appendChild(i);
            var s = createNS('feOffset');
            s.setAttribute('dx', '25'),
              s.setAttribute('dy', '0'),
              s.setAttribute('in', 'drop_shadow_1'),
              s.setAttribute('result', 'drop_shadow_2'),
              (this.feOffset = s),
              t.appendChild(s);
            var n = createNS('feFlood');
            n.setAttribute('flood-color', '#00ff00'),
              n.setAttribute('flood-opacity', '1'),
              n.setAttribute('result', 'drop_shadow_3'),
              (this.feFlood = n),
              t.appendChild(n);
            var a = createNS('feComposite');
            a.setAttribute('in', 'drop_shadow_3'),
              a.setAttribute('in2', 'drop_shadow_2'),
              a.setAttribute('operator', 'in'),
              a.setAttribute('result', 'drop_shadow_4'),
              t.appendChild(a);
            var o,
              h = createNS('feMerge');
            t.appendChild(h),
              (o = createNS('feMergeNode')),
              h.appendChild(o),
              (o = createNS('feMergeNode')).setAttribute('in', 'SourceGraphic'),
              (this.feMergeNode = o),
              (this.feMerge = h),
              (this.originalNodeAdded = !1),
              h.appendChild(o);
          }
          (BaseElement.prototype = {
            checkMasks: function () {
              if (!this.data.hasMask) return !1;
              for (var t = 0, e = this.data.masksProperties.length; t < e; ) {
                if (
                  'n' !== this.data.masksProperties[t].mode &&
                  !1 !== this.data.masksProperties[t].cl
                )
                  return !0;
                t += 1;
              }
              return !1;
            },
            initExpressions: function () {
              (this.layerInterface = LayerExpressionInterface(this)),
                this.data.hasMask &&
                  this.maskManager &&
                  this.layerInterface.registerMaskInterface(this.maskManager);
              var t = EffectsExpressionInterface.createEffectsInterface(
                this,
                this.layerInterface
              );
              this.layerInterface.registerEffectsInterface(t),
                0 === this.data.ty || this.data.xt
                  ? (this.compInterface = CompExpressionInterface(this))
                  : 4 === this.data.ty
                  ? ((this.layerInterface.shapeInterface =
                      ShapeExpressionInterface(
                        this.shapesData,
                        this.itemsData,
                        this.layerInterface
                      )),
                    (this.layerInterface.content =
                      this.layerInterface.shapeInterface))
                  : 5 === this.data.ty &&
                    ((this.layerInterface.textInterface =
                      TextExpressionInterface(this)),
                    (this.layerInterface.text =
                      this.layerInterface.textInterface));
            },
            setBlendMode: function () {
              var t = getBlendMode(this.data.bm);
              (this.baseElement || this.layerElement).style['mix-blend-mode'] =
                t;
            },
            initBaseData: function (t, e, r) {
              (this.globalData = e),
                (this.comp = r),
                (this.data = t),
                (this.layerId = createElementID()),
                this.data.sr || (this.data.sr = 1),
                (this.effectsManager = new EffectsManager(
                  this.data,
                  this,
                  this.dynamicProperties
                ));
            },
            getType: function () {
              return this.type;
            },
            sourceRectAtTime: function () {},
          }),
            (NullElement.prototype.prepareFrame = function (t) {
              this.prepareProperties(t, !0);
            }),
            (NullElement.prototype.renderFrame = function () {}),
            (NullElement.prototype.getBaseElement = function () {
              return null;
            }),
            (NullElement.prototype.destroy = function () {}),
            (NullElement.prototype.sourceRectAtTime = function () {}),
            (NullElement.prototype.hide = function () {}),
            extendPrototype(
              [BaseElement, TransformElement, HierarchyElement, FrameElement],
              NullElement
            ),
            (SVGBaseElement.prototype = {
              initRendererElement: function () {
                this.layerElement = createNS('g');
              },
              createContainerElements: function () {
                (this.matteElement = createNS('g')),
                  (this.transformedElement = this.layerElement),
                  (this.maskedElement = this.layerElement),
                  (this._sizeChanged = !1);
                var t,
                  e,
                  r,
                  i = null;
                if (this.data.td) {
                  if (3 == this.data.td || 1 == this.data.td) {
                    var s = createNS('mask');
                    s.setAttribute('id', this.layerId),
                      s.setAttribute(
                        'mask-type',
                        3 == this.data.td ? 'luminance' : 'alpha'
                      ),
                      s.appendChild(this.layerElement),
                      (i = s),
                      this.globalData.defs.appendChild(s),
                      featureSupport.maskType ||
                        1 != this.data.td ||
                        (s.setAttribute('mask-type', 'luminance'),
                        (t = createElementID()),
                        (e = filtersFactory.createFilter(t)),
                        this.globalData.defs.appendChild(e),
                        e.appendChild(
                          filtersFactory.createAlphaToLuminanceFilter()
                        ),
                        (r = createNS('g')).appendChild(this.layerElement),
                        (i = r),
                        s.appendChild(r),
                        r.setAttribute(
                          'filter',
                          'url(' + locationHref + '#' + t + ')'
                        ));
                  } else if (2 == this.data.td) {
                    var n = createNS('mask');
                    n.setAttribute('id', this.layerId),
                      n.setAttribute('mask-type', 'alpha');
                    var a = createNS('g');
                    n.appendChild(a),
                      (t = createElementID()),
                      (e = filtersFactory.createFilter(t));
                    var o = createNS('feComponentTransfer');
                    o.setAttribute('in', 'SourceGraphic'), e.appendChild(o);
                    var h = createNS('feFuncA');
                    h.setAttribute('type', 'table'),
                      h.setAttribute('tableValues', '1.0 0.0'),
                      o.appendChild(h),
                      this.globalData.defs.appendChild(e);
                    var l = createNS('rect');
                    l.setAttribute('width', this.comp.data.w),
                      l.setAttribute('height', this.comp.data.h),
                      l.setAttribute('x', '0'),
                      l.setAttribute('y', '0'),
                      l.setAttribute('fill', '#ffffff'),
                      l.setAttribute('opacity', '0'),
                      a.setAttribute(
                        'filter',
                        'url(' + locationHref + '#' + t + ')'
                      ),
                      a.appendChild(l),
                      a.appendChild(this.layerElement),
                      (i = a),
                      featureSupport.maskType ||
                        (n.setAttribute('mask-type', 'luminance'),
                        e.appendChild(
                          filtersFactory.createAlphaToLuminanceFilter()
                        ),
                        (r = createNS('g')),
                        a.appendChild(l),
                        r.appendChild(this.layerElement),
                        (i = r),
                        a.appendChild(r)),
                      this.globalData.defs.appendChild(n);
                  }
                } else
                  this.data.tt
                    ? (this.matteElement.appendChild(this.layerElement),
                      (i = this.matteElement),
                      (this.baseElement = this.matteElement))
                    : (this.baseElement = this.layerElement);
                if (
                  (this.data.ln &&
                    this.layerElement.setAttribute('id', this.data.ln),
                  this.data.cl &&
                    this.layerElement.setAttribute('class', this.data.cl),
                  0 === this.data.ty && !this.data.hd)
                ) {
                  var p = createNS('clipPath'),
                    c = createNS('path');
                  c.setAttribute(
                    'd',
                    'M0,0 L' +
                      this.data.w +
                      ',0 L' +
                      this.data.w +
                      ',' +
                      this.data.h +
                      ' L0,' +
                      this.data.h +
                      'z'
                  );
                  var f = createElementID();
                  if (
                    (p.setAttribute('id', f),
                    p.appendChild(c),
                    this.globalData.defs.appendChild(p),
                    this.checkMasks())
                  ) {
                    var d = createNS('g');
                    d.setAttribute(
                      'clip-path',
                      'url(' + locationHref + '#' + f + ')'
                    ),
                      d.appendChild(this.layerElement),
                      (this.transformedElement = d),
                      i
                        ? i.appendChild(this.transformedElement)
                        : (this.baseElement = this.transformedElement);
                  } else
                    this.layerElement.setAttribute(
                      'clip-path',
                      'url(' + locationHref + '#' + f + ')'
                    );
                }
                0 !== this.data.bm && this.setBlendMode();
              },
              renderElement: function () {
                this.finalTransform._matMdf &&
                  this.transformedElement.setAttribute(
                    'transform',
                    this.finalTransform.mat.to2dCSS()
                  ),
                  this.finalTransform._opMdf &&
                    this.transformedElement.setAttribute(
                      'opacity',
                      this.finalTransform.mProp.o.v
                    );
              },
              destroyBaseElement: function () {
                (this.layerElement = null),
                  (this.matteElement = null),
                  this.maskManager.destroy();
              },
              getBaseElement: function () {
                return this.data.hd ? null : this.baseElement;
              },
              createRenderableComponents: function () {
                (this.maskManager = new MaskElement(
                  this.data,
                  this,
                  this.globalData
                )),
                  (this.renderableEffectsManager = new SVGEffects(this));
              },
              setMatte: function (t) {
                this.matteElement &&
                  this.matteElement.setAttribute(
                    'mask',
                    'url(' + locationHref + '#' + t + ')'
                  );
              },
            }),
            (IShapeElement.prototype = {
              addShapeToModifiers: function (t) {
                var e,
                  r = this.shapeModifiers.length;
                for (e = 0; e < r; e += 1) this.shapeModifiers[e].addShape(t);
              },
              isShapeInAnimatedModifiers: function (t) {
                for (var e = this.shapeModifiers.length; 0 < e; )
                  if (this.shapeModifiers[0].isAnimatedWithShape(t)) return !0;
                return !1;
              },
              renderModifiers: function () {
                if (this.shapeModifiers.length) {
                  var t,
                    e = this.shapes.length;
                  for (t = 0; t < e; t += 1) this.shapes[t].sh.reset();
                  for (t = (e = this.shapeModifiers.length) - 1; t >= 0; t -= 1)
                    this.shapeModifiers[t].processShapes(this._isFirstFrame);
                }
              },
              lcEnum: { 1: 'butt', 2: 'round', 3: 'square' },
              ljEnum: { 1: 'miter', 2: 'round', 3: 'bevel' },
              searchProcessedElement: function (t) {
                for (
                  var e = this.processedElements, r = 0, i = e.length;
                  r < i;

                ) {
                  if (e[r].elem === t) return e[r].pos;
                  r += 1;
                }
                return 0;
              },
              addProcessedElement: function (t, e) {
                for (var r = this.processedElements, i = r.length; i; )
                  if (r[(i -= 1)].elem === t) return void (r[i].pos = e);
                r.push(new ProcessedElement(t, e));
              },
              prepareFrame: function (t) {
                this.prepareRenderableFrame(t),
                  this.prepareProperties(t, this.isInRange);
              },
            }),
            (ITextElement.prototype.initElement = function (t, e, r) {
              (this.lettersChangedFlag = !0),
                this.initFrame(),
                this.initBaseData(t, e, r),
                (this.textProperty = new TextProperty(
                  this,
                  t.t,
                  this.dynamicProperties
                )),
                (this.textAnimator = new TextAnimatorProperty(
                  t.t,
                  this.renderType,
                  this
                )),
                this.initTransform(t, e, r),
                this.initHierarchy(),
                this.initRenderable(),
                this.initRendererElement(),
                this.createContainerElements(),
                this.createRenderableComponents(),
                this.createContent(),
                this.hide(),
                this.textAnimator.searchProperties(this.dynamicProperties);
            }),
            (ITextElement.prototype.prepareFrame = function (t) {
              (this._mdf = !1),
                this.prepareRenderableFrame(t),
                this.prepareProperties(t, this.isInRange),
                (this.textProperty._mdf || this.textProperty._isFirstFrame) &&
                  (this.buildNewText(),
                  (this.textProperty._isFirstFrame = !1),
                  (this.textProperty._mdf = !1));
            }),
            (ITextElement.prototype.createPathShape = function (t, e) {
              var r,
                i,
                s = e.length,
                n = '';
              for (r = 0; r < s; r += 1)
                (i = e[r].ks.k), (n += buildShapeString(i, i.i.length, !0, t));
              return n;
            }),
            (ITextElement.prototype.updateDocumentData = function (t, e) {
              this.textProperty.updateDocumentData(t, e);
            }),
            (ITextElement.prototype.canResizeFont = function (t) {
              this.textProperty.canResizeFont(t);
            }),
            (ITextElement.prototype.setMinimumFontSize = function (t) {
              this.textProperty.setMinimumFontSize(t);
            }),
            (ITextElement.prototype.applyTextPropertiesToMatrix = function (
              t,
              e,
              r,
              i,
              s
            ) {
              switch (
                (t.ps && e.translate(t.ps[0], t.ps[1] + t.ascent, 0),
                e.translate(0, -t.ls, 0),
                t.j)
              ) {
                case 1:
                  e.translate(
                    t.justifyOffset + (t.boxWidth - t.lineWidths[r]),
                    0,
                    0
                  );
                  break;
                case 2:
                  e.translate(
                    t.justifyOffset + (t.boxWidth - t.lineWidths[r]) / 2,
                    0,
                    0
                  );
              }
              e.translate(i, s, 0);
            }),
            (ITextElement.prototype.buildColor = function (t) {
              return (
                'rgb(' +
                Math.round(255 * t[0]) +
                ',' +
                Math.round(255 * t[1]) +
                ',' +
                Math.round(255 * t[2]) +
                ')'
              );
            }),
            (ITextElement.prototype.emptyProp = new LetterProps()),
            (ITextElement.prototype.destroy = function () {}),
            extendPrototype(
              [
                BaseElement,
                TransformElement,
                HierarchyElement,
                FrameElement,
                RenderableDOMElement,
              ],
              ICompElement
            ),
            (ICompElement.prototype.initElement = function (t, e, r) {
              this.initFrame(),
                this.initBaseData(t, e, r),
                this.initTransform(t, e, r),
                this.initRenderable(),
                this.initHierarchy(),
                this.initRendererElement(),
                this.createContainerElements(),
                this.createRenderableComponents(),
                (!this.data.xt && e.progressiveLoad) || this.buildAllItems(),
                this.hide();
            }),
            (ICompElement.prototype.prepareFrame = function (t) {
              if (
                ((this._mdf = !1),
                this.prepareRenderableFrame(t),
                this.prepareProperties(t, this.isInRange),
                this.isInRange || this.data.xt)
              ) {
                if (this.tm._placeholder) this.renderedFrame = t / this.data.sr;
                else {
                  var e = this.tm.v;
                  e === this.data.op && (e = this.data.op - 1),
                    (this.renderedFrame = e);
                }
                var r,
                  i = this.elements.length;
                for (
                  this.completeLayers || this.checkLayers(this.renderedFrame),
                    r = i - 1;
                  r >= 0;
                  r -= 1
                )
                  (this.completeLayers || this.elements[r]) &&
                    (this.elements[r].prepareFrame(
                      this.renderedFrame - this.layers[r].st
                    ),
                    this.elements[r]._mdf && (this._mdf = !0));
              }
            }),
            (ICompElement.prototype.renderInnerContent = function () {
              var t,
                e = this.layers.length;
              for (t = 0; t < e; t += 1)
                (this.completeLayers || this.elements[t]) &&
                  this.elements[t].renderFrame();
            }),
            (ICompElement.prototype.setElements = function (t) {
              this.elements = t;
            }),
            (ICompElement.prototype.getElements = function () {
              return this.elements;
            }),
            (ICompElement.prototype.destroyElements = function () {
              var t,
                e = this.layers.length;
              for (t = 0; t < e; t += 1)
                this.elements[t] && this.elements[t].destroy();
            }),
            (ICompElement.prototype.destroy = function () {
              this.destroyElements(), this.destroyBaseElement();
            }),
            extendPrototype(
              [
                BaseElement,
                TransformElement,
                SVGBaseElement,
                HierarchyElement,
                FrameElement,
                RenderableDOMElement,
              ],
              IImageElement
            ),
            (IImageElement.prototype.createContent = function () {
              var t = this.globalData.getAssetsPath(this.assetData);
              (this.innerElem = createNS('image')),
                this.innerElem.setAttribute('width', this.assetData.w + 'px'),
                this.innerElem.setAttribute('height', this.assetData.h + 'px'),
                this.innerElem.setAttribute(
                  'preserveAspectRatio',
                  this.assetData.pr ||
                    this.globalData.renderConfig.imagePreserveAspectRatio
                ),
                this.innerElem.setAttributeNS(
                  'http://www.w3.org/1999/xlink',
                  'href',
                  t
                ),
                this.layerElement.appendChild(this.innerElem);
            }),
            (IImageElement.prototype.sourceRectAtTime = function () {
              return this.sourceRect;
            }),
            extendPrototype([IImageElement], ISolidElement),
            (ISolidElement.prototype.createContent = function () {
              var t = createNS('rect');
              t.setAttribute('width', this.data.sw),
                t.setAttribute('height', this.data.sh),
                t.setAttribute('fill', this.data.sc),
                this.layerElement.appendChild(t);
            }),
            extendPrototype(
              [SVGRenderer, ICompElement, SVGBaseElement],
              SVGCompElement
            ),
            extendPrototype(
              [
                BaseElement,
                TransformElement,
                SVGBaseElement,
                HierarchyElement,
                FrameElement,
                RenderableDOMElement,
                ITextElement,
              ],
              SVGTextElement
            ),
            (SVGTextElement.prototype.createContent = function () {
              this.data.singleShape &&
                !this.globalData.fontManager.chars &&
                (this.textContainer = createNS('text'));
            }),
            (SVGTextElement.prototype.buildTextContents = function (t) {
              for (var e = 0, r = t.length, i = [], s = ''; e < r; )
                t[e] === String.fromCharCode(13) ||
                t[e] === String.fromCharCode(3)
                  ? (i.push(s), (s = ''))
                  : (s += t[e]),
                  (e += 1);
              return i.push(s), i;
            }),
            (SVGTextElement.prototype.buildNewText = function () {
              var t,
                e,
                r = this.textProperty.currentData;
              (this.renderedLetters = createSizedArray(r ? r.l.length : 0)),
                r.fc
                  ? this.layerElement.setAttribute(
                      'fill',
                      this.buildColor(r.fc)
                    )
                  : this.layerElement.setAttribute('fill', 'rgba(0,0,0,0)'),
                r.sc &&
                  (this.layerElement.setAttribute(
                    'stroke',
                    this.buildColor(r.sc)
                  ),
                  this.layerElement.setAttribute('stroke-width', r.sw)),
                this.layerElement.setAttribute('font-size', r.finalSize);
              var i = this.globalData.fontManager.getFontByName(r.f);
              if (i.fClass) this.layerElement.setAttribute('class', i.fClass);
              else {
                this.layerElement.setAttribute('font-family', i.fFamily);
                var s = r.fWeight,
                  n = r.fStyle;
                this.layerElement.setAttribute('font-style', n),
                  this.layerElement.setAttribute('font-weight', s);
              }
              this.layerElement.setAttribute('aria-label', r.t);
              var a,
                o = r.l || [],
                h = !!this.globalData.fontManager.chars;
              e = o.length;
              var l,
                p = this.mHelper,
                c = '',
                f = this.data.singleShape,
                d = 0,
                u = 0,
                m = !0,
                y = (r.tr / 1e3) * r.finalSize;
              if (!f || h || r.sz) {
                var g,
                  v,
                  _ = this.textSpans.length;
                for (t = 0; t < e; t += 1)
                  (h && f && 0 !== t) ||
                    ((a =
                      _ > t
                        ? this.textSpans[t]
                        : createNS(h ? 'path' : 'text')),
                    _ <= t &&
                      (a.setAttribute('stroke-linecap', 'butt'),
                      a.setAttribute('stroke-linejoin', 'round'),
                      a.setAttribute('stroke-miterlimit', '4'),
                      (this.textSpans[t] = a),
                      this.layerElement.appendChild(a)),
                    (a.style.display = 'inherit')),
                    p.reset(),
                    p.scale(r.finalSize / 100, r.finalSize / 100),
                    f &&
                      (o[t].n &&
                        ((d = -y),
                        (u += r.yOffset),
                        (u += m ? 1 : 0),
                        (m = !1)),
                      this.applyTextPropertiesToMatrix(r, p, o[t].line, d, u),
                      (d += o[t].l || 0),
                      (d += y)),
                    h
                      ? ((l = (g =
                          ((v = this.globalData.fontManager.getCharData(
                            r.finalText[t],
                            i.fStyle,
                            this.globalData.fontManager.getFontByName(r.f)
                              .fFamily
                          )) &&
                            v.data) ||
                          {}).shapes
                          ? g.shapes[0].it
                          : []),
                        f
                          ? (c += this.createPathShape(p, l))
                          : a.setAttribute('d', this.createPathShape(p, l)))
                      : (f &&
                          a.setAttribute(
                            'transform',
                            'translate(' + p.props[12] + ',' + p.props[13] + ')'
                          ),
                        (a.textContent = o[t].val),
                        a.setAttributeNS(
                          'http://www.w3.org/XML/1998/namespace',
                          'xml:space',
                          'preserve'
                        ));
                f && a && a.setAttribute('d', c);
              } else {
                var b = this.textContainer,
                  S = 'start';
                switch (r.j) {
                  case 1:
                    S = 'end';
                    break;
                  case 2:
                    S = 'middle';
                }
                b.setAttribute('text-anchor', S),
                  b.setAttribute('letter-spacing', y);
                var P = this.buildTextContents(r.finalText);
                for (
                  e = P.length, u = r.ps ? r.ps[1] + r.ascent : 0, t = 0;
                  t < e;
                  t += 1
                )
                  ((a = this.textSpans[t] || createNS('tspan')).textContent =
                    P[t]),
                    a.setAttribute('x', 0),
                    a.setAttribute('y', u),
                    (a.style.display = 'inherit'),
                    b.appendChild(a),
                    (this.textSpans[t] = a),
                    (u += r.finalLineHeight);
                this.layerElement.appendChild(b);
              }
              for (; t < this.textSpans.length; )
                (this.textSpans[t].style.display = 'none'), (t += 1);
              this._sizeChanged = !0;
            }),
            (SVGTextElement.prototype.sourceRectAtTime = function (t) {
              if (
                (this.prepareFrame(this.comp.renderedFrame - this.data.st),
                this.renderInnerContent(),
                this._sizeChanged)
              ) {
                this._sizeChanged = !1;
                var e = this.layerElement.getBBox();
                this.bbox = {
                  top: e.y,
                  left: e.x,
                  width: e.width,
                  height: e.height,
                };
              }
              return this.bbox;
            }),
            (SVGTextElement.prototype.renderInnerContent = function () {
              if (
                !this.data.singleShape &&
                (this.textAnimator.getMeasures(
                  this.textProperty.currentData,
                  this.lettersChangedFlag
                ),
                this.lettersChangedFlag || this.textAnimator.lettersChangedFlag)
              ) {
                var t, e;
                this._sizeChanged = !0;
                var r,
                  i,
                  s = this.textAnimator.renderedLetters,
                  n = this.textProperty.currentData.l;
                for (e = n.length, t = 0; t < e; t += 1)
                  n[t].n ||
                    ((r = s[t]),
                    (i = this.textSpans[t]),
                    r._mdf.m && i.setAttribute('transform', r.m),
                    r._mdf.o && i.setAttribute('opacity', r.o),
                    r._mdf.sw && i.setAttribute('stroke-width', r.sw),
                    r._mdf.sc && i.setAttribute('stroke', r.sc),
                    r._mdf.fc && i.setAttribute('fill', r.fc));
              }
            }),
            extendPrototype(
              [
                BaseElement,
                TransformElement,
                SVGBaseElement,
                IShapeElement,
                HierarchyElement,
                FrameElement,
                RenderableDOMElement,
              ],
              SVGShapeElement
            ),
            (SVGShapeElement.prototype.initSecondaryElement = function () {}),
            (SVGShapeElement.prototype.identityMatrix = new Matrix()),
            (SVGShapeElement.prototype.buildExpressionInterface =
              function () {}),
            (SVGShapeElement.prototype.createContent = function () {
              this.searchShapes(
                this.shapesData,
                this.itemsData,
                this.prevViewData,
                this.layerElement,
                0,
                [],
                !0
              ),
                this.filterUniqueShapes();
            }),
            (SVGShapeElement.prototype.filterUniqueShapes = function () {
              var t,
                e,
                r,
                i,
                s = this.shapes.length,
                n = this.stylesList.length,
                a = [],
                o = !1;
              for (r = 0; r < n; r += 1) {
                for (
                  i = this.stylesList[r], o = !1, a.length = 0, t = 0;
                  t < s;
                  t += 1
                )
                  -1 !== (e = this.shapes[t]).styles.indexOf(i) &&
                    (a.push(e), (o = e._isAnimated || o));
                a.length > 1 && o && this.setShapesAsAnimated(a);
              }
            }),
            (SVGShapeElement.prototype.setShapesAsAnimated = function (t) {
              var e,
                r = t.length;
              for (e = 0; e < r; e += 1) t[e].setAsAnimated();
            }),
            (SVGShapeElement.prototype.createStyleElement = function (t, e) {
              var r,
                i = new SVGStyleData(t, e),
                s = i.pElem;
              if ('st' === t.ty) r = new SVGStrokeStyleData(this, t, i);
              else if ('fl' === t.ty) r = new SVGFillStyleData(this, t, i);
              else if ('gf' === t.ty || 'gs' === t.ty) {
                (r = new (
                  'gf' === t.ty
                    ? SVGGradientFillStyleData
                    : SVGGradientStrokeStyleData
                )(this, t, i)),
                  this.globalData.defs.appendChild(r.gf),
                  r.maskId &&
                    (this.globalData.defs.appendChild(r.ms),
                    this.globalData.defs.appendChild(r.of),
                    s.setAttribute(
                      'mask',
                      'url(' + locationHref + '#' + r.maskId + ')'
                    ));
              }
              return (
                ('st' !== t.ty && 'gs' !== t.ty) ||
                  (s.setAttribute(
                    'stroke-linecap',
                    this.lcEnum[t.lc] || 'round'
                  ),
                  s.setAttribute(
                    'stroke-linejoin',
                    this.ljEnum[t.lj] || 'round'
                  ),
                  s.setAttribute('fill-opacity', '0'),
                  1 === t.lj && s.setAttribute('stroke-miterlimit', t.ml)),
                2 === t.r && s.setAttribute('fill-rule', 'evenodd'),
                t.ln && s.setAttribute('id', t.ln),
                t.cl && s.setAttribute('class', t.cl),
                t.bm && (s.style['mix-blend-mode'] = getBlendMode(t.bm)),
                this.stylesList.push(i),
                this.addToAnimatedContents(t, r),
                r
              );
            }),
            (SVGShapeElement.prototype.createGroupElement = function (t) {
              var e = new ShapeGroupData();
              return (
                t.ln && e.gr.setAttribute('id', t.ln),
                t.cl && e.gr.setAttribute('class', t.cl),
                t.bm && (e.gr.style['mix-blend-mode'] = getBlendMode(t.bm)),
                e
              );
            }),
            (SVGShapeElement.prototype.createTransformElement = function (
              t,
              e
            ) {
              var r = TransformPropertyFactory.getTransformProperty(
                  this,
                  t,
                  this
                ),
                i = new SVGTransformData(r, r.o, e);
              return this.addToAnimatedContents(t, i), i;
            }),
            (SVGShapeElement.prototype.createShapeElement = function (t, e, r) {
              var i = 4;
              'rc' === t.ty
                ? (i = 5)
                : 'el' === t.ty
                ? (i = 6)
                : 'sr' === t.ty && (i = 7);
              var s = new SVGShapeData(
                e,
                r,
                ShapePropertyFactory.getShapeProp(this, t, i, this)
              );
              return (
                this.shapes.push(s),
                this.addShapeToModifiers(s),
                this.addToAnimatedContents(t, s),
                s
              );
            }),
            (SVGShapeElement.prototype.addToAnimatedContents = function (t, e) {
              for (var r = 0, i = this.animatedContents.length; r < i; ) {
                if (this.animatedContents[r].element === e) return;
                r += 1;
              }
              this.animatedContents.push({
                fn: SVGElementsRenderer.createRenderFunction(t),
                element: e,
                data: t,
              });
            }),
            (SVGShapeElement.prototype.setElementStyles = function (t) {
              var e,
                r = t.styles,
                i = this.stylesList.length;
              for (e = 0; e < i; e += 1)
                this.stylesList[e].closed || r.push(this.stylesList[e]);
            }),
            (SVGShapeElement.prototype.reloadShapes = function () {
              this._isFirstFrame = !0;
              var t,
                e = this.itemsData.length;
              for (t = 0; t < e; t += 1)
                this.prevViewData[t] = this.itemsData[t];
              for (
                this.searchShapes(
                  this.shapesData,
                  this.itemsData,
                  this.prevViewData,
                  this.layerElement,
                  0,
                  [],
                  !0
                ),
                  this.filterUniqueShapes(),
                  e = this.dynamicProperties.length,
                  t = 0;
                t < e;
                t += 1
              )
                this.dynamicProperties[t].getValue();
              this.renderModifiers();
            }),
            (SVGShapeElement.prototype.searchShapes = function (
              t,
              e,
              r,
              i,
              s,
              n,
              a
            ) {
              var o,
                h,
                l,
                p,
                c,
                f,
                d = [].concat(n),
                u = t.length - 1,
                m = [],
                y = [];
              for (o = u; o >= 0; o -= 1) {
                if (
                  ((f = this.searchProcessedElement(t[o]))
                    ? (e[o] = r[f - 1])
                    : (t[o]._render = a),
                  'fl' == t[o].ty ||
                    'st' == t[o].ty ||
                    'gf' == t[o].ty ||
                    'gs' == t[o].ty)
                )
                  f
                    ? (e[o].style.closed = !1)
                    : (e[o] = this.createStyleElement(t[o], s)),
                    t[o]._render && i.appendChild(e[o].style.pElem),
                    m.push(e[o].style);
                else if ('gr' == t[o].ty) {
                  if (f)
                    for (l = e[o].it.length, h = 0; h < l; h += 1)
                      e[o].prevViewData[h] = e[o].it[h];
                  else e[o] = this.createGroupElement(t[o]);
                  this.searchShapes(
                    t[o].it,
                    e[o].it,
                    e[o].prevViewData,
                    e[o].gr,
                    s + 1,
                    d,
                    a
                  ),
                    t[o]._render && i.appendChild(e[o].gr);
                } else
                  'tr' == t[o].ty
                    ? (f || (e[o] = this.createTransformElement(t[o], i)),
                      (p = e[o].transform),
                      d.push(p))
                    : 'sh' == t[o].ty ||
                      'rc' == t[o].ty ||
                      'el' == t[o].ty ||
                      'sr' == t[o].ty
                    ? (f || (e[o] = this.createShapeElement(t[o], d, s)),
                      this.setElementStyles(e[o]))
                    : 'tm' == t[o].ty ||
                      'rd' == t[o].ty ||
                      'ms' == t[o].ty ||
                      'pb' == t[o].ty
                    ? (f
                        ? ((c = e[o]).closed = !1)
                        : ((c = ShapeModifiers.getModifier(t[o].ty)).init(
                            this,
                            t[o]
                          ),
                          (e[o] = c),
                          this.shapeModifiers.push(c)),
                      y.push(c))
                    : 'rp' == t[o].ty &&
                      (f
                        ? ((c = e[o]).closed = !0)
                        : ((c = ShapeModifiers.getModifier(t[o].ty)),
                          (e[o] = c),
                          c.init(this, t, o, e),
                          this.shapeModifiers.push(c),
                          (a = !1)),
                      y.push(c));
                this.addProcessedElement(t[o], o + 1);
              }
              for (u = m.length, o = 0; o < u; o += 1) m[o].closed = !0;
              for (u = y.length, o = 0; o < u; o += 1) y[o].closed = !0;
            }),
            (SVGShapeElement.prototype.renderInnerContent = function () {
              this.renderModifiers();
              var t,
                e = this.stylesList.length;
              for (t = 0; t < e; t += 1) this.stylesList[t].reset();
              for (this.renderShape(), t = 0; t < e; t += 1)
                (this.stylesList[t]._mdf || this._isFirstFrame) &&
                  (this.stylesList[t].msElem &&
                    (this.stylesList[t].msElem.setAttribute(
                      'd',
                      this.stylesList[t].d
                    ),
                    (this.stylesList[t].d = 'M0 0' + this.stylesList[t].d)),
                  this.stylesList[t].pElem.setAttribute(
                    'd',
                    this.stylesList[t].d || 'M0 0'
                  ));
            }),
            (SVGShapeElement.prototype.renderShape = function () {
              var t,
                e,
                r = this.animatedContents.length;
              for (t = 0; t < r; t += 1)
                (e = this.animatedContents[t]),
                  (this._isFirstFrame || e.element._isAnimated) &&
                    !0 !== e.data &&
                    e.fn(e.data, e.element, this._isFirstFrame);
            }),
            (SVGShapeElement.prototype.destroy = function () {
              this.destroyBaseElement(),
                (this.shapesData = null),
                (this.itemsData = null);
            }),
            (SVGTintFilter.prototype.renderFrame = function (t) {
              if (t || this.filterManager._mdf) {
                var e = this.filterManager.effectElements[0].p.v,
                  r = this.filterManager.effectElements[1].p.v,
                  i = this.filterManager.effectElements[2].p.v / 100;
                this.matrixFilter.setAttribute(
                  'values',
                  r[0] -
                    e[0] +
                    ' 0 0 0 ' +
                    e[0] +
                    ' ' +
                    (r[1] - e[1]) +
                    ' 0 0 0 ' +
                    e[1] +
                    ' ' +
                    (r[2] - e[2]) +
                    ' 0 0 0 ' +
                    e[2] +
                    ' 0 0 0 ' +
                    i +
                    ' 0'
                );
              }
            }),
            (SVGFillFilter.prototype.renderFrame = function (t) {
              if (t || this.filterManager._mdf) {
                var e = this.filterManager.effectElements[2].p.v,
                  r = this.filterManager.effectElements[6].p.v;
                this.matrixFilter.setAttribute(
                  'values',
                  '0 0 0 0 ' +
                    e[0] +
                    ' 0 0 0 0 ' +
                    e[1] +
                    ' 0 0 0 0 ' +
                    e[2] +
                    ' 0 0 0 ' +
                    r +
                    ' 0'
                );
              }
            }),
            (SVGGaussianBlurEffect.prototype.renderFrame = function (t) {
              if (t || this.filterManager._mdf) {
                var e = 0.3 * this.filterManager.effectElements[0].p.v,
                  r = this.filterManager.effectElements[1].p.v,
                  i = 3 == r ? 0 : e,
                  s = 2 == r ? 0 : e;
                this.feGaussianBlur.setAttribute('stdDeviation', i + ' ' + s);
                var n =
                  1 == this.filterManager.effectElements[2].p.v
                    ? 'wrap'
                    : 'duplicate';
                this.feGaussianBlur.setAttribute('edgeMode', n);
              }
            }),
            (SVGStrokeEffect.prototype.initialize = function () {
              var t,
                e,
                r,
                i,
                s =
                  this.elem.layerElement.children ||
                  this.elem.layerElement.childNodes;
              for (
                1 === this.filterManager.effectElements[1].p.v
                  ? ((i = this.elem.maskManager.masksProperties.length),
                    (r = 0))
                  : (i =
                      (r = this.filterManager.effectElements[0].p.v - 1) + 1),
                  (e = createNS('g')).setAttribute('fill', 'none'),
                  e.setAttribute('stroke-linecap', 'round'),
                  e.setAttribute('stroke-dashoffset', 1);
                r < i;
                r += 1
              )
                (t = createNS('path')),
                  e.appendChild(t),
                  this.paths.push({ p: t, m: r });
              if (3 === this.filterManager.effectElements[10].p.v) {
                var n = createNS('mask'),
                  a = createElementID();
                n.setAttribute('id', a),
                  n.setAttribute('mask-type', 'alpha'),
                  n.appendChild(e),
                  this.elem.globalData.defs.appendChild(n);
                var o = createNS('g');
                for (
                  o.setAttribute('mask', 'url(' + locationHref + '#' + a + ')');
                  s[0];

                )
                  o.appendChild(s[0]);
                this.elem.layerElement.appendChild(o),
                  (this.masker = n),
                  e.setAttribute('stroke', '#fff');
              } else if (
                1 === this.filterManager.effectElements[10].p.v ||
                2 === this.filterManager.effectElements[10].p.v
              ) {
                if (2 === this.filterManager.effectElements[10].p.v)
                  for (
                    s =
                      this.elem.layerElement.children ||
                      this.elem.layerElement.childNodes;
                    s.length;

                  )
                    this.elem.layerElement.removeChild(s[0]);
                this.elem.layerElement.appendChild(e),
                  this.elem.layerElement.removeAttribute('mask'),
                  e.setAttribute('stroke', '#fff');
              }
              (this.initialized = !0), (this.pathMasker = e);
            }),
            (SVGStrokeEffect.prototype.renderFrame = function (t) {
              this.initialized || this.initialize();
              var e,
                r,
                i,
                s = this.paths.length;
              for (e = 0; e < s; e += 1)
                if (
                  -1 !== this.paths[e].m &&
                  ((r = this.elem.maskManager.viewData[this.paths[e].m]),
                  (i = this.paths[e].p),
                  (t || this.filterManager._mdf || r.prop._mdf) &&
                    i.setAttribute('d', r.lastPath),
                  t ||
                    this.filterManager.effectElements[9].p._mdf ||
                    this.filterManager.effectElements[4].p._mdf ||
                    this.filterManager.effectElements[7].p._mdf ||
                    this.filterManager.effectElements[8].p._mdf ||
                    r.prop._mdf)
                ) {
                  var n;
                  if (
                    0 !== this.filterManager.effectElements[7].p.v ||
                    100 !== this.filterManager.effectElements[8].p.v
                  ) {
                    var a =
                        Math.min(
                          this.filterManager.effectElements[7].p.v,
                          this.filterManager.effectElements[8].p.v
                        ) / 100,
                      o =
                        Math.max(
                          this.filterManager.effectElements[7].p.v,
                          this.filterManager.effectElements[8].p.v
                        ) / 100,
                      h = i.getTotalLength();
                    n = '0 0 0 ' + h * a + ' ';
                    var l,
                      p = h * (o - a),
                      c =
                        1 +
                        (2 *
                          this.filterManager.effectElements[4].p.v *
                          this.filterManager.effectElements[9].p.v) /
                          100,
                      f = Math.floor(p / c);
                    for (l = 0; l < f; l += 1)
                      n +=
                        '1 ' +
                        (2 *
                          this.filterManager.effectElements[4].p.v *
                          this.filterManager.effectElements[9].p.v) /
                          100 +
                        ' ';
                    n += '0 ' + 10 * h + ' 0 0';
                  } else
                    n =
                      '1 ' +
                      (2 *
                        this.filterManager.effectElements[4].p.v *
                        this.filterManager.effectElements[9].p.v) /
                        100;
                  i.setAttribute('stroke-dasharray', n);
                }
              if (
                ((t || this.filterManager.effectElements[4].p._mdf) &&
                  this.pathMasker.setAttribute(
                    'stroke-width',
                    2 * this.filterManager.effectElements[4].p.v
                  ),
                (t || this.filterManager.effectElements[6].p._mdf) &&
                  this.pathMasker.setAttribute(
                    'opacity',
                    this.filterManager.effectElements[6].p.v
                  ),
                (1 === this.filterManager.effectElements[10].p.v ||
                  2 === this.filterManager.effectElements[10].p.v) &&
                  (t || this.filterManager.effectElements[3].p._mdf))
              ) {
                var d = this.filterManager.effectElements[3].p.v;
                this.pathMasker.setAttribute(
                  'stroke',
                  'rgb(' +
                    bm_floor(255 * d[0]) +
                    ',' +
                    bm_floor(255 * d[1]) +
                    ',' +
                    bm_floor(255 * d[2]) +
                    ')'
                );
              }
            }),
            (SVGTritoneFilter.prototype.renderFrame = function (t) {
              if (t || this.filterManager._mdf) {
                var e = this.filterManager.effectElements[0].p.v,
                  r = this.filterManager.effectElements[1].p.v,
                  i = this.filterManager.effectElements[2].p.v,
                  s = i[0] + ' ' + r[0] + ' ' + e[0],
                  n = i[1] + ' ' + r[1] + ' ' + e[1],
                  a = i[2] + ' ' + r[2] + ' ' + e[2];
                this.feFuncR.setAttribute('tableValues', s),
                  this.feFuncG.setAttribute('tableValues', n),
                  this.feFuncB.setAttribute('tableValues', a);
              }
            }),
            (SVGProLevelsFilter.prototype.createFeFunc = function (t, e) {
              var r = createNS(t);
              return r.setAttribute('type', 'table'), e.appendChild(r), r;
            }),
            (SVGProLevelsFilter.prototype.getTableValue = function (
              t,
              e,
              r,
              i,
              s
            ) {
              for (
                var n,
                  a,
                  o = 0,
                  h = Math.min(t, e),
                  l = Math.max(t, e),
                  p = Array.call(null, { length: 256 }),
                  c = 0,
                  f = s - i,
                  d = e - t;
                o <= 256;

              )
                (a =
                  (n = o / 256) <= h
                    ? d < 0
                      ? s
                      : i
                    : n >= l
                    ? d < 0
                      ? i
                      : s
                    : i + f * Math.pow((n - t) / d, 1 / r)),
                  (p[c++] = a),
                  (o += 256 / 255);
              return p.join(' ');
            }),
            (SVGProLevelsFilter.prototype.renderFrame = function (t) {
              if (t || this.filterManager._mdf) {
                var e,
                  r = this.filterManager.effectElements;
                this.feFuncRComposed &&
                  (t ||
                    r[3].p._mdf ||
                    r[4].p._mdf ||
                    r[5].p._mdf ||
                    r[6].p._mdf ||
                    r[7].p._mdf) &&
                  ((e = this.getTableValue(
                    r[3].p.v,
                    r[4].p.v,
                    r[5].p.v,
                    r[6].p.v,
                    r[7].p.v
                  )),
                  this.feFuncRComposed.setAttribute('tableValues', e),
                  this.feFuncGComposed.setAttribute('tableValues', e),
                  this.feFuncBComposed.setAttribute('tableValues', e)),
                  this.feFuncR &&
                    (t ||
                      r[10].p._mdf ||
                      r[11].p._mdf ||
                      r[12].p._mdf ||
                      r[13].p._mdf ||
                      r[14].p._mdf) &&
                    ((e = this.getTableValue(
                      r[10].p.v,
                      r[11].p.v,
                      r[12].p.v,
                      r[13].p.v,
                      r[14].p.v
                    )),
                    this.feFuncR.setAttribute('tableValues', e)),
                  this.feFuncG &&
                    (t ||
                      r[17].p._mdf ||
                      r[18].p._mdf ||
                      r[19].p._mdf ||
                      r[20].p._mdf ||
                      r[21].p._mdf) &&
                    ((e = this.getTableValue(
                      r[17].p.v,
                      r[18].p.v,
                      r[19].p.v,
                      r[20].p.v,
                      r[21].p.v
                    )),
                    this.feFuncG.setAttribute('tableValues', e)),
                  this.feFuncB &&
                    (t ||
                      r[24].p._mdf ||
                      r[25].p._mdf ||
                      r[26].p._mdf ||
                      r[27].p._mdf ||
                      r[28].p._mdf) &&
                    ((e = this.getTableValue(
                      r[24].p.v,
                      r[25].p.v,
                      r[26].p.v,
                      r[27].p.v,
                      r[28].p.v
                    )),
                    this.feFuncB.setAttribute('tableValues', e)),
                  this.feFuncA &&
                    (t ||
                      r[31].p._mdf ||
                      r[32].p._mdf ||
                      r[33].p._mdf ||
                      r[34].p._mdf ||
                      r[35].p._mdf) &&
                    ((e = this.getTableValue(
                      r[31].p.v,
                      r[32].p.v,
                      r[33].p.v,
                      r[34].p.v,
                      r[35].p.v
                    )),
                    this.feFuncA.setAttribute('tableValues', e));
              }
            }),
            (SVGDropShadowEffect.prototype.renderFrame = function (t) {
              if (t || this.filterManager._mdf) {
                if (
                  ((t || this.filterManager.effectElements[4].p._mdf) &&
                    this.feGaussianBlur.setAttribute(
                      'stdDeviation',
                      this.filterManager.effectElements[4].p.v / 4
                    ),
                  t || this.filterManager.effectElements[0].p._mdf)
                ) {
                  var e = this.filterManager.effectElements[0].p.v;
                  this.feFlood.setAttribute(
                    'flood-color',
                    rgbToHex(
                      Math.round(255 * e[0]),
                      Math.round(255 * e[1]),
                      Math.round(255 * e[2])
                    )
                  );
                }
                if (
                  ((t || this.filterManager.effectElements[1].p._mdf) &&
                    this.feFlood.setAttribute(
                      'flood-opacity',
                      this.filterManager.effectElements[1].p.v / 255
                    ),
                  t ||
                    this.filterManager.effectElements[2].p._mdf ||
                    this.filterManager.effectElements[3].p._mdf)
                ) {
                  var r = this.filterManager.effectElements[3].p.v,
                    i =
                      (this.filterManager.effectElements[2].p.v - 90) *
                      degToRads,
                    s = r * Math.cos(i),
                    n = r * Math.sin(i);
                  this.feOffset.setAttribute('dx', s),
                    this.feOffset.setAttribute('dy', n);
                }
              }
            });
          var _svgMatteSymbols = [];
          function SVGMatte3Effect(t, e, r) {
            (this.initialized = !1),
              (this.filterManager = e),
              (this.filterElem = t),
              (this.elem = r),
              (r.matteElement = createNS('g')),
              r.matteElement.appendChild(r.layerElement),
              r.matteElement.appendChild(r.transformedElement),
              (r.baseElement = r.matteElement);
          }
          function SVGEffects(t) {
            var e,
              r,
              i = t.data.ef ? t.data.ef.length : 0,
              s = createElementID(),
              n = filtersFactory.createFilter(s),
              a = 0;
            for (this.filters = [], e = 0; e < i; e += 1)
              (r = null),
                20 === t.data.ef[e].ty
                  ? ((a += 1),
                    (r = new SVGTintFilter(
                      n,
                      t.effectsManager.effectElements[e]
                    )))
                  : 21 === t.data.ef[e].ty
                  ? ((a += 1),
                    (r = new SVGFillFilter(
                      n,
                      t.effectsManager.effectElements[e]
                    )))
                  : 22 === t.data.ef[e].ty
                  ? (r = new SVGStrokeEffect(
                      t,
                      t.effectsManager.effectElements[e]
                    ))
                  : 23 === t.data.ef[e].ty
                  ? ((a += 1),
                    (r = new SVGTritoneFilter(
                      n,
                      t.effectsManager.effectElements[e]
                    )))
                  : 24 === t.data.ef[e].ty
                  ? ((a += 1),
                    (r = new SVGProLevelsFilter(
                      n,
                      t.effectsManager.effectElements[e]
                    )))
                  : 25 === t.data.ef[e].ty
                  ? ((a += 1),
                    (r = new SVGDropShadowEffect(
                      n,
                      t.effectsManager.effectElements[e]
                    )))
                  : 28 === t.data.ef[e].ty
                  ? (r = new SVGMatte3Effect(
                      n,
                      t.effectsManager.effectElements[e],
                      t
                    ))
                  : 29 === t.data.ef[e].ty &&
                    ((a += 1),
                    (r = new SVGGaussianBlurEffect(
                      n,
                      t.effectsManager.effectElements[e]
                    ))),
                r && this.filters.push(r);
            a &&
              (t.globalData.defs.appendChild(n),
              t.layerElement.setAttribute(
                'filter',
                'url(' + locationHref + '#' + s + ')'
              )),
              this.filters.length && t.addRenderableComponent(this);
          }
          (SVGMatte3Effect.prototype.findSymbol = function (t) {
            for (var e = 0, r = _svgMatteSymbols.length; e < r; ) {
              if (_svgMatteSymbols[e] === t) return _svgMatteSymbols[e];
              e += 1;
            }
            return null;
          }),
            (SVGMatte3Effect.prototype.replaceInParent = function (t, e) {
              var r = t.layerElement.parentNode;
              if (r) {
                for (
                  var i, s = r.children, n = 0, a = s.length;
                  n < a && s[n] !== t.layerElement;

                )
                  n += 1;
                n <= a - 2 && (i = s[n + 1]);
                var o = createNS('use');
                o.setAttribute('href', '#' + e),
                  i ? r.insertBefore(o, i) : r.appendChild(o);
              }
            }),
            (SVGMatte3Effect.prototype.setElementAsMask = function (t, e) {
              if (!this.findSymbol(e)) {
                var r = createElementID(),
                  i = createNS('mask');
                i.setAttribute('id', e.layerId),
                  i.setAttribute('mask-type', 'alpha'),
                  _svgMatteSymbols.push(e);
                var s = t.globalData.defs;
                s.appendChild(i);
                var n = createNS('symbol');
                n.setAttribute('id', r),
                  this.replaceInParent(e, r),
                  n.appendChild(e.layerElement),
                  s.appendChild(n);
                var a = createNS('use');
                a.setAttribute('href', '#' + r),
                  i.appendChild(a),
                  (e.data.hd = !1),
                  e.show();
              }
              t.setMatte(e.layerId);
            }),
            (SVGMatte3Effect.prototype.initialize = function () {
              for (
                var t = this.filterManager.effectElements[0].p.v,
                  e = this.elem.comp.elements,
                  r = 0,
                  i = e.length;
                r < i;

              )
                e[r] &&
                  e[r].data.ind === t &&
                  this.setElementAsMask(this.elem, e[r]),
                  (r += 1);
              this.initialized = !0;
            }),
            (SVGMatte3Effect.prototype.renderFrame = function () {
              this.initialized || this.initialize();
            }),
            (SVGEffects.prototype.renderFrame = function (t) {
              var e,
                r = this.filters.length;
              for (e = 0; e < r; e += 1) this.filters[e].renderFrame(t);
            });
          var animationManager = (function () {
              var t = {},
                e = [],
                r = 0,
                i = 0,
                s = 0,
                n = !0,
                a = !1;
              function o(t) {
                for (var r = 0, s = t.target; r < i; )
                  e[r].animation === s &&
                    (e.splice(r, 1), (r -= 1), (i -= 1), s.isPaused || p()),
                    (r += 1);
              }
              function h(t, r) {
                if (!t) return null;
                for (var s = 0; s < i; ) {
                  if (e[s].elem == t && null !== e[s].elem)
                    return e[s].animation;
                  s += 1;
                }
                var n = new AnimationItem();
                return c(n, t), n.setData(t, r), n;
              }
              function l() {
                (s += 1), u();
              }
              function p() {
                s -= 1;
              }
              function c(t, r) {
                t.addEventListener('destroy', o),
                  t.addEventListener('_active', l),
                  t.addEventListener('_idle', p),
                  e.push({ elem: r, animation: t }),
                  (i += 1);
              }
              function f(t) {
                var o,
                  h = t - r;
                for (o = 0; o < i; o += 1) e[o].animation.advanceTime(h);
                (r = t), s && !a ? window.requestAnimationFrame(f) : (n = !0);
              }
              function d(t) {
                (r = t), window.requestAnimationFrame(f);
              }
              function u() {
                !a && s && n && (window.requestAnimationFrame(d), (n = !1));
              }
              return (
                (t.registerAnimation = h),
                (t.loadAnimation = function (t) {
                  var e = new AnimationItem();
                  return c(e, null), e.setParams(t), e;
                }),
                (t.setSpeed = function (t, r) {
                  var s;
                  for (s = 0; s < i; s += 1) e[s].animation.setSpeed(t, r);
                }),
                (t.setDirection = function (t, r) {
                  var s;
                  for (s = 0; s < i; s += 1) e[s].animation.setDirection(t, r);
                }),
                (t.play = function (t) {
                  var r;
                  for (r = 0; r < i; r += 1) e[r].animation.play(t);
                }),
                (t.pause = function (t) {
                  var r;
                  for (r = 0; r < i; r += 1) e[r].animation.pause(t);
                }),
                (t.stop = function (t) {
                  var r;
                  for (r = 0; r < i; r += 1) e[r].animation.stop(t);
                }),
                (t.togglePause = function (t) {
                  var r;
                  for (r = 0; r < i; r += 1) e[r].animation.togglePause(t);
                }),
                (t.searchAnimations = function (t, e, r) {
                  var i,
                    s = [].concat(
                      [].slice.call(document.getElementsByClassName('lottie')),
                      [].slice.call(
                        document.getElementsByClassName('bodymovin')
                      )
                    ),
                    n = s.length;
                  for (i = 0; i < n; i += 1)
                    r && s[i].setAttribute('data-bm-type', r), h(s[i], t);
                  if (e && 0 === n) {
                    r || (r = 'svg');
                    var a = document.getElementsByTagName('body')[0];
                    a.innerHTML = '';
                    var o = createTag('div');
                    (o.style.width = '100%'),
                      (o.style.height = '100%'),
                      o.setAttribute('data-bm-type', r),
                      a.appendChild(o),
                      h(o, t);
                  }
                }),
                (t.resize = function () {
                  var t;
                  for (t = 0; t < i; t += 1) e[t].animation.resize();
                }),
                (t.goToAndStop = function (t, r, s) {
                  var n;
                  for (n = 0; n < i; n += 1)
                    e[n].animation.goToAndStop(t, r, s);
                }),
                (t.destroy = function (t) {
                  var r;
                  for (r = i - 1; r >= 0; r -= 1) e[r].animation.destroy(t);
                }),
                (t.freeze = function () {
                  a = !0;
                }),
                (t.unfreeze = function () {
                  (a = !1), u();
                }),
                (t.getRegisteredAnimations = function () {
                  var t,
                    r = e.length,
                    i = [];
                  for (t = 0; t < r; t += 1) i.push(e[t].animation);
                  return i;
                }),
                t
              );
            })(),
            AnimationItem = function () {
              (this._cbs = []),
                (this.name = ''),
                (this.path = ''),
                (this.isLoaded = !1),
                (this.currentFrame = 0),
                (this.currentRawFrame = 0),
                (this.firstFrame = 0),
                (this.totalFrames = 0),
                (this.frameRate = 0),
                (this.frameMult = 0),
                (this.playSpeed = 1),
                (this.playDirection = 1),
                (this.playCount = 0),
                (this.animationData = {}),
                (this.assets = []),
                (this.isPaused = !0),
                (this.autoplay = !1),
                (this.loop = !0),
                (this.renderer = null),
                (this.animationID = createElementID()),
                (this.assetsPath = ''),
                (this.timeCompleted = 0),
                (this.segmentPos = 0),
                (this.isSubframeEnabled = subframeEnabled),
                (this.segments = []),
                (this._idle = !0),
                (this._completedLoop = !1),
                (this.projectInterface = ProjectInterface()),
                (this.imagePreloader = new ImagePreloader());
            };
          extendPrototype([BaseEvent], AnimationItem),
            (AnimationItem.prototype.setParams = function (t) {
              (t.wrapper || t.container) &&
                (this.wrapper = t.wrapper || t.container);
              var e = t.animType ? t.animType : t.renderer ? t.renderer : 'svg';
              switch (e) {
                case 'canvas':
                  this.renderer = new CanvasRenderer(this, t.rendererSettings);
                  break;
                case 'svg':
                  this.renderer = new SVGRenderer(this, t.rendererSettings);
                  break;
                default:
                  this.renderer = new HybridRenderer(this, t.rendererSettings);
              }
              this.imagePreloader.setCacheType(e),
                this.renderer.setProjectInterface(this.projectInterface),
                (this.animType = e),
                '' === t.loop ||
                null === t.loop ||
                void 0 === t.loop ||
                !0 === t.loop
                  ? (this.loop = !0)
                  : !1 === t.loop
                  ? (this.loop = !1)
                  : (this.loop = parseInt(t.loop)),
                (this.autoplay = !('autoplay' in t) || t.autoplay),
                (this.name = t.name ? t.name : ''),
                (this.autoloadSegments =
                  !t.hasOwnProperty('autoloadSegments') || t.autoloadSegments),
                (this.assetsPath = t.assetsPath),
                (this.initialSegment = t.initialSegment),
                t.animationData
                  ? this.configAnimation(t.animationData)
                  : t.path &&
                    (-1 !== t.path.lastIndexOf('\\')
                      ? (this.path = t.path.substr(
                          0,
                          t.path.lastIndexOf('\\') + 1
                        ))
                      : (this.path = t.path.substr(
                          0,
                          t.path.lastIndexOf('/') + 1
                        )),
                    (this.fileName = t.path.substr(
                      t.path.lastIndexOf('/') + 1
                    )),
                    (this.fileName = this.fileName.substr(
                      0,
                      this.fileName.lastIndexOf('.json')
                    )),
                    assetLoader.load(
                      t.path,
                      this.configAnimation.bind(this),
                      function () {
                        this.trigger('data_failed');
                      }.bind(this)
                    ));
            }),
            (AnimationItem.prototype.setData = function (t, e) {
              var r = {
                  wrapper: t,
                  animationData: e
                    ? 'object' == typeof e
                      ? e
                      : JSON.parse(e)
                    : null,
                },
                i = t.attributes;
              (r.path = i.getNamedItem('data-animation-path')
                ? i.getNamedItem('data-animation-path').value
                : i.getNamedItem('data-bm-path')
                ? i.getNamedItem('data-bm-path').value
                : i.getNamedItem('bm-path')
                ? i.getNamedItem('bm-path').value
                : ''),
                (r.animType = i.getNamedItem('data-anim-type')
                  ? i.getNamedItem('data-anim-type').value
                  : i.getNamedItem('data-bm-type')
                  ? i.getNamedItem('data-bm-type').value
                  : i.getNamedItem('bm-type')
                  ? i.getNamedItem('bm-type').value
                  : i.getNamedItem('data-bm-renderer')
                  ? i.getNamedItem('data-bm-renderer').value
                  : i.getNamedItem('bm-renderer')
                  ? i.getNamedItem('bm-renderer').value
                  : 'canvas');
              var s = i.getNamedItem('data-anim-loop')
                ? i.getNamedItem('data-anim-loop').value
                : i.getNamedItem('data-bm-loop')
                ? i.getNamedItem('data-bm-loop').value
                : i.getNamedItem('bm-loop')
                ? i.getNamedItem('bm-loop').value
                : '';
              '' === s ||
                (r.loop = 'false' !== s && ('true' === s || parseInt(s)));
              var n = i.getNamedItem('data-anim-autoplay')
                ? i.getNamedItem('data-anim-autoplay').value
                : i.getNamedItem('data-bm-autoplay')
                ? i.getNamedItem('data-bm-autoplay').value
                : !i.getNamedItem('bm-autoplay') ||
                  i.getNamedItem('bm-autoplay').value;
              (r.autoplay = 'false' !== n),
                (r.name = i.getNamedItem('data-name')
                  ? i.getNamedItem('data-name').value
                  : i.getNamedItem('data-bm-name')
                  ? i.getNamedItem('data-bm-name').value
                  : i.getNamedItem('bm-name')
                  ? i.getNamedItem('bm-name').value
                  : ''),
                'false' ===
                  (i.getNamedItem('data-anim-prerender')
                    ? i.getNamedItem('data-anim-prerender').value
                    : i.getNamedItem('data-bm-prerender')
                    ? i.getNamedItem('data-bm-prerender').value
                    : i.getNamedItem('bm-prerender')
                    ? i.getNamedItem('bm-prerender').value
                    : '') && (r.prerender = !1),
                this.setParams(r);
            }),
            (AnimationItem.prototype.includeLayers = function (t) {
              t.op > this.animationData.op &&
                ((this.animationData.op = t.op),
                (this.totalFrames = Math.floor(t.op - this.animationData.ip)));
              var e,
                r,
                i = this.animationData.layers,
                s = i.length,
                n = t.layers,
                a = n.length;
              for (r = 0; r < a; r += 1)
                for (e = 0; e < s; ) {
                  if (i[e].id == n[r].id) {
                    i[e] = n[r];
                    break;
                  }
                  e += 1;
                }
              if (
                ((t.chars || t.fonts) &&
                  (this.renderer.globalData.fontManager.addChars(t.chars),
                  this.renderer.globalData.fontManager.addFonts(
                    t.fonts,
                    this.renderer.globalData.defs
                  )),
                t.assets)
              )
                for (s = t.assets.length, e = 0; e < s; e += 1)
                  this.animationData.assets.push(t.assets[e]);
              (this.animationData.__complete = !1),
                dataManager.completeData(
                  this.animationData,
                  this.renderer.globalData.fontManager
                ),
                this.renderer.includeLayers(t.layers),
                expressionsPlugin && expressionsPlugin.initExpressions(this),
                this.loadNextSegment();
            }),
            (AnimationItem.prototype.loadNextSegment = function () {
              var t = this.animationData.segments;
              if (!t || 0 === t.length || !this.autoloadSegments)
                return (
                  this.trigger('data_ready'),
                  void (this.timeCompleted = this.totalFrames)
                );
              var e = t.shift();
              this.timeCompleted = e.time * this.frameRate;
              var r =
                this.path + this.fileName + '_' + this.segmentPos + '.json';
              (this.segmentPos += 1),
                assetLoader.load(
                  r,
                  this.includeLayers.bind(this),
                  function () {
                    this.trigger('data_failed');
                  }.bind(this)
                );
            }),
            (AnimationItem.prototype.loadSegments = function () {
              this.animationData.segments ||
                (this.timeCompleted = this.totalFrames),
                this.loadNextSegment();
            }),
            (AnimationItem.prototype.imagesLoaded = function () {
              this.trigger('loaded_images'), this.checkLoaded();
            }),
            (AnimationItem.prototype.preloadImages = function () {
              this.imagePreloader.setAssetsPath(this.assetsPath),
                this.imagePreloader.setPath(this.path),
                this.imagePreloader.loadAssets(
                  this.animationData.assets,
                  this.imagesLoaded.bind(this)
                );
            }),
            (AnimationItem.prototype.configAnimation = function (t) {
              if (this.renderer)
                try {
                  (this.animationData = t),
                    this.initialSegment
                      ? ((this.totalFrames = Math.floor(
                          this.initialSegment[1] - this.initialSegment[0]
                        )),
                        (this.firstFrame = Math.round(this.initialSegment[0])))
                      : ((this.totalFrames = Math.floor(
                          this.animationData.op - this.animationData.ip
                        )),
                        (this.firstFrame = Math.round(this.animationData.ip))),
                    this.renderer.configAnimation(t),
                    t.assets || (t.assets = []),
                    (this.assets = this.animationData.assets),
                    (this.frameRate = this.animationData.fr),
                    (this.frameMult = this.animationData.fr / 1e3),
                    this.renderer.searchExtraCompositions(t.assets),
                    this.trigger('config_ready'),
                    this.preloadImages(),
                    this.loadSegments(),
                    this.updaFrameModifier(),
                    this.waitForFontsLoaded();
                } catch (t) {
                  this.triggerConfigError(t);
                }
            }),
            (AnimationItem.prototype.waitForFontsLoaded = function () {
              this.renderer &&
                (this.renderer.globalData.fontManager.isLoaded
                  ? this.checkLoaded()
                  : setTimeout(this.waitForFontsLoaded.bind(this), 20));
            }),
            (AnimationItem.prototype.checkLoaded = function () {
              this.isLoaded ||
                !this.renderer.globalData.fontManager.isLoaded ||
                (!this.imagePreloader.loaded() &&
                  'canvas' === this.renderer.rendererType) ||
                ((this.isLoaded = !0),
                dataManager.completeData(
                  this.animationData,
                  this.renderer.globalData.fontManager
                ),
                expressionsPlugin && expressionsPlugin.initExpressions(this),
                this.renderer.initItems(),
                setTimeout(
                  function () {
                    this.trigger('DOMLoaded');
                  }.bind(this),
                  0
                ),
                this.gotoFrame(),
                this.autoplay && this.play());
            }),
            (AnimationItem.prototype.resize = function () {
              this.renderer.updateContainerSize();
            }),
            (AnimationItem.prototype.setSubframe = function (t) {
              this.isSubframeEnabled = !!t;
            }),
            (AnimationItem.prototype.gotoFrame = function () {
              (this.currentFrame = this.isSubframeEnabled
                ? this.currentRawFrame
                : ~~this.currentRawFrame),
                this.timeCompleted !== this.totalFrames &&
                  this.currentFrame > this.timeCompleted &&
                  (this.currentFrame = this.timeCompleted),
                this.trigger('enterFrame'),
                this.renderFrame();
            }),
            (AnimationItem.prototype.renderFrame = function () {
              if (!1 !== this.isLoaded)
                try {
                  this.renderer.renderFrame(
                    this.currentFrame + this.firstFrame
                  );
                } catch (t) {
                  this.triggerRenderFrameError(t);
                }
            }),
            (AnimationItem.prototype.play = function (t) {
              (t && this.name != t) ||
                (!0 === this.isPaused &&
                  ((this.isPaused = !1),
                  this._idle && ((this._idle = !1), this.trigger('_active'))));
            }),
            (AnimationItem.prototype.pause = function (t) {
              (t && this.name != t) ||
                (!1 === this.isPaused &&
                  ((this.isPaused = !0),
                  (this._idle = !0),
                  this.trigger('_idle')));
            }),
            (AnimationItem.prototype.togglePause = function (t) {
              (t && this.name != t) ||
                (!0 === this.isPaused ? this.play() : this.pause());
            }),
            (AnimationItem.prototype.stop = function (t) {
              (t && this.name != t) ||
                (this.pause(),
                (this.playCount = 0),
                (this._completedLoop = !1),
                this.setCurrentRawFrameValue(0));
            }),
            (AnimationItem.prototype.goToAndStop = function (t, e, r) {
              (r && this.name != r) ||
                (e
                  ? this.setCurrentRawFrameValue(t)
                  : this.setCurrentRawFrameValue(t * this.frameModifier),
                this.pause());
            }),
            (AnimationItem.prototype.goToAndPlay = function (t, e, r) {
              this.goToAndStop(t, e, r), this.play();
            }),
            (AnimationItem.prototype.advanceTime = function (t) {
              if (!0 !== this.isPaused && !1 !== this.isLoaded) {
                var e = this.currentRawFrame + t * this.frameModifier,
                  r = !1;
                e >= this.totalFrames - 1 && this.frameModifier > 0
                  ? this.loop && this.playCount !== this.loop
                    ? e >= this.totalFrames
                      ? ((this.playCount += 1),
                        this.checkSegments(e % this.totalFrames) ||
                          (this.setCurrentRawFrameValue(e % this.totalFrames),
                          (this._completedLoop = !0),
                          this.trigger('loopComplete')))
                      : this.setCurrentRawFrameValue(e)
                    : this.checkSegments(
                        e > this.totalFrames ? e % this.totalFrames : 0
                      ) || ((r = !0), (e = this.totalFrames - 1))
                  : e < 0
                  ? this.checkSegments(e % this.totalFrames) ||
                    (!this.loop || (this.playCount-- <= 0 && !0 !== this.loop)
                      ? ((r = !0), (e = 0))
                      : (this.setCurrentRawFrameValue(
                          this.totalFrames + (e % this.totalFrames)
                        ),
                        this._completedLoop
                          ? this.trigger('loopComplete')
                          : (this._completedLoop = !0)))
                  : this.setCurrentRawFrameValue(e),
                  r &&
                    (this.setCurrentRawFrameValue(e),
                    this.pause(),
                    this.trigger('complete'));
              }
            }),
            (AnimationItem.prototype.adjustSegment = function (t, e) {
              (this.playCount = 0),
                t[1] < t[0]
                  ? (this.frameModifier > 0 &&
                      (this.playSpeed < 0
                        ? this.setSpeed(-this.playSpeed)
                        : this.setDirection(-1)),
                    (this.timeCompleted = this.totalFrames = t[0] - t[1]),
                    (this.firstFrame = t[1]),
                    this.setCurrentRawFrameValue(this.totalFrames - 0.001 - e))
                  : t[1] > t[0] &&
                    (this.frameModifier < 0 &&
                      (this.playSpeed < 0
                        ? this.setSpeed(-this.playSpeed)
                        : this.setDirection(1)),
                    (this.timeCompleted = this.totalFrames = t[1] - t[0]),
                    (this.firstFrame = t[0]),
                    this.setCurrentRawFrameValue(0.001 + e)),
                this.trigger('segmentStart');
            }),
            (AnimationItem.prototype.setSegment = function (t, e) {
              var r = -1;
              this.isPaused &&
                (this.currentRawFrame + this.firstFrame < t
                  ? (r = t)
                  : this.currentRawFrame + this.firstFrame > e && (r = e - t)),
                (this.firstFrame = t),
                (this.timeCompleted = this.totalFrames = e - t),
                -1 !== r && this.goToAndStop(r, !0);
            }),
            (AnimationItem.prototype.playSegments = function (t, e) {
              if ((e && (this.segments.length = 0), 'object' == typeof t[0])) {
                var r,
                  i = t.length;
                for (r = 0; r < i; r += 1) this.segments.push(t[r]);
              } else this.segments.push(t);
              this.segments.length &&
                e &&
                this.adjustSegment(this.segments.shift(), 0),
                this.isPaused && this.play();
            }),
            (AnimationItem.prototype.resetSegments = function (t) {
              (this.segments.length = 0),
                this.segments.push([
                  this.animationData.ip,
                  this.animationData.op,
                ]),
                t && this.checkSegments(0);
            }),
            (AnimationItem.prototype.checkSegments = function (t) {
              return (
                !!this.segments.length &&
                (this.adjustSegment(this.segments.shift(), t), !0)
              );
            }),
            (AnimationItem.prototype.destroy = function (t) {
              (t && this.name != t) ||
                !this.renderer ||
                (this.renderer.destroy(),
                this.imagePreloader.destroy(),
                this.trigger('destroy'),
                (this._cbs = null),
                (this.onEnterFrame =
                  this.onLoopComplete =
                  this.onComplete =
                  this.onSegmentStart =
                  this.onDestroy =
                    null),
                (this.renderer = null));
            }),
            (AnimationItem.prototype.setCurrentRawFrameValue = function (t) {
              (this.currentRawFrame = t), this.gotoFrame();
            }),
            (AnimationItem.prototype.setSpeed = function (t) {
              (this.playSpeed = t), this.updaFrameModifier();
            }),
            (AnimationItem.prototype.setDirection = function (t) {
              (this.playDirection = t < 0 ? -1 : 1), this.updaFrameModifier();
            }),
            (AnimationItem.prototype.updaFrameModifier = function () {
              this.frameModifier =
                this.frameMult * this.playSpeed * this.playDirection;
            }),
            (AnimationItem.prototype.getPath = function () {
              return this.path;
            }),
            (AnimationItem.prototype.getAssetsPath = function (t) {
              var e = '';
              if (t.e) e = t.p;
              else if (this.assetsPath) {
                var r = t.p;
                -1 !== r.indexOf('images/') && (r = r.split('/')[1]),
                  (e = this.assetsPath + r);
              } else (e = this.path), (e += t.u ? t.u : ''), (e += t.p);
              return e;
            }),
            (AnimationItem.prototype.getAssetData = function (t) {
              for (var e = 0, r = this.assets.length; e < r; ) {
                if (t == this.assets[e].id) return this.assets[e];
                e += 1;
              }
            }),
            (AnimationItem.prototype.hide = function () {
              this.renderer.hide();
            }),
            (AnimationItem.prototype.show = function () {
              this.renderer.show();
            }),
            (AnimationItem.prototype.getDuration = function (t) {
              return t ? this.totalFrames : this.totalFrames / this.frameRate;
            }),
            (AnimationItem.prototype.trigger = function (t) {
              if (this._cbs && this._cbs[t])
                switch (t) {
                  case 'enterFrame':
                    this.triggerEvent(
                      t,
                      new BMEnterFrameEvent(
                        t,
                        this.currentFrame,
                        this.totalFrames,
                        this.frameModifier
                      )
                    );
                    break;
                  case 'loopComplete':
                    this.triggerEvent(
                      t,
                      new BMCompleteLoopEvent(
                        t,
                        this.loop,
                        this.playCount,
                        this.frameMult
                      )
                    );
                    break;
                  case 'complete':
                    this.triggerEvent(
                      t,
                      new BMCompleteEvent(t, this.frameMult)
                    );
                    break;
                  case 'segmentStart':
                    this.triggerEvent(
                      t,
                      new BMSegmentStartEvent(
                        t,
                        this.firstFrame,
                        this.totalFrames
                      )
                    );
                    break;
                  case 'destroy':
                    this.triggerEvent(t, new BMDestroyEvent(t, this));
                    break;
                  default:
                    this.triggerEvent(t);
                }
              'enterFrame' === t &&
                this.onEnterFrame &&
                this.onEnterFrame.call(
                  this,
                  new BMEnterFrameEvent(
                    t,
                    this.currentFrame,
                    this.totalFrames,
                    this.frameMult
                  )
                ),
                'loopComplete' === t &&
                  this.onLoopComplete &&
                  this.onLoopComplete.call(
                    this,
                    new BMCompleteLoopEvent(
                      t,
                      this.loop,
                      this.playCount,
                      this.frameMult
                    )
                  ),
                'complete' === t &&
                  this.onComplete &&
                  this.onComplete.call(
                    this,
                    new BMCompleteEvent(t, this.frameMult)
                  ),
                'segmentStart' === t &&
                  this.onSegmentStart &&
                  this.onSegmentStart.call(
                    this,
                    new BMSegmentStartEvent(
                      t,
                      this.firstFrame,
                      this.totalFrames
                    )
                  ),
                'destroy' === t &&
                  this.onDestroy &&
                  this.onDestroy.call(this, new BMDestroyEvent(t, this));
            }),
            (AnimationItem.prototype.triggerRenderFrameError = function (t) {
              var e = new BMRenderFrameErrorEvent(t, this.currentFrame);
              this.triggerEvent('error', e),
                this.onError && this.onError.call(this, e);
            }),
            (AnimationItem.prototype.triggerConfigError = function (t) {
              var e = new BMConfigErrorEvent(t, this.currentFrame);
              this.triggerEvent('error', e),
                this.onError && this.onError.call(this, e);
            });
          var Expressions = (function () {
            var t = {};
            return (
              (t.initExpressions = function (t) {
                var e = 0,
                  r = [];
                (t.renderer.compInterface = CompExpressionInterface(
                  t.renderer
                )),
                  t.renderer.globalData.projectInterface.registerComposition(
                    t.renderer
                  ),
                  (t.renderer.globalData.pushExpression = function () {
                    e += 1;
                  }),
                  (t.renderer.globalData.popExpression = function () {
                    0 === (e -= 1) &&
                      (function () {
                        var t,
                          e = r.length;
                        for (t = 0; t < e; t += 1) r[t].release();
                        r.length = 0;
                      })();
                  }),
                  (t.renderer.globalData.registerExpressionProperty = function (
                    t
                  ) {
                    -1 === r.indexOf(t) && r.push(t);
                  });
              }),
              t
            );
          })();
          expressionsPlugin = Expressions;
          var ExpressionManager = (function () {
              var ob = {},
                Math = BMMath,
                easeInBez = BezierFactory.getBezierEasing(
                  0.333,
                  0,
                  0.833,
                  0.833,
                  'easeIn'
                ).get,
                easeOutBez = BezierFactory.getBezierEasing(
                  0.167,
                  0.167,
                  0.667,
                  1,
                  'easeOut'
                ).get,
                easeInOutBez = BezierFactory.getBezierEasing(
                  0.33,
                  0,
                  0.667,
                  1,
                  'easeInOut'
                ).get;
              function initiateExpression(elem, data, property) {
                var val = data.x,
                  needsVelocity = /velocity(?![\w\d])/.test(val),
                  _needsRandom = -1 !== val.indexOf('random'),
                  elemType = elem.data.ty,
                  transform,
                  content,
                  effect,
                  thisProperty = property;
                (thisProperty.valueAtTime = thisProperty.getValueAtTime),
                  Object.defineProperty(thisProperty, 'value', {
                    get: function () {
                      return thisProperty.v;
                    },
                  }),
                  (elem.comp.frameDuration =
                    1 / elem.comp.globalData.frameRate),
                  (elem.comp.displayStartTime = 0);
                var inPoint = elem.data.ip / elem.comp.globalData.frameRate,
                  outPoint = elem.data.op / elem.comp.globalData.frameRate,
                  width = elem.data.sw ? elem.data.sw : 0,
                  height = elem.data.sh ? elem.data.sh : 0,
                  name = elem.data.nm,
                  loopIn,
                  loopOut,
                  smooth,
                  toWorld,
                  fromWorld,
                  fromComp,
                  toComp,
                  anchorPoint,
                  thisLayer,
                  thisComp,
                  mask,
                  valueAtTime,
                  velocityAtTime,
                  __expression_functions = [],
                  scoped_bm_rt;
                if (data.xf) {
                  var i,
                    len = data.xf.length;
                  for (i = 0; i < len; i += 1)
                    __expression_functions[i] = eval(
                      '(function(){ return ' + data.xf[i] + '}())'
                    );
                }
                var expression_function = eval(
                    '[function _expression_function(){' +
                      val +
                      ';scoped_bm_rt=$bm_rt}]'
                  )[0],
                  numKeys = property.kf ? data.k.length : 0,
                  active = !this.data || !0 !== this.data.hd,
                  wiggle = function (t, e) {
                    var r,
                      i,
                      s = this.pv.length ? this.pv.length : 1,
                      n = createTypedArray('float32', s);
                    var a = Math.floor(5 * time);
                    for (r = 0, i = 0; r < a; ) {
                      for (i = 0; i < s; i += 1)
                        n[i] += -e + 2 * e * BMMath.random();
                      r += 1;
                    }
                    var o = 5 * time,
                      h = o - Math.floor(o),
                      l = createTypedArray('float32', s);
                    if (s > 1) {
                      for (i = 0; i < s; i += 1)
                        l[i] =
                          this.pv[i] +
                          n[i] +
                          (-e + 2 * e * BMMath.random()) * h;
                      return l;
                    }
                    return this.pv + n[0] + (-e + 2 * e * BMMath.random()) * h;
                  }.bind(this);
                thisProperty.loopIn &&
                  (loopIn = thisProperty.loopIn.bind(thisProperty)),
                  thisProperty.loopOut &&
                    (loopOut = thisProperty.loopOut.bind(thisProperty)),
                  thisProperty.smooth &&
                    (smooth = thisProperty.smooth.bind(thisProperty)),
                  this.getValueAtTime &&
                    (valueAtTime = this.getValueAtTime.bind(this)),
                  this.getVelocityAtTime &&
                    (velocityAtTime = this.getVelocityAtTime.bind(this));
                var comp = elem.comp.globalData.projectInterface.bind(
                    elem.comp.globalData.projectInterface
                  ),
                  time,
                  velocity,
                  value,
                  text,
                  textIndex,
                  textTotal,
                  selectorValue;
                function seedRandom(t) {
                  BMMath.seedrandom(randSeed + t);
                }
                var index = elem.data.ind,
                  hasParent = !(!elem.hierarchy || !elem.hierarchy.length),
                  parent,
                  randSeed = Math.floor(1e6 * Math.random()),
                  globalData = elem.globalData;
                function executeExpression(t) {
                  return (
                    (value = t),
                    _needsRandom && seedRandom(randSeed),
                    this.frameExpressionId === elem.globalData.frameId &&
                    'textSelector' !== this.propType
                      ? value
                      : ('textSelector' === this.propType &&
                          ((textIndex = this.textIndex),
                          (textTotal = this.textTotal),
                          (selectorValue = this.selectorValue)),
                        thisLayer ||
                          ((text = elem.layerInterface.text),
                          (thisLayer = elem.layerInterface),
                          (thisComp = elem.comp.compInterface),
                          (toWorld = thisLayer.toWorld.bind(thisLayer)),
                          (fromWorld = thisLayer.fromWorld.bind(thisLayer)),
                          (fromComp = thisLayer.fromComp.bind(thisLayer)),
                          (toComp = thisLayer.toComp.bind(thisLayer)),
                          (mask = thisLayer.mask
                            ? thisLayer.mask.bind(thisLayer)
                            : null)),
                        transform ||
                          ((transform = elem.layerInterface(
                            'ADBE Transform Group'
                          )) &&
                            (anchorPoint = transform.anchorPoint)),
                        4 !== elemType ||
                          content ||
                          (content = thisLayer('ADBE Root Vectors Group')),
                        effect || (effect = thisLayer(4)),
                        (hasParent = !(
                          !elem.hierarchy || !elem.hierarchy.length
                        )) &&
                          !parent &&
                          (parent = elem.hierarchy[0].layerInterface),
                        (time =
                          this.comp.renderedFrame /
                          this.comp.globalData.frameRate),
                        needsVelocity && (velocity = velocityAtTime(time)),
                        expression_function(),
                        (this.frameExpressionId = elem.globalData.frameId),
                        scoped_bm_rt.propType,
                        scoped_bm_rt)
                  );
                }
                return executeExpression;
              }
              return (ob.initiateExpression = initiateExpression), ob;
            })(),
            expressionHelpers = {
              searchExpressions: function (t, e, r) {
                e.x &&
                  ((r.k = !0),
                  (r.x = !0),
                  (r.initiateExpression = ExpressionManager.initiateExpression),
                  r.effectsSequence.push(
                    r.initiateExpression(t, e, r).bind(r)
                  ));
              },
              getSpeedAtTime: function (t) {
                var e = this.getValueAtTime(t),
                  r = this.getValueAtTime(t + -0.01),
                  i = 0;
                if (e.length) {
                  var s;
                  for (s = 0; s < e.length; s += 1)
                    i += Math.pow(r[s] - e[s], 2);
                  i = 100 * Math.sqrt(i);
                } else i = 0;
                return i;
              },
              getVelocityAtTime: function (t) {
                if (void 0 !== this.vel) return this.vel;
                var e,
                  r,
                  i = this.getValueAtTime(t),
                  s = this.getValueAtTime(t + -0.001);
                if (i.length)
                  for (
                    e = createTypedArray('float32', i.length), r = 0;
                    r < i.length;
                    r += 1
                  )
                    e[r] = (s[r] - i[r]) / -0.001;
                else e = (s - i) / -0.001;
                return e;
              },
              getValueAtTime: function (t) {
                return (
                  (t *= this.elem.globalData.frameRate),
                  (t -= this.offsetTime) !== this._cachingAtTime.lastFrame &&
                    ((this._cachingAtTime.lastIndex =
                      this._cachingAtTime.lastFrame < t
                        ? this._cachingAtTime.lastIndex
                        : 0),
                    (this._cachingAtTime.value = this.interpolateValue(
                      t,
                      this._cachingAtTime
                    )),
                    (this._cachingAtTime.lastFrame = t)),
                  this._cachingAtTime.value
                );
              },
              getStaticValueAtTime: function () {
                return this.pv;
              },
              setGroupProperty: function (t) {
                this.propertyGroup = t;
              },
            };
          !(function () {
            function t(t, e, r) {
              if (!this.k || !this.keyframes) return this.pv;
              t = t ? t.toLowerCase() : '';
              var i,
                s,
                n,
                a,
                o,
                h = this.comp.renderedFrame,
                l = this.keyframes,
                p = l[l.length - 1].t;
              if (h <= p) return this.pv;
              if (
                (r
                  ? (s =
                      p -
                      (i = e
                        ? Math.abs(p - elem.comp.globalData.frameRate * e)
                        : Math.max(0, p - this.elem.data.ip)))
                  : ((!e || e > l.length - 1) && (e = l.length - 1),
                    (i = p - (s = l[l.length - 1 - e].t))),
                'pingpong' === t)
              ) {
                if (Math.floor((h - s) / i) % 2 != 0)
                  return this.getValueAtTime(
                    (i - ((h - s) % i) + s) / this.comp.globalData.frameRate,
                    0
                  );
              } else {
                if ('offset' === t) {
                  var c = this.getValueAtTime(
                      s / this.comp.globalData.frameRate,
                      0
                    ),
                    f = this.getValueAtTime(
                      p / this.comp.globalData.frameRate,
                      0
                    ),
                    d = this.getValueAtTime(
                      (((h - s) % i) + s) / this.comp.globalData.frameRate,
                      0
                    ),
                    u = Math.floor((h - s) / i);
                  if (this.pv.length) {
                    for (
                      a = (o = new Array(c.length)).length, n = 0;
                      n < a;
                      n += 1
                    )
                      o[n] = (f[n] - c[n]) * u + d[n];
                    return o;
                  }
                  return (f - c) * u + d;
                }
                if ('continue' === t) {
                  var m = this.getValueAtTime(
                      p / this.comp.globalData.frameRate,
                      0
                    ),
                    y = this.getValueAtTime(
                      (p - 0.001) / this.comp.globalData.frameRate,
                      0
                    );
                  if (this.pv.length) {
                    for (
                      a = (o = new Array(m.length)).length, n = 0;
                      n < a;
                      n += 1
                    )
                      o[n] =
                        m[n] +
                        ((m[n] - y[n]) *
                          ((h - p) / this.comp.globalData.frameRate)) /
                          5e-4;
                    return o;
                  }
                  return m + ((h - p) / 0.001) * (m - y);
                }
              }
              return this.getValueAtTime(
                (((h - s) % i) + s) / this.comp.globalData.frameRate,
                0
              );
            }
            function e(t, e, r) {
              if (!this.k) return this.pv;
              t = t ? t.toLowerCase() : '';
              var i,
                s,
                n,
                a,
                o,
                h = this.comp.renderedFrame,
                l = this.keyframes,
                p = l[0].t;
              if (h >= p) return this.pv;
              if (
                (r
                  ? (s =
                      p +
                      (i = e
                        ? Math.abs(elem.comp.globalData.frameRate * e)
                        : Math.max(0, this.elem.data.op - p)))
                  : ((!e || e > l.length - 1) && (e = l.length - 1),
                    (i = (s = l[e].t) - p)),
                'pingpong' === t)
              ) {
                if (Math.floor((p - h) / i) % 2 == 0)
                  return this.getValueAtTime(
                    (((p - h) % i) + p) / this.comp.globalData.frameRate,
                    0
                  );
              } else {
                if ('offset' === t) {
                  var c = this.getValueAtTime(
                      p / this.comp.globalData.frameRate,
                      0
                    ),
                    f = this.getValueAtTime(
                      s / this.comp.globalData.frameRate,
                      0
                    ),
                    d = this.getValueAtTime(
                      (i - ((p - h) % i) + p) / this.comp.globalData.frameRate,
                      0
                    ),
                    u = Math.floor((p - h) / i) + 1;
                  if (this.pv.length) {
                    for (
                      a = (o = new Array(c.length)).length, n = 0;
                      n < a;
                      n += 1
                    )
                      o[n] = d[n] - (f[n] - c[n]) * u;
                    return o;
                  }
                  return d - (f - c) * u;
                }
                if ('continue' === t) {
                  var m = this.getValueAtTime(
                      p / this.comp.globalData.frameRate,
                      0
                    ),
                    y = this.getValueAtTime(
                      (p + 0.001) / this.comp.globalData.frameRate,
                      0
                    );
                  if (this.pv.length) {
                    for (
                      a = (o = new Array(m.length)).length, n = 0;
                      n < a;
                      n += 1
                    )
                      o[n] = m[n] + ((m[n] - y[n]) * (p - h)) / 0.001;
                    return o;
                  }
                  return m + ((m - y) * (p - h)) / 0.001;
                }
              }
              return this.getValueAtTime(
                (i - ((p - h) % i) + p) / this.comp.globalData.frameRate,
                0
              );
            }
            function r(t, e) {
              if (!this.k) return this.pv;
              if (((t = 0.5 * (t || 0.4)), (e = Math.floor(e || 5)) <= 1))
                return this.pv;
              var r,
                i,
                s = this.comp.renderedFrame / this.comp.globalData.frameRate,
                n = s - t,
                a = e > 1 ? (s + t - n) / (e - 1) : 1,
                o = 0,
                h = 0;
              for (
                r = this.pv.length
                  ? createTypedArray('float32', this.pv.length)
                  : 0;
                o < e;

              ) {
                if (((i = this.getValueAtTime(n + o * a)), this.pv.length))
                  for (h = 0; h < this.pv.length; h += 1) r[h] += i[h];
                else r += i;
                o += 1;
              }
              if (this.pv.length)
                for (h = 0; h < this.pv.length; h += 1) r[h] /= e;
              else r /= e;
              return r;
            }
            function i(t) {
              console.warn('Transform at time not supported');
            }
            function s(t) {}
            var n = TransformPropertyFactory.getTransformProperty;
            TransformPropertyFactory.getTransformProperty = function (t, e, r) {
              var a = n(t, e, r);
              return (
                a.dynamicProperties.length
                  ? (a.getValueAtTime = i.bind(a))
                  : (a.getValueAtTime = s.bind(a)),
                (a.setGroupProperty = expressionHelpers.setGroupProperty),
                a
              );
            };
            var a = PropertyFactory.getProp;
            PropertyFactory.getProp = function (i, s, n, o, h) {
              var l = a(i, s, n, o, h);
              l.kf
                ? (l.getValueAtTime = expressionHelpers.getValueAtTime.bind(l))
                : (l.getValueAtTime =
                    expressionHelpers.getStaticValueAtTime.bind(l)),
                (l.setGroupProperty = expressionHelpers.setGroupProperty),
                (l.loopOut = t),
                (l.loopIn = e),
                (l.smooth = r),
                (l.getVelocityAtTime =
                  expressionHelpers.getVelocityAtTime.bind(l)),
                (l.getSpeedAtTime = expressionHelpers.getSpeedAtTime.bind(l)),
                (l.numKeys = 1 === s.a ? s.k.length : 0),
                (l.propertyIndex = s.ix);
              var p = 0;
              return (
                0 !== n &&
                  (p = createTypedArray(
                    'float32',
                    1 === s.a ? s.k[0].s.length : s.k.length
                  )),
                (l._cachingAtTime = {
                  lastFrame: initialDefaultFrame,
                  lastIndex: 0,
                  value: p,
                }),
                expressionHelpers.searchExpressions(i, s, l),
                l.k && h.addDynamicProperty(l),
                l
              );
            };
            var o = ShapePropertyFactory.getConstructorFunction(),
              h = ShapePropertyFactory.getKeyframedConstructorFunction();
            function l() {}
            (l.prototype = {
              vertices: function (t, e) {
                this.k && this.getValue();
                var r = this.v;
                void 0 !== e && (r = this.getValueAtTime(e, 0));
                var i,
                  s = r._length,
                  n = r[t],
                  a = r.v,
                  o = createSizedArray(s);
                for (i = 0; i < s; i += 1)
                  o[i] =
                    'i' === t || 'o' === t
                      ? [n[i][0] - a[i][0], n[i][1] - a[i][1]]
                      : [n[i][0], n[i][1]];
                return o;
              },
              points: function (t) {
                return this.vertices('v', t);
              },
              inTangents: function (t) {
                return this.vertices('i', t);
              },
              outTangents: function (t) {
                return this.vertices('o', t);
              },
              isClosed: function () {
                return this.v.c;
              },
              pointOnPath: function (t, e) {
                var r = this.v;
                void 0 !== e && (r = this.getValueAtTime(e, 0)),
                  this._segmentsLength ||
                    (this._segmentsLength = bez.getSegmentsLength(r));
                for (
                  var i,
                    s = this._segmentsLength,
                    n = s.lengths,
                    a = s.totalLength * t,
                    o = 0,
                    h = n.length,
                    l = 0;
                  o < h;

                ) {
                  if (l + n[o].addedLength > a) {
                    var p = o,
                      c = r.c && o === h - 1 ? 0 : o + 1,
                      f = (a - l) / n[o].addedLength;
                    i = bez.getPointInSegment(
                      r.v[p],
                      r.v[c],
                      r.o[p],
                      r.i[c],
                      f,
                      n[o]
                    );
                    break;
                  }
                  (l += n[o].addedLength), (o += 1);
                }
                return (
                  i ||
                    (i = r.c
                      ? [r.v[0][0], r.v[0][1]]
                      : [r.v[r._length - 1][0], r.v[r._length - 1][1]]),
                  i
                );
              },
              vectorOnPath: function (t, e, r) {
                t = 1 == t ? (this.v.c ? 0 : 0.999) : t;
                var i = this.pointOnPath(t, e),
                  s = this.pointOnPath(t + 0.001, e),
                  n = s[0] - i[0],
                  a = s[1] - i[1],
                  o = Math.sqrt(Math.pow(n, 2) + Math.pow(a, 2));
                return 0 === o
                  ? [0, 0]
                  : 'tangent' === r
                  ? [n / o, a / o]
                  : [-a / o, n / o];
              },
              tangentOnPath: function (t, e) {
                return this.vectorOnPath(t, e, 'tangent');
              },
              normalOnPath: function (t, e) {
                return this.vectorOnPath(t, e, 'normal');
              },
              setGroupProperty: expressionHelpers.setGroupProperty,
              getValueAtTime: expressionHelpers.getStaticValueAtTime,
            }),
              extendPrototype([l], o),
              extendPrototype([l], h),
              (h.prototype.getValueAtTime = function (t) {
                return (
                  this._cachingAtTime ||
                    (this._cachingAtTime = {
                      shapeValue: shape_pool.clone(this.pv),
                      lastIndex: 0,
                      lastTime: initialDefaultFrame,
                    }),
                  (t *= this.elem.globalData.frameRate),
                  (t -= this.offsetTime) !== this._cachingAtTime.lastTime &&
                    ((this._cachingAtTime.lastIndex =
                      this._cachingAtTime.lastTime < t
                        ? this._caching.lastIndex
                        : 0),
                    (this._cachingAtTime.lastTime = t),
                    this.interpolateShape(
                      t,
                      this._cachingAtTime.shapeValue,
                      this._cachingAtTime
                    )),
                  this._cachingAtTime.shapeValue
                );
              }),
              (h.prototype.initiateExpression =
                ExpressionManager.initiateExpression);
            var p = ShapePropertyFactory.getShapeProp;
            ShapePropertyFactory.getShapeProp = function (t, e, r, i, s) {
              var n = p(t, e, r, i, s);
              return (
                (n.propertyIndex = e.ix),
                (n.lock = !1),
                3 === r
                  ? expressionHelpers.searchExpressions(t, e.pt, n)
                  : 4 === r && expressionHelpers.searchExpressions(t, e.ks, n),
                n.k && t.addDynamicProperty(n),
                n
              );
            };
          })(),
            (TextProperty.prototype.getExpressionValue = function (t, e) {
              var r = this.calculateExpression(e);
              if (t.t !== r) {
                var i = {};
                return (
                  this.copyData(i, t),
                  (i.t = r.toString()),
                  (i.__complete = !1),
                  i
                );
              }
              return t;
            }),
            (TextProperty.prototype.searchProperty = function () {
              var t = this.searchKeyframes(),
                e = this.searchExpressions();
              return (this.kf = t || e), this.kf;
            }),
            (TextProperty.prototype.searchExpressions = function () {
              if (this.data.d.x)
                return (
                  (this.calculateExpression =
                    ExpressionManager.initiateExpression.bind(this)(
                      this.elem,
                      this.data.d,
                      this
                    )),
                  this.addEffect(this.getExpressionValue.bind(this)),
                  !0
                );
            });
          var ShapePathInterface = function (t, e, r) {
              var i = e.sh;
              function s(t) {
                if (
                  'Shape' === t ||
                  'shape' === t ||
                  'Path' === t ||
                  'path' === t ||
                  'ADBE Vector Shape' === t ||
                  2 === t
                )
                  return s.path;
              }
              var n = propertyGroupFactory(s, r);
              return (
                i.setGroupProperty(PropertyInterface('Path', n)),
                Object.defineProperties(s, {
                  path: {
                    get: function () {
                      return i.k && i.getValue(), i;
                    },
                  },
                  shape: {
                    get: function () {
                      return i.k && i.getValue(), i;
                    },
                  },
                  _name: { value: t.nm },
                  ix: { value: t.ix },
                  propertyIndex: { value: t.ix },
                  mn: { value: t.mn },
                  propertyGroup: { value: r },
                }),
                s
              );
            },
            propertyGroupFactory = function (t, e) {
              return function (r) {
                return (r = void 0 === r ? 1 : r) <= 0 ? t : e(r - 1);
              };
            },
            PropertyInterface = function (t, e) {
              var r = { _name: t };
              return function (t) {
                return (t = void 0 === t ? 1 : t) <= 0 ? r : e(--t);
              };
            },
            ShapeExpressionInterface = (function () {
              function t(t, n, c) {
                var f,
                  d = [],
                  u = t ? t.length : 0;
                for (f = 0; f < u; f += 1)
                  'gr' == t[f].ty
                    ? d.push(e(t[f], n[f], c))
                    : 'fl' == t[f].ty
                    ? d.push(r(t[f], n[f], c))
                    : 'st' == t[f].ty
                    ? d.push(i(t[f], n[f], c))
                    : 'tm' == t[f].ty
                    ? d.push(s(t[f], n[f], c))
                    : 'tr' == t[f].ty ||
                      ('el' == t[f].ty
                        ? d.push(a(t[f], n[f], c))
                        : 'sr' == t[f].ty
                        ? d.push(o(t[f], n[f], c))
                        : 'sh' == t[f].ty
                        ? d.push(ShapePathInterface(t[f], n[f], c))
                        : 'rc' == t[f].ty
                        ? d.push(h(t[f], n[f], c))
                        : 'rd' == t[f].ty
                        ? d.push(l(t[f], n[f], c))
                        : 'rp' == t[f].ty && d.push(p(t[f], n[f], c)));
                return d;
              }
              function e(e, r, i) {
                var s = function (t) {
                  switch (t) {
                    case 'ADBE Vectors Group':
                    case 'Contents':
                    case 2:
                      return s.content;
                    default:
                      return s.transform;
                  }
                };
                s.propertyGroup = propertyGroupFactory(s, i);
                var a = (function (e, r, i) {
                    var s,
                      a = function (t) {
                        for (var e = 0, r = s.length; e < r; ) {
                          if (
                            s[e]._name === t ||
                            s[e].mn === t ||
                            s[e].propertyIndex === t ||
                            s[e].ix === t ||
                            s[e].ind === t
                          )
                            return s[e];
                          e += 1;
                        }
                        if ('number' == typeof t) return s[t - 1];
                      };
                    (a.propertyGroup = propertyGroupFactory(a, i)),
                      (s = t(e.it, r.it, a.propertyGroup)),
                      (a.numProperties = s.length);
                    var o = n(
                      e.it[e.it.length - 1],
                      r.it[r.it.length - 1],
                      a.propertyGroup
                    );
                    return (
                      (a.transform = o),
                      (a.propertyIndex = e.cix),
                      (a._name = e.nm),
                      a
                    );
                  })(e, r, s.propertyGroup),
                  o = n(
                    e.it[e.it.length - 1],
                    r.it[r.it.length - 1],
                    s.propertyGroup
                  );
                return (
                  (s.content = a),
                  (s.transform = o),
                  Object.defineProperty(s, '_name', {
                    get: function () {
                      return e.nm;
                    },
                  }),
                  (s.numProperties = e.np),
                  (s.propertyIndex = e.ix),
                  (s.nm = e.nm),
                  (s.mn = e.mn),
                  s
                );
              }
              function r(t, e, r) {
                function i(t) {
                  return 'Color' === t || 'color' === t
                    ? i.color
                    : 'Opacity' === t || 'opacity' === t
                    ? i.opacity
                    : void 0;
                }
                return (
                  Object.defineProperties(i, {
                    color: { get: ExpressionPropertyInterface(e.c) },
                    opacity: { get: ExpressionPropertyInterface(e.o) },
                    _name: { value: t.nm },
                    mn: { value: t.mn },
                  }),
                  e.c.setGroupProperty(PropertyInterface('Color', r)),
                  e.o.setGroupProperty(PropertyInterface('Opacity', r)),
                  i
                );
              }
              function i(t, e, r) {
                var i = propertyGroupFactory(l, r),
                  s = propertyGroupFactory(h, i);
                function n(r) {
                  Object.defineProperty(h, t.d[r].nm, {
                    get: ExpressionPropertyInterface(e.d.dataProps[r].p),
                  });
                }
                var a,
                  o = t.d ? t.d.length : 0,
                  h = {};
                for (a = 0; a < o; a += 1)
                  n(a), e.d.dataProps[a].p.setGroupProperty(s);
                function l(t) {
                  return 'Color' === t || 'color' === t
                    ? l.color
                    : 'Opacity' === t || 'opacity' === t
                    ? l.opacity
                    : 'Stroke Width' === t || 'stroke width' === t
                    ? l.strokeWidth
                    : void 0;
                }
                return (
                  Object.defineProperties(l, {
                    color: { get: ExpressionPropertyInterface(e.c) },
                    opacity: { get: ExpressionPropertyInterface(e.o) },
                    strokeWidth: { get: ExpressionPropertyInterface(e.w) },
                    dash: {
                      get: function () {
                        return h;
                      },
                    },
                    _name: { value: t.nm },
                    mn: { value: t.mn },
                  }),
                  e.c.setGroupProperty(PropertyInterface('Color', i)),
                  e.o.setGroupProperty(PropertyInterface('Opacity', i)),
                  e.w.setGroupProperty(PropertyInterface('Stroke Width', i)),
                  l
                );
              }
              function s(t, e, r) {
                function i(e) {
                  return e === t.e.ix || 'End' === e || 'end' === e
                    ? i.end
                    : e === t.s.ix
                    ? i.start
                    : e === t.o.ix
                    ? i.offset
                    : void 0;
                }
                var s = propertyGroupFactory(i, r);
                return (
                  (i.propertyIndex = t.ix),
                  e.s.setGroupProperty(PropertyInterface('Start', s)),
                  e.e.setGroupProperty(PropertyInterface('End', s)),
                  e.o.setGroupProperty(PropertyInterface('Offset', s)),
                  (i.propertyIndex = t.ix),
                  (i.propertyGroup = r),
                  Object.defineProperties(i, {
                    start: { get: ExpressionPropertyInterface(e.s) },
                    end: { get: ExpressionPropertyInterface(e.e) },
                    offset: { get: ExpressionPropertyInterface(e.o) },
                    _name: { value: t.nm },
                  }),
                  (i.mn = t.mn),
                  i
                );
              }
              function n(t, e, r) {
                function i(e) {
                  return t.a.ix === e || 'Anchor Point' === e
                    ? i.anchorPoint
                    : t.o.ix === e || 'Opacity' === e
                    ? i.opacity
                    : t.p.ix === e || 'Position' === e
                    ? i.position
                    : t.r.ix === e ||
                      'Rotation' === e ||
                      'ADBE Vector Rotation' === e
                    ? i.rotation
                    : t.s.ix === e || 'Scale' === e
                    ? i.scale
                    : (t.sk && t.sk.ix === e) || 'Skew' === e
                    ? i.skew
                    : (t.sa && t.sa.ix === e) || 'Skew Axis' === e
                    ? i.skewAxis
                    : void 0;
                }
                var s = propertyGroupFactory(i, r);
                return (
                  e.transform.mProps.o.setGroupProperty(
                    PropertyInterface('Opacity', s)
                  ),
                  e.transform.mProps.p.setGroupProperty(
                    PropertyInterface('Position', s)
                  ),
                  e.transform.mProps.a.setGroupProperty(
                    PropertyInterface('Anchor Point', s)
                  ),
                  e.transform.mProps.s.setGroupProperty(
                    PropertyInterface('Scale', s)
                  ),
                  e.transform.mProps.r.setGroupProperty(
                    PropertyInterface('Rotation', s)
                  ),
                  e.transform.mProps.sk &&
                    (e.transform.mProps.sk.setGroupProperty(
                      PropertyInterface('Skew', s)
                    ),
                    e.transform.mProps.sa.setGroupProperty(
                      PropertyInterface('Skew Angle', s)
                    )),
                  e.transform.op.setGroupProperty(
                    PropertyInterface('Opacity', s)
                  ),
                  Object.defineProperties(i, {
                    opacity: {
                      get: ExpressionPropertyInterface(e.transform.mProps.o),
                    },
                    position: {
                      get: ExpressionPropertyInterface(e.transform.mProps.p),
                    },
                    anchorPoint: {
                      get: ExpressionPropertyInterface(e.transform.mProps.a),
                    },
                    scale: {
                      get: ExpressionPropertyInterface(e.transform.mProps.s),
                    },
                    rotation: {
                      get: ExpressionPropertyInterface(e.transform.mProps.r),
                    },
                    skew: {
                      get: ExpressionPropertyInterface(e.transform.mProps.sk),
                    },
                    skewAxis: {
                      get: ExpressionPropertyInterface(e.transform.mProps.sa),
                    },
                    _name: { value: t.nm },
                  }),
                  (i.ty = 'tr'),
                  (i.mn = t.mn),
                  (i.propertyGroup = r),
                  i
                );
              }
              function a(t, e, r) {
                function i(e) {
                  return t.p.ix === e
                    ? i.position
                    : t.s.ix === e
                    ? i.size
                    : void 0;
                }
                var s = propertyGroupFactory(i, r);
                i.propertyIndex = t.ix;
                var n = 'tm' === e.sh.ty ? e.sh.prop : e.sh;
                return (
                  n.s.setGroupProperty(PropertyInterface('Size', s)),
                  n.p.setGroupProperty(PropertyInterface('Position', s)),
                  Object.defineProperties(i, {
                    size: { get: ExpressionPropertyInterface(n.s) },
                    position: { get: ExpressionPropertyInterface(n.p) },
                    _name: { value: t.nm },
                  }),
                  (i.mn = t.mn),
                  i
                );
              }
              function o(t, e, r) {
                function i(e) {
                  return t.p.ix === e
                    ? i.position
                    : t.r.ix === e
                    ? i.rotation
                    : t.pt.ix === e
                    ? i.points
                    : t.or.ix === e || 'ADBE Vector Star Outer Radius' === e
                    ? i.outerRadius
                    : t.os.ix === e
                    ? i.outerRoundness
                    : !t.ir ||
                      (t.ir.ix !== e && 'ADBE Vector Star Inner Radius' !== e)
                    ? t.is && t.is.ix === e
                      ? i.innerRoundness
                      : void 0
                    : i.innerRadius;
                }
                var s = propertyGroupFactory(i, r),
                  n = 'tm' === e.sh.ty ? e.sh.prop : e.sh;
                return (
                  (i.propertyIndex = t.ix),
                  n.or.setGroupProperty(PropertyInterface('Outer Radius', s)),
                  n.os.setGroupProperty(
                    PropertyInterface('Outer Roundness', s)
                  ),
                  n.pt.setGroupProperty(PropertyInterface('Points', s)),
                  n.p.setGroupProperty(PropertyInterface('Position', s)),
                  n.r.setGroupProperty(PropertyInterface('Rotation', s)),
                  t.ir &&
                    (n.ir.setGroupProperty(
                      PropertyInterface('Inner Radius', s)
                    ),
                    n.is.setGroupProperty(
                      PropertyInterface('Inner Roundness', s)
                    )),
                  Object.defineProperties(i, {
                    position: { get: ExpressionPropertyInterface(n.p) },
                    rotation: { get: ExpressionPropertyInterface(n.r) },
                    points: { get: ExpressionPropertyInterface(n.pt) },
                    outerRadius: { get: ExpressionPropertyInterface(n.or) },
                    outerRoundness: { get: ExpressionPropertyInterface(n.os) },
                    innerRadius: { get: ExpressionPropertyInterface(n.ir) },
                    innerRoundness: { get: ExpressionPropertyInterface(n.is) },
                    _name: { value: t.nm },
                  }),
                  (i.mn = t.mn),
                  i
                );
              }
              function h(t, e, r) {
                function i(e) {
                  return t.p.ix === e
                    ? i.position
                    : t.r.ix === e
                    ? i.roundness
                    : t.s.ix === e ||
                      'Size' === e ||
                      'ADBE Vector Rect Size' === e
                    ? i.size
                    : void 0;
                }
                var s = propertyGroupFactory(i, r),
                  n = 'tm' === e.sh.ty ? e.sh.prop : e.sh;
                return (
                  (i.propertyIndex = t.ix),
                  n.p.setGroupProperty(PropertyInterface('Position', s)),
                  n.s.setGroupProperty(PropertyInterface('Size', s)),
                  n.r.setGroupProperty(PropertyInterface('Rotation', s)),
                  Object.defineProperties(i, {
                    position: { get: ExpressionPropertyInterface(n.p) },
                    roundness: { get: ExpressionPropertyInterface(n.r) },
                    size: { get: ExpressionPropertyInterface(n.s) },
                    _name: { value: t.nm },
                  }),
                  (i.mn = t.mn),
                  i
                );
              }
              function l(t, e, r) {
                function i(e) {
                  if (t.r.ix === e || 'Round Corners 1' === e) return i.radius;
                }
                var s = propertyGroupFactory(i, r),
                  n = e;
                return (
                  (i.propertyIndex = t.ix),
                  n.rd.setGroupProperty(PropertyInterface('Radius', s)),
                  Object.defineProperties(i, {
                    radius: { get: ExpressionPropertyInterface(n.rd) },
                    _name: { value: t.nm },
                  }),
                  (i.mn = t.mn),
                  i
                );
              }
              function p(t, e, r) {
                function i(e) {
                  return t.c.ix === e || 'Copies' === e
                    ? i.copies
                    : t.o.ix === e || 'Offset' === e
                    ? i.offset
                    : void 0;
                }
                var s = propertyGroupFactory(i, r),
                  n = e;
                return (
                  (i.propertyIndex = t.ix),
                  n.c.setGroupProperty(PropertyInterface('Copies', s)),
                  n.o.setGroupProperty(PropertyInterface('Offset', s)),
                  Object.defineProperties(i, {
                    copies: { get: ExpressionPropertyInterface(n.c) },
                    offset: { get: ExpressionPropertyInterface(n.o) },
                    _name: { value: t.nm },
                  }),
                  (i.mn = t.mn),
                  i
                );
              }
              return function (e, r, i) {
                var s;
                function n(t) {
                  if ('number' == typeof t)
                    return 0 === (t = void 0 === t ? 1 : t) ? i : s[t - 1];
                  for (var e = 0, r = s.length; e < r; ) {
                    if (s[e]._name === t) return s[e];
                    e += 1;
                  }
                }
                return (
                  (n.propertyGroup = i),
                  (s = t(e, r, n)),
                  (n.numProperties = s.length),
                  n
                );
              };
            })(),
            TextExpressionInterface = function (t) {
              var e;
              function r() {}
              return (
                Object.defineProperty(r, 'sourceText', {
                  get: function () {
                    t.textProperty.getValue();
                    var r = t.textProperty.currentData.t;
                    return (
                      void 0 !== r &&
                        ((t.textProperty.currentData.t = void 0),
                        ((e = new String(r)).value = r || new String(r))),
                      e
                    );
                  },
                }),
                r
              );
            },
            LayerExpressionInterface = (function () {
              function t(t, e) {
                var r = new Matrix();
                if (
                  (r.reset(),
                  this._elem.finalTransform.mProp.applyToMatrix(r),
                  this._elem.hierarchy && this._elem.hierarchy.length)
                ) {
                  var i,
                    s = this._elem.hierarchy.length;
                  for (i = 0; i < s; i += 1)
                    this._elem.hierarchy[i].finalTransform.mProp.applyToMatrix(
                      r
                    );
                  return r.applyToPointArray(t[0], t[1], t[2] || 0);
                }
                return r.applyToPointArray(t[0], t[1], t[2] || 0);
              }
              function e(t, e) {
                var r = new Matrix();
                if (
                  (r.reset(),
                  this._elem.finalTransform.mProp.applyToMatrix(r),
                  this._elem.hierarchy && this._elem.hierarchy.length)
                ) {
                  var i,
                    s = this._elem.hierarchy.length;
                  for (i = 0; i < s; i += 1)
                    this._elem.hierarchy[i].finalTransform.mProp.applyToMatrix(
                      r
                    );
                  return r.inversePoint(t);
                }
                return r.inversePoint(t);
              }
              function r(t) {
                var e = new Matrix();
                if (
                  (e.reset(),
                  this._elem.finalTransform.mProp.applyToMatrix(e),
                  this._elem.hierarchy && this._elem.hierarchy.length)
                ) {
                  var r,
                    i = this._elem.hierarchy.length;
                  for (r = 0; r < i; r += 1)
                    this._elem.hierarchy[r].finalTransform.mProp.applyToMatrix(
                      e
                    );
                  return e.inversePoint(t);
                }
                return e.inversePoint(t);
              }
              function i() {
                return [1, 1, 1, 1];
              }
              return function (s) {
                var n;
                function a(t) {
                  switch (t) {
                    case 'ADBE Root Vectors Group':
                    case 'Contents':
                    case 2:
                      return a.shapeInterface;
                    case 1:
                    case 6:
                    case 'Transform':
                    case 'transform':
                    case 'ADBE Transform Group':
                      return n;
                    case 4:
                    case 'ADBE Effect Parade':
                    case 'effects':
                    case 'Effects':
                      return a.effect;
                  }
                }
                (a.toWorld = t),
                  (a.fromWorld = e),
                  (a.toComp = t),
                  (a.fromComp = r),
                  (a.sampleImage = i),
                  (a.sourceRectAtTime = s.sourceRectAtTime.bind(s)),
                  (a._elem = s);
                var o = getDescriptor(
                  (n = TransformExpressionInterface(s.finalTransform.mProp)),
                  'anchorPoint'
                );
                return (
                  Object.defineProperties(a, {
                    hasParent: {
                      get: function () {
                        return s.hierarchy.length;
                      },
                    },
                    parent: {
                      get: function () {
                        return s.hierarchy[0].layerInterface;
                      },
                    },
                    rotation: getDescriptor(n, 'rotation'),
                    scale: getDescriptor(n, 'scale'),
                    position: getDescriptor(n, 'position'),
                    opacity: getDescriptor(n, 'opacity'),
                    anchorPoint: o,
                    anchor_point: o,
                    transform: {
                      get: function () {
                        return n;
                      },
                    },
                    active: {
                      get: function () {
                        return s.isInRange;
                      },
                    },
                  }),
                  (a.startTime = s.data.st),
                  (a.index = s.data.ind),
                  (a.source = s.data.refId),
                  (a.height = 0 === s.data.ty ? s.data.h : 100),
                  (a.width = 0 === s.data.ty ? s.data.w : 100),
                  (a.inPoint = s.data.ip / s.comp.globalData.frameRate),
                  (a.outPoint = s.data.op / s.comp.globalData.frameRate),
                  (a._name = s.data.nm),
                  (a.registerMaskInterface = function (t) {
                    a.mask = new MaskManagerInterface(t, s);
                  }),
                  (a.registerEffectsInterface = function (t) {
                    a.effect = t;
                  }),
                  a
                );
              };
            })(),
            CompExpressionInterface = function (t) {
              function e(e) {
                for (var r = 0, i = t.layers.length; r < i; ) {
                  if (t.layers[r].nm === e || t.layers[r].ind === e)
                    return t.elements[r].layerInterface;
                  r += 1;
                }
                return null;
              }
              return (
                Object.defineProperty(e, '_name', { value: t.data.nm }),
                (e.layer = e),
                (e.pixelAspect = 1),
                (e.height = t.data.h || t.globalData.compSize.h),
                (e.width = t.data.w || t.globalData.compSize.w),
                (e.pixelAspect = 1),
                (e.frameDuration = 1 / t.globalData.frameRate),
                (e.displayStartTime = 0),
                (e.numLayers = t.layers.length),
                e
              );
            },
            TransformExpressionInterface = function (t) {
              function e(t) {
                switch (t) {
                  case 'scale':
                  case 'Scale':
                  case 'ADBE Scale':
                  case 6:
                    return e.scale;
                  case 'rotation':
                  case 'Rotation':
                  case 'ADBE Rotation':
                  case 'ADBE Rotate Z':
                  case 10:
                    return e.rotation;
                  case 'ADBE Rotate X':
                    return e.xRotation;
                  case 'ADBE Rotate Y':
                    return e.yRotation;
                  case 'position':
                  case 'Position':
                  case 'ADBE Position':
                  case 2:
                    return e.position;
                  case 'ADBE Position_0':
                    return e.xPosition;
                  case 'ADBE Position_1':
                    return e.yPosition;
                  case 'ADBE Position_2':
                    return e.zPosition;
                  case 'anchorPoint':
                  case 'AnchorPoint':
                  case 'Anchor Point':
                  case 'ADBE AnchorPoint':
                  case 1:
                    return e.anchorPoint;
                  case 'opacity':
                  case 'Opacity':
                  case 11:
                    return e.opacity;
                }
              }
              if (
                (Object.defineProperty(e, 'rotation', {
                  get: ExpressionPropertyInterface(t.r || t.rz),
                }),
                Object.defineProperty(e, 'zRotation', {
                  get: ExpressionPropertyInterface(t.rz || t.r),
                }),
                Object.defineProperty(e, 'xRotation', {
                  get: ExpressionPropertyInterface(t.rx),
                }),
                Object.defineProperty(e, 'yRotation', {
                  get: ExpressionPropertyInterface(t.ry),
                }),
                Object.defineProperty(e, 'scale', {
                  get: ExpressionPropertyInterface(t.s),
                }),
                t.p)
              )
                var r = ExpressionPropertyInterface(t.p);
              else {
                var i,
                  s = ExpressionPropertyInterface(t.px),
                  n = ExpressionPropertyInterface(t.py);
                t.pz && (i = ExpressionPropertyInterface(t.pz));
              }
              return (
                Object.defineProperty(e, 'position', {
                  get: function () {
                    return t.p ? r() : [s(), n(), i ? i() : 0];
                  },
                }),
                Object.defineProperty(e, 'xPosition', {
                  get: ExpressionPropertyInterface(t.px),
                }),
                Object.defineProperty(e, 'yPosition', {
                  get: ExpressionPropertyInterface(t.py),
                }),
                Object.defineProperty(e, 'zPosition', {
                  get: ExpressionPropertyInterface(t.pz),
                }),
                Object.defineProperty(e, 'anchorPoint', {
                  get: ExpressionPropertyInterface(t.a),
                }),
                Object.defineProperty(e, 'opacity', {
                  get: ExpressionPropertyInterface(t.o),
                }),
                Object.defineProperty(e, 'skew', {
                  get: ExpressionPropertyInterface(t.sk),
                }),
                Object.defineProperty(e, 'skewAxis', {
                  get: ExpressionPropertyInterface(t.sa),
                }),
                Object.defineProperty(e, 'orientation', {
                  get: ExpressionPropertyInterface(t.or),
                }),
                e
              );
            },
            ProjectInterface = (function () {
              function t(t) {
                this.compositions.push(t);
              }
              return function () {
                function e(t) {
                  for (var e = 0, r = this.compositions.length; e < r; ) {
                    if (
                      this.compositions[e].data &&
                      this.compositions[e].data.nm === t
                    )
                      return (
                        this.compositions[e].prepareFrame &&
                          this.compositions[e].data.xt &&
                          this.compositions[e].prepareFrame(this.currentFrame),
                        this.compositions[e].compInterface
                      );
                    e += 1;
                  }
                }
                return (
                  (e.compositions = []),
                  (e.currentFrame = 0),
                  (e.registerComposition = t),
                  e
                );
              };
            })(),
            EffectsExpressionInterface = (function () {
              function t(r, i, s, n) {
                function a(t) {
                  for (var e = r.ef, i = 0, s = e.length; i < s; ) {
                    if (t === e[i].nm || t === e[i].mn || t === e[i].ix)
                      return 5 === e[i].ty ? l[i] : l[i]();
                    i += 1;
                  }
                  return l[0]();
                }
                var o,
                  h = propertyGroupFactory(a, s),
                  l = [],
                  p = r.ef.length;
                for (o = 0; o < p; o += 1)
                  5 === r.ef[o].ty
                    ? l.push(
                        t(
                          r.ef[o],
                          i.effectElements[o],
                          i.effectElements[o].propertyGroup,
                          n
                        )
                      )
                    : l.push(e(i.effectElements[o], r.ef[o].ty, n, h));
                return (
                  'ADBE Color Control' === r.mn &&
                    Object.defineProperty(a, 'color', {
                      get: function () {
                        return l[0]();
                      },
                    }),
                  Object.defineProperties(a, {
                    numProperties: {
                      get: function () {
                        return r.np;
                      },
                    },
                    _name: { value: r.nm },
                    propertyGroup: { value: h },
                  }),
                  (a.active = a.enabled = 0 !== r.en),
                  a
                );
              }
              function e(t, e, r, i) {
                var s = ExpressionPropertyInterface(t.p);
                return (
                  t.p.setGroupProperty &&
                    t.p.setGroupProperty(PropertyInterface('', i)),
                  function () {
                    return 10 === e ? r.comp.compInterface(t.p.v) : s();
                  }
                );
              }
              return {
                createEffectsInterface: function (e, r) {
                  if (e.effectsManager) {
                    var i,
                      s = [],
                      n = e.data.ef,
                      a = e.effectsManager.effectElements.length;
                    for (i = 0; i < a; i += 1)
                      s.push(t(n[i], e.effectsManager.effectElements[i], r, e));
                    var o = e.data.ef || [],
                      h = function (t) {
                        for (i = 0, a = o.length; i < a; ) {
                          if (t === o[i].nm || t === o[i].mn || t === o[i].ix)
                            return s[i];
                          i += 1;
                        }
                      };
                    return (
                      Object.defineProperty(h, 'numProperties', {
                        get: function () {
                          return o.length;
                        },
                      }),
                      h
                    );
                  }
                },
              };
            })(),
            MaskManagerInterface = (function () {
              function t(t, e) {
                (this._mask = t), (this._data = e);
              }
              Object.defineProperty(t.prototype, 'maskPath', {
                get: function () {
                  return (
                    this._mask.prop.k && this._mask.prop.getValue(),
                    this._mask.prop
                  );
                },
              }),
                Object.defineProperty(t.prototype, 'maskOpacity', {
                  get: function () {
                    return (
                      this._mask.op.k && this._mask.op.getValue(),
                      100 * this._mask.op.v
                    );
                  },
                });
              return function (e, r) {
                var i,
                  s = createSizedArray(e.viewData.length),
                  n = e.viewData.length;
                for (i = 0; i < n; i += 1)
                  s[i] = new t(e.viewData[i], e.masksProperties[i]);
                return function (t) {
                  for (i = 0; i < n; ) {
                    if (e.masksProperties[i].nm === t) return s[i];
                    i += 1;
                  }
                };
              };
            })(),
            ExpressionPropertyInterface = (function () {
              var t = { pv: 0, v: 0, mult: 1 },
                e = { pv: [0, 0, 0], v: [0, 0, 0], mult: 1 };
              function r(t, e, r) {
                Object.defineProperty(t, 'velocity', {
                  get: function () {
                    return e.getVelocityAtTime(e.comp.currentFrame);
                  },
                }),
                  (t.numKeys = e.keyframes ? e.keyframes.length : 0),
                  (t.key = function (i) {
                    if (t.numKeys) {
                      var s = '';
                      s =
                        's' in e.keyframes[i - 1]
                          ? e.keyframes[i - 1].s
                          : 'e' in e.keyframes[i - 2]
                          ? e.keyframes[i - 2].e
                          : e.keyframes[i - 2].s;
                      var n =
                        'unidimensional' === r
                          ? new Number(s)
                          : Object.assign({}, s);
                      return (
                        (n.time =
                          e.keyframes[i - 1].t /
                          e.elem.comp.globalData.frameRate),
                        n
                      );
                    }
                    return 0;
                  }),
                  (t.valueAtTime = e.getValueAtTime),
                  (t.speedAtTime = e.getSpeedAtTime),
                  (t.velocityAtTime = e.getVelocityAtTime),
                  (t.propertyGroup = e.propertyGroup);
              }
              function i() {
                return t;
              }
              return function (s) {
                return s
                  ? 'unidimensional' === s.propType
                    ? (function (e) {
                        (e && 'pv' in e) || (e = t);
                        var i = 1 / e.mult,
                          s = e.pv * i,
                          n = new Number(s);
                        return (
                          (n.value = s),
                          r(n, e, 'unidimensional'),
                          function () {
                            return (
                              e.k && e.getValue(),
                              (s = e.v * i),
                              n.value !== s &&
                                (((n = new Number(s)).value = s),
                                r(n, e, 'unidimensional')),
                              n
                            );
                          }
                        );
                      })(s)
                    : (function (t) {
                        (t && 'pv' in t) || (t = e);
                        var i = 1 / t.mult,
                          s = t.pv.length,
                          n = createTypedArray('float32', s),
                          a = createTypedArray('float32', s);
                        return (
                          (n.value = a),
                          r(n, t, 'multidimensional'),
                          function () {
                            t.k && t.getValue();
                            for (var e = 0; e < s; e += 1)
                              n[e] = a[e] = t.v[e] * i;
                            return n;
                          }
                        );
                      })(s)
                  : i;
              };
            })(),
            TextExpressionSelectorProp,
            propertyGetTextProp;
          function SliderEffect(t, e, r) {
            this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
          }
          function AngleEffect(t, e, r) {
            this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
          }
          function ColorEffect(t, e, r) {
            this.p = PropertyFactory.getProp(e, t.v, 1, 0, r);
          }
          function PointEffect(t, e, r) {
            this.p = PropertyFactory.getProp(e, t.v, 1, 0, r);
          }
          function LayerIndexEffect(t, e, r) {
            this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
          }
          function MaskIndexEffect(t, e, r) {
            this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
          }
          function CheckboxEffect(t, e, r) {
            this.p = PropertyFactory.getProp(e, t.v, 0, 0, r);
          }
          function NoValueEffect() {
            this.p = {};
          }
          function EffectsManager() {}
          function EffectsManager(t, e) {
            var r = t.ef || [];
            this.effectElements = [];
            var i,
              s,
              n = r.length;
            for (i = 0; i < n; i++)
              (s = new GroupEffect(r[i], e)), this.effectElements.push(s);
          }
          function GroupEffect(t, e) {
            this.init(t, e);
          }
          (TextExpressionSelectorProp = (function () {
            function t(t, e) {
              return (
                (this.textIndex = t + 1),
                (this.textTotal = e),
                (this.v = this.getValue() * this.mult),
                this.v
              );
            }
            return function (e, r) {
              (this.pv = 1),
                (this.comp = e.comp),
                (this.elem = e),
                (this.mult = 0.01),
                (this.propType = 'textSelector'),
                (this.textTotal = r.totalChars),
                (this.selectorValue = 100),
                (this.lastValue = [1, 1, 1]),
                (this.k = !0),
                (this.x = !0),
                (this.getValue = ExpressionManager.initiateExpression.bind(
                  this
                )(e, r, this)),
                (this.getMult = t),
                (this.getVelocityAtTime = expressionHelpers.getVelocityAtTime),
                this.kf
                  ? (this.getValueAtTime =
                      expressionHelpers.getValueAtTime.bind(this))
                  : (this.getValueAtTime =
                      expressionHelpers.getStaticValueAtTime.bind(this)),
                (this.setGroupProperty = expressionHelpers.setGroupProperty);
            };
          })()),
            (propertyGetTextProp = TextSelectorProp.getTextSelectorProp),
            (TextSelectorProp.getTextSelectorProp = function (t, e, r) {
              return 1 === e.t
                ? new TextExpressionSelectorProp(t, e, r)
                : propertyGetTextProp(t, e, r);
            }),
            extendPrototype([DynamicPropertyContainer], GroupEffect),
            (GroupEffect.prototype.getValue =
              GroupEffect.prototype.iterateDynamicProperties),
            (GroupEffect.prototype.init = function (t, e) {
              (this.data = t),
                (this.effectElements = []),
                this.initDynamicPropertyContainer(e);
              var r,
                i,
                s = this.data.ef.length,
                n = this.data.ef;
              for (r = 0; r < s; r += 1) {
                switch (((i = null), n[r].ty)) {
                  case 0:
                    i = new SliderEffect(n[r], e, this);
                    break;
                  case 1:
                    i = new AngleEffect(n[r], e, this);
                    break;
                  case 2:
                    i = new ColorEffect(n[r], e, this);
                    break;
                  case 3:
                    i = new PointEffect(n[r], e, this);
                    break;
                  case 4:
                  case 7:
                    i = new CheckboxEffect(n[r], e, this);
                    break;
                  case 10:
                    i = new LayerIndexEffect(n[r], e, this);
                    break;
                  case 11:
                    i = new MaskIndexEffect(n[r], e, this);
                    break;
                  case 5:
                    i = new EffectsManager(n[r], e, this);
                    break;
                  default:
                    i = new NoValueEffect(n[r], e, this);
                }
                i && this.effectElements.push(i);
              }
            });
          var lottie = {};
          function setLocationHref(t) {
            locationHref = t;
          }
          function searchAnimations() {
            animationManager.searchAnimations();
          }
          function setSubframeRendering(t) {
            subframeEnabled = t;
          }
          function loadAnimation(t) {
            return animationManager.loadAnimation(t);
          }
          function setQuality(t) {
            if ('string' == typeof t)
              switch (t) {
                case 'high':
                  defaultCurveSegments = 200;
                  break;
                case 'medium':
                  defaultCurveSegments = 50;
                  break;
                case 'low':
                  defaultCurveSegments = 10;
              }
            else !isNaN(t) && t > 1 && (defaultCurveSegments = t);
          }
          function inBrowser() {
            return 'undefined' != typeof navigator;
          }
          function installPlugin(t, e) {
            'expressions' === t && (expressionsPlugin = e);
          }
          function getFactory(t) {
            switch (t) {
              case 'propertyFactory':
                return PropertyFactory;
              case 'shapePropertyFactory':
                return ShapePropertyFactory;
              case 'matrix':
                return Matrix;
            }
          }
          function checkReady() {
            'complete' === document.readyState &&
              (clearInterval(readyStateCheckInterval), searchAnimations());
          }
          function getQueryVariable(t) {
            for (var e = queryString.split('&'), r = 0; r < e.length; r++) {
              var i = e[r].split('=');
              if (decodeURIComponent(i[0]) == t)
                return decodeURIComponent(i[1]);
            }
          }
          (lottie.play = animationManager.play),
            (lottie.pause = animationManager.pause),
            (lottie.setLocationHref = setLocationHref),
            (lottie.togglePause = animationManager.togglePause),
            (lottie.setSpeed = animationManager.setSpeed),
            (lottie.setDirection = animationManager.setDirection),
            (lottie.stop = animationManager.stop),
            (lottie.searchAnimations = searchAnimations),
            (lottie.registerAnimation = animationManager.registerAnimation),
            (lottie.loadAnimation = loadAnimation),
            (lottie.setSubframeRendering = setSubframeRendering),
            (lottie.resize = animationManager.resize),
            (lottie.goToAndStop = animationManager.goToAndStop),
            (lottie.destroy = animationManager.destroy),
            (lottie.setQuality = setQuality),
            (lottie.inBrowser = inBrowser),
            (lottie.installPlugin = installPlugin),
            (lottie.freeze = animationManager.freeze),
            (lottie.unfreeze = animationManager.unfreeze),
            (lottie.getRegisteredAnimations =
              animationManager.getRegisteredAnimations),
            (lottie.__getFactory = getFactory),
            (lottie.version = '5.7.1');
          var renderer = '',
            scripts = document.getElementsByTagName('script'),
            index = scripts.length - 1,
            myScript = scripts[index] || { src: '' },
            queryString = myScript.src.replace(/^[^\?]+\??/, '');
          renderer = getQueryVariable('renderer');
          var readyStateCheckInterval = setInterval(checkReady, 100);
          return lottie;
        });
    }),
    jszip = createCommonjsModule(function (t, e) {
      /*!

  JSZip v3.5.0 - A JavaScript class for generating and reading zip files
  <http://stuartk.com/jszip>

  (c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
  Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

  JSZip uses the library pako released under the MIT license :
  https://github.com/nodeca/pako/blob/master/LICENSE
  */
      t.exports = (function t(e, r, i) {
        function s(a, o) {
          if (!r[a]) {
            if (!e[a]) {
              var h = 'function' == typeof commonjsRequire && commonjsRequire;
              if (!o && h) return h(a, !0);
              if (n) return n(a, !0);
              var l = new Error("Cannot find module '" + a + "'");
              throw ((l.code = 'MODULE_NOT_FOUND'), l);
            }
            var p = (r[a] = { exports: {} });
            e[a][0].call(
              p.exports,
              function (t) {
                var r = e[a][1][t];
                return s(r || t);
              },
              p,
              p.exports,
              t,
              e,
              r,
              i
            );
          }
          return r[a].exports;
        }
        for (
          var n = 'function' == typeof commonjsRequire && commonjsRequire,
            a = 0;
          a < i.length;
          a++
        )
          s(i[a]);
        return s;
      })(
        {
          1: [
            function (t, e, r) {
              var i = t('./utils'),
                s = t('./support'),
                n =
                  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
              (r.encode = function (t) {
                for (
                  var e,
                    r,
                    s,
                    a,
                    o,
                    h,
                    l,
                    p = [],
                    c = 0,
                    f = t.length,
                    d = f,
                    u = 'string' !== i.getTypeOf(t);
                  c < t.length;

                )
                  (d = f - c),
                    u
                      ? ((e = t[c++]),
                        (r = c < f ? t[c++] : 0),
                        (s = c < f ? t[c++] : 0))
                      : ((e = t.charCodeAt(c++)),
                        (r = c < f ? t.charCodeAt(c++) : 0),
                        (s = c < f ? t.charCodeAt(c++) : 0)),
                    (a = e >> 2),
                    (o = ((3 & e) << 4) | (r >> 4)),
                    (h = d > 1 ? ((15 & r) << 2) | (s >> 6) : 64),
                    (l = d > 2 ? 63 & s : 64),
                    p.push(
                      n.charAt(a) + n.charAt(o) + n.charAt(h) + n.charAt(l)
                    );
                return p.join('');
              }),
                (r.decode = function (t) {
                  var e,
                    r,
                    i,
                    a,
                    o,
                    h,
                    l = 0,
                    p = 0;
                  if ('data:' === t.substr(0, 'data:'.length))
                    throw new Error(
                      'Invalid base64 input, it looks like a data url.'
                    );
                  var c,
                    f =
                      (3 * (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, '')).length) /
                      4;
                  if (
                    (t.charAt(t.length - 1) === n.charAt(64) && f--,
                    t.charAt(t.length - 2) === n.charAt(64) && f--,
                    f % 1 != 0)
                  )
                    throw new Error(
                      'Invalid base64 input, bad content length.'
                    );
                  for (
                    c = s.uint8array ? new Uint8Array(0 | f) : new Array(0 | f);
                    l < t.length;

                  )
                    (e =
                      (n.indexOf(t.charAt(l++)) << 2) |
                      ((a = n.indexOf(t.charAt(l++))) >> 4)),
                      (r =
                        ((15 & a) << 4) |
                        ((o = n.indexOf(t.charAt(l++))) >> 2)),
                      (i = ((3 & o) << 6) | (h = n.indexOf(t.charAt(l++)))),
                      (c[p++] = e),
                      64 !== o && (c[p++] = r),
                      64 !== h && (c[p++] = i);
                  return c;
                });
            },
            { './support': 30, './utils': 32 },
          ],
          2: [
            function (t, e, r) {
              var i = t('./external'),
                s = t('./stream/DataWorker'),
                n = t('./stream/DataLengthProbe'),
                a = t('./stream/Crc32Probe');
              function o(t, e, r, i, s) {
                (this.compressedSize = t),
                  (this.uncompressedSize = e),
                  (this.crc32 = r),
                  (this.compression = i),
                  (this.compressedContent = s);
              }
              (n = t('./stream/DataLengthProbe')),
                (o.prototype = {
                  getContentWorker: function () {
                    var t = new s(i.Promise.resolve(this.compressedContent))
                        .pipe(this.compression.uncompressWorker())
                        .pipe(new n('data_length')),
                      e = this;
                    return (
                      t.on('end', function () {
                        if (this.streamInfo.data_length !== e.uncompressedSize)
                          throw new Error(
                            'Bug : uncompressed data size mismatch'
                          );
                      }),
                      t
                    );
                  },
                  getCompressedWorker: function () {
                    return new s(i.Promise.resolve(this.compressedContent))
                      .withStreamInfo('compressedSize', this.compressedSize)
                      .withStreamInfo('uncompressedSize', this.uncompressedSize)
                      .withStreamInfo('crc32', this.crc32)
                      .withStreamInfo('compression', this.compression);
                  },
                }),
                (o.createWorkerFrom = function (t, e, r) {
                  return t
                    .pipe(new a())
                    .pipe(new n('uncompressedSize'))
                    .pipe(e.compressWorker(r))
                    .pipe(new n('compressedSize'))
                    .withStreamInfo('compression', e);
                }),
                (e.exports = o);
            },
            {
              './external': 6,
              './stream/Crc32Probe': 25,
              './stream/DataLengthProbe': 26,
              './stream/DataWorker': 27,
            },
          ],
          3: [
            function (t, e, r) {
              var i = t('./stream/GenericWorker');
              (r.STORE = {
                magic: '\0\0',
                compressWorker: function (t) {
                  return new i('STORE compression');
                },
                uncompressWorker: function () {
                  return new i('STORE decompression');
                },
              }),
                (r.DEFLATE = t('./flate'));
            },
            { './flate': 7, './stream/GenericWorker': 28 },
          ],
          4: [
            function (t, e, r) {
              var i = t('./utils'),
                s = (function () {
                  for (var t, e = [], r = 0; r < 256; r++) {
                    t = r;
                    for (var i = 0; i < 8; i++)
                      t = 1 & t ? 3988292384 ^ (t >>> 1) : t >>> 1;
                    e[r] = t;
                  }
                  return e;
                })();
              e.exports = function (t, e) {
                return void 0 !== t && t.length
                  ? 'string' !== i.getTypeOf(t)
                    ? (function (t, e, r, i) {
                        var n = s,
                          a = i + r;
                        t ^= -1;
                        for (var o = i; o < a; o++)
                          t = (t >>> 8) ^ n[255 & (t ^ e[o])];
                        return -1 ^ t;
                      })(0 | e, t, t.length, 0)
                    : (function (t, e, r, i) {
                        var n = s,
                          a = i + r;
                        t ^= -1;
                        for (var o = i; o < a; o++)
                          t = (t >>> 8) ^ n[255 & (t ^ e.charCodeAt(o))];
                        return -1 ^ t;
                      })(0 | e, t, t.length, 0)
                  : 0;
              };
            },
            { './utils': 32 },
          ],
          5: [
            function (t, e, r) {
              (r.base64 = !1),
                (r.binary = !1),
                (r.dir = !1),
                (r.createFolders = !0),
                (r.date = null),
                (r.compression = null),
                (r.compressionOptions = null),
                (r.comment = null),
                (r.unixPermissions = null),
                (r.dosPermissions = null);
            },
            {},
          ],
          6: [
            function (t, e, r) {
              var i = null;
              (i = 'undefined' != typeof Promise ? Promise : t('lie')),
                (e.exports = { Promise: i });
            },
            { lie: 37 },
          ],
          7: [
            function (t, e, r) {
              var i =
                  'undefined' != typeof Uint8Array &&
                  'undefined' != typeof Uint16Array &&
                  'undefined' != typeof Uint32Array,
                s = t('pako'),
                n = t('./utils'),
                a = t('./stream/GenericWorker'),
                o = i ? 'uint8array' : 'array';
              function h(t, e) {
                a.call(this, 'FlateWorker/' + t),
                  (this._pako = null),
                  (this._pakoAction = t),
                  (this._pakoOptions = e),
                  (this.meta = {});
              }
              (r.magic = '\b\0'),
                n.inherits(h, a),
                (h.prototype.processChunk = function (t) {
                  (this.meta = t.meta),
                    null === this._pako && this._createPako(),
                    this._pako.push(n.transformTo(o, t.data), !1);
                }),
                (h.prototype.flush = function () {
                  a.prototype.flush.call(this),
                    null === this._pako && this._createPako(),
                    this._pako.push([], !0);
                }),
                (h.prototype.cleanUp = function () {
                  a.prototype.cleanUp.call(this), (this._pako = null);
                }),
                (h.prototype._createPako = function () {
                  this._pako = new s[this._pakoAction]({
                    raw: !0,
                    level: this._pakoOptions.level || -1,
                  });
                  var t = this;
                  this._pako.onData = function (e) {
                    t.push({ data: e, meta: t.meta });
                  };
                }),
                (r.compressWorker = function (t) {
                  return new h('Deflate', t);
                }),
                (r.uncompressWorker = function () {
                  return new h('Inflate', {});
                });
            },
            { './stream/GenericWorker': 28, './utils': 32, pako: 38 },
          ],
          8: [
            function (t, e, r) {
              var i = t('../utils'),
                s = t('../stream/GenericWorker'),
                n = t('../utf8'),
                a = t('../crc32'),
                o = t('../signature'),
                h = function (t, e) {
                  var r,
                    i = '';
                  for (r = 0; r < e; r++)
                    (i += String.fromCharCode(255 & t)), (t >>>= 8);
                  return i;
                },
                l = function (t, e, r, s, l, p) {
                  var c,
                    f,
                    d = t.file,
                    u = t.compression,
                    m = p !== n.utf8encode,
                    y = i.transformTo('string', p(d.name)),
                    g = i.transformTo('string', n.utf8encode(d.name)),
                    v = d.comment,
                    _ = i.transformTo('string', p(v)),
                    b = i.transformTo('string', n.utf8encode(v)),
                    S = g.length !== d.name.length,
                    P = b.length !== v.length,
                    x = '',
                    k = '',
                    w = '',
                    E = d.dir,
                    A = d.date,
                    T = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
                  (e && !r) ||
                    ((T.crc32 = t.crc32),
                    (T.compressedSize = t.compressedSize),
                    (T.uncompressedSize = t.uncompressedSize));
                  var C = 0;
                  e && (C |= 8), m || (!S && !P) || (C |= 2048);
                  var I,
                    F,
                    M,
                    D = 0,
                    R = 0;
                  E && (D |= 16),
                    'UNIX' === l
                      ? ((R = 798),
                        (D |=
                          ((I = d.unixPermissions),
                          (F = E),
                          (M = I),
                          I || (M = F ? 16893 : 33204),
                          (65535 & M) << 16)))
                      : ((R = 20), (D |= 63 & (d.dosPermissions || 0))),
                    (c = A.getUTCHours()),
                    (c <<= 6),
                    (c |= A.getUTCMinutes()),
                    (c <<= 5),
                    (c |= A.getUTCSeconds() / 2),
                    (f = A.getUTCFullYear() - 1980),
                    (f <<= 4),
                    (f |= A.getUTCMonth() + 1),
                    (f <<= 5),
                    (f |= A.getUTCDate()),
                    S &&
                      ((k = h(1, 1) + h(a(y), 4) + g),
                      (x += 'up' + h(k.length, 2) + k)),
                    P &&
                      ((w = h(1, 1) + h(a(_), 4) + b),
                      (x += 'uc' + h(w.length, 2) + w));
                  var z = '';
                  return (
                    (z += '\n\0'),
                    (z += h(C, 2)),
                    (z += u.magic),
                    (z += h(c, 2)),
                    (z += h(f, 2)),
                    (z += h(T.crc32, 4)),
                    (z += h(T.compressedSize, 4)),
                    (z += h(T.uncompressedSize, 4)),
                    (z += h(y.length, 2)),
                    (z += h(x.length, 2)),
                    {
                      fileRecord: o.LOCAL_FILE_HEADER + z + y + x,
                      dirRecord:
                        o.CENTRAL_FILE_HEADER +
                        h(R, 2) +
                        z +
                        h(_.length, 2) +
                        '\0\0\0\0' +
                        h(D, 4) +
                        h(s, 4) +
                        y +
                        x +
                        _,
                    }
                  );
                },
                p = function (t) {
                  return (
                    o.DATA_DESCRIPTOR +
                    h(t.crc32, 4) +
                    h(t.compressedSize, 4) +
                    h(t.uncompressedSize, 4)
                  );
                };
              function c(t, e, r, i) {
                s.call(this, 'ZipFileWorker'),
                  (this.bytesWritten = 0),
                  (this.zipComment = e),
                  (this.zipPlatform = r),
                  (this.encodeFileName = i),
                  (this.streamFiles = t),
                  (this.accumulate = !1),
                  (this.contentBuffer = []),
                  (this.dirRecords = []),
                  (this.currentSourceOffset = 0),
                  (this.entriesCount = 0),
                  (this.currentFile = null),
                  (this._sources = []);
              }
              i.inherits(c, s),
                (c.prototype.push = function (t) {
                  var e = t.meta.percent || 0,
                    r = this.entriesCount,
                    i = this._sources.length;
                  this.accumulate
                    ? this.contentBuffer.push(t)
                    : ((this.bytesWritten += t.data.length),
                      s.prototype.push.call(this, {
                        data: t.data,
                        meta: {
                          currentFile: this.currentFile,
                          percent: r ? (e + 100 * (r - i - 1)) / r : 100,
                        },
                      }));
                }),
                (c.prototype.openedSource = function (t) {
                  (this.currentSourceOffset = this.bytesWritten),
                    (this.currentFile = t.file.name);
                  var e = this.streamFiles && !t.file.dir;
                  if (e) {
                    var r = l(
                      t,
                      e,
                      !1,
                      this.currentSourceOffset,
                      this.zipPlatform,
                      this.encodeFileName
                    );
                    this.push({ data: r.fileRecord, meta: { percent: 0 } });
                  } else this.accumulate = !0;
                }),
                (c.prototype.closedSource = function (t) {
                  this.accumulate = !1;
                  var e = this.streamFiles && !t.file.dir,
                    r = l(
                      t,
                      e,
                      !0,
                      this.currentSourceOffset,
                      this.zipPlatform,
                      this.encodeFileName
                    );
                  if ((this.dirRecords.push(r.dirRecord), e))
                    this.push({ data: p(t), meta: { percent: 100 } });
                  else
                    for (
                      this.push({ data: r.fileRecord, meta: { percent: 0 } });
                      this.contentBuffer.length;

                    )
                      this.push(this.contentBuffer.shift());
                  this.currentFile = null;
                }),
                (c.prototype.flush = function () {
                  for (
                    var t = this.bytesWritten, e = 0;
                    e < this.dirRecords.length;
                    e++
                  )
                    this.push({
                      data: this.dirRecords[e],
                      meta: { percent: 100 },
                    });
                  var r = this.bytesWritten - t,
                    s = (function (t, e, r, s, n) {
                      var a = i.transformTo('string', n(s));
                      return (
                        o.CENTRAL_DIRECTORY_END +
                        '\0\0\0\0' +
                        h(t, 2) +
                        h(t, 2) +
                        h(e, 4) +
                        h(r, 4) +
                        h(a.length, 2) +
                        a
                      );
                    })(
                      this.dirRecords.length,
                      r,
                      t,
                      this.zipComment,
                      this.encodeFileName
                    );
                  this.push({ data: s, meta: { percent: 100 } });
                }),
                (c.prototype.prepareNextSource = function () {
                  (this.previous = this._sources.shift()),
                    this.openedSource(this.previous.streamInfo),
                    this.isPaused
                      ? this.previous.pause()
                      : this.previous.resume();
                }),
                (c.prototype.registerPrevious = function (t) {
                  this._sources.push(t);
                  var e = this;
                  return (
                    t.on('data', function (t) {
                      e.processChunk(t);
                    }),
                    t.on('end', function () {
                      e.closedSource(e.previous.streamInfo),
                        e._sources.length ? e.prepareNextSource() : e.end();
                    }),
                    t.on('error', function (t) {
                      e.error(t);
                    }),
                    this
                  );
                }),
                (c.prototype.resume = function () {
                  return (
                    !!s.prototype.resume.call(this) &&
                    (!this.previous && this._sources.length
                      ? (this.prepareNextSource(), !0)
                      : this.previous ||
                        this._sources.length ||
                        this.generatedError
                      ? void 0
                      : (this.end(), !0))
                  );
                }),
                (c.prototype.error = function (t) {
                  var e = this._sources;
                  if (!s.prototype.error.call(this, t)) return !1;
                  for (var r = 0; r < e.length; r++)
                    try {
                      e[r].error(t);
                    } catch (t) {}
                  return !0;
                }),
                (c.prototype.lock = function () {
                  s.prototype.lock.call(this);
                  for (var t = this._sources, e = 0; e < t.length; e++)
                    t[e].lock();
                }),
                (e.exports = c);
            },
            {
              '../crc32': 4,
              '../signature': 23,
              '../stream/GenericWorker': 28,
              '../utf8': 31,
              '../utils': 32,
            },
          ],
          9: [
            function (t, e, r) {
              var i = t('../compressions'),
                s = t('./ZipFileWorker');
              r.generateWorker = function (t, e, r) {
                var n = new s(e.streamFiles, r, e.platform, e.encodeFileName),
                  a = 0;
                try {
                  t.forEach(function (t, r) {
                    a++;
                    var s = (function (t, e) {
                        var r = t || e,
                          s = i[r];
                        if (!s)
                          throw new Error(
                            r + ' is not a valid compression method !'
                          );
                        return s;
                      })(r.options.compression, e.compression),
                      o =
                        r.options.compressionOptions ||
                        e.compressionOptions ||
                        {},
                      h = r.dir,
                      l = r.date;
                    r._compressWorker(s, o)
                      .withStreamInfo('file', {
                        name: t,
                        dir: h,
                        date: l,
                        comment: r.comment || '',
                        unixPermissions: r.unixPermissions,
                        dosPermissions: r.dosPermissions,
                      })
                      .pipe(n);
                  }),
                    (n.entriesCount = a);
                } catch (t) {
                  n.error(t);
                }
                return n;
              };
            },
            { '../compressions': 3, './ZipFileWorker': 8 },
          ],
          10: [
            function (t, e, r) {
              function i() {
                if (!(this instanceof i)) return new i();
                if (arguments.length)
                  throw new Error(
                    'The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.'
                  );
                (this.files = {}),
                  (this.comment = null),
                  (this.root = ''),
                  (this.clone = function () {
                    var t = new i();
                    for (var e in this)
                      'function' != typeof this[e] && (t[e] = this[e]);
                    return t;
                  });
              }
              (i.prototype = t('./object')),
                (i.prototype.loadAsync = t('./load')),
                (i.support = t('./support')),
                (i.defaults = t('./defaults')),
                (i.version = '3.5.0'),
                (i.loadAsync = function (t, e) {
                  return new i().loadAsync(t, e);
                }),
                (i.external = t('./external')),
                (e.exports = i);
            },
            {
              './defaults': 5,
              './external': 6,
              './load': 11,
              './object': 15,
              './support': 30,
            },
          ],
          11: [
            function (t, e, r) {
              var i = t('./utils'),
                s = t('./external'),
                n = t('./utf8'),
                a = ((i = t('./utils')), t('./zipEntries')),
                o = t('./stream/Crc32Probe'),
                h = t('./nodejsUtils');
              function l(t) {
                return new s.Promise(function (e, r) {
                  var i = t.decompressed.getContentWorker().pipe(new o());
                  i.on('error', function (t) {
                    r(t);
                  })
                    .on('end', function () {
                      i.streamInfo.crc32 !== t.decompressed.crc32
                        ? r(new Error('Corrupted zip : CRC32 mismatch'))
                        : e();
                    })
                    .resume();
                });
              }
              e.exports = function (t, e) {
                var r = this;
                return (
                  (e = i.extend(e || {}, {
                    base64: !1,
                    checkCRC32: !1,
                    optimizedBinaryString: !1,
                    createFolders: !1,
                    decodeFileName: n.utf8decode,
                  })),
                  h.isNode && h.isStream(t)
                    ? s.Promise.reject(
                        new Error(
                          "JSZip can't accept a stream when loading a zip file."
                        )
                      )
                    : i
                        .prepareContent(
                          'the loaded zip file',
                          t,
                          !0,
                          e.optimizedBinaryString,
                          e.base64
                        )
                        .then(function (t) {
                          var r = new a(e);
                          return r.load(t), r;
                        })
                        .then(function (t) {
                          var r = [s.Promise.resolve(t)],
                            i = t.files;
                          if (e.checkCRC32)
                            for (var n = 0; n < i.length; n++) r.push(l(i[n]));
                          return s.Promise.all(r);
                        })
                        .then(function (t) {
                          for (
                            var i = t.shift(), s = i.files, n = 0;
                            n < s.length;
                            n++
                          ) {
                            var a = s[n];
                            r.file(a.fileNameStr, a.decompressed, {
                              binary: !0,
                              optimizedBinaryString: !0,
                              date: a.date,
                              dir: a.dir,
                              comment: a.fileCommentStr.length
                                ? a.fileCommentStr
                                : null,
                              unixPermissions: a.unixPermissions,
                              dosPermissions: a.dosPermissions,
                              createFolders: e.createFolders,
                            });
                          }
                          return (
                            i.zipComment.length && (r.comment = i.zipComment), r
                          );
                        })
                );
              };
            },
            {
              './external': 6,
              './nodejsUtils': 14,
              './stream/Crc32Probe': 25,
              './utf8': 31,
              './utils': 32,
              './zipEntries': 33,
            },
          ],
          12: [
            function (t, e, r) {
              var i = t('../utils'),
                s = t('../stream/GenericWorker');
              function n(t, e) {
                s.call(this, 'Nodejs stream input adapter for ' + t),
                  (this._upstreamEnded = !1),
                  this._bindStream(e);
              }
              i.inherits(n, s),
                (n.prototype._bindStream = function (t) {
                  var e = this;
                  (this._stream = t),
                    t.pause(),
                    t
                      .on('data', function (t) {
                        e.push({ data: t, meta: { percent: 0 } });
                      })
                      .on('error', function (t) {
                        e.isPaused ? (this.generatedError = t) : e.error(t);
                      })
                      .on('end', function () {
                        e.isPaused ? (e._upstreamEnded = !0) : e.end();
                      });
                }),
                (n.prototype.pause = function () {
                  return (
                    !!s.prototype.pause.call(this) && (this._stream.pause(), !0)
                  );
                }),
                (n.prototype.resume = function () {
                  return (
                    !!s.prototype.resume.call(this) &&
                    (this._upstreamEnded ? this.end() : this._stream.resume(),
                    !0)
                  );
                }),
                (e.exports = n);
            },
            { '../stream/GenericWorker': 28, '../utils': 32 },
          ],
          13: [
            function (t, e, r) {
              var i = t('readable-stream').Readable;
              function s(t, e, r) {
                i.call(this, e), (this._helper = t);
                var s = this;
                t.on('data', function (t, e) {
                  s.push(t) || s._helper.pause(), r && r(e);
                })
                  .on('error', function (t) {
                    s.emit('error', t);
                  })
                  .on('end', function () {
                    s.push(null);
                  });
              }
              t('../utils').inherits(s, i),
                (s.prototype._read = function () {
                  this._helper.resume();
                }),
                (e.exports = s);
            },
            { '../utils': 32, 'readable-stream': 16 },
          ],
          14: [
            function (t, e, r) {
              e.exports = {
                isNode: 'undefined' != typeof Buffer,
                newBufferFrom: function (t, e) {
                  if (Buffer.from && Buffer.from !== Uint8Array.from)
                    return Buffer.from(t, e);
                  if ('number' == typeof t)
                    throw new Error('The "data" argument must not be a number');
                  return new Buffer(t, e);
                },
                allocBuffer: function (t) {
                  if (Buffer.alloc) return Buffer.alloc(t);
                  var e = new Buffer(t);
                  return e.fill(0), e;
                },
                isBuffer: function (t) {
                  return Buffer.isBuffer(t);
                },
                isStream: function (t) {
                  return (
                    t &&
                    'function' == typeof t.on &&
                    'function' == typeof t.pause &&
                    'function' == typeof t.resume
                  );
                },
              };
            },
            {},
          ],
          15: [
            function (t, e, r) {
              var i = t('./utf8'),
                s = t('./utils'),
                n = t('./stream/GenericWorker'),
                a = t('./stream/StreamHelper'),
                o = t('./defaults'),
                h = t('./compressedObject'),
                l = t('./zipObject'),
                p = t('./generate'),
                c = t('./nodejsUtils'),
                f = t('./nodejs/NodejsStreamInputAdapter'),
                d = function (t, e, r) {
                  var i,
                    a = s.getTypeOf(e),
                    p = s.extend(r || {}, o);
                  (p.date = p.date || new Date()),
                    null !== p.compression &&
                      (p.compression = p.compression.toUpperCase()),
                    'string' == typeof p.unixPermissions &&
                      (p.unixPermissions = parseInt(p.unixPermissions, 8)),
                    p.unixPermissions &&
                      16384 & p.unixPermissions &&
                      (p.dir = !0),
                    p.dosPermissions && 16 & p.dosPermissions && (p.dir = !0),
                    p.dir && (t = m(t)),
                    p.createFolders && (i = u(t)) && y.call(this, i, !0);
                  var d = 'string' === a && !1 === p.binary && !1 === p.base64;
                  (r && void 0 !== r.binary) || (p.binary = !d),
                    ((e instanceof h && 0 === e.uncompressedSize) ||
                      p.dir ||
                      !e ||
                      0 === e.length) &&
                      ((p.base64 = !1),
                      (p.binary = !0),
                      (e = ''),
                      (p.compression = 'STORE'),
                      (a = 'string'));
                  var g = null;
                  g =
                    e instanceof h || e instanceof n
                      ? e
                      : c.isNode && c.isStream(e)
                      ? new f(t, e)
                      : s.prepareContent(
                          t,
                          e,
                          p.binary,
                          p.optimizedBinaryString,
                          p.base64
                        );
                  var v = new l(t, g, p);
                  this.files[t] = v;
                },
                u = function (t) {
                  '/' === t.slice(-1) && (t = t.substring(0, t.length - 1));
                  var e = t.lastIndexOf('/');
                  return e > 0 ? t.substring(0, e) : '';
                },
                m = function (t) {
                  return '/' !== t.slice(-1) && (t += '/'), t;
                },
                y = function (t, e) {
                  return (
                    (e = void 0 !== e ? e : o.createFolders),
                    (t = m(t)),
                    this.files[t] ||
                      d.call(this, t, null, { dir: !0, createFolders: e }),
                    this.files[t]
                  );
                };
              function g(t) {
                return '[object RegExp]' === Object.prototype.toString.call(t);
              }
              var v = {
                load: function () {
                  throw new Error(
                    'This method has been removed in JSZip 3.0, please check the upgrade guide.'
                  );
                },
                forEach: function (t) {
                  var e, r, i;
                  for (e in this.files)
                    this.files.hasOwnProperty(e) &&
                      ((i = this.files[e]),
                      (r = e.slice(this.root.length, e.length)) &&
                        e.slice(0, this.root.length) === this.root &&
                        t(r, i));
                },
                filter: function (t) {
                  var e = [];
                  return (
                    this.forEach(function (r, i) {
                      t(r, i) && e.push(i);
                    }),
                    e
                  );
                },
                file: function (t, e, r) {
                  if (1 === arguments.length) {
                    if (g(t)) {
                      var i = t;
                      return this.filter(function (t, e) {
                        return !e.dir && i.test(t);
                      });
                    }
                    var s = this.files[this.root + t];
                    return s && !s.dir ? s : null;
                  }
                  return (t = this.root + t), d.call(this, t, e, r), this;
                },
                folder: function (t) {
                  if (!t) return this;
                  if (g(t))
                    return this.filter(function (e, r) {
                      return r.dir && t.test(e);
                    });
                  var e = this.root + t,
                    r = y.call(this, e),
                    i = this.clone();
                  return (i.root = r.name), i;
                },
                remove: function (t) {
                  t = this.root + t;
                  var e = this.files[t];
                  if (
                    (e ||
                      ('/' !== t.slice(-1) && (t += '/'), (e = this.files[t])),
                    e && !e.dir)
                  )
                    delete this.files[t];
                  else
                    for (
                      var r = this.filter(function (e, r) {
                          return r.name.slice(0, t.length) === t;
                        }),
                        i = 0;
                      i < r.length;
                      i++
                    )
                      delete this.files[r[i].name];
                  return this;
                },
                generate: function (t) {
                  throw new Error(
                    'This method has been removed in JSZip 3.0, please check the upgrade guide.'
                  );
                },
                generateInternalStream: function (t) {
                  var e,
                    r = {};
                  try {
                    if (
                      (((r = s.extend(t || {}, {
                        streamFiles: !1,
                        compression: 'STORE',
                        compressionOptions: null,
                        type: '',
                        platform: 'DOS',
                        comment: null,
                        mimeType: 'application/zip',
                        encodeFileName: i.utf8encode,
                      })).type = r.type.toLowerCase()),
                      (r.compression = r.compression.toUpperCase()),
                      'binarystring' === r.type && (r.type = 'string'),
                      !r.type)
                    )
                      throw new Error('No output type specified.');
                    s.checkSupport(r.type),
                      ('darwin' !== r.platform &&
                        'freebsd' !== r.platform &&
                        'linux' !== r.platform &&
                        'sunos' !== r.platform) ||
                        (r.platform = 'UNIX'),
                      'win32' === r.platform && (r.platform = 'DOS');
                    var o = r.comment || this.comment || '';
                    e = p.generateWorker(this, r, o);
                  } catch (t) {
                    (e = new n('error')).error(t);
                  }
                  return new a(e, r.type || 'string', r.mimeType);
                },
                generateAsync: function (t, e) {
                  return this.generateInternalStream(t).accumulate(e);
                },
                generateNodeStream: function (t, e) {
                  return (
                    (t = t || {}).type || (t.type = 'nodebuffer'),
                    this.generateInternalStream(t).toNodejsStream(e)
                  );
                },
              };
              e.exports = v;
            },
            {
              './compressedObject': 2,
              './defaults': 5,
              './generate': 9,
              './nodejs/NodejsStreamInputAdapter': 12,
              './nodejsUtils': 14,
              './stream/GenericWorker': 28,
              './stream/StreamHelper': 29,
              './utf8': 31,
              './utils': 32,
              './zipObject': 35,
            },
          ],
          16: [
            function (t, e, r) {
              e.exports = t('stream');
            },
            { stream: void 0 },
          ],
          17: [
            function (t, e, r) {
              var i = t('./DataReader');
              function s(t) {
                i.call(this, t);
                for (var e = 0; e < this.data.length; e++) t[e] = 255 & t[e];
              }
              t('../utils').inherits(s, i),
                (s.prototype.byteAt = function (t) {
                  return this.data[this.zero + t];
                }),
                (s.prototype.lastIndexOfSignature = function (t) {
                  for (
                    var e = t.charCodeAt(0),
                      r = t.charCodeAt(1),
                      i = t.charCodeAt(2),
                      s = t.charCodeAt(3),
                      n = this.length - 4;
                    n >= 0;
                    --n
                  )
                    if (
                      this.data[n] === e &&
                      this.data[n + 1] === r &&
                      this.data[n + 2] === i &&
                      this.data[n + 3] === s
                    )
                      return n - this.zero;
                  return -1;
                }),
                (s.prototype.readAndCheckSignature = function (t) {
                  var e = t.charCodeAt(0),
                    r = t.charCodeAt(1),
                    i = t.charCodeAt(2),
                    s = t.charCodeAt(3),
                    n = this.readData(4);
                  return e === n[0] && r === n[1] && i === n[2] && s === n[3];
                }),
                (s.prototype.readData = function (t) {
                  if ((this.checkOffset(t), 0 === t)) return [];
                  var e = this.data.slice(
                    this.zero + this.index,
                    this.zero + this.index + t
                  );
                  return (this.index += t), e;
                }),
                (e.exports = s);
            },
            { '../utils': 32, './DataReader': 18 },
          ],
          18: [
            function (t, e, r) {
              var i = t('../utils');
              function s(t) {
                (this.data = t),
                  (this.length = t.length),
                  (this.index = 0),
                  (this.zero = 0);
              }
              (s.prototype = {
                checkOffset: function (t) {
                  this.checkIndex(this.index + t);
                },
                checkIndex: function (t) {
                  if (this.length < this.zero + t || t < 0)
                    throw new Error(
                      'End of data reached (data length = ' +
                        this.length +
                        ', asked index = ' +
                        t +
                        '). Corrupted zip ?'
                    );
                },
                setIndex: function (t) {
                  this.checkIndex(t), (this.index = t);
                },
                skip: function (t) {
                  this.setIndex(this.index + t);
                },
                byteAt: function (t) {},
                readInt: function (t) {
                  var e,
                    r = 0;
                  for (
                    this.checkOffset(t), e = this.index + t - 1;
                    e >= this.index;
                    e--
                  )
                    r = (r << 8) + this.byteAt(e);
                  return (this.index += t), r;
                },
                readString: function (t) {
                  return i.transformTo('string', this.readData(t));
                },
                readData: function (t) {},
                lastIndexOfSignature: function (t) {},
                readAndCheckSignature: function (t) {},
                readDate: function () {
                  var t = this.readInt(4);
                  return new Date(
                    Date.UTC(
                      1980 + ((t >> 25) & 127),
                      ((t >> 21) & 15) - 1,
                      (t >> 16) & 31,
                      (t >> 11) & 31,
                      (t >> 5) & 63,
                      (31 & t) << 1
                    )
                  );
                },
              }),
                (e.exports = s);
            },
            { '../utils': 32 },
          ],
          19: [
            function (t, e, r) {
              var i = t('./Uint8ArrayReader');
              function s(t) {
                i.call(this, t);
              }
              t('../utils').inherits(s, i),
                (s.prototype.readData = function (t) {
                  this.checkOffset(t);
                  var e = this.data.slice(
                    this.zero + this.index,
                    this.zero + this.index + t
                  );
                  return (this.index += t), e;
                }),
                (e.exports = s);
            },
            { '../utils': 32, './Uint8ArrayReader': 21 },
          ],
          20: [
            function (t, e, r) {
              var i = t('./DataReader');
              function s(t) {
                i.call(this, t);
              }
              t('../utils').inherits(s, i),
                (s.prototype.byteAt = function (t) {
                  return this.data.charCodeAt(this.zero + t);
                }),
                (s.prototype.lastIndexOfSignature = function (t) {
                  return this.data.lastIndexOf(t) - this.zero;
                }),
                (s.prototype.readAndCheckSignature = function (t) {
                  return t === this.readData(4);
                }),
                (s.prototype.readData = function (t) {
                  this.checkOffset(t);
                  var e = this.data.slice(
                    this.zero + this.index,
                    this.zero + this.index + t
                  );
                  return (this.index += t), e;
                }),
                (e.exports = s);
            },
            { '../utils': 32, './DataReader': 18 },
          ],
          21: [
            function (t, e, r) {
              var i = t('./ArrayReader');
              function s(t) {
                i.call(this, t);
              }
              t('../utils').inherits(s, i),
                (s.prototype.readData = function (t) {
                  if ((this.checkOffset(t), 0 === t)) return new Uint8Array(0);
                  var e = this.data.subarray(
                    this.zero + this.index,
                    this.zero + this.index + t
                  );
                  return (this.index += t), e;
                }),
                (e.exports = s);
            },
            { '../utils': 32, './ArrayReader': 17 },
          ],
          22: [
            function (t, e, r) {
              var i = t('../utils'),
                s = t('../support'),
                n = t('./ArrayReader'),
                a = t('./StringReader'),
                o = t('./NodeBufferReader'),
                h = t('./Uint8ArrayReader');
              e.exports = function (t) {
                var e = i.getTypeOf(t);
                return (
                  i.checkSupport(e),
                  'string' !== e || s.uint8array
                    ? 'nodebuffer' === e
                      ? new o(t)
                      : s.uint8array
                      ? new h(i.transformTo('uint8array', t))
                      : new n(i.transformTo('array', t))
                    : new a(t)
                );
              };
            },
            {
              '../support': 30,
              '../utils': 32,
              './ArrayReader': 17,
              './NodeBufferReader': 19,
              './StringReader': 20,
              './Uint8ArrayReader': 21,
            },
          ],
          23: [
            function (t, e, r) {
              (r.LOCAL_FILE_HEADER = 'PK'),
                (r.CENTRAL_FILE_HEADER = 'PK'),
                (r.CENTRAL_DIRECTORY_END = 'PK'),
                (r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = 'PK'),
                (r.ZIP64_CENTRAL_DIRECTORY_END = 'PK'),
                (r.DATA_DESCRIPTOR = 'PK\b');
            },
            {},
          ],
          24: [
            function (t, e, r) {
              var i = t('./GenericWorker'),
                s = t('../utils');
              function n(t) {
                i.call(this, 'ConvertWorker to ' + t), (this.destType = t);
              }
              s.inherits(n, i),
                (n.prototype.processChunk = function (t) {
                  this.push({
                    data: s.transformTo(this.destType, t.data),
                    meta: t.meta,
                  });
                }),
                (e.exports = n);
            },
            { '../utils': 32, './GenericWorker': 28 },
          ],
          25: [
            function (t, e, r) {
              var i = t('./GenericWorker'),
                s = t('../crc32');
              function n() {
                i.call(this, 'Crc32Probe'), this.withStreamInfo('crc32', 0);
              }
              t('../utils').inherits(n, i),
                (n.prototype.processChunk = function (t) {
                  (this.streamInfo.crc32 = s(
                    t.data,
                    this.streamInfo.crc32 || 0
                  )),
                    this.push(t);
                }),
                (e.exports = n);
            },
            { '../crc32': 4, '../utils': 32, './GenericWorker': 28 },
          ],
          26: [
            function (t, e, r) {
              var i = t('../utils'),
                s = t('./GenericWorker');
              function n(t) {
                s.call(this, 'DataLengthProbe for ' + t),
                  (this.propName = t),
                  this.withStreamInfo(t, 0);
              }
              i.inherits(n, s),
                (n.prototype.processChunk = function (t) {
                  if (t) {
                    var e = this.streamInfo[this.propName] || 0;
                    this.streamInfo[this.propName] = e + t.data.length;
                  }
                  s.prototype.processChunk.call(this, t);
                }),
                (e.exports = n);
            },
            { '../utils': 32, './GenericWorker': 28 },
          ],
          27: [
            function (t, e, r) {
              var i = t('../utils'),
                s = t('./GenericWorker');
              function n(t) {
                s.call(this, 'DataWorker');
                var e = this;
                (this.dataIsReady = !1),
                  (this.index = 0),
                  (this.max = 0),
                  (this.data = null),
                  (this.type = ''),
                  (this._tickScheduled = !1),
                  t.then(
                    function (t) {
                      (e.dataIsReady = !0),
                        (e.data = t),
                        (e.max = (t && t.length) || 0),
                        (e.type = i.getTypeOf(t)),
                        e.isPaused || e._tickAndRepeat();
                    },
                    function (t) {
                      e.error(t);
                    }
                  );
              }
              i.inherits(n, s),
                (n.prototype.cleanUp = function () {
                  s.prototype.cleanUp.call(this), (this.data = null);
                }),
                (n.prototype.resume = function () {
                  return (
                    !!s.prototype.resume.call(this) &&
                    (!this._tickScheduled &&
                      this.dataIsReady &&
                      ((this._tickScheduled = !0),
                      i.delay(this._tickAndRepeat, [], this)),
                    !0)
                  );
                }),
                (n.prototype._tickAndRepeat = function () {
                  (this._tickScheduled = !1),
                    this.isPaused ||
                      this.isFinished ||
                      (this._tick(),
                      this.isFinished ||
                        (i.delay(this._tickAndRepeat, [], this),
                        (this._tickScheduled = !0)));
                }),
                (n.prototype._tick = function () {
                  if (this.isPaused || this.isFinished) return !1;
                  var t = null,
                    e = Math.min(this.max, this.index + 16384);
                  if (this.index >= this.max) return this.end();
                  switch (this.type) {
                    case 'string':
                      t = this.data.substring(this.index, e);
                      break;
                    case 'uint8array':
                      t = this.data.subarray(this.index, e);
                      break;
                    case 'array':
                    case 'nodebuffer':
                      t = this.data.slice(this.index, e);
                  }
                  return (
                    (this.index = e),
                    this.push({
                      data: t,
                      meta: {
                        percent: this.max ? (this.index / this.max) * 100 : 0,
                      },
                    })
                  );
                }),
                (e.exports = n);
            },
            { '../utils': 32, './GenericWorker': 28 },
          ],
          28: [
            function (t, e, r) {
              function i(t) {
                (this.name = t || 'default'),
                  (this.streamInfo = {}),
                  (this.generatedError = null),
                  (this.extraStreamInfo = {}),
                  (this.isPaused = !0),
                  (this.isFinished = !1),
                  (this.isLocked = !1),
                  (this._listeners = { data: [], end: [], error: [] }),
                  (this.previous = null);
              }
              (i.prototype = {
                push: function (t) {
                  this.emit('data', t);
                },
                end: function () {
                  if (this.isFinished) return !1;
                  this.flush();
                  try {
                    this.emit('end'), this.cleanUp(), (this.isFinished = !0);
                  } catch (t) {
                    this.emit('error', t);
                  }
                  return !0;
                },
                error: function (t) {
                  return (
                    !this.isFinished &&
                    (this.isPaused
                      ? (this.generatedError = t)
                      : ((this.isFinished = !0),
                        this.emit('error', t),
                        this.previous && this.previous.error(t),
                        this.cleanUp()),
                    !0)
                  );
                },
                on: function (t, e) {
                  return this._listeners[t].push(e), this;
                },
                cleanUp: function () {
                  (this.streamInfo =
                    this.generatedError =
                    this.extraStreamInfo =
                      null),
                    (this._listeners = []);
                },
                emit: function (t, e) {
                  if (this._listeners[t])
                    for (var r = 0; r < this._listeners[t].length; r++)
                      this._listeners[t][r].call(this, e);
                },
                pipe: function (t) {
                  return t.registerPrevious(this);
                },
                registerPrevious: function (t) {
                  if (this.isLocked)
                    throw new Error(
                      "The stream '" + this + "' has already been used."
                    );
                  (this.streamInfo = t.streamInfo),
                    this.mergeStreamInfo(),
                    (this.previous = t);
                  var e = this;
                  return (
                    t.on('data', function (t) {
                      e.processChunk(t);
                    }),
                    t.on('end', function () {
                      e.end();
                    }),
                    t.on('error', function (t) {
                      e.error(t);
                    }),
                    this
                  );
                },
                pause: function () {
                  return (
                    !this.isPaused &&
                    !this.isFinished &&
                    ((this.isPaused = !0),
                    this.previous && this.previous.pause(),
                    !0)
                  );
                },
                resume: function () {
                  if (!this.isPaused || this.isFinished) return !1;
                  this.isPaused = !1;
                  var t = !1;
                  return (
                    this.generatedError &&
                      (this.error(this.generatedError), (t = !0)),
                    this.previous && this.previous.resume(),
                    !t
                  );
                },
                flush: function () {},
                processChunk: function (t) {
                  this.push(t);
                },
                withStreamInfo: function (t, e) {
                  return (
                    (this.extraStreamInfo[t] = e), this.mergeStreamInfo(), this
                  );
                },
                mergeStreamInfo: function () {
                  for (var t in this.extraStreamInfo)
                    this.extraStreamInfo.hasOwnProperty(t) &&
                      (this.streamInfo[t] = this.extraStreamInfo[t]);
                },
                lock: function () {
                  if (this.isLocked)
                    throw new Error(
                      "The stream '" + this + "' has already been used."
                    );
                  (this.isLocked = !0), this.previous && this.previous.lock();
                },
                toString: function () {
                  var t = 'Worker ' + this.name;
                  return this.previous ? this.previous + ' -> ' + t : t;
                },
              }),
                (e.exports = i);
            },
            {},
          ],
          29: [
            function (t, e, r) {
              var i = t('../utils'),
                s = t('./ConvertWorker'),
                n = t('./GenericWorker'),
                a = t('../base64'),
                o = t('../support'),
                h = t('../external'),
                l = null;
              if (o.nodestream)
                try {
                  l = t('../nodejs/NodejsStreamOutputAdapter');
                } catch (t) {}
              function p(t, e) {
                return new h.Promise(function (r, s) {
                  var n = [],
                    o = t._internalType,
                    h = t._outputType,
                    l = t._mimeType;
                  t.on('data', function (t, r) {
                    n.push(t), e && e(r);
                  })
                    .on('error', function (t) {
                      (n = []), s(t);
                    })
                    .on('end', function () {
                      try {
                        var t = (function (t, e, r) {
                          switch (t) {
                            case 'blob':
                              return i.newBlob(
                                i.transformTo('arraybuffer', e),
                                r
                              );
                            case 'base64':
                              return a.encode(e);
                            default:
                              return i.transformTo(t, e);
                          }
                        })(
                          h,
                          (function (t, e) {
                            var r,
                              i = 0,
                              s = null,
                              n = 0;
                            for (r = 0; r < e.length; r++) n += e[r].length;
                            switch (t) {
                              case 'string':
                                return e.join('');
                              case 'array':
                                return Array.prototype.concat.apply([], e);
                              case 'uint8array':
                                for (
                                  s = new Uint8Array(n), r = 0;
                                  r < e.length;
                                  r++
                                )
                                  s.set(e[r], i), (i += e[r].length);
                                return s;
                              case 'nodebuffer':
                                return Buffer.concat(e);
                              default:
                                throw new Error(
                                  "concat : unsupported type '" + t + "'"
                                );
                            }
                          })(o, n),
                          l
                        );
                        r(t);
                      } catch (t) {
                        s(t);
                      }
                      n = [];
                    })
                    .resume();
                });
              }
              function c(t, e, r) {
                var a = e;
                switch (e) {
                  case 'blob':
                  case 'arraybuffer':
                    a = 'uint8array';
                    break;
                  case 'base64':
                    a = 'string';
                }
                try {
                  (this._internalType = a),
                    (this._outputType = e),
                    (this._mimeType = r),
                    i.checkSupport(a),
                    (this._worker = t.pipe(new s(a))),
                    t.lock();
                } catch (t) {
                  (this._worker = new n('error')), this._worker.error(t);
                }
              }
              (c.prototype = {
                accumulate: function (t) {
                  return p(this, t);
                },
                on: function (t, e) {
                  var r = this;
                  return (
                    'data' === t
                      ? this._worker.on(t, function (t) {
                          e.call(r, t.data, t.meta);
                        })
                      : this._worker.on(t, function () {
                          i.delay(e, arguments, r);
                        }),
                    this
                  );
                },
                resume: function () {
                  return i.delay(this._worker.resume, [], this._worker), this;
                },
                pause: function () {
                  return this._worker.pause(), this;
                },
                toNodejsStream: function (t) {
                  if (
                    (i.checkSupport('nodestream'),
                    'nodebuffer' !== this._outputType)
                  )
                    throw new Error(
                      this._outputType + ' is not supported by this method'
                    );
                  return new l(
                    this,
                    { objectMode: 'nodebuffer' !== this._outputType },
                    t
                  );
                },
              }),
                (e.exports = c);
            },
            {
              '../base64': 1,
              '../external': 6,
              '../nodejs/NodejsStreamOutputAdapter': 13,
              '../support': 30,
              '../utils': 32,
              './ConvertWorker': 24,
              './GenericWorker': 28,
            },
          ],
          30: [
            function (t, e, r) {
              if (
                ((r.base64 = !0),
                (r.array = !0),
                (r.string = !0),
                (r.arraybuffer =
                  'undefined' != typeof ArrayBuffer &&
                  'undefined' != typeof Uint8Array),
                (r.nodebuffer = 'undefined' != typeof Buffer),
                (r.uint8array = 'undefined' != typeof Uint8Array),
                'undefined' == typeof ArrayBuffer)
              )
                r.blob = !1;
              else {
                var i = new ArrayBuffer(0);
                try {
                  r.blob =
                    0 === new Blob([i], { type: 'application/zip' }).size;
                } catch (t) {
                  try {
                    var s = new (self.BlobBuilder ||
                      self.WebKitBlobBuilder ||
                      self.MozBlobBuilder ||
                      self.MSBlobBuilder)();
                    s.append(i),
                      (r.blob = 0 === s.getBlob('application/zip').size);
                  } catch (t) {
                    r.blob = !1;
                  }
                }
              }
              try {
                r.nodestream = !!t('readable-stream').Readable;
              } catch (t) {
                r.nodestream = !1;
              }
            },
            { 'readable-stream': 16 },
          ],
          31: [
            function (t, e, r) {
              for (
                var i = t('./utils'),
                  s = t('./support'),
                  n = t('./nodejsUtils'),
                  a = t('./stream/GenericWorker'),
                  o = new Array(256),
                  h = 0;
                h < 256;
                h++
              )
                o[h] =
                  h >= 252
                    ? 6
                    : h >= 248
                    ? 5
                    : h >= 240
                    ? 4
                    : h >= 224
                    ? 3
                    : h >= 192
                    ? 2
                    : 1;
              function l() {
                a.call(this, 'utf-8 decode'), (this.leftOver = null);
              }
              function p() {
                a.call(this, 'utf-8 encode');
              }
              (o[254] = o[254] = 1),
                (r.utf8encode = function (t) {
                  return s.nodebuffer
                    ? n.newBufferFrom(t, 'utf-8')
                    : (function (t) {
                        var e,
                          r,
                          i,
                          n,
                          a,
                          o = t.length,
                          h = 0;
                        for (n = 0; n < o; n++)
                          55296 == (64512 & (r = t.charCodeAt(n))) &&
                            n + 1 < o &&
                            56320 == (64512 & (i = t.charCodeAt(n + 1))) &&
                            ((r = 65536 + ((r - 55296) << 10) + (i - 56320)),
                            n++),
                            (h +=
                              r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4);
                        for (
                          e = s.uint8array ? new Uint8Array(h) : new Array(h),
                            a = 0,
                            n = 0;
                          a < h;
                          n++
                        )
                          55296 == (64512 & (r = t.charCodeAt(n))) &&
                            n + 1 < o &&
                            56320 == (64512 & (i = t.charCodeAt(n + 1))) &&
                            ((r = 65536 + ((r - 55296) << 10) + (i - 56320)),
                            n++),
                            r < 128
                              ? (e[a++] = r)
                              : r < 2048
                              ? ((e[a++] = 192 | (r >>> 6)),
                                (e[a++] = 128 | (63 & r)))
                              : r < 65536
                              ? ((e[a++] = 224 | (r >>> 12)),
                                (e[a++] = 128 | ((r >>> 6) & 63)),
                                (e[a++] = 128 | (63 & r)))
                              : ((e[a++] = 240 | (r >>> 18)),
                                (e[a++] = 128 | ((r >>> 12) & 63)),
                                (e[a++] = 128 | ((r >>> 6) & 63)),
                                (e[a++] = 128 | (63 & r)));
                        return e;
                      })(t);
                }),
                (r.utf8decode = function (t) {
                  return s.nodebuffer
                    ? i.transformTo('nodebuffer', t).toString('utf-8')
                    : (function (t) {
                        var e,
                          r,
                          s,
                          n,
                          a = t.length,
                          h = new Array(2 * a);
                        for (r = 0, e = 0; e < a; )
                          if ((s = t[e++]) < 128) h[r++] = s;
                          else if ((n = o[s]) > 4)
                            (h[r++] = 65533), (e += n - 1);
                          else {
                            for (
                              s &= 2 === n ? 31 : 3 === n ? 15 : 7;
                              n > 1 && e < a;

                            )
                              (s = (s << 6) | (63 & t[e++])), n--;
                            n > 1
                              ? (h[r++] = 65533)
                              : s < 65536
                              ? (h[r++] = s)
                              : ((s -= 65536),
                                (h[r++] = 55296 | ((s >> 10) & 1023)),
                                (h[r++] = 56320 | (1023 & s)));
                          }
                        return (
                          h.length !== r &&
                            (h.subarray
                              ? (h = h.subarray(0, r))
                              : (h.length = r)),
                          i.applyFromCharCode(h)
                        );
                      })(
                        (t = i.transformTo(
                          s.uint8array ? 'uint8array' : 'array',
                          t
                        ))
                      );
                }),
                i.inherits(l, a),
                (l.prototype.processChunk = function (t) {
                  var e = i.transformTo(
                    s.uint8array ? 'uint8array' : 'array',
                    t.data
                  );
                  if (this.leftOver && this.leftOver.length) {
                    if (s.uint8array) {
                      var n = e;
                      (e = new Uint8Array(n.length + this.leftOver.length)).set(
                        this.leftOver,
                        0
                      ),
                        e.set(n, this.leftOver.length);
                    } else e = this.leftOver.concat(e);
                    this.leftOver = null;
                  }
                  var a = (function (t, e) {
                      var r;
                      for (
                        (e = e || t.length) > t.length && (e = t.length),
                          r = e - 1;
                        r >= 0 && 128 == (192 & t[r]);

                      )
                        r--;
                      return r < 0 || 0 === r ? e : r + o[t[r]] > e ? r : e;
                    })(e),
                    h = e;
                  a !== e.length &&
                    (s.uint8array
                      ? ((h = e.subarray(0, a)),
                        (this.leftOver = e.subarray(a, e.length)))
                      : ((h = e.slice(0, a)),
                        (this.leftOver = e.slice(a, e.length)))),
                    this.push({ data: r.utf8decode(h), meta: t.meta });
                }),
                (l.prototype.flush = function () {
                  this.leftOver &&
                    this.leftOver.length &&
                    (this.push({ data: r.utf8decode(this.leftOver), meta: {} }),
                    (this.leftOver = null));
                }),
                (r.Utf8DecodeWorker = l),
                i.inherits(p, a),
                (p.prototype.processChunk = function (t) {
                  this.push({ data: r.utf8encode(t.data), meta: t.meta });
                }),
                (r.Utf8EncodeWorker = p);
            },
            {
              './nodejsUtils': 14,
              './stream/GenericWorker': 28,
              './support': 30,
              './utils': 32,
            },
          ],
          32: [
            function (t, e, r) {
              var i = t('./support'),
                s = t('./base64'),
                n = t('./nodejsUtils'),
                a = t('set-immediate-shim'),
                o = t('./external');
              function h(t) {
                return t;
              }
              function l(t, e) {
                for (var r = 0; r < t.length; ++r) e[r] = 255 & t.charCodeAt(r);
                return e;
              }
              r.newBlob = function (t, e) {
                r.checkSupport('blob');
                try {
                  return new Blob([t], { type: e });
                } catch (r) {
                  try {
                    var i = new (self.BlobBuilder ||
                      self.WebKitBlobBuilder ||
                      self.MozBlobBuilder ||
                      self.MSBlobBuilder)();
                    return i.append(t), i.getBlob(e);
                  } catch (t) {
                    throw new Error("Bug : can't construct the Blob.");
                  }
                }
              };
              var p = {
                stringifyByChunk: function (t, e, r) {
                  var i = [],
                    s = 0,
                    n = t.length;
                  if (n <= r) return String.fromCharCode.apply(null, t);
                  for (; s < n; )
                    'array' === e || 'nodebuffer' === e
                      ? i.push(
                          String.fromCharCode.apply(
                            null,
                            t.slice(s, Math.min(s + r, n))
                          )
                        )
                      : i.push(
                          String.fromCharCode.apply(
                            null,
                            t.subarray(s, Math.min(s + r, n))
                          )
                        ),
                      (s += r);
                  return i.join('');
                },
                stringifyByChar: function (t) {
                  for (var e = '', r = 0; r < t.length; r++)
                    e += String.fromCharCode(t[r]);
                  return e;
                },
                applyCanBeUsed: {
                  uint8array: (function () {
                    try {
                      return (
                        i.uint8array &&
                        1 ===
                          String.fromCharCode.apply(null, new Uint8Array(1))
                            .length
                      );
                    } catch (t) {
                      return !1;
                    }
                  })(),
                  nodebuffer: (function () {
                    try {
                      return (
                        i.nodebuffer &&
                        1 ===
                          String.fromCharCode.apply(null, n.allocBuffer(1))
                            .length
                      );
                    } catch (t) {
                      return !1;
                    }
                  })(),
                },
              };
              function c(t) {
                var e = 65536,
                  i = r.getTypeOf(t),
                  s = !0;
                if (
                  ('uint8array' === i
                    ? (s = p.applyCanBeUsed.uint8array)
                    : 'nodebuffer' === i && (s = p.applyCanBeUsed.nodebuffer),
                  s)
                )
                  for (; e > 1; )
                    try {
                      return p.stringifyByChunk(t, i, e);
                    } catch (t) {
                      e = Math.floor(e / 2);
                    }
                return p.stringifyByChar(t);
              }
              function f(t, e) {
                for (var r = 0; r < t.length; r++) e[r] = t[r];
                return e;
              }
              r.applyFromCharCode = c;
              var d = {};
              (d.string = {
                string: h,
                array: function (t) {
                  return l(t, new Array(t.length));
                },
                arraybuffer: function (t) {
                  return d.string.uint8array(t).buffer;
                },
                uint8array: function (t) {
                  return l(t, new Uint8Array(t.length));
                },
                nodebuffer: function (t) {
                  return l(t, n.allocBuffer(t.length));
                },
              }),
                (d.array = {
                  string: c,
                  array: h,
                  arraybuffer: function (t) {
                    return new Uint8Array(t).buffer;
                  },
                  uint8array: function (t) {
                    return new Uint8Array(t);
                  },
                  nodebuffer: function (t) {
                    return n.newBufferFrom(t);
                  },
                }),
                (d.arraybuffer = {
                  string: function (t) {
                    return c(new Uint8Array(t));
                  },
                  array: function (t) {
                    return f(new Uint8Array(t), new Array(t.byteLength));
                  },
                  arraybuffer: h,
                  uint8array: function (t) {
                    return new Uint8Array(t);
                  },
                  nodebuffer: function (t) {
                    return n.newBufferFrom(new Uint8Array(t));
                  },
                }),
                (d.uint8array = {
                  string: c,
                  array: function (t) {
                    return f(t, new Array(t.length));
                  },
                  arraybuffer: function (t) {
                    return t.buffer;
                  },
                  uint8array: h,
                  nodebuffer: function (t) {
                    return n.newBufferFrom(t);
                  },
                }),
                (d.nodebuffer = {
                  string: c,
                  array: function (t) {
                    return f(t, new Array(t.length));
                  },
                  arraybuffer: function (t) {
                    return d.nodebuffer.uint8array(t).buffer;
                  },
                  uint8array: function (t) {
                    return f(t, new Uint8Array(t.length));
                  },
                  nodebuffer: h,
                }),
                (r.transformTo = function (t, e) {
                  if ((e || (e = ''), !t)) return e;
                  r.checkSupport(t);
                  var i = r.getTypeOf(e);
                  return d[i][t](e);
                }),
                (r.getTypeOf = function (t) {
                  return 'string' == typeof t
                    ? 'string'
                    : '[object Array]' === Object.prototype.toString.call(t)
                    ? 'array'
                    : i.nodebuffer && n.isBuffer(t)
                    ? 'nodebuffer'
                    : i.uint8array && t instanceof Uint8Array
                    ? 'uint8array'
                    : i.arraybuffer && t instanceof ArrayBuffer
                    ? 'arraybuffer'
                    : void 0;
                }),
                (r.checkSupport = function (t) {
                  if (!i[t.toLowerCase()])
                    throw new Error(t + ' is not supported by this platform');
                }),
                (r.MAX_VALUE_16BITS = 65535),
                (r.MAX_VALUE_32BITS = -1),
                (r.pretty = function (t) {
                  var e,
                    r,
                    i = '';
                  for (r = 0; r < (t || '').length; r++)
                    i +=
                      '\\x' +
                      ((e = t.charCodeAt(r)) < 16 ? '0' : '') +
                      e.toString(16).toUpperCase();
                  return i;
                }),
                (r.delay = function (t, e, r) {
                  a(function () {
                    t.apply(r || null, e || []);
                  });
                }),
                (r.inherits = function (t, e) {
                  var r = function () {};
                  (r.prototype = e.prototype), (t.prototype = new r());
                }),
                (r.extend = function () {
                  var t,
                    e,
                    r = {};
                  for (t = 0; t < arguments.length; t++)
                    for (e in arguments[t])
                      arguments[t].hasOwnProperty(e) &&
                        void 0 === r[e] &&
                        (r[e] = arguments[t][e]);
                  return r;
                }),
                (r.prepareContent = function (t, e, n, a, h) {
                  return o.Promise.resolve(e)
                    .then(function (t) {
                      return i.blob &&
                        (t instanceof Blob ||
                          -1 !==
                            ['[object File]', '[object Blob]'].indexOf(
                              Object.prototype.toString.call(t)
                            )) &&
                        'undefined' != typeof FileReader
                        ? new o.Promise(function (e, r) {
                            var i = new FileReader();
                            (i.onload = function (t) {
                              e(t.target.result);
                            }),
                              (i.onerror = function (t) {
                                r(t.target.error);
                              }),
                              i.readAsArrayBuffer(t);
                          })
                        : t;
                    })
                    .then(function (e) {
                      var p,
                        c = r.getTypeOf(e);
                      return c
                        ? ('arraybuffer' === c
                            ? (e = r.transformTo('uint8array', e))
                            : 'string' === c &&
                              (h
                                ? (e = s.decode(e))
                                : n &&
                                  !0 !== a &&
                                  (e = l(
                                    (p = e),
                                    i.uint8array
                                      ? new Uint8Array(p.length)
                                      : new Array(p.length)
                                  ))),
                          e)
                        : o.Promise.reject(
                            new Error(
                              "Can't read the data of '" +
                                t +
                                "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"
                            )
                          );
                    });
                });
            },
            {
              './base64': 1,
              './external': 6,
              './nodejsUtils': 14,
              './support': 30,
              'set-immediate-shim': 54,
            },
          ],
          33: [
            function (t, e, r) {
              var i = t('./reader/readerFor'),
                s = t('./utils'),
                n = t('./signature'),
                a = t('./zipEntry'),
                o = (t('./utf8'), t('./support'));
              function h(t) {
                (this.files = []), (this.loadOptions = t);
              }
              (h.prototype = {
                checkSignature: function (t) {
                  if (!this.reader.readAndCheckSignature(t)) {
                    this.reader.index -= 4;
                    var e = this.reader.readString(4);
                    throw new Error(
                      'Corrupted zip or bug: unexpected signature (' +
                        s.pretty(e) +
                        ', expected ' +
                        s.pretty(t) +
                        ')'
                    );
                  }
                },
                isSignature: function (t, e) {
                  var r = this.reader.index;
                  this.reader.setIndex(t);
                  var i = this.reader.readString(4) === e;
                  return this.reader.setIndex(r), i;
                },
                readBlockEndOfCentral: function () {
                  (this.diskNumber = this.reader.readInt(2)),
                    (this.diskWithCentralDirStart = this.reader.readInt(2)),
                    (this.centralDirRecordsOnThisDisk = this.reader.readInt(2)),
                    (this.centralDirRecords = this.reader.readInt(2)),
                    (this.centralDirSize = this.reader.readInt(4)),
                    (this.centralDirOffset = this.reader.readInt(4)),
                    (this.zipCommentLength = this.reader.readInt(2));
                  var t = this.reader.readData(this.zipCommentLength),
                    e = o.uint8array ? 'uint8array' : 'array',
                    r = s.transformTo(e, t);
                  this.zipComment = this.loadOptions.decodeFileName(r);
                },
                readBlockZip64EndOfCentral: function () {
                  (this.zip64EndOfCentralSize = this.reader.readInt(8)),
                    this.reader.skip(4),
                    (this.diskNumber = this.reader.readInt(4)),
                    (this.diskWithCentralDirStart = this.reader.readInt(4)),
                    (this.centralDirRecordsOnThisDisk = this.reader.readInt(8)),
                    (this.centralDirRecords = this.reader.readInt(8)),
                    (this.centralDirSize = this.reader.readInt(8)),
                    (this.centralDirOffset = this.reader.readInt(8)),
                    (this.zip64ExtensibleData = {});
                  for (
                    var t, e, r, i = this.zip64EndOfCentralSize - 44;
                    0 < i;

                  )
                    (t = this.reader.readInt(2)),
                      (e = this.reader.readInt(4)),
                      (r = this.reader.readData(e)),
                      (this.zip64ExtensibleData[t] = {
                        id: t,
                        length: e,
                        value: r,
                      });
                },
                readBlockZip64EndOfCentralLocator: function () {
                  if (
                    ((this.diskWithZip64CentralDirStart =
                      this.reader.readInt(4)),
                    (this.relativeOffsetEndOfZip64CentralDir =
                      this.reader.readInt(8)),
                    (this.disksCount = this.reader.readInt(4)),
                    this.disksCount > 1)
                  )
                    throw new Error('Multi-volumes zip are not supported');
                },
                readLocalFiles: function () {
                  var t, e;
                  for (t = 0; t < this.files.length; t++)
                    (e = this.files[t]),
                      this.reader.setIndex(e.localHeaderOffset),
                      this.checkSignature(n.LOCAL_FILE_HEADER),
                      e.readLocalPart(this.reader),
                      e.handleUTF8(),
                      e.processAttributes();
                },
                readCentralDir: function () {
                  var t;
                  for (
                    this.reader.setIndex(this.centralDirOffset);
                    this.reader.readAndCheckSignature(n.CENTRAL_FILE_HEADER);

                  )
                    (t = new a(
                      { zip64: this.zip64 },
                      this.loadOptions
                    )).readCentralPart(this.reader),
                      this.files.push(t);
                  if (
                    this.centralDirRecords !== this.files.length &&
                    0 !== this.centralDirRecords &&
                    0 === this.files.length
                  )
                    throw new Error(
                      'Corrupted zip or bug: expected ' +
                        this.centralDirRecords +
                        ' records in central dir, got ' +
                        this.files.length
                    );
                },
                readEndOfCentral: function () {
                  var t = this.reader.lastIndexOfSignature(
                    n.CENTRAL_DIRECTORY_END
                  );
                  if (t < 0)
                    throw this.isSignature(0, n.LOCAL_FILE_HEADER)
                      ? new Error(
                          "Corrupted zip: can't find end of central directory"
                        )
                      : new Error(
                          "Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html"
                        );
                  this.reader.setIndex(t);
                  var e = t;
                  if (
                    (this.checkSignature(n.CENTRAL_DIRECTORY_END),
                    this.readBlockEndOfCentral(),
                    this.diskNumber === s.MAX_VALUE_16BITS ||
                      this.diskWithCentralDirStart === s.MAX_VALUE_16BITS ||
                      this.centralDirRecordsOnThisDisk === s.MAX_VALUE_16BITS ||
                      this.centralDirRecords === s.MAX_VALUE_16BITS ||
                      this.centralDirSize === s.MAX_VALUE_32BITS ||
                      this.centralDirOffset === s.MAX_VALUE_32BITS)
                  ) {
                    if (
                      ((this.zip64 = !0),
                      (t = this.reader.lastIndexOfSignature(
                        n.ZIP64_CENTRAL_DIRECTORY_LOCATOR
                      )) < 0)
                    )
                      throw new Error(
                        "Corrupted zip: can't find the ZIP64 end of central directory locator"
                      );
                    if (
                      (this.reader.setIndex(t),
                      this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_LOCATOR),
                      this.readBlockZip64EndOfCentralLocator(),
                      !this.isSignature(
                        this.relativeOffsetEndOfZip64CentralDir,
                        n.ZIP64_CENTRAL_DIRECTORY_END
                      ) &&
                        ((this.relativeOffsetEndOfZip64CentralDir =
                          this.reader.lastIndexOfSignature(
                            n.ZIP64_CENTRAL_DIRECTORY_END
                          )),
                        this.relativeOffsetEndOfZip64CentralDir < 0))
                    )
                      throw new Error(
                        "Corrupted zip: can't find the ZIP64 end of central directory"
                      );
                    this.reader.setIndex(
                      this.relativeOffsetEndOfZip64CentralDir
                    ),
                      this.checkSignature(n.ZIP64_CENTRAL_DIRECTORY_END),
                      this.readBlockZip64EndOfCentral();
                  }
                  var r = this.centralDirOffset + this.centralDirSize;
                  this.zip64 &&
                    ((r += 20), (r += 12 + this.zip64EndOfCentralSize));
                  var i = e - r;
                  if (i > 0)
                    this.isSignature(e, n.CENTRAL_FILE_HEADER) ||
                      (this.reader.zero = i);
                  else if (i < 0)
                    throw new Error(
                      'Corrupted zip: missing ' + Math.abs(i) + ' bytes.'
                    );
                },
                prepareReader: function (t) {
                  this.reader = i(t);
                },
                load: function (t) {
                  this.prepareReader(t),
                    this.readEndOfCentral(),
                    this.readCentralDir(),
                    this.readLocalFiles();
                },
              }),
                (e.exports = h);
            },
            {
              './reader/readerFor': 22,
              './signature': 23,
              './support': 30,
              './utf8': 31,
              './utils': 32,
              './zipEntry': 34,
            },
          ],
          34: [
            function (t, e, r) {
              var i = t('./reader/readerFor'),
                s = t('./utils'),
                n = t('./compressedObject'),
                a = t('./crc32'),
                o = t('./utf8'),
                h = t('./compressions'),
                l = t('./support');
              function p(t, e) {
                (this.options = t), (this.loadOptions = e);
              }
              (p.prototype = {
                isEncrypted: function () {
                  return 1 == (1 & this.bitFlag);
                },
                useUTF8: function () {
                  return 2048 == (2048 & this.bitFlag);
                },
                readLocalPart: function (t) {
                  var e, r;
                  if (
                    (t.skip(22),
                    (this.fileNameLength = t.readInt(2)),
                    (r = t.readInt(2)),
                    (this.fileName = t.readData(this.fileNameLength)),
                    t.skip(r),
                    -1 === this.compressedSize || -1 === this.uncompressedSize)
                  )
                    throw new Error(
                      "Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)"
                    );
                  if (
                    null ===
                    (e = (function (t) {
                      for (var e in h)
                        if (h.hasOwnProperty(e) && h[e].magic === t)
                          return h[e];
                      return null;
                    })(this.compressionMethod))
                  )
                    throw new Error(
                      'Corrupted zip : compression ' +
                        s.pretty(this.compressionMethod) +
                        ' unknown (inner file : ' +
                        s.transformTo('string', this.fileName) +
                        ')'
                    );
                  this.decompressed = new n(
                    this.compressedSize,
                    this.uncompressedSize,
                    this.crc32,
                    e,
                    t.readData(this.compressedSize)
                  );
                },
                readCentralPart: function (t) {
                  (this.versionMadeBy = t.readInt(2)),
                    t.skip(2),
                    (this.bitFlag = t.readInt(2)),
                    (this.compressionMethod = t.readString(2)),
                    (this.date = t.readDate()),
                    (this.crc32 = t.readInt(4)),
                    (this.compressedSize = t.readInt(4)),
                    (this.uncompressedSize = t.readInt(4));
                  var e = t.readInt(2);
                  if (
                    ((this.extraFieldsLength = t.readInt(2)),
                    (this.fileCommentLength = t.readInt(2)),
                    (this.diskNumberStart = t.readInt(2)),
                    (this.internalFileAttributes = t.readInt(2)),
                    (this.externalFileAttributes = t.readInt(4)),
                    (this.localHeaderOffset = t.readInt(4)),
                    this.isEncrypted())
                  )
                    throw new Error('Encrypted zip are not supported');
                  t.skip(e),
                    this.readExtraFields(t),
                    this.parseZIP64ExtraField(t),
                    (this.fileComment = t.readData(this.fileCommentLength));
                },
                processAttributes: function () {
                  (this.unixPermissions = null), (this.dosPermissions = null);
                  var t = this.versionMadeBy >> 8;
                  (this.dir = !!(16 & this.externalFileAttributes)),
                    0 === t &&
                      (this.dosPermissions = 63 & this.externalFileAttributes),
                    3 === t &&
                      (this.unixPermissions =
                        (this.externalFileAttributes >> 16) & 65535),
                    this.dir ||
                      '/' !== this.fileNameStr.slice(-1) ||
                      (this.dir = !0);
                },
                parseZIP64ExtraField: function (t) {
                  if (this.extraFields[1]) {
                    var e = i(this.extraFields[1].value);
                    this.uncompressedSize === s.MAX_VALUE_32BITS &&
                      (this.uncompressedSize = e.readInt(8)),
                      this.compressedSize === s.MAX_VALUE_32BITS &&
                        (this.compressedSize = e.readInt(8)),
                      this.localHeaderOffset === s.MAX_VALUE_32BITS &&
                        (this.localHeaderOffset = e.readInt(8)),
                      this.diskNumberStart === s.MAX_VALUE_32BITS &&
                        (this.diskNumberStart = e.readInt(4));
                  }
                },
                readExtraFields: function (t) {
                  var e,
                    r,
                    i,
                    s = t.index + this.extraFieldsLength;
                  for (
                    this.extraFields || (this.extraFields = {});
                    t.index + 4 < s;

                  )
                    (e = t.readInt(2)),
                      (r = t.readInt(2)),
                      (i = t.readData(r)),
                      (this.extraFields[e] = { id: e, length: r, value: i });
                  t.setIndex(s);
                },
                handleUTF8: function () {
                  var t = l.uint8array ? 'uint8array' : 'array';
                  if (this.useUTF8())
                    (this.fileNameStr = o.utf8decode(this.fileName)),
                      (this.fileCommentStr = o.utf8decode(this.fileComment));
                  else {
                    var e = this.findExtraFieldUnicodePath();
                    if (null !== e) this.fileNameStr = e;
                    else {
                      var r = s.transformTo(t, this.fileName);
                      this.fileNameStr = this.loadOptions.decodeFileName(r);
                    }
                    var i = this.findExtraFieldUnicodeComment();
                    if (null !== i) this.fileCommentStr = i;
                    else {
                      var n = s.transformTo(t, this.fileComment);
                      this.fileCommentStr = this.loadOptions.decodeFileName(n);
                    }
                  }
                },
                findExtraFieldUnicodePath: function () {
                  var t = this.extraFields[28789];
                  if (t) {
                    var e = i(t.value);
                    return 1 !== e.readInt(1) ||
                      a(this.fileName) !== e.readInt(4)
                      ? null
                      : o.utf8decode(e.readData(t.length - 5));
                  }
                  return null;
                },
                findExtraFieldUnicodeComment: function () {
                  var t = this.extraFields[25461];
                  if (t) {
                    var e = i(t.value);
                    return 1 !== e.readInt(1) ||
                      a(this.fileComment) !== e.readInt(4)
                      ? null
                      : o.utf8decode(e.readData(t.length - 5));
                  }
                  return null;
                },
              }),
                (e.exports = p);
            },
            {
              './compressedObject': 2,
              './compressions': 3,
              './crc32': 4,
              './reader/readerFor': 22,
              './support': 30,
              './utf8': 31,
              './utils': 32,
            },
          ],
          35: [
            function (t, e, r) {
              var i = t('./stream/StreamHelper'),
                s = t('./stream/DataWorker'),
                n = t('./utf8'),
                a = t('./compressedObject'),
                o = t('./stream/GenericWorker'),
                h = function (t, e, r) {
                  (this.name = t),
                    (this.dir = r.dir),
                    (this.date = r.date),
                    (this.comment = r.comment),
                    (this.unixPermissions = r.unixPermissions),
                    (this.dosPermissions = r.dosPermissions),
                    (this._data = e),
                    (this._dataBinary = r.binary),
                    (this.options = {
                      compression: r.compression,
                      compressionOptions: r.compressionOptions,
                    });
                };
              h.prototype = {
                internalStream: function (t) {
                  var e = null,
                    r = 'string';
                  try {
                    if (!t) throw new Error('No output type specified.');
                    var s = 'string' === (r = t.toLowerCase()) || 'text' === r;
                    ('binarystring' !== r && 'text' !== r) || (r = 'string'),
                      (e = this._decompressWorker());
                    var a = !this._dataBinary;
                    a && !s && (e = e.pipe(new n.Utf8EncodeWorker())),
                      !a && s && (e = e.pipe(new n.Utf8DecodeWorker()));
                  } catch (t) {
                    (e = new o('error')).error(t);
                  }
                  return new i(e, r, '');
                },
                async: function (t, e) {
                  return this.internalStream(t).accumulate(e);
                },
                nodeStream: function (t, e) {
                  return this.internalStream(t || 'nodebuffer').toNodejsStream(
                    e
                  );
                },
                _compressWorker: function (t, e) {
                  if (
                    this._data instanceof a &&
                    this._data.compression.magic === t.magic
                  )
                    return this._data.getCompressedWorker();
                  var r = this._decompressWorker();
                  return (
                    this._dataBinary || (r = r.pipe(new n.Utf8EncodeWorker())),
                    a.createWorkerFrom(r, t, e)
                  );
                },
                _decompressWorker: function () {
                  return this._data instanceof a
                    ? this._data.getContentWorker()
                    : this._data instanceof o
                    ? this._data
                    : new s(this._data);
                },
              };
              for (
                var l = [
                    'asText',
                    'asBinary',
                    'asNodeBuffer',
                    'asUint8Array',
                    'asArrayBuffer',
                  ],
                  p = function () {
                    throw new Error(
                      'This method has been removed in JSZip 3.0, please check the upgrade guide.'
                    );
                  },
                  c = 0;
                c < l.length;
                c++
              )
                h.prototype[l[c]] = p;
              e.exports = h;
            },
            {
              './compressedObject': 2,
              './stream/DataWorker': 27,
              './stream/GenericWorker': 28,
              './stream/StreamHelper': 29,
              './utf8': 31,
            },
          ],
          36: [
            function (t, e, r) {
              (function (t) {
                var r,
                  i,
                  s = t.MutationObserver || t.WebKitMutationObserver;
                if (s) {
                  var n = 0,
                    a = new s(p),
                    o = t.document.createTextNode('');
                  a.observe(o, { characterData: !0 }),
                    (r = function () {
                      o.data = n = ++n % 2;
                    });
                } else if (t.setImmediate || void 0 === t.MessageChannel)
                  r =
                    'document' in t &&
                    'onreadystatechange' in t.document.createElement('script')
                      ? function () {
                          var e = t.document.createElement('script');
                          (e.onreadystatechange = function () {
                            p(),
                              (e.onreadystatechange = null),
                              e.parentNode.removeChild(e),
                              (e = null);
                          }),
                            t.document.documentElement.appendChild(e);
                        }
                      : function () {
                          setTimeout(p, 0);
                        };
                else {
                  var h = new t.MessageChannel();
                  (h.port1.onmessage = p),
                    (r = function () {
                      h.port2.postMessage(0);
                    });
                }
                var l = [];
                function p() {
                  var t, e;
                  i = !0;
                  for (var r = l.length; r; ) {
                    for (e = l, l = [], t = -1; ++t < r; ) e[t]();
                    r = l.length;
                  }
                  i = !1;
                }
                e.exports = function (t) {
                  1 !== l.push(t) || i || r();
                };
              }).call(
                this,
                void 0 !== commonjsGlobal
                  ? commonjsGlobal
                  : 'undefined' != typeof self
                  ? self
                  : 'undefined' != typeof window
                  ? window
                  : {}
              );
            },
            {},
          ],
          37: [
            function (t, e, r) {
              var i = t('immediate');
              function s() {}
              var n = {},
                a = ['REJECTED'],
                o = ['FULFILLED'],
                h = ['PENDING'];
              function l(t) {
                if ('function' != typeof t)
                  throw new TypeError('resolver must be a function');
                (this.state = h),
                  (this.queue = []),
                  (this.outcome = void 0),
                  t !== s && d(this, t);
              }
              function p(t, e, r) {
                (this.promise = t),
                  'function' == typeof e &&
                    ((this.onFulfilled = e),
                    (this.callFulfilled = this.otherCallFulfilled)),
                  'function' == typeof r &&
                    ((this.onRejected = r),
                    (this.callRejected = this.otherCallRejected));
              }
              function c(t, e, r) {
                i(function () {
                  var i;
                  try {
                    i = e(r);
                  } catch (e) {
                    return n.reject(t, e);
                  }
                  i === t
                    ? n.reject(
                        t,
                        new TypeError('Cannot resolve promise with itself')
                      )
                    : n.resolve(t, i);
                });
              }
              function f(t) {
                var e = t && t.then;
                if (
                  t &&
                  ('object' == typeof t || 'function' == typeof t) &&
                  'function' == typeof e
                )
                  return function () {
                    e.apply(t, arguments);
                  };
              }
              function d(t, e) {
                var r = !1;
                function i(e) {
                  r || ((r = !0), n.reject(t, e));
                }
                function s(e) {
                  r || ((r = !0), n.resolve(t, e));
                }
                var a = u(function () {
                  e(s, i);
                });
                'error' === a.status && i(a.value);
              }
              function u(t, e) {
                var r = {};
                try {
                  (r.value = t(e)), (r.status = 'success');
                } catch (t) {
                  (r.status = 'error'), (r.value = t);
                }
                return r;
              }
              (e.exports = l),
                (l.prototype.finally = function (t) {
                  if ('function' != typeof t) return this;
                  var e = this.constructor;
                  return this.then(
                    function (r) {
                      return e.resolve(t()).then(function () {
                        return r;
                      });
                    },
                    function (r) {
                      return e.resolve(t()).then(function () {
                        throw r;
                      });
                    }
                  );
                }),
                (l.prototype.catch = function (t) {
                  return this.then(null, t);
                }),
                (l.prototype.then = function (t, e) {
                  if (
                    ('function' != typeof t && this.state === o) ||
                    ('function' != typeof e && this.state === a)
                  )
                    return this;
                  var r = new this.constructor(s);
                  return (
                    this.state !== h
                      ? c(r, this.state === o ? t : e, this.outcome)
                      : this.queue.push(new p(r, t, e)),
                    r
                  );
                }),
                (p.prototype.callFulfilled = function (t) {
                  n.resolve(this.promise, t);
                }),
                (p.prototype.otherCallFulfilled = function (t) {
                  c(this.promise, this.onFulfilled, t);
                }),
                (p.prototype.callRejected = function (t) {
                  n.reject(this.promise, t);
                }),
                (p.prototype.otherCallRejected = function (t) {
                  c(this.promise, this.onRejected, t);
                }),
                (n.resolve = function (t, e) {
                  var r = u(f, e);
                  if ('error' === r.status) return n.reject(t, r.value);
                  var i = r.value;
                  if (i) d(t, i);
                  else {
                    (t.state = o), (t.outcome = e);
                    for (var s = -1, a = t.queue.length; ++s < a; )
                      t.queue[s].callFulfilled(e);
                  }
                  return t;
                }),
                (n.reject = function (t, e) {
                  (t.state = a), (t.outcome = e);
                  for (var r = -1, i = t.queue.length; ++r < i; )
                    t.queue[r].callRejected(e);
                  return t;
                }),
                (l.resolve = function (t) {
                  return t instanceof this ? t : n.resolve(new this(s), t);
                }),
                (l.reject = function (t) {
                  var e = new this(s);
                  return n.reject(e, t);
                }),
                (l.all = function (t) {
                  var e = this;
                  if ('[object Array]' !== Object.prototype.toString.call(t))
                    return this.reject(new TypeError('must be an array'));
                  var r = t.length,
                    i = !1;
                  if (!r) return this.resolve([]);
                  for (
                    var a = new Array(r), o = 0, h = -1, l = new this(s);
                    ++h < r;

                  )
                    p(t[h], h);
                  return l;
                  function p(t, s) {
                    e.resolve(t).then(
                      function (t) {
                        (a[s] = t),
                          ++o !== r || i || ((i = !0), n.resolve(l, a));
                      },
                      function (t) {
                        i || ((i = !0), n.reject(l, t));
                      }
                    );
                  }
                }),
                (l.race = function (t) {
                  var e = this;
                  if ('[object Array]' !== Object.prototype.toString.call(t))
                    return this.reject(new TypeError('must be an array'));
                  var r = t.length,
                    i = !1;
                  if (!r) return this.resolve([]);
                  for (var a, o = -1, h = new this(s); ++o < r; )
                    (a = t[o]),
                      e.resolve(a).then(
                        function (t) {
                          i || ((i = !0), n.resolve(h, t));
                        },
                        function (t) {
                          i || ((i = !0), n.reject(h, t));
                        }
                      );
                  return h;
                });
            },
            { immediate: 36 },
          ],
          38: [
            function (t, e, r) {
              var i = {};
              (0, t('./lib/utils/common').assign)(
                i,
                t('./lib/deflate'),
                t('./lib/inflate'),
                t('./lib/zlib/constants')
              ),
                (e.exports = i);
            },
            {
              './lib/deflate': 39,
              './lib/inflate': 40,
              './lib/utils/common': 41,
              './lib/zlib/constants': 44,
            },
          ],
          39: [
            function (t, e, r) {
              var i = t('./zlib/deflate'),
                s = t('./utils/common'),
                n = t('./utils/strings'),
                a = t('./zlib/messages'),
                o = t('./zlib/zstream'),
                h = Object.prototype.toString;
              function l(t) {
                if (!(this instanceof l)) return new l(t);
                this.options = s.assign(
                  {
                    level: -1,
                    method: 8,
                    chunkSize: 16384,
                    windowBits: 15,
                    memLevel: 8,
                    strategy: 0,
                    to: '',
                  },
                  t || {}
                );
                var e = this.options;
                e.raw && e.windowBits > 0
                  ? (e.windowBits = -e.windowBits)
                  : e.gzip &&
                    e.windowBits > 0 &&
                    e.windowBits < 16 &&
                    (e.windowBits += 16),
                  (this.err = 0),
                  (this.msg = ''),
                  (this.ended = !1),
                  (this.chunks = []),
                  (this.strm = new o()),
                  (this.strm.avail_out = 0);
                var r = i.deflateInit2(
                  this.strm,
                  e.level,
                  e.method,
                  e.windowBits,
                  e.memLevel,
                  e.strategy
                );
                if (0 !== r) throw new Error(a[r]);
                if (
                  (e.header && i.deflateSetHeader(this.strm, e.header),
                  e.dictionary)
                ) {
                  var p;
                  if (
                    ((p =
                      'string' == typeof e.dictionary
                        ? n.string2buf(e.dictionary)
                        : '[object ArrayBuffer]' === h.call(e.dictionary)
                        ? new Uint8Array(e.dictionary)
                        : e.dictionary),
                    0 !== (r = i.deflateSetDictionary(this.strm, p)))
                  )
                    throw new Error(a[r]);
                  this._dict_set = !0;
                }
              }
              function p(t, e) {
                var r = new l(e);
                if ((r.push(t, !0), r.err)) throw r.msg || a[r.err];
                return r.result;
              }
              (l.prototype.push = function (t, e) {
                var r,
                  a,
                  o = this.strm,
                  l = this.options.chunkSize;
                if (this.ended) return !1;
                (a = e === ~~e ? e : !0 === e ? 4 : 0),
                  'string' == typeof t
                    ? (o.input = n.string2buf(t))
                    : '[object ArrayBuffer]' === h.call(t)
                    ? (o.input = new Uint8Array(t))
                    : (o.input = t),
                  (o.next_in = 0),
                  (o.avail_in = o.input.length);
                do {
                  if (
                    (0 === o.avail_out &&
                      ((o.output = new s.Buf8(l)),
                      (o.next_out = 0),
                      (o.avail_out = l)),
                    1 !== (r = i.deflate(o, a)) && 0 !== r)
                  )
                    return this.onEnd(r), (this.ended = !0), !1;
                  (0 !== o.avail_out &&
                    (0 !== o.avail_in || (4 !== a && 2 !== a))) ||
                    ('string' === this.options.to
                      ? this.onData(
                          n.buf2binstring(s.shrinkBuf(o.output, o.next_out))
                        )
                      : this.onData(s.shrinkBuf(o.output, o.next_out)));
                } while ((o.avail_in > 0 || 0 === o.avail_out) && 1 !== r);
                return 4 === a
                  ? ((r = i.deflateEnd(this.strm)),
                    this.onEnd(r),
                    (this.ended = !0),
                    0 === r)
                  : 2 !== a || (this.onEnd(0), (o.avail_out = 0), !0);
              }),
                (l.prototype.onData = function (t) {
                  this.chunks.push(t);
                }),
                (l.prototype.onEnd = function (t) {
                  0 === t &&
                    ('string' === this.options.to
                      ? (this.result = this.chunks.join(''))
                      : (this.result = s.flattenChunks(this.chunks))),
                    (this.chunks = []),
                    (this.err = t),
                    (this.msg = this.strm.msg);
                }),
                (r.Deflate = l),
                (r.deflate = p),
                (r.deflateRaw = function (t, e) {
                  return ((e = e || {}).raw = !0), p(t, e);
                }),
                (r.gzip = function (t, e) {
                  return ((e = e || {}).gzip = !0), p(t, e);
                });
            },
            {
              './utils/common': 41,
              './utils/strings': 42,
              './zlib/deflate': 46,
              './zlib/messages': 51,
              './zlib/zstream': 53,
            },
          ],
          40: [
            function (t, e, r) {
              var i = t('./zlib/inflate'),
                s = t('./utils/common'),
                n = t('./utils/strings'),
                a = t('./zlib/constants'),
                o = t('./zlib/messages'),
                h = t('./zlib/zstream'),
                l = t('./zlib/gzheader'),
                p = Object.prototype.toString;
              function c(t) {
                if (!(this instanceof c)) return new c(t);
                this.options = s.assign(
                  { chunkSize: 16384, windowBits: 0, to: '' },
                  t || {}
                );
                var e = this.options;
                e.raw &&
                  e.windowBits >= 0 &&
                  e.windowBits < 16 &&
                  ((e.windowBits = -e.windowBits),
                  0 === e.windowBits && (e.windowBits = -15)),
                  !(e.windowBits >= 0 && e.windowBits < 16) ||
                    (t && t.windowBits) ||
                    (e.windowBits += 32),
                  e.windowBits > 15 &&
                    e.windowBits < 48 &&
                    0 == (15 & e.windowBits) &&
                    (e.windowBits |= 15),
                  (this.err = 0),
                  (this.msg = ''),
                  (this.ended = !1),
                  (this.chunks = []),
                  (this.strm = new h()),
                  (this.strm.avail_out = 0);
                var r = i.inflateInit2(this.strm, e.windowBits);
                if (r !== a.Z_OK) throw new Error(o[r]);
                (this.header = new l()),
                  i.inflateGetHeader(this.strm, this.header);
              }
              function f(t, e) {
                var r = new c(e);
                if ((r.push(t, !0), r.err)) throw r.msg || o[r.err];
                return r.result;
              }
              (c.prototype.push = function (t, e) {
                var r,
                  o,
                  h,
                  l,
                  c,
                  f,
                  d = this.strm,
                  u = this.options.chunkSize,
                  m = this.options.dictionary,
                  y = !1;
                if (this.ended) return !1;
                (o = e === ~~e ? e : !0 === e ? a.Z_FINISH : a.Z_NO_FLUSH),
                  'string' == typeof t
                    ? (d.input = n.binstring2buf(t))
                    : '[object ArrayBuffer]' === p.call(t)
                    ? (d.input = new Uint8Array(t))
                    : (d.input = t),
                  (d.next_in = 0),
                  (d.avail_in = d.input.length);
                do {
                  if (
                    (0 === d.avail_out &&
                      ((d.output = new s.Buf8(u)),
                      (d.next_out = 0),
                      (d.avail_out = u)),
                    (r = i.inflate(d, a.Z_NO_FLUSH)) === a.Z_NEED_DICT &&
                      m &&
                      ((f =
                        'string' == typeof m
                          ? n.string2buf(m)
                          : '[object ArrayBuffer]' === p.call(m)
                          ? new Uint8Array(m)
                          : m),
                      (r = i.inflateSetDictionary(this.strm, f))),
                    r === a.Z_BUF_ERROR && !0 === y && ((r = a.Z_OK), (y = !1)),
                    r !== a.Z_STREAM_END && r !== a.Z_OK)
                  )
                    return this.onEnd(r), (this.ended = !0), !1;
                  d.next_out &&
                    ((0 !== d.avail_out &&
                      r !== a.Z_STREAM_END &&
                      (0 !== d.avail_in ||
                        (o !== a.Z_FINISH && o !== a.Z_SYNC_FLUSH))) ||
                      ('string' === this.options.to
                        ? ((h = n.utf8border(d.output, d.next_out)),
                          (l = d.next_out - h),
                          (c = n.buf2string(d.output, h)),
                          (d.next_out = l),
                          (d.avail_out = u - l),
                          l && s.arraySet(d.output, d.output, h, l, 0),
                          this.onData(c))
                        : this.onData(s.shrinkBuf(d.output, d.next_out)))),
                    0 === d.avail_in && 0 === d.avail_out && (y = !0);
                } while (
                  (d.avail_in > 0 || 0 === d.avail_out) &&
                  r !== a.Z_STREAM_END
                );
                return (
                  r === a.Z_STREAM_END && (o = a.Z_FINISH),
                  o === a.Z_FINISH
                    ? ((r = i.inflateEnd(this.strm)),
                      this.onEnd(r),
                      (this.ended = !0),
                      r === a.Z_OK)
                    : o !== a.Z_SYNC_FLUSH ||
                      (this.onEnd(a.Z_OK), (d.avail_out = 0), !0)
                );
              }),
                (c.prototype.onData = function (t) {
                  this.chunks.push(t);
                }),
                (c.prototype.onEnd = function (t) {
                  t === a.Z_OK &&
                    ('string' === this.options.to
                      ? (this.result = this.chunks.join(''))
                      : (this.result = s.flattenChunks(this.chunks))),
                    (this.chunks = []),
                    (this.err = t),
                    (this.msg = this.strm.msg);
                }),
                (r.Inflate = c),
                (r.inflate = f),
                (r.inflateRaw = function (t, e) {
                  return ((e = e || {}).raw = !0), f(t, e);
                }),
                (r.ungzip = f);
            },
            {
              './utils/common': 41,
              './utils/strings': 42,
              './zlib/constants': 44,
              './zlib/gzheader': 47,
              './zlib/inflate': 49,
              './zlib/messages': 51,
              './zlib/zstream': 53,
            },
          ],
          41: [
            function (t, e, r) {
              var i =
                'undefined' != typeof Uint8Array &&
                'undefined' != typeof Uint16Array &&
                'undefined' != typeof Int32Array;
              (r.assign = function (t) {
                for (
                  var e = Array.prototype.slice.call(arguments, 1);
                  e.length;

                ) {
                  var r = e.shift();
                  if (r) {
                    if ('object' != typeof r)
                      throw new TypeError(r + 'must be non-object');
                    for (var i in r) r.hasOwnProperty(i) && (t[i] = r[i]);
                  }
                }
                return t;
              }),
                (r.shrinkBuf = function (t, e) {
                  return t.length === e
                    ? t
                    : t.subarray
                    ? t.subarray(0, e)
                    : ((t.length = e), t);
                });
              var s = {
                  arraySet: function (t, e, r, i, s) {
                    if (e.subarray && t.subarray)
                      t.set(e.subarray(r, r + i), s);
                    else for (var n = 0; n < i; n++) t[s + n] = e[r + n];
                  },
                  flattenChunks: function (t) {
                    var e, r, i, s, n, a;
                    for (i = 0, e = 0, r = t.length; e < r; e++)
                      i += t[e].length;
                    for (
                      a = new Uint8Array(i), s = 0, e = 0, r = t.length;
                      e < r;
                      e++
                    )
                      (n = t[e]), a.set(n, s), (s += n.length);
                    return a;
                  },
                },
                n = {
                  arraySet: function (t, e, r, i, s) {
                    for (var n = 0; n < i; n++) t[s + n] = e[r + n];
                  },
                  flattenChunks: function (t) {
                    return [].concat.apply([], t);
                  },
                };
              (r.setTyped = function (t) {
                t
                  ? ((r.Buf8 = Uint8Array),
                    (r.Buf16 = Uint16Array),
                    (r.Buf32 = Int32Array),
                    r.assign(r, s))
                  : ((r.Buf8 = Array),
                    (r.Buf16 = Array),
                    (r.Buf32 = Array),
                    r.assign(r, n));
              }),
                r.setTyped(i);
            },
            {},
          ],
          42: [
            function (t, e, r) {
              var i = t('./common'),
                s = !0,
                n = !0;
              try {
                String.fromCharCode.apply(null, [0]);
              } catch (t) {
                s = !1;
              }
              try {
                String.fromCharCode.apply(null, new Uint8Array(1));
              } catch (t) {
                n = !1;
              }
              for (var a = new i.Buf8(256), o = 0; o < 256; o++)
                a[o] =
                  o >= 252
                    ? 6
                    : o >= 248
                    ? 5
                    : o >= 240
                    ? 4
                    : o >= 224
                    ? 3
                    : o >= 192
                    ? 2
                    : 1;
              function h(t, e) {
                if (e < 65537 && ((t.subarray && n) || (!t.subarray && s)))
                  return String.fromCharCode.apply(null, i.shrinkBuf(t, e));
                for (var r = '', a = 0; a < e; a++)
                  r += String.fromCharCode(t[a]);
                return r;
              }
              (a[254] = a[254] = 1),
                (r.string2buf = function (t) {
                  var e,
                    r,
                    s,
                    n,
                    a,
                    o = t.length,
                    h = 0;
                  for (n = 0; n < o; n++)
                    55296 == (64512 & (r = t.charCodeAt(n))) &&
                      n + 1 < o &&
                      56320 == (64512 & (s = t.charCodeAt(n + 1))) &&
                      ((r = 65536 + ((r - 55296) << 10) + (s - 56320)), n++),
                      (h += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4);
                  for (e = new i.Buf8(h), a = 0, n = 0; a < h; n++)
                    55296 == (64512 & (r = t.charCodeAt(n))) &&
                      n + 1 < o &&
                      56320 == (64512 & (s = t.charCodeAt(n + 1))) &&
                      ((r = 65536 + ((r - 55296) << 10) + (s - 56320)), n++),
                      r < 128
                        ? (e[a++] = r)
                        : r < 2048
                        ? ((e[a++] = 192 | (r >>> 6)),
                          (e[a++] = 128 | (63 & r)))
                        : r < 65536
                        ? ((e[a++] = 224 | (r >>> 12)),
                          (e[a++] = 128 | ((r >>> 6) & 63)),
                          (e[a++] = 128 | (63 & r)))
                        : ((e[a++] = 240 | (r >>> 18)),
                          (e[a++] = 128 | ((r >>> 12) & 63)),
                          (e[a++] = 128 | ((r >>> 6) & 63)),
                          (e[a++] = 128 | (63 & r)));
                  return e;
                }),
                (r.buf2binstring = function (t) {
                  return h(t, t.length);
                }),
                (r.binstring2buf = function (t) {
                  for (
                    var e = new i.Buf8(t.length), r = 0, s = e.length;
                    r < s;
                    r++
                  )
                    e[r] = t.charCodeAt(r);
                  return e;
                }),
                (r.buf2string = function (t, e) {
                  var r,
                    i,
                    s,
                    n,
                    o = e || t.length,
                    l = new Array(2 * o);
                  for (i = 0, r = 0; r < o; )
                    if ((s = t[r++]) < 128) l[i++] = s;
                    else if ((n = a[s]) > 4) (l[i++] = 65533), (r += n - 1);
                    else {
                      for (
                        s &= 2 === n ? 31 : 3 === n ? 15 : 7;
                        n > 1 && r < o;

                      )
                        (s = (s << 6) | (63 & t[r++])), n--;
                      n > 1
                        ? (l[i++] = 65533)
                        : s < 65536
                        ? (l[i++] = s)
                        : ((s -= 65536),
                          (l[i++] = 55296 | ((s >> 10) & 1023)),
                          (l[i++] = 56320 | (1023 & s)));
                    }
                  return h(l, i);
                }),
                (r.utf8border = function (t, e) {
                  var r;
                  for (
                    (e = e || t.length) > t.length && (e = t.length), r = e - 1;
                    r >= 0 && 128 == (192 & t[r]);

                  )
                    r--;
                  return r < 0 || 0 === r ? e : r + a[t[r]] > e ? r : e;
                });
            },
            { './common': 41 },
          ],
          43: [
            function (t, e, r) {
              e.exports = function (t, e, r, i) {
                for (
                  var s = (65535 & t) | 0, n = ((t >>> 16) & 65535) | 0, a = 0;
                  0 !== r;

                ) {
                  r -= a = r > 2e3 ? 2e3 : r;
                  do {
                    n = (n + (s = (s + e[i++]) | 0)) | 0;
                  } while (--a);
                  (s %= 65521), (n %= 65521);
                }
                return s | (n << 16) | 0;
              };
            },
            {},
          ],
          44: [
            function (t, e, r) {
              e.exports = {
                Z_NO_FLUSH: 0,
                Z_PARTIAL_FLUSH: 1,
                Z_SYNC_FLUSH: 2,
                Z_FULL_FLUSH: 3,
                Z_FINISH: 4,
                Z_BLOCK: 5,
                Z_TREES: 6,
                Z_OK: 0,
                Z_STREAM_END: 1,
                Z_NEED_DICT: 2,
                Z_ERRNO: -1,
                Z_STREAM_ERROR: -2,
                Z_DATA_ERROR: -3,
                Z_BUF_ERROR: -5,
                Z_NO_COMPRESSION: 0,
                Z_BEST_SPEED: 1,
                Z_BEST_COMPRESSION: 9,
                Z_DEFAULT_COMPRESSION: -1,
                Z_FILTERED: 1,
                Z_HUFFMAN_ONLY: 2,
                Z_RLE: 3,
                Z_FIXED: 4,
                Z_DEFAULT_STRATEGY: 0,
                Z_BINARY: 0,
                Z_TEXT: 1,
                Z_UNKNOWN: 2,
                Z_DEFLATED: 8,
              };
            },
            {},
          ],
          45: [
            function (t, e, r) {
              var i = (function () {
                for (var t, e = [], r = 0; r < 256; r++) {
                  t = r;
                  for (var i = 0; i < 8; i++)
                    t = 1 & t ? 3988292384 ^ (t >>> 1) : t >>> 1;
                  e[r] = t;
                }
                return e;
              })();
              e.exports = function (t, e, r, s) {
                var n = i,
                  a = s + r;
                t ^= -1;
                for (var o = s; o < a; o++) t = (t >>> 8) ^ n[255 & (t ^ e[o])];
                return -1 ^ t;
              };
            },
            {},
          ],
          46: [
            function (t, e, r) {
              var i,
                s = t('../utils/common'),
                n = t('./trees'),
                a = t('./adler32'),
                o = t('./crc32'),
                h = t('./messages');
              function l(t, e) {
                return (t.msg = h[e]), e;
              }
              function p(t) {
                return (t << 1) - (t > 4 ? 9 : 0);
              }
              function c(t) {
                for (var e = t.length; --e >= 0; ) t[e] = 0;
              }
              function f(t) {
                var e = t.state,
                  r = e.pending;
                r > t.avail_out && (r = t.avail_out),
                  0 !== r &&
                    (s.arraySet(
                      t.output,
                      e.pending_buf,
                      e.pending_out,
                      r,
                      t.next_out
                    ),
                    (t.next_out += r),
                    (e.pending_out += r),
                    (t.total_out += r),
                    (t.avail_out -= r),
                    (e.pending -= r),
                    0 === e.pending && (e.pending_out = 0));
              }
              function d(t, e) {
                n._tr_flush_block(
                  t,
                  t.block_start >= 0 ? t.block_start : -1,
                  t.strstart - t.block_start,
                  e
                ),
                  (t.block_start = t.strstart),
                  f(t.strm);
              }
              function u(t, e) {
                t.pending_buf[t.pending++] = e;
              }
              function m(t, e) {
                (t.pending_buf[t.pending++] = (e >>> 8) & 255),
                  (t.pending_buf[t.pending++] = 255 & e);
              }
              function y(t, e) {
                var r,
                  i,
                  s = t.max_chain_length,
                  n = t.strstart,
                  a = t.prev_length,
                  o = t.nice_match,
                  h =
                    t.strstart > t.w_size - 262
                      ? t.strstart - (t.w_size - 262)
                      : 0,
                  l = t.window,
                  p = t.w_mask,
                  c = t.prev,
                  f = t.strstart + 258,
                  d = l[n + a - 1],
                  u = l[n + a];
                t.prev_length >= t.good_match && (s >>= 2),
                  o > t.lookahead && (o = t.lookahead);
                do {
                  if (
                    l[(r = e) + a] === u &&
                    l[r + a - 1] === d &&
                    l[r] === l[n] &&
                    l[++r] === l[n + 1]
                  ) {
                    (n += 2), r++;
                    do {} while (
                      l[++n] === l[++r] &&
                      l[++n] === l[++r] &&
                      l[++n] === l[++r] &&
                      l[++n] === l[++r] &&
                      l[++n] === l[++r] &&
                      l[++n] === l[++r] &&
                      l[++n] === l[++r] &&
                      l[++n] === l[++r] &&
                      n < f
                    );
                    if (((i = 258 - (f - n)), (n = f - 258), i > a)) {
                      if (((t.match_start = e), (a = i), i >= o)) break;
                      (d = l[n + a - 1]), (u = l[n + a]);
                    }
                  }
                } while ((e = c[e & p]) > h && 0 != --s);
                return a <= t.lookahead ? a : t.lookahead;
              }
              function g(t) {
                var e,
                  r,
                  i,
                  n,
                  h,
                  l,
                  p,
                  c,
                  f,
                  d,
                  u = t.w_size;
                do {
                  if (
                    ((n = t.window_size - t.lookahead - t.strstart),
                    t.strstart >= u + (u - 262))
                  ) {
                    s.arraySet(t.window, t.window, u, u, 0),
                      (t.match_start -= u),
                      (t.strstart -= u),
                      (t.block_start -= u),
                      (e = r = t.hash_size);
                    do {
                      (i = t.head[--e]), (t.head[e] = i >= u ? i - u : 0);
                    } while (--r);
                    e = r = u;
                    do {
                      (i = t.prev[--e]), (t.prev[e] = i >= u ? i - u : 0);
                    } while (--r);
                    n += u;
                  }
                  if (0 === t.strm.avail_in) break;
                  if (
                    ((l = t.strm),
                    (p = t.window),
                    (c = t.strstart + t.lookahead),
                    (f = n),
                    (d = void 0),
                    (d = l.avail_in) > f && (d = f),
                    (r =
                      0 === d
                        ? 0
                        : ((l.avail_in -= d),
                          s.arraySet(p, l.input, l.next_in, d, c),
                          1 === l.state.wrap
                            ? (l.adler = a(l.adler, p, d, c))
                            : 2 === l.state.wrap &&
                              (l.adler = o(l.adler, p, d, c)),
                          (l.next_in += d),
                          (l.total_in += d),
                          d)),
                    (t.lookahead += r),
                    t.lookahead + t.insert >= 3)
                  )
                    for (
                      h = t.strstart - t.insert,
                        t.ins_h = t.window[h],
                        t.ins_h =
                          ((t.ins_h << t.hash_shift) ^ t.window[h + 1]) &
                          t.hash_mask;
                      t.insert &&
                      ((t.ins_h =
                        ((t.ins_h << t.hash_shift) ^ t.window[h + 3 - 1]) &
                        t.hash_mask),
                      (t.prev[h & t.w_mask] = t.head[t.ins_h]),
                      (t.head[t.ins_h] = h),
                      h++,
                      t.insert--,
                      !(t.lookahead + t.insert < 3));

                    );
                } while (t.lookahead < 262 && 0 !== t.strm.avail_in);
              }
              function v(t, e) {
                for (var r, i; ; ) {
                  if (t.lookahead < 262) {
                    if ((g(t), t.lookahead < 262 && 0 === e)) return 1;
                    if (0 === t.lookahead) break;
                  }
                  if (
                    ((r = 0),
                    t.lookahead >= 3 &&
                      ((t.ins_h =
                        ((t.ins_h << t.hash_shift) ^
                          t.window[t.strstart + 3 - 1]) &
                        t.hash_mask),
                      (r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
                      (t.head[t.ins_h] = t.strstart)),
                    0 !== r &&
                      t.strstart - r <= t.w_size - 262 &&
                      (t.match_length = y(t, r)),
                    t.match_length >= 3)
                  )
                    if (
                      ((i = n._tr_tally(
                        t,
                        t.strstart - t.match_start,
                        t.match_length - 3
                      )),
                      (t.lookahead -= t.match_length),
                      t.match_length <= t.max_lazy_match && t.lookahead >= 3)
                    ) {
                      t.match_length--;
                      do {
                        t.strstart++,
                          (t.ins_h =
                            ((t.ins_h << t.hash_shift) ^
                              t.window[t.strstart + 3 - 1]) &
                            t.hash_mask),
                          (r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
                          (t.head[t.ins_h] = t.strstart);
                      } while (0 != --t.match_length);
                      t.strstart++;
                    } else
                      (t.strstart += t.match_length),
                        (t.match_length = 0),
                        (t.ins_h = t.window[t.strstart]),
                        (t.ins_h =
                          ((t.ins_h << t.hash_shift) ^
                            t.window[t.strstart + 1]) &
                          t.hash_mask);
                  else
                    (i = n._tr_tally(t, 0, t.window[t.strstart])),
                      t.lookahead--,
                      t.strstart++;
                  if (i && (d(t, !1), 0 === t.strm.avail_out)) return 1;
                }
                return (
                  (t.insert = t.strstart < 2 ? t.strstart : 2),
                  4 === e
                    ? (d(t, !0), 0 === t.strm.avail_out ? 3 : 4)
                    : t.last_lit && (d(t, !1), 0 === t.strm.avail_out)
                    ? 1
                    : 2
                );
              }
              function _(t, e) {
                for (var r, i, s; ; ) {
                  if (t.lookahead < 262) {
                    if ((g(t), t.lookahead < 262 && 0 === e)) return 1;
                    if (0 === t.lookahead) break;
                  }
                  if (
                    ((r = 0),
                    t.lookahead >= 3 &&
                      ((t.ins_h =
                        ((t.ins_h << t.hash_shift) ^
                          t.window[t.strstart + 3 - 1]) &
                        t.hash_mask),
                      (r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
                      (t.head[t.ins_h] = t.strstart)),
                    (t.prev_length = t.match_length),
                    (t.prev_match = t.match_start),
                    (t.match_length = 2),
                    0 !== r &&
                      t.prev_length < t.max_lazy_match &&
                      t.strstart - r <= t.w_size - 262 &&
                      ((t.match_length = y(t, r)),
                      t.match_length <= 5 &&
                        (1 === t.strategy ||
                          (3 === t.match_length &&
                            t.strstart - t.match_start > 4096)) &&
                        (t.match_length = 2)),
                    t.prev_length >= 3 && t.match_length <= t.prev_length)
                  ) {
                    (s = t.strstart + t.lookahead - 3),
                      (i = n._tr_tally(
                        t,
                        t.strstart - 1 - t.prev_match,
                        t.prev_length - 3
                      )),
                      (t.lookahead -= t.prev_length - 1),
                      (t.prev_length -= 2);
                    do {
                      ++t.strstart <= s &&
                        ((t.ins_h =
                          ((t.ins_h << t.hash_shift) ^
                            t.window[t.strstart + 3 - 1]) &
                          t.hash_mask),
                        (r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h]),
                        (t.head[t.ins_h] = t.strstart));
                    } while (0 != --t.prev_length);
                    if (
                      ((t.match_available = 0),
                      (t.match_length = 2),
                      t.strstart++,
                      i && (d(t, !1), 0 === t.strm.avail_out))
                    )
                      return 1;
                  } else if (t.match_available) {
                    if (
                      ((i = n._tr_tally(t, 0, t.window[t.strstart - 1])) &&
                        d(t, !1),
                      t.strstart++,
                      t.lookahead--,
                      0 === t.strm.avail_out)
                    )
                      return 1;
                  } else (t.match_available = 1), t.strstart++, t.lookahead--;
                }
                return (
                  t.match_available &&
                    ((i = n._tr_tally(t, 0, t.window[t.strstart - 1])),
                    (t.match_available = 0)),
                  (t.insert = t.strstart < 2 ? t.strstart : 2),
                  4 === e
                    ? (d(t, !0), 0 === t.strm.avail_out ? 3 : 4)
                    : t.last_lit && (d(t, !1), 0 === t.strm.avail_out)
                    ? 1
                    : 2
                );
              }
              function b(t, e, r, i, s) {
                (this.good_length = t),
                  (this.max_lazy = e),
                  (this.nice_length = r),
                  (this.max_chain = i),
                  (this.func = s);
              }
              function S() {
                (this.strm = null),
                  (this.status = 0),
                  (this.pending_buf = null),
                  (this.pending_buf_size = 0),
                  (this.pending_out = 0),
                  (this.pending = 0),
                  (this.wrap = 0),
                  (this.gzhead = null),
                  (this.gzindex = 0),
                  (this.method = 8),
                  (this.last_flush = -1),
                  (this.w_size = 0),
                  (this.w_bits = 0),
                  (this.w_mask = 0),
                  (this.window = null),
                  (this.window_size = 0),
                  (this.prev = null),
                  (this.head = null),
                  (this.ins_h = 0),
                  (this.hash_size = 0),
                  (this.hash_bits = 0),
                  (this.hash_mask = 0),
                  (this.hash_shift = 0),
                  (this.block_start = 0),
                  (this.match_length = 0),
                  (this.prev_match = 0),
                  (this.match_available = 0),
                  (this.strstart = 0),
                  (this.match_start = 0),
                  (this.lookahead = 0),
                  (this.prev_length = 0),
                  (this.max_chain_length = 0),
                  (this.max_lazy_match = 0),
                  (this.level = 0),
                  (this.strategy = 0),
                  (this.good_match = 0),
                  (this.nice_match = 0),
                  (this.dyn_ltree = new s.Buf16(1146)),
                  (this.dyn_dtree = new s.Buf16(122)),
                  (this.bl_tree = new s.Buf16(78)),
                  c(this.dyn_ltree),
                  c(this.dyn_dtree),
                  c(this.bl_tree),
                  (this.l_desc = null),
                  (this.d_desc = null),
                  (this.bl_desc = null),
                  (this.bl_count = new s.Buf16(16)),
                  (this.heap = new s.Buf16(573)),
                  c(this.heap),
                  (this.heap_len = 0),
                  (this.heap_max = 0),
                  (this.depth = new s.Buf16(573)),
                  c(this.depth),
                  (this.l_buf = 0),
                  (this.lit_bufsize = 0),
                  (this.last_lit = 0),
                  (this.d_buf = 0),
                  (this.opt_len = 0),
                  (this.static_len = 0),
                  (this.matches = 0),
                  (this.insert = 0),
                  (this.bi_buf = 0),
                  (this.bi_valid = 0);
              }
              function P(t) {
                var e;
                return t && t.state
                  ? ((t.total_in = t.total_out = 0),
                    (t.data_type = 2),
                    ((e = t.state).pending = 0),
                    (e.pending_out = 0),
                    e.wrap < 0 && (e.wrap = -e.wrap),
                    (e.status = e.wrap ? 42 : 113),
                    (t.adler = 2 === e.wrap ? 0 : 1),
                    (e.last_flush = 0),
                    n._tr_init(e),
                    0)
                  : l(t, -2);
              }
              function x(t) {
                var e,
                  r = P(t);
                return (
                  0 === r &&
                    (((e = t.state).window_size = 2 * e.w_size),
                    c(e.head),
                    (e.max_lazy_match = i[e.level].max_lazy),
                    (e.good_match = i[e.level].good_length),
                    (e.nice_match = i[e.level].nice_length),
                    (e.max_chain_length = i[e.level].max_chain),
                    (e.strstart = 0),
                    (e.block_start = 0),
                    (e.lookahead = 0),
                    (e.insert = 0),
                    (e.match_length = e.prev_length = 2),
                    (e.match_available = 0),
                    (e.ins_h = 0)),
                  r
                );
              }
              function k(t, e, r, i, n, a) {
                if (!t) return -2;
                var o = 1;
                if (
                  (-1 === e && (e = 6),
                  i < 0 ? ((o = 0), (i = -i)) : i > 15 && ((o = 2), (i -= 16)),
                  n < 1 ||
                    n > 9 ||
                    8 !== r ||
                    i < 8 ||
                    i > 15 ||
                    e < 0 ||
                    e > 9 ||
                    a < 0 ||
                    a > 4)
                )
                  return l(t, -2);
                8 === i && (i = 9);
                var h = new S();
                return (
                  (t.state = h),
                  (h.strm = t),
                  (h.wrap = o),
                  (h.gzhead = null),
                  (h.w_bits = i),
                  (h.w_size = 1 << h.w_bits),
                  (h.w_mask = h.w_size - 1),
                  (h.hash_bits = n + 7),
                  (h.hash_size = 1 << h.hash_bits),
                  (h.hash_mask = h.hash_size - 1),
                  (h.hash_shift = ~~((h.hash_bits + 3 - 1) / 3)),
                  (h.window = new s.Buf8(2 * h.w_size)),
                  (h.head = new s.Buf16(h.hash_size)),
                  (h.prev = new s.Buf16(h.w_size)),
                  (h.lit_bufsize = 1 << (n + 6)),
                  (h.pending_buf_size = 4 * h.lit_bufsize),
                  (h.pending_buf = new s.Buf8(h.pending_buf_size)),
                  (h.d_buf = 1 * h.lit_bufsize),
                  (h.l_buf = 3 * h.lit_bufsize),
                  (h.level = e),
                  (h.strategy = a),
                  (h.method = r),
                  x(t)
                );
              }
              (i = [
                new b(0, 0, 0, 0, function (t, e) {
                  var r = 65535;
                  for (
                    r > t.pending_buf_size - 5 && (r = t.pending_buf_size - 5);
                    ;

                  ) {
                    if (t.lookahead <= 1) {
                      if ((g(t), 0 === t.lookahead && 0 === e)) return 1;
                      if (0 === t.lookahead) break;
                    }
                    (t.strstart += t.lookahead), (t.lookahead = 0);
                    var i = t.block_start + r;
                    if (
                      (0 === t.strstart || t.strstart >= i) &&
                      ((t.lookahead = t.strstart - i),
                      (t.strstart = i),
                      d(t, !1),
                      0 === t.strm.avail_out)
                    )
                      return 1;
                    if (
                      t.strstart - t.block_start >= t.w_size - 262 &&
                      (d(t, !1), 0 === t.strm.avail_out)
                    )
                      return 1;
                  }
                  return (
                    (t.insert = 0),
                    4 === e
                      ? (d(t, !0), 0 === t.strm.avail_out ? 3 : 4)
                      : (t.strstart > t.block_start &&
                          (d(t, !1), t.strm.avail_out),
                        1)
                  );
                }),
                new b(4, 4, 8, 4, v),
                new b(4, 5, 16, 8, v),
                new b(4, 6, 32, 32, v),
                new b(4, 4, 16, 16, _),
                new b(8, 16, 32, 32, _),
                new b(8, 16, 128, 128, _),
                new b(8, 32, 128, 256, _),
                new b(32, 128, 258, 1024, _),
                new b(32, 258, 258, 4096, _),
              ]),
                (r.deflateInit = function (t, e) {
                  return k(t, e, 8, 15, 8, 0);
                }),
                (r.deflateInit2 = k),
                (r.deflateReset = x),
                (r.deflateResetKeep = P),
                (r.deflateSetHeader = function (t, e) {
                  return t && t.state
                    ? 2 !== t.state.wrap
                      ? -2
                      : ((t.state.gzhead = e), 0)
                    : -2;
                }),
                (r.deflate = function (t, e) {
                  var r, s, a, h;
                  if (!t || !t.state || e > 5 || e < 0)
                    return t ? l(t, -2) : -2;
                  if (
                    ((s = t.state),
                    !t.output ||
                      (!t.input && 0 !== t.avail_in) ||
                      (666 === s.status && 4 !== e))
                  )
                    return l(t, 0 === t.avail_out ? -5 : -2);
                  if (
                    ((s.strm = t),
                    (r = s.last_flush),
                    (s.last_flush = e),
                    42 === s.status)
                  )
                    if (2 === s.wrap)
                      (t.adler = 0),
                        u(s, 31),
                        u(s, 139),
                        u(s, 8),
                        s.gzhead
                          ? (u(
                              s,
                              (s.gzhead.text ? 1 : 0) +
                                (s.gzhead.hcrc ? 2 : 0) +
                                (s.gzhead.extra ? 4 : 0) +
                                (s.gzhead.name ? 8 : 0) +
                                (s.gzhead.comment ? 16 : 0)
                            ),
                            u(s, 255 & s.gzhead.time),
                            u(s, (s.gzhead.time >> 8) & 255),
                            u(s, (s.gzhead.time >> 16) & 255),
                            u(s, (s.gzhead.time >> 24) & 255),
                            u(
                              s,
                              9 === s.level
                                ? 2
                                : s.strategy >= 2 || s.level < 2
                                ? 4
                                : 0
                            ),
                            u(s, 255 & s.gzhead.os),
                            s.gzhead.extra &&
                              s.gzhead.extra.length &&
                              (u(s, 255 & s.gzhead.extra.length),
                              u(s, (s.gzhead.extra.length >> 8) & 255)),
                            s.gzhead.hcrc &&
                              (t.adler = o(
                                t.adler,
                                s.pending_buf,
                                s.pending,
                                0
                              )),
                            (s.gzindex = 0),
                            (s.status = 69))
                          : (u(s, 0),
                            u(s, 0),
                            u(s, 0),
                            u(s, 0),
                            u(s, 0),
                            u(
                              s,
                              9 === s.level
                                ? 2
                                : s.strategy >= 2 || s.level < 2
                                ? 4
                                : 0
                            ),
                            u(s, 3),
                            (s.status = 113));
                    else {
                      var y = (8 + ((s.w_bits - 8) << 4)) << 8;
                      (y |=
                        (s.strategy >= 2 || s.level < 2
                          ? 0
                          : s.level < 6
                          ? 1
                          : 6 === s.level
                          ? 2
                          : 3) << 6),
                        0 !== s.strstart && (y |= 32),
                        (y += 31 - (y % 31)),
                        (s.status = 113),
                        m(s, y),
                        0 !== s.strstart &&
                          (m(s, t.adler >>> 16), m(s, 65535 & t.adler)),
                        (t.adler = 1);
                    }
                  if (69 === s.status)
                    if (s.gzhead.extra) {
                      for (
                        a = s.pending;
                        s.gzindex < (65535 & s.gzhead.extra.length) &&
                        (s.pending !== s.pending_buf_size ||
                          (s.gzhead.hcrc &&
                            s.pending > a &&
                            (t.adler = o(
                              t.adler,
                              s.pending_buf,
                              s.pending - a,
                              a
                            )),
                          f(t),
                          (a = s.pending),
                          s.pending !== s.pending_buf_size));

                      )
                        u(s, 255 & s.gzhead.extra[s.gzindex]), s.gzindex++;
                      s.gzhead.hcrc &&
                        s.pending > a &&
                        (t.adler = o(t.adler, s.pending_buf, s.pending - a, a)),
                        s.gzindex === s.gzhead.extra.length &&
                          ((s.gzindex = 0), (s.status = 73));
                    } else s.status = 73;
                  if (73 === s.status)
                    if (s.gzhead.name) {
                      a = s.pending;
                      do {
                        if (
                          s.pending === s.pending_buf_size &&
                          (s.gzhead.hcrc &&
                            s.pending > a &&
                            (t.adler = o(
                              t.adler,
                              s.pending_buf,
                              s.pending - a,
                              a
                            )),
                          f(t),
                          (a = s.pending),
                          s.pending === s.pending_buf_size)
                        ) {
                          h = 1;
                          break;
                        }
                        (h =
                          s.gzindex < s.gzhead.name.length
                            ? 255 & s.gzhead.name.charCodeAt(s.gzindex++)
                            : 0),
                          u(s, h);
                      } while (0 !== h);
                      s.gzhead.hcrc &&
                        s.pending > a &&
                        (t.adler = o(t.adler, s.pending_buf, s.pending - a, a)),
                        0 === h && ((s.gzindex = 0), (s.status = 91));
                    } else s.status = 91;
                  if (91 === s.status)
                    if (s.gzhead.comment) {
                      a = s.pending;
                      do {
                        if (
                          s.pending === s.pending_buf_size &&
                          (s.gzhead.hcrc &&
                            s.pending > a &&
                            (t.adler = o(
                              t.adler,
                              s.pending_buf,
                              s.pending - a,
                              a
                            )),
                          f(t),
                          (a = s.pending),
                          s.pending === s.pending_buf_size)
                        ) {
                          h = 1;
                          break;
                        }
                        (h =
                          s.gzindex < s.gzhead.comment.length
                            ? 255 & s.gzhead.comment.charCodeAt(s.gzindex++)
                            : 0),
                          u(s, h);
                      } while (0 !== h);
                      s.gzhead.hcrc &&
                        s.pending > a &&
                        (t.adler = o(t.adler, s.pending_buf, s.pending - a, a)),
                        0 === h && (s.status = 103);
                    } else s.status = 103;
                  if (
                    (103 === s.status &&
                      (s.gzhead.hcrc
                        ? (s.pending + 2 > s.pending_buf_size && f(t),
                          s.pending + 2 <= s.pending_buf_size &&
                            (u(s, 255 & t.adler),
                            u(s, (t.adler >> 8) & 255),
                            (t.adler = 0),
                            (s.status = 113)))
                        : (s.status = 113)),
                    0 !== s.pending)
                  ) {
                    if ((f(t), 0 === t.avail_out))
                      return (s.last_flush = -1), 0;
                  } else if (0 === t.avail_in && p(e) <= p(r) && 4 !== e)
                    return l(t, -5);
                  if (666 === s.status && 0 !== t.avail_in) return l(t, -5);
                  if (
                    0 !== t.avail_in ||
                    0 !== s.lookahead ||
                    (0 !== e && 666 !== s.status)
                  ) {
                    var v =
                      2 === s.strategy
                        ? (function (t, e) {
                            for (var r; ; ) {
                              if (
                                0 === t.lookahead &&
                                (g(t), 0 === t.lookahead)
                              ) {
                                if (0 === e) return 1;
                                break;
                              }
                              if (
                                ((t.match_length = 0),
                                (r = n._tr_tally(t, 0, t.window[t.strstart])),
                                t.lookahead--,
                                t.strstart++,
                                r && (d(t, !1), 0 === t.strm.avail_out))
                              )
                                return 1;
                            }
                            return (
                              (t.insert = 0),
                              4 === e
                                ? (d(t, !0), 0 === t.strm.avail_out ? 3 : 4)
                                : t.last_lit &&
                                  (d(t, !1), 0 === t.strm.avail_out)
                                ? 1
                                : 2
                            );
                          })(s, e)
                        : 3 === s.strategy
                        ? (function (t, e) {
                            for (var r, i, s, a, o = t.window; ; ) {
                              if (t.lookahead <= 258) {
                                if ((g(t), t.lookahead <= 258 && 0 === e))
                                  return 1;
                                if (0 === t.lookahead) break;
                              }
                              if (
                                ((t.match_length = 0),
                                t.lookahead >= 3 &&
                                  t.strstart > 0 &&
                                  (i = o[(s = t.strstart - 1)]) === o[++s] &&
                                  i === o[++s] &&
                                  i === o[++s])
                              ) {
                                a = t.strstart + 258;
                                do {} while (
                                  i === o[++s] &&
                                  i === o[++s] &&
                                  i === o[++s] &&
                                  i === o[++s] &&
                                  i === o[++s] &&
                                  i === o[++s] &&
                                  i === o[++s] &&
                                  i === o[++s] &&
                                  s < a
                                );
                                (t.match_length = 258 - (a - s)),
                                  t.match_length > t.lookahead &&
                                    (t.match_length = t.lookahead);
                              }
                              if (
                                (t.match_length >= 3
                                  ? ((r = n._tr_tally(
                                      t,
                                      1,
                                      t.match_length - 3
                                    )),
                                    (t.lookahead -= t.match_length),
                                    (t.strstart += t.match_length),
                                    (t.match_length = 0))
                                  : ((r = n._tr_tally(
                                      t,
                                      0,
                                      t.window[t.strstart]
                                    )),
                                    t.lookahead--,
                                    t.strstart++),
                                r && (d(t, !1), 0 === t.strm.avail_out))
                              )
                                return 1;
                            }
                            return (
                              (t.insert = 0),
                              4 === e
                                ? (d(t, !0), 0 === t.strm.avail_out ? 3 : 4)
                                : t.last_lit &&
                                  (d(t, !1), 0 === t.strm.avail_out)
                                ? 1
                                : 2
                            );
                          })(s, e)
                        : i[s.level].func(s, e);
                    if (
                      ((3 !== v && 4 !== v) || (s.status = 666),
                      1 === v || 3 === v)
                    )
                      return 0 === t.avail_out && (s.last_flush = -1), 0;
                    if (
                      2 === v &&
                      (1 === e
                        ? n._tr_align(s)
                        : 5 !== e &&
                          (n._tr_stored_block(s, 0, 0, !1),
                          3 === e &&
                            (c(s.head),
                            0 === s.lookahead &&
                              ((s.strstart = 0),
                              (s.block_start = 0),
                              (s.insert = 0)))),
                      f(t),
                      0 === t.avail_out)
                    )
                      return (s.last_flush = -1), 0;
                  }
                  return 4 !== e
                    ? 0
                    : s.wrap <= 0
                    ? 1
                    : (2 === s.wrap
                        ? (u(s, 255 & t.adler),
                          u(s, (t.adler >> 8) & 255),
                          u(s, (t.adler >> 16) & 255),
                          u(s, (t.adler >> 24) & 255),
                          u(s, 255 & t.total_in),
                          u(s, (t.total_in >> 8) & 255),
                          u(s, (t.total_in >> 16) & 255),
                          u(s, (t.total_in >> 24) & 255))
                        : (m(s, t.adler >>> 16), m(s, 65535 & t.adler)),
                      f(t),
                      s.wrap > 0 && (s.wrap = -s.wrap),
                      0 !== s.pending ? 0 : 1);
                }),
                (r.deflateEnd = function (t) {
                  var e;
                  return t && t.state
                    ? 42 !== (e = t.state.status) &&
                      69 !== e &&
                      73 !== e &&
                      91 !== e &&
                      103 !== e &&
                      113 !== e &&
                      666 !== e
                      ? l(t, -2)
                      : ((t.state = null), 113 === e ? l(t, -3) : 0)
                    : -2;
                }),
                (r.deflateSetDictionary = function (t, e) {
                  var r,
                    i,
                    n,
                    o,
                    h,
                    l,
                    p,
                    f,
                    d = e.length;
                  if (!t || !t.state) return -2;
                  if (
                    2 === (o = (r = t.state).wrap) ||
                    (1 === o && 42 !== r.status) ||
                    r.lookahead
                  )
                    return -2;
                  for (
                    1 === o && (t.adler = a(t.adler, e, d, 0)),
                      r.wrap = 0,
                      d >= r.w_size &&
                        (0 === o &&
                          (c(r.head),
                          (r.strstart = 0),
                          (r.block_start = 0),
                          (r.insert = 0)),
                        (f = new s.Buf8(r.w_size)),
                        s.arraySet(f, e, d - r.w_size, r.w_size, 0),
                        (e = f),
                        (d = r.w_size)),
                      h = t.avail_in,
                      l = t.next_in,
                      p = t.input,
                      t.avail_in = d,
                      t.next_in = 0,
                      t.input = e,
                      g(r);
                    r.lookahead >= 3;

                  ) {
                    (i = r.strstart), (n = r.lookahead - 2);
                    do {
                      (r.ins_h =
                        ((r.ins_h << r.hash_shift) ^ r.window[i + 3 - 1]) &
                        r.hash_mask),
                        (r.prev[i & r.w_mask] = r.head[r.ins_h]),
                        (r.head[r.ins_h] = i),
                        i++;
                    } while (--n);
                    (r.strstart = i), (r.lookahead = 2), g(r);
                  }
                  return (
                    (r.strstart += r.lookahead),
                    (r.block_start = r.strstart),
                    (r.insert = r.lookahead),
                    (r.lookahead = 0),
                    (r.match_length = r.prev_length = 2),
                    (r.match_available = 0),
                    (t.next_in = l),
                    (t.input = p),
                    (t.avail_in = h),
                    (r.wrap = o),
                    0
                  );
                }),
                (r.deflateInfo = 'pako deflate (from Nodeca project)');
            },
            {
              '../utils/common': 41,
              './adler32': 43,
              './crc32': 45,
              './messages': 51,
              './trees': 52,
            },
          ],
          47: [
            function (t, e, r) {
              e.exports = function () {
                (this.text = 0),
                  (this.time = 0),
                  (this.xflags = 0),
                  (this.os = 0),
                  (this.extra = null),
                  (this.extra_len = 0),
                  (this.name = ''),
                  (this.comment = ''),
                  (this.hcrc = 0),
                  (this.done = !1);
              };
            },
            {},
          ],
          48: [
            function (t, e, r) {
              e.exports = function (t, e) {
                var r,
                  i,
                  s,
                  n,
                  a,
                  o,
                  h,
                  l,
                  p,
                  c,
                  f,
                  d,
                  u,
                  m,
                  y,
                  g,
                  v,
                  _,
                  b,
                  S,
                  P,
                  x,
                  k,
                  w,
                  E;
                (r = t.state),
                  (i = t.next_in),
                  (w = t.input),
                  (s = i + (t.avail_in - 5)),
                  (n = t.next_out),
                  (E = t.output),
                  (a = n - (e - t.avail_out)),
                  (o = n + (t.avail_out - 257)),
                  (h = r.dmax),
                  (l = r.wsize),
                  (p = r.whave),
                  (c = r.wnext),
                  (f = r.window),
                  (d = r.hold),
                  (u = r.bits),
                  (m = r.lencode),
                  (y = r.distcode),
                  (g = (1 << r.lenbits) - 1),
                  (v = (1 << r.distbits) - 1);
                t: do {
                  u < 15 &&
                    ((d += w[i++] << u),
                    (u += 8),
                    (d += w[i++] << u),
                    (u += 8)),
                    (_ = m[d & g]);
                  e: for (;;) {
                    if (
                      ((d >>>= b = _ >>> 24),
                      (u -= b),
                      0 == (b = (_ >>> 16) & 255))
                    )
                      E[n++] = 65535 & _;
                    else {
                      if (!(16 & b)) {
                        if (0 == (64 & b)) {
                          _ = m[(65535 & _) + (d & ((1 << b) - 1))];
                          continue e;
                        }
                        if (32 & b) {
                          r.mode = 12;
                          break t;
                        }
                        (t.msg = 'invalid literal/length code'), (r.mode = 30);
                        break t;
                      }
                      (S = 65535 & _),
                        (b &= 15) &&
                          (u < b && ((d += w[i++] << u), (u += 8)),
                          (S += d & ((1 << b) - 1)),
                          (d >>>= b),
                          (u -= b)),
                        u < 15 &&
                          ((d += w[i++] << u),
                          (u += 8),
                          (d += w[i++] << u),
                          (u += 8)),
                        (_ = y[d & v]);
                      r: for (;;) {
                        if (
                          ((d >>>= b = _ >>> 24),
                          (u -= b),
                          !(16 & (b = (_ >>> 16) & 255)))
                        ) {
                          if (0 == (64 & b)) {
                            _ = y[(65535 & _) + (d & ((1 << b) - 1))];
                            continue r;
                          }
                          (t.msg = 'invalid distance code'), (r.mode = 30);
                          break t;
                        }
                        if (
                          ((P = 65535 & _),
                          u < (b &= 15) &&
                            ((d += w[i++] << u),
                            (u += 8) < b && ((d += w[i++] << u), (u += 8))),
                          (P += d & ((1 << b) - 1)) > h)
                        ) {
                          (t.msg = 'invalid distance too far back'),
                            (r.mode = 30);
                          break t;
                        }
                        if (((d >>>= b), (u -= b), P > (b = n - a))) {
                          if ((b = P - b) > p && r.sane) {
                            (t.msg = 'invalid distance too far back'),
                              (r.mode = 30);
                            break t;
                          }
                          if (((x = 0), (k = f), 0 === c)) {
                            if (((x += l - b), b < S)) {
                              S -= b;
                              do {
                                E[n++] = f[x++];
                              } while (--b);
                              (x = n - P), (k = E);
                            }
                          } else if (c < b) {
                            if (((x += l + c - b), (b -= c) < S)) {
                              S -= b;
                              do {
                                E[n++] = f[x++];
                              } while (--b);
                              if (((x = 0), c < S)) {
                                S -= b = c;
                                do {
                                  E[n++] = f[x++];
                                } while (--b);
                                (x = n - P), (k = E);
                              }
                            }
                          } else if (((x += c - b), b < S)) {
                            S -= b;
                            do {
                              E[n++] = f[x++];
                            } while (--b);
                            (x = n - P), (k = E);
                          }
                          for (; S > 2; )
                            (E[n++] = k[x++]),
                              (E[n++] = k[x++]),
                              (E[n++] = k[x++]),
                              (S -= 3);
                          S && ((E[n++] = k[x++]), S > 1 && (E[n++] = k[x++]));
                        } else {
                          x = n - P;
                          do {
                            (E[n++] = E[x++]),
                              (E[n++] = E[x++]),
                              (E[n++] = E[x++]),
                              (S -= 3);
                          } while (S > 2);
                          S && ((E[n++] = E[x++]), S > 1 && (E[n++] = E[x++]));
                        }
                        break;
                      }
                    }
                    break;
                  }
                } while (i < s && n < o);
                (i -= S = u >> 3),
                  (d &= (1 << (u -= S << 3)) - 1),
                  (t.next_in = i),
                  (t.next_out = n),
                  (t.avail_in = i < s ? s - i + 5 : 5 - (i - s)),
                  (t.avail_out = n < o ? o - n + 257 : 257 - (n - o)),
                  (r.hold = d),
                  (r.bits = u);
              };
            },
            {},
          ],
          49: [
            function (t, e, r) {
              var i = t('../utils/common'),
                s = t('./adler32'),
                n = t('./crc32'),
                a = t('./inffast'),
                o = t('./inftrees');
              function h(t) {
                return (
                  ((t >>> 24) & 255) +
                  ((t >>> 8) & 65280) +
                  ((65280 & t) << 8) +
                  ((255 & t) << 24)
                );
              }
              function l() {
                (this.mode = 0),
                  (this.last = !1),
                  (this.wrap = 0),
                  (this.havedict = !1),
                  (this.flags = 0),
                  (this.dmax = 0),
                  (this.check = 0),
                  (this.total = 0),
                  (this.head = null),
                  (this.wbits = 0),
                  (this.wsize = 0),
                  (this.whave = 0),
                  (this.wnext = 0),
                  (this.window = null),
                  (this.hold = 0),
                  (this.bits = 0),
                  (this.length = 0),
                  (this.offset = 0),
                  (this.extra = 0),
                  (this.lencode = null),
                  (this.distcode = null),
                  (this.lenbits = 0),
                  (this.distbits = 0),
                  (this.ncode = 0),
                  (this.nlen = 0),
                  (this.ndist = 0),
                  (this.have = 0),
                  (this.next = null),
                  (this.lens = new i.Buf16(320)),
                  (this.work = new i.Buf16(288)),
                  (this.lendyn = null),
                  (this.distdyn = null),
                  (this.sane = 0),
                  (this.back = 0),
                  (this.was = 0);
              }
              function p(t) {
                var e;
                return t && t.state
                  ? ((e = t.state),
                    (t.total_in = t.total_out = e.total = 0),
                    (t.msg = ''),
                    e.wrap && (t.adler = 1 & e.wrap),
                    (e.mode = 1),
                    (e.last = 0),
                    (e.havedict = 0),
                    (e.dmax = 32768),
                    (e.head = null),
                    (e.hold = 0),
                    (e.bits = 0),
                    (e.lencode = e.lendyn = new i.Buf32(852)),
                    (e.distcode = e.distdyn = new i.Buf32(592)),
                    (e.sane = 1),
                    (e.back = -1),
                    0)
                  : -2;
              }
              function c(t) {
                var e;
                return t && t.state
                  ? (((e = t.state).wsize = 0),
                    (e.whave = 0),
                    (e.wnext = 0),
                    p(t))
                  : -2;
              }
              function f(t, e) {
                var r, i;
                return t && t.state
                  ? ((i = t.state),
                    e < 0
                      ? ((r = 0), (e = -e))
                      : ((r = 1 + (e >> 4)), e < 48 && (e &= 15)),
                    e && (e < 8 || e > 15)
                      ? -2
                      : (null !== i.window &&
                          i.wbits !== e &&
                          (i.window = null),
                        (i.wrap = r),
                        (i.wbits = e),
                        c(t)))
                  : -2;
              }
              function d(t, e) {
                var r, i;
                return t
                  ? ((i = new l()),
                    (t.state = i),
                    (i.window = null),
                    0 !== (r = f(t, e)) && (t.state = null),
                    r)
                  : -2;
              }
              var u,
                m,
                y = !0;
              function g(t) {
                if (y) {
                  var e;
                  for (
                    u = new i.Buf32(512), m = new i.Buf32(32), e = 0;
                    e < 144;

                  )
                    t.lens[e++] = 8;
                  for (; e < 256; ) t.lens[e++] = 9;
                  for (; e < 280; ) t.lens[e++] = 7;
                  for (; e < 288; ) t.lens[e++] = 8;
                  for (
                    o(1, t.lens, 0, 288, u, 0, t.work, { bits: 9 }), e = 0;
                    e < 32;

                  )
                    t.lens[e++] = 5;
                  o(2, t.lens, 0, 32, m, 0, t.work, { bits: 5 }), (y = !1);
                }
                (t.lencode = u),
                  (t.lenbits = 9),
                  (t.distcode = m),
                  (t.distbits = 5);
              }
              function v(t, e, r, s) {
                var n,
                  a = t.state;
                return (
                  null === a.window &&
                    ((a.wsize = 1 << a.wbits),
                    (a.wnext = 0),
                    (a.whave = 0),
                    (a.window = new i.Buf8(a.wsize))),
                  s >= a.wsize
                    ? (i.arraySet(a.window, e, r - a.wsize, a.wsize, 0),
                      (a.wnext = 0),
                      (a.whave = a.wsize))
                    : ((n = a.wsize - a.wnext) > s && (n = s),
                      i.arraySet(a.window, e, r - s, n, a.wnext),
                      (s -= n)
                        ? (i.arraySet(a.window, e, r - s, s, 0),
                          (a.wnext = s),
                          (a.whave = a.wsize))
                        : ((a.wnext += n),
                          a.wnext === a.wsize && (a.wnext = 0),
                          a.whave < a.wsize && (a.whave += n))),
                  0
                );
              }
              (r.inflateReset = c),
                (r.inflateReset2 = f),
                (r.inflateResetKeep = p),
                (r.inflateInit = function (t) {
                  return d(t, 15);
                }),
                (r.inflateInit2 = d),
                (r.inflate = function (t, e) {
                  var r,
                    l,
                    p,
                    c,
                    f,
                    d,
                    u,
                    m,
                    y,
                    _,
                    b,
                    S,
                    P,
                    x,
                    k,
                    w,
                    E,
                    A,
                    T,
                    C,
                    I,
                    F,
                    M,
                    D,
                    R = 0,
                    z = new i.Buf8(4),
                    L = [
                      16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14,
                      1, 15,
                    ];
                  if (
                    !t ||
                    !t.state ||
                    !t.output ||
                    (!t.input && 0 !== t.avail_in)
                  )
                    return -2;
                  12 === (r = t.state).mode && (r.mode = 13),
                    (f = t.next_out),
                    (p = t.output),
                    (u = t.avail_out),
                    (c = t.next_in),
                    (l = t.input),
                    (d = t.avail_in),
                    (m = r.hold),
                    (y = r.bits),
                    (_ = d),
                    (b = u),
                    (F = 0);
                  t: for (;;)
                    switch (r.mode) {
                      case 1:
                        if (0 === r.wrap) {
                          r.mode = 13;
                          break;
                        }
                        for (; y < 16; ) {
                          if (0 === d) break t;
                          d--, (m += l[c++] << y), (y += 8);
                        }
                        if (2 & r.wrap && 35615 === m) {
                          (r.check = 0),
                            (z[0] = 255 & m),
                            (z[1] = (m >>> 8) & 255),
                            (r.check = n(r.check, z, 2, 0)),
                            (m = 0),
                            (y = 0),
                            (r.mode = 2);
                          break;
                        }
                        if (
                          ((r.flags = 0),
                          r.head && (r.head.done = !1),
                          !(1 & r.wrap) || (((255 & m) << 8) + (m >> 8)) % 31)
                        ) {
                          (t.msg = 'incorrect header check'), (r.mode = 30);
                          break;
                        }
                        if (8 != (15 & m)) {
                          (t.msg = 'unknown compression method'), (r.mode = 30);
                          break;
                        }
                        if (
                          ((y -= 4), (I = 8 + (15 & (m >>>= 4))), 0 === r.wbits)
                        )
                          r.wbits = I;
                        else if (I > r.wbits) {
                          (t.msg = 'invalid window size'), (r.mode = 30);
                          break;
                        }
                        (r.dmax = 1 << I),
                          (t.adler = r.check = 1),
                          (r.mode = 512 & m ? 10 : 12),
                          (m = 0),
                          (y = 0);
                        break;
                      case 2:
                        for (; y < 16; ) {
                          if (0 === d) break t;
                          d--, (m += l[c++] << y), (y += 8);
                        }
                        if (((r.flags = m), 8 != (255 & r.flags))) {
                          (t.msg = 'unknown compression method'), (r.mode = 30);
                          break;
                        }
                        if (57344 & r.flags) {
                          (t.msg = 'unknown header flags set'), (r.mode = 30);
                          break;
                        }
                        r.head && (r.head.text = (m >> 8) & 1),
                          512 & r.flags &&
                            ((z[0] = 255 & m),
                            (z[1] = (m >>> 8) & 255),
                            (r.check = n(r.check, z, 2, 0))),
                          (m = 0),
                          (y = 0),
                          (r.mode = 3);
                      case 3:
                        for (; y < 32; ) {
                          if (0 === d) break t;
                          d--, (m += l[c++] << y), (y += 8);
                        }
                        r.head && (r.head.time = m),
                          512 & r.flags &&
                            ((z[0] = 255 & m),
                            (z[1] = (m >>> 8) & 255),
                            (z[2] = (m >>> 16) & 255),
                            (z[3] = (m >>> 24) & 255),
                            (r.check = n(r.check, z, 4, 0))),
                          (m = 0),
                          (y = 0),
                          (r.mode = 4);
                      case 4:
                        for (; y < 16; ) {
                          if (0 === d) break t;
                          d--, (m += l[c++] << y), (y += 8);
                        }
                        r.head &&
                          ((r.head.xflags = 255 & m), (r.head.os = m >> 8)),
                          512 & r.flags &&
                            ((z[0] = 255 & m),
                            (z[1] = (m >>> 8) & 255),
                            (r.check = n(r.check, z, 2, 0))),
                          (m = 0),
                          (y = 0),
                          (r.mode = 5);
                      case 5:
                        if (1024 & r.flags) {
                          for (; y < 16; ) {
                            if (0 === d) break t;
                            d--, (m += l[c++] << y), (y += 8);
                          }
                          (r.length = m),
                            r.head && (r.head.extra_len = m),
                            512 & r.flags &&
                              ((z[0] = 255 & m),
                              (z[1] = (m >>> 8) & 255),
                              (r.check = n(r.check, z, 2, 0))),
                            (m = 0),
                            (y = 0);
                        } else r.head && (r.head.extra = null);
                        r.mode = 6;
                      case 6:
                        if (
                          1024 & r.flags &&
                          ((S = r.length) > d && (S = d),
                          S &&
                            (r.head &&
                              ((I = r.head.extra_len - r.length),
                              r.head.extra ||
                                (r.head.extra = new Array(r.head.extra_len)),
                              i.arraySet(r.head.extra, l, c, S, I)),
                            512 & r.flags && (r.check = n(r.check, l, S, c)),
                            (d -= S),
                            (c += S),
                            (r.length -= S)),
                          r.length)
                        )
                          break t;
                        (r.length = 0), (r.mode = 7);
                      case 7:
                        if (2048 & r.flags) {
                          if (0 === d) break t;
                          S = 0;
                          do {
                            (I = l[c + S++]),
                              r.head &&
                                I &&
                                r.length < 65536 &&
                                (r.head.name += String.fromCharCode(I));
                          } while (I && S < d);
                          if (
                            (512 & r.flags && (r.check = n(r.check, l, S, c)),
                            (d -= S),
                            (c += S),
                            I)
                          )
                            break t;
                        } else r.head && (r.head.name = null);
                        (r.length = 0), (r.mode = 8);
                      case 8:
                        if (4096 & r.flags) {
                          if (0 === d) break t;
                          S = 0;
                          do {
                            (I = l[c + S++]),
                              r.head &&
                                I &&
                                r.length < 65536 &&
                                (r.head.comment += String.fromCharCode(I));
                          } while (I && S < d);
                          if (
                            (512 & r.flags && (r.check = n(r.check, l, S, c)),
                            (d -= S),
                            (c += S),
                            I)
                          )
                            break t;
                        } else r.head && (r.head.comment = null);
                        r.mode = 9;
                      case 9:
                        if (512 & r.flags) {
                          for (; y < 16; ) {
                            if (0 === d) break t;
                            d--, (m += l[c++] << y), (y += 8);
                          }
                          if (m !== (65535 & r.check)) {
                            (t.msg = 'header crc mismatch'), (r.mode = 30);
                            break;
                          }
                          (m = 0), (y = 0);
                        }
                        r.head &&
                          ((r.head.hcrc = (r.flags >> 9) & 1),
                          (r.head.done = !0)),
                          (t.adler = r.check = 0),
                          (r.mode = 12);
                        break;
                      case 10:
                        for (; y < 32; ) {
                          if (0 === d) break t;
                          d--, (m += l[c++] << y), (y += 8);
                        }
                        (t.adler = r.check = h(m)),
                          (m = 0),
                          (y = 0),
                          (r.mode = 11);
                      case 11:
                        if (0 === r.havedict)
                          return (
                            (t.next_out = f),
                            (t.avail_out = u),
                            (t.next_in = c),
                            (t.avail_in = d),
                            (r.hold = m),
                            (r.bits = y),
                            2
                          );
                        (t.adler = r.check = 1), (r.mode = 12);
                      case 12:
                        if (5 === e || 6 === e) break t;
                      case 13:
                        if (r.last) {
                          (m >>>= 7 & y), (y -= 7 & y), (r.mode = 27);
                          break;
                        }
                        for (; y < 3; ) {
                          if (0 === d) break t;
                          d--, (m += l[c++] << y), (y += 8);
                        }
                        switch (((r.last = 1 & m), (y -= 1), 3 & (m >>>= 1))) {
                          case 0:
                            r.mode = 14;
                            break;
                          case 1:
                            if ((g(r), (r.mode = 20), 6 === e)) {
                              (m >>>= 2), (y -= 2);
                              break t;
                            }
                            break;
                          case 2:
                            r.mode = 17;
                            break;
                          case 3:
                            (t.msg = 'invalid block type'), (r.mode = 30);
                        }
                        (m >>>= 2), (y -= 2);
                        break;
                      case 14:
                        for (m >>>= 7 & y, y -= 7 & y; y < 32; ) {
                          if (0 === d) break t;
                          d--, (m += l[c++] << y), (y += 8);
                        }
                        if ((65535 & m) != ((m >>> 16) ^ 65535)) {
                          (t.msg = 'invalid stored block lengths'),
                            (r.mode = 30);
                          break;
                        }
                        if (
                          ((r.length = 65535 & m),
                          (m = 0),
                          (y = 0),
                          (r.mode = 15),
                          6 === e)
                        )
                          break t;
                      case 15:
                        r.mode = 16;
                      case 16:
                        if ((S = r.length)) {
                          if ((S > d && (S = d), S > u && (S = u), 0 === S))
                            break t;
                          i.arraySet(p, l, c, S, f),
                            (d -= S),
                            (c += S),
                            (u -= S),
                            (f += S),
                            (r.length -= S);
                          break;
                        }
                        r.mode = 12;
                        break;
                      case 17:
                        for (; y < 14; ) {
                          if (0 === d) break t;
                          d--, (m += l[c++] << y), (y += 8);
                        }
                        if (
                          ((r.nlen = 257 + (31 & m)),
                          (m >>>= 5),
                          (y -= 5),
                          (r.ndist = 1 + (31 & m)),
                          (m >>>= 5),
                          (y -= 5),
                          (r.ncode = 4 + (15 & m)),
                          (m >>>= 4),
                          (y -= 4),
                          r.nlen > 286 || r.ndist > 30)
                        ) {
                          (t.msg = 'too many length or distance symbols'),
                            (r.mode = 30);
                          break;
                        }
                        (r.have = 0), (r.mode = 18);
                      case 18:
                        for (; r.have < r.ncode; ) {
                          for (; y < 3; ) {
                            if (0 === d) break t;
                            d--, (m += l[c++] << y), (y += 8);
                          }
                          (r.lens[L[r.have++]] = 7 & m), (m >>>= 3), (y -= 3);
                        }
                        for (; r.have < 19; ) r.lens[L[r.have++]] = 0;
                        if (
                          ((r.lencode = r.lendyn),
                          (r.lenbits = 7),
                          (M = { bits: r.lenbits }),
                          (F = o(0, r.lens, 0, 19, r.lencode, 0, r.work, M)),
                          (r.lenbits = M.bits),
                          F)
                        ) {
                          (t.msg = 'invalid code lengths set'), (r.mode = 30);
                          break;
                        }
                        (r.have = 0), (r.mode = 19);
                      case 19:
                        for (; r.have < r.nlen + r.ndist; ) {
                          for (
                            ;
                            (w =
                              ((R = r.lencode[m & ((1 << r.lenbits) - 1)]) >>>
                                16) &
                              255),
                              (E = 65535 & R),
                              !((k = R >>> 24) <= y);

                          ) {
                            if (0 === d) break t;
                            d--, (m += l[c++] << y), (y += 8);
                          }
                          if (E < 16)
                            (m >>>= k), (y -= k), (r.lens[r.have++] = E);
                          else {
                            if (16 === E) {
                              for (D = k + 2; y < D; ) {
                                if (0 === d) break t;
                                d--, (m += l[c++] << y), (y += 8);
                              }
                              if (((m >>>= k), (y -= k), 0 === r.have)) {
                                (t.msg = 'invalid bit length repeat'),
                                  (r.mode = 30);
                                break;
                              }
                              (I = r.lens[r.have - 1]),
                                (S = 3 + (3 & m)),
                                (m >>>= 2),
                                (y -= 2);
                            } else if (17 === E) {
                              for (D = k + 3; y < D; ) {
                                if (0 === d) break t;
                                d--, (m += l[c++] << y), (y += 8);
                              }
                              (y -= k),
                                (I = 0),
                                (S = 3 + (7 & (m >>>= k))),
                                (m >>>= 3),
                                (y -= 3);
                            } else {
                              for (D = k + 7; y < D; ) {
                                if (0 === d) break t;
                                d--, (m += l[c++] << y), (y += 8);
                              }
                              (y -= k),
                                (I = 0),
                                (S = 11 + (127 & (m >>>= k))),
                                (m >>>= 7),
                                (y -= 7);
                            }
                            if (r.have + S > r.nlen + r.ndist) {
                              (t.msg = 'invalid bit length repeat'),
                                (r.mode = 30);
                              break;
                            }
                            for (; S--; ) r.lens[r.have++] = I;
                          }
                        }
                        if (30 === r.mode) break;
                        if (0 === r.lens[256]) {
                          (t.msg = 'invalid code -- missing end-of-block'),
                            (r.mode = 30);
                          break;
                        }
                        if (
                          ((r.lenbits = 9),
                          (M = { bits: r.lenbits }),
                          (F = o(
                            1,
                            r.lens,
                            0,
                            r.nlen,
                            r.lencode,
                            0,
                            r.work,
                            M
                          )),
                          (r.lenbits = M.bits),
                          F)
                        ) {
                          (t.msg = 'invalid literal/lengths set'),
                            (r.mode = 30);
                          break;
                        }
                        if (
                          ((r.distbits = 6),
                          (r.distcode = r.distdyn),
                          (M = { bits: r.distbits }),
                          (F = o(
                            2,
                            r.lens,
                            r.nlen,
                            r.ndist,
                            r.distcode,
                            0,
                            r.work,
                            M
                          )),
                          (r.distbits = M.bits),
                          F)
                        ) {
                          (t.msg = 'invalid distances set'), (r.mode = 30);
                          break;
                        }
                        if (((r.mode = 20), 6 === e)) break t;
                      case 20:
                        r.mode = 21;
                      case 21:
                        if (d >= 6 && u >= 258) {
                          (t.next_out = f),
                            (t.avail_out = u),
                            (t.next_in = c),
                            (t.avail_in = d),
                            (r.hold = m),
                            (r.bits = y),
                            a(t, b),
                            (f = t.next_out),
                            (p = t.output),
                            (u = t.avail_out),
                            (c = t.next_in),
                            (l = t.input),
                            (d = t.avail_in),
                            (m = r.hold),
                            (y = r.bits),
                            12 === r.mode && (r.back = -1);
                          break;
                        }
                        for (
                          r.back = 0;
                          (w =
                            ((R = r.lencode[m & ((1 << r.lenbits) - 1)]) >>>
                              16) &
                            255),
                            (E = 65535 & R),
                            !((k = R >>> 24) <= y);

                        ) {
                          if (0 === d) break t;
                          d--, (m += l[c++] << y), (y += 8);
                        }
                        if (w && 0 == (240 & w)) {
                          for (
                            A = k, T = w, C = E;
                            (w =
                              ((R =
                                r.lencode[
                                  C + ((m & ((1 << (A + T)) - 1)) >> A)
                                ]) >>>
                                16) &
                              255),
                              (E = 65535 & R),
                              !(A + (k = R >>> 24) <= y);

                          ) {
                            if (0 === d) break t;
                            d--, (m += l[c++] << y), (y += 8);
                          }
                          (m >>>= A), (y -= A), (r.back += A);
                        }
                        if (
                          ((m >>>= k),
                          (y -= k),
                          (r.back += k),
                          (r.length = E),
                          0 === w)
                        ) {
                          r.mode = 26;
                          break;
                        }
                        if (32 & w) {
                          (r.back = -1), (r.mode = 12);
                          break;
                        }
                        if (64 & w) {
                          (t.msg = 'invalid literal/length code'),
                            (r.mode = 30);
                          break;
                        }
                        (r.extra = 15 & w), (r.mode = 22);
                      case 22:
                        if (r.extra) {
                          for (D = r.extra; y < D; ) {
                            if (0 === d) break t;
                            d--, (m += l[c++] << y), (y += 8);
                          }
                          (r.length += m & ((1 << r.extra) - 1)),
                            (m >>>= r.extra),
                            (y -= r.extra),
                            (r.back += r.extra);
                        }
                        (r.was = r.length), (r.mode = 23);
                      case 23:
                        for (
                          ;
                          (w =
                            ((R = r.distcode[m & ((1 << r.distbits) - 1)]) >>>
                              16) &
                            255),
                            (E = 65535 & R),
                            !((k = R >>> 24) <= y);

                        ) {
                          if (0 === d) break t;
                          d--, (m += l[c++] << y), (y += 8);
                        }
                        if (0 == (240 & w)) {
                          for (
                            A = k, T = w, C = E;
                            (w =
                              ((R =
                                r.distcode[
                                  C + ((m & ((1 << (A + T)) - 1)) >> A)
                                ]) >>>
                                16) &
                              255),
                              (E = 65535 & R),
                              !(A + (k = R >>> 24) <= y);

                          ) {
                            if (0 === d) break t;
                            d--, (m += l[c++] << y), (y += 8);
                          }
                          (m >>>= A), (y -= A), (r.back += A);
                        }
                        if (((m >>>= k), (y -= k), (r.back += k), 64 & w)) {
                          (t.msg = 'invalid distance code'), (r.mode = 30);
                          break;
                        }
                        (r.offset = E), (r.extra = 15 & w), (r.mode = 24);
                      case 24:
                        if (r.extra) {
                          for (D = r.extra; y < D; ) {
                            if (0 === d) break t;
                            d--, (m += l[c++] << y), (y += 8);
                          }
                          (r.offset += m & ((1 << r.extra) - 1)),
                            (m >>>= r.extra),
                            (y -= r.extra),
                            (r.back += r.extra);
                        }
                        if (r.offset > r.dmax) {
                          (t.msg = 'invalid distance too far back'),
                            (r.mode = 30);
                          break;
                        }
                        r.mode = 25;
                      case 25:
                        if (0 === u) break t;
                        if (((S = b - u), r.offset > S)) {
                          if ((S = r.offset - S) > r.whave && r.sane) {
                            (t.msg = 'invalid distance too far back'),
                              (r.mode = 30);
                            break;
                          }
                          S > r.wnext
                            ? ((S -= r.wnext), (P = r.wsize - S))
                            : (P = r.wnext - S),
                            S > r.length && (S = r.length),
                            (x = r.window);
                        } else (x = p), (P = f - r.offset), (S = r.length);
                        S > u && (S = u), (u -= S), (r.length -= S);
                        do {
                          p[f++] = x[P++];
                        } while (--S);
                        0 === r.length && (r.mode = 21);
                        break;
                      case 26:
                        if (0 === u) break t;
                        (p[f++] = r.length), u--, (r.mode = 21);
                        break;
                      case 27:
                        if (r.wrap) {
                          for (; y < 32; ) {
                            if (0 === d) break t;
                            d--, (m |= l[c++] << y), (y += 8);
                          }
                          if (
                            ((b -= u),
                            (t.total_out += b),
                            (r.total += b),
                            b &&
                              (t.adler = r.check =
                                r.flags
                                  ? n(r.check, p, b, f - b)
                                  : s(r.check, p, b, f - b)),
                            (b = u),
                            (r.flags ? m : h(m)) !== r.check)
                          ) {
                            (t.msg = 'incorrect data check'), (r.mode = 30);
                            break;
                          }
                          (m = 0), (y = 0);
                        }
                        r.mode = 28;
                      case 28:
                        if (r.wrap && r.flags) {
                          for (; y < 32; ) {
                            if (0 === d) break t;
                            d--, (m += l[c++] << y), (y += 8);
                          }
                          if (m !== (4294967295 & r.total)) {
                            (t.msg = 'incorrect length check'), (r.mode = 30);
                            break;
                          }
                          (m = 0), (y = 0);
                        }
                        r.mode = 29;
                      case 29:
                        F = 1;
                        break t;
                      case 30:
                        F = -3;
                        break t;
                      case 31:
                        return -4;
                      case 32:
                      default:
                        return -2;
                    }
                  return (
                    (t.next_out = f),
                    (t.avail_out = u),
                    (t.next_in = c),
                    (t.avail_in = d),
                    (r.hold = m),
                    (r.bits = y),
                    (r.wsize ||
                      (b !== t.avail_out &&
                        r.mode < 30 &&
                        (r.mode < 27 || 4 !== e))) &&
                      v(t, t.output, t.next_out, b - t.avail_out),
                    (_ -= t.avail_in),
                    (b -= t.avail_out),
                    (t.total_in += _),
                    (t.total_out += b),
                    (r.total += b),
                    r.wrap &&
                      b &&
                      (t.adler = r.check =
                        r.flags
                          ? n(r.check, p, b, t.next_out - b)
                          : s(r.check, p, b, t.next_out - b)),
                    (t.data_type =
                      r.bits +
                      (r.last ? 64 : 0) +
                      (12 === r.mode ? 128 : 0) +
                      (20 === r.mode || 15 === r.mode ? 256 : 0)),
                    ((0 === _ && 0 === b) || 4 === e) && 0 === F && (F = -5),
                    F
                  );
                }),
                (r.inflateEnd = function (t) {
                  if (!t || !t.state) return -2;
                  var e = t.state;
                  return e.window && (e.window = null), (t.state = null), 0;
                }),
                (r.inflateGetHeader = function (t, e) {
                  var r;
                  return t && t.state
                    ? 0 == (2 & (r = t.state).wrap)
                      ? -2
                      : ((r.head = e), (e.done = !1), 0)
                    : -2;
                }),
                (r.inflateSetDictionary = function (t, e) {
                  var r,
                    i = e.length;
                  return t && t.state
                    ? 0 !== (r = t.state).wrap && 11 !== r.mode
                      ? -2
                      : 11 === r.mode && s(1, e, i, 0) !== r.check
                      ? -3
                      : v(t, e, i, i)
                      ? ((r.mode = 31), -4)
                      : ((r.havedict = 1), 0)
                    : -2;
                }),
                (r.inflateInfo = 'pako inflate (from Nodeca project)');
            },
            {
              '../utils/common': 41,
              './adler32': 43,
              './crc32': 45,
              './inffast': 48,
              './inftrees': 50,
            },
          ],
          50: [
            function (t, e, r) {
              var i = t('../utils/common'),
                s = [
                  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35,
                  43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0,
                ],
                n = [
                  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18,
                  18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72,
                  78,
                ],
                a = [
                  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
                  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193,
                  12289, 16385, 24577, 0, 0,
                ],
                o = [
                  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22,
                  22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29,
                  64, 64,
                ];
              e.exports = function (t, e, r, h, l, p, c, f) {
                var d,
                  u,
                  m,
                  y,
                  g,
                  v,
                  _,
                  b,
                  S,
                  P = f.bits,
                  x = 0,
                  k = 0,
                  w = 0,
                  E = 0,
                  A = 0,
                  T = 0,
                  C = 0,
                  I = 0,
                  F = 0,
                  M = 0,
                  D = null,
                  R = 0,
                  z = new i.Buf16(16),
                  L = new i.Buf16(16),
                  O = null,
                  N = 0;
                for (x = 0; x <= 15; x++) z[x] = 0;
                for (k = 0; k < h; k++) z[e[r + k]]++;
                for (A = P, E = 15; E >= 1 && 0 === z[E]; E--);
                if ((A > E && (A = E), 0 === E))
                  return (
                    (l[p++] = 20971520), (l[p++] = 20971520), (f.bits = 1), 0
                  );
                for (w = 1; w < E && 0 === z[w]; w++);
                for (A < w && (A = w), I = 1, x = 1; x <= 15; x++)
                  if (((I <<= 1), (I -= z[x]) < 0)) return -1;
                if (I > 0 && (0 === t || 1 !== E)) return -1;
                for (L[1] = 0, x = 1; x < 15; x++) L[x + 1] = L[x] + z[x];
                for (k = 0; k < h; k++)
                  0 !== e[r + k] && (c[L[e[r + k]]++] = k);
                if (
                  (0 === t
                    ? ((D = O = c), (v = 19))
                    : 1 === t
                    ? ((D = s), (R -= 257), (O = n), (N -= 257), (v = 256))
                    : ((D = a), (O = o), (v = -1)),
                  (M = 0),
                  (k = 0),
                  (x = w),
                  (g = p),
                  (T = A),
                  (C = 0),
                  (m = -1),
                  (y = (F = 1 << A) - 1),
                  (1 === t && F > 852) || (2 === t && F > 592))
                )
                  return 1;
                for (;;) {
                  (_ = x - C),
                    c[k] < v
                      ? ((b = 0), (S = c[k]))
                      : c[k] > v
                      ? ((b = O[N + c[k]]), (S = D[R + c[k]]))
                      : ((b = 96), (S = 0)),
                    (d = 1 << (x - C)),
                    (w = u = 1 << T);
                  do {
                    l[g + (M >> C) + (u -= d)] = (_ << 24) | (b << 16) | S | 0;
                  } while (0 !== u);
                  for (d = 1 << (x - 1); M & d; ) d >>= 1;
                  if (
                    (0 !== d ? ((M &= d - 1), (M += d)) : (M = 0),
                    k++,
                    0 == --z[x])
                  ) {
                    if (x === E) break;
                    x = e[r + c[k]];
                  }
                  if (x > A && (M & y) !== m) {
                    for (
                      0 === C && (C = A), g += w, I = 1 << (T = x - C);
                      T + C < E && !((I -= z[T + C]) <= 0);

                    )
                      T++, (I <<= 1);
                    if (
                      ((F += 1 << T),
                      (1 === t && F > 852) || (2 === t && F > 592))
                    )
                      return 1;
                    l[(m = M & y)] = (A << 24) | (T << 16) | (g - p) | 0;
                  }
                }
                return (
                  0 !== M && (l[g + M] = ((x - C) << 24) | (64 << 16) | 0),
                  (f.bits = A),
                  0
                );
              };
            },
            { '../utils/common': 41 },
          ],
          51: [
            function (t, e, r) {
              e.exports = {
                2: 'need dictionary',
                1: 'stream end',
                0: '',
                '-1': 'file error',
                '-2': 'stream error',
                '-3': 'data error',
                '-4': 'insufficient memory',
                '-5': 'buffer error',
                '-6': 'incompatible version',
              };
            },
            {},
          ],
          52: [
            function (t, e, r) {
              var i = t('../utils/common');
              function s(t) {
                for (var e = t.length; --e >= 0; ) t[e] = 0;
              }
              var n = [
                  0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4,
                  4, 4, 4, 5, 5, 5, 5, 0,
                ],
                a = [
                  0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9,
                  9, 10, 10, 11, 11, 12, 12, 13, 13,
                ],
                o = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
                h = [
                  16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1,
                  15,
                ],
                l = new Array(576);
              s(l);
              var p = new Array(60);
              s(p);
              var c = new Array(512);
              s(c);
              var f = new Array(256);
              s(f);
              var d = new Array(29);
              s(d);
              var u,
                m,
                y,
                g = new Array(30);
              function v(t, e, r, i, s) {
                (this.static_tree = t),
                  (this.extra_bits = e),
                  (this.extra_base = r),
                  (this.elems = i),
                  (this.max_length = s),
                  (this.has_stree = t && t.length);
              }
              function _(t, e) {
                (this.dyn_tree = t), (this.max_code = 0), (this.stat_desc = e);
              }
              function b(t) {
                return t < 256 ? c[t] : c[256 + (t >>> 7)];
              }
              function S(t, e) {
                (t.pending_buf[t.pending++] = 255 & e),
                  (t.pending_buf[t.pending++] = (e >>> 8) & 255);
              }
              function P(t, e, r) {
                t.bi_valid > 16 - r
                  ? ((t.bi_buf |= (e << t.bi_valid) & 65535),
                    S(t, t.bi_buf),
                    (t.bi_buf = e >> (16 - t.bi_valid)),
                    (t.bi_valid += r - 16))
                  : ((t.bi_buf |= (e << t.bi_valid) & 65535),
                    (t.bi_valid += r));
              }
              function x(t, e, r) {
                P(t, r[2 * e], r[2 * e + 1]);
              }
              function k(t, e) {
                var r = 0;
                do {
                  (r |= 1 & t), (t >>>= 1), (r <<= 1);
                } while (--e > 0);
                return r >>> 1;
              }
              function w(t, e, r) {
                var i,
                  s,
                  n = new Array(16),
                  a = 0;
                for (i = 1; i <= 15; i++) n[i] = a = (a + r[i - 1]) << 1;
                for (s = 0; s <= e; s++) {
                  var o = t[2 * s + 1];
                  0 !== o && (t[2 * s] = k(n[o]++, o));
                }
              }
              function E(t) {
                var e;
                for (e = 0; e < 286; e++) t.dyn_ltree[2 * e] = 0;
                for (e = 0; e < 30; e++) t.dyn_dtree[2 * e] = 0;
                for (e = 0; e < 19; e++) t.bl_tree[2 * e] = 0;
                (t.dyn_ltree[512] = 1),
                  (t.opt_len = t.static_len = 0),
                  (t.last_lit = t.matches = 0);
              }
              function A(t) {
                t.bi_valid > 8
                  ? S(t, t.bi_buf)
                  : t.bi_valid > 0 && (t.pending_buf[t.pending++] = t.bi_buf),
                  (t.bi_buf = 0),
                  (t.bi_valid = 0);
              }
              function T(t, e, r, i) {
                var s = 2 * e,
                  n = 2 * r;
                return t[s] < t[n] || (t[s] === t[n] && i[e] <= i[r]);
              }
              function C(t, e, r) {
                for (
                  var i = t.heap[r], s = r << 1;
                  s <= t.heap_len &&
                  (s < t.heap_len &&
                    T(e, t.heap[s + 1], t.heap[s], t.depth) &&
                    s++,
                  !T(e, i, t.heap[s], t.depth));

                )
                  (t.heap[r] = t.heap[s]), (r = s), (s <<= 1);
                t.heap[r] = i;
              }
              function I(t, e, r) {
                var i,
                  s,
                  o,
                  h,
                  l = 0;
                if (0 !== t.last_lit)
                  do {
                    (i =
                      (t.pending_buf[t.d_buf + 2 * l] << 8) |
                      t.pending_buf[t.d_buf + 2 * l + 1]),
                      (s = t.pending_buf[t.l_buf + l]),
                      l++,
                      0 === i
                        ? x(t, s, e)
                        : (x(t, (o = f[s]) + 256 + 1, e),
                          0 !== (h = n[o]) && P(t, (s -= d[o]), h),
                          x(t, (o = b(--i)), r),
                          0 !== (h = a[o]) && P(t, (i -= g[o]), h));
                  } while (l < t.last_lit);
                x(t, 256, e);
              }
              function F(t, e) {
                var r,
                  i,
                  s,
                  n = e.dyn_tree,
                  a = e.stat_desc.static_tree,
                  o = e.stat_desc.has_stree,
                  h = e.stat_desc.elems,
                  l = -1;
                for (t.heap_len = 0, t.heap_max = 573, r = 0; r < h; r++)
                  0 !== n[2 * r]
                    ? ((t.heap[++t.heap_len] = l = r), (t.depth[r] = 0))
                    : (n[2 * r + 1] = 0);
                for (; t.heap_len < 2; )
                  (n[2 * (s = t.heap[++t.heap_len] = l < 2 ? ++l : 0)] = 1),
                    (t.depth[s] = 0),
                    t.opt_len--,
                    o && (t.static_len -= a[2 * s + 1]);
                for (e.max_code = l, r = t.heap_len >> 1; r >= 1; r--)
                  C(t, n, r);
                s = h;
                do {
                  (r = t.heap[1]),
                    (t.heap[1] = t.heap[t.heap_len--]),
                    C(t, n, 1),
                    (i = t.heap[1]),
                    (t.heap[--t.heap_max] = r),
                    (t.heap[--t.heap_max] = i),
                    (n[2 * s] = n[2 * r] + n[2 * i]),
                    (t.depth[s] =
                      (t.depth[r] >= t.depth[i] ? t.depth[r] : t.depth[i]) + 1),
                    (n[2 * r + 1] = n[2 * i + 1] = s),
                    (t.heap[1] = s++),
                    C(t, n, 1);
                } while (t.heap_len >= 2);
                (t.heap[--t.heap_max] = t.heap[1]),
                  (function (t, e) {
                    var r,
                      i,
                      s,
                      n,
                      a,
                      o,
                      h = e.dyn_tree,
                      l = e.max_code,
                      p = e.stat_desc.static_tree,
                      c = e.stat_desc.has_stree,
                      f = e.stat_desc.extra_bits,
                      d = e.stat_desc.extra_base,
                      u = e.stat_desc.max_length,
                      m = 0;
                    for (n = 0; n <= 15; n++) t.bl_count[n] = 0;
                    for (
                      h[2 * t.heap[t.heap_max] + 1] = 0, r = t.heap_max + 1;
                      r < 573;
                      r++
                    )
                      (n = h[2 * h[2 * (i = t.heap[r]) + 1] + 1] + 1) > u &&
                        ((n = u), m++),
                        (h[2 * i + 1] = n),
                        i > l ||
                          (t.bl_count[n]++,
                          (a = 0),
                          i >= d && (a = f[i - d]),
                          (o = h[2 * i]),
                          (t.opt_len += o * (n + a)),
                          c && (t.static_len += o * (p[2 * i + 1] + a)));
                    if (0 !== m) {
                      do {
                        for (n = u - 1; 0 === t.bl_count[n]; ) n--;
                        t.bl_count[n]--,
                          (t.bl_count[n + 1] += 2),
                          t.bl_count[u]--,
                          (m -= 2);
                      } while (m > 0);
                      for (n = u; 0 !== n; n--)
                        for (i = t.bl_count[n]; 0 !== i; )
                          (s = t.heap[--r]) > l ||
                            (h[2 * s + 1] !== n &&
                              ((t.opt_len += (n - h[2 * s + 1]) * h[2 * s]),
                              (h[2 * s + 1] = n)),
                            i--);
                    }
                  })(t, e),
                  w(n, l, t.bl_count);
              }
              function M(t, e, r) {
                var i,
                  s,
                  n = -1,
                  a = e[1],
                  o = 0,
                  h = 7,
                  l = 4;
                for (
                  0 === a && ((h = 138), (l = 3)),
                    e[2 * (r + 1) + 1] = 65535,
                    i = 0;
                  i <= r;
                  i++
                )
                  (s = a),
                    (a = e[2 * (i + 1) + 1]),
                    (++o < h && s === a) ||
                      (o < l
                        ? (t.bl_tree[2 * s] += o)
                        : 0 !== s
                        ? (s !== n && t.bl_tree[2 * s]++, t.bl_tree[32]++)
                        : o <= 10
                        ? t.bl_tree[34]++
                        : t.bl_tree[36]++,
                      (o = 0),
                      (n = s),
                      0 === a
                        ? ((h = 138), (l = 3))
                        : s === a
                        ? ((h = 6), (l = 3))
                        : ((h = 7), (l = 4)));
              }
              function D(t, e, r) {
                var i,
                  s,
                  n = -1,
                  a = e[1],
                  o = 0,
                  h = 7,
                  l = 4;
                for (0 === a && ((h = 138), (l = 3)), i = 0; i <= r; i++)
                  if (
                    ((s = a), (a = e[2 * (i + 1) + 1]), !(++o < h && s === a))
                  ) {
                    if (o < l)
                      do {
                        x(t, s, t.bl_tree);
                      } while (0 != --o);
                    else
                      0 !== s
                        ? (s !== n && (x(t, s, t.bl_tree), o--),
                          x(t, 16, t.bl_tree),
                          P(t, o - 3, 2))
                        : o <= 10
                        ? (x(t, 17, t.bl_tree), P(t, o - 3, 3))
                        : (x(t, 18, t.bl_tree), P(t, o - 11, 7));
                    (o = 0),
                      (n = s),
                      0 === a
                        ? ((h = 138), (l = 3))
                        : s === a
                        ? ((h = 6), (l = 3))
                        : ((h = 7), (l = 4));
                  }
              }
              s(g);
              var R = !1;
              function z(t, e, r, s) {
                P(t, 0 + (s ? 1 : 0), 3),
                  (function (t, e, r, s) {
                    A(t),
                      s && (S(t, r), S(t, ~r)),
                      i.arraySet(t.pending_buf, t.window, e, r, t.pending),
                      (t.pending += r);
                  })(t, e, r, !0);
              }
              (r._tr_init = function (t) {
                R ||
                  ((function () {
                    var t,
                      e,
                      r,
                      i,
                      s,
                      h = new Array(16);
                    for (r = 0, i = 0; i < 28; i++)
                      for (d[i] = r, t = 0; t < 1 << n[i]; t++) f[r++] = i;
                    for (f[r - 1] = i, s = 0, i = 0; i < 16; i++)
                      for (g[i] = s, t = 0; t < 1 << a[i]; t++) c[s++] = i;
                    for (s >>= 7; i < 30; i++)
                      for (g[i] = s << 7, t = 0; t < 1 << (a[i] - 7); t++)
                        c[256 + s++] = i;
                    for (e = 0; e <= 15; e++) h[e] = 0;
                    for (t = 0; t <= 143; ) (l[2 * t + 1] = 8), t++, h[8]++;
                    for (; t <= 255; ) (l[2 * t + 1] = 9), t++, h[9]++;
                    for (; t <= 279; ) (l[2 * t + 1] = 7), t++, h[7]++;
                    for (; t <= 287; ) (l[2 * t + 1] = 8), t++, h[8]++;
                    for (w(l, 287, h), t = 0; t < 30; t++)
                      (p[2 * t + 1] = 5), (p[2 * t] = k(t, 5));
                    (u = new v(l, n, 257, 286, 15)),
                      (m = new v(p, a, 0, 30, 15)),
                      (y = new v(new Array(0), o, 0, 19, 7));
                  })(),
                  (R = !0)),
                  (t.l_desc = new _(t.dyn_ltree, u)),
                  (t.d_desc = new _(t.dyn_dtree, m)),
                  (t.bl_desc = new _(t.bl_tree, y)),
                  (t.bi_buf = 0),
                  (t.bi_valid = 0),
                  E(t);
              }),
                (r._tr_stored_block = z),
                (r._tr_flush_block = function (t, e, r, i) {
                  var s,
                    n,
                    a = 0;
                  t.level > 0
                    ? (2 === t.strm.data_type &&
                        (t.strm.data_type = (function (t) {
                          var e,
                            r = 4093624447;
                          for (e = 0; e <= 31; e++, r >>>= 1)
                            if (1 & r && 0 !== t.dyn_ltree[2 * e]) return 0;
                          if (
                            0 !== t.dyn_ltree[18] ||
                            0 !== t.dyn_ltree[20] ||
                            0 !== t.dyn_ltree[26]
                          )
                            return 1;
                          for (e = 32; e < 256; e++)
                            if (0 !== t.dyn_ltree[2 * e]) return 1;
                          return 0;
                        })(t)),
                      F(t, t.l_desc),
                      F(t, t.d_desc),
                      (a = (function (t) {
                        var e;
                        for (
                          M(t, t.dyn_ltree, t.l_desc.max_code),
                            M(t, t.dyn_dtree, t.d_desc.max_code),
                            F(t, t.bl_desc),
                            e = 18;
                          e >= 3 && 0 === t.bl_tree[2 * h[e] + 1];
                          e--
                        );
                        return (t.opt_len += 3 * (e + 1) + 5 + 5 + 4), e;
                      })(t)),
                      (s = (t.opt_len + 3 + 7) >>> 3),
                      (n = (t.static_len + 3 + 7) >>> 3) <= s && (s = n))
                    : (s = n = r + 5),
                    r + 4 <= s && -1 !== e
                      ? z(t, e, r, i)
                      : 4 === t.strategy || n === s
                      ? (P(t, 2 + (i ? 1 : 0), 3), I(t, l, p))
                      : (P(t, 4 + (i ? 1 : 0), 3),
                        (function (t, e, r, i) {
                          var s;
                          for (
                            P(t, e - 257, 5),
                              P(t, r - 1, 5),
                              P(t, i - 4, 4),
                              s = 0;
                            s < i;
                            s++
                          )
                            P(t, t.bl_tree[2 * h[s] + 1], 3);
                          D(t, t.dyn_ltree, e - 1), D(t, t.dyn_dtree, r - 1);
                        })(
                          t,
                          t.l_desc.max_code + 1,
                          t.d_desc.max_code + 1,
                          a + 1
                        ),
                        I(t, t.dyn_ltree, t.dyn_dtree)),
                    E(t),
                    i && A(t);
                }),
                (r._tr_tally = function (t, e, r) {
                  return (
                    (t.pending_buf[t.d_buf + 2 * t.last_lit] = (e >>> 8) & 255),
                    (t.pending_buf[t.d_buf + 2 * t.last_lit + 1] = 255 & e),
                    (t.pending_buf[t.l_buf + t.last_lit] = 255 & r),
                    t.last_lit++,
                    0 === e
                      ? t.dyn_ltree[2 * r]++
                      : (t.matches++,
                        e--,
                        t.dyn_ltree[2 * (f[r] + 256 + 1)]++,
                        t.dyn_dtree[2 * b(e)]++),
                    t.last_lit === t.lit_bufsize - 1
                  );
                }),
                (r._tr_align = function (t) {
                  P(t, 2, 3),
                    x(t, 256, l),
                    (function (t) {
                      16 === t.bi_valid
                        ? (S(t, t.bi_buf), (t.bi_buf = 0), (t.bi_valid = 0))
                        : t.bi_valid >= 8 &&
                          ((t.pending_buf[t.pending++] = 255 & t.bi_buf),
                          (t.bi_buf >>= 8),
                          (t.bi_valid -= 8));
                    })(t);
                });
            },
            { '../utils/common': 41 },
          ],
          53: [
            function (t, e, r) {
              e.exports = function () {
                (this.input = null),
                  (this.next_in = 0),
                  (this.avail_in = 0),
                  (this.total_in = 0),
                  (this.output = null),
                  (this.next_out = 0),
                  (this.avail_out = 0),
                  (this.total_out = 0),
                  (this.msg = ''),
                  (this.state = null),
                  (this.data_type = 2),
                  (this.adler = 0);
              };
            },
            {},
          ],
          54: [
            function (t, e, r) {
              e.exports =
                'function' == typeof setImmediate
                  ? setImmediate
                  : function () {
                      var t = [].slice.apply(arguments);
                      t.splice(1, 0, 0), setTimeout.apply(null, t);
                    };
            },
            {},
          ],
        },
        {},
        [10]
      )(10);
    });
  function _templateObject() {
    const t = _taggedTemplateLiteral([
      '\n* {\n  box-sizing: border-box;\n  padding: 0;\n  margin: 0;\n}\n\n:host {\n  --lottie-player-toolbar-height: 35px;\n  --lottie-player-toolbar-background-color: transparent;\n  --lottie-player-toolbar-icon-color: #999;\n  --lottie-player-toolbar-icon-hover-color: #222;\n  --lottie-player-toolbar-icon-active-color: #555;\n  --lottie-player-seeker-track-color: #CCC;\n  --lottie-player-seeker-thumb-color: rgba(0, 107, 120, 0.8);\n\n  display: block;\n}\n\n.main {\n  display: grid;\n  grid-auto-columns: auto;\n  grid-template-rows: auto;\n  height: inherit;\n  width: inherit;\n}\n\n.main.controls {\n  grid-template-rows: 1fr var(--lottie-player-toolbar-height);\n}\n\n.animation {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: inherit;\n  height: inherit;\n}\n\n.toolbar {\n  display: grid;\n  grid-template-columns: 32px 32px 1fr 32px;\n  align-items: center;\n  justify-items: center;\n  background-color: var(--lottie-player-toolbar-background-color);\n}\n\n.toolbar button {\n  cursor: pointer;\n  fill: var(--lottie-player-toolbar-icon-color);\n  display: flex;\n  background: none;\n  border: 0;\n  padding: 0;\n  outline: none;\n  height: 100%;\n}\n\n.toolbar button:hover {\n  fill: var(--lottie-player-toolbar-icon-hover-color);\n}\n\n.toolbar button.active {\n  fill: var(--lottie-player-toolbar-icon-active-color);\n}\n\n.toolbar button svg {\n}\n\n.toolbar button.disabled svg {\n  display: none;\n}\n\n.toolbar a {\n  filter: grayscale(100%);\n  display: flex;\n  transition: filter .5s, opacity 0.5s;\n  opacity: 0.4;\n  height: 100%;\n  align-items: center;\n}\n\n.toolbar a:hover {\n  filter: none;\n  display: flex;\n  opacity: 1;\n}\n\n.toolbar a svg {\n}\n\n.seeker {\n  -webkit-appearance: none;\n  width: 95%;\n  outline: none;\n}\n\n.seeker::-webkit-slider-runnable-track {\n  width: 100%;\n  height: 5px;\n  cursor: pointer;\n  background: var(--lottie-player-seeker-track-color);\n  border-radius: 3px;\n}\n.seeker::-webkit-slider-thumb {\n  height: 15px;\n  width: 15px;\n  border-radius: 50%;\n  background: var(--lottie-player-seeker-thumb-color);\n  cursor: pointer;\n  -webkit-appearance: none;\n  margin-top: -5px;\n}\n.seeker:focus::-webkit-slider-runnable-track {\n  background: #999;\n}\n.seeker::-moz-range-track {\n  width: 100%;\n  height: 5px;\n  cursor: pointer;\n  background: var(--lottie-player-seeker-track-color);\n  border-radius: 3px;\n}\n.seeker::-moz-range-thumb {\n  height: 15px;\n  width: 15px;\n  border-radius: 50%;\n  background: var(--lottie-player-seeker-thumb-color);\n  cursor: pointer;\n}\n.seeker::-ms-track {\n  width: 100%;\n  height: 5px;\n  cursor: pointer;\n  background: transparent;\n  border-color: transparent;\n  color: transparent;\n}\n.seeker::-ms-fill-lower {\n  background: var(--lottie-player-seeker-track-color);\n  border-radius: 3px;\n}\n.seeker::-ms-fill-upper {\n  background: var(--lottie-player-seeker-track-color);\n  border-radius: 3px;\n}\n.seeker::-ms-thumb {\n  border: 0;\n  height: 15px;\n  width: 15px;\n  border-radius: 50%;\n  background: var(--lottie-player-seeker-thumb-color);\n  cursor: pointer;\n}\n.seeker:focus::-ms-fill-lower {\n  background: var(--lottie-player-seeker-track-color);\n}\n.seeker:focus::-ms-fill-upper {\n  background: var(--lottie-player-seeker-track-color);\n}\n\n.error {\n  display: flex;\n  justify-content: center;\n  height: 100%;\n  align-items: center;\n}\n',
    ]);
    return (
      (_templateObject = function () {
        return t;
      }),
      t
    );
  }
  var styles = css(_templateObject()),
    PlayerState,
    PlayMode,
    PlayerEvents;
  function _templateObject5() {
    const t = _taggedTemplateLiteral([
      '\n                <div class="error">⚠</div>\n              ',
    ]);
    return (
      (_templateObject5 = function () {
        return t;
      }),
      t
    );
  }
  function _templateObject4() {
    const t = _taggedTemplateLiteral([
      '\n      <div class=',
      '>\n        <div class="animation" style=',
      '>\n          ',
      '\n        </div>\n        ',
      '\n      </div>\n    ',
    ]);
    return (
      (_templateObject4 = function () {
        return t;
      }),
      t
    );
  }
  function _templateObject3() {
    const t = _taggedTemplateLiteral([
      '\n                <svg width="24" height="24"><path d="M8.016 5.016L18.985 12 8.016 18.984V5.015z" /></svg>\n              ',
    ]);
    return (
      (_templateObject3 = function () {
        return t;
      }),
      t
    );
  }
  function _templateObject2() {
    const t = _taggedTemplateLiteral([
      '\n                <svg width="24" height="24">\n                  <path d="M14.016 5.016H18v13.969h-3.984V5.016zM6 18.984V5.015h3.984v13.969H6z" />\n                </svg>\n              ',
    ]);
    return (
      (_templateObject2 = function () {
        return t;
      }),
      t
    );
  }
  function _templateObject$1() {
    const t = _taggedTemplateLiteral([
      '\n      <div class="toolbar">\n        <button @click=',
      ' class=',
      '>\n          ',
      '\n        </button>\n        <button @click=',
      ' class=',
      '>\n          <svg width="24" height="24"><path d="M6 6h12v12H6V6z" /></svg>\n        </button>\n        <input\n          class="seeker"\n          type="range"\n          min="0"\n          step="1"\n          max="100"\n          .value=',
      '\n          @input=',
      '\n          @mousedown=',
      '\n          @mouseup=',
      '\n        />\n        <button @click=',
      ' class=',
      '>\n          <svg width="24" height="24">\n            <path\n              d="M17.016 17.016v-4.031h1.969v6h-12v3l-3.984-3.984 3.984-3.984v3h10.031zM6.984 6.984v4.031H5.015v-6h12v-3l3.984 3.984-3.984 3.984v-3H6.984z"\n            />\n          </svg>\n        </button>\n      </div>\n    ',
    ]);
    return (
      (_templateObject$1 = function () {
        return t;
      }),
      t
    );
  }
  function fetchPath(t) {
    return new Promise((e, r) => {
      const i = new XMLHttpRequest();
      i.open('GET', t, !0),
        (i.responseType = 'arraybuffer'),
        i.send(),
        (i.onreadystatechange = function () {
          4 == i.readyState &&
            200 == i.status &&
            jszip
              .loadAsync(i.response)
              .then((t) => {
                t.file('manifest.json')
                  .async('string')
                  .then((r) => {
                    const i = JSON.parse(r);
                    if (!('animations' in i))
                      throw new Error('Manifest not found');
                    if (0 === i.animations.length)
                      throw new Error('No animations listed in the manifest');
                    const s = i.animations[0];
                    t.file('animations/'.concat(s.id, '.json'))
                      .async('string')
                      .then((r) => {
                        const i = JSON.parse(r);
                        'assets' in i &&
                          Promise.all(
                            i.assets.map((e) => {
                              if (e.p && null != t.file('images/'.concat(e.p)))
                                return new Promise((r) => {
                                  t.file('images/'.concat(e.p))
                                    .async('base64')
                                    .then((t) => {
                                      (e.p = 'data:;base64,' + t),
                                        (e.e = 1),
                                        r();
                                    });
                                });
                            })
                          ).then(() => {
                            e(i);
                          });
                      });
                  });
              })
              .catch((t) => {
                r(t);
              });
        });
    });
  }
  (PlayerState = exports.PlayerState || (exports.PlayerState = {})),
    (PlayerState.Loading = 'loading'),
    (PlayerState.Playing = 'playing'),
    (PlayerState.Paused = 'paused'),
    (PlayerState.Stopped = 'stopped'),
    (PlayerState.Frozen = 'frozen'),
    (PlayerState.Error = 'error'),
    (PlayMode = exports.PlayMode || (exports.PlayMode = {})),
    (PlayMode.Normal = 'normal'),
    (PlayMode.Bounce = 'bounce'),
    (PlayerEvents = exports.PlayerEvents || (exports.PlayerEvents = {})),
    (PlayerEvents.Load = 'load'),
    (PlayerEvents.Error = 'error'),
    (PlayerEvents.Ready = 'ready'),
    (PlayerEvents.Play = 'play'),
    (PlayerEvents.Pause = 'pause'),
    (PlayerEvents.Stop = 'stop'),
    (PlayerEvents.Freeze = 'freeze'),
    (PlayerEvents.Loop = 'loop'),
    (PlayerEvents.Complete = 'complete'),
    (PlayerEvents.Frame = 'frame'),
    (exports.DotLottiePlayer = class extends LitElement {
      constructor() {
        super(...arguments),
          (this.mode = exports.PlayMode.Normal),
          (this.autoplay = !1),
          (this.background = 'transparent'),
          (this.controls = !1),
          (this.direction = 1),
          (this.hover = !1),
          (this.loop = !1),
          (this.renderer = 'svg'),
          (this.speed = 1),
          (this.currentState = exports.PlayerState.Loading),
          (this.intermission = 1),
          (this._counter = 0);
      }
      _onVisibilityChange() {
        document.hidden && this.currentState === exports.PlayerState.Playing
          ? this.freeze()
          : this.currentState === exports.PlayerState.Frozen && this.play();
      }
      _handleSeekChange(t) {
        if (!this._lottie || isNaN(t.target.value)) return;
        const e = (t.target.value / 100) * this._lottie.totalFrames;
        this.seek(e);
      }
      async load(t) {
        if (!this.shadowRoot) return;
        const e = {
          container: this.container,
          loop: !1,
          autoplay: !1,
          renderer: this.renderer,
          rendererSettings: {
            scaleMode: 'noScale',
            clearCanvas: !1,
            progressiveLoad: !0,
            hideOnTransparent: !0,
          },
        };
        try {
          const r = await fetchPath(t);
          this._lottie && this._lottie.destroy(),
            (this._lottie = lottie_svg.loadAnimation(
              Object.assign(Object.assign({}, e), { animationData: r })
            ));
        } catch (t) {
          return (
            (this.currentState = exports.PlayerState.Error),
            void this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Error))
          );
        }
        this._lottie &&
          (this._lottie.addEventListener('enterFrame', () => {
            (this.seeker =
              (this._lottie.currentFrame / this._lottie.totalFrames) * 100),
              this.dispatchEvent(
                new CustomEvent(exports.PlayerEvents.Frame, {
                  detail: {
                    frame: this._lottie.currentFrame,
                    seeker: this.seeker,
                  },
                })
              );
          }),
          this._lottie.addEventListener('complete', () => {
            this.currentState === exports.PlayerState.Playing
              ? !this.loop || (this.count && this._counter >= this.count)
                ? this.dispatchEvent(
                    new CustomEvent(exports.PlayerEvents.Complete)
                  )
                : this.mode === exports.PlayMode.Bounce
                ? (this.count && (this._counter += 0.5),
                  setTimeout(() => {
                    this.dispatchEvent(
                      new CustomEvent(exports.PlayerEvents.Loop)
                    ),
                      this.currentState === exports.PlayerState.Playing &&
                        (this._lottie.setDirection(
                          -1 * this._lottie.playDirection
                        ),
                        this._lottie.play());
                  }, this.intermission))
                : (this.count && (this._counter += 1),
                  window.setTimeout(() => {
                    this.dispatchEvent(
                      new CustomEvent(exports.PlayerEvents.Loop)
                    ),
                      this.currentState === exports.PlayerState.Playing &&
                        (this._lottie.stop(), this._lottie.play());
                  }, this.intermission))
              : this.dispatchEvent(
                  new CustomEvent(exports.PlayerEvents.Complete)
                );
          }),
          this._lottie.addEventListener('DOMLoaded', () => {
            this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Ready));
          }),
          this._lottie.addEventListener('data_ready', () => {
            this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Load));
          }),
          this._lottie.addEventListener('data_failed', () => {
            (this.currentState = exports.PlayerState.Error),
              this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Error));
          }),
          this.container.addEventListener('mouseenter', () => {
            this.hover &&
              this.currentState !== exports.PlayerState.Playing &&
              this.play();
          }),
          this.container.addEventListener('mouseleave', () => {
            this.hover &&
              this.currentState === exports.PlayerState.Playing &&
              this.stop();
          }),
          this.setSpeed(this.speed),
          this.setDirection(this.direction),
          this.autoplay && this.play());
      }
      getLottie() {
        return this._lottie;
      }
      play() {
        this._lottie &&
          (this._lottie.play(),
          (this.currentState = exports.PlayerState.Playing),
          this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Play)));
      }
      pause() {
        this._lottie &&
          (this._lottie.pause(),
          (this.currentState = exports.PlayerState.Paused),
          this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Pause)));
      }
      stop() {
        this._lottie &&
          ((this._counter = 0),
          this._lottie.stop(),
          (this.currentState = exports.PlayerState.Stopped),
          this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Stop)));
      }
      seek(t) {
        if (!this._lottie) return;
        const e = t.toString().match(/^([0-9]+)(%?)$/);
        if (!e) return;
        const r =
          '%' === e[2] ? (this._lottie.totalFrames * Number(e[1])) / 100 : e[1];
        (this.seeker = r),
          this.currentState === exports.PlayerState.Playing
            ? this._lottie.goToAndPlay(r, !0)
            : (this._lottie.goToAndStop(r, !0), this._lottie.pause());
      }
      snapshot() {
        let t =
          !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
        if (!this.shadowRoot) return;
        const e = this.shadowRoot.querySelector('.animation svg'),
          r = new XMLSerializer().serializeToString(e);
        if (t) {
          const t = document.createElement('a');
          (t.href =
            'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(r)),
            (t.download = 'download_' + this.seeker + '.svg'),
            document.body.appendChild(t),
            t.click(),
            document.body.removeChild(t);
        }
        return r;
      }
      freeze() {
        this._lottie &&
          (this._lottie.pause(),
          (this.currentState = exports.PlayerState.Frozen),
          this.dispatchEvent(new CustomEvent(exports.PlayerEvents.Freeze)));
      }
      setSpeed() {
        let t =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
        this._lottie && this._lottie.setSpeed(t);
      }
      setDirection(t) {
        this._lottie && this._lottie.setDirection(t);
      }
      setLooping(t) {
        this._lottie && ((this.loop = t), (this._lottie.loop = t));
      }
      togglePlay() {
        return this.currentState === exports.PlayerState.Playing
          ? this.pause()
          : this.play();
      }
      toggleLooping() {
        this.setLooping(!this.loop);
      }
      static get styles() {
        return styles;
      }
      async firstUpdated() {
        'IntersectionObserver' in window &&
          ((this._io = new IntersectionObserver((t) => {
            t[0].isIntersecting
              ? this.currentState === exports.PlayerState.Frozen && this.play()
              : this.currentState === exports.PlayerState.Playing &&
                this.freeze();
          })),
          this._io.observe(this.container)),
          void 0 !== document.hidden &&
            document.addEventListener('visibilitychange', () =>
              this._onVisibilityChange()
            ),
          this.src && (await this.load(this.src));
      }
      disconnectedCallback() {
        this._io && (this._io.disconnect(), (this._io = void 0)),
          document.removeEventListener('visibilitychange', () =>
            this._onVisibilityChange()
          );
      }
      renderControls() {
        const t = this.currentState === exports.PlayerState.Playing,
          e = this.currentState === exports.PlayerState.Paused,
          r = this.currentState === exports.PlayerState.Stopped;
        return html(
          _templateObject$1(),
          this.togglePlay,
          t || e ? 'active' : '',
          html(t ? _templateObject2() : _templateObject3()),
          this.stop,
          r ? 'active' : '',
          this.seeker,
          this._handleSeekChange,
          () => {
            (this._prevState = this.currentState), this.freeze();
          },
          () => {
            this._prevState === exports.PlayerState.Playing && this.play();
          },
          this.toggleLooping,
          this.loop ? 'active' : ''
        );
      }
      render() {
        const t = this.controls ? 'controls' : '';
        return html(
          _templateObject4(),
          'main ' + t,
          'background:' + this.background,
          this.currentState === exports.PlayerState.Error
            ? html(_templateObject5())
            : void 0,
          this.controls ? this.renderControls() : void 0
        );
      }
    }),
    __decorate(
      [query('.animation')],
      exports.DotLottiePlayer.prototype,
      'container',
      void 0
    ),
    __decorate([property()], exports.DotLottiePlayer.prototype, 'mode', void 0),
    __decorate(
      [property({ type: Boolean })],
      exports.DotLottiePlayer.prototype,
      'autoplay',
      void 0
    ),
    __decorate(
      [property({ type: String, reflect: !0 })],
      exports.DotLottiePlayer.prototype,
      'background',
      void 0
    ),
    __decorate(
      [property({ type: Boolean })],
      exports.DotLottiePlayer.prototype,
      'controls',
      void 0
    ),
    __decorate(
      [property({ type: Number })],
      exports.DotLottiePlayer.prototype,
      'count',
      void 0
    ),
    __decorate(
      [property({ type: Number })],
      exports.DotLottiePlayer.prototype,
      'direction',
      void 0
    ),
    __decorate(
      [property({ type: Boolean })],
      exports.DotLottiePlayer.prototype,
      'hover',
      void 0
    ),
    __decorate(
      [property({ type: Boolean, reflect: !0 })],
      exports.DotLottiePlayer.prototype,
      'loop',
      void 0
    ),
    __decorate(
      [property({ type: String })],
      exports.DotLottiePlayer.prototype,
      'renderer',
      void 0
    ),
    __decorate(
      [property({ type: Number })],
      exports.DotLottiePlayer.prototype,
      'speed',
      void 0
    ),
    __decorate(
      [property({ type: String })],
      exports.DotLottiePlayer.prototype,
      'src',
      void 0
    ),
    __decorate(
      [property({ type: String })],
      exports.DotLottiePlayer.prototype,
      'currentState',
      void 0
    ),
    __decorate(
      [property()],
      exports.DotLottiePlayer.prototype,
      'seeker',
      void 0
    ),
    __decorate(
      [property()],
      exports.DotLottiePlayer.prototype,
      'intermission',
      void 0
    ),
    (exports.DotLottiePlayer = __decorate(
      [customElement('dotlottie-player')],
      exports.DotLottiePlayer
    )),
    (exports.fetchPath = fetchPath),
    Object.defineProperty(exports, '__esModule', { value: !0 });
});
//# sourceMappingURL=dotlottie-player.js.map
