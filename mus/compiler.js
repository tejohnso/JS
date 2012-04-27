var compile=function (MUS) {
    var compiledSong=[];
    var startCount=0;
    var harmonyLength=0;
    
    var recurse=function (MUS,parentSeqOrPar) {
        if (MUS.tag === 'note') {
            compiledSong.push({tag: 'note', pitch: MUS.pitch,
            start: startCount, dur: MUS.dur});
            if (parentSeqOrPar === 'par' && MUS.dur > harmonyLength) {
                harmonyLength = MUS.dur;
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