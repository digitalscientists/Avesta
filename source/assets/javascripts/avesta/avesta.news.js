Avesta.News = {
	initialize: function(){
		this.fetch();
	},
	fetch: function(){
		var self = this;
		$.ajax({
			url: 'http://api.tumblr.com/v2/blog/avestahomes.tumblr.com/posts?api_key=p4ft9mP74xmQlsboYxy1Ywo75kxuTdQMHgMTL5TcJnYRrtKV1F',
			dataType: 'JSONP'
		}).success(function(resp){
			self.data = resp;
			self.renderResults();
		})
	},
	renderResults: function(){
		$('#news').html(
			Avesta._render('news-posts',{posts: Avesta.News.data.response.posts})
		);
	}
}

