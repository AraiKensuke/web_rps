<HTML>
<SCRIPT>
var visit = sessionStorage.getItem("visitnum", 1);
var partID = sessionStorage.getItem("ParticipantID", "");
var exptname = sessionStorage.getItem("exptname", "TMB1");
function check_and_submit()
{
    //var document.getElementsByName("q1")[0];
    //var document.getElementsByName("q1")[0];

    var partIDelem = document.getElementsByName("ParticipantID")[0];
    var exptnameelem = document.getElementsByName("exptname")[0];
    //var visitelem = document.getElementsByName("visitnum")[0];
    exptnameelem.value = exptname;
    partIDelem.value   = partID;
    //visitelem.value    = visit;

    var form = document.getElementsByName("DemogQ1")[0];
    form.submit();
}
</SCRIPT>
<BODY>
<FORM name="DemogQ1" action="save_questionnaire.php" method="POST">
<INPUT type="hidden" name="number_of_questions" value="4"/>
<INPUT type="hidden" name="nextpageURL" value="rps.html"/>
<INPUT type="hidden" name="ParticipantID" value=""/>
<INPUT type="hidden" name="exptname" value=""/>
<INPUT type="hidden" name="visitnum" value="0"/> <!-- visitnum set to 0 -->
<INPUT type="hidden" name="savefilename" value="DQ1.txt"/>

<TABLE>
<TR><TD>What is your age?</TD>
<TD><INPUT name="q1" value="18" type="number" min="10" max="110" size="4"/></TD></TR>

<TR><TD>What is your gender</TD>
<TD>
<SELECT name="q2">
  <option value="Male">Male</option>
  <option selected value="Female">Female</option>
  <option value="Non-binary">Non-binary or genderqueer</option>
</SELECT>
</TD></TR>

<TR><TD>Is English your primary language</TD>
<TD>
<SELECT name="q3" id="cars">
<option selected value="Yes">English is my primary language</option>
<option value="No">English is not my primary language</option>
</SELECT>
</TD></TR>

<TR><TD>(Optional) comments</TD>
<TD>
<INPUT type="text" name="q4" value="optional" size="100"/></TD></TR>
</TABLE>
<BR><BR>
	    <A href="javascript:check_and_submit();"><IMG src="Next.jpg" height=40/></A>

</FORM>
</BODY>
</HTML>