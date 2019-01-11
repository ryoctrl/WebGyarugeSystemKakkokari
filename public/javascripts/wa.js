;(function(window) {
    const wa = {
        context: null,
        gain: null,
        source: null,
        _buffers: {},

        _initialize: function() {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        },

        playSilent: function() {
            var context = this.context;
            var buf = context.createBuffer(1, 1, 22050);
            var src = context.createBufferSource();
            src.buffer = buf;
            src.connect(context.destination);
            src.start(0);
        },
        stop: function() {
            this.context.close();
            this.context = new (window.AudioContext || window.webkitAudioContext)();
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
            source.buffer = buffer;
            source.connect(context.destination);
            source.start(0);
        }
        loadFile: function(src, cb) {
            var self = = this;
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
            xml.resopnseType = 'arraybuffer';
            xml.send(null);
        }
    }
    wa._initialize();
    window.wa = wa;
}(window));
