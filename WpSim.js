"use strict";
var allUnits = []; // To store all unit objects (containing all unit attributes), exists so that we can loop through every unit.
var armyGood = []; // Array for storing the army units in the Good army.
var armyEvil = []; // Array for storing the army units in the Evil army.
var attackersGood = []; // Arrays for storing the units that scored hits, separate from the main army arrays..
var attackersEvil = []; //...So that units can be killed (and removed from the army array) but still attack back.
var attackOrder = []; // The ordering of attack types preferred for vs the given defending unit.
var unitCount; // Variable for storing the value of one of the unit number input fields.
var winsGood = 0; // Count of number of trials resulting in the army of good winning.
var winsEvil = 0; // Count of number of trials resulting in the army of evil winning.
var draws = 0; // Count of number of trials resulting in both armies being fully destroyed.
var trials = 0; // Number of battles to be run from initial unit counts till finish, to reduce variance.
var outputText = ""; // Stores the output to be printed for the user.
var shadeKills = 0; // The number of units killed by shades in a round of combat....
//...Exists so that skeletons can be summoned the next round, rather than right away.
var hardenedSteel = false;
var ringOfCarnage = false;
var buffsActive = false;
var enraged = false;


function unit(name, attack, attackMod, attack2, attackMod2, damage, ranged, defence, defenceMod, move, row, hp, army, cost, id) {
	this.name = name;
	this.attack = attack;
	this.attackMod = attackMod; // the "-1" if it exists
	this.attack2 = attack2;
	this.attackMod2 = attackMod2;
	this.damage = damage;
	this.ranged = ranged;
	this.defence = defence; 
	this.defenceMod = defenceMod; // the "-1" if it exists
	this.move = move;
	this.row = row;
	this.hp = hp;
	this.army = army; // probably not needed, good/evil
	this.cost = cost;
	this.input = document.getElementById(id); // the id of the number input field
	this.priority = hp / ((attack + attackMod + attack2 + attackMod2) * (3.5 - defenceMod) * (6 - defence)) + 100 * row ; // determines the targeting order
	this.survivors = 0;
	this.currHp = hp;	
	this.attackType = getAttackType(this, 1);
	this.attackType2 = getAttackType(this, 2);
	this.hits = 0;
	this.hits2 = 0;
	this.attackUsed = 1;
	
	allUnits.push(this);
	    
	this.getCount = function() // Initialises the unit counts based on the users input.
	{
		this.count = parseInt(this.input.value, 10) || 0; // Sets count to either the users input, or 0 (if no input).
		this.initialCount = this.count; // Stores the initial count so that the armies can be reset between trials.
	}
	
	this.addSurvivors = function() 
	{
		this.survivors += this.count; // Adds up the number of remaining units after each trial.
	}

	this.resetCount = function ()
	{
		this.count = this.initialCount; // Resets the unit count to the users input.
	}
	
	this.resetSurvivors = function()
	{
		this.survivors = 0; // Resets the number of survivors.
	}
	
	this.resetHp = function()
	{
		this.currHp = this.hp; // Resets the units hp in case damage has been taken.
	}
	
}

