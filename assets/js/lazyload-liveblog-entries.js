(function($) {

    console.log( 'initializing' );

	LiveblogLazyloader = function() {

		var self = this;

		self.$el     = $('#liveblog-entries');
		self.options = {};
		self.entries = [];


		/**
		 * Initialize lazyloader with options passed from wp_enqueue_script.
		 *
		 */
		self.init = function( options ) {
			self.options = options;
			setTimeout( self.loadMore );
		};

		/**
		 * Load another batch of posts and append them to the liveblog-entries
		 * element.
		 *
		 */
		self.loadMore = function() {
			$.get( self.ajaxRequestUrl(), {},
				function(response) {

					/*
					 * Since the response will be ascending order,
					 * reverse it before processing it.
					 */
					
					self.entries = response.entries.reverse();

					self.renderEntriesPage();
					delete response; // Free up memory as soon as possible.
				}
			);
		};


		/**
		 * Render another "page" of entries.
		 *
		 * Takes another batch of entries from self.entries and appends them to
		 * the liveblog content element.
		 */
		self.renderEntriesPage = function() {

			var entries = self.entries.slice( 0, self.postsPerPage );
			self.entries = self.entries.slice( self.postsPerPage );

			$.each( entries, function( i, entry ) {

				var $e = $( entry.html ).appendTo( self.$el ),
					timestamp = $e.data('timestamp');

				if ( timestamp < self.options.earliest_timestamp ) {
					self.options.earliest_timestamp = timestamp - 1;
				}
			});

			if ( self.entries.length ) {
				setTimeout( self.renderEntriesPage );
			}
		}


		/**
		 * Build the URL to get more posts through Ajax.
		 *
		 * Uses the liveblog plugin's endpoint structure:
		 * '{permalink}/liveblog/{from_timestamp}/{to_timestamp}/'
         *
		 */
		self.ajaxRequestUrl = function() {
			return [
				self.options.permalink,              // Post permalink
				self.options.liveblog_endpoint,      // 'liveblog' slug
				'/',
				'0',                                 // from_timestamp: Go all the back
				'/',
				self.options.earliest_timestamp - 1, // to_timestamp: Earliest entry already fetched.
				'/'
			].join('');
		};


		/**
		 * Start the plugin.
		 *
		 */
		if ( typeof liveblogInit !== 'undefined' ) {
			self.init( liveblogInit );
		}

		return self;
	};

})(jQuery);


