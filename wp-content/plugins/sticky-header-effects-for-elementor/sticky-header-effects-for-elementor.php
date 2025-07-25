<?php
/**
 * Plugin Name:			Sticky Header Effects for Elementor
 * Plugin URI:			https://stickyheadereffects.com
 * Description:			Create stunning sticky headers with multiple scroll effects like shrink, fade, slide, and blur—packed with 50+ ready-to-import templates and fully customizable using Elementor.
 * Version:				2.0
 * Author:				POSIMYTH
 * Author URI:			https://posimyth.com/
 * Requires at least:	5.3
 * Tested up to:		6.7
 *
 * Text Domain: she-header
 * Domain Path: /languages/
 *
 * @package sticky-header-effects-for-elementor
 * @category Core
 * @author POSIMYTH
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

define( 'SHE_HEADER_VERSION', '2.0' );
define( 'SHE_HEADER_PREVIOUS_STABLE_VERSION', '1.7.8' );

define( 'SHE_HEADER__FILE__', __FILE__ );
define( 'SHE_HEADER_PLUGIN_BASE', plugin_basename( SHE_HEADER__FILE__ ) );
define( 'SHE_HEADER_PATH', plugin_dir_path( SHE_HEADER__FILE__ ) );
define( 'SHE_HEADER_MODULES_PATH', SHE_HEADER_PATH . 'modules/' );
define( 'SHE_HEADER_URL', plugins_url( '/', SHE_HEADER__FILE__ ) );
define( 'SHE_HEADER_ASSETS_URL', SHE_HEADER_URL . 'assets/' );
define( 'SHE_HEADER_MODULES_URL', SHE_HEADER_URL . 'modules/' );
define( 'SHE_WDKIT_URL', 'https://wdesignkit.com/' );
define( 'SHE_MENU_NOTIFICETIONS', '2' );
define( 'SHE_PBNAME', plugin_basename( __FILE__ ) );



/**
 * Load gettext translate for our text domain.
 *
 * @since 1.0.0
 *
 * @return void
 */
function she_header_load_plugin() {
	load_plugin_textdomain( 'she-header-for-elementor' );

	if ( ! did_action( 'elementor/loaded' ) ) {
		add_action( 'admin_notices', 'she_header_fail_load' );
		return;
	}

	$elementor_version_required = '2.0';
	if ( ! version_compare( ELEMENTOR_VERSION, $elementor_version_required, '>=' ) ) {
		add_action( 'admin_notices', 'she_header_fail_load_out_of_date' );
		return;
	}

	$elementor_version_recommendation = '3.0';
	if ( ! version_compare( ELEMENTOR_VERSION, $elementor_version_recommendation, '>=' ) ) {
		add_action( 'admin_notices', 'she_header_admin_notice_upgrade_recommendation' );
	}

	require( SHE_HEADER_PATH . 'plugin.php' );
	require SHE_HEADER_PATH . 'includes/class-she-loader.php';
}
add_action( 'plugins_loaded', 'she_header_load_plugin' );

/**
 * Show in WP Dashboard notice about the plugin is not activated.
 *
 * @since 1.0.0
 *
 * @return void
 */
function she_header_fail_load() {
	$screen = get_current_screen();
	if ( isset( $screen->parent_file ) && 'plugins.php' === $screen->parent_file && 'update' === $screen->id ) {
		return;
	}

	$plugin = 'elementor/elementor.php';

	if ( _is_elementor_installed() ) {
		if ( ! current_user_can( 'activate_plugins' ) ) {
			return;
		}

		$activation_url = wp_nonce_url( 'plugins.php?action=activate&amp;plugin=' . $plugin . '&amp;plugin_status=all&amp;paged=1&amp;s', 'activate-plugin_' . $plugin );

		$message = '<p>' . __( 'Sticky Header Effects not working because you need to activate the Elementor plugin.', 'she-header' ) . '</p>';
		$message .= '<p>' . sprintf( '<a href="%s" class="button-primary">%s</a>', $activation_url, __( 'Activate Elementor Now', 'she-header' ) ) . '</p>';
	} else {
		if ( ! current_user_can( 'install_plugins' ) ) {
			return;
		}

		$install_url = wp_nonce_url( self_admin_url( 'update.php?action=install-plugin&plugin=elementor' ), 'install-plugin_elementor' );

		$message = '<p>' . __( 'Sticky Header Effects is not working because you need to install the Elementor plugin', 'she-header' ) . '</p>';
		$message .= '<p>' . sprintf( '<a href="%s" class="button-primary">%s</a>', $install_url, __( 'Install Elementor Now', 'she-header' ) ) . '</p>';
	}

	echo '<div class="error"><p>' . $message . '</p></div>';
}

function she_header_fail_load_out_of_date() {
	if ( ! current_user_can( 'update_plugins' ) ) {
		return;
	}

	$file_path = 'elementor/elementor.php';

	$upgrade_link = wp_nonce_url( self_admin_url( 'update.php?action=upgrade-plugin&plugin=' ) . $file_path, 'upgrade-plugin_' . $file_path );
	$message = '<p>' . __( 'Sticky Header Effects not working because you are using an old version of Elementor.', 'she-header' ) . '</p>';
	$message .= '<p>' . sprintf( '<a href="%s" class="button-primary">%s</a>', $upgrade_link, __( 'Update Elementor Now', 'she-header' ) ) . '</p>';

	echo '<div class="error">' . $message . '</div>';
}

function she_header_admin_notice_upgrade_recommendation() {
	if ( ! current_user_can( 'update_plugins' ) ) {
		return;
	}

	$file_path = 'elementor/elementor.php';

	$upgrade_link = wp_nonce_url( self_admin_url( 'update.php?action=upgrade-plugin&plugin=' ) . $file_path, 'upgrade-plugin_' . $file_path );
	$message = '<p>' . __( 'A new version of Elementor is available. For better performance and compatibility of Sticky Header Effects, we recommend updating to the latest version.', 'she-header' ) . '</p>';
	$message .= '<p>' . sprintf( '<a href="%s" class="button-primary">%s</a>', $upgrade_link, __( 'Update Elementor Now', 'she-header' ) ) . '</p>';

	echo '<div class="error">' . $message . '</div>';
}

if ( ! function_exists( '_is_elementor_installed' ) ) {

	function _is_elementor_installed() {
		$file_path = 'elementor/elementor.php';
		$installed_plugins = get_plugins();

		return isset( $installed_plugins[ $file_path ] );
	}
}
