let word = '';
let sentences = [];
let mp3 = [];
let delay = 2000;
let bdelay = 3000;

function shuffle(a) {
	tl = [];
	for(let i = 0; i < a.length; ++ i) {
		if(a[i]) {
			tl.push(a[i]);
		}
	}
	a = tl;
	b = [];
	c = [];
	for(let i = 0; i < a.length; ++ i) {
		b.push(Math.random());
		c.push(i);
	}
	c.sort((i, j) => { return b[i] - b[j]; });
	d = [];
	for(let i = 0; i < c.length; ++ i) {
		d.push(a[c[i]]);
	}
	return d;
}

list = shuffle(list);

let gi = 0, gj = 0;
let handle = null;
let audio = null;
let paused = false;

function iterate(i, j) {
	gi = i;
	gj = j; // record current position 
    if(i >= list.length) {
        return;
    }
    if(j == 0) {
        sentences = [];
        mp3 = [];
        if(list[i] !== '') {
            let wa = list[i].split(',');
            word = wa[0];
            document.title = word;
            for(let k = 1; k < wa.length; k += 2) {
                sentences.push(unescape(wa[k]));
                mp3.push(wa[k+1]);
            }
	    	document.body.innerHTML = `<div class='exp'><pre>${i+1}/${list.length}.\t${unescape(fanyi[word])}</pre></div>`
        }
    } 
    if(j >= sentences.length) {
        return iterate(i+1, 0);
    }
    let s = sentences[j];
    audio = new Audio(mp3[j]);
//    document.body.innerHTML = `<div style='margin: auto;'>${s}</div>`
    audio.onended = function() {
		audio.onended = null;
		handle = setTimeout(() => { iterate(i, j+1); }, j+1 < sentences.length ? delay : bdelay);
    }
	audio.onerror = function() {
		audio.onerror = null;
		handle = setTimeout(() => { iterate(i, j+1); }, j+1 < sentences.length ? delay : bdelay);
	}
    audio.play();
}


function pause(e) {
	if(e.key != ' ') {
		return;
	}
	paused = !paused;
	if(paused) {
		document.title += ' - paused';
	}
	else {
		document.title = document.title.substring(0, document.title.length - 9);
	}
	if(!paused) {
		if(audio && !audio.ended && (!audio.error || !audio.error.code)) { // audio is still playing, schedule the next audio
			audio.onended = function() {
				handle = setTimeout(() => { iterate(gi, gj+1); }, j+1 < sentences.length ? delay : bdelay);
			}
		}
		else { // audio is not playing, just play the next
			iterate(gi, gj+1);
		}
	}
	else {
		if(audio && audio.onended && audio.onerror) { // audio.onended has not been invoked;
			audio.onended = null;
			audio.onerror = null;
		}
		else { // audio.onended has been invoked, and we need to clear handle
			clearTimeout(handle);
		}
	}
}

window.addEventListener('load', () => {iterate(0, 0);});
window.onkeydown = (e) => {pause(e);}; 
