'use strict';

// declare global variables
var div;
var value;
var histExp;
var histRes;
var recExp;
var subCont;
var clearHist;
var clearImg;
var cont;
var nums;
var symbols;
var numKeys;
var symbolKeys;

// Add Keys within interface
nums = [7, 8, 9, 4, 5, 6, 1, 2, 3, '+/-', 0, '.'];
nums.forEach(function(num) {
	div = document.createElement('div');
	div.className = 'num';
	div.setAttribute('num-key', num);
	div.innerHTML = num;
	document.querySelector('.nums').appendChild(div);
});

// Add Symbols within interface
symbols = ['/', '*', '-', '+', '='];
symbols.forEach(function(symbol) {
	div = document.createElement('div');
	div.className = 'symbol';
	div.setAttribute('symbol-key', symbol);
	div.innerHTML = symbol;
	document.querySelector('.symbols').appendChild(div);
});

// initial output
document.querySelector('.eval_result').innerHTML = 0;

// get inputs from nums
numKeys = document.querySelectorAll('div[num-key]');
numKeys.forEach(function(num) {
	num.addEventListener('click', function(event) {
		removeActive(numKeys);
		num.style.backgroundColor = '#111';
		num.style.color = '#fff';
		if (num.textContent == '+/-') {
			addNegation(document.querySelector('.expression').textContent);
		} else {
			document.querySelector('.expression').innerHTML += num.textContent;
		}
	});
});

// get inputs from symbols
symbolKeys = document.querySelectorAll('div[symbol-key]');
symbolKeys.forEach(function(symbol) {
	symbol.addEventListener('click', function(event) {
		removeActive(symbolKeys);
		symbol.style.backgroundColor = '#fff';
		symbol.style.color = '#111';
		if (symbol != symbolKeys[4]) {
			document.querySelector('.expression').innerHTML += symbol.textContent;
		} else {
			removeActive(symbolKeys);
			removeActive(numKeys);
			symbol.style.backgroundColor = '#fff';
			symbol.style.color = '#111';
			backChar();
		}
	});
});

// add negation
function addNegation(recentExp) {
	newExp;
	negexp;
	if (recentExp.match(/\d+$/)) {
		var newExp = recentExp.match(/\d+$/);
		var negexp = recentExp.split(/\d+$/);
		document.querySelector('.expression').innerHTML = negexp[0] + '(-' + newExp[0] + ')';
	} else if (recentExp.match(/\(.*\)$/)) {
		newExp = recentExp.match(/\(.*\)$/);
		negexp = recentExp.split(/\(.*\)$/);
		if (newExp[0].startsWith('(-')) {
			var removPare = newExp[0].split('');
			removPare.shift();
			removPare.shift();
			removPare.pop();
			document.querySelector('.expression').innerHTML = negexp[0] + removPare.join('');
		} else {
			document.querySelector('.expression').innerHTML = negexp[0] + '(-' + newExp[0] + ')';
		}
	}
}

// clear expression and output
document.querySelector('.clear').addEventListener('click', function() {
	document.querySelector('.eval_result').innerHTML = 0;
	document.querySelector('.expression').innerHTML = '';
});

// define backChar function
function backChar() {
	var newExp = [];
	var exp;
	var lastChar = document.querySelector('.expression').textContent.split('');
	if (event.key == 'Backspace') {
		if (lastChar.length > 1) {
			lastChar.pop();
			lastChar.forEach(char => {
				newExp.push(char);
			});
			exp = document.querySelector('.expression').innerHTML = newExp.join('');
		} else {
			lastChar.pop();
			document.querySelector('.expression').innerHTML = '';
			document.querySelector('.eval_result').innerHTML = 0;
		}
	} else {
		removeActive(numKeys);
		removeActive(symbolKeys);
		document.querySelector(`[symbol-key="${symbols[4]}"]`).style.backgroundColor = '#fff';
		document.querySelector(`[symbol-key="${symbols[4]}"]`).style.color = '#111';
		if (lastChar.length > 0) {
			exp = document.querySelector('.expression').innerHTML = lastChar.join('');
			displayOutput(exp);
		}
	}
}

