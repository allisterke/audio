let word = '';
let sentences = [];
let mp3 = [];
let delay = 2000;
let bdelay = 3000;

let params = function() {
	let url = window.location.href;
	let pos = url.indexOf('?');
	let p = {};
	if(pos >= 0) {
		let ps = url.substr(pos+1).split(/[=&]/);
		for(let i = 0; i < ps.length; i += 2) {
			p[ps[i]] = ps[i+1];
		}
	}
	return p; 
}(); 

function sort(a) {
	tl = [];
	for(let i = 0; i < a.length; ++ i) {
		if(a[i]) {
			tl.push(a[i]);
		}
	}
	return tl.sort();
}

function shuffle(a) {
	tl = [];
	for(let i = 0; i < a.length; ++ i) {
		if(a[i]) {
			tl.push(a[i]);
		}
	}
	for(let i = 0; i < tl.length; ++ i) {
		let r = Math.floor(Math.random() * (tl.length - i));
		let tmp = tl[i];
		tl[i] = tl[i+r];
		tl[i+r] = tmp;
	}
	return tl;
}

list = params['random'] === 'true' ? shuffle(list) : sort(list);

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

function stop() {
	audio.pause();
	if(audio.onended && audio.onerror) {
		audio.onended = null;
		audio.onerror = null;
	}
	else {
		clearTimeout(handle);
	}
}

function pause(e) {
	if(e.keyCode == 37) {
		if(audio) {
			stop();
			return iterate(gi >= 1 ? gi-1 : gi, 0);
		}
		return;
	}
	if(e.keyCode == 39) {
		if(audio) {
			stop();
			return iterate(gi+1, 0);
		}
		return;
	}
	if(e.key != ' ') {
		return;
	}
	paused = !paused;
	if(paused) {
		document.title += ' - paused';
	}
	else if(document.title.endsWith(' - paused')) {
		document.title = document.title.substring(0, document.title.length - 9);
	}
	if(!paused) {
		if(audio && !audio.ended && (!audio.error || !audio.error.code)) { // audio is still playing, schedule the next audio
			audio.onended = function() {
				handle = setTimeout(() => { iterate(gi, gj+1); }, gj+1 < sentences.length ? delay : bdelay);
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

function getStartPosition() {
	return params['start'] == null ? 0 : parseInt(params['start']);
}

window.addEventListener('load', () => {iterate(getStartPosition(), 0);});
window.onkeydown = (e) => {pause(e);}; 
