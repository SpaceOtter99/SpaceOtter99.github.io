
const partyInput = document.getElementById("party-input");
const groupLevel = document.getElementById("group-level");
const groupPlayers = document.getElementById("group-players");
const monsterList = document.getElementById("monster-list");

const monstersPerPage = 10;
const maxVisiblePages = 9;
let currentPage = 1;
let totalMonsters = 0;
let monstersData = [];
let sortBy = "name";
let sortOrder = "ascending";
let filteredMonsters = [];
let searchedFilteredMonsters = []
let searchText = "";

function noFilt(x) {return true;}

let filterStack = {
	level: noFilt, 
	name: noFilt, 
	size: noFilt, 
	role: noFilt, 
	type: noFilt, 
	source: noFilt, 
	page: noFilt
}

let currentMonsters = {};

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}







/* Fetch Monster Data*/

function fetchMonstersCSV() {
	return fetch("monsters.csv")
		.then(response => response.text())
		.then(data => {
			monstersData = data.split("\n").map(line => parseCSVLine(line));
			sortAndFilterMonsters();
		})
		.catch(error => {
			console.error("Error fetching monster data:", error);
			monstersData = [[0, "Giant Ant", "Normal", "Troop", "Beast", "Core Rulebook", 206],[1, "Decrepit Skeleton", "Normal", "Mook", "Undead", "Core Rulebook", 246],[1, "Dire Rat", "Normal", "Mook", "Beast", "Core Rulebook", 206],[1, "Giant Scorpion", "Normal", "Wrecker", "Beast", "Core Rulebook", 206],[1, "Goblin Grunt", "Normal", "Troop", "Humanoid", "Core Rulebook", 229],[1, "Goblin Scum", "Normal", "Mook", "Humanoid", "Core Rulebook", 229],[1, "Human Thug", "Normal", "Troop", "Humanoid", "Core Rulebook", 235],[1, "Kobold Archer", "Normal", "Mook", "Humanoid", "Core Rulebook", 237],[1, "Kobold Warrior", "Normal", "Troop", "Humanoid", "Core Rulebook", 237],[1, "Orc Warrior", "Normal", "Troop", "Humanoid", "Core Rulebook", 242],[1, "Skeletal Hound", "Normal", "Blocker", "Undead", "Core Rulebook", 246],[1, "Skeleton Archer", "Normal", "Archer", "Undead", "Core Rulebook", 246],[1, "Wolf", "Normal", "Troop", "Beast", "Core Rulebook", 207],[1, "Zombie Shuffler", "Normal", "Mook", "Undead", "Core Rulebook", 251],[2, "Ankheg", "Large", "Troop", "Beast", "Core Rulebook", 208],[2, "Bear", "Normal", "Troop", "Beast", "Core Rulebook", 207],[2, "Giant Web Spider", "Large", "Blocker", "Beast", "Core Rulebook", 207],[2, "Goblin Shaman", "Normal", "Caster", "Humanoid", "Core Rulebook", 229],[2, "Hobgoblin Warrior", "Normal", "Troop", "Humanoid", "Core Rulebook", 230],[2, "Human Zombie", "Normal", "Troop", "Undead", "Core Rulebook", 251],[2, "Hunting Spider", "Normal", "Wrecker", "Beast", "Core Rulebook", 206],[2, "Kobold Hero", "Normal", "Leader", "Humanoid", "Core Rulebook", 237],[2, "Lizardman Savage", "Normal", "Wrecker", "Humanoid", "Core Rulebook", 237],[2, "Medium White Dragon", "Normal", "Troop", "Dragon", "Core Rulebook", 218],[2, "Newly-Risen Ghoul", "Normal", "Mook", "Undead", "Core Rulebook", 225],[2, "Orc Berserker", "Normal", "Troop", "Humanoid", "Core Rulebook", 242],[2, "Orc Shaman", "Normal", "Leader", "Humanoid", "Core Rulebook", 242],[2, "Skeleton Warrior", "Normal", "Troop", "Undead", "Core Rulebook", 246],[2, "Trog", "Normal", "Spoiler", "Humanoid", "Core Rulebook", 247],[3, "Dire Wolf", "Large", "Troop", "Beast", "Core Rulebook", 207],[3, "Dretch", "Normal", "Mook", "Demon", "Core Rulebook", 210],[3, "Ghoul", "Normal", "Spoiler", "Humanoid", "Core Rulebook", 225],[3, "Gnoll Ranger", "Normal", "Archer", "Humanoid", "Core Rulebook", 229],[3, "Gnoll Savage", "Normal", "Troop", "Humanoid", "Core Rulebook", 228],[3, "Hellhound", "Normal", "Wrecker", "Beast", "Core Rulebook", 234],[3, "Hungry Star", "Normal", "Wrecker", "Aberration", "Core Rulebook", 235],[3, "Imp", "Normal", "Spoiler", "Demon", "Core Rulebook", 210],[3, "Medium Black Dragon", "Normal", "Wrecker", "Dragon", "Core Rulebook", 218],[3, "Ochre Jelly", "Large", "Wrecker", "Ooze", "Core Rulebook", 241],[3, "Otyugh", "Large", "Blocker", "Aberration", "Core Rulebook", 243],[3, "Trog Chanter", "Normal", "Leader", "Humanoid", "Core Rulebook", 247],[4, "Big Zombie", "Large", "Wrecker", "Undead", "Core Rulebook", 251],[4, "Blackamber Skeletal Legionnaire", "Normal", "Troop", "Undead", "Core Rulebook", 246],[4, "Derro Maniac", "Normal", "Troop", "Humanoid", "Core Rulebook", 216],[4, "Derro Sage", "Normal", "Caster", "Humanoid", "Core Rulebook", 216],[4, "Despoiler", "Normal", "Caster", "Demon", "Core Rulebook", 210],[4, "Dire Bear", "Large", "Troop", "Beast", "Core Rulebook", 207],[4, "Flesh Golem", "Large", "Blocker", "Construct", "Core Rulebook", 231],[4, "Gnoll War Leader", "Normal", "Leader", "Humanoid", "Core Rulebook", 229],[4, "Half-Orc Legionnaire", "Normal", "Troop", "Humanoid", "Core Rulebook", 233],[4, "Harpy", "Normal", "Spoiler", "Humanoid", "Core Rulebook", 234],[4, "Hobgoblin Captain", "Normal", "Leader", "Humanoid", "Core Rulebook", 230],[4, "Large White Dragon", "Large", "Troop", "Dragon", "Core Rulebook", 218],[4, "Medium Green Dragon", "Normal", "Spoiler", "Dragon", "Core Rulebook", 219],[4, "Minotaur", "Large", "Troop", "Humanoid", "Core Rulebook", 239],[4, "Owl Bear", "Large", "Wrecker", "Beast", "Core Rulebook", 243],[4, "Troll", "Large", "Troop", "Giant", "Core Rulebook", 248],[4, "Wight", "Normal", "Spoiler", "Undead", "Core Rulebook", 249],[5, "Bulette", "Large", "Wrecker", "Beast", "Core Rulebook", 208],[5, "Demon-Touched Human Ranger", "Normal", "Archer", "Humanoid", "Core Rulebook", 235],[5, "Ettin", "Large", "Troop", "Giant", "Core Rulebook", 224],[5, "Five-Headed Hydra", "Huge", "Wrecker", "Beast", "Core Rulebook", 236],[5, "Frenzy Demon", "Normal", "Wrecker", "Demon", "Core Rulebook", 211],[5, "Gargoyle", "Normal", "Troop", "Construct", "Core Rulebook", 224],[5, "Gelatinous Cube", "Huge", "Blocker", "Ooze", "Core Rulebook", 241],[5, "Half-Orc Tribal Champion", "Normal", "Wrecker", "Humanoid", "Core Rulebook", 233],[5, "Hobgoblin Warmage", "Normal", "Caster", "Humanoid", "Core Rulebook", 230],[5, "Huge White Dragon", "Huge", "Troop", "Dragon", "Core Rulebook", 219],[5, "Medium Blue Dragon", "Normal", "Caster", "Dragon", "Core Rulebook", 219],[5, "Wraith", "Normal", "Spoiler", "Undead", "Core Rulebook", 250],[5, "Wyvern", "Large", "Wrecker", "Beast", "Core Rulebook", 250],[6, "Clay Golem", "Large", "Spoiler", "Construct", "Core Rulebook", 231],[6, "Drider", "Large", "Caster", "Aberration", "Core Rulebook", 223],[6, "Hill Giant", "Large", "Troop", "Giant", "Core Rulebook", 225],[6, "Large Black Dragon", "Large", "Wrecker", "Dragon", "Core Rulebook", 220],[6, "Manticore", "Large", "Archer", "Beast", "Core Rulebook", 238],[6, "Medium Red Dragon", "Normal", "Wrecker", "Dragon", "Core Rulebook", 220],[6, "Medusa Outlaw", "Double-Strength", "Wrecker", "Humanoid", "Core Rulebook", 238],[6, "Vampire Spawn", "Normal", "Spoiler", "Undead", "Core Rulebook", 249],[6, "Vrock (Vulture Demon)", "Normal", "Spoiler", "Demon", "Core Rulebook", 211],[7, "Frost Giant", "Large", "Spoiler", "Giant", "Core Rulebook", 226],[7, "Hezrou (Toad Demon)", "Large", "Troop", "Demon", "Core Rulebook", 212],[7, "Large Green Dragon", "Large", "Spoiler", "Dragon", "Core Rulebook", 220],[7, "Ogre Mage", "Large", "Caster", "Giant", "Core Rulebook", 240],[7, "Orc Rager", "Normal", "Mook", "Humanoid", "Core Rulebook", 242],[7, "Phase Spider", "Large", "Wrecker", "Beast", "Core Rulebook", 244],[7, "Seven-Headed Hydra", "Huge", "Wrecker", "Beast", "Core Rulebook", 236],[8, "Glabrezou (Pincer Demon)", "Large", "Caster", "Demon", "Core Rulebook", 212],[8, "Half-Orc Commander", "Normal", "Leader", "Humanoid", "Core Rulebook", 233],[8, "Large Blue Dragon", "Large", "Caster", "Dragon", "Core Rulebook", 221],[8, "Stone Giant", "Large", "Troop", "Giant", "Core Rulebook", 226],[8, "Stone Golem", "Large", "Blocker", "Construct", "Core Rulebook", 232],[8, "Trog Underling", "Normal", "Mook", "Humanoid", "Core Rulebook", 247],[9, "Black Pudding", "Huge", "Wrecker", "Ooze", "Core Rulebook", 241],[9, "Chimera", "Large", "Wrecker", "Beast", "Core Rulebook", 209],[9, "Despoiler Mage", "Normal", "Caster", "Demon", "Core Rulebook", 213],[9, "Fire Giant Warlord", "Large", "Leader", "Giant", "Core Rulebook", 227],[9, "Giant Vrock (Vulture Demon)", "Large", "Spoiler", "Demon", "Core Rulebook", 214],[9, "Giant Zombie", "Large", "Mook", "Undead", "Core Rulebook", 251],[9, "Hooked Demon", "Normal", "Mook", "Demon", "Core Rulebook", 213],[9, "Huge Black Dragon", "Huge", "Wrecker", "Dragon", "Core Rulebook", 221],[10, "Great Fang Cadre (Orc)", "Normal", "Mook", "Humanoid", "Core Rulebook", 242],[10, "Iron Golem", "Large", "Wrecker", "Construct", "Core Rulebook", 232],[10, "Large Red Dragon", "Large", "Wrecker", "Dragon", "Core Rulebook", 222],[10, "Nalfeshnee (Boar Demon)", "Large", "Caster", "Demon", "Core Rulebook", 214],[10, "Spawn Of The Master (Vampire)", "Normal", "Mook", "Undead", "Core Rulebook", 249],[10, "Vampire", "Normal", "Spoiler", "Undead", "Core Rulebook", 248],[11, "Huge Green Dragon", "Huge", "Spoiler", "Dragon", "Core Rulebook", 222],[11, "Medusa Noble", "Double-Strength", "Caster", "Humanoid", "Core Rulebook", 239],[12, "Huge Blue Dragon", "Huge", "Caster", "Dragon", "Core Rulebook", 222],[12, "Marilith (Serpent Demon)", "Large", "Troop", "Demon", "Core Rulebook", 215],[13, "Balor (Flame Demon)", "Large", "Wrecker", "Demon", "Core Rulebook", 215],[13, "Huge Red Dragon", "Huge", "Wrecker", "Dragon", "Core Rulebook", 223]];
			sortAndFilterMonsters();
		});
}

