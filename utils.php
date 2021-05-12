<?php
function getVal($key, $default)
{
    if (isset($_POST[$key])) {
        return $_POST[$key];
    } 
    else 
    {
        echo "no value for:  $key";	
        return $default;
    }
}


function check_partID($exptname, $partID_passed)
{
    $pcs = explode("_", $partID_passed);
    $ydm = $pcs[0];

    //  check to see if 
    $day_folder = "../DATA/" . $exptname . "/" . $ydm;
    if (is_dir($day_folder))
    {
        $part_folder = $day_folder . "/" . $partID_passed;
        if (is_dir($part_folder))
        {
            $visitnum = 1;
            while (is_dir($part_folder . "/" . $visitnum))
            {
                $visitnum += 1;
            }
            return array(0 => true, 1 => ($visitnum-1));
        }
    }
    return array(0 => false, 1 => 0);
}

function mkoutdir($exptname, $partID_passed, $visit)
{
    $pcs = explode("_", $partID_passed);
    $ydm = $pcs[0];

    //  check to see if 
    $day_folder = "../DATA/" . $exptname . "/" . $ydm;
    if (!is_dir($day_folder))
    {
        mkdir($day_folder);
    }
    $part_folder = $day_folder . "/" . $partID_passed;
    if (!is_dir($part_folder))
    {
        mkdir($part_folder);
    }
    if ($visit != 0)
    {
        $visit_folder = $part_folder . "/" . $visit;
        mkdir($visit_folder);
        return $visit_folder;
    }
    else
    {
        return $part_folder;
    }
}


function generate_partID()
{
    date_default_timezone_set('US/Eastern');
    $ip_add = $_SERVER["REMOTE_ADDR"];
    $agent  = $_SERVER["HTTP_USER_AGENT"];
    
    $pcs = explode(".", $ip_add);
    $n1  = intval($pcs[0]);
    $n2  = intval($pcs[1]);
    $n3  = intval($pcs[2]);
    $n4  = intval($pcs[3]);
    // $in1  = 255-$n1;
    // $in2  = 255-$n2;
    // $in3  = 255-$n3;
    // $in4  = 255-$n4;
    
    $sum_IP  = intval($n1) + intval($n2) + intval($n3) + intval($n4) + 1000;
    //$isum_IP = intval($in1) + intval($in2) + intval($in3) + intval($in4) + 2000;
    
    //  0-padded in front to make 4 digit number
    $number = 9;
    $length = 4;   
    $string = substr(str_repeat(0, $length).$number, - $length);
    
    $Ymd = date("Ymd_Hi-s");
    $partID  = $Ymd . "_" . strval($sum_IP) . "." . strval(rand(1000, 9999));

    //strval($sum_IP) . "." . strval($isum_IP) . "." . strval($mod_IP) . "." . strval($imod_IP);

    return $partID;
}
?>
