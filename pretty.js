function prettyArray2D(arr){
    var sOut = "[";

    for( var i = 0; i < arr.length; i++ )
    {
	if( i > 0 ) { sOut += " [";}
	else	 { sOut += "[";}
	for( var j = 0; j < arr[i].length; j++ )
	{
	    sOut += String(arr[i][j]);
	    if( j < arr[i].length - 1 )
	    {
		sOut += " ";
	    }
	}
	sOut += "]";	    
    }
    return sOut+"]";
}

function prettyArray3D(arr){
    var sOut = "[";

    for( var i = 0; i < arr.length; i++ )
    {
	if( i > 0 ) { sOut += " [";}
	else	 { sOut += "[";}
	
	for( var j = 0; j < arr[i].length; j++ )
	{
	    if( j > 0 ) { sOut += "  [";}
	    else	 { sOut += "[";}
	    for( var k = 0; k < arr[i][j].length; k++ )
	    {
		sOut += String(arr[i][j][k]);
		if( k < arr[i][j].length - 1 )
		{
		    sOut += " ";
		}
	    }
	    sOut += "]";	    	    
	}
	if( i < arr[i].length - 1 )
	{
	    sOut += "]\n";
	}
	else
	{
	    sOut += "]";	    
	}
    }
    return sOut+"]";
}
