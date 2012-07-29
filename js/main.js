/* 
 * Author: Arek Czogala <mail@arekczogala.pl>
 */

// tt - the twit object
function twitItem(tt){    
    
    var dt = tt.datetime.split(',');
    
    var t = '<li id="'+Twiter.sys_name+tt.id+'" class="twit" >';
        t+= '<span class="btn-remove-twit btn">x</span>';
        t+= '<div class="avatar"><img src="'+Twiter.user_info.avatar_path+'"/></div>';
        t+= '<div class="author">@'+tt.author+'</div>';
        t+= '<div class="content">'+tt.content+'</div>';
        t+= '<div class="datetime">at '+dt[0]+'/'+dt[1]+'/'+dt[2]+' '+dt[3]+':'+dt[4]+'</div>';
        t+= '</li>';
    return t;
}


Twiter = {
    
    sys_name : 'twit_sys:',
    
    user_info : {
        nick: 'unknow_guy',
        tagline : 'from planet earth',
        avatar_path : 'img/avatar.png'
    },
    
    twitID : function(){
        var dd = new Date();
        var rand = Math.random();
        
        return  parseInt(dd.getTime())+rand;
    },

    
    addTwit : function(){
        var dt = new Date();
        var tt = new Object();
        var t_id = this.twitID();
        tt.id = t_id;
        tt.datetime = dt.getFullYear()+','+dt.getMonth()+','+dt.getDate()+','+dt.getHours()+','+dt.getMinutes()+','+dt.getSeconds();
        tt.content = $("#twit-text").val().substr(0,139);
        tt.author = this.user_info.nick;
        
        //alert(JSON.stringify(tt));
        LS.addItem(this.sys_name+t_id,JSON.stringify(tt));
        
        this.callback.addTwit(tt);
    },
    
    removeTwit: function(twit_id){
        LS.removeItem(twit_id);
        
    },
    
    /* gets twit list from localstorage */
    refreshTwitsList: function(){
        $("#twits-list").html('');
        var i = LS.itemCount();
        
        for(var k = 0;k<i; k++){
            if(localStorage.key(k).indexOf(this.sys_name) >= 0 ){
                
                var tt = JSON.parse(LS.getItem(localStorage.key(k))) ;
                
                $("#twits-list").prepend(function(){
                   var t = twitItem(tt);
                   
                   return $(t).fadeIn();
               });
           
           }
        }
        
    },
    
    init: function(){
     
        this.refreshTwitsList();
    },
    
    /* Twiter callbacks - manipulate view after LS */
   callback : {
       addTwit : function(tt){
                     
           $("#twits-list").prepend(function(){
               var t = twitItem(tt);
               $('#signs-left').text('140');
               return $(t).fadeIn();
           });
           
           
       }

   }
};


LS = {
    supported : function(){
        if(Modernizr.localstorage) return true; 
        
        alert('There is no local storage support. Sorry :(');
        return false;
    },
    
    addItem: function(key, value){
        localStorage.setItem(key,value);
        
    },
    getItem: function(key){
        return localStorage.getItem(key);
    },
    removeItem: function(key){
        
        localStorage.removeItem(key);
    },
    editItem: function(key,value){
        
    },
    
    clear : function(){
        localStorage.clear();
        Twiter.refreshTwitsList();
    },
    
    itemCount: function(){
        return localStorage.length;
    },
    init : function(){
        
        if(this.supported() ) return true;
        
        return false;
    }
};



/* ============ DOM loaded ================ */
$(document).ready(function(){
   
    if(LS.init()){
    // init the Twits object
        Twiter.init();
    }
    
    $("#twit-text").autosize();
    
    
    /* BEGIN handle end of twit message - btn or enter key */
    $("#btn-add-twit").click(function(){
        ;
        if($.trim($("#twit-text").val())){
             Twiter.addTwit();
             $("#twit-text").val('').focus();
        }
    });
    $("#twit-text").keyup(function(event){
        
        if($.trim( $(this).val() ) && event.which == 13 ){
            Twiter.addTwit();
            $(this).val('').focus('header');
        }
        
       $('#signs-left').text(140 - $(this).val().length);
            

    });
    /* END add twit message */
    
    
    /* BEGIN clear storage btn */
   $("#clear-storage").click(function(){
        if(confirm('Are sure You want to clear the storage?')){
            LS.clear();
        }  
   });
   /* END clear */
  
  /* BEGIN remove twit button */
    $("#twits-list").on("click",".btn-remove-twit",function(){
        Twiter.removeTwit($(this).parent().attr('id'));
        $(this).parent().fadeOut('fast',function(){
          $(this).remove();  
        })
    });
  /* END remove twit */
   
   
});
