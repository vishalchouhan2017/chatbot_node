var env = require('../../Environment/env.js').env;
// var env = require('../../Environment/env.js')


exports.customerDbName = 'customer';
exports.counterDbName = 'counters';
exports.sessionId = "sessionId";
exports.chatbootQuestion = "chatbootQuestion";
exports.inquiry = "inquiry";
exports.career = "career"

exports.userType = {
    B2B : "B2B",
    B2C : "B2C"
}

exports.userStatus = {
    approved : "approved",
    not_approved : "not_approved"
}

var chatbootUrl = {
    "prd": "http://stgnode.airoboticatech.com:8082/chatbot/api/v1.0/chatBotQuestion",
    "stg": "http://stgnode.airoboticatech.com:8080/chatbot/api/v1.0/chatBotQuestion",
    "dev": "http://stgnode.airoboticatech.com:8080/chatbot/api/v1.0/chatBotQuestion"
        
};

var connParams = null;

if (env === 'prd') {
    exports.connParams = chatbootUrl.prd;
} else if (env === 'stg') {
    exports.connParams = chatbootUrl.stg;
} else {
    exports.connParams = chatbootUrl.dev;
}

var collectionConfig = {
    "prd": {
        customerDbName : 'prd_customer',
        counterDbName : 'prd_counters',
        sessionId : "prd_sessionId",
        chatbootQuestion : "prd_chatbootQuestion",
        inquiry : "prd_inquiry",
        career : "prd_career"
    },
    "stg": {
        customerDbName : 'stg_customer',
        counterDbName : 'stg_counters',
        sessionId : "stg_sessionId",
        chatbootQuestion : "stg_chatbootQuestion",
        inquiry : "stg_inquiry",
        career :"stg_career"
    },
    "dev": {
        customerDbName : 'dev_customer',
        counterDbName : 'dev_counters',
        sessionId : "dev_sessionId",
        chatbootQuestion : "dev_chatbootQuestion",
        inquiry : "dev_inquiry",
        career : "dev_career"
    }
};

var collectionNames = null;

if (env === 'prd') {
    exports.collectionNames = collectionConfig.prd;
} else if (env === 'stg') {
    exports.collectionNames = collectionConfig.stg;
} else {
    exports.collectionNames = collectionConfig.dev;
}