function parseCSVLine(line) {
	const values = [];
	let currentVal = "";
	let withinQuotes = false;

	for (const char of line) {
		if (char === '"') {
			withinQuotes = !withinQuotes;
		} else if (char === ',' && !withinQuotes) {
			values.push(currentVal.trim());
			currentVal = "";
		} else {
			currentVal += char;
		}
	}

	values.push(currentVal.trim());
	return values;
}

function attachInputListeners(groupElement) {
	const playerInput = groupElement.querySelector(".group-players");
	const levelInput = groupElement.querySelector(".group-level");

	playerInput.addEventListener("input", updateMonsterList);
	levelInput.addEventListener("input", updateMonsterList);
}





/* Monster Fetching */

function updateMonsterList() {     
	const totalPartyLevel = calculateTotalPartyLevel();
	fetchMonstersForPartyLevel(totalPartyLevel, currentPage);
	getBattleRating();

	const totalPages = Math.ceil(totalMonsters / monstersPerPage);
	updatePageNumbers(totalPages);
}

function calculateTotalPartyLevel() {
	let level = groupLevel.value * groupPlayers.value;
	return level;
}

function fetchMonstersForPartyLevel(partyLevel, pageNumber) {
	const monsterTbody = document.getElementById("monster-list");
	monsterTbody.innerHTML = ""; // Clear existing table body

	searchedFilteredMonsters = searchFilter(filteredMonsters, searchText)

	const startIndex = (pageNumber - 1) * monstersPerPage;
	const endIndex = Math.min(startIndex + monstersPerPage, searchedFilteredMonsters.length);

	for (let i = startIndex; i < endIndex; i++) {
		let [level, name, size, role, type, source, page] = searchedFilteredMonsters[i];

		const monsterRow = document.createElement("tr");
		monsterRow.innerHTML = `
		<td class="hoverable" colspan="7">
		<div class="monster-list-display" onclick="addMonsterFromTable('${i}')">
			<div class="monster-list-item item-level" style="grid-area: level"> <p> ${level} </p> </div>
			<div class="monster-list-item item-name" style="grid-area: name" title="${name}"> <p> ${name} </p> </div>
			<div class="monster-list-item item-size" style="grid-area: size"> <p> ${size} </p> </div>
			<div class="monster-list-item item-role" style="grid-area: role"> <p> ${role} </p> </div>
			<div class="monster-list-item item-type" style="grid-area: type"> <p> ${type} </p> </div>
			<div class="monster-list-item item-source" style="grid-area: source"> <p> ${source}, page ${page} </p> </div>
		</div>
		</td>
		`;
		monsterTbody.appendChild(monsterRow);
	}

	let numCells = 10 - (endIndex - startIndex);
	for (let i = 0; i < numCells; i++) {
		const monsterRow = document.createElement("tr");
		monsterRow.innerHTML = `
		<td colspan="7"><div class="monster-list-display"></div></td>
		`;
		monsterTbody.appendChild(monsterRow);
	}

	totalMonsters = searchedFilteredMonsters.length;
}

