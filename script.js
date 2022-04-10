
var pastLen = 0;
var lastInterval = 0;

var challType = ""
var wordList = []

var units = 0;
var unitWordLists = {}

readCharacterSheets();
main();

// window.addEventListener("keydown", wordTimer());

// $(window).bind("load", () => $('.preloader-wrapper').fadeOut(100))

document.addEventListener('DOMContentLoaded', () =>{
	var elems = document.querySelectorAll('.modal');
	var instances = M.Modal.init(elems);
});

function main(){
	randomWords();	
	switchDiv(document.getElementById("parent"), document.getElementById("pre"))
	document.getElementById('writingSpace').autofocus = true;
	document.getElementById('writingSpace').onpaste = e => {
		e.preventDefault();
		return false;
	}
	document.getElementById('testedWords').addEventListener('copy', (event) => {
		event.preventDefault();
		return false;
	})
}
function randomWords() {
  // createWordList();
  const length = 15
  
  var wordsUsed = ""
  for (var i=0; i<length; i++){
    var random = Math.random() * wordList.length;
    wordsUsed += wordList[Math.floor(random)]
  }
  challType = "randomWords"
  document.getElementById('testType').innerText = challType;
  document.getElementById('testedWords').innerHTML = wordsUsed;

}

function randomChallenge(){
  var challenges = ["我喜歡冰淇淋可是我最喜歡Fast and Furious 9", "我覺得很累", "安老師很帥"]
  
  var challNum = Math.floor(Math.random() * challenges.length);
  console.log(challNum);
  
  document.getElementById("testedWords").innerHTML = challenges[challNum]
  document.getElementById('testType').innerText = challType;
  challType = "randomChallenge"
}

function wordTimer() {

	switchDiv(document.getElementById("parent"), document.getElementById("test"));

	// Calculating Length
	const length = document.getElementById("testedWords").innerHTML.length;

	var ms = 0;
	var CPM = 0;
	var cpmPerWord = []
	pastLen = 0;
	lastInterval = 0;
	var leftBool = true;

	var timer = setInterval(function(){
		ms += 100
		checkCompletion(cpmPerWord, ms);
		leftBool = preventLeave();
	    if (pastLen >= length) {
		console.log("Done!")
		clearInterval(timer);
		CPM = checkCPM(ms, cpmPerWord);
		
		wordList = {}
		// Setting up stats page
		document.getElementById('writingSpace').autofocus = false
		switchDiv(document.getElementById("parent"), document.getElementById("stats"))
		// document.getElementById("CPM").innerHTML = `You typed at ${CPM} characters a minute!`
		// document.getElementById("time").innerHTML = `You took ${sec} seconds to type ${length} characters.`
		
		plotData(cpmPerWord);
	
		var pf = document.getElementById('pf')
		// Setting up easy grading
		if (CPM >= 25) {
			pf.innerHTML = 'Pass!'
			pf.classList.add('teal')
			pf.classList.remove('red');
			pf.style.textAlign = "center";
		} else {
			pf.innerHTML = 'Fail :('
			pf.classList.add('red');
			pf.classList.remove('teal')
			pf.style.textAlign = "center"
		}
	    }
		if (leftBool = false) {
			clearInterval(timer);
		}
	}, 100);
}

function checkCompletion(array, currentInterval) {
	testedWords = document.getElementById("testedWords").innerHTML;
	written = document.getElementById("writingSpace").value;
	
	// numCharsPlaced is number of characters the player has "placed"
	// ttCharPlaced is the time to place a character
	// ttMin is the amount of time to a minute from the interval (set currently to ms)
	// CPM is the Characters per Minute
	let numCharsPlaced;
	let ttCharPlaced;
	const ttMin = 60*1000;
	let CPM;

	// console.log(testCompletion);
	// console.log(writtenCompletion);
 	

	if (written.length > pastLen){
		numCharsPlaced = written.substring(pastLen).length
		ttCharPlaced = currentInterval - lastInterval
		CPM = numCharsPlaced * ttMin / ttCharPlaced	

		array.push(CPM);

		lastInterval = currentInterval
		pastLen = written.length
	}
}

function checkCPM(time, cpmArray){
  written = document.getElementById("writingSpace").value;
  testedWords = document.getElementById("testedWords").innerHTML;

  var incorrect = 0;
  let cpmSum = 0;
  let cpmAvg = 0;

  for (var i=0; i<testedWords.length; i++){
    if (testedWords.substring(i) != written.substring(i)){
      incorrect++;
    }
  }

  const CPM = (testedWords.length - incorrect)*60/(time/1000)
	
  document.getElementById('CPM').innerText = CPM;
  document.getElementById('time').innerText = time/1000 
  document.getElementById('testForm').reset();  

  cpmArray.forEach((v) => cpmSum += v)
  cpmAvg = cpmSum / cpmArray.length;
  document.getElementById('RAWCPM').innerText = cpmAvg

  return CPM;
}

function switchDiv(parentDiv, div){
	div.style.display = "block";
	for (var i=0; i<parentDiv.children.length; i++){
		if (parentDiv.children[i] != div){
			parentDiv.children[i].style.display = "none";
		}
	}
}

function modalUpdate(){
	document.getElementById('mode').innerHTML = challType;
	document.getElementById('charLength').innerHTML = document.getElementById('testedWords').innerHTML.length;
}

function readCharacterSheets(){
	var xmlhttp = new XMLHttpRequest();
	var url = "words.json"

	xmlhttp.open("GET", url, true);
	
	// Upon getting access to the files, displayCharacterSheets()
	xmlhttp.onreadystatechange = () => {
		if (xmlhttp.readyState === XMLHttpRequest.DONE) {
			var status = xmlhttp.status
			if (status === 0 || status >= 200 && status < 400) {
				var data = JSON.parse(xmlhttp.responseText);
				separateUnits(data)
			}
		}
	}
	
	xmlhttp.send()

}

function separateUnits(data){
	for (var i=0; i<Object.keys(data).length; i++){
		const unit = data[Object.keys(data)[i]]
		displayCharacterSheets(unit, i);
		unitWordLists[`unit${i}`] = unit.words	

		console.log(unit);
	}
}

function displayCharacterSheets(unit, i){
	let p = document.createElement('p');
	p.innerHTML = `<label><input type="checkbox" id="unit${i}/><span>${unit.name}</span></label>`
	document.getElementById('unitList').appendChild(p);
}

function createWordList(){
	for (var i=0; i<units; i++){
		let checkbox = document.getElementById(`unit${i}`)

		if (checkbox.checked){
			wordList.push(unitWordLists[`unit${i}`])
		}
	}
}

function plotData(array){
	var trace1 = {
	  x: [],
	  y: [],
	  type: 'scatter'
	};
	
	array.forEach((v,i) => trace1.x.push(i))
	array.forEach((v) => trace1.y.push(v))

	var data = [trace1];
	
	var layout = {
		title: "Raw CPM Across Typing Challenge",
		xaxis: {
			title: "Word Count"
		},
		yaxis: {	
			title: "CPM"
		}
	}

	Plotly.newPlot('statsPage', data, layout);

}

function preventLeave(){
	document.getElementById('writingSpace').onblur = () => {
		switchDiv(document.getElementById("parent"), document.getElementById("pre"))
		document.getElementById('testForm').reset()
		return false;
	}
}
