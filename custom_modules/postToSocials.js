const XApi = require('twitter-api-v2').TwitterApi;
const fetch = require('node-fetch');
const { BskyAgent } = require('@atproto/api');
const tumblr = require('tumblr.js');
const fs = require("fs");
const path = require("path");
const e = require('express');

const rootDir = path.join(__dirname, "..");
const rgAuth = JSON.parse(fs.readFileSync(path.join(rootDir, "privateData.json"), "utf8")).socials,
        rgUtils = require(path.join(rootDir, "custom_modules/rgUtils.js"));

rgUtils.setUpErrorHandling();

async function downloadImage(url) {
    const response = await fetch(url);
    return await response.buffer();
}

function splitText(text, maxLength) {
	text = text.trim();
	
	if (text.length <= maxLength) {
		return [text];
	}
	
	const result = [];
	let remaining = text;
	
	while (remaining.length > maxLength) {
		let splitIndex = maxLength;
		let chunk = remaining.substring(0, splitIndex);
		
		// Try to split at sentence endings first (period, question mark, exclamation)
		const lastPeriod = chunk.lastIndexOf('.');
		const lastQuestion = chunk.lastIndexOf('?');
		const lastExclamation = chunk.lastIndexOf('!');
		const lastSentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclamation);
		
		if (lastSentenceEnd > maxLength * 0.5) { // Only if sentence ending is in latter half
			splitIndex = lastSentenceEnd + 1;
		}
		// If no good period, try semicolon
		else {
			const lastSemicolon = chunk.lastIndexOf(';');
			if (lastSemicolon > maxLength * 0.5) {
				splitIndex = lastSemicolon + 1;
			}
			// If no good semicolon, try comma
			else {
				const lastComma = chunk.lastIndexOf(',');
				if (lastComma > maxLength * 0.5) {
					splitIndex = lastComma + 1;
				}
				// If no good punctuation, find last space to avoid breaking words
				// But avoid splitting at spaces adjacent to slashes (treat slashes as part of words)
				else {
					let lastSpace = -1;
					for (let i = chunk.length - 1; i >= 0; i--) {
						if (chunk[i] === ' ') {
							// Check if this space is adjacent to a slash
							const prevChar = i > 0 ? chunk[i-1] : '';
							const nextChar = i < chunk.length - 1 ? chunk[i+1] : '';
							if (prevChar !== '/' && nextChar !== '/') {
								lastSpace = i;
								break;
							}
						}
					}
					if (lastSpace > 0) {
						splitIndex = lastSpace;
					}
					// If somehow no good spaces, force break at maxLength (shouldn't happen with normal text)
				}
			}
		}
		
		chunk = remaining.substring(0, splitIndex).trim();
		result.push(chunk);
		remaining = remaining.substring(splitIndex).trim();
	}
	
	// Add the final chunk if there's anything left
	if (remaining.length > 0) {
		result.push(remaining);
	}
	
	return result;
}

async function postToX(auth, message, imageUrls = [], replyToTweetId) {
    try {
        const client = new XApi({
            appKey: auth.apiKey,
            appSecret: auth.apiSecret,
            accessToken: auth.accessToken,
            accessSecret: auth.accessSecret,
        });

        const rwClient = client.readWrite;
        
        let mediaIds = [];
        
        // Upload images if provided
        if (imageUrls && imageUrls.length > 0) {
            for (const imageUrl of imageUrls) {
                const imageBuffer = await downloadImage(imageUrl);
                const mediaUpload = await rwClient.v1.uploadMedia(imageBuffer, { mimeType: 'image/jpeg' });
                mediaIds.push(mediaUpload);
            }
        }
        
        // Create tweet with or without media
        const tweetData = { text: message };
        if (mediaIds.length > 0) {
            tweetData.media = { media_ids: mediaIds };
        }
        if (replyToTweetId) {
            tweetData.reply = { in_reply_to_tweet_id: replyToTweetId };
        }
        
        const tweet = await rwClient.v2.tweet(tweetData);
        
        return {
            success: true,
            postId: tweet.data.id
        };
    } catch (error) {
        return {
            success: false,
            error: error
        };
    }
}

async function postToBluesky(auth, message, imageUrls = [], replyToPostUri) {
    try {
        const agent = new BskyAgent({
            service: 'https://bsky.social'
        });

        await agent.login({
            identifier: auth.username,
            password: auth.password
        });

        let embeds = [];
        
        // Upload images if provided
        if (imageUrls && imageUrls.length > 0) {
            const images = [];
            for (const imageUrl of imageUrls) {
                const imageBuffer = await downloadImage(imageUrl);
                const uploadResponse = await agent.uploadBlob(imageBuffer, {
                    encoding: 'image/jpeg'
                });
                images.push({
                    alt: '',
                    image: uploadResponse.data.blob
                });
            }
            embeds.push({
                $type: 'app.bsky.embed.images',
                images: images
            });
        }

        const postData = {
            text: message,
            createdAt: new Date().toISOString()
        };

        if (embeds.length > 0) {
            postData.embed = embeds[0];
        }

        if (replyToPostUri) {
            const postUri = replyToPostUri;
            const { data: originalPost } = await agent.getPostThread({ uri: postUri });

            postData.reply = {
                root: originalPost.thread?.post,  // The root of the thread
                parent: originalPost.thread?.post, // The post you're replying to
            };
        }

        const response = await agent.post(postData);
        
        return {
            success: true,
            postId: response.uri
        };
    } catch (error) {
        return {
            success: false,
            error: error
        };
    }
}