function sortAndFilterMonsters() {
	sortedList = sortMainList(monstersData, sortBy, sortOrder);
	filteredList = sortedList.filter(values => {
		return applyCurrentFilter(values);
	});
	filteredMonsters = filteredList;
}

function applyCurrentFilter(values) {
	const [level, name, size, role, type, source, page] = values;
	let valueCat = ["level", "name", "size", "role", "type", "source", "page"];
	let filterResult = true;
	valueCat.forEach(el => {
		filterResult |= filterStack[el](values[valueCat.indexOf(el)]);
	});
	return filterResult;
}

function sortMainList(mainList, sortBy, sortOrder) {

    const categories = ["level", "name", "size", "role", "type", "source", "page"];
        
    mainList.sort((a, b) => {
        const valueA = a[categories.indexOf(sortBy)];
        const valueB = b[categories.indexOf(sortBy)];


        if (sortOrder === "ascending") {
            return comparison(valueA, valueB);
        } else {
            return comparison(valueB, valueA);
        }
    });

    return mainList;
}

function comparison(a, b){
	if (typeof a == 'number')
	{
		return a - b; 
	}
	else if(typeof a == "string")
	{
		return a.localeCompare(b);
	}
	else
	{
		return 0;
	}
}

function searchFilter(mainList, searchText) {    
    const filteredList = mainList.filter(sublist => {
        return sublist.some(item => {
            if (typeof item === "string" && item.toLowerCase().includes(searchText.toLowerCase())) {
                return true;
            }
        });
    });    
    return filteredList;
}

