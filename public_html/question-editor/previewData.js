"use strict";

//Inserted via JS in order to override the default.
document.querySelector("head").insertAdjacentHTML("beforeend", `
<link rel="apple-touch-icon" sizes="180x180" href="/question-editor/preview-favicons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/question-editor/preview-favicons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/question-editor/preview-favicons/favicon-16x16.png">
<link rel="manifest" href="/question-editor/preview-favicons/site.webmanifest">
<link rel="mask-icon" href="/question-editor/preview-favicons/safari-pinned-tab.svg" color="#ff8585">
<link rel="shortcut icon" href="/question-editor/preview-favicons/favicon.ico">
<meta name="msapplication-TileColor" content="#da532c">
<meta name="msapplication-config" content="/question-editor/preview-favicons/browserconfig.xml">
<meta name="theme-color" content="#ffffff">
`);

var playerNames = {"AP":[{"name":"Aaden","gender":"male"},{"name":"Aarav","gender":"male"},{"name":"Aaron","gender":"male"},{"name":"Aarush","gender":"male"},{"name":"Abdiel","gender":"male"},{"name":"Abdullah","gender":"male"},{"name":"Abel","gender":"male"},{"name":"Abraham","gender":"male"},{"name":"Abram","gender":"male"},{"name":"Ace","gender":"male"},{"name":"Achilles","gender":"male"},{"name":"Adam","gender":"male"},{"name":"Adan","gender":"male"},{"name":"Aden","gender":"male"},{"name":"Adonis","gender":"male"},{"name":"Adrian","gender":"male"},{"name":"Adriel","gender":"male"},{"name":"Adrien","gender":"male"},{"name":"Agustin","gender":"male"},{"name":"Ahmad","gender":"male"},{"name":"Ahmed","gender":"male"},{"name":"Aidan","gender":"male"},{"name":"Aiden","gender":"male"},{"name":"Addison","gender":"neutral"},{"name":"Ainsley","gender":"neutral"},{"name":"Alex","gender":"neutral"},{"name":"Ari","gender":"neutral"},{"name":"Ariel","gender":"neutral"},{"name":"Ashley","gender":"neutral"},{"name":"Aspen","gender":"neutral"},{"name":"Aubrey","gender":"neutral"},{"name":"Avery","gender":"neutral"},{"name":"Alan","gender":"male"},{"name":"Albert","gender":"male"},{"name":"Alberto","gender":"male"},{"name":"Alden","gender":"male"},{"name":"Aldo","gender":"male"},{"name":"Alec","gender":"male"},{"name":"Alejandro","gender":"male"},{"name":"Alessandro","gender":"male"},{"name":"Alex","gender":"male"},{"name":"Alexander","gender":"male"},{"name":"Alexis","gender":"male"},{"name":"Alexzander","gender":"male"},{"name":"Alfonso","gender":"male"},{"name":"Alfred","gender":"male"},{"name":"Alfredo","gender":"male"},{"name":"Ali","gender":"male"},{"name":"Alijah","gender":"male"},{"name":"Allan","gender":"male"},{"name":"Allen","gender":"male"},{"name":"Alonso","gender":"male"},{"name":"Alonzo","gender":"male"},{"name":"Alvaro","gender":"male"},{"name":"Alvin","gender":"male"},{"name":"Amare","gender":"male"},{"name":"Amari","gender":"male"},{"name":"Ameer","gender":"male"},{"name":"Amir","gender":"male"},{"name":"Amos","gender":"male"},{"name":"Anakin","gender":"male"},{"name":"Anders","gender":"male"},{"name":"Anderson","gender":"male"},{"name":"Andre","gender":"male"},{"name":"Andres","gender":"male"},{"name":"Andrew","gender":"male"},{"name":"Andy","gender":"male"},{"name":"Angelo","gender":"male"},{"name":"Anson","gender":"male"},{"name":"Anthony","gender":"male"},{"name":"Antoine","gender":"male"},{"name":"Anton","gender":"male"},{"name":"Antonio","gender":"male"},{"name":"Apollo","gender":"male"},{"name":"Archer","gender":"male"},{"name":"Ares","gender":"male"},{"name":"Ari","gender":"male"},{"name":"Arian","gender":"male"},{"name":"Ariel","gender":"male"},{"name":"Arjun","gender":"male"},{"name":"Arlo","gender":"male"},{"name":"Armando","gender":"male"},{"name":"Armani","gender":"male"},{"name":"Aron","gender":"male"},{"name":"Arthur","gender":"male"},{"name":"Arturo","gender":"male"},{"name":"Aryan","gender":"male"},{"name":"Asa","gender":"male"},{"name":"Asher","gender":"male"},{"name":"Ashton","gender":"male"},{"name":"Atlas","gender":"male"},{"name":"Atticus","gender":"male"},{"name":"August","gender":"male"},{"name":"Augustine","gender":"male"},{"name":"Augustus","gender":"male"},{"name":"Austin","gender":"male"},{"name":"Avery","gender":"male"},{"name":"Avi","gender":"male"},{"name":"Axel","gender":"male"},{"name":"Axl","gender":"male"},{"name":"Axton","gender":"male"},{"name":"Ayaan","gender":"male"},{"name":"Aydan","gender":"male"},{"name":"Ayden","gender":"male"},{"name":"Aydin","gender":"male"},{"name":"Azariah","gender":"male"},{"name":"Aaliyah","gender":"female"},{"name":"Abby","gender":"female"},{"name":"Abigail","gender":"female"},{"name":"Abril","gender":"female"},{"name":"Ada","gender":"female"},{"name":"Adaline","gender":"female"},{"name":"Adalyn","gender":"female"},{"name":"Adalynn","gender":"female"},{"name":"Addilyn","gender":"female"},{"name":"Addilynn","gender":"female"},{"name":"Addison","gender":"female"},{"name":"Addisyn","gender":"female"},{"name":"Addyson","gender":"female"},{"name":"Adelaide","gender":"female"},{"name":"Adele","gender":"female"},{"name":"Adelina","gender":"female"},{"name":"Adeline","gender":"female"},{"name":"Adelyn","gender":"female"},{"name":"Adelynn","gender":"female"},{"name":"Adilynn","gender":"female"},{"name":"Adley","gender":"female"},{"name":"Adriana","gender":"female"},{"name":"Adrianna","gender":"female"},{"name":"Adrienne","gender":"female"},{"name":"Aileen","gender":"female"},{"name":"Aimee","gender":"female"},{"name":"Ainsley","gender":"female"},{"name":"Aisha","gender":"female"},{"name":"Aislinn","gender":"female"},{"name":"Aitana","gender":"female"},{"name":"Aiyana","gender":"female"},{"name":"Alaia","gender":"female"},{"name":"Alaina","gender":"female"},{"name":"Alana","gender":"female"},{"name":"Alani","gender":"female"},{"name":"Alanna","gender":"female"},{"name":"Alannah","gender":"female"},{"name":"Alaya","gender":"female"},{"name":"Alayah","gender":"female"},{"name":"Alayna","gender":"female"},{"name":"Aleah","gender":"female"},{"name":"Aleena","gender":"female"},{"name":"Alejandra","gender":"female"},{"name":"Alena","gender":"female"},{"name":"Alessandra","gender":"female"},{"name":"Alexa","gender":"female"},{"name":"Alexandra","gender":"female"},{"name":"Alexandria","gender":"female"},{"name":"Alexia","gender":"female"},{"name":"Alex","gender":"female"},{"name":"Alexis","gender":"female"},{"name":"Alia","gender":"female"},{"name":"Aliana","gender":"female"},{"name":"Alianna","gender":"female"},{"name":"Alice","gender":"female"},{"name":"Alicia","gender":"female"},{"name":"Alina","gender":"female"},{"name":"Alisha","gender":"female"},{"name":"Alison","gender":"female"},{"name":"Alissa","gender":"female"},{"name":"Alisson","gender":"female"},{"name":"Alivia","gender":"female"},{"name":"Aliya","gender":"female"},{"name":"Aliyah","gender":"female"},{"name":"Aliza","gender":"female"},{"name":"Allie","gender":"female"},{"name":"Allison","gender":"female"},{"name":"Ally","gender":"female"},{"name":"Allyson","gender":"female"},{"name":"Alma","gender":"female"},{"name":"Alondra","gender":"female"},{"name":"Alyson","gender":"female"},{"name":"Alyssa","gender":"female"},{"name":"Amalia","gender":"female"},{"name":"Amanda","gender":"female"},{"name":"Amani","gender":"female"},{"name":"Amara","gender":"female"},{"name":"Amari","gender":"female"},{"name":"Amaris","gender":"female"},{"name":"Amaya","gender":"female"},{"name":"Amber","gender":"female"},{"name":"Amelia","gender":"female"},{"name":"Amelie","gender":"female"},{"name":"Amia","gender":"female"},{"name":"Amina","gender":"female"},{"name":"Aminah","gender":"female"},{"name":"Amira","gender":"female"},{"name":"Amirah","gender":"female"},{"name":"Amiya","gender":"female"},{"name":"Amiyah","gender":"female"},{"name":"Amy","gender":"female"},{"name":"Amya","gender":"female"},{"name":"Ana","gender":"female"},{"name":"Anabella","gender":"female"},{"name":"Anabelle","gender":"female"},{"name":"Anahi","gender":"female"},{"name":"Analia","gender":"female"},{"name":"Anastasia","gender":"female"},{"name":"Anaya","gender":"female"},{"name":"Andi","gender":"female"},{"name":"Andrea","gender":"female"},{"name":"Angela","gender":"female"},{"name":"Angelica","gender":"female"},{"name":"Angelina","gender":"female"},{"name":"Angeline","gender":"female"},{"name":"Angelique","gender":"female"},{"name":"Angie","gender":"female"},{"name":"Anika","gender":"female"},{"name":"Aniya","gender":"female"},{"name":"Aniyah","gender":"female"},{"name":"Ann","gender":"female"},{"name":"Anna","gender":"female"},{"name":"Annabel","gender":"female"},{"name":"Annabella","gender":"female"},{"name":"Annabelle","gender":"female"},{"name":"Annalee","gender":"female"},{"name":"Annalise","gender":"female"},{"name":"Anne","gender":"female"},{"name":"Annie","gender":"female"},{"name":"Annika","gender":"female"},{"name":"Ansley","gender":"female"},{"name":"Anya","gender":"female"},{"name":"April","gender":"female"},{"name":"Arabella","gender":"female"},{"name":"Aranza","gender":"female"},{"name":"Arden","gender":"female"},{"name":"Arely","gender":"female"},{"name":"Aria","gender":"female"},{"name":"Ariadne","gender":"female"},{"name":"Ariah","gender":"female"},{"name":"Ariana","gender":"female"},{"name":"Arianna","gender":"female"},{"name":"Ariel","gender":"female"},{"name":"Ariella","gender":"female"},{"name":"Arielle","gender":"female"},{"name":"Ariya","gender":"female"},{"name":"Ariyah","gender":"female"},{"name":"Armani","gender":"female"},{"name":"Arya","gender":"female"},{"name":"Aryana","gender":"female"},{"name":"Aryanna","gender":"female"},{"name":"Ashley","gender":"female"},{"name":"Ashlyn","gender":"female"},{"name":"Ashlynn","gender":"female"},{"name":"Asia","gender":"female"},{"name":"Aspen","gender":"female"},{"name":"Astrid","gender":"female"},{"name":"Athena","gender":"female"},{"name":"Aubree","gender":"female"},{"name":"Aubrey","gender":"female"},{"name":"Aubrianna","gender":"female"},{"name":"Aubrie","gender":"female"},{"name":"Aubriella","gender":"female"},{"name":"Aubrielle","gender":"female"},{"name":"Audrey","gender":"female"},{"name":"Audrina","gender":"female"},{"name":"Aurora","gender":"female"},{"name":"Autumn","gender":"female"},{"name":"Autumn","gender":"neutral"},{"name":"Ava","gender":"female"},{"name":"Avah","gender":"female"},{"name":"Avalyn","gender":"female"},{"name":"Avalynn","gender":"female"},{"name":"Averi","gender":"female"},{"name":"Averie","gender":"female"},{"name":"Avery","gender":"female"},{"name":"Aviana","gender":"female"},{"name":"Avianna","gender":"female"},{"name":"Aya","gender":"female"},{"name":"Ayla","gender":"female"},{"name":"Ayleen","gender":"female"},{"name":"Aylin","gender":"female"},{"name":"Azalea","gender":"female"},{"name":"Azaria","gender":"female"},{"name":"Azariah","gender":"female"}],"NAP1":[{"name":"Barrett","gender":"male"},{"name":"Baylor","gender":"male"},{"name":"Beau","gender":"male"},{"name":"Beckett","gender":"male"},{"name":"Beckham","gender":"male"},{"name":"Ben","gender":"male"},{"name":"Benjamin","gender":"male"},{"name":"Bailey","gender":"neutral"},{"name":"Baylor","gender":"neutral"},{"name":"Beverly","gender":"neutral"},{"name":"Blaine","gender":"neutral"},{"name":"Bobbie","gender":"neutral"},{"name":"Brett","gender":"neutral"},{"name":"Brook","gender":"neutral"},{"name":"Bennett","gender":"male"},{"name":"Benson","gender":"male"},{"name":"Bentlee","gender":"male"},{"name":"Bentley","gender":"male"},{"name":"Benton","gender":"male"},{"name":"Billy","gender":"male"},{"name":"Bishop","gender":"male"},{"name":"Blaine","gender":"male"},{"name":"Blaise","gender":"male"},{"name":"Blake","gender":"male"},{"name":"Bo","gender":"male"},{"name":"Bobby","gender":"male"},{"name":"Bode","gender":"male"},{"name":"Boden","gender":"male"},{"name":"Bodhi","gender":"male"},{"name":"Bodie","gender":"male"},{"name":"Boone","gender":"male"},{"name":"Boston","gender":"male"},{"name":"Bowen","gender":"male"},{"name":"Braden","gender":"male"},{"name":"Bradley","gender":"male"},{"name":"Brady","gender":"male"},{"name":"Braeden","gender":"male"},{"name":"Braiden","gender":"male"},{"name":"Brandon","gender":"male"},{"name":"Branson","gender":"male"},{"name":"Brantlee","gender":"male"},{"name":"Brantley","gender":"male"},{"name":"Braxton","gender":"male"},{"name":"Brayan","gender":"male"},{"name":"Brayden","gender":"male"},{"name":"Braydon","gender":"male"},{"name":"Braylen","gender":"male"},{"name":"Braylon","gender":"male"},{"name":"Brecken","gender":"male"},{"name":"Brendan","gender":"male"},{"name":"Brenden","gender":"male"},{"name":"Brennan","gender":"male"},{"name":"Brent","gender":"male"},{"name":"Brentley","gender":"male"},{"name":"Brett","gender":"male"},{"name":"Brian","gender":"male"},{"name":"Briar","gender":"male"},{"name":"Brice","gender":"male"},{"name":"Briggs","gender":"male"},{"name":"Brixton","gender":"male"},{"name":"Brock","gender":"male"},{"name":"Brodie","gender":"male"},{"name":"Brody","gender":"male"},{"name":"Bronson","gender":"male"},{"name":"Brooks","gender":"male"},{"name":"Bruce","gender":"male"},{"name":"Bruno","gender":"male"},{"name":"Bryan","gender":"male"},{"name":"Bryant","gender":"male"},{"name":"Bryce","gender":"male"},{"name":"Brycen","gender":"male"},{"name":"Bryson","gender":"male"},{"name":"Byron","gender":"male"},{"name":"Bailee","gender":"female"},{"name":"Bailey","gender":"female"},{"name":"Barbara","gender":"female"},{"name":"Baylee","gender":"female"},{"name":"Beatrice","gender":"female"},{"name":"Belen","gender":"female"},{"name":"Bella","gender":"female"},{"name":"Bethany","gender":"female"},{"name":"Bianca","gender":"female"},{"name":"Blair","gender":"female"},{"name":"Blake","gender":"female"},{"name":"Blakely","gender":"female"},{"name":"Bonnie","gender":"female"},{"name":"Braelyn","gender":"female"},{"name":"Braelynn","gender":"female"},{"name":"Braylee","gender":"female"},{"name":"Breanna","gender":"female"},{"name":"Brenda","gender":"female"},{"name":"Brenna","gender":"female"},{"name":"Bria","gender":"female"},{"name":"Briana","gender":"female"},{"name":"Brianna","gender":"female"},{"name":"Briar","gender":"female"},{"name":"Bridget","gender":"female"},{"name":"Briella","gender":"female"},{"name":"Brielle","gender":"female"},{"name":"Briley","gender":"female"},{"name":"Brinley","gender":"female"},{"name":"Bristol","gender":"female"},{"name":"Brittany","gender":"female"},{"name":"Brooke","gender":"female"},{"name":"Brooklyn","gender":"female"},{"name":"Brooklynn","gender":"female"},{"name":"Bryanna","gender":"female"},{"name":"Brylee","gender":"female"},{"name":"Bryleigh","gender":"female"},{"name":"Brynlee","gender":"female"},{"name":"Brynn","gender":"female"}],"NAP2":[{"name":"Cade","gender":"male"},{"name":"Caden","gender":"male"},{"name":"Caiden","gender":"male"},{"name":"Cain","gender":"male"},{"name":"Cairo","gender":"male"},{"name":"Caleb","gender":"male"},{"name":"Callan","gender":"male"},{"name":"Callen","gender":"male"},{"name":"Callum","gender":"male"},{"name":"Calvin","gender":"male"},{"name":"Camden","gender":"male"},{"name":"Camdyn","gender":"male"},{"name":"Cameron","gender":"male"},{"name":"Camilo","gender":"male"},{"name":"Camren","gender":"male"},{"name":"Camron","gender":"male"},{"name":"Canaan","gender":"male"},{"name":"Cannon","gender":"male"},{"name":"Carl","gender":"male"},{"name":"Carlos","gender":"male"},{"name":"Carmelo","gender":"male"},{"name":"Carson","gender":"male"},{"name":"Carter","gender":"male"},{"name":"Case","gender":"male"},{"name":"Casen","gender":"male"},{"name":"Casey","gender":"male"},{"name":"Cash","gender":"male"},{"name":"Cason","gender":"male"},{"name":"Cassius","gender":"male"},{"name":"Castiel","gender":"male"},{"name":"Cayden","gender":"male"},{"name":"Cayson","gender":"male"},{"name":"Cedric","gender":"male"},{"name":"Cesar","gender":"male"},{"name":"Chace","gender":"male"},{"name":"Chad","gender":"male"},{"name":"Chaim","gender":"male"},{"name":"Channing","gender":"male"},{"name":"Charles","gender":"male"},{"name":"Charlie","gender":"male"},{"name":"Chase","gender":"male"},{"name":"Chevy","gender":"male"},{"name":"Chris","gender":"male"},{"name":"Christian","gender":"male"},{"name":"Caelan","gender":"neutral"},{"name":"Campbell","gender":"neutral"},{"name":"Carol","gender":"neutral"},{"name":"Carroll","gender":"neutral"},{"name":"Casey","gender":"neutral"},{"name":"Charlie","gender":"neutral"},{"name":"Cheyenne","gender":"neutral"},{"name":"Chris","gender":"neutral"},{"name":"Clay","gender":"neutral"},{"name":"Corey","gender":"neutral"},{"name":"Christopher","gender":"male"},{"name":"Clark","gender":"male"},{"name":"Clay","gender":"male"},{"name":"Clayton","gender":"male"},{"name":"Clyde","gender":"male"},{"name":"Cody","gender":"male"},{"name":"Coen","gender":"male"},{"name":"Cohen","gender":"male"},{"name":"Colby","gender":"male"},{"name":"Cole","gender":"male"},{"name":"Coleman","gender":"male"},{"name":"Colin","gender":"male"},{"name":"Collin","gender":"male"},{"name":"Colt","gender":"male"},{"name":"Colten","gender":"male"},{"name":"Colton","gender":"male"},{"name":"Conner","gender":"male"},{"name":"Connor","gender":"male"},{"name":"Conor","gender":"male"},{"name":"Conrad","gender":"male"},{"name":"Cooper","gender":"male"},{"name":"Corbin","gender":"male"},{"name":"Corey","gender":"male"},{"name":"Cory","gender":"male"},{"name":"Craig","gender":"male"},{"name":"Crew","gender":"male"},{"name":"Cristian","gender":"male"},{"name":"Cristiano","gender":"male"},{"name":"Cristopher","gender":"male"},{"name":"Crosby","gender":"male"},{"name":"Cruz","gender":"male"},{"name":"Cullen","gender":"male"},{"name":"Curtis","gender":"male"},{"name":"Cyrus","gender":"male"},{"name":"Cadence","gender":"female"},{"name":"Caitlin","gender":"female"},{"name":"Caitlyn","gender":"female"},{"name":"Cali","gender":"female"},{"name":"Callie","gender":"female"},{"name":"Cameron","gender":"female"},{"name":"Camila","gender":"female"},{"name":"Camilla","gender":"female"},{"name":"Camille","gender":"female"},{"name":"Camryn","gender":"female"},{"name":"Cara","gender":"female"},{"name":"Carla","gender":"female"},{"name":"Carlee","gender":"female"},{"name":"Carly","gender":"female"},{"name":"Carmen","gender":"female"},{"name":"Carolina","gender":"female"},{"name":"Caroline","gender":"female"},{"name":"Carolyn","gender":"female"},{"name":"Carter","gender":"female"},{"name":"Casey","gender":"female"},{"name":"Cassandra","gender":"female"},{"name":"Cassidy","gender":"female"},{"name":"Cataleya","gender":"female"},{"name":"Catalina","gender":"female"},{"name":"Catherine","gender":"female"},{"name":"Caylee","gender":"female"},{"name":"Cecelia","gender":"female"},{"name":"Cecilia","gender":"female"},{"name":"Celeste","gender":"female"},{"name":"Celia","gender":"female"},{"name":"Celine","gender":"female"},{"name":"Chana","gender":"female"},{"name":"Chanel","gender":"female"},{"name":"Charlee","gender":"female"},{"name":"Charleigh","gender":"female"},{"name":"Charley","gender":"female"},{"name":"Charli","gender":"female"},{"name":"Charlie","gender":"female"},{"name":"Charlize","gender":"female"},{"name":"Charlotte","gender":"female"},{"name":"Chaya","gender":"female"},{"name":"Chelsea","gender":"female"},{"name":"Cherish","gender":"female"},{"name":"Cheyenne","gender":"female"},{"name":"Chloe","gender":"female"},{"name":"Christina","gender":"female"},{"name":"Christine","gender":"female"},{"name":"Ciara","gender":"female"},{"name":"Claire","gender":"female"},{"name":"Clara","gender":"female"},{"name":"Clare","gender":"female"},{"name":"Clarissa","gender":"female"},{"name":"Claudia","gender":"female"},{"name":"Clementine","gender":"female"},{"name":"Colette","gender":"female"},{"name":"Collins","gender":"female"},{"name":"Cora","gender":"female"},{"name":"Coraline","gender":"female"},{"name":"Cordelia","gender":"female"},{"name":"Corinne","gender":"female"},{"name":"Courtney","gender":"female"},{"name":"Crystal","gender":"female"},{"name":"Cynthia","gender":"female"}],"NAP3":[{"name":"Dakota","gender":"male"},{"name":"Dallas","gender":"male"},{"name":"Dalton","gender":"male"},{"name":"Damari","gender":"male"},{"name":"Damian","gender":"male"},{"name":"Damien","gender":"male"},{"name":"Damon","gender":"male"},{"name":"Dane","gender":"male"},{"name":"Dangelo","gender":"male"},{"name":"Daniel","gender":"male"},{"name":"Danny","gender":"male"},{"name":"Dante","gender":"male"},{"name":"Darian","gender":"male"},{"name":"Dariel","gender":"male"},{"name":"Dario","gender":"male"},{"name":"Darius","gender":"male"},{"name":"Darrell","gender":"male"},{"name":"Darren","gender":"male"},{"name":"Darwin","gender":"male"},{"name":"Dash","gender":"male"},{"name":"Davian","gender":"male"},{"name":"David","gender":"male"},{"name":"Davin","gender":"male"},{"name":"Davion","gender":"male"},{"name":"Davis","gender":"male"},{"name":"Dawson","gender":"male"},{"name":"Dax","gender":"male"},{"name":"Daxton","gender":"male"},{"name":"Dayton","gender":"male"},{"name":"Deacon","gender":"male"},{"name":"Dean","gender":"male"},{"name":"Deandre","gender":"male"},{"name":"Deangelo","gender":"male"},{"name":"Declan","gender":"male"},{"name":"Demetrius","gender":"male"},{"name":"Dennis","gender":"male"},{"name":"Denver","gender":"male"},{"name":"Derek","gender":"male"},{"name":"Derrick","gender":"male"},{"name":"Deshawn","gender":"male"},{"name":"Desmond","gender":"male"},{"name":"Devin","gender":"male"},{"name":"Devon","gender":"male"},{"name":"Dexter","gender":"male"},{"name":"Diego","gender":"male"},{"name":"Dilan","gender":"male"},{"name":"Dillon","gender":"male"},{"name":"Dimitri","gender":"male"},{"name":"Dominic","gender":"male"},{"name":"Dominick","gender":"male"},{"name":"Dominik","gender":"male"},{"name":"Dominique","gender":"male"},{"name":"Donald","gender":"male"},{"name":"Donovan","gender":"male"},{"name":"Dorian","gender":"male"},{"name":"Douglas","gender":"male"},{"name":"Drake","gender":"male"},{"name":"Draven","gender":"male"},{"name":"Drew","gender":"male"},{"name":"Duke","gender":"male"},{"name":"Duncan","gender":"male"},{"name":"Dustin","gender":"male"},{"name":"Dwayne","gender":"male"},{"name":"Dakota","gender":"neutral"},{"name":"Dale","gender":"neutral"},{"name":"Dana","gender":"neutral"},{"name":"Daryl","gender":"neutral"},{"name":"Devin","gender":"neutral"},{"name":"Dorian","gender":"neutral"},{"name":"Drew","gender":"neutral"},{"name":"Dylan","gender":"male"},{"name":"Dahlia","gender":"female"},{"name":"Daisy","gender":"female"},{"name":"Dakota","gender":"female"},{"name":"Dalary","gender":"female"},{"name":"Daleyza","gender":"female"},{"name":"Dallas","gender":"female"},{"name":"Dana","gender":"female"},{"name":"Danica","gender":"female"},{"name":"Daniela","gender":"female"},{"name":"Daniella","gender":"female"},{"name":"Danielle","gender":"female"},{"name":"Danna","gender":"female"},{"name":"Daphne","gender":"female"},{"name":"Dayana","gender":"female"},{"name":"Deborah","gender":"female"},{"name":"Delaney","gender":"female"},{"name":"Delilah","gender":"female"},{"name":"Demi","gender":"female"},{"name":"Denise","gender":"female"},{"name":"Desiree","gender":"female"},{"name":"Destiny","gender":"female"},{"name":"Diana","gender":"female"},{"name":"Dixie","gender":"female"},{"name":"Dorothy","gender":"female"},{"name":"Dulce","gender":"female"},{"name":"Dylan","gender":"female"}],"NAP":[{"name":"Nash","gender":"male"},{"name":"Nasir","gender":"male"},{"name":"Nathan","gender":"male"},{"name":"Nathanael","gender":"male"},{"name":"Nathaniel","gender":"male"},{"name":"Nehemiah","gender":"male"},{"name":"Neil","gender":"male"},{"name":"Nelson","gender":"male"},{"name":"Neymar","gender":"male"},{"name":"Nicholas","gender":"male"},{"name":"Nickolas","gender":"male"},{"name":"Nico","gender":"male"},{"name":"Nicolas","gender":"male"},{"name":"Niko","gender":"male"},{"name":"Nikolai","gender":"male"},{"name":"Nikolas","gender":"male"},{"name":"Nixon","gender":"male"},{"name":"Noah","gender":"male"},{"name":"Noe","gender":"male"},{"name":"Noel","gender":"male"},{"name":"Nolan","gender":"male"},{"name":"Nadia","gender":"female"},{"name":"Nick","gender":"male"},{"name":"Nico","gender":"neutral"},{"name":"Nala","gender":"female"},{"name":"Nancy","gender":"female"},{"name":"Naomi","gender":"female"},{"name":"Natalee","gender":"female"},{"name":"Natalia","gender":"female"},{"name":"Natalie","gender":"female"},{"name":"Nataly","gender":"female"},{"name":"Natasha","gender":"female"},{"name":"Nathalia","gender":"female"},{"name":"Nathalie","gender":"female"},{"name":"Nathaly","gender":"female"},{"name":"Nayeli","gender":"female"},{"name":"Neriah","gender":"female"},{"name":"Nevaeh","gender":"female"},{"name":"Nia","gender":"female"},{"name":"Nicole","gender":"female"},{"name":"Nina","gender":"female"},{"name":"Noa","gender":"female"},{"name":"Noelle","gender":"female"},{"name":"Noemi","gender":"female"},{"name":"Nola","gender":"female"},{"name":"Noor","gender":"female"},{"name":"Nora","gender":"female"},{"name":"Norah","gender":"female"},{"name":"Nova","gender":"female"},{"name":"Nyla","gender":"female"},{"name":"Nylah","gender":"female"}]}


