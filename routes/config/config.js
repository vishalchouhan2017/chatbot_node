
exports.customerRegistration = function () {
    this.userEntity = {
        "userId" : "",
        "firstName" : "",
        "middleName" : "",
        "lastName" : "",
        "primaryEmail" : "",
        "primaryMobileNumber" : "",
        "userType" : "",
        "userStatus" : "",
        "userStatusReason" : "",
        "userStatusUpdatedById" : "",
        "userStatusUpdatedByName" : "",
        "userStatusUpdatedDate" : "",
        "passwordHash" : "",
        "lastLoginDate" : "",
        "spocId" : "",
         "additionalDetails" : {
            "PANNumber" : "",
            "billingAddress" : {
                "addressId" : "", 
                "addressFirstName" : "", 
                "addressLastName" : "", 
                "addressEmail" : "", 
                "addressMobile" : "", 
                "addressLine1" : "", 
                "addressLine2" : "", 
                "addressLine3" : "", 
                "addressLine4" : "", 
                "addressLine5" : "", 
                "city" : "", 
                "state" : "", 
                "country" : "", 
                "pincode" : "", 
                
            },
          },
          "WebsiteLink" : "",
          "userip":""
    }
    
}

exports.viewCustomer = function () {
    this.mobile = "";
    this.password = "";
  };

       
  exports.querySchema = function () {
    this.sessionId = "";
    this.userName = "";
    this.company = "";
    this.query = "";
    this.response = "";
    this.statusCode = "";
    this.feedBack = "";
    this.userFeedbackComment = "";
    this.requestIp = "";
    this.requestType = "" // text / button / image
    this.confidence = "";
  };
  
  exports.inquiry = function () {
    this.name = "";
    this.email = "";
    this.phone = "";
    this.budget = "";
    this.projectDesribe = "";
  };

  exports.carrerForm = function () {
    this.name = "";
    this.email = "";
    this.message = "";
    this.resumeUrl = "";
  };
  