;(function(window) {
    const wa = {
        context: null,
        gain: null,
        source: null,
        recorder: null,
        audioNode: null,
        recordData: null,
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
        startRecord: function() {
            const context = this.context;
            const bufferSize = 4096;
            if(context.createJavaScriptNode) {
                this.audioNode = context.createJavaScriptNode(bufferSize, 1, 1);
            } else if(context.createScriptProcessor){
                this.audioNode = context.createScriptProcessor(bufferSize, 1, 1);
            } else {
                displayError('WebAudio not supported');
            }
            this.audioNode.connect(context.destination);

            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mediaDevices.getUserMedia;

            if(!navigator.getUserMedia) {
                return false;
            }
            const self = this;
            navigator.getUserMedia({
                audio: true,
                video: false
            }, function(stream) { 
                displayError('success');
                self.successFunc(stream, self);
            }, this.errorFunc)
        },
        onAudioProcess: function(e) {
            if(!this.recording) return;
            recordData.push(new Float32Array(e.inputBuffer.getChannelData(0)));


        },
        successFunc: function(stream, self) {
            const context = self.context;
            const audioNode = self.audioNode;
            const audioInput = context.createMediaStreamSource(stream);
            audioInput.connect(audioNode);
            audioNode.onaudioprocess = self.onAudioProcess;
            

            /*
            if(!MediaRecorder || false) {
                displayError('MediaRecorder not supoprted');
            } else {
                displayError('MediaRecorder supporting');

            }
            self.recorder = new MediaRecorder(stream,{
                mimeType: 'audio/webm'
            });

            const recorder = self.recorder;

            const chunks = [];

            //displayError('adding eventListener');
            recorder.addEventListener('dataavailable', function(ele) {
                if(ele.data.size > 0) chunks.push(ele.data);
            });

            recorder.addEventListener('stop', function() {
                displayError('stopping');
                const buffer = new Blob(chunks, { type: 'audio/wav' });
                const form = new FormData();
                form.append('data', buffer);
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/upload/data');
                xhr.send(form);
            });

            recorder.start();
            //displayError('recording started');
            */
        },
        stopRecord: function() {
            if(!this.recorder) return;
            displayError('stop clicked');
            this.recorder.stop();
        },
        errorFunc: function() {
            alert('Error cant use WebAudioAPI');

        },
        /*
        startRecord: function() {
            this.recording = true;
            navigator.getUserMedia({ video: false, audio: true},
                (stream) => {
                    this.localStream = stream;
                    this.catchStream(stream);
                },
                (err) => {
                    console.error(err);
                });
        },
        catchStream: function(stream) {
            const context = this.context;
            const source = context.createMediaStreamSource(steram);
            if(source.context.createJavaScriptNode) {
                this.node = source.context.createJavaScriptNode(4096, 1, 1);
            } else if(source.context.createScriptProcessor) {
                this.node = source.context.createScriptProcessor(4096, 1, 1);
            }
            const samplerate = context.sampleRate;
            
            source.connect(node);
            node.connect(context.destination);

        },
        stopRecord: function() {
            if(!this.recording) return;
            
            const tracks = this.localStream.getAudioTracks();
            for(let i = tracks.length - 1; i >= 0; --i) {
                tracks[i].stop();
            }
            this.recording = false;
            source.disconnect();
            node.disconnect();
            source = node = null;


        },
        */
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
