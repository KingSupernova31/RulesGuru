/*
* Twitter bot for rulesguru.
* The main workflow consists in a bot that authenticates to twitter when started,
* tweets a rules question from rulesguru (with images) every day, and reply with
* the answer at given time. In order to still send the answer even if the server
* was stopped, the pending answer is saved into a json file in twitter-tmp directory,
* and when the node is started, we check if there is a pending answer and
* programm it to be sent at correct time.

Created by Guillaume, with some edits by Isaac.
*/
const fs = require('fs');
const https = require('https');
const path = require('path');
const cron = require('node-cron');
const Stream = require('stream').Transform;
const Twitterv2 = require('twitter-v2');
const Twitter = new Twitterv2(JSON.parse(fs.readFileSync("externalCredentials.json", "utf8")).twitter);
const handleError = require("./custom_modules/handleError.js");
// Constants
const tmp_dir = path.normalize('./twitter-tmp') // Temporary files directory
const to_tweet_file = path.join(tmp_dir, "next_tweet.json") // File containing next answer to tweet
const rules_guru_url = "https://rulesguru.org/"
// Times a which to post questions and answers, in node-cron syntax
const question_time = '1 0 2 * * *'
const answer_time = '1 0 14 * * *'
// Global variables
// Node-cron tasks for scheduled tweeting of questions and answers
var question_scheduled_task
var answer_scheduled_task
var pending_answer = {}
// Connect to twitter
Twitter.get('account/verify_credentials',
  {include_entities: false, skip_status: true, include_email: false},
  onAuthenticated)

/***************************************************************************************************
*                               Main workflow
***************************************************************************************************/
function onAuthenticated(err){
  /*
  * If authentification was successful, call functions reading temporary file
  * containing potential pending answer to tweet.
  * INPUTS:
  *   err (Error): potential authentification error
  */
  checkError(err, "Can't authenticate to Twitter: ")
  console.log("Successfully authenticated to Twitter.")
  // Read the file in twitter-tmp directory in case there is a pending answer.
  inTmp(() => {fs.readFile(to_tweet_file, 'utf8', toTweetContent)})
  // Schedule question and answer tweeting
  question_scheduled_task = cron.schedule(question_time, findAQuestion)
  answer_scheduled_task = cron.schedule(answer_time, tweetReply)
}

function findAQuestion(){
 /*
 * Get a new question from rulesguru API.
 * The question can be any question without tag "Unsupported answers".
 */
  var json_request = {
    count: 1,
    level: ["0", "1", "2", "3", "Corner Case"],
    complexity: ["Simple", "Intermediate", "Complicated"],
    legality: "All of Magic",
    tags:["Unsupported answers"],
    tagsConjunc:"NOT"
  };
  var url = rules_guru_url + "api/questions/?json=" + encodeURIComponent(JSON.stringify(json_request));
  https.get(url, gatherQuestionData);
}

function gatherQuestionData(https_response){
  /*
  * Handle https response to get request to rulesguru API.
  * Check for error, and if there is none, gather response data.
  * INPUTS:
  *   https_response (Object): response object from https.get
  */
  if(https_response.statusCode != 200){
    throw new Error("Request failed with status " + https_response.statusCode + " : " + https_response.statusMessage);
  } else {
    var response_data = "";
    https_response.on("data", (received_part) => {response_data += received_part});
    https_response.on("end", () => {prepareQuestion(response_data)});
  }
}

let errorCount = 0;
function prepareQuestion(response_data){
  /*
  * Prepare received question and answer for tweets. Check response status, format question and
  * answer and check their length, then start downloading included images.
  * INPUTS:
  *   response_data (String): complete data received from https request to rulesguru API
  */
  response_json = JSON.parse(response_data);
  if(response_json.status != 200){
		if (errorCount < 5) {
			// Error from API, just resend the request and hope it works this time.
			errorCount++;
	    findAQuestion();
			handleError(response_json);
		} else {
			errorCount = 0;
			handleError("Too many API errors, quitting");
		}
  } else {
		errorCount = 0;
    var received_question = response_json.questions[0];
    console.log("Received question #", received_question.id);
    const twitter_limit = {text_length: 280, n_images: 4}
    random_tag_no = Math.floor(received_question.tags.length * Math.random());
    random_tag = received_question.tags[random_tag_no].toLowerCase();
    //received_question.question = "The #RGQotD covers " + random_tag + ":\n\n" + received_question.question
		received_question.question += "\n\n#RGQotD";
    received_question.answer = "Answer :\n\n" + received_question.answer;
    // Check question and answer tweets lengths. Note that because we altered received_question.question
    // and received_question.answer, these are the final lengths of the tweet, not of the original question.
    if((received_question.question.length > twitter_limit.text_length) | (received_question.includedCards.length > twitter_limit.n_images)){
      console.log("Received question is too long, get another question.")
      findAQuestion()
    } else {
      if(received_question.answer.length > twitter_limit.text_length){
        console.log("Answer is too long, a link to it will be tweeted.")
        question_link = rules_guru_url + "?" + received_question.id
        received_question.answer = "The answer to this question is too long to fit on Twitter, you can view it here: " + question_link
      }
      // Start embedded images download
      var card_image_ids = [] // Will contain media ids for images when uploaded to twitter
      // Images are downloaded in twitter-tmp directory
      inTmp(() => {downloadLoop(received_question.includedCards, card_image_ids)})
      // Wait for all downloads and uploads to twitter to be complete
      var wait_for_download = setInterval(() => {isDownloadOver(card_image_ids, received_question, wait_for_download)}, 100)
    }
  }
}