//Array radomizer. Shuffles in place.
const shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
}

let currentQuestion = null,
	nextQuestion = null,
	isPendingRequest = false,
	getQuestionError = null;

const combineStrings = function(strings) {
	if (strings.length === 1) {
		return strings[0];
	}
	if (strings.length === 2) {
		return strings[0] + " and " + strings[1];
	}
	let result = "";
	for (let i = 0 ; i < strings.length ; i++) {
		if (i === strings.length - 1) {
			result += "and " + strings[i];
		} else {
			result += strings[i] + ", ";
		}
	}
	return result;
}

//Replace textual symbols with pictures.
const symbolFixer = function(inputString) {
	const symbolMap = {
		"{W}": "<i class='ms ms-w ms-cost'></i>",
		"{U}": "<i class='ms ms-u ms-cost'></i>",
		"{B}": "<i class='ms ms-b ms-cost'></i>",
		"{R}": "<i class='ms ms-r ms-cost'></i>",
		"{G}": "<i class='ms ms-g ms-cost'></i>",
		"{0}": "<i class='ms ms-0 ms-cost'></i>",
		"{1}": "<i class='ms ms-1 ms-cost'></i>",
		"{2}": "<i class='ms ms-2 ms-cost'></i>",
		"{3}": "<i class='ms ms-3 ms-cost'></i>",
		"{4}": "<i class='ms ms-4 ms-cost'></i>",
		"{5}": "<i class='ms ms-5 ms-cost'></i>",
		"{6}": "<i class='ms ms-6 ms-cost'></i>",
		"{7}": "<i class='ms ms-7 ms-cost'></i>",
		"{8}": "<i class='ms ms-8 ms-cost'></i>",
		"{9}": "<i class='ms ms-9 ms-cost'></i>",
		"{10}": "<i class='ms ms-10 ms-cost'></i>",
		"{11}": "<i class='ms ms-11 ms-cost'></i>",
		"{12}": "<i class='ms ms-12 ms-cost'></i>",
		"{13}": "<i class='ms ms-13 ms-cost'></i>",
		"{14}": "<i class='ms ms-14 ms-cost'></i>",
		"{15}": "<i class='ms ms-15 ms-cost'></i>",
		"{16}": "<i class='ms ms-16 ms-cost'></i>",
		"{17}": "<i class='ms ms-17 ms-cost'></i>",
		"{18}": "<i class='ms ms-18 ms-cost'></i>",
		"{19}": "<i class='ms ms-19 ms-cost'></i>",
		"{20}": "<i class='ms ms-20 ms-cost'></i>",
		"{X}": "<i class='ms ms-x ms-cost'></i>",
		"{Y}": "<i class='ms ms-y ms-cost'></i>",
		"{W/P}": "<i class='ms ms-wp ms-cost'></i>",
		"{U/P}": "<i class='ms ms-up ms-cost'></i>",
		"{B/P}": "<i class='ms ms-bp ms-cost'></i>",
		"{R/P}": "<i class='ms ms-rp ms-cost'></i>",
		"{G/P}": "<i class='ms ms-gp ms-cost'></i>",
		"{S}": "<i class='ms ms-s ms-cost'></i>",
		"{C}": "<i class='ms ms-c ms-cost'></i>",
		"{E}": "<i class='ms ms-e ms-cost'></i>",
		"{T}": "<i class='ms ms-tap ms-cost'></i>",
		"{Q}": "<i class='ms ms-untap ms-cost'></i>",
		"{W/U}": "<i class='ms ms-wu ms-split ms-cost'></i>",
		"{W/B}": "<i class='ms ms-wb ms-split ms-cost'></i>",
		"{U/B}": "<i class='ms ms-ub ms-split ms-cost'></i>",
		"{U/R}": "<i class='ms ms-ur ms-split ms-cost'></i>",
		"{B/R}": "<i class='ms ms-br ms-split ms-cost'></i>",
		"{B/G}": "<i class='ms ms-bg ms-split ms-cost'></i>",
		"{R/W}": "<i class='ms ms-rw ms-split ms-cost'></i>",
		"{R/G}": "<i class='ms ms-rg ms-split ms-cost'></i>",
		"{G/W}": "<i class='ms ms-gw ms-split ms-cost'></i>",
		"{G/U}": "<i class='ms ms-gu ms-split ms-cost'></i>",
		"{2/W}": "<i class='ms ms-2w ms-split ms-cost'></i>",
		"{2/U}": "<i class='ms ms-2u ms-split ms-cost'></i>",
		"{2/B}": "<i class='ms ms-2b ms-split ms-cost'></i>",
		"{2/R}": "<i class='ms ms-2r ms-split ms-cost'></i>",
		"{2/G}": "<i class='ms ms-2g ms-split ms-cost'></i>",
		"{CHAOS}": "<i class='ms ms-chaos'></i>",
		"{W/U/P}": "<i class='ms ms-wup ms-cost'></i>",
		"{W/B/P}": "<i class='ms ms-wbp ms-cost'></i>",
		"{U/B/P}": "<i class='ms ms-ubp ms-cost'></i>",
		"{U/R/P}": "<i class='ms ms-urp ms-cost'></i>",
		"{B/R/P}": "<i class='ms ms-brp ms-cost'></i>",
		"{B/G/P}": "<i class='ms ms-bgp ms-cost'></i>",
		"{R/W/P}": "<i class='ms ms-rwp ms-cost'></i>",
		"{R/G/P}": "<i class='ms ms-rgp ms-cost'></i>",
		"{G/W/P}": "<i class='ms ms-gwp ms-cost'></i>",
		"{G/U/P}": "<i class='ms ms-gup ms-cost'></i>",
		"{P}": "<i class='ms ms-p'></i>",
		"[0]": "<i class='ms ms-loyalty-zero ms-loyalty-0 ms-2x'></i>",
		"[+1]": "<i class='ms ms-loyalty-up ms-loyalty-1 ms-2x'></i>",
		"[+2]": "<i class='ms ms-loyalty-up ms-loyalty-2 ms-2x'></i>",
		"[+3]": "<i class='ms ms-loyalty-up ms-loyalty-3 ms-2x'></i>",
		"[+4]": "<i class='ms ms-loyalty-up ms-loyalty-4 ms-2x'></i>",
		"[+5]": "<i class='ms ms-loyalty-up ms-loyalty-5 ms-2x'></i>",
		"[-1]": "<i class='ms ms-loyalty-down ms-loyalty-1 ms-2x'></i>",
		"[-2]": "<i class='ms ms-loyalty-down ms-loyalty-2 ms-2x'></i>",
		"[-3]": "<i class='ms ms-loyalty-down ms-loyalty-3 ms-2x'></i>",
		"[-4]": "<i class='ms ms-loyalty-down ms-loyalty-4 ms-2x'></i>",
		"[-5]": "<i class='ms ms-loyalty-down ms-loyalty-5 ms-2x'></i>",
		"[-6]": "<i class='ms ms-loyalty-down ms-loyalty-6 ms-2x'></i>",
		"[-7]": "<i class='ms ms-loyalty-down ms-loyalty-7 ms-2x'></i>",
		"[-8]": "<i class='ms ms-loyalty-down ms-loyalty-8 ms-2x'></i>",
		"[-9]": "<i class='ms ms-loyalty-down ms-loyalty-9 ms-2x'></i>",
		"[-10]": "<i class='ms ms-loyalty-down ms-loyalty-10 ms-2x'></i>",
		"[-11]": "<i class='ms ms-loyalty-down ms-loyalty-11 ms-2x'></i>",
		"[-12]": "<i class='ms ms-loyalty-down ms-loyalty-12 ms-2x'></i>",
		"[-13]": "<i class='ms ms-loyalty-down ms-loyalty-13 ms-2x'></i>",
		"[-14]": "<i class='ms ms-loyalty-down ms-loyalty-14 ms-2x'></i>",
		"[-15]": "<i class='ms ms-loyalty-down ms-loyalty-15 ms-2x'></i>",
	};
	let outputString = inputString.replace(/[{\[][A-Z0-9/+-]{1,5}[}\]]/g, function(match) {
		return symbolMap[match] || match;
	});
	return outputString;
};

