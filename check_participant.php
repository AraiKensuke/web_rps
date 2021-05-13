<?php
//  we check participant ID, if it is OK, 
//  we change automatically with document.location.href
include "utils.php";

//if ((not isset($_GET['partid']) && (array_key_exists('partid', $_GET))))

$valid_id = false;
if (isset($_GET['partID']))
{   //   IF a participantID was passed to this page
    $partID_passed = $_GET["partID"];

    $chkret = check_partID("TMB1", $partID_passed);  // check if valid ID
    $last_visit = $chkret[1];
    $valid_id = $chkret[0];
}
if ($valid_id)
{
    $partID_valid = $partID_passed;
    $visit = $last_visit + 1;
}
else
{
    $partID_valid = generate_partID();
    $visit = 1;
}

$flder = mkoutdir("TMB1", $partID_valid, $visit);
?>
<HTML>
<SCRIPT>
    visitnum = <?=$visit?>;
    sessionStorage.setItem("visitnum", visitnum);
    sessionStorage.setItem("ParticipantID", "<?=$partID_valid?>");
    //alert("<?=$partID_passed?>" + "     " + "<?=$partID_valid?>");
if (visitnum == 1)
{
    document.location.href="DemographicQuestionnaire1.php";
//      	setTimeout(() => { document.location.href="DemographicQuestionnaire1.php";  }, 10000);

}
else
{
    document.location.href="rps.html";
//      	setTimeout(() => { document.location.href="rps.html";  }, 10000);
}
</SCRIPT>
</HTML>

