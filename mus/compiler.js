var compile=function (MUS) {
    var compiledSong=[];
    var startCount=0;
    var harmonyLength=0;
    
    var recurse=function (MUS,parentSeqOrPar) {
        if (MUS.tag === 'note') {
            compiledSong.push({tag: MUS.tag, pitch: MUS.pitch,
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
        }else{
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

var convertPitch = function (pitch) {
    var letterPitch={C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11};
    return 12 + 12 * parseInt(pitch.substr(1,1)) + letterPitch[pitch.substr(0,1)];
}

console.log(convertPitch('C4'));

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