function newOrder(element, newSortBy) {
	if (sortBy = newSortBy)
	{
		if (element.classList.contains("up")){
			element.classList.remove("up");
			element.classList.add("down");
			sortOrder = "descending";
		}
		else
		{
			element.classList.remove("down");
			element.classList.add("up");
			sortOrder = "ascending";
		}
	}
	else
	{	
		sortBy = newSortBy;
		sortOrder = "ascending";
		element.classList.remove("down");
		element.classList.add("up");
	}

	document.querySelectorAll('.monster-table-head.selected').forEach(el => el.classList.remove("selected"));
	element.classList.add("selected");	
	document.querySelectorAll('.monster-table-head:not(.selected)').forEach(el => {el.classList.remove("down"); el.classList.remove("up");});

	sortAndFilterMonsters();
	updateMonsterList();

}












/* Updating Page numbers */

function updatePageNumbers(totalPages) {
	const pageNumbersContainer = document.getElementById("page-numbers");
	pageNumbersContainer.innerHTML = "";

	const pageNumbersToShow = Math.min(maxVisiblePages, totalPages);
	const maxCentrePages = maxVisiblePages - 4;
	const centrePageGap = Math.floor(maxCentrePages / 2);


	if (totalPages <= maxVisiblePages) {
		for (let i = 1; i <= totalPages; i++) {
			pageNumbersContainer.appendChild(createPageNumberButton(i));
		}
	} else {
		if (currentPage <= maxCentrePages)
		{
			// Page number close to start, no initial ellipsis
			for (let i = 1; i <= maxVisiblePages - 2; i++) {
				pageNumbersContainer.appendChild(createPageNumberButton(i));
			}
			pageNumbersContainer.appendChild(createEllipsis(maxCentrePages+3));
			pageNumbersContainer.appendChild(createPageNumberButton(totalPages));
		} else if (currentPage >= totalPages - maxCentrePages + 1) {
			// Page number close to end, no final ellipsis
			pageNumbersContainer.appendChild(createPageNumberButton(1));
			pageNumbersContainer.appendChild(createEllipsis(totalPages - maxVisiblePages + 2));
			for (let i = totalPages - maxVisiblePages + 3; i <= totalPages; i++) {
				pageNumbersContainer.appendChild(createPageNumberButton(i));
			}
		} else {
			//Somewhere in the middle, ellipsis both sides
			pageNumbersContainer.appendChild(createPageNumberButton(1));
			pageNumbersContainer.appendChild(createEllipsis(currentPage - centrePageGap - 1));
			for (let i =  currentPage - centrePageGap; i <= currentPage + centrePageGap; i++) {
				pageNumbersContainer.appendChild(createPageNumberButton(i));
			}
			pageNumbersContainer.appendChild(createEllipsis(currentPage + centrePageGap + 1));
			pageNumbersContainer.appendChild(createPageNumberButton(totalPages));
		}
	}
}

