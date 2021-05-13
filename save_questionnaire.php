<?php
include "utils.php";

//ONE WAY TO DEBUG:  run this directly and see if it saves 
//	    file_put_contents("test_php_out", "#  testing");

$number_of_qs     = intval(getVal("number_of_questions", ""));
$nextpageURL      = getVal("nextpageURL", "");
$ParticipantID    = getVal("ParticipantID", "");
$exptname         = getVal("exptname", "");
$visit            = getVal("visitnum", "1");
$savefilename     = getVal("savefilename", "");

$out_dirname 	     = mkoutdir($exptname, $ParticipantID, $visit);  // $visit set to 0 -> then we save under participant folder, not visit folder

$file = $out_dirname . "/" . $savefilename;

file_put_contents($file, "#  questionnaire answers\n");
for ($q = 0; $q < $number_of_qs; $q++ )
{
    $ans = getVal("q" . ($q+1), "");
    file_put_contents($file, $ans. "\n", FILE_APPEND);
}   
?>
<HTML>
<SCRIPT>
document.location.href="<?=$nextpageURL?>";
</SCRIPT>
</HTML>