<!--
Website   Kensuke Arai
-->

<?php
include "utils.php";

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
?>
<HTML>
<link rel="stylesheet" href="rps.css" type="text/css" />
<SCRIPT src="util.js"></SCRIPT>
<?php
if (($visit % 2) + 1)
{
    $ai_js_file = "machTMB" . (($visit-1) % 2 + 1) . ".js";
}
?>
<SCRIPT src="<?=$ai_js_file?>"></SCRIPT>

<SCRIPT src="rpsm.js"></SCRIPT>
<STYLE>
          input {border:3px solid #000000;font-size:16px;}
</STYLE>

<SCRIPT>
<?php
    if ($valid_id)
    {
?>
<?php
}
?>
var MatchTo=32;
realtimeResults = __CWTL_NOGRAPH__;

machine_and_configs = [];
machine_and_configs_indices = [];
machine_and_configs_nicknames = [];

nmachines = _machine_and_configs.length;
for (i = 0; i < nmachines; i++ )
{
    machine_and_configs[i] = _machine_and_configs[i];
    machine_and_configs_indices[i] = _machine_and_configs_indices[i];
    machine_and_configs_nicknames[i] = _machine_and_configs_nicknames[i];
}
to_block = nmachines;
sessionStorage.setItem("exptname", "TMB1");
sessionStorage.setItem("block", 0);
sessionStorage.setItem("to_block", to_block);
sessionStorage.setItem("MatchTo", MatchTo);
sessionStorage.setItem("url_after_blocks", "4ChoiceQuestionnaire.php");
//sessionStorage.setItem("stop_after_n_consec_wins", 6);

inds = [];
for (blk = 0; blk < to_block; blk++ )
{
    inds[blk] = blk;
}
shuffleArray(inds);
 
for (blk = 0; blk < to_block; blk++ )
{
    mach1 = machine_and_configs[inds[blk]];
    inds1 = machine_and_configs_indices[inds[blk]];
    nickn1 = machine_and_configs_nicknames[inds[blk]];
    
    sessionStorage.setItem("AIconfigNum" + (blk+1).toString(), mach1);
    sessionStorage.setItem("AIconfigNumIndex" + (blk+1).toString(), inds1);
    sessionStorage.setItem("AIconfigNumNickname" + (blk+1).toString(), nickn1);
}

sessionStorage.setItem("RealtimeResults", realtimeResults);
sessionStorage.setItem("php_backend", "save_RPS_exp.php");

function setGameNums()
{
    document.getElementById("ngames1").innerHTML = MatchTo;
    document.getElementById("nbots1").innerHTML = nmachines;
    document.getElementById("nbots2").innerHTML = nmachines;
}

function nextpage(dopractice)
{
    sessionStorage.setItem("PracticeMode", dopractice);
    //  if $visitnum > 1, we've already found the previous data
    visit=<?=$visit?>;
    sessionStorage.setItem("visitnum", visit);
    sessionStorage.setItem("ParticipantID", "<?=$partID_valid?>");

    if (visit > 1)
    {
        document.location.href="rps.html";
    }
    else
    {
        var idform = document.getElementsByName("partIDform");
        var val = idform[0].partID.value;
        if (val != "IGNORE IF YOU DON'T KNOW WHAT THIS IS")
        {
            document.location.href="check_participant.php?partID=" + val;
        }
        else
        {
            document.location.href="DemographicQuestionnaire1.php";
        }
    }
}
</SCRIPT>
<BODY onload="javascript:setGameNums();">
        <p id="p1">In the repeated rock-scissor-paper (RPS) game, players accumulate knowledge about their opponent's playing strategies over many back-to-back games, and advantages are gained and lost as each player tries to outsmart the other.  This experiment seeks to understand whether players can gain an advantage against opponents playing RPS according to a simple rule unknown to the player.
<br><br>
        You'll play against <SPAN id="nbots1">3</SPAN> bots in <SPAN id="nbots2">3</SPAN> <SPAN id="ngames1">10</SPAN>-match rounds.  <U>Each bot has its own rules for deciding the next move.  It might play like a 2 year-old that really likes to play rock, or the outcome of the last match might influence its next move.</U>  You likely won't completely figure out a rule, but might learn enough to gain an advantage.</U>  <BR><BR>

You can go straight to the tournament, or you can first practice playing RPS against the computer in a short 10 game round.
</p>

<BR>
<?php
// if called from link, check to see if entered participantID is a valid one.
// if valid, dont show ID input box
if (!$valid_id)
{
     print("<DIV style=\"background-color:#DADADA;\"><FORM name=\"partIDform\">Please enter Participant ID:  <INPUT name=\"partID\" type=\"text\" value=\"IGNORE IF YOU DON'T KNOW WHAT THIS IS\" size=40/></FORM>We'll tell you your participant ID after you finish the tournament.  If you enjoyed the experiment and choose to participate again, this ID allows us to compare your results across multiple tournaments and assess how reproducible and consistent they are.  We don't collect any identifying information from you, so the randomly generated participant ID you <B>voluntarily</B> tell us is the only way we can identify experimental data that are from the same participant.  Sharing your ID with us is <B>optional</B>, but adds value in our analysis of the data.</DIV><BR><BR>");
}
?>
<CENTER>
<TABLE><TR><TD>
	    <A href="javascript:nextpage(false);"><IMG src="skip_practice.jpg" height=40/></A></TD></TR>
  <TR><TD>
	    <A href="javascript:nextpage(true);"><IMG src="practice_round.jpg" height=40/></A>
</TR></TABLE>
</CENTER>

</BODY>
</HTML>
