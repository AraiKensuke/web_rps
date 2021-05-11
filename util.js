function getRandomInt(min, max) {
    //  inclusive min and max.
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function to_str_from_2darray(arr2d)
{   //   [[0, 1, 2], [3, 4, 5], [6,7,8]]  -->  "0,1,2:3,4,5:6,7,8"
    retstr = "";
    for (i = 0; i < arr2d.length-1; i++ )
    {
	retstr += arr2d[i].toString() + ":";
    }
    retstr += arr2d[i].toString();
    return retstr;
}

function to_2darray_from_str(strrep)
{   //   "0,1,2:3,4,5:6,7,8"  -->  [[0, 1, 2], [3, 4, 5], [6,7,8]]
    arr1d_of_strings = strrep.split(":");

    arr = [];
    for (i = 0; i < arr1d_of_strings.length; i++ )
    {
	str_record = arr1d_of_strings[i].split(",");
	record = []
	for (j = 0; j < str_record.length; j++ )
	{
	    record[j] = parseInt(str_record[j]);
	}
	arr[i] = record
    }
    return arr;
}

function to_1darray_from_str(strrep)
{   //   "0,1,2:3,4,5:6,7,8"  -->  [[0, 1, 2], [3, 4, 5], [6,7,8]]
    arr1d_of_strings = strrep.split(" ");

    arr = [];
    for (i = 0; i < arr1d_of_strings.length; i++ )
    {
	arr[i] = parseInt(arr1d_of_strings[i]);
    }
    return arr;
}

function getcolumn(arr, col, add_series_x_axis)
{
    column_arr = []
    for (i = 0; i < arr.length; i++ )
    {
	if (add_series_x_axis)
	{
	    column_arr[i] = [i, arr[i][col]];
	}
	else
	{
	    column_arr[i] = arr[i][col];
	}
    }
    return column_arr;
}

function append_to_array(to_this_list, item)
{
    to_this_list[to_this_list.length] = item;
}
