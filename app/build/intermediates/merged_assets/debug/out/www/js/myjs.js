function autoDisplayDateTime(){
     var today = new Date();

    var date=today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear()+" | "+today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    document.getElementById('pdatetime').value=date;
}

function confirmProperty()
{
    if($("#ptype").val()!="" && $("#pbedroom").val()!="" && $("#pdatetime").val()!="" && $("#pprice").val()!="" && $("#paddress").val()!="" && $("#prepname").val()!="" && $("#prepphone").val()!=""){
        var ptype=$("#ptype").val();
        var pbedroom=$("#pbedroom").val();
        var pdatetime=$("#pdatetime").val();
        var pprice=$("#pprice").val();
        var pftype=$("#pftype").val();
        var paddress=$("#paddress").val();
        var pnote=$("#pnote").val();
        var prepname=$("#prepname").val();
        var prepphone=$("#prepphone").val();

        navigator.notification.confirm("Property Type - "+ptype+"\n"+"Bedrooms - "+pbedroom+"\n"+
        "Date/Time - "+pdatetime+"\n"+"Price - "+pprice+" MMK\n"+
        "Furniture Type - "+pftype+"\n"+"Address - "+paddress+"\n"+
        "Note - "+pnote+"\n"+"Reporter Name - "+prepname+"\n"+
        "Property Phone - "+prepphone,onDoConfirm,"Check again!","Cancel, Confirm");
    }else{
        alert("Not Enough Information! Please fill in all fields");
    }
}

function onDoConfirm(button){
    //do something
    if(button=="1"){ //Cancel

    }else{ //Confirm
        addProperty();
    }
}
function addProperty(){
    var db=window.openDatabase("propertydb","1.0","Property DB",1000000);
        db.transaction(addPropertyQuery,errorDB,successDB);
}
function addPropertyQuery(tx){
    tx.executeSql("create table if not exists property(pid integer primary key autoincrement, ptype varchar, pbedroom varchar, pdatetime varchar, pprice int, pftype varchar, paddress varchar, pnote varchar, prepname varchar, prepphone varchar)");    //SQL
    location.href="property_home.html";
    tx.executeSql("insert into property(ptype,pbedroom,pdatetime,pprice,pftype,paddress,pnote,prepname,prepphone) values(?,?,?,?,?,?,?,?,?)",[$("#ptype").val(),$("#pbedroom").val(),$("#pdatetime").val(),$("#pprice").val(),$("#pftype").val(),$("#paddress").val(),$("#pnote").val(),$("#prepname").val(),$("#prepphone").val()]);
    alert("Successfully Uploaded");
//    alert($("#ptype").val()+"\n"+$("#pbedroom").val()+"\n"+$("#pdatetime").val()+"\n"+$("#pprice").val()+"\n"+$("#pftype").val()+"\n"+$("#paddress").val()+"\n"+$("#pnote").val()+"\n"+$("#prepname").val()+"\n"+$("#prepphone").val());
}

function errorDB(err)
{
    alert("Error Message: "+err.message);
}

function successDB()
{
    var db=window.openDatabase("propertydb","1.0","Property DB",1000000);
           db.transaction(queryPrototype);
}

//-----------------------------------

function queryPrototype(tx){
    tx.executeSql("select * from property order by ptype asc",[],querySuccess);
}
function querySuccess(tx,results){
     var len=results.rows.length;
     var st="";
     for(var i=0;i<len;i++)
     {

        var ptype=results.rows.item(i).ptype;
        var repname=results.rows.item(i).prepname;
        var pprice=results.rows.item(i).pprice;
        var pdatetime=results.rows.item(i).pdatetime;

//        var c1=nameval.charAt(0).toUpperCase();
//        st += "<a href='contact_detail.html' id='"+results.rows.item(i).cid+"' onclick='detailContact(this.id)' style='text-decoration:none;'><div style='box-shadow: 2px 2px 4px 2px rgba(0,0,0,0.1); padding:5%; margin-bottom:15px;'><div style='width: 10%; padding:10px; float:left; margin-right:5%; border-radius: 50%; font-size: 20px; color: #fff; text-align: center; background: #999;'>"+c1+"</div><b style='font-size:20px;'>"+results.rows.item(i).name+"</b><br>";
//        st += results.rows.item(i).phone1+"</div></a>";

        st += "<a href='property_detail.html' id='"+results.rows.item(i).pid+"' onclick='detailProperty(this.id)' style='text-decoration:none;'><div style='box-shadow: 2px 2px 4px 2px rgba(0,0,0,0.1); padding:5%; margin-bottom:15px;'><b style='font-size:20px;'>"+ptype+" - "+pprice+" MMK</b><br>";
        st += "by "+repname+" <p style='float:right; font-size:14px;'>"+pdatetime+"</p></div></a>";

     }
     $("#contactInfo").html(st+"");
}

