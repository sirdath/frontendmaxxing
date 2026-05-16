/* ============================================
   FILE UPLOAD — Drag/drop + click to pick, previews, size validation
   Inspired by Vercel / Linear upload patterns
   ============================================
   Usage:
     FileUpload.init('[data-file-upload]', {
       accept: 'image/*',
       maxSize: 5 * 1024 * 1024,
       multiple: true,
       onAdd:    function (file) { … },
       onRemove: function (file) { … },
       onError:  function (file, msg) { … }
     });

     // Trigger upload (your code):
     instance.files       // array of File
     instance.upload(fn)  // fn(file, {setProgress, resolve, reject})
   ============================================ */
(function (root) {
  'use strict';

  var defaults = {
    accept: null,
    maxSize: null,        // bytes; null = unlimited
    multiple: true,
    onAdd: null,
    onRemove: null,
    onError: null
  };

  function init(target, opts) {
    var els = typeof target === 'string'
      ? document.querySelectorAll(target)
      : (target.length ? target : [target]);
    var instances = [];
    Array.prototype.forEach.call(els, function (el) { instances.push(createInstance(el, opts)); });
    return instances.length === 1 ? instances[0] : instances;
  }

  function fmtSize(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / (1024 * 1024)).toFixed(2) + ' MB';
  }

  function ext(name) {
    var m = /\.([^.]+)$/.exec(name);
    return m ? m[1].toUpperCase() : '';
  }

  function createInstance(el, opts) {
    var o = {};
    for (var k in defaults) o[k] = defaults[k];
    if (opts) for (var k2 in opts) o[k2] = opts[k2];

    var input = el.querySelector('input[type="file"]');
    if (!input) {
      input = document.createElement('input');
      input.type = 'file';
      input.hidden = true;
      el.appendChild(input);
    }
    if (o.accept)   input.accept = o.accept;
    if (o.multiple) input.multiple = true;

    var drop = el.querySelector('.fup-drop');
    var list = el.querySelector('.fup-list');
    if (!list) {
      list = document.createElement('div');
      list.className = 'fup-list';
      el.appendChild(list);
    }

    var files = [];        // [{ file, node, controllers }]

    function addFile(file) {
      if (o.maxSize && file.size > o.maxSize) {
        if (typeof o.onError === 'function') o.onError(file, 'File too large');
        renderError(file, 'File exceeds ' + fmtSize(o.maxSize));
        return;
      }
      var node = document.createElement('div');
      node.className = 'fup-item';
      var isImg = file.type.indexOf('image/') === 0;
      var thumbHTML;
      if (isImg) {
        var url = URL.createObjectURL(file);
        thumbHTML = '<img src="' + url + '" alt="">';
      } else {
        thumbHTML = ext(file.name) || 'FILE';
      }
      node.innerHTML =
        '<div class="fup-item-thumb">' + thumbHTML + '</div>' +
        '<div class="fup-item-body">' +
          '<div class="fup-item-name">' + escape(file.name) + '</div>' +
          '<div class="fup-item-meta">' + fmtSize(file.size) + '</div>' +
          '<div class="fup-item-progress" hidden><span></span></div>' +
        '</div>' +
        '<button class="fup-item-remove" type="button" aria-label="Remove">×</button>';
      list.appendChild(node);

      var entry = { file: file, node: node };
      files.push(entry);
      el.classList.add('has-files');

      node.querySelector('.fup-item-remove').addEventListener('click', function () { removeFile(entry); });

      if (typeof o.onAdd === 'function') o.onAdd(file);
    }

    function removeFile(entry) {
      entry.node.remove();
      files = files.filter(function (e) { return e !== entry; });
      if (!files.length) el.classList.remove('has-files');
      if (typeof o.onRemove === 'function') o.onRemove(entry.file);
    }

    function renderError(file, msg) {
      var node = document.createElement('div');
      node.className = 'fup-item';
      node.innerHTML =
        '<div class="fup-item-thumb">⚠</div>' +
        '<div class="fup-item-body">' +
          '<div class="fup-item-name">' + escape(file.name) + '</div>' +
          '<div class="fup-item-error">' + escape(msg) + '</div>' +
        '</div>' +
        '<button class="fup-item-remove" type="button">×</button>';
      list.appendChild(node);
      node.querySelector('.fup-item-remove').addEventListener('click', function () { node.remove(); });
    }

    function handleFiles(fileList) {
      Array.prototype.forEach.call(fileList, addFile);
    }

    function onInputChange() { handleFiles(input.files); input.value = ''; }
    function onDropClick()   { input.click(); }

    function onDragOver(e) { e.preventDefault(); el.classList.add('is-dragging'); }
    function onDragLeave() { el.classList.remove('is-dragging'); }
    function onDrop(e) {
      e.preventDefault();
      el.classList.remove('is-dragging');
      if (e.dataTransfer.files && e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
    }

    input.addEventListener('change', onInputChange);
    if (drop) drop.addEventListener('click', onDropClick);
    el.addEventListener('dragover', onDragOver);
    el.addEventListener('dragleave', onDragLeave);
    el.addEventListener('drop', onDrop);

    function escape(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    function upload(uploader) {
      return Promise.all(files.map(function (entry) {
        var progressBar = entry.node.querySelector('.fup-item-progress');
        var progressInner = progressBar.querySelector('span');
        progressBar.hidden = false;
        return new Promise(function (resolve, reject) {
          uploader(entry.file, {
            setProgress: function (p) {
              progressInner.style.setProperty('--fup-progress', (p * 100) + '%');
              progressInner.style.width = (p * 100) + '%';
            },
            resolve: resolve,
            reject: reject
          });
        });
      }));
    }

    function destroy() {
      input.removeEventListener('change', onInputChange);
      if (drop) drop.removeEventListener('click', onDropClick);
      el.removeEventListener('dragover', onDragOver);
      el.removeEventListener('dragleave', onDragLeave);
      el.removeEventListener('drop', onDrop);
    }

    return {
      el: el,
      get files() { return files.map(function (e) { return e.file; }); },
      upload: upload,
      clear: function () { files.slice().forEach(removeFile); },
      destroy: destroy
    };
  }

  var FileUpload = { init: init };

  if (typeof module !== 'undefined' && module.exports) module.exports = FileUpload;
  else root.FileUpload = FileUpload;
})(typeof window !== 'undefined' ? window : this);
