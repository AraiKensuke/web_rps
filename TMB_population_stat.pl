#!/usr/bin/perl

#  RUN THIS periodically to update the population statistics of game performance

$strt_yr   = 2021;
$strt_mn   = 6;
$strt_dy   = 19;

$end_yr   = 2021;
$end_mn   = 6;
$end_dy   = 22;

if ( $#ARGV >=  0)
{
    $game_12  = $ARGV[0];
    if (($game_12 != 1) && ($game_12 != 2))
    {
	die "TMB_population_stat.pl <1 or 2>\n";
    }
}
else
{
    die "TMB_population_stat.pl <1 or 2>\n";
}
$nGames = 40;

##  
sub return_cnstr_and_netwins
{
    open(FILE, "<", $_[0]);
    $line = <FILE>;
    $line = <FILE>;
    $line = <FILE>;
    $line = <FILE>;
    $cnstr= <FILE>;    # constructor
    chop($cnstr);    
    $hum  = <FILE>;    # constructor
    chop($hum);
    chop($hum);    
    $mach = <FILE>;    # constructor
    chop($mach);
    chop($mach);    
    my @netwin = (0);
    for( $g = 0; $g < $nGames; $g++ )
    {
	$h = substr($hum,  2*$g, 1);
	$a = substr($mach, 2*$g, 1);
	if ( (($h eq "R") && ($a eq "S")) ||
	     (($h eq "S") && ($a eq "P")) ||
	     (($h eq "P") && ($a eq "R")) )
	{
	    $netwin[$#netwin+1] = $netwin[$#netwin] + 1;
	}
	elsif ( (($h eq "R") && ($a eq "P")) ||
		(($h eq "P") && ($a eq "S")) ||
		(($h eq "S") && ($a eq "R")) )
	{
	    $netwin[$#netwin+1] = $netwin[$#netwin] - 1;
	}
	else { $netwin[$#netwin+1] = $netwin[$#netwin]; }

    }

    close(FILE);

    return ($cnstr, \@netwin);
}

if ($game_12 == 1)
{
    @cnstrcts = ("WTL(__moRSP__, [0.05, 0.7, 0.25], [1/3, 1/3, 1/3], [1/3, 1/3, 1/3], false);",
		 "Mimic(__moRSP__, 0, 0.2);",
		 "FixedSequence(__moRSP__, [1, 1, 2, 1, 3, 1, 1, 1, 1, 3, 2, 1, 2, 1, 1, 3, 2, 1, 1, 3, 1, 1, 2, 1, 1, 3, 1, 2, 1, 1, 2, 1, 1, 3, 3, 1, 1, 1, 1, 1]);",
		 "FixedSequence(__moRSP__, [3, 1, 2, 3, 2, 1, 2, 3, 3, 1, 1, 1, 2, 1, 3, 3, 2, 1, 2, 3, 3, 1, 2, 1, 2, 1, 3, 2, 2, 3, 2, 1, 3, 3, 2, 2, 3, 1, 3, 1]);");
}
else
{
    @cnstrcts = ("WTL(__moRSP__, [0.1, 0.45, 0.45], [0.1, 0.45, 0.45], [0.65, 0.25, 0.1], false);",
		 "Mimic(__moRSP__, 2, 0.2);",
		 "FixedSequence(__moRSP__, [1, 1, 1, 3, 2, 1, 2, 2, 1, 1, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 3, 1, 2, 1, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 1]);",
		 "FixedSequence(__moRSP__, [3, 1, 2, 3, 2, 1, 2, 3, 3, 1, 1, 1, 2, 2, 3, 3, 1, 1, 2, 3, 3, 1, 2, 3, 2, 1, 1, 2, 2, 3, 2, 1, 3, 3, 2, 2, 3, 1, 3, 1]);");
}
	     
@months      = ("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12");
@days        = ("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31");

@ruleX_net_wins = ();

$nRules = 4;
for ($r = 0; $r < $nRules; $r++ )
{
    $ruleX_net_wins[$r] = ();
}


#open(FILE, "<", "hey");
#$line = <FILE>;
#print($line);
#print($months[0] . "\n");
#close(FILE);

@these_dates     =  ();
for( $yr = $strt_yr; $yr <= $end_yr; $yr++ )
{
    if ($yr > $strt_yr) { $mnth0 = 1;}    # not first year, start from Jan
    else { $mnth0 = $strt_mn;}  #   }   # start from $strt_mn for first year
    if ($yr < $end_yr) { $mnth1 = 12;}    # 
    else { $mnth1 = $end_mn; }

    for ($mnth = $mnth0; $mnth <= $mnth1; $mnth++ )
    {
	if ($mnth > $mnth0) { $day0 = 1;}    # not first year, start from Jan
	else { $day0 = $strt_dy;}  #   }   # start from $strt_mn for first year
	if ($mnth < $mnth1) { $day1 = 31;}    # 
	else {
	    #  we don't want this stopping at 12/09 if not last of the years
	    if ( ($mnth1 == 12) && ($yr < $end_yr) )  {$day1 = 31; }
	    else {$day1 = $end_dy; }
	}

	for ($dy = $day0; $dy <= $day1; $dy++ )
	{
	    $these_dates[$#these_dates+1] = $yr . $months[$mnth-1] . $days[$dy-1];
	}
    }
}

###  read folder for each day
$records = 0;
for ($i = 0; $i <= $#these_dates; $i++ )
{
    $skip = 0;
    $date = "/Users/arai/Sites/taisen/DATA/TMB1/" . $these_dates[$i];
    
    opendir(DIR, $date) || ($skip = 1);

    if (!$skip)
    {
	@partdirs = readdir(DIR);	
	for ($pd = 0; $pd <= $#partdirs; $pd++ )
	{
	    $nExists = 0;
	    for ($e = 1; $e <= $#cnstrcts+1; $e++ )
	    {
		$fn = $date . "/" . $partdirs[$pd] . "/" . $game_12 . "/block" . $e . "_AI.dat";
		if (-e $fn)
		{
		    $nExists += 1;
		}
	    }

	    if ( $nExists == $#cnstrcts+1 )
	    {   #  this participant has done all blocks (complete)
		for ($e = 1; $e <= $#cnstrcts + 1; $e++ )
		{   #  open each data file from participant
		    $fn = $date . "/" . $partdirs[$pd] . "/" . $game_12 . "/block" . $e . "_AI.dat";		    
		    ($cstr, $ref_netwins) = return_cnstr_and_netwins($fn);
		    
		    my @netw = @$ref_netwins;
		    #print($netw[39] . "\n");

		    $found = 0;
		    for ( $c = 0; $c <= $#cnstrcts; $c++ )
		    {   #  look at constructor, find its index
			if ($cstr eq $cnstrcts[$c])
			{
			    #print("c=" . $c . "    records=" . $records . "\n");
			    $found += 1;
			    $ruleX_net_wins[$c][$records]  = \@netw;
			    #print($ruleX_net_wins[$c][$records][0] . "-----\n");
			}
		    }
		    if ($found != 1)
		    {
			print("found = " . $found . "\n")
		    }
		}
		$records++;		
	    }
	}

	closedir(DIR);
    }
}


#var pctls_05 = {};
#var pctls_95 = {};
# pctls_05["WTL"]   = [0.1, 0.3, 0.2, 0.1, 0.5, 0.5];
# pctls_05["Mimic"] = [-0.1, -0.2, -0.3, 0.1, 0.9, 0.6];
# pctls_95["WTL"]   = [4.4, 4.4, 4.3, 4.3, 4.2, 4.1];
# pctls_95["Mimic"] = [3.3, 3.4, 3.5, 3.4, 3.2, 3.3];


#print($ruleX_net_wins[$c][$r][$n]);
#print($ruleX_net_wins[0][0][10] . "  " . $ruleX_net_wins[0][1][10] . "  " . $ruleX_net_wins[0][2][10] . "  " . $ruleX_net_wins[0][3][10] . "\n");
$outfn = "pctl" . $game_12 . ".js";
open(JSOUT, ">", $outfn);
#print JSOUT "var pctls_05 = {};\n";
#print JSOUT "var pctls_95 = {};\n\n\n";
for ($c = 0; $c <= $#cnstrcts; $c++ )
{
    @all_data_at_n = ();
    $pctl_05       = "";
    $pctl_95       = "";
    $i05           = int(($records-1)*0.05);
    $i95           = int(($records-1)*0.95);
    
    for ($n = 0; $n < $nGames; $n++ )
    {
	for ($r = 0; $r < $records; $r++ )
	{
	    $all_data_at_n[$r] =  $ruleX_net_wins[$c][$r][$n];
	}
	my @srtd = sort {$a <=> $b} @all_data_at_n;
	#print($all_data_at_n[3] . "\n");
	#print($srtd[0] . " " . $srtd[1] . " " . $srtd[2] . " " . $srtd[3] . "\n");
	#print($all_data_at_n[0] . " " . $all_data_at_n[1] . " " . $all_data_at_n[2] . "\n");
	$pctl_05 .= $srtd[$i05] . ", ";
	$pctl_95 .= $srtd[$i95] . ", ";
    }
    
    chop($pctl_05);
    chop($pctl_05);    
    chop($pctl_95);
    chop($pctl_95);    

    print JSOUT "pctls_05[\"" . $cnstrcts[$c] . "\"] = [" . $pctl_05 . "];\n";
    print JSOUT "pctls_95[\"" . $cnstrcts[$c] . "\"] = [" . $pctl_95 . "];\n\n";
}
close(JSOUT);

print("OUTPUTed " . $outfn . "\n");