function createPageNumberButton(pageNumber) {
	const button = document.createElement("button");
	button.textContent = pageNumber;
	if (pageNumber == currentPage)
	{
		button.setAttribute("disabled", "disabled");
	}
	button.className = "page-number"
	
	button.addEventListener("click", () => {
		currentPage = pageNumber;
		updateMonsterList();
	});
	return button;
}

function createEllipsis(pageNumber) {
	const ellipsis = document.createElement("button");
	ellipsis.className = "ellipsis";
	ellipsis.textContent = "...";

	ellipsis.addEventListener("click", () => {
		currentPage = pageNumber;
		updateMonsterList();
	});
	return ellipsis;
}








/* Page resizing */
function openTab(sender, tabName) {
  var i;
  var tabs = document.getElementsByClassName("tab");
  for (i = 0; i < tabs.length; i++) {
	tabs[i].classList.add("noDisplay");
  }
  document.getElementById(tabName).classList.remove("noDisplay");

  var tabButtons = document.getElementsByClassName("tab-button");
  for (i = 0; i < tabButtons.length; i++) {
	tabButtons[i].classList.remove("selected");
  }
  sender.classList.add("selected");

  adjustMonsterTable();
}

function adjustMonsterTable() {
	let monsterTable = document.getElementById("monster-table")
	previous = monsterTable.classList.contains("wide-table")
	if (monsterTable.offsetWidth - monsterTable.offsetHeight < 0) {
		monsterTable.classList.remove("wide-table");
	}
	else
	{
		monsterTable.classList.add("wide-table");
	}

	const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
	const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

	// Select elements with the corresponding classes
	const noDisplayTabs = document.querySelectorAll('.tab');
	const tabButtonContainer = document.getElementById('tab-button-container');

	// Apply the CSS rules based on viewport width
	if (viewportWidth >= viewportHeight * 0.9) {
	    noDisplayTabs.forEach(tab => {
	        tab.classList.add('ignoreNoDisplay');
	    });
      tabButtonContainer.style.display = 'none';
	}
	else
	{
		noDisplayTabs.forEach(tab => {
	        tab.classList.remove('ignoreNoDisplay');
	    });
      tabButtonContainer.style.display = 'flex';
	}
}