//adding all unit stats
var dWarrior = new unit("Warrior",3,0,0,0,1,false,2,0,1,1,1,"Dwarves",5,"dWarrior");
var dBezerker = new unit("Bezerker",3,0,3,0,1,false,3,0,1,1,1,"Dwarves",8,"dBezerker");
var dArcher = new unit("Archer",4,0,0,0,1,true,1,0,1,2,1,"Dwarves",5,"dArcher");
var dPony = new unit("Halfling Pony Rider",3,0,0,0,1,false,2,1,2,1,1,"Dwarves",12,"dPony");
var dMusketeer = new unit("Musketeer",4,1,0,0,1,true,1,0,1,2,1,"Dwarves",5,"dMusketeer");
var dCannon= new unit("Cannon",5,2,0,0,2,true,1,0,1,2,1,"Dwarves",10,"dCannon");
var hSoldier = new unit("Soldier",3,0,0,0,1,false,2,0,1,1,1,"Humans",5,"hSoldier");
var hPikeman = new unit("Pikeman",3,0,0,0,1,false,3,0,1,1,1,"Humans",6,"hPikeman");
var hArcher = new unit("Archer",4,0,0,0,1,true,1,0,1,2,1,"Humans",5,"hArcher");
var hKnight = new unit("Knight",4,1,0,0,1,false,3,1,2,1,1,"Humans",16,"hKnight");
var hCatapult = new unit("Catapult",5,1,0,0,2,true,1,0,1,2,1,"Humans",8,"hCatapult");
var uSkeleton = new unit("Skeleton",3,0,0,0,1,false,2,0,1,1,1,"Undead",5,"uSkeleton");
var uArcher = new unit("Archer",4,0,0,0,1,true,1,0,1,2,1,"Undead",5,"uArcher");
var uGhoul = new unit("Ghoul Mangler",4,1,0,0,1,false,3,0,1,1,2,"Undead",12,"uGhoul");
var uVampire = new unit("Vampire",4,0,0,0,1,false,3,1,2,1,1,"Undead",16,"uVampire");
var uShade = new unit("Shade",2,0,0,0,1,true,3,0,2,2,1,"Undead",11,"uShade");
var gGoblin = new unit("Goblin",3,0,0,0,1,false,2,0,1,1,1,"Goblins",5,"gGoblin");
var gOrc = new unit("Orc",4,0,0,0,1,false,3,0,1,1,1,"Goblins",7,"gOrc");
var gArcher = new unit("Archer",4,0,0,0,1,true,1,0,1,2,1,"Goblins",5,"gArcher");
var gOgre = new unit("Ogre",4,1,0,0,1,false,2,0,1,1,3,"Goblins",13,"gOgre");
var gWolf = new unit("Wolf Rider",4,0,0,0,1,false,2,1,2,1,1,"Goblins",14,"gWolf");
var gBallista = new unit("Ballista",4,1,0,0,2,true,1,0,1,2,1,"Goblins",7,"gBallista");


window.onload=function(){
	document.getElementById("Submit").onclick = submit;
	allUnits.sort(compare); // sorts defending units by priority
 }

function submit(){
	getInput();
	applyBuffs();
	runTrials();
	averageSurvivors();
	resetArmies("survivors");
	printResult();
	resetAll();
}

function resetAll(){
	var i;
	var units = allUnits.length;
	
	for (i = 0; i < units; i++){
		allUnits[i].resetSurvivors();
	}
	outputText = "";
	winsGood = 0;
	winsEvil = 0;
	draws = 0;
	trials = 0;
	uGhoul.hp = 2;
	if(buffsActive){
		removeBuffs();
	}
}

function removeBuffs(){
	var i;
	var j;
	var units = allUnits.length;
		
	if(hardenedSteel){
		for (i = 0; i < units; i++){
			if (allUnits[i].army == "Dwarves") {
				allUnits[i].defenceMod--;
			}
		}
	}
 
	if(ringOfCarnage){
		for (j = 0; j < units; j++){
			if (allUnits[j].army == "Goblins" && allUnits[j].row == 1) {
				allUnits[j].attack--;
				if (allUnits[j].attack2 > 0){
					allUnits[j].attack2--;					
				}
			}
		} 
	}
	
	buffsActive = false;
}

function getInput() {
	var i;
	var units = allUnits.length;
	
	for (i = 0; i < units; i++){
		allUnits[i].getCount();
	}
	trials = document.getElementById("Trials").value;
	hardenedSteel = document.getElementById("HardenedSteel").checked;
	ringOfCarnage = document.getElementById("RingOfCarnage").checked;
	enraged = document.getElementById("Enraged").checked;
	console.log("Trials: " + trials);
}