//-----------------------------------------------------------------
function detailProperty(clicked_id){
    var clickedID=clicked_id;
    window.localStorage.setItem("property_pid",clickedID);
}

function runDetailProperty(){
    var db=window.openDatabase("propertydb","1.0","Property DB",1000000);
        db.transaction(queryDetailProperty,errorDB);

        var getRole=window.localStorage.getItem("userRole");
        if(getRole=="Searcher"){
                $(document).ready(function() {
                            $('#detailDivToHide').hide();
                    });
            }
}

function queryDetailProperty(tx){
    var detail_pid=0;
    detail_pid=window.localStorage.getItem("property_pid");
//    window.localStorage.clear();

    tx.executeSql("select * from property where pid=?",[detail_pid],queryDetailSuccess);
}

function queryDetailSuccess(tx,results){
    var len=results.rows.length;
         for(var i=0;i<len;i++)
         {

//            var nameval=results.rows.item(i).name;
//            var c1=nameval.charAt(0).toUpperCase();
//            $("#char1").html(c1);
//            $("#d_name").html(results.rows.item(i).name);
//            $("#d_p1").html(results.rows.item(i).phone1);

            var ptype=results.rows.item(i).ptype;
            if(ptype=="" ||ptype==null){
                ptype="No data";
            }
            $("#showptype").html(ptype);

            var pbedroom=results.rows.item(i).pbedroom;
            if(pbedroom=="" ||pbedroom==null){
                pbedroom="No data";
            }
            $("#showpbedroom").html(pbedroom);

            var pdatetime=results.rows.item(i).pdatetime;
            if(pdatetime=="" ||pdatetime==null){
                pdatetime="No data";
            }
            $("#showpdatetime").html(pdatetime);

            var pprice=results.rows.item(i).pprice;
            if(pprice=="" ||pprice==null){
                pprice="No data";
            }
            if(pprice=="No data"){
                $("#showpprice").html(pprice);
            }else{
                $("#showpprice").html(pprice+" MMK");
            }


            var pftype=results.rows.item(i).pftype;
            if(pftype=="" ||pftype==null){
                pftype="No data";
            }
            $("#showpftype").html(pftype);

            var paddress=results.rows.item(i).paddress;
            if(paddress=="" ||paddress==null){
                paddress="No data";
            }
            window.localStorage.setItem("tosearchInMap",paddress);
            $("#showpaddress").html(paddress);

            var pnote=results.rows.item(i).pnote;
            if(pnote=="" ||pnote==null){
                pnote="No data";
            }
            $("#showpnote").html(pnote);

            var prepname=results.rows.item(i).prepname;
            if(prepname=="" ||prepname==null){
                prepname="No data";
            }
            $("#showprepname").html(prepname);

            var prepphone=results.rows.item(i).prepphone;
            if(prepphone=="" ||prepphone==null){
                prepphone="No data";
            }
            $("#showprepphone").html(prepphone);

         }
}

//--------------------------
function confirmDelete(){
    navigator.notification.confirm("Are you sure to delete this property?",onDoDelete,"Make Sure!","Cancel, OK");

}
function onDoDelete(button){
    if(button=="1"){ //Cancel

    }else{ //Confirm
       deleteProperty();
    }
}
function deleteProperty(){

    var db=window.openDatabase("propertydb","1.0","Property DB",1000000);
        db.transaction(deletePropertyDB,errorDB);

}
function deletePropertyDB(tx){
    var detail_pid=0;
        detail_pid=window.localStorage.getItem("property_pid");

    tx.executeSql("delete from property where pid=?",[detail_pid],successDelete,errorDB);
}