//Returns a random map of player names and genders for each possible player tag.
const getPlayerNamesMap = function() {
	const playerNamesMap = {};
	const genderOrder = ["male", "female", "neutral"];
	shuffle(genderOrder);
	let genderIndex = 0;
	const iterationOrder = ["AP", "NAP1", "NAP2", "NAP3", "NAP"];

	for (let i in iterationOrder) {
		const correctGenderPlayerNames = playerNames[iterationOrder[i]].filter(function(element) {
			return element.gender === genderOrder[genderIndex];
		})
		playerNamesMap[iterationOrder[i]] = correctGenderPlayerNames[Math.floor(Math.random() * correctGenderPlayerNames.length)];
		genderIndex++;
		if (genderIndex > 2) {
			genderIndex = 0;
		}
	}

	shuffle(genderOrder);
	let correctGenderPlayerNames = playerNames.AP.filter(function(element) {
		return element.gender === genderOrder[0];
	})
	playerNamesMap.APa = correctGenderPlayerNames[Math.floor(Math.random() * correctGenderPlayerNames.length)];
	correctGenderPlayerNames = playerNames.AP.filter(function(element) {
		return element.gender === genderOrder[1];
	})
	playerNamesMap.APb = correctGenderPlayerNames[Math.floor(Math.random() * correctGenderPlayerNames.length)];

	shuffle(genderOrder);
	correctGenderPlayerNames = playerNames.NAP.filter(function(element) {
		return element.gender === genderOrder[0];
	})
	playerNamesMap.NAPa = correctGenderPlayerNames[Math.floor(Math.random() * correctGenderPlayerNames.length)];
	correctGenderPlayerNames = playerNames.NAP.filter(function(element) {
		return element.gender === genderOrder[1];
	})
	playerNamesMap.NAPb = correctGenderPlayerNames[Math.floor(Math.random() * correctGenderPlayerNames.length)];

	return playerNamesMap;
}

