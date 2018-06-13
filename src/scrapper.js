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
    }
}