<HTML>
<link rel="stylesheet" href="rps.css" type="text/css" />
<STYLE>
label {
    font-size: 14px;
}

body {
    background-color: rgb(255, 255, 255);
}

.tr1
{
background-color: rgb(220, 220, 220);
}
.tr2
{
background-color: rgb(255,255, 255);
}

td
{
border: 0;
}

table
{
border-collapse: collapse;
}
</STYLE>
<SCRIPT>
function choose_radio(q, c)
{
var radio = document.getElementById("q" + q + "_" + c);
radio.checked = true;
}
</SCRIPT>
<?php
$statements = [
"I prefer to do things with others rather than on my own.",
"I find social situations easy.",
"I would rather go to a library than to a party.",
"I find myself drawn more strongly to people than to things.",
"I find it hard to make new friends.",
"I enjoy social occasions.",
"I enjoy meeting new people.",
"English samples only: New situations make me anxious.",
"I prefer to do things the same way over and over again.",
"It does not upset my if my daily routine is disturbed.",
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
?>
<BODY>
<FORM name="AQform">
<TABLE border="0">
<?php
for ($s = 0; $s < sizeof($statements); $s++ )
{
    $tr_class = "tr" . (($s % 2)+1);
    print("<TR class=\"" . $tr_class . "\"><TD><B>" . ($s + 1) . "</B>&nbsp;&nbsp;</TD><TD>" . $statements[$s] . "</TD></TR>");
    print("<TR class=\"" . $tr_class . "\"><TD></TD><TD>"); 
    print("<INPUT type=\"radio\" name=\"q" . ($s+1) . "\" id=\"q" . ($s+1) . "_1\" value=\"1\"/><LABEL><A href=\"javascript:choose_radio(" . ($s+1) . ", 1);\">definitely agree</A></LABEL>");
    print("<INPUT type=\"radio\" name=\"q" . ($s+1) . "\" id=\"q" . ($s+1) . "_2\" value=\"2\"/><LABEL><A href=\"javascript:choose_radio(" . ($s+1) . ", 2);\">slightly agree</A></LABEL>"); 
    print("<INPUT type=\"radio\" name=\"q" . ($s+1) . "\" id=\"q" . ($s+1) . "_3\" value=\"3\"/><LABEL><A href=\"javascript:choose_radio(" . ($s+1) . ", 3);\">slightly disagree</A></LABEL>"); 
    print("<INPUT type=\"radio\" name=\"q" . ($s+1) . "\" id=\"q" . ($s+1) . "_4\" value=\"4\"/><LABEL><A href=\"javascript:choose_radio(" . ($s+1) . ", 4);\">definitely disagree</A></LABEL></TR>\n"); 
    //if ($s < sizeof($statements)-1)
    //{
	       print("<TR class=\"" . $tr_class . "\"><TD colspan=\"2\">&nbsp;</TD></TR>");
    //}
}
?>
</TABLE>
</FORM>
</BODY>
</HTML>