// switch characters accordingly
function switchedChar(specKey) {
	console.log(nums.indexOf(specKey.toString()));
	if (
		specKey == nums[0] ||
		specKey == nums[1] ||
		specKey == nums[2] ||
		specKey == nums[3] ||
		specKey == nums[4] ||
		specKey == nums[5] ||
		specKey == nums[6] ||
		specKey == nums[7] ||
		specKey == nums[8] ||
		specKey == nums[9] ||
		specKey == nums[10] ||
		specKey == nums[11]
	) {
		removeActive(numKeys);
		document.querySelector(`[num-key="${specKey}"]`).style.backgroundColor = '#111';
		document.querySelector(`[num-key="${specKey}"]`).style.color = '#fff';
		document.querySelector('.expression').innerHTML += event.key;
	} else if (
		specKey == symbols[0] ||
		specKey == symbols[1] ||
		specKey == symbols[2] ||
		specKey === symbols[3] ||
		specKey === symbols[4]
	) {
		removeActive(numKeys);
		document.querySelector(`[symbol-key="${specKey}"]`).style.backgroundColor = '#fff';
		document.querySelector(`[symbol-key="${specKey}"]`).style.color = '#111';
		document.querySelector('.expression').innerHTML += event.key;
	} else if (specKey == '(' || specKey == ')') {
		document.querySelector('.expression').innerHTML += specKey;
	}
}

// remove active
function removeActive(keyList) {
	keyList.forEach(el => {
		if (el.getAttribute('num-key')) {
			el.style.backgroundColor = '#fff';
			el.style.color = '#111';
		} else {
			el.style.backgroundColor = '#111';
			el.style.color = '#fff';
		}
	});
}

// interact with keyboard keys
document.addEventListener('keydown', function(event) {
	if (event.key === 'Backspace' || event.key == 'Enter') {
		backChar();
	} else {
		switchedChar(event.key);
	}
});

// display result
function displayOutput(exp) {
	try {
		if (eval(exp) === Infinity) {
			document.querySelector('.eval_result').innerHTML = 'No division by zero';
		} else {
			document.querySelector('.eval_result').innerHTML = eval(exp);
			if (sessionStorage.history) {
				var histories = JSON.parse(sessionStorage.history);
				histories.push(exp);
				sessionStorage.setItem('history', JSON.stringify(histories));
				if (document.querySelector('.history_container').clientHeight > 0) {
					displayHistorySelected();
				}
			} else {
				var histories = [];
				histories.push(exp);
				sessionStorage.setItem('history', JSON.stringify(histories));
				if (document.querySelector('.history_container').clientHeight > 0) {
					displayHistorySelected();
				}
			}
		}
	} catch (error) {
		document.querySelector('.eval_result').innerHTML = 'Invalid Expression';
	}
}

// display recent expressions history
function recentExp() {
	if (sessionStorage.history) {
		if (document.querySelector('.history_container').clientHeight == 0) {
			displayHistorySelected();
			document.querySelector('.history_container').style.height = '345px';
			document.querySelector('.history_sub_container').style.display = 'flex';
			document.querySelector('.clear_history img').style.display = 'block';
		} else {
			document.querySelector('.history_container').style.height = '0px';
			document.querySelector('.history_sub_container').style.display = 'none';
			document.querySelector('.history_container').innerHTML = '';
		}
	}
}
// display history selected
function displayHistorySelected() {
	cont = document.querySelector('.history_container');
	cont.innerHTML = '';
	recExp = JSON.parse(sessionStorage.history);
	recExp.forEach(function(value, index) {
		histExp = document.createElement('div');
		histExp.className = 'historical_exp';
		histExp.style.flex = 1;
		histExp.innerHTML = value;
		histRes = document.createElement('div');
		histRes.className = 'historical_exp_result';
		histRes.innerHTML = eval(value);
		subCont = document.createElement('div');
		subCont.className = 'history_sub_container';
		subCont.style.display = 'flex';
		subCont.setAttribute('id', index);
		subCont.appendChild(histExp);
		subCont.appendChild(histRes);
		cont.insertBefore(subCont, cont.childNodes[0]);
	});
	clearHist = document.createElement('div');
	clearHist.className = 'clear_history';
	clearImg = document.createElement('img');
	clearImg.setAttribute('src', 'icon-delete.scale-180.png');
	clearImg.setAttribute('id', 'deleteIcon');
	clearImg.style.display = 'block';
	clearHist.appendChild(clearImg);
	cont.appendChild(clearHist);
	cont.addEventListener('click', function(event) {
		if (event.target == document.querySelector('#deleteIcon')) {
			deleteHistory();
		} else if (event.target == event.target.parentElement.firstChild) {
			document.querySelector('.expression').innerHTML = event.target.parentElement.firstChild.textContent;
			document.querySelector('.eval_result').innerHTML = eval(event.target.parentElement.firstChild.textContent);
		} else {
			event.preventDefault;
		}
	});
}

// event listeners for interaction with history icon and delete icon
document.querySelector('.history img').addEventListener('click', recentExp);
document.querySelector('.clear_history img').addEventListener('click', deleteHistory);

// function to delete histories from storage
function deleteHistory() {
	sessionStorage.removeItem('history');
	cont.innerHTML = '';
	cont.style.height = '0px';
}
