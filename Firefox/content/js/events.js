/*
|===============================================================================
|		Last Modified Date 	: 28/08/2014
|		Developer			: Shashidhar and alwyn
|===============================================================================
|	   	File Name		: events.js
|			Description	:
|						Script for actual processing of the addon.
|						This page have the code to send request and display the result.
|
|===============================================================================
*/

var pdfVar;
//Function to append zero
function get23D(n, s){
	if(s){
	     if( n.toString().length == 1 )
    	    return "00" + n;
		 else if(n.toString().length == 2)
			return "0" + n;
    }	
	else
	{
		if( n.toString().length == 1 )
    	    return "0" + n;
	}
	return n.toString();
}

//Resize window depending of contenet size.
function resizeOnChange(){
	var height = document.getElementById("resultId").clientHeight;
	var width = document.getElementById("resultId").clientWidth;
	window.resizeTo(width, height);
}

//Generate usn list for Advanced search
function usnGeneration(){
	var usnNew = "";
	var usnList=[];
	var f;

	//------------------------------------ Validation Starts here----------------------------------------------

	//Fields to compare if not seleted usn fields
	var fields=["Region", "CC", "YY", "Branch"];
	for(f=0; f<4; f++)
	{
		if(f==2){
			if(document.getElementById('r'+f).value == ""){
				document.getElementById("resultId").textContent="Please select Year ..";
				resizeOnChange();
				return;
			}		
		}
		else if(document.getElementById('r'+f).label == fields[f]){
			document.getElementById("resultId").textContent="Please enter USN ..";
			resizeOnChange();
			return;
		}
	}
	
	//Check the size of input value. Two numbers.
	var unum =	document.getElementById('r5').value.length;
	var unum2 =	document.getElementById('r5').value.length;
	if(unum2 > unum)//Find largest.
		unum=unum2;

	//Save limits in 2 variables
	var maxLimit = Number(document.getElementById('r5').value);
	var minLimit = Number(document.getElementById('r4').value);
	
	//Check limits
	if(maxLimit < minLimit){
		document.getElementById("resultId").textContent="First number must be smaller than second.";
		resizeOnChange();
		return;
	}

	//Check whether MTECH usn or BE
	var beTech = Number(document.getElementById('r3').label.length);
	if(beTech==3 && unum==3){
		document.getElementById("resultId").textContent="For mtech enter 2 digit number.";
		resizeOnChange();
		return;
	}
	else
		document.getElementById("resultId").textContent="";

	//---------------------------------------Validation Ends here --------------------------------
	//--------------------------------------------------------------------------------------------
	
	//Get all selected fields. 4 + SN + 13 + CS..
	for(f=0; f<4; f++){
		if(f==2)
			usnNew += document.getElementById('r'+f).value;
		else
			usnNew += document.getElementById('r'+f).label;
	}
	
	//Generate USNs
	for(var i=minLimit; i<=maxLimit; i++){
		if(beTech==2){		
			usnList.push(usnNew+get23D(i, 1));
		}	
		else{
			usnList.push(usnNew+get23D(i, 0));
		}
	}
	
	//Call search with usn_list
	advancedSearch(usnList);
}

function checkEnterKey(evt){
	  if (evt.keyCode == 13)
	    usnGeneration();
	  else 
		return true;
}

function addYear(){
	var desc = document.getElementById("d");	
	var menul = document.createElement("textbox");
	menul.setAttribute("value", "");
	menul.setAttribute("id", "year");
	menul.setAttribute("maxlength", "2");
	menul.setAttribute("size", "2");
	menul.setAttribute("placeholder","YY");
	desc.appendChild(menul);

	menul = document.createElement("menulist");
	menul.setAttribute("class", "advSearch2");
	menul.setAttribute("id", "branch");	
	var menupp = document.createElement("menupopup");
	menul.appendChild(menupp);
	for(var r=0; r<fields['Branch']['BE'].length; r++)
	{
		var menui = document.createElement("menuitem");
		menui.setAttribute("label", fields['Branch']['BE'][r]);	
		menupp.appendChild(menui);
	}
	for(var r=0; r<fields['Branch']['MTECH'].length; r++)
	{
		var menui = document.createElement("menuitem");
		menui.setAttribute("label", fields['Branch']['MTECH'][r]);	
		menupp.appendChild(menui);
	}
	desc.appendChild(menul);
}

