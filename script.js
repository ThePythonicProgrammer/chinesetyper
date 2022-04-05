
var challType = ""

main();
readCharacterSheets();

// window.addEventListener("keydown", wordTimer());

// $(window).bind("load", () => $('.preloader-wrapper').fadeOut(100))



function main(){
	randomWords();	
	switchDiv(document.getElementById("parent"), document.getElementById("pre"))

}
function randomWords() {
  const wordList = ["我", "喜歡", "可是", "最", "你", "門"]
  const length = 15
  
  var wordsUsed = ""
  for (var i=0; i<length; i++){
    var random = Math.random() * wordList.length;
    wordsUsed += wordList[Math.floor(random)]
  }
  challType = "randomWords"
  document.getElementById('testedWords').innerHTML = wordsUsed;
}

function randomChallenge(){
  var challenges = ["我喜歡冰淇淋可是我最喜歡Fast and Furious 9", "我覺得很累", "安老師很帥"]
  
  var challNum = Math.floor(Math.random() * challenges.length);
  console.log(challNum);
  
  document.getElementById("testedWords").innerHTML = challenges[challNum]
  challType = "randomChallenge"
}

function wordTimer() {

	switchDiv(document.getElementById("parent"), document.getElementById("test"));

	// Calculating Length
	const length = document.getElementById("testedWords").innerHTML.length;

	var sec = 0;
	var CPM = 0;
	var timer = setInterval(function(){
	    sec++;
	    complete = checkCompletion(sec);
	    if (complete == true) {
		clearInterval(timer);
		CPM = checkCPM(sec);

		// Setting up stats page
		switchDiv(document.getElementById("parent"), document.getElementById("stats"))
	    	document.getElementById("CPM").innerHTML = `You typed at ${CPM} characters a minute!`
	   	document.getElementById("time").innerHTML = `You took ${sec} seconds to type ${length} characters.`
	    	

		var pf = document.getElementById('pf')
		// Setting up easy grading
		if (CPM >= 25) {
			pf.innerHTML = 'Pass!'
			pf.classList.add('teal')
			pf.style.textAlign = "center";
		} else {
			pf.innerHTML = 'Fail :('
			pf.classList.add('red');
			pf.style.textAlign = "center"
		}
	    }
	}, 1000);
}

function checkCompletion() {
  testedWords = document.getElementById("testedWords").innerHTML;
  written = document.getElementById("writingSpace").value;

  // console.log(testCompletion);
  // console.log(writtenCompletion);
  
  if (testedWords.length <= written.length){
    return true;
  } else {
    return false;
  }
}

function checkCPM(time){
  written = document.getElementById("writingSpace").value;
  testedWords = document.getElementById("testedWords").innerHTML;

  var incorrect = 0;
  
  for (var i=0; i<testedWords.length; i++){
    if (testedWords.substring(i) != written.substring(i)){
      incorrect++;
    }
  }

  var CPS = (testedWords.length - incorrect)/time
  var CPM = CPS * 60

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
	var url = "characterFiles/words.json"

	// Upon getting access to the files, displayCharacterSheets()
	xmlhttp.onreadystatechange = () => {
		console.log("true")
		if (this.readyState == 4 && this.status == 200) {
			var data = JSON.parse(this.responseText)
			for (var i=0; i<data.length;i++){
				var unit = data[i];
				console.log(unit)
				displayCharacterSheets(unit);
			}
		}
	}
	xmlhttp.open("GET", url, true);
	
	// Set request headers
	xmlhttp.setRequestHeader('X-PINGOTHER', 'pingpong');
	xmlhttp.setRequestHeader('Content-Type', 'application/json')

	xmlhttp.send()

}

function displayCharacterSheets(data){
	let p = document.createElement('p');
	p.innerHTML = `<label><input type="checkbox" /><span>${data.name}</span></label>`
	form = document.getElementById('unitList');
}

document.addEventListener('DOMContentLoaded', () =>{
	var elems = document.querySelectorAll('.modal');
	var instances = M.Modal.init(elems);
});