/* Monster CR Calculating */
function calcPower(x) {
	switch(x) {
		case -3: return 0.2;
		case -2: return 0.5;
		case -1: return 0.7;
		case  0: return 1;
		case  1: return 1.5;
		case  2: return 2;
		case 3: return 3;
		case 4: return 4;
		default: return -1;
	}
	return to2dp(1 + (1/3)*x + (1/8)*Math.pow(x,2) + (1/24)*Math.pow(x,3));
}

function to2dp(x) {
	return Math.round(x * 100) / 100;
}

function calculateChallengeFactor(partyLevel, monsterLevel, monsterInfo) {

  let levelDifference = monsterLevel - partyLevel;

  let mookDiv = 5;
  if (partyLevel < 5) { mookDiv -= 1; }
  if (partyLevel < 3) { mookDiv -= 1; }

  if (partyLevel > 4) { levelDifference -= 1; }  
  if (partyLevel > 7) { levelDifference -= 1; }
  let challengeFactor = calcPower(levelDifference);

  let monsterInfoLower = monsterInfo.toLowerCase();

  if (monsterInfoLower.includes('mook')) {
    challengeFactor = Math.round((challengeFactor / mookDiv)*20)/20;
  } else if (monsterInfoLower.includes('large') || monsterInfoLower.includes("double-strength")) {
    challengeFactor *= 2;
  } else if (monsterInfoLower.includes('huge') || monsterInfoLower.includes("triple-strength")) {
    challengeFactor *= 3;
  }

  return challengeFactor;
}

