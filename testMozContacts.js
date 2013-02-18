/* Examples of contact fields:
var adr1 = {
  type: "work",
  streetAddress: "street 1",
  locality: "locality 1",
  region: "region 1",
  postalCode: "postal code 1",
  countryName: "country 1"
};
var properties1 = {
  name: "Testname1",
  familyName: ["TestFamilyName","Wagner"],
  givenName: ["Test1","Test2"],
  nickname: "nicktest",
  tel: [{type: ["work"], value: "123456", carrier: "testCarrier"} , {type: ["home", "fax"], value: "+9-876-5432"}],
  adr: adr1,
  email: [{type: ["work"], value: "x@y.com"}]
};
*/

function addMozContact(aName, aEmail, aTel)
{
  if (!aName) {
    alert("a name is required to create a new contact");
    return;
  }
  var c = new mozContact();
  var properties = {name: aName};
  if (aTel)
    properties.tel = [{type: ["work"], value: aTel}];
  if (aEmail)
    properties.email = [{type: ["work"], value: aEmail}];
  c.init(properties);

  var req = window.navigator.mozContacts.save(c);
  req.onsuccess = (function() { dump('add ok'); }).bind(this);
  req.onerror = (function() { dump('add fail'); }).bind(this);
}

function joinValues(aValues)
{
  return (aValues || []).map(function(v) { return v.value }).join(", ");
}

function listMozContacts()
{
  try {
    var mc = window.navigator.mozContacts;
    var req = mc.find({});
    req.onsuccess = function () {
      document.getElementById("contactCount").textContent =
        "Found " + req.result.length + " contacts.";
      for (var i = 0; i < req.result.length; ++i) {
        var c = req.result[i];
        var tr = document.createElement("tr");
        tr.innerHTML = "<td>" + c.name + "</td><td>" + joinValues(c.email) + "</td><td>" + joinValues(c.tel) + "</td>";
        document.getElementById("allContacts").appendChild(tr);
      }
    };
    req.onerror = function() { dump('fail'); }
//  dump("find done, readyState = " + req.readyState);
  } catch(e) { dump(e); }
}

function findMozContacts(aSearchString)
{
  var table = document.getElementById("findContacts");
  var firstRow = table.firstChild;
  while (firstRow.nextSibling)
    table.removeChild(firstRow.nextSibling);
  if (!aSearchString)
    return;
  try {
    var searchOptions = {
      filterBy: ["email", "tel"],
      filterOp: "contains",
      filterValue: aSearchString
    };
    var mc = window.navigator.mozContacts;
    var req = mc.find(searchOptions);
    req.onsuccess = function (event) {
      var result = event.target.result;
      document.getElementById("contactFoundCount").textContent =
        "Found " + result.length + " contacts.";
      for (var i = 0; i < result.length; ++i) {
        var c = result[i];
        var tr = document.createElement("tr");
        tr.innerHTML = "<td>" + c.name + "</td><td>" + joinValues(c.email) + "</td><td>" + joinValues(c.tel) + "</td>";
        document.getElementById("findContacts").appendChild(tr);
      }
    };
    req.onerror = function() { dump('fail'); }
  //  dump("find done, readyState = " + req.readyState);
  } catch(e) { dump(e); }
}
