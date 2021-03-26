<?php
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

    $RPS_familiar         = getVal("q1", "");
    $expt_repetition      = getVal("q2", "");
    $focused              = getVal("q3", "");
    $rule_based           = getVal("q4", "");
    $which_difficult      = getVal("q5", "");
    $different_AI         = getVal("q6", "");

    $out_dirname = "../DATA/exp1/" . $savedirname;

    $file = $out_dirname . "/questionnaire.txt";

    file_put_contents($file, "#  familiar with RPS\n" . $RPS_familiar . "\n");
    file_put_contents($file, "#  num experiment tries\n" . $expt_repetition . 
                      "\n", FILE_APPEND);
    file_put_contents($file, "#  focused or distracted\n" . $focused . 
                      "\n", FILE_APPEND);
    file_put_contents($file, "#  rule-based playing\n" . $rule_based . 
                      "\n", FILE_APPEND);
    file_put_contents($file, "#  difficult 1st or 2nd\n" . $which_difficult . 
                      "\n", FILE_APPEND);
    file_put_contents($file, "#  different AIs?\n" . $different_AI . 
                      "\n", FILE_APPEND);
?>
<HTML>
<SCRIPT>
sessionStorage.setItem("q6", "<?=$different_AI?>");
sessionStorage.setItem("q5", "<?=$which_difficult?>");

document.location.href="exp1_results.html";
</SCRIPT>
<BODY>
</BODY>
</HTML>