//Accepts a string containing various [tags] and returns the untagged HTML version.
const replaceExpressions = function(string, playerNamesMap, oracle) {
	let pronouns = {
		"male": {
			"s": "he",
			"o": "him",
			"pp": "his",
			"pa": "his"
		},
		"female": {
			"s": "she",
			"o": "her",
			"pp": "hers",
			"pa": "her"
		},
		"neutral": {
			"s": "they",
			"o": "them",
			"pp": "theirs",
			"pa": "their"
		}
	};

	//Determine the correct article ("a" or "an") in front of card names.
	string = string.replace(/\b(a|A|an|An) \[(card (\d+))\]/g, function(match, capt1, capt2, capt3) {
		if (oracle[capt3 - 1]) {
			let article = AvsAnSimple.query(oracle[capt3 - 1].name);
			if (capt1 === "A" || capt1 === "An") {
				return `${article.charAt(0).toUpperCase() + article.slice(1)} [${capt2}]`;
			} else {
				return `${article} [${capt2}]`;
			}
		} else {
			return match;
		}
	});

	//Replace rules citations and create tooltips.
	string = string.replace(/\[(\d{3}(\.\d{1,3}([a-z])?)?)\]/g, function(match, capt1) {
		return `<a href="https://yawgatog.com/resources/magic-rules/#R${capt1.replace('.', '')}" target="_blank" tooltip="${window.parentData.allRules[capt1] ? window.parentData.allRules[capt1].ruleText.replace(/"/g, "&quot") : "This rule doesn't appear to exist. Please check your citation and try again."}">${capt1}</a>`;
	});

	//Replace card names.
	if (oracle.length > 0) {
		string = string.replace(/\[card (\d+)\]/g, function(match, capt1) {
			if (oracle[capt1 - 1]) {
				return oracle[capt1 - 1].name;
			} else {
				return match;
			}
		});
	}

	//Replace composite expressions (other side).
	if (oracle.length > 0) {
		try {
			string = string.replace(/\[card (\d+):other side\]/g, function(match, capt1) {
				if (oracle[capt1 - 1]) {
					if (oracle[capt1 - 1].names[0] === oracle[capt1 - 1].name) {
						return oracle[capt1 - 1].names[1];
					} else {
						return oracle[capt1 - 1].names[0];
					}
				} else {
					return match;
				}
			});
		} catch (e) {
			console.log("This error should be displayed in the validation errors, but if not, here:");
			console.error(e);
		}
	}

	//Replace composite expressions (characteristic).
	if (oracle.length > 0) {
		const characteristicMapping = {
			"colors": "colors",
			"mana cost": "manaCost",
			"mana value": "manaValue",
			"supertypes": "supertypes",
			"types": "types",
			"subtypes": "subtypes",
			"power": "power",
			"toughness": "toughness",
			"loyalty": "loyalty",
		}
		try {
			string = string.replace(/\[card (\d+)(:other side)?(:[a-z ]+)(:simple)?\]/g, function(match, capt1, capt2, capt3, capt4) {
				if (oracle[capt1 - 1]) {
					let cardName = oracle[capt1 - 1].name;
					if (capt2) {
						if (oracle[capt1 - 1].names[0] === oracle[capt1 - 1].name) {
							cardName =  oracle[capt1 - 1].names[1];
						} else {
							cardName =  oracle[capt1 - 1].names[0];
						}
					}
					const result = window.parentData.allCards[cardName][characteristicMapping[capt3.slice(1)]];
					if (result !== undefined) {
						if (typeof result === "object") {
							if (capt4) {
								return result.join(" ");
							} else {
								return combineStrings(result);
							}
						} else {
							return result;
						}
					} else {
						return match;
					}
				} else {
					return match;
				}
			});
		} catch (e) {
			console.log("This error should be displayed in the validation errors, but if not, here:");
			console.error(e);
		}
	}


	//Replace player names and pronouns.
	string = string.replace(/\[((?:AP[ab]?|NAP[ab123]?))(?: (o|s|pp|pa|[a-zA-Z']+\|[a-zA-Z']+))?\]/g, function(match, capt1, capt2, offset) {
		if (capt2) {
			if (capt2.includes("|")) {
				return (playerNamesMap[capt1].gender === "male" || playerNamesMap[capt1].gender === "female") ? capt2.split("|")[0] : capt2.split("|")[1];
			} else {
				let pronoun = pronouns[playerNamesMap[capt1].gender][capt2];
				return pronoun;
			}
		} else {
			return playerNamesMap[capt1].name;
		}
	});

	//Capitalize the first letter at the beginning of a sentence after a parenthetical statement.
	string = string.replace(/\. \([^()]+?\) ([a-z])/g, function(match, capt1) {
		return match.slice(0, -1) + capt1[0].toUpperCase() + capt1.substring(1);
	});

	//Capitalize the first letter at the beginning of a sentence after another sentance.
	string = string.replace(/\. ([a-z])/g, function(match, capt1) {
		return match.slice(0, -1) + capt1[0].toUpperCase() + capt1.substring(1);
	});

	//Capitalize the first letter of the first sentence.
	if (string) {
		string = string[0].toUpperCase() + string.substring(1);
	}

	return string;
};

