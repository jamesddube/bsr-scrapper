var scrapper = require('./scrapper.js');
var _ = require('lodash');

//get all posts
scrapper.getPosts().then((posts) =>{
    scrapper.bindPosts(posts).then((posts) => {
		console.log('app finished scrapping: ',posts.length,'posts')
    })
})