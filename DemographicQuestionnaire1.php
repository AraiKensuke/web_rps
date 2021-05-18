<HTML>
<link rel="stylesheet" href="rps.css" type="text/css" />
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

  <CENTER>
    <P id="p1">
<H2>Demographic Information</H2>
<BR>
Before we begin, we ask that you tell us a bit about yourself.<BR><BR><BR>
<FORM name="DemogQ1" action="save_questionnaire.php" method="POST">
<INPUT type="hidden" name="number_of_questions" value="4"/>
<INPUT type="hidden" name="nextpageURL" value="rps.html"/>
<INPUT type="hidden" name="ParticipantID" value=""/>
<INPUT type="hidden" name="exptname" value=""/>
<INPUT type="hidden" name="visitnum" value="0"/> <!-- visitnum set to 0 -->
<INPUT type="hidden" name="savefilename" value="DQ1.txt"/>

<TABLE>
<TR><TD>What is your age?</TD>
<TD>
<SELECT name="q1">
  <option value="<18">17 and under</option>
  <option selected value="18-24">18-24</option>
  <option value="25-29">25-29</option>
  <option value="30-34">30-34</option>
  <option value="35-39">35-39</option>
  <option value="40-44">40-44</option>
  <option value="45-49">45-49</option>
  <option value="50-54">50-54</option>
  <option value="55-59">55-59</option>
  <option value="60-64">60-64</option>
  <option value="65-69">65-69</option>
  <option value="70-74">70-74</option>
  <option value="75-79">75-79</option>
  <option value="80-84">80-84</option>
  <option value="85-89">85-89</option>
  <option value=">90">90 and over</option>
  <option value="No answer">Prefer not to answer</option>
</SELECT>
</TD>
</TR>
<TR><TD colspan="2">&nbsp;</TD></TR>
<TR><TD>What is your gender identity?</TD>
<TD>
<SELECT name="q2">
  <option value="Male">Male</option>
  <option selected value="Female">Female</option>
  <option value="Non-binary">Non-binary</option>
  <option value="No answer">Prefer not to answer</option>
</SELECT>
</TD></TR>
<TR><TD colspan="2">&nbsp;</TD></TR>
<TR><TD>Is English your primary language</TD>
<TD>
<SELECT name="q3" id="cars">
<option selected value="Yes">Yes</option>
<option value="No">No</option>
<option value="No answer">Prefer not to answer</option>
</SELECT>
</TD></TR>
<TR><TD colspan="2">&nbsp;</TD></TR>
<TR><TD>(Optional) comments</TD>
<TD>
<TEXTAREA name="q4" rows="4" cols="40">Optional</TEXTAREA>
<!--<INPUT type="text" name="q4" value="optional" size="100"/></TD></TR>-->
</TABLE>
<BR><BR>
	    <A href="javascript:check_and_submit();"><IMG src="Next.jpg" height=40/></A>
</CENTER>
  </FORM>
  </P>
</BODY>
</HTML>
