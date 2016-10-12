var PageHandler = {
    helloWorld:{
        // auth:{},
        handler:function(request, reply){
            return reply('<h2>Hello world!</h2>');
        }
    }
};
module.exports = PageHandler;