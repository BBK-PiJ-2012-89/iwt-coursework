<script type="text/javascript">
	
	function loadXML(url) {//loading the provided xml document
		
	  if(window.XMLHttpRequest)//if firefox
	  	{
		xhr=new XMLHttpRequest();
		xhr.open("GET",url,false);
	  	xhr.send("");
	 	 return xhr.responseXML;
		} else {// if internet explorer
		xhr=new ActiveXObject("Microsoft.XMLDOM");
		xhr.async=false;
		xhr.load(url);
		return(xhr);
		}
	}
	
	function getThirdLevel(){//retrieving the third level elements from the supplied xml documents
		
		var getTheFile = document.getElementById("thirdFile").value;	
		var xmlDoc = loadXML(getTheFile);
		var root = xmlDoc.documentElement;
		
		if(window.ActiveXObject){//Internet Explorer
			var thirdLevel = root.childNodes[0].childNodes;
			var div = document.getElementById("elementArea");
			var elStuff = "<ul>";
			for(var i = 0; i < thirdLevel.length; i++){//picking out element tag names & forming unordered list
				elStuff += "<li>" + thirdLevel[i].nodeName + "</li>";
			}
			elStuff += "</ul>";
		} else if(document.implementation && document.implementation.createDocument){//firefox
			var thirdLevel = root.childNodes[1].childNodes;
			var div = document.getElementById("elementArea");
			var elStuff = "<ul>";
			for(var i = 1; i < thirdLevel.length; i = i+2){//picking out element tag names & forming unordered list
				elStuff += "<li>" + thirdLevel[i].nodeName + "</li>";
			}
			elStuff += "</ul>";
		}
		div.removeChild(div.firstChild);
		div.innerHTML+= elStuff;//displaying the selected elemnet
		return null;
	}
	
	function showXML(){

		//get and load xml and xsl files
		var getTheFile = document.getElementById("thirdFile").value;		
		var xmlDoc = loadXML(getTheFile);	
		var stylesheet = loadXML("exercise1.xsl");
		
		//retrieving desired output table data from user	
		var predicate = document.getElementById("predicate").value;
		var sorter = document.getElementById("sortBy").value;
		var orderer = document.getElementById("orderBy").value;
		
		//checking user selected from dropdown, otherwise sets default values
		if(orderer == "" || orderer == null){
			orderer == "ascending";
		}
		if(sorter == "" || sorter == null){
			sorter == "year";
		}
		
		//setting default variable values
		var columns = "*";
		var defaultHeader = "*[1]/";
		var standInHeader = "*[1]/";
		var defaultPredicate = "*";
		
		//retrieving user selected columns
		var columnOrder = document.getElementById('columnOrder').value;
		
		//breaking column selection string into individual column titles for predicate composition
		if(columnOrder!= null && columnOrder!= ""){
			var columnOrderer = columnOrder.split(" ");
			columns = ""
			for(var i = 0; i < columnOrderer.length; i++){
				columns+=columnOrderer[i];
				defaultHeader+=columnOrderer[i];
				if(i!=columnOrderer.length-1){
					columns+=" | ";
					defaultHeader+= " | " + standInHeader;
				}
			}
		}
		
		//setting node basis for predicate reordering
		var columnNumber = stylesheet.getElementsByTagName("tr");
		var columnHeader = stylesheet.getElementsByTagName("xsl:for-each");
		var table = stylesheet.getElementsByTagName("table");
		
		//concatenate xpath predicate
		if(predicate !="" && predicate !=null){
			defaultPredicate += "[" + predicate + "]";
		} 
		
		if(window.ActiveXObject){//if using Windows
		 
			//applying predicate specification
			if(defaultPredicate !="*"){
				var selector = table[0].childNodes;
				selector[1].setAttribute("select", defaultPredicate);
			}
			
			//selecting the columns as specified
		  if(columns != "*"){
			  var columnFormer = columnNumber[0].childNodes;
			  columnFormer[0].setAttribute("select", columns);
		  }
		  
		  	//selecting the column headers as appropriate
		  if(defaultHeader!="*[1]/"){  	
				var headVariables = stylesheet.getElementsByTagName("thead");
				var tablaHeader = headVariables[0].childNodes;//
				tablaHeader[0].setAttribute("select", defaultHeader);
			}
			
			 //applying the selected sort column and order format
			var getSorted = stylesheet.getElementsByTagName("xsl:sort")[0];
			if(sorter!= ""){   
				getSorted.setAttribute("select", sorter);
			} 
			if(orderer!= ""){  
				getSorted.setAttribute("order", orderer);
			}
			
			//constructing & displaying the output document
			var outputDocument = xmlDoc.transformNode(stylesheet);
			document.getElementById("tableArea").innerHTML=outputDocument;  
			
		} else if (document.implementation && document.implementation.createDocument){//Checks if Firefox
		
			//removing namespaces
  			var nsResolver = stylesheet.createNSResolver(
                   stylesheet.ownerDocument == null ?
                   stylesheet.documentElement :
                   stylesheet.ownerDocument.documentElement);
				   
				   //evaluating stylesheet
 		 	var value = stylesheet.evaluate(
                   "//xsl:sort",
                   stylesheet, nsResolver,
                   XPathResult.ANY_UNORDERED_NODE_TYPE, null);
				   
				   //applying the selected sort column and order format
				if(sorter!= ""){   
			value.singleNodeValue.setAttribute("select", sorter);
				} 
				if(orderer!= ""){  
			value.singleNodeValue.setAttribute("order", orderer);
				}
				
			//applying predicate specification
			if(defaultPredicate !="*"){
				var selector = table[0].childNodes;
				selector[3].setAttribute("select", defaultPredicate);
			}
			
			//selecting the column headers as appropriate
			if(defaultHeader!="*[1]/"){
				var tablaHeader = columnHeader[0];
				tablaHeader.setAttribute("select", defaultHeader);
			}
			
			//selecting the columns as specified
		  var columnFormer = columnNumber[0].firstElementChild;
		  if(columns != "*"){
			  columnFormer.setAttribute("select", columns);
		  }
			  //building the stylesheet processor
		  var proc = new XSLTProcessor();
		  proc.importStylesheet(stylesheet);
		  
		  //constructing & displaying the output document
		  var resultFragment = proc.transformToFragment(xmlDoc, document);
		  document.getElementById("tableArea").removeChild(document.getElementById("tableArea").firstChild);//deletes old table and replaces it with new table
		  document.getElementById("tableArea").appendChild(resultFragment);	
		  
		 }
	return false;
	}
		
</script>
