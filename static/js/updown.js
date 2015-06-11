upload.modules.addmodule({
    name: 'updown',
    init: function () {

    },
    downloadfromident: function(seed, progress, done, ident) {
        var xhr = new XMLHttpRequest()
        xhr.onload = this.downloaded.bind(this, seed, progress, done)
        xhr.open('GET', (upload.config.server ? upload.config.server : '') + 'i/' + ident.ident)
        xhr.responseType = 'blob'
        xhr.onerror = this.onerror.bind(this, progress)
        xhr.addEventListener('progress', progress, false)
        xhr.send()
    },
    onerror: function(progress) {
      progress('error')
    },
    downloaded: function (seed, progress, done, response) {
        if (response.target.status != 200) {
          this.onerror(progress)
        } else {
          progress('decrypting')
          crypt.decrypt(response.target.response, seed).done(done)
        }
    },
    encrypted: function(progress, done, data) {
        var formdata = new FormData()
        formdata.append('privkey', 'c61540b5ceecd05092799f936e27755f')
        formdata.append('ident', data.ident)
        formdata.append('file', data.encrypted)
        $.ajax({
            url: (upload.config.server ? upload.config.server : '') + 'up',
            data: formdata,
            cache: false,
            processData: false,
            contentType: false,
            dataType: 'json',
            xhr: function () {
                var xhr = new XMLHttpRequest()
                xhr.upload.addEventListener('progress', progress, false)
                return xhr
            },
            type: 'POST'
        }).done(done.bind(undefined, data))
    },
    download: function (seed, progress, done) {
        crypt.ident(seed).done(this.downloadfromident.bind(this, seed, progress, done))
    },
    upload: function (blob, progress, done) {
        crypt.encrypt(blob).done(this.encrypted.bind(this, progress, done))
    }
})