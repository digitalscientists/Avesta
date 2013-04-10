Avesta.News = {
	fetch: function(callback){
		var self = this;
		$.ajax({
			url: 'http://api.tumblr.com/v2/blog/avestahomes.tumblr.com/posts?api_key=p4ft9mP74xmQlsboYxy1Ywo75kxuTdQMHgMTL5TcJnYRrtKV1F',
			dataType: 'JSONP'
		}).success(function(resp){
			self.data = resp;
			callback();
		})
	},
	renderResults: function(){
		$('#news').html(
			Avesta._render('news-posts',{posts: Avesta.News.data.response.posts})
		);
	},
	renderHome: function(){
		$('#news').append(
			Avesta._render('home-news-and-events',{post: Avesta.News.data.response.posts[0]})
		);
	}
}