let playerNamesMap = getPlayerNamesMap();

let oldQuestionText = "",
		oldAnswerText = "";
const displayNewText = function() {
	//Check if new cards need to be displayed.
	if (JSON.stringify(oldQuestionText.match(/\[card (\d+)\]/g)) !== JSON.stringify(window.parentData.questionObj.question.match(/\[card (\d+)\]/g)) || JSON.stringify(oldAnswerText.match(/\[card (\d+)\]/g)) !== JSON.stringify(window.parentData.questionObj.answer.match(/\[card (\d+)\]/g))) {
		oldQuestionText = window.parentData.questionObj.question;
		oldAnswerText = window.parentData.questionObj.answer;
		choosePreviewCardsAndPlayerNames();
		displayNewCardsAndText();
		return;
	}
	oldQuestionText = window.parentData.questionObj.question;
	oldAnswerText = window.parentData.questionObj.answer;

	//Display id.
	document.getElementById("questionId").textContent = "Question #" + window.parentData.questionObj.id;
	//Display submitted by.
	if (window.parentData.questionObj.submitterName) {
		document.getElementById("submittedByField").style.display = "block";
		document.getElementById("submittedBy").textContent = window.parentData.questionObj.submitterName;
	} else {
		document.getElementById("submittedByField").style.display = "none";
	}
	//Display the question.
	document.getElementById("question").innerHTML = symbolFixer(replaceExpressions(window.parentData.questionObj.question, playerNamesMap, currentPreviewCards)).replace(/\n/g, "<br>");

	//Display answer.
	document.getElementById("answer").innerHTML = symbolFixer(replaceExpressions(window.parentData.questionObj.answer, playerNamesMap, currentPreviewCards)).replace(/\n/g, "<br>");

	//Display validation.
	if (window.parentData.questionValidation.errors.length > 0) {
		document.getElementById("questionErrors").style.display = "block";
		document.getElementById("questionErrors").innerHTML = window.parentData.questionValidation.errors.join("<br>");
	} else {
		document.getElementById("questionErrors").style.display = "none";
	}
	if (window.parentData.questionValidation.warnings.length > 0) {
		document.getElementById("questionWarnings").style.display = "block";
		document.getElementById("questionWarnings").innerHTML = window.parentData.questionValidation.warnings.join("<br>");
	} else {
		document.getElementById("questionWarnings").style.display = "none";
	}
}

