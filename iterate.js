let word = '';
let sentences = [];
let audio = [];
let delay = 2000;

function iterate(i, j) {
    if(i >= list.length) {
        return;
    }
    if(j == 0) {
        sentences = [];
        audio = [];
        if(list[i] !== '') {
            let wa = list[i].split(',');
            word = wa[0];
            document.title = word;
            for(let i = 1; i < wa.length; i += 2) {
                sentences.push(unescape(wa[i]));
                audio.push(wa[i+1]);
            }
	    	document.body.innerHTML = `<div style='margin: auto; font-size: 20px;'><pre>${unescape(fanyi[word])}</pre></div>`
        }
    } 
    if(j >= sentences.length) {
        return iterate(i+1, 0);
    }
    let s = sentences[j];
    let a = new Audio(audio[j]);
//    document.body.innerHTML = `<div style='margin: auto;'>${s}</div>`
    a.onended = function() {
        setTimeout(() => { iterate(i, j+1) }, delay);
    }
    a.play();
}

window.addEventListener('load', () => {iterate(0, 0);});
