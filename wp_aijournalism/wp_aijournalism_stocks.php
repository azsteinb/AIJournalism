<?php

/*
Plugin Name: AI Journalism Stocks 
Description: Auto News Writer and Poster for financial articles
Version: 1.0
Author: Aaron Steinberg 
*/

class AIJournalismPlugin
{
    function __construct()
    {
        add_action('admin_menu', array($this, 'actionPage'));
        add_action('wp_ajax_my_plugin_create_post', array($this, 'createPost'));
    }

    function actionPage()
    {
        add_menu_page('AI Journalism Action Page', 'AI Journalism', 'manage_options', 'ai-journalism-action-page', array($this, 'actionPageHTML'));
    }

    function actionPageHTML()
    { ?>
        <div class="wrap">
            <h1>
                AI Journalism Stocks Main Menu
            </h1>
            <h2>
                How to use:
            </h2>
            <p>
                To use AI Journalism Stocks, all you need to do is press generate an article.
                Optionally, you may specify a custom author name.
            </p>
            <form id="ai-journalism-form" method="POST">
                <?php wp_nonce_field('my-plugin-nonce', 'nonce'); ?>
                <input type="hidden" name="action" value="my_plugin_create_post">
                <label for='post-author'>Author:</label>
                <input type="text" id="post_author" name="post_author" required>
                <br>
                <button id="ai-journalism-submit">Create Post</button>
            </form>

        </div>

        <script>
            jQuery(document).ready(function($) {
                $('#ai-journalism-form').submit(function(e) {
                    e.preventDefault();
                    alert('Yes');
                    $.post(ajaxurl, $('#ai-journalism-form').serialize(), function(response) {
                        if (response.success) {
                            alert('Post created with ID: ' + response.data.post_id);
                        } else {
                            alert(response.data);
                        }
                    });
                    // alert($('#ai-journalism-form').serialize());
                });
            });
        </script>

<?php }

    function createPost()
    {
        check_ajax_referer('my-plugin-nonce', 'nonce');
        // $post_author = str_replace(' ', '%20', $_POST['post_author']);
        $json_url = 'http://localhost:3010/v0/article/?author=' . $_POST['post_author'];
        $res = file_get_contents($json_url);
        $obj = json_decode($res, true);
        $content = $obj['content'];
        $title = $obj['title'];

        $post = array(
            'post_title' => $title,
            'post_content' => $content,
            'post_status' => 'publish',
            'post_author' => 1,
            'post_type' => 'post'
        );

        $post_id = wp_insert_post($post);

        if ($post_id) {
            wp_send_json_success(array('post_id' => $post_id));
        } else {
            wp_send_json_error('Post creation failed.');
        }

        wp_die();
    }
}

$aiJournalismPlugin = new AIJournalismPlugin();