let currentPreviewCards = [];

const choosePreviewCardsAndPlayerNames = function() {
	let cardsToUse = [];

	let chosenCards = [];
	if (window.parentData.questionObj.cardLists.length > 0) {

		//Randomly pick cards for the question.
		for (let i = 0 ; i < 100000 ; i++) {
			chosenCards = [];
			for (let j = 0 ; j < window.parentData.questionObj.cardLists.length ; j++) {
				chosenCards.push(window.parentData.questionObj.cardLists[j][Math.floor(Math.random()*window.parentData.questionObj.cardLists[j].length)]);
			}
			if (Array.from(new Set(chosenCards)).length === chosenCards.length) {
				break;
			}
		}
		for (let i = 0 ; i < chosenCards.length ; i++) {
			cardsToUse.push(window.parentData.allCards[chosenCards[i]]);
		}
	}

	currentPreviewCards = cardsToUse;
	playerNamesMap = getPlayerNamesMap();
}

let mappingArray = [],
		answerMappingArray = [];
const displayNewCardsAndText = function() {

	//Sort the oracle array to the order they appear in the question text in order to display the pictures/text in that order.
	mappingArray = window.parentData.questionObj.question.match(/\[card \d+(?::other side)?\]/g);
	mappingArray = Array.from(new Set(mappingArray));
	for (let i in mappingArray) {
		let card;
		if (mappingArray[i].includes(":other side")) {
			card = currentPreviewCards[Number(mappingArray[i].slice(6, -12)) - 1];
			if (card.side === "a") {
				mappingArray[i] = window.parentData.allCards[card.names[1]];
			} else {
				mappingArray[i] = window.parentData.allCards[card.names[0]];
			}
		} else {
			card = currentPreviewCards[Number(mappingArray[i].slice(6, -1)) - 1];
			mappingArray[i] = card;
		}
	}

	//Handle a question that uses a card generator in the answer only.
	answerMappingArray = [];
	if (currentPreviewCards.length > mappingArray.length) {
	 	answerMappingArray = window.parentData.questionObj.answer.match(/\[card \d+(?::other side)?\]/g);
		answerMappingArray = Array.from(new Set(answerMappingArray));

		for (let i in answerMappingArray) {
			let card;
			if (answerMappingArray[i].includes(":other side")) {
				card = currentPreviewCards[Number(answerMappingArray[i].slice(6, -12)) - 1];
				if (card.side === "a") {
					answerMappingArray[i] = window.parentData.allCards[card.names[1]];
				} else {
					answerMappingArray[i] = window.parentData.allCards[card.names[0]];
				}
			} else {
				card = currentPreviewCards[Number(answerMappingArray[i].slice(6, -1)) - 1];
				answerMappingArray[i] = card;
			}
		}

		answerMappingArray = answerMappingArray.filter(function(element) {
			return !mappingArray.includes(element);
		})
	}

	//Don't attempt to display undefined card generators. (Ones with 0 valid cards.)
	mappingArray = mappingArray.filter(function(element) {
		return element !== undefined;
	});
	answerMappingArray = answerMappingArray.filter(function(element) {
		return element !== undefined;
	});

	document.getElementById("pictureRows").style.display = ""; //Needs to exist in order for size calculations to work properly, gets hidden later if mode is none.

	if (document.getElementById("answer").style.display !== "block") {
		populateCardDisplayArea(mappingArray.concat(answerMappingArray));
	} else {
		populateCardDisplayArea(mappingArray);
	}
	setCardDisplaySize();
	displayNewText();
}

//Add card picture and oracle text displays.
const populateCardDisplayArea = function(oracle) {
	document.getElementById("picturesUnsorted").innerHTML = "";
	document.getElementById("pictureRows").innerHTML = "";
	for (let i in oracle) {
		document.getElementById("picturesUnsorted").appendChild(createCardDisplay(oracle[i], defaultCardDisplayFormat));
	}
}

