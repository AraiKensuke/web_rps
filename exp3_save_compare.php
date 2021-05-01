<?php
    session_start();
	//  ONE WAY TO DEBUG:  run this directly and see if it saves
	//    file_put_contents("test_php_out", "#  testing");
	//

    function getVal($key, $default)
    {
        if (isset($_POST[$key])) {
	    return $_POST[$key];
        } else {
            echo "no value for:  " . $key;
            return $default;
        }
    }

    //$savedirname      = "21Mar24-1100-04";//getVal("savedirname", "");
    $savedirname      = getVal("savedirname", "");

    $different_AI         = getVal("q1", "");
    $block         = getVal("block", "");
    $toblock         = getVal("to_block", "");

    $out_dirname = "../DATA/exp3/" . $savedirname;

    //$file = $out_dirname . "/questionnaire" . $block . ".txt";
$file = $out_dirname . "/compareAIs.txt";

    file_put_contents($file, "#  different AIs in blocks " . ($block-1) . " and " . $block . "?\n" . $different_AI .
                      "\n", FILE_APPEND);
?>
<HTML>
<SCRIPT>
<?php
$gourl = "rps.html";

if ($toblock == $block)
{
	$gourl = "exp3_results.html";
}
?>
sessionStorage.setItem("compare<?=($block-1)?>,<?=$block?>", "<?=$different_AI?>");
document.location.href="<?=$gourl?>";
</SCRIPT>
<BODY>
<?php
$savedirname      = getVal("savedirname", "");
?>
<?=$savedirname;?>
</BODY>
</HTML>