function addCC(val){
	var desc = document.getElementById("d");
	var menul = document.getElementById("r1");
	var ccc = menul;
	var menupp = document.getElementById("mpp1");	
	//alert(val);
	if(menul != null){
		menul.removeChild(menupp);
	}
	//Here
	if(menul==null)
		menul = document.createElement("menulist");

	var menupp = document.createElement("menupopup");
	menupp.setAttribute("id", "mpp1");	

	menul.setAttribute("class", "advSearch2");
	menul.setAttribute("id", "r1");	
	menul.appendChild(menupp);
	for(var r=0; r<fields['College Code'][Number(val)].length; r++)
	{
		var menui = document.createElement("menuitem");
		menui.setAttribute("label", fields['College Code'][Number(val)][r]);	
		menupp.appendChild(menui);
	}	

	if(ccc == null){
		menul.setAttribute("oncommand", "return addYear()");
		desc.appendChild(menul);
	}
}

//Create ui for Advanced search
function createAdvanceUI(){

	document.getElementById("advance").textContent="";
	document.getElementById("resultId").textContent="";

	var advUI = document.getElementById("advance");
	var desc = document.createElement("description");
	desc.setAttribute("id", "d");

	var menul;
	
	menul = document.createElement("menulist");
	menul.setAttribute("class", "advSearch2");
	menul.setAttribute("id", "r0");	

	var menupp = document.createElement("menupopup");
	menul.appendChild(menupp);
	
	for(var r=0; r<fields['Region'].length; r++)
	{
		var menui = document.createElement("menuitem");
		menui.setAttribute("label", fields['Region'][r]);	
		menupp.appendChild(menui);
	}
	menul.setAttribute("oncommand", "return addCC(this.label)");
	desc.appendChild(menul);

	/*var nums = document.createElement("label");
	nums.setAttribute("value", "to");
	desc.appendChild(nums);

	nums = document.createElement("textbox");
	nums.setAttribute("value", "");
	nums.setAttribute("id", "r"+5);
	nums.setAttribute("maxlength", "3");
	nums.setAttribute("size", "2");
	nums.setAttribute("placeholder","Eg: 30");
	nums.setAttribute("onkeypress", "return checkEnterKey(event)");
	desc.appendChild(nums);

	var submitButton = document.createElement("button");
	submitButton.setAttribute("label", "Load");
	submitButton.setAttribute("class", "loadButton");
	submitButton.setAttribute("onclick", "usnGeneration()");
	desc.appendChild(submitButton);*/
	advUI.appendChild(desc);
}

function displayAdvUI(){
	//	alert("hi");
	if(document.getElementById("advance").hidden){
		document.getElementById("normal").hidden=true;	
		document.getElementById("advance").hidden=false;	
		document.getElementById("msg").hidden=false;
		document.getElementById("advSearch").label="Switch to Normal Search";		
		document.getElementById("reval").hidden=true;//Show revaluation option
		createAdvanceUI();
		document.getElementById("resultId").textContent="";		
	}
	else{
		document.getElementById("reval").hidden=false; //Hide revaluation option
		document.getElementById("normal").hidden=false;	
		document.getElementById("advance").hidden=true;
		document.getElementById("msg").hidden=true;
		document.getElementById("advSearch").label="Switch to Advanced Search";
		document.getElementById("resultId").textContent="";
	}
	resizeOnChange();
}

// Input: DDXXDDBBDDD
// Returns: BB ( Branch )
function getBranch(usn){
	var b = usn.split( /\d+/ );
	return b[2].toUpperCase();
}

