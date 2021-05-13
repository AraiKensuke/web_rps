<?php
$AQ = "false";
if ($_GET["q"] == "AQ")
{
   $AQ = "true";
   $statements = [
   "I prefer to do things with others rather than on my own.",
   "I find social situations easy.",
   "I would rather go to a library than to a party.",
   "I find myself drawn more strongly to people than to things.",
   "I find it hard to make new friends.",
   "I enjoy social occasions.",
   "I enjoy meeting new people.",
   "New situations make me anxious.",
   "I prefer to do things the same way over and over again.",
   "It does not upset me if my daily routine is disturbed.",
   "I enjoy doing things spontaneously.",
   "New situations make me anxious.",
   "I frequently get strongly absorbed in one thing.",
   "I can easily keep track of several different people's conversations.",
   "I find it easy to do more than one thing at once.",
   "If there is an interruption, I can switch back very quickly.",
   "Trying to imagine something, I find it easy to create a picture in my mind.",
   "Reading a story, I can easily imagine what the characters might look like.",
   "I find making up stories easy.",
   "Reading a story, I find it difficult to work out the character's intentions.",
   "I find it easy to work out what someone is thinking or feeling.",
   "I find it difficult to imagine what it would be like to be someone else.",
   "I find it difficult to work out people's intentions.",
   "I find it easy to play games with children that involve pretending.",
   "I usually notice car number plates or similar strings of information.",
   "I am fascinated by dates.",
   "I am fascinated by numbers.",
   "I notice patterns in things all the time.",
   "I like to collect information about categories of things."
   ];
}
else
{
   $statements = [
   "I was distracted during the experiemnt",
   "I am feel fatigued",
   "I found the experiment engaging and enjoyable"
   ];
}
?>
<HTML>
<link rel="stylesheet" href="rps.css" type="text/css" />
<STYLE>
A {
text-decoration: none;
}

A:hover
{
text-decoration: underline;
}

label {
    font-size: 14px;
}

body {
    background-color: #FFFFFF;
}

.tr1
{
background-color: #CCCCCC;
}
.tr2
{
background-color: #FFFFFF;
}
.tr5
{
background-color: #FFCC00;
}

td
{
border: 0;
padding-right: 20px;
}

table
{
border-collapse: collapse;
}
</STYLE>
<SCRIPT>
var partID = sessionStorage.getItem("ParticipantID", "");
var exptname = sessionStorage.getItem("exptname", "TMB1");

var AQ = <?=$AQ?>;
var visitnum = parseInt(sessionStorage.getItem("visitnum", "1"));

if (AQ)
{
    var nextpageURL = "TournamentResults.html";
}
else
{         //  Mental state questionnaire.
    if (visitnum == 1)
    {   
        var nextpageURL = "4ChoiceQuestionnaire.php?q=AQ";
    }  
    else
    {
        var nextpageURL = "TournamentResults.html";
    }
}

function choose_radio(q, c)
{
var radio = document.getElementById("q" + q + "_" + c);
radio.checked = true;
}