//Properly format the card displays based on screen size.
const setCardDisplaySize = function() {
	const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

	//Remove rows and put all card display containers as children of picturesUnsorted.
	while (document.getElementById("pictureRows").children.length > 0) {
		while (document.getElementById("pictureRows").children[0].children.length > 0) {
			document.getElementById("picturesUnsorted").appendChild(document.getElementById("pictureRows").children[0].children[0]);
		}
		document.getElementById("pictureRows").children[0].remove();
	}
	const imgNum = document.getElementById("picturesUnsorted").children.length;
	//Calculate image width and number of rows nessesery
	let imageWidth = 0,
		rows = 1;
	const getImageWidth = function() {
		imageWidth = (parseInt(getComputedStyle(document.getElementById("pictureRows")).width) / (Math.ceil(imgNum / rows))) - (remSize * (Math.ceil(imgNum / rows)));
		//Impose a maximum image size.
		imageWidth = Math.min(imageWidth, remSize * 14);
		//Minumum size.
		if (imageWidth < (remSize * 9)) {
			rows++;
			getImageWidth();
		}
	};
	getImageWidth();
	//Add the rows.
	for (let i = 0 ; i < rows ; i++) {
		let element = document.createElement("div");
		element.setAttribute("id", "row" + i);
		element.setAttribute("class", "pictureRow");
		document.getElementById("pictureRows").appendChild(element);
	}
	//Add pictures to the rows.
	let currentPic = 0
	while (document.getElementById("picturesUnsorted").children.length > 0) {
		document.getElementById("picturesUnsorted").children[0].style.width = imageWidth + "px";
		document.getElementById("picturesUnsorted").children[0].style.height = (imageWidth * 1.395) + "px";
		document.getElementById("picturesUnsorted").children[0].style.fontSize = (imageWidth / 240 ) + "rem";
		document.getElementById("row" + Math.floor(currentPic / Math.ceil(imgNum / rows))).appendChild(document.getElementById("picturesUnsorted").children[0]);
		currentPic++;
	}
	//Shrink image width to accomodate the scroll bar.
	let newImageWidth = (parseInt(getComputedStyle(document.getElementById("pictureRows")).width) / (Math.ceil(imgNum / rows))) - (remSize * (Math.ceil(imgNum / rows)));
	newImageWidth = Math.min(newImageWidth, remSize * 14);
	if (newImageWidth !== imageWidth) {
		for (let i = 0 ; i < document.getElementsByClassName("cardDisplay").length ; i++) {
			document.getElementsByClassName("cardDisplay")[i].style.width = newImageWidth + "px";
			document.getElementsByClassName("cardDisplay")[i].style.height = (newImageWidth * 1.395) + "px";
		}
	}
	//Move the images to the bottom if the page is small.
	if (rows > 1 && document.getElementById("row0").children.length <= 2) {
		document.getElementById("questionPage").appendChild(document.getElementById("pictureRows"));
	} else {
		document.getElementById("questionPage").appendChild(document.getElementById("questionPageBackgroundBox"));
	}
	//Set the font size.
	for (let i = 0 ; i < document.querySelectorAll("*").length ; i++) {
		if (document.getElementById("pictureRows").contains(document.querySelectorAll("*")[i])) {
			document.querySelectorAll("*")[i].style.fontSize = (imageWidth / 240) + "rem";
		}
	}
}

window.addEventListener("resize", function() {
	if (currentQuestion && currentQuestion.oracle.length > 0) {
		setCardDisplaySize();
	}
});

//Show/hide answer
const toggleAnswer = function() {
	if (document.getElementById("answer").style.display === "none") {
		document.getElementById("answer").style.display = "block";
		document.getElementById("showAnswer").textContent = "Hide Answer";
		for (let i in answerMappingArray) {
			document.getElementById("pictureRows").lastChild.appendChild(createCardDisplay(answerMappingArray[i], defaultCardDisplayFormat));
		}
		setCardDisplaySize();
	} else {
		document.getElementById("answer").style.display = "none";
		document.getElementById("showAnswer").textContent = "Show Answer";
		while (document.getElementById("pictureRows").children.length > 0) {
			while (document.getElementById("pictureRows").children[0].children.length > 0) {
				document.getElementById("picturesUnsorted").appendChild(document.getElementById("pictureRows").children[0].children[0]);
			}
			document.getElementById("pictureRows").children[0].remove();
		}
		for (let i in answerMappingArray) {
			document.getElementById("picturesUnsorted").removeChild(document.getElementById("picturesUnsorted").lastChild);
		}
		setCardDisplaySize();
	}
};

const doNothingUseful = function() {
	const waysToDoNothingUseful = ["Nah fam.", "This is a preview.", "Heck no.", "What exactly do you think you're doing‽", "I'm afraid I can't let you do that Dave.", "Nossir!", "This is the only question in existence. The rest of the universe has crumbled around you. You can never view another.", "Maybe it'll work if you try again enough times.", "Stop it!", "You are wasting your time.", "Yeah, no.", "NEVER DO THAT AGAIN!", "What exactly did you think would happen?", "Come on now, you're an admin. You should know better than this.", "Give me just a moment and I'll show you another.", "You're an admin- you make the questions here! Don't try to get me to do yout work for you.", "Gotten bored already?", "Ok here's a question: Does P equal NP?"];

	const pickedWayToDoNothingUseful = waysToDoNothingUseful[Math.floor(Math.random() * waysToDoNothingUseful.length)];
	alert(pickedWayToDoNothingUseful);
}

//Button handlers:
bindButtonAction(document.getElementById("showAnswer"), function() {toggleAnswer();});
bindButtonAction(document.getElementById("nextQuestion"), doNothingUseful);

