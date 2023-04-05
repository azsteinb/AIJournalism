<?php

/*
Plugin Name: AI Journalism
Description: Auto News Writer and Poster
Version: 1.0
Author: Aaron Steinberg 
*/

class AIJournalismPlugin
{
    function __construct()
    {
        add_action('admin_menu', array($this, 'settingsPage'));
    }

    function settingsPage()
    {
        add_options_page('AI Journalism Settings', 'AI Journalism', 'manage_options', 'ai-journalism-settings-page', array($this, 'settingsPageHTML'));
    }

    function settingsPageHTML()
    { ?>
        <div class="wrap">
            <h1>
                AI Journalism Settings Page
            </h1>
        </div>

<?php }
}

$aiJournalismPlugin = new AIJournalismPlugin();