function runTrials() {
var i;
var j;
var k;
var unitsGood;
var unitsEvil;
	
	for(k = 0; k < trials; k++)
	{
		resetArmies("count");
		fightRound();
		addAllSurvivors();
		
		unitsGood = armyGood.length;
		unitsEvil = armyEvil.length;
		
		for (i = 0; i < unitsGood; i++){		
			outputText += " " + armyGood[i].name + " " + armyGood[i].survivors;
		}	
		for (j = 0; j < unitsEvil; j++){		
			outputText += " " + armyEvil[j].name + " " + armyEvil[j].survivors;
		}	
		console.log(outputText);
		outputText = "";
	

		if (unitsGood == 0 && unitsEvil > 0){
			winsEvil++;
		}
		
		if (unitsGood > 0 && unitsEvil == 0){
			winsGood++;
		}
		
		if (unitsGood == 0 && unitsEvil == 0){
			console.log("No survivors");
			draws++;
		}		
		resetUnits();
	}	
}

function averageSurvivors(){
	var i;
	var units = allUnits.length;
	
	for (i = 0; i < units; i++){
		if (allUnits[i].survivors > 0) {
			console.log(allUnits[i].name + " Survivors: " + allUnits[i].survivors + "Count: " + allUnits[i].count);
		}
		allUnits[i].survivors /= trials;
	}
}

function addAllSurvivors() {
	var i;
	var units = allUnits.length;
	
	for (i = 0; i < units; i++){
		allUnits[i].addSurvivors();
	}
}

function resetUnits(){
	var i;
	var units = allUnits.length;
	
	for (i = 0; i < units; i++){
		allUnits[i].resetCount();
		allUnits[i].resetHp();
	}
}

function resetArmies(propertyOf) {	
	var i;
	var units = allUnits.length;
	
	armyGood.splice(0); // Clears previous array
	armyEvil.splice(0); // Clears previous array
	
	for (i = 0; i < units; i++){ // Cycles through each unit type.
		if (allUnits[i][propertyOf] > 0) // Checks that there is a positive input for that unit.
		{
			if (allUnits[i].army == "Dwarves" || allUnits[i].army == "Humans") { // Checks to see which army the unit is part of
				armyGood.push(allUnits[i]); // Adds the unit to the Good army if good.
			} else {
				armyEvil.push(allUnits[i]); // Adds the unit to the Evil army if evil.
			}
		}             
	}
}

function resetHits(army){ // Resets the hit counters for the army this round to 0,
	var i;
	var armySize = army.length;

	for(i = 0; i < armySize; i++){
		army[i].hits = 0;
		army[i].hits2 = 0;
	}
}

function getAttackType(unit, attack){
	var attackType = "";
	var modifier = "";
	var damage = "";
	var ranged = "";
	var attackMod = "attackMod";
	
	if (attack == 2){
		attackMod = "attackMod2";
	}
	
	if (unit[attackMod] > 0){
		modifier = "mod";
	}
	
	if(unit.damage > 1){
		damage = "Dmg";
	}
	
	if(unit.ranged){
		ranged = "Rng";
	}
	
	attackType = modifier + damage + ranged + "Hits";
	console.log(unit.name + "s attack type is " + attackType);
	return attackType;
}

function rollHits(army) { // Generates number of hits for the specified army.
	var i;
	var j;
	var armySize = army.length;
    resetHits(army);

	for(i = 0; i < armySize; i++){ // Loops through each unit type
        for (j = 0; j < army[i].count; j++){ // Loops for each unit of that type in the army
            if (army[i].attack >= rollDie(6)) { // Checks if a hit is scored by the unit
                army[i].hits++;
				console.log(army[i].name + " scored a hit with primary attack. ");
            } else {
				console.log(army[i].name + " failed an attack. ");
			}
			
			if(army[i].attack2 > 0) {
				if (army[i].attack2 >= rollDie(6)) { // Checks if a hit is scored by the units secondary attack
					army[i].hits2++;
					console.log(army[i].name + " scored a hit with secondary attack. ");
				}	else {
					console.log(army[i].name + " failed a secondary attack.");
				}
			}
        }                                             
    }
}	
 
