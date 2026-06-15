/* ============================================
   ATTACHMENT CHIPS — Tray controller with drag-drop, paste, file-type detection
   Inspired by ChatGPT composer, Claude attachments
   ============================================
   Usage:
     var tray = AttachmentChips.init('.atc-tray', {
       onAdd: function (file) {},          // upload here; return Promise<{progress, done}>
       onRemove: function (file) {},
       allow: ['image/*', 'application/pdf', 'text/*'],
       max: 10,
       dropZone: '#composer'   // optional: bind drag-drop to a wrapper
     });

     tray.add(file);
     tray.list();              // current attachments
     tray.clear();
     tray.setProgress(file, 0.5);
     tray.markError(file, 'too large');
     tray.markDone(file);

     AttachmentChips.iconFor('photo.png')   → '🖼' (+ type class)
     AttachmentChips.typeOf(file)           → 'img' | 'pdf' | 'code' | ...
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    onAdd: null,
    onRemove: null,
    allow: null,           // mime patterns; null = anything
    max: 20,
    maxSize: null,         // bytes
    dropZone: null,
    pasteFromClipboard: true,
    largePreview: false
  };

  var iconMap = {
    img:   '🖼',
    pdf:   '📄',
    audio: '🎵',
    video: '🎬',
    code:  '⟨/⟩',
    text:  '📝',
    zip:   '🗂',
    csv:   '📊',
    json:  '{ }',
    md:    'M↓',
    link:  '🔗',
    default: '📎'
  };

  function init(target, opts) {
    var tray = typeof target === 'string' ? document.querySelector(target) : target;
    if (!tray) return null;
    var o = mergeOpts(opts);
    tray.classList.add('atc-tray');

    var attachments = []; // {file, el, status}

    function add(file) {
      if (o.max && attachments.length >= o.max) return false;
      if (o.maxSize && file.size > o.maxSize) {
        renderChip(file, 'error', 'too large');
        return false;
      }
      if (o.allow && !o.allow.some(function (p) { return matchMime(p, file.type || ''); })) {
        renderChip(file, 'error', 'not allowed');
        return false;
      }
      var entry = renderChip(file, 'uploading');
      attachments.push(entry);

      if (typeof o.onAdd === 'function') {
        var ret = o.onAdd(file, entry);
        if (ret && typeof ret.then === 'function') {
          ret.then(function () { markDone(file); })
             .catch(function (err) { markError(file, err && err.message); });
        }
      } else {
        markDone(file);
      }
      return entry;
    }

    function renderChip(file, status, errMsg) {
      var type = typeOf(file);
      var chip = document.createElement('div');
      chip.className = 'atc atc-' + type + ' atc-' + status;
      var name = file.name || '';
      var size = formatSize(file.size || 0);

      var html = '';
      if (type === 'img' && window.URL) {
        var url = URL.createObjectURL(file);
        html += '<img class="atc-thumb" src="' + url + '" alt="">';
        chip.dataset.objectUrl = url;
      } else {
        html += '<span class="atc-icon">' + iconMap[type] + '</span>';
      }
      html +=
        '<span class="atc-name">' + escape(name) + '</span>' +
        '<span class="atc-size">' + size + '</span>' +
        '<span class="atc-progress" style="--p: 0"></span>' +
        '<button class="atc-remove" type="button" aria-label="Remove">✕</button>';
      chip.innerHTML = html;

      chip.querySelector('.atc-remove').addEventListener('click', function () {
        remove(file);
      });

      tray.appendChild(chip);
      return { file: file, el: chip, status: status, error: errMsg };
    }

    function remove(file) {
      for (var i = 0; i < attachments.length; i++) {
        if (attachments[i].file === file) {
          var entry = attachments[i];
          if (entry.el.dataset.objectUrl) URL.revokeObjectURL(entry.el.dataset.objectUrl);
          entry.el.remove();
          attachments.splice(i, 1);
          if (typeof o.onRemove === 'function') o.onRemove(file);
          return;
        }
      }
    }

    function setProgress(file, pct) {
      var entry = entryFor(file);
      if (!entry) return;
      entry.el.querySelector('.atc-progress').style.setProperty('--p', pct);
    }

    function markDone(file) {
      var entry = entryFor(file);
      if (!entry) return;
      entry.el.classList.remove('atc-uploading');
      entry.el.classList.add('atc-staged', 'atc-success');
      entry.status = 'staged';
    }

    function markError(file, msg) {
      var entry = entryFor(file);
      if (!entry) return;
      entry.el.classList.remove('atc-uploading');
      entry.el.classList.add('atc-error');
      entry.status = 'error';
      entry.error = msg;
      if (msg) entry.el.title = msg;
    }

    function clear() {
      attachments.slice().forEach(function (a) { remove(a.file); });
    }

    function list() { return attachments.slice(); }
    function entryFor(file) {
      for (var i = 0; i < attachments.length; i++) if (attachments[i].file === file) return attachments[i];
      return null;
    }

    // Drag-drop binding
    var dropEl = o.dropZone
      ? (typeof o.dropZone === 'string' ? document.querySelector(o.dropZone) : o.dropZone)
      : tray;
    if (dropEl) {
      dropEl.classList.add('atc-drop');
      dropEl.addEventListener('dragover', function (e) {
        e.preventDefault();
        dropEl.classList.add('is-dragover');
      });
      dropEl.addEventListener('dragleave', function () { dropEl.classList.remove('is-dragover'); });
      dropEl.addEventListener('drop', function (e) {
        e.preventDefault();
        dropEl.classList.remove('is-dragover');
        Array.prototype.forEach.call(e.dataTransfer.files, add);
      });
    }

    // Paste from clipboard
    if (o.pasteFromClipboard) {
      window.addEventListener('paste', function (e) {
        if (!e.clipboardData) return;
        Array.prototype.forEach.call(e.clipboardData.items, function (it) {
          if (it.kind === 'file') {
            var f = it.getAsFile();
            if (f) add(f);
          }
        });
      });
    }

    return {
      tray: tray,
      add: add,
      remove: remove,
      clear: clear,
      list: list,
      setProgress: setProgress,
      markDone: markDone,
      markError: markError
    };
  }

  function typeOf(file) {
    var name = (file.name || '').toLowerCase();
    var mime = (file.type || '').toLowerCase();
    if (mime.indexOf('image/') === 0) return 'img';
    if (mime === 'application/pdf' || name.endsWith('.pdf')) return 'pdf';
    if (mime.indexOf('audio/') === 0) return 'audio';
    if (mime.indexOf('video/') === 0) return 'video';
    if (/\.(zip|tar|gz|rar|7z)$/.test(name)) return 'zip';
    if (/\.(csv)$/.test(name) || mime === 'text/csv') return 'csv';
    if (/\.(json)$/.test(name) || mime === 'application/json') return 'json';
    if (/\.(md|markdown)$/.test(name)) return 'md';
    if (/\.(js|ts|jsx|tsx|py|rs|go|c|cpp|h|hpp|java|rb|php|sh|css|html)$/.test(name)) return 'code';
    if (mime.indexOf('text/') === 0) return 'text';
    return 'default';
  }

  function iconFor(name) {
    return iconMap[typeOf({ name: name, type: '' })] || iconMap.default;
  }

  function matchMime(pattern, mime) {
    if (pattern === '*' || pattern === '*/*') return true;
    if (pattern.endsWith('/*')) return mime.indexOf(pattern.slice(0, -1)) === 0;
    return pattern === mime;
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1).replace(/\.0$/, '') + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / 1048576).toFixed(1).replace(/\.0$/, '') + ' MB';
    return (bytes / 1073741824).toFixed(2) + ' GB';
  }

  function escape(s) {
    return String(s == null ? '' : s).replace(/[<>&"]/g, function (c) {
      return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]);
    });
  }
  function mergeOpts(opts) {
    var o = {}; for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];
    return o;
  }

  var AttachmentChips = {
    init: init,
    typeOf: typeOf,
    iconFor: iconFor,
    formatSize: formatSize,
    iconMap: iconMap
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = AttachmentChips;
  else root.AttachmentChips = AttachmentChips;
})(typeof window !== 'undefined' ? window : this);