function successDelete()
{
    location.href="property_home.html";
}

//------------------------------
//Updating function -------------------------
function updateProperty()
{
    location.href="property_update.html";
//    alert("clicked "+detail_cid);

}
function runUpdateProperty(){
    var db=window.openDatabase("propertydb","1.0","Property DB",1000000);
        db.transaction(updatePropertyQuery,errorDB);
}
function updatePropertyQuery(tx)
{
     var detail_pid=0;
      detail_pid=window.localStorage.getItem("property_pid");

    tx.executeSql("select * from property where pid=?",[detail_pid],queryResultToUpdate, errorDB);
}

function queryResultToUpdate(tx, results)
{
    var propertyid=results.rows.item(0).pid;
    var ptype=results.rows.item(0).ptype;
    var pbedroom=results.rows.item(0).pbedroom;
    var pdatetime=results.rows.item(0).pdatetime;
    var pprice=results.rows.item(0).pprice;
    var pftype=results.rows.item(0).pftype;
    var paddress=results.rows.item(0).paddress;
    var pnote=results.rows.item(0).pnote;
    var prepname=results.rows.item(0).prepname;
    var prepphone=results.rows.item(0).prepphone;

    $("#pid").val(propertyid);

    $("#ptype").val(ptype);

    $("#pbedroom").val(pbedroom);
    $("#pdatetime").val(pdatetime);
    $("#pprice").val(pprice);

    $("#pftype").val(pftype);

    $("#paddress").val(paddress);
    $("#pnote").val(pnote);
    $("#prepname").val(prepname);
    $("#prepphone").val(prepphone);


}
//---
function updatePropertyDB()
{
    var db=window.openDatabase("propertydb","1.0","Property DB",1000000);
        db.transaction(updatePropertyProcess,errorDB);

}
function updatePropertyProcess(tx)
{
    tx.executeSql("update property set pbedroom=?, pdatetime=?, pprice=?, paddress=?, pnote=?, prepname=?, prepphone=? where pid=?",
                  [$("#pbedroom").val(), $("#pdatetime").val(),$("#pprice").val(),$("#paddress").val(),$("#pnote").val(),$("#prepname").val(),$("#prepphone").val(),$("#pid").val()],
                  successUpdate,errorDB);
}

function successUpdate()
{
    alert("Successfully updated!!");
    location.href="property_detail.html";//show all books
}
//------------------------------------------------------------------------

function searchPropertyDB()
{
    var db=window.openDatabase("propertydb","1.0","Property DB",1000000);
        db.transaction(querySearchProperty,errorDB);
}
function querySearchProperty(tx)
{
    tx.executeSql("select * from property where ptype LIKE '%"+$("#searchtext").val()+"%' or pprice LIKE '%"+$("#searchtext").val()+"%' or prepname LIKE '%"+$("#searchtext").val()+"%' or paddress LIKE '%"+$("#searchtext").val()+"%'",[],querySearchSuccess,errorDB);

}