function rollDie(sides){
    return (Math.floor(Math.random() * sides) + 1); // Generates a random number 1-sides
}
 
function getAttackOrder(army){
	if (army[0].currHp > 1){
		if(army.length > 1 && army[0].defence > army[1].defence){
			attackOrder = ["modDmgHits", "modDmgRngHits",//
			"DmgHits","DmgRngHits","modHits","modRngHits","Hits","RngHits"];
		} else {
			attackOrder = ["DmgHits", "DmgRngHits", "modDmgHits", "modDmgRngHits",//
			"Hits","RngHits","modHits", "modRngHits"];
		}
	} else {
		if(army.length > 1 && army[0].defence > army[1].defence){
			if(army[1].hp > 1){
				attackOrder = ["modHits", "modRngHits", "Hits", "RngHits",//
				"modDmgHits", "modDmgRngHits", "DmgHits", "DmgRngHits"];
			} else {
				attackOrder = ["modHits", "modRngHits",//
				 "modDmgHits", "modDmgRngHits", "Hits", "RngHits", "DmgHits", "DmgRngHits"];
			}
		} else {
			attackOrder = ["Hits", "RngHits", "modHits", "modRngHits",//
			"DmgHits", "DmgRngHits", "modDmgHits", "modDmgRngHits"]; //default ordering from least useful to most.
		}
	}
}
  
