(function() {
    Loader = (function() {

    var load_cursor = 0;
    var load_queue;

    var loadFinished = function() {
        load_cursor ++;
        if (load_cursor < load_queue.length) {
            loadScript();
        }
    }

    function loadError (oError) {
        console.error("The script " + oError.target.src + " is not accessible.");
    }


    var loadScript = function() {
        var url = load_queue[load_cursor];
        var script = document.createElement('script');
        script.type = "text/javascript";

        if (script.readyState){  //IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" || script.readyState == "complete"){
                    script.onreadystatechange = null;
                    loadFinished();
                }
            };
        } else {  //Others
            script.onload = function(){
                loadFinished();
        };
    }

    script.onerror = loadError;

    script.src = url+'?'+'time='+Date.parse(new Date());
       document.getElementsByTagName('head')[0].appendChild(script);
    };

    var loadMultiScript = function(url_array) {
        load_cursor = 0;
        load_queue = url_array;
        loadScript();
    }

    return {
        load: loadMultiScript,
    };

    })();  // end Loader

    //loading ...
    Loader.load([
            'http://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.js', 
            'http://og4s4svgv.bkt.clouddn.com/sorter1.3.js',
             ]);
})();