function calculateMonsterLevels(challengeRating, partyLevel) {

  if (partyLevel > 4) { partyLevel += 1; }  
  if (partyLevel > 7) { partyLevel += 1; }

  let mookDiv = 5;
  if (partyLevel < 5) { mookDiv -= 1; }
  if (partyLevel < 3) { mookDiv -= 1; }

  let monsterLevels = {
  mook: -1,
  normal: -1,
  large: -1,
  huge: -1,
  dmook: 100,
  dnormal: 100,
  dlarge: 100,
  dhuge: 100
  };

  for (let i = 0; i < 20; i++) {
  	let levelDifference = i - partyLevel;
  	let power = calcPower(levelDifference);
  	["mook", "normal", "large", "huge"].forEach(el => {
  		let difference = Math.abs(challengeRating - power);
  		let newPower = power;
 			let monsterInfoLower = el;

  		if (monsterInfoLower.includes('mook')) {
		    newPower = newPower;
		  } else if (monsterInfoLower.includes('large') || monsterInfoLower.includes("double-strength")) {
		    newPower *= 2;
		  } else if (monsterInfoLower.includes('huge') || monsterInfoLower.includes("triple-strength")) {
		    newPower *= 3;
		  }

  		if (monsterLevels["d" + el] > difference)
  		{
  			monsterLevels["d" + el] = difference;
  			monsterLevels[el] = newPower;
  		}
  	});
  }

return monsterLevels;
}










/* Battle creation */
function addMonsterFromTable(idNumber) {
	let display = document.getElementById("display-result");	
	let [level, name, size, role, type, source, page] = searchedFilteredMonsters[idNumber];

	if (name in currentMonsters) {
		currentMonsters[name].querySelector(".increment").click();
	}
	else
	{
		const monsterEntry = document.createElement("div");
		monsterEntry.innerHTML = `
		<div class="monster-generator-display" data-level='${level}' data-size='${size} ${role}'>
			<div class="monster-gen-item item-name" style="grid-area: name" title="${name}"> <p> ${name} </p> </div>
			<div class="monster-gen-item item-info" style="grid-area: info"> <p>${size.toLowerCase() == "normal" ? "" : size} ${level}${suffixNum(level)} Level ${role} [${type}]</p>  </div>
			<div class="monster-gen-item item-source" style="grid-area: source"> <p> ${source}, page ${page} </p> </div>
			<div class="quantity-button" style="grid-area: qty">
	        <button class="increment" onclick="increment(this)">+</button>
	        <input type="number" class="quantity-input" value="1" min="1">
	        <button class="decrement deleter" onclick="decrement(this)">x</button>
	    </div>
		</div>
		`;
		document.getElementById("display-result").appendChild(monsterEntry);
		currentMonsters[name] = monsterEntry;
	}
	getBattleRating();
}

function suffixNum(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return "st";
    }
    if (j == 2 && k != 12) {
        return "nd";
    }
    if (j == 3 && k != 13) {
        return "rd";
    }
    return "th";
}

function increment(object) {
	currentNum = object.nextElementSibling;
	currentNum.value++;

	object.nextElementSibling.nextElementSibling.classList.remove("deleter");
	object.nextElementSibling.nextElementSibling.innerHTML="&minus;";

	getBattleRating();
}

async function decrement(object) {
	let currentNum = object.previousElementSibling;
	currentNum.value--;

	if (currentNum.value == 1)
	{
		delay(0).then(() => {
			object.innerHTML = "x";
			object.classList.add("deleter");
		});
	}

	if (currentNum.value == 0) {
		let qb = currentNum.parentElement;
		let grid = qb.parentElement;
		let container = grid.parentElement;
		let id = container.querySelector(".item-name p");
		container.style.cssText = `
		transition: all 0.1s;
		color: rgba(255,255,255,0) !important;
		background-color = rgba(255,255,255,0) !important;
		`;
		grid.style.cssText = `
		transition: all 0.2s;
		height: 0;
		`;
		Array.from(qb.children).forEach(el => {
			el.style.cssText = `
				transition: all 0.1s;
				color: rgba(255,255,255,0) !important;
				background-color: rgba(255,255,255,0) !important;
				border: none;
				`;
		})
		await delay(200);
		delete currentMonsters[id.innerHTML.trim()];
		container.remove();
	}

	getBattleRating();
}