function querySearchSuccess(tx, results)
{

     var len=results.rows.length;
     var st="";
     for(var i=0;i<len;i++)
     {

        var ptype=results.rows.item(i).ptype;
        var repname=results.rows.item(i).prepname;
        var pprice=results.rows.item(i).pprice;

        st += "<a href='property_detail.html' id='"+results.rows.item(i).pid+"' onclick='detailProperty(this.id)' style='text-decoration:none;'><div style='box-shadow: 2px 2px 4px 2px rgba(0,0,0,0.1); padding:5%; margin-bottom:15px;'><b style='font-size:20px;'>"+ptype+" - "+pprice+" MMK</b><br>";
        st += "by "+repname+"</div></a>";

     }
     if(len==0)$("#contactInfo").html("No Result for your searching!<br/>");
              else $("#contactInfo").html(st+"");

}
//------------
function aboutMe(){
    alert("This app is developed by Min Ko Ko Linn");
}
//-----------------
function saveUserRole(){
    var userRole="";
    var searcher=document.getElementById("searcher");
    var reporter=document.getElementById("reporter");
    if(searcher.checked){
        userRole="Searcher";
        location.href="property_home.html";
        window.localStorage.setItem("userRole",userRole);
    }else if(reporter.checked){
        userRole="Reporter";
        location.href="property_home.html";
        window.localStorage.setItem("userRole",userRole);
    }else{
        alert("Choose one! How will you use this app?");
    }


}
function exit(){
    var blah="";
    window.localStorage.setItem("userRole",blah);
    location.href="index.html";
}
function checkRoleInHome(){
    var getRole=window.localStorage.getItem("userRole");
    if(getRole=="Searcher"){
        $(document).ready(function() {
                    $('#footerDiv').hide();
            });
    }

}
//-------------------------------------------------------------
function searchFilter(){
    var filterStatus="on";
    window.localStorage.setItem("filterStatus",filterStatus);


    var searchDataPPriceMore=$("#ppricemore").val();
    window.localStorage.setItem("searchDataPPriceMore",searchDataPPriceMore);

    var searchDataPPriceLess=$("#ppriceless").val();
    window.localStorage.setItem("searchDataPPriceLess",searchDataPPriceLess);


    var searchDataPAddress=$("#paddress").val();
    window.localStorage.setItem("searchDataPAddress",searchDataPAddress);


    location.href="search_filter_result.html";
}
function successDBbyFilter()
{
    var db=window.openDatabase("propertydb","1.0","Property DB",1000000);
           db.transaction(queryPropertyFilter);

    var filterStatus=window.localStorage.getItem("filterStatus");
    if(filterStatus!="on"){
        location.href="property_home.html";
    }
}
function queryPropertyFilter(tx){
    var ppricemore=window.localStorage.getItem("searchDataPPriceMore");
    var ppriceless=window.localStorage.getItem("searchDataPPriceLess");
    var paddress=window.localStorage.getItem("searchDataPAddress");
//    alert(ppricemore+"\n"+ppriceless+"\n"+paddress);

    if(ppricemore!="" && ppriceless=="" && paddress==""){
        tx.executeSql("select * from property where pprice>"+ppricemore+"",[],querySuccessFilter);
    }else if(ppricemore=="" && ppriceless!="" && paddress==""){
        tx.executeSql("select * from property where pprice<"+ppriceless+"",[],querySuccessFilter);
    }else if(ppricemore=="" && ppriceless=="" && paddress!=""){
        tx.executeSql("select * from property where paddress LIKE '%"+paddress+"%'",[],querySuccessFilter);
    }else if(ppricemore!="" && ppriceless!="" && paddress==""){
        tx.executeSql("select * from property where pprice>"+ppricemore+" and pprice<"+ppriceless+"",[],querySuccessFilter);
    }else if(ppricemore!="" && ppriceless=="" && paddress!=""){
        tx.executeSql("select * from property where pprice>"+ppricemore+" and paddress LIKE '%"+paddress+"%'",[],querySuccessFilter);
    }else if(ppricemore=="" && ppriceless!="" && paddress!=""){
        tx.executeSql("select * from property where pprice<"+ppriceless+" and paddress LIKE '%"+paddress+"%'",[],querySuccessFilter);
    }else if(ppricemore!="" && ppriceless!="" && paddress!=""){
        tx.executeSql("select * from property where pprice>"+ppricemore+" and pprice<"+ppriceless+" and paddress LIKE '%"+paddress+"%'",[],querySuccessFilter);
    }else if(ppricemore=="" && ppriceless=="" && paddress==""){
        tx.executeSql("select * from property",[],querySuccessFilter);
    }else{

    }



}
function querySuccessFilter(tx,results){
     var len=results.rows.length;
     var st="";
     for(var i=0;i<len;i++)
     {

        var ptype=results.rows.item(i).ptype;
        var repname=results.rows.item(i).prepname;
        var pprice=results.rows.item(i).pprice;
        st += "<a href='property_detail.html' id='"+results.rows.item(i).pid+"' onclick='detailProperty(this.id)' style='text-decoration:none;'><div style='box-shadow: 2px 2px 4px 2px rgba(0,0,0,0.1); padding:5%; margin-bottom:15px;'><b style='font-size:20px;'>"+ptype+" - "+pprice+" MMK</b><br>";
        st += "by "+repname+"</div></a>";

     }
     $("#contactInfo").html(st+"");
}
function backToFilter(){
    var filterStatus="";
        window.localStorage.setItem("filterStatus",filterStatus);


        var searchDataPPriceMore="";
        window.localStorage.setItem("searchDataPPriceMore",searchDataPPriceMore);

        var searchDataPPriceLess="";
        window.localStorage.setItem("searchDataPPriceLess",searchDataPPriceLess);

        var searchDataPAddress="";
        window.localStorage.setItem("searchDataPAddress",searchDataPAddress);


        location.href="property_home.html";
}
function backToHome(){
    location.href="search_filter_result.html";
}
//--------------------------------------
function clearFields(){
    $("#pbedroom").val("");
    $("#pprice").val("");
    $("#paddress").val("");
    $("#pnote").val("");
    $("#prepname").val("");
    $("#prepphone").val("");
}
function backFromUpdate(){
    window.localStorage.setItem("property_pid","");
    location.href="property_home.html";
}
function viewInMap(){
    var toseachPlace=window.localStorage.getItem("tosearchInMap");
    location.href="https://www.google.com/maps/place/"+toseachPlace;
}
//---------------------------------------------------------
//search in menu
function clickedAll(){

    window.localStorage.setItem("menuStatus","");
    location.href="search_filter_on_menu.html";
}
function clickedFlat(){

    window.localStorage.setItem("menuStatus","flat");
    location.href="search_filter_on_menu.html";
}
function clickedHouse(){

    window.localStorage.setItem("menuStatus","house");
    location.href="search_filter_on_menu.html";
}
function clickedBungalow(){

    window.localStorage.setItem("menuStatus","bungalow");
    location.href="search_filter_on_menu.html";
}
function clickedComdo(){

    window.localStorage.setItem("menuStatus","comdo");
    location.href="search_filter_on_menu.html";
}
function successDBInMenu()
{
    var db=window.openDatabase("propertydb","1.0","Property DB",1000000);
           db.transaction(queryPropertyInMenu);

}
function queryPropertyInMenu(tx){
    var menustatus=window.localStorage.getItem("menuStatus");


    if(menustatus==""){
        tx.executeSql("select * from property",[],querySuccessInMenu);
    }else if(menustatus=="flat"){
        tx.executeSql("select * from property where ptype='Flat'",[],querySuccessInMenu);
    }else if(menustatus=="house"){
        tx.executeSql("select * from property where ptype='House'",[],querySuccessInMenu);
    }else if(menustatus=="bungalow"){
        tx.executeSql("select * from property where ptype='Bungalow'",[],querySuccessInMenu);
    }else if(menustatus=="comdo"){
        tx.executeSql("select * from property where ptype='Comdo'",[],querySuccessInMenu);
    }else{
    }


}
function querySuccessInMenu(tx,results){
     var len=results.rows.length;
     var st="";
     for(var i=0;i<len;i++)
     {

        var ptype=results.rows.item(i).ptype;
        var repname=results.rows.item(i).prepname;
        var pprice=results.rows.item(i).pprice;
        st += "<a href='property_detail.html' id='"+results.rows.item(i).pid+"' onclick='detailProperty(this.id)' style='text-decoration:none;'><div style='box-shadow: 2px 2px 4px 2px rgba(0,0,0,0.1); padding:5%; margin-bottom:15px;'><b style='font-size:20px;'>"+ptype+" - "+pprice+" MMK</b><br>";
        st += "by "+repname+"</div></a>";

     }
     $("#contactInfo").html(st+"");
}
function backFromMenu(){
    window.localStorage.setItem("menuStatus","");
    location.href="property_home.html";
}