var compile=function (MUS) {
    var compiledSong=[];
    var startCount=0;
    var harmonyLength=0;
    var letterPitch={c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11};

    var convertPitch = function (pitch) {
        return 12 + 12 * parseInt(pitch.substr(1,1),10) + letterPitch[pitch.substr(0,1)];
    };
    
    var recurse=function (MUS,parentSeqOrPar) {
        if (MUS.tag === 'note') {
            compiledSong.push({tag: MUS.tag, pitch: convertPitch(MUS.pitch),
            start: startCount, dur: MUS.dur});
            if (parentSeqOrPar === 'par' && MUS.dur > harmonyLength) {
                harmonyLength = MUS.dur;
            }
        }else if (MUS.tag === 'rest') {
            compiledSong.push({tag: MUS.tag, start: startCount, dur: MUS.duration});            
        }else if (MUS.tag === 'repeat') {
            for (j=0,k=MUS.count;j<k;j++){
                recurse(MUS.section,MUS.tag);
            }
        }else{  // seq or par
            harmonyLength=0;
            recurse(MUS.left,MUS.tag);
             if (MUS.tag === 'seq') {
                startCount += harmonyLength;
                harmonyLength = 0;
            }
            recurse(MUS.right,MUS.tag);
        }
    };
    recurse(MUS);
    return compiledSong;
};

var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log('melody_mus');
console.log(melody_mus);
console.log('compiled');
console.log(compile(melody_mus));