function check_and_submit()
{
    var len_qs = <?=sizeof($statements)?>;

    var sMesg = "Some questions left unaswered.";
    var num_unchecked = 0;
    for (var iq = 0; iq < len_qs; iq++ )
    {
	var div = document.getElementsByName("div" + (iq+1))[0];
	div.style.backgroundColor="inherit";
	var radios = document.getElementsByName("q" + (iq+1));

        var n_checked = 0;
        for (var i = 0; i < radios.length; i++) {

            if (radios[i].checked) 
            {
                n_checked += 1;
            }
        }
       if (n_checked == 0)
       {
           num_unchecked += 1;
	   var div = document.getElementsByName("div" + (iq+1))[0];
	   div.style.backgroundColor="#FF0000";
       }
    }

    if (num_unchecked > 0)
    {
       alert(sMesg);
    }
    else
    {   //  The FORM looks complete and valid
        var hidd = document.getElementsByName("nextpageURL")[0];
	var partIDelem = document.getElementsByName("ParticipantID")[0];
        var exptnameelem = document.getElementsByName("exptname")[0];
        var savefilenameelem = document.getElementsByName("savefilename")[0];
        var visitelem = document.getElementsByName("visitnum")[0];

        exptnameelem.value = exptname;
        partIDelem.value   = partID;
        if (AQ) {    
            visitelem.value    = 0;
            savefilenameelem.value = "AQ29.txt";
        }
        else {    
            visitelem.value    = visitnum;
            savefilenameelem.value = "MentalState.txt";
        }

        hidd.value = nextpageURL;
        var form = document.getElementsByName("QuestionnaireForm")[0];
        form.submit();
     }   
}
</SCRIPT>
<BODY>
<CENTER>
<?php
if ($AQ == "true")
{
?>
<H2>Tell us about your real-world social interactions:</H2>
<?php
}
else
{
?>
<H2>Tell us about your tournament:</H2>
<?php
}
?>
<FORM name="QuestionnaireForm" action="save_questionnaire.php" method="POST">
<INPUT type="hidden" name="number_of_questions" value="<?=sizeof($statements)?>"/>
<INPUT type="hidden" name="ParticipantID" value=""/>
<INPUT type="hidden" name="exptname" value=""/>
<INPUT type="hidden" name="visitnum" value="0"/> <!-- visitnum set to 0 -->
<INPUT type="hidden" name="savefilename" value=""/>

<INPUT type="hidden" name="nextpageURL" value=""/>

<TABLE border="0">
<?php
for ($s = 0; $s < sizeof($statements); $s++ )
{
    $tr_class = "tr" . (($s % 2)+1);
    print("<TR class=\"" . $tr_class . "\"><TD><DIV name=\"div" . ($s+1) . "\" &nbsp;&nbsp;<B>" . ($s + 1) . "</B>&nbsp;&nbsp;</TD><TD>" . $statements[$s] . "</TD></TR>");
    print("<TR class=\"" . $tr_class . "\"><TD></TD><TD>"); 
    print("<INPUT type=\"radio\" name=\"q" . ($s+1) . "\" id=\"q" . ($s+1) . "_1\" value=\"1\"/><LABEL><A href=\"javascript:choose_radio(" . ($s+1) . ", 1);\">Definitely Agree</A></LABEL>");
    print("<INPUT type=\"radio\" name=\"q" . ($s+1) . "\" id=\"q" . ($s+1) . "_2\" value=\"2\"/><LABEL><A href=\"javascript:choose_radio(" . ($s+1) . ", 2);\">Slightly Agree</A></LABEL>"); 
    print("<INPUT type=\"radio\" name=\"q" . ($s+1) . "\" id=\"q" . ($s+1) . "_3\" value=\"3\"/><LABEL><A href=\"javascript:choose_radio(" . ($s+1) . ", 3);\">Slightly Disagree</A></LABEL>"); 
    print("<INPUT type=\"radio\" name=\"q" . ($s+1) . "\" id=\"q" . ($s+1) . "_4\" value=\"4\" checked/><LABEL><A href=\"javascript:choose_radio(" . ($s+1) . ", 4);\">Definitely Disagree</A></LABEL></TR>\n"); 
	       print("<TR class=\"" . $tr_class . "\"><TD colspan=\"2\">&nbsp;</TD></TR>");

    if (((($s+1) % 5) == 0) && ($s != 0))
		  {
	       print("<TR class=\"tr5\"><TD colspan=\"2\">&nbsp;<BR>&nbsp;</TD></TR>");
}

}
?>
</TABLE>
<BR><BR>
	    <A href="javascript:check_and_submit();"><IMG src="Next.jpg" height=40/></A>
</CENTER>
</FORM>
</BODY>
</HTML>
