const Nightmare = require('nightmare')
var _ = require('lodash');

module.exports = {
    getPosts(){
        console.log('preparing to get all posts');
		return new Promise((success,error) => {
			const nightmare = Nightmare({ show: false })
			nightmare
	  		.goto('https://www.bigsr.co.uk/blog').wait(9000).evaluate(() => {
	  			var Posts = []
	  			$(".font_5").each(function(){
			        post = {}
			        post['summary'] = $(this).first().parent().parent().parent().parent().parent().next().next().next().next().children().children().next().next().children().children().children().text()
			        post['author'] = $(this).first().parent().parent().parent().parent().parent().next().next().children().children().children().children().children().children().text()
			        post['image_url'] = $(this).first().parent().parent().parent().parent().parent().next().next().next().next().children().children().children().children().children().children().children().children().children().children().attr('src')
			        post['title'] = $(this).text()
			        post['link'] = $(this).parent().parent().parent().parent().attr("href")
			        post['date'] = $(this).first().parent().parent().parent().parent().parent().next().next().children().children().children().children('p').text()
			        Posts.push(post)
			    })
	  			return Posts
			}).end()
			.then(posts => success(posts))
			.catch(e => error(e))
		}) 
    },
    getPostBody(Post) {
		let tempPost = Post
		console.log('preparing to get post body');
		return new Promise((success, error) => {
			const nightmare = Nightmare({ show: false })
			nightmare
	  		.goto(tempPost.link).wait(9000).evaluate(() => {
				  	return $('#comp-ivpe94mh_SinglePostMediaTop_MediaPost__0_0__type_MediaPost').text()
			}).end()
			.then((body) => {
				console.log('extracting body for : ',tempPost.title);
				tempPost.body = body
				success(tempPost)
			})
			.catch((e) => error(e))
		}).catch('error getting post body');
	},
	/**
     * Bind the body of a post
     * 
     * @param {Object} Posts  
     */
	bindPosts(Posts) {
		var originalPosts = Posts;
		return new Promise((resolve) => {
			let Promises = [];
			for (i = 0; i < Posts.length; i++) {
				Promises.push(
					this.getPostBody(Posts[i]).then((post) => {
						var foundPost = _.find(Posts, [ 'title', post.title ]);
						
						if(typeof (foundPost) != undefined && foundPost.title != undefined){
							console.log('Found post : ', foundPost.title);
							//remove the post from the array and add the updated one
							var interimPosts = _.reject(originalPosts, [ 'title', foundPost.title ]);
							interimPosts.push(foundPost);
							originalPosts = interimPosts;
						}else{
							console.log('could not find post')
						}
					})
				);
			}
			Promise.all(Promises).then(() => {
				resolve(originalPosts);
			});
		});
	}
}