function isDownloadOver(card_image_ids, received_question, interval_to_stop){
  /*
  * Check if all images have been downloaded and uploaded to twitter.
  * If it is the case, tweet the question.
  * INPUTS:
  *   card_image_ids (Array of String): media_ids of images uploaded to twitter
  *   received_question (Object): json question as received from rulesguru API
  *   interval_to_stop (Number): ID of the interval to clear when download is over
  */
  // All images have been uploaded if there are as many uploaded media IDs as
  // as there are cards included in the question
  if(card_image_ids.length == received_question.includedCards.length){
    clearInterval(interval_to_stop)
    console.log("Downloaded all images: ", card_image_ids)
    sendTweet(received_question.question, card_image_ids, received_question.answer)
  }
}

function sendTweet(text, attachments, next_tweet, reply_to_id){
  /*
  * Send a tweet with given content.
  * INPUTS:
  *   text (String): text to tweet
  *   attachments (Array): uploaded media ids
  *   next_tweet (String, optional): text of the next tweet to send (typically answer to current question)
  *   reply_to_id (int, optional): id of a tweet to reply to instead of posting an entirely new tweet
  */
  tweet_oject = {status: text}
  if(attachments.length){
    tweet_oject.media_ids = attachments
  }
  if(reply_to_id){
    tweet_oject.in_reply_to_status_id = reply_to_id
  }
  Twitter.post('statuses/update', tweet_oject, (err, data, response) => {tweetCallback(next_tweet, err, data, response)})
}

function tweetCallback(programmed_next_tweet, error, data){
  /*
  * Handles response from sending a tweet. Check for error.
  * If there is none, save the answer to tweeted question
  * if needed.
  * INPUTS:
  *   programmed_next_tweet (String): reply to current tweet,
  * to be scheduled at answer_time.
  *   error (Error): potential error when posting the tweet
  *   data (Object): data of posted tweet
  */
  checkError(error, "Could not send tweet: ", undefined, /Status is a duplicate/)
  console.log("Successfully tweeted: ", data.id_str, data.text)
  if(programmed_next_tweet){
    // Schedule answer to tweeted question
    pending_answer = {text: programmed_next_tweet, tweet_id: data.id_str}
    /*console.log("pgm reply")
    let reply_task = cron.schedule(answer_time, () => {tweetReply(programmed_next_tweet, data.id_string, reply_task)}, {scheduled: false})
    reply_task.start()
    */
    // Save scheduled tweet to twitter-tmp file in case the server shuts down before time to tweet
    inTmp(() => {fs.writeFile(to_tweet_file, JSON.stringify(pending_answer), () => {checkError(error)})})
  } else {
    // Remove pending answer
    pending_answer = {}
    inTmp(() => {removeIfExists(to_tweet_file)})
  }
}

