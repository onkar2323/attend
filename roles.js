const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant("student")
 .readOwn("profile")
 
ac.grant("teacher")
 .extend("student")
 .readAny("profile")
 .createAny("profile")


ac.grant("hod")
 .extend("teacher")
 .readAny("profile")
 
ac.grant("admin")
 .extend("student")
 .extend("hod")
 .updateAny("profile")
 .deleteAny("profile")
 .createAny("profile")
 
return ac;
})();