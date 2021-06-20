<!--
Website   Kensuke Arai
-->

<?php
include "utils.php";
?>
<HTML>
<link rel="stylesheet" href="rps.css" type="text/css" />
<SCRIPT src="util.js"></SCRIPT>
<?php
$ai_js_file = "machEEG1";
?>
<SCRIPT src="<?=$ai_js_file?>"></SCRIPT>
<SCRIPT src="playerMachines.js"></SCRIPT>

<SCRIPT src="rpsm.js"></SCRIPT>
<STYLE>
          input {border:3px solid #000000;font-size:16px;}
</STYLE>

<SCRIPT>
<?php
    $partID = generate_partID(false);
?>
var MatchTo=500;
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
sessionStorage.setItem("exptname", "EEG1");
sessionStorage.setItem("playerMachineConstr", pm[20]);
sessionStorage.setItem("block", 0);
sessionStorage.setItem("to_block", to_block);
sessionStorage.setItem("MatchTo", MatchTo);
sessionStorage.setItem("practice_MatchTo", 30);
sessionStorage.setItem("url_after_blocks", "Byebye.html");

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
    sessionStorage.setItem("visitnum", 0);

    var idform = document.getElementsByName("participantName");
    var val = idform[0].partName.value;
    sessionStorage.setItem("ParticipantID", "<?=$partID?>");
    sessionStorage.setItem("ParticipantName", val);

    document.location.href="rps.html";
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
     print("<DIV style=\"background-color:#DADADA;\"><FORM name=\"participantName\">Please enter a participant name:  <INPUT name=\"partName\" type=\"text\" value=\"\" size=40/></FORM></DIV><BR><BR>");
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