function tweetReply(){
  /*
  * Send pending answer tweet.
  * No inputs but use of global variable pending_answer.
  */
  if (pending_answer.text){
    console.log("pending answer:", pending_answer)
    sendTweet(pending_answer.text, [], undefined, pending_answer.tweet_id)
  } else {
    console.warn("Tried to tweet pending answer but no pending answer was found.")
  }
}
/***************************************************************************************************
*                             Backup of pending answer from twitter-tmp file
***************************************************************************************************/
function toTweetContent(error, data){
  /*
  * If there is a pending answer to tweet, write it
  * in pending_answer global variable.
  * INPUTS:
  *   error (Error): potential error thrown when trying to read the file.
  *   data (String): data contained in pending answer twitter-tmp file.
  */
  // No file means no pending answer to tweet, so
  // we ignore "no such file or directory" errors.
  checkError(error, "Can't read pending answer file:", undefined, /no such file or directory/)
  // Save pending answer content.
  if(data){
    pending_answer = JSON.parse(data)
  }
}
/***************************************************************************************************
*                             Download of embedded card images
***************************************************************************************************/
function downloadLoop(included_cards, card_image_ids){
  /*
  * Loop through included images to download them and upload them to twitter
  * INPUTS:
  *   included_cards (Array of String): names of the cards to get images for
  *   card_image_ids (Array of String): media_ids of images uploaded to twitter
  */
  for(var card of included_cards){
    var filename = path.join(tmp_dir, card.name.replace(/\//g, "") + ".jpg")
    // Images are fetched from scryfall API
		let image_url;
		if (["transforming double-faced", "modal double-faced"].includes(card.layout) && card.side === "b") {
			image_url = `https://api.scryfall.com/cards/named?format=image&version=normal&exact=${card.name}&face=back`;
		} else if (card.layout === "split (half)") {
			image_url = `https://api.scryfall.com/cards/named?format=image&version=normal&exact=${card.names[0] + " // " + card.names[1]}`;
		} else {
			image_url = `https://api.scryfall.com/cards/named?format=image&version=normal&exact=${card.name}`;
		}
    getImage(image_url, filename, card_image_ids)
  }
}

function getImage(image_url, filename, card_image_ids){
  /*
  * Get image from given URL
  * INPUTS:
  *   image_url (String)
  *   filename (String): path to the file where downloaded image should be saved
  *   card_image_ids (Array of String): media_ids of images uploaded to twitter
  */
  console.log("Start download of ", image_url)
  https.get(image_url, (response) => {imageResponse(filename, card_image_ids, response)})
}

function imageResponse(filename, card_image_ids, response){
  /*
  * Handle response from https GET request for an image.
  * INPUTS:
  *   filename (String): path to the file where downloaded image should be saved
  *   card_image_ids (Array of String): media_ids of images uploaded to twitter
  *   response (Object): response object from https.get
  */
  switch(response.statusCode){
    case 200:
      // Success, gather response data
      var data = Stream()
      response.on('data', (chunk) => {data.push(chunk)})
      response.on('end', () => {uploadImage(filename, card_image_ids, data)})
      break
    case 302:
      // Redirection, perform a new request to the correct location
      console.log("Redirection to ", response.headers.location)
      https.get(response.headers.location, (redirect_response) => {imageResponse(filename, card_image_ids, redirect_response)})
      break
    default:
      // Error
      throw new Error("Request failed with status " + response.statusCode + " : " + response.statusMessage)
  }
}

function uploadImage(filename, card_image_ids, image_data){
  /*
  * Save downloaded image to file and upload it to twitter.
  * INPUTS:
  *   filename (String): path to the file where downloaded image should be saved.
  *   card_image_ids (Array of String): media_ids of images uploaded to twitter.
  *   image_data (String): image data to save to file and upload to twitter.
  */
  console.log("Finished download of ", filename)
  // Save to file
  fs.writeFileSync(filename, image_data.read())
  // Upload to twitter
  Twitter.postMediaChunked({file_path: filename}, (err, data, response) => {saveMediaId(card_image_ids, err, data)})
}

function saveMediaId(card_image_ids, err, data){
  /*
  * Push media id of the image uploaded to twitter in given ids Array.
  * INPUTS:
  *   card_image_ids (Array of String): media_ids of images uploaded to twitter.
  *   image_data (String): image data to save to file and upload to twitter.
  *   err (Error): potential error from trying to upload image to twitter.
  *   data (Object): uploaded image data.
  */
  checkError(err, "Can't upload image: ")
  // As Strings are mutable, we push the uploaded media ID to card_image_ids
  // This will be seen by isDownloadOver that waits for card_image_ids
  // to have the correct length (number of image to attach).
  card_image_ids.push(data.media_id_string)
  console.log("uploaded", data.media_id)
}
/***************************************************************************************************
*                               Utilitary functions
***************************************************************************************************/
function removeIfExists(filename){
  /* Remove given file, but ignore error if it does not exist.
  * INPUTS:
  *   filename (String): path to file to remove.
  */
  fs.rm(filename, (error) => checkError(error, "Can't remove file:", undefined, /no such file or directory/))
}
function inTmp(callback){
  /*
  * Call given callback after checking twitter-tmp directory exists and creating it if not.
  * INPUTS:
  *   callback (function): function without any argument to call when twitter-tmp has been created
  * or if it already exists.
  */
  if (fs.existsSync(tmp_dir)){
    console.log("twitter-tmp directory already exists")
    callback()
  }else{
    console.log("Create twitter-tmp directory")
    fs.mkdir(tmp_dir, (error) => {checkError(error, "Can't create twitter-tmp directory: ", callback)})
  }
}

function checkError(error, description, callback, exception){
  /*
  * Throw given error if any, complemented by given description.
  * INPUTS:
  *   error (Error): error to be thrown, or undefined.
  *   description (String): description to prefix error message with.
  *   callback (function): optional. Function to call if there is no error.
  *   exception (String): optional. If error message matches exception,
  * the error is ignored
  */
  isIgnored = false
  if(error){
    if(exception){
      isIgnored = error.message.match(exception)
    }
    if(!isIgnored){
      error.message = description + error.message
      throw error
    }
  }
  if(callback){
    callback()
  }
}

findAQuestion()
