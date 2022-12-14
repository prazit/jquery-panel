<?php 
/** 
 * This file is jquery.panel.suite.js + jquery.panel.sute.license.js
 * this is real time load from src directory. 
 */ 
$config = array(
	'js'		=> 'jquery.panel.suite.js',
	'license'	=> 'jquery.panel.suite.license.js'	
);

//-- capture all js
ob_start();
?>

Appanel.version += " JPS Development";

<?php
include '../src/jquery.inout.js';
include '../src/jquery.entry.js';
include '../src/jquery.totag.js';
include '../src/jquery.sweep.js';
include '../src/jquery.glass.js';
include '../src/jquery.live.js';
include '../src/jquery.panel.js';
include '../src/jquery.drilldown.js';
include '../src/jquery.folder.js';

//-- captured source
$source = ob_get_clean();

//-- extract the license into another
$js = '';
$license = '';
$end = 0;
$begin = strpos($source, '/*!');
while($begin !== false) {

	// more js
	$js .= substr($source, $end, $begin - $end);

	// find end of license
	$end = strpos($source, '*/', $begin + 3) + 2;
	if($end===false) {
		$end = $begin;
		break;
	}
	
	// more license
	$comment = substr($source, $begin, $end - $begin);
	$license .= "\r\n\r\n" . $comment;
	
	// find begin of license
	$begin = strpos($source, '/*!',$end);

}
$js .= substr($source,$end);

//-- write js file
$file = fopen($config['js'], 'w');
fwrite($file, $js);
fclose($file);

//-- write license file
$file = fopen($config['license'], 'w');
fwrite($file, substr($license,4,strlen($license)-4));
fclose($file);

//-- echo js
header('Pragma: public');
header('Expires: 0');
header('Content-Type: text/javascript; charset=utf-8');
header('Content-Transfer-Encoding: binary');
echo $js;

?>