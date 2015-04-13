<?php
/*
Plugin Name: Lazyload Liveblog Entries
Version: 0.1-alpha
Description: Improves pagespeed performance of large liveblogs by lazy-loading entries.
Author: goldenapples
Author URI: https://github.com/fusioneng/
Plugin URI: https://github.com/fusioneng/lazyload-liveblog-entries
Text Domain: lazyload-liveblog-entries
Domain Path: /languages
 */

class Lazyload_Liveblog_Entries {

	private static $instance;

	protected $query_vars = array();

	protected $key;

	protected static $posts_initial = 5;
	protected static $posts_per_page = 10;

	protected $post;
	protected $permalink;

	public static function get_instance() {

		if ( ! isset( self::$instance ) ) {
			self::$instance = new Lazyload_Liveblog_Entries;
			self::$instance->setup_filters();
		}
		return self::$instance;
	}

	private function setup_filters() {
		add_filter( 'liveblog_display_archive_query_args', array( $this, 'liveblog_query_args' ), 20, 2 );
	}

	/**
	 * Is the current page a Liveblog post?
	 *
	 * @return bool
	 */
	private function is_liveblog_post() {
		return WPCOM_Liveblog::is_viewing_liveblog_post();
	}


	/**
	 * Filter the arguments passed to get_comments(): limit query to 5 results.
	 * Also attach the action which gets the earliest timestamp from the results returned.
	 *
	 * @filter 'liveblog_display_archive_query_args'
	 */
	public function liveblog_query_args( $args, $state ) {

		$args['number'] = self::$posts_initial;

		add_filter( 'the_comments', array( $this, 'liveblog_get_earliest_timestamp' ) );

		return $args;
	}


	/**
	 * After getting entries, get the earliest timestamp from them, and save
	 * that for the next query.
	 *
	 * @filter 'the_comments'
	 */
	public function liveblog_get_earliest_timestamp( $comments_array ) {
		$earliest_timestamp = gmdate( 'U' );

		foreach ( $comments_array as $comment ) {
			$comment_timestamp = mysql2date( 'G', $comment->comment_date_gmt );

			$earliest_timestamp = min( $earliest_timestamp, $comment_timestamp );
		}

		$this->query_vars = array(
			'post_id'            => get_queried_object_id(),
			'permalink'          => get_permalink( get_queried_object_id() ),
			'liveblog_endpoint'  => WPCOM_Liveblog::url_endpoint,
			'posts_per_page'     => self::$posts_per_page,
			'earliest_timestamp' => $earliest_timestamp,
		);

		wp_enqueue_script( 'lazyload-liveblog-entries',
			plugins_url( 'assets/js/lazyload-liveblog-entries.js', __FILE__ ),
			array(), false, true );

		wp_localize_script( 'lazyload-liveblog-entries', 'liveblogInit', $this->query_vars );

		return $comments_array;
	}

}

function Lazyload_Liveblog_Entries() {
	return Lazyload_Liveblog_Entries::get_instance();
}
add_action( 'init', 'Lazyload_Liveblog_Entries' );