async function postToTumblr(auth, message, imageUrls = [], replyToPostId) {
    try {

        const client = tumblr.createClient({
            consumer_key: auth.consumerKey,
            consumer_secret: auth.consumerSecret,
            token: auth.token,
            token_secret: auth.tokenSecret
        });

        // Build content blocks for NPF format
        let content = [
            {
                type: "text",
                text: message
            }
        ];

        // Add images if provided
        if (imageUrls && imageUrls.length > 0) {
            for (const imageUrl of imageUrls) {
                content.push({
                    type: "image",
                    media: [{
                        type: "image/jpeg",
                        url: imageUrl
                    }]
                });
            }
        }

        // Handle replies - Tumblr doesn't have direct replies like X,
        // but we can reblog the original post with our message
        if (replyToPostId) {
            const originalPost = await client.blogPosts(auth.blogName, { id: replyToPostId });
            const response = await client.reblogPost(auth.blogName, {
                id: replyToPostId,
                reblog_key: originalPost.posts[0].reblog_key,
                comment: message
            });
            
            return {
                success: true,
                postId: response.id
            };
        }

        const response = await client.createPost(auth.blogName, {
            content: content
        });
        
        return {
            success: true,
            postId: response.id
        };
    } catch (error) {
        return {
            success: false,
            error: error
        };
    }
}

//Posts a thread on a specific platform. (May be a thread of 1; all posts go through this function.)
const postThread = async function(messages, imageGroups, replyToPostId, postFunc, platformAuth) {
    try {

        if (imageGroups !== undefined && imageGroups.length !== messages.length) {
            throw new Error(`Unmatched messages (${messages.length}) and image groups (${imageGroups.length}). Messages: ${messages}, imageGroups: ${imageGroups}}`);
        }

        let previousId = replyToPostId;
        for (let i in messages) {
            const message = messages[i];
            const images = imageGroups[i] || [];
            const result = await postFunc(platformAuth, message, images, replyToPostId);
            if (result.success) {
                previousId = result.postId;
            } else {
                //We have to do this rather than throw the error to be caught later because throwing an error object removes its extra properties.
                return {
                    "success": false,
                    "error": result.error,
                }
            }
        }
        return {
            "success": true,
            "postId": previousId,
        }
    } catch (e) {
        return {
            "success": false,
            "error": e,
        }
    }
}

const platforms = [
    { name: 'x', func: postToX, auth: rgAuth.x , "lengthLimit": 280},
    { name: 'bluesky', func: postToBluesky, auth: rgAuth.bluesky , "lengthLimit": 4096},
    { name: 'tumblr', func: postToTumblr, auth: rgAuth.tumblr , "lengthLimit": 300},
];

const validateGlobalPostInput = function(auths, message, imageUrls, replyToPostIds) {
    if (replyToPostIds) {
        for (let platform of platforms) {
            if (!replyToPostIds[platform.name] || replyToPostIds[platform.name].trim().length === 0) {
                throw new Error(`Missing reply ID for ${platform.name}`);
            }
        }
    }

    for (let platform of platforms) {
        if (!platform.auth) {
            throw new Error(`Missing auth for ${platform.name}`);
        }
    }

    return true;
}

async function postEverywhere(message, imageUrls = [], replyToPostIds) {

    validateGlobalPostInput(message, imageUrls, replyToPostIds);

    const promises = platforms.map(async platform => {
        try {
            const platformReplyId = replyToPostIds ? replyToPostIds[platform.name] : null;

            const messages = splitText(message, platform.maxLength);
            const imageGroups = messages.map(m => []);//In case in the future we want to allow images later in the answer thread.
            imageGroups[0] = imageUrls;
            
            const result = await postThread(messages, imageGroups, platformReplyId, platform.func, platform.auth);
            return {
                platform: platform.name,
                success: result.success,
                postId: result.postId,
                error: result.error
            };
        } catch (error) {
            return {
                platform: platform.name,
                success: false,
                error: error
            };
        }
    });

    const allResults = await Promise.all(promises);

    // Organize results by platform
    const results = {};
    allResults.forEach(result => {
        results[result.platform] = result;
    });

    return results;
}

module.exports = postEverywhere;