var AvsAnSimple = (function (root) {
	var dict = "2h.#2.a;i;&1.N;*4.a;e;i;o;/9.a;e;h1.o.i;l1./;n1.o.o;r1.e.s1./;01.8;12.1a;01.0;12.8;9;2.31.7;4.5.6.7.8.9.8a;0a.0;1;2;3;4;5;6;7;8;9;11; .22; .–.31; .42; .–.55; .,.h.k.m.62; .k.72; .–.82; .,.92; .–.8;<2.m1.d;o;=1.=1.E;@;A6;A1;A1.S;i1;r1;o.m1;a1;r1; .n1;d1;a1;l1;u1;c1.i1.a1.n;s1;t1;u1;r1;i1;a1;s.t1;h1;l1;e1;t1;e1.s;B2.h2.a1.i1;r1;a.á;o1.r1.d1. ;C3.a1.i1.s1.s.h4.a2.i1.s1;e.o1.i;l1.á;r1.o1.í;u2.i;r1.r1.a;o1.n1.g1.j;D7.a1.o1.q;i2.n1.a1.s;o1.t;u1.a1.l1.c;á1. ;ò;ù;ư;E7;U1;R.b1;o1;l1;i.m1;p1;e1;z.n1;a1;m.s1;p5.a1.c;e;h;o;r;u1.l1;o.w1;i.F11. ;,;.;/;0;1;2;3;4;5;6;71.0.8;9;Ae;B.C.D.F.I2.L.R.K.L.M.N.P.Q.R.S.T.B;C1;M.D;E2.C;I;F1;r.H;I3.A1;T.R1. ;U;J;L3.C;N;P;M;O1. ;P1;..R2.A1. ;S;S;T1;S.U2.,;.;X;Y1;V.c;f1.o.h;σ;G7.e1.r1.n1.e;h1.a3.e;i;o;i1.a1.n1.g;o2.f1. ;t1.t1. ;r1.i1.a;w1.a1.r1.r;ú;Hs. ;&;,;.2;A.I.1;2;3;5;7;B1;P.C;D;F;G;H1;I.I6;C.G.N.P.S1.D;T.K1.9;L;M1;..N;O2. ;V;P;R1;T.S1.F.T;V;e2.i1.r;r1.r1.n;o2.n6;d.e1.s;g.k.o2;l.r1;i1.f;v.u1.r;I3;I2;*.I.n1;d1;e1;p1;e1;n1;d2;e1;n1;c1;i.ê.s1;l1;a1;n1;d1;s.J1.i1.a1.o;Ly. ;,;.;1;2;3;4;8;A3. ;P;X;B;C;D;E2. ;D;F1;T.G;H1.D.I1.R;L;M;N;P;R;S1;m.T;U1. ;V1;C.W1.T;Z;^;a1.o1.i1.g;o1.c1.h1.a1;b.p;u1.s1.h1;o.ộ;M15. ;&;,;.1;A1;.1;S./;1;2;3;4;5;6;7;8;Ai;B.C.D.F.G.J.L.M.N.P.R.S.T.V.W.X.Y.Z.B1;S1;T.C;D;E3.P1;S.W;n;F;G;H;I4. ;5;6;T1;M.K;L;M;N;O1.U;P;Q;R;S;T1;R.U2. ;V;V;X;b1.u1.m;f;h;o2.D1.e.U1;..p1.3;s1.c;Ny. ;+;.1.E.4;7;8;:;A3.A1;F.I;S1.L;B;C;D;E3.A;H;S1. ;F1;U.G;H;I7.C.D1. ;K.L.N.O.S.K;L;M1;M.N2.R;T;P1.O1.V1./1.B;R2;J.T.S1;W.T1;L1.D.U1.S;V;W2.A;O1.H;X;Y3.C1.L;P;U;a1.s1.a1.n;t1.h;v;²;×;O5;N1;E.l1;v.n2;c1.e.e1.i;o1;p.u1;i.P1.h2.i1.a;o2.b2;i.o.i;Q1.i1.n1.g1.x;Rz. ;&;,;.1;J./;1;4;6;A3. ;.;F1;T.B1;R.C;D;E3. ;S1.P;U;F;G;H1.S;I2.A;C1. ;J;K;L1;P.M5;1.2.3.5.6.N;O2.H;T2;A.O.P;Q;R1;F.S4;,...?.T.T;U4;B.M.N.S.V;X;c;f1;M1...h2.A;B;ò;S11. ;&;,;.4.E;M;O;T1..3.B;D;M;1;3;4;5;6;8;9;A3. ;8;S2;E.I.B;C3.A1. ;R2.A.U.T;D;E6. ;5;C3;A.O.R.I1.F.O;U;F3;&.H.O1.S.G1;D.H3.2;3;L;I2. ;S1.O.K2.I.Y.L3;A2. ;.;I1. ;O.M3;A1. ;I.U1.R.N5.A.C3.A.B.C.E.F.O.O5. ;A1.I;E;S1;U.V;P7;A7;A.C.D.M.N.R.S.E1. ;I4;C.D.N.R.L1;O.O.U.Y.Q1. ;R;S1;W.T9.A1. ;C;D;F;I;L;M;S;V;U7.B.L.M.N.P.R.S.V;W1.R;X1.M;h1.i1.g1.a1.o;p1.i1.o1;n.t2.B;i1.c1.i;T4.a2.i2.g1.a.s1.c;v1.e1.s;e1.a1.m1.p;u1.i2.l;r;à;Um..1.N1..1.C;/1.1;11. .21.1;L1.T;M1.N;N4.C1.L;D2. .P.K;R1. .a;b2;a.i.d;g1.l;i1.g.l2;i.y.m;no. ;a1.n.b;c;d;e1;s.f;g;h;i2.d;n;j;k;l;m;n;o;p;q;r;s;t;u;v;w;p;r3;a.e.u1.k;s3. ;h;t1;r.t4.h;n;r;t;x;z;í;W2.P1.:4.A1.F;I2.B;N1.H.O1.V;R1.F1.C2.N.U.i1.k1.i1.E1.l1.i;X7;a.e.h.i.o.u.y.Y3.e1.t1.h;p;s;[5.A;E;I;a;e;_2._1.i;e;`3.a;e;i;a7; .m1;a1;r1. .n1;d2; .ě.p1;r1;t.r1;t1;í.u1;s1;s1;i1. .v1;u1;t.d3.a1.s1. ;e2.m1. ;r1. ;i2.c1.h1. ;e1.s1.e2.m;r;e8;c1;o1;n1;o1;m1;i1;a.e1;w.l1;i1;t1;e1;i.m1;p1;e1;z.n1;t1;e1;n1;d.s2;a1. .t4;a1; .e1; .i1;m1;a1;r.r1;u1.t.u1.p1. ;w.f3. ;M;y1.i;h9. ;,;.;C;a1.u1.t1;b.e2.i1.r1;a.r1.m1.a1.n;o4.m2.a1; .m;n8; .b.d.e3; .d.y.g.i.k.v.r1.s1. ;u1.r;r1. ;t1;t1;p1;:.i6;b1;n.e1;r.n2;f2;l1;u1;ê.o1;a.s1;t1;a1;l1;a.r1; .s1; .u.k1.u1. ;l3.c1.d;s1. ;v1.a;ma. ;,;R;b1.a.e1.i1.n;f;p;t1.a.u1.l1.t1.i1.c1.a1.m1.p1.i;×;n6. ;V;W;d1; .t;×;o8;c2;h1;o.u1;p.d1;d1;y.f1; .g1;g1;i.no. ;';,;/;a;b;c1.o;d;e2.i;r;f;g;i;l;m;n;o;r;s;t;u;w;y;z;–;r1;i1;g1;e.t1;r1.s;u1;i.r3. ;&;f;s9.,;?;R;f2.e.o.i1.c1.h;l1. ;p2.3;i1. ;r1.g;v3.a.e.i.t2.A;S;uc; ...b2.e;l;f.k2.a;i;m1;a1. .n3;a3; .n5.a;c;n;s;t;r1;y.e2; .i.i8.c2.o1.r1.p;u1.m;d1;i1.o;g1.n;l1.l;m1;o.n;s1.s;v1.o1;c.r5;a.e.i.l.o.s3. ;h;u1.r2;e.p3;a.e.i.t2.m;t;v.w1.a;xb. ;';,;.;8;b;k;l;m1;a.t;y1. ;y1.l;{1.a;|1.a;£1.8;À;Á;Ä;Å;Æ;É;Ò;Ó;Ö;Ü;à;á;æ;è;é1;t3.a;o;u;í;ö;ü1; .Ā;ā;ī;İ;Ō;ō;œ;Ω;α;ε;ω;ϵ;е;–2.e;i;ℓ;";
	function fill(node) {
		var kidCount = parseInt(dict, 36) || 0,
			offset = kidCount && kidCount.toString(36).length;
		node.article = dict[offset] === "." ? "a" : "an";
		dict = dict.substr(1 + offset);
		for (var i = 0; i < kidCount; i++) {
			var kid = node[dict[0]] = {}
			dict = dict.substr(1);
			fill(kid);
		}
	}
	fill(root);

	return {
		raw: root,
		//Usage example: AvsAnSimple.query("example")
		//example returns: "an"
		query: function (word) {
			var node = root, sI = 0, result, c;
			do {
				c = word[sI++];
			} while ('"‘’“”$\'-('.indexOf(c) >= 0);//also terminates on end-of-string "undefined".

			while (1) {
				result = node.article || result;
				node = node[c];
				if (!node) return result;
				c = word[sI++] || " ";
			}
		}
	};
})({});

const checkForUpdate = function() {
	if (window.parentData.updateAll) {
		window.parentData.updateAll = false;
		window.parentData.updateText = false;
		choosePreviewCardsAndPlayerNames();
		displayNewCardsAndText();
		document.getElementById("level").textContent = window.parentData.questionObj.level;
		document.getElementById("complexity").textContent = window.parentData.questionObj.complexity;
	} else if (window.parentData.updateText) {
		window.parentData.updateText = false;
		displayNewText();
	} else if (window.parentData.updateExtras) {
		window.parentData.updateExtras = false;
		document.getElementById("level").textContent = window.parentData.questionObj.level;
		document.getElementById("complexity").textContent = window.parentData.questionObj.complexity;
	}
	if (window.parentData.currentGeneratorStatusChanged) {
		window.parentData.currentGeneratorStatusChanged = false;
		if (window.parentData.currentGeneratorOpen) {
			document.getElementById("generatorPreview").style.display = "block";
			displayGeneratorPictures(window.parentData.currentGenerator);
		} else {
			document.getElementById("generatorPreview").style.display = "none";
		}
	} else if (window.parentData.currentGeneratorChanged) {
		displayGeneratorPictures(window.parentData.currentGenerator);
		window.parentData.currentGeneratorChanged = false;
	}
}
setInterval(checkForUpdate, 10);

//Display the pictures for the generator preview.
const displayGeneratorPictures = function(inputCardNamesArray) {
	if (window.parentData.currentGeneratorErrors.length > 0) {
		document.getElementById("generatorError").style.display = "block";
		document.getElementById("generatorError").innerHTML = window.parentData.currentGeneratorErrors.join("<br>");
	} else {
		document.getElementById("generatorError").style.display = "none";
	}
	document.getElementById("generatorCount").textContent = `${inputCardNamesArray.length} cards in ${window.parentData.currentGeneratorType}`;
	document.getElementById("generatorPictures").innerHTML = "";
	let cardNames = inputCardNamesArray.sort();
	if (cardNames.length > 300) {
		cardNames = cardNames.slice(0, 300);
	};

	//Add pictures to the display.
	for (let i in cardNames) {
		document.getElementById("generatorPictures").appendChild(createCardDisplay(window.parentData.allCards[cardNames[i]], defaultCardDisplayFormat));
	}
}

let defaultCardDisplayFormat = "image";
document.getElementById("generatorDisplayToggle").addEventListener("click", function() {
	const button = document.getElementById("generatorDisplayToggle");
	if (button.textContent === "Display oracle text") {
		defaultCardDisplayFormat = "text";
		button.textContent = "Display images";
		const cardDisplays = document.getElementsByClassName("cardDisplay");
		for (let i = 0 ; i < cardDisplays.length ; i++) {
			cardDisplays[i].setDisplayMode(defaultCardDisplayFormat);
		}
	} else {
		defaultCardDisplayFormat = "image";
		button.textContent = "Display oracle text";
		const cardDisplays = document.getElementsByClassName("cardDisplay");
		for (let i = 0 ; i < cardDisplays.length ; i++) {
			cardDisplays[i].setDisplayMode(defaultCardDisplayFormat);
		}
	}
});

document.getElementById("bannerName").textContent = "Preview";
