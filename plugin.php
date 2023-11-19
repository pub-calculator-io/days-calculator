<?php
/*
Plugin Name: Days Calculator by www.calculator.io
Plugin URI: https://www.calculator.io/days-calculator/
Description: The free days calculator makes it easy to figure out how many days it has been since some date. This day tracker can include or exclude weekends and holidays.
Version: 1.0.0
Author: Calculator.io
Author URI: https://www.calculator.io/
License: GPLv2 or later
Text Domain: ci_days_calculator
*/

if (!defined('ABSPATH')) exit;

if (!function_exists('add_shortcode')) return "No direct call for Days Calculator by Calculator.iO";

function display_ci_days_calculator(){
    $page = 'index.html';
    return '<h2><img src="' . esc_url(plugins_url('assets/images/icon-48.png', __FILE__ )) . '" width="48" height="48">Days Calculator</h2><div><iframe style="background:transparent; overflow: scroll" src="' . esc_url(plugins_url($page, __FILE__ )) . '" width="100%" frameBorder="0" allowtransparency="true" onload="this.style.height = this.contentWindow.document.documentElement.scrollHeight + \'px\';" id="ci_days_calculator_iframe"></iframe></div>';
}

add_shortcode( 'ci_days_calculator', 'display_ci_days_calculator' );