function validateNumericInput(object) {
	if (this.value < 1) {
		this.value = 1;
	}
}

function getBattleRating() {	
	let display = document.getElementById("display-result");	
	let battleVal = document.getElementById("battle-stats-qty");
	let bVal = 0

	display.querySelectorAll(".monster-generator-display").forEach(el => {
		let monsterQty = el.querySelector(".quantity-input");
		let monsterLevel = el.dataset.level;
		let monsterInfo = el.dataset.size;

		let tempVal = to2dp(monsterQty.value * calculateChallengeFactor(groupLevel.value, monsterLevel, monsterInfo));
		bVal += Math.max(0,tempVal)

		if (tempVal <= 0) {
			monsterQty.classList.add("strikethrough")
		}
		else
		{
			monsterQty.classList.remove("strikethrough")			
		}
	});

	battleVal.innerHTML = bVal
}












/* Automatic Battle Generation */
function makeNewBattle(){
	currentMonsters = [];	
	let display = document.getElementById("display-result");	
	display.innerHTML = "";
	getBattleRating();

	let battleStrength = document.getElementById("select-strength");
	let battleFormat = document.getElementById("select-format");

	let x = getSingleRandomMonster(1, groupLevel.value, true);
	addMonsterFromTable(x);


}

function getSingleRandomMonster(challengeRating, partyLevel, allowMooks) {
	let foundMonsters = [];
	let nearest = 1000;
	let monsterLevels = calculateMonsterLevels(challengeRating, partyLevel);

	searchedFilteredMonsters.forEach(monster => 
	{	
		let [level, name, size, role, type, source, page] = monster;
		let levelDiff;

		let monStr = monster.join();
		if (allowMooks && monStr.includes("mook")) {
			levelDiff = Math.abs(level - monsterLevels.mook)
		} 
		else if (monStr.includes("large") || monStr.includes("double-strength"))
		{
			levelDiff = Math.abs(level - monsterLevels.large)
		}
		else if (monStr.includes('huge') || monStr.includes("triple-strength")) 
		{
		  levelDiff = Math.abs(level - monsterLevels.huge)
		} 
		else 
		{
			levelDiff = Math.abs(level - monsterLevels.normal);
		}

		if (levelDiff < nearest) {
			nearest = levelDiff;
			foundMonsters = [];
		}
		if (levelDiff <= nearest) {
			foundMonsters.push(monster)
		}
	});

	console.log(challengeRating + "," + partyLevel + "," + nearest);
	let selectedMonster = foundMonsters[Math.floor(Math.random()*foundMonsters.length)];
	return searchedFilteredMonsters.indexOf(selectedMonster);
}













/* On page load */

window.onload=setTimeout(updateMonsterList, 20);
window.onload=setTimeout(adjustMonsterTable, 20);
window.onresize=adjustMonsterTable;
adjustMonsterTable();

document.addEventListener("DOMContentLoaded", () => {
	const partyInput = document.getElementById("party-input");
	const groupLevel = document.getElementById("group-level");
	const groupPlayers = document.getElementById("group-players");
	const monsterList = document.getElementById("monster-list");
	const searchInput = document.getElementById("search-input");

	fetchMonstersCSV();
	adjustMonsterTable();

	groupLevel.addEventListener("change", (event) => {
		updateMonsterList();
	});

	groupPlayers.addEventListener("change", (event) => {
		updateMonsterList();
	});

	searchInput.addEventListener("input", function() {
    searchText = searchInput.value;
    currentPage = 1;
    updatePageNumbers();
    updateMonsterList();
	});
});