// Input: Capital letter sentance
// Returns: Same sentance with starting letter of each word uppercase
function ucwords(str){
	return str.replace(/\w\S*/g, function(txt){
  	return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// Input: String of format "Nameofstudent (DAADDAADDD)"
// Returns : Name and USN Separately "NameOfStudent  DAADDAADDD".
function getNameUsn(usnName){
	var name = usnName.substring(0, usnName.indexOf('('));
  	var aftBractket = usnName.substr(usnName.indexOf("(") + 1);
	var usn = aftBractket.substring(0, aftBractket.indexOf(')'));
  	return ucwords(name+'  '+usn);
}

//Return avg marks
function findAvg(usn, total, sem){
	//return ' '+total+' '+sem+' '+getBranch();
	//alert(usn);
	return getAvgMarks(total, sem, getBranch(usn));
}

// Input: String of format "SubjectName (SUBJECTCODE)"
// Returns : SUBJECTCODE
function getScode(sub_name_code){
	return  sub_name_code.substring(sub_name_code.indexOf('(')+1, sub_name_code.indexOf(')'));
}

/*function printToPdf(){
	var str = pdfVar;
	//alert("hello");
	var table = $(str).find('table');
	var table_count = table.length;
	var data = [], fontSize = 12, height = 20, doc, initX=60, initY=60, usn;
	var colWidth = [0,0,0,0,0,0,0,0];

	doc = new jsPDF('p', 'pt', 'a4', true);
	doc.setFont("times", "normal");
	doc.setFontSize(fontSize);
//	alert();
	for(var i=0; i<table_count; i++){
		data = doc.tableToJson($(table).eq(i));
		//alert(data.value);
		var strJson = JSON.stringify(data);
		var resData = JSON.parse(strJson);
		if(i==0){
			var usnName=resData[0].name;
			var name = usnName.substring(0, usnName.indexOf('('));
			var aftBractket = usnName.substr(usnName.indexOf("(") + 1);
			usn = aftBractket.substring(0, aftBractket.indexOf(')'));
			//doc.setFontStyle("bold");
			doc.text(initX+0, initY, "Name:  "+name);
			initY+=height;
			doc.text(initX+0, initY, "Usn:   "+usn);
			initY+=height;
			doc.text(initX+0, initY, "Total: "+resData[0].total);
			initY+=height;
		}
		else{
			//alert(data);
		  	if(i>=3 && (i%2 != 0))
		  		initY+=20;
			for (var k = 0; k < colWidth.length; k++) colWidth[k] = 0;
			var k=0;
			$.each(data, function (ii, row){
				k=0;
				$.each(row, function (jj, cell){
					if(colWidth[k]<cell.length){
						colWidth[k++]=cell.length;
					}
					else
						k++;
				})
			})
			doc.cellInitialize();
			
			$.each(data, function (ii, row){
				k=0;
				$.each(row, function (jj, cell){
					doc.cell(initX, initY, 5*colWidth[k++]+20, 20, cell, ii);
				})
			})
			initY+=height*resData.length+10;
		}
	}
	doc.save(usn+'.pdf');
}*/

//To focus the text box in addon
window.addEventListener("load", function focus_element(){
	window.removeEventListener("load", focus_element, false);
	document.getElementById('usn_id').focus()
}, false);




//Validate the input(usn)
function checkFormat(str){
	if(str.match(/^([0-9][A-Za-z][A-Za-z][0-9][0-9][A-Za-z][A-Za-z][0-9][0-9][0-9])$/g)){
		return true;
	}
	else if(str.match(/^([0-9][A-Za-z][A-Za-z][0-9][0-9][A-Za-z][A-Za-z][A-Za-z][0-9][0-9])$/g)){
		return true;
	}
	else{
		return false;
	}
}

// Function to do all the processing. Resquest and Display result.
function openResult(usn){
	
	//Color codes
	var passColor='#087F38', failColor='#E30F17' ;
	var marksRow ='#F0FFF0', tableHead='#90B890', failedSub='#FFCCCC';
	if(usn.length==0){
		document.getElementById('resultId').textContent = "Please Enter Your USN...";
		document.getElementById('resultId').setAttribute("style", "color:red");
		document.getElementById('usn_id').setAttribute("style", "border:1px solid red");
		resizeOnChange();
		return;
	}
	else if(!checkFormat(usn)){
		document.getElementById('resultId').textContent = "Check USN format...";
		document.getElementById('resultId').setAttribute("style", "color:red");
		document.getElementById('usn_id').setAttribute("style", "border:1px solid red");
		resizeOnChange();
		return;
	}
	document.getElementById('resultId').setAttribute("style","");
	document.getElementById('usn_id').setAttribute("style", "border:1px solid blue");

	document.getElementById('resultId').textContent = '';
	var place= document.getElementById("resultId");
	var phbox = document.createElement("hbox");
	var pbar = document.createElement("progressmeter");
	pbar.setAttribute("mode", "undetermined");
 	phbox.appendChild(pbar);
	place.appendChild(phbox);

	resizeOnChange();

	  let url, rv=0;
	  var rg = document.getElementById("reval");
	  if(rg.checked){
			rv=1;
		url = "http://results.vtu.ac.in/vitavireval.php";
	  }
	  else{
			url = "http://results.vtu.ac.in/vitavi.php";
	  }

	let request = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Components.interfaces.nsIXMLHttpRequest);
	request.onload = function(aEvent)
	{
		//Call to DOM function.. To convert string to HTMLDocument object.
		var str = DOM(aEvent.target.responseText);
		var all = $(str).find('td[width=513]').eq(0);
		//alert(all);
		var table = $(all).find('table');
		
		//return str;
		//alert(aEvent.target.responseText);
		//These lines tetch the table fields fron HTMLDocument object.
		document.getElementById('resultId').textContent = '';

		var aBox = document.getElementById("resultId");
		var vbox = document.createElement("vbox");
		vbox.setAttribute("pack", "center");
		vbox.setAttribute("style", "border: #000000 solid 2px;");
		aBox.appendChild(vbox);

		var grid = document.createElement("grid");
		grid.setAttribute("flex", "1");

		var rows = document.createElement("rows");

		var row1 = document.createElement("row");
		var row2 = document.createElement("row");
		var row3 = document.createElement("row");

		var name1 = document.createElement("label");
		var sem1 = document.createElement("label");
		var status1 = document.createElement("label");
		var totalt = document.createElement("label");

		var all = $(str).find('td[width=513]').eq(0);
		var table = $(all).find('table');

		if(($(table).eq(0).find("tr").eq(0).find('td').eq(3).text()).indexOf("FAIL") == -1){
			//if(adv==1)	return 1;
			grid.setAttribute("style", "background-color:"+passColor);		
		}
		else{
			//if(adv==1)	return 0;
			grid.setAttribute("style", "background-color:"+failColor);
		}

		pdfVar='<!DOCTYPE html><html><body><table><tr><td>name</td><td>total</td></tr>';

		if(table.length==0){
			document.getElementById('resultId').textContent = 'Results are not yet available for this university seat number or Wrong USN..';
			resizeOnChange();
		}
		else
		{
			name1.setAttribute('value', "Name: "+getNameUsn($(all).find('B').eq(0).text()));
			name1.setAttribute("style", "font-weight:bold;");

			pdfVar+='<tr><td>'+$(all).find('B').eq(0).text()+'</td>';

			var s=0;
			if(rv==0){
				s=getTotal(table);
			}else{
				for (var i = 3; i < table.length; i++){
				 	//	alert($(table).eq(j).html());
					var tr = $(table).eq(i).find("tr");
					for (var j = 0; j < tr.length; j++){
						var td = $(tr).eq(j).find('td');
						s += Number($(td).eq(4).text());
					}
				}
			}
			totalt.setAttribute('value', "Total: "+s);
		}

    	pdfVar+='<td>'+s+'</td></tr></table><table><tr><td>Subject</td><td>External</td><td>Internal</td><td>Total</td><td>Result</td></tr><tr><td>Semester</td><td>';

		totalt.setAttribute("style", "font-weight:bold");
		status1.setAttribute('value', ""+$(table).eq(0).find("tr").eq(0).find('td').eq(3).text());
		status1.setAttribute("style", "font-weight:bold");
		var semPerc = "Semester:  "+$(table).eq(0).find("tr").eq(0).find('td').eq(1).text();

		//pdfVar+=$(table).eq(0).find("tr").eq(0).find('td').eq(1).text()+'</td><td>';
		//alert($(table).eq(0).find("tr").eq(0).find('td').eq(1).text());
		//alert(pdfVar);
		pdfVar+=$(table).eq(0).find("tr").eq(0).find('td').eq(1).text()+'</td><td>';
		pdfVar+=$(table).eq(0).find("tr").eq(0).find('td').eq(3).find('b').text()+'</td></tr></table>';

		var perc='', avg;
		if((avg = findAvg(usn, s, $(table).eq(0).find("tr").eq(0).find('td').eq(1).text())) != ''){
			perc = "Percentage: "+avg+"%";
		}
		sem1.setAttribute('value', semPerc+'   '+perc);
		sem1.setAttribute("style", "font-weight:bold");

		vbox.appendChild(grid);
		grid.appendChild(rows);
		rows.appendChild(row1);
		rows.appendChild(row2);
		rows.appendChild(row3);
		row1.appendChild(name1);
		row2.appendChild(sem1);
		row2.appendChild(totalt);
		row2.appendChild(status1);

		var sp = document.createElement("spacer");
		sp.setAttribute("flex", "1");
		vbox.appendChild(sp);
		//alert(table.length);
		var row11, lbl;

		if(rv == 0){
			for (var i=1; i < table.length-1; i++){
				pdfVar+='<table><tr><td>Subject</td><td>External</td><td>Internal</td><td>Total</td><td>Result</td></tr>';
				var grid2 = document.createElement("grid");
				grid2.setAttribute("flex", "1");
				grid2.setAttribute("style", "border: #000000 solid 1px;");
				vbox.appendChild(grid2);

				var rows1 = document.createElement("rows");
				grid2.appendChild(rows1);
				//Store repeated subject codes
				var scodes=[];
				var tr = $(table).eq(i).find("tr");
				for (var j = 0; j < tr.length; j++){

				 	//To avoid repeated subjecs
					if(getScode($(tr).eq(j).find('td').eq(0).text())!=""){
						if(scodes.indexOf(getScode($(tr).eq(j).find('td').eq(0).text()))!=-1){
							continue;
						}
						else{
							scodes.push(getScode($(tr).eq(j).find('td').eq(0).text()));
						}
					}
					//alert(scodes);
					pdfVar+='<tr>';
          			row11 = document.createElement("row");
					if(j==0)
						row11.setAttribute("style", "font-weight:bold; background-color:"+tableHead);
					else
						row11.setAttribute("style", "background-color:"+marksRow);

					var td = $(tr).eq(j).find('td');
					for (var k = 0; k < td.length; k++){
						lbl = document.createElement("label");
						if($(td).eq(k).text() != ""){
							lbl.setAttribute("value", $(td).eq(k).text());
							pdfVar+='<td>'+$(td).eq(k).text()+'</td>';
						}
						row11.appendChild(lbl);
					}
					if(($(td).eq(4).text()).indexOf("F") > -1 || ($(td).eq(4).text()).indexOf("A") > -1)
					{
						row11.setAttribute("style", "background-color:"+failedSub+"; color:red");
					}

					if(($(td).eq(3).text()).indexOf("FAIL") > -1)
						row11.setAttribute("style", "background-color:"+failColor+";");
					else if(($(td).eq(3).text()).indexOf("CLASS") > -1 || ($(td).eq(3).text()).indexOf("PASS") > -1)
						row11.setAttribute("style", "background-color:"+passColor+";");

					rows1.appendChild(row11);
					pdfVar+='</tr>';
				}
				pdfVar+='</table>';
			}
		}else{
			var grid2 = document.createElement("grid");
			grid2.setAttribute("flex", "1");
			grid2.setAttribute("style", "border: #000000 solid 1px;");
			vbox.appendChild(grid2);

			var row11;
			var rows1 = document.createElement("rows");
			var heads = ['Subject', 'Ext Old', 'Ext New', 'Internal', 'Total', 'Result'];
			grid2.appendChild(rows1);

			row11 = document.createElement("row");
			row11.setAttribute("style", "font-weight:bold; background-color:"+tableHead);

			for(i=0; i<heads.length;i++){
				lbl = document.createElement("label");
				lbl.setAttribute("value", heads[i]);
				row11.appendChild(lbl);
			}

			rows1.appendChild(row11);
			//TODO create table head in the above for-loop .. Find why these two lines.
			pdfVar+='<table><tr><td>Subject</td><td>Ext Old</td><td>Ext New</td><td>Internal</td><td>Total</td><td>Result</td></tr>';
			pdfVar+='<tr><td>Subject</td><td>Ext Old</td><td>Ext New</td><td>Internal</td><td>Total</td><td>Result</td></tr>';
			//alert(table.length);
			var prv=0;
			for(var i=3; i < table.length; i++){
				
				row11 = document.createElement("row");
				var tr = $(table).eq(i).find("tr");
				//alert(tr.html());
				//Check if new sem is met
				if($(tr).eq(0).find('td').eq(0).text().indexOf("Subject")!=-1 || $(tr).eq(0).find('td').eq(0).text().indexOf("Old")!=-1 || $(tr).eq(0).find('td').eq(0).text().indexOf("External")!=-1)
				{
					if(prv==0)
					{ 
						pdfVar += "</tr></table><table><tr><td>Subject</td><td>Ext Old</td><td>Ext New</td><td>Internal</td><td>Total</td><td>Result</td></tr><tr>";
					}
				}
				else {
					pdfVar+='<tr>';
					prv=1;
				}

				//Skip unwanted rows. If new sem in revaluation
				if($(tr).eq(0).find('td').eq(0).text().indexOf("Subject")!=-1 || $(tr).eq(0).find('td').eq(0).text().indexOf("Old")!=-1 || $(tr).eq(0).find('td').eq(0).text().indexOf("External")!=-1)
				{ 
					continue;  
				}

				for (var j = 0; j < tr.length; j++){
				//alert($(tr).eq(j).find('td').eq(0).text());
					var semSet=0;
					if($(tr).eq(j).find('td').eq(0).text().indexOf("Semester")!=-1){
						pdfVar += "</table><table><tr><td>Subject</td><td>Ext Old</td><td>Ext New</td><td>Internal</td><td>Total</td><td>Result</td></tr><tr><td>Semester:</td>";semSet=1;
					} 

					var td = $(tr).eq(j).find('td');
					for (var k = 0; k < td.length; k++){
						lbl = document.createElement("label");
						if($(td).eq(k).text() != ""){
							//alert($(td).eq(k).text());
							lbl.setAttribute("value", $(td).eq(k).text());
							pdfVar+='<td>'+$(td).eq(k).text()+'</td>';
						}
						row11.appendChild(lbl);
					}

					//alert(pdfVar);
					if(($(td).eq(5).text()).indexOf("F") > -1 || ($(td).eq(5).text()).indexOf("A") > -1)//Absent and Fail
					{
						row11.setAttribute("style", "background-color:"+failedSub+"; color:red");
					}
					else
						row11.setAttribute("style", "background-color:#F5F7CB;");
			
					if(semSet==1)
					{ // If new sem in revaluation met, then check for fail or pass to set color 
						if(($(td).eq(3).text()).indexOf("FAIL") > -1)
							row11.setAttribute("style", "background-color:"+failColor+";");
						else if(($(td).eq(3).text()).indexOf("CLASS") > -1 || ($(td).eq(3).text()).indexOf("PASS") > -1)
							row11.setAttribute("style", "background-color:"+passColor+";");
						
						pdfVar+="</tr></table><table><tr><td>Subject</td><td>Ext Old</td><td>Ext New</td><td>Internal</td><td>Total</td><td>Result</td></tr><tr><td>Subject</td><td>Ext Old</td><td>Ext New</td><td>Internal</td><td>Total</td><td>Result</td></tr>";}
					else if(prv == 1){pdfVar+='</tr>';}
				}
				rows1.appendChild(row11);
			}
			pdfVar+='</table>';
		}

		pdfVar+='</body></html>';
		//alert(pdfVar);
		pdfVar = DOM(pdfVar);
		resizeOnChange();

	}; //request load end

	request.onerror = function(aEvent) {
	   //window.alert("Error Status: " + aEvent.target.status);
	   document.getElementById('resultId').textContent = "Check Internet connection. Error status : "+ aEvent.target.status;
	};

	request.open("POST", url, true);
	request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	request.send("rid="+usn+"&submit=SUBMIT");
}

window.addEventListener("load", function() {
	const KEY_ENTER = 13;
  	const KEY_ESCAPE = 27;
	var textbox = document.getElementById("usn_id");
	function keyPressed(e) {
	  switch (e.keyCode) {
	    case KEY_ENTER:
					openResult(textbox.value);
				break;
		}
	}
	textbox.addEventListener('keyup', keyPressed, true);
	
	
	//printPdf.addEventListener('click', print, true);

}, false);
