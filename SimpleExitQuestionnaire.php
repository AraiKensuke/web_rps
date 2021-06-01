<?php
$statements = [
   "I was distracted during the experiemnt",
   "I am feel fatigued",
   "I found the experiment engaging and enjoyable"
   ];
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
var visitnum = parseInt(sessionStorage.getItem("visitnum", "1"));

var nextpageURL = "ByeBye.html";

function choose_radio(q, c)
{
var radio = document.getElementById("q" + q + "_" + c);
radio.checked = true;
	var div = document.getElementsByName("div" + q)[0];
	      	div.style.backgroundColor="inherit";
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
	visitelem.value    = visitnum;
        savefilenameelem.value = "SimpleExitQuestionnaire.txt";

        hidd.value = nextpageURL;
        var form = document.getElementsByName("QuestionnaireForm")[0];
        form.submit();
     }   
}
</SCRIPT>
<BODY>
<CENTER>
<H2>Tell us about your RPS games:</H2>
<BR>Please respond to <U>all</U> questions with the answer closest to how you feel.<BR><BR>
<FORM name="QuestionnaireForm" action="save_questionnaire.php" method="POST">
<?php
$L = sizeof($statements)
?>
<INPUT type="hidden" name="number_of_questions" value="<?=$L?>"/>
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
    print("<INPUT type=\"radio\" name=\"q" . ($s+1) . "\" id=\"q" . ($s+1) . "_4\" value=\"4\"/><LABEL><A href=\"javascript:choose_radio(" . ($s+1) . ", 4);\">Definitely Disagree</A></LABEL></TR>\n");
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
