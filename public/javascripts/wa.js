;(function(window) {
    const wa = {
        context: null,
        gain: null,
        source: null,
        _buffers: {},

        _initialize: function() {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.gain = this.context.createGain();
            this.gain.connect(this.context.destination);
        },

        playSilent: function() {
            var context = this.context;
            var buf = context.createBuffer(1, 1, 22050);
            var src = context.createBufferSource();
            src.buffer = buf;
            src.connect(context.destination);
            src.start(0);
        },
        changeVolume: function(vol) {
            this.gain.gain.value = vol * 2 / 100;
            console.log('volume set to : ' + this.gain.gain.value);

        },
        stop: function() {
            if(this.source === null) return;
            this.source.stop();
            this.source = null;
        },
        play: function(buffer) {
            if(typeof buffer === 'string') {
                buffer = this._buffers[buffer];
                if(!buffer) {
                    console.error('ファイルが容易できていません!');
                    return;
                }
            }
            var context = this.context;
            var source = context.createBufferSource();
            this.source = source;
            source.buffer = buffer;
            source.connect(this.gain);
            source.start(0);
        },
        loadFile: function(src, cb) {
            var self = this;
            var context = this.context;
            var xml = new XMLHttpRequest();
            xml.open('GET', src);
            xml.onreadystatechange = function() {
                if(xml.readyState != 4) return;
                if([200, 201, 0].indexOf(xml.status) === -1) {
                    if(xml.status === 404) console.error('File not found!');
                    else consol.error('Server error!');
                    return;
                }
                var data = xml.response;
                context.decodeAudioData(data, function(buffer) {
                    var s = src.split('/');
                    var key = s[s.length - 1];
                    self._buffers[key] = buffer;
                    cb(buffer);
                });
            };
            xml.responseType = 'arraybuffer';
            xml.send(null);
        }
    }
    wa._initialize();
    window.wa = wa;
}(window));