function rollDefend(attacker, defender) {
	var i;
	var defenders = defender.length;
	var attackInfo;
	var iterations = 0;
	
    for (i = 0; i < defenders; i++) { // for each defender unit type in the army
		getAttackOrder(defender);
        while (defender[i].count > 0 && attacker.length > 0){ // While there are still hits, and defenders of the army type..
		attackInfo = getAttacker(attacker);
			if (defender[i].defenceMod < rollDie(attacker[attackInfo[0]]["attack" + attackInfo[1]])){ //Checks to see if the hit would have been avoided due to the defence mod
				if (defender[i].defence - attacker[attackInfo[0]]["attackMod" + attackInfo[1]] < rollDie(6)) { // Checks if defending unit survives this hit
					if(defender[i].currHp <= attacker[attackInfo[0]].damage){
						defender[i].count--;			
						console.log("A " + defender[i].name + " failed to block a hit and was killed.");
						if(attacker[attackInfo[0]].name == "Shade"){
							shadeKills++;
							console.log("Their skeleton will fight for the undead next round!");
						}
						defender[i].resetHp();
					} else {
						defender[i].currHp -= attacker[attackInfo[0]].damage;
						console.log("A " + defender[i].name + " failed to block a hit and now has " + defender[i].currHp + " hp remaining.");
					}							
				} else {
					console.log("The " + defender[i].name + " managed to block a hit.");
				}
			} else {
				console.log("The " + defender[i].name + " wasn't actually hit, due to it's defence modifier of -" + defender[i].defenceMod);
			}
			if(attacker[attackInfo[0]].hits == 0 && attacker[attackInfo[0]].hits2 == 0){
				attacker.splice(attackInfo[0], 1);
			}
			
        }
		
		console.log("There are " + defender[i].count + " " + defender[i].name + "s remaining in the " + defender[i].army + " army.");
		
		if (defender[i].count == 0){ // check if units of that type remain
			defender.splice(i, 1); // if not, remove that unit type from defender army
			i--; // move i position back one to account for the missing unit type
			defenders = defender.length;
		}
    }
}
 
 function getAttacker(attacker){
	 var k;
	 var j;
	 var attackTypes = attackOrder.length;
	 var attackers = attacker.length;
	 
	 for (k = 0; k < attackTypes; k++){
		 for (j = 0; j < attackers; j++ ){
			 if(attacker[j].attackType == attackOrder[k] && attacker[j].hits > 0){
				 attacker[j].hits--;
				 return [j, ""];
			 } 
			 
			 if(attacker[j].attackType2 == attackOrder[k] && attacker[j].hits2 > 0){
				 attacker[j].hits2--;
				 return [j, "2"];
			 }
		 }
	 }
 }
 
 function fightRound() {
 var round = 1;	 
	while (armyGood.length > 0 && armyEvil.length > 0 || shadeKills > 0) { // Loop runs as long as both armies still have units.
	if(shadeKills > 0){
		summonSkeletons();
	}
	
	if(round == 2 && buffsActive){
		removeBuffs();
	}
	
	rollHits(armyGood); // Generates number of hits for the army army of good
	rollHits(armyEvil); // Generates number of hits for the army army of evil
	populateAttackers();
	rollDefend(attackersGood, armyEvil); // The army of evil rolls to defend vs good and takes losses.
	rollDefend(attackersEvil, armyGood); // The army of good rolls to defend vs evil and takes losses.
	round++;
	}
 }
 
 function applyBuffs(){
	var i;
	var j;
	var units = allUnits.length;
	
	if(hardenedSteel){
		for (i = 0; i < units; i++){
			if (allUnits[i].army == "Dwarves") {
				allUnits[i].defenceMod++;
			}
		}
	}
 
	if(ringOfCarnage){
		for (j = 0; j < units; j++){
			if (allUnits[j].army == "Goblins" && allUnits[j].row == 1) {
				allUnits[j].attack++;
				if (allUnits[j].attack2 > 0){
					allUnits[j].attack2++;					
				}
			}
		} 
	}
	
	if(enraged){
		 uGhoul.hp = 3;
	}
	
	buffsActive = true;
 }
  
 function summonSkeletons(){
	 var i;
	 var unitsEvil = armyEvil.length;
	 var hasSkeleton = false;
	 
	 for(i = 0; i < unitsEvil; i++){
		 if(armyEvil[i].name == "Skeleton"){
			 hasSkeleton = true;
			 break;
		 }
	 }	 
	 
	 if(!hasSkeleton){
		 armyEvil.push(uSkeleton);
		 armyEvil.sort(compare);
	}
	
	uSkeleton.count += shadeKills;
	shadeKills = 0;
 }
 
 function populateAttackers(){
	 var i;
	 var units = allUnits.length;
	 
	 attackersGood.splice(0);
	 attackersEvil.splice(0);
	 for (i = 0; i < units; i++){
		 if (allUnits[i].hits > 0 || allUnits[i].hits2 > 0){
			 if (allUnits[i].army == "Dwarves" || allUnits[i].army == "Humans"){
				 attackersGood.push(allUnits[i]);
			 } else {
				 attackersEvil.push(allUnits[i]);
			 }
		 }
	 }
 }
  
 function printResult() {
	var i;
	var j;
	var unitsGood = armyGood.length;
	var unitsEvil = armyEvil.length;
	 
	outputText += "\rAverage Good survivors:"
	for (i = 0; i < armyGood.length; i++){		
		outputText += "\r" + armyGood[i].name + " " + armyGood[i].survivors;
	}	

    outputText += "\r\rAverage Evil survivors:"
	for (j = 0; j < armyEvil.length; j++){		
		outputText += "\r" + armyEvil[j].name + " " + armyEvil[j].survivors;
	}	
	
	outputText += "\r\rGood Wins: " + winsGood + " Evil wins: " + winsEvil + " Draws: " + draws;
	
	document.getElementById("Output").innerText = outputText;
 }
 
 function testPrint() {
	document.getElementById("Output").innerText += survivorsGood[allUnits[0].survivorIndex].name;
	//for (i = 0; i < allUnits.length; i++) {
		//document.getElementById("Output").innerText += allUnits[i].name + " " + allUnits[i].priority + "\r";
	//}
 }
 
 function compare(a,b) {
  if (a.priority < b.priority)
    return -1;
  if (a.priority > b.priority)
    return 1;
  return 0;
}