
export default class Util {

    
  static urs(a, b)
  {
      a &= 0xffffffff;
      b &= 0x1f; // (bounds check)
      if (a & 0x80000000 && b > 0) { // if left-most bit set
          a = (a >> 1) & 0x7fffffff; //   right-shift one bit & clear left-most bit
          a = a >> (b - 1); //   remaining right-shifts
      } else { // otherwise
          a = (a >> b); //   use normal right-shift
      }
      return a;
  }

static microtime(get_as_float) {  
    var now = new Date().getTime() / 1000;  
    var s = parseInt(now);  
  
    return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;  
}  

static rand( min, max ) { 
    if( max ) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
    return Math.floor(Math.random() * (min + 1));
    }
}
  


}