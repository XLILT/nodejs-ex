function mix(p, obj) {
    for(var i in obj){
        if(obj.hasOwnProperty(i)) {
            p[i] = obj[i];
        }
    }
}
