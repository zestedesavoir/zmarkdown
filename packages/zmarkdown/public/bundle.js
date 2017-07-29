(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ZMarkdown = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";function bail(i){if(i)throw i}module.exports=bail;

},{}],2:[function(require,module,exports){
"use strict";function placeHoldersCount(o){var r=o.length;if(r%4>0)throw new Error("Invalid string. Length must be a multiple of 4");return"="===o[r-2]?2:"="===o[r-1]?1:0}function byteLength(o){return 3*o.length/4-placeHoldersCount(o)}function toByteArray(o){var r,e,t,u,n,p=o.length;u=placeHoldersCount(o),n=new Arr(3*p/4-u),e=u>0?p-4:p;var a=0;for(r=0;r<e;r+=4)t=revLookup[o.charCodeAt(r)]<<18|revLookup[o.charCodeAt(r+1)]<<12|revLookup[o.charCodeAt(r+2)]<<6|revLookup[o.charCodeAt(r+3)],n[a++]=t>>16&255,n[a++]=t>>8&255,n[a++]=255&t;return 2===u?(t=revLookup[o.charCodeAt(r)]<<2|revLookup[o.charCodeAt(r+1)]>>4,n[a++]=255&t):1===u&&(t=revLookup[o.charCodeAt(r)]<<10|revLookup[o.charCodeAt(r+1)]<<4|revLookup[o.charCodeAt(r+2)]>>2,n[a++]=t>>8&255,n[a++]=255&t),n}function tripletToBase64(o){return lookup[o>>18&63]+lookup[o>>12&63]+lookup[o>>6&63]+lookup[63&o]}function encodeChunk(o,r,e){for(var t,u=[],n=r;n<e;n+=3)t=(o[n]<<16)+(o[n+1]<<8)+o[n+2],u.push(tripletToBase64(t));return u.join("")}function fromByteArray(o){for(var r,e=o.length,t=e%3,u="",n=[],p=0,a=e-t;p<a;p+=16383)n.push(encodeChunk(o,p,p+16383>a?a:p+16383));return 1===t?(r=o[e-1],u+=lookup[r>>2],u+=lookup[r<<4&63],u+="=="):2===t&&(r=(o[e-2]<<8)+o[e-1],u+=lookup[r>>10],u+=lookup[r>>4&63],u+=lookup[r<<2&63],u+="="),n.push(u),n.join("")}exports.byteLength=byteLength,exports.toByteArray=toByteArray,exports.fromByteArray=fromByteArray;for(var lookup=[],revLookup=[],Arr="undefined"!=typeof Uint8Array?Uint8Array:Array,code="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=0,len=code.length;i<len;++i)lookup[i]=code[i],revLookup[code.charCodeAt(i)]=i;revLookup["-".charCodeAt(0)]=62,revLookup["_".charCodeAt(0)]=63;

},{}],3:[function(require,module,exports){
"use strict";function typedArraySupport(){try{var e=new Uint8Array(1);return e.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===e.foo()}catch(e){return!1}}function createBuffer(e){if(e>K_MAX_LENGTH)throw new RangeError("Invalid typed array length");var t=new Uint8Array(e);return t.__proto__=Buffer.prototype,t}function Buffer(e,t,r){if("number"==typeof e){if("string"==typeof t)throw new Error("If encoding is specified then the first argument must be a string");return allocUnsafe(e)}return from(e,t,r)}function from(e,t,r){if("number"==typeof e)throw new TypeError('"value" argument must not be a number');return e instanceof ArrayBuffer?fromArrayBuffer(e,t,r):"string"==typeof e?fromString(e,t):fromObject(e)}function assertSize(e){if("number"!=typeof e)throw new TypeError('"size" argument must be a number');if(e<0)throw new RangeError('"size" argument must not be negative')}function alloc(e,t,r){return assertSize(e),e<=0?createBuffer(e):void 0!==t?"string"==typeof r?createBuffer(e).fill(t,r):createBuffer(e).fill(t):createBuffer(e)}function allocUnsafe(e){return assertSize(e),createBuffer(e<0?0:0|checked(e))}function fromString(e,t){if("string"==typeof t&&""!==t||(t="utf8"),!Buffer.isEncoding(t))throw new TypeError('"encoding" must be a valid string encoding');var r=0|byteLength(e,t),n=createBuffer(r),f=n.write(e,t);return f!==r&&(n=n.slice(0,f)),n}function fromArrayLike(e){for(var t=e.length<0?0:0|checked(e.length),r=createBuffer(t),n=0;n<t;n+=1)r[n]=255&e[n];return r}function fromArrayBuffer(e,t,r){if(t<0||e.byteLength<t)throw new RangeError("'offset' is out of bounds");if(e.byteLength<t+(r||0))throw new RangeError("'length' is out of bounds");var n;return n=void 0===t&&void 0===r?new Uint8Array(e):void 0===r?new Uint8Array(e,t):new Uint8Array(e,t,r),n.__proto__=Buffer.prototype,n}function fromObject(e){if(Buffer.isBuffer(e)){var t=0|checked(e.length),r=createBuffer(t);return 0===r.length?r:(e.copy(r,0,0,t),r)}if(e){if(isArrayBufferView(e)||"length"in e)return"number"!=typeof e.length||numberIsNaN(e.length)?createBuffer(0):fromArrayLike(e);if("Buffer"===e.type&&Array.isArray(e.data))return fromArrayLike(e.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}function checked(e){if(e>=K_MAX_LENGTH)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+K_MAX_LENGTH.toString(16)+" bytes");return 0|e}function SlowBuffer(e){return+e!=e&&(e=0),Buffer.alloc(+e)}function byteLength(e,t){if(Buffer.isBuffer(e))return e.length;if(isArrayBufferView(e)||e instanceof ArrayBuffer)return e.byteLength;"string"!=typeof e&&(e=""+e);var r=e.length;if(0===r)return 0;for(var n=!1;;)switch(t){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":case void 0:return utf8ToBytes(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return base64ToBytes(e).length;default:if(n)return utf8ToBytes(e).length;t=(""+t).toLowerCase(),n=!0}}function slowToString(e,t,r){var n=!1;if((void 0===t||t<0)&&(t=0),t>this.length)return"";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return"";if(r>>>=0,t>>>=0,r<=t)return"";for(e||(e="utf8");;)switch(e){case"hex":return hexSlice(this,t,r);case"utf8":case"utf-8":return utf8Slice(this,t,r);case"ascii":return asciiSlice(this,t,r);case"latin1":case"binary":return latin1Slice(this,t,r);case"base64":return base64Slice(this,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return utf16leSlice(this,t,r);default:if(n)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),n=!0}}function swap(e,t,r){var n=e[t];e[t]=e[r],e[r]=n}function bidirectionalIndexOf(e,t,r,n,f){if(0===e.length)return-1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),r=+r,numberIsNaN(r)&&(r=f?0:e.length-1),r<0&&(r=e.length+r),r>=e.length){if(f)return-1;r=e.length-1}else if(r<0){if(!f)return-1;r=0}if("string"==typeof t&&(t=Buffer.from(t,n)),Buffer.isBuffer(t))return 0===t.length?-1:arrayIndexOf(e,t,r,n,f);if("number"==typeof t)return t&=255,"function"==typeof Uint8Array.prototype.indexOf?f?Uint8Array.prototype.indexOf.call(e,t,r):Uint8Array.prototype.lastIndexOf.call(e,t,r):arrayIndexOf(e,[t],r,n,f);throw new TypeError("val must be string, number or Buffer")}function arrayIndexOf(e,t,r,n,f){function i(e,t){return 1===o?e[t]:e.readUInt16BE(t*o)}var o=1,u=e.length,s=t.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(e.length<2||t.length<2)return-1;o=2,u/=2,s/=2,r/=2}var a;if(f){var h=-1;for(a=r;a<u;a++)if(i(e,a)===i(t,-1===h?0:a-h)){if(-1===h&&(h=a),a-h+1===s)return h*o}else-1!==h&&(a-=a-h),h=-1}else for(r+s>u&&(r=u-s),a=r;a>=0;a--){for(var c=!0,l=0;l<s;l++)if(i(e,a+l)!==i(t,l)){c=!1;break}if(c)return a}return-1}function hexWrite(e,t,r,n){r=Number(r)||0;var f=e.length-r;n?(n=Number(n))>f&&(n=f):n=f;var i=t.length;if(i%2!=0)throw new TypeError("Invalid hex string");n>i/2&&(n=i/2);for(var o=0;o<n;++o){var u=parseInt(t.substr(2*o,2),16);if(numberIsNaN(u))return o;e[r+o]=u}return o}function utf8Write(e,t,r,n){return blitBuffer(utf8ToBytes(t,e.length-r),e,r,n)}function asciiWrite(e,t,r,n){return blitBuffer(asciiToBytes(t),e,r,n)}function latin1Write(e,t,r,n){return asciiWrite(e,t,r,n)}function base64Write(e,t,r,n){return blitBuffer(base64ToBytes(t),e,r,n)}function ucs2Write(e,t,r,n){return blitBuffer(utf16leToBytes(t,e.length-r),e,r,n)}function base64Slice(e,t,r){return 0===t&&r===e.length?base64.fromByteArray(e):base64.fromByteArray(e.slice(t,r))}function utf8Slice(e,t,r){r=Math.min(e.length,r);for(var n=[],f=t;f<r;){var i=e[f],o=null,u=i>239?4:i>223?3:i>191?2:1;if(f+u<=r){var s,a,h,c;switch(u){case 1:i<128&&(o=i);break;case 2:128==(192&(s=e[f+1]))&&(c=(31&i)<<6|63&s)>127&&(o=c);break;case 3:s=e[f+1],a=e[f+2],128==(192&s)&&128==(192&a)&&(c=(15&i)<<12|(63&s)<<6|63&a)>2047&&(c<55296||c>57343)&&(o=c);break;case 4:s=e[f+1],a=e[f+2],h=e[f+3],128==(192&s)&&128==(192&a)&&128==(192&h)&&(c=(15&i)<<18|(63&s)<<12|(63&a)<<6|63&h)>65535&&c<1114112&&(o=c)}}null===o?(o=65533,u=1):o>65535&&(o-=65536,n.push(o>>>10&1023|55296),o=56320|1023&o),n.push(o),f+=u}return decodeCodePointsArray(n)}function decodeCodePointsArray(e){var t=e.length;if(t<=MAX_ARGUMENTS_LENGTH)return String.fromCharCode.apply(String,e);for(var r="",n=0;n<t;)r+=String.fromCharCode.apply(String,e.slice(n,n+=MAX_ARGUMENTS_LENGTH));return r}function asciiSlice(e,t,r){var n="";r=Math.min(e.length,r);for(var f=t;f<r;++f)n+=String.fromCharCode(127&e[f]);return n}function latin1Slice(e,t,r){var n="";r=Math.min(e.length,r);for(var f=t;f<r;++f)n+=String.fromCharCode(e[f]);return n}function hexSlice(e,t,r){var n=e.length;(!t||t<0)&&(t=0),(!r||r<0||r>n)&&(r=n);for(var f="",i=t;i<r;++i)f+=toHex(e[i]);return f}function utf16leSlice(e,t,r){for(var n=e.slice(t,r),f="",i=0;i<n.length;i+=2)f+=String.fromCharCode(n[i]+256*n[i+1]);return f}function checkOffset(e,t,r){if(e%1!=0||e<0)throw new RangeError("offset is not uint");if(e+t>r)throw new RangeError("Trying to access beyond buffer length")}function checkInt(e,t,r,n,f,i){if(!Buffer.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(t>f||t<i)throw new RangeError('"value" argument is out of bounds');if(r+n>e.length)throw new RangeError("Index out of range")}function checkIEEE754(e,t,r,n,f,i){if(r+n>e.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function writeFloat(e,t,r,n,f){return t=+t,r>>>=0,f||checkIEEE754(e,t,r,4,3.4028234663852886e38,-3.4028234663852886e38),ieee754.write(e,t,r,n,23,4),r+4}function writeDouble(e,t,r,n,f){return t=+t,r>>>=0,f||checkIEEE754(e,t,r,8,1.7976931348623157e308,-1.7976931348623157e308),ieee754.write(e,t,r,n,52,8),r+8}function base64clean(e){if((e=e.trim().replace(INVALID_BASE64_RE,"")).length<2)return"";for(;e.length%4!=0;)e+="=";return e}function toHex(e){return e<16?"0"+e.toString(16):e.toString(16)}function utf8ToBytes(e,t){t=t||1/0;for(var r,n=e.length,f=null,i=[],o=0;o<n;++o){if((r=e.charCodeAt(o))>55295&&r<57344){if(!f){if(r>56319){(t-=3)>-1&&i.push(239,191,189);continue}if(o+1===n){(t-=3)>-1&&i.push(239,191,189);continue}f=r;continue}if(r<56320){(t-=3)>-1&&i.push(239,191,189),f=r;continue}r=65536+(f-55296<<10|r-56320)}else f&&(t-=3)>-1&&i.push(239,191,189);if(f=null,r<128){if((t-=1)<0)break;i.push(r)}else if(r<2048){if((t-=2)<0)break;i.push(r>>6|192,63&r|128)}else if(r<65536){if((t-=3)<0)break;i.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(!(r<1114112))throw new Error("Invalid code point");if((t-=4)<0)break;i.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return i}function asciiToBytes(e){for(var t=[],r=0;r<e.length;++r)t.push(255&e.charCodeAt(r));return t}function utf16leToBytes(e,t){for(var r,n,f,i=[],o=0;o<e.length&&!((t-=2)<0);++o)n=(r=e.charCodeAt(o))>>8,f=r%256,i.push(f),i.push(n);return i}function base64ToBytes(e){return base64.toByteArray(base64clean(e))}function blitBuffer(e,t,r,n){for(var f=0;f<n&&!(f+r>=t.length||f>=e.length);++f)t[f+r]=e[f];return f}function isArrayBufferView(e){return"function"==typeof ArrayBuffer.isView&&ArrayBuffer.isView(e)}function numberIsNaN(e){return e!==e}var base64=require("base64-js"),ieee754=require("ieee754");exports.Buffer=Buffer,exports.SlowBuffer=SlowBuffer,exports.INSPECT_MAX_BYTES=50;var K_MAX_LENGTH=2147483647;exports.kMaxLength=K_MAX_LENGTH,Buffer.TYPED_ARRAY_SUPPORT=typedArraySupport(),Buffer.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),"undefined"!=typeof Symbol&&Symbol.species&&Buffer[Symbol.species]===Buffer&&Object.defineProperty(Buffer,Symbol.species,{value:null,configurable:!0,enumerable:!1,writable:!1}),Buffer.poolSize=8192,Buffer.from=function(e,t,r){return from(e,t,r)},Buffer.prototype.__proto__=Uint8Array.prototype,Buffer.__proto__=Uint8Array,Buffer.alloc=function(e,t,r){return alloc(e,t,r)},Buffer.allocUnsafe=function(e){return allocUnsafe(e)},Buffer.allocUnsafeSlow=function(e){return allocUnsafe(e)},Buffer.isBuffer=function(e){return null!=e&&!0===e._isBuffer},Buffer.compare=function(e,t){if(!Buffer.isBuffer(e)||!Buffer.isBuffer(t))throw new TypeError("Arguments must be Buffers");if(e===t)return 0;for(var r=e.length,n=t.length,f=0,i=Math.min(r,n);f<i;++f)if(e[f]!==t[f]){r=e[f],n=t[f];break}return r<n?-1:n<r?1:0},Buffer.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},Buffer.concat=function(e,t){if(!Array.isArray(e))throw new TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return Buffer.alloc(0);var r;if(void 0===t)for(t=0,r=0;r<e.length;++r)t+=e[r].length;var n=Buffer.allocUnsafe(t),f=0;for(r=0;r<e.length;++r){var i=e[r];if(!Buffer.isBuffer(i))throw new TypeError('"list" argument must be an Array of Buffers');i.copy(n,f),f+=i.length}return n},Buffer.byteLength=byteLength,Buffer.prototype._isBuffer=!0,Buffer.prototype.swap16=function(){var e=this.length;if(e%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var t=0;t<e;t+=2)swap(this,t,t+1);return this},Buffer.prototype.swap32=function(){var e=this.length;if(e%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var t=0;t<e;t+=4)swap(this,t,t+3),swap(this,t+1,t+2);return this},Buffer.prototype.swap64=function(){var e=this.length;if(e%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var t=0;t<e;t+=8)swap(this,t,t+7),swap(this,t+1,t+6),swap(this,t+2,t+5),swap(this,t+3,t+4);return this},Buffer.prototype.toString=function(){var e=this.length;return 0===e?"":0===arguments.length?utf8Slice(this,0,e):slowToString.apply(this,arguments)},Buffer.prototype.equals=function(e){if(!Buffer.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e||0===Buffer.compare(this,e)},Buffer.prototype.inspect=function(){var e="",t=exports.INSPECT_MAX_BYTES;return this.length>0&&(e=this.toString("hex",0,t).match(/.{2}/g).join(" "),this.length>t&&(e+=" ... ")),"<Buffer "+e+">"},Buffer.prototype.compare=function(e,t,r,n,f){if(!Buffer.isBuffer(e))throw new TypeError("Argument must be a Buffer");if(void 0===t&&(t=0),void 0===r&&(r=e?e.length:0),void 0===n&&(n=0),void 0===f&&(f=this.length),t<0||r>e.length||n<0||f>this.length)throw new RangeError("out of range index");if(n>=f&&t>=r)return 0;if(n>=f)return-1;if(t>=r)return 1;if(t>>>=0,r>>>=0,n>>>=0,f>>>=0,this===e)return 0;for(var i=f-n,o=r-t,u=Math.min(i,o),s=this.slice(n,f),a=e.slice(t,r),h=0;h<u;++h)if(s[h]!==a[h]){i=s[h],o=a[h];break}return i<o?-1:o<i?1:0},Buffer.prototype.includes=function(e,t,r){return-1!==this.indexOf(e,t,r)},Buffer.prototype.indexOf=function(e,t,r){return bidirectionalIndexOf(this,e,t,r,!0)},Buffer.prototype.lastIndexOf=function(e,t,r){return bidirectionalIndexOf(this,e,t,r,!1)},Buffer.prototype.write=function(e,t,r,n){if(void 0===t)n="utf8",r=this.length,t=0;else if(void 0===r&&"string"==typeof t)n=t,r=this.length,t=0;else{if(!isFinite(t))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");t>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n="utf8")):(n=r,r=void 0)}var f=this.length-t;if((void 0===r||r>f)&&(r=f),e.length>0&&(r<0||t<0)||t>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var i=!1;;)switch(n){case"hex":return hexWrite(this,e,t,r);case"utf8":case"utf-8":return utf8Write(this,e,t,r);case"ascii":return asciiWrite(this,e,t,r);case"latin1":case"binary":return latin1Write(this,e,t,r);case"base64":return base64Write(this,e,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return ucs2Write(this,e,t,r);default:if(i)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),i=!0}},Buffer.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var MAX_ARGUMENTS_LENGTH=4096;Buffer.prototype.slice=function(e,t){var r=this.length;e=~~e,t=void 0===t?r:~~t,e<0?(e+=r)<0&&(e=0):e>r&&(e=r),t<0?(t+=r)<0&&(t=0):t>r&&(t=r),t<e&&(t=e);var n=this.subarray(e,t);return n.__proto__=Buffer.prototype,n},Buffer.prototype.readUIntLE=function(e,t,r){e>>>=0,t>>>=0,r||checkOffset(e,t,this.length);for(var n=this[e],f=1,i=0;++i<t&&(f*=256);)n+=this[e+i]*f;return n},Buffer.prototype.readUIntBE=function(e,t,r){e>>>=0,t>>>=0,r||checkOffset(e,t,this.length);for(var n=this[e+--t],f=1;t>0&&(f*=256);)n+=this[e+--t]*f;return n},Buffer.prototype.readUInt8=function(e,t){return e>>>=0,t||checkOffset(e,1,this.length),this[e]},Buffer.prototype.readUInt16LE=function(e,t){return e>>>=0,t||checkOffset(e,2,this.length),this[e]|this[e+1]<<8},Buffer.prototype.readUInt16BE=function(e,t){return e>>>=0,t||checkOffset(e,2,this.length),this[e]<<8|this[e+1]},Buffer.prototype.readUInt32LE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3]},Buffer.prototype.readUInt32BE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},Buffer.prototype.readIntLE=function(e,t,r){e>>>=0,t>>>=0,r||checkOffset(e,t,this.length);for(var n=this[e],f=1,i=0;++i<t&&(f*=256);)n+=this[e+i]*f;return f*=128,n>=f&&(n-=Math.pow(2,8*t)),n},Buffer.prototype.readIntBE=function(e,t,r){e>>>=0,t>>>=0,r||checkOffset(e,t,this.length);for(var n=t,f=1,i=this[e+--n];n>0&&(f*=256);)i+=this[e+--n]*f;return f*=128,i>=f&&(i-=Math.pow(2,8*t)),i},Buffer.prototype.readInt8=function(e,t){return e>>>=0,t||checkOffset(e,1,this.length),128&this[e]?-1*(255-this[e]+1):this[e]},Buffer.prototype.readInt16LE=function(e,t){e>>>=0,t||checkOffset(e,2,this.length);var r=this[e]|this[e+1]<<8;return 32768&r?4294901760|r:r},Buffer.prototype.readInt16BE=function(e,t){e>>>=0,t||checkOffset(e,2,this.length);var r=this[e+1]|this[e]<<8;return 32768&r?4294901760|r:r},Buffer.prototype.readInt32LE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},Buffer.prototype.readInt32BE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},Buffer.prototype.readFloatLE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),ieee754.read(this,e,!0,23,4)},Buffer.prototype.readFloatBE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),ieee754.read(this,e,!1,23,4)},Buffer.prototype.readDoubleLE=function(e,t){return e>>>=0,t||checkOffset(e,8,this.length),ieee754.read(this,e,!0,52,8)},Buffer.prototype.readDoubleBE=function(e,t){return e>>>=0,t||checkOffset(e,8,this.length),ieee754.read(this,e,!1,52,8)},Buffer.prototype.writeUIntLE=function(e,t,r,n){e=+e,t>>>=0,r>>>=0,n||checkInt(this,e,t,r,Math.pow(2,8*r)-1,0);var f=1,i=0;for(this[t]=255&e;++i<r&&(f*=256);)this[t+i]=e/f&255;return t+r},Buffer.prototype.writeUIntBE=function(e,t,r,n){e=+e,t>>>=0,r>>>=0,n||checkInt(this,e,t,r,Math.pow(2,8*r)-1,0);var f=r-1,i=1;for(this[t+f]=255&e;--f>=0&&(i*=256);)this[t+f]=e/i&255;return t+r},Buffer.prototype.writeUInt8=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,1,255,0),this[t]=255&e,t+1},Buffer.prototype.writeUInt16LE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,2,65535,0),this[t]=255&e,this[t+1]=e>>>8,t+2},Buffer.prototype.writeUInt16BE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,2,65535,0),this[t]=e>>>8,this[t+1]=255&e,t+2},Buffer.prototype.writeUInt32LE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,4,4294967295,0),this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e,t+4},Buffer.prototype.writeUInt32BE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,4,4294967295,0),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},Buffer.prototype.writeIntLE=function(e,t,r,n){if(e=+e,t>>>=0,!n){var f=Math.pow(2,8*r-1);checkInt(this,e,t,r,f-1,-f)}var i=0,o=1,u=0;for(this[t]=255&e;++i<r&&(o*=256);)e<0&&0===u&&0!==this[t+i-1]&&(u=1),this[t+i]=(e/o>>0)-u&255;return t+r},Buffer.prototype.writeIntBE=function(e,t,r,n){if(e=+e,t>>>=0,!n){var f=Math.pow(2,8*r-1);checkInt(this,e,t,r,f-1,-f)}var i=r-1,o=1,u=0;for(this[t+i]=255&e;--i>=0&&(o*=256);)e<0&&0===u&&0!==this[t+i+1]&&(u=1),this[t+i]=(e/o>>0)-u&255;return t+r},Buffer.prototype.writeInt8=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,1,127,-128),e<0&&(e=255+e+1),this[t]=255&e,t+1},Buffer.prototype.writeInt16LE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,2,32767,-32768),this[t]=255&e,this[t+1]=e>>>8,t+2},Buffer.prototype.writeInt16BE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,2,32767,-32768),this[t]=e>>>8,this[t+1]=255&e,t+2},Buffer.prototype.writeInt32LE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,4,2147483647,-2147483648),this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24,t+4},Buffer.prototype.writeInt32BE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},Buffer.prototype.writeFloatLE=function(e,t,r){return writeFloat(this,e,t,!0,r)},Buffer.prototype.writeFloatBE=function(e,t,r){return writeFloat(this,e,t,!1,r)},Buffer.prototype.writeDoubleLE=function(e,t,r){return writeDouble(this,e,t,!0,r)},Buffer.prototype.writeDoubleBE=function(e,t,r){return writeDouble(this,e,t,!1,r)},Buffer.prototype.copy=function(e,t,r,n){if(r||(r=0),n||0===n||(n=this.length),t>=e.length&&(t=e.length),t||(t=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===e.length||0===this.length)return 0;if(t<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("sourceStart out of bounds");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),e.length-t<n-r&&(n=e.length-t+r);var f,i=n-r;if(this===e&&r<t&&t<n)for(f=i-1;f>=0;--f)e[f+t]=this[f+r];else if(i<1e3)for(f=0;f<i;++f)e[f+t]=this[f+r];else Uint8Array.prototype.set.call(e,this.subarray(r,r+i),t);return i},Buffer.prototype.fill=function(e,t,r,n){if("string"==typeof e){if("string"==typeof t?(n=t,t=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),1===e.length){var f=e.charCodeAt(0);f<256&&(e=f)}if(void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!Buffer.isEncoding(n))throw new TypeError("Unknown encoding: "+n)}else"number"==typeof e&&(e&=255);if(t<0||this.length<t||this.length<r)throw new RangeError("Out of range index");if(r<=t)return this;t>>>=0,r=void 0===r?this.length:r>>>0,e||(e=0);var i;if("number"==typeof e)for(i=t;i<r;++i)this[i]=e;else{var o=Buffer.isBuffer(e)?e:new Buffer(e,n),u=o.length;for(i=0;i<r-t;++i)this[i+t]=o[i%u]}return this};var INVALID_BASE64_RE=/[^+/0-9A-Za-z-_]/g;

},{"base64-js":2,"ieee754":42}],4:[function(require,module,exports){
"use strict";function preserveCamelCase(e){for(var r=!1,t=0;t<e.length;t++){var o=e.charAt(t);r&&/[a-zA-Z]/.test(o)&&o.toUpperCase()===o?(e=e.substr(0,t)+"-"+e.substr(t),r=!1,t++):r=o.toLowerCase()===o}return e}module.exports=function(){var e=[].map.call(arguments,function(e){return e.trim()}).filter(function(e){return e.length}).join("-");return e.length?1===e.length?e.toLowerCase():/[_.\- ]+/.test(e)?(e=preserveCamelCase(e)).replace(/^[_.\- ]+/,"").toLowerCase().replace(/[_.\- ]+(\w|$)/g,function(e,r){return r.toUpperCase()}):e===e.toUpperCase()?e.toLowerCase():e[0]!==e[0].toLowerCase()?e[0].toLowerCase()+e.slice(1):e:""};

},{}],5:[function(require,module,exports){
"use strict";function ccount(r,t){var e,n=0;if(r=String(r),"string"!=typeof t||1!==t.length)throw new Error("Expected character");for(e=r.indexOf(t);-1!==e;)n++,e=r.indexOf(t,e+1);return n}module.exports=ccount;

},{}],6:[function(require,module,exports){
module.exports={
  "nbsp": " ",
  "iexcl": "¡",
  "cent": "¢",
  "pound": "£",
  "curren": "¤",
  "yen": "¥",
  "brvbar": "¦",
  "sect": "§",
  "uml": "¨",
  "copy": "©",
  "ordf": "ª",
  "laquo": "«",
  "not": "¬",
  "shy": "­",
  "reg": "®",
  "macr": "¯",
  "deg": "°",
  "plusmn": "±",
  "sup2": "²",
  "sup3": "³",
  "acute": "´",
  "micro": "µ",
  "para": "¶",
  "middot": "·",
  "cedil": "¸",
  "sup1": "¹",
  "ordm": "º",
  "raquo": "»",
  "frac14": "¼",
  "frac12": "½",
  "frac34": "¾",
  "iquest": "¿",
  "Agrave": "À",
  "Aacute": "Á",
  "Acirc": "Â",
  "Atilde": "Ã",
  "Auml": "Ä",
  "Aring": "Å",
  "AElig": "Æ",
  "Ccedil": "Ç",
  "Egrave": "È",
  "Eacute": "É",
  "Ecirc": "Ê",
  "Euml": "Ë",
  "Igrave": "Ì",
  "Iacute": "Í",
  "Icirc": "Î",
  "Iuml": "Ï",
  "ETH": "Ð",
  "Ntilde": "Ñ",
  "Ograve": "Ò",
  "Oacute": "Ó",
  "Ocirc": "Ô",
  "Otilde": "Õ",
  "Ouml": "Ö",
  "times": "×",
  "Oslash": "Ø",
  "Ugrave": "Ù",
  "Uacute": "Ú",
  "Ucirc": "Û",
  "Uuml": "Ü",
  "Yacute": "Ý",
  "THORN": "Þ",
  "szlig": "ß",
  "agrave": "à",
  "aacute": "á",
  "acirc": "â",
  "atilde": "ã",
  "auml": "ä",
  "aring": "å",
  "aelig": "æ",
  "ccedil": "ç",
  "egrave": "è",
  "eacute": "é",
  "ecirc": "ê",
  "euml": "ë",
  "igrave": "ì",
  "iacute": "í",
  "icirc": "î",
  "iuml": "ï",
  "eth": "ð",
  "ntilde": "ñ",
  "ograve": "ò",
  "oacute": "ó",
  "ocirc": "ô",
  "otilde": "õ",
  "ouml": "ö",
  "divide": "÷",
  "oslash": "ø",
  "ugrave": "ù",
  "uacute": "ú",
  "ucirc": "û",
  "uuml": "ü",
  "yacute": "ý",
  "thorn": "þ",
  "yuml": "ÿ",
  "fnof": "ƒ",
  "Alpha": "Α",
  "Beta": "Β",
  "Gamma": "Γ",
  "Delta": "Δ",
  "Epsilon": "Ε",
  "Zeta": "Ζ",
  "Eta": "Η",
  "Theta": "Θ",
  "Iota": "Ι",
  "Kappa": "Κ",
  "Lambda": "Λ",
  "Mu": "Μ",
  "Nu": "Ν",
  "Xi": "Ξ",
  "Omicron": "Ο",
  "Pi": "Π",
  "Rho": "Ρ",
  "Sigma": "Σ",
  "Tau": "Τ",
  "Upsilon": "Υ",
  "Phi": "Φ",
  "Chi": "Χ",
  "Psi": "Ψ",
  "Omega": "Ω",
  "alpha": "α",
  "beta": "β",
  "gamma": "γ",
  "delta": "δ",
  "epsilon": "ε",
  "zeta": "ζ",
  "eta": "η",
  "theta": "θ",
  "iota": "ι",
  "kappa": "κ",
  "lambda": "λ",
  "mu": "μ",
  "nu": "ν",
  "xi": "ξ",
  "omicron": "ο",
  "pi": "π",
  "rho": "ρ",
  "sigmaf": "ς",
  "sigma": "σ",
  "tau": "τ",
  "upsilon": "υ",
  "phi": "φ",
  "chi": "χ",
  "psi": "ψ",
  "omega": "ω",
  "thetasym": "ϑ",
  "upsih": "ϒ",
  "piv": "ϖ",
  "bull": "•",
  "hellip": "…",
  "prime": "′",
  "Prime": "″",
  "oline": "‾",
  "frasl": "⁄",
  "weierp": "℘",
  "image": "ℑ",
  "real": "ℜ",
  "trade": "™",
  "alefsym": "ℵ",
  "larr": "←",
  "uarr": "↑",
  "rarr": "→",
  "darr": "↓",
  "harr": "↔",
  "crarr": "↵",
  "lArr": "⇐",
  "uArr": "⇑",
  "rArr": "⇒",
  "dArr": "⇓",
  "hArr": "⇔",
  "forall": "∀",
  "part": "∂",
  "exist": "∃",
  "empty": "∅",
  "nabla": "∇",
  "isin": "∈",
  "notin": "∉",
  "ni": "∋",
  "prod": "∏",
  "sum": "∑",
  "minus": "−",
  "lowast": "∗",
  "radic": "√",
  "prop": "∝",
  "infin": "∞",
  "ang": "∠",
  "and": "∧",
  "or": "∨",
  "cap": "∩",
  "cup": "∪",
  "int": "∫",
  "there4": "∴",
  "sim": "∼",
  "cong": "≅",
  "asymp": "≈",
  "ne": "≠",
  "equiv": "≡",
  "le": "≤",
  "ge": "≥",
  "sub": "⊂",
  "sup": "⊃",
  "nsub": "⊄",
  "sube": "⊆",
  "supe": "⊇",
  "oplus": "⊕",
  "otimes": "⊗",
  "perp": "⊥",
  "sdot": "⋅",
  "lceil": "⌈",
  "rceil": "⌉",
  "lfloor": "⌊",
  "rfloor": "⌋",
  "lang": "〈",
  "rang": "〉",
  "loz": "◊",
  "spades": "♠",
  "clubs": "♣",
  "hearts": "♥",
  "diams": "♦",
  "quot": "\"",
  "amp": "&",
  "lt": "<",
  "gt": ">",
  "OElig": "Œ",
  "oelig": "œ",
  "Scaron": "Š",
  "scaron": "š",
  "Yuml": "Ÿ",
  "circ": "ˆ",
  "tilde": "˜",
  "ensp": " ",
  "emsp": " ",
  "thinsp": " ",
  "zwnj": "‌",
  "zwj": "‍",
  "lrm": "‎",
  "rlm": "‏",
  "ndash": "–",
  "mdash": "—",
  "lsquo": "‘",
  "rsquo": "’",
  "sbquo": "‚",
  "ldquo": "“",
  "rdquo": "”",
  "bdquo": "„",
  "dagger": "†",
  "Dagger": "‡",
  "permil": "‰",
  "lsaquo": "‹",
  "rsaquo": "›",
  "euro": "€"
}

},{}],7:[function(require,module,exports){
module.exports={
  "AElig": "Æ",
  "AMP": "&",
  "Aacute": "Á",
  "Acirc": "Â",
  "Agrave": "À",
  "Aring": "Å",
  "Atilde": "Ã",
  "Auml": "Ä",
  "COPY": "©",
  "Ccedil": "Ç",
  "ETH": "Ð",
  "Eacute": "É",
  "Ecirc": "Ê",
  "Egrave": "È",
  "Euml": "Ë",
  "GT": ">",
  "Iacute": "Í",
  "Icirc": "Î",
  "Igrave": "Ì",
  "Iuml": "Ï",
  "LT": "<",
  "Ntilde": "Ñ",
  "Oacute": "Ó",
  "Ocirc": "Ô",
  "Ograve": "Ò",
  "Oslash": "Ø",
  "Otilde": "Õ",
  "Ouml": "Ö",
  "QUOT": "\"",
  "REG": "®",
  "THORN": "Þ",
  "Uacute": "Ú",
  "Ucirc": "Û",
  "Ugrave": "Ù",
  "Uuml": "Ü",
  "Yacute": "Ý",
  "aacute": "á",
  "acirc": "â",
  "acute": "´",
  "aelig": "æ",
  "agrave": "à",
  "amp": "&",
  "aring": "å",
  "atilde": "ã",
  "auml": "ä",
  "brvbar": "¦",
  "ccedil": "ç",
  "cedil": "¸",
  "cent": "¢",
  "copy": "©",
  "curren": "¤",
  "deg": "°",
  "divide": "÷",
  "eacute": "é",
  "ecirc": "ê",
  "egrave": "è",
  "eth": "ð",
  "euml": "ë",
  "frac12": "½",
  "frac14": "¼",
  "frac34": "¾",
  "gt": ">",
  "iacute": "í",
  "icirc": "î",
  "iexcl": "¡",
  "igrave": "ì",
  "iquest": "¿",
  "iuml": "ï",
  "laquo": "«",
  "lt": "<",
  "macr": "¯",
  "micro": "µ",
  "middot": "·",
  "nbsp": " ",
  "not": "¬",
  "ntilde": "ñ",
  "oacute": "ó",
  "ocirc": "ô",
  "ograve": "ò",
  "ordf": "ª",
  "ordm": "º",
  "oslash": "ø",
  "otilde": "õ",
  "ouml": "ö",
  "para": "¶",
  "plusmn": "±",
  "pound": "£",
  "quot": "\"",
  "raquo": "»",
  "reg": "®",
  "sect": "§",
  "shy": "­",
  "sup1": "¹",
  "sup2": "²",
  "sup3": "³",
  "szlig": "ß",
  "thorn": "þ",
  "times": "×",
  "uacute": "ú",
  "ucirc": "û",
  "ugrave": "ù",
  "uml": "¨",
  "uuml": "ü",
  "yacute": "ý",
  "yen": "¥",
  "yuml": "ÿ"
}

},{}],8:[function(require,module,exports){
module.exports={
  "AEli": "Æ",
  "AElig": "Æ",
  "AM": "&",
  "AMP": "&",
  "Aacut": "Á",
  "Aacute": "Á",
  "Abreve": "Ă",
  "Acir": "Â",
  "Acirc": "Â",
  "Acy": "А",
  "Afr": "𝔄",
  "Agrav": "À",
  "Agrave": "À",
  "Alpha": "Α",
  "Amacr": "Ā",
  "And": "⩓",
  "Aogon": "Ą",
  "Aopf": "𝔸",
  "ApplyFunction": "⁡",
  "Arin": "Å",
  "Aring": "Å",
  "Ascr": "𝒜",
  "Assign": "≔",
  "Atild": "Ã",
  "Atilde": "Ã",
  "Aum": "Ä",
  "Auml": "Ä",
  "Backslash": "∖",
  "Barv": "⫧",
  "Barwed": "⌆",
  "Bcy": "Б",
  "Because": "∵",
  "Bernoullis": "ℬ",
  "Beta": "Β",
  "Bfr": "𝔅",
  "Bopf": "𝔹",
  "Breve": "˘",
  "Bscr": "ℬ",
  "Bumpeq": "≎",
  "CHcy": "Ч",
  "COP": "©",
  "COPY": "©",
  "Cacute": "Ć",
  "Cap": "⋒",
  "CapitalDifferentialD": "ⅅ",
  "Cayleys": "ℭ",
  "Ccaron": "Č",
  "Ccedi": "Ç",
  "Ccedil": "Ç",
  "Ccirc": "Ĉ",
  "Cconint": "∰",
  "Cdot": "Ċ",
  "Cedilla": "¸",
  "CenterDot": "·",
  "Cfr": "ℭ",
  "Chi": "Χ",
  "CircleDot": "⊙",
  "CircleMinus": "⊖",
  "CirclePlus": "⊕",
  "CircleTimes": "⊗",
  "ClockwiseContourIntegral": "∲",
  "CloseCurlyDoubleQuote": "”",
  "CloseCurlyQuote": "’",
  "Colon": "∷",
  "Colone": "⩴",
  "Congruent": "≡",
  "Conint": "∯",
  "ContourIntegral": "∮",
  "Copf": "ℂ",
  "Coproduct": "∐",
  "CounterClockwiseContourIntegral": "∳",
  "Cross": "⨯",
  "Cscr": "𝒞",
  "Cup": "⋓",
  "CupCap": "≍",
  "DD": "ⅅ",
  "DDotrahd": "⤑",
  "DJcy": "Ђ",
  "DScy": "Ѕ",
  "DZcy": "Џ",
  "Dagger": "‡",
  "Darr": "↡",
  "Dashv": "⫤",
  "Dcaron": "Ď",
  "Dcy": "Д",
  "Del": "∇",
  "Delta": "Δ",
  "Dfr": "𝔇",
  "DiacriticalAcute": "´",
  "DiacriticalDot": "˙",
  "DiacriticalDoubleAcute": "˝",
  "DiacriticalGrave": "`",
  "DiacriticalTilde": "˜",
  "Diamond": "⋄",
  "DifferentialD": "ⅆ",
  "Dopf": "𝔻",
  "Dot": "¨",
  "DotDot": "⃜",
  "DotEqual": "≐",
  "DoubleContourIntegral": "∯",
  "DoubleDot": "¨",
  "DoubleDownArrow": "⇓",
  "DoubleLeftArrow": "⇐",
  "DoubleLeftRightArrow": "⇔",
  "DoubleLeftTee": "⫤",
  "DoubleLongLeftArrow": "⟸",
  "DoubleLongLeftRightArrow": "⟺",
  "DoubleLongRightArrow": "⟹",
  "DoubleRightArrow": "⇒",
  "DoubleRightTee": "⊨",
  "DoubleUpArrow": "⇑",
  "DoubleUpDownArrow": "⇕",
  "DoubleVerticalBar": "∥",
  "DownArrow": "↓",
  "DownArrowBar": "⤓",
  "DownArrowUpArrow": "⇵",
  "DownBreve": "̑",
  "DownLeftRightVector": "⥐",
  "DownLeftTeeVector": "⥞",
  "DownLeftVector": "↽",
  "DownLeftVectorBar": "⥖",
  "DownRightTeeVector": "⥟",
  "DownRightVector": "⇁",
  "DownRightVectorBar": "⥗",
  "DownTee": "⊤",
  "DownTeeArrow": "↧",
  "Downarrow": "⇓",
  "Dscr": "𝒟",
  "Dstrok": "Đ",
  "ENG": "Ŋ",
  "ET": "Ð",
  "ETH": "Ð",
  "Eacut": "É",
  "Eacute": "É",
  "Ecaron": "Ě",
  "Ecir": "Ê",
  "Ecirc": "Ê",
  "Ecy": "Э",
  "Edot": "Ė",
  "Efr": "𝔈",
  "Egrav": "È",
  "Egrave": "È",
  "Element": "∈",
  "Emacr": "Ē",
  "EmptySmallSquare": "◻",
  "EmptyVerySmallSquare": "▫",
  "Eogon": "Ę",
  "Eopf": "𝔼",
  "Epsilon": "Ε",
  "Equal": "⩵",
  "EqualTilde": "≂",
  "Equilibrium": "⇌",
  "Escr": "ℰ",
  "Esim": "⩳",
  "Eta": "Η",
  "Eum": "Ë",
  "Euml": "Ë",
  "Exists": "∃",
  "ExponentialE": "ⅇ",
  "Fcy": "Ф",
  "Ffr": "𝔉",
  "FilledSmallSquare": "◼",
  "FilledVerySmallSquare": "▪",
  "Fopf": "𝔽",
  "ForAll": "∀",
  "Fouriertrf": "ℱ",
  "Fscr": "ℱ",
  "GJcy": "Ѓ",
  "G": ">",
  "GT": ">",
  "Gamma": "Γ",
  "Gammad": "Ϝ",
  "Gbreve": "Ğ",
  "Gcedil": "Ģ",
  "Gcirc": "Ĝ",
  "Gcy": "Г",
  "Gdot": "Ġ",
  "Gfr": "𝔊",
  "Gg": "⋙",
  "Gopf": "𝔾",
  "GreaterEqual": "≥",
  "GreaterEqualLess": "⋛",
  "GreaterFullEqual": "≧",
  "GreaterGreater": "⪢",
  "GreaterLess": "≷",
  "GreaterSlantEqual": "⩾",
  "GreaterTilde": "≳",
  "Gscr": "𝒢",
  "Gt": "≫",
  "HARDcy": "Ъ",
  "Hacek": "ˇ",
  "Hat": "^",
  "Hcirc": "Ĥ",
  "Hfr": "ℌ",
  "HilbertSpace": "ℋ",
  "Hopf": "ℍ",
  "HorizontalLine": "─",
  "Hscr": "ℋ",
  "Hstrok": "Ħ",
  "HumpDownHump": "≎",
  "HumpEqual": "≏",
  "IEcy": "Е",
  "IJlig": "Ĳ",
  "IOcy": "Ё",
  "Iacut": "Í",
  "Iacute": "Í",
  "Icir": "Î",
  "Icirc": "Î",
  "Icy": "И",
  "Idot": "İ",
  "Ifr": "ℑ",
  "Igrav": "Ì",
  "Igrave": "Ì",
  "Im": "ℑ",
  "Imacr": "Ī",
  "ImaginaryI": "ⅈ",
  "Implies": "⇒",
  "Int": "∬",
  "Integral": "∫",
  "Intersection": "⋂",
  "InvisibleComma": "⁣",
  "InvisibleTimes": "⁢",
  "Iogon": "Į",
  "Iopf": "𝕀",
  "Iota": "Ι",
  "Iscr": "ℐ",
  "Itilde": "Ĩ",
  "Iukcy": "І",
  "Ium": "Ï",
  "Iuml": "Ï",
  "Jcirc": "Ĵ",
  "Jcy": "Й",
  "Jfr": "𝔍",
  "Jopf": "𝕁",
  "Jscr": "𝒥",
  "Jsercy": "Ј",
  "Jukcy": "Є",
  "KHcy": "Х",
  "KJcy": "Ќ",
  "Kappa": "Κ",
  "Kcedil": "Ķ",
  "Kcy": "К",
  "Kfr": "𝔎",
  "Kopf": "𝕂",
  "Kscr": "𝒦",
  "LJcy": "Љ",
  "L": "<",
  "LT": "<",
  "Lacute": "Ĺ",
  "Lambda": "Λ",
  "Lang": "⟪",
  "Laplacetrf": "ℒ",
  "Larr": "↞",
  "Lcaron": "Ľ",
  "Lcedil": "Ļ",
  "Lcy": "Л",
  "LeftAngleBracket": "⟨",
  "LeftArrow": "←",
  "LeftArrowBar": "⇤",
  "LeftArrowRightArrow": "⇆",
  "LeftCeiling": "⌈",
  "LeftDoubleBracket": "⟦",
  "LeftDownTeeVector": "⥡",
  "LeftDownVector": "⇃",
  "LeftDownVectorBar": "⥙",
  "LeftFloor": "⌊",
  "LeftRightArrow": "↔",
  "LeftRightVector": "⥎",
  "LeftTee": "⊣",
  "LeftTeeArrow": "↤",
  "LeftTeeVector": "⥚",
  "LeftTriangle": "⊲",
  "LeftTriangleBar": "⧏",
  "LeftTriangleEqual": "⊴",
  "LeftUpDownVector": "⥑",
  "LeftUpTeeVector": "⥠",
  "LeftUpVector": "↿",
  "LeftUpVectorBar": "⥘",
  "LeftVector": "↼",
  "LeftVectorBar": "⥒",
  "Leftarrow": "⇐",
  "Leftrightarrow": "⇔",
  "LessEqualGreater": "⋚",
  "LessFullEqual": "≦",
  "LessGreater": "≶",
  "LessLess": "⪡",
  "LessSlantEqual": "⩽",
  "LessTilde": "≲",
  "Lfr": "𝔏",
  "Ll": "⋘",
  "Lleftarrow": "⇚",
  "Lmidot": "Ŀ",
  "LongLeftArrow": "⟵",
  "LongLeftRightArrow": "⟷",
  "LongRightArrow": "⟶",
  "Longleftarrow": "⟸",
  "Longleftrightarrow": "⟺",
  "Longrightarrow": "⟹",
  "Lopf": "𝕃",
  "LowerLeftArrow": "↙",
  "LowerRightArrow": "↘",
  "Lscr": "ℒ",
  "Lsh": "↰",
  "Lstrok": "Ł",
  "Lt": "≪",
  "Map": "⤅",
  "Mcy": "М",
  "MediumSpace": " ",
  "Mellintrf": "ℳ",
  "Mfr": "𝔐",
  "MinusPlus": "∓",
  "Mopf": "𝕄",
  "Mscr": "ℳ",
  "Mu": "Μ",
  "NJcy": "Њ",
  "Nacute": "Ń",
  "Ncaron": "Ň",
  "Ncedil": "Ņ",
  "Ncy": "Н",
  "NegativeMediumSpace": "​",
  "NegativeThickSpace": "​",
  "NegativeThinSpace": "​",
  "NegativeVeryThinSpace": "​",
  "NestedGreaterGreater": "≫",
  "NestedLessLess": "≪",
  "NewLine": "\n",
  "Nfr": "𝔑",
  "NoBreak": "⁠",
  "NonBreakingSpace": " ",
  "Nopf": "ℕ",
  "Not": "⫬",
  "NotCongruent": "≢",
  "NotCupCap": "≭",
  "NotDoubleVerticalBar": "∦",
  "NotElement": "∉",
  "NotEqual": "≠",
  "NotEqualTilde": "≂̸",
  "NotExists": "∄",
  "NotGreater": "≯",
  "NotGreaterEqual": "≱",
  "NotGreaterFullEqual": "≧̸",
  "NotGreaterGreater": "≫̸",
  "NotGreaterLess": "≹",
  "NotGreaterSlantEqual": "⩾̸",
  "NotGreaterTilde": "≵",
  "NotHumpDownHump": "≎̸",
  "NotHumpEqual": "≏̸",
  "NotLeftTriangle": "⋪",
  "NotLeftTriangleBar": "⧏̸",
  "NotLeftTriangleEqual": "⋬",
  "NotLess": "≮",
  "NotLessEqual": "≰",
  "NotLessGreater": "≸",
  "NotLessLess": "≪̸",
  "NotLessSlantEqual": "⩽̸",
  "NotLessTilde": "≴",
  "NotNestedGreaterGreater": "⪢̸",
  "NotNestedLessLess": "⪡̸",
  "NotPrecedes": "⊀",
  "NotPrecedesEqual": "⪯̸",
  "NotPrecedesSlantEqual": "⋠",
  "NotReverseElement": "∌",
  "NotRightTriangle": "⋫",
  "NotRightTriangleBar": "⧐̸",
  "NotRightTriangleEqual": "⋭",
  "NotSquareSubset": "⊏̸",
  "NotSquareSubsetEqual": "⋢",
  "NotSquareSuperset": "⊐̸",
  "NotSquareSupersetEqual": "⋣",
  "NotSubset": "⊂⃒",
  "NotSubsetEqual": "⊈",
  "NotSucceeds": "⊁",
  "NotSucceedsEqual": "⪰̸",
  "NotSucceedsSlantEqual": "⋡",
  "NotSucceedsTilde": "≿̸",
  "NotSuperset": "⊃⃒",
  "NotSupersetEqual": "⊉",
  "NotTilde": "≁",
  "NotTildeEqual": "≄",
  "NotTildeFullEqual": "≇",
  "NotTildeTilde": "≉",
  "NotVerticalBar": "∤",
  "Nscr": "𝒩",
  "Ntild": "Ñ",
  "Ntilde": "Ñ",
  "Nu": "Ν",
  "OElig": "Œ",
  "Oacut": "Ó",
  "Oacute": "Ó",
  "Ocir": "Ô",
  "Ocirc": "Ô",
  "Ocy": "О",
  "Odblac": "Ő",
  "Ofr": "𝔒",
  "Ograv": "Ò",
  "Ograve": "Ò",
  "Omacr": "Ō",
  "Omega": "Ω",
  "Omicron": "Ο",
  "Oopf": "𝕆",
  "OpenCurlyDoubleQuote": "“",
  "OpenCurlyQuote": "‘",
  "Or": "⩔",
  "Oscr": "𝒪",
  "Oslas": "Ø",
  "Oslash": "Ø",
  "Otild": "Õ",
  "Otilde": "Õ",
  "Otimes": "⨷",
  "Oum": "Ö",
  "Ouml": "Ö",
  "OverBar": "‾",
  "OverBrace": "⏞",
  "OverBracket": "⎴",
  "OverParenthesis": "⏜",
  "PartialD": "∂",
  "Pcy": "П",
  "Pfr": "𝔓",
  "Phi": "Φ",
  "Pi": "Π",
  "PlusMinus": "±",
  "Poincareplane": "ℌ",
  "Popf": "ℙ",
  "Pr": "⪻",
  "Precedes": "≺",
  "PrecedesEqual": "⪯",
  "PrecedesSlantEqual": "≼",
  "PrecedesTilde": "≾",
  "Prime": "″",
  "Product": "∏",
  "Proportion": "∷",
  "Proportional": "∝",
  "Pscr": "𝒫",
  "Psi": "Ψ",
  "QUO": "\"",
  "QUOT": "\"",
  "Qfr": "𝔔",
  "Qopf": "ℚ",
  "Qscr": "𝒬",
  "RBarr": "⤐",
  "RE": "®",
  "REG": "®",
  "Racute": "Ŕ",
  "Rang": "⟫",
  "Rarr": "↠",
  "Rarrtl": "⤖",
  "Rcaron": "Ř",
  "Rcedil": "Ŗ",
  "Rcy": "Р",
  "Re": "ℜ",
  "ReverseElement": "∋",
  "ReverseEquilibrium": "⇋",
  "ReverseUpEquilibrium": "⥯",
  "Rfr": "ℜ",
  "Rho": "Ρ",
  "RightAngleBracket": "⟩",
  "RightArrow": "→",
  "RightArrowBar": "⇥",
  "RightArrowLeftArrow": "⇄",
  "RightCeiling": "⌉",
  "RightDoubleBracket": "⟧",
  "RightDownTeeVector": "⥝",
  "RightDownVector": "⇂",
  "RightDownVectorBar": "⥕",
  "RightFloor": "⌋",
  "RightTee": "⊢",
  "RightTeeArrow": "↦",
  "RightTeeVector": "⥛",
  "RightTriangle": "⊳",
  "RightTriangleBar": "⧐",
  "RightTriangleEqual": "⊵",
  "RightUpDownVector": "⥏",
  "RightUpTeeVector": "⥜",
  "RightUpVector": "↾",
  "RightUpVectorBar": "⥔",
  "RightVector": "⇀",
  "RightVectorBar": "⥓",
  "Rightarrow": "⇒",
  "Ropf": "ℝ",
  "RoundImplies": "⥰",
  "Rrightarrow": "⇛",
  "Rscr": "ℛ",
  "Rsh": "↱",
  "RuleDelayed": "⧴",
  "SHCHcy": "Щ",
  "SHcy": "Ш",
  "SOFTcy": "Ь",
  "Sacute": "Ś",
  "Sc": "⪼",
  "Scaron": "Š",
  "Scedil": "Ş",
  "Scirc": "Ŝ",
  "Scy": "С",
  "Sfr": "𝔖",
  "ShortDownArrow": "↓",
  "ShortLeftArrow": "←",
  "ShortRightArrow": "→",
  "ShortUpArrow": "↑",
  "Sigma": "Σ",
  "SmallCircle": "∘",
  "Sopf": "𝕊",
  "Sqrt": "√",
  "Square": "□",
  "SquareIntersection": "⊓",
  "SquareSubset": "⊏",
  "SquareSubsetEqual": "⊑",
  "SquareSuperset": "⊐",
  "SquareSupersetEqual": "⊒",
  "SquareUnion": "⊔",
  "Sscr": "𝒮",
  "Star": "⋆",
  "Sub": "⋐",
  "Subset": "⋐",
  "SubsetEqual": "⊆",
  "Succeeds": "≻",
  "SucceedsEqual": "⪰",
  "SucceedsSlantEqual": "≽",
  "SucceedsTilde": "≿",
  "SuchThat": "∋",
  "Sum": "∑",
  "Sup": "⋑",
  "Superset": "⊃",
  "SupersetEqual": "⊇",
  "Supset": "⋑",
  "THOR": "Þ",
  "THORN": "Þ",
  "TRADE": "™",
  "TSHcy": "Ћ",
  "TScy": "Ц",
  "Tab": "\t",
  "Tau": "Τ",
  "Tcaron": "Ť",
  "Tcedil": "Ţ",
  "Tcy": "Т",
  "Tfr": "𝔗",
  "Therefore": "∴",
  "Theta": "Θ",
  "ThickSpace": "  ",
  "ThinSpace": " ",
  "Tilde": "∼",
  "TildeEqual": "≃",
  "TildeFullEqual": "≅",
  "TildeTilde": "≈",
  "Topf": "𝕋",
  "TripleDot": "⃛",
  "Tscr": "𝒯",
  "Tstrok": "Ŧ",
  "Uacut": "Ú",
  "Uacute": "Ú",
  "Uarr": "↟",
  "Uarrocir": "⥉",
  "Ubrcy": "Ў",
  "Ubreve": "Ŭ",
  "Ucir": "Û",
  "Ucirc": "Û",
  "Ucy": "У",
  "Udblac": "Ű",
  "Ufr": "𝔘",
  "Ugrav": "Ù",
  "Ugrave": "Ù",
  "Umacr": "Ū",
  "UnderBar": "_",
  "UnderBrace": "⏟",
  "UnderBracket": "⎵",
  "UnderParenthesis": "⏝",
  "Union": "⋃",
  "UnionPlus": "⊎",
  "Uogon": "Ų",
  "Uopf": "𝕌",
  "UpArrow": "↑",
  "UpArrowBar": "⤒",
  "UpArrowDownArrow": "⇅",
  "UpDownArrow": "↕",
  "UpEquilibrium": "⥮",
  "UpTee": "⊥",
  "UpTeeArrow": "↥",
  "Uparrow": "⇑",
  "Updownarrow": "⇕",
  "UpperLeftArrow": "↖",
  "UpperRightArrow": "↗",
  "Upsi": "ϒ",
  "Upsilon": "Υ",
  "Uring": "Ů",
  "Uscr": "𝒰",
  "Utilde": "Ũ",
  "Uum": "Ü",
  "Uuml": "Ü",
  "VDash": "⊫",
  "Vbar": "⫫",
  "Vcy": "В",
  "Vdash": "⊩",
  "Vdashl": "⫦",
  "Vee": "⋁",
  "Verbar": "‖",
  "Vert": "‖",
  "VerticalBar": "∣",
  "VerticalLine": "|",
  "VerticalSeparator": "❘",
  "VerticalTilde": "≀",
  "VeryThinSpace": " ",
  "Vfr": "𝔙",
  "Vopf": "𝕍",
  "Vscr": "𝒱",
  "Vvdash": "⊪",
  "Wcirc": "Ŵ",
  "Wedge": "⋀",
  "Wfr": "𝔚",
  "Wopf": "𝕎",
  "Wscr": "𝒲",
  "Xfr": "𝔛",
  "Xi": "Ξ",
  "Xopf": "𝕏",
  "Xscr": "𝒳",
  "YAcy": "Я",
  "YIcy": "Ї",
  "YUcy": "Ю",
  "Yacut": "Ý",
  "Yacute": "Ý",
  "Ycirc": "Ŷ",
  "Ycy": "Ы",
  "Yfr": "𝔜",
  "Yopf": "𝕐",
  "Yscr": "𝒴",
  "Yuml": "Ÿ",
  "ZHcy": "Ж",
  "Zacute": "Ź",
  "Zcaron": "Ž",
  "Zcy": "З",
  "Zdot": "Ż",
  "ZeroWidthSpace": "​",
  "Zeta": "Ζ",
  "Zfr": "ℨ",
  "Zopf": "ℤ",
  "Zscr": "𝒵",
  "aacut": "á",
  "aacute": "á",
  "abreve": "ă",
  "ac": "∾",
  "acE": "∾̳",
  "acd": "∿",
  "acir": "â",
  "acirc": "â",
  "acut": "´",
  "acute": "´",
  "acy": "а",
  "aeli": "æ",
  "aelig": "æ",
  "af": "⁡",
  "afr": "𝔞",
  "agrav": "à",
  "agrave": "à",
  "alefsym": "ℵ",
  "aleph": "ℵ",
  "alpha": "α",
  "amacr": "ā",
  "amalg": "⨿",
  "am": "&",
  "amp": "&",
  "and": "∧",
  "andand": "⩕",
  "andd": "⩜",
  "andslope": "⩘",
  "andv": "⩚",
  "ang": "∠",
  "ange": "⦤",
  "angle": "∠",
  "angmsd": "∡",
  "angmsdaa": "⦨",
  "angmsdab": "⦩",
  "angmsdac": "⦪",
  "angmsdad": "⦫",
  "angmsdae": "⦬",
  "angmsdaf": "⦭",
  "angmsdag": "⦮",
  "angmsdah": "⦯",
  "angrt": "∟",
  "angrtvb": "⊾",
  "angrtvbd": "⦝",
  "angsph": "∢",
  "angst": "Å",
  "angzarr": "⍼",
  "aogon": "ą",
  "aopf": "𝕒",
  "ap": "≈",
  "apE": "⩰",
  "apacir": "⩯",
  "ape": "≊",
  "apid": "≋",
  "apos": "'",
  "approx": "≈",
  "approxeq": "≊",
  "arin": "å",
  "aring": "å",
  "ascr": "𝒶",
  "ast": "*",
  "asymp": "≈",
  "asympeq": "≍",
  "atild": "ã",
  "atilde": "ã",
  "aum": "ä",
  "auml": "ä",
  "awconint": "∳",
  "awint": "⨑",
  "bNot": "⫭",
  "backcong": "≌",
  "backepsilon": "϶",
  "backprime": "‵",
  "backsim": "∽",
  "backsimeq": "⋍",
  "barvee": "⊽",
  "barwed": "⌅",
  "barwedge": "⌅",
  "bbrk": "⎵",
  "bbrktbrk": "⎶",
  "bcong": "≌",
  "bcy": "б",
  "bdquo": "„",
  "becaus": "∵",
  "because": "∵",
  "bemptyv": "⦰",
  "bepsi": "϶",
  "bernou": "ℬ",
  "beta": "β",
  "beth": "ℶ",
  "between": "≬",
  "bfr": "𝔟",
  "bigcap": "⋂",
  "bigcirc": "◯",
  "bigcup": "⋃",
  "bigodot": "⨀",
  "bigoplus": "⨁",
  "bigotimes": "⨂",
  "bigsqcup": "⨆",
  "bigstar": "★",
  "bigtriangledown": "▽",
  "bigtriangleup": "△",
  "biguplus": "⨄",
  "bigvee": "⋁",
  "bigwedge": "⋀",
  "bkarow": "⤍",
  "blacklozenge": "⧫",
  "blacksquare": "▪",
  "blacktriangle": "▴",
  "blacktriangledown": "▾",
  "blacktriangleleft": "◂",
  "blacktriangleright": "▸",
  "blank": "␣",
  "blk12": "▒",
  "blk14": "░",
  "blk34": "▓",
  "block": "█",
  "bne": "=⃥",
  "bnequiv": "≡⃥",
  "bnot": "⌐",
  "bopf": "𝕓",
  "bot": "⊥",
  "bottom": "⊥",
  "bowtie": "⋈",
  "boxDL": "╗",
  "boxDR": "╔",
  "boxDl": "╖",
  "boxDr": "╓",
  "boxH": "═",
  "boxHD": "╦",
  "boxHU": "╩",
  "boxHd": "╤",
  "boxHu": "╧",
  "boxUL": "╝",
  "boxUR": "╚",
  "boxUl": "╜",
  "boxUr": "╙",
  "boxV": "║",
  "boxVH": "╬",
  "boxVL": "╣",
  "boxVR": "╠",
  "boxVh": "╫",
  "boxVl": "╢",
  "boxVr": "╟",
  "boxbox": "⧉",
  "boxdL": "╕",
  "boxdR": "╒",
  "boxdl": "┐",
  "boxdr": "┌",
  "boxh": "─",
  "boxhD": "╥",
  "boxhU": "╨",
  "boxhd": "┬",
  "boxhu": "┴",
  "boxminus": "⊟",
  "boxplus": "⊞",
  "boxtimes": "⊠",
  "boxuL": "╛",
  "boxuR": "╘",
  "boxul": "┘",
  "boxur": "└",
  "boxv": "│",
  "boxvH": "╪",
  "boxvL": "╡",
  "boxvR": "╞",
  "boxvh": "┼",
  "boxvl": "┤",
  "boxvr": "├",
  "bprime": "‵",
  "breve": "˘",
  "brvba": "¦",
  "brvbar": "¦",
  "bscr": "𝒷",
  "bsemi": "⁏",
  "bsim": "∽",
  "bsime": "⋍",
  "bsol": "\\",
  "bsolb": "⧅",
  "bsolhsub": "⟈",
  "bull": "•",
  "bullet": "•",
  "bump": "≎",
  "bumpE": "⪮",
  "bumpe": "≏",
  "bumpeq": "≏",
  "cacute": "ć",
  "cap": "∩",
  "capand": "⩄",
  "capbrcup": "⩉",
  "capcap": "⩋",
  "capcup": "⩇",
  "capdot": "⩀",
  "caps": "∩︀",
  "caret": "⁁",
  "caron": "ˇ",
  "ccaps": "⩍",
  "ccaron": "č",
  "ccedi": "ç",
  "ccedil": "ç",
  "ccirc": "ĉ",
  "ccups": "⩌",
  "ccupssm": "⩐",
  "cdot": "ċ",
  "cedi": "¸",
  "cedil": "¸",
  "cemptyv": "⦲",
  "cen": "¢",
  "cent": "¢",
  "centerdot": "·",
  "cfr": "𝔠",
  "chcy": "ч",
  "check": "✓",
  "checkmark": "✓",
  "chi": "χ",
  "cir": "○",
  "cirE": "⧃",
  "circ": "ˆ",
  "circeq": "≗",
  "circlearrowleft": "↺",
  "circlearrowright": "↻",
  "circledR": "®",
  "circledS": "Ⓢ",
  "circledast": "⊛",
  "circledcirc": "⊚",
  "circleddash": "⊝",
  "cire": "≗",
  "cirfnint": "⨐",
  "cirmid": "⫯",
  "cirscir": "⧂",
  "clubs": "♣",
  "clubsuit": "♣",
  "colon": ":",
  "colone": "≔",
  "coloneq": "≔",
  "comma": ",",
  "commat": "@",
  "comp": "∁",
  "compfn": "∘",
  "complement": "∁",
  "complexes": "ℂ",
  "cong": "≅",
  "congdot": "⩭",
  "conint": "∮",
  "copf": "𝕔",
  "coprod": "∐",
  "cop": "©",
  "copy": "©",
  "copysr": "℗",
  "crarr": "↵",
  "cross": "✗",
  "cscr": "𝒸",
  "csub": "⫏",
  "csube": "⫑",
  "csup": "⫐",
  "csupe": "⫒",
  "ctdot": "⋯",
  "cudarrl": "⤸",
  "cudarrr": "⤵",
  "cuepr": "⋞",
  "cuesc": "⋟",
  "cularr": "↶",
  "cularrp": "⤽",
  "cup": "∪",
  "cupbrcap": "⩈",
  "cupcap": "⩆",
  "cupcup": "⩊",
  "cupdot": "⊍",
  "cupor": "⩅",
  "cups": "∪︀",
  "curarr": "↷",
  "curarrm": "⤼",
  "curlyeqprec": "⋞",
  "curlyeqsucc": "⋟",
  "curlyvee": "⋎",
  "curlywedge": "⋏",
  "curre": "¤",
  "curren": "¤",
  "curvearrowleft": "↶",
  "curvearrowright": "↷",
  "cuvee": "⋎",
  "cuwed": "⋏",
  "cwconint": "∲",
  "cwint": "∱",
  "cylcty": "⌭",
  "dArr": "⇓",
  "dHar": "⥥",
  "dagger": "†",
  "daleth": "ℸ",
  "darr": "↓",
  "dash": "‐",
  "dashv": "⊣",
  "dbkarow": "⤏",
  "dblac": "˝",
  "dcaron": "ď",
  "dcy": "д",
  "dd": "ⅆ",
  "ddagger": "‡",
  "ddarr": "⇊",
  "ddotseq": "⩷",
  "de": "°",
  "deg": "°",
  "delta": "δ",
  "demptyv": "⦱",
  "dfisht": "⥿",
  "dfr": "𝔡",
  "dharl": "⇃",
  "dharr": "⇂",
  "diam": "⋄",
  "diamond": "⋄",
  "diamondsuit": "♦",
  "diams": "♦",
  "die": "¨",
  "digamma": "ϝ",
  "disin": "⋲",
  "div": "÷",
  "divid": "÷",
  "divide": "÷",
  "divideontimes": "⋇",
  "divonx": "⋇",
  "djcy": "ђ",
  "dlcorn": "⌞",
  "dlcrop": "⌍",
  "dollar": "$",
  "dopf": "𝕕",
  "dot": "˙",
  "doteq": "≐",
  "doteqdot": "≑",
  "dotminus": "∸",
  "dotplus": "∔",
  "dotsquare": "⊡",
  "doublebarwedge": "⌆",
  "downarrow": "↓",
  "downdownarrows": "⇊",
  "downharpoonleft": "⇃",
  "downharpoonright": "⇂",
  "drbkarow": "⤐",
  "drcorn": "⌟",
  "drcrop": "⌌",
  "dscr": "𝒹",
  "dscy": "ѕ",
  "dsol": "⧶",
  "dstrok": "đ",
  "dtdot": "⋱",
  "dtri": "▿",
  "dtrif": "▾",
  "duarr": "⇵",
  "duhar": "⥯",
  "dwangle": "⦦",
  "dzcy": "џ",
  "dzigrarr": "⟿",
  "eDDot": "⩷",
  "eDot": "≑",
  "eacut": "é",
  "eacute": "é",
  "easter": "⩮",
  "ecaron": "ě",
  "ecir": "ê",
  "ecirc": "ê",
  "ecolon": "≕",
  "ecy": "э",
  "edot": "ė",
  "ee": "ⅇ",
  "efDot": "≒",
  "efr": "𝔢",
  "eg": "⪚",
  "egrav": "è",
  "egrave": "è",
  "egs": "⪖",
  "egsdot": "⪘",
  "el": "⪙",
  "elinters": "⏧",
  "ell": "ℓ",
  "els": "⪕",
  "elsdot": "⪗",
  "emacr": "ē",
  "empty": "∅",
  "emptyset": "∅",
  "emptyv": "∅",
  "emsp13": " ",
  "emsp14": " ",
  "emsp": " ",
  "eng": "ŋ",
  "ensp": " ",
  "eogon": "ę",
  "eopf": "𝕖",
  "epar": "⋕",
  "eparsl": "⧣",
  "eplus": "⩱",
  "epsi": "ε",
  "epsilon": "ε",
  "epsiv": "ϵ",
  "eqcirc": "≖",
  "eqcolon": "≕",
  "eqsim": "≂",
  "eqslantgtr": "⪖",
  "eqslantless": "⪕",
  "equals": "=",
  "equest": "≟",
  "equiv": "≡",
  "equivDD": "⩸",
  "eqvparsl": "⧥",
  "erDot": "≓",
  "erarr": "⥱",
  "escr": "ℯ",
  "esdot": "≐",
  "esim": "≂",
  "eta": "η",
  "et": "ð",
  "eth": "ð",
  "eum": "ë",
  "euml": "ë",
  "euro": "€",
  "excl": "!",
  "exist": "∃",
  "expectation": "ℰ",
  "exponentiale": "ⅇ",
  "fallingdotseq": "≒",
  "fcy": "ф",
  "female": "♀",
  "ffilig": "ﬃ",
  "fflig": "ﬀ",
  "ffllig": "ﬄ",
  "ffr": "𝔣",
  "filig": "ﬁ",
  "fjlig": "fj",
  "flat": "♭",
  "fllig": "ﬂ",
  "fltns": "▱",
  "fnof": "ƒ",
  "fopf": "𝕗",
  "forall": "∀",
  "fork": "⋔",
  "forkv": "⫙",
  "fpartint": "⨍",
  "frac1": "¼",
  "frac12": "½",
  "frac13": "⅓",
  "frac14": "¼",
  "frac15": "⅕",
  "frac16": "⅙",
  "frac18": "⅛",
  "frac23": "⅔",
  "frac25": "⅖",
  "frac3": "¾",
  "frac34": "¾",
  "frac35": "⅗",
  "frac38": "⅜",
  "frac45": "⅘",
  "frac56": "⅚",
  "frac58": "⅝",
  "frac78": "⅞",
  "frasl": "⁄",
  "frown": "⌢",
  "fscr": "𝒻",
  "gE": "≧",
  "gEl": "⪌",
  "gacute": "ǵ",
  "gamma": "γ",
  "gammad": "ϝ",
  "gap": "⪆",
  "gbreve": "ğ",
  "gcirc": "ĝ",
  "gcy": "г",
  "gdot": "ġ",
  "ge": "≥",
  "gel": "⋛",
  "geq": "≥",
  "geqq": "≧",
  "geqslant": "⩾",
  "ges": "⩾",
  "gescc": "⪩",
  "gesdot": "⪀",
  "gesdoto": "⪂",
  "gesdotol": "⪄",
  "gesl": "⋛︀",
  "gesles": "⪔",
  "gfr": "𝔤",
  "gg": "≫",
  "ggg": "⋙",
  "gimel": "ℷ",
  "gjcy": "ѓ",
  "gl": "≷",
  "glE": "⪒",
  "gla": "⪥",
  "glj": "⪤",
  "gnE": "≩",
  "gnap": "⪊",
  "gnapprox": "⪊",
  "gne": "⪈",
  "gneq": "⪈",
  "gneqq": "≩",
  "gnsim": "⋧",
  "gopf": "𝕘",
  "grave": "`",
  "gscr": "ℊ",
  "gsim": "≳",
  "gsime": "⪎",
  "gsiml": "⪐",
  "g": ">",
  "gt": ">",
  "gtcc": "⪧",
  "gtcir": "⩺",
  "gtdot": "⋗",
  "gtlPar": "⦕",
  "gtquest": "⩼",
  "gtrapprox": "⪆",
  "gtrarr": "⥸",
  "gtrdot": "⋗",
  "gtreqless": "⋛",
  "gtreqqless": "⪌",
  "gtrless": "≷",
  "gtrsim": "≳",
  "gvertneqq": "≩︀",
  "gvnE": "≩︀",
  "hArr": "⇔",
  "hairsp": " ",
  "half": "½",
  "hamilt": "ℋ",
  "hardcy": "ъ",
  "harr": "↔",
  "harrcir": "⥈",
  "harrw": "↭",
  "hbar": "ℏ",
  "hcirc": "ĥ",
  "hearts": "♥",
  "heartsuit": "♥",
  "hellip": "…",
  "hercon": "⊹",
  "hfr": "𝔥",
  "hksearow": "⤥",
  "hkswarow": "⤦",
  "hoarr": "⇿",
  "homtht": "∻",
  "hookleftarrow": "↩",
  "hookrightarrow": "↪",
  "hopf": "𝕙",
  "horbar": "―",
  "hscr": "𝒽",
  "hslash": "ℏ",
  "hstrok": "ħ",
  "hybull": "⁃",
  "hyphen": "‐",
  "iacut": "í",
  "iacute": "í",
  "ic": "⁣",
  "icir": "î",
  "icirc": "î",
  "icy": "и",
  "iecy": "е",
  "iexc": "¡",
  "iexcl": "¡",
  "iff": "⇔",
  "ifr": "𝔦",
  "igrav": "ì",
  "igrave": "ì",
  "ii": "ⅈ",
  "iiiint": "⨌",
  "iiint": "∭",
  "iinfin": "⧜",
  "iiota": "℩",
  "ijlig": "ĳ",
  "imacr": "ī",
  "image": "ℑ",
  "imagline": "ℐ",
  "imagpart": "ℑ",
  "imath": "ı",
  "imof": "⊷",
  "imped": "Ƶ",
  "in": "∈",
  "incare": "℅",
  "infin": "∞",
  "infintie": "⧝",
  "inodot": "ı",
  "int": "∫",
  "intcal": "⊺",
  "integers": "ℤ",
  "intercal": "⊺",
  "intlarhk": "⨗",
  "intprod": "⨼",
  "iocy": "ё",
  "iogon": "į",
  "iopf": "𝕚",
  "iota": "ι",
  "iprod": "⨼",
  "iques": "¿",
  "iquest": "¿",
  "iscr": "𝒾",
  "isin": "∈",
  "isinE": "⋹",
  "isindot": "⋵",
  "isins": "⋴",
  "isinsv": "⋳",
  "isinv": "∈",
  "it": "⁢",
  "itilde": "ĩ",
  "iukcy": "і",
  "ium": "ï",
  "iuml": "ï",
  "jcirc": "ĵ",
  "jcy": "й",
  "jfr": "𝔧",
  "jmath": "ȷ",
  "jopf": "𝕛",
  "jscr": "𝒿",
  "jsercy": "ј",
  "jukcy": "є",
  "kappa": "κ",
  "kappav": "ϰ",
  "kcedil": "ķ",
  "kcy": "к",
  "kfr": "𝔨",
  "kgreen": "ĸ",
  "khcy": "х",
  "kjcy": "ќ",
  "kopf": "𝕜",
  "kscr": "𝓀",
  "lAarr": "⇚",
  "lArr": "⇐",
  "lAtail": "⤛",
  "lBarr": "⤎",
  "lE": "≦",
  "lEg": "⪋",
  "lHar": "⥢",
  "lacute": "ĺ",
  "laemptyv": "⦴",
  "lagran": "ℒ",
  "lambda": "λ",
  "lang": "⟨",
  "langd": "⦑",
  "langle": "⟨",
  "lap": "⪅",
  "laqu": "«",
  "laquo": "«",
  "larr": "←",
  "larrb": "⇤",
  "larrbfs": "⤟",
  "larrfs": "⤝",
  "larrhk": "↩",
  "larrlp": "↫",
  "larrpl": "⤹",
  "larrsim": "⥳",
  "larrtl": "↢",
  "lat": "⪫",
  "latail": "⤙",
  "late": "⪭",
  "lates": "⪭︀",
  "lbarr": "⤌",
  "lbbrk": "❲",
  "lbrace": "{",
  "lbrack": "[",
  "lbrke": "⦋",
  "lbrksld": "⦏",
  "lbrkslu": "⦍",
  "lcaron": "ľ",
  "lcedil": "ļ",
  "lceil": "⌈",
  "lcub": "{",
  "lcy": "л",
  "ldca": "⤶",
  "ldquo": "“",
  "ldquor": "„",
  "ldrdhar": "⥧",
  "ldrushar": "⥋",
  "ldsh": "↲",
  "le": "≤",
  "leftarrow": "←",
  "leftarrowtail": "↢",
  "leftharpoondown": "↽",
  "leftharpoonup": "↼",
  "leftleftarrows": "⇇",
  "leftrightarrow": "↔",
  "leftrightarrows": "⇆",
  "leftrightharpoons": "⇋",
  "leftrightsquigarrow": "↭",
  "leftthreetimes": "⋋",
  "leg": "⋚",
  "leq": "≤",
  "leqq": "≦",
  "leqslant": "⩽",
  "les": "⩽",
  "lescc": "⪨",
  "lesdot": "⩿",
  "lesdoto": "⪁",
  "lesdotor": "⪃",
  "lesg": "⋚︀",
  "lesges": "⪓",
  "lessapprox": "⪅",
  "lessdot": "⋖",
  "lesseqgtr": "⋚",
  "lesseqqgtr": "⪋",
  "lessgtr": "≶",
  "lesssim": "≲",
  "lfisht": "⥼",
  "lfloor": "⌊",
  "lfr": "𝔩",
  "lg": "≶",
  "lgE": "⪑",
  "lhard": "↽",
  "lharu": "↼",
  "lharul": "⥪",
  "lhblk": "▄",
  "ljcy": "љ",
  "ll": "≪",
  "llarr": "⇇",
  "llcorner": "⌞",
  "llhard": "⥫",
  "lltri": "◺",
  "lmidot": "ŀ",
  "lmoust": "⎰",
  "lmoustache": "⎰",
  "lnE": "≨",
  "lnap": "⪉",
  "lnapprox": "⪉",
  "lne": "⪇",
  "lneq": "⪇",
  "lneqq": "≨",
  "lnsim": "⋦",
  "loang": "⟬",
  "loarr": "⇽",
  "lobrk": "⟦",
  "longleftarrow": "⟵",
  "longleftrightarrow": "⟷",
  "longmapsto": "⟼",
  "longrightarrow": "⟶",
  "looparrowleft": "↫",
  "looparrowright": "↬",
  "lopar": "⦅",
  "lopf": "𝕝",
  "loplus": "⨭",
  "lotimes": "⨴",
  "lowast": "∗",
  "lowbar": "_",
  "loz": "◊",
  "lozenge": "◊",
  "lozf": "⧫",
  "lpar": "(",
  "lparlt": "⦓",
  "lrarr": "⇆",
  "lrcorner": "⌟",
  "lrhar": "⇋",
  "lrhard": "⥭",
  "lrm": "‎",
  "lrtri": "⊿",
  "lsaquo": "‹",
  "lscr": "𝓁",
  "lsh": "↰",
  "lsim": "≲",
  "lsime": "⪍",
  "lsimg": "⪏",
  "lsqb": "[",
  "lsquo": "‘",
  "lsquor": "‚",
  "lstrok": "ł",
  "l": "<",
  "lt": "<",
  "ltcc": "⪦",
  "ltcir": "⩹",
  "ltdot": "⋖",
  "lthree": "⋋",
  "ltimes": "⋉",
  "ltlarr": "⥶",
  "ltquest": "⩻",
  "ltrPar": "⦖",
  "ltri": "◃",
  "ltrie": "⊴",
  "ltrif": "◂",
  "lurdshar": "⥊",
  "luruhar": "⥦",
  "lvertneqq": "≨︀",
  "lvnE": "≨︀",
  "mDDot": "∺",
  "mac": "¯",
  "macr": "¯",
  "male": "♂",
  "malt": "✠",
  "maltese": "✠",
  "map": "↦",
  "mapsto": "↦",
  "mapstodown": "↧",
  "mapstoleft": "↤",
  "mapstoup": "↥",
  "marker": "▮",
  "mcomma": "⨩",
  "mcy": "м",
  "mdash": "—",
  "measuredangle": "∡",
  "mfr": "𝔪",
  "mho": "℧",
  "micr": "µ",
  "micro": "µ",
  "mid": "∣",
  "midast": "*",
  "midcir": "⫰",
  "middo": "·",
  "middot": "·",
  "minus": "−",
  "minusb": "⊟",
  "minusd": "∸",
  "minusdu": "⨪",
  "mlcp": "⫛",
  "mldr": "…",
  "mnplus": "∓",
  "models": "⊧",
  "mopf": "𝕞",
  "mp": "∓",
  "mscr": "𝓂",
  "mstpos": "∾",
  "mu": "μ",
  "multimap": "⊸",
  "mumap": "⊸",
  "nGg": "⋙̸",
  "nGt": "≫⃒",
  "nGtv": "≫̸",
  "nLeftarrow": "⇍",
  "nLeftrightarrow": "⇎",
  "nLl": "⋘̸",
  "nLt": "≪⃒",
  "nLtv": "≪̸",
  "nRightarrow": "⇏",
  "nVDash": "⊯",
  "nVdash": "⊮",
  "nabla": "∇",
  "nacute": "ń",
  "nang": "∠⃒",
  "nap": "≉",
  "napE": "⩰̸",
  "napid": "≋̸",
  "napos": "ŉ",
  "napprox": "≉",
  "natur": "♮",
  "natural": "♮",
  "naturals": "ℕ",
  "nbs": " ",
  "nbsp": " ",
  "nbump": "≎̸",
  "nbumpe": "≏̸",
  "ncap": "⩃",
  "ncaron": "ň",
  "ncedil": "ņ",
  "ncong": "≇",
  "ncongdot": "⩭̸",
  "ncup": "⩂",
  "ncy": "н",
  "ndash": "–",
  "ne": "≠",
  "neArr": "⇗",
  "nearhk": "⤤",
  "nearr": "↗",
  "nearrow": "↗",
  "nedot": "≐̸",
  "nequiv": "≢",
  "nesear": "⤨",
  "nesim": "≂̸",
  "nexist": "∄",
  "nexists": "∄",
  "nfr": "𝔫",
  "ngE": "≧̸",
  "nge": "≱",
  "ngeq": "≱",
  "ngeqq": "≧̸",
  "ngeqslant": "⩾̸",
  "nges": "⩾̸",
  "ngsim": "≵",
  "ngt": "≯",
  "ngtr": "≯",
  "nhArr": "⇎",
  "nharr": "↮",
  "nhpar": "⫲",
  "ni": "∋",
  "nis": "⋼",
  "nisd": "⋺",
  "niv": "∋",
  "njcy": "њ",
  "nlArr": "⇍",
  "nlE": "≦̸",
  "nlarr": "↚",
  "nldr": "‥",
  "nle": "≰",
  "nleftarrow": "↚",
  "nleftrightarrow": "↮",
  "nleq": "≰",
  "nleqq": "≦̸",
  "nleqslant": "⩽̸",
  "nles": "⩽̸",
  "nless": "≮",
  "nlsim": "≴",
  "nlt": "≮",
  "nltri": "⋪",
  "nltrie": "⋬",
  "nmid": "∤",
  "nopf": "𝕟",
  "no": "¬",
  "not": "¬",
  "notin": "∉",
  "notinE": "⋹̸",
  "notindot": "⋵̸",
  "notinva": "∉",
  "notinvb": "⋷",
  "notinvc": "⋶",
  "notni": "∌",
  "notniva": "∌",
  "notnivb": "⋾",
  "notnivc": "⋽",
  "npar": "∦",
  "nparallel": "∦",
  "nparsl": "⫽⃥",
  "npart": "∂̸",
  "npolint": "⨔",
  "npr": "⊀",
  "nprcue": "⋠",
  "npre": "⪯̸",
  "nprec": "⊀",
  "npreceq": "⪯̸",
  "nrArr": "⇏",
  "nrarr": "↛",
  "nrarrc": "⤳̸",
  "nrarrw": "↝̸",
  "nrightarrow": "↛",
  "nrtri": "⋫",
  "nrtrie": "⋭",
  "nsc": "⊁",
  "nsccue": "⋡",
  "nsce": "⪰̸",
  "nscr": "𝓃",
  "nshortmid": "∤",
  "nshortparallel": "∦",
  "nsim": "≁",
  "nsime": "≄",
  "nsimeq": "≄",
  "nsmid": "∤",
  "nspar": "∦",
  "nsqsube": "⋢",
  "nsqsupe": "⋣",
  "nsub": "⊄",
  "nsubE": "⫅̸",
  "nsube": "⊈",
  "nsubset": "⊂⃒",
  "nsubseteq": "⊈",
  "nsubseteqq": "⫅̸",
  "nsucc": "⊁",
  "nsucceq": "⪰̸",
  "nsup": "⊅",
  "nsupE": "⫆̸",
  "nsupe": "⊉",
  "nsupset": "⊃⃒",
  "nsupseteq": "⊉",
  "nsupseteqq": "⫆̸",
  "ntgl": "≹",
  "ntild": "ñ",
  "ntilde": "ñ",
  "ntlg": "≸",
  "ntriangleleft": "⋪",
  "ntrianglelefteq": "⋬",
  "ntriangleright": "⋫",
  "ntrianglerighteq": "⋭",
  "nu": "ν",
  "num": "#",
  "numero": "№",
  "numsp": " ",
  "nvDash": "⊭",
  "nvHarr": "⤄",
  "nvap": "≍⃒",
  "nvdash": "⊬",
  "nvge": "≥⃒",
  "nvgt": ">⃒",
  "nvinfin": "⧞",
  "nvlArr": "⤂",
  "nvle": "≤⃒",
  "nvlt": "<⃒",
  "nvltrie": "⊴⃒",
  "nvrArr": "⤃",
  "nvrtrie": "⊵⃒",
  "nvsim": "∼⃒",
  "nwArr": "⇖",
  "nwarhk": "⤣",
  "nwarr": "↖",
  "nwarrow": "↖",
  "nwnear": "⤧",
  "oS": "Ⓢ",
  "oacut": "ó",
  "oacute": "ó",
  "oast": "⊛",
  "ocir": "ô",
  "ocirc": "ô",
  "ocy": "о",
  "odash": "⊝",
  "odblac": "ő",
  "odiv": "⨸",
  "odot": "⊙",
  "odsold": "⦼",
  "oelig": "œ",
  "ofcir": "⦿",
  "ofr": "𝔬",
  "ogon": "˛",
  "ograv": "ò",
  "ograve": "ò",
  "ogt": "⧁",
  "ohbar": "⦵",
  "ohm": "Ω",
  "oint": "∮",
  "olarr": "↺",
  "olcir": "⦾",
  "olcross": "⦻",
  "oline": "‾",
  "olt": "⧀",
  "omacr": "ō",
  "omega": "ω",
  "omicron": "ο",
  "omid": "⦶",
  "ominus": "⊖",
  "oopf": "𝕠",
  "opar": "⦷",
  "operp": "⦹",
  "oplus": "⊕",
  "or": "∨",
  "orarr": "↻",
  "ord": "º",
  "order": "ℴ",
  "orderof": "ℴ",
  "ordf": "ª",
  "ordm": "º",
  "origof": "⊶",
  "oror": "⩖",
  "orslope": "⩗",
  "orv": "⩛",
  "oscr": "ℴ",
  "oslas": "ø",
  "oslash": "ø",
  "osol": "⊘",
  "otild": "õ",
  "otilde": "õ",
  "otimes": "⊗",
  "otimesas": "⨶",
  "oum": "ö",
  "ouml": "ö",
  "ovbar": "⌽",
  "par": "¶",
  "para": "¶",
  "parallel": "∥",
  "parsim": "⫳",
  "parsl": "⫽",
  "part": "∂",
  "pcy": "п",
  "percnt": "%",
  "period": ".",
  "permil": "‰",
  "perp": "⊥",
  "pertenk": "‱",
  "pfr": "𝔭",
  "phi": "φ",
  "phiv": "ϕ",
  "phmmat": "ℳ",
  "phone": "☎",
  "pi": "π",
  "pitchfork": "⋔",
  "piv": "ϖ",
  "planck": "ℏ",
  "planckh": "ℎ",
  "plankv": "ℏ",
  "plus": "+",
  "plusacir": "⨣",
  "plusb": "⊞",
  "pluscir": "⨢",
  "plusdo": "∔",
  "plusdu": "⨥",
  "pluse": "⩲",
  "plusm": "±",
  "plusmn": "±",
  "plussim": "⨦",
  "plustwo": "⨧",
  "pm": "±",
  "pointint": "⨕",
  "popf": "𝕡",
  "poun": "£",
  "pound": "£",
  "pr": "≺",
  "prE": "⪳",
  "prap": "⪷",
  "prcue": "≼",
  "pre": "⪯",
  "prec": "≺",
  "precapprox": "⪷",
  "preccurlyeq": "≼",
  "preceq": "⪯",
  "precnapprox": "⪹",
  "precneqq": "⪵",
  "precnsim": "⋨",
  "precsim": "≾",
  "prime": "′",
  "primes": "ℙ",
  "prnE": "⪵",
  "prnap": "⪹",
  "prnsim": "⋨",
  "prod": "∏",
  "profalar": "⌮",
  "profline": "⌒",
  "profsurf": "⌓",
  "prop": "∝",
  "propto": "∝",
  "prsim": "≾",
  "prurel": "⊰",
  "pscr": "𝓅",
  "psi": "ψ",
  "puncsp": " ",
  "qfr": "𝔮",
  "qint": "⨌",
  "qopf": "𝕢",
  "qprime": "⁗",
  "qscr": "𝓆",
  "quaternions": "ℍ",
  "quatint": "⨖",
  "quest": "?",
  "questeq": "≟",
  "quo": "\"",
  "quot": "\"",
  "rAarr": "⇛",
  "rArr": "⇒",
  "rAtail": "⤜",
  "rBarr": "⤏",
  "rHar": "⥤",
  "race": "∽̱",
  "racute": "ŕ",
  "radic": "√",
  "raemptyv": "⦳",
  "rang": "⟩",
  "rangd": "⦒",
  "range": "⦥",
  "rangle": "⟩",
  "raqu": "»",
  "raquo": "»",
  "rarr": "→",
  "rarrap": "⥵",
  "rarrb": "⇥",
  "rarrbfs": "⤠",
  "rarrc": "⤳",
  "rarrfs": "⤞",
  "rarrhk": "↪",
  "rarrlp": "↬",
  "rarrpl": "⥅",
  "rarrsim": "⥴",
  "rarrtl": "↣",
  "rarrw": "↝",
  "ratail": "⤚",
  "ratio": "∶",
  "rationals": "ℚ",
  "rbarr": "⤍",
  "rbbrk": "❳",
  "rbrace": "}",
  "rbrack": "]",
  "rbrke": "⦌",
  "rbrksld": "⦎",
  "rbrkslu": "⦐",
  "rcaron": "ř",
  "rcedil": "ŗ",
  "rceil": "⌉",
  "rcub": "}",
  "rcy": "р",
  "rdca": "⤷",
  "rdldhar": "⥩",
  "rdquo": "”",
  "rdquor": "”",
  "rdsh": "↳",
  "real": "ℜ",
  "realine": "ℛ",
  "realpart": "ℜ",
  "reals": "ℝ",
  "rect": "▭",
  "re": "®",
  "reg": "®",
  "rfisht": "⥽",
  "rfloor": "⌋",
  "rfr": "𝔯",
  "rhard": "⇁",
  "rharu": "⇀",
  "rharul": "⥬",
  "rho": "ρ",
  "rhov": "ϱ",
  "rightarrow": "→",
  "rightarrowtail": "↣",
  "rightharpoondown": "⇁",
  "rightharpoonup": "⇀",
  "rightleftarrows": "⇄",
  "rightleftharpoons": "⇌",
  "rightrightarrows": "⇉",
  "rightsquigarrow": "↝",
  "rightthreetimes": "⋌",
  "ring": "˚",
  "risingdotseq": "≓",
  "rlarr": "⇄",
  "rlhar": "⇌",
  "rlm": "‏",
  "rmoust": "⎱",
  "rmoustache": "⎱",
  "rnmid": "⫮",
  "roang": "⟭",
  "roarr": "⇾",
  "robrk": "⟧",
  "ropar": "⦆",
  "ropf": "𝕣",
  "roplus": "⨮",
  "rotimes": "⨵",
  "rpar": ")",
  "rpargt": "⦔",
  "rppolint": "⨒",
  "rrarr": "⇉",
  "rsaquo": "›",
  "rscr": "𝓇",
  "rsh": "↱",
  "rsqb": "]",
  "rsquo": "’",
  "rsquor": "’",
  "rthree": "⋌",
  "rtimes": "⋊",
  "rtri": "▹",
  "rtrie": "⊵",
  "rtrif": "▸",
  "rtriltri": "⧎",
  "ruluhar": "⥨",
  "rx": "℞",
  "sacute": "ś",
  "sbquo": "‚",
  "sc": "≻",
  "scE": "⪴",
  "scap": "⪸",
  "scaron": "š",
  "sccue": "≽",
  "sce": "⪰",
  "scedil": "ş",
  "scirc": "ŝ",
  "scnE": "⪶",
  "scnap": "⪺",
  "scnsim": "⋩",
  "scpolint": "⨓",
  "scsim": "≿",
  "scy": "с",
  "sdot": "⋅",
  "sdotb": "⊡",
  "sdote": "⩦",
  "seArr": "⇘",
  "searhk": "⤥",
  "searr": "↘",
  "searrow": "↘",
  "sec": "§",
  "sect": "§",
  "semi": ";",
  "seswar": "⤩",
  "setminus": "∖",
  "setmn": "∖",
  "sext": "✶",
  "sfr": "𝔰",
  "sfrown": "⌢",
  "sharp": "♯",
  "shchcy": "щ",
  "shcy": "ш",
  "shortmid": "∣",
  "shortparallel": "∥",
  "sh": "­",
  "shy": "­",
  "sigma": "σ",
  "sigmaf": "ς",
  "sigmav": "ς",
  "sim": "∼",
  "simdot": "⩪",
  "sime": "≃",
  "simeq": "≃",
  "simg": "⪞",
  "simgE": "⪠",
  "siml": "⪝",
  "simlE": "⪟",
  "simne": "≆",
  "simplus": "⨤",
  "simrarr": "⥲",
  "slarr": "←",
  "smallsetminus": "∖",
  "smashp": "⨳",
  "smeparsl": "⧤",
  "smid": "∣",
  "smile": "⌣",
  "smt": "⪪",
  "smte": "⪬",
  "smtes": "⪬︀",
  "softcy": "ь",
  "sol": "/",
  "solb": "⧄",
  "solbar": "⌿",
  "sopf": "𝕤",
  "spades": "♠",
  "spadesuit": "♠",
  "spar": "∥",
  "sqcap": "⊓",
  "sqcaps": "⊓︀",
  "sqcup": "⊔",
  "sqcups": "⊔︀",
  "sqsub": "⊏",
  "sqsube": "⊑",
  "sqsubset": "⊏",
  "sqsubseteq": "⊑",
  "sqsup": "⊐",
  "sqsupe": "⊒",
  "sqsupset": "⊐",
  "sqsupseteq": "⊒",
  "squ": "□",
  "square": "□",
  "squarf": "▪",
  "squf": "▪",
  "srarr": "→",
  "sscr": "𝓈",
  "ssetmn": "∖",
  "ssmile": "⌣",
  "sstarf": "⋆",
  "star": "☆",
  "starf": "★",
  "straightepsilon": "ϵ",
  "straightphi": "ϕ",
  "strns": "¯",
  "sub": "⊂",
  "subE": "⫅",
  "subdot": "⪽",
  "sube": "⊆",
  "subedot": "⫃",
  "submult": "⫁",
  "subnE": "⫋",
  "subne": "⊊",
  "subplus": "⪿",
  "subrarr": "⥹",
  "subset": "⊂",
  "subseteq": "⊆",
  "subseteqq": "⫅",
  "subsetneq": "⊊",
  "subsetneqq": "⫋",
  "subsim": "⫇",
  "subsub": "⫕",
  "subsup": "⫓",
  "succ": "≻",
  "succapprox": "⪸",
  "succcurlyeq": "≽",
  "succeq": "⪰",
  "succnapprox": "⪺",
  "succneqq": "⪶",
  "succnsim": "⋩",
  "succsim": "≿",
  "sum": "∑",
  "sung": "♪",
  "sup": "⊃",
  "sup1": "¹",
  "sup2": "²",
  "sup3": "³",
  "supE": "⫆",
  "supdot": "⪾",
  "supdsub": "⫘",
  "supe": "⊇",
  "supedot": "⫄",
  "suphsol": "⟉",
  "suphsub": "⫗",
  "suplarr": "⥻",
  "supmult": "⫂",
  "supnE": "⫌",
  "supne": "⊋",
  "supplus": "⫀",
  "supset": "⊃",
  "supseteq": "⊇",
  "supseteqq": "⫆",
  "supsetneq": "⊋",
  "supsetneqq": "⫌",
  "supsim": "⫈",
  "supsub": "⫔",
  "supsup": "⫖",
  "swArr": "⇙",
  "swarhk": "⤦",
  "swarr": "↙",
  "swarrow": "↙",
  "swnwar": "⤪",
  "szli": "ß",
  "szlig": "ß",
  "target": "⌖",
  "tau": "τ",
  "tbrk": "⎴",
  "tcaron": "ť",
  "tcedil": "ţ",
  "tcy": "т",
  "tdot": "⃛",
  "telrec": "⌕",
  "tfr": "𝔱",
  "there4": "∴",
  "therefore": "∴",
  "theta": "θ",
  "thetasym": "ϑ",
  "thetav": "ϑ",
  "thickapprox": "≈",
  "thicksim": "∼",
  "thinsp": " ",
  "thkap": "≈",
  "thksim": "∼",
  "thor": "þ",
  "thorn": "þ",
  "tilde": "˜",
  "time": "×",
  "times": "×",
  "timesb": "⊠",
  "timesbar": "⨱",
  "timesd": "⨰",
  "tint": "∭",
  "toea": "⤨",
  "top": "⊤",
  "topbot": "⌶",
  "topcir": "⫱",
  "topf": "𝕥",
  "topfork": "⫚",
  "tosa": "⤩",
  "tprime": "‴",
  "trade": "™",
  "triangle": "▵",
  "triangledown": "▿",
  "triangleleft": "◃",
  "trianglelefteq": "⊴",
  "triangleq": "≜",
  "triangleright": "▹",
  "trianglerighteq": "⊵",
  "tridot": "◬",
  "trie": "≜",
  "triminus": "⨺",
  "triplus": "⨹",
  "trisb": "⧍",
  "tritime": "⨻",
  "trpezium": "⏢",
  "tscr": "𝓉",
  "tscy": "ц",
  "tshcy": "ћ",
  "tstrok": "ŧ",
  "twixt": "≬",
  "twoheadleftarrow": "↞",
  "twoheadrightarrow": "↠",
  "uArr": "⇑",
  "uHar": "⥣",
  "uacut": "ú",
  "uacute": "ú",
  "uarr": "↑",
  "ubrcy": "ў",
  "ubreve": "ŭ",
  "ucir": "û",
  "ucirc": "û",
  "ucy": "у",
  "udarr": "⇅",
  "udblac": "ű",
  "udhar": "⥮",
  "ufisht": "⥾",
  "ufr": "𝔲",
  "ugrav": "ù",
  "ugrave": "ù",
  "uharl": "↿",
  "uharr": "↾",
  "uhblk": "▀",
  "ulcorn": "⌜",
  "ulcorner": "⌜",
  "ulcrop": "⌏",
  "ultri": "◸",
  "umacr": "ū",
  "um": "¨",
  "uml": "¨",
  "uogon": "ų",
  "uopf": "𝕦",
  "uparrow": "↑",
  "updownarrow": "↕",
  "upharpoonleft": "↿",
  "upharpoonright": "↾",
  "uplus": "⊎",
  "upsi": "υ",
  "upsih": "ϒ",
  "upsilon": "υ",
  "upuparrows": "⇈",
  "urcorn": "⌝",
  "urcorner": "⌝",
  "urcrop": "⌎",
  "uring": "ů",
  "urtri": "◹",
  "uscr": "𝓊",
  "utdot": "⋰",
  "utilde": "ũ",
  "utri": "▵",
  "utrif": "▴",
  "uuarr": "⇈",
  "uum": "ü",
  "uuml": "ü",
  "uwangle": "⦧",
  "vArr": "⇕",
  "vBar": "⫨",
  "vBarv": "⫩",
  "vDash": "⊨",
  "vangrt": "⦜",
  "varepsilon": "ϵ",
  "varkappa": "ϰ",
  "varnothing": "∅",
  "varphi": "ϕ",
  "varpi": "ϖ",
  "varpropto": "∝",
  "varr": "↕",
  "varrho": "ϱ",
  "varsigma": "ς",
  "varsubsetneq": "⊊︀",
  "varsubsetneqq": "⫋︀",
  "varsupsetneq": "⊋︀",
  "varsupsetneqq": "⫌︀",
  "vartheta": "ϑ",
  "vartriangleleft": "⊲",
  "vartriangleright": "⊳",
  "vcy": "в",
  "vdash": "⊢",
  "vee": "∨",
  "veebar": "⊻",
  "veeeq": "≚",
  "vellip": "⋮",
  "verbar": "|",
  "vert": "|",
  "vfr": "𝔳",
  "vltri": "⊲",
  "vnsub": "⊂⃒",
  "vnsup": "⊃⃒",
  "vopf": "𝕧",
  "vprop": "∝",
  "vrtri": "⊳",
  "vscr": "𝓋",
  "vsubnE": "⫋︀",
  "vsubne": "⊊︀",
  "vsupnE": "⫌︀",
  "vsupne": "⊋︀",
  "vzigzag": "⦚",
  "wcirc": "ŵ",
  "wedbar": "⩟",
  "wedge": "∧",
  "wedgeq": "≙",
  "weierp": "℘",
  "wfr": "𝔴",
  "wopf": "𝕨",
  "wp": "℘",
  "wr": "≀",
  "wreath": "≀",
  "wscr": "𝓌",
  "xcap": "⋂",
  "xcirc": "◯",
  "xcup": "⋃",
  "xdtri": "▽",
  "xfr": "𝔵",
  "xhArr": "⟺",
  "xharr": "⟷",
  "xi": "ξ",
  "xlArr": "⟸",
  "xlarr": "⟵",
  "xmap": "⟼",
  "xnis": "⋻",
  "xodot": "⨀",
  "xopf": "𝕩",
  "xoplus": "⨁",
  "xotime": "⨂",
  "xrArr": "⟹",
  "xrarr": "⟶",
  "xscr": "𝓍",
  "xsqcup": "⨆",
  "xuplus": "⨄",
  "xutri": "△",
  "xvee": "⋁",
  "xwedge": "⋀",
  "yacut": "ý",
  "yacute": "ý",
  "yacy": "я",
  "ycirc": "ŷ",
  "ycy": "ы",
  "ye": "¥",
  "yen": "¥",
  "yfr": "𝔶",
  "yicy": "ї",
  "yopf": "𝕪",
  "yscr": "𝓎",
  "yucy": "ю",
  "yum": "ÿ",
  "yuml": "ÿ",
  "zacute": "ź",
  "zcaron": "ž",
  "zcy": "з",
  "zdot": "ż",
  "zeetrf": "ℨ",
  "zeta": "ζ",
  "zfr": "𝔷",
  "zhcy": "ж",
  "zigrarr": "⇝",
  "zopf": "𝕫",
  "zscr": "𝓏",
  "zwj": "‍",
  "zwnj": "‌"
}

},{}],9:[function(require,module,exports){
module.exports={
  "0": "�",
  "128": "€",
  "130": "‚",
  "131": "ƒ",
  "132": "„",
  "133": "…",
  "134": "†",
  "135": "‡",
  "136": "ˆ",
  "137": "‰",
  "138": "Š",
  "139": "‹",
  "140": "Œ",
  "142": "Ž",
  "145": "‘",
  "146": "’",
  "147": "“",
  "148": "”",
  "149": "•",
  "150": "–",
  "151": "—",
  "152": "˜",
  "153": "™",
  "154": "š",
  "155": "›",
  "156": "œ",
  "158": "ž",
  "159": "Ÿ"
}

},{}],10:[function(require,module,exports){
(function (Buffer){
"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},clone=function(){function e(e,t){return null!=t&&e instanceof t}function t(n,u,c,l,a){function p(n,c){if(null===n)return null;if(0===c)return n;var s,v;if("object"!=(void 0===n?"undefined":_typeof(n)))return n;if(e(n,o))s=new o;else if(e(n,i))s=new i;else if(e(n,f))s=new f(function(e,t){n.then(function(t){e(p(t,c-1))},function(e){t(p(e,c-1))})});else if(t.__isArray(n))s=[];else if(t.__isRegExp(n))s=new RegExp(n.source,r(n)),n.lastIndex&&(s.lastIndex=n.lastIndex);else if(t.__isDate(n))s=new Date(n.getTime());else{if(d&&Buffer.isBuffer(n))return s=new Buffer(n.length),n.copy(s),s;e(n,Error)?s=Object.create(n):void 0===l?(v=Object.getPrototypeOf(n),s=Object.create(v)):(s=Object.create(l),v=l)}if(u){var m=y.indexOf(n);if(-1!=m)return b[m];y.push(n),b.push(s)}e(n,o)&&n.forEach(function(e,t){var n=p(t,c-1),r=p(e,c-1);s.set(n,r)}),e(n,i)&&n.forEach(function(e){var t=p(e,c-1);s.add(t)});for(var j in n){var _;v&&(_=Object.getOwnPropertyDescriptor(v,j)),_&&null==_.set||(s[j]=p(n[j],c-1))}if(Object.getOwnPropertySymbols)for(var g=Object.getOwnPropertySymbols(n),j=0;j<g.length;j++){var O=g[j];(!(x=Object.getOwnPropertyDescriptor(n,O))||x.enumerable||a)&&(s[O]=p(n[O],c-1),x.enumerable||Object.defineProperty(s,O,{enumerable:!1}))}if(a)for(var w=Object.getOwnPropertyNames(n),j=0;j<w.length;j++){var h=w[j],x=Object.getOwnPropertyDescriptor(n,h);x&&x.enumerable||(s[h]=p(n[h],c-1),Object.defineProperty(s,h,{enumerable:!1}))}return s}"object"===(void 0===u?"undefined":_typeof(u))&&(c=u.depth,l=u.prototype,a=u.includeNonEnumerable,u=u.circular);var y=[],b=[],d="undefined"!=typeof Buffer;return void 0===u&&(u=!0),void 0===c&&(c=1/0),p(n,c)}function n(e){return Object.prototype.toString.call(e)}function r(e){var t="";return e.global&&(t+="g"),e.ignoreCase&&(t+="i"),e.multiline&&(t+="m"),t}var o;try{o=Map}catch(e){o=function(){}}var i;try{i=Set}catch(e){i=function(){}}var f;try{f=Promise}catch(e){f=function(){}}return t.clonePrototype=function(e){if(null===e)return null;var t=function(){};return t.prototype=e,new t},t.__objToStr=n,t.__isDate=function(e){return"object"===(void 0===e?"undefined":_typeof(e))&&"[object Date]"===n(e)},t.__isArray=function(e){return"object"===(void 0===e?"undefined":_typeof(e))&&"[object Array]"===n(e)},t.__isRegExp=function(e){return"object"===(void 0===e?"undefined":_typeof(e))&&"[object RegExp]"===n(e)},t.__getRegExpFlags=r,t}();"object"===("undefined"==typeof module?"undefined":_typeof(module))&&module.exports&&(module.exports=clone);

}).call(this,require("buffer").Buffer)

},{"buffer":3}],11:[function(require,module,exports){
"use strict";function collapse(e){return String(e).replace(/\s+/g," ")}module.exports=collapse;

},{}],12:[function(require,module,exports){
"use strict";function parse(r){for(var i,t=[],n=String(r||EMPTY),e=n.indexOf(C_COMMA),C=0,M=!1;!M;)-1===e&&(e=n.length,M=!0),!(i=trim(n.slice(C,e)))&&M||t.push(i),C=e+1,e=n.indexOf(C_COMMA,C);return t}function stringify(r,i){var t=i||{},n=t.padLeft;return r[r.length-1]===EMPTY&&(r=r.concat(EMPTY)),trim(r.join((t.padRight?C_SPACE:EMPTY)+C_COMMA+(n||void 0===n||null===n?C_SPACE:EMPTY)))}exports.parse=parse,exports.stringify=stringify;var trim=require("trim"),C_COMMA=",",C_SPACE=" ",EMPTY="";

},{"trim":207}],13:[function(require,module,exports){
"use strict";function detab(e,r){var t,i,s="string"==typeof e,a=s&&e.length,n=0,o=-1,p=-1,u=r||4,c=[];if(!s)throw new Error("detab expected string");for(;++o<a;)(t=e.charCodeAt(o))===TAB?(p+=i=u-(p+1)%u,c.push(e.slice(n,o)+repeat(" ",i)),n=o+1):t===LF||t===CR?p=-1:p++;return c.push(e.slice(n)),c.join("")}module.exports=detab;var repeat=require("repeat-string"),TAB=9,LF=10,CR=13;

},{"repeat-string":190}],14:[function(require,module,exports){
"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},hasOwn=Object.prototype.hasOwnProperty,toStr=Object.prototype.toString,isArray=function(t){return"function"==typeof Array.isArray?Array.isArray(t):"[object Array]"===toStr.call(t)},isPlainObject=function(t){if(!t||"[object Object]"!==toStr.call(t))return!1;var o=hasOwn.call(t,"constructor"),r=t.constructor&&t.constructor.prototype&&hasOwn.call(t.constructor.prototype,"isPrototypeOf");if(t.constructor&&!o&&!r)return!1;var n;for(n in t);return void 0===n||hasOwn.call(t,n)};module.exports=function t(){var o,r,n,e,c,i,y=arguments[0],a=1,f=arguments.length,l=!1;for("boolean"==typeof y&&(l=y,y=arguments[1]||{},a=2),(null==y||"object"!==(void 0===y?"undefined":_typeof(y))&&"function"!=typeof y)&&(y={});a<f;++a)if(null!=(o=arguments[a]))for(r in o)n=y[r],y!==(e=o[r])&&(l&&e&&(isPlainObject(e)||(c=isArray(e)))?(c?(c=!1,i=n&&isArray(n)?n:[]):i=n&&isPlainObject(n)?n:{},y[r]=t(l,i,e)):void 0!==e&&(y[r]=e));return y};

},{}],15:[function(require,module,exports){
"use strict";var ERROR_MESSAGE="Function.prototype.bind called on incompatible ",slice=Array.prototype.slice,toStr=Object.prototype.toString,funcType="[object Function]";module.exports=function(t){var n=this;if("function"!=typeof n||toStr.call(n)!==funcType)throw new TypeError(ERROR_MESSAGE+n);for(var o,e=slice.call(arguments,1),r=Math.max(0,n.length-e.length),c=[],i=0;i<r;i++)c.push("$"+i);if(o=Function("binder","return function ("+c.join(",")+"){ return binder.apply(this,arguments); }")(function(){if(this instanceof o){var r=n.apply(this,e.concat(slice.call(arguments)));return Object(r)===r?r:this}return n.apply(t,e.concat(slice.call(arguments)))}),n.prototype){var p=function(){};p.prototype=n.prototype,o.prototype=new p,p.prototype=null}return o};

},{}],16:[function(require,module,exports){
"use strict";var implementation=require("./implementation");module.exports=Function.prototype.bind||implementation;

},{"./implementation":15}],17:[function(require,module,exports){
"use strict";var bind=require("function-bind");module.exports=bind.call(Function.call,Object.prototype.hasOwnProperty);

},{"function-bind":16}],18:[function(require,module,exports){
"use strict";function wrapper(t,e){var o,n=e||{};return n.messages?(o=n,n={}):o=n.file,transform(t,{file:o,toPosition:o?vfileLocation(o).toPosition:null,verbose:n.verbose,location:!1})}function transform(t,e){var o,n,r,i=has(map,t.nodeName)?map[t.nodeName]:element;return t.childNodes&&(o=nodes(t.childNodes,e)),n=i(t,o,e),t.__location&&e.toPosition&&(e.location=!0,(r=location(t.__location,t,n,e))&&(n.position=r)),n}function nodes(t,e){for(var o=t.length,n=-1,r=[];++n<o;)r[n]=transform(t[n],e);return r}function root(t,e,o){var n={type:"root",children:e,data:{quirksMode:t.quirksMode}};return o.file&&o.location&&(n.position=location({startOffset:0,endOffset:String(o.file).length},t,n,o)),n}function doctype(t){return{type:"doctype",name:t.name||"",public:t.publicId||null,system:t.systemId||null}}function text(t){return{type:"text",value:t.value}}function comment(t){return{type:"comment",value:t.data}}function element(t,e){for(var o,n={},r=t.attrs,i=r.length,a=-1;++a<i;)n[((o=r[a]).prefix?o.prefix+":":"")+o.name]=o.value;return h(t.tagName,n,e)}function loc(t,e){return{start:t(e.startOffset),end:t(e.endOffset)}}function location(t,e,o,n){var r,i,a=t.startOffset,s=t.endOffset,l=t.attrs||{},c={};for(r in l)c[(information(r)||{}).propertyName||camelcase(r)]=loc(n.toPosition,l[r]);if("element"!==o.type||t.endTag||((i=o.children[o.children.length-1])&&i.position?s=i.position.end?i.position.end.offset:null:t.startTag&&(s=t.startTag.endOffset)),n.verbose&&"element"===o.type&&(o.data={position:{opening:loc(n.toPosition,t.startTag||t),closing:t.endTag?loc(n.toPosition,t.endTag):null,properties:c}}),a="number"==typeof a?n.toPosition(a):null,s="number"==typeof s?n.toPosition(s):null,a||s)return{start:a,end:s}}var information=require("property-information"),camelcase=require("camelcase"),vfileLocation=require("vfile-location"),has=require("has"),h=require("hastscript");module.exports=wrapper;var map={"#document":root,"#document-fragment":root,"#text":text,"#comment":comment,"#documentType":doctype};

},{"camelcase":4,"has":17,"hastscript":39,"property-information":116,"vfile-location":233}],19:[function(require,module,exports){
"use strict";function isElement(t,e){var o;if(!(null===e||void 0===e||"string"==typeof e||"object"===(void 0===e?"undefined":_typeof(e))&&e.length))throw new Error("Expected `string` or `Array.<string>` for `tagNames`, not `"+e+"`");return!(!t||"object"!==(void 0===t?"undefined":_typeof(t))||"element"!==t.type||"string"!=typeof t.tagName)&&(null===e||void 0===e||(o=t.tagName,"string"==typeof e?o===e:-1!==e.indexOf(o)))}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};module.exports=isElement;

},{}],20:[function(require,module,exports){
"use strict";function parse(e){var t,r,a,l,s=null,h=[],o=e||"",n="div",p=null,d=-1,i=o.length;for(t={type:"element",tagName:null,properties:{},children:[]},p=null;++d<=i;)(r=o.charCodeAt(d))&&r!==dot&&r!==hash||((a=o.slice(l,d))&&(p===dot?h.push(a):p===hash?s=a:n=a),l=d+1,p=r);return t.tagName=n,s&&(t.properties.id=s),0!==h.length&&(t.properties.className=h),t}module.exports=parse;var dot=".".charCodeAt(0),hash="#".charCodeAt(0);

},{}],21:[function(require,module,exports){
"use strict";module.exports=require("./lib");

},{"./lib":26}],22:[function(require,module,exports){
"use strict";function all(e,r){for(var n=r&&r.children,o=n&&n.length,l=-1,t=[];++l<o;)t[l]=one(e,n[l],l,r);return t.join("")}var one=require("./one");module.exports=all;

},{"./one":35}],23:[function(require,module,exports){
"use strict";function comment(e,t){return"\x3c!--"+t.value+"--\x3e"}module.exports=comment;

},{}],24:[function(require,module,exports){
"use strict";function doctype(t,n){var e=n.public,r=n.system,u="<!DOCTYPE";return n.name?(u+=" "+n.name,null!=e?u+=" PUBLIC "+smart(e):null!=r&&(u+=" SYSTEM"),null!=r&&(u+=" "+smart(r)),u+">"):u+">"}function smart(t){var n=-1===t.indexOf('"')?'"':"'";return n+t+n}module.exports=doctype;

},{}],25:[function(require,module,exports){
"use strict";function element(t,e,n,o){var r=e.tagName,i=all(t,e),a=-1!==t.voids.indexOf(r.toLowerCase()),u=attributes(t,e.properties),s=t.omit,l="";return a=!i&&a,!u&&s&&s.opening(e,n,o)||(l=LT+r+(u?SPACE+u:EMPTY),a&&t.close&&(t.tightClose&&u.charAt(u.length-1)!==SO||(l+=SPACE),l+=SO),l+=GT),l+=i,a||s&&s.closing(e,n,o)||(l+=LT+SO+r+GT),l}function attributes(t,e){var n,o,r,i,a,u,s=[];for(n in e)null!=(o=e[n])&&(r=attribute(t,n,o))&&s.push(r);for(i=s.length,a=-1;++a<i;)r=s[a],u=t.tight&&r.charAt(r.length-1),a!==i-1&&u!==DQ&&u!==SQ&&(s[a]=r+SPACE);return s.join(EMPTY)}function attribute(t,e,n){var o,r=information(e)||{};return null==n||"number"==typeof n&&isNaN(n)||!n&&r.boolean||!1===n&&r.overloadedBoolean?EMPTY:(o=attributeName(t,e),n&&r.boolean||!0===n&&r.overloadedBoolean?o:o+attributeValue(t,e,n))}function attributeName(t,e){var n=(information(e)||{}).name||kebab(e);return n.slice(0,DATA.length)===DATA&&/[0-9]/.test(n.charAt(DATA.length))&&(n=DATA+"-"+n.slice(4)),entities(n,xtend(t.entities,{subset:t.NAME}))}function attributeValue(t,e,n){var o,r=information(e)||{},i=t.entities,a=t.quote,u=t.alternative;return"object"===(void 0===n?"undefined":_typeof(n))&&"length"in n&&(n=(r.commaSeparated?commas:spaces)(n,{padLeft:!t.tightLists})),!(n=String(n))&&t.collapseEmpty||(o=n,t.unquoted&&(o=entities(n,xtend(i,{subset:t.UNQUOTED,attribute:!0}))),t.unquoted&&o===n||(u&&ccount(n,a)>ccount(n,u)&&(a=u),n=a+(n=entities(n,xtend(i,{subset:a===SQ?t.SINGLE_QUOTED:t.DOUBLE_QUOTED,attribute:!0})))+a),n=n?EQ+n:n),n}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},xtend=require("xtend"),spaces=require("space-separated-tokens").stringify,commas=require("comma-separated-tokens").stringify,information=require("property-information"),entities=require("stringify-entities"),kebab=require("kebab-case"),ccount=require("ccount"),all=require("./all");module.exports=element;var DATA="data",EMPTY="",SPACE=" ",DQ='"',SQ="'",EQ="=",LT="<",GT=">",SO="/";

},{"./all":22,"ccount":5,"comma-separated-tokens":12,"kebab-case":77,"property-information":116,"space-separated-tokens":192,"stringify-entities":195,"xtend":237}],26:[function(require,module,exports){
"use strict";function toHTML(t,o){var e=o||{},E=e.quote||DQ,L=e.quoteSmart,Q=e.allowParseErrors,A=e.allowDangerousCharacters,i=E===DQ?SQ:DQ,s=Q?NAME:CLEAN_NAME,U=Q?UQ_VALUE:UQ_VALUE_CLEAN,n=Q?SQ_VALUE:SQ_VALUE_CLEAN,r=Q?DQ_VALUE:DQ_VALUE_CLEAN;if(E!==DQ&&E!==SQ)throw new Error("Invalid quote `"+E+"`, expected `"+SQ+"` or `"+DQ+"`");return one({NAME:s.concat(A?[]:QUOTES),UNQUOTED:U.concat(A?[]:QUOTES),DOUBLE_QUOTED:r.concat(A?[]:QUOTES),SINGLE_QUOTED:n.concat(A?[]:QUOTES),omit:e.omitOptionalTags&&omission,quote:E,alternative:L?i:null,unquoted:Boolean(e.preferUnquoted),tight:e.tightAttributes,tightLists:e.tightCommaSeparatedLists,tightClose:e.tightSelfClosing,collapseEmpty:e.collapseEmptyAttributes,dangerous:e.allowDangerousHTML,voids:e.voids||voids.concat(),entities:e.entities||{},close:e.closeSelfClosing},t)}var voids=require("html-void-elements"),omission=require("./omission"),one=require("./one");module.exports=toHTML;var NULL="\0",AMP="&",SPACE=" ",TAB="\t",GR="`",DQ='"',SQ="'",EQ="=",LT="<",GT=">",SO="/",LF="\n",CR="\r",FF="\f",NAME=[AMP,SPACE,TAB,LF,CR,FF,SO,GT,EQ],CLEAN_NAME=NAME.concat(NULL,DQ,SQ,LT),QUOTES=[DQ,SQ,GR],UQ_VALUE=[AMP,SPACE,TAB,LF,CR,FF,GT],UQ_VALUE_CLEAN=UQ_VALUE.concat(NULL,DQ,SQ,LT,EQ,GR),SQ_VALUE=[AMP,SQ],SQ_VALUE_CLEAN=SQ_VALUE.concat(NULL),DQ_VALUE=[AMP,DQ],DQ_VALUE_CLEAN=DQ_VALUE.concat(NULL);

},{"./omission":28,"./one":35,"html-void-elements":40}],27:[function(require,module,exports){
"use strict";function headOrColgroupOrCaption(t,e,r){var n=after(r,e,!0);return!n||!is("comment",n)&&!whiteSpaceLeft(n)}function html(t,e,r){var n=after(r,e);return!n||!is("comment",n)}function body(t,e,r){var n=after(r,e);return!n||!is("comment",n)}function p(t,e,r){var n=after(r,e);return n?element(n,["address","article","aside","blockquote","details","div","dl","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","main","menu","nav","ol","p","pre","section","table","ul"]):!r||!element(r,["a","audio","del","ins","map","noscript","video"])}function li(t,e,r){var n=after(r,e);return!n||element(n,"li")}function dt(t,e,r){var n=after(r,e);return n&&element(n,["dt","dd"])}function dd(t,e,r){var n=after(r,e);return!n||element(n,["dt","dd"])}function rubyElement(t,e,r){var n=after(r,e);return!n||element(n,["rp","rt"])}function optgroup(t,e,r){var n=after(r,e);return!n||element(n,"optgroup")}function option(t,e,r){var n=after(r,e);return!n||element(n,["option","optgroup"])}function menuitem(t,e,r){var n=after(r,e);return!n||element(n,["menuitem","hr","menu"])}function thead(t,e,r){var n=after(r,e);return n&&element(n,["tbody","tfoot"])}function tbody(t,e,r){var n=after(r,e);return!n||element(n,["tbody","tfoot"])}function tfoot(t,e,r){return!after(r,e)}function tr(t,e,r){var n=after(r,e);return!n||element(n,"tr")}function cells(t,e,r){var n=after(r,e);return!n||element(n,["td","th"])}var is=require("unist-util-is"),element=require("hast-util-is-element"),whiteSpaceLeft=require("./util/white-space-left"),after=require("./util/siblings").after,omission=require("./omission");module.exports=omission({html:html,head:headOrColgroupOrCaption,body:body,p:p,li:li,dt:dt,dd:dd,rt:rubyElement,rp:rubyElement,optgroup:optgroup,option:option,menuitem:menuitem,colgroup:headOrColgroupOrCaption,caption:headOrColgroupOrCaption,thead:thead,tbody:tbody,tfoot:tfoot,tr:tr,td:cells,th:cells});

},{"./omission":29,"./util/siblings":33,"./util/white-space-left":34,"hast-util-is-element":19,"unist-util-is":223}],28:[function(require,module,exports){
"use strict";exports.opening=require("./opening"),exports.closing=require("./closing");

},{"./closing":27,"./opening":30}],29:[function(require,module,exports){
"use strict";function omission(n){return function(o,r,t){var s=o.tagName,e=!!own.call(n,s)&&n[s];return!!e&&e(o,r,t)}}module.exports=omission;var own={}.hasOwnProperty;

},{}],30:[function(require,module,exports){
"use strict";function html(e){var t=first(e);return!t||!is("comment",t)}function head(e){for(var t,r,i=e.children,o=i.length,l={},n=-1;++n<o;)if(t=i[n],r=t.tagName,"element"===t.type&&("title"===r||"base"===r)){if(own.call(l,r))return!1;l[r]=!0}return Boolean(o)}function body(e){var t=first(e,!0);return!t||!is("comment",t)&&!whiteSpaceLeft(t)&&!element(t,["meta","link","script","style","template"])}function colgroup(e,t,r){var i=before(r,t),o=first(e,!0);return(!element(i,"colgroup")||!closing(i,place(r,i),r))&&(o&&element(o,"col"))}function tbody(e,t,r){var i=before(r,t),o=first(e);return(!element(i,["thead","tbody"])||!closing(i,place(r,i),r))&&(o&&element(o,"tr"))}var is=require("unist-util-is"),element=require("hast-util-is-element"),before=require("./util/siblings").before,first=require("./util/first"),place=require("./util/place"),whiteSpaceLeft=require("./util/white-space-left"),closing=require("./closing"),omission=require("./omission"),own={}.hasOwnProperty;module.exports=omission({html:html,head:head,body:body,colgroup:colgroup,tbody:tbody});

},{"./closing":27,"./omission":29,"./util/first":31,"./util/place":32,"./util/siblings":33,"./util/white-space-left":34,"hast-util-is-element":19,"unist-util-is":223}],31:[function(require,module,exports){
"use strict";function first(r,t){return after(r,-1,t)}var after=require("./siblings").after;module.exports=first;

},{"./siblings":33}],32:[function(require,module,exports){
"use strict";function place(e,c){return e&&e.children&&e.children.indexOf(c)}module.exports=place;

},{}],33:[function(require,module,exports){
"use strict";function siblings(e){return function(i,r,t){var s,n=i&&i.children;if(r+=e,s=n&&n[r],!t)for(;s&&whiteSpace(s);)s=n[r+=e];return s}}var whiteSpace=require("hast-util-whitespace");exports.before=siblings(-1),exports.after=siblings(1);

},{"hast-util-whitespace":38}],34:[function(require,module,exports){
"use strict";function whiteSpaceLeft(e){return is("text",e)&&whiteSpace(e.value.charAt(0))}var is=require("unist-util-is"),whiteSpace=require("hast-util-whitespace");module.exports=whiteSpaceLeft;

},{"hast-util-whitespace":38,"unist-util-is":223}],35:[function(require,module,exports){
"use strict";function one(e,r,n,o){var t=r&&r.type;if(!t)throw new Error("Expected node, not `"+r+"`");if(!own.call(handlers,t))throw new Error("Cannot compile unknown node `"+t+"`");return handlers[t](e,r,n,o)}module.exports=one;var own={}.hasOwnProperty,handlers={};handlers.root=require("./all"),handlers.text=require("./text"),handlers.element=require("./element"),handlers.doctype=require("./doctype"),handlers.comment=require("./comment"),handlers.raw=require("./raw");

},{"./all":22,"./comment":23,"./doctype":24,"./element":25,"./raw":36,"./text":37}],36:[function(require,module,exports){
"use strict";function raw(e,t){return e.dangerous?t.value:text(e,t)}var text=require("./text");module.exports=raw;

},{"./text":37}],37:[function(require,module,exports){
"use strict";function text(t,e,i,r){var n=e.value;return isLiteral(r)?n:entities(n,xtend(t.entities,{subset:["<","&"]}))}function isLiteral(t){return t&&("script"===t.tagName||"style"===t.tagName)}var xtend=require("xtend"),entities=require("stringify-entities");module.exports=text;

},{"stringify-entities":195,"xtend":237}],38:[function(require,module,exports){
"use strict";function interElementWhiteSpace(t){var e;if(t&&"object"===(void 0===t?"undefined":_typeof(t))&&"text"===t.type)e=t.value||"";else{if("string"!=typeof t)return!1;e=t}return""===e.replace(EXPRESSION,"")}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},EXPRESSION=/[\ \t\n\f\r]/g;module.exports=interElementWhiteSpace;

},{}],39:[function(require,module,exports){
"use strict";function h(e,t,o){var r,n=parseSelector(e);if(t&&!o&&("string"==typeof t||"length"in t||isNode(n.tagName,t))&&(o=t,t=null),t)for(r in t)addProperty(n.properties,r,t[r]);return addChild(n.children,o),n}function isNode(e,t){var o=t.type;return"string"==typeof o&&(o=o.toLowerCase()),!("input"===e||!o||"string"!=typeof o)&&("object"===_typeof(t.children)&&"length"in t.children||("button"===e?"menu"!==o&&"submit"!==o&&"reset"!==o&&"button"!==o:"value"in t))}function addChild(e,t){var o,r;if(null!==t&&void 0!==t)if("string"!=typeof t&&"number"!=typeof t||(t={type:"text",value:String(t)}),"object"===(void 0===t?"undefined":_typeof(t))&&"length"in t)for(o=-1,r=t.length;++o<r;)addChild(e,t[o]);else{if("object"!==(void 0===t?"undefined":_typeof(t))||!("type"in t))throw new Error("Expected node, nodes, or string, got `"+t+"`");e.push(t)}}function addProperty(e,t,o){var r,n=propertyInformation(t)||{},i=o;if(null!==o&&void 0!==o&&o===o){if("style"===t){if("string"!=typeof o){i=[];for(r in o)i.push([r,o[r]].join(": "));i=i.join("; ")}}else n.spaceSeparated?(i="string"==typeof o?spaces(i):i,"class"===t&&e.className&&(i=e.className.concat(i))):n.commaSeparated&&(i="string"==typeof o?commas(i):i);i=parsePrimitive(n,t,i),e[n.propertyName||camelcase(t)]=i}}function parsePrimitive(e,t,o){var r,n,i=o;if("object"===(void 0===o?"undefined":_typeof(o))&&"length"in o){for(n=o.length,r=-1,i=[];++r<n;)i[r]=parsePrimitive(e,t,o[r]);return i}return e.numeric||e.positiveNumeric?isNaN(i)||""===i||(i=Number(i)):(e.boolean||e.overloadedBoolean)&&("string"!=typeof i||""!==i&&o.toLowerCase()!==t||(i=!0)),i}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},parseSelector=require("hast-util-parse-selector"),camelcase=require("camelcase"),propertyInformation=require("property-information"),spaces=require("space-separated-tokens").parse,commas=require("comma-separated-tokens").parse;module.exports=h;

},{"camelcase":4,"comma-separated-tokens":12,"hast-util-parse-selector":20,"property-information":116,"space-separated-tokens":192}],40:[function(require,module,exports){
module.exports=[
  "area",
  "base",
  "basefont",
  "bgsound",
  "br",
  "col",
  "command",
  "embed",
  "frame",
  "hr",
  "image",
  "img",
  "input",
  "isindex",
  "keygen",
  "link",
  "menuitem",
  "meta",
  "nextid",
  "param",
  "source",
  "track",
  "wbr"
]

},{}],41:[function(require,module,exports){
"use strict";function Response(t,e,o,s){if("number"!=typeof t)throw new TypeError("statusCode must be a number but was "+(void 0===t?"undefined":_typeof(t)));if(null===e)throw new TypeError("headers cannot be null");if("object"!==(void 0===e?"undefined":_typeof(e)))throw new TypeError("headers must be an object but was "+(void 0===e?"undefined":_typeof(e)));this.statusCode=t,this.headers={};for(var r in e)this.headers[r.toLowerCase()]=e[r];this.body=o,this.url=s}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};module.exports=Response,Response.prototype.getBody=function(t){if(this.statusCode>=300){var e=new Error("Server responded with status code "+this.statusCode+":\n"+this.body.toString());throw e.statusCode=this.statusCode,e.headers=this.headers,e.body=this.body,e.url=this.url,e}return t?this.body.toString(t):this.body};

},{}],42:[function(require,module,exports){
"use strict";exports.read=function(t,a,o,r,h){var M,p,w=8*h-r-1,e=(1<<w)-1,f=e>>1,i=-7,s=o?h-1:0,N=o?-1:1,n=t[a+s];for(s+=N,M=n&(1<<-i)-1,n>>=-i,i+=w;i>0;M=256*M+t[a+s],s+=N,i-=8);for(p=M&(1<<-i)-1,M>>=-i,i+=r;i>0;p=256*p+t[a+s],s+=N,i-=8);if(0===M)M=1-f;else{if(M===e)return p?NaN:1/0*(n?-1:1);p+=Math.pow(2,r),M-=f}return(n?-1:1)*p*Math.pow(2,M-r)},exports.write=function(t,a,o,r,h,M){var p,w,e,f=8*M-h-1,i=(1<<f)-1,s=i>>1,N=23===h?Math.pow(2,-24)-Math.pow(2,-77):0,n=r?0:M-1,u=r?1:-1,c=a<0||0===a&&1/a<0?1:0;for(a=Math.abs(a),isNaN(a)||a===1/0?(w=isNaN(a)?1:0,p=i):(p=Math.floor(Math.log(a)/Math.LN2),a*(e=Math.pow(2,-p))<1&&(p--,e*=2),(a+=p+s>=1?N/e:N*Math.pow(2,1-s))*e>=2&&(p++,e/=2),p+s>=i?(w=0,p=i):p+s>=1?(w=(a*e-1)*Math.pow(2,h),p+=s):(w=a*Math.pow(2,s-1)*Math.pow(2,h),p=0));h>=8;t[o+n]=255&w,n+=u,w/=256,h-=8);for(p=p<<h|w,f+=h;f>0;t[o+n]=255&p,n+=u,p/=256,f-=8);t[o+n-u]|=128*c};

},{}],43:[function(require,module,exports){
"use strict";"function"==typeof Object.create?module.exports=function(t,e){t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})}:module.exports=function(t,e){t.super_=e;var o=function(){};o.prototype=e.prototype,t.prototype=new o,t.prototype.constructor=t};

},{}],44:[function(require,module,exports){
"use strict";function alphabetical(t){var a="string"==typeof t?t.charCodeAt(0):t;return a>=97&&a<=122||a>=65&&a<=90}module.exports=alphabetical;

},{}],45:[function(require,module,exports){
"use strict";function alphanumerical(a){return alphabetical(a)||decimal(a)}var alphabetical=require("is-alphabetical"),decimal=require("is-decimal");module.exports=alphanumerical;

},{"is-alphabetical":44,"is-decimal":47}],46:[function(require,module,exports){
"use strict";function isBuffer(f){return!!f.constructor&&"function"==typeof f.constructor.isBuffer&&f.constructor.isBuffer(f)}function isSlowBuffer(f){return"function"==typeof f.readFloatLE&&"function"==typeof f.slice&&isBuffer(f.slice(0,0))}module.exports=function(f){return null!=f&&(isBuffer(f)||isSlowBuffer(f)||!!f._isBuffer)};

},{}],47:[function(require,module,exports){
"use strict";function decimal(e){var t="string"==typeof e?e.charCodeAt(0):e;return t>=48&&t<=57}module.exports=decimal;

},{}],48:[function(require,module,exports){
"use strict";function isEmpty(t){if(null==t)return!0;if("boolean"==typeof t)return!1;if("number"==typeof t)return 0===t;if("string"==typeof t)return 0===t.length;if("function"==typeof t)return 0===t.length;if(Array.isArray(t))return 0===t.length;if(t instanceof Error)return""===t.message;if(t.toString==toString)switch(t.toString()){case"[object File]":case"[object Map]":case"[object Set]":return 0===t.size;case"[object Object]":for(var r in t)if(has.call(t,r))return!1;return!0}return!1}var has=Object.prototype.hasOwnProperty,toString=Object.prototype.toString;module.exports=isEmpty;

},{}],49:[function(require,module,exports){
"use strict";function hexadecimal(e){var t="string"==typeof e?e.charCodeAt(0):e;return t>=97&&t<=102||t>=65&&t<=70||t>=48&&t<=57}module.exports=hexadecimal;

},{}],50:[function(require,module,exports){
"use strict";var toString=Object.prototype.toString;module.exports=function(t){var e;return"[object Object]"===toString.call(t)&&(null===(e=Object.getPrototypeOf(t))||e===Object.getPrototypeOf({}))};

},{}],51:[function(require,module,exports){
"use strict";function whitespace(e){return re.test("number"==typeof e?fromCode(e):e.charAt(0))}module.exports=whitespace;var fromCode=String.fromCharCode,re=/\s/;

},{}],52:[function(require,module,exports){
"use strict";function wordCharacter(r){return re.test("number"==typeof r?fromCode(r):r.charAt(0))}module.exports=wordCharacter;var fromCode=String.fromCharCode,re=/\w/;

},{}],53:[function(require,module,exports){
"use strict";var ParseError=require("./src/ParseError"),Settings=require("./src/Settings"),buildTree=require("./src/buildTree"),parseTree=require("./src/parseTree"),utils=require("./src/utils"),render=function(e,r,n){utils.clearNode(r);var t=new Settings(n),s=parseTree(e,t),o=buildTree(s,e,t).toNode();r.appendChild(o)};"undefined"!=typeof document&&"CSS1Compat"!==document.compatMode&&("undefined"!=typeof console&&console.warn("Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype."),render=function(){throw new ParseError("KaTeX doesn't work in quirks mode.")});var renderToString=function(e,r){var n=new Settings(r),t=parseTree(e,n);return buildTree(t,e,n).toMarkup()},generateParseTree=function(e,r){var n=new Settings(r);return parseTree(e,n)};module.exports={render:render,renderToString:renderToString,__parse:generateParseTree,ParseError:ParseError};

},{"./src/ParseError":57,"./src/Settings":59,"./src/buildTree":64,"./src/parseTree":73,"./src/utils":76}],54:[function(require,module,exports){
"use strict";function Lexer(e){this.input=e,this.pos=0}function Token(e,t,r,n){this.text=e,this.start=t,this.end=r,this.lexer=n}var matchAt=require("match-at"),ParseError=require("./ParseError");Token.prototype.range=function(e,t){return e.lexer!==this.lexer?new Token(t):new Token(t,this.start,e.end,this.lexer)};var tokenRegex=new RegExp("([ \r\n\t]+)|([!-\\[\\]-‧‪-퟿豈-￿]|[�-�][�-�]|\\\\(?:[a-zA-Z]+|[^�-�]))");Lexer.prototype.lex=function(){var e=this.input,t=this.pos;if(t===e.length)return new Token("EOF",t,t,this);var r=matchAt(tokenRegex,e,t);if(null===r)throw new ParseError("Unexpected character: '"+e[t]+"'",new Token(e[t],t,t+1,this));var n=r[2]||" ",s=this.pos;return this.pos+=r[0].length,new Token(n,s,this.pos,this)},module.exports=Lexer;

},{"./ParseError":57,"match-at":79}],55:[function(require,module,exports){
"use strict";function MacroExpander(t,e){this.lexer=new Lexer(t),this.macros=e,this.stack=[],this.discardedWhiteSpace=[]}var Lexer=require("./Lexer");MacroExpander.prototype.nextToken=function(){for(;;){0===this.stack.length&&this.stack.push(this.lexer.lex());var t=this.stack.pop(),e=t.text;if("\\"!==e.charAt(0)||!this.macros.hasOwnProperty(e))return t;var r=this.macros[e];if("string"==typeof r){var s=new Lexer(r);r=[];for(var a=s.lex();"EOF"!==a.text;)r.push(a),a=s.lex();r.reverse(),this.macros[e]=r}this.stack=this.stack.concat(r)}},MacroExpander.prototype.get=function(t){this.discardedWhiteSpace=[];var e=this.nextToken();if(t)for(;" "===e.text;)this.discardedWhiteSpace.push(e),e=this.nextToken();return e},MacroExpander.prototype.unget=function(t){for(this.stack.push(t);0!==this.discardedWhiteSpace.length;)this.stack.push(this.discardedWhiteSpace.pop())},module.exports=MacroExpander;

},{"./Lexer":54}],56:[function(require,module,exports){
"use strict";function Options(t){this.style=t.style,this.color=t.color,this.size=t.size,this.phantom=t.phantom,this.font=t.font,void 0===t.parentStyle?this.parentStyle=t.style:this.parentStyle=t.parentStyle,void 0===t.parentSize?this.parentSize=t.size:this.parentSize=t.parentSize}Options.prototype.extend=function(t){var e={style:this.style,size:this.size,color:this.color,parentStyle:this.style,parentSize:this.size,phantom:this.phantom,font:this.font};for(var a in t)t.hasOwnProperty(a)&&(e[a]=t[a]);return new Options(e)},Options.prototype.withStyle=function(t){return this.extend({style:t})},Options.prototype.withSize=function(t){return this.extend({size:t})},Options.prototype.withColor=function(t){return this.extend({color:t})},Options.prototype.withPhantom=function(){return this.extend({phantom:!0})},Options.prototype.withFont=function(t){return this.extend({font:t||this.font})},Options.prototype.reset=function(){return this.extend({})};var colorMap={"katex-blue":"#6495ed","katex-orange":"#ffa500","katex-pink":"#ff00af","katex-red":"#df0030","katex-green":"#28ae7b","katex-gray":"gray","katex-purple":"#9d38bd","katex-blueA":"#ccfaff","katex-blueB":"#80f6ff","katex-blueC":"#63d9ea","katex-blueD":"#11accd","katex-blueE":"#0c7f99","katex-tealA":"#94fff5","katex-tealB":"#26edd5","katex-tealC":"#01d1c1","katex-tealD":"#01a995","katex-tealE":"#208170","katex-greenA":"#b6ffb0","katex-greenB":"#8af281","katex-greenC":"#74cf70","katex-greenD":"#1fab54","katex-greenE":"#0d923f","katex-goldA":"#ffd0a9","katex-goldB":"#ffbb71","katex-goldC":"#ff9c39","katex-goldD":"#e07d10","katex-goldE":"#a75a05","katex-redA":"#fca9a9","katex-redB":"#ff8482","katex-redC":"#f9685d","katex-redD":"#e84d39","katex-redE":"#bc2612","katex-maroonA":"#ffbde0","katex-maroonB":"#ff92c6","katex-maroonC":"#ed5fa6","katex-maroonD":"#ca337c","katex-maroonE":"#9e034e","katex-purpleA":"#ddd7ff","katex-purpleB":"#c6b9fc","katex-purpleC":"#aa87ff","katex-purpleD":"#7854ab","katex-purpleE":"#543b78","katex-mintA":"#f5f9e8","katex-mintB":"#edf2df","katex-mintC":"#e0e5cc","katex-grayA":"#f6f7f7","katex-grayB":"#f0f1f2","katex-grayC":"#e3e5e6","katex-grayD":"#d6d8da","katex-grayE":"#babec2","katex-grayF":"#888d93","katex-grayG":"#626569","katex-grayH":"#3b3e40","katex-grayI":"#21242c","katex-kaBlue":"#314453","katex-kaGreen":"#71B307"};Options.prototype.getColor=function(){return this.phantom?"transparent":colorMap[this.color]||this.color},module.exports=Options;

},{}],57:[function(require,module,exports){
"use strict";function ParseError(r,e){var o,t,s="KaTeX parse error: "+r;if(e&&e.lexer&&e.start<=e.end){var a=e.lexer.input;o=e.start,t=e.end,o===a.length?s+=" at end of input: ":s+=" at position "+(o+1)+": ";var p=a.slice(o,t).replace(/[^]/g,"$&̲");s+=(o>15?"…"+a.slice(o-15,o):a.slice(0,o))+p+(t+15<a.length?a.slice(t,t+15)+"…":a.slice(t))}var i=new Error(s);return i.name="ParseError",i.__proto__=ParseError.prototype,i.position=o,i}ParseError.prototype.__proto__=Error.prototype,module.exports=ParseError;

},{}],58:[function(require,module,exports){
"use strict";function Parser(e,t){this.gullet=new MacroExpander(e,t.macros),this.settings=t,this.leftrightDepth=0}function ParseFuncOrArgument(e,t,r){this.result=e,this.isFunction=t,this.token=r}var functions=require("./functions"),environments=require("./environments"),MacroExpander=require("./MacroExpander"),symbols=require("./symbols"),utils=require("./utils"),cjkRegex=require("./unicodeRegexes").cjkRegex,parseData=require("./parseData"),ParseError=require("./ParseError"),ParseNode=parseData.ParseNode;Parser.prototype.expect=function(e,t){if(this.nextToken.text!==e)throw new ParseError("Expected '"+e+"', got '"+this.nextToken.text+"'",this.nextToken);!1!==t&&this.consume()},Parser.prototype.consume=function(){this.nextToken=this.gullet.get("math"===this.mode)},Parser.prototype.switchMode=function(e){this.gullet.unget(this.nextToken),this.mode=e,this.consume()},Parser.prototype.parse=function(){return this.mode="math",this.consume(),this.parseInput()},Parser.prototype.parseInput=function(){var e=this.parseExpression(!1);return this.expect("EOF",!1),e};var endOfExpression=["}","\\end","\\right","&","\\\\","\\cr"];Parser.prototype.parseExpression=function(e,t){for(var r=[];;){var s=this.nextToken;if(-1!==endOfExpression.indexOf(s.text))break;if(t&&s.text===t)break;if(e&&functions[s.text]&&functions[s.text].infix)break;var n=this.parseAtom();if(!n){if(!this.settings.throwOnError&&"\\"===s.text[0]){var o=this.handleUnsupportedCmd();r.push(o);continue}break}r.push(n)}return this.handleInfixNodes(r)},Parser.prototype.handleInfixNodes=function(e){for(var t,r=-1,s=0;s<e.length;s++){var n=e[s];if("infix"===n.type){if(-1!==r)throw new ParseError("only one infix operator per group",n.value.token);r=s,t=n.value.replaceWith}}if(-1!==r){var o,i,a=e.slice(0,r),u=e.slice(r+1);o=1===a.length&&"ordgroup"===a[0].type?a[0]:new ParseNode("ordgroup",a,this.mode),i=1===u.length&&"ordgroup"===u[0].type?u[0]:new ParseNode("ordgroup",u,this.mode);var p=this.callFunction(t,[o,i],null);return[new ParseNode(p.type,p,this.mode)]}return e};var SUPSUB_GREEDINESS=1;Parser.prototype.handleSupSubscript=function(e){var t=this.nextToken,r=t.text;this.consume();var s=this.parseGroup();if(s){if(s.isFunction){if(functions[s.result].greediness>SUPSUB_GREEDINESS)return this.parseFunction(s);throw new ParseError("Got function '"+s.result+"' with no arguments as "+e,t)}return s.result}if(this.settings.throwOnError||"\\"!==this.nextToken.text[0])throw new ParseError("Expected group after '"+r+"'",t);return this.handleUnsupportedCmd()},Parser.prototype.handleUnsupportedCmd=function(){for(var e=this.nextToken.text,t=[],r=0;r<e.length;r++)t.push(new ParseNode("textord",e[r],"text"));var s=new ParseNode("text",{body:t,type:"text"},this.mode),n=new ParseNode("color",{color:this.settings.errorColor,value:[s],type:"color"},this.mode);return this.consume(),n},Parser.prototype.parseAtom=function(){var e=this.parseImplicitGroup();if("text"===this.mode)return e;for(var t,r;;){var s=this.nextToken;if("\\limits"===s.text||"\\nolimits"===s.text){if(!e||"op"!==e.type)throw new ParseError("Limit controls must follow a math operator",s);var n="\\limits"===s.text;e.value.limits=n,e.value.alwaysHandleSupSub=!0,this.consume()}else if("^"===s.text){if(t)throw new ParseError("Double superscript",s);t=this.handleSupSubscript("superscript")}else if("_"===s.text){if(r)throw new ParseError("Double subscript",s);r=this.handleSupSubscript("subscript")}else{if("'"!==s.text)break;var o=new ParseNode("textord","\\prime",this.mode),i=[o];for(this.consume();"'"===this.nextToken.text;)i.push(o),this.consume();t=new ParseNode("ordgroup",i,this.mode)}}return t||r?new ParseNode("supsub",{base:e,sup:t,sub:r},this.mode):e};var sizeFuncs=["\\tiny","\\scriptsize","\\footnotesize","\\small","\\normalsize","\\large","\\Large","\\LARGE","\\huge","\\Huge"],styleFuncs=["\\displaystyle","\\textstyle","\\scriptstyle","\\scriptscriptstyle"];Parser.prototype.parseImplicitGroup=function(){var e=this.parseSymbol();if(null==e)return this.parseFunction();var t,r=e.result;if("\\left"===r){var s=this.parseFunction(e);++this.leftrightDepth,t=this.parseExpression(!1),--this.leftrightDepth,this.expect("\\right",!1);var n=this.parseFunction();return new ParseNode("leftright",{body:t,left:s.value.value,right:n.value.value},this.mode)}if("\\begin"===r){var o=this.parseFunction(e),i=o.value.name;if(!environments.hasOwnProperty(i))throw new ParseError("No such environment: "+i,o.value.nameGroup);var a=environments[i],u=this.parseArguments("\\begin{"+i+"}",a),p={mode:this.mode,envName:i,parser:this,positions:u.pop()},h=a.handler(p,u);this.expect("\\end",!1);var l=this.nextToken,c=this.parseFunction();if(c.value.name!==i)throw new ParseError("Mismatch: \\begin{"+i+"} matched by \\end{"+c.value.name+"}",l);return h.position=c.position,h}return utils.contains(sizeFuncs,r)?(t=this.parseExpression(!1),new ParseNode("sizing",{size:"size"+(utils.indexOf(sizeFuncs,r)+1),value:t},this.mode)):utils.contains(styleFuncs,r)?(t=this.parseExpression(!0),new ParseNode("styling",{style:r.slice(1,r.length-5),value:t},this.mode)):this.parseFunction(e)},Parser.prototype.parseFunction=function(e){if(e||(e=this.parseGroup()),e){if(e.isFunction){var t=e.result,r=functions[t];if("text"===this.mode&&!r.allowedInText)throw new ParseError("Can't use function '"+t+"' in text mode",e.token);var s=this.parseArguments(t,r),n=e.token,o=this.callFunction(t,s,s.pop(),n);return new ParseNode(o.type,o,this.mode)}return e.result}return null},Parser.prototype.callFunction=function(e,t,r,s){var n={funcName:e,parser:this,positions:r,token:s};return functions[e].handler(n,t)},Parser.prototype.parseArguments=function(e,t){var r=t.numArgs+t.numOptionalArgs;if(0===r)return[[this.pos]];for(var s=t.greediness,n=[this.pos],o=[],i=0;i<r;i++){var a,u=this.nextToken,p=t.argTypes&&t.argTypes[i];if(i<t.numOptionalArgs){if(!(a=p?this.parseGroupOfType(p,!0):this.parseGroup(!0))){o.push(null),n.push(this.pos);continue}}else if(!(a=p?this.parseGroupOfType(p):this.parseGroup())){if(this.settings.throwOnError||"\\"!==this.nextToken.text[0])throw new ParseError("Expected group after '"+e+"'",u);a=new ParseFuncOrArgument(this.handleUnsupportedCmd(this.nextToken.text),!1)}var h;if(a.isFunction){if(!(functions[a.result].greediness>s))throw new ParseError("Got function '"+a.result+"' as argument to '"+e+"'",u);h=this.parseFunction(a)}else h=a.result;o.push(h),n.push(this.pos)}return o.push(n),o},Parser.prototype.parseGroupOfType=function(e,t){var r=this.mode;if("original"===e&&(e=r),"color"===e)return this.parseColorGroup(t);if("size"===e)return this.parseSizeGroup(t);if(this.switchMode(e),"text"===e)for(;" "===this.nextToken.text;)this.consume();var s=this.parseGroup(t);return this.switchMode(r),s},Parser.prototype.parseStringGroup=function(e,t){if(t&&"["!==this.nextToken.text)return null;var r=this.mode;this.mode="text",this.expect(t?"[":"{");for(var s="",n=this.nextToken,o=n;this.nextToken.text!==(t?"]":"}");){if("EOF"===this.nextToken.text)throw new ParseError("Unexpected end of input in "+e,n.range(this.nextToken,s));s+=(o=this.nextToken).text,this.consume()}return this.mode=r,this.expect(t?"]":"}"),n.range(o,s)},Parser.prototype.parseRegexGroup=function(e,t){var r=this.mode;this.mode="text";for(var s=this.nextToken,n=s,o="";"EOF"!==this.nextToken.text&&e.test(o+this.nextToken.text);)o+=(n=this.nextToken).text,this.consume();if(""===o)throw new ParseError("Invalid "+t+": '"+s.text+"'",s);return this.mode=r,s.range(n,o)},Parser.prototype.parseColorGroup=function(e){var t=this.parseStringGroup("color",e);if(!t)return null;var r=/^(#[a-z0-9]+|[a-z]+)$/i.exec(t.text);if(!r)throw new ParseError("Invalid color: '"+t.text+"'",t);return new ParseFuncOrArgument(new ParseNode("color",r[0],this.mode),!1)},Parser.prototype.parseSizeGroup=function(e){var t;if(!(t=e||"{"===this.nextToken.text?this.parseStringGroup("size",e):this.parseRegexGroup(/^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2}$/,"size")))return null;var r=/([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(t.text);if(!r)throw new ParseError("Invalid size: '"+t.text+"'",t);var s={number:+(r[1]+r[2]),unit:r[3]};if("em"!==s.unit&&"ex"!==s.unit&&"mu"!==s.unit)throw new ParseError("Invalid unit: '"+s.unit+"'",t);return new ParseFuncOrArgument(new ParseNode("color",s,this.mode),!1)},Parser.prototype.parseGroup=function(e){var t=this.nextToken;if(this.nextToken.text===(e?"[":"{")){this.consume();var r=this.parseExpression(!1,e?"]":null),s=this.nextToken;return this.expect(e?"]":"}"),"text"===this.mode&&this.formLigatures(r),new ParseFuncOrArgument(new ParseNode("ordgroup",r,this.mode,t,s),!1)}return e?null:this.parseSymbol()},Parser.prototype.formLigatures=function(e){var t,r=e.length-1;for(t=0;t<r;++t){var s=e[t],n=s.value;"-"===n&&"-"===e[t+1].value&&(t+1<r&&"-"===e[t+2].value?(e.splice(t,3,new ParseNode("textord","---","text",s,e[t+2])),r-=2):(e.splice(t,2,new ParseNode("textord","--","text",s,e[t+1])),r-=1)),"'"!==n&&"`"!==n||e[t+1].value!==n||(e.splice(t,2,new ParseNode("textord",n+n,"text",s,e[t+1])),r-=1)}},Parser.prototype.parseSymbol=function(){var e=this.nextToken;return functions[e.text]?(this.consume(),new ParseFuncOrArgument(e.text,!0,e)):symbols[this.mode][e.text]?(this.consume(),new ParseFuncOrArgument(new ParseNode(symbols[this.mode][e.text].group,e.text,this.mode,e),!1,e)):"text"===this.mode&&cjkRegex.test(e.text)?(this.consume(),new ParseFuncOrArgument(new ParseNode("textord",e.text,this.mode,e),!1,e)):null},Parser.prototype.ParseNode=ParseNode,module.exports=Parser;

},{"./MacroExpander":55,"./ParseError":57,"./environments":67,"./functions":70,"./parseData":72,"./symbols":74,"./unicodeRegexes":75,"./utils":76}],59:[function(require,module,exports){
"use strict";function get(r,t){return void 0===r?t:r}function Settings(r){r=r||{},this.displayMode=get(r.displayMode,!1),this.throwOnError=get(r.throwOnError,!0),this.errorColor=get(r.errorColor,"#cc0000"),this.macros=r.macros||{}}module.exports=Settings;

},{}],60:[function(require,module,exports){
"use strict";function Style(t,e,s,S){this.id=t,this.size=e,this.cramped=S,this.sizeMultiplier=s,this.metrics=metrics[e>0?e-1:0]}var sigmas=require("./fontMetrics.js").sigmas,metrics=[{},{},{}],i;for(var key in sigmas)if(sigmas.hasOwnProperty(key))for(i=0;i<3;i++)metrics[i][key]=sigmas[key][i];for(i=0;i<3;i++)metrics[i].emPerEx=sigmas.xHeight[i]/sigmas.quad[i];Style.prototype.sup=function(){return styles[sup[this.id]]},Style.prototype.sub=function(){return styles[sub[this.id]]},Style.prototype.fracNum=function(){return styles[fracNum[this.id]]},Style.prototype.fracDen=function(){return styles[fracDen[this.id]]},Style.prototype.cramp=function(){return styles[cramp[this.id]]},Style.prototype.cls=function(){return sizeNames[this.size]+(this.cramped?" cramped":" uncramped")},Style.prototype.reset=function(){return resetNames[this.size]},Style.prototype.isTight=function(){return this.size>=2};var D=0,Dc=1,T=2,Tc=3,S=4,Sc=5,SS=6,SSc=7,sizeNames=["displaystyle textstyle","textstyle","scriptstyle","scriptscriptstyle"],resetNames=["reset-textstyle","reset-textstyle","reset-scriptstyle","reset-scriptscriptstyle"],styles=[new Style(D,0,1,!1),new Style(Dc,0,1,!0),new Style(T,1,1,!1),new Style(Tc,1,1,!0),new Style(S,2,.7,!1),new Style(Sc,2,.7,!0),new Style(SS,3,.5,!1),new Style(SSc,3,.5,!0)],sup=[S,Sc,S,Sc,SS,SSc,SS,SSc],sub=[Sc,Sc,Sc,Sc,SSc,SSc,SSc,SSc],fracNum=[T,Tc,S,Sc,SS,SSc,SS,SSc],fracDen=[Tc,Tc,Sc,Sc,SSc,SSc,SSc,SSc],cramp=[Dc,Dc,Tc,Tc,Sc,Sc,SSc,SSc];module.exports={DISPLAY:styles[D],TEXT:styles[T],SCRIPT:styles[S],SCRIPTSCRIPT:styles[SS]};

},{"./fontMetrics.js":68}],61:[function(require,module,exports){
"use strict";var domTree=require("./domTree"),fontMetrics=require("./fontMetrics"),symbols=require("./symbols"),utils=require("./utils"),greekCapitals=["\\Gamma","\\Delta","\\Theta","\\Lambda","\\Xi","\\Pi","\\Sigma","\\Upsilon","\\Phi","\\Psi","\\Omega"],mainitLetters=["ı","ȷ","£"],makeSymbol=function(e,t,a,i,r){symbols[a][e]&&symbols[a][e].replace&&(e=symbols[a][e].replace);var n,m=fontMetrics.getCharacterMetrics(e,t);if(m){var s=m.italic;"text"===a&&(s=0),n=new domTree.symbolNode(e,m.height,m.depth,s,m.skew,r)}else"undefined"!=typeof console&&console.warn("No character metrics for '"+e+"' in style '"+t+"'"),n=new domTree.symbolNode(e,0,0,0,0,r);return i&&(i.style.isTight()&&n.classes.push("mtight"),i.getColor()&&(n.style.color=i.getColor())),n},mathsym=function(e,t,a,i){return"\\"===e||"main"===symbols[t][e].font?makeSymbol(e,"Main-Regular",t,a,i):makeSymbol(e,"AMS-Regular",t,a,i.concat(["amsrm"]))},mathDefault=function(e,t,a,i,r){if("mathord"===r)return mathit(e,t,a,i);if("textord"===r)return makeSymbol(e,"Main-Regular",t,a,i.concat(["mathrm"]));throw new Error("unexpected type: "+r+" in mathDefault")},mathit=function(e,t,a,i){return/[0-9]/.test(e.charAt(0))||utils.contains(mainitLetters,e)||utils.contains(greekCapitals,e)?makeSymbol(e,"Main-Italic",t,a,i.concat(["mainit"])):makeSymbol(e,"Math-Italic",t,a,i.concat(["mathit"]))},makeOrd=function(e,t,a){var i=e.mode,r=e.value;symbols[i][r]&&symbols[i][r].replace&&(r=symbols[i][r].replace);var n=["mord"],m=t.font;if(m){if("mathit"===m||utils.contains(mainitLetters,r))return mathit(r,i,t,n);var s=fontMap[m].fontName;return fontMetrics.getCharacterMetrics(r,s)?makeSymbol(r,s,i,t,n.concat([m])):mathDefault(r,i,t,n,a)}return mathDefault(r,i,t,n,a)},sizeElementFromChildren=function(e){var t=0,a=0,i=0;if(e.children)for(var r=0;r<e.children.length;r++)e.children[r].height>t&&(t=e.children[r].height),e.children[r].depth>a&&(a=e.children[r].depth),e.children[r].maxFontSize>i&&(i=e.children[r].maxFontSize);e.height=t,e.depth=a,e.maxFontSize=i},makeSpan=function(e,t,a){var i=new domTree.span(e,t,a);return sizeElementFromChildren(i),i},prependChildren=function(e,t){e.children=t.concat(e.children),sizeElementFromChildren(e)},makeFragment=function(e){var t=new domTree.documentFragment(e);return sizeElementFromChildren(t),t},makeFontSizer=function(e,t){var a=makeSpan([],[new domTree.symbolNode("​")]);return a.style.fontSize=t/e.style.sizeMultiplier+"em",makeSpan(["fontsize-ensurer","reset-"+e.size,"size5"],[a])},makeVList=function(e,t,a,i){var r,n,m;if("individualShift"===t){var s=e;for(e=[s[0]],n=r=-s[0].shift-s[0].elem.depth,m=1;m<s.length;m++){var l=-s[m].shift-n-s[m].elem.depth,o=l-(s[m-1].elem.height+s[m-1].elem.depth);n+=l,e.push({type:"kern",size:o}),e.push(s[m])}}else if("top"===t){var h=a;for(m=0;m<e.length;m++)"kern"===e[m].type?h-=e[m].size:h-=e[m].elem.height+e[m].elem.depth;r=h}else r="bottom"===t?-a:"shift"===t?-e[0].elem.depth-a:"firstBaseline"===t?-e[0].elem.depth:0;var c=0;for(m=0;m<e.length;m++)"elem"===e[m].type&&(c=Math.max(c,e[m].elem.maxFontSize));var p=makeFontSizer(i,c),u=[];for(n=r,m=0;m<e.length;m++)if("kern"===e[m].type)n+=e[m].size;else{var d=e[m].elem,f=-d.depth-n;n+=d.height+d.depth;var g=makeSpan([],[p,d]);g.height-=f,g.depth+=f,g.style.top=f+"em",u.push(g)}var k=makeSpan(["baseline-fix"],[p,new domTree.symbolNode("​")]);u.push(k);var y=makeSpan(["vlist"],u);return y.height=Math.max(n,y.height),y.depth=Math.max(-r,y.depth),y},sizingMultiplier={size1:.5,size2:.7,size3:.8,size4:.9,size5:1,size6:1.2,size7:1.44,size8:1.73,size9:2.07,size10:2.49},spacingFunctions={"\\qquad":{size:"2em",className:"qquad"},"\\quad":{size:"1em",className:"quad"},"\\enspace":{size:"0.5em",className:"enspace"},"\\;":{size:"0.277778em",className:"thickspace"},"\\:":{size:"0.22222em",className:"mediumspace"},"\\,":{size:"0.16667em",className:"thinspace"},"\\!":{size:"-0.16667em",className:"negativethinspace"}},fontMap={mathbf:{variant:"bold",fontName:"Main-Bold"},mathrm:{variant:"normal",fontName:"Main-Regular"},textit:{variant:"italic",fontName:"Main-Italic"},mathbb:{variant:"double-struck",fontName:"AMS-Regular"},mathcal:{variant:"script",fontName:"Caligraphic-Regular"},mathfrak:{variant:"fraktur",fontName:"Fraktur-Regular"},mathscr:{variant:"script",fontName:"Script-Regular"},mathsf:{variant:"sans-serif",fontName:"SansSerif-Regular"},mathtt:{variant:"monospace",fontName:"Typewriter-Regular"}};module.exports={fontMap:fontMap,makeSymbol:makeSymbol,mathsym:mathsym,makeSpan:makeSpan,makeFragment:makeFragment,makeVList:makeVList,makeOrd:makeOrd,prependChildren:prependChildren,sizingMultiplier:sizingMultiplier,spacingFunctions:spacingFunctions};

},{"./domTree":66,"./fontMetrics":68,"./symbols":74,"./utils":76}],62:[function(require,module,exports){
"use strict";var ParseError=require("./ParseError"),Style=require("./Style"),buildCommon=require("./buildCommon"),delimiter=require("./delimiter"),domTree=require("./domTree"),fontMetrics=require("./fontMetrics"),utils=require("./utils"),makeSpan=buildCommon.makeSpan,isSpace=function(e){return e instanceof domTree.span&&"mspace"===e.classes[0]},isBin=function(e){return e&&"mbin"===e.classes[0]},isBinLeftCanceller=function(e,t){return e?utils.contains(["mbin","mopen","mrel","mop","mpunct"],e.classes[0]):t},isBinRightCanceller=function(e,t){return e?utils.contains(["mrel","mclose","mpunct"],e.classes[0]):t},buildExpression=function(e,t,i){for(var l=[],a=0;a<e.length;a++){var r=e[a],s=buildGroup(r,t);s instanceof domTree.documentFragment?Array.prototype.push.apply(l,s.children):l.push(s)}var m=null;for(a=0;a<l.length;a++)isSpace(l[a])?((m=m||[]).push(l[a]),l.splice(a,1),a--):m&&(l[a]instanceof domTree.symbolNode&&(l[a]=makeSpan([].concat(l[a].classes),[l[a]])),buildCommon.prependChildren(l[a],m),m=null);for(m&&Array.prototype.push.apply(l,m),a=0;a<l.length;a++)isBin(l[a])&&(isBinLeftCanceller(l[a-1],i)||isBinRightCanceller(l[a+1],i))&&(l[a].classes[0]="mord");return l},getTypeOfDomTree=function e(t){if(t instanceof domTree.documentFragment){if(t.children.length)return e(t.children[t.children.length-1])}else if(utils.contains(["mord","mop","mbin","mrel","mopen","mclose","mpunct","minner"],t.classes[0]))return t.classes[0];return null},shouldHandleSupSub=function(e,t){return!!e&&("op"===e.type?e.value.limits&&(t.style.size===Style.DISPLAY.size||e.value.alwaysHandleSupSub):"accent"===e.type?isCharacterBox(e.value.base):null)},getBaseElem=function e(t){return!!t&&("ordgroup"===t.type?1===t.value.length?e(t.value[0]):t:"color"===t.type?1===t.value.value.length?e(t.value.value[0]):t:"font"===t.type?e(t.value.body):t)},isCharacterBox=function(e){var t=getBaseElem(e);return"mathord"===t.type||"textord"===t.type||"bin"===t.type||"rel"===t.type||"inner"===t.type||"open"===t.type||"close"===t.type||"punct"===t.type},makeNullDelimiter=function(e,t){return makeSpan(t.concat(["sizing","reset-"+e.size,"size5",e.style.reset(),Style.TEXT.cls(),"nulldelimiter"]))},groupTypes={};groupTypes.mathord=function(e,t){return buildCommon.makeOrd(e,t,"mathord")},groupTypes.textord=function(e,t){return buildCommon.makeOrd(e,t,"textord")},groupTypes.bin=function(e,t){return buildCommon.mathsym(e.value,e.mode,t,["mbin"])},groupTypes.rel=function(e,t){return buildCommon.mathsym(e.value,e.mode,t,["mrel"])},groupTypes.open=function(e,t){return buildCommon.mathsym(e.value,e.mode,t,["mopen"])},groupTypes.close=function(e,t){return buildCommon.mathsym(e.value,e.mode,t,["mclose"])},groupTypes.inner=function(e,t){return buildCommon.mathsym(e.value,e.mode,t,["minner"])},groupTypes.punct=function(e,t){return buildCommon.mathsym(e.value,e.mode,t,["mpunct"])},groupTypes.ordgroup=function(e,t){return makeSpan(["mord",t.style.cls()],buildExpression(e.value,t.reset(),!0),t)},groupTypes.text=function(e,t){for(var i=t.withFont(e.value.style),l=buildExpression(e.value.body,i,!0),a=0;a<l.length-1;a++)l[a].tryCombine(l[a+1])&&(l.splice(a+1,1),a--);return makeSpan(["mord","text",i.style.cls()],l,i)},groupTypes.color=function(e,t){var i=buildExpression(e.value.value,t.withColor(e.value.color),!1);return new buildCommon.makeFragment(i)},groupTypes.supsub=function(e,t){if(shouldHandleSupSub(e.value.base,t))return groupTypes[e.value.base.type](e,t);var i,l,a,r,s,m=buildGroup(e.value.base,t.reset()),n=t.style;e.value.sup&&(s=t.withStyle(n.sup()),a=buildGroup(e.value.sup,s),i=makeSpan([n.reset(),n.sup().cls()],[a],s)),e.value.sub&&(s=t.withStyle(n.sub()),r=buildGroup(e.value.sub,s),l=makeSpan([n.reset(),n.sub().cls()],[r],s));var u,p;isCharacterBox(e.value.base)?(u=0,p=0):(u=m.height-n.metrics.supDrop,p=m.depth+n.metrics.subDrop);var o;o=n===Style.DISPLAY?n.metrics.sup1:n.cramped?n.metrics.sup3:n.metrics.sup2;var d,h=Style.TEXT.sizeMultiplier*n.sizeMultiplier,c=.5/fontMetrics.metrics.ptPerEm/h+"em";if(e.value.sup)if(e.value.sub){u=Math.max(u,o,a.depth+.25*n.metrics.xHeight),p=Math.max(p,n.metrics.sub2);var y=fontMetrics.metrics.defaultRuleThickness;if(u-a.depth-(r.height-p)<4*y){p=4*y-(u-a.depth)+r.height;var v=.8*n.metrics.xHeight-(u-a.depth);v>0&&(u+=v,p-=v)}d=buildCommon.makeVList([{type:"elem",elem:l,shift:p},{type:"elem",elem:i,shift:-u}],"individualShift",null,t),m instanceof domTree.symbolNode&&(d.children[0].style.marginLeft=-m.italic+"em"),d.children[0].style.marginRight=c,d.children[1].style.marginRight=c}else u=Math.max(u,o,a.depth+.25*n.metrics.xHeight),(d=buildCommon.makeVList([{type:"elem",elem:i}],"shift",-u,t)).children[0].style.marginRight=c;else p=Math.max(p,n.metrics.sub1,r.height-.8*n.metrics.xHeight),(d=buildCommon.makeVList([{type:"elem",elem:l}],"shift",p,t)).children[0].style.marginRight=c,m instanceof domTree.symbolNode&&(d.children[0].style.marginLeft=-m.italic+"em");var g=getTypeOfDomTree(m)||"mord";return makeSpan([g],[m,makeSpan(["msupsub"],[d])],t)},groupTypes.genfrac=function(e,t){var i=t.style;"display"===e.value.size?i=Style.DISPLAY:"text"===e.value.size&&(i=Style.TEXT);var l,a=i.fracNum(),r=i.fracDen();l=t.withStyle(a);var s=buildGroup(e.value.numer,l),m=makeSpan([i.reset(),a.cls()],[s],l);l=t.withStyle(r);var n,u=buildGroup(e.value.denom,l),p=makeSpan([i.reset(),r.cls()],[u],l);n=e.value.hasBarLine?fontMetrics.metrics.defaultRuleThickness/t.style.sizeMultiplier:0;var o,d,h;i.size===Style.DISPLAY.size?(o=i.metrics.num1,d=n>0?3*n:7*fontMetrics.metrics.defaultRuleThickness,h=i.metrics.denom1):(n>0?(o=i.metrics.num2,d=n):(o=i.metrics.num3,d=3*fontMetrics.metrics.defaultRuleThickness),h=i.metrics.denom2);var c;if(0===n){var y=o-s.depth-(u.height-h);y<d&&(o+=.5*(d-y),h+=.5*(d-y)),c=buildCommon.makeVList([{type:"elem",elem:p,shift:h},{type:"elem",elem:m,shift:-o}],"individualShift",null,t)}else{var v=i.metrics.axisHeight;o-s.depth-(v+.5*n)<d&&(o+=d-(o-s.depth-(v+.5*n))),v-.5*n-(u.height-h)<d&&(h+=d-(v-.5*n-(u.height-h)));var g=makeSpan([t.style.reset(),Style.TEXT.cls(),"frac-line"]);g.height=n;var f=-(v-.5*n);c=buildCommon.makeVList([{type:"elem",elem:p,shift:h},{type:"elem",elem:g,shift:f},{type:"elem",elem:m,shift:-o}],"individualShift",null,t)}c.height*=i.sizeMultiplier/t.style.sizeMultiplier,c.depth*=i.sizeMultiplier/t.style.sizeMultiplier;var S;S=i.size===Style.DISPLAY.size?i.metrics.delim1:i.metrics.delim2;var b,k;return b=null==e.value.leftDelim?makeNullDelimiter(t,["mopen"]):delimiter.customSizedDelim(e.value.leftDelim,S,!0,t.withStyle(i),e.mode,["mopen"]),k=null==e.value.rightDelim?makeNullDelimiter(t,["mclose"]):delimiter.customSizedDelim(e.value.rightDelim,S,!0,t.withStyle(i),e.mode,["mclose"]),makeSpan(["mord",t.style.reset(),i.cls()],[b,makeSpan(["mfrac"],[c]),k],t)};var calculateSize=function(e,t){var i=e.number;return"ex"===e.unit?i*=t.metrics.emPerEx:"mu"===e.unit&&(i/=18),i};groupTypes.array=function(e,t){var i,l,a=e.value.body.length,r=0,s=new Array(a),m=t.style,n=1/fontMetrics.metrics.ptPerEm,u=5*n,p=12*n,o=utils.deflt(e.value.arraystretch,1)*p,d=.7*o,h=.3*o,c=0;for(i=0;i<e.value.body.length;++i){var y=e.value.body[i],v=d,g=h;r<y.length&&(r=y.length);var f=new Array(y.length);for(l=0;l<y.length;++l){var S=buildGroup(y[l],t);g<S.depth&&(g=S.depth),v<S.height&&(v=S.height),f[l]=S}var b=0;e.value.rowGaps[i]&&(b=calculateSize(e.value.rowGaps[i].value,m))>0&&(g<(b+=h)&&(g=b),b=0),f.height=v,f.depth=g,c+=v,f.pos=c,c+=g+b,s[i]=f}var k,T,z=c/2+m.metrics.axisHeight,C=e.value.cols||[],M=[];for(l=0,T=0;l<r||T<C.length;++l,++T){for(var x=C[T]||{},w=!0;"separator"===x.type;){if(w||((k=makeSpan(["arraycolsep"],[])).style.width=fontMetrics.metrics.doubleRuleSep+"em",M.push(k)),"|"!==x.separator)throw new ParseError("Invalid separator type: "+x.separator);var L=makeSpan(["vertical-separator"],[]);L.style.height=c+"em",L.style.verticalAlign=-(c-z)+"em",M.push(L),x=C[++T]||{},w=!1}if(!(l>=r)){var E;(l>0||e.value.hskipBeforeAndAfter)&&0!==(E=utils.deflt(x.pregap,u))&&((k=makeSpan(["arraycolsep"],[])).style.width=E+"em",M.push(k));var D=[];for(i=0;i<a;++i){var R=s[i],G=R[l];if(G){var P=R.pos-z;G.depth=R.depth,G.height=R.height,D.push({type:"elem",elem:G,shift:P})}}D=buildCommon.makeVList(D,"individualShift",null,t),D=makeSpan(["col-align-"+(x.align||"c")],[D]),M.push(D),(l<r-1||e.value.hskipBeforeAndAfter)&&0!==(E=utils.deflt(x.postgap,u))&&((k=makeSpan(["arraycolsep"],[])).style.width=E+"em",M.push(k))}}return s=makeSpan(["mtable"],M),makeSpan(["mord"],[s],t)},groupTypes.spacing=function(e,t){return"\\ "===e.value||"\\space"===e.value||" "===e.value||"~"===e.value?"text"===e.mode?buildCommon.makeOrd(e,t,"textord"):makeSpan(["mspace"],[buildCommon.mathsym(e.value,e.mode,t)],t):makeSpan(["mspace",buildCommon.spacingFunctions[e.value].className],[],t)},groupTypes.llap=function(e,t){var i=makeSpan(["inner"],[buildGroup(e.value.body,t.reset())]),l=makeSpan(["fix"],[]);return makeSpan(["mord","llap",t.style.cls()],[i,l],t)},groupTypes.rlap=function(e,t){var i=makeSpan(["inner"],[buildGroup(e.value.body,t.reset())]),l=makeSpan(["fix"],[]);return makeSpan(["mord","rlap",t.style.cls()],[i,l],t)},groupTypes.op=function(e,t){var i,l,a=!1;"supsub"===e.type&&(i=e.value.sup,l=e.value.sub,e=e.value.base,a=!0);var r=t.style,s=["\\smallint"],m=!1;r.size===Style.DISPLAY.size&&e.value.symbol&&!utils.contains(s,e.value.body)&&(m=!0);var n,u=0,p=0;if(e.value.symbol){var o=m?"Size2-Regular":"Size1-Regular";u=((n=buildCommon.makeSymbol(e.value.body,o,"math",t,["mop","op-symbol",m?"large-op":"small-op"])).height-n.depth)/2-r.metrics.axisHeight*r.sizeMultiplier,p=n.italic}else if(e.value.value){var d=buildExpression(e.value.value,t,!0);n=makeSpan(["mop"],d,t)}else{for(var h=[],c=1;c<e.value.body.length;c++)h.push(buildCommon.mathsym(e.value.body[c],e.mode));n=makeSpan(["mop"],h,t)}if(a){n=makeSpan([],[n]);var y,v,g,f,S;if(i){S=t.withStyle(r.sup());var b=buildGroup(i,S);y=makeSpan([r.reset(),r.sup().cls()],[b],S),v=Math.max(fontMetrics.metrics.bigOpSpacing1,fontMetrics.metrics.bigOpSpacing3-b.depth)}if(l){S=t.withStyle(r.sub());var k=buildGroup(l,S);g=makeSpan([r.reset(),r.sub().cls()],[k],S),f=Math.max(fontMetrics.metrics.bigOpSpacing2,fontMetrics.metrics.bigOpSpacing4-k.height)}var T,z,C;if(i)if(l){if(!i&&!l)return n;C=fontMetrics.metrics.bigOpSpacing5+g.height+g.depth+f+n.depth+u,(T=buildCommon.makeVList([{type:"kern",size:fontMetrics.metrics.bigOpSpacing5},{type:"elem",elem:g},{type:"kern",size:f},{type:"elem",elem:n},{type:"kern",size:v},{type:"elem",elem:y},{type:"kern",size:fontMetrics.metrics.bigOpSpacing5}],"bottom",C,t)).children[0].style.marginLeft=-p+"em",T.children[2].style.marginLeft=p+"em"}else C=n.depth+u,(T=buildCommon.makeVList([{type:"elem",elem:n},{type:"kern",size:v},{type:"elem",elem:y},{type:"kern",size:fontMetrics.metrics.bigOpSpacing5}],"bottom",C,t)).children[1].style.marginLeft=p+"em";else z=n.height-u,(T=buildCommon.makeVList([{type:"kern",size:fontMetrics.metrics.bigOpSpacing5},{type:"elem",elem:g},{type:"kern",size:f},{type:"elem",elem:n}],"top",z,t)).children[0].style.marginLeft=-p+"em";return makeSpan(["mop","op-limits"],[T],t)}return e.value.symbol&&(n.style.top=u+"em"),n},groupTypes.mod=function(e,t){var i=[];if("bmod"===e.value.modType?(t.style.isTight()||i.push(makeSpan(["mspace","negativemediumspace"],[],t)),i.push(makeSpan(["mspace","thickspace"],[],t))):t.style.size===Style.DISPLAY.size?i.push(makeSpan(["mspace","quad"],[],t)):"mod"===e.value.modType?i.push(makeSpan(["mspace","twelvemuspace"],[],t)):i.push(makeSpan(["mspace","eightmuspace"],[],t)),"pod"!==e.value.modType&&"pmod"!==e.value.modType||i.push(buildCommon.mathsym("(",e.mode)),"pod"!==e.value.modType){var l=[buildCommon.mathsym("m",e.mode),buildCommon.mathsym("o",e.mode),buildCommon.mathsym("d",e.mode)];"bmod"===e.value.modType?(i.push(makeSpan(["mbin"],l,t)),i.push(makeSpan(["mspace","thickspace"],[],t)),t.style.isTight()||i.push(makeSpan(["mspace","negativemediumspace"],[],t))):(Array.prototype.push.apply(i,l),i.push(makeSpan(["mspace","sixmuspace"],[],t)))}return e.value.value&&Array.prototype.push.apply(i,buildExpression(e.value.value,t,!1)),"pod"!==e.value.modType&&"pmod"!==e.value.modType||i.push(buildCommon.mathsym(")",e.mode)),buildCommon.makeFragment(i)},groupTypes.katex=function(e,t){var i=makeSpan(["k"],[buildCommon.mathsym("K",e.mode)],t),l=makeSpan(["a"],[buildCommon.mathsym("A",e.mode)],t);l.height=.75*(l.height+.2),l.depth=.75*(l.height-.2);var a=makeSpan(["t"],[buildCommon.mathsym("T",e.mode)],t),r=makeSpan(["e"],[buildCommon.mathsym("E",e.mode)],t);r.height=r.height-.2155,r.depth=r.depth+.2155;var s=makeSpan(["x"],[buildCommon.mathsym("X",e.mode)],t);return makeSpan(["mord","katex-logo"],[i,l,a,r,s],t)},groupTypes.overline=function(e,t){var i=t.style,l=buildGroup(e.value.body,t.withStyle(i.cramp())),a=fontMetrics.metrics.defaultRuleThickness/i.sizeMultiplier,r=makeSpan([i.reset(),Style.TEXT.cls(),"overline-line"]);r.height=a,r.maxFontSize=1;var s=buildCommon.makeVList([{type:"elem",elem:l},{type:"kern",size:3*a},{type:"elem",elem:r},{type:"kern",size:a}],"firstBaseline",null,t);return makeSpan(["mord","overline"],[s],t)},groupTypes.underline=function(e,t){var i=t.style,l=buildGroup(e.value.body,t),a=fontMetrics.metrics.defaultRuleThickness/i.sizeMultiplier,r=makeSpan([i.reset(),Style.TEXT.cls(),"underline-line"]);r.height=a,r.maxFontSize=1;var s=buildCommon.makeVList([{type:"kern",size:a},{type:"elem",elem:r},{type:"kern",size:3*a},{type:"elem",elem:l}],"top",l.height,t);return makeSpan(["mord","underline"],[s],t)},groupTypes.sqrt=function(e,t){var i=t.style,l=buildGroup(e.value.body,t.withStyle(i.cramp())),a=fontMetrics.metrics.defaultRuleThickness/i.sizeMultiplier,r=makeSpan([i.reset(),Style.TEXT.cls(),"sqrt-line"],[],t);r.height=a,r.maxFontSize=1;var s=a;i.id<Style.TEXT.id&&(s=i.metrics.xHeight);var m=a+s/4,n=(l.height+l.depth)*i.sizeMultiplier+m+a,u=makeSpan(["sqrt-sign"],[delimiter.customSizedDelim("\\surd",n,!1,t,e.mode)],t),p=u.height+u.depth-a;p>l.height+l.depth+m&&(m=(m+p-l.height-l.depth)/2);var o=-(l.height+m+a)+u.height;u.style.top=o+"em",u.height-=o,u.depth+=o;var d;if(d=0===l.height&&0===l.depth?makeSpan():buildCommon.makeVList([{type:"elem",elem:l},{type:"kern",size:m},{type:"elem",elem:r},{type:"kern",size:a}],"firstBaseline",null,t),e.value.index){var h=t.withStyle(Style.SCRIPTSCRIPT),c=buildGroup(e.value.index,h),y=makeSpan([i.reset(),Style.SCRIPTSCRIPT.cls()],[c],h),v=.6*(Math.max(u.height,d.height)-Math.max(u.depth,d.depth)),g=buildCommon.makeVList([{type:"elem",elem:y}],"shift",-v,t),f=makeSpan(["root"],[g]);return makeSpan(["mord","sqrt"],[f,u,d],t)}return makeSpan(["mord","sqrt"],[u,d],t)},groupTypes.sizing=function(e,t){var i=buildExpression(e.value.value,t.withSize(e.value.size),!1),l=t.style,a=buildCommon.sizingMultiplier[e.value.size];a*=l.sizeMultiplier;for(var r=0;r<i.length;r++){var s=utils.indexOf(i[r].classes,"sizing");s<0?(i[r].classes.push("sizing","reset-"+t.size,e.value.size,l.cls()),i[r].maxFontSize=a):i[r].classes[s+1]==="reset-"+e.value.size&&(i[r].classes[s+1]="reset-"+t.size)}return buildCommon.makeFragment(i)},groupTypes.styling=function(e,t){for(var i={display:Style.DISPLAY,text:Style.TEXT,script:Style.SCRIPT,scriptscript:Style.SCRIPTSCRIPT}[e.value.style],l=t.withStyle(i),a=buildExpression(e.value.value,l,!1),r=0;r<a.length;r++){var s=utils.indexOf(a[r].classes,i.reset());s<0?a[r].classes.push(t.style.reset(),i.cls()):a[r].classes[s]=t.style.reset()}return new buildCommon.makeFragment(a)},groupTypes.font=function(e,t){var i=e.value.font;return buildGroup(e.value.body,t.withFont(i))},groupTypes.delimsizing=function(e,t){var i=e.value.value;return"."===i?makeSpan([e.value.mclass]):delimiter.sizedDelim(i,e.value.size,t,e.mode,[e.value.mclass])},groupTypes.leftright=function(e,t){for(var i=buildExpression(e.value.body,t.reset(),!0),l=0,a=0,r=!1,s=0;s<i.length;s++)i[s].isMiddle?r=!0:(l=Math.max(i[s].height,l),a=Math.max(i[s].depth,a));var m=t.style;l*=m.sizeMultiplier,a*=m.sizeMultiplier;var n;if(n="."===e.value.left?makeNullDelimiter(t,["mopen"]):delimiter.leftRightDelim(e.value.left,l,a,t,e.mode,["mopen"]),i.unshift(n),r)for(s=1;s<i.length;s++)i[s].isMiddle&&(i[s]=delimiter.leftRightDelim(i[s].isMiddle.value,l,a,i[s].isMiddle.options,e.mode,[]));var u;return u="."===e.value.right?makeNullDelimiter(t,["mclose"]):delimiter.leftRightDelim(e.value.right,l,a,t,e.mode,["mclose"]),i.push(u),makeSpan(["minner",m.cls()],i,t)},groupTypes.middle=function(e,t){var i;return"."===e.value.value?i=makeNullDelimiter(t,[]):(i=delimiter.sizedDelim(e.value.value,1,t,e.mode,[])).isMiddle={value:e.value.value,options:t},i},groupTypes.rule=function(e,t){var i=makeSpan(["mord","rule"],[],t),l=t.style,a=0;e.value.shift&&(a=calculateSize(e.value.shift,l));var r=calculateSize(e.value.width,l),s=calculateSize(e.value.height,l);return a/=l.sizeMultiplier,r/=l.sizeMultiplier,s/=l.sizeMultiplier,i.style.borderRightWidth=r+"em",i.style.borderTopWidth=s+"em",i.style.bottom=a+"em",i.width=r,i.height=s+a,i.depth=-a,i},groupTypes.kern=function(e,t){var i=makeSpan(["mord","rule"],[],t),l=t.style,a=0;return e.value.dimension&&(a=calculateSize(e.value.dimension,l)),a/=l.sizeMultiplier,i.style.marginLeft=a+"em",i},groupTypes.accent=function(e,t){var i,l=e.value.base,a=t.style;if("supsub"===e.type){var r=e;l=(e=r.value.base).value.base,r.value.base=l,i=buildGroup(r,t.reset())}var s,m=buildGroup(l,t.withStyle(a.cramp()));if(isCharacterBox(l)){var n=getBaseElem(l);s=buildGroup(n,t.withStyle(a.cramp())).skew}else s=0;var u=Math.min(m.height,a.metrics.xHeight),p=buildCommon.makeSymbol(e.value.accent,"Main-Regular","math",t);p.italic=0;var o="\\vec"===e.value.accent?"accent-vec":null,d=makeSpan(["accent-body",o],[makeSpan([],[p])]);(d=buildCommon.makeVList([{type:"elem",elem:m},{type:"kern",size:-u},{type:"elem",elem:d}],"firstBaseline",null,t)).children[1].style.marginLeft=2*s+"em";var h=makeSpan(["mord","accent"],[d],t);return i?(i.children[0]=h,i.height=Math.max(h.height,i.height),i.classes[0]="mord",i):h},groupTypes.phantom=function(e,t){var i=buildExpression(e.value.value,t.withPhantom(),!1);return new buildCommon.makeFragment(i)},groupTypes.mclass=function(e,t){var i=buildExpression(e.value.value,t,!0);return makeSpan([e.value.mclass],i,t)};var buildGroup=function(e,t){if(!e)return makeSpan();if(groupTypes[e.type]){var i,l=groupTypes[e.type](e,t);return t.style!==t.parentStyle&&(i=t.style.sizeMultiplier/t.parentStyle.sizeMultiplier,l.height*=i,l.depth*=i),t.size!==t.parentSize&&(i=buildCommon.sizingMultiplier[t.size]/buildCommon.sizingMultiplier[t.parentSize],l.height*=i,l.depth*=i),l}throw new ParseError("Got group of unknown type: '"+e.type+"'")},buildHTML=function(e,t){e=JSON.parse(JSON.stringify(e));var i=buildExpression(e,t,!0),l=makeSpan(["base",t.style.cls()],i,t),a=makeSpan(["strut"]),r=makeSpan(["strut","bottom"]);a.style.height=l.height+"em",r.style.height=l.height+l.depth+"em",r.style.verticalAlign=-l.depth+"em";var s=makeSpan(["katex-html"],[a,r,l]);return s.setAttribute("aria-hidden","true"),s};module.exports=buildHTML;

},{"./ParseError":57,"./Style":60,"./buildCommon":61,"./delimiter":65,"./domTree":66,"./fontMetrics":68,"./utils":76}],63:[function(require,module,exports){
"use strict";var buildCommon=require("./buildCommon"),fontMetrics=require("./fontMetrics"),mathMLTree=require("./mathMLTree"),ParseError=require("./ParseError"),symbols=require("./symbols"),utils=require("./utils"),makeSpan=buildCommon.makeSpan,fontMap=buildCommon.fontMap,makeText=function(e,t){return symbols[t][e]&&symbols[t][e].replace&&(e=symbols[t][e].replace),new mathMLTree.TextNode(e)},getVariant=function(e,t){var r=t.font;if(!r)return null;var a=e.mode;if("mathit"===r)return"italic";var u=e.value;if(utils.contains(["\\imath","\\jmath"],u))return null;symbols[a][u]&&symbols[a][u].replace&&(u=symbols[a][u].replace);var o=fontMap[r].fontName;return fontMetrics.getCharacterMetrics(u,o)?fontMap[t.font].variant:null},groupTypes={};groupTypes.mathord=function(e,t){var r=new mathMLTree.MathNode("mi",[makeText(e.value,e.mode)]),a=getVariant(e,t);return a&&r.setAttribute("mathvariant",a),r},groupTypes.textord=function(e,t){var r,a=makeText(e.value,e.mode),u=getVariant(e,t)||"normal";return/[0-9]/.test(e.value)?(r=new mathMLTree.MathNode("mn",[a]),t.font&&r.setAttribute("mathvariant",u)):(r=new mathMLTree.MathNode("mi",[a])).setAttribute("mathvariant",u),r},groupTypes.bin=function(e){return new mathMLTree.MathNode("mo",[makeText(e.value,e.mode)])},groupTypes.rel=function(e){return new mathMLTree.MathNode("mo",[makeText(e.value,e.mode)])},groupTypes.open=function(e){return new mathMLTree.MathNode("mo",[makeText(e.value,e.mode)])},groupTypes.close=function(e){return new mathMLTree.MathNode("mo",[makeText(e.value,e.mode)])},groupTypes.inner=function(e){return new mathMLTree.MathNode("mo",[makeText(e.value,e.mode)])},groupTypes.punct=function(e){var t=new mathMLTree.MathNode("mo",[makeText(e.value,e.mode)]);return t.setAttribute("separator","true"),t},groupTypes.ordgroup=function(e,t){var r=buildExpression(e.value,t);return new mathMLTree.MathNode("mrow",r)},groupTypes.text=function(e,t){var r=buildExpression(e.value.body,t);return new mathMLTree.MathNode("mtext",r)},groupTypes.color=function(e,t){var r=buildExpression(e.value.value,t),a=new mathMLTree.MathNode("mstyle",r);return a.setAttribute("mathcolor",e.value.color),a},groupTypes.supsub=function(e,t){var r=[buildGroup(e.value.base,t)];e.value.sub&&r.push(buildGroup(e.value.sub,t)),e.value.sup&&r.push(buildGroup(e.value.sup,t));var a;return a=e.value.sub?e.value.sup?"msubsup":"msub":"msup",new mathMLTree.MathNode(a,r)},groupTypes.genfrac=function(e,t){var r=new mathMLTree.MathNode("mfrac",[buildGroup(e.value.numer,t),buildGroup(e.value.denom,t)]);if(e.value.hasBarLine||r.setAttribute("linethickness","0px"),null!=e.value.leftDelim||null!=e.value.rightDelim){var a=[];if(null!=e.value.leftDelim){var u=new mathMLTree.MathNode("mo",[new mathMLTree.TextNode(e.value.leftDelim)]);u.setAttribute("fence","true"),a.push(u)}if(a.push(r),null!=e.value.rightDelim){var o=new mathMLTree.MathNode("mo",[new mathMLTree.TextNode(e.value.rightDelim)]);o.setAttribute("fence","true"),a.push(o)}return new mathMLTree.MathNode("mrow",a)}return r},groupTypes.array=function(e,t){return new mathMLTree.MathNode("mtable",e.value.body.map(function(e){return new mathMLTree.MathNode("mtr",e.map(function(e){return new mathMLTree.MathNode("mtd",[buildGroup(e,t)])}))}))},groupTypes.sqrt=function(e,t){return e.value.index?new mathMLTree.MathNode("mroot",[buildGroup(e.value.body,t),buildGroup(e.value.index,t)]):new mathMLTree.MathNode("msqrt",[buildGroup(e.value.body,t)])},groupTypes.leftright=function(e,t){var r=buildExpression(e.value.body,t);if("."!==e.value.left){var a=new mathMLTree.MathNode("mo",[makeText(e.value.left,e.mode)]);a.setAttribute("fence","true"),r.unshift(a)}if("."!==e.value.right){var u=new mathMLTree.MathNode("mo",[makeText(e.value.right,e.mode)]);u.setAttribute("fence","true"),r.push(u)}return new mathMLTree.MathNode("mrow",r)},groupTypes.middle=function(e,t){var r=new mathMLTree.MathNode("mo",[makeText(e.value.middle,e.mode)]);return r.setAttribute("fence","true"),r},groupTypes.accent=function(e,t){var r=new mathMLTree.MathNode("mo",[makeText(e.value.accent,e.mode)]),a=new mathMLTree.MathNode("mover",[buildGroup(e.value.base,t),r]);return a.setAttribute("accent","true"),a},groupTypes.spacing=function(e){var t;return"\\ "===e.value||"\\space"===e.value||" "===e.value||"~"===e.value?t=new mathMLTree.MathNode("mtext",[new mathMLTree.TextNode(" ")]):(t=new mathMLTree.MathNode("mspace")).setAttribute("width",buildCommon.spacingFunctions[e.value].size),t},groupTypes.op=function(e,t){return e.value.symbol?new mathMLTree.MathNode("mo",[makeText(e.value.body,e.mode)]):e.value.value?new mathMLTree.MathNode("mo",buildExpression(e.value.value,t)):new mathMLTree.MathNode("mi",[new mathMLTree.TextNode(e.value.body.slice(1))])},groupTypes.mod=function(e,t){var r=[];if("pod"!==e.value.modType&&"pmod"!==e.value.modType||r.push(new mathMLTree.MathNode("mo",[makeText("(",e.mode)])),"pod"!==e.value.modType&&r.push(new mathMLTree.MathNode("mo",[makeText("mod",e.mode)])),e.value.value){var a=new mathMLTree.MathNode("mspace");a.setAttribute("width","0.333333em"),r.push(a),r=r.concat(buildExpression(e.value.value,t))}return"pod"!==e.value.modType&&"pmod"!==e.value.modType||r.push(new mathMLTree.MathNode("mo",[makeText(")",e.mode)])),new mathMLTree.MathNode("mo",r)},groupTypes.katex=function(e){return new mathMLTree.MathNode("mtext",[new mathMLTree.TextNode("KaTeX")])},groupTypes.font=function(e,t){var r=e.value.font;return buildGroup(e.value.body,t.withFont(r))},groupTypes.delimsizing=function(e){var t=[];"."!==e.value.value&&t.push(makeText(e.value.value,e.mode));var r=new mathMLTree.MathNode("mo",t);return"mopen"===e.value.mclass||"mclose"===e.value.mclass?r.setAttribute("fence","true"):r.setAttribute("fence","false"),r},groupTypes.styling=function(e,t){var r=buildExpression(e.value.value,t),a=new mathMLTree.MathNode("mstyle",r),u={display:["0","true"],text:["0","false"],script:["1","false"],scriptscript:["2","false"]}[e.value.style];return a.setAttribute("scriptlevel",u[0]),a.setAttribute("displaystyle",u[1]),a},groupTypes.sizing=function(e,t){var r=buildExpression(e.value.value,t),a=new mathMLTree.MathNode("mstyle",r);return a.setAttribute("mathsize",buildCommon.sizingMultiplier[e.value.size]+"em"),a},groupTypes.overline=function(e,t){var r=new mathMLTree.MathNode("mo",[new mathMLTree.TextNode("‾")]);r.setAttribute("stretchy","true");var a=new mathMLTree.MathNode("mover",[buildGroup(e.value.body,t),r]);return a.setAttribute("accent","true"),a},groupTypes.underline=function(e,t){var r=new mathMLTree.MathNode("mo",[new mathMLTree.TextNode("‾")]);r.setAttribute("stretchy","true");var a=new mathMLTree.MathNode("munder",[buildGroup(e.value.body,t),r]);return a.setAttribute("accentunder","true"),a},groupTypes.rule=function(e){return new mathMLTree.MathNode("mrow")},groupTypes.kern=function(e){return new mathMLTree.MathNode("mrow")},groupTypes.llap=function(e,t){var r=new mathMLTree.MathNode("mpadded",[buildGroup(e.value.body,t)]);return r.setAttribute("lspace","-1width"),r.setAttribute("width","0px"),r},groupTypes.rlap=function(e,t){var r=new mathMLTree.MathNode("mpadded",[buildGroup(e.value.body,t)]);return r.setAttribute("width","0px"),r},groupTypes.phantom=function(e,t){var r=buildExpression(e.value.value,t);return new mathMLTree.MathNode("mphantom",r)},groupTypes.mclass=function(e,t){var r=buildExpression(e.value.value,t);return new mathMLTree.MathNode("mstyle",r)};var buildExpression=function(e,t){for(var r=[],a=0;a<e.length;a++){var u=e[a];r.push(buildGroup(u,t))}return r},buildGroup=function(e,t){if(!e)return new mathMLTree.MathNode("mrow");if(groupTypes[e.type])return groupTypes[e.type](e,t);throw new ParseError("Got group of unknown type: '"+e.type+"'")},buildMathML=function(e,t,r){var a=buildExpression(e,r),u=new mathMLTree.MathNode("mrow",a),o=new mathMLTree.MathNode("annotation",[new mathMLTree.TextNode(t)]);o.setAttribute("encoding","application/x-tex");var n=new mathMLTree.MathNode("semantics",[u,o]),m=new mathMLTree.MathNode("math",[n]);return makeSpan(["katex-mathml"],[m])};module.exports=buildMathML;

},{"./ParseError":57,"./buildCommon":61,"./fontMetrics":68,"./mathMLTree":71,"./symbols":74,"./utils":76}],64:[function(require,module,exports){
"use strict";var buildHTML=require("./buildHTML"),buildMathML=require("./buildMathML"),buildCommon=require("./buildCommon"),Options=require("./Options"),Settings=require("./Settings"),Style=require("./Style"),makeSpan=buildCommon.makeSpan,buildTree=function(e,i,t){t=t||new Settings({});var r=Style.TEXT;t.displayMode&&(r=Style.DISPLAY);var u=new Options({style:r,size:"size5"}),l=buildMathML(e,i,u),a=buildHTML(e,u),n=makeSpan(["katex"],[l,a]);return t.displayMode?makeSpan(["katex-display"],[n]):n};module.exports=buildTree;

},{"./Options":56,"./Settings":59,"./Style":60,"./buildCommon":61,"./buildHTML":62,"./buildMathML":63}],65:[function(require,module,exports){
"use strict";var ParseError=require("./ParseError"),Style=require("./Style"),buildCommon=require("./buildCommon"),fontMetrics=require("./fontMetrics"),symbols=require("./symbols"),utils=require("./utils"),makeSpan=buildCommon.makeSpan,getMetrics=function(e,r){return symbols.math[e]&&symbols.math[e].replace?fontMetrics.getCharacterMetrics(symbols.math[e].replace,r):fontMetrics.getCharacterMetrics(e,r)},mathrmSize=function(e,r,t,l){return buildCommon.makeSymbol(e,"Size"+r+"-Regular",t,l)},styleWrap=function(e,r,t,l){var i=makeSpan((l=l||[]).concat(["style-wrap",t.style.reset(),r.cls()]),[e],t),a=r.sizeMultiplier/t.style.sizeMultiplier;return i.height*=a,i.depth*=a,i.maxFontSize=r.sizeMultiplier,i},makeSmallDelim=function(e,r,t,l,i,a){var s=buildCommon.makeSymbol(e,"Main-Regular",i,l),m=styleWrap(s,r,l,a);if(t){var n=(1-l.style.sizeMultiplier/r.sizeMultiplier)*l.style.metrics.axisHeight;m.style.top=n+"em",m.height-=n,m.depth+=n}return m},makeLargeDelim=function(e,r,t,l,i,a){var s=mathrmSize(e,r,i,l),m=styleWrap(makeSpan(["delimsizing","size"+r],[s],l),Style.TEXT,l,a);if(t){var n=(1-l.style.sizeMultiplier)*l.style.metrics.axisHeight;m.style.top=n+"em",m.height-=n,m.depth+=n}return m},makeInner=function(e,r,t){var l;return"Size1-Regular"===r?l="delim-size1":"Size4-Regular"===r&&(l="delim-size4"),{type:"elem",elem:makeSpan(["delimsizinginner",l],[makeSpan([],[buildCommon.makeSymbol(e,r,t)])])}},makeStackedDelim=function(e,r,t,l,i,a){var s,m,n,u;s=n=u=e,m=null;var o="Size1-Regular";"\\uparrow"===e?n=u="⏐":"\\Uparrow"===e?n=u="‖":"\\downarrow"===e?s=n="⏐":"\\Downarrow"===e?s=n="‖":"\\updownarrow"===e?(s="\\uparrow",n="⏐",u="\\downarrow"):"\\Updownarrow"===e?(s="\\Uparrow",n="‖",u="\\Downarrow"):"["===e||"\\lbrack"===e?(s="⎡",n="⎢",u="⎣",o="Size4-Regular"):"]"===e||"\\rbrack"===e?(s="⎤",n="⎥",u="⎦",o="Size4-Regular"):"\\lfloor"===e?(n=s="⎢",u="⎣",o="Size4-Regular"):"\\lceil"===e?(s="⎡",n=u="⎢",o="Size4-Regular"):"\\rfloor"===e?(n=s="⎥",u="⎦",o="Size4-Regular"):"\\rceil"===e?(s="⎤",n=u="⎥",o="Size4-Regular"):"("===e?(s="⎛",n="⎜",u="⎝",o="Size4-Regular"):")"===e?(s="⎞",n="⎟",u="⎠",o="Size4-Regular"):"\\{"===e||"\\lbrace"===e?(s="⎧",m="⎨",u="⎩",n="⎪",o="Size4-Regular"):"\\}"===e||"\\rbrace"===e?(s="⎫",m="⎬",u="⎭",n="⎪",o="Size4-Regular"):"\\lgroup"===e?(s="⎧",u="⎩",n="⎪",o="Size4-Regular"):"\\rgroup"===e?(s="⎫",u="⎭",n="⎪",o="Size4-Regular"):"\\lmoustache"===e?(s="⎧",u="⎭",n="⎪",o="Size4-Regular"):"\\rmoustache"===e?(s="⎫",u="⎩",n="⎪",o="Size4-Regular"):"\\surd"===e&&(s="",u="⎷",n="",o="Size4-Regular");var c=getMetrics(s,o),g=c.height+c.depth,p=getMetrics(n,o),y=p.height+p.depth,S=getMetrics(u,o),k=S.height+S.depth,z=0,h=1;if(null!==m){var d=getMetrics(m,o);z=d.height+d.depth,h=2}var f=g+k+z,D=Math.ceil((r-f)/(h*y)),R=f+D*h*y,w=l.style.metrics.axisHeight;t&&(w*=l.style.sizeMultiplier);var v=R/2-w,M=[];M.push(makeInner(u,o,i));var b;if(null===m)for(b=0;b<D;b++)M.push(makeInner(n,o,i));else{for(b=0;b<D;b++)M.push(makeInner(n,o,i));for(M.push(makeInner(m,o,i)),b=0;b<D;b++)M.push(makeInner(n,o,i))}M.push(makeInner(s,o,i));var T=buildCommon.makeVList(M,"bottom",v,l);return styleWrap(makeSpan(["delimsizing","mult"],[T],l),Style.TEXT,l,a)},stackLargeDelimiters=["(",")","[","\\lbrack","]","\\rbrack","\\{","\\lbrace","\\}","\\rbrace","\\lfloor","\\rfloor","\\lceil","\\rceil","\\surd"],stackAlwaysDelimiters=["\\uparrow","\\downarrow","\\updownarrow","\\Uparrow","\\Downarrow","\\Updownarrow","|","\\|","\\vert","\\Vert","\\lvert","\\rvert","\\lVert","\\rVert","\\lgroup","\\rgroup","\\lmoustache","\\rmoustache"],stackNeverDelimiters=["<",">","\\langle","\\rangle","/","\\backslash","\\lt","\\gt"],sizeToMaxHeight=[0,1.2,1.8,2.4,3],makeSizedDelim=function(e,r,t,l,i){if("<"===e||"\\lt"===e?e="\\langle":">"!==e&&"\\gt"!==e||(e="\\rangle"),utils.contains(stackLargeDelimiters,e)||utils.contains(stackNeverDelimiters,e))return makeLargeDelim(e,r,!1,t,l,i);if(utils.contains(stackAlwaysDelimiters,e))return makeStackedDelim(e,sizeToMaxHeight[r],!1,t,l,i);throw new ParseError("Illegal delimiter: '"+e+"'")},stackNeverDelimiterSequence=[{type:"small",style:Style.SCRIPTSCRIPT},{type:"small",style:Style.SCRIPT},{type:"small",style:Style.TEXT},{type:"large",size:1},{type:"large",size:2},{type:"large",size:3},{type:"large",size:4}],stackAlwaysDelimiterSequence=[{type:"small",style:Style.SCRIPTSCRIPT},{type:"small",style:Style.SCRIPT},{type:"small",style:Style.TEXT},{type:"stack"}],stackLargeDelimiterSequence=[{type:"small",style:Style.SCRIPTSCRIPT},{type:"small",style:Style.SCRIPT},{type:"small",style:Style.TEXT},{type:"large",size:1},{type:"large",size:2},{type:"large",size:3},{type:"large",size:4},{type:"stack"}],delimTypeToFont=function(e){return"small"===e.type?"Main-Regular":"large"===e.type?"Size"+e.size+"-Regular":"stack"===e.type?"Size4-Regular":void 0},traverseSequence=function(e,r,t,l){for(var i=Math.min(2,3-l.style.size);i<t.length&&"stack"!==t[i].type;i++){var a=getMetrics(e,delimTypeToFont(t[i])),s=a.height+a.depth;if("small"===t[i].type&&(s*=t[i].style.sizeMultiplier),s>r)return t[i]}return t[t.length-1]},makeCustomSizedDelim=function(e,r,t,l,i,a){"<"===e||"\\lt"===e?e="\\langle":">"!==e&&"\\gt"!==e||(e="\\rangle");var s;s=utils.contains(stackNeverDelimiters,e)?stackNeverDelimiterSequence:utils.contains(stackLargeDelimiters,e)?stackLargeDelimiterSequence:stackAlwaysDelimiterSequence;var m=traverseSequence(e,r,s,l);return"small"===m.type?makeSmallDelim(e,m.style,t,l,i,a):"large"===m.type?makeLargeDelim(e,m.size,t,l,i,a):"stack"===m.type?makeStackedDelim(e,r,t,l,i,a):void 0},makeLeftRightDelim=function(e,r,t,l,i,a){var s=l.style.metrics.axisHeight*l.style.sizeMultiplier,m=5/fontMetrics.metrics.ptPerEm,n=Math.max(r-s,t+s),u=Math.max(n/500*901,2*n-m);return makeCustomSizedDelim(e,u,!0,l,i,a)};module.exports={sizedDelim:makeSizedDelim,customSizedDelim:makeCustomSizedDelim,leftRightDelim:makeLeftRightDelim};

},{"./ParseError":57,"./Style":60,"./buildCommon":61,"./fontMetrics":68,"./symbols":74,"./utils":76}],66:[function(require,module,exports){
"use strict";function span(t,e,s){this.classes=t||[],this.children=e||[],this.height=0,this.depth=0,this.maxFontSize=0,this.style={},this.attributes={},s&&(s.style.isTight()&&this.classes.push("mtight"),s.getColor()&&(this.style.color=s.getColor()))}function documentFragment(t){this.children=t||[],this.height=0,this.depth=0,this.maxFontSize=0}function symbolNode(t,e,s,i,a,r,h){this.value=t||"",this.height=e||0,this.depth=s||0,this.italic=i||0,this.skew=a||0,this.classes=r||[],this.style=h||{},this.maxFontSize=0,unicodeRegexes.cjkRegex.test(t)&&(unicodeRegexes.hangulRegex.test(t)?this.classes.push("hangul_fallback"):this.classes.push("cjk_fallback")),/[îïíì]/.test(this.value)&&(this.value=iCombinations[this.value])}var unicodeRegexes=require("./unicodeRegexes"),utils=require("./utils"),createClass=function(t){for(var e=(t=t.slice()).length-1;e>=0;e--)t[e]||t.splice(e,1);return t.join(" ")};span.prototype.setAttribute=function(t,e){this.attributes[t]=e},span.prototype.tryCombine=function(t){return!1},span.prototype.toNode=function(){var t=document.createElement("span");t.className=createClass(this.classes);for(var e in this.style)Object.prototype.hasOwnProperty.call(this.style,e)&&(t.style[e]=this.style[e]);for(var s in this.attributes)Object.prototype.hasOwnProperty.call(this.attributes,s)&&t.setAttribute(s,this.attributes[s]);for(var i=0;i<this.children.length;i++)t.appendChild(this.children[i].toNode());return t},span.prototype.toMarkup=function(){var t="<span";this.classes.length&&(t+=' class="',t+=utils.escape(createClass(this.classes)),t+='"');var e="";for(var s in this.style)this.style.hasOwnProperty(s)&&(e+=utils.hyphenate(s)+":"+this.style[s]+";");e&&(t+=' style="'+utils.escape(e)+'"');for(var i in this.attributes)Object.prototype.hasOwnProperty.call(this.attributes,i)&&(t+=" "+i+'="',t+=utils.escape(this.attributes[i]),t+='"');t+=">";for(var a=0;a<this.children.length;a++)t+=this.children[a].toMarkup();return t+="</span>"},documentFragment.prototype.toNode=function(){for(var t=document.createDocumentFragment(),e=0;e<this.children.length;e++)t.appendChild(this.children[e].toNode());return t},documentFragment.prototype.toMarkup=function(){for(var t="",e=0;e<this.children.length;e++)t+=this.children[e].toMarkup();return t};var iCombinations={"î":"ı̂","ï":"ı̈","í":"ı́","ì":"ı̀"};symbolNode.prototype.tryCombine=function(t){if(!t||!(t instanceof symbolNode)||this.italic>0||createClass(this.classes)!==createClass(t.classes)||this.skew!==t.skew||this.maxFontSize!==t.maxFontSize)return!1;for(var e in this.style)if(this.style.hasOwnProperty(e)&&this.style[e]!==t.style[e])return!1;for(e in t.style)if(t.style.hasOwnProperty(e)&&this.style[e]!==t.style[e])return!1;return this.value+=t.value,this.height=Math.max(this.height,t.height),this.depth=Math.max(this.depth,t.depth),this.italic=t.italic,!0},symbolNode.prototype.toNode=function(){var t=document.createTextNode(this.value),e=null;this.italic>0&&((e=document.createElement("span")).style.marginRight=this.italic+"em"),this.classes.length>0&&((e=e||document.createElement("span")).className=createClass(this.classes));for(var s in this.style)this.style.hasOwnProperty(s)&&((e=e||document.createElement("span")).style[s]=this.style[s]);return e?(e.appendChild(t),e):t},symbolNode.prototype.toMarkup=function(){var t=!1,e="<span";this.classes.length&&(t=!0,e+=' class="',e+=utils.escape(createClass(this.classes)),e+='"');var s="";this.italic>0&&(s+="margin-right:"+this.italic+"em;");for(var i in this.style)this.style.hasOwnProperty(i)&&(s+=utils.hyphenate(i)+":"+this.style[i]+";");s&&(t=!0,e+=' style="'+utils.escape(s)+'"');var a=utils.escape(this.value);return t?(e+=">",e+=a,e+="</span>"):a},module.exports={span:span,documentFragment:documentFragment,symbolNode:symbolNode};

},{"./unicodeRegexes":75,"./utils":76}],67:[function(require,module,exports){
"use strict";function parseArray(r,e){for(var a=[],n=[a],t=[];;){var o=r.parseExpression(!1,null);a.push(new ParseNode("ordgroup",o,r.mode));var i=r.nextToken.text;if("&"===i)r.consume();else{if("\\end"===i)break;if("\\\\"!==i&&"\\cr"!==i)throw new ParseError("Expected & or \\\\ or \\end",r.nextToken);var s=r.parseFunction();t.push(s.value.size),a=[],n.push(a)}}return e.body=n,e.rowGaps=t,new ParseNode(e.type,e,r.mode)}function defineEnvironment(r,e,a){"string"==typeof r&&(r=[r]),"number"==typeof e&&(e={numArgs:e});for(var n={numArgs:e.numArgs||0,argTypes:e.argTypes,greediness:1,allowedInText:!!e.allowedInText,numOptionalArgs:e.numOptionalArgs||0,handler:a},t=0;t<r.length;++t)module.exports[r[t]]=n}var parseData=require("./parseData"),ParseError=require("./ParseError"),Style=require("./Style"),ParseNode=parseData.ParseNode;defineEnvironment("array",{numArgs:1},function(r,e){var a=e[0],n={type:"array",cols:(a=a.value.map?a.value:[a]).map(function(r){var e=r.value;if(-1!=="lcr".indexOf(e))return{type:"align",align:e};if("|"===e)return{type:"separator",separator:"|"};throw new ParseError("Unknown column alignment: "+r.value,r)}),hskipBeforeAndAfter:!0};return n=parseArray(r.parser,n)}),defineEnvironment(["matrix","pmatrix","bmatrix","Bmatrix","vmatrix","Vmatrix"],{},function(r){var e={matrix:null,pmatrix:["(",")"],bmatrix:["[","]"],Bmatrix:["\\{","\\}"],vmatrix:["|","|"],Vmatrix:["\\Vert","\\Vert"]}[r.envName],a={type:"array",hskipBeforeAndAfter:!1};return a=parseArray(r.parser,a),e&&(a=new ParseNode("leftright",{body:[a],left:e[0],right:e[1]},r.mode)),a}),defineEnvironment("cases",{},function(r){var e={type:"array",arraystretch:1.2,cols:[{type:"align",align:"l",pregap:0,postgap:Style.TEXT.metrics.quad},{type:"align",align:"l",pregap:0,postgap:0}]};return e=parseArray(r.parser,e),e=new ParseNode("leftright",{body:[e],left:"\\{",right:"."},r.mode)}),defineEnvironment("aligned",{},function(r){var e={type:"array",cols:[]};e=parseArray(r.parser,e);var a=new ParseNode("ordgroup",[],r.mode),n=0;e.value.body.forEach(function(r){var e;for(e=1;e<r.length;e+=2)r[e].value.unshift(a);n<r.length&&(n=r.length)});for(var t=0;t<n;++t){var o="r",i=0;t%2==1?o="l":t>0&&(i=2),e.value.cols[t]={type:"align",align:o,pregap:i,postgap:0}}return e});

},{"./ParseError":57,"./Style":60,"./parseData":72}],68:[function(require,module,exports){
"use strict";var Style=require("./Style"),cjkRegex=require("./unicodeRegexes").cjkRegex,sigmas={slant:[.25,.25,.25],space:[0,0,0],stretch:[0,0,0],shrink:[0,0,0],xHeight:[.431,.431,.431],quad:[1,1.171,1.472],extraSpace:[0,0,0],num1:[.677,.732,.925],num2:[.394,.384,.387],num3:[.444,.471,.504],denom1:[.686,.752,1.025],denom2:[.345,.344,.532],sup1:[.413,.503,.504],sup2:[.363,.431,.404],sup3:[.289,.286,.294],sub1:[.15,.143,.2],sub2:[.247,.286,.4],supDrop:[.386,.353,.494],subDrop:[.05,.071,.1],delim1:[2.39,1.7,1.98],delim2:[1.01,1.157,1.42],axisHeight:[.25,.25,.25]},xi1=0,xi2=0,xi3=0,xi4=0,xi5=.431,xi6=1,xi7=0,xi8=.04,xi9=.111,xi10=.166,xi11=.2,xi12=.6,xi13=.1,ptPerEm=10,doubleRuleSep=2/ptPerEm,metrics={defaultRuleThickness:xi8,bigOpSpacing1:xi9,bigOpSpacing2:xi10,bigOpSpacing3:xi11,bigOpSpacing4:xi12,bigOpSpacing5:xi13,ptPerEm:ptPerEm,doubleRuleSep:doubleRuleSep},metricMap=require("./fontMetricsData"),extraCharacterMap={"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","Æ":"A","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"U","Ý":"Y","Þ":"o","ß":"B","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","æ":"a","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i","î":"i","ï":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"u","ý":"y","þ":"o","ÿ":"y","А":"A","Б":"B","В":"B","Г":"F","Д":"A","Е":"E","Ж":"K","З":"3","И":"N","Й":"N","К":"K","Л":"N","М":"M","Н":"H","О":"O","П":"N","Р":"P","С":"C","Т":"T","У":"y","Ф":"O","Х":"X","Ц":"U","Ч":"h","Ш":"W","Щ":"W","Ъ":"B","Ы":"X","Ь":"B","Э":"3","Ю":"X","Я":"R","а":"a","б":"b","в":"a","г":"r","д":"y","е":"e","ж":"m","з":"e","и":"n","й":"n","к":"n","л":"n","м":"m","н":"n","о":"o","п":"n","р":"p","с":"c","т":"o","у":"y","ф":"b","х":"x","ц":"n","ч":"n","ш":"w","щ":"w","ъ":"a","ы":"m","ь":"a","э":"e","ю":"m","я":"r"},getCharacterMetrics=function(e,i){var a=e.charCodeAt(0);e[0]in extraCharacterMap?a=extraCharacterMap[e[0]].charCodeAt(0):cjkRegex.test(e[0])&&(a="M".charCodeAt(0));var r=metricMap[i][a];if(r)return{depth:r[0],height:r[1],italic:r[2],skew:r[3],width:r[4]}};module.exports={metrics:metrics,sigmas:sigmas,getCharacterMetrics:getCharacterMetrics};

},{"./Style":60,"./fontMetricsData":69,"./unicodeRegexes":75}],69:[function(require,module,exports){
"use strict";module.exports={"AMS-Regular":{65:[0,.68889,0,0],66:[0,.68889,0,0],67:[0,.68889,0,0],68:[0,.68889,0,0],69:[0,.68889,0,0],70:[0,.68889,0,0],71:[0,.68889,0,0],72:[0,.68889,0,0],73:[0,.68889,0,0],74:[.16667,.68889,0,0],75:[0,.68889,0,0],76:[0,.68889,0,0],77:[0,.68889,0,0],78:[0,.68889,0,0],79:[.16667,.68889,0,0],80:[0,.68889,0,0],81:[.16667,.68889,0,0],82:[0,.68889,0,0],83:[0,.68889,0,0],84:[0,.68889,0,0],85:[0,.68889,0,0],86:[0,.68889,0,0],87:[0,.68889,0,0],88:[0,.68889,0,0],89:[0,.68889,0,0],90:[0,.68889,0,0],107:[0,.68889,0,0],165:[0,.675,.025,0],174:[.15559,.69224,0,0],240:[0,.68889,0,0],295:[0,.68889,0,0],710:[0,.825,0,0],732:[0,.9,0,0],770:[0,.825,0,0],771:[0,.9,0,0],989:[.08167,.58167,0,0],1008:[0,.43056,.04028,0],8245:[0,.54986,0,0],8463:[0,.68889,0,0],8487:[0,.68889,0,0],8498:[0,.68889,0,0],8502:[0,.68889,0,0],8503:[0,.68889,0,0],8504:[0,.68889,0,0],8513:[0,.68889,0,0],8592:[-.03598,.46402,0,0],8594:[-.03598,.46402,0,0],8602:[-.13313,.36687,0,0],8603:[-.13313,.36687,0,0],8606:[.01354,.52239,0,0],8608:[.01354,.52239,0,0],8610:[.01354,.52239,0,0],8611:[.01354,.52239,0,0],8619:[0,.54986,0,0],8620:[0,.54986,0,0],8621:[-.13313,.37788,0,0],8622:[-.13313,.36687,0,0],8624:[0,.69224,0,0],8625:[0,.69224,0,0],8630:[0,.43056,0,0],8631:[0,.43056,0,0],8634:[.08198,.58198,0,0],8635:[.08198,.58198,0,0],8638:[.19444,.69224,0,0],8639:[.19444,.69224,0,0],8642:[.19444,.69224,0,0],8643:[.19444,.69224,0,0],8644:[.1808,.675,0,0],8646:[.1808,.675,0,0],8647:[.1808,.675,0,0],8648:[.19444,.69224,0,0],8649:[.1808,.675,0,0],8650:[.19444,.69224,0,0],8651:[.01354,.52239,0,0],8652:[.01354,.52239,0,0],8653:[-.13313,.36687,0,0],8654:[-.13313,.36687,0,0],8655:[-.13313,.36687,0,0],8666:[.13667,.63667,0,0],8667:[.13667,.63667,0,0],8669:[-.13313,.37788,0,0],8672:[-.064,.437,0,0],8674:[-.064,.437,0,0],8705:[0,.825,0,0],8708:[0,.68889,0,0],8709:[.08167,.58167,0,0],8717:[0,.43056,0,0],8722:[-.03598,.46402,0,0],8724:[.08198,.69224,0,0],8726:[.08167,.58167,0,0],8733:[0,.69224,0,0],8736:[0,.69224,0,0],8737:[0,.69224,0,0],8738:[.03517,.52239,0,0],8739:[.08167,.58167,0,0],8740:[.25142,.74111,0,0],8741:[.08167,.58167,0,0],8742:[.25142,.74111,0,0],8756:[0,.69224,0,0],8757:[0,.69224,0,0],8764:[-.13313,.36687,0,0],8765:[-.13313,.37788,0,0],8769:[-.13313,.36687,0,0],8770:[-.03625,.46375,0,0],8774:[.30274,.79383,0,0],8776:[-.01688,.48312,0,0],8778:[.08167,.58167,0,0],8782:[.06062,.54986,0,0],8783:[.06062,.54986,0,0],8785:[.08198,.58198,0,0],8786:[.08198,.58198,0,0],8787:[.08198,.58198,0,0],8790:[0,.69224,0,0],8791:[.22958,.72958,0,0],8796:[.08198,.91667,0,0],8806:[.25583,.75583,0,0],8807:[.25583,.75583,0,0],8808:[.25142,.75726,0,0],8809:[.25142,.75726,0,0],8812:[.25583,.75583,0,0],8814:[.20576,.70576,0,0],8815:[.20576,.70576,0,0],8816:[.30274,.79383,0,0],8817:[.30274,.79383,0,0],8818:[.22958,.72958,0,0],8819:[.22958,.72958,0,0],8822:[.1808,.675,0,0],8823:[.1808,.675,0,0],8828:[.13667,.63667,0,0],8829:[.13667,.63667,0,0],8830:[.22958,.72958,0,0],8831:[.22958,.72958,0,0],8832:[.20576,.70576,0,0],8833:[.20576,.70576,0,0],8840:[.30274,.79383,0,0],8841:[.30274,.79383,0,0],8842:[.13597,.63597,0,0],8843:[.13597,.63597,0,0],8847:[.03517,.54986,0,0],8848:[.03517,.54986,0,0],8858:[.08198,.58198,0,0],8859:[.08198,.58198,0,0],8861:[.08198,.58198,0,0],8862:[0,.675,0,0],8863:[0,.675,0,0],8864:[0,.675,0,0],8865:[0,.675,0,0],8872:[0,.69224,0,0],8873:[0,.69224,0,0],8874:[0,.69224,0,0],8876:[0,.68889,0,0],8877:[0,.68889,0,0],8878:[0,.68889,0,0],8879:[0,.68889,0,0],8882:[.03517,.54986,0,0],8883:[.03517,.54986,0,0],8884:[.13667,.63667,0,0],8885:[.13667,.63667,0,0],8888:[0,.54986,0,0],8890:[.19444,.43056,0,0],8891:[.19444,.69224,0,0],8892:[.19444,.69224,0,0],8901:[0,.54986,0,0],8903:[.08167,.58167,0,0],8905:[.08167,.58167,0,0],8906:[.08167,.58167,0,0],8907:[0,.69224,0,0],8908:[0,.69224,0,0],8909:[-.03598,.46402,0,0],8910:[0,.54986,0,0],8911:[0,.54986,0,0],8912:[.03517,.54986,0,0],8913:[.03517,.54986,0,0],8914:[0,.54986,0,0],8915:[0,.54986,0,0],8916:[0,.69224,0,0],8918:[.0391,.5391,0,0],8919:[.0391,.5391,0,0],8920:[.03517,.54986,0,0],8921:[.03517,.54986,0,0],8922:[.38569,.88569,0,0],8923:[.38569,.88569,0,0],8926:[.13667,.63667,0,0],8927:[.13667,.63667,0,0],8928:[.30274,.79383,0,0],8929:[.30274,.79383,0,0],8934:[.23222,.74111,0,0],8935:[.23222,.74111,0,0],8936:[.23222,.74111,0,0],8937:[.23222,.74111,0,0],8938:[.20576,.70576,0,0],8939:[.20576,.70576,0,0],8940:[.30274,.79383,0,0],8941:[.30274,.79383,0,0],8994:[.19444,.69224,0,0],8995:[.19444,.69224,0,0],9416:[.15559,.69224,0,0],9484:[0,.69224,0,0],9488:[0,.69224,0,0],9492:[0,.37788,0,0],9496:[0,.37788,0,0],9585:[.19444,.68889,0,0],9586:[.19444,.74111,0,0],9632:[0,.675,0,0],9633:[0,.675,0,0],9650:[0,.54986,0,0],9651:[0,.54986,0,0],9654:[.03517,.54986,0,0],9660:[0,.54986,0,0],9661:[0,.54986,0,0],9664:[.03517,.54986,0,0],9674:[.11111,.69224,0,0],9733:[.19444,.69224,0,0],10003:[0,.69224,0,0],10016:[0,.69224,0,0],10731:[.11111,.69224,0,0],10846:[.19444,.75583,0,0],10877:[.13667,.63667,0,0],10878:[.13667,.63667,0,0],10885:[.25583,.75583,0,0],10886:[.25583,.75583,0,0],10887:[.13597,.63597,0,0],10888:[.13597,.63597,0,0],10889:[.26167,.75726,0,0],10890:[.26167,.75726,0,0],10891:[.48256,.98256,0,0],10892:[.48256,.98256,0,0],10901:[.13667,.63667,0,0],10902:[.13667,.63667,0,0],10933:[.25142,.75726,0,0],10934:[.25142,.75726,0,0],10935:[.26167,.75726,0,0],10936:[.26167,.75726,0,0],10937:[.26167,.75726,0,0],10938:[.26167,.75726,0,0],10949:[.25583,.75583,0,0],10950:[.25583,.75583,0,0],10955:[.28481,.79383,0,0],10956:[.28481,.79383,0,0],57350:[.08167,.58167,0,0],57351:[.08167,.58167,0,0],57352:[.08167,.58167,0,0],57353:[0,.43056,.04028,0],57356:[.25142,.75726,0,0],57357:[.25142,.75726,0,0],57358:[.41951,.91951,0,0],57359:[.30274,.79383,0,0],57360:[.30274,.79383,0,0],57361:[.41951,.91951,0,0],57366:[.25142,.75726,0,0],57367:[.25142,.75726,0,0],57368:[.25142,.75726,0,0],57369:[.25142,.75726,0,0],57370:[.13597,.63597,0,0],57371:[.13597,.63597,0,0]},"Caligraphic-Regular":{48:[0,.43056,0,0],49:[0,.43056,0,0],50:[0,.43056,0,0],51:[.19444,.43056,0,0],52:[.19444,.43056,0,0],53:[.19444,.43056,0,0],54:[0,.64444,0,0],55:[.19444,.43056,0,0],56:[0,.64444,0,0],57:[.19444,.43056,0,0],65:[0,.68333,0,.19445],66:[0,.68333,.03041,.13889],67:[0,.68333,.05834,.13889],68:[0,.68333,.02778,.08334],69:[0,.68333,.08944,.11111],70:[0,.68333,.09931,.11111],71:[.09722,.68333,.0593,.11111],72:[0,.68333,.00965,.11111],73:[0,.68333,.07382,0],74:[.09722,.68333,.18472,.16667],75:[0,.68333,.01445,.05556],76:[0,.68333,0,.13889],77:[0,.68333,0,.13889],78:[0,.68333,.14736,.08334],79:[0,.68333,.02778,.11111],80:[0,.68333,.08222,.08334],81:[.09722,.68333,0,.11111],82:[0,.68333,0,.08334],83:[0,.68333,.075,.13889],84:[0,.68333,.25417,0],85:[0,.68333,.09931,.08334],86:[0,.68333,.08222,0],87:[0,.68333,.08222,.08334],88:[0,.68333,.14643,.13889],89:[.09722,.68333,.08222,.08334],90:[0,.68333,.07944,.13889]},"Fraktur-Regular":{33:[0,.69141,0,0],34:[0,.69141,0,0],38:[0,.69141,0,0],39:[0,.69141,0,0],40:[.24982,.74947,0,0],41:[.24982,.74947,0,0],42:[0,.62119,0,0],43:[.08319,.58283,0,0],44:[0,.10803,0,0],45:[.08319,.58283,0,0],46:[0,.10803,0,0],47:[.24982,.74947,0,0],48:[0,.47534,0,0],49:[0,.47534,0,0],50:[0,.47534,0,0],51:[.18906,.47534,0,0],52:[.18906,.47534,0,0],53:[.18906,.47534,0,0],54:[0,.69141,0,0],55:[.18906,.47534,0,0],56:[0,.69141,0,0],57:[.18906,.47534,0,0],58:[0,.47534,0,0],59:[.12604,.47534,0,0],61:[-.13099,.36866,0,0],63:[0,.69141,0,0],65:[0,.69141,0,0],66:[0,.69141,0,0],67:[0,.69141,0,0],68:[0,.69141,0,0],69:[0,.69141,0,0],70:[.12604,.69141,0,0],71:[0,.69141,0,0],72:[.06302,.69141,0,0],73:[0,.69141,0,0],74:[.12604,.69141,0,0],75:[0,.69141,0,0],76:[0,.69141,0,0],77:[0,.69141,0,0],78:[0,.69141,0,0],79:[0,.69141,0,0],80:[.18906,.69141,0,0],81:[.03781,.69141,0,0],82:[0,.69141,0,0],83:[0,.69141,0,0],84:[0,.69141,0,0],85:[0,.69141,0,0],86:[0,.69141,0,0],87:[0,.69141,0,0],88:[0,.69141,0,0],89:[.18906,.69141,0,0],90:[.12604,.69141,0,0],91:[.24982,.74947,0,0],93:[.24982,.74947,0,0],94:[0,.69141,0,0],97:[0,.47534,0,0],98:[0,.69141,0,0],99:[0,.47534,0,0],100:[0,.62119,0,0],101:[0,.47534,0,0],102:[.18906,.69141,0,0],103:[.18906,.47534,0,0],104:[.18906,.69141,0,0],105:[0,.69141,0,0],106:[0,.69141,0,0],107:[0,.69141,0,0],108:[0,.69141,0,0],109:[0,.47534,0,0],110:[0,.47534,0,0],111:[0,.47534,0,0],112:[.18906,.52396,0,0],113:[.18906,.47534,0,0],114:[0,.47534,0,0],115:[0,.47534,0,0],116:[0,.62119,0,0],117:[0,.47534,0,0],118:[0,.52396,0,0],119:[0,.52396,0,0],120:[.18906,.47534,0,0],121:[.18906,.47534,0,0],122:[.18906,.47534,0,0],8216:[0,.69141,0,0],8217:[0,.69141,0,0],58112:[0,.62119,0,0],58113:[0,.62119,0,0],58114:[.18906,.69141,0,0],58115:[.18906,.69141,0,0],58116:[.18906,.47534,0,0],58117:[0,.69141,0,0],58118:[0,.62119,0,0],58119:[0,.47534,0,0]},"Main-Bold":{33:[0,.69444,0,0],34:[0,.69444,0,0],35:[.19444,.69444,0,0],36:[.05556,.75,0,0],37:[.05556,.75,0,0],38:[0,.69444,0,0],39:[0,.69444,0,0],40:[.25,.75,0,0],41:[.25,.75,0,0],42:[0,.75,0,0],43:[.13333,.63333,0,0],44:[.19444,.15556,0,0],45:[0,.44444,0,0],46:[0,.15556,0,0],47:[.25,.75,0,0],48:[0,.64444,0,0],49:[0,.64444,0,0],50:[0,.64444,0,0],51:[0,.64444,0,0],52:[0,.64444,0,0],53:[0,.64444,0,0],54:[0,.64444,0,0],55:[0,.64444,0,0],56:[0,.64444,0,0],57:[0,.64444,0,0],58:[0,.44444,0,0],59:[.19444,.44444,0,0],60:[.08556,.58556,0,0],61:[-.10889,.39111,0,0],62:[.08556,.58556,0,0],63:[0,.69444,0,0],64:[0,.69444,0,0],65:[0,.68611,0,0],66:[0,.68611,0,0],67:[0,.68611,0,0],68:[0,.68611,0,0],69:[0,.68611,0,0],70:[0,.68611,0,0],71:[0,.68611,0,0],72:[0,.68611,0,0],73:[0,.68611,0,0],74:[0,.68611,0,0],75:[0,.68611,0,0],76:[0,.68611,0,0],77:[0,.68611,0,0],78:[0,.68611,0,0],79:[0,.68611,0,0],80:[0,.68611,0,0],81:[.19444,.68611,0,0],82:[0,.68611,0,0],83:[0,.68611,0,0],84:[0,.68611,0,0],85:[0,.68611,0,0],86:[0,.68611,.01597,0],87:[0,.68611,.01597,0],88:[0,.68611,0,0],89:[0,.68611,.02875,0],90:[0,.68611,0,0],91:[.25,.75,0,0],92:[.25,.75,0,0],93:[.25,.75,0,0],94:[0,.69444,0,0],95:[.31,.13444,.03194,0],96:[0,.69444,0,0],97:[0,.44444,0,0],98:[0,.69444,0,0],99:[0,.44444,0,0],100:[0,.69444,0,0],101:[0,.44444,0,0],102:[0,.69444,.10903,0],103:[.19444,.44444,.01597,0],104:[0,.69444,0,0],105:[0,.69444,0,0],106:[.19444,.69444,0,0],107:[0,.69444,0,0],108:[0,.69444,0,0],109:[0,.44444,0,0],110:[0,.44444,0,0],111:[0,.44444,0,0],112:[.19444,.44444,0,0],113:[.19444,.44444,0,0],114:[0,.44444,0,0],115:[0,.44444,0,0],116:[0,.63492,0,0],117:[0,.44444,0,0],118:[0,.44444,.01597,0],119:[0,.44444,.01597,0],120:[0,.44444,0,0],121:[.19444,.44444,.01597,0],122:[0,.44444,0,0],123:[.25,.75,0,0],124:[.25,.75,0,0],125:[.25,.75,0,0],126:[.35,.34444,0,0],168:[0,.69444,0,0],172:[0,.44444,0,0],175:[0,.59611,0,0],176:[0,.69444,0,0],177:[.13333,.63333,0,0],180:[0,.69444,0,0],215:[.13333,.63333,0,0],247:[.13333,.63333,0,0],305:[0,.44444,0,0],567:[.19444,.44444,0,0],710:[0,.69444,0,0],711:[0,.63194,0,0],713:[0,.59611,0,0],714:[0,.69444,0,0],715:[0,.69444,0,0],728:[0,.69444,0,0],729:[0,.69444,0,0],730:[0,.69444,0,0],732:[0,.69444,0,0],768:[0,.69444,0,0],769:[0,.69444,0,0],770:[0,.69444,0,0],771:[0,.69444,0,0],772:[0,.59611,0,0],774:[0,.69444,0,0],775:[0,.69444,0,0],776:[0,.69444,0,0],778:[0,.69444,0,0],779:[0,.69444,0,0],780:[0,.63194,0,0],824:[.19444,.69444,0,0],915:[0,.68611,0,0],916:[0,.68611,0,0],920:[0,.68611,0,0],923:[0,.68611,0,0],926:[0,.68611,0,0],928:[0,.68611,0,0],931:[0,.68611,0,0],933:[0,.68611,0,0],934:[0,.68611,0,0],936:[0,.68611,0,0],937:[0,.68611,0,0],8211:[0,.44444,.03194,0],8212:[0,.44444,.03194,0],8216:[0,.69444,0,0],8217:[0,.69444,0,0],8220:[0,.69444,0,0],8221:[0,.69444,0,0],8224:[.19444,.69444,0,0],8225:[.19444,.69444,0,0],8242:[0,.55556,0,0],8407:[0,.72444,.15486,0],8463:[0,.69444,0,0],8465:[0,.69444,0,0],8467:[0,.69444,0,0],8472:[.19444,.44444,0,0],8476:[0,.69444,0,0],8501:[0,.69444,0,0],8592:[-.10889,.39111,0,0],8593:[.19444,.69444,0,0],8594:[-.10889,.39111,0,0],8595:[.19444,.69444,0,0],8596:[-.10889,.39111,0,0],8597:[.25,.75,0,0],8598:[.19444,.69444,0,0],8599:[.19444,.69444,0,0],8600:[.19444,.69444,0,0],8601:[.19444,.69444,0,0],8636:[-.10889,.39111,0,0],8637:[-.10889,.39111,0,0],8640:[-.10889,.39111,0,0],8641:[-.10889,.39111,0,0],8656:[-.10889,.39111,0,0],8657:[.19444,.69444,0,0],8658:[-.10889,.39111,0,0],8659:[.19444,.69444,0,0],8660:[-.10889,.39111,0,0],8661:[.25,.75,0,0],8704:[0,.69444,0,0],8706:[0,.69444,.06389,0],8707:[0,.69444,0,0],8709:[.05556,.75,0,0],8711:[0,.68611,0,0],8712:[.08556,.58556,0,0],8715:[.08556,.58556,0,0],8722:[.13333,.63333,0,0],8723:[.13333,.63333,0,0],8725:[.25,.75,0,0],8726:[.25,.75,0,0],8727:[-.02778,.47222,0,0],8728:[-.02639,.47361,0,0],8729:[-.02639,.47361,0,0],8730:[.18,.82,0,0],8733:[0,.44444,0,0],8734:[0,.44444,0,0],8736:[0,.69224,0,0],8739:[.25,.75,0,0],8741:[.25,.75,0,0],8743:[0,.55556,0,0],8744:[0,.55556,0,0],8745:[0,.55556,0,0],8746:[0,.55556,0,0],8747:[.19444,.69444,.12778,0],8764:[-.10889,.39111,0,0],8768:[.19444,.69444,0,0],8771:[.00222,.50222,0,0],8776:[.02444,.52444,0,0],8781:[.00222,.50222,0,0],8801:[.00222,.50222,0,0],8804:[.19667,.69667,0,0],8805:[.19667,.69667,0,0],8810:[.08556,.58556,0,0],8811:[.08556,.58556,0,0],8826:[.08556,.58556,0,0],8827:[.08556,.58556,0,0],8834:[.08556,.58556,0,0],8835:[.08556,.58556,0,0],8838:[.19667,.69667,0,0],8839:[.19667,.69667,0,0],8846:[0,.55556,0,0],8849:[.19667,.69667,0,0],8850:[.19667,.69667,0,0],8851:[0,.55556,0,0],8852:[0,.55556,0,0],8853:[.13333,.63333,0,0],8854:[.13333,.63333,0,0],8855:[.13333,.63333,0,0],8856:[.13333,.63333,0,0],8857:[.13333,.63333,0,0],8866:[0,.69444,0,0],8867:[0,.69444,0,0],8868:[0,.69444,0,0],8869:[0,.69444,0,0],8900:[-.02639,.47361,0,0],8901:[-.02639,.47361,0,0],8902:[-.02778,.47222,0,0],8968:[.25,.75,0,0],8969:[.25,.75,0,0],8970:[.25,.75,0,0],8971:[.25,.75,0,0],8994:[-.13889,.36111,0,0],8995:[-.13889,.36111,0,0],9651:[.19444,.69444,0,0],9657:[-.02778,.47222,0,0],9661:[.19444,.69444,0,0],9667:[-.02778,.47222,0,0],9711:[.19444,.69444,0,0],9824:[.12963,.69444,0,0],9825:[.12963,.69444,0,0],9826:[.12963,.69444,0,0],9827:[.12963,.69444,0,0],9837:[0,.75,0,0],9838:[.19444,.69444,0,0],9839:[.19444,.69444,0,0],10216:[.25,.75,0,0],10217:[.25,.75,0,0],10815:[0,.68611,0,0],10927:[.19667,.69667,0,0],10928:[.19667,.69667,0,0]},"Main-Italic":{33:[0,.69444,.12417,0],34:[0,.69444,.06961,0],35:[.19444,.69444,.06616,0],37:[.05556,.75,.13639,0],38:[0,.69444,.09694,0],39:[0,.69444,.12417,0],40:[.25,.75,.16194,0],41:[.25,.75,.03694,0],42:[0,.75,.14917,0],43:[.05667,.56167,.03694,0],44:[.19444,.10556,0,0],45:[0,.43056,.02826,0],46:[0,.10556,0,0],47:[.25,.75,.16194,0],48:[0,.64444,.13556,0],49:[0,.64444,.13556,0],50:[0,.64444,.13556,0],51:[0,.64444,.13556,0],52:[.19444,.64444,.13556,0],53:[0,.64444,.13556,0],54:[0,.64444,.13556,0],55:[.19444,.64444,.13556,0],56:[0,.64444,.13556,0],57:[0,.64444,.13556,0],58:[0,.43056,.0582,0],59:[.19444,.43056,.0582,0],61:[-.13313,.36687,.06616,0],63:[0,.69444,.1225,0],64:[0,.69444,.09597,0],65:[0,.68333,0,0],66:[0,.68333,.10257,0],67:[0,.68333,.14528,0],68:[0,.68333,.09403,0],69:[0,.68333,.12028,0],70:[0,.68333,.13305,0],71:[0,.68333,.08722,0],72:[0,.68333,.16389,0],73:[0,.68333,.15806,0],74:[0,.68333,.14028,0],75:[0,.68333,.14528,0],76:[0,.68333,0,0],77:[0,.68333,.16389,0],78:[0,.68333,.16389,0],79:[0,.68333,.09403,0],80:[0,.68333,.10257,0],81:[.19444,.68333,.09403,0],82:[0,.68333,.03868,0],83:[0,.68333,.11972,0],84:[0,.68333,.13305,0],85:[0,.68333,.16389,0],86:[0,.68333,.18361,0],87:[0,.68333,.18361,0],88:[0,.68333,.15806,0],89:[0,.68333,.19383,0],90:[0,.68333,.14528,0],91:[.25,.75,.1875,0],93:[.25,.75,.10528,0],94:[0,.69444,.06646,0],95:[.31,.12056,.09208,0],97:[0,.43056,.07671,0],98:[0,.69444,.06312,0],99:[0,.43056,.05653,0],100:[0,.69444,.10333,0],101:[0,.43056,.07514,0],102:[.19444,.69444,.21194,0],103:[.19444,.43056,.08847,0],104:[0,.69444,.07671,0],105:[0,.65536,.1019,0],106:[.19444,.65536,.14467,0],107:[0,.69444,.10764,0],108:[0,.69444,.10333,0],109:[0,.43056,.07671,0],110:[0,.43056,.07671,0],111:[0,.43056,.06312,0],112:[.19444,.43056,.06312,0],113:[.19444,.43056,.08847,0],114:[0,.43056,.10764,0],115:[0,.43056,.08208,0],116:[0,.61508,.09486,0],117:[0,.43056,.07671,0],118:[0,.43056,.10764,0],119:[0,.43056,.10764,0],120:[0,.43056,.12042,0],121:[.19444,.43056,.08847,0],122:[0,.43056,.12292,0],126:[.35,.31786,.11585,0],163:[0,.69444,0,0],305:[0,.43056,0,.02778],567:[.19444,.43056,0,.08334],768:[0,.69444,0,0],769:[0,.69444,.09694,0],770:[0,.69444,.06646,0],771:[0,.66786,.11585,0],772:[0,.56167,.10333,0],774:[0,.69444,.10806,0],775:[0,.66786,.11752,0],776:[0,.66786,.10474,0],778:[0,.69444,0,0],779:[0,.69444,.1225,0],780:[0,.62847,.08295,0],915:[0,.68333,.13305,0],916:[0,.68333,0,0],920:[0,.68333,.09403,0],923:[0,.68333,0,0],926:[0,.68333,.15294,0],928:[0,.68333,.16389,0],931:[0,.68333,.12028,0],933:[0,.68333,.11111,0],934:[0,.68333,.05986,0],936:[0,.68333,.11111,0],937:[0,.68333,.10257,0],8211:[0,.43056,.09208,0],8212:[0,.43056,.09208,0],8216:[0,.69444,.12417,0],8217:[0,.69444,.12417,0],8220:[0,.69444,.1685,0],8221:[0,.69444,.06961,0],8463:[0,.68889,0,0]},"Main-Regular":{32:[0,0,0,0],33:[0,.69444,0,0],34:[0,.69444,0,0],35:[.19444,.69444,0,0],36:[.05556,.75,0,0],37:[.05556,.75,0,0],38:[0,.69444,0,0],39:[0,.69444,0,0],40:[.25,.75,0,0],41:[.25,.75,0,0],42:[0,.75,0,0],43:[.08333,.58333,0,0],44:[.19444,.10556,0,0],45:[0,.43056,0,0],46:[0,.10556,0,0],47:[.25,.75,0,0],48:[0,.64444,0,0],49:[0,.64444,0,0],50:[0,.64444,0,0],51:[0,.64444,0,0],52:[0,.64444,0,0],53:[0,.64444,0,0],54:[0,.64444,0,0],55:[0,.64444,0,0],56:[0,.64444,0,0],57:[0,.64444,0,0],58:[0,.43056,0,0],59:[.19444,.43056,0,0],60:[.0391,.5391,0,0],61:[-.13313,.36687,0,0],62:[.0391,.5391,0,0],63:[0,.69444,0,0],64:[0,.69444,0,0],65:[0,.68333,0,0],66:[0,.68333,0,0],67:[0,.68333,0,0],68:[0,.68333,0,0],69:[0,.68333,0,0],70:[0,.68333,0,0],71:[0,.68333,0,0],72:[0,.68333,0,0],73:[0,.68333,0,0],74:[0,.68333,0,0],75:[0,.68333,0,0],76:[0,.68333,0,0],77:[0,.68333,0,0],78:[0,.68333,0,0],79:[0,.68333,0,0],80:[0,.68333,0,0],81:[.19444,.68333,0,0],82:[0,.68333,0,0],83:[0,.68333,0,0],84:[0,.68333,0,0],85:[0,.68333,0,0],86:[0,.68333,.01389,0],87:[0,.68333,.01389,0],88:[0,.68333,0,0],89:[0,.68333,.025,0],90:[0,.68333,0,0],91:[.25,.75,0,0],92:[.25,.75,0,0],93:[.25,.75,0,0],94:[0,.69444,0,0],95:[.31,.12056,.02778,0],96:[0,.69444,0,0],97:[0,.43056,0,0],98:[0,.69444,0,0],99:[0,.43056,0,0],100:[0,.69444,0,0],101:[0,.43056,0,0],102:[0,.69444,.07778,0],103:[.19444,.43056,.01389,0],104:[0,.69444,0,0],105:[0,.66786,0,0],106:[.19444,.66786,0,0],107:[0,.69444,0,0],108:[0,.69444,0,0],109:[0,.43056,0,0],110:[0,.43056,0,0],111:[0,.43056,0,0],112:[.19444,.43056,0,0],113:[.19444,.43056,0,0],114:[0,.43056,0,0],115:[0,.43056,0,0],116:[0,.61508,0,0],117:[0,.43056,0,0],118:[0,.43056,.01389,0],119:[0,.43056,.01389,0],120:[0,.43056,0,0],121:[.19444,.43056,.01389,0],122:[0,.43056,0,0],123:[.25,.75,0,0],124:[.25,.75,0,0],125:[.25,.75,0,0],126:[.35,.31786,0,0],160:[0,0,0,0],168:[0,.66786,0,0],172:[0,.43056,0,0],175:[0,.56778,0,0],176:[0,.69444,0,0],177:[.08333,.58333,0,0],180:[0,.69444,0,0],215:[.08333,.58333,0,0],247:[.08333,.58333,0,0],305:[0,.43056,0,0],567:[.19444,.43056,0,0],710:[0,.69444,0,0],711:[0,.62847,0,0],713:[0,.56778,0,0],714:[0,.69444,0,0],715:[0,.69444,0,0],728:[0,.69444,0,0],729:[0,.66786,0,0],730:[0,.69444,0,0],732:[0,.66786,0,0],768:[0,.69444,0,0],769:[0,.69444,0,0],770:[0,.69444,0,0],771:[0,.66786,0,0],772:[0,.56778,0,0],774:[0,.69444,0,0],775:[0,.66786,0,0],776:[0,.66786,0,0],778:[0,.69444,0,0],779:[0,.69444,0,0],780:[0,.62847,0,0],824:[.19444,.69444,0,0],915:[0,.68333,0,0],916:[0,.68333,0,0],920:[0,.68333,0,0],923:[0,.68333,0,0],926:[0,.68333,0,0],928:[0,.68333,0,0],931:[0,.68333,0,0],933:[0,.68333,0,0],934:[0,.68333,0,0],936:[0,.68333,0,0],937:[0,.68333,0,0],8211:[0,.43056,.02778,0],8212:[0,.43056,.02778,0],8216:[0,.69444,0,0],8217:[0,.69444,0,0],8220:[0,.69444,0,0],8221:[0,.69444,0,0],8224:[.19444,.69444,0,0],8225:[.19444,.69444,0,0],8230:[0,.12,0,0],8242:[0,.55556,0,0],8407:[0,.71444,.15382,0],8463:[0,.68889,0,0],8465:[0,.69444,0,0],8467:[0,.69444,0,.11111],8472:[.19444,.43056,0,.11111],8476:[0,.69444,0,0],8501:[0,.69444,0,0],8592:[-.13313,.36687,0,0],8593:[.19444,.69444,0,0],8594:[-.13313,.36687,0,0],8595:[.19444,.69444,0,0],8596:[-.13313,.36687,0,0],8597:[.25,.75,0,0],8598:[.19444,.69444,0,0],8599:[.19444,.69444,0,0],8600:[.19444,.69444,0,0],8601:[.19444,.69444,0,0],8614:[.011,.511,0,0],8617:[.011,.511,0,0],8618:[.011,.511,0,0],8636:[-.13313,.36687,0,0],8637:[-.13313,.36687,0,0],8640:[-.13313,.36687,0,0],8641:[-.13313,.36687,0,0],8652:[.011,.671,0,0],8656:[-.13313,.36687,0,0],8657:[.19444,.69444,0,0],8658:[-.13313,.36687,0,0],8659:[.19444,.69444,0,0],8660:[-.13313,.36687,0,0],8661:[.25,.75,0,0],8704:[0,.69444,0,0],8706:[0,.69444,.05556,.08334],8707:[0,.69444,0,0],8709:[.05556,.75,0,0],8711:[0,.68333,0,0],8712:[.0391,.5391,0,0],8715:[.0391,.5391,0,0],8722:[.08333,.58333,0,0],8723:[.08333,.58333,0,0],8725:[.25,.75,0,0],8726:[.25,.75,0,0],8727:[-.03472,.46528,0,0],8728:[-.05555,.44445,0,0],8729:[-.05555,.44445,0,0],8730:[.2,.8,0,0],8733:[0,.43056,0,0],8734:[0,.43056,0,0],8736:[0,.69224,0,0],8739:[.25,.75,0,0],8741:[.25,.75,0,0],8743:[0,.55556,0,0],8744:[0,.55556,0,0],8745:[0,.55556,0,0],8746:[0,.55556,0,0],8747:[.19444,.69444,.11111,0],8764:[-.13313,.36687,0,0],8768:[.19444,.69444,0,0],8771:[-.03625,.46375,0,0],8773:[-.022,.589,0,0],8776:[-.01688,.48312,0,0],8781:[-.03625,.46375,0,0],8784:[-.133,.67,0,0],8800:[.215,.716,0,0],8801:[-.03625,.46375,0,0],8804:[.13597,.63597,0,0],8805:[.13597,.63597,0,0],8810:[.0391,.5391,0,0],8811:[.0391,.5391,0,0],8826:[.0391,.5391,0,0],8827:[.0391,.5391,0,0],8834:[.0391,.5391,0,0],8835:[.0391,.5391,0,0],8838:[.13597,.63597,0,0],8839:[.13597,.63597,0,0],8846:[0,.55556,0,0],8849:[.13597,.63597,0,0],8850:[.13597,.63597,0,0],8851:[0,.55556,0,0],8852:[0,.55556,0,0],8853:[.08333,.58333,0,0],8854:[.08333,.58333,0,0],8855:[.08333,.58333,0,0],8856:[.08333,.58333,0,0],8857:[.08333,.58333,0,0],8866:[0,.69444,0,0],8867:[0,.69444,0,0],8868:[0,.69444,0,0],8869:[0,.69444,0,0],8872:[.249,.75,0,0],8900:[-.05555,.44445,0,0],8901:[-.05555,.44445,0,0],8902:[-.03472,.46528,0,0],8904:[.005,.505,0,0],8942:[.03,.9,0,0],8943:[-.19,.31,0,0],8945:[-.1,.82,0,0],8968:[.25,.75,0,0],8969:[.25,.75,0,0],8970:[.25,.75,0,0],8971:[.25,.75,0,0],8994:[-.14236,.35764,0,0],8995:[-.14236,.35764,0,0],9136:[.244,.744,0,0],9137:[.244,.744,0,0],9651:[.19444,.69444,0,0],9657:[-.03472,.46528,0,0],9661:[.19444,.69444,0,0],9667:[-.03472,.46528,0,0],9711:[.19444,.69444,0,0],9824:[.12963,.69444,0,0],9825:[.12963,.69444,0,0],9826:[.12963,.69444,0,0],9827:[.12963,.69444,0,0],9837:[0,.75,0,0],9838:[.19444,.69444,0,0],9839:[.19444,.69444,0,0],10216:[.25,.75,0,0],10217:[.25,.75,0,0],10222:[.244,.744,0,0],10223:[.244,.744,0,0],10229:[.011,.511,0,0],10230:[.011,.511,0,0],10231:[.011,.511,0,0],10232:[.024,.525,0,0],10233:[.024,.525,0,0],10234:[.024,.525,0,0],10236:[.011,.511,0,0],10815:[0,.68333,0,0],10927:[.13597,.63597,0,0],10928:[.13597,.63597,0,0]},"Math-BoldItalic":{47:[.19444,.69444,0,0],65:[0,.68611,0,0],66:[0,.68611,.04835,0],67:[0,.68611,.06979,0],68:[0,.68611,.03194,0],69:[0,.68611,.05451,0],70:[0,.68611,.15972,0],71:[0,.68611,0,0],72:[0,.68611,.08229,0],73:[0,.68611,.07778,0],74:[0,.68611,.10069,0],75:[0,.68611,.06979,0],76:[0,.68611,0,0],77:[0,.68611,.11424,0],78:[0,.68611,.11424,0],79:[0,.68611,.03194,0],80:[0,.68611,.15972,0],81:[.19444,.68611,0,0],82:[0,.68611,.00421,0],83:[0,.68611,.05382,0],84:[0,.68611,.15972,0],85:[0,.68611,.11424,0],86:[0,.68611,.25555,0],87:[0,.68611,.15972,0],88:[0,.68611,.07778,0],89:[0,.68611,.25555,0],90:[0,.68611,.06979,0],97:[0,.44444,0,0],98:[0,.69444,0,0],99:[0,.44444,0,0],100:[0,.69444,0,0],101:[0,.44444,0,0],102:[.19444,.69444,.11042,0],103:[.19444,.44444,.03704,0],104:[0,.69444,0,0],105:[0,.69326,0,0],106:[.19444,.69326,.0622,0],107:[0,.69444,.01852,0],108:[0,.69444,.0088,0],109:[0,.44444,0,0],110:[0,.44444,0,0],111:[0,.44444,0,0],112:[.19444,.44444,0,0],113:[.19444,.44444,.03704,0],114:[0,.44444,.03194,0],115:[0,.44444,0,0],116:[0,.63492,0,0],117:[0,.44444,0,0],118:[0,.44444,.03704,0],119:[0,.44444,.02778,0],120:[0,.44444,0,0],121:[.19444,.44444,.03704,0],122:[0,.44444,.04213,0],915:[0,.68611,.15972,0],916:[0,.68611,0,0],920:[0,.68611,.03194,0],923:[0,.68611,0,0],926:[0,.68611,.07458,0],928:[0,.68611,.08229,0],931:[0,.68611,.05451,0],933:[0,.68611,.15972,0],934:[0,.68611,0,0],936:[0,.68611,.11653,0],937:[0,.68611,.04835,0],945:[0,.44444,0,0],946:[.19444,.69444,.03403,0],947:[.19444,.44444,.06389,0],948:[0,.69444,.03819,0],949:[0,.44444,0,0],950:[.19444,.69444,.06215,0],951:[.19444,.44444,.03704,0],952:[0,.69444,.03194,0],953:[0,.44444,0,0],954:[0,.44444,0,0],955:[0,.69444,0,0],956:[.19444,.44444,0,0],957:[0,.44444,.06898,0],958:[.19444,.69444,.03021,0],959:[0,.44444,0,0],960:[0,.44444,.03704,0],961:[.19444,.44444,0,0],962:[.09722,.44444,.07917,0],963:[0,.44444,.03704,0],964:[0,.44444,.13472,0],965:[0,.44444,.03704,0],966:[.19444,.44444,0,0],967:[.19444,.44444,0,0],968:[.19444,.69444,.03704,0],969:[0,.44444,.03704,0],977:[0,.69444,0,0],981:[.19444,.69444,0,0],982:[0,.44444,.03194,0],1009:[.19444,.44444,0,0],1013:[0,.44444,0,0]},"Math-Italic":{47:[.19444,.69444,0,0],65:[0,.68333,0,.13889],66:[0,.68333,.05017,.08334],67:[0,.68333,.07153,.08334],68:[0,.68333,.02778,.05556],69:[0,.68333,.05764,.08334],70:[0,.68333,.13889,.08334],71:[0,.68333,0,.08334],72:[0,.68333,.08125,.05556],73:[0,.68333,.07847,.11111],74:[0,.68333,.09618,.16667],75:[0,.68333,.07153,.05556],76:[0,.68333,0,.02778],77:[0,.68333,.10903,.08334],78:[0,.68333,.10903,.08334],79:[0,.68333,.02778,.08334],80:[0,.68333,.13889,.08334],81:[.19444,.68333,0,.08334],82:[0,.68333,.00773,.08334],83:[0,.68333,.05764,.08334],84:[0,.68333,.13889,.08334],85:[0,.68333,.10903,.02778],86:[0,.68333,.22222,0],87:[0,.68333,.13889,0],88:[0,.68333,.07847,.08334],89:[0,.68333,.22222,0],90:[0,.68333,.07153,.08334],97:[0,.43056,0,0],98:[0,.69444,0,0],99:[0,.43056,0,.05556],100:[0,.69444,0,.16667],101:[0,.43056,0,.05556],102:[.19444,.69444,.10764,.16667],103:[.19444,.43056,.03588,.02778],104:[0,.69444,0,0],105:[0,.65952,0,0],106:[.19444,.65952,.05724,0],107:[0,.69444,.03148,0],108:[0,.69444,.01968,.08334],109:[0,.43056,0,0],110:[0,.43056,0,0],111:[0,.43056,0,.05556],112:[.19444,.43056,0,.08334],113:[.19444,.43056,.03588,.08334],114:[0,.43056,.02778,.05556],115:[0,.43056,0,.05556],116:[0,.61508,0,.08334],117:[0,.43056,0,.02778],118:[0,.43056,.03588,.02778],119:[0,.43056,.02691,.08334],120:[0,.43056,0,.02778],121:[.19444,.43056,.03588,.05556],122:[0,.43056,.04398,.05556],915:[0,.68333,.13889,.08334],916:[0,.68333,0,.16667],920:[0,.68333,.02778,.08334],923:[0,.68333,0,.16667],926:[0,.68333,.07569,.08334],928:[0,.68333,.08125,.05556],931:[0,.68333,.05764,.08334],933:[0,.68333,.13889,.05556],934:[0,.68333,0,.08334],936:[0,.68333,.11,.05556],937:[0,.68333,.05017,.08334],945:[0,.43056,.0037,.02778],946:[.19444,.69444,.05278,.08334],947:[.19444,.43056,.05556,0],948:[0,.69444,.03785,.05556],949:[0,.43056,0,.08334],950:[.19444,.69444,.07378,.08334],951:[.19444,.43056,.03588,.05556],952:[0,.69444,.02778,.08334],953:[0,.43056,0,.05556],954:[0,.43056,0,0],955:[0,.69444,0,0],956:[.19444,.43056,0,.02778],957:[0,.43056,.06366,.02778],958:[.19444,.69444,.04601,.11111],959:[0,.43056,0,.05556],960:[0,.43056,.03588,0],961:[.19444,.43056,0,.08334],962:[.09722,.43056,.07986,.08334],963:[0,.43056,.03588,0],964:[0,.43056,.1132,.02778],965:[0,.43056,.03588,.02778],966:[.19444,.43056,0,.08334],967:[.19444,.43056,0,.05556],968:[.19444,.69444,.03588,.11111],969:[0,.43056,.03588,0],977:[0,.69444,0,.08334],981:[.19444,.69444,0,.08334],982:[0,.43056,.02778,0],1009:[.19444,.43056,0,.08334],1013:[0,.43056,0,.05556]},"Math-Regular":{65:[0,.68333,0,.13889],66:[0,.68333,.05017,.08334],67:[0,.68333,.07153,.08334],68:[0,.68333,.02778,.05556],69:[0,.68333,.05764,.08334],70:[0,.68333,.13889,.08334],71:[0,.68333,0,.08334],72:[0,.68333,.08125,.05556],73:[0,.68333,.07847,.11111],74:[0,.68333,.09618,.16667],75:[0,.68333,.07153,.05556],76:[0,.68333,0,.02778],77:[0,.68333,.10903,.08334],78:[0,.68333,.10903,.08334],79:[0,.68333,.02778,.08334],80:[0,.68333,.13889,.08334],81:[.19444,.68333,0,.08334],82:[0,.68333,.00773,.08334],83:[0,.68333,.05764,.08334],84:[0,.68333,.13889,.08334],85:[0,.68333,.10903,.02778],86:[0,.68333,.22222,0],87:[0,.68333,.13889,0],88:[0,.68333,.07847,.08334],89:[0,.68333,.22222,0],90:[0,.68333,.07153,.08334],97:[0,.43056,0,0],98:[0,.69444,0,0],99:[0,.43056,0,.05556],100:[0,.69444,0,.16667],101:[0,.43056,0,.05556],102:[.19444,.69444,.10764,.16667],103:[.19444,.43056,.03588,.02778],104:[0,.69444,0,0],105:[0,.65952,0,0],106:[.19444,.65952,.05724,0],107:[0,.69444,.03148,0],108:[0,.69444,.01968,.08334],109:[0,.43056,0,0],110:[0,.43056,0,0],111:[0,.43056,0,.05556],112:[.19444,.43056,0,.08334],113:[.19444,.43056,.03588,.08334],114:[0,.43056,.02778,.05556],115:[0,.43056,0,.05556],116:[0,.61508,0,.08334],117:[0,.43056,0,.02778],118:[0,.43056,.03588,.02778],119:[0,.43056,.02691,.08334],120:[0,.43056,0,.02778],121:[.19444,.43056,.03588,.05556],122:[0,.43056,.04398,.05556],915:[0,.68333,.13889,.08334],916:[0,.68333,0,.16667],920:[0,.68333,.02778,.08334],923:[0,.68333,0,.16667],926:[0,.68333,.07569,.08334],928:[0,.68333,.08125,.05556],931:[0,.68333,.05764,.08334],933:[0,.68333,.13889,.05556],934:[0,.68333,0,.08334],936:[0,.68333,.11,.05556],937:[0,.68333,.05017,.08334],945:[0,.43056,.0037,.02778],946:[.19444,.69444,.05278,.08334],947:[.19444,.43056,.05556,0],948:[0,.69444,.03785,.05556],949:[0,.43056,0,.08334],950:[.19444,.69444,.07378,.08334],951:[.19444,.43056,.03588,.05556],952:[0,.69444,.02778,.08334],953:[0,.43056,0,.05556],954:[0,.43056,0,0],955:[0,.69444,0,0],956:[.19444,.43056,0,.02778],957:[0,.43056,.06366,.02778],958:[.19444,.69444,.04601,.11111],959:[0,.43056,0,.05556],960:[0,.43056,.03588,0],961:[.19444,.43056,0,.08334],962:[.09722,.43056,.07986,.08334],963:[0,.43056,.03588,0],964:[0,.43056,.1132,.02778],965:[0,.43056,.03588,.02778],966:[.19444,.43056,0,.08334],967:[.19444,.43056,0,.05556],968:[.19444,.69444,.03588,.11111],969:[0,.43056,.03588,0],977:[0,.69444,0,.08334],981:[.19444,.69444,0,.08334],982:[0,.43056,.02778,0],1009:[.19444,.43056,0,.08334],1013:[0,.43056,0,.05556]},"SansSerif-Regular":{33:[0,.69444,0,0],34:[0,.69444,0,0],35:[.19444,.69444,0,0],36:[.05556,.75,0,0],37:[.05556,.75,0,0],38:[0,.69444,0,0],39:[0,.69444,0,0],40:[.25,.75,0,0],41:[.25,.75,0,0],42:[0,.75,0,0],43:[.08333,.58333,0,0],44:[.125,.08333,0,0],45:[0,.44444,0,0],46:[0,.08333,0,0],47:[.25,.75,0,0],48:[0,.65556,0,0],49:[0,.65556,0,0],50:[0,.65556,0,0],51:[0,.65556,0,0],52:[0,.65556,0,0],53:[0,.65556,0,0],54:[0,.65556,0,0],55:[0,.65556,0,0],56:[0,.65556,0,0],57:[0,.65556,0,0],58:[0,.44444,0,0],59:[.125,.44444,0,0],61:[-.13,.37,0,0],63:[0,.69444,0,0],64:[0,.69444,0,0],65:[0,.69444,0,0],66:[0,.69444,0,0],67:[0,.69444,0,0],68:[0,.69444,0,0],69:[0,.69444,0,0],70:[0,.69444,0,0],71:[0,.69444,0,0],72:[0,.69444,0,0],73:[0,.69444,0,0],74:[0,.69444,0,0],75:[0,.69444,0,0],76:[0,.69444,0,0],77:[0,.69444,0,0],78:[0,.69444,0,0],79:[0,.69444,0,0],80:[0,.69444,0,0],81:[.125,.69444,0,0],82:[0,.69444,0,0],83:[0,.69444,0,0],84:[0,.69444,0,0],85:[0,.69444,0,0],86:[0,.69444,.01389,0],87:[0,.69444,.01389,0],88:[0,.69444,0,0],89:[0,.69444,.025,0],90:[0,.69444,0,0],91:[.25,.75,0,0],93:[.25,.75,0,0],94:[0,.69444,0,0],95:[.35,.09444,.02778,0],97:[0,.44444,0,0],98:[0,.69444,0,0],99:[0,.44444,0,0],100:[0,.69444,0,0],101:[0,.44444,0,0],102:[0,.69444,.06944,0],103:[.19444,.44444,.01389,0],104:[0,.69444,0,0],105:[0,.67937,0,0],106:[.19444,.67937,0,0],107:[0,.69444,0,0],108:[0,.69444,0,0],109:[0,.44444,0,0],110:[0,.44444,0,0],111:[0,.44444,0,0],112:[.19444,.44444,0,0],113:[.19444,.44444,0,0],114:[0,.44444,.01389,0],115:[0,.44444,0,0],116:[0,.57143,0,0],117:[0,.44444,0,0],118:[0,.44444,.01389,0],119:[0,.44444,.01389,0],120:[0,.44444,0,0],121:[.19444,.44444,.01389,0],122:[0,.44444,0,0],126:[.35,.32659,0,0],305:[0,.44444,0,0],567:[.19444,.44444,0,0],768:[0,.69444,0,0],769:[0,.69444,0,0],770:[0,.69444,0,0],771:[0,.67659,0,0],772:[0,.60889,0,0],774:[0,.69444,0,0],775:[0,.67937,0,0],776:[0,.67937,0,0],778:[0,.69444,0,0],779:[0,.69444,0,0],780:[0,.63194,0,0],915:[0,.69444,0,0],916:[0,.69444,0,0],920:[0,.69444,0,0],923:[0,.69444,0,0],926:[0,.69444,0,0],928:[0,.69444,0,0],931:[0,.69444,0,0],933:[0,.69444,0,0],934:[0,.69444,0,0],936:[0,.69444,0,0],937:[0,.69444,0,0],8211:[0,.44444,.02778,0],8212:[0,.44444,.02778,0],8216:[0,.69444,0,0],8217:[0,.69444,0,0],8220:[0,.69444,0,0],8221:[0,.69444,0,0]},"Script-Regular":{65:[0,.7,.22925,0],66:[0,.7,.04087,0],67:[0,.7,.1689,0],68:[0,.7,.09371,0],69:[0,.7,.18583,0],70:[0,.7,.13634,0],71:[0,.7,.17322,0],72:[0,.7,.29694,0],73:[0,.7,.19189,0],74:[.27778,.7,.19189,0],75:[0,.7,.31259,0],76:[0,.7,.19189,0],77:[0,.7,.15981,0],78:[0,.7,.3525,0],79:[0,.7,.08078,0],80:[0,.7,.08078,0],81:[0,.7,.03305,0],82:[0,.7,.06259,0],83:[0,.7,.19189,0],84:[0,.7,.29087,0],85:[0,.7,.25815,0],86:[0,.7,.27523,0],87:[0,.7,.27523,0],88:[0,.7,.26006,0],89:[0,.7,.2939,0],90:[0,.7,.24037,0]},"Size1-Regular":{40:[.35001,.85,0,0],41:[.35001,.85,0,0],47:[.35001,.85,0,0],91:[.35001,.85,0,0],92:[.35001,.85,0,0],93:[.35001,.85,0,0],123:[.35001,.85,0,0],125:[.35001,.85,0,0],710:[0,.72222,0,0],732:[0,.72222,0,0],770:[0,.72222,0,0],771:[0,.72222,0,0],8214:[-99e-5,.601,0,0],8593:[1e-5,.6,0,0],8595:[1e-5,.6,0,0],8657:[1e-5,.6,0,0],8659:[1e-5,.6,0,0],8719:[.25001,.75,0,0],8720:[.25001,.75,0,0],8721:[.25001,.75,0,0],8730:[.35001,.85,0,0],8739:[-.00599,.606,0,0],8741:[-.00599,.606,0,0],8747:[.30612,.805,.19445,0],8748:[.306,.805,.19445,0],8749:[.306,.805,.19445,0],8750:[.30612,.805,.19445,0],8896:[.25001,.75,0,0],8897:[.25001,.75,0,0],8898:[.25001,.75,0,0],8899:[.25001,.75,0,0],8968:[.35001,.85,0,0],8969:[.35001,.85,0,0],8970:[.35001,.85,0,0],8971:[.35001,.85,0,0],9168:[-99e-5,.601,0,0],10216:[.35001,.85,0,0],10217:[.35001,.85,0,0],10752:[.25001,.75,0,0],10753:[.25001,.75,0,0],10754:[.25001,.75,0,0],10756:[.25001,.75,0,0],10758:[.25001,.75,0,0]},"Size2-Regular":{40:[.65002,1.15,0,0],41:[.65002,1.15,0,0],47:[.65002,1.15,0,0],91:[.65002,1.15,0,0],92:[.65002,1.15,0,0],93:[.65002,1.15,0,0],123:[.65002,1.15,0,0],125:[.65002,1.15,0,0],710:[0,.75,0,0],732:[0,.75,0,0],770:[0,.75,0,0],771:[0,.75,0,0],8719:[.55001,1.05,0,0],8720:[.55001,1.05,0,0],8721:[.55001,1.05,0,0],8730:[.65002,1.15,0,0],8747:[.86225,1.36,.44445,0],8748:[.862,1.36,.44445,0],8749:[.862,1.36,.44445,0],8750:[.86225,1.36,.44445,0],8896:[.55001,1.05,0,0],8897:[.55001,1.05,0,0],8898:[.55001,1.05,0,0],8899:[.55001,1.05,0,0],8968:[.65002,1.15,0,0],8969:[.65002,1.15,0,0],8970:[.65002,1.15,0,0],8971:[.65002,1.15,0,0],10216:[.65002,1.15,0,0],10217:[.65002,1.15,0,0],10752:[.55001,1.05,0,0],10753:[.55001,1.05,0,0],10754:[.55001,1.05,0,0],10756:[.55001,1.05,0,0],10758:[.55001,1.05,0,0]},"Size3-Regular":{40:[.95003,1.45,0,0],41:[.95003,1.45,0,0],47:[.95003,1.45,0,0],91:[.95003,1.45,0,0],92:[.95003,1.45,0,0],93:[.95003,1.45,0,0],123:[.95003,1.45,0,0],125:[.95003,1.45,0,0],710:[0,.75,0,0],732:[0,.75,0,0],770:[0,.75,0,0],771:[0,.75,0,0],8730:[.95003,1.45,0,0],8968:[.95003,1.45,0,0],8969:[.95003,1.45,0,0],8970:[.95003,1.45,0,0],8971:[.95003,1.45,0,0],10216:[.95003,1.45,0,0],10217:[.95003,1.45,0,0]},"Size4-Regular":{40:[1.25003,1.75,0,0],41:[1.25003,1.75,0,0],47:[1.25003,1.75,0,0],91:[1.25003,1.75,0,0],92:[1.25003,1.75,0,0],93:[1.25003,1.75,0,0],123:[1.25003,1.75,0,0],125:[1.25003,1.75,0,0],710:[0,.825,0,0],732:[0,.825,0,0],770:[0,.825,0,0],771:[0,.825,0,0],8730:[1.25003,1.75,0,0],8968:[1.25003,1.75,0,0],8969:[1.25003,1.75,0,0],8970:[1.25003,1.75,0,0],8971:[1.25003,1.75,0,0],9115:[.64502,1.155,0,0],9116:[1e-5,.6,0,0],9117:[.64502,1.155,0,0],9118:[.64502,1.155,0,0],9119:[1e-5,.6,0,0],9120:[.64502,1.155,0,0],9121:[.64502,1.155,0,0],9122:[-99e-5,.601,0,0],9123:[.64502,1.155,0,0],9124:[.64502,1.155,0,0],9125:[-99e-5,.601,0,0],9126:[.64502,1.155,0,0],9127:[1e-5,.9,0,0],9128:[.65002,1.15,0,0],9129:[.90001,0,0,0],9130:[0,.3,0,0],9131:[1e-5,.9,0,0],9132:[.65002,1.15,0,0],9133:[.90001,0,0,0],9143:[.88502,.915,0,0],10216:[1.25003,1.75,0,0],10217:[1.25003,1.75,0,0],57344:[-.00499,.605,0,0],57345:[-.00499,.605,0,0],57680:[0,.12,0,0],57681:[0,.12,0,0],57682:[0,.12,0,0],57683:[0,.12,0,0]},"Typewriter-Regular":{33:[0,.61111,0,0],34:[0,.61111,0,0],35:[0,.61111,0,0],36:[.08333,.69444,0,0],37:[.08333,.69444,0,0],38:[0,.61111,0,0],39:[0,.61111,0,0],40:[.08333,.69444,0,0],41:[.08333,.69444,0,0],42:[0,.52083,0,0],43:[-.08056,.53055,0,0],44:[.13889,.125,0,0],45:[-.08056,.53055,0,0],46:[0,.125,0,0],47:[.08333,.69444,0,0],48:[0,.61111,0,0],49:[0,.61111,0,0],50:[0,.61111,0,0],51:[0,.61111,0,0],52:[0,.61111,0,0],53:[0,.61111,0,0],54:[0,.61111,0,0],55:[0,.61111,0,0],56:[0,.61111,0,0],57:[0,.61111,0,0],58:[0,.43056,0,0],59:[.13889,.43056,0,0],60:[-.05556,.55556,0,0],61:[-.19549,.41562,0,0],62:[-.05556,.55556,0,0],63:[0,.61111,0,0],64:[0,.61111,0,0],65:[0,.61111,0,0],66:[0,.61111,0,0],67:[0,.61111,0,0],68:[0,.61111,0,0],69:[0,.61111,0,0],70:[0,.61111,0,0],71:[0,.61111,0,0],72:[0,.61111,0,0],73:[0,.61111,0,0],74:[0,.61111,0,0],75:[0,.61111,0,0],76:[0,.61111,0,0],77:[0,.61111,0,0],78:[0,.61111,0,0],79:[0,.61111,0,0],80:[0,.61111,0,0],81:[.13889,.61111,0,0],82:[0,.61111,0,0],83:[0,.61111,0,0],84:[0,.61111,0,0],85:[0,.61111,0,0],86:[0,.61111,0,0],87:[0,.61111,0,0],88:[0,.61111,0,0],89:[0,.61111,0,0],90:[0,.61111,0,0],91:[.08333,.69444,0,0],92:[.08333,.69444,0,0],93:[.08333,.69444,0,0],94:[0,.61111,0,0],95:[.09514,0,0,0],96:[0,.61111,0,0],97:[0,.43056,0,0],98:[0,.61111,0,0],99:[0,.43056,0,0],100:[0,.61111,0,0],101:[0,.43056,0,0],102:[0,.61111,0,0],103:[.22222,.43056,0,0],104:[0,.61111,0,0],105:[0,.61111,0,0],106:[.22222,.61111,0,0],107:[0,.61111,0,0],108:[0,.61111,0,0],109:[0,.43056,0,0],110:[0,.43056,0,0],111:[0,.43056,0,0],112:[.22222,.43056,0,0],113:[.22222,.43056,0,0],114:[0,.43056,0,0],115:[0,.43056,0,0],116:[0,.55358,0,0],117:[0,.43056,0,0],118:[0,.43056,0,0],119:[0,.43056,0,0],120:[0,.43056,0,0],121:[.22222,.43056,0,0],122:[0,.43056,0,0],123:[.08333,.69444,0,0],124:[.08333,.69444,0,0],125:[.08333,.69444,0,0],126:[0,.61111,0,0],127:[0,.61111,0,0],305:[0,.43056,0,0],567:[.22222,.43056,0,0],768:[0,.61111,0,0],769:[0,.61111,0,0],770:[0,.61111,0,0],771:[0,.61111,0,0],772:[0,.56555,0,0],774:[0,.61111,0,0],776:[0,.61111,0,0],778:[0,.61111,0,0],780:[0,.56597,0,0],915:[0,.61111,0,0],916:[0,.61111,0,0],920:[0,.61111,0,0],923:[0,.61111,0,0],926:[0,.61111,0,0],928:[0,.61111,0,0],931:[0,.61111,0,0],933:[0,.61111,0,0],934:[0,.61111,0,0],936:[0,.61111,0,0],937:[0,.61111,0,0],2018:[0,.61111,0,0],2019:[0,.61111,0,0],8242:[0,.61111,0,0]}};

},{}],70:[function(require,module,exports){
"use strict";function defineFunction(e,n,r){"string"==typeof e&&(e=[e]),"number"==typeof n&&(n={numArgs:n});for(var t={numArgs:n.numArgs,argTypes:n.argTypes,greediness:void 0===n.greediness?1:n.greediness,allowedInText:!!n.allowedInText,numOptionalArgs:n.numOptionalArgs||0,infix:!!n.infix,handler:r},i=0;i<e.length;++i)module.exports[e[i]]=t}var utils=require("./utils"),ParseError=require("./ParseError"),parseData=require("./parseData"),ParseNode=parseData.ParseNode,ordargument=function(e){return"ordgroup"===e.type?e.value:[e]};defineFunction("\\sqrt",{numArgs:1,numOptionalArgs:1},function(e,n){var r=n[0];return{type:"sqrt",body:n[1],index:r}});var textFunctionStyles={"\\text":void 0,"\\textrm":"mathrm","\\textsf":"mathsf","\\texttt":"mathtt","\\textnormal":"mathrm","\\textbf":"mathbf","\\textit":"textit"};defineFunction(["\\text","\\textrm","\\textsf","\\texttt","\\textnormal","\\textbf","\\textit"],{numArgs:1,argTypes:["text"],greediness:2,allowedInText:!0},function(e,n){var r=n[0];return{type:"text",body:ordargument(r),style:textFunctionStyles[e.funcName]}}),defineFunction("\\color",{numArgs:2,allowedInText:!0,greediness:3,argTypes:["color","original"]},function(e,n){var r=n[0],t=n[1];return{type:"color",color:r.value,value:ordargument(t)}}),defineFunction("\\overline",{numArgs:1},function(e,n){return{type:"overline",body:n[0]}}),defineFunction("\\underline",{numArgs:1},function(e,n){return{type:"underline",body:n[0]}}),defineFunction("\\rule",{numArgs:2,numOptionalArgs:1,argTypes:["size","size","size"]},function(e,n){var r=n[0],t=n[1],i=n[2];return{type:"rule",shift:r&&r.value,width:t.value,height:i.value}}),defineFunction(["\\kern","\\mkern"],{numArgs:1,argTypes:["size"]},function(e,n){return{type:"kern",dimension:n[0].value}}),defineFunction("\\KaTeX",{numArgs:0},function(e){return{type:"katex"}}),defineFunction("\\phantom",{numArgs:1},function(e,n){var r=n[0];return{type:"phantom",value:ordargument(r)}}),defineFunction(["\\mathord","\\mathbin","\\mathrel","\\mathopen","\\mathclose","\\mathpunct","\\mathinner"],{numArgs:1},function(e,n){var r=n[0];return{type:"mclass",mclass:"m"+e.funcName.substr(5),value:ordargument(r)}}),defineFunction("\\stackrel",{numArgs:2},function(e,n){var r=n[0],t=n[1],i=new ParseNode("op",{type:"op",limits:!0,alwaysHandleSupSub:!0,symbol:!1,value:ordargument(t)},t.mode);return{type:"mclass",mclass:"mrel",value:[new ParseNode("supsub",{base:i,sup:r,sub:null},r.mode)]}}),defineFunction("\\bmod",{numArgs:0},function(e,n){return{type:"mod",modType:"bmod",value:null}}),defineFunction(["\\pod","\\pmod","\\mod"],{numArgs:1},function(e,n){var r=n[0];return{type:"mod",modType:e.funcName.substr(1),value:ordargument(r)}});var delimiterSizes={"\\bigl":{mclass:"mopen",size:1},"\\Bigl":{mclass:"mopen",size:2},"\\biggl":{mclass:"mopen",size:3},"\\Biggl":{mclass:"mopen",size:4},"\\bigr":{mclass:"mclose",size:1},"\\Bigr":{mclass:"mclose",size:2},"\\biggr":{mclass:"mclose",size:3},"\\Biggr":{mclass:"mclose",size:4},"\\bigm":{mclass:"mrel",size:1},"\\Bigm":{mclass:"mrel",size:2},"\\biggm":{mclass:"mrel",size:3},"\\Biggm":{mclass:"mrel",size:4},"\\big":{mclass:"mord",size:1},"\\Big":{mclass:"mord",size:2},"\\bigg":{mclass:"mord",size:3},"\\Bigg":{mclass:"mord",size:4}},delimiters=["(",")","[","\\lbrack","]","\\rbrack","\\{","\\lbrace","\\}","\\rbrace","\\lfloor","\\rfloor","\\lceil","\\rceil","<",">","\\langle","\\rangle","\\lt","\\gt","\\lvert","\\rvert","\\lVert","\\rVert","\\lgroup","\\rgroup","\\lmoustache","\\rmoustache","/","\\backslash","|","\\vert","\\|","\\Vert","\\uparrow","\\Uparrow","\\downarrow","\\Downarrow","\\updownarrow","\\Updownarrow","."],fontAliases={"\\Bbb":"\\mathbb","\\bold":"\\mathbf","\\frak":"\\mathfrak"};defineFunction(["\\blue","\\orange","\\pink","\\red","\\green","\\gray","\\purple","\\blueA","\\blueB","\\blueC","\\blueD","\\blueE","\\tealA","\\tealB","\\tealC","\\tealD","\\tealE","\\greenA","\\greenB","\\greenC","\\greenD","\\greenE","\\goldA","\\goldB","\\goldC","\\goldD","\\goldE","\\redA","\\redB","\\redC","\\redD","\\redE","\\maroonA","\\maroonB","\\maroonC","\\maroonD","\\maroonE","\\purpleA","\\purpleB","\\purpleC","\\purpleD","\\purpleE","\\mintA","\\mintB","\\mintC","\\grayA","\\grayB","\\grayC","\\grayD","\\grayE","\\grayF","\\grayG","\\grayH","\\grayI","\\kaBlue","\\kaGreen"],{numArgs:1,allowedInText:!0,greediness:3},function(e,n){var r=n[0];return{type:"color",color:"katex-"+e.funcName.slice(1),value:ordargument(r)}}),defineFunction(["\\arcsin","\\arccos","\\arctan","\\arg","\\cos","\\cosh","\\cot","\\coth","\\csc","\\deg","\\dim","\\exp","\\hom","\\ker","\\lg","\\ln","\\log","\\sec","\\sin","\\sinh","\\tan","\\tanh"],{numArgs:0},function(e){return{type:"op",limits:!1,symbol:!1,body:e.funcName}}),defineFunction(["\\det","\\gcd","\\inf","\\lim","\\liminf","\\limsup","\\max","\\min","\\Pr","\\sup"],{numArgs:0},function(e){return{type:"op",limits:!0,symbol:!1,body:e.funcName}}),defineFunction(["\\int","\\iint","\\iiint","\\oint"],{numArgs:0},function(e){return{type:"op",limits:!1,symbol:!0,body:e.funcName}}),defineFunction(["\\coprod","\\bigvee","\\bigwedge","\\biguplus","\\bigcap","\\bigcup","\\intop","\\prod","\\sum","\\bigotimes","\\bigoplus","\\bigodot","\\bigsqcup","\\smallint"],{numArgs:0},function(e){return{type:"op",limits:!0,symbol:!0,body:e.funcName}}),defineFunction("\\mathop",{numArgs:1},function(e,n){var r=n[0];return{type:"op",limits:!1,symbol:!1,value:ordargument(r)}}),defineFunction(["\\dfrac","\\frac","\\tfrac","\\dbinom","\\binom","\\tbinom","\\\\atopfrac"],{numArgs:2,greediness:2},function(e,n){var r,t=n[0],i=n[1],a=null,o=null,s="auto";switch(e.funcName){case"\\dfrac":case"\\frac":case"\\tfrac":r=!0;break;case"\\\\atopfrac":r=!1;break;case"\\dbinom":case"\\binom":case"\\tbinom":r=!1,a="(",o=")";break;default:throw new Error("Unrecognized genfrac command")}switch(e.funcName){case"\\dfrac":case"\\dbinom":s="display";break;case"\\tfrac":case"\\tbinom":s="text"}return{type:"genfrac",numer:t,denom:i,hasBarLine:r,leftDelim:a,rightDelim:o,size:s}}),defineFunction(["\\llap","\\rlap"],{numArgs:1,allowedInText:!0},function(e,n){var r=n[0];return{type:e.funcName.slice(1),body:r}});var checkDelimiter=function(e,n){if(utils.contains(delimiters,e.value))return e;throw new ParseError("Invalid delimiter: '"+e.value+"' after '"+n.funcName+"'",e)};defineFunction(["\\bigl","\\Bigl","\\biggl","\\Biggl","\\bigr","\\Bigr","\\biggr","\\Biggr","\\bigm","\\Bigm","\\biggm","\\Biggm","\\big","\\Big","\\bigg","\\Bigg"],{numArgs:1},function(e,n){var r=checkDelimiter(n[0],e);return{type:"delimsizing",size:delimiterSizes[e.funcName].size,mclass:delimiterSizes[e.funcName].mclass,value:r.value}}),defineFunction(["\\left","\\right"],{numArgs:1},function(e,n){return{type:"leftright",value:checkDelimiter(n[0],e).value}}),defineFunction("\\middle",{numArgs:1},function(e,n){var r=checkDelimiter(n[0],e);if(!e.parser.leftrightDepth)throw new ParseError("\\middle without preceding \\left",r);return{type:"middle",value:r.value}}),defineFunction(["\\tiny","\\scriptsize","\\footnotesize","\\small","\\normalsize","\\large","\\Large","\\LARGE","\\huge","\\Huge"],0,null),defineFunction(["\\displaystyle","\\textstyle","\\scriptstyle","\\scriptscriptstyle"],0,null),defineFunction(["\\mathrm","\\mathit","\\mathbf","\\mathbb","\\mathcal","\\mathfrak","\\mathscr","\\mathsf","\\mathtt","\\Bbb","\\bold","\\frak"],{numArgs:1,greediness:2},function(e,n){var r=n[0],t=e.funcName;return t in fontAliases&&(t=fontAliases[t]),{type:"font",font:t.slice(1),body:r}}),defineFunction(["\\acute","\\grave","\\ddot","\\tilde","\\bar","\\breve","\\check","\\hat","\\vec","\\dot"],{numArgs:1},function(e,n){var r=n[0];return{type:"accent",accent:e.funcName,base:r}}),defineFunction(["\\over","\\choose","\\atop"],{numArgs:0,infix:!0},function(e){var n;switch(e.funcName){case"\\over":n="\\frac";break;case"\\choose":n="\\binom";break;case"\\atop":n="\\\\atopfrac";break;default:throw new Error("Unrecognized infix genfrac command")}return{type:"infix",replaceWith:n,token:e.token}}),defineFunction(["\\\\","\\cr"],{numArgs:0,numOptionalArgs:1,argTypes:["size"]},function(e,n){return{type:"cr",size:n[0]}}),defineFunction(["\\begin","\\end"],{numArgs:1,argTypes:["text"]},function(e,n){var r=n[0];if("ordgroup"!==r.type)throw new ParseError("Invalid environment name",r);for(var t="",i=0;i<r.value.length;++i)t+=r.value[i].value;return{type:"environment",name:t,nameGroup:r}});

},{"./ParseError":57,"./parseData":72,"./utils":76}],71:[function(require,module,exports){
"use strict";function MathNode(t,e){this.type=t,this.attributes={},this.children=e||[]}function TextNode(t){this.text=t}var utils=require("./utils");MathNode.prototype.setAttribute=function(t,e){this.attributes[t]=e},MathNode.prototype.toNode=function(){var t=document.createElementNS("http://www.w3.org/1998/Math/MathML",this.type);for(var e in this.attributes)Object.prototype.hasOwnProperty.call(this.attributes,e)&&t.setAttribute(e,this.attributes[e]);for(var r=0;r<this.children.length;r++)t.appendChild(this.children[r].toNode());return t},MathNode.prototype.toMarkup=function(){var t="<"+this.type;for(var e in this.attributes)Object.prototype.hasOwnProperty.call(this.attributes,e)&&(t+=" "+e+'="',t+=utils.escape(this.attributes[e]),t+='"');t+=">";for(var r=0;r<this.children.length;r++)t+=this.children[r].toMarkup();return t+="</"+this.type+">"},TextNode.prototype.toNode=function(){return document.createTextNode(this.text)},TextNode.prototype.toMarkup=function(){return utils.escape(this.text)},module.exports={MathNode:MathNode,TextNode:TextNode};

},{"./utils":76}],72:[function(require,module,exports){
"use strict";function ParseNode(e,t,s,r,i){this.type=e,this.value=t,this.mode=s,!r||i&&i.lexer!==r.lexer||(this.lexer=r.lexer,this.start=r.start,this.end=(i||r).end)}module.exports={ParseNode:ParseNode};

},{}],73:[function(require,module,exports){
"use strict";var Parser=require("./Parser"),parseTree=function(r,e){if(!("string"==typeof r||r instanceof String))throw new TypeError("KaTeX can only parse string typed expression");return new Parser(r,e).parse()};module.exports=parseTree;

},{"./Parser":58}],74:[function(require,module,exports){
"use strict";function defineSymbol(e,m,a,t,n){module.exports[e][n]={font:m,group:a,replace:t}}module.exports={math:{},text:{}};var math="math",text="text",main="main",ams="ams",accent="accent",bin="bin",close="close",inner="inner",mathord="mathord",op="op",open="open",punct="punct",rel="rel",spacing="spacing",textord="textord";defineSymbol(math,main,rel,"≡","\\equiv"),defineSymbol(math,main,rel,"≺","\\prec"),defineSymbol(math,main,rel,"≻","\\succ"),defineSymbol(math,main,rel,"∼","\\sim"),defineSymbol(math,main,rel,"⊥","\\perp"),defineSymbol(math,main,rel,"⪯","\\preceq"),defineSymbol(math,main,rel,"⪰","\\succeq"),defineSymbol(math,main,rel,"≃","\\simeq"),defineSymbol(math,main,rel,"∣","\\mid"),defineSymbol(math,main,rel,"≪","\\ll"),defineSymbol(math,main,rel,"≫","\\gg"),defineSymbol(math,main,rel,"≍","\\asymp"),defineSymbol(math,main,rel,"∥","\\parallel"),defineSymbol(math,main,rel,"⋈","\\bowtie"),defineSymbol(math,main,rel,"⌣","\\smile"),defineSymbol(math,main,rel,"⊑","\\sqsubseteq"),defineSymbol(math,main,rel,"⊒","\\sqsupseteq"),defineSymbol(math,main,rel,"≐","\\doteq"),defineSymbol(math,main,rel,"⌢","\\frown"),defineSymbol(math,main,rel,"∋","\\ni"),defineSymbol(math,main,rel,"∝","\\propto"),defineSymbol(math,main,rel,"⊢","\\vdash"),defineSymbol(math,main,rel,"⊣","\\dashv"),defineSymbol(math,main,rel,"∋","\\owns"),defineSymbol(math,main,punct,".","\\ldotp"),defineSymbol(math,main,punct,"⋅","\\cdotp"),defineSymbol(math,main,textord,"#","\\#"),defineSymbol(text,main,textord,"#","\\#"),defineSymbol(math,main,textord,"&","\\&"),defineSymbol(text,main,textord,"&","\\&"),defineSymbol(math,main,textord,"ℵ","\\aleph"),defineSymbol(math,main,textord,"∀","\\forall"),defineSymbol(math,main,textord,"ℏ","\\hbar"),defineSymbol(math,main,textord,"∃","\\exists"),defineSymbol(math,main,textord,"∇","\\nabla"),defineSymbol(math,main,textord,"♭","\\flat"),defineSymbol(math,main,textord,"ℓ","\\ell"),defineSymbol(math,main,textord,"♮","\\natural"),defineSymbol(math,main,textord,"♣","\\clubsuit"),defineSymbol(math,main,textord,"℘","\\wp"),defineSymbol(math,main,textord,"♯","\\sharp"),defineSymbol(math,main,textord,"♢","\\diamondsuit"),defineSymbol(math,main,textord,"ℜ","\\Re"),defineSymbol(math,main,textord,"♡","\\heartsuit"),defineSymbol(math,main,textord,"ℑ","\\Im"),defineSymbol(math,main,textord,"♠","\\spadesuit"),defineSymbol(math,main,textord,"†","\\dag"),defineSymbol(math,main,textord,"‡","\\ddag"),defineSymbol(math,main,close,"⎱","\\rmoustache"),defineSymbol(math,main,open,"⎰","\\lmoustache"),defineSymbol(math,main,close,"⟯","\\rgroup"),defineSymbol(math,main,open,"⟮","\\lgroup"),defineSymbol(math,main,bin,"∓","\\mp"),defineSymbol(math,main,bin,"⊖","\\ominus"),defineSymbol(math,main,bin,"⊎","\\uplus"),defineSymbol(math,main,bin,"⊓","\\sqcap"),defineSymbol(math,main,bin,"∗","\\ast"),defineSymbol(math,main,bin,"⊔","\\sqcup"),defineSymbol(math,main,bin,"◯","\\bigcirc"),defineSymbol(math,main,bin,"∙","\\bullet"),defineSymbol(math,main,bin,"‡","\\ddagger"),defineSymbol(math,main,bin,"≀","\\wr"),defineSymbol(math,main,bin,"⨿","\\amalg"),defineSymbol(math,main,rel,"⟵","\\longleftarrow"),defineSymbol(math,main,rel,"⇐","\\Leftarrow"),defineSymbol(math,main,rel,"⟸","\\Longleftarrow"),defineSymbol(math,main,rel,"⟶","\\longrightarrow"),defineSymbol(math,main,rel,"⇒","\\Rightarrow"),defineSymbol(math,main,rel,"⟹","\\Longrightarrow"),defineSymbol(math,main,rel,"↔","\\leftrightarrow"),defineSymbol(math,main,rel,"⟷","\\longleftrightarrow"),defineSymbol(math,main,rel,"⇔","\\Leftrightarrow"),defineSymbol(math,main,rel,"⟺","\\Longleftrightarrow"),defineSymbol(math,main,rel,"↦","\\mapsto"),defineSymbol(math,main,rel,"⟼","\\longmapsto"),defineSymbol(math,main,rel,"↗","\\nearrow"),defineSymbol(math,main,rel,"↩","\\hookleftarrow"),defineSymbol(math,main,rel,"↪","\\hookrightarrow"),defineSymbol(math,main,rel,"↘","\\searrow"),defineSymbol(math,main,rel,"↼","\\leftharpoonup"),defineSymbol(math,main,rel,"⇀","\\rightharpoonup"),defineSymbol(math,main,rel,"↙","\\swarrow"),defineSymbol(math,main,rel,"↽","\\leftharpoondown"),defineSymbol(math,main,rel,"⇁","\\rightharpoondown"),defineSymbol(math,main,rel,"↖","\\nwarrow"),defineSymbol(math,main,rel,"⇌","\\rightleftharpoons"),defineSymbol(math,ams,rel,"≮","\\nless"),defineSymbol(math,ams,rel,"","\\nleqslant"),defineSymbol(math,ams,rel,"","\\nleqq"),defineSymbol(math,ams,rel,"⪇","\\lneq"),defineSymbol(math,ams,rel,"≨","\\lneqq"),defineSymbol(math,ams,rel,"","\\lvertneqq"),defineSymbol(math,ams,rel,"⋦","\\lnsim"),defineSymbol(math,ams,rel,"⪉","\\lnapprox"),defineSymbol(math,ams,rel,"⊀","\\nprec"),defineSymbol(math,ams,rel,"⋠","\\npreceq"),defineSymbol(math,ams,rel,"⋨","\\precnsim"),defineSymbol(math,ams,rel,"⪹","\\precnapprox"),defineSymbol(math,ams,rel,"≁","\\nsim"),defineSymbol(math,ams,rel,"","\\nshortmid"),defineSymbol(math,ams,rel,"∤","\\nmid"),defineSymbol(math,ams,rel,"⊬","\\nvdash"),defineSymbol(math,ams,rel,"⊭","\\nvDash"),defineSymbol(math,ams,rel,"⋪","\\ntriangleleft"),defineSymbol(math,ams,rel,"⋬","\\ntrianglelefteq"),defineSymbol(math,ams,rel,"⊊","\\subsetneq"),defineSymbol(math,ams,rel,"","\\varsubsetneq"),defineSymbol(math,ams,rel,"⫋","\\subsetneqq"),defineSymbol(math,ams,rel,"","\\varsubsetneqq"),defineSymbol(math,ams,rel,"≯","\\ngtr"),defineSymbol(math,ams,rel,"","\\ngeqslant"),defineSymbol(math,ams,rel,"","\\ngeqq"),defineSymbol(math,ams,rel,"⪈","\\gneq"),defineSymbol(math,ams,rel,"≩","\\gneqq"),defineSymbol(math,ams,rel,"","\\gvertneqq"),defineSymbol(math,ams,rel,"⋧","\\gnsim"),defineSymbol(math,ams,rel,"⪊","\\gnapprox"),defineSymbol(math,ams,rel,"⊁","\\nsucc"),defineSymbol(math,ams,rel,"⋡","\\nsucceq"),defineSymbol(math,ams,rel,"⋩","\\succnsim"),defineSymbol(math,ams,rel,"⪺","\\succnapprox"),defineSymbol(math,ams,rel,"≆","\\ncong"),defineSymbol(math,ams,rel,"","\\nshortparallel"),defineSymbol(math,ams,rel,"∦","\\nparallel"),defineSymbol(math,ams,rel,"⊯","\\nVDash"),defineSymbol(math,ams,rel,"⋫","\\ntriangleright"),defineSymbol(math,ams,rel,"⋭","\\ntrianglerighteq"),defineSymbol(math,ams,rel,"","\\nsupseteqq"),defineSymbol(math,ams,rel,"⊋","\\supsetneq"),defineSymbol(math,ams,rel,"","\\varsupsetneq"),defineSymbol(math,ams,rel,"⫌","\\supsetneqq"),defineSymbol(math,ams,rel,"","\\varsupsetneqq"),defineSymbol(math,ams,rel,"⊮","\\nVdash"),defineSymbol(math,ams,rel,"⪵","\\precneqq"),defineSymbol(math,ams,rel,"⪶","\\succneqq"),defineSymbol(math,ams,rel,"","\\nsubseteqq"),defineSymbol(math,ams,bin,"⊴","\\unlhd"),defineSymbol(math,ams,bin,"⊵","\\unrhd"),defineSymbol(math,ams,rel,"↚","\\nleftarrow"),defineSymbol(math,ams,rel,"↛","\\nrightarrow"),defineSymbol(math,ams,rel,"⇍","\\nLeftarrow"),defineSymbol(math,ams,rel,"⇏","\\nRightarrow"),defineSymbol(math,ams,rel,"↮","\\nleftrightarrow"),defineSymbol(math,ams,rel,"⇎","\\nLeftrightarrow"),defineSymbol(math,ams,rel,"△","\\vartriangle"),defineSymbol(math,ams,textord,"ℏ","\\hslash"),defineSymbol(math,ams,textord,"▽","\\triangledown"),defineSymbol(math,ams,textord,"◊","\\lozenge"),defineSymbol(math,ams,textord,"Ⓢ","\\circledS"),defineSymbol(math,ams,textord,"®","\\circledR"),defineSymbol(math,ams,textord,"∡","\\measuredangle"),defineSymbol(math,ams,textord,"∄","\\nexists"),defineSymbol(math,ams,textord,"℧","\\mho"),defineSymbol(math,ams,textord,"Ⅎ","\\Finv"),defineSymbol(math,ams,textord,"⅁","\\Game"),defineSymbol(math,ams,textord,"k","\\Bbbk"),defineSymbol(math,ams,textord,"‵","\\backprime"),defineSymbol(math,ams,textord,"▲","\\blacktriangle"),defineSymbol(math,ams,textord,"▼","\\blacktriangledown"),defineSymbol(math,ams,textord,"■","\\blacksquare"),defineSymbol(math,ams,textord,"⧫","\\blacklozenge"),defineSymbol(math,ams,textord,"★","\\bigstar"),defineSymbol(math,ams,textord,"∢","\\sphericalangle"),defineSymbol(math,ams,textord,"∁","\\complement"),defineSymbol(math,ams,textord,"ð","\\eth"),defineSymbol(math,ams,textord,"╱","\\diagup"),defineSymbol(math,ams,textord,"╲","\\diagdown"),defineSymbol(math,ams,textord,"□","\\square"),defineSymbol(math,ams,textord,"□","\\Box"),defineSymbol(math,ams,textord,"◊","\\Diamond"),defineSymbol(math,ams,textord,"¥","\\yen"),defineSymbol(math,ams,textord,"✓","\\checkmark"),defineSymbol(math,ams,textord,"ℶ","\\beth"),defineSymbol(math,ams,textord,"ℸ","\\daleth"),defineSymbol(math,ams,textord,"ℷ","\\gimel"),defineSymbol(math,ams,textord,"ϝ","\\digamma"),defineSymbol(math,ams,textord,"ϰ","\\varkappa"),defineSymbol(math,ams,open,"┌","\\ulcorner"),defineSymbol(math,ams,close,"┐","\\urcorner"),defineSymbol(math,ams,open,"└","\\llcorner"),defineSymbol(math,ams,close,"┘","\\lrcorner"),defineSymbol(math,ams,rel,"≦","\\leqq"),defineSymbol(math,ams,rel,"⩽","\\leqslant"),defineSymbol(math,ams,rel,"⪕","\\eqslantless"),defineSymbol(math,ams,rel,"≲","\\lesssim"),defineSymbol(math,ams,rel,"⪅","\\lessapprox"),defineSymbol(math,ams,rel,"≊","\\approxeq"),defineSymbol(math,ams,bin,"⋖","\\lessdot"),defineSymbol(math,ams,rel,"⋘","\\lll"),defineSymbol(math,ams,rel,"≶","\\lessgtr"),defineSymbol(math,ams,rel,"⋚","\\lesseqgtr"),defineSymbol(math,ams,rel,"⪋","\\lesseqqgtr"),defineSymbol(math,ams,rel,"≑","\\doteqdot"),defineSymbol(math,ams,rel,"≓","\\risingdotseq"),defineSymbol(math,ams,rel,"≒","\\fallingdotseq"),defineSymbol(math,ams,rel,"∽","\\backsim"),defineSymbol(math,ams,rel,"⋍","\\backsimeq"),defineSymbol(math,ams,rel,"⫅","\\subseteqq"),defineSymbol(math,ams,rel,"⋐","\\Subset"),defineSymbol(math,ams,rel,"⊏","\\sqsubset"),defineSymbol(math,ams,rel,"≼","\\preccurlyeq"),defineSymbol(math,ams,rel,"⋞","\\curlyeqprec"),defineSymbol(math,ams,rel,"≾","\\precsim"),defineSymbol(math,ams,rel,"⪷","\\precapprox"),defineSymbol(math,ams,rel,"⊲","\\vartriangleleft"),defineSymbol(math,ams,rel,"⊴","\\trianglelefteq"),defineSymbol(math,ams,rel,"⊨","\\vDash"),defineSymbol(math,ams,rel,"⊪","\\Vvdash"),defineSymbol(math,ams,rel,"⌣","\\smallsmile"),defineSymbol(math,ams,rel,"⌢","\\smallfrown"),defineSymbol(math,ams,rel,"≏","\\bumpeq"),defineSymbol(math,ams,rel,"≎","\\Bumpeq"),defineSymbol(math,ams,rel,"≧","\\geqq"),defineSymbol(math,ams,rel,"⩾","\\geqslant"),defineSymbol(math,ams,rel,"⪖","\\eqslantgtr"),defineSymbol(math,ams,rel,"≳","\\gtrsim"),defineSymbol(math,ams,rel,"⪆","\\gtrapprox"),defineSymbol(math,ams,bin,"⋗","\\gtrdot"),defineSymbol(math,ams,rel,"⋙","\\ggg"),defineSymbol(math,ams,rel,"≷","\\gtrless"),defineSymbol(math,ams,rel,"⋛","\\gtreqless"),defineSymbol(math,ams,rel,"⪌","\\gtreqqless"),defineSymbol(math,ams,rel,"≖","\\eqcirc"),defineSymbol(math,ams,rel,"≗","\\circeq"),defineSymbol(math,ams,rel,"≜","\\triangleq"),defineSymbol(math,ams,rel,"∼","\\thicksim"),defineSymbol(math,ams,rel,"≈","\\thickapprox"),defineSymbol(math,ams,rel,"⫆","\\supseteqq"),defineSymbol(math,ams,rel,"⋑","\\Supset"),defineSymbol(math,ams,rel,"⊐","\\sqsupset"),defineSymbol(math,ams,rel,"≽","\\succcurlyeq"),defineSymbol(math,ams,rel,"⋟","\\curlyeqsucc"),defineSymbol(math,ams,rel,"≿","\\succsim"),defineSymbol(math,ams,rel,"⪸","\\succapprox"),defineSymbol(math,ams,rel,"⊳","\\vartriangleright"),defineSymbol(math,ams,rel,"⊵","\\trianglerighteq"),defineSymbol(math,ams,rel,"⊩","\\Vdash"),defineSymbol(math,ams,rel,"∣","\\shortmid"),defineSymbol(math,ams,rel,"∥","\\shortparallel"),defineSymbol(math,ams,rel,"≬","\\between"),defineSymbol(math,ams,rel,"⋔","\\pitchfork"),defineSymbol(math,ams,rel,"∝","\\varpropto"),defineSymbol(math,ams,rel,"◀","\\blacktriangleleft"),defineSymbol(math,ams,rel,"∴","\\therefore"),defineSymbol(math,ams,rel,"∍","\\backepsilon"),defineSymbol(math,ams,rel,"▶","\\blacktriangleright"),defineSymbol(math,ams,rel,"∵","\\because"),defineSymbol(math,ams,rel,"⋘","\\llless"),defineSymbol(math,ams,rel,"⋙","\\gggtr"),defineSymbol(math,ams,bin,"⊲","\\lhd"),defineSymbol(math,ams,bin,"⊳","\\rhd"),defineSymbol(math,ams,rel,"≂","\\eqsim"),defineSymbol(math,main,rel,"⋈","\\Join"),defineSymbol(math,ams,rel,"≑","\\Doteq"),defineSymbol(math,ams,bin,"∔","\\dotplus"),defineSymbol(math,ams,bin,"∖","\\smallsetminus"),defineSymbol(math,ams,bin,"⋒","\\Cap"),defineSymbol(math,ams,bin,"⋓","\\Cup"),defineSymbol(math,ams,bin,"⩞","\\doublebarwedge"),defineSymbol(math,ams,bin,"⊟","\\boxminus"),defineSymbol(math,ams,bin,"⊞","\\boxplus"),defineSymbol(math,ams,bin,"⋇","\\divideontimes"),defineSymbol(math,ams,bin,"⋉","\\ltimes"),defineSymbol(math,ams,bin,"⋊","\\rtimes"),defineSymbol(math,ams,bin,"⋋","\\leftthreetimes"),defineSymbol(math,ams,bin,"⋌","\\rightthreetimes"),defineSymbol(math,ams,bin,"⋏","\\curlywedge"),defineSymbol(math,ams,bin,"⋎","\\curlyvee"),defineSymbol(math,ams,bin,"⊝","\\circleddash"),defineSymbol(math,ams,bin,"⊛","\\circledast"),defineSymbol(math,ams,bin,"⋅","\\centerdot"),defineSymbol(math,ams,bin,"⊺","\\intercal"),defineSymbol(math,ams,bin,"⋒","\\doublecap"),defineSymbol(math,ams,bin,"⋓","\\doublecup"),defineSymbol(math,ams,bin,"⊠","\\boxtimes"),defineSymbol(math,ams,rel,"⇢","\\dashrightarrow"),defineSymbol(math,ams,rel,"⇠","\\dashleftarrow"),defineSymbol(math,ams,rel,"⇇","\\leftleftarrows"),defineSymbol(math,ams,rel,"⇆","\\leftrightarrows"),defineSymbol(math,ams,rel,"⇚","\\Lleftarrow"),defineSymbol(math,ams,rel,"↞","\\twoheadleftarrow"),defineSymbol(math,ams,rel,"↢","\\leftarrowtail"),defineSymbol(math,ams,rel,"↫","\\looparrowleft"),defineSymbol(math,ams,rel,"⇋","\\leftrightharpoons"),defineSymbol(math,ams,rel,"↶","\\curvearrowleft"),defineSymbol(math,ams,rel,"↺","\\circlearrowleft"),defineSymbol(math,ams,rel,"↰","\\Lsh"),defineSymbol(math,ams,rel,"⇈","\\upuparrows"),defineSymbol(math,ams,rel,"↿","\\upharpoonleft"),defineSymbol(math,ams,rel,"⇃","\\downharpoonleft"),defineSymbol(math,ams,rel,"⊸","\\multimap"),defineSymbol(math,ams,rel,"↭","\\leftrightsquigarrow"),defineSymbol(math,ams,rel,"⇉","\\rightrightarrows"),defineSymbol(math,ams,rel,"⇄","\\rightleftarrows"),defineSymbol(math,ams,rel,"↠","\\twoheadrightarrow"),defineSymbol(math,ams,rel,"↣","\\rightarrowtail"),defineSymbol(math,ams,rel,"↬","\\looparrowright"),defineSymbol(math,ams,rel,"↷","\\curvearrowright"),defineSymbol(math,ams,rel,"↻","\\circlearrowright"),defineSymbol(math,ams,rel,"↱","\\Rsh"),defineSymbol(math,ams,rel,"⇊","\\downdownarrows"),defineSymbol(math,ams,rel,"↾","\\upharpoonright"),defineSymbol(math,ams,rel,"⇂","\\downharpoonright"),defineSymbol(math,ams,rel,"⇝","\\rightsquigarrow"),defineSymbol(math,ams,rel,"⇝","\\leadsto"),defineSymbol(math,ams,rel,"⇛","\\Rrightarrow"),defineSymbol(math,ams,rel,"↾","\\restriction"),defineSymbol(math,main,textord,"‘","`"),defineSymbol(math,main,textord,"$","\\$"),defineSymbol(text,main,textord,"$","\\$"),defineSymbol(math,main,textord,"%","\\%"),defineSymbol(text,main,textord,"%","\\%"),defineSymbol(math,main,textord,"_","\\_"),defineSymbol(text,main,textord,"_","\\_"),defineSymbol(math,main,textord,"∠","\\angle"),defineSymbol(math,main,textord,"∞","\\infty"),defineSymbol(math,main,textord,"′","\\prime"),defineSymbol(math,main,textord,"△","\\triangle"),defineSymbol(math,main,textord,"Γ","\\Gamma"),defineSymbol(math,main,textord,"Δ","\\Delta"),defineSymbol(math,main,textord,"Θ","\\Theta"),defineSymbol(math,main,textord,"Λ","\\Lambda"),defineSymbol(math,main,textord,"Ξ","\\Xi"),defineSymbol(math,main,textord,"Π","\\Pi"),defineSymbol(math,main,textord,"Σ","\\Sigma"),defineSymbol(math,main,textord,"Υ","\\Upsilon"),defineSymbol(math,main,textord,"Φ","\\Phi"),defineSymbol(math,main,textord,"Ψ","\\Psi"),defineSymbol(math,main,textord,"Ω","\\Omega"),defineSymbol(math,main,textord,"¬","\\neg"),defineSymbol(math,main,textord,"¬","\\lnot"),defineSymbol(math,main,textord,"⊤","\\top"),defineSymbol(math,main,textord,"⊥","\\bot"),defineSymbol(math,main,textord,"∅","\\emptyset"),defineSymbol(math,ams,textord,"∅","\\varnothing"),defineSymbol(math,main,mathord,"α","\\alpha"),defineSymbol(math,main,mathord,"β","\\beta"),defineSymbol(math,main,mathord,"γ","\\gamma"),defineSymbol(math,main,mathord,"δ","\\delta"),defineSymbol(math,main,mathord,"ϵ","\\epsilon"),defineSymbol(math,main,mathord,"ζ","\\zeta"),defineSymbol(math,main,mathord,"η","\\eta"),defineSymbol(math,main,mathord,"θ","\\theta"),defineSymbol(math,main,mathord,"ι","\\iota"),defineSymbol(math,main,mathord,"κ","\\kappa"),defineSymbol(math,main,mathord,"λ","\\lambda"),defineSymbol(math,main,mathord,"μ","\\mu"),defineSymbol(math,main,mathord,"ν","\\nu"),defineSymbol(math,main,mathord,"ξ","\\xi"),defineSymbol(math,main,mathord,"o","\\omicron"),defineSymbol(math,main,mathord,"π","\\pi"),defineSymbol(math,main,mathord,"ρ","\\rho"),defineSymbol(math,main,mathord,"σ","\\sigma"),defineSymbol(math,main,mathord,"τ","\\tau"),defineSymbol(math,main,mathord,"υ","\\upsilon"),defineSymbol(math,main,mathord,"ϕ","\\phi"),defineSymbol(math,main,mathord,"χ","\\chi"),defineSymbol(math,main,mathord,"ψ","\\psi"),defineSymbol(math,main,mathord,"ω","\\omega"),defineSymbol(math,main,mathord,"ε","\\varepsilon"),defineSymbol(math,main,mathord,"ϑ","\\vartheta"),defineSymbol(math,main,mathord,"ϖ","\\varpi"),defineSymbol(math,main,mathord,"ϱ","\\varrho"),defineSymbol(math,main,mathord,"ς","\\varsigma"),defineSymbol(math,main,mathord,"φ","\\varphi"),defineSymbol(math,main,bin,"∗","*"),defineSymbol(math,main,bin,"+","+"),defineSymbol(math,main,bin,"−","-"),defineSymbol(math,main,bin,"⋅","\\cdot"),defineSymbol(math,main,bin,"∘","\\circ"),defineSymbol(math,main,bin,"÷","\\div"),defineSymbol(math,main,bin,"±","\\pm"),defineSymbol(math,main,bin,"×","\\times"),defineSymbol(math,main,bin,"∩","\\cap"),defineSymbol(math,main,bin,"∪","\\cup"),defineSymbol(math,main,bin,"∖","\\setminus"),defineSymbol(math,main,bin,"∧","\\land"),defineSymbol(math,main,bin,"∨","\\lor"),defineSymbol(math,main,bin,"∧","\\wedge"),defineSymbol(math,main,bin,"∨","\\vee"),defineSymbol(math,main,textord,"√","\\surd"),defineSymbol(math,main,open,"(","("),defineSymbol(math,main,open,"[","["),defineSymbol(math,main,open,"⟨","\\langle"),defineSymbol(math,main,open,"∣","\\lvert"),defineSymbol(math,main,open,"∥","\\lVert"),defineSymbol(math,main,close,")",")"),defineSymbol(math,main,close,"]","]"),defineSymbol(math,main,close,"?","?"),defineSymbol(math,main,close,"!","!"),defineSymbol(math,main,close,"⟩","\\rangle"),defineSymbol(math,main,close,"∣","\\rvert"),defineSymbol(math,main,close,"∥","\\rVert"),defineSymbol(math,main,rel,"=","="),defineSymbol(math,main,rel,"<","<"),defineSymbol(math,main,rel,">",">"),defineSymbol(math,main,rel,":",":"),defineSymbol(math,main,rel,"≈","\\approx"),defineSymbol(math,main,rel,"≅","\\cong"),defineSymbol(math,main,rel,"≥","\\ge"),defineSymbol(math,main,rel,"≥","\\geq"),defineSymbol(math,main,rel,"←","\\gets"),defineSymbol(math,main,rel,">","\\gt"),defineSymbol(math,main,rel,"∈","\\in"),defineSymbol(math,main,rel,"∉","\\notin"),defineSymbol(math,main,rel,"⊂","\\subset"),defineSymbol(math,main,rel,"⊃","\\supset"),defineSymbol(math,main,rel,"⊆","\\subseteq"),defineSymbol(math,main,rel,"⊇","\\supseteq"),defineSymbol(math,ams,rel,"⊈","\\nsubseteq"),defineSymbol(math,ams,rel,"⊉","\\nsupseteq"),defineSymbol(math,main,rel,"⊨","\\models"),defineSymbol(math,main,rel,"←","\\leftarrow"),defineSymbol(math,main,rel,"≤","\\le"),defineSymbol(math,main,rel,"≤","\\leq"),defineSymbol(math,main,rel,"<","\\lt"),defineSymbol(math,main,rel,"≠","\\ne"),defineSymbol(math,main,rel,"≠","\\neq"),defineSymbol(math,main,rel,"→","\\rightarrow"),defineSymbol(math,main,rel,"→","\\to"),defineSymbol(math,ams,rel,"≱","\\ngeq"),defineSymbol(math,ams,rel,"≰","\\nleq"),defineSymbol(math,main,spacing,null,"\\!"),defineSymbol(math,main,spacing," ","\\ "),defineSymbol(math,main,spacing," ","~"),defineSymbol(math,main,spacing,null,"\\,"),defineSymbol(math,main,spacing,null,"\\:"),defineSymbol(math,main,spacing,null,"\\;"),defineSymbol(math,main,spacing,null,"\\enspace"),defineSymbol(math,main,spacing,null,"\\qquad"),defineSymbol(math,main,spacing,null,"\\quad"),defineSymbol(math,main,spacing," ","\\space"),defineSymbol(math,main,punct,",",","),defineSymbol(math,main,punct,";",";"),defineSymbol(math,main,punct,":","\\colon"),defineSymbol(math,ams,bin,"⊼","\\barwedge"),defineSymbol(math,ams,bin,"⊻","\\veebar"),defineSymbol(math,main,bin,"⊙","\\odot"),defineSymbol(math,main,bin,"⊕","\\oplus"),defineSymbol(math,main,bin,"⊗","\\otimes"),defineSymbol(math,main,textord,"∂","\\partial"),defineSymbol(math,main,bin,"⊘","\\oslash"),defineSymbol(math,ams,bin,"⊚","\\circledcirc"),defineSymbol(math,ams,bin,"⊡","\\boxdot"),defineSymbol(math,main,bin,"△","\\bigtriangleup"),defineSymbol(math,main,bin,"▽","\\bigtriangledown"),defineSymbol(math,main,bin,"†","\\dagger"),defineSymbol(math,main,bin,"⋄","\\diamond"),defineSymbol(math,main,bin,"⋆","\\star"),defineSymbol(math,main,bin,"◃","\\triangleleft"),defineSymbol(math,main,bin,"▹","\\triangleright"),defineSymbol(math,main,open,"{","\\{"),defineSymbol(text,main,textord,"{","\\{"),defineSymbol(math,main,close,"}","\\}"),defineSymbol(text,main,textord,"}","\\}"),defineSymbol(math,main,open,"{","\\lbrace"),defineSymbol(math,main,close,"}","\\rbrace"),defineSymbol(math,main,open,"[","\\lbrack"),defineSymbol(math,main,close,"]","\\rbrack"),defineSymbol(math,main,open,"⌊","\\lfloor"),defineSymbol(math,main,close,"⌋","\\rfloor"),defineSymbol(math,main,open,"⌈","\\lceil"),defineSymbol(math,main,close,"⌉","\\rceil"),defineSymbol(math,main,textord,"\\","\\backslash"),defineSymbol(math,main,textord,"∣","|"),defineSymbol(math,main,textord,"∣","\\vert"),defineSymbol(math,main,textord,"∥","\\|"),defineSymbol(math,main,textord,"∥","\\Vert"),defineSymbol(math,main,rel,"↑","\\uparrow"),defineSymbol(math,main,rel,"⇑","\\Uparrow"),defineSymbol(math,main,rel,"↓","\\downarrow"),defineSymbol(math,main,rel,"⇓","\\Downarrow"),defineSymbol(math,main,rel,"↕","\\updownarrow"),defineSymbol(math,main,rel,"⇕","\\Updownarrow"),defineSymbol(math,math,op,"∐","\\coprod"),defineSymbol(math,math,op,"⋁","\\bigvee"),defineSymbol(math,math,op,"⋀","\\bigwedge"),defineSymbol(math,math,op,"⨄","\\biguplus"),defineSymbol(math,math,op,"⋂","\\bigcap"),defineSymbol(math,math,op,"⋃","\\bigcup"),defineSymbol(math,math,op,"∫","\\int"),defineSymbol(math,math,op,"∫","\\intop"),defineSymbol(math,math,op,"∬","\\iint"),defineSymbol(math,math,op,"∭","\\iiint"),defineSymbol(math,math,op,"∏","\\prod"),defineSymbol(math,math,op,"∑","\\sum"),defineSymbol(math,math,op,"⨂","\\bigotimes"),defineSymbol(math,math,op,"⨁","\\bigoplus"),defineSymbol(math,math,op,"⨀","\\bigodot"),defineSymbol(math,math,op,"∮","\\oint"),defineSymbol(math,math,op,"⨆","\\bigsqcup"),defineSymbol(math,math,op,"∫","\\smallint"),defineSymbol(text,main,inner,"…","\\textellipsis"),defineSymbol(math,main,inner,"…","\\mathellipsis"),defineSymbol(text,main,inner,"…","\\ldots"),defineSymbol(math,main,inner,"…","\\ldots"),defineSymbol(math,main,inner,"⋯","\\cdots"),defineSymbol(math,main,inner,"⋱","\\ddots"),defineSymbol(math,main,textord,"⋮","\\vdots"),defineSymbol(math,main,accent,"´","\\acute"),defineSymbol(math,main,accent,"`","\\grave"),defineSymbol(math,main,accent,"¨","\\ddot"),defineSymbol(math,main,accent,"~","\\tilde"),defineSymbol(math,main,accent,"¯","\\bar"),defineSymbol(math,main,accent,"˘","\\breve"),defineSymbol(math,main,accent,"ˇ","\\check"),defineSymbol(math,main,accent,"^","\\hat"),defineSymbol(math,main,accent,"⃗","\\vec"),defineSymbol(math,main,accent,"˙","\\dot"),defineSymbol(math,main,mathord,"ı","\\imath"),defineSymbol(math,main,mathord,"ȷ","\\jmath"),defineSymbol(text,main,textord,"–","--"),defineSymbol(text,main,textord,"—","---"),defineSymbol(text,main,textord,"‘","`"),defineSymbol(text,main,textord,"’","'"),defineSymbol(text,main,textord,"“","``"),defineSymbol(text,main,textord,"”","''"),defineSymbol(math,main,textord,"°","\\degree"),defineSymbol(text,main,textord,"°","\\degree"),defineSymbol(math,main,mathord,"£","\\pounds"),defineSymbol(math,ams,textord,"✠","\\maltese"),defineSymbol(text,ams,textord,"✠","\\maltese"),defineSymbol(text,main,spacing," ","\\ "),defineSymbol(text,main,spacing," "," "),defineSymbol(text,main,spacing," ","~");var i,ch,mathTextSymbols='0123456789/@."';for(i=0;i<mathTextSymbols.length;i++)defineSymbol(math,main,textord,ch=mathTextSymbols.charAt(i),ch);var textSymbols='0123456789!@*()-=+[]";:?/.,';for(i=0;i<textSymbols.length;i++)defineSymbol(text,main,textord,ch=textSymbols.charAt(i),ch);var letters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";for(i=0;i<letters.length;i++)defineSymbol(math,main,mathord,ch=letters.charAt(i),ch),defineSymbol(text,main,textord,ch,ch);for(i=192;i<=214;i++)defineSymbol(text,main,textord,ch=String.fromCharCode(i),ch);for(i=216;i<=246;i++)defineSymbol(text,main,textord,ch=String.fromCharCode(i),ch);for(i=248;i<=255;i++)defineSymbol(text,main,textord,ch=String.fromCharCode(i),ch);for(i=1040;i<=1103;i++)defineSymbol(text,main,textord,ch=String.fromCharCode(i),ch);defineSymbol(text,main,textord,"–","–"),defineSymbol(text,main,textord,"—","—"),defineSymbol(text,main,textord,"‘","‘"),defineSymbol(text,main,textord,"’","’"),defineSymbol(text,main,textord,"“","“"),defineSymbol(text,main,textord,"”","”");

},{}],75:[function(require,module,exports){
"use strict";var hangulRegex=/[\uAC00-\uD7AF]/,cjkRegex=/[\u3040-\u309F]|[\u30A0-\u30FF]|[\u4E00-\u9FAF]|[\uAC00-\uD7AF]/;module.exports={cjkRegex:cjkRegex,hangulRegex:hangulRegex};

},{}],76:[function(require,module,exports){
"use strict";function escaper(e){return ESCAPE_LOOKUP[e]}function escape(e){return(""+e).replace(ESCAPE_REGEX,escaper)}function clearNode(e){setTextContent(e,"")}var nativeIndexOf=Array.prototype.indexOf,indexOf=function(e,t){if(null==e)return-1;if(nativeIndexOf&&e.indexOf===nativeIndexOf)return e.indexOf(t);for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},contains=function(e,t){return-1!==indexOf(e,t)},deflt=function(e,t){return void 0===e?t:e},uppercase=/([A-Z])/g,hyphenate=function(e){return e.replace(uppercase,"-$1").toLowerCase()},ESCAPE_LOOKUP={"&":"&amp;",">":"&gt;","<":"&lt;",'"':"&quot;","'":"&#x27;"},ESCAPE_REGEX=/[&><"']/g,setTextContent;if("undefined"!=typeof document){var testNode=document.createElement("span");setTextContent="textContent"in testNode?function(e,t){e.textContent=t}:function(e,t){e.innerText=t}}module.exports={contains:contains,deflt:deflt,escape:escape,hyphenate:hyphenate,indexOf:indexOf,setTextContent:setTextContent,clearNode:clearNode};

},{}],77:[function(require,module,exports){
"use strict";var KEBAB_REGEX=/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g,REVERSE_REGEX=/-[a-z\u00E0-\u00F6\u00F8-\u00FE]/g;module.exports=exports=function(e){return e.replace(KEBAB_REGEX,function(e){return"-"+e.toLowerCase()})},exports.reverse=function(e){return e.replace(REVERSE_REGEX,function(e){return e.slice(1).toUpperCase()})};

},{}],78:[function(require,module,exports){
"use strict";function escapes(m){var a=m||{};return a.commonmark?commonmark:a.gfm?gfm:defaults}module.exports=escapes;var defaults=["\\","`","*","{","}","[","]","(",")","#","+","-",".","!","_",">"],gfm=defaults.concat(["~","|"]),commonmark=gfm.concat(["\n",'"',"$","%","&","'",",","/",":",";","<","=","?","@","^"]);escapes.default=defaults,escapes.gfm=gfm,escapes.commonmark=commonmark;

},{}],79:[function(require,module,exports){
"use strict";function getRelocatable(e){if(!e.__matchAtRelocatable){var t=e.source+"|()",l="g"+(e.ignoreCase?"i":"")+(e.multiline?"m":"")+(e.unicode?"u":"");e.__matchAtRelocatable=new RegExp(t,l)}return e.__matchAtRelocatable}function matchAt(e,t,l){if(e.global||e.sticky)throw new Error("matchAt(...): Only non-global regexes are supported");var a=getRelocatable(e);a.lastIndex=l;var n=a.exec(t);return null==n[n.length-1]?(n.length=n.length-1,n):null}module.exports=matchAt;

},{}],80:[function(require,module,exports){
"use strict";function getDefinitionFactory(t,n){return getterFactory(gather(t,n))}function gather(t,n){var i={};if(!t||!t.type)throw new Error("mdast-util-definitions expected node");return visit(t,"definition",n&&n.commonmark?function(t){var n=normalise(t.identifier);own.call(i,n)||(i[n]=t)}:function(t){i[normalise(t.identifier)]=t}),i}function getterFactory(t){return function(n){var i=n&&normalise(n);return i&&own.call(t,i)?t[i]:null}}function normalise(t){return t.toUpperCase()}var visit=require("unist-util-visit");module.exports=getDefinitionFactory;var own={}.hasOwnProperty;

},{"unist-util-visit":227}],81:[function(require,module,exports){
"use strict";module.exports=require("./lib/index.js");

},{"./lib/index.js":108}],82:[function(require,module,exports){
"use strict";function all(e,r){for(var l,t,a=r.children||[],u=a.length,i=[],n=-1;++n<u;)(l=one(e,a[n],r))&&(n&&"break"===a[n-1].type&&(l.value&&(l.value=trim.left(l.value)),(t=l.children&&l.children[0])&&t.value&&(t.value=trim.left(t.value))),i=i.concat(l));return i}module.exports=all;var trim=require("trim"),one=require("./one");

},{"./one":109,"trim":207}],83:[function(require,module,exports){
"use strict";function failsafe(e,l,t){var r=l.referenceType;if("collapsed"!==r&&"full"!==r&&!t)return"imageReference"===l.type?u("text","!["+l.alt+"]"):[u("text","[")].concat(all(e,l),u("text","]"))}module.exports=failsafe;var u=require("unist-builder"),all=require("./all");

},{"./all":82,"unist-builder":220}],84:[function(require,module,exports){
"use strict";function generateFootnotes(e){var t,r=e.footnotes,i=r.length,n=-1,o=[];if(!i)return null;for(;++n<i;)t=r[n],o[n]={type:"listItem",data:{hProperties:{id:"fn-"+t.identifier}},children:t.children.concat({type:"link",url:"#fnref-"+t.identifier,data:{hProperties:{className:["footnote-backref"]}},children:[{type:"text",value:"↩"}]}),position:t.position};return e(null,"div",{className:["footnotes"]},wrap([thematicBreak(e),list(e,{type:"list",ordered:!0,children:o})],!0))}module.exports=generateFootnotes;var thematicBreak=require("./handlers/thematic-break"),list=require("./handlers/list"),wrap=require("./wrap");

},{"./handlers/list":101,"./handlers/thematic-break":107,"./wrap":110}],85:[function(require,module,exports){
"use strict";function blockquote(r,e){return r(e,"blockquote",wrap(all(r,e),!0))}module.exports=blockquote;var wrap=require("../wrap"),all=require("../all");

},{"../all":82,"../wrap":110}],86:[function(require,module,exports){
"use strict";function hardBreak(r,e){return[r(e,"br"),u("text","\n")]}module.exports=hardBreak;var u=require("unist-builder");

},{"unist-builder":220}],87:[function(require,module,exports){
"use strict";function code(e,t){var a=t.value?detab(t.value+"\n"):"",r=t.lang&&t.lang.match(/^[^ \t]+(?=[ \t]|$)/),n={};return r&&(n.className=["language-"+r]),e(t.position,"pre",[e(t,"code",n,[u("text",a)])])}module.exports=code;var detab=require("detab"),u=require("unist-builder");

},{"detab":13,"unist-builder":220}],88:[function(require,module,exports){
"use strict";function strikethrough(r,e){return r(e,"del",all(r,e))}module.exports=strikethrough;var all=require("../all");

},{"../all":82}],89:[function(require,module,exports){
"use strict";function emphasis(e,l){return e(l,"em",all(e,l))}module.exports=emphasis;var all=require("../all");

},{"../all":82}],90:[function(require,module,exports){
"use strict";function footnoteReference(e,t){var r=t.identifier;return e(t.position,"sup",{id:"fnref-"+r},[e(t,"a",{href:"#fn-"+r,className:["footnote-ref"]},[u("text",r)])])}module.exports=footnoteReference;var u=require("unist-builder");

},{"unist-builder":220}],91:[function(require,module,exports){
"use strict";function footnote(e,o){for(var t=[],n=1,i=e.footnotes,r=i.length,f=-1;++f<r;)t[f]=i[f].identifier;for(;-1!==t.indexOf(String(n));)n++;return n=String(n),i.push({type:"footnoteDefinition",identifier:n,children:o.children,position:o.position}),footnoteReference(e,{type:"footnoteReference",identifier:n,position:o.position})}module.exports=footnote;var footnoteReference=require("./footnote-reference");

},{"./footnote-reference":90}],92:[function(require,module,exports){
"use strict";function heading(e,l){return e(l,"h"+l.depth,all(e,l))}module.exports=heading;var all=require("../all");

},{"../all":82}],93:[function(require,module,exports){
"use strict";function html(e,r){return e.dangerous?e.augment(r,u("raw",r.value)):null}module.exports=html;var u=require("unist-builder");

},{"unist-builder":220}],94:[function(require,module,exports){
"use strict";function imageReference(e,i){var r=e.definition(i.identifier),t={src:normalize(r&&r.url||""),alt:i.alt};return r&&null!==r.title&&void 0!==r.title&&(t.title=r.title),failsafe(e,i,r)||e(i,"img",t)}module.exports=imageReference;var normalize=require("normalize-uri"),failsafe=require("../failsafe");

},{"../failsafe":83,"normalize-uri":111}],95:[function(require,module,exports){
"use strict";function image(e,i){var t={src:normalize(i.url),alt:i.alt};return null!==i.title&&void 0!==i.title&&(t.title=i.title),e(i,"img",t)}var normalize=require("normalize-uri");module.exports=image;

},{"normalize-uri":111}],96:[function(require,module,exports){
"use strict";function ignore(){return null}module.exports={blockquote:require("./blockquote"),break:require("./break"),code:require("./code"),delete:require("./delete"),emphasis:require("./emphasis"),footnoteReference:require("./footnote-reference"),footnote:require("./footnote"),heading:require("./heading"),html:require("./html"),imageReference:require("./image-reference"),image:require("./image"),inlineCode:require("./inline-code"),linkReference:require("./link-reference"),link:require("./link"),listItem:require("./list-item"),list:require("./list"),paragraph:require("./paragraph"),root:require("./root"),strong:require("./strong"),table:require("./table"),text:require("./text"),thematicBreak:require("./thematic-break"),yaml:ignore,definition:ignore,footnoteDefinition:ignore};

},{"./blockquote":85,"./break":86,"./code":87,"./delete":88,"./emphasis":89,"./footnote":91,"./footnote-reference":90,"./heading":92,"./html":93,"./image":95,"./image-reference":94,"./inline-code":97,"./link":99,"./link-reference":98,"./list":101,"./list-item":100,"./paragraph":102,"./root":103,"./strong":104,"./table":105,"./text":106,"./thematic-break":107}],97:[function(require,module,exports){
"use strict";function inlineCode(e,i){return e(i,"code",[u("text",collapse(i.value))])}module.exports=inlineCode;var collapse=require("collapse-white-space"),u=require("unist-builder");

},{"collapse-white-space":11,"unist-builder":220}],98:[function(require,module,exports){
"use strict";function linkReference(e,i){var l=e.definition(i.identifier),r={href:normalize(l&&l.url||"")};return l&&null!==l.title&&void 0!==l.title&&(r.title=l.title),failsafe(e,i,l)||e(i,"a",r,all(e,i))}module.exports=linkReference;var normalize=require("normalize-uri"),failsafe=require("../failsafe"),all=require("../all");

},{"../all":82,"../failsafe":83,"normalize-uri":111}],99:[function(require,module,exports){
"use strict";function link(l,e){var r={href:normalize(e.url)};return null!==e.title&&void 0!==e.title&&(r.title=e.title),l(e,"a",r,all(l,e))}var normalize=require("normalize-uri"),all=require("../all");module.exports=link;

},{"../all":82,"normalize-uri":111}],100:[function(require,module,exports){
"use strict";function listItem(e,t,l){var r,a,i=t.children,n=i[0],s={},h=!1;return l&&l.loose||1!==i.length||"paragraph"!==n.type||(h=!0),r=all(e,h?n:t),"boolean"==typeof t.checked&&(h||n&&"paragraph"===n.type||r.unshift(e(null,"p",[])),0!==(a=h?r:r[0].children).length&&a.unshift(u("text"," ")),a.unshift(e(null,"input",{type:"checkbox",checked:t.checked,disabled:!0})),s.className=["task-list-item"]),h||0===r.length||(r=wrap(r,!0)),e(t,"li",s,r)}module.exports=listItem;var u=require("unist-builder"),wrap=require("../wrap"),all=require("../all");

},{"../all":82,"../wrap":110,"unist-builder":220}],101:[function(require,module,exports){
"use strict";function list(r,t){var a={},e=t.ordered?"ol":"ul";return"number"==typeof t.start&&1!==t.start&&(a.start=t.start),r(t,e,a,wrap(all(r,t),!0))}module.exports=list;var wrap=require("../wrap"),all=require("../all");

},{"../all":82,"../wrap":110}],102:[function(require,module,exports){
"use strict";function paragraph(r,a){return r(a,"p",all(r,a))}module.exports=paragraph;var all=require("../all");

},{"../all":82}],103:[function(require,module,exports){
"use strict";function root(r,e){return r.augment(e,u("root",wrap(all(r,e))))}module.exports=root;var u=require("unist-builder"),wrap=require("../wrap"),all=require("../all");

},{"../all":82,"../wrap":110,"unist-builder":220}],104:[function(require,module,exports){
"use strict";function strong(r,t){return r(t,"strong",all(r,t))}module.exports=strong;var all=require("../all");

},{"../all":82}],105:[function(require,module,exports){
"use strict";function table(t,r){for(var e,i,a,l,n,o=r.children,p=o.length,s=r.align,u=s.length,d=[];p--;){for(i=o[p].children,l=0===p?"th":"td",e=u,a=[];e--;)n=i[e],a[e]=t(n,l,{align:s[e]},n?wrap(all(t,n)):[]);d[p]=t(o[p],"tr",wrap(a,!0))}return t(r,"table",wrap([t(d[0].position,"thead",wrap([d[0]],!0)),t({start:position.start(d[1]),end:position.end(d[d.length-1])},"tbody",wrap(d.slice(1),!0))],!0))}module.exports=table;var position=require("unist-util-position"),wrap=require("../wrap"),all=require("../all");

},{"../all":82,"../wrap":110,"unist-util-position":224}],106:[function(require,module,exports){
"use strict";function text(e,t){return e.augment(t,u("text",trimLines(t.value)))}module.exports=text;var u=require("unist-builder"),trimLines=require("trim-lines");

},{"trim-lines":205,"unist-builder":220}],107:[function(require,module,exports){
"use strict";function thematicBreak(t,e){return t(e,"hr")}module.exports=thematicBreak;

},{}],108:[function(require,module,exports){
"use strict";function factory(e,t){function n(e,t){var n,o;return e&&"data"in e&&(n=e.data,"element"===t.type&&n.hName&&(t.tagName=n.hName),"element"===t.type&&n.hProperties&&(t.properties=xtend(t.properties,n.hProperties)),t.children&&n.hChildren&&(t.children=n.hChildren)),o=e&&e.position?e:{position:e},generated(o)||(t.position={start:position.start(o),end:position.end(o)}),t}function o(e,t,o,i){return(void 0===i||null===i)&&"object"===(void 0===o?"undefined":_typeof(o))&&"length"in o&&(i=o,o={}),n(e,{type:"element",tagName:t,properties:o||{},children:i||[]})}var i=t||{},r=i.allowDangerousHTML;return o.dangerous=r,o.definition=definitions(e,i),o.footnotes=[],o.augment=n,o.handlers=xtend(handlers,i.handlers||{}),visit(e,"footnoteDefinition",function(e){o.footnotes.push(e)}),o}function toHAST(e,t){var n=factory(e,t),o=one(n,e),i=footer(n);return o&&o.children&&i&&(o.children=o.children.concat(u("text","\n"),i)),o}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};module.exports=toHAST;var xtend=require("xtend"),u=require("unist-builder"),visit=require("unist-util-visit"),position=require("unist-util-position"),generated=require("unist-util-generated"),definitions=require("mdast-util-definitions"),one=require("./one"),footer=require("./footer"),handlers=require("./handlers");

},{"./footer":84,"./handlers":96,"./one":109,"mdast-util-definitions":80,"unist-builder":220,"unist-util-generated":221,"unist-util-position":224,"unist-util-visit":227,"xtend":237}],109:[function(require,module,exports){
"use strict";function unknown(n,e){return text(e)?n.augment(e,u("text",e.value)):n(e,"div",all(n,e))}function one(n,e,r){var t=e&&e.type,l=own.call(n.handlers,t)?n.handlers[t]:null;if(!t)throw new Error("Expected node, got `"+e+"`");return("function"==typeof l?l:unknown)(n,e,r)}function text(n){var e=n.data||{};return!(own.call(e,"hName")||own.call(e,"hProperties")||own.call(e,"hChildren"))&&"value"in n}module.exports=one;var u=require("unist-builder"),all=require("./all"),own={}.hasOwnProperty;

},{"./all":82,"unist-builder":220}],110:[function(require,module,exports){
"use strict";function wrap(t,e){var r=[],n=-1,s=t.length;for(e&&r.push(u("text","\n"));++n<s;)n&&r.push(u("text","\n")),r.push(t[n]);return e&&0!==t.length&&r.push(u("text","\n")),r}module.exports=wrap;var u=require("unist-builder");

},{"unist-builder":220}],111:[function(require,module,exports){
"use strict";function normalize(e){return encodeURI(decodeURI(e))}function returner(e){return e}module.exports=returner;try{normalize(""),module.exports=normalize}catch(e){}

},{}],112:[function(require,module,exports){
"use strict";function toObject(e){if(null===e||void 0===e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}function shouldUseNative(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var r={},t=0;t<10;t++)r["_"+String.fromCharCode(t)]=t;if("0123456789"!==Object.getOwnPropertyNames(r).map(function(e){return r[e]}).join(""))return!1;var n={};return"abcdefghijklmnopqrst".split("").forEach(function(e){n[e]=e}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},n)).join("")}catch(e){return!1}}var getOwnPropertySymbols=Object.getOwnPropertySymbols,hasOwnProperty=Object.prototype.hasOwnProperty,propIsEnumerable=Object.prototype.propertyIsEnumerable;module.exports=shouldUseNative()?Object.assign:function(e,r){for(var t,n,o=toObject(e),a=1;a<arguments.length;a++){t=Object(arguments[a]);for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);if(getOwnPropertySymbols){n=getOwnPropertySymbols(t);for(var c=0;c<n.length;c++)propIsEnumerable.call(t,n[c])&&(o[n[c]]=t[n[c]])}}return o};

},{}],113:[function(require,module,exports){
"use strict";function wrapper(E,e){var n,t,r={};e||(e={});for(t in defaults)n=e[t],r[t]=null===n||void 0===n?defaults[t]:n;return(r.position.indent||r.position.start)&&(r.indent=r.position.indent||[],r.position=r.position.start),parse(E,r)}function parse(E,e){function n(){return{line:w,column:v,offset:Y+(x.offset||0)}}function t(e){return E.charAt(e)}function r(){b&&(H.push(b),P&&P.call(L,b,{start:u,end:n()}),b=EMPTY)}var i,a,N,M,o,l,A,c,T,R,C,S,D,I,u,s,_,d,f=e.additional,O=e.nonTerminated,P=e.text,m=e.reference,h=e.warning,L=e.textContext,p=e.referenceContext,U=e.warningContext,x=e.position,g=e.indent||[],W=E.length,Y=0,F=-1,v=x.column||1,w=x.line||1,b=EMPTY,H=[];for(u=n(),A=h?function(E,e){var t=n();t.column+=e,t.offset+=e,h.call(U,MESSAGES[E],t,E)}:noop,Y--,W++;++Y<W;)if(M===NEWLINE&&(v=g[F]||1),(M=t(Y))!==AMPERSAND)M===NEWLINE&&(w++,F++,v=0),M?(b+=M,v++):r();else{if((l=t(Y+1))===TAB||l===NEWLINE||l===FORM_FEED||l===SPACE||l===LESS_THAN||l===AMPERSAND||l===EMPTY||f&&l===f){b+=M,v++;continue}for(C=S=Y+1,d=S,l!==OCTOTHORP?D=NAMED:(l=t(d=++C))===X_LOWER||l===X_UPPER?(D=HEXADECIMAL,d=++C):D=DECIMAL,i=EMPTY,R=EMPTY,N=EMPTY,I=TESTS[D],d--;++d<W&&(l=t(d),I(l));)N+=l,D===NAMED&&own.call(legacy,N)&&(i=N,R=legacy[N]);(a=t(d)===SEMICOLON)&&(d++,D===NAMED&&own.call(characterEntities,N)&&(i=N,R=characterEntities[N])),_=1+d-S,(a||O)&&(N?D===NAMED?(a&&!R?A(NAMED_UNKNOWN,1):(i!==N&&(_=1+(d=C+i.length)-C,a=!1),a||(c=i?NAMED_NOT_TERMINATED:NAMED_EMPTY,e.attribute?(l=t(d))===EQUAL?(A(c,_),R=null):alphanumerical(l)?R=null:A(c,_):A(c,_))),o=R):(a||A(NUMERIC_NOT_TERMINATED,_),isProhibited(o=parseInt(N,BASE[D]))?(A(NUMERIC_PROHIBITED,_),o=REPLACEMENT):o in invalid?(A(NUMERIC_DISALLOWED,_),o=invalid[o]):(T=EMPTY,isWarning(o)&&A(NUMERIC_DISALLOWED,_),o>65535&&(T+=fromCharCode((o-=65536)>>>10|55296),o=56320|1023&o),o=T+fromCharCode(o))):D!==NAMED&&A(NUMERIC_EMPTY,_)),o?(r(),u=n(),Y=d-1,v+=d-S+1,H.push(o),(s=n()).offset++,m&&m.call(p,o,{start:u,end:s},E.slice(S-1,d)),u=s):(N=E.slice(S-1,d),b+=N,v+=N.length,Y=d-1)}return H.join(EMPTY)}function isProhibited(E){return E>=55296&&E<=57343||E>1114111}function isWarning(E){return E>=1&&E<=8||11===E||E>=13&&E<=31||E>=127&&E<=159||E>=64976&&E<=65007||65535==(65535&E)||65534==(65535&E)}var characterEntities=require("character-entities"),legacy=require("character-entities-legacy"),invalid=require("character-reference-invalid"),decimal=require("is-decimal"),hexadecimal=require("is-hexadecimal"),alphanumerical=require("is-alphanumerical");module.exports=wrapper;var own={}.hasOwnProperty,fromCharCode=String.fromCharCode,noop=Function.prototype,REPLACEMENT="�",FORM_FEED="\f",AMPERSAND="&",OCTOTHORP="#",SEMICOLON=";",NEWLINE="\n",X_LOWER="x",X_UPPER="X",SPACE=" ",LESS_THAN="<",EQUAL="=",EMPTY="",TAB="\t",defaults={warning:null,reference:null,text:null,warningContext:null,referenceContext:null,textContext:null,position:{},additional:null,attribute:!1,nonTerminated:!0},NAMED="named",HEXADECIMAL="hexadecimal",DECIMAL="decimal",BASE={};BASE[HEXADECIMAL]=16,BASE[DECIMAL]=10;var TESTS={};TESTS[NAMED]=alphanumerical,TESTS[DECIMAL]=decimal,TESTS[HEXADECIMAL]=hexadecimal;var NAMED_NOT_TERMINATED=1,NUMERIC_NOT_TERMINATED=2,NAMED_EMPTY=3,NUMERIC_EMPTY=4,NAMED_UNKNOWN=5,NUMERIC_DISALLOWED=6,NUMERIC_PROHIBITED=7,NUMERIC_REFERENCE="Numeric character references",NAMED_REFERENCE="Named character references",TERMINATED=" must be terminated by a semicolon",VOID=" cannot be empty",MESSAGES={};MESSAGES[NAMED_NOT_TERMINATED]=NAMED_REFERENCE+TERMINATED,MESSAGES[NUMERIC_NOT_TERMINATED]=NUMERIC_REFERENCE+TERMINATED,MESSAGES[NAMED_EMPTY]=NAMED_REFERENCE+VOID,MESSAGES[NUMERIC_EMPTY]=NUMERIC_REFERENCE+VOID,MESSAGES[NAMED_UNKNOWN]=NAMED_REFERENCE+" must be known",MESSAGES[NUMERIC_DISALLOWED]=NUMERIC_REFERENCE+" cannot be disallowed",MESSAGES[NUMERIC_PROHIBITED]=NUMERIC_REFERENCE+" cannot be outside the permissible Unicode range";

},{"character-entities":8,"character-entities-legacy":7,"character-reference-invalid":9,"is-alphanumerical":45,"is-decimal":47,"is-hexadecimal":49}],114:[function(require,module,exports){
(function (process){
"use strict";function normalizeArray(r,t){for(var e=0,n=r.length-1;n>=0;n--){var s=r[n];"."===s?r.splice(n,1):".."===s?(r.splice(n,1),e++):e&&(r.splice(n,1),e--)}if(t)for(;e--;e)r.unshift("..");return r}function filter(r,t){if(r.filter)return r.filter(t);for(var e=[],n=0;n<r.length;n++)t(r[n],n,r)&&e.push(r[n]);return e}var splitPathRe=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,splitPath=function(r){return splitPathRe.exec(r).slice(1)};exports.resolve=function(){for(var r="",t=!1,e=arguments.length-1;e>=-1&&!t;e--){var n=e>=0?arguments[e]:process.cwd();if("string"!=typeof n)throw new TypeError("Arguments to path.resolve must be strings");n&&(r=n+"/"+r,t="/"===n.charAt(0))}return r=normalizeArray(filter(r.split("/"),function(r){return!!r}),!t).join("/"),(t?"/":"")+r||"."},exports.normalize=function(r){var t=exports.isAbsolute(r),e="/"===substr(r,-1);return(r=normalizeArray(filter(r.split("/"),function(r){return!!r}),!t).join("/"))||t||(r="."),r&&e&&(r+="/"),(t?"/":"")+r},exports.isAbsolute=function(r){return"/"===r.charAt(0)},exports.join=function(){var r=Array.prototype.slice.call(arguments,0);return exports.normalize(filter(r,function(r,t){if("string"!=typeof r)throw new TypeError("Arguments to path.join must be strings");return r}).join("/"))},exports.relative=function(r,t){function e(r){for(var t=0;t<r.length&&""===r[t];t++);for(var e=r.length-1;e>=0&&""===r[e];e--);return t>e?[]:r.slice(t,e-t+1)}r=exports.resolve(r).substr(1),t=exports.resolve(t).substr(1);for(var n=e(r.split("/")),s=e(t.split("/")),i=Math.min(n.length,s.length),o=i,u=0;u<i;u++)if(n[u]!==s[u]){o=u;break}for(var l=[],u=o;u<n.length;u++)l.push("..");return(l=l.concat(s.slice(o))).join("/")},exports.sep="/",exports.delimiter=":",exports.dirname=function(r){var t=splitPath(r),e=t[0],n=t[1];return e||n?(n&&(n=n.substr(0,n.length-1)),e+n):"."},exports.basename=function(r,t){var e=splitPath(r)[2];return t&&e.substr(-1*t.length)===t&&(e=e.substr(0,e.length-t.length)),e},exports.extname=function(r){return splitPath(r)[3]};var substr="b"==="ab".substr(-1)?function(r,t,e){return r.substr(t,e)}:function(r,t,e){return t<0&&(t=r.length+t),r.substr(t,e)};

}).call(this,require('_process'))

},{"_process":115}],115:[function(require,module,exports){
"use strict";function defaultSetTimout(){throw new Error("setTimeout has not been defined")}function defaultClearTimeout(){throw new Error("clearTimeout has not been defined")}function runTimeout(e){if(cachedSetTimeout===setTimeout)return setTimeout(e,0);if((cachedSetTimeout===defaultSetTimout||!cachedSetTimeout)&&setTimeout)return cachedSetTimeout=setTimeout,setTimeout(e,0);try{return cachedSetTimeout(e,0)}catch(t){try{return cachedSetTimeout.call(null,e,0)}catch(t){return cachedSetTimeout.call(this,e,0)}}}function runClearTimeout(e){if(cachedClearTimeout===clearTimeout)return clearTimeout(e);if((cachedClearTimeout===defaultClearTimeout||!cachedClearTimeout)&&clearTimeout)return cachedClearTimeout=clearTimeout,clearTimeout(e);try{return cachedClearTimeout(e)}catch(t){try{return cachedClearTimeout.call(null,e)}catch(t){return cachedClearTimeout.call(this,e)}}}function cleanUpNextTick(){draining&&currentQueue&&(draining=!1,currentQueue.length?queue=currentQueue.concat(queue):queueIndex=-1,queue.length&&drainQueue())}function drainQueue(){if(!draining){var e=runTimeout(cleanUpNextTick);draining=!0;for(var t=queue.length;t;){for(currentQueue=queue,queue=[];++queueIndex<t;)currentQueue&&currentQueue[queueIndex].run();queueIndex=-1,t=queue.length}currentQueue=null,draining=!1,runClearTimeout(e)}}function Item(e,t){this.fun=e,this.array=t}function noop(){}var process=module.exports={},cachedSetTimeout,cachedClearTimeout;!function(){try{cachedSetTimeout="function"==typeof setTimeout?setTimeout:defaultSetTimout}catch(e){cachedSetTimeout=defaultSetTimout}try{cachedClearTimeout="function"==typeof clearTimeout?clearTimeout:defaultClearTimeout}catch(e){cachedClearTimeout=defaultClearTimeout}}();var queue=[],draining=!1,currentQueue,queueIndex=-1;process.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];queue.push(new Item(e,t)),1!==queue.length||draining||runTimeout(drainQueue)},Item.prototype.run=function(){this.fun.apply(null,this.array)},process.title="browser",process.browser=!0,process.env={},process.argv=[],process.version="",process.versions={},process.on=noop,process.addListener=noop,process.once=noop,process.off=noop,process.removeListener=noop,process.removeAllListeners=noop,process.emit=noop,process.prependListener=noop,process.prependOnceListener=noop,process.listeners=function(e){return[]},process.binding=function(e){throw new Error("process.binding is not supported")},process.cwd=function(){return"/"},process.chdir=function(e){throw new Error("process.chdir is not supported")},process.umask=function(){return 0};

},{}],116:[function(require,module,exports){
"use strict";function getPropertyInformation(E){var A=lower(E);return information[propertyToAttributeMapping[A]||A]}function check(E,A){return(E&A)===A}function lower(E){return E.toLowerCase()}module.exports=getPropertyInformation;var USE_ATTRIBUTE=1,USE_PROPERTY=2,BOOLEAN_VALUE=8,NUMERIC_VALUE=16,POSITIVE_NUMERIC_VALUE=48,OVERLOADED_BOOLEAN_VALUE=64,SPACE_SEPARATED=128,COMMA_SEPARATED=256,propertyConfig={abbr:null,accept:COMMA_SEPARATED,acceptCharset:SPACE_SEPARATED,accessKey:SPACE_SEPARATED,action:null,allowFullScreen:USE_ATTRIBUTE|BOOLEAN_VALUE,allowTransparency:USE_ATTRIBUTE,alt:null,as:null,async:BOOLEAN_VALUE,autoComplete:SPACE_SEPARATED,autoFocus:BOOLEAN_VALUE,autoPlay:BOOLEAN_VALUE,capture:USE_ATTRIBUTE|BOOLEAN_VALUE,cellPadding:null,cellSpacing:null,challenge:USE_ATTRIBUTE,charSet:USE_ATTRIBUTE,checked:USE_PROPERTY|BOOLEAN_VALUE,cite:null,className:USE_ATTRIBUTE|SPACE_SEPARATED,cols:USE_ATTRIBUTE|POSITIVE_NUMERIC_VALUE,colSpan:null,command:null,content:null,contentEditable:null,contextMenu:USE_ATTRIBUTE,controls:USE_PROPERTY|BOOLEAN_VALUE,controlsList:SPACE_SEPARATED,coords:NUMERIC_VALUE|COMMA_SEPARATED,crossOrigin:null,data:null,dateTime:USE_ATTRIBUTE,default:BOOLEAN_VALUE,defer:BOOLEAN_VALUE,dir:null,dirName:null,disabled:USE_ATTRIBUTE|BOOLEAN_VALUE,download:OVERLOADED_BOOLEAN_VALUE,draggable:null,dropzone:SPACE_SEPARATED,encType:null,form:USE_ATTRIBUTE,formAction:USE_ATTRIBUTE,formEncType:USE_ATTRIBUTE,formMethod:USE_ATTRIBUTE,formNoValidate:BOOLEAN_VALUE,formTarget:USE_ATTRIBUTE,frameBorder:USE_ATTRIBUTE,headers:SPACE_SEPARATED,height:USE_ATTRIBUTE|POSITIVE_NUMERIC_VALUE,hidden:USE_ATTRIBUTE|BOOLEAN_VALUE,high:NUMERIC_VALUE,href:null,hrefLang:null,htmlFor:SPACE_SEPARATED,httpEquiv:SPACE_SEPARATED,id:USE_PROPERTY,inputMode:USE_ATTRIBUTE,is:USE_ATTRIBUTE,isMap:BOOLEAN_VALUE,keyParams:USE_ATTRIBUTE,keyType:USE_ATTRIBUTE,kind:null,label:null,lang:null,list:USE_ATTRIBUTE,loop:USE_PROPERTY|BOOLEAN_VALUE,low:NUMERIC_VALUE,manifest:USE_ATTRIBUTE,marginHeight:NUMERIC_VALUE,marginWidth:NUMERIC_VALUE,max:null,maxLength:USE_ATTRIBUTE|POSITIVE_NUMERIC_VALUE,media:USE_ATTRIBUTE,mediaGroup:null,menu:null,method:null,min:null,minLength:USE_ATTRIBUTE|POSITIVE_NUMERIC_VALUE,multiple:USE_PROPERTY|BOOLEAN_VALUE,muted:USE_PROPERTY|BOOLEAN_VALUE,name:null,nonce:null,noValidate:BOOLEAN_VALUE,open:BOOLEAN_VALUE,optimum:NUMERIC_VALUE,pattern:null,ping:SPACE_SEPARATED,placeholder:null,playsInline:BOOLEAN_VALUE,poster:null,preload:null,profile:null,radioGroup:null,readOnly:USE_PROPERTY|BOOLEAN_VALUE,referrerPolicy:null,rel:SPACE_SEPARATED|USE_ATTRIBUTE,required:BOOLEAN_VALUE,reversed:BOOLEAN_VALUE,role:USE_ATTRIBUTE,rows:USE_ATTRIBUTE|POSITIVE_NUMERIC_VALUE,rowSpan:POSITIVE_NUMERIC_VALUE,sandbox:SPACE_SEPARATED,scope:null,scoped:BOOLEAN_VALUE,scrolling:null,seamless:USE_ATTRIBUTE|BOOLEAN_VALUE,selected:USE_PROPERTY|BOOLEAN_VALUE,shape:null,size:USE_ATTRIBUTE|POSITIVE_NUMERIC_VALUE,sizes:USE_ATTRIBUTE|SPACE_SEPARATED,slot:null,sortable:BOOLEAN_VALUE,sorted:SPACE_SEPARATED,span:POSITIVE_NUMERIC_VALUE,spellCheck:null,src:null,srcDoc:USE_PROPERTY,srcLang:null,srcSet:USE_ATTRIBUTE|COMMA_SEPARATED,start:NUMERIC_VALUE,step:null,style:null,summary:null,tabIndex:NUMERIC_VALUE,target:null,title:null,translate:null,type:null,typeMustMatch:BOOLEAN_VALUE,useMap:null,value:USE_PROPERTY,volume:POSITIVE_NUMERIC_VALUE,width:USE_ATTRIBUTE|NUMERIC_VALUE,wmode:USE_ATTRIBUTE,wrap:null,autoCapitalize:null,autoCorrect:null,autoSave:null,itemProp:USE_ATTRIBUTE|SPACE_SEPARATED,itemScope:USE_ATTRIBUTE|BOOLEAN_VALUE,itemType:USE_ATTRIBUTE|SPACE_SEPARATED,itemID:USE_ATTRIBUTE,itemRef:USE_ATTRIBUTE|SPACE_SEPARATED,property:null,results:null,security:USE_ATTRIBUTE,unselectable:USE_ATTRIBUTE,xmlLang:USE_ATTRIBUTE,xmlBase:USE_ATTRIBUTE},propertyToAttributeMapping={xmlbase:"xml:base",xmllang:"xml:lang",classname:"class",htmlfor:"for",httpequiv:"http-equiv",acceptcharset:"accept-charset"},information={},property,name,config;getPropertyInformation.all=information;for(property in propertyConfig)name=lower(property),name=propertyToAttributeMapping[name]||name,config=propertyConfig[property],information[name]={name:name,propertyName:property,mustUseAttribute:check(config,USE_ATTRIBUTE),mustUseProperty:check(config,USE_PROPERTY),boolean:check(config,BOOLEAN_VALUE),overloadedBoolean:check(config,OVERLOADED_BOOLEAN_VALUE),numeric:check(config,NUMERIC_VALUE),positiveNumeric:check(config,POSITIVE_NUMERIC_VALUE),commaSeparated:check(config,COMMA_SEPARATED),spaceSeparated:check(config,SPACE_SEPARATED)};

},{}],117:[function(require,module,exports){
(function (global){
"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(e){function o(e){throw new RangeError(E[e])}function n(e,o){for(var n=e.length,t=[];n--;)t[n]=o(e[n]);return t}function t(e,o){var t=e.split("@"),r="";return t.length>1&&(r=t[0]+"@",e=t[1]),r+n((e=e.replace(_,".")).split("."),o).join(".")}function r(e){for(var o,n,t=[],r=0,f=e.length;r<f;)(o=e.charCodeAt(r++))>=55296&&o<=56319&&r<f?56320==(64512&(n=e.charCodeAt(r++)))?t.push(((1023&o)<<10)+(1023&n)+65536):(t.push(o),r--):t.push(o);return t}function f(e){return n(e,function(e){var o="";return e>65535&&(o+=T((e-=65536)>>>10&1023|55296),e=56320|1023&e),o+=T(e)}).join("")}function u(e){return e-48<10?e-22:e-65<26?e-65:e-97<26?e-97:b}function i(e,o){return e+22+75*(e<26)-((0!=o)<<5)}function l(e,o,n){var t=0;for(e=n?O(e/x):e>>1,e+=O(e/o);e>F*m>>1;t+=b)e=O(e/F);return O(t+(F+1)*e/(e+w))}function c(e){var n,t,r,i,c,d,p,s,a,y,h=[],w=e.length,x=0,A=j,I=C;for((t=e.lastIndexOf(S))<0&&(t=0),r=0;r<t;++r)e.charCodeAt(r)>=128&&o("not-basic"),h.push(e.charCodeAt(r));for(i=t>0?t+1:0;i<w;){for(c=x,d=1,p=b;i>=w&&o("invalid-input"),((s=u(e.charCodeAt(i++)))>=b||s>O((v-x)/d))&&o("overflow"),x+=s*d,a=p<=I?g:p>=I+m?m:p-I,!(s<a);p+=b)d>O(v/(y=b-a))&&o("overflow"),d*=y;I=l(x-c,n=h.length+1,0==c),O(x/n)>v-A&&o("overflow"),A+=O(x/n),x%=n,h.splice(x++,0,A)}return f(h)}function d(e){var n,t,f,u,c,d,p,s,a,y,h,w,x,A,I,_=[];for(w=(e=r(e)).length,n=j,t=0,c=C,d=0;d<w;++d)(h=e[d])<128&&_.push(T(h));for(f=u=_.length,u&&_.push(S);f<w;){for(p=v,d=0;d<w;++d)(h=e[d])>=n&&h<p&&(p=h);for(p-n>O((v-t)/(x=f+1))&&o("overflow"),t+=(p-n)*x,n=p,d=0;d<w;++d)if((h=e[d])<n&&++t>v&&o("overflow"),h==n){for(s=t,a=b;y=a<=c?g:a>=c+m?m:a-c,!(s<y);a+=b)I=s-y,A=b-y,_.push(T(i(y+I%A,0))),s=O(I/A);_.push(T(i(s,0))),c=l(t,x,f==u),t=0,++f}++t,++n}return _.join("")}var p="object"==("undefined"==typeof exports?"undefined":_typeof(exports))&&exports&&!exports.nodeType&&exports,s="object"==("undefined"==typeof module?"undefined":_typeof(module))&&module&&!module.nodeType&&module,a="object"==("undefined"==typeof global?"undefined":_typeof(global))&&global;a.global!==a&&a.window!==a&&a.self!==a||(e=a);var y,h,v=2147483647,b=36,g=1,m=26,w=38,x=700,C=72,j=128,S="-",A=/^xn--/,I=/[^\x20-\x7E]/,_=/[\x2E\u3002\uFF0E\uFF61]/g,E={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},F=b-g,O=Math.floor,T=String.fromCharCode;if(y={version:"1.4.1",ucs2:{decode:r,encode:f},decode:c,encode:d,toASCII:function(e){return t(e,function(e){return I.test(e)?"xn--"+d(e):e})},toUnicode:function(e){return t(e,function(e){return A.test(e)?c(e.slice(4).toLowerCase()):e})}},"function"==typeof define&&"object"==_typeof(define.amd)&&define.amd)define("punycode",function(){return y});else if(p&&s)if(module.exports==p)s.exports=y;else for(h in y)y.hasOwnProperty(h)&&(p[h]=y[h]);else e.punycode=y}(void 0);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],118:[function(require,module,exports){
"use strict";function hasOwnProperty(r,e){return Object.prototype.hasOwnProperty.call(r,e)}module.exports=function(r,e,t,n){e=e||"&",t=t||"=";var o={};if("string"!=typeof r||0===r.length)return o;var a=/\+/g;r=r.split(e);var s=1e3;n&&"number"==typeof n.maxKeys&&(s=n.maxKeys);var p=r.length;s>0&&p>s&&(p=s);for(var y=0;y<p;++y){var u,c,i,l,f=r[y].replace(a,"%20"),v=f.indexOf(t);v>=0?(u=f.substr(0,v),c=f.substr(v+1)):(u=f,c=""),i=decodeURIComponent(u),l=decodeURIComponent(c),hasOwnProperty(o,i)?isArray(o[i])?o[i].push(l):o[i]=[o[i],l]:o[i]=l}return o};var isArray=Array.isArray||function(r){return"[object Array]"===Object.prototype.toString.call(r)};

},{}],119:[function(require,module,exports){
"use strict";function map(t,e){if(t.map)return t.map(e);for(var n=[],r=0;r<t.length;r++)n.push(e(t[r],r));return n}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},stringifyPrimitive=function(t){switch(void 0===t?"undefined":_typeof(t)){case"string":return t;case"boolean":return t?"true":"false";case"number":return isFinite(t)?t:"";default:return""}};module.exports=function(t,e,n,r){return e=e||"&",n=n||"=",null===t&&(t=void 0),"object"===(void 0===t?"undefined":_typeof(t))?map(objectKeys(t),function(r){var o=encodeURIComponent(stringifyPrimitive(r))+n;return isArray(t[r])?map(t[r],function(t){return o+encodeURIComponent(stringifyPrimitive(t))}).join(e):o+encodeURIComponent(stringifyPrimitive(t[r]))}).join(e):r?encodeURIComponent(stringifyPrimitive(r))+n+encodeURIComponent(stringifyPrimitive(t)):""};var isArray=Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)},objectKeys=Object.keys||function(t){var e=[];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.push(n);return e};

},{}],120:[function(require,module,exports){
"use strict";exports.decode=exports.parse=require("./decode"),exports.encode=exports.stringify=require("./encode");

},{"./decode":118,"./encode":119}],121:[function(require,module,exports){
"use strict";function parseMathHtml(r){return unified().use(parse,{fragment:!0,position:!1}).parse(r)}function hasClass(r,e){return r.properties.className&&r.properties.className.includes(e)}function isTag(r,e){return r.tagName===e}var visit=require("unist-util-visit"),katex=require("katex"),unified=require("unified"),parse=require("rehype-parse"),position=require("unist-util-position");module.exports=function(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return null==r.throwOnError&&(r.throwOnError=!1),null==r.errorColor&&(r.errorColor="#cc0000"),function(e,i){return visit(e,"element",function(e){var s=isTag(e,"span")&&hasClass(e,"inlineMath"),t=r.inlineMathDoubleDisplay&&hasClass(e,"inlineMathDouble")||isTag(e,"div")&&hasClass(e,"math");if(s||t){var a=void 0;try{a=katex.renderToString(e.children[0].value,{displayMode:t})}catch(s){if(r.throwOnError)throw s;i.message(s.message,position.start(e));try{a=katex.renderToString(e.children[0].value,{displayMode:t,throwOnError:!1,errorColor:r.errorColor})}catch(i){a='<code class="katex" style="color: '+r.errorColor+'">'+e.children[0].value+"</code>"}}var o=parseMathHtml(a).children[0];Object.assign(e.properties,{className:e.properties.className}),e.children=[o]}}),e}};

},{"katex":53,"rehype-parse":122,"unified":219,"unist-util-position":224,"unist-util-visit":227}],122:[function(require,module,exports){
"use strict";function parse(r){var e=xtend(r,this.data("settings")),s="boolean"!=typeof e.position||e.position,t=new Parser5({locationInfo:s});this.Parser=function(r,s){var a=e.fragment?"parseFragment":"parse";return fromParse5(t[a](String(s)),{file:s,verbose:e.verbose})}}var fromParse5=require("hast-util-from-parse5"),Parser5=require("parse5/lib/parser"),xtend=require("xtend");module.exports=parse;

},{"hast-util-from-parse5":18,"parse5/lib/parser":131,"xtend":237}],123:[function(require,module,exports){
"use strict";function enquoteDoctypeId(t){var e=-1!==t.indexOf('"')?"'":'"';return e+t+e}var VALID_DOCTYPE_NAME="html",QUIRKS_MODE_SYSTEM_ID="http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd",QUIRKS_MODE_PUBLIC_ID_PREFIXES=["+//silmaril//dtd html pro v0r11 19970101//en","-//advasoft ltd//dtd html 3.0 aswedit + extensions//en","-//as//dtd html 3.0 aswedit + extensions//en","-//ietf//dtd html 2.0 level 1//en","-//ietf//dtd html 2.0 level 2//en","-//ietf//dtd html 2.0 strict level 1//en","-//ietf//dtd html 2.0 strict level 2//en","-//ietf//dtd html 2.0 strict//en","-//ietf//dtd html 2.0//en","-//ietf//dtd html 2.1e//en","-//ietf//dtd html 3.0//en","-//ietf//dtd html 3.0//en//","-//ietf//dtd html 3.2 final//en","-//ietf//dtd html 3.2//en","-//ietf//dtd html 3//en","-//ietf//dtd html level 0//en","-//ietf//dtd html level 0//en//2.0","-//ietf//dtd html level 1//en","-//ietf//dtd html level 1//en//2.0","-//ietf//dtd html level 2//en","-//ietf//dtd html level 2//en//2.0","-//ietf//dtd html level 3//en","-//ietf//dtd html level 3//en//3.0","-//ietf//dtd html strict level 0//en","-//ietf//dtd html strict level 0//en//2.0","-//ietf//dtd html strict level 1//en","-//ietf//dtd html strict level 1//en//2.0","-//ietf//dtd html strict level 2//en","-//ietf//dtd html strict level 2//en//2.0","-//ietf//dtd html strict level 3//en","-//ietf//dtd html strict level 3//en//3.0","-//ietf//dtd html strict//en","-//ietf//dtd html strict//en//2.0","-//ietf//dtd html strict//en//3.0","-//ietf//dtd html//en","-//ietf//dtd html//en//2.0","-//ietf//dtd html//en//3.0","-//metrius//dtd metrius presentational//en","-//microsoft//dtd internet explorer 2.0 html strict//en","-//microsoft//dtd internet explorer 2.0 html//en","-//microsoft//dtd internet explorer 2.0 tables//en","-//microsoft//dtd internet explorer 3.0 html strict//en","-//microsoft//dtd internet explorer 3.0 html//en","-//microsoft//dtd internet explorer 3.0 tables//en","-//netscape comm. corp.//dtd html//en","-//netscape comm. corp.//dtd strict html//en","-//o'reilly and associates//dtd html 2.0//en","-//o'reilly and associates//dtd html extended 1.0//en","-//spyglass//dtd html 2.0 extended//en","-//sq//dtd html 2.0 hotmetal + extensions//en","-//sun microsystems corp.//dtd hotjava html//en","-//sun microsystems corp.//dtd hotjava strict html//en","-//w3c//dtd html 3 1995-03-24//en","-//w3c//dtd html 3.2 draft//en","-//w3c//dtd html 3.2 final//en","-//w3c//dtd html 3.2//en","-//w3c//dtd html 3.2s draft//en","-//w3c//dtd html 4.0 frameset//en","-//w3c//dtd html 4.0 transitional//en","-//w3c//dtd html experimental 19960712//en","-//w3c//dtd html experimental 970421//en","-//w3c//dtd w3 html//en","-//w3o//dtd w3 html 3.0//en","-//w3o//dtd w3 html 3.0//en//","-//webtechs//dtd mozilla html 2.0//en","-//webtechs//dtd mozilla html//en"],QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES=["-//w3c//dtd html 4.01 frameset//","-//w3c//dtd html 4.01 transitional//"],QUIRKS_MODE_PUBLIC_IDS=["-//w3o//dtd w3 html strict 3.0//en//","-/w3c/dtd html 4.0 transitional/en","html"];exports.isQuirks=function(t,e,d){if(t!==VALID_DOCTYPE_NAME)return!0;if(d&&d.toLowerCase()===QUIRKS_MODE_SYSTEM_ID)return!0;if(null!==e){if(e=e.toLowerCase(),QUIRKS_MODE_PUBLIC_IDS.indexOf(e)>-1)return!0;var l=QUIRKS_MODE_PUBLIC_ID_PREFIXES;null===d&&(l=l.concat(QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES));for(var n=0;n<l.length;n++)if(0===e.indexOf(l[n]))return!0}return!1},exports.serializeContent=function(t,e,d){var l="!DOCTYPE ";return t&&(l+=t),null!==e?l+=" PUBLIC "+enquoteDoctypeId(e):null!==d&&(l+=" SYSTEM"),null!==d&&(l+=" "+enquoteDoctypeId(d)),l};

},{}],124:[function(require,module,exports){
"use strict";function isMathMLTextIntegrationPoint(e,t){return t===NS.MATHML&&(e===$.MI||e===$.MO||e===$.MN||e===$.MS||e===$.MTEXT)}function isHtmlIntegrationPoint(e,t,n){if(t===NS.MATHML&&e===$.ANNOTATION_XML)for(var a=0;a<n.length;a++)if(n[a].name===ATTRS.ENCODING){var T=n[a].value.toLowerCase();return T===MIME_TYPES.TEXT_HTML||T===MIME_TYPES.APPLICATION_XML}return t===NS.SVG&&(e===$.FOREIGN_OBJECT||e===$.DESC||e===$.TITLE)}var Tokenizer=require("../tokenizer"),HTML=require("./html"),$=HTML.TAG_NAMES,NS=HTML.NAMESPACES,ATTRS=HTML.ATTRS,MIME_TYPES={TEXT_HTML:"text/html",APPLICATION_XML:"application/xhtml+xml"},DEFINITION_URL_ATTR="definitionurl",ADJUSTED_DEFINITION_URL_ATTR="definitionURL",SVG_ATTRS_ADJUSTMENT_MAP={attributename:"attributeName",attributetype:"attributeType",basefrequency:"baseFrequency",baseprofile:"baseProfile",calcmode:"calcMode",clippathunits:"clipPathUnits",diffuseconstant:"diffuseConstant",edgemode:"edgeMode",filterunits:"filterUnits",glyphref:"glyphRef",gradienttransform:"gradientTransform",gradientunits:"gradientUnits",kernelmatrix:"kernelMatrix",kernelunitlength:"kernelUnitLength",keypoints:"keyPoints",keysplines:"keySplines",keytimes:"keyTimes",lengthadjust:"lengthAdjust",limitingconeangle:"limitingConeAngle",markerheight:"markerHeight",markerunits:"markerUnits",markerwidth:"markerWidth",maskcontentunits:"maskContentUnits",maskunits:"maskUnits",numoctaves:"numOctaves",pathlength:"pathLength",patterncontentunits:"patternContentUnits",patterntransform:"patternTransform",patternunits:"patternUnits",pointsatx:"pointsAtX",pointsaty:"pointsAtY",pointsatz:"pointsAtZ",preservealpha:"preserveAlpha",preserveaspectratio:"preserveAspectRatio",primitiveunits:"primitiveUnits",refx:"refX",refy:"refY",repeatcount:"repeatCount",repeatdur:"repeatDur",requiredextensions:"requiredExtensions",requiredfeatures:"requiredFeatures",specularconstant:"specularConstant",specularexponent:"specularExponent",spreadmethod:"spreadMethod",startoffset:"startOffset",stddeviation:"stdDeviation",stitchtiles:"stitchTiles",surfacescale:"surfaceScale",systemlanguage:"systemLanguage",tablevalues:"tableValues",targetx:"targetX",targety:"targetY",textlength:"textLength",viewbox:"viewBox",viewtarget:"viewTarget",xchannelselector:"xChannelSelector",ychannelselector:"yChannelSelector",zoomandpan:"zoomAndPan"},XML_ATTRS_ADJUSTMENT_MAP={"xlink:actuate":{prefix:"xlink",name:"actuate",namespace:NS.XLINK},"xlink:arcrole":{prefix:"xlink",name:"arcrole",namespace:NS.XLINK},"xlink:href":{prefix:"xlink",name:"href",namespace:NS.XLINK},"xlink:role":{prefix:"xlink",name:"role",namespace:NS.XLINK},"xlink:show":{prefix:"xlink",name:"show",namespace:NS.XLINK},"xlink:title":{prefix:"xlink",name:"title",namespace:NS.XLINK},"xlink:type":{prefix:"xlink",name:"type",namespace:NS.XLINK},"xml:base":{prefix:"xml",name:"base",namespace:NS.XML},"xml:lang":{prefix:"xml",name:"lang",namespace:NS.XML},"xml:space":{prefix:"xml",name:"space",namespace:NS.XML},xmlns:{prefix:"",name:"xmlns",namespace:NS.XMLNS},"xmlns:xlink":{prefix:"xmlns",name:"xlink",namespace:NS.XMLNS}},SVG_TAG_NAMES_ADJUSTMENT_MAP=exports.SVG_TAG_NAMES_ADJUSTMENT_MAP={altglyph:"altGlyph",altglyphdef:"altGlyphDef",altglyphitem:"altGlyphItem",animatecolor:"animateColor",animatemotion:"animateMotion",animatetransform:"animateTransform",clippath:"clipPath",feblend:"feBlend",fecolormatrix:"feColorMatrix",fecomponenttransfer:"feComponentTransfer",fecomposite:"feComposite",feconvolvematrix:"feConvolveMatrix",fediffuselighting:"feDiffuseLighting",fedisplacementmap:"feDisplacementMap",fedistantlight:"feDistantLight",feflood:"feFlood",fefunca:"feFuncA",fefuncb:"feFuncB",fefuncg:"feFuncG",fefuncr:"feFuncR",fegaussianblur:"feGaussianBlur",feimage:"feImage",femerge:"feMerge",femergenode:"feMergeNode",femorphology:"feMorphology",feoffset:"feOffset",fepointlight:"fePointLight",fespecularlighting:"feSpecularLighting",fespotlight:"feSpotLight",fetile:"feTile",feturbulence:"feTurbulence",foreignobject:"foreignObject",glyphref:"glyphRef",lineargradient:"linearGradient",radialgradient:"radialGradient",textpath:"textPath"},EXITS_FOREIGN_CONTENT={};EXITS_FOREIGN_CONTENT[$.B]=!0,EXITS_FOREIGN_CONTENT[$.BIG]=!0,EXITS_FOREIGN_CONTENT[$.BLOCKQUOTE]=!0,EXITS_FOREIGN_CONTENT[$.BODY]=!0,EXITS_FOREIGN_CONTENT[$.BR]=!0,EXITS_FOREIGN_CONTENT[$.CENTER]=!0,EXITS_FOREIGN_CONTENT[$.CODE]=!0,EXITS_FOREIGN_CONTENT[$.DD]=!0,EXITS_FOREIGN_CONTENT[$.DIV]=!0,EXITS_FOREIGN_CONTENT[$.DL]=!0,EXITS_FOREIGN_CONTENT[$.DT]=!0,EXITS_FOREIGN_CONTENT[$.EM]=!0,EXITS_FOREIGN_CONTENT[$.EMBED]=!0,EXITS_FOREIGN_CONTENT[$.H1]=!0,EXITS_FOREIGN_CONTENT[$.H2]=!0,EXITS_FOREIGN_CONTENT[$.H3]=!0,EXITS_FOREIGN_CONTENT[$.H4]=!0,EXITS_FOREIGN_CONTENT[$.H5]=!0,EXITS_FOREIGN_CONTENT[$.H6]=!0,EXITS_FOREIGN_CONTENT[$.HEAD]=!0,EXITS_FOREIGN_CONTENT[$.HR]=!0,EXITS_FOREIGN_CONTENT[$.I]=!0,EXITS_FOREIGN_CONTENT[$.IMG]=!0,EXITS_FOREIGN_CONTENT[$.LI]=!0,EXITS_FOREIGN_CONTENT[$.LISTING]=!0,EXITS_FOREIGN_CONTENT[$.MENU]=!0,EXITS_FOREIGN_CONTENT[$.META]=!0,EXITS_FOREIGN_CONTENT[$.NOBR]=!0,EXITS_FOREIGN_CONTENT[$.OL]=!0,EXITS_FOREIGN_CONTENT[$.P]=!0,EXITS_FOREIGN_CONTENT[$.PRE]=!0,EXITS_FOREIGN_CONTENT[$.RUBY]=!0,EXITS_FOREIGN_CONTENT[$.S]=!0,EXITS_FOREIGN_CONTENT[$.SMALL]=!0,EXITS_FOREIGN_CONTENT[$.SPAN]=!0,EXITS_FOREIGN_CONTENT[$.STRONG]=!0,EXITS_FOREIGN_CONTENT[$.STRIKE]=!0,EXITS_FOREIGN_CONTENT[$.SUB]=!0,EXITS_FOREIGN_CONTENT[$.SUP]=!0,EXITS_FOREIGN_CONTENT[$.TABLE]=!0,EXITS_FOREIGN_CONTENT[$.TT]=!0,EXITS_FOREIGN_CONTENT[$.U]=!0,EXITS_FOREIGN_CONTENT[$.UL]=!0,EXITS_FOREIGN_CONTENT[$.VAR]=!0,exports.causesExit=function(e){var t=e.tagName;return!!(t===$.FONT&&(null!==Tokenizer.getTokenAttr(e,ATTRS.COLOR)||null!==Tokenizer.getTokenAttr(e,ATTRS.SIZE)||null!==Tokenizer.getTokenAttr(e,ATTRS.FACE)))||EXITS_FOREIGN_CONTENT[t]},exports.adjustTokenMathMLAttrs=function(e){for(var t=0;t<e.attrs.length;t++)if(e.attrs[t].name===DEFINITION_URL_ATTR){e.attrs[t].name=ADJUSTED_DEFINITION_URL_ATTR;break}},exports.adjustTokenSVGAttrs=function(e){for(var t=0;t<e.attrs.length;t++){var n=SVG_ATTRS_ADJUSTMENT_MAP[e.attrs[t].name];n&&(e.attrs[t].name=n)}},exports.adjustTokenXMLAttrs=function(e){for(var t=0;t<e.attrs.length;t++){var n=XML_ATTRS_ADJUSTMENT_MAP[e.attrs[t].name];n&&(e.attrs[t].prefix=n.prefix,e.attrs[t].name=n.name,e.attrs[t].namespace=n.namespace)}},exports.adjustTokenSVGTagName=function(e){var t=SVG_TAG_NAMES_ADJUSTMENT_MAP[e.tagName];t&&(e.tagName=t)},exports.isIntegrationPoint=function(e,t,n,a){return!(a&&a!==NS.HTML||!isHtmlIntegrationPoint(e,t,n))||!(a&&a!==NS.MATHML||!isMathMLTextIntegrationPoint(e,t))};

},{"../tokenizer":133,"./html":125}],125:[function(require,module,exports){
"use strict";var NS=exports.NAMESPACES={HTML:"http://www.w3.org/1999/xhtml",MATHML:"http://www.w3.org/1998/Math/MathML",SVG:"http://www.w3.org/2000/svg",XLINK:"http://www.w3.org/1999/xlink",XML:"http://www.w3.org/XML/1998/namespace",XMLNS:"http://www.w3.org/2000/xmlns/"};exports.ATTRS={TYPE:"type",ACTION:"action",ENCODING:"encoding",PROMPT:"prompt",NAME:"name",COLOR:"color",FACE:"face",SIZE:"size"};var $=exports.TAG_NAMES={A:"a",ADDRESS:"address",ANNOTATION_XML:"annotation-xml",APPLET:"applet",AREA:"area",ARTICLE:"article",ASIDE:"aside",B:"b",BASE:"base",BASEFONT:"basefont",BGSOUND:"bgsound",BIG:"big",BLOCKQUOTE:"blockquote",BODY:"body",BR:"br",BUTTON:"button",CAPTION:"caption",CENTER:"center",CODE:"code",COL:"col",COLGROUP:"colgroup",DD:"dd",DESC:"desc",DETAILS:"details",DIALOG:"dialog",DIR:"dir",DIV:"div",DL:"dl",DT:"dt",EM:"em",EMBED:"embed",FIELDSET:"fieldset",FIGCAPTION:"figcaption",FIGURE:"figure",FONT:"font",FOOTER:"footer",FOREIGN_OBJECT:"foreignObject",FORM:"form",FRAME:"frame",FRAMESET:"frameset",H1:"h1",H2:"h2",H3:"h3",H4:"h4",H5:"h5",H6:"h6",HEAD:"head",HEADER:"header",HGROUP:"hgroup",HR:"hr",HTML:"html",I:"i",IMG:"img",IMAGE:"image",INPUT:"input",IFRAME:"iframe",KEYGEN:"keygen",LABEL:"label",LI:"li",LINK:"link",LISTING:"listing",MAIN:"main",MALIGNMARK:"malignmark",MARQUEE:"marquee",MATH:"math",MENU:"menu",MENUITEM:"menuitem",META:"meta",MGLYPH:"mglyph",MI:"mi",MO:"mo",MN:"mn",MS:"ms",MTEXT:"mtext",NAV:"nav",NOBR:"nobr",NOFRAMES:"noframes",NOEMBED:"noembed",NOSCRIPT:"noscript",OBJECT:"object",OL:"ol",OPTGROUP:"optgroup",OPTION:"option",P:"p",PARAM:"param",PLAINTEXT:"plaintext",PRE:"pre",RB:"rb",RP:"rp",RT:"rt",RTC:"rtc",RUBY:"ruby",S:"s",SCRIPT:"script",SECTION:"section",SELECT:"select",SOURCE:"source",SMALL:"small",SPAN:"span",STRIKE:"strike",STRONG:"strong",STYLE:"style",SUB:"sub",SUMMARY:"summary",SUP:"sup",TABLE:"table",TBODY:"tbody",TEMPLATE:"template",TEXTAREA:"textarea",TFOOT:"tfoot",TD:"td",TH:"th",THEAD:"thead",TITLE:"title",TR:"tr",TRACK:"track",TT:"tt",U:"u",UL:"ul",SVG:"svg",VAR:"var",WBR:"wbr",XMP:"xmp"},SPECIAL_ELEMENTS=exports.SPECIAL_ELEMENTS={};SPECIAL_ELEMENTS[NS.HTML]={},SPECIAL_ELEMENTS[NS.HTML][$.ADDRESS]=!0,SPECIAL_ELEMENTS[NS.HTML][$.APPLET]=!0,SPECIAL_ELEMENTS[NS.HTML][$.AREA]=!0,SPECIAL_ELEMENTS[NS.HTML][$.ARTICLE]=!0,SPECIAL_ELEMENTS[NS.HTML][$.ASIDE]=!0,SPECIAL_ELEMENTS[NS.HTML][$.BASE]=!0,SPECIAL_ELEMENTS[NS.HTML][$.BASEFONT]=!0,SPECIAL_ELEMENTS[NS.HTML][$.BGSOUND]=!0,SPECIAL_ELEMENTS[NS.HTML][$.BLOCKQUOTE]=!0,SPECIAL_ELEMENTS[NS.HTML][$.BODY]=!0,SPECIAL_ELEMENTS[NS.HTML][$.BR]=!0,SPECIAL_ELEMENTS[NS.HTML][$.BUTTON]=!0,SPECIAL_ELEMENTS[NS.HTML][$.CAPTION]=!0,SPECIAL_ELEMENTS[NS.HTML][$.CENTER]=!0,SPECIAL_ELEMENTS[NS.HTML][$.COL]=!0,SPECIAL_ELEMENTS[NS.HTML][$.COLGROUP]=!0,SPECIAL_ELEMENTS[NS.HTML][$.DD]=!0,SPECIAL_ELEMENTS[NS.HTML][$.DETAILS]=!0,SPECIAL_ELEMENTS[NS.HTML][$.DIR]=!0,SPECIAL_ELEMENTS[NS.HTML][$.DIV]=!0,SPECIAL_ELEMENTS[NS.HTML][$.DL]=!0,SPECIAL_ELEMENTS[NS.HTML][$.DT]=!0,SPECIAL_ELEMENTS[NS.HTML][$.EMBED]=!0,SPECIAL_ELEMENTS[NS.HTML][$.FIELDSET]=!0,SPECIAL_ELEMENTS[NS.HTML][$.FIGCAPTION]=!0,SPECIAL_ELEMENTS[NS.HTML][$.FIGURE]=!0,SPECIAL_ELEMENTS[NS.HTML][$.FOOTER]=!0,SPECIAL_ELEMENTS[NS.HTML][$.FORM]=!0,SPECIAL_ELEMENTS[NS.HTML][$.FRAME]=!0,SPECIAL_ELEMENTS[NS.HTML][$.FRAMESET]=!0,SPECIAL_ELEMENTS[NS.HTML][$.H1]=!0,SPECIAL_ELEMENTS[NS.HTML][$.H2]=!0,SPECIAL_ELEMENTS[NS.HTML][$.H3]=!0,SPECIAL_ELEMENTS[NS.HTML][$.H4]=!0,SPECIAL_ELEMENTS[NS.HTML][$.H5]=!0,SPECIAL_ELEMENTS[NS.HTML][$.H6]=!0,SPECIAL_ELEMENTS[NS.HTML][$.HEAD]=!0,SPECIAL_ELEMENTS[NS.HTML][$.HEADER]=!0,SPECIAL_ELEMENTS[NS.HTML][$.HGROUP]=!0,SPECIAL_ELEMENTS[NS.HTML][$.HR]=!0,SPECIAL_ELEMENTS[NS.HTML][$.HTML]=!0,SPECIAL_ELEMENTS[NS.HTML][$.IFRAME]=!0,SPECIAL_ELEMENTS[NS.HTML][$.IMG]=!0,SPECIAL_ELEMENTS[NS.HTML][$.INPUT]=!0,SPECIAL_ELEMENTS[NS.HTML][$.LI]=!0,SPECIAL_ELEMENTS[NS.HTML][$.LINK]=!0,SPECIAL_ELEMENTS[NS.HTML][$.LISTING]=!0,SPECIAL_ELEMENTS[NS.HTML][$.MAIN]=!0,SPECIAL_ELEMENTS[NS.HTML][$.MARQUEE]=!0,SPECIAL_ELEMENTS[NS.HTML][$.MENU]=!0,SPECIAL_ELEMENTS[NS.HTML][$.META]=!0,SPECIAL_ELEMENTS[NS.HTML][$.NAV]=!0,SPECIAL_ELEMENTS[NS.HTML][$.NOEMBED]=!0,SPECIAL_ELEMENTS[NS.HTML][$.NOFRAMES]=!0,SPECIAL_ELEMENTS[NS.HTML][$.NOSCRIPT]=!0,SPECIAL_ELEMENTS[NS.HTML][$.OBJECT]=!0,SPECIAL_ELEMENTS[NS.HTML][$.OL]=!0,SPECIAL_ELEMENTS[NS.HTML][$.P]=!0,SPECIAL_ELEMENTS[NS.HTML][$.PARAM]=!0,SPECIAL_ELEMENTS[NS.HTML][$.PLAINTEXT]=!0,SPECIAL_ELEMENTS[NS.HTML][$.PRE]=!0,SPECIAL_ELEMENTS[NS.HTML][$.SCRIPT]=!0,SPECIAL_ELEMENTS[NS.HTML][$.SECTION]=!0,SPECIAL_ELEMENTS[NS.HTML][$.SELECT]=!0,SPECIAL_ELEMENTS[NS.HTML][$.SOURCE]=!0,SPECIAL_ELEMENTS[NS.HTML][$.STYLE]=!0,SPECIAL_ELEMENTS[NS.HTML][$.SUMMARY]=!0,SPECIAL_ELEMENTS[NS.HTML][$.TABLE]=!0,SPECIAL_ELEMENTS[NS.HTML][$.TBODY]=!0,SPECIAL_ELEMENTS[NS.HTML][$.TD]=!0,SPECIAL_ELEMENTS[NS.HTML][$.TEMPLATE]=!0,SPECIAL_ELEMENTS[NS.HTML][$.TEXTAREA]=!0,SPECIAL_ELEMENTS[NS.HTML][$.TFOOT]=!0,SPECIAL_ELEMENTS[NS.HTML][$.TH]=!0,SPECIAL_ELEMENTS[NS.HTML][$.THEAD]=!0,SPECIAL_ELEMENTS[NS.HTML][$.TITLE]=!0,SPECIAL_ELEMENTS[NS.HTML][$.TR]=!0,SPECIAL_ELEMENTS[NS.HTML][$.TRACK]=!0,SPECIAL_ELEMENTS[NS.HTML][$.UL]=!0,SPECIAL_ELEMENTS[NS.HTML][$.WBR]=!0,SPECIAL_ELEMENTS[NS.HTML][$.XMP]=!0,SPECIAL_ELEMENTS[NS.MATHML]={},SPECIAL_ELEMENTS[NS.MATHML][$.MI]=!0,SPECIAL_ELEMENTS[NS.MATHML][$.MO]=!0,SPECIAL_ELEMENTS[NS.MATHML][$.MN]=!0,SPECIAL_ELEMENTS[NS.MATHML][$.MS]=!0,SPECIAL_ELEMENTS[NS.MATHML][$.MTEXT]=!0,SPECIAL_ELEMENTS[NS.MATHML][$.ANNOTATION_XML]=!0,SPECIAL_ELEMENTS[NS.SVG]={},SPECIAL_ELEMENTS[NS.SVG][$.TITLE]=!0,SPECIAL_ELEMENTS[NS.SVG][$.FOREIGN_OBJECT]=!0,SPECIAL_ELEMENTS[NS.SVG][$.DESC]=!0;

},{}],126:[function(require,module,exports){
"use strict";module.exports=function(e,t){return t=t||{},[e,t].reduce(function(e,t){return Object.keys(t).forEach(function(n){e[n]=t[n]}),e},{})};

},{}],127:[function(require,module,exports){
"use strict";exports.REPLACEMENT_CHARACTER="�",exports.CODE_POINTS={EOF:-1,NULL:0,TABULATION:9,CARRIAGE_RETURN:13,LINE_FEED:10,FORM_FEED:12,SPACE:32,EXCLAMATION_MARK:33,QUOTATION_MARK:34,NUMBER_SIGN:35,AMPERSAND:38,APOSTROPHE:39,HYPHEN_MINUS:45,SOLIDUS:47,DIGIT_0:48,DIGIT_9:57,SEMICOLON:59,LESS_THAN_SIGN:60,EQUALS_SIGN:61,GREATER_THAN_SIGN:62,QUESTION_MARK:63,LATIN_CAPITAL_A:65,LATIN_CAPITAL_F:70,LATIN_CAPITAL_X:88,LATIN_CAPITAL_Z:90,GRAVE_ACCENT:96,LATIN_SMALL_A:97,LATIN_SMALL_F:102,LATIN_SMALL_X:120,LATIN_SMALL_Z:122,REPLACEMENT_CHARACTER:65533},exports.CODE_POINT_SEQUENCES={DASH_DASH_STRING:[45,45],DOCTYPE_STRING:[68,79,67,84,89,80,69],CDATA_START_STRING:[91,67,68,65,84,65,91],CDATA_END_STRING:[93,93,62],SCRIPT_STRING:[115,99,114,105,112,116],PUBLIC_STRING:[80,85,66,76,73,67],SYSTEM_STRING:[83,89,83,84,69,77]};

},{}],128:[function(require,module,exports){
"use strict";function setEndLocation(t,e,n){var o=t.__location;if(o&&(o.startTag||(o.startTag={line:o.line,col:o.col,startOffset:o.startOffset,endOffset:o.endOffset},o.attrs&&(o.startTag.attrs=o.attrs)),e.location)){var l=e.location,a=n.getTagName(t),s=e.type===Tokenizer.END_TAG_TOKEN&&a===e.tagName;s&&(o.endTag={line:l.line,col:l.col,startOffset:l.startOffset,endOffset:l.endOffset}),o.endOffset=s?l.endOffset:l.startOffset}}var OpenElementStack=require("../parser/open_element_stack"),Tokenizer=require("../tokenizer"),HTML=require("../common/html"),$=HTML.TAG_NAMES;exports.assign=function(t){var e=Object.getPrototypeOf(t),n=t.treeAdapter,o=null,l=null,a=null;t._bootstrap=function(s,i){e._bootstrap.call(this,s,i),o=null,l=null,a=null,t.openElements.pop=function(){setEndLocation(this.current,a,n),OpenElementStack.prototype.pop.call(this)},t.openElements.popAllUpToHtmlElement=function(){for(var t=this.stackTop;t>0;t--)setEndLocation(this.items[t],a,n);OpenElementStack.prototype.popAllUpToHtmlElement.call(this)},t.openElements.remove=function(t){setEndLocation(t,a,n),OpenElementStack.prototype.remove.call(this,t)}},t._processTokenInForeignContent=function(t){a=t,e._processTokenInForeignContent.call(this,t)},t._processToken=function(t){if(a=t,e._processToken.call(this,t),t.type===Tokenizer.END_TAG_TOKEN&&(t.tagName===$.HTML||t.tagName===$.BODY&&this.openElements.hasInScope($.BODY)))for(var o=this.openElements.stackTop;o>=0;o--){var l=this.openElements.items[o];if(this.treeAdapter.getTagName(l)===t.tagName){setEndLocation(l,t,n);break}}},t._setDocumentType=function(t){e._setDocumentType.call(this,t);for(var n=this.treeAdapter.getChildNodes(this.document),o=n.length,l=0;l<o;l++){var a=n[l];if(this.treeAdapter.isDocumentTypeNode(a)){a.__location=t.location;break}}},t._attachElementToTree=function(t){t.__location=o||null,o=null,e._attachElementToTree.call(this,t)},t._appendElement=function(t,n){o=t.location,e._appendElement.call(this,t,n)},t._insertElement=function(t,n){o=t.location,e._insertElement.call(this,t,n)},t._insertTemplate=function(t){o=t.location,e._insertTemplate.call(this,t),this.treeAdapter.getTemplateContent(this.openElements.current).__location=null},t._insertFakeRootElement=function(){e._insertFakeRootElement.call(this),this.openElements.current.__location=null},t._appendCommentNode=function(t,n){e._appendCommentNode.call(this,t,n);var o=this.treeAdapter.getChildNodes(n);o[o.length-1].__location=t.location},t._findFosterParentingLocation=function(){return l=e._findFosterParentingLocation.call(this)},t._insertCharacters=function(t){e._insertCharacters.call(this,t);var n=this._shouldFosterParentOnInsertion(),o=n&&l.parent||this.openElements.currentTmplContent||this.openElements.current,a=this.treeAdapter.getChildNodes(o),s=a[n&&l.beforeElement?a.indexOf(l.beforeElement)-1:a.length-1];s.__location?s.__location.endOffset=t.location.endOffset:s.__location=t.location}};

},{"../common/html":125,"../parser/open_element_stack":132,"../tokenizer":133}],129:[function(require,module,exports){
"use strict";var UNICODE=require("../common/unicode"),$=UNICODE.CODE_POINTS;exports.assign=function(t){function e(t){t.location={line:c,col:n,startOffset:o,endOffset:-1}}var r=Object.getPrototypeOf(t),o=-1,n=-1,c=1,s=!1,a=[0],i=0,u=-1,h=1;t._consume=function(){var t=r._consume.call(this);return s&&(s=!1,h++,a.push(this.preprocessor.sourcePos),i=this.preprocessor.sourcePos),t===$.LINE_FEED&&(s=!0),u=this.preprocessor.sourcePos-i+1,t},t._unconsume=function(){for(r._unconsume.call(this),s=!1;i>this.preprocessor.sourcePos&&a.length>1;)i=a.pop(),h--;u=this.preprocessor.sourcePos-i+1},t._createStartTagToken=function(){r._createStartTagToken.call(this),e(this.currentToken)},t._createEndTagToken=function(){r._createEndTagToken.call(this),e(this.currentToken)},t._createCommentToken=function(){r._createCommentToken.call(this),e(this.currentToken)},t._createDoctypeToken=function(t){r._createDoctypeToken.call(this,t),e(this.currentToken)},t._createCharacterToken=function(t,o){r._createCharacterToken.call(this,t,o),e(this.currentCharacterToken)},t._createAttr=function(t){r._createAttr.call(this,t),this.currentAttrLocation={line:h,col:u,startOffset:this.preprocessor.sourcePos,endOffset:-1}},t._leaveAttrName=function(t){r._leaveAttrName.call(this,t),this._attachCurrentAttrLocationInfo()},t._leaveAttrValue=function(t){r._leaveAttrValue.call(this,t),this._attachCurrentAttrLocationInfo()},t._attachCurrentAttrLocationInfo=function(){this.currentAttrLocation.endOffset=this.preprocessor.sourcePos,this.currentToken.location.attrs||(this.currentToken.location.attrs={}),this.currentToken.location.attrs[this.currentAttr.name]=this.currentAttrLocation},t._emitCurrentToken=function(){this.currentCharacterToken&&(this.currentCharacterToken.location.endOffset=this.currentToken.location.startOffset),this.currentToken.location.endOffset=this.preprocessor.sourcePos+1,r._emitCurrentToken.call(this)},t._emitCurrentCharacterToken=function(){this.currentCharacterToken&&-1===this.currentCharacterToken.location.endOffset&&(this.currentCharacterToken.location.endOffset=this.preprocessor.sourcePos),r._emitCurrentCharacterToken.call(this)},Object.keys(r.MODE).map(function(t){return r.MODE[t]}).forEach(function(e){t[e]=function(t){o=this.preprocessor.sourcePos,c=h,n=u,r[e].call(this,t)}})};

},{"../common/unicode":127}],130:[function(require,module,exports){
"use strict";var NOAH_ARK_CAPACITY=3,FormattingElementList=module.exports=function(t){this.length=0,this.entries=[],this.treeAdapter=t,this.bookmark=null};FormattingElementList.MARKER_ENTRY="MARKER_ENTRY",FormattingElementList.ELEMENT_ENTRY="ELEMENT_ENTRY",FormattingElementList.prototype._getNoahArkConditionCandidates=function(t){var e=[];if(this.length>=NOAH_ARK_CAPACITY)for(var n=this.treeAdapter.getAttrList(t).length,i=this.treeAdapter.getTagName(t),r=this.treeAdapter.getNamespaceURI(t),s=this.length-1;s>=0;s--){var o=this.entries[s];if(o.type===FormattingElementList.MARKER_ENTRY)break;var a=o.element,h=this.treeAdapter.getAttrList(a);this.treeAdapter.getTagName(a)===i&&this.treeAdapter.getNamespaceURI(a)===r&&h.length===n&&e.push({idx:s,attrs:h})}return e.length<NOAH_ARK_CAPACITY?[]:e},FormattingElementList.prototype._ensureNoahArkCondition=function(t){var e=this._getNoahArkConditionCandidates(t),n=e.length;if(n){for(var i=this.treeAdapter.getAttrList(t),r=i.length,s={},o=0;o<r;o++){var a=i[o];s[a.name]=a.value}for(o=0;o<r;o++)for(var h=0;h<n;h++){var l=e[h].attrs[o];if(s[l.name]!==l.value&&(e.splice(h,1),n--),e.length<NOAH_ARK_CAPACITY)return}for(o=n-1;o>=NOAH_ARK_CAPACITY-1;o--)this.entries.splice(e[o].idx,1),this.length--}},FormattingElementList.prototype.insertMarker=function(){this.entries.push({type:FormattingElementList.MARKER_ENTRY}),this.length++},FormattingElementList.prototype.pushElement=function(t,e){this._ensureNoahArkCondition(t),this.entries.push({type:FormattingElementList.ELEMENT_ENTRY,element:t,token:e}),this.length++},FormattingElementList.prototype.insertElementAfterBookmark=function(t,e){for(var n=this.length-1;n>=0&&this.entries[n]!==this.bookmark;n--);this.entries.splice(n+1,0,{type:FormattingElementList.ELEMENT_ENTRY,element:t,token:e}),this.length++},FormattingElementList.prototype.removeEntry=function(t){for(var e=this.length-1;e>=0;e--)if(this.entries[e]===t){this.entries.splice(e,1),this.length--;break}},FormattingElementList.prototype.clearToLastMarker=function(){for(;this.length;){var t=this.entries.pop();if(this.length--,t.type===FormattingElementList.MARKER_ENTRY)break}},FormattingElementList.prototype.getElementEntryInScopeWithTagName=function(t){for(var e=this.length-1;e>=0;e--){var n=this.entries[e];if(n.type===FormattingElementList.MARKER_ENTRY)return null;if(this.treeAdapter.getTagName(n.element)===t)return n}return null},FormattingElementList.prototype.getElementEntry=function(t){for(var e=this.length-1;e>=0;e--){var n=this.entries[e];if(n.type===FormattingElementList.ELEMENT_ENTRY&&n.element===t)return n}return null};

},{}],131:[function(require,module,exports){
"use strict";function aaObtainFormattingElementEntry(e,t){var n=e.activeFormattingElements.getElementEntryInScopeWithTagName(t.tagName);return n?e.openElements.contains(n.element)?e.openElements.hasInScope(t.tagName)||(n=null):(e.activeFormattingElements.removeEntry(n),n=null):genericEndTagInBody(e,t),n}function aaObtainFurthestBlock(e,t){for(var n=null,T=e.openElements.stackTop;T>=0;T--){var o=e.openElements.items[T];if(o===t.element)break;e._isSpecialElement(o)&&(n=o)}return n||(e.openElements.popUntilElementPopped(t.element),e.activeFormattingElements.removeEntry(t)),n}function aaInnerLoop(e,t,n){for(var T=t,o=e.openElements.getCommonAncestor(t),E=0,r=o;r!==n;E++,r=o){o=e.openElements.getCommonAncestor(r);var a=e.activeFormattingElements.getElementEntry(r),_=a&&E>=AA_INNER_LOOP_ITER;!a||_?(_&&e.activeFormattingElements.removeEntry(a),e.openElements.remove(r)):(r=aaRecreateElementFromEntry(e,a),T===t&&(e.activeFormattingElements.bookmark=a),e.treeAdapter.detachNode(T),e.treeAdapter.appendChild(r,T),T=r)}return T}function aaRecreateElementFromEntry(e,t){var n=e.treeAdapter.getNamespaceURI(t.element),T=e.treeAdapter.createElement(t.token.tagName,n,t.token.attrs);return e.openElements.replace(t.element,T),t.element=T,T}function aaInsertLastNodeInCommonAncestor(e,t,n){if(e._isElementCausesFosterParenting(t))e._fosterParentElement(n);else{var T=e.treeAdapter.getTagName(t),o=e.treeAdapter.getNamespaceURI(t);T===$.TEMPLATE&&o===NS.HTML&&(t=e.treeAdapter.getTemplateContent(t)),e.treeAdapter.appendChild(t,n)}}function aaReplaceFormattingElement(e,t,n){var T=e.treeAdapter.getNamespaceURI(n.element),o=n.token,E=e.treeAdapter.createElement(o.tagName,T,o.attrs);e._adoptNodes(t,E),e.treeAdapter.appendChild(t,E),e.activeFormattingElements.insertElementAfterBookmark(E,n.token),e.activeFormattingElements.removeEntry(n),e.openElements.remove(n.element),e.openElements.insertAfter(t,E)}function callAdoptionAgency(e,t){for(var n,T=0;T<AA_OUTER_LOOP_ITER&&(n=aaObtainFormattingElementEntry(e,t,n));T++){var o=aaObtainFurthestBlock(e,n);if(!o)break;e.activeFormattingElements.bookmark=n;var E=aaInnerLoop(e,o,n.element),r=e.openElements.getCommonAncestor(n.element);e.treeAdapter.detachNode(E),aaInsertLastNodeInCommonAncestor(e,r,E),aaReplaceFormattingElement(e,o,n)}}function ignoreToken(){}function appendComment(e,t){e._appendCommentNode(t,e.openElements.currentTmplContent||e.openElements.current)}function appendCommentToRootHtmlElement(e,t){e._appendCommentNode(t,e.openElements.items[0])}function appendCommentToDocument(e,t){e._appendCommentNode(t,e.document)}function insertCharacters(e,t){e._insertCharacters(t)}function stopParsing(e){e.stopped=!0}function doctypeInInitialMode(e,t){e._setDocumentType(t),(t.forceQuirks||doctype.isQuirks(t.name,t.publicId,t.systemId))&&e.treeAdapter.setQuirksMode(e.document),e.insertionMode=BEFORE_HTML_MODE}function tokenInInitialMode(e,t){e.treeAdapter.setQuirksMode(e.document),e.insertionMode=BEFORE_HTML_MODE,e._processToken(t)}function startTagBeforeHtml(e,t){t.tagName===$.HTML?(e._insertElement(t,NS.HTML),e.insertionMode=BEFORE_HEAD_MODE):tokenBeforeHtml(e,t)}function endTagBeforeHtml(e,t){var n=t.tagName;n!==$.HTML&&n!==$.HEAD&&n!==$.BODY&&n!==$.BR||tokenBeforeHtml(e,t)}function tokenBeforeHtml(e,t){e._insertFakeRootElement(),e.insertionMode=BEFORE_HEAD_MODE,e._processToken(t)}function startTagBeforeHead(e,t){var n=t.tagName;n===$.HTML?startTagInBody(e,t):n===$.HEAD?(e._insertElement(t,NS.HTML),e.headElement=e.openElements.current,e.insertionMode=IN_HEAD_MODE):tokenBeforeHead(e,t)}function endTagBeforeHead(e,t){var n=t.tagName;n!==$.HEAD&&n!==$.BODY&&n!==$.HTML&&n!==$.BR||tokenBeforeHead(e,t)}function tokenBeforeHead(e,t){e._insertFakeElement($.HEAD),e.headElement=e.openElements.current,e.insertionMode=IN_HEAD_MODE,e._processToken(t)}function startTagInHead(e,t){var n=t.tagName;n===$.HTML?startTagInBody(e,t):n===$.BASE||n===$.BASEFONT||n===$.BGSOUND||n===$.LINK||n===$.META?e._appendElement(t,NS.HTML):n===$.TITLE?e._switchToTextParsing(t,Tokenizer.MODE.RCDATA):n===$.NOSCRIPT||n===$.NOFRAMES||n===$.STYLE?e._switchToTextParsing(t,Tokenizer.MODE.RAWTEXT):n===$.SCRIPT?e._switchToTextParsing(t,Tokenizer.MODE.SCRIPT_DATA):n===$.TEMPLATE?(e._insertTemplate(t,NS.HTML),e.activeFormattingElements.insertMarker(),e.framesetOk=!1,e.insertionMode=IN_TEMPLATE_MODE,e._pushTmplInsertionMode(IN_TEMPLATE_MODE)):n!==$.HEAD&&tokenInHead(e,t)}function endTagInHead(e,t){var n=t.tagName;n===$.HEAD?(e.openElements.pop(),e.insertionMode=AFTER_HEAD_MODE):n===$.BODY||n===$.BR||n===$.HTML?tokenInHead(e,t):n===$.TEMPLATE&&e.openElements.tmplCount>0&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped($.TEMPLATE),e.activeFormattingElements.clearToLastMarker(),e._popTmplInsertionMode(),e._resetInsertionMode())}function tokenInHead(e,t){e.openElements.pop(),e.insertionMode=AFTER_HEAD_MODE,e._processToken(t)}function startTagAfterHead(e,t){var n=t.tagName;n===$.HTML?startTagInBody(e,t):n===$.BODY?(e._insertElement(t,NS.HTML),e.framesetOk=!1,e.insertionMode=IN_BODY_MODE):n===$.FRAMESET?(e._insertElement(t,NS.HTML),e.insertionMode=IN_FRAMESET_MODE):n===$.BASE||n===$.BASEFONT||n===$.BGSOUND||n===$.LINK||n===$.META||n===$.NOFRAMES||n===$.SCRIPT||n===$.STYLE||n===$.TEMPLATE||n===$.TITLE?(e.openElements.push(e.headElement),startTagInHead(e,t),e.openElements.remove(e.headElement)):n!==$.HEAD&&tokenAfterHead(e,t)}function endTagAfterHead(e,t){var n=t.tagName;n===$.BODY||n===$.HTML||n===$.BR?tokenAfterHead(e,t):n===$.TEMPLATE&&endTagInHead(e,t)}function tokenAfterHead(e,t){e._insertFakeElement($.BODY),e.insertionMode=IN_BODY_MODE,e._processToken(t)}function whitespaceCharacterInBody(e,t){e._reconstructActiveFormattingElements(),e._insertCharacters(t)}function characterInBody(e,t){e._reconstructActiveFormattingElements(),e._insertCharacters(t),e.framesetOk=!1}function htmlStartTagInBody(e,t){0===e.openElements.tmplCount&&e.treeAdapter.adoptAttributes(e.openElements.items[0],t.attrs)}function bodyStartTagInBody(e,t){var n=e.openElements.tryPeekProperlyNestedBodyElement();n&&0===e.openElements.tmplCount&&(e.framesetOk=!1,e.treeAdapter.adoptAttributes(n,t.attrs))}function framesetStartTagInBody(e,t){var n=e.openElements.tryPeekProperlyNestedBodyElement();e.framesetOk&&n&&(e.treeAdapter.detachNode(n),e.openElements.popAllUpToHtmlElement(),e._insertElement(t,NS.HTML),e.insertionMode=IN_FRAMESET_MODE)}function addressStartTagInBody(e,t){e.openElements.hasInButtonScope($.P)&&e._closePElement(),e._insertElement(t,NS.HTML)}function numberedHeaderStartTagInBody(e,t){e.openElements.hasInButtonScope($.P)&&e._closePElement();var n=e.openElements.currentTagName;n!==$.H1&&n!==$.H2&&n!==$.H3&&n!==$.H4&&n!==$.H5&&n!==$.H6||e.openElements.pop(),e._insertElement(t,NS.HTML)}function preStartTagInBody(e,t){e.openElements.hasInButtonScope($.P)&&e._closePElement(),e._insertElement(t,NS.HTML),e.skipNextNewLine=!0,e.framesetOk=!1}function formStartTagInBody(e,t){var n=e.openElements.tmplCount>0;e.formElement&&!n||(e.openElements.hasInButtonScope($.P)&&e._closePElement(),e._insertElement(t,NS.HTML),n||(e.formElement=e.openElements.current))}function listItemStartTagInBody(e,t){e.framesetOk=!1;for(var n=t.tagName,T=e.openElements.stackTop;T>=0;T--){var o=e.openElements.items[T],E=e.treeAdapter.getTagName(o),r=null;if(n===$.LI&&E===$.LI?r=$.LI:n!==$.DD&&n!==$.DT||E!==$.DD&&E!==$.DT||(r=E),r){e.openElements.generateImpliedEndTagsWithExclusion(r),e.openElements.popUntilTagNamePopped(r);break}if(E!==$.ADDRESS&&E!==$.DIV&&E!==$.P&&e._isSpecialElement(o))break}e.openElements.hasInButtonScope($.P)&&e._closePElement(),e._insertElement(t,NS.HTML)}function plaintextStartTagInBody(e,t){e.openElements.hasInButtonScope($.P)&&e._closePElement(),e._insertElement(t,NS.HTML),e.tokenizer.state=Tokenizer.MODE.PLAINTEXT}function buttonStartTagInBody(e,t){e.openElements.hasInScope($.BUTTON)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped($.BUTTON)),e._reconstructActiveFormattingElements(),e._insertElement(t,NS.HTML),e.framesetOk=!1}function aStartTagInBody(e,t){var n=e.activeFormattingElements.getElementEntryInScopeWithTagName($.A);n&&(callAdoptionAgency(e,t),e.openElements.remove(n.element),e.activeFormattingElements.removeEntry(n)),e._reconstructActiveFormattingElements(),e._insertElement(t,NS.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t)}function bStartTagInBody(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,NS.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t)}function nobrStartTagInBody(e,t){e._reconstructActiveFormattingElements(),e.openElements.hasInScope($.NOBR)&&(callAdoptionAgency(e,t),e._reconstructActiveFormattingElements()),e._insertElement(t,NS.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t)}function appletStartTagInBody(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,NS.HTML),e.activeFormattingElements.insertMarker(),e.framesetOk=!1}function tableStartTagInBody(e,t){!e.treeAdapter.isQuirksMode(e.document)&&e.openElements.hasInButtonScope($.P)&&e._closePElement(),e._insertElement(t,NS.HTML),e.framesetOk=!1,e.insertionMode=IN_TABLE_MODE}function areaStartTagInBody(e,t){e._reconstructActiveFormattingElements(),e._appendElement(t,NS.HTML),e.framesetOk=!1}function inputStartTagInBody(e,t){e._reconstructActiveFormattingElements(),e._appendElement(t,NS.HTML);var n=Tokenizer.getTokenAttr(t,ATTRS.TYPE);n&&n.toLowerCase()===HIDDEN_INPUT_TYPE||(e.framesetOk=!1)}function paramStartTagInBody(e,t){e._appendElement(t,NS.HTML)}function hrStartTagInBody(e,t){e.openElements.hasInButtonScope($.P)&&e._closePElement(),e.openElements.currentTagName===$.MENUITEM&&e.openElements.pop(),e._appendElement(t,NS.HTML),e.framesetOk=!1}function imageStartTagInBody(e,t){t.tagName=$.IMG,areaStartTagInBody(e,t)}function textareaStartTagInBody(e,t){e._insertElement(t,NS.HTML),e.skipNextNewLine=!0,e.tokenizer.state=Tokenizer.MODE.RCDATA,e.originalInsertionMode=e.insertionMode,e.framesetOk=!1,e.insertionMode=TEXT_MODE}function xmpStartTagInBody(e,t){e.openElements.hasInButtonScope($.P)&&e._closePElement(),e._reconstructActiveFormattingElements(),e.framesetOk=!1,e._switchToTextParsing(t,Tokenizer.MODE.RAWTEXT)}function iframeStartTagInBody(e,t){e.framesetOk=!1,e._switchToTextParsing(t,Tokenizer.MODE.RAWTEXT)}function noembedStartTagInBody(e,t){e._switchToTextParsing(t,Tokenizer.MODE.RAWTEXT)}function selectStartTagInBody(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,NS.HTML),e.framesetOk=!1,e.insertionMode===IN_TABLE_MODE||e.insertionMode===IN_CAPTION_MODE||e.insertionMode===IN_TABLE_BODY_MODE||e.insertionMode===IN_ROW_MODE||e.insertionMode===IN_CELL_MODE?e.insertionMode=IN_SELECT_IN_TABLE_MODE:e.insertionMode=IN_SELECT_MODE}function optgroupStartTagInBody(e,t){e.openElements.currentTagName===$.OPTION&&e.openElements.pop(),e._reconstructActiveFormattingElements(),e._insertElement(t,NS.HTML)}function rbStartTagInBody(e,t){e.openElements.hasInScope($.RUBY)&&e.openElements.generateImpliedEndTags(),e._insertElement(t,NS.HTML)}function rtStartTagInBody(e,t){e.openElements.hasInScope($.RUBY)&&e.openElements.generateImpliedEndTagsWithExclusion($.RTC),e._insertElement(t,NS.HTML)}function menuitemStartTagInBody(e,t){e.openElements.currentTagName===$.MENUITEM&&e.openElements.pop(),e._reconstructActiveFormattingElements(),e._insertElement(t,NS.HTML)}function menuStartTagInBody(e,t){e.openElements.hasInButtonScope($.P)&&e._closePElement(),e.openElements.currentTagName===$.MENUITEM&&e.openElements.pop(),e._insertElement(t,NS.HTML)}function mathStartTagInBody(e,t){e._reconstructActiveFormattingElements(),foreignContent.adjustTokenMathMLAttrs(t),foreignContent.adjustTokenXMLAttrs(t),t.selfClosing?e._appendElement(t,NS.MATHML):e._insertElement(t,NS.MATHML)}function svgStartTagInBody(e,t){e._reconstructActiveFormattingElements(),foreignContent.adjustTokenSVGAttrs(t),foreignContent.adjustTokenXMLAttrs(t),t.selfClosing?e._appendElement(t,NS.SVG):e._insertElement(t,NS.SVG)}function genericStartTagInBody(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,NS.HTML)}function startTagInBody(e,t){var n=t.tagName;switch(n.length){case 1:n===$.I||n===$.S||n===$.B||n===$.U?bStartTagInBody(e,t):n===$.P?addressStartTagInBody(e,t):n===$.A?aStartTagInBody(e,t):genericStartTagInBody(e,t);break;case 2:n===$.DL||n===$.OL||n===$.UL?addressStartTagInBody(e,t):n===$.H1||n===$.H2||n===$.H3||n===$.H4||n===$.H5||n===$.H6?numberedHeaderStartTagInBody(e,t):n===$.LI||n===$.DD||n===$.DT?listItemStartTagInBody(e,t):n===$.EM||n===$.TT?bStartTagInBody(e,t):n===$.BR?areaStartTagInBody(e,t):n===$.HR?hrStartTagInBody(e,t):n===$.RB?rbStartTagInBody(e,t):n===$.RT||n===$.RP?rtStartTagInBody(e,t):n!==$.TH&&n!==$.TD&&n!==$.TR&&genericStartTagInBody(e,t);break;case 3:n===$.DIV||n===$.DIR||n===$.NAV?addressStartTagInBody(e,t):n===$.PRE?preStartTagInBody(e,t):n===$.BIG?bStartTagInBody(e,t):n===$.IMG||n===$.WBR?areaStartTagInBody(e,t):n===$.XMP?xmpStartTagInBody(e,t):n===$.SVG?svgStartTagInBody(e,t):n===$.RTC?rbStartTagInBody(e,t):n!==$.COL&&genericStartTagInBody(e,t);break;case 4:n===$.HTML?htmlStartTagInBody(e,t):n===$.BASE||n===$.LINK||n===$.META?startTagInHead(e,t):n===$.BODY?bodyStartTagInBody(e,t):n===$.MAIN?addressStartTagInBody(e,t):n===$.FORM?formStartTagInBody(e,t):n===$.CODE||n===$.FONT?bStartTagInBody(e,t):n===$.NOBR?nobrStartTagInBody(e,t):n===$.AREA?areaStartTagInBody(e,t):n===$.MATH?mathStartTagInBody(e,t):n===$.MENU?menuStartTagInBody(e,t):n!==$.HEAD&&genericStartTagInBody(e,t);break;case 5:n===$.STYLE||n===$.TITLE?startTagInHead(e,t):n===$.ASIDE?addressStartTagInBody(e,t):n===$.SMALL?bStartTagInBody(e,t):n===$.TABLE?tableStartTagInBody(e,t):n===$.EMBED?areaStartTagInBody(e,t):n===$.INPUT?inputStartTagInBody(e,t):n===$.PARAM||n===$.TRACK?paramStartTagInBody(e,t):n===$.IMAGE?imageStartTagInBody(e,t):n!==$.FRAME&&n!==$.TBODY&&n!==$.TFOOT&&n!==$.THEAD&&genericStartTagInBody(e,t);break;case 6:n===$.SCRIPT?startTagInHead(e,t):n===$.CENTER||n===$.FIGURE||n===$.FOOTER||n===$.HEADER||n===$.HGROUP?addressStartTagInBody(e,t):n===$.BUTTON?buttonStartTagInBody(e,t):n===$.STRIKE||n===$.STRONG?bStartTagInBody(e,t):n===$.APPLET||n===$.OBJECT?appletStartTagInBody(e,t):n===$.KEYGEN?areaStartTagInBody(e,t):n===$.SOURCE?paramStartTagInBody(e,t):n===$.IFRAME?iframeStartTagInBody(e,t):n===$.SELECT?selectStartTagInBody(e,t):n===$.OPTION?optgroupStartTagInBody(e,t):genericStartTagInBody(e,t);break;case 7:n===$.BGSOUND?startTagInHead(e,t):n===$.DETAILS||n===$.ADDRESS||n===$.ARTICLE||n===$.SECTION||n===$.SUMMARY?addressStartTagInBody(e,t):n===$.LISTING?preStartTagInBody(e,t):n===$.MARQUEE?appletStartTagInBody(e,t):n===$.NOEMBED?noembedStartTagInBody(e,t):n!==$.CAPTION&&genericStartTagInBody(e,t);break;case 8:n===$.BASEFONT?startTagInHead(e,t):n===$.MENUITEM?menuitemStartTagInBody(e,t):n===$.FRAMESET?framesetStartTagInBody(e,t):n===$.FIELDSET?addressStartTagInBody(e,t):n===$.TEXTAREA?textareaStartTagInBody(e,t):n===$.TEMPLATE?startTagInHead(e,t):n===$.NOSCRIPT?noembedStartTagInBody(e,t):n===$.OPTGROUP?optgroupStartTagInBody(e,t):n!==$.COLGROUP&&genericStartTagInBody(e,t);break;case 9:n===$.PLAINTEXT?plaintextStartTagInBody(e,t):genericStartTagInBody(e,t);break;case 10:n===$.BLOCKQUOTE||n===$.FIGCAPTION?addressStartTagInBody(e,t):genericStartTagInBody(e,t);break;default:genericStartTagInBody(e,t)}}function bodyEndTagInBody(e){e.openElements.hasInScope($.BODY)&&(e.insertionMode=AFTER_BODY_MODE)}function htmlEndTagInBody(e,t){e.openElements.hasInScope($.BODY)&&(e.insertionMode=AFTER_BODY_MODE,e._processToken(t))}function addressEndTagInBody(e,t){var n=t.tagName;e.openElements.hasInScope(n)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(n))}function formEndTagInBody(e){var t=e.openElements.tmplCount>0,n=e.formElement;t||(e.formElement=null),(n||t)&&e.openElements.hasInScope($.FORM)&&(e.openElements.generateImpliedEndTags(),t?e.openElements.popUntilTagNamePopped($.FORM):e.openElements.remove(n))}function pEndTagInBody(e){e.openElements.hasInButtonScope($.P)||e._insertFakeElement($.P),e._closePElement()}function liEndTagInBody(e){e.openElements.hasInListItemScope($.LI)&&(e.openElements.generateImpliedEndTagsWithExclusion($.LI),e.openElements.popUntilTagNamePopped($.LI))}function ddEndTagInBody(e,t){var n=t.tagName;e.openElements.hasInScope(n)&&(e.openElements.generateImpliedEndTagsWithExclusion(n),e.openElements.popUntilTagNamePopped(n))}function numberedHeaderEndTagInBody(e){e.openElements.hasNumberedHeaderInScope()&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilNumberedHeaderPopped())}function appletEndTagInBody(e,t){var n=t.tagName;e.openElements.hasInScope(n)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(n),e.activeFormattingElements.clearToLastMarker())}function brEndTagInBody(e){e._reconstructActiveFormattingElements(),e._insertFakeElement($.BR),e.openElements.pop(),e.framesetOk=!1}function genericEndTagInBody(e,t){for(var n=t.tagName,T=e.openElements.stackTop;T>0;T--){var o=e.openElements.items[T];if(e.treeAdapter.getTagName(o)===n){e.openElements.generateImpliedEndTagsWithExclusion(n),e.openElements.popUntilElementPopped(o);break}if(e._isSpecialElement(o))break}}function endTagInBody(e,t){var n=t.tagName;switch(n.length){case 1:n===$.A||n===$.B||n===$.I||n===$.S||n===$.U?callAdoptionAgency(e,t):n===$.P?pEndTagInBody(e,t):genericEndTagInBody(e,t);break;case 2:n===$.DL||n===$.UL||n===$.OL?addressEndTagInBody(e,t):n===$.LI?liEndTagInBody(e,t):n===$.DD||n===$.DT?ddEndTagInBody(e,t):n===$.H1||n===$.H2||n===$.H3||n===$.H4||n===$.H5||n===$.H6?numberedHeaderEndTagInBody(e,t):n===$.BR?brEndTagInBody(e,t):n===$.EM||n===$.TT?callAdoptionAgency(e,t):genericEndTagInBody(e,t);break;case 3:n===$.BIG?callAdoptionAgency(e,t):n===$.DIR||n===$.DIV||n===$.NAV?addressEndTagInBody(e,t):genericEndTagInBody(e,t);break;case 4:n===$.BODY?bodyEndTagInBody(e,t):n===$.HTML?htmlEndTagInBody(e,t):n===$.FORM?formEndTagInBody(e,t):n===$.CODE||n===$.FONT||n===$.NOBR?callAdoptionAgency(e,t):n===$.MAIN||n===$.MENU?addressEndTagInBody(e,t):genericEndTagInBody(e,t);break;case 5:n===$.ASIDE?addressEndTagInBody(e,t):n===$.SMALL?callAdoptionAgency(e,t):genericEndTagInBody(e,t);break;case 6:n===$.CENTER||n===$.FIGURE||n===$.FOOTER||n===$.HEADER||n===$.HGROUP?addressEndTagInBody(e,t):n===$.APPLET||n===$.OBJECT?appletEndTagInBody(e,t):n===$.STRIKE||n===$.STRONG?callAdoptionAgency(e,t):genericEndTagInBody(e,t);break;case 7:n===$.ADDRESS||n===$.ARTICLE||n===$.DETAILS||n===$.SECTION||n===$.SUMMARY?addressEndTagInBody(e,t):n===$.MARQUEE?appletEndTagInBody(e,t):genericEndTagInBody(e,t);break;case 8:n===$.FIELDSET?addressEndTagInBody(e,t):n===$.TEMPLATE?endTagInHead(e,t):genericEndTagInBody(e,t);break;case 10:n===$.BLOCKQUOTE||n===$.FIGCAPTION?addressEndTagInBody(e,t):genericEndTagInBody(e,t);break;default:genericEndTagInBody(e,t)}}function eofInBody(e,t){e.tmplInsertionModeStackTop>-1?eofInTemplate(e,t):e.stopped=!0}function endTagInText(e,t){t.tagName===$.SCRIPT&&(e.pendingScript=e.openElements.current),e.openElements.pop(),e.insertionMode=e.originalInsertionMode}function eofInText(e,t){e.openElements.pop(),e.insertionMode=e.originalInsertionMode,e._processToken(t)}function characterInTable(e,t){var n=e.openElements.currentTagName;n===$.TABLE||n===$.TBODY||n===$.TFOOT||n===$.THEAD||n===$.TR?(e.pendingCharacterTokens=[],e.hasNonWhitespacePendingCharacterToken=!1,e.originalInsertionMode=e.insertionMode,e.insertionMode=IN_TABLE_TEXT_MODE,e._processToken(t)):tokenInTable(e,t)}function captionStartTagInTable(e,t){e.openElements.clearBackToTableContext(),e.activeFormattingElements.insertMarker(),e._insertElement(t,NS.HTML),e.insertionMode=IN_CAPTION_MODE}function colgroupStartTagInTable(e,t){e.openElements.clearBackToTableContext(),e._insertElement(t,NS.HTML),e.insertionMode=IN_COLUMN_GROUP_MODE}function colStartTagInTable(e,t){e.openElements.clearBackToTableContext(),e._insertFakeElement($.COLGROUP),e.insertionMode=IN_COLUMN_GROUP_MODE,e._processToken(t)}function tbodyStartTagInTable(e,t){e.openElements.clearBackToTableContext(),e._insertElement(t,NS.HTML),e.insertionMode=IN_TABLE_BODY_MODE}function tdStartTagInTable(e,t){e.openElements.clearBackToTableContext(),e._insertFakeElement($.TBODY),e.insertionMode=IN_TABLE_BODY_MODE,e._processToken(t)}function tableStartTagInTable(e,t){e.openElements.hasInTableScope($.TABLE)&&(e.openElements.popUntilTagNamePopped($.TABLE),e._resetInsertionMode(),e._processToken(t))}function inputStartTagInTable(e,t){var n=Tokenizer.getTokenAttr(t,ATTRS.TYPE);n&&n.toLowerCase()===HIDDEN_INPUT_TYPE?e._appendElement(t,NS.HTML):tokenInTable(e,t)}function formStartTagInTable(e,t){e.formElement||0!==e.openElements.tmplCount||(e._insertElement(t,NS.HTML),e.formElement=e.openElements.current,e.openElements.pop())}function startTagInTable(e,t){var n=t.tagName;switch(n.length){case 2:n===$.TD||n===$.TH||n===$.TR?tdStartTagInTable(e,t):tokenInTable(e,t);break;case 3:n===$.COL?colStartTagInTable(e,t):tokenInTable(e,t);break;case 4:n===$.FORM?formStartTagInTable(e,t):tokenInTable(e,t);break;case 5:n===$.TABLE?tableStartTagInTable(e,t):n===$.STYLE?startTagInHead(e,t):n===$.TBODY||n===$.TFOOT||n===$.THEAD?tbodyStartTagInTable(e,t):n===$.INPUT?inputStartTagInTable(e,t):tokenInTable(e,t);break;case 6:n===$.SCRIPT?startTagInHead(e,t):tokenInTable(e,t);break;case 7:n===$.CAPTION?captionStartTagInTable(e,t):tokenInTable(e,t);break;case 8:n===$.COLGROUP?colgroupStartTagInTable(e,t):n===$.TEMPLATE?startTagInHead(e,t):tokenInTable(e,t);break;default:tokenInTable(e,t)}}function endTagInTable(e,t){var n=t.tagName;n===$.TABLE?e.openElements.hasInTableScope($.TABLE)&&(e.openElements.popUntilTagNamePopped($.TABLE),e._resetInsertionMode()):n===$.TEMPLATE?endTagInHead(e,t):n!==$.BODY&&n!==$.CAPTION&&n!==$.COL&&n!==$.COLGROUP&&n!==$.HTML&&n!==$.TBODY&&n!==$.TD&&n!==$.TFOOT&&n!==$.TH&&n!==$.THEAD&&n!==$.TR&&tokenInTable(e,t)}function tokenInTable(e,t){var n=e.fosterParentingEnabled;e.fosterParentingEnabled=!0,e._processTokenInBodyMode(t),e.fosterParentingEnabled=n}function whitespaceCharacterInTableText(e,t){e.pendingCharacterTokens.push(t)}function characterInTableText(e,t){e.pendingCharacterTokens.push(t),e.hasNonWhitespacePendingCharacterToken=!0}function tokenInTableText(e,t){var n=0;if(e.hasNonWhitespacePendingCharacterToken)for(;n<e.pendingCharacterTokens.length;n++)tokenInTable(e,e.pendingCharacterTokens[n]);else for(;n<e.pendingCharacterTokens.length;n++)e._insertCharacters(e.pendingCharacterTokens[n]);e.insertionMode=e.originalInsertionMode,e._processToken(t)}function startTagInCaption(e,t){var n=t.tagName;n===$.CAPTION||n===$.COL||n===$.COLGROUP||n===$.TBODY||n===$.TD||n===$.TFOOT||n===$.TH||n===$.THEAD||n===$.TR?e.openElements.hasInTableScope($.CAPTION)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped($.CAPTION),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=IN_TABLE_MODE,e._processToken(t)):startTagInBody(e,t)}function endTagInCaption(e,t){var n=t.tagName;n===$.CAPTION||n===$.TABLE?e.openElements.hasInTableScope($.CAPTION)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped($.CAPTION),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=IN_TABLE_MODE,n===$.TABLE&&e._processToken(t)):n!==$.BODY&&n!==$.COL&&n!==$.COLGROUP&&n!==$.HTML&&n!==$.TBODY&&n!==$.TD&&n!==$.TFOOT&&n!==$.TH&&n!==$.THEAD&&n!==$.TR&&endTagInBody(e,t)}function startTagInColumnGroup(e,t){var n=t.tagName;n===$.HTML?startTagInBody(e,t):n===$.COL?e._appendElement(t,NS.HTML):n===$.TEMPLATE?startTagInHead(e,t):tokenInColumnGroup(e,t)}function endTagInColumnGroup(e,t){var n=t.tagName;n===$.COLGROUP?e.openElements.currentTagName===$.COLGROUP&&(e.openElements.pop(),e.insertionMode=IN_TABLE_MODE):n===$.TEMPLATE?endTagInHead(e,t):n!==$.COL&&tokenInColumnGroup(e,t)}function tokenInColumnGroup(e,t){e.openElements.currentTagName===$.COLGROUP&&(e.openElements.pop(),e.insertionMode=IN_TABLE_MODE,e._processToken(t))}function startTagInTableBody(e,t){var n=t.tagName;n===$.TR?(e.openElements.clearBackToTableBodyContext(),e._insertElement(t,NS.HTML),e.insertionMode=IN_ROW_MODE):n===$.TH||n===$.TD?(e.openElements.clearBackToTableBodyContext(),e._insertFakeElement($.TR),e.insertionMode=IN_ROW_MODE,e._processToken(t)):n===$.CAPTION||n===$.COL||n===$.COLGROUP||n===$.TBODY||n===$.TFOOT||n===$.THEAD?e.openElements.hasTableBodyContextInTableScope()&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=IN_TABLE_MODE,e._processToken(t)):startTagInTable(e,t)}function endTagInTableBody(e,t){var n=t.tagName;n===$.TBODY||n===$.TFOOT||n===$.THEAD?e.openElements.hasInTableScope(n)&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=IN_TABLE_MODE):n===$.TABLE?e.openElements.hasTableBodyContextInTableScope()&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=IN_TABLE_MODE,e._processToken(t)):(n!==$.BODY&&n!==$.CAPTION&&n!==$.COL&&n!==$.COLGROUP||n!==$.HTML&&n!==$.TD&&n!==$.TH&&n!==$.TR)&&endTagInTable(e,t)}function startTagInRow(e,t){var n=t.tagName;n===$.TH||n===$.TD?(e.openElements.clearBackToTableRowContext(),e._insertElement(t,NS.HTML),e.insertionMode=IN_CELL_MODE,e.activeFormattingElements.insertMarker()):n===$.CAPTION||n===$.COL||n===$.COLGROUP||n===$.TBODY||n===$.TFOOT||n===$.THEAD||n===$.TR?e.openElements.hasInTableScope($.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=IN_TABLE_BODY_MODE,e._processToken(t)):startTagInTable(e,t)}function endTagInRow(e,t){var n=t.tagName;n===$.TR?e.openElements.hasInTableScope($.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=IN_TABLE_BODY_MODE):n===$.TABLE?e.openElements.hasInTableScope($.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=IN_TABLE_BODY_MODE,e._processToken(t)):n===$.TBODY||n===$.TFOOT||n===$.THEAD?(e.openElements.hasInTableScope(n)||e.openElements.hasInTableScope($.TR))&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=IN_TABLE_BODY_MODE,e._processToken(t)):(n!==$.BODY&&n!==$.CAPTION&&n!==$.COL&&n!==$.COLGROUP||n!==$.HTML&&n!==$.TD&&n!==$.TH)&&endTagInTable(e,t)}function startTagInCell(e,t){var n=t.tagName;n===$.CAPTION||n===$.COL||n===$.COLGROUP||n===$.TBODY||n===$.TD||n===$.TFOOT||n===$.TH||n===$.THEAD||n===$.TR?(e.openElements.hasInTableScope($.TD)||e.openElements.hasInTableScope($.TH))&&(e._closeTableCell(),e._processToken(t)):startTagInBody(e,t)}function endTagInCell(e,t){var n=t.tagName;n===$.TD||n===$.TH?e.openElements.hasInTableScope(n)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(n),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=IN_ROW_MODE):n===$.TABLE||n===$.TBODY||n===$.TFOOT||n===$.THEAD||n===$.TR?e.openElements.hasInTableScope(n)&&(e._closeTableCell(),e._processToken(t)):n!==$.BODY&&n!==$.CAPTION&&n!==$.COL&&n!==$.COLGROUP&&n!==$.HTML&&endTagInBody(e,t)}function startTagInSelect(e,t){var n=t.tagName;n===$.HTML?startTagInBody(e,t):n===$.OPTION?(e.openElements.currentTagName===$.OPTION&&e.openElements.pop(),e._insertElement(t,NS.HTML)):n===$.OPTGROUP?(e.openElements.currentTagName===$.OPTION&&e.openElements.pop(),e.openElements.currentTagName===$.OPTGROUP&&e.openElements.pop(),e._insertElement(t,NS.HTML)):n===$.INPUT||n===$.KEYGEN||n===$.TEXTAREA||n===$.SELECT?e.openElements.hasInSelectScope($.SELECT)&&(e.openElements.popUntilTagNamePopped($.SELECT),e._resetInsertionMode(),n!==$.SELECT&&e._processToken(t)):n!==$.SCRIPT&&n!==$.TEMPLATE||startTagInHead(e,t)}function endTagInSelect(e,t){var n=t.tagName;if(n===$.OPTGROUP){var T=e.openElements.items[e.openElements.stackTop-1],o=T&&e.treeAdapter.getTagName(T);e.openElements.currentTagName===$.OPTION&&o===$.OPTGROUP&&e.openElements.pop(),e.openElements.currentTagName===$.OPTGROUP&&e.openElements.pop()}else n===$.OPTION?e.openElements.currentTagName===$.OPTION&&e.openElements.pop():n===$.SELECT&&e.openElements.hasInSelectScope($.SELECT)?(e.openElements.popUntilTagNamePopped($.SELECT),e._resetInsertionMode()):n===$.TEMPLATE&&endTagInHead(e,t)}function startTagInSelectInTable(e,t){var n=t.tagName;n===$.CAPTION||n===$.TABLE||n===$.TBODY||n===$.TFOOT||n===$.THEAD||n===$.TR||n===$.TD||n===$.TH?(e.openElements.popUntilTagNamePopped($.SELECT),e._resetInsertionMode(),e._processToken(t)):startTagInSelect(e,t)}function endTagInSelectInTable(e,t){var n=t.tagName;n===$.CAPTION||n===$.TABLE||n===$.TBODY||n===$.TFOOT||n===$.THEAD||n===$.TR||n===$.TD||n===$.TH?e.openElements.hasInTableScope(n)&&(e.openElements.popUntilTagNamePopped($.SELECT),e._resetInsertionMode(),e._processToken(t)):endTagInSelect(e,t)}function startTagInTemplate(e,t){var n=t.tagName;if(n===$.BASE||n===$.BASEFONT||n===$.BGSOUND||n===$.LINK||n===$.META||n===$.NOFRAMES||n===$.SCRIPT||n===$.STYLE||n===$.TEMPLATE||n===$.TITLE)startTagInHead(e,t);else{var T=TEMPLATE_INSERTION_MODE_SWITCH_MAP[n]||IN_BODY_MODE;e._popTmplInsertionMode(),e._pushTmplInsertionMode(T),e.insertionMode=T,e._processToken(t)}}function endTagInTemplate(e,t){t.tagName===$.TEMPLATE&&endTagInHead(e,t)}function eofInTemplate(e,t){e.openElements.tmplCount>0?(e.openElements.popUntilTagNamePopped($.TEMPLATE),e.activeFormattingElements.clearToLastMarker(),e._popTmplInsertionMode(),e._resetInsertionMode(),e._processToken(t)):e.stopped=!0}function startTagAfterBody(e,t){t.tagName===$.HTML?startTagInBody(e,t):tokenAfterBody(e,t)}function endTagAfterBody(e,t){t.tagName===$.HTML?e.fragmentContext||(e.insertionMode=AFTER_AFTER_BODY_MODE):tokenAfterBody(e,t)}function tokenAfterBody(e,t){e.insertionMode=IN_BODY_MODE,e._processToken(t)}function startTagInFrameset(e,t){var n=t.tagName;n===$.HTML?startTagInBody(e,t):n===$.FRAMESET?e._insertElement(t,NS.HTML):n===$.FRAME?e._appendElement(t,NS.HTML):n===$.NOFRAMES&&startTagInHead(e,t)}function endTagInFrameset(e,t){t.tagName!==$.FRAMESET||e.openElements.isRootHtmlElementCurrent()||(e.openElements.pop(),e.fragmentContext||e.openElements.currentTagName===$.FRAMESET||(e.insertionMode=AFTER_FRAMESET_MODE))}function startTagAfterFrameset(e,t){var n=t.tagName;n===$.HTML?startTagInBody(e,t):n===$.NOFRAMES&&startTagInHead(e,t)}function endTagAfterFrameset(e,t){t.tagName===$.HTML&&(e.insertionMode=AFTER_AFTER_FRAMESET_MODE)}function startTagAfterAfterBody(e,t){t.tagName===$.HTML?startTagInBody(e,t):tokenAfterAfterBody(e,t)}function tokenAfterAfterBody(e,t){e.insertionMode=IN_BODY_MODE,e._processToken(t)}function startTagAfterAfterFrameset(e,t){var n=t.tagName;n===$.HTML?startTagInBody(e,t):n===$.NOFRAMES&&startTagInHead(e,t)}function nullCharacterInForeignContent(e,t){t.chars=UNICODE.REPLACEMENT_CHARACTER,e._insertCharacters(t)}function characterInForeignContent(e,t){e._insertCharacters(t),e.framesetOk=!1}function startTagInForeignContent(e,t){if(foreignContent.causesExit(t)&&!e.fragmentContext){for(;e.treeAdapter.getNamespaceURI(e.openElements.current)!==NS.HTML&&!e._isIntegrationPoint(e.openElements.current);)e.openElements.pop();e._processToken(t)}else{var n=e._getAdjustedCurrentElement(),T=e.treeAdapter.getNamespaceURI(n);T===NS.MATHML?foreignContent.adjustTokenMathMLAttrs(t):T===NS.SVG&&(foreignContent.adjustTokenSVGTagName(t),foreignContent.adjustTokenSVGAttrs(t)),foreignContent.adjustTokenXMLAttrs(t),t.selfClosing?e._appendElement(t,T):e._insertElement(t,T)}}function endTagInForeignContent(e,t){for(var n=e.openElements.stackTop;n>0;n--){var T=e.openElements.items[n];if(e.treeAdapter.getNamespaceURI(T)===NS.HTML){e._processToken(t);break}if(e.treeAdapter.getTagName(T).toLowerCase()===t.tagName){e.openElements.popUntilElementPopped(T);break}}}var Tokenizer=require("../tokenizer"),OpenElementStack=require("./open_element_stack"),FormattingElementList=require("./formatting_element_list"),locationInfoMixin=require("../location_info/parser_mixin"),defaultTreeAdapter=require("../tree_adapters/default"),doctype=require("../common/doctype"),foreignContent=require("../common/foreign_content"),mergeOptions=require("../common/merge_options"),UNICODE=require("../common/unicode"),HTML=require("../common/html"),$=HTML.TAG_NAMES,NS=HTML.NAMESPACES,ATTRS=HTML.ATTRS,DEFAULT_OPTIONS={locationInfo:!1,treeAdapter:defaultTreeAdapter},HIDDEN_INPUT_TYPE="hidden",AA_OUTER_LOOP_ITER=8,AA_INNER_LOOP_ITER=3,INITIAL_MODE="INITIAL_MODE",BEFORE_HTML_MODE="BEFORE_HTML_MODE",BEFORE_HEAD_MODE="BEFORE_HEAD_MODE",IN_HEAD_MODE="IN_HEAD_MODE",AFTER_HEAD_MODE="AFTER_HEAD_MODE",IN_BODY_MODE="IN_BODY_MODE",TEXT_MODE="TEXT_MODE",IN_TABLE_MODE="IN_TABLE_MODE",IN_TABLE_TEXT_MODE="IN_TABLE_TEXT_MODE",IN_CAPTION_MODE="IN_CAPTION_MODE",IN_COLUMN_GROUP_MODE="IN_COLUMN_GROUP_MODE",IN_TABLE_BODY_MODE="IN_TABLE_BODY_MODE",IN_ROW_MODE="IN_ROW_MODE",IN_CELL_MODE="IN_CELL_MODE",IN_SELECT_MODE="IN_SELECT_MODE",IN_SELECT_IN_TABLE_MODE="IN_SELECT_IN_TABLE_MODE",IN_TEMPLATE_MODE="IN_TEMPLATE_MODE",AFTER_BODY_MODE="AFTER_BODY_MODE",IN_FRAMESET_MODE="IN_FRAMESET_MODE",AFTER_FRAMESET_MODE="AFTER_FRAMESET_MODE",AFTER_AFTER_BODY_MODE="AFTER_AFTER_BODY_MODE",AFTER_AFTER_FRAMESET_MODE="AFTER_AFTER_FRAMESET_MODE",INSERTION_MODE_RESET_MAP={};INSERTION_MODE_RESET_MAP[$.TR]=IN_ROW_MODE,INSERTION_MODE_RESET_MAP[$.TBODY]=INSERTION_MODE_RESET_MAP[$.THEAD]=INSERTION_MODE_RESET_MAP[$.TFOOT]=IN_TABLE_BODY_MODE,INSERTION_MODE_RESET_MAP[$.CAPTION]=IN_CAPTION_MODE,INSERTION_MODE_RESET_MAP[$.COLGROUP]=IN_COLUMN_GROUP_MODE,INSERTION_MODE_RESET_MAP[$.TABLE]=IN_TABLE_MODE,INSERTION_MODE_RESET_MAP[$.BODY]=IN_BODY_MODE,INSERTION_MODE_RESET_MAP[$.FRAMESET]=IN_FRAMESET_MODE;var TEMPLATE_INSERTION_MODE_SWITCH_MAP={};TEMPLATE_INSERTION_MODE_SWITCH_MAP[$.CAPTION]=TEMPLATE_INSERTION_MODE_SWITCH_MAP[$.COLGROUP]=TEMPLATE_INSERTION_MODE_SWITCH_MAP[$.TBODY]=TEMPLATE_INSERTION_MODE_SWITCH_MAP[$.TFOOT]=TEMPLATE_INSERTION_MODE_SWITCH_MAP[$.THEAD]=IN_TABLE_MODE,TEMPLATE_INSERTION_MODE_SWITCH_MAP[$.COL]=IN_COLUMN_GROUP_MODE,TEMPLATE_INSERTION_MODE_SWITCH_MAP[$.TR]=IN_TABLE_BODY_MODE,TEMPLATE_INSERTION_MODE_SWITCH_MAP[$.TD]=TEMPLATE_INSERTION_MODE_SWITCH_MAP[$.TH]=IN_ROW_MODE;var _={};_[INITIAL_MODE]={},_[INITIAL_MODE][Tokenizer.CHARACTER_TOKEN]=_[INITIAL_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=tokenInInitialMode,_[INITIAL_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=ignoreToken,_[INITIAL_MODE][Tokenizer.COMMENT_TOKEN]=appendComment,_[INITIAL_MODE][Tokenizer.DOCTYPE_TOKEN]=doctypeInInitialMode,_[INITIAL_MODE][Tokenizer.START_TAG_TOKEN]=_[INITIAL_MODE][Tokenizer.END_TAG_TOKEN]=_[INITIAL_MODE][Tokenizer.EOF_TOKEN]=tokenInInitialMode,_[BEFORE_HTML_MODE]={},_[BEFORE_HTML_MODE][Tokenizer.CHARACTER_TOKEN]=_[BEFORE_HTML_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=tokenBeforeHtml,_[BEFORE_HTML_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=ignoreToken,_[BEFORE_HTML_MODE][Tokenizer.COMMENT_TOKEN]=appendComment,_[BEFORE_HTML_MODE][Tokenizer.DOCTYPE_TOKEN]=ignoreToken,_[BEFORE_HTML_MODE][Tokenizer.START_TAG_TOKEN]=startTagBeforeHtml,_[BEFORE_HTML_MODE][Tokenizer.END_TAG_TOKEN]=endTagBeforeHtml,_[BEFORE_HTML_MODE][Tokenizer.EOF_TOKEN]=tokenBeforeHtml,_[BEFORE_HEAD_MODE]={},_[BEFORE_HEAD_MODE][Tokenizer.CHARACTER_TOKEN]=_[BEFORE_HEAD_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=tokenBeforeHead,_[BEFORE_HEAD_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=ignoreToken,_[BEFORE_HEAD_MODE][Tokenizer.COMMENT_TOKEN]=appendComment,_[BEFORE_HEAD_MODE][Tokenizer.DOCTYPE_TOKEN]=ignoreToken,_[BEFORE_HEAD_MODE][Tokenizer.START_TAG_TOKEN]=startTagBeforeHead,_[BEFORE_HEAD_MODE][Tokenizer.END_TAG_TOKEN]=endTagBeforeHead,_[BEFORE_HEAD_MODE][Tokenizer.EOF_TOKEN]=tokenBeforeHead,_[IN_HEAD_MODE]={},_[IN_HEAD_MODE][Tokenizer.CHARACTER_TOKEN]=_[IN_HEAD_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=tokenInHead,_[IN_HEAD_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=insertCharacters,_[IN_HEAD_MODE][Tokenizer.COMMENT_TOKEN]=appendComment,_[IN_HEAD_MODE][Tokenizer.DOCTYPE_TOKEN]=ignoreToken,_[IN_HEAD_MODE][Tokenizer.START_TAG_TOKEN]=startTagInHead,_[IN_HEAD_MODE][Tokenizer.END_TAG_TOKEN]=endTagInHead,_[IN_HEAD_MODE][Tokenizer.EOF_TOKEN]=tokenInHead,_[AFTER_HEAD_MODE]={},_[AFTER_HEAD_MODE][Tokenizer.CHARACTER_TOKEN]=_[AFTER_HEAD_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=tokenAfterHead,_[AFTER_HEAD_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=insertCharacters,_[AFTER_HEAD_MODE][Tokenizer.COMMENT_TOKEN]=appendComment,_[AFTER_HEAD_MODE][Tokenizer.DOCTYPE_TOKEN]=ignoreToken,_[AFTER_HEAD_MODE][Tokenizer.START_TAG_TOKEN]=startTagAfterHead,_[AFTER_HEAD_MODE][Tokenizer.END_TAG_TOKEN]=endTagAfterHead,_[AFTER_HEAD_MODE][Tokenizer.EOF_TOKEN]=tokenAfterHead,_[IN_BODY_MODE]={},_[IN_BODY_MODE][Tokenizer.CHARACTER_TOKEN]=characterInBody,_[IN_BODY_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=ignoreToken,_[IN_BODY_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=whitespaceCharacterInBody,_[IN_BODY_MODE][Tokenizer.COMMENT_TOKEN]=appendComment,_[IN_BODY_MODE][Tokenizer.DOCTYPE_TOKEN]=ignoreToken,_[IN_BODY_MODE][Tokenizer.START_TAG_TOKEN]=startTagInBody,_[IN_BODY_MODE][Tokenizer.END_TAG_TOKEN]=endTagInBody,_[IN_BODY_MODE][Tokenizer.EOF_TOKEN]=eofInBody,_[TEXT_MODE]={},_[TEXT_MODE][Tokenizer.CHARACTER_TOKEN]=_[TEXT_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=_[TEXT_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=insertCharacters,_[TEXT_MODE][Tokenizer.COMMENT_TOKEN]=_[TEXT_MODE][Tokenizer.DOCTYPE_TOKEN]=_[TEXT_MODE][Tokenizer.START_TAG_TOKEN]=ignoreToken,_[TEXT_MODE][Tokenizer.END_TAG_TOKEN]=endTagInText,_[TEXT_MODE][Tokenizer.EOF_TOKEN]=eofInText,_[IN_TABLE_MODE]={},_[IN_TABLE_MODE][Tokenizer.CHARACTER_TOKEN]=_[IN_TABLE_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=_[IN_TABLE_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=characterInTable,_[IN_TABLE_MODE][Tokenizer.COMMENT_TOKEN]=appendComment,_[IN_TABLE_MODE][Tokenizer.DOCTYPE_TOKEN]=ignoreToken,_[IN_TABLE_MODE][Tokenizer.START_TAG_TOKEN]=startTagInTable,_[IN_TABLE_MODE][Tokenizer.END_TAG_TOKEN]=endTagInTable,_[IN_TABLE_MODE][Tokenizer.EOF_TOKEN]=eofInBody,_[IN_TABLE_TEXT_MODE]={},_[IN_TABLE_TEXT_MODE][Tokenizer.CHARACTER_TOKEN]=characterInTableText,_[IN_TABLE_TEXT_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=ignoreToken,_[IN_TABLE_TEXT_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=whitespaceCharacterInTableText,_[IN_TABLE_TEXT_MODE][Tokenizer.COMMENT_TOKEN]=_[IN_TABLE_TEXT_MODE][Tokenizer.DOCTYPE_TOKEN]=_[IN_TABLE_TEXT_MODE][Tokenizer.START_TAG_TOKEN]=_[IN_TABLE_TEXT_MODE][Tokenizer.END_TAG_TOKEN]=_[IN_TABLE_TEXT_MODE][Tokenizer.EOF_TOKEN]=tokenInTableText,_[IN_CAPTION_MODE]={},_[IN_CAPTION_MODE][Tokenizer.CHARACTER_TOKEN]=characterInBody,_[IN_CAPTION_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=ignoreToken,_[IN_CAPTION_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=whitespaceCharacterInBody,_[IN_CAPTION_MODE][Tokenizer.COMMENT_TOKEN]=appendComment,_[IN_CAPTION_MODE][Tokenizer.DOCTYPE_TOKEN]=ignoreToken,_[IN_CAPTION_MODE][Tokenizer.START_TAG_TOKEN]=startTagInCaption,_[IN_CAPTION_MODE][Tokenizer.END_TAG_TOKEN]=endTagInCaption,_[IN_CAPTION_MODE][Tokenizer.EOF_TOKEN]=eofInBody,_[IN_COLUMN_GROUP_MODE]={},_[IN_COLUMN_GROUP_MODE][Tokenizer.CHARACTER_TOKEN]=_[IN_COLUMN_GROUP_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=tokenInColumnGroup,_[IN_COLUMN_GROUP_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=insertCharacters,_[IN_COLUMN_GROUP_MODE][Tokenizer.COMMENT_TOKEN]=appendComment,_[IN_COLUMN_GROUP_MODE][Tokenizer.DOCTYPE_TOKEN]=ignoreToken,_[IN_COLUMN_GROUP_MODE][Tokenizer.START_TAG_TOKEN]=startTagInColumnGroup,_[IN_COLUMN_GROUP_MODE][Tokenizer.END_TAG_TOKEN]=endTagInColumnGroup,_[IN_COLUMN_GROUP_MODE][Tokenizer.EOF_TOKEN]=eofInBody,_[IN_TABLE_BODY_MODE]={},_[IN_TABLE_BODY_MODE][Tokenizer.CHARACTER_TOKEN]=_[IN_TABLE_BODY_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=_[IN_TABLE_BODY_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=characterInTable,_[IN_TABLE_BODY_MODE][Tokenizer.COMMENT_TOKEN]=appendComment,_[IN_TABLE_BODY_MODE][Tokenizer.DOCTYPE_TOKEN]=ignoreToken,_[IN_TABLE_BODY_MODE][Tokenizer.START_TAG_TOKEN]=startTagInTableBody,_[IN_TABLE_BODY_MODE][Tokenizer.END_TAG_TOKEN]=endTagInTableBody,_[IN_TABLE_BODY_MODE][Tokenizer.EOF_TOKEN]=eofInBody,_[IN_ROW_MODE]={},_[IN_ROW_MODE][Tokenizer.CHARACTER_TOKEN]=_[IN_ROW_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=_[IN_ROW_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=characterInTable,_[IN_ROW_MODE][Tokenizer.COMMENT_TOKEN]=appendComment,_[IN_ROW_MODE][Tokenizer.DOCTYPE_TOKEN]=ignoreToken,_[IN_ROW_MODE][Tokenizer.START_TAG_TOKEN]=startTagInRow,_[IN_ROW_MODE][Tokenizer.END_TAG_TOKEN]=endTagInRow,_[IN_ROW_MODE][Tokenizer.EOF_TOKEN]=eofInBody,_[IN_CELL_MODE]={},_[IN_CELL_MODE][Tokenizer.CHARACTER_TOKEN]=characterInBody,_[IN_CELL_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=ignoreToken,_[IN_CELL_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=whitespaceCharacterInBody,_[IN_CELL_MODE][Tokenizer.COMMENT_TOKEN]=appendComment,_[IN_CELL_MODE][Tokenizer.DOCTYPE_TOKEN]=ignoreToken,_[IN_CELL_MODE][Tokenizer.START_TAG_TOKEN]=startTagInCell,_[IN_CELL_MODE][Tokenizer.END_TAG_TOKEN]=endTagInCell,_[IN_CELL_MODE][Tokenizer.EOF_TOKEN]=eofInBody,_[IN_SELECT_MODE]={},_[IN_SELECT_MODE][Tokenizer.CHARACTER_TOKEN]=insertCharacters,_[IN_SELECT_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=ignoreToken,_[IN_SELECT_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=insertCharacters,_[IN_SELECT_MODE][Tokenizer.COMMENT_TOKEN]=appendComment,_[IN_SELECT_MODE][Tokenizer.DOCTYPE_TOKEN]=ignoreToken,_[IN_SELECT_MODE][Tokenizer.START_TAG_TOKEN]=startTagInSelect,_[IN_SELECT_MODE][Tokenizer.END_TAG_TOKEN]=endTagInSelect,_[IN_SELECT_MODE][Tokenizer.EOF_TOKEN]=eofInBody,_[IN_SELECT_IN_TABLE_MODE]={},_[IN_SELECT_IN_TABLE_MODE][Tokenizer.CHARACTER_TOKEN]=insertCharacters,_[IN_SELECT_IN_TABLE_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=ignoreToken,_[IN_SELECT_IN_TABLE_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=insertCharacters,_[IN_SELECT_IN_TABLE_MODE][Tokenizer.COMMENT_TOKEN]=appendComment,_[IN_SELECT_IN_TABLE_MODE][Tokenizer.DOCTYPE_TOKEN]=ignoreToken,_[IN_SELECT_IN_TABLE_MODE][Tokenizer.START_TAG_TOKEN]=startTagInSelectInTable,_[IN_SELECT_IN_TABLE_MODE][Tokenizer.END_TAG_TOKEN]=endTagInSelectInTable,_[IN_SELECT_IN_TABLE_MODE][Tokenizer.EOF_TOKEN]=eofInBody,_[IN_TEMPLATE_MODE]={},_[IN_TEMPLATE_MODE][Tokenizer.CHARACTER_TOKEN]=characterInBody,_[IN_TEMPLATE_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=ignoreToken,_[IN_TEMPLATE_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=whitespaceCharacterInBody,_[IN_TEMPLATE_MODE][Tokenizer.COMMENT_TOKEN]=appendComment,_[IN_TEMPLATE_MODE][Tokenizer.DOCTYPE_TOKEN]=ignoreToken,_[IN_TEMPLATE_MODE][Tokenizer.START_TAG_TOKEN]=startTagInTemplate,_[IN_TEMPLATE_MODE][Tokenizer.END_TAG_TOKEN]=endTagInTemplate,_[IN_TEMPLATE_MODE][Tokenizer.EOF_TOKEN]=eofInTemplate,_[AFTER_BODY_MODE]={},_[AFTER_BODY_MODE][Tokenizer.CHARACTER_TOKEN]=_[AFTER_BODY_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=tokenAfterBody,_[AFTER_BODY_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=whitespaceCharacterInBody,_[AFTER_BODY_MODE][Tokenizer.COMMENT_TOKEN]=appendCommentToRootHtmlElement,_[AFTER_BODY_MODE][Tokenizer.DOCTYPE_TOKEN]=ignoreToken,_[AFTER_BODY_MODE][Tokenizer.START_TAG_TOKEN]=startTagAfterBody,_[AFTER_BODY_MODE][Tokenizer.END_TAG_TOKEN]=endTagAfterBody,_[AFTER_BODY_MODE][Tokenizer.EOF_TOKEN]=stopParsing,_[IN_FRAMESET_MODE]={},_[IN_FRAMESET_MODE][Tokenizer.CHARACTER_TOKEN]=_[IN_FRAMESET_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=ignoreToken,_[IN_FRAMESET_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=insertCharacters,_[IN_FRAMESET_MODE][Tokenizer.COMMENT_TOKEN]=appendComment,_[IN_FRAMESET_MODE][Tokenizer.DOCTYPE_TOKEN]=ignoreToken,_[IN_FRAMESET_MODE][Tokenizer.START_TAG_TOKEN]=startTagInFrameset,_[IN_FRAMESET_MODE][Tokenizer.END_TAG_TOKEN]=endTagInFrameset,_[IN_FRAMESET_MODE][Tokenizer.EOF_TOKEN]=stopParsing,_[AFTER_FRAMESET_MODE]={},_[AFTER_FRAMESET_MODE][Tokenizer.CHARACTER_TOKEN]=_[AFTER_FRAMESET_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=ignoreToken,_[AFTER_FRAMESET_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=insertCharacters,_[AFTER_FRAMESET_MODE][Tokenizer.COMMENT_TOKEN]=appendComment,_[AFTER_FRAMESET_MODE][Tokenizer.DOCTYPE_TOKEN]=ignoreToken,_[AFTER_FRAMESET_MODE][Tokenizer.START_TAG_TOKEN]=startTagAfterFrameset,_[AFTER_FRAMESET_MODE][Tokenizer.END_TAG_TOKEN]=endTagAfterFrameset,_[AFTER_FRAMESET_MODE][Tokenizer.EOF_TOKEN]=stopParsing,_[AFTER_AFTER_BODY_MODE]={},_[AFTER_AFTER_BODY_MODE][Tokenizer.CHARACTER_TOKEN]=tokenAfterAfterBody,_[AFTER_AFTER_BODY_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=tokenAfterAfterBody,_[AFTER_AFTER_BODY_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=whitespaceCharacterInBody,_[AFTER_AFTER_BODY_MODE][Tokenizer.COMMENT_TOKEN]=appendCommentToDocument,_[AFTER_AFTER_BODY_MODE][Tokenizer.DOCTYPE_TOKEN]=ignoreToken,_[AFTER_AFTER_BODY_MODE][Tokenizer.START_TAG_TOKEN]=startTagAfterAfterBody,_[AFTER_AFTER_BODY_MODE][Tokenizer.END_TAG_TOKEN]=tokenAfterAfterBody,_[AFTER_AFTER_BODY_MODE][Tokenizer.EOF_TOKEN]=stopParsing,_[AFTER_AFTER_FRAMESET_MODE]={},_[AFTER_AFTER_FRAMESET_MODE][Tokenizer.CHARACTER_TOKEN]=_[AFTER_AFTER_FRAMESET_MODE][Tokenizer.NULL_CHARACTER_TOKEN]=ignoreToken,_[AFTER_AFTER_FRAMESET_MODE][Tokenizer.WHITESPACE_CHARACTER_TOKEN]=whitespaceCharacterInBody,_[AFTER_AFTER_FRAMESET_MODE][Tokenizer.COMMENT_TOKEN]=appendCommentToDocument,_[AFTER_AFTER_FRAMESET_MODE][Tokenizer.DOCTYPE_TOKEN]=ignoreToken,_[AFTER_AFTER_FRAMESET_MODE][Tokenizer.START_TAG_TOKEN]=startTagAfterAfterFrameset,_[AFTER_AFTER_FRAMESET_MODE][Tokenizer.END_TAG_TOKEN]=ignoreToken,_[AFTER_AFTER_FRAMESET_MODE][Tokenizer.EOF_TOKEN]=stopParsing;var Parser=module.exports=function(e){this.options=mergeOptions(DEFAULT_OPTIONS,e),this.treeAdapter=this.options.treeAdapter,this.pendingScript=null,this.options.locationInfo&&locationInfoMixin.assign(this)};Parser.prototype.parse=function(e){var t=this.treeAdapter.createDocument();return this._bootstrap(t,null),this.tokenizer.write(e,!0),this._runParsingLoop(null,null),t},Parser.prototype.parseFragment=function(e,t){t||(t=this.treeAdapter.createElement($.TEMPLATE,NS.HTML,[]));var n=this.treeAdapter.createElement("documentmock",NS.HTML,[]);this._bootstrap(n,t),this.treeAdapter.getTagName(t)===$.TEMPLATE&&this._pushTmplInsertionMode(IN_TEMPLATE_MODE),this._initTokenizerForFragmentParsing(),this._insertFakeRootElement(),this._resetInsertionMode(),this._findFormInFragmentContext(),this.tokenizer.write(e,!0),this._runParsingLoop(null,null);var T=this.treeAdapter.getFirstChild(n),o=this.treeAdapter.createDocumentFragment();return this._adoptNodes(T,o),o},Parser.prototype._bootstrap=function(e,t){this.tokenizer=new Tokenizer(this.options),this.stopped=!1,this.insertionMode=INITIAL_MODE,this.originalInsertionMode="",this.document=e,this.fragmentContext=t,this.headElement=null,this.formElement=null,this.openElements=new OpenElementStack(this.document,this.treeAdapter),this.activeFormattingElements=new FormattingElementList(this.treeAdapter),this.tmplInsertionModeStack=[],this.tmplInsertionModeStackTop=-1,this.currentTmplInsertionMode=null,this.pendingCharacterTokens=[],this.hasNonWhitespacePendingCharacterToken=!1,this.framesetOk=!0,this.skipNextNewLine=!1,this.fosterParentingEnabled=!1},Parser.prototype._runParsingLoop=function(e,t){for(;!this.stopped;){this._setupTokenizerCDATAMode();var n=this.tokenizer.getNextToken();if(n.type===Tokenizer.HIBERNATION_TOKEN)break;if(this.skipNextNewLine&&(this.skipNextNewLine=!1,n.type===Tokenizer.WHITESPACE_CHARACTER_TOKEN&&"\n"===n.chars[0])){if(1===n.chars.length)continue;n.chars=n.chars.substr(1)}if(this._processInputToken(n),t&&this.pendingScript)break}if(t&&this.pendingScript){var T=this.pendingScript;return this.pendingScript=null,void t(T)}e&&e()},Parser.prototype._setupTokenizerCDATAMode=function(){var e=this._getAdjustedCurrentElement();this.tokenizer.allowCDATA=e&&e!==this.document&&this.treeAdapter.getNamespaceURI(e)!==NS.HTML&&!this._isIntegrationPoint(e)},Parser.prototype._switchToTextParsing=function(e,t){this._insertElement(e,NS.HTML),this.tokenizer.state=t,this.originalInsertionMode=this.insertionMode,this.insertionMode=TEXT_MODE},Parser.prototype._getAdjustedCurrentElement=function(){return 0===this.openElements.stackTop&&this.fragmentContext?this.fragmentContext:this.openElements.current},Parser.prototype._findFormInFragmentContext=function(){var e=this.fragmentContext;do{if(this.treeAdapter.getTagName(e)===$.FORM){this.formElement=e;break}e=this.treeAdapter.getParentNode(e)}while(e)},Parser.prototype._initTokenizerForFragmentParsing=function(){if(this.treeAdapter.getNamespaceURI(this.fragmentContext)===NS.HTML){var e=this.treeAdapter.getTagName(this.fragmentContext);e===$.TITLE||e===$.TEXTAREA?this.tokenizer.state=Tokenizer.MODE.RCDATA:e===$.STYLE||e===$.XMP||e===$.IFRAME||e===$.NOEMBED||e===$.NOFRAMES||e===$.NOSCRIPT?this.tokenizer.state=Tokenizer.MODE.RAWTEXT:e===$.SCRIPT?this.tokenizer.state=Tokenizer.MODE.SCRIPT_DATA:e===$.PLAINTEXT&&(this.tokenizer.state=Tokenizer.MODE.PLAINTEXT)}},Parser.prototype._setDocumentType=function(e){this.treeAdapter.setDocumentType(this.document,e.name,e.publicId,e.systemId)},Parser.prototype._attachElementToTree=function(e){if(this._shouldFosterParentOnInsertion())this._fosterParentElement(e);else{var t=this.openElements.currentTmplContent||this.openElements.current;this.treeAdapter.appendChild(t,e)}},Parser.prototype._appendElement=function(e,t){var n=this.treeAdapter.createElement(e.tagName,t,e.attrs);this._attachElementToTree(n)},Parser.prototype._insertElement=function(e,t){var n=this.treeAdapter.createElement(e.tagName,t,e.attrs);this._attachElementToTree(n),this.openElements.push(n)},Parser.prototype._insertFakeElement=function(e){var t=this.treeAdapter.createElement(e,NS.HTML,[]);this._attachElementToTree(t),this.openElements.push(t)},Parser.prototype._insertTemplate=function(e){var t=this.treeAdapter.createElement(e.tagName,NS.HTML,e.attrs),n=this.treeAdapter.createDocumentFragment();this.treeAdapter.setTemplateContent(t,n),this._attachElementToTree(t),this.openElements.push(t)},Parser.prototype._insertFakeRootElement=function(){var e=this.treeAdapter.createElement($.HTML,NS.HTML,[]);this.treeAdapter.appendChild(this.openElements.current,e),this.openElements.push(e)},Parser.prototype._appendCommentNode=function(e,t){var n=this.treeAdapter.createCommentNode(e.data);this.treeAdapter.appendChild(t,n)},Parser.prototype._insertCharacters=function(e){if(this._shouldFosterParentOnInsertion())this._fosterParentText(e.chars);else{var t=this.openElements.currentTmplContent||this.openElements.current;this.treeAdapter.insertText(t,e.chars)}},Parser.prototype._adoptNodes=function(e,t){for(;;){var n=this.treeAdapter.getFirstChild(e);if(!n)break;this.treeAdapter.detachNode(n),this.treeAdapter.appendChild(t,n)}},Parser.prototype._shouldProcessTokenInForeignContent=function(e){var t=this._getAdjustedCurrentElement();if(!t||t===this.document)return!1;var n=this.treeAdapter.getNamespaceURI(t);if(n===NS.HTML)return!1;if(this.treeAdapter.getTagName(t)===$.ANNOTATION_XML&&n===NS.MATHML&&e.type===Tokenizer.START_TAG_TOKEN&&e.tagName===$.SVG)return!1;var T=e.type===Tokenizer.CHARACTER_TOKEN||e.type===Tokenizer.NULL_CHARACTER_TOKEN||e.type===Tokenizer.WHITESPACE_CHARACTER_TOKEN;return(!(e.type===Tokenizer.START_TAG_TOKEN&&e.tagName!==$.MGLYPH&&e.tagName!==$.MALIGNMARK)&&!T||!this._isIntegrationPoint(t,NS.MATHML))&&((e.type!==Tokenizer.START_TAG_TOKEN&&!T||!this._isIntegrationPoint(t,NS.HTML))&&e.type!==Tokenizer.EOF_TOKEN)},Parser.prototype._processToken=function(e){_[this.insertionMode][e.type](this,e)},Parser.prototype._processTokenInBodyMode=function(e){_[IN_BODY_MODE][e.type](this,e)},Parser.prototype._processTokenInForeignContent=function(e){e.type===Tokenizer.CHARACTER_TOKEN?characterInForeignContent(this,e):e.type===Tokenizer.NULL_CHARACTER_TOKEN?nullCharacterInForeignContent(this,e):e.type===Tokenizer.WHITESPACE_CHARACTER_TOKEN?insertCharacters(this,e):e.type===Tokenizer.COMMENT_TOKEN?appendComment(this,e):e.type===Tokenizer.START_TAG_TOKEN?startTagInForeignContent(this,e):e.type===Tokenizer.END_TAG_TOKEN&&endTagInForeignContent(this,e)},Parser.prototype._processInputToken=function(e){this._shouldProcessTokenInForeignContent(e)?this._processTokenInForeignContent(e):this._processToken(e)},Parser.prototype._isIntegrationPoint=function(e,t){var n=this.treeAdapter.getTagName(e),T=this.treeAdapter.getNamespaceURI(e),o=this.treeAdapter.getAttrList(e);return foreignContent.isIntegrationPoint(n,T,o,t)},Parser.prototype._reconstructActiveFormattingElements=function(){var e=this.activeFormattingElements.length;if(e){var t=e,n=null;do{if(t--,(n=this.activeFormattingElements.entries[t]).type===FormattingElementList.MARKER_ENTRY||this.openElements.contains(n.element)){t++;break}}while(t>0);for(var T=t;T<e;T++)n=this.activeFormattingElements.entries[T],this._insertElement(n.token,this.treeAdapter.getNamespaceURI(n.element)),n.element=this.openElements.current}},Parser.prototype._closeTableCell=function(){this.openElements.generateImpliedEndTags(),this.openElements.popUntilTableCellPopped(),this.activeFormattingElements.clearToLastMarker(),this.insertionMode=IN_ROW_MODE},Parser.prototype._closePElement=function(){this.openElements.generateImpliedEndTagsWithExclusion($.P),this.openElements.popUntilTagNamePopped($.P)},Parser.prototype._resetInsertionMode=function(){for(var e=this.openElements.stackTop,t=!1;e>=0;e--){var n=this.openElements.items[e];0===e&&(t=!0,this.fragmentContext&&(n=this.fragmentContext));var T=this.treeAdapter.getTagName(n),o=INSERTION_MODE_RESET_MAP[T];if(o){this.insertionMode=o;break}if(!(t||T!==$.TD&&T!==$.TH)){this.insertionMode=IN_CELL_MODE;break}if(!t&&T===$.HEAD){this.insertionMode=IN_HEAD_MODE;break}if(T===$.SELECT){this._resetInsertionModeForSelect(e);break}if(T===$.TEMPLATE){this.insertionMode=this.currentTmplInsertionMode;break}if(T===$.HTML){this.insertionMode=this.headElement?AFTER_HEAD_MODE:BEFORE_HEAD_MODE;break}if(t){this.insertionMode=IN_BODY_MODE;break}}},Parser.prototype._resetInsertionModeForSelect=function(e){if(e>0)for(var t=e-1;t>0;t--){var n=this.openElements.items[t],T=this.treeAdapter.getTagName(n);if(T===$.TEMPLATE)break;if(T===$.TABLE)return void(this.insertionMode=IN_SELECT_IN_TABLE_MODE)}this.insertionMode=IN_SELECT_MODE},Parser.prototype._pushTmplInsertionMode=function(e){this.tmplInsertionModeStack.push(e),this.tmplInsertionModeStackTop++,this.currentTmplInsertionMode=e},Parser.prototype._popTmplInsertionMode=function(){this.tmplInsertionModeStack.pop(),this.tmplInsertionModeStackTop--,this.currentTmplInsertionMode=this.tmplInsertionModeStack[this.tmplInsertionModeStackTop]},Parser.prototype._isElementCausesFosterParenting=function(e){var t=this.treeAdapter.getTagName(e);return t===$.TABLE||t===$.TBODY||t===$.TFOOT||t===$.THEAD||t===$.TR},Parser.prototype._shouldFosterParentOnInsertion=function(){return this.fosterParentingEnabled&&this._isElementCausesFosterParenting(this.openElements.current)},Parser.prototype._findFosterParentingLocation=function(){for(var e={parent:null,beforeElement:null},t=this.openElements.stackTop;t>=0;t--){var n=this.openElements.items[t],T=this.treeAdapter.getTagName(n),o=this.treeAdapter.getNamespaceURI(n);if(T===$.TEMPLATE&&o===NS.HTML){e.parent=this.treeAdapter.getTemplateContent(n);break}if(T===$.TABLE){e.parent=this.treeAdapter.getParentNode(n),e.parent?e.beforeElement=n:e.parent=this.openElements.items[t-1];break}}return e.parent||(e.parent=this.openElements.items[0]),e},Parser.prototype._fosterParentElement=function(e){var t=this._findFosterParentingLocation();t.beforeElement?this.treeAdapter.insertBefore(t.parent,e,t.beforeElement):this.treeAdapter.appendChild(t.parent,e)},Parser.prototype._fosterParentText=function(e){var t=this._findFosterParentingLocation();t.beforeElement?this.treeAdapter.insertTextBefore(t.parent,e,t.beforeElement):this.treeAdapter.insertText(t.parent,e)},Parser.prototype._isSpecialElement=function(e){var t=this.treeAdapter.getTagName(e),n=this.treeAdapter.getNamespaceURI(e);return HTML.SPECIAL_ELEMENTS[n][t]};

},{"../common/doctype":123,"../common/foreign_content":124,"../common/html":125,"../common/merge_options":126,"../common/unicode":127,"../location_info/parser_mixin":128,"../tokenizer":133,"../tree_adapters/default":136,"./formatting_element_list":130,"./open_element_stack":132}],132:[function(require,module,exports){
"use strict";function isImpliedEndTagRequired(t){switch(t.length){case 1:return t===$.P;case 2:return t===$.RB||t===$.RP||t===$.RT||t===$.DD||t===$.DT||t===$.LI;case 3:return t===$.RTC;case 6:return t===$.OPTION;case 8:return t===$.OPTGROUP||t===$.MENUITEM}return!1}function isScopingElement(t,e){switch(t.length){case 2:if(t===$.TD||t===$.TH)return e===NS.HTML;if(t===$.MI||t===$.MO||t===$.MN||t===$.MS)return e===NS.MATHML;break;case 4:if(t===$.HTML)return e===NS.HTML;if(t===$.DESC)return e===NS.SVG;break;case 5:if(t===$.TABLE)return e===NS.HTML;if(t===$.MTEXT)return e===NS.MATHML;if(t===$.TITLE)return e===NS.SVG;break;case 6:return(t===$.APPLET||t===$.OBJECT)&&e===NS.HTML;case 7:return(t===$.CAPTION||t===$.MARQUEE)&&e===NS.HTML;case 8:return t===$.TEMPLATE&&e===NS.HTML;case 13:return t===$.FOREIGN_OBJECT&&e===NS.SVG;case 14:return t===$.ANNOTATION_XML&&e===NS.MATHML}return!1}var HTML=require("../common/html"),$=HTML.TAG_NAMES,NS=HTML.NAMESPACES,OpenElementStack=module.exports=function(t,e){this.stackTop=-1,this.items=[],this.current=t,this.currentTagName=null,this.currentTmplContent=null,this.tmplCount=0,this.treeAdapter=e};OpenElementStack.prototype._indexOf=function(t){for(var e=-1,r=this.stackTop;r>=0;r--)if(this.items[r]===t){e=r;break}return e},OpenElementStack.prototype._isInTemplate=function(){return this.currentTagName===$.TEMPLATE&&this.treeAdapter.getNamespaceURI(this.current)===NS.HTML},OpenElementStack.prototype._updateCurrentElement=function(){this.current=this.items[this.stackTop],this.currentTagName=this.current&&this.treeAdapter.getTagName(this.current),this.currentTmplContent=this._isInTemplate()?this.treeAdapter.getTemplateContent(this.current):null},OpenElementStack.prototype.push=function(t){this.items[++this.stackTop]=t,this._updateCurrentElement(),this._isInTemplate()&&this.tmplCount++},OpenElementStack.prototype.pop=function(){this.stackTop--,this.tmplCount>0&&this._isInTemplate()&&this.tmplCount--,this._updateCurrentElement()},OpenElementStack.prototype.replace=function(t,e){var r=this._indexOf(t);this.items[r]=e,r===this.stackTop&&this._updateCurrentElement()},OpenElementStack.prototype.insertAfter=function(t,e){var r=this._indexOf(t)+1;this.items.splice(r,0,e),r===++this.stackTop&&this._updateCurrentElement()},OpenElementStack.prototype.popUntilTagNamePopped=function(t){for(;this.stackTop>-1;){var e=this.currentTagName,r=this.treeAdapter.getNamespaceURI(this.current);if(this.pop(),e===t&&r===NS.HTML)break}},OpenElementStack.prototype.popUntilElementPopped=function(t){for(;this.stackTop>-1;){var e=this.current;if(this.pop(),e===t)break}},OpenElementStack.prototype.popUntilNumberedHeaderPopped=function(){for(;this.stackTop>-1;){var t=this.currentTagName,e=this.treeAdapter.getNamespaceURI(this.current);if(this.pop(),t===$.H1||t===$.H2||t===$.H3||t===$.H4||t===$.H5||t===$.H6&&e===NS.HTML)break}},OpenElementStack.prototype.popUntilTableCellPopped=function(){for(;this.stackTop>-1;){var t=this.currentTagName,e=this.treeAdapter.getNamespaceURI(this.current);if(this.pop(),t===$.TD||t===$.TH&&e===NS.HTML)break}},OpenElementStack.prototype.popAllUpToHtmlElement=function(){this.stackTop=0,this._updateCurrentElement()},OpenElementStack.prototype.clearBackToTableContext=function(){for(;this.currentTagName!==$.TABLE&&this.currentTagName!==$.TEMPLATE&&this.currentTagName!==$.HTML||this.treeAdapter.getNamespaceURI(this.current)!==NS.HTML;)this.pop()},OpenElementStack.prototype.clearBackToTableBodyContext=function(){for(;this.currentTagName!==$.TBODY&&this.currentTagName!==$.TFOOT&&this.currentTagName!==$.THEAD&&this.currentTagName!==$.TEMPLATE&&this.currentTagName!==$.HTML||this.treeAdapter.getNamespaceURI(this.current)!==NS.HTML;)this.pop()},OpenElementStack.prototype.clearBackToTableRowContext=function(){for(;this.currentTagName!==$.TR&&this.currentTagName!==$.TEMPLATE&&this.currentTagName!==$.HTML||this.treeAdapter.getNamespaceURI(this.current)!==NS.HTML;)this.pop()},OpenElementStack.prototype.remove=function(t){for(var e=this.stackTop;e>=0;e--)if(this.items[e]===t){this.items.splice(e,1),this.stackTop--,this._updateCurrentElement();break}},OpenElementStack.prototype.tryPeekProperlyNestedBodyElement=function(){var t=this.items[1];return t&&this.treeAdapter.getTagName(t)===$.BODY?t:null},OpenElementStack.prototype.contains=function(t){return this._indexOf(t)>-1},OpenElementStack.prototype.getCommonAncestor=function(t){var e=this._indexOf(t);return--e>=0?this.items[e]:null},OpenElementStack.prototype.isRootHtmlElementCurrent=function(){return 0===this.stackTop&&this.currentTagName===$.HTML},OpenElementStack.prototype.hasInScope=function(t){for(var e=this.stackTop;e>=0;e--){var r=this.treeAdapter.getTagName(this.items[e]),n=this.treeAdapter.getNamespaceURI(this.items[e]);if(r===t&&n===NS.HTML)return!0;if(isScopingElement(r,n))return!1}return!0},OpenElementStack.prototype.hasNumberedHeaderInScope=function(){for(var t=this.stackTop;t>=0;t--){var e=this.treeAdapter.getTagName(this.items[t]),r=this.treeAdapter.getNamespaceURI(this.items[t]);if((e===$.H1||e===$.H2||e===$.H3||e===$.H4||e===$.H5||e===$.H6)&&r===NS.HTML)return!0;if(isScopingElement(e,r))return!1}return!0},OpenElementStack.prototype.hasInListItemScope=function(t){for(var e=this.stackTop;e>=0;e--){var r=this.treeAdapter.getTagName(this.items[e]),n=this.treeAdapter.getNamespaceURI(this.items[e]);if(r===t&&n===NS.HTML)return!0;if((r===$.UL||r===$.OL)&&n===NS.HTML||isScopingElement(r,n))return!1}return!0},OpenElementStack.prototype.hasInButtonScope=function(t){for(var e=this.stackTop;e>=0;e--){var r=this.treeAdapter.getTagName(this.items[e]),n=this.treeAdapter.getNamespaceURI(this.items[e]);if(r===t&&n===NS.HTML)return!0;if(r===$.BUTTON&&n===NS.HTML||isScopingElement(r,n))return!1}return!0},OpenElementStack.prototype.hasInTableScope=function(t){for(var e=this.stackTop;e>=0;e--){var r=this.treeAdapter.getTagName(this.items[e]);if(this.treeAdapter.getNamespaceURI(this.items[e])===NS.HTML){if(r===t)return!0;if(r===$.TABLE||r===$.TEMPLATE||r===$.HTML)return!1}}return!0},OpenElementStack.prototype.hasTableBodyContextInTableScope=function(){for(var t=this.stackTop;t>=0;t--){var e=this.treeAdapter.getTagName(this.items[t]);if(this.treeAdapter.getNamespaceURI(this.items[t])===NS.HTML){if(e===$.TBODY||e===$.THEAD||e===$.TFOOT)return!0;if(e===$.TABLE||e===$.HTML)return!1}}return!0},OpenElementStack.prototype.hasInSelectScope=function(t){for(var e=this.stackTop;e>=0;e--){var r=this.treeAdapter.getTagName(this.items[e]);if(this.treeAdapter.getNamespaceURI(this.items[e])===NS.HTML){if(r===t)return!0;if(r!==$.OPTION&&r!==$.OPTGROUP)return!1}}return!0},OpenElementStack.prototype.generateImpliedEndTags=function(){for(;isImpliedEndTagRequired(this.currentTagName);)this.pop()},OpenElementStack.prototype.generateImpliedEndTagsWithExclusion=function(t){for(;isImpliedEndTagRequired(this.currentTagName)&&this.currentTagName!==t;)this.pop()};

},{"../common/html":125}],133:[function(require,module,exports){
"use strict";function isWhitespace(T){return T===$.SPACE||T===$.LINE_FEED||T===$.TABULATION||T===$.FORM_FEED}function isAsciiDigit(T){return T>=$.DIGIT_0&&T<=$.DIGIT_9}function isAsciiUpper(T){return T>=$.LATIN_CAPITAL_A&&T<=$.LATIN_CAPITAL_Z}function isAsciiLower(T){return T>=$.LATIN_SMALL_A&&T<=$.LATIN_SMALL_Z}function isAsciiLetter(T){return isAsciiLower(T)||isAsciiUpper(T)}function isAsciiAlphaNumeric(T){return isAsciiLetter(T)||isAsciiDigit(T)}function isDigit(T,t){return isAsciiDigit(T)||t&&(T>=$.LATIN_CAPITAL_A&&T<=$.LATIN_CAPITAL_F||T>=$.LATIN_SMALL_A&&T<=$.LATIN_SMALL_F)}function isReservedCodePoint(T){return T>=55296&&T<=57343||T>1114111}function toAsciiLowerCodePoint(T){return T+32}function toChar(T){return T<=65535?String.fromCharCode(T):(T-=65536,String.fromCharCode(T>>>10&1023|55296)+String.fromCharCode(56320|1023&T))}function toAsciiLowerChar(T){return String.fromCharCode(toAsciiLowerCodePoint(T))}var Preprocessor=require("./preprocessor"),locationInfoMixin=require("../location_info/tokenizer_mixin"),UNICODE=require("../common/unicode"),NAMED_ENTITY_TRIE=require("./named_entity_trie"),$=UNICODE.CODE_POINTS,$$=UNICODE.CODE_POINT_SEQUENCES,NUMERIC_ENTITY_REPLACEMENTS={0:65533,13:13,128:8364,129:129,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,141:141,142:381,143:143,144:144,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,157:157,158:382,159:376},DATA_STATE="DATA_STATE",CHARACTER_REFERENCE_IN_DATA_STATE="CHARACTER_REFERENCE_IN_DATA_STATE",RCDATA_STATE="RCDATA_STATE",CHARACTER_REFERENCE_IN_RCDATA_STATE="CHARACTER_REFERENCE_IN_RCDATA_STATE",RAWTEXT_STATE="RAWTEXT_STATE",SCRIPT_DATA_STATE="SCRIPT_DATA_STATE",PLAINTEXT_STATE="PLAINTEXT_STATE",TAG_OPEN_STATE="TAG_OPEN_STATE",END_TAG_OPEN_STATE="END_TAG_OPEN_STATE",TAG_NAME_STATE="TAG_NAME_STATE",RCDATA_LESS_THAN_SIGN_STATE="RCDATA_LESS_THAN_SIGN_STATE",RCDATA_END_TAG_OPEN_STATE="RCDATA_END_TAG_OPEN_STATE",RCDATA_END_TAG_NAME_STATE="RCDATA_END_TAG_NAME_STATE",RAWTEXT_LESS_THAN_SIGN_STATE="RAWTEXT_LESS_THAN_SIGN_STATE",RAWTEXT_END_TAG_OPEN_STATE="RAWTEXT_END_TAG_OPEN_STATE",RAWTEXT_END_TAG_NAME_STATE="RAWTEXT_END_TAG_NAME_STATE",SCRIPT_DATA_LESS_THAN_SIGN_STATE="SCRIPT_DATA_LESS_THAN_SIGN_STATE",SCRIPT_DATA_END_TAG_OPEN_STATE="SCRIPT_DATA_END_TAG_OPEN_STATE",SCRIPT_DATA_END_TAG_NAME_STATE="SCRIPT_DATA_END_TAG_NAME_STATE",SCRIPT_DATA_ESCAPE_START_STATE="SCRIPT_DATA_ESCAPE_START_STATE",SCRIPT_DATA_ESCAPE_START_DASH_STATE="SCRIPT_DATA_ESCAPE_START_DASH_STATE",SCRIPT_DATA_ESCAPED_STATE="SCRIPT_DATA_ESCAPED_STATE",SCRIPT_DATA_ESCAPED_DASH_STATE="SCRIPT_DATA_ESCAPED_DASH_STATE",SCRIPT_DATA_ESCAPED_DASH_DASH_STATE="SCRIPT_DATA_ESCAPED_DASH_DASH_STATE",SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE="SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE",SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE="SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE",SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE="SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE",SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE="SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE",SCRIPT_DATA_DOUBLE_ESCAPED_STATE="SCRIPT_DATA_DOUBLE_ESCAPED_STATE",SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE="SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE",SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE="SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE",SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE="SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE",SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE="SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE",BEFORE_ATTRIBUTE_NAME_STATE="BEFORE_ATTRIBUTE_NAME_STATE",ATTRIBUTE_NAME_STATE="ATTRIBUTE_NAME_STATE",AFTER_ATTRIBUTE_NAME_STATE="AFTER_ATTRIBUTE_NAME_STATE",BEFORE_ATTRIBUTE_VALUE_STATE="BEFORE_ATTRIBUTE_VALUE_STATE",ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE="ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE",ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE="ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE",ATTRIBUTE_VALUE_UNQUOTED_STATE="ATTRIBUTE_VALUE_UNQUOTED_STATE",CHARACTER_REFERENCE_IN_ATTRIBUTE_VALUE_STATE="CHARACTER_REFERENCE_IN_ATTRIBUTE_VALUE_STATE",AFTER_ATTRIBUTE_VALUE_QUOTED_STATE="AFTER_ATTRIBUTE_VALUE_QUOTED_STATE",SELF_CLOSING_START_TAG_STATE="SELF_CLOSING_START_TAG_STATE",BOGUS_COMMENT_STATE="BOGUS_COMMENT_STATE",BOGUS_COMMENT_STATE_CONTINUATION="BOGUS_COMMENT_STATE_CONTINUATION",MARKUP_DECLARATION_OPEN_STATE="MARKUP_DECLARATION_OPEN_STATE",COMMENT_START_STATE="COMMENT_START_STATE",COMMENT_START_DASH_STATE="COMMENT_START_DASH_STATE",COMMENT_STATE="COMMENT_STATE",COMMENT_END_DASH_STATE="COMMENT_END_DASH_STATE",COMMENT_END_STATE="COMMENT_END_STATE",COMMENT_END_BANG_STATE="COMMENT_END_BANG_STATE",DOCTYPE_STATE="DOCTYPE_STATE",DOCTYPE_NAME_STATE="DOCTYPE_NAME_STATE",AFTER_DOCTYPE_NAME_STATE="AFTER_DOCTYPE_NAME_STATE",BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE="BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE",DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE="DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE",DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE="DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE",BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE="BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE",BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE="BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE",DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE="DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE",DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE="DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE",AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE="AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE",BOGUS_DOCTYPE_STATE="BOGUS_DOCTYPE_STATE",CDATA_SECTION_STATE="CDATA_SECTION_STATE",Tokenizer=module.exports=function(T){this.preprocessor=new Preprocessor,this.tokenQueue=[],this.allowCDATA=!1,this.state=DATA_STATE,this.returnState="",this.tempBuff=[],this.additionalAllowedCp=void 0,this.lastStartTagName="",this.consumedAfterSnapshot=-1,this.active=!1,this.currentCharacterToken=null,this.currentToken=null,this.currentAttr=null,T&&T.locationInfo&&locationInfoMixin.assign(this)};Tokenizer.CHARACTER_TOKEN="CHARACTER_TOKEN",Tokenizer.NULL_CHARACTER_TOKEN="NULL_CHARACTER_TOKEN",Tokenizer.WHITESPACE_CHARACTER_TOKEN="WHITESPACE_CHARACTER_TOKEN",Tokenizer.START_TAG_TOKEN="START_TAG_TOKEN",Tokenizer.END_TAG_TOKEN="END_TAG_TOKEN",Tokenizer.COMMENT_TOKEN="COMMENT_TOKEN",Tokenizer.DOCTYPE_TOKEN="DOCTYPE_TOKEN",Tokenizer.EOF_TOKEN="EOF_TOKEN",Tokenizer.HIBERNATION_TOKEN="HIBERNATION_TOKEN",Tokenizer.MODE=Tokenizer.prototype.MODE={DATA:DATA_STATE,RCDATA:RCDATA_STATE,RAWTEXT:RAWTEXT_STATE,SCRIPT_DATA:SCRIPT_DATA_STATE,PLAINTEXT:PLAINTEXT_STATE},Tokenizer.getTokenAttr=function(T,t){for(var _=T.attrs.length-1;_>=0;_--)if(T.attrs[_].name===t)return T.attrs[_].value;return null},Tokenizer.prototype.getNextToken=function(){for(;!this.tokenQueue.length&&this.active;){this._hibernationSnapshot();var T=this._consume();this._ensureHibernation()||this[this.state](T)}return this.tokenQueue.shift()},Tokenizer.prototype.write=function(T,t){this.active=!0,this.preprocessor.write(T,t)},Tokenizer.prototype.insertHtmlAtCurrentPos=function(T){this.active=!0,this.preprocessor.insertHtmlAtCurrentPos(T)},Tokenizer.prototype._hibernationSnapshot=function(){this.consumedAfterSnapshot=0},Tokenizer.prototype._ensureHibernation=function(){if(this.preprocessor.endOfChunkHit){for(;this.consumedAfterSnapshot>0;this.consumedAfterSnapshot--)this.preprocessor.retreat();return this.active=!1,this.tokenQueue.push({type:Tokenizer.HIBERNATION_TOKEN}),!0}return!1},Tokenizer.prototype._consume=function(){return this.consumedAfterSnapshot++,this.preprocessor.advance()},Tokenizer.prototype._unconsume=function(){this.consumedAfterSnapshot--,this.preprocessor.retreat()},Tokenizer.prototype._unconsumeSeveral=function(T){for(;T--;)this._unconsume()},Tokenizer.prototype._reconsumeInState=function(T){this.state=T,this._unconsume()},Tokenizer.prototype._consumeSubsequentIfMatch=function(T,t,_){for(var E=0,A=!0,e=T.length,i=0,S=t,s=void 0;i<e;i++){if(i>0&&(S=this._consume(),E++),S===$.EOF){A=!1;break}if(s=T[i],S!==s&&(_||S!==toAsciiLowerCodePoint(s))){A=!1;break}}return A||this._unconsumeSeveral(E),A},Tokenizer.prototype._lookahead=function(){var T=this._consume();return this._unconsume(),T},Tokenizer.prototype.isTempBufferEqualToScriptString=function(){if(this.tempBuff.length!==$$.SCRIPT_STRING.length)return!1;for(var T=0;T<this.tempBuff.length;T++)if(this.tempBuff[T]!==$$.SCRIPT_STRING[T])return!1;return!0},Tokenizer.prototype._createStartTagToken=function(){this.currentToken={type:Tokenizer.START_TAG_TOKEN,tagName:"",selfClosing:!1,attrs:[]}},Tokenizer.prototype._createEndTagToken=function(){this.currentToken={type:Tokenizer.END_TAG_TOKEN,tagName:"",attrs:[]}},Tokenizer.prototype._createCommentToken=function(){this.currentToken={type:Tokenizer.COMMENT_TOKEN,data:""}},Tokenizer.prototype._createDoctypeToken=function(T){this.currentToken={type:Tokenizer.DOCTYPE_TOKEN,name:T,forceQuirks:!1,publicId:null,systemId:null}},Tokenizer.prototype._createCharacterToken=function(T,t){this.currentCharacterToken={type:T,chars:t}},Tokenizer.prototype._createAttr=function(T){this.currentAttr={name:T,value:""}},Tokenizer.prototype._isDuplicateAttr=function(){return null!==Tokenizer.getTokenAttr(this.currentToken,this.currentAttr.name)},Tokenizer.prototype._leaveAttrName=function(T){this.state=T,this._isDuplicateAttr()||this.currentToken.attrs.push(this.currentAttr)},Tokenizer.prototype._leaveAttrValue=function(T){this.state=T},Tokenizer.prototype._isAppropriateEndTagToken=function(){return this.lastStartTagName===this.currentToken.tagName},Tokenizer.prototype._emitCurrentToken=function(){this._emitCurrentCharacterToken(),this.currentToken.type===Tokenizer.START_TAG_TOKEN&&(this.lastStartTagName=this.currentToken.tagName),this.tokenQueue.push(this.currentToken),this.currentToken=null},Tokenizer.prototype._emitCurrentCharacterToken=function(){this.currentCharacterToken&&(this.tokenQueue.push(this.currentCharacterToken),this.currentCharacterToken=null)},Tokenizer.prototype._emitEOFToken=function(){this._emitCurrentCharacterToken(),this.tokenQueue.push({type:Tokenizer.EOF_TOKEN})},Tokenizer.prototype._appendCharToCurrentCharacterToken=function(T,t){this.currentCharacterToken&&this.currentCharacterToken.type!==T&&this._emitCurrentCharacterToken(),this.currentCharacterToken?this.currentCharacterToken.chars+=t:this._createCharacterToken(T,t)},Tokenizer.prototype._emitCodePoint=function(T){var t=Tokenizer.CHARACTER_TOKEN;isWhitespace(T)?t=Tokenizer.WHITESPACE_CHARACTER_TOKEN:T===$.NULL&&(t=Tokenizer.NULL_CHARACTER_TOKEN),this._appendCharToCurrentCharacterToken(t,toChar(T))},Tokenizer.prototype._emitSeveralCodePoints=function(T){for(var t=0;t<T.length;t++)this._emitCodePoint(T[t])},Tokenizer.prototype._emitChar=function(T){this._appendCharToCurrentCharacterToken(Tokenizer.CHARACTER_TOKEN,T)},Tokenizer.prototype._consumeNumericEntity=function(T){var t="",_=void 0;do{t+=toChar(this._consume()),_=this._lookahead()}while(_!==$.EOF&&isDigit(_,T));this._lookahead()===$.SEMICOLON&&this._consume();var E=parseInt(t,T?16:10),A=NUMERIC_ENTITY_REPLACEMENTS[E];return A||(isReservedCodePoint(E)?$.REPLACEMENT_CHARACTER:E)},Tokenizer.prototype._consumeNamedEntity=function(T,t){for(var _=null,E=0,A=T,e=NAMED_ENTITY_TRIE[A],i=1,S=!1;e&&A!==$.EOF;A=this._consume(),i++,e=e.l&&e.l[A])if(e.c&&(_=e.c,E=i,A===$.SEMICOLON)){S=!0;break}if(_){if(!S&&(this._unconsumeSeveral(i-E),t)){var s=this._lookahead();if(s===$.EQUALS_SIGN||isAsciiAlphaNumeric(s))return this._unconsumeSeveral(E),null}return _}return this._unconsumeSeveral(i),null},Tokenizer.prototype._consumeCharacterReference=function(T,t){if(isWhitespace(T)||T===$.GREATER_THAN_SIGN||T===$.AMPERSAND||T===this.additionalAllowedCp||T===$.EOF)return this._unconsume(),null;if(T===$.NUMBER_SIGN){var _=!1,E=this._lookahead();return E!==$.LATIN_SMALL_X&&E!==$.LATIN_CAPITAL_X||(this._consume(),_=!0),(E=this._lookahead())!==$.EOF&&isDigit(E,_)?[this._consumeNumericEntity(_)]:(this._unconsumeSeveral(_?2:1),null)}return this._consumeNamedEntity(T,t)};var _=Tokenizer.prototype;_[DATA_STATE]=function(T){this.preprocessor.dropParsedChunk(),T===$.AMPERSAND?this.state=CHARACTER_REFERENCE_IN_DATA_STATE:T===$.LESS_THAN_SIGN?this.state=TAG_OPEN_STATE:T===$.NULL?this._emitCodePoint(T):T===$.EOF?this._emitEOFToken():this._emitCodePoint(T)},_[CHARACTER_REFERENCE_IN_DATA_STATE]=function(T){this.additionalAllowedCp=void 0;var t=this._consumeCharacterReference(T,!1);this._ensureHibernation()||(t?this._emitSeveralCodePoints(t):this._emitChar("&"),this.state=DATA_STATE)},_[RCDATA_STATE]=function(T){this.preprocessor.dropParsedChunk(),T===$.AMPERSAND?this.state=CHARACTER_REFERENCE_IN_RCDATA_STATE:T===$.LESS_THAN_SIGN?this.state=RCDATA_LESS_THAN_SIGN_STATE:T===$.NULL?this._emitChar(UNICODE.REPLACEMENT_CHARACTER):T===$.EOF?this._emitEOFToken():this._emitCodePoint(T)},_[CHARACTER_REFERENCE_IN_RCDATA_STATE]=function(T){this.additionalAllowedCp=void 0;var t=this._consumeCharacterReference(T,!1);this._ensureHibernation()||(t?this._emitSeveralCodePoints(t):this._emitChar("&"),this.state=RCDATA_STATE)},_[RAWTEXT_STATE]=function(T){this.preprocessor.dropParsedChunk(),T===$.LESS_THAN_SIGN?this.state=RAWTEXT_LESS_THAN_SIGN_STATE:T===$.NULL?this._emitChar(UNICODE.REPLACEMENT_CHARACTER):T===$.EOF?this._emitEOFToken():this._emitCodePoint(T)},_[SCRIPT_DATA_STATE]=function(T){this.preprocessor.dropParsedChunk(),T===$.LESS_THAN_SIGN?this.state=SCRIPT_DATA_LESS_THAN_SIGN_STATE:T===$.NULL?this._emitChar(UNICODE.REPLACEMENT_CHARACTER):T===$.EOF?this._emitEOFToken():this._emitCodePoint(T)},_[PLAINTEXT_STATE]=function(T){this.preprocessor.dropParsedChunk(),T===$.NULL?this._emitChar(UNICODE.REPLACEMENT_CHARACTER):T===$.EOF?this._emitEOFToken():this._emitCodePoint(T)},_[TAG_OPEN_STATE]=function(T){T===$.EXCLAMATION_MARK?this.state=MARKUP_DECLARATION_OPEN_STATE:T===$.SOLIDUS?this.state=END_TAG_OPEN_STATE:isAsciiLetter(T)?(this._createStartTagToken(),this._reconsumeInState(TAG_NAME_STATE)):T===$.QUESTION_MARK?this._reconsumeInState(BOGUS_COMMENT_STATE):(this._emitChar("<"),this._reconsumeInState(DATA_STATE))},_[END_TAG_OPEN_STATE]=function(T){isAsciiLetter(T)?(this._createEndTagToken(),this._reconsumeInState(TAG_NAME_STATE)):T===$.GREATER_THAN_SIGN?this.state=DATA_STATE:T===$.EOF?(this._reconsumeInState(DATA_STATE),this._emitChar("<"),this._emitChar("/")):this._reconsumeInState(BOGUS_COMMENT_STATE)},_[TAG_NAME_STATE]=function(T){isWhitespace(T)?this.state=BEFORE_ATTRIBUTE_NAME_STATE:T===$.SOLIDUS?this.state=SELF_CLOSING_START_TAG_STATE:T===$.GREATER_THAN_SIGN?(this.state=DATA_STATE,this._emitCurrentToken()):isAsciiUpper(T)?this.currentToken.tagName+=toAsciiLowerChar(T):T===$.NULL?this.currentToken.tagName+=UNICODE.REPLACEMENT_CHARACTER:T===$.EOF?this._reconsumeInState(DATA_STATE):this.currentToken.tagName+=toChar(T)},_[RCDATA_LESS_THAN_SIGN_STATE]=function(T){T===$.SOLIDUS?(this.tempBuff=[],this.state=RCDATA_END_TAG_OPEN_STATE):(this._emitChar("<"),this._reconsumeInState(RCDATA_STATE))},_[RCDATA_END_TAG_OPEN_STATE]=function(T){isAsciiLetter(T)?(this._createEndTagToken(),this._reconsumeInState(RCDATA_END_TAG_NAME_STATE)):(this._emitChar("<"),this._emitChar("/"),this._reconsumeInState(RCDATA_STATE))},_[RCDATA_END_TAG_NAME_STATE]=function(T){if(isAsciiUpper(T))this.currentToken.tagName+=toAsciiLowerChar(T),this.tempBuff.push(T);else if(isAsciiLower(T))this.currentToken.tagName+=toChar(T),this.tempBuff.push(T);else{if(this._isAppropriateEndTagToken()){if(isWhitespace(T))return void(this.state=BEFORE_ATTRIBUTE_NAME_STATE);if(T===$.SOLIDUS)return void(this.state=SELF_CLOSING_START_TAG_STATE);if(T===$.GREATER_THAN_SIGN)return this.state=DATA_STATE,void this._emitCurrentToken()}this._emitChar("<"),this._emitChar("/"),this._emitSeveralCodePoints(this.tempBuff),this._reconsumeInState(RCDATA_STATE)}},_[RAWTEXT_LESS_THAN_SIGN_STATE]=function(T){T===$.SOLIDUS?(this.tempBuff=[],this.state=RAWTEXT_END_TAG_OPEN_STATE):(this._emitChar("<"),this._reconsumeInState(RAWTEXT_STATE))},_[RAWTEXT_END_TAG_OPEN_STATE]=function(T){isAsciiLetter(T)?(this._createEndTagToken(),this._reconsumeInState(RAWTEXT_END_TAG_NAME_STATE)):(this._emitChar("<"),this._emitChar("/"),this._reconsumeInState(RAWTEXT_STATE))},_[RAWTEXT_END_TAG_NAME_STATE]=function(T){if(isAsciiUpper(T))this.currentToken.tagName+=toAsciiLowerChar(T),this.tempBuff.push(T);else if(isAsciiLower(T))this.currentToken.tagName+=toChar(T),this.tempBuff.push(T);else{if(this._isAppropriateEndTagToken()){if(isWhitespace(T))return void(this.state=BEFORE_ATTRIBUTE_NAME_STATE);if(T===$.SOLIDUS)return void(this.state=SELF_CLOSING_START_TAG_STATE);if(T===$.GREATER_THAN_SIGN)return this._emitCurrentToken(),void(this.state=DATA_STATE)}this._emitChar("<"),this._emitChar("/"),this._emitSeveralCodePoints(this.tempBuff),this._reconsumeInState(RAWTEXT_STATE)}},_[SCRIPT_DATA_LESS_THAN_SIGN_STATE]=function(T){T===$.SOLIDUS?(this.tempBuff=[],this.state=SCRIPT_DATA_END_TAG_OPEN_STATE):T===$.EXCLAMATION_MARK?(this.state=SCRIPT_DATA_ESCAPE_START_STATE,this._emitChar("<"),this._emitChar("!")):(this._emitChar("<"),this._reconsumeInState(SCRIPT_DATA_STATE))},_[SCRIPT_DATA_END_TAG_OPEN_STATE]=function(T){isAsciiLetter(T)?(this._createEndTagToken(),this._reconsumeInState(SCRIPT_DATA_END_TAG_NAME_STATE)):(this._emitChar("<"),this._emitChar("/"),this._reconsumeInState(SCRIPT_DATA_STATE))},_[SCRIPT_DATA_END_TAG_NAME_STATE]=function(T){if(isAsciiUpper(T))this.currentToken.tagName+=toAsciiLowerChar(T),this.tempBuff.push(T);else if(isAsciiLower(T))this.currentToken.tagName+=toChar(T),this.tempBuff.push(T);else{if(this._isAppropriateEndTagToken()){if(isWhitespace(T))return void(this.state=BEFORE_ATTRIBUTE_NAME_STATE);if(T===$.SOLIDUS)return void(this.state=SELF_CLOSING_START_TAG_STATE);if(T===$.GREATER_THAN_SIGN)return this._emitCurrentToken(),void(this.state=DATA_STATE)}this._emitChar("<"),this._emitChar("/"),this._emitSeveralCodePoints(this.tempBuff),this._reconsumeInState(SCRIPT_DATA_STATE)}},_[SCRIPT_DATA_ESCAPE_START_STATE]=function(T){T===$.HYPHEN_MINUS?(this.state=SCRIPT_DATA_ESCAPE_START_DASH_STATE,this._emitChar("-")):this._reconsumeInState(SCRIPT_DATA_STATE)},_[SCRIPT_DATA_ESCAPE_START_DASH_STATE]=function(T){T===$.HYPHEN_MINUS?(this.state=SCRIPT_DATA_ESCAPED_DASH_DASH_STATE,this._emitChar("-")):this._reconsumeInState(SCRIPT_DATA_STATE)},_[SCRIPT_DATA_ESCAPED_STATE]=function(T){T===$.HYPHEN_MINUS?(this.state=SCRIPT_DATA_ESCAPED_DASH_STATE,this._emitChar("-")):T===$.LESS_THAN_SIGN?this.state=SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE:T===$.NULL?this._emitChar(UNICODE.REPLACEMENT_CHARACTER):T===$.EOF?this._reconsumeInState(DATA_STATE):this._emitCodePoint(T)},_[SCRIPT_DATA_ESCAPED_DASH_STATE]=function(T){T===$.HYPHEN_MINUS?(this.state=SCRIPT_DATA_ESCAPED_DASH_DASH_STATE,this._emitChar("-")):T===$.LESS_THAN_SIGN?this.state=SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE:T===$.NULL?(this.state=SCRIPT_DATA_ESCAPED_STATE,this._emitChar(UNICODE.REPLACEMENT_CHARACTER)):T===$.EOF?this._reconsumeInState(DATA_STATE):(this.state=SCRIPT_DATA_ESCAPED_STATE,this._emitCodePoint(T))},_[SCRIPT_DATA_ESCAPED_DASH_DASH_STATE]=function(T){T===$.HYPHEN_MINUS?this._emitChar("-"):T===$.LESS_THAN_SIGN?this.state=SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE:T===$.GREATER_THAN_SIGN?(this.state=SCRIPT_DATA_STATE,this._emitChar(">")):T===$.NULL?(this.state=SCRIPT_DATA_ESCAPED_STATE,this._emitChar(UNICODE.REPLACEMENT_CHARACTER)):T===$.EOF?this._reconsumeInState(DATA_STATE):(this.state=SCRIPT_DATA_ESCAPED_STATE,this._emitCodePoint(T))},_[SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE]=function(T){T===$.SOLIDUS?(this.tempBuff=[],this.state=SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE):isAsciiLetter(T)?(this.tempBuff=[],this._emitChar("<"),this._reconsumeInState(SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE)):(this._emitChar("<"),this._reconsumeInState(SCRIPT_DATA_ESCAPED_STATE))},_[SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE]=function(T){isAsciiLetter(T)?(this._createEndTagToken(),this._reconsumeInState(SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE)):(this._emitChar("<"),this._emitChar("/"),this._reconsumeInState(SCRIPT_DATA_ESCAPED_STATE))},_[SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE]=function(T){if(isAsciiUpper(T))this.currentToken.tagName+=toAsciiLowerChar(T),this.tempBuff.push(T);else if(isAsciiLower(T))this.currentToken.tagName+=toChar(T),this.tempBuff.push(T);else{if(this._isAppropriateEndTagToken()){if(isWhitespace(T))return void(this.state=BEFORE_ATTRIBUTE_NAME_STATE);if(T===$.SOLIDUS)return void(this.state=SELF_CLOSING_START_TAG_STATE);if(T===$.GREATER_THAN_SIGN)return this._emitCurrentToken(),void(this.state=DATA_STATE)}this._emitChar("<"),this._emitChar("/"),this._emitSeveralCodePoints(this.tempBuff),this._reconsumeInState(SCRIPT_DATA_ESCAPED_STATE)}},_[SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE]=function(T){isWhitespace(T)||T===$.SOLIDUS||T===$.GREATER_THAN_SIGN?(this.state=this.isTempBufferEqualToScriptString()?SCRIPT_DATA_DOUBLE_ESCAPED_STATE:SCRIPT_DATA_ESCAPED_STATE,this._emitCodePoint(T)):isAsciiUpper(T)?(this.tempBuff.push(toAsciiLowerCodePoint(T)),this._emitCodePoint(T)):isAsciiLower(T)?(this.tempBuff.push(T),this._emitCodePoint(T)):this._reconsumeInState(SCRIPT_DATA_ESCAPED_STATE)},_[SCRIPT_DATA_DOUBLE_ESCAPED_STATE]=function(T){T===$.HYPHEN_MINUS?(this.state=SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE,this._emitChar("-")):T===$.LESS_THAN_SIGN?(this.state=SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE,this._emitChar("<")):T===$.NULL?this._emitChar(UNICODE.REPLACEMENT_CHARACTER):T===$.EOF?this._reconsumeInState(DATA_STATE):this._emitCodePoint(T)},_[SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE]=function(T){T===$.HYPHEN_MINUS?(this.state=SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE,this._emitChar("-")):T===$.LESS_THAN_SIGN?(this.state=SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE,this._emitChar("<")):T===$.NULL?(this.state=SCRIPT_DATA_DOUBLE_ESCAPED_STATE,this._emitChar(UNICODE.REPLACEMENT_CHARACTER)):T===$.EOF?this._reconsumeInState(DATA_STATE):(this.state=SCRIPT_DATA_DOUBLE_ESCAPED_STATE,this._emitCodePoint(T))},_[SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE]=function(T){T===$.HYPHEN_MINUS?this._emitChar("-"):T===$.LESS_THAN_SIGN?(this.state=SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE,this._emitChar("<")):T===$.GREATER_THAN_SIGN?(this.state=SCRIPT_DATA_STATE,this._emitChar(">")):T===$.NULL?(this.state=SCRIPT_DATA_DOUBLE_ESCAPED_STATE,this._emitChar(UNICODE.REPLACEMENT_CHARACTER)):T===$.EOF?this._reconsumeInState(DATA_STATE):(this.state=SCRIPT_DATA_DOUBLE_ESCAPED_STATE,this._emitCodePoint(T))},_[SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE]=function(T){T===$.SOLIDUS?(this.tempBuff=[],this.state=SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE,this._emitChar("/")):this._reconsumeInState(SCRIPT_DATA_DOUBLE_ESCAPED_STATE)},_[SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE]=function(T){isWhitespace(T)||T===$.SOLIDUS||T===$.GREATER_THAN_SIGN?(this.state=this.isTempBufferEqualToScriptString()?SCRIPT_DATA_ESCAPED_STATE:SCRIPT_DATA_DOUBLE_ESCAPED_STATE,this._emitCodePoint(T)):isAsciiUpper(T)?(this.tempBuff.push(toAsciiLowerCodePoint(T)),this._emitCodePoint(T)):isAsciiLower(T)?(this.tempBuff.push(T),this._emitCodePoint(T)):this._reconsumeInState(SCRIPT_DATA_DOUBLE_ESCAPED_STATE)},_[BEFORE_ATTRIBUTE_NAME_STATE]=function(T){isWhitespace(T)||(T===$.SOLIDUS||T===$.GREATER_THAN_SIGN||T===$.EOF?this._reconsumeInState(AFTER_ATTRIBUTE_NAME_STATE):T===$.EQUALS_SIGN?(this._createAttr("="),this.state=ATTRIBUTE_NAME_STATE):(this._createAttr(""),this._reconsumeInState(ATTRIBUTE_NAME_STATE)))},_[ATTRIBUTE_NAME_STATE]=function(T){isWhitespace(T)||T===$.SOLIDUS||T===$.GREATER_THAN_SIGN||T===$.EOF?(this._leaveAttrName(AFTER_ATTRIBUTE_NAME_STATE),this._unconsume()):T===$.EQUALS_SIGN?this._leaveAttrName(BEFORE_ATTRIBUTE_VALUE_STATE):isAsciiUpper(T)?this.currentAttr.name+=toAsciiLowerChar(T):T===$.QUOTATION_MARK||T===$.APOSTROPHE||T===$.LESS_THAN_SIGN?this.currentAttr.name+=toChar(T):T===$.NULL?this.currentAttr.name+=UNICODE.REPLACEMENT_CHARACTER:this.currentAttr.name+=toChar(T)},_[AFTER_ATTRIBUTE_NAME_STATE]=function(T){isWhitespace(T)||(T===$.SOLIDUS?this.state=SELF_CLOSING_START_TAG_STATE:T===$.EQUALS_SIGN?this.state=BEFORE_ATTRIBUTE_VALUE_STATE:T===$.GREATER_THAN_SIGN?(this.state=DATA_STATE,this._emitCurrentToken()):T===$.EOF?this._reconsumeInState(DATA_STATE):(this._createAttr(""),this._reconsumeInState(ATTRIBUTE_NAME_STATE)))},_[BEFORE_ATTRIBUTE_VALUE_STATE]=function(T){isWhitespace(T)||(T===$.QUOTATION_MARK?this.state=ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE:T===$.APOSTROPHE?this.state=ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE:this._reconsumeInState(ATTRIBUTE_VALUE_UNQUOTED_STATE))},_[ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE]=function(T){T===$.QUOTATION_MARK?this.state=AFTER_ATTRIBUTE_VALUE_QUOTED_STATE:T===$.AMPERSAND?(this.additionalAllowedCp=$.QUOTATION_MARK,this.returnState=this.state,this.state=CHARACTER_REFERENCE_IN_ATTRIBUTE_VALUE_STATE):T===$.NULL?this.currentAttr.value+=UNICODE.REPLACEMENT_CHARACTER:T===$.EOF?this._reconsumeInState(DATA_STATE):this.currentAttr.value+=toChar(T)},_[ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE]=function(T){T===$.APOSTROPHE?this.state=AFTER_ATTRIBUTE_VALUE_QUOTED_STATE:T===$.AMPERSAND?(this.additionalAllowedCp=$.APOSTROPHE,this.returnState=this.state,this.state=CHARACTER_REFERENCE_IN_ATTRIBUTE_VALUE_STATE):T===$.NULL?this.currentAttr.value+=UNICODE.REPLACEMENT_CHARACTER:T===$.EOF?this._reconsumeInState(DATA_STATE):this.currentAttr.value+=toChar(T)},_[ATTRIBUTE_VALUE_UNQUOTED_STATE]=function(T){isWhitespace(T)?this._leaveAttrValue(BEFORE_ATTRIBUTE_NAME_STATE):T===$.AMPERSAND?(this.additionalAllowedCp=$.GREATER_THAN_SIGN,this.returnState=this.state,this.state=CHARACTER_REFERENCE_IN_ATTRIBUTE_VALUE_STATE):T===$.GREATER_THAN_SIGN?(this._leaveAttrValue(DATA_STATE),this._emitCurrentToken()):T===$.NULL?this.currentAttr.value+=UNICODE.REPLACEMENT_CHARACTER:T===$.QUOTATION_MARK||T===$.APOSTROPHE||T===$.LESS_THAN_SIGN||T===$.EQUALS_SIGN||T===$.GRAVE_ACCENT?this.currentAttr.value+=toChar(T):T===$.EOF?this._reconsumeInState(DATA_STATE):this.currentAttr.value+=toChar(T)},_[CHARACTER_REFERENCE_IN_ATTRIBUTE_VALUE_STATE]=function(T){var t=this._consumeCharacterReference(T,!0);if(!this._ensureHibernation()){if(t)for(var _=0;_<t.length;_++)this.currentAttr.value+=toChar(t[_]);else this.currentAttr.value+="&";this.state=this.returnState}},_[AFTER_ATTRIBUTE_VALUE_QUOTED_STATE]=function(T){isWhitespace(T)?this._leaveAttrValue(BEFORE_ATTRIBUTE_NAME_STATE):T===$.SOLIDUS?this._leaveAttrValue(SELF_CLOSING_START_TAG_STATE):T===$.GREATER_THAN_SIGN?(this._leaveAttrValue(DATA_STATE),this._emitCurrentToken()):T===$.EOF?this._reconsumeInState(DATA_STATE):this._reconsumeInState(BEFORE_ATTRIBUTE_NAME_STATE)},_[SELF_CLOSING_START_TAG_STATE]=function(T){T===$.GREATER_THAN_SIGN?(this.currentToken.selfClosing=!0,this.state=DATA_STATE,this._emitCurrentToken()):T===$.EOF?this._reconsumeInState(DATA_STATE):this._reconsumeInState(BEFORE_ATTRIBUTE_NAME_STATE)},_[BOGUS_COMMENT_STATE]=function(){this._createCommentToken(),this._reconsumeInState(BOGUS_COMMENT_STATE_CONTINUATION)},_[BOGUS_COMMENT_STATE_CONTINUATION]=function(T){for(;;){if(T===$.GREATER_THAN_SIGN){this.state=DATA_STATE;break}if(T===$.EOF){this._reconsumeInState(DATA_STATE);break}if(this.currentToken.data+=T===$.NULL?UNICODE.REPLACEMENT_CHARACTER:toChar(T),this._hibernationSnapshot(),T=this._consume(),this._ensureHibernation())return}this._emitCurrentToken()},_[MARKUP_DECLARATION_OPEN_STATE]=function(T){var t=this._consumeSubsequentIfMatch($$.DASH_DASH_STRING,T,!0),_=!t&&this._consumeSubsequentIfMatch($$.DOCTYPE_STRING,T,!1),E=!t&&!_&&this.allowCDATA&&this._consumeSubsequentIfMatch($$.CDATA_START_STRING,T,!0);this._ensureHibernation()||(t?(this._createCommentToken(),this.state=COMMENT_START_STATE):_?this.state=DOCTYPE_STATE:E?this.state=CDATA_SECTION_STATE:this._reconsumeInState(BOGUS_COMMENT_STATE))},_[COMMENT_START_STATE]=function(T){T===$.HYPHEN_MINUS?this.state=COMMENT_START_DASH_STATE:T===$.NULL?(this.currentToken.data+=UNICODE.REPLACEMENT_CHARACTER,this.state=COMMENT_STATE):T===$.GREATER_THAN_SIGN?(this.state=DATA_STATE,this._emitCurrentToken()):T===$.EOF?(this._emitCurrentToken(),this._reconsumeInState(DATA_STATE)):(this.currentToken.data+=toChar(T),this.state=COMMENT_STATE)},_[COMMENT_START_DASH_STATE]=function(T){T===$.HYPHEN_MINUS?this.state=COMMENT_END_STATE:T===$.NULL?(this.currentToken.data+="-",this.currentToken.data+=UNICODE.REPLACEMENT_CHARACTER,this.state=COMMENT_STATE):T===$.GREATER_THAN_SIGN?(this.state=DATA_STATE,this._emitCurrentToken()):T===$.EOF?(this._emitCurrentToken(),this._reconsumeInState(DATA_STATE)):(this.currentToken.data+="-",this.currentToken.data+=toChar(T),this.state=COMMENT_STATE)},_[COMMENT_STATE]=function(T){T===$.HYPHEN_MINUS?this.state=COMMENT_END_DASH_STATE:T===$.NULL?this.currentToken.data+=UNICODE.REPLACEMENT_CHARACTER:T===$.EOF?(this._emitCurrentToken(),this._reconsumeInState(DATA_STATE)):this.currentToken.data+=toChar(T)},_[COMMENT_END_DASH_STATE]=function(T){T===$.HYPHEN_MINUS?this.state=COMMENT_END_STATE:T===$.NULL?(this.currentToken.data+="-",this.currentToken.data+=UNICODE.REPLACEMENT_CHARACTER,this.state=COMMENT_STATE):T===$.EOF?(this._emitCurrentToken(),this._reconsumeInState(DATA_STATE)):(this.currentToken.data+="-",this.currentToken.data+=toChar(T),this.state=COMMENT_STATE)},_[COMMENT_END_STATE]=function(T){T===$.GREATER_THAN_SIGN?(this.state=DATA_STATE,this._emitCurrentToken()):T===$.EXCLAMATION_MARK?this.state=COMMENT_END_BANG_STATE:T===$.HYPHEN_MINUS?this.currentToken.data+="-":T===$.NULL?(this.currentToken.data+="--",this.currentToken.data+=UNICODE.REPLACEMENT_CHARACTER,this.state=COMMENT_STATE):T===$.EOF?(this._reconsumeInState(DATA_STATE),this._emitCurrentToken()):(this.currentToken.data+="--",this.currentToken.data+=toChar(T),this.state=COMMENT_STATE)},_[COMMENT_END_BANG_STATE]=function(T){T===$.HYPHEN_MINUS?(this.currentToken.data+="--!",this.state=COMMENT_END_DASH_STATE):T===$.GREATER_THAN_SIGN?(this.state=DATA_STATE,this._emitCurrentToken()):T===$.NULL?(this.currentToken.data+="--!",this.currentToken.data+=UNICODE.REPLACEMENT_CHARACTER,this.state=COMMENT_STATE):T===$.EOF?(this._emitCurrentToken(),this._reconsumeInState(DATA_STATE)):(this.currentToken.data+="--!",this.currentToken.data+=toChar(T),this.state=COMMENT_STATE)},_[DOCTYPE_STATE]=function(T){isWhitespace(T)||(T===$.GREATER_THAN_SIGN?(this._createDoctypeToken(null),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this.state=DATA_STATE):T===$.EOF?(this._createDoctypeToken(null),this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this._reconsumeInState(DATA_STATE)):(this._createDoctypeToken(""),this._reconsumeInState(DOCTYPE_NAME_STATE)))},_[DOCTYPE_NAME_STATE]=function(T){isWhitespace(T)||T===$.GREATER_THAN_SIGN||T===$.EOF?this._reconsumeInState(AFTER_DOCTYPE_NAME_STATE):isAsciiUpper(T)?this.currentToken.name+=toAsciiLowerChar(T):T===$.NULL?this.currentToken.name+=UNICODE.REPLACEMENT_CHARACTER:this.currentToken.name+=toChar(T)},_[AFTER_DOCTYPE_NAME_STATE]=function(T){if(!isWhitespace(T))if(T===$.GREATER_THAN_SIGN)this.state=DATA_STATE,this._emitCurrentToken();else{var t=this._consumeSubsequentIfMatch($$.PUBLIC_STRING,T,!1),_=!t&&this._consumeSubsequentIfMatch($$.SYSTEM_STRING,T,!1);this._ensureHibernation()||(t?this.state=BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE:_?this.state=BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE:(this.currentToken.forceQuirks=!0,this.state=BOGUS_DOCTYPE_STATE))}},_[BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE]=function(T){isWhitespace(T)||(T===$.QUOTATION_MARK?(this.currentToken.publicId="",this.state=DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE):T===$.APOSTROPHE?(this.currentToken.publicId="",this.state=DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE):(this.currentToken.forceQuirks=!0,this._reconsumeInState(BOGUS_DOCTYPE_STATE)))},_[DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE]=function(T){T===$.QUOTATION_MARK?this.state=BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE:T===$.NULL?this.currentToken.publicId+=UNICODE.REPLACEMENT_CHARACTER:T===$.GREATER_THAN_SIGN?(this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this.state=DATA_STATE):T===$.EOF?(this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this._reconsumeInState(DATA_STATE)):this.currentToken.publicId+=toChar(T)},_[DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE]=function(T){T===$.APOSTROPHE?this.state=BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE:T===$.NULL?this.currentToken.publicId+=UNICODE.REPLACEMENT_CHARACTER:T===$.GREATER_THAN_SIGN?(this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this.state=DATA_STATE):T===$.EOF?(this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this._reconsumeInState(DATA_STATE)):this.currentToken.publicId+=toChar(T)},_[BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE]=function(T){isWhitespace(T)||(T===$.GREATER_THAN_SIGN?(this._emitCurrentToken(),this.state=DATA_STATE):T===$.QUOTATION_MARK?(this.currentToken.systemId="",this.state=DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE):T===$.APOSTROPHE?(this.currentToken.systemId="",this.state=DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE):(this.currentToken.forceQuirks=!0,this._reconsumeInState(BOGUS_DOCTYPE_STATE)))},_[BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE]=function(T){isWhitespace(T)||(T===$.QUOTATION_MARK?(this.currentToken.systemId="",this.state=DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE):T===$.APOSTROPHE?(this.currentToken.systemId="",this.state=DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE):(this.currentToken.forceQuirks=!0,this._reconsumeInState(BOGUS_DOCTYPE_STATE)))},_[DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE]=function(T){T===$.QUOTATION_MARK?this.state=AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE:T===$.GREATER_THAN_SIGN?(this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this.state=DATA_STATE):T===$.NULL?this.currentToken.systemId+=UNICODE.REPLACEMENT_CHARACTER:T===$.EOF?(this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this._reconsumeInState(DATA_STATE)):this.currentToken.systemId+=toChar(T)},_[DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE]=function(T){T===$.APOSTROPHE?this.state=AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE:T===$.GREATER_THAN_SIGN?(this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this.state=DATA_STATE):T===$.NULL?this.currentToken.systemId+=UNICODE.REPLACEMENT_CHARACTER:T===$.EOF?(this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this._reconsumeInState(DATA_STATE)):this.currentToken.systemId+=toChar(T)},_[AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE]=function(T){isWhitespace(T)||(T===$.GREATER_THAN_SIGN?(this._emitCurrentToken(),this.state=DATA_STATE):T===$.EOF?(this.currentToken.forceQuirks=!0,this._emitCurrentToken(),this._reconsumeInState(DATA_STATE)):this.state=BOGUS_DOCTYPE_STATE)},_[BOGUS_DOCTYPE_STATE]=function(T){T===$.GREATER_THAN_SIGN?(this._emitCurrentToken(),this.state=DATA_STATE):T===$.EOF&&(this._emitCurrentToken(),this._reconsumeInState(DATA_STATE))},_[CDATA_SECTION_STATE]=function(T){for(;;){if(T===$.EOF){this._reconsumeInState(DATA_STATE);break}var t=this._consumeSubsequentIfMatch($$.CDATA_END_STRING,T,!0);if(this._ensureHibernation())break;if(t){this.state=DATA_STATE;break}if(this._emitCodePoint(T),this._hibernationSnapshot(),T=this._consume(),this._ensureHibernation())break}};

},{"../common/unicode":127,"../location_info/tokenizer_mixin":129,"./named_entity_trie":134,"./preprocessor":135}],134:[function(require,module,exports){
"use strict";module.exports={65:{l:{69:{l:{108:{l:{105:{l:{103:{l:{59:{c:[198]}},c:[198]}}}}}}},77:{l:{80:{l:{59:{c:[38]}},c:[38]}}},97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[193]}},c:[193]}}}}}}}}},98:{l:{114:{l:{101:{l:{118:{l:{101:{l:{59:{c:[258]}}}}}}}}}}},99:{l:{105:{l:{114:{l:{99:{l:{59:{c:[194]}},c:[194]}}}}},121:{l:{59:{c:[1040]}}}}},102:{l:{114:{l:{59:{c:[120068]}}}}},103:{l:{114:{l:{97:{l:{118:{l:{101:{l:{59:{c:[192]}},c:[192]}}}}}}}}},108:{l:{112:{l:{104:{l:{97:{l:{59:{c:[913]}}}}}}}}},109:{l:{97:{l:{99:{l:{114:{l:{59:{c:[256]}}}}}}}}},110:{l:{100:{l:{59:{c:[10835]}}}}},111:{l:{103:{l:{111:{l:{110:{l:{59:{c:[260]}}}}}}},112:{l:{102:{l:{59:{c:[120120]}}}}}}},112:{l:{112:{l:{108:{l:{121:{l:{70:{l:{117:{l:{110:{l:{99:{l:{116:{l:{105:{l:{111:{l:{110:{l:{59:{c:[8289]}}}}}}}}}}}}}}}}}}}}}}}}},114:{l:{105:{l:{110:{l:{103:{l:{59:{c:[197]}},c:[197]}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119964]}}}}},115:{l:{105:{l:{103:{l:{110:{l:{59:{c:[8788]}}}}}}}}}}},116:{l:{105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[195]}},c:[195]}}}}}}}}},117:{l:{109:{l:{108:{l:{59:{c:[196]}},c:[196]}}}}}}},66:{l:{97:{l:{99:{l:{107:{l:{115:{l:{108:{l:{97:{l:{115:{l:{104:{l:{59:{c:[8726]}}}}}}}}}}}}}}},114:{l:{118:{l:{59:{c:[10983]}}},119:{l:{101:{l:{100:{l:{59:{c:[8966]}}}}}}}}}}},99:{l:{121:{l:{59:{c:[1041]}}}}},101:{l:{99:{l:{97:{l:{117:{l:{115:{l:{101:{l:{59:{c:[8757]}}}}}}}}}}},114:{l:{110:{l:{111:{l:{117:{l:{108:{l:{108:{l:{105:{l:{115:{l:{59:{c:[8492]}}}}}}}}}}}}}}}}},116:{l:{97:{l:{59:{c:[914]}}}}}}},102:{l:{114:{l:{59:{c:[120069]}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120121]}}}}}}},114:{l:{101:{l:{118:{l:{101:{l:{59:{c:[728]}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[8492]}}}}}}},117:{l:{109:{l:{112:{l:{101:{l:{113:{l:{59:{c:[8782]}}}}}}}}}}}}},67:{l:{72:{l:{99:{l:{121:{l:{59:{c:[1063]}}}}}}},79:{l:{80:{l:{89:{l:{59:{c:[169]}},c:[169]}}}}},97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[262]}}}}}}}}},112:{l:{59:{c:[8914]},105:{l:{116:{l:{97:{l:{108:{l:{68:{l:{105:{l:{102:{l:{102:{l:{101:{l:{114:{l:{101:{l:{110:{l:{116:{l:{105:{l:{97:{l:{108:{l:{68:{l:{59:{c:[8517]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},121:{l:{108:{l:{101:{l:{121:{l:{115:{l:{59:{c:[8493]}}}}}}}}}}}}},99:{l:{97:{l:{114:{l:{111:{l:{110:{l:{59:{c:[268]}}}}}}}}},101:{l:{100:{l:{105:{l:{108:{l:{59:{c:[199]}},c:[199]}}}}}}},105:{l:{114:{l:{99:{l:{59:{c:[264]}}}}}}},111:{l:{110:{l:{105:{l:{110:{l:{116:{l:{59:{c:[8752]}}}}}}}}}}}}},100:{l:{111:{l:{116:{l:{59:{c:[266]}}}}}}},101:{l:{100:{l:{105:{l:{108:{l:{108:{l:{97:{l:{59:{c:[184]}}}}}}}}}}},110:{l:{116:{l:{101:{l:{114:{l:{68:{l:{111:{l:{116:{l:{59:{c:[183]}}}}}}}}}}}}}}}}},102:{l:{114:{l:{59:{c:[8493]}}}}},104:{l:{105:{l:{59:{c:[935]}}}}},105:{l:{114:{l:{99:{l:{108:{l:{101:{l:{68:{l:{111:{l:{116:{l:{59:{c:[8857]}}}}}}},77:{l:{105:{l:{110:{l:{117:{l:{115:{l:{59:{c:[8854]}}}}}}}}}}},80:{l:{108:{l:{117:{l:{115:{l:{59:{c:[8853]}}}}}}}}},84:{l:{105:{l:{109:{l:{101:{l:{115:{l:{59:{c:[8855]}}}}}}}}}}}}}}}}}}}}},108:{l:{111:{l:{99:{l:{107:{l:{119:{l:{105:{l:{115:{l:{101:{l:{67:{l:{111:{l:{110:{l:{116:{l:{111:{l:{117:{l:{114:{l:{73:{l:{110:{l:{116:{l:{101:{l:{103:{l:{114:{l:{97:{l:{108:{l:{59:{c:[8754]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},115:{l:{101:{l:{67:{l:{117:{l:{114:{l:{108:{l:{121:{l:{68:{l:{111:{l:{117:{l:{98:{l:{108:{l:{101:{l:{81:{l:{117:{l:{111:{l:{116:{l:{101:{l:{59:{c:[8221]}}}}}}}}}}}}}}}}}}}}}}},81:{l:{117:{l:{111:{l:{116:{l:{101:{l:{59:{c:[8217]}}}}}}}}}}}}}}}}}}}}}}}}}}}}},111:{l:{108:{l:{111:{l:{110:{l:{59:{c:[8759]},101:{l:{59:{c:[10868]}}}}}}}}},110:{l:{103:{l:{114:{l:{117:{l:{101:{l:{110:{l:{116:{l:{59:{c:[8801]}}}}}}}}}}}}},105:{l:{110:{l:{116:{l:{59:{c:[8751]}}}}}}},116:{l:{111:{l:{117:{l:{114:{l:{73:{l:{110:{l:{116:{l:{101:{l:{103:{l:{114:{l:{97:{l:{108:{l:{59:{c:[8750]}}}}}}}}}}}}}}}}}}}}}}}}}}},112:{l:{102:{l:{59:{c:[8450]}}},114:{l:{111:{l:{100:{l:{117:{l:{99:{l:{116:{l:{59:{c:[8720]}}}}}}}}}}}}}}},117:{l:{110:{l:{116:{l:{101:{l:{114:{l:{67:{l:{108:{l:{111:{l:{99:{l:{107:{l:{119:{l:{105:{l:{115:{l:{101:{l:{67:{l:{111:{l:{110:{l:{116:{l:{111:{l:{117:{l:{114:{l:{73:{l:{110:{l:{116:{l:{101:{l:{103:{l:{114:{l:{97:{l:{108:{l:{59:{c:[8755]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},114:{l:{111:{l:{115:{l:{115:{l:{59:{c:[10799]}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119966]}}}}}}},117:{l:{112:{l:{59:{c:[8915]},67:{l:{97:{l:{112:{l:{59:{c:[8781]}}}}}}}}}}}}},68:{l:{68:{l:{59:{c:[8517]},111:{l:{116:{l:{114:{l:{97:{l:{104:{l:{100:{l:{59:{c:[10513]}}}}}}}}}}}}}}},74:{l:{99:{l:{121:{l:{59:{c:[1026]}}}}}}},83:{l:{99:{l:{121:{l:{59:{c:[1029]}}}}}}},90:{l:{99:{l:{121:{l:{59:{c:[1039]}}}}}}},97:{l:{103:{l:{103:{l:{101:{l:{114:{l:{59:{c:[8225]}}}}}}}}},114:{l:{114:{l:{59:{c:[8609]}}}}},115:{l:{104:{l:{118:{l:{59:{c:[10980]}}}}}}}}},99:{l:{97:{l:{114:{l:{111:{l:{110:{l:{59:{c:[270]}}}}}}}}},121:{l:{59:{c:[1044]}}}}},101:{l:{108:{l:{59:{c:[8711]},116:{l:{97:{l:{59:{c:[916]}}}}}}}}},102:{l:{114:{l:{59:{c:[120071]}}}}},105:{l:{97:{l:{99:{l:{114:{l:{105:{l:{116:{l:{105:{l:{99:{l:{97:{l:{108:{l:{65:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[180]}}}}}}}}}}},68:{l:{111:{l:{116:{l:{59:{c:[729]}}},117:{l:{98:{l:{108:{l:{101:{l:{65:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[733]}}}}}}}}}}}}}}}}}}}}}}},71:{l:{114:{l:{97:{l:{118:{l:{101:{l:{59:{c:[96]}}}}}}}}}}},84:{l:{105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[732]}}}}}}}}}}}}}}}}}}}}}}}}}}},109:{l:{111:{l:{110:{l:{100:{l:{59:{c:[8900]}}}}}}}}}}},102:{l:{102:{l:{101:{l:{114:{l:{101:{l:{110:{l:{116:{l:{105:{l:{97:{l:{108:{l:{68:{l:{59:{c:[8518]}}}}}}}}}}}}}}}}}}}}}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120123]}}}}},116:{l:{59:{c:[168]},68:{l:{111:{l:{116:{l:{59:{c:[8412]}}}}}}},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8784]}}}}}}}}}}}}},117:{l:{98:{l:{108:{l:{101:{l:{67:{l:{111:{l:{110:{l:{116:{l:{111:{l:{117:{l:{114:{l:{73:{l:{110:{l:{116:{l:{101:{l:{103:{l:{114:{l:{97:{l:{108:{l:{59:{c:[8751]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},68:{l:{111:{l:{116:{l:{59:{c:[168]}}},119:{l:{110:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8659]}}}}}}}}}}}}}}}}}}},76:{l:{101:{l:{102:{l:{116:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8656]}}}}}}}}}}},82:{l:{105:{l:{103:{l:{104:{l:{116:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8660]}}}}}}}}}}}}}}}}}}}}},84:{l:{101:{l:{101:{l:{59:{c:[10980]}}}}}}}}}}}}},111:{l:{110:{l:{103:{l:{76:{l:{101:{l:{102:{l:{116:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[10232]}}}}}}}}}}},82:{l:{105:{l:{103:{l:{104:{l:{116:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[10234]}}}}}}}}}}}}}}}}}}}}}}}}}}}}},82:{l:{105:{l:{103:{l:{104:{l:{116:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[10233]}}}}}}}}}}}}}}}}}}}}}}}}}}}}},82:{l:{105:{l:{103:{l:{104:{l:{116:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8658]}}}}}}}}}}},84:{l:{101:{l:{101:{l:{59:{c:[8872]}}}}}}}}}}}}}}}}},85:{l:{112:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8657]}}}}}}}}}}},68:{l:{111:{l:{119:{l:{110:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8661]}}}}}}}}}}}}}}}}}}}}}}},86:{l:{101:{l:{114:{l:{116:{l:{105:{l:{99:{l:{97:{l:{108:{l:{66:{l:{97:{l:{114:{l:{59:{c:[8741]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},119:{l:{110:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8595]},66:{l:{97:{l:{114:{l:{59:{c:[10515]}}}}}}},85:{l:{112:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8693]}}}}}}}}}}}}}}}}}}}}}}}}},66:{l:{114:{l:{101:{l:{118:{l:{101:{l:{59:{c:[785]}}}}}}}}}}},76:{l:{101:{l:{102:{l:{116:{l:{82:{l:{105:{l:{103:{l:{104:{l:{116:{l:{86:{l:{101:{l:{99:{l:{116:{l:{111:{l:{114:{l:{59:{c:[10576]}}}}}}}}}}}}}}}}}}}}}}},84:{l:{101:{l:{101:{l:{86:{l:{101:{l:{99:{l:{116:{l:{111:{l:{114:{l:{59:{c:[10590]}}}}}}}}}}}}}}}}}}},86:{l:{101:{l:{99:{l:{116:{l:{111:{l:{114:{l:{59:{c:[8637]},66:{l:{97:{l:{114:{l:{59:{c:[10582]}}}}}}}}}}}}}}}}}}}}}}}}}}},82:{l:{105:{l:{103:{l:{104:{l:{116:{l:{84:{l:{101:{l:{101:{l:{86:{l:{101:{l:{99:{l:{116:{l:{111:{l:{114:{l:{59:{c:[10591]}}}}}}}}}}}}}}}}}}},86:{l:{101:{l:{99:{l:{116:{l:{111:{l:{114:{l:{59:{c:[8641]},66:{l:{97:{l:{114:{l:{59:{c:[10583]}}}}}}}}}}}}}}}}}}}}}}}}}}}}},84:{l:{101:{l:{101:{l:{59:{c:[8868]},65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8615]}}}}}}}}}}}}}}}}},97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8659]}}}}}}}}}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119967]}}}}},116:{l:{114:{l:{111:{l:{107:{l:{59:{c:[272]}}}}}}}}}}}}},69:{l:{78:{l:{71:{l:{59:{c:[330]}}}}},84:{l:{72:{l:{59:{c:[208]}},c:[208]}}},97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[201]}},c:[201]}}}}}}}}},99:{l:{97:{l:{114:{l:{111:{l:{110:{l:{59:{c:[282]}}}}}}}}},105:{l:{114:{l:{99:{l:{59:{c:[202]}},c:[202]}}}}},121:{l:{59:{c:[1069]}}}}},100:{l:{111:{l:{116:{l:{59:{c:[278]}}}}}}},102:{l:{114:{l:{59:{c:[120072]}}}}},103:{l:{114:{l:{97:{l:{118:{l:{101:{l:{59:{c:[200]}},c:[200]}}}}}}}}},108:{l:{101:{l:{109:{l:{101:{l:{110:{l:{116:{l:{59:{c:[8712]}}}}}}}}}}}}},109:{l:{97:{l:{99:{l:{114:{l:{59:{c:[274]}}}}}}},112:{l:{116:{l:{121:{l:{83:{l:{109:{l:{97:{l:{108:{l:{108:{l:{83:{l:{113:{l:{117:{l:{97:{l:{114:{l:{101:{l:{59:{c:[9723]}}}}}}}}}}}}}}}}}}}}}}},86:{l:{101:{l:{114:{l:{121:{l:{83:{l:{109:{l:{97:{l:{108:{l:{108:{l:{83:{l:{113:{l:{117:{l:{97:{l:{114:{l:{101:{l:{59:{c:[9643]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},111:{l:{103:{l:{111:{l:{110:{l:{59:{c:[280]}}}}}}},112:{l:{102:{l:{59:{c:[120124]}}}}}}},112:{l:{115:{l:{105:{l:{108:{l:{111:{l:{110:{l:{59:{c:[917]}}}}}}}}}}}}},113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[10869]},84:{l:{105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[8770]}}}}}}}}}}}}}}},105:{l:{108:{l:{105:{l:{98:{l:{114:{l:{105:{l:{117:{l:{109:{l:{59:{c:[8652]}}}}}}}}}}}}}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[8496]}}}}},105:{l:{109:{l:{59:{c:[10867]}}}}}}},116:{l:{97:{l:{59:{c:[919]}}}}},117:{l:{109:{l:{108:{l:{59:{c:[203]}},c:[203]}}}}},120:{l:{105:{l:{115:{l:{116:{l:{115:{l:{59:{c:[8707]}}}}}}}}},112:{l:{111:{l:{110:{l:{101:{l:{110:{l:{116:{l:{105:{l:{97:{l:{108:{l:{69:{l:{59:{c:[8519]}}}}}}}}}}}}}}}}}}}}}}}}},70:{l:{99:{l:{121:{l:{59:{c:[1060]}}}}},102:{l:{114:{l:{59:{c:[120073]}}}}},105:{l:{108:{l:{108:{l:{101:{l:{100:{l:{83:{l:{109:{l:{97:{l:{108:{l:{108:{l:{83:{l:{113:{l:{117:{l:{97:{l:{114:{l:{101:{l:{59:{c:[9724]}}}}}}}}}}}}}}}}}}}}}}},86:{l:{101:{l:{114:{l:{121:{l:{83:{l:{109:{l:{97:{l:{108:{l:{108:{l:{83:{l:{113:{l:{117:{l:{97:{l:{114:{l:{101:{l:{59:{c:[9642]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120125]}}}}},114:{l:{65:{l:{108:{l:{108:{l:{59:{c:[8704]}}}}}}}}},117:{l:{114:{l:{105:{l:{101:{l:{114:{l:{116:{l:{114:{l:{102:{l:{59:{c:[8497]}}}}}}}}}}}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[8497]}}}}}}}}},71:{l:{74:{l:{99:{l:{121:{l:{59:{c:[1027]}}}}}}},84:{l:{59:{c:[62]}},c:[62]},97:{l:{109:{l:{109:{l:{97:{l:{59:{c:[915]},100:{l:{59:{c:[988]}}}}}}}}}}},98:{l:{114:{l:{101:{l:{118:{l:{101:{l:{59:{c:[286]}}}}}}}}}}},99:{l:{101:{l:{100:{l:{105:{l:{108:{l:{59:{c:[290]}}}}}}}}},105:{l:{114:{l:{99:{l:{59:{c:[284]}}}}}}},121:{l:{59:{c:[1043]}}}}},100:{l:{111:{l:{116:{l:{59:{c:[288]}}}}}}},102:{l:{114:{l:{59:{c:[120074]}}}}},103:{l:{59:{c:[8921]}}},111:{l:{112:{l:{102:{l:{59:{c:[120126]}}}}}}},114:{l:{101:{l:{97:{l:{116:{l:{101:{l:{114:{l:{69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8805]},76:{l:{101:{l:{115:{l:{115:{l:{59:{c:[8923]}}}}}}}}}}}}}}}}}}},70:{l:{117:{l:{108:{l:{108:{l:{69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8807]}}}}}}}}}}}}}}}}}}},71:{l:{114:{l:{101:{l:{97:{l:{116:{l:{101:{l:{114:{l:{59:{c:[10914]}}}}}}}}}}}}}}},76:{l:{101:{l:{115:{l:{115:{l:{59:{c:[8823]}}}}}}}}},83:{l:{108:{l:{97:{l:{110:{l:{116:{l:{69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[10878]}}}}}}}}}}}}}}}}}}}}},84:{l:{105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[8819]}}}}}}}}}}}}}}}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119970]}}}}}}},116:{l:{59:{c:[8811]}}}}},72:{l:{65:{l:{82:{l:{68:{l:{99:{l:{121:{l:{59:{c:[1066]}}}}}}}}}}},97:{l:{99:{l:{101:{l:{107:{l:{59:{c:[711]}}}}}}},116:{l:{59:{c:[94]}}}}},99:{l:{105:{l:{114:{l:{99:{l:{59:{c:[292]}}}}}}}}},102:{l:{114:{l:{59:{c:[8460]}}}}},105:{l:{108:{l:{98:{l:{101:{l:{114:{l:{116:{l:{83:{l:{112:{l:{97:{l:{99:{l:{101:{l:{59:{c:[8459]}}}}}}}}}}}}}}}}}}}}}}},111:{l:{112:{l:{102:{l:{59:{c:[8461]}}}}},114:{l:{105:{l:{122:{l:{111:{l:{110:{l:{116:{l:{97:{l:{108:{l:{76:{l:{105:{l:{110:{l:{101:{l:{59:{c:[9472]}}}}}}}}}}}}}}}}}}}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[8459]}}}}},116:{l:{114:{l:{111:{l:{107:{l:{59:{c:[294]}}}}}}}}}}},117:{l:{109:{l:{112:{l:{68:{l:{111:{l:{119:{l:{110:{l:{72:{l:{117:{l:{109:{l:{112:{l:{59:{c:[8782]}}}}}}}}}}}}}}}}},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8783]}}}}}}}}}}}}}}}}}}},73:{l:{69:{l:{99:{l:{121:{l:{59:{c:[1045]}}}}}}},74:{l:{108:{l:{105:{l:{103:{l:{59:{c:[306]}}}}}}}}},79:{l:{99:{l:{121:{l:{59:{c:[1025]}}}}}}},97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[205]}},c:[205]}}}}}}}}},99:{l:{105:{l:{114:{l:{99:{l:{59:{c:[206]}},c:[206]}}}}},121:{l:{59:{c:[1048]}}}}},100:{l:{111:{l:{116:{l:{59:{c:[304]}}}}}}},102:{l:{114:{l:{59:{c:[8465]}}}}},103:{l:{114:{l:{97:{l:{118:{l:{101:{l:{59:{c:[204]}},c:[204]}}}}}}}}},109:{l:{59:{c:[8465]},97:{l:{99:{l:{114:{l:{59:{c:[298]}}}}},103:{l:{105:{l:{110:{l:{97:{l:{114:{l:{121:{l:{73:{l:{59:{c:[8520]}}}}}}}}}}}}}}}}},112:{l:{108:{l:{105:{l:{101:{l:{115:{l:{59:{c:[8658]}}}}}}}}}}}}},110:{l:{116:{l:{59:{c:[8748]},101:{l:{103:{l:{114:{l:{97:{l:{108:{l:{59:{c:[8747]}}}}}}}}},114:{l:{115:{l:{101:{l:{99:{l:{116:{l:{105:{l:{111:{l:{110:{l:{59:{c:[8898]}}}}}}}}}}}}}}}}}}}}},118:{l:{105:{l:{115:{l:{105:{l:{98:{l:{108:{l:{101:{l:{67:{l:{111:{l:{109:{l:{109:{l:{97:{l:{59:{c:[8291]}}}}}}}}}}},84:{l:{105:{l:{109:{l:{101:{l:{115:{l:{59:{c:[8290]}}}}}}}}}}}}}}}}}}}}}}}}}}},111:{l:{103:{l:{111:{l:{110:{l:{59:{c:[302]}}}}}}},112:{l:{102:{l:{59:{c:[120128]}}}}},116:{l:{97:{l:{59:{c:[921]}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[8464]}}}}}}},116:{l:{105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[296]}}}}}}}}}}},117:{l:{107:{l:{99:{l:{121:{l:{59:{c:[1030]}}}}}}},109:{l:{108:{l:{59:{c:[207]}},c:[207]}}}}}}},74:{l:{99:{l:{105:{l:{114:{l:{99:{l:{59:{c:[308]}}}}}}},121:{l:{59:{c:[1049]}}}}},102:{l:{114:{l:{59:{c:[120077]}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120129]}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119973]}}}}},101:{l:{114:{l:{99:{l:{121:{l:{59:{c:[1032]}}}}}}}}}}},117:{l:{107:{l:{99:{l:{121:{l:{59:{c:[1028]}}}}}}}}}}},75:{l:{72:{l:{99:{l:{121:{l:{59:{c:[1061]}}}}}}},74:{l:{99:{l:{121:{l:{59:{c:[1036]}}}}}}},97:{l:{112:{l:{112:{l:{97:{l:{59:{c:[922]}}}}}}}}},99:{l:{101:{l:{100:{l:{105:{l:{108:{l:{59:{c:[310]}}}}}}}}},121:{l:{59:{c:[1050]}}}}},102:{l:{114:{l:{59:{c:[120078]}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120130]}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119974]}}}}}}}}},76:{l:{74:{l:{99:{l:{121:{l:{59:{c:[1033]}}}}}}},84:{l:{59:{c:[60]}},c:[60]},97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[313]}}}}}}}}},109:{l:{98:{l:{100:{l:{97:{l:{59:{c:[923]}}}}}}}}},110:{l:{103:{l:{59:{c:[10218]}}}}},112:{l:{108:{l:{97:{l:{99:{l:{101:{l:{116:{l:{114:{l:{102:{l:{59:{c:[8466]}}}}}}}}}}}}}}}}},114:{l:{114:{l:{59:{c:[8606]}}}}}}},99:{l:{97:{l:{114:{l:{111:{l:{110:{l:{59:{c:[317]}}}}}}}}},101:{l:{100:{l:{105:{l:{108:{l:{59:{c:[315]}}}}}}}}},121:{l:{59:{c:[1051]}}}}},101:{l:{102:{l:{116:{l:{65:{l:{110:{l:{103:{l:{108:{l:{101:{l:{66:{l:{114:{l:{97:{l:{99:{l:{107:{l:{101:{l:{116:{l:{59:{c:[10216]}}}}}}}}}}}}}}}}}}}}}}},114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8592]},66:{l:{97:{l:{114:{l:{59:{c:[8676]}}}}}}},82:{l:{105:{l:{103:{l:{104:{l:{116:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8646]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},67:{l:{101:{l:{105:{l:{108:{l:{105:{l:{110:{l:{103:{l:{59:{c:[8968]}}}}}}}}}}}}}}},68:{l:{111:{l:{117:{l:{98:{l:{108:{l:{101:{l:{66:{l:{114:{l:{97:{l:{99:{l:{107:{l:{101:{l:{116:{l:{59:{c:[10214]}}}}}}}}}}}}}}}}}}}}}}},119:{l:{110:{l:{84:{l:{101:{l:{101:{l:{86:{l:{101:{l:{99:{l:{116:{l:{111:{l:{114:{l:{59:{c:[10593]}}}}}}}}}}}}}}}}}}},86:{l:{101:{l:{99:{l:{116:{l:{111:{l:{114:{l:{59:{c:[8643]},66:{l:{97:{l:{114:{l:{59:{c:[10585]}}}}}}}}}}}}}}}}}}}}}}}}}}},70:{l:{108:{l:{111:{l:{111:{l:{114:{l:{59:{c:[8970]}}}}}}}}}}},82:{l:{105:{l:{103:{l:{104:{l:{116:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8596]}}}}}}}}}}},86:{l:{101:{l:{99:{l:{116:{l:{111:{l:{114:{l:{59:{c:[10574]}}}}}}}}}}}}}}}}}}}}}}},84:{l:{101:{l:{101:{l:{59:{c:[8867]},65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8612]}}}}}}}}}}},86:{l:{101:{l:{99:{l:{116:{l:{111:{l:{114:{l:{59:{c:[10586]}}}}}}}}}}}}}}}}},114:{l:{105:{l:{97:{l:{110:{l:{103:{l:{108:{l:{101:{l:{59:{c:[8882]},66:{l:{97:{l:{114:{l:{59:{c:[10703]}}}}}}},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8884]}}}}}}}}}}}}}}}}}}}}}}}}}}},85:{l:{112:{l:{68:{l:{111:{l:{119:{l:{110:{l:{86:{l:{101:{l:{99:{l:{116:{l:{111:{l:{114:{l:{59:{c:[10577]}}}}}}}}}}}}}}}}}}}}},84:{l:{101:{l:{101:{l:{86:{l:{101:{l:{99:{l:{116:{l:{111:{l:{114:{l:{59:{c:[10592]}}}}}}}}}}}}}}}}}}},86:{l:{101:{l:{99:{l:{116:{l:{111:{l:{114:{l:{59:{c:[8639]},66:{l:{97:{l:{114:{l:{59:{c:[10584]}}}}}}}}}}}}}}}}}}}}}}},86:{l:{101:{l:{99:{l:{116:{l:{111:{l:{114:{l:{59:{c:[8636]},66:{l:{97:{l:{114:{l:{59:{c:[10578]}}}}}}}}}}}}}}}}}}},97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8656]}}}}}}}}}}},114:{l:{105:{l:{103:{l:{104:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8660]}}}}}}}}}}}}}}}}}}}}}}}}},115:{l:{115:{l:{69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{71:{l:{114:{l:{101:{l:{97:{l:{116:{l:{101:{l:{114:{l:{59:{c:[8922]}}}}}}}}}}}}}}}}}}}}}}}}},70:{l:{117:{l:{108:{l:{108:{l:{69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8806]}}}}}}}}}}}}}}}}}}},71:{l:{114:{l:{101:{l:{97:{l:{116:{l:{101:{l:{114:{l:{59:{c:[8822]}}}}}}}}}}}}}}},76:{l:{101:{l:{115:{l:{115:{l:{59:{c:[10913]}}}}}}}}},83:{l:{108:{l:{97:{l:{110:{l:{116:{l:{69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[10877]}}}}}}}}}}}}}}}}}}}}},84:{l:{105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[8818]}}}}}}}}}}}}}}}}},102:{l:{114:{l:{59:{c:[120079]}}}}},108:{l:{59:{c:[8920]},101:{l:{102:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8666]}}}}}}}}}}}}}}}}}}},109:{l:{105:{l:{100:{l:{111:{l:{116:{l:{59:{c:[319]}}}}}}}}}}},111:{l:{110:{l:{103:{l:{76:{l:{101:{l:{102:{l:{116:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[10229]}}}}}}}}}}},82:{l:{105:{l:{103:{l:{104:{l:{116:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[10231]}}}}}}}}}}}}}}}}}}}}}}}}}}}}},82:{l:{105:{l:{103:{l:{104:{l:{116:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[10230]}}}}}}}}}}}}}}}}}}}}},108:{l:{101:{l:{102:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[10232]}}}}}}}}}}},114:{l:{105:{l:{103:{l:{104:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[10234]}}}}}}}}}}}}}}}}}}}}}}}}}}}}},114:{l:{105:{l:{103:{l:{104:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[10233]}}}}}}}}}}}}}}}}}}}}}}}}},112:{l:{102:{l:{59:{c:[120131]}}}}},119:{l:{101:{l:{114:{l:{76:{l:{101:{l:{102:{l:{116:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8601]}}}}}}}}}}}}}}}}}}},82:{l:{105:{l:{103:{l:{104:{l:{116:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8600]}}}}}}}}}}}}}}}}}}}}}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[8466]}}}}},104:{l:{59:{c:[8624]}}},116:{l:{114:{l:{111:{l:{107:{l:{59:{c:[321]}}}}}}}}}}},116:{l:{59:{c:[8810]}}}}},77:{l:{97:{l:{112:{l:{59:{c:[10501]}}}}},99:{l:{121:{l:{59:{c:[1052]}}}}},101:{l:{100:{l:{105:{l:{117:{l:{109:{l:{83:{l:{112:{l:{97:{l:{99:{l:{101:{l:{59:{c:[8287]}}}}}}}}}}}}}}}}}}},108:{l:{108:{l:{105:{l:{110:{l:{116:{l:{114:{l:{102:{l:{59:{c:[8499]}}}}}}}}}}}}}}}}},102:{l:{114:{l:{59:{c:[120080]}}}}},105:{l:{110:{l:{117:{l:{115:{l:{80:{l:{108:{l:{117:{l:{115:{l:{59:{c:[8723]}}}}}}}}}}}}}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120132]}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[8499]}}}}}}},117:{l:{59:{c:[924]}}}}},78:{l:{74:{l:{99:{l:{121:{l:{59:{c:[1034]}}}}}}},97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[323]}}}}}}}}}}},99:{l:{97:{l:{114:{l:{111:{l:{110:{l:{59:{c:[327]}}}}}}}}},101:{l:{100:{l:{105:{l:{108:{l:{59:{c:[325]}}}}}}}}},121:{l:{59:{c:[1053]}}}}},101:{l:{103:{l:{97:{l:{116:{l:{105:{l:{118:{l:{101:{l:{77:{l:{101:{l:{100:{l:{105:{l:{117:{l:{109:{l:{83:{l:{112:{l:{97:{l:{99:{l:{101:{l:{59:{c:[8203]}}}}}}}}}}}}}}}}}}}}}}},84:{l:{104:{l:{105:{l:{99:{l:{107:{l:{83:{l:{112:{l:{97:{l:{99:{l:{101:{l:{59:{c:[8203]}}}}}}}}}}}}}}},110:{l:{83:{l:{112:{l:{97:{l:{99:{l:{101:{l:{59:{c:[8203]}}}}}}}}}}}}}}}}}}},86:{l:{101:{l:{114:{l:{121:{l:{84:{l:{104:{l:{105:{l:{110:{l:{83:{l:{112:{l:{97:{l:{99:{l:{101:{l:{59:{c:[8203]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},115:{l:{116:{l:{101:{l:{100:{l:{71:{l:{114:{l:{101:{l:{97:{l:{116:{l:{101:{l:{114:{l:{71:{l:{114:{l:{101:{l:{97:{l:{116:{l:{101:{l:{114:{l:{59:{c:[8811]}}}}}}}}}}}}}}}}}}}}}}}}}}}}},76:{l:{101:{l:{115:{l:{115:{l:{76:{l:{101:{l:{115:{l:{115:{l:{59:{c:[8810]}}}}}}}}}}}}}}}}}}}}}}}}},119:{l:{76:{l:{105:{l:{110:{l:{101:{l:{59:{c:[10]}}}}}}}}}}}}},102:{l:{114:{l:{59:{c:[120081]}}}}},111:{l:{66:{l:{114:{l:{101:{l:{97:{l:{107:{l:{59:{c:[8288]}}}}}}}}}}},110:{l:{66:{l:{114:{l:{101:{l:{97:{l:{107:{l:{105:{l:{110:{l:{103:{l:{83:{l:{112:{l:{97:{l:{99:{l:{101:{l:{59:{c:[160]}}}}}}}}}}}}}}}}}}}}}}}}}}}}},112:{l:{102:{l:{59:{c:[8469]}}}}},116:{l:{59:{c:[10988]},67:{l:{111:{l:{110:{l:{103:{l:{114:{l:{117:{l:{101:{l:{110:{l:{116:{l:{59:{c:[8802]}}}}}}}}}}}}}}}}},117:{l:{112:{l:{67:{l:{97:{l:{112:{l:{59:{c:[8813]}}}}}}}}}}}}},68:{l:{111:{l:{117:{l:{98:{l:{108:{l:{101:{l:{86:{l:{101:{l:{114:{l:{116:{l:{105:{l:{99:{l:{97:{l:{108:{l:{66:{l:{97:{l:{114:{l:{59:{c:[8742]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},69:{l:{108:{l:{101:{l:{109:{l:{101:{l:{110:{l:{116:{l:{59:{c:[8713]}}}}}}}}}}}}},113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8800]},84:{l:{105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[8770,824]}}}}}}}}}}}}}}}}}}},120:{l:{105:{l:{115:{l:{116:{l:{115:{l:{59:{c:[8708]}}}}}}}}}}}}},71:{l:{114:{l:{101:{l:{97:{l:{116:{l:{101:{l:{114:{l:{59:{c:[8815]},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8817]}}}}}}}}}}},70:{l:{117:{l:{108:{l:{108:{l:{69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8807,824]}}}}}}}}}}}}}}}}}}},71:{l:{114:{l:{101:{l:{97:{l:{116:{l:{101:{l:{114:{l:{59:{c:[8811,824]}}}}}}}}}}}}}}},76:{l:{101:{l:{115:{l:{115:{l:{59:{c:[8825]}}}}}}}}},83:{l:{108:{l:{97:{l:{110:{l:{116:{l:{69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[10878,824]}}}}}}}}}}}}}}}}}}}}},84:{l:{105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[8821]}}}}}}}}}}}}}}}}}}}}}}}}},72:{l:{117:{l:{109:{l:{112:{l:{68:{l:{111:{l:{119:{l:{110:{l:{72:{l:{117:{l:{109:{l:{112:{l:{59:{c:[8782,824]}}}}}}}}}}}}}}}}},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8783,824]}}}}}}}}}}}}}}}}}}},76:{l:{101:{l:{102:{l:{116:{l:{84:{l:{114:{l:{105:{l:{97:{l:{110:{l:{103:{l:{108:{l:{101:{l:{59:{c:[8938]},66:{l:{97:{l:{114:{l:{59:{c:[10703,824]}}}}}}},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8940]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},115:{l:{115:{l:{59:{c:[8814]},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8816]}}}}}}}}}}},71:{l:{114:{l:{101:{l:{97:{l:{116:{l:{101:{l:{114:{l:{59:{c:[8824]}}}}}}}}}}}}}}},76:{l:{101:{l:{115:{l:{115:{l:{59:{c:[8810,824]}}}}}}}}},83:{l:{108:{l:{97:{l:{110:{l:{116:{l:{69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[10877,824]}}}}}}}}}}}}}}}}}}}}},84:{l:{105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[8820]}}}}}}}}}}}}}}}}}}},78:{l:{101:{l:{115:{l:{116:{l:{101:{l:{100:{l:{71:{l:{114:{l:{101:{l:{97:{l:{116:{l:{101:{l:{114:{l:{71:{l:{114:{l:{101:{l:{97:{l:{116:{l:{101:{l:{114:{l:{59:{c:[10914,824]}}}}}}}}}}}}}}}}}}}}}}}}}}}}},76:{l:{101:{l:{115:{l:{115:{l:{76:{l:{101:{l:{115:{l:{115:{l:{59:{c:[10913,824]}}}}}}}}}}}}}}}}}}}}}}}}}}}}},80:{l:{114:{l:{101:{l:{99:{l:{101:{l:{100:{l:{101:{l:{115:{l:{59:{c:[8832]},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[10927,824]}}}}}}}}}}},83:{l:{108:{l:{97:{l:{110:{l:{116:{l:{69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8928]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},82:{l:{101:{l:{118:{l:{101:{l:{114:{l:{115:{l:{101:{l:{69:{l:{108:{l:{101:{l:{109:{l:{101:{l:{110:{l:{116:{l:{59:{c:[8716]}}}}}}}}}}}}}}}}}}}}}}}}}}},105:{l:{103:{l:{104:{l:{116:{l:{84:{l:{114:{l:{105:{l:{97:{l:{110:{l:{103:{l:{108:{l:{101:{l:{59:{c:[8939]},66:{l:{97:{l:{114:{l:{59:{c:[10704,824]}}}}}}},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8941]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},83:{l:{113:{l:{117:{l:{97:{l:{114:{l:{101:{l:{83:{l:{117:{l:{98:{l:{115:{l:{101:{l:{116:{l:{59:{c:[8847,824]},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8930]}}}}}}}}}}}}}}}}}}},112:{l:{101:{l:{114:{l:{115:{l:{101:{l:{116:{l:{59:{c:[8848,824]},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8931]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},117:{l:{98:{l:{115:{l:{101:{l:{116:{l:{59:{c:[8834,8402]},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8840]}}}}}}}}}}}}}}}}}}},99:{l:{99:{l:{101:{l:{101:{l:{100:{l:{115:{l:{59:{c:[8833]},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[10928,824]}}}}}}}}}}},83:{l:{108:{l:{97:{l:{110:{l:{116:{l:{69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8929]}}}}}}}}}}}}}}}}}}}}},84:{l:{105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[8831,824]}}}}}}}}}}}}}}}}}}}}}}},112:{l:{101:{l:{114:{l:{115:{l:{101:{l:{116:{l:{59:{c:[8835,8402]},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8841]}}}}}}}}}}}}}}}}}}}}}}}}}}},84:{l:{105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[8769]},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8772]}}}}}}}}}}},70:{l:{117:{l:{108:{l:{108:{l:{69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8775]}}}}}}}}}}}}}}}}}}},84:{l:{105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[8777]}}}}}}}}}}}}}}}}}}}}},86:{l:{101:{l:{114:{l:{116:{l:{105:{l:{99:{l:{97:{l:{108:{l:{66:{l:{97:{l:{114:{l:{59:{c:[8740]}}}}}}}}}}}}}}}}}}}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119977]}}}}}}},116:{l:{105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[209]}},c:[209]}}}}}}}}},117:{l:{59:{c:[925]}}}}},79:{l:{69:{l:{108:{l:{105:{l:{103:{l:{59:{c:[338]}}}}}}}}},97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[211]}},c:[211]}}}}}}}}},99:{l:{105:{l:{114:{l:{99:{l:{59:{c:[212]}},c:[212]}}}}},121:{l:{59:{c:[1054]}}}}},100:{l:{98:{l:{108:{l:{97:{l:{99:{l:{59:{c:[336]}}}}}}}}}}},102:{l:{114:{l:{59:{c:[120082]}}}}},103:{l:{114:{l:{97:{l:{118:{l:{101:{l:{59:{c:[210]}},c:[210]}}}}}}}}},109:{l:{97:{l:{99:{l:{114:{l:{59:{c:[332]}}}}}}},101:{l:{103:{l:{97:{l:{59:{c:[937]}}}}}}},105:{l:{99:{l:{114:{l:{111:{l:{110:{l:{59:{c:[927]}}}}}}}}}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120134]}}}}}}},112:{l:{101:{l:{110:{l:{67:{l:{117:{l:{114:{l:{108:{l:{121:{l:{68:{l:{111:{l:{117:{l:{98:{l:{108:{l:{101:{l:{81:{l:{117:{l:{111:{l:{116:{l:{101:{l:{59:{c:[8220]}}}}}}}}}}}}}}}}}}}}}}},81:{l:{117:{l:{111:{l:{116:{l:{101:{l:{59:{c:[8216]}}}}}}}}}}}}}}}}}}}}}}}}}}},114:{l:{59:{c:[10836]}}},115:{l:{99:{l:{114:{l:{59:{c:[119978]}}}}},108:{l:{97:{l:{115:{l:{104:{l:{59:{c:[216]}},c:[216]}}}}}}}}},116:{l:{105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[213]}},c:[213]}}}}},109:{l:{101:{l:{115:{l:{59:{c:[10807]}}}}}}}}}}},117:{l:{109:{l:{108:{l:{59:{c:[214]}},c:[214]}}}}},118:{l:{101:{l:{114:{l:{66:{l:{97:{l:{114:{l:{59:{c:[8254]}}}}},114:{l:{97:{l:{99:{l:{101:{l:{59:{c:[9182]}}},107:{l:{101:{l:{116:{l:{59:{c:[9140]}}}}}}}}}}}}}}},80:{l:{97:{l:{114:{l:{101:{l:{110:{l:{116:{l:{104:{l:{101:{l:{115:{l:{105:{l:{115:{l:{59:{c:[9180]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},80:{l:{97:{l:{114:{l:{116:{l:{105:{l:{97:{l:{108:{l:{68:{l:{59:{c:[8706]}}}}}}}}}}}}}}},99:{l:{121:{l:{59:{c:[1055]}}}}},102:{l:{114:{l:{59:{c:[120083]}}}}},104:{l:{105:{l:{59:{c:[934]}}}}},105:{l:{59:{c:[928]}}},108:{l:{117:{l:{115:{l:{77:{l:{105:{l:{110:{l:{117:{l:{115:{l:{59:{c:[177]}}}}}}}}}}}}}}}}},111:{l:{105:{l:{110:{l:{99:{l:{97:{l:{114:{l:{101:{l:{112:{l:{108:{l:{97:{l:{110:{l:{101:{l:{59:{c:[8460]}}}}}}}}}}}}}}}}}}}}}}},112:{l:{102:{l:{59:{c:[8473]}}}}}}},114:{l:{59:{c:[10939]},101:{l:{99:{l:{101:{l:{100:{l:{101:{l:{115:{l:{59:{c:[8826]},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[10927]}}}}}}}}}}},83:{l:{108:{l:{97:{l:{110:{l:{116:{l:{69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8828]}}}}}}}}}}}}}}}}}}}}},84:{l:{105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[8830]}}}}}}}}}}}}}}}}}}}}}}},105:{l:{109:{l:{101:{l:{59:{c:[8243]}}}}}}},111:{l:{100:{l:{117:{l:{99:{l:{116:{l:{59:{c:[8719]}}}}}}}}},112:{l:{111:{l:{114:{l:{116:{l:{105:{l:{111:{l:{110:{l:{59:{c:[8759]},97:{l:{108:{l:{59:{c:[8733]}}}}}}}}}}}}}}}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119979]}}}}},105:{l:{59:{c:[936]}}}}}}},81:{l:{85:{l:{79:{l:{84:{l:{59:{c:[34]}},c:[34]}}}}},102:{l:{114:{l:{59:{c:[120084]}}}}},111:{l:{112:{l:{102:{l:{59:{c:[8474]}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119980]}}}}}}}}},82:{l:{66:{l:{97:{l:{114:{l:{114:{l:{59:{c:[10512]}}}}}}}}},69:{l:{71:{l:{59:{c:[174]}},c:[174]}}},97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[340]}}}}}}}}},110:{l:{103:{l:{59:{c:[10219]}}}}},114:{l:{114:{l:{59:{c:[8608]},116:{l:{108:{l:{59:{c:[10518]}}}}}}}}}}},99:{l:{97:{l:{114:{l:{111:{l:{110:{l:{59:{c:[344]}}}}}}}}},101:{l:{100:{l:{105:{l:{108:{l:{59:{c:[342]}}}}}}}}},121:{l:{59:{c:[1056]}}}}},101:{l:{59:{c:[8476]},118:{l:{101:{l:{114:{l:{115:{l:{101:{l:{69:{l:{108:{l:{101:{l:{109:{l:{101:{l:{110:{l:{116:{l:{59:{c:[8715]}}}}}}}}}}}}},113:{l:{117:{l:{105:{l:{108:{l:{105:{l:{98:{l:{114:{l:{105:{l:{117:{l:{109:{l:{59:{c:[8651]}}}}}}}}}}}}}}}}}}}}}}},85:{l:{112:{l:{69:{l:{113:{l:{117:{l:{105:{l:{108:{l:{105:{l:{98:{l:{114:{l:{105:{l:{117:{l:{109:{l:{59:{c:[10607]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},102:{l:{114:{l:{59:{c:[8476]}}}}},104:{l:{111:{l:{59:{c:[929]}}}}},105:{l:{103:{l:{104:{l:{116:{l:{65:{l:{110:{l:{103:{l:{108:{l:{101:{l:{66:{l:{114:{l:{97:{l:{99:{l:{107:{l:{101:{l:{116:{l:{59:{c:[10217]}}}}}}}}}}}}}}}}}}}}}}},114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8594]},66:{l:{97:{l:{114:{l:{59:{c:[8677]}}}}}}},76:{l:{101:{l:{102:{l:{116:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8644]}}}}}}}}}}}}}}}}}}}}}}}}}}}}},67:{l:{101:{l:{105:{l:{108:{l:{105:{l:{110:{l:{103:{l:{59:{c:[8969]}}}}}}}}}}}}}}},68:{l:{111:{l:{117:{l:{98:{l:{108:{l:{101:{l:{66:{l:{114:{l:{97:{l:{99:{l:{107:{l:{101:{l:{116:{l:{59:{c:[10215]}}}}}}}}}}}}}}}}}}}}}}},119:{l:{110:{l:{84:{l:{101:{l:{101:{l:{86:{l:{101:{l:{99:{l:{116:{l:{111:{l:{114:{l:{59:{c:[10589]}}}}}}}}}}}}}}}}}}},86:{l:{101:{l:{99:{l:{116:{l:{111:{l:{114:{l:{59:{c:[8642]},66:{l:{97:{l:{114:{l:{59:{c:[10581]}}}}}}}}}}}}}}}}}}}}}}}}}}},70:{l:{108:{l:{111:{l:{111:{l:{114:{l:{59:{c:[8971]}}}}}}}}}}},84:{l:{101:{l:{101:{l:{59:{c:[8866]},65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8614]}}}}}}}}}}},86:{l:{101:{l:{99:{l:{116:{l:{111:{l:{114:{l:{59:{c:[10587]}}}}}}}}}}}}}}}}},114:{l:{105:{l:{97:{l:{110:{l:{103:{l:{108:{l:{101:{l:{59:{c:[8883]},66:{l:{97:{l:{114:{l:{59:{c:[10704]}}}}}}},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8885]}}}}}}}}}}}}}}}}}}}}}}}}}}},85:{l:{112:{l:{68:{l:{111:{l:{119:{l:{110:{l:{86:{l:{101:{l:{99:{l:{116:{l:{111:{l:{114:{l:{59:{c:[10575]}}}}}}}}}}}}}}}}}}}}},84:{l:{101:{l:{101:{l:{86:{l:{101:{l:{99:{l:{116:{l:{111:{l:{114:{l:{59:{c:[10588]}}}}}}}}}}}}}}}}}}},86:{l:{101:{l:{99:{l:{116:{l:{111:{l:{114:{l:{59:{c:[8638]},66:{l:{97:{l:{114:{l:{59:{c:[10580]}}}}}}}}}}}}}}}}}}}}}}},86:{l:{101:{l:{99:{l:{116:{l:{111:{l:{114:{l:{59:{c:[8640]},66:{l:{97:{l:{114:{l:{59:{c:[10579]}}}}}}}}}}}}}}}}}}},97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8658]}}}}}}}}}}}}}}}}}}},111:{l:{112:{l:{102:{l:{59:{c:[8477]}}}}},117:{l:{110:{l:{100:{l:{73:{l:{109:{l:{112:{l:{108:{l:{105:{l:{101:{l:{115:{l:{59:{c:[10608]}}}}}}}}}}}}}}}}}}}}}}},114:{l:{105:{l:{103:{l:{104:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8667]}}}}}}}}}}}}}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[8475]}}}}},104:{l:{59:{c:[8625]}}}}},117:{l:{108:{l:{101:{l:{68:{l:{101:{l:{108:{l:{97:{l:{121:{l:{101:{l:{100:{l:{59:{c:[10740]}}}}}}}}}}}}}}}}}}}}}}},83:{l:{72:{l:{67:{l:{72:{l:{99:{l:{121:{l:{59:{c:[1065]}}}}}}}}},99:{l:{121:{l:{59:{c:[1064]}}}}}}},79:{l:{70:{l:{84:{l:{99:{l:{121:{l:{59:{c:[1068]}}}}}}}}}}},97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[346]}}}}}}}}}}},99:{l:{59:{c:[10940]},97:{l:{114:{l:{111:{l:{110:{l:{59:{c:[352]}}}}}}}}},101:{l:{100:{l:{105:{l:{108:{l:{59:{c:[350]}}}}}}}}},105:{l:{114:{l:{99:{l:{59:{c:[348]}}}}}}},121:{l:{59:{c:[1057]}}}}},102:{l:{114:{l:{59:{c:[120086]}}}}},104:{l:{111:{l:{114:{l:{116:{l:{68:{l:{111:{l:{119:{l:{110:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8595]}}}}}}}}}}}}}}}}}}},76:{l:{101:{l:{102:{l:{116:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8592]}}}}}}}}}}}}}}}}}}},82:{l:{105:{l:{103:{l:{104:{l:{116:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8594]}}}}}}}}}}}}}}}}}}}}},85:{l:{112:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8593]}}}}}}}}}}}}}}}}}}}}}}},105:{l:{103:{l:{109:{l:{97:{l:{59:{c:[931]}}}}}}}}},109:{l:{97:{l:{108:{l:{108:{l:{67:{l:{105:{l:{114:{l:{99:{l:{108:{l:{101:{l:{59:{c:[8728]}}}}}}}}}}}}}}}}}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120138]}}}}}}},113:{l:{114:{l:{116:{l:{59:{c:[8730]}}}}},117:{l:{97:{l:{114:{l:{101:{l:{59:{c:[9633]},73:{l:{110:{l:{116:{l:{101:{l:{114:{l:{115:{l:{101:{l:{99:{l:{116:{l:{105:{l:{111:{l:{110:{l:{59:{c:[8851]}}}}}}}}}}}}}}}}}}}}}}}}},83:{l:{117:{l:{98:{l:{115:{l:{101:{l:{116:{l:{59:{c:[8847]},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8849]}}}}}}}}}}}}}}}}}}},112:{l:{101:{l:{114:{l:{115:{l:{101:{l:{116:{l:{59:{c:[8848]},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8850]}}}}}}}}}}}}}}}}}}}}}}}}}}},85:{l:{110:{l:{105:{l:{111:{l:{110:{l:{59:{c:[8852]}}}}}}}}}}}}}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119982]}}}}}}},116:{l:{97:{l:{114:{l:{59:{c:[8902]}}}}}}},117:{l:{98:{l:{59:{c:[8912]},115:{l:{101:{l:{116:{l:{59:{c:[8912]},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8838]}}}}}}}}}}}}}}}}}}},99:{l:{99:{l:{101:{l:{101:{l:{100:{l:{115:{l:{59:{c:[8827]},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[10928]}}}}}}}}}}},83:{l:{108:{l:{97:{l:{110:{l:{116:{l:{69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8829]}}}}}}}}}}}}}}}}}}}}},84:{l:{105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[8831]}}}}}}}}}}}}}}}}}}}}},104:{l:{84:{l:{104:{l:{97:{l:{116:{l:{59:{c:[8715]}}}}}}}}}}}}},109:{l:{59:{c:[8721]}}},112:{l:{59:{c:[8913]},101:{l:{114:{l:{115:{l:{101:{l:{116:{l:{59:{c:[8835]},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8839]}}}}}}}}}}}}}}}}}}}}},115:{l:{101:{l:{116:{l:{59:{c:[8913]}}}}}}}}}}}}},84:{l:{72:{l:{79:{l:{82:{l:{78:{l:{59:{c:[222]}},c:[222]}}}}}}},82:{l:{65:{l:{68:{l:{69:{l:{59:{c:[8482]}}}}}}}}},83:{l:{72:{l:{99:{l:{121:{l:{59:{c:[1035]}}}}}}},99:{l:{121:{l:{59:{c:[1062]}}}}}}},97:{l:{98:{l:{59:{c:[9]}}},117:{l:{59:{c:[932]}}}}},99:{l:{97:{l:{114:{l:{111:{l:{110:{l:{59:{c:[356]}}}}}}}}},101:{l:{100:{l:{105:{l:{108:{l:{59:{c:[354]}}}}}}}}},121:{l:{59:{c:[1058]}}}}},102:{l:{114:{l:{59:{c:[120087]}}}}},104:{l:{101:{l:{114:{l:{101:{l:{102:{l:{111:{l:{114:{l:{101:{l:{59:{c:[8756]}}}}}}}}}}}}},116:{l:{97:{l:{59:{c:[920]}}}}}}},105:{l:{99:{l:{107:{l:{83:{l:{112:{l:{97:{l:{99:{l:{101:{l:{59:{c:[8287,8202]}}}}}}}}}}}}}}},110:{l:{83:{l:{112:{l:{97:{l:{99:{l:{101:{l:{59:{c:[8201]}}}}}}}}}}}}}}}}},105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[8764]},69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8771]}}}}}}}}}}},70:{l:{117:{l:{108:{l:{108:{l:{69:{l:{113:{l:{117:{l:{97:{l:{108:{l:{59:{c:[8773]}}}}}}}}}}}}}}}}}}},84:{l:{105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[8776]}}}}}}}}}}}}}}}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120139]}}}}}}},114:{l:{105:{l:{112:{l:{108:{l:{101:{l:{68:{l:{111:{l:{116:{l:{59:{c:[8411]}}}}}}}}}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119983]}}}}},116:{l:{114:{l:{111:{l:{107:{l:{59:{c:[358]}}}}}}}}}}}}},85:{l:{97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[218]}},c:[218]}}}}}}},114:{l:{114:{l:{59:{c:[8607]},111:{l:{99:{l:{105:{l:{114:{l:{59:{c:[10569]}}}}}}}}}}}}}}},98:{l:{114:{l:{99:{l:{121:{l:{59:{c:[1038]}}}}},101:{l:{118:{l:{101:{l:{59:{c:[364]}}}}}}}}}}},99:{l:{105:{l:{114:{l:{99:{l:{59:{c:[219]}},c:[219]}}}}},121:{l:{59:{c:[1059]}}}}},100:{l:{98:{l:{108:{l:{97:{l:{99:{l:{59:{c:[368]}}}}}}}}}}},102:{l:{114:{l:{59:{c:[120088]}}}}},103:{l:{114:{l:{97:{l:{118:{l:{101:{l:{59:{c:[217]}},c:[217]}}}}}}}}},109:{l:{97:{l:{99:{l:{114:{l:{59:{c:[362]}}}}}}}}},110:{l:{100:{l:{101:{l:{114:{l:{66:{l:{97:{l:{114:{l:{59:{c:[95]}}}}},114:{l:{97:{l:{99:{l:{101:{l:{59:{c:[9183]}}},107:{l:{101:{l:{116:{l:{59:{c:[9141]}}}}}}}}}}}}}}},80:{l:{97:{l:{114:{l:{101:{l:{110:{l:{116:{l:{104:{l:{101:{l:{115:{l:{105:{l:{115:{l:{59:{c:[9181]}}}}}}}}}}}}}}}}}}}}}}}}}}}}},105:{l:{111:{l:{110:{l:{59:{c:[8899]},80:{l:{108:{l:{117:{l:{115:{l:{59:{c:[8846]}}}}}}}}}}}}}}}}},111:{l:{103:{l:{111:{l:{110:{l:{59:{c:[370]}}}}}}},112:{l:{102:{l:{59:{c:[120140]}}}}}}},112:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8593]},66:{l:{97:{l:{114:{l:{59:{c:[10514]}}}}}}},68:{l:{111:{l:{119:{l:{110:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8645]}}}}}}}}}}}}}}}}}}}}}}}}}}}}},68:{l:{111:{l:{119:{l:{110:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8597]}}}}}}}}}}}}}}}}}}},69:{l:{113:{l:{117:{l:{105:{l:{108:{l:{105:{l:{98:{l:{114:{l:{105:{l:{117:{l:{109:{l:{59:{c:[10606]}}}}}}}}}}}}}}}}}}}}}}},84:{l:{101:{l:{101:{l:{59:{c:[8869]},65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8613]}}}}}}}}}}}}}}}}},97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8657]}}}}}}}}}}},100:{l:{111:{l:{119:{l:{110:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8661]}}}}}}}}}}}}}}}}}}},112:{l:{101:{l:{114:{l:{76:{l:{101:{l:{102:{l:{116:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8598]}}}}}}}}}}}}}}}}}}},82:{l:{105:{l:{103:{l:{104:{l:{116:{l:{65:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8599]}}}}}}}}}}}}}}}}}}}}}}}}}}},115:{l:{105:{l:{59:{c:[978]},108:{l:{111:{l:{110:{l:{59:{c:[933]}}}}}}}}}}}}},114:{l:{105:{l:{110:{l:{103:{l:{59:{c:[366]}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119984]}}}}}}},116:{l:{105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[360]}}}}}}}}}}},117:{l:{109:{l:{108:{l:{59:{c:[220]}},c:[220]}}}}}}},86:{l:{68:{l:{97:{l:{115:{l:{104:{l:{59:{c:[8875]}}}}}}}}},98:{l:{97:{l:{114:{l:{59:{c:[10987]}}}}}}},99:{l:{121:{l:{59:{c:[1042]}}}}},100:{l:{97:{l:{115:{l:{104:{l:{59:{c:[8873]},108:{l:{59:{c:[10982]}}}}}}}}}}},101:{l:{101:{l:{59:{c:[8897]}}},114:{l:{98:{l:{97:{l:{114:{l:{59:{c:[8214]}}}}}}},116:{l:{59:{c:[8214]},105:{l:{99:{l:{97:{l:{108:{l:{66:{l:{97:{l:{114:{l:{59:{c:[8739]}}}}}}},76:{l:{105:{l:{110:{l:{101:{l:{59:{c:[124]}}}}}}}}},83:{l:{101:{l:{112:{l:{97:{l:{114:{l:{97:{l:{116:{l:{111:{l:{114:{l:{59:{c:[10072]}}}}}}}}}}}}}}}}}}},84:{l:{105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[8768]}}}}}}}}}}}}}}}}}}}}},121:{l:{84:{l:{104:{l:{105:{l:{110:{l:{83:{l:{112:{l:{97:{l:{99:{l:{101:{l:{59:{c:[8202]}}}}}}}}}}}}}}}}}}}}}}}}},102:{l:{114:{l:{59:{c:[120089]}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120141]}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119985]}}}}}}},118:{l:{100:{l:{97:{l:{115:{l:{104:{l:{59:{c:[8874]}}}}}}}}}}}}},87:{l:{99:{l:{105:{l:{114:{l:{99:{l:{59:{c:[372]}}}}}}}}},101:{l:{100:{l:{103:{l:{101:{l:{59:{c:[8896]}}}}}}}}},102:{l:{114:{l:{59:{c:[120090]}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120142]}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119986]}}}}}}}}},88:{l:{102:{l:{114:{l:{59:{c:[120091]}}}}},105:{l:{59:{c:[926]}}},111:{l:{112:{l:{102:{l:{59:{c:[120143]}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119987]}}}}}}}}},89:{l:{65:{l:{99:{l:{121:{l:{59:{c:[1071]}}}}}}},73:{l:{99:{l:{121:{l:{59:{c:[1031]}}}}}}},85:{l:{99:{l:{121:{l:{59:{c:[1070]}}}}}}},97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[221]}},c:[221]}}}}}}}}},99:{l:{105:{l:{114:{l:{99:{l:{59:{c:[374]}}}}}}},121:{l:{59:{c:[1067]}}}}},102:{l:{114:{l:{59:{c:[120092]}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120144]}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119988]}}}}}}},117:{l:{109:{l:{108:{l:{59:{c:[376]}}}}}}}}},90:{l:{72:{l:{99:{l:{121:{l:{59:{c:[1046]}}}}}}},97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[377]}}}}}}}}}}},99:{l:{97:{l:{114:{l:{111:{l:{110:{l:{59:{c:[381]}}}}}}}}},121:{l:{59:{c:[1047]}}}}},100:{l:{111:{l:{116:{l:{59:{c:[379]}}}}}}},101:{l:{114:{l:{111:{l:{87:{l:{105:{l:{100:{l:{116:{l:{104:{l:{83:{l:{112:{l:{97:{l:{99:{l:{101:{l:{59:{c:[8203]}}}}}}}}}}}}}}}}}}}}}}}}},116:{l:{97:{l:{59:{c:[918]}}}}}}},102:{l:{114:{l:{59:{c:[8488]}}}}},111:{l:{112:{l:{102:{l:{59:{c:[8484]}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119989]}}}}}}}}},97:{l:{97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[225]}},c:[225]}}}}}}}}},98:{l:{114:{l:{101:{l:{118:{l:{101:{l:{59:{c:[259]}}}}}}}}}}},99:{l:{59:{c:[8766]},69:{l:{59:{c:[8766,819]}}},100:{l:{59:{c:[8767]}}},105:{l:{114:{l:{99:{l:{59:{c:[226]}},c:[226]}}}}},117:{l:{116:{l:{101:{l:{59:{c:[180]}},c:[180]}}}}},121:{l:{59:{c:[1072]}}}}},101:{l:{108:{l:{105:{l:{103:{l:{59:{c:[230]}},c:[230]}}}}}}},102:{l:{59:{c:[8289]},114:{l:{59:{c:[120094]}}}}},103:{l:{114:{l:{97:{l:{118:{l:{101:{l:{59:{c:[224]}},c:[224]}}}}}}}}},108:{l:{101:{l:{102:{l:{115:{l:{121:{l:{109:{l:{59:{c:[8501]}}}}}}}}},112:{l:{104:{l:{59:{c:[8501]}}}}}}},112:{l:{104:{l:{97:{l:{59:{c:[945]}}}}}}}}},109:{l:{97:{l:{99:{l:{114:{l:{59:{c:[257]}}}}},108:{l:{103:{l:{59:{c:[10815]}}}}}}},112:{l:{59:{c:[38]}},c:[38]}}},110:{l:{100:{l:{59:{c:[8743]},97:{l:{110:{l:{100:{l:{59:{c:[10837]}}}}}}},100:{l:{59:{c:[10844]}}},115:{l:{108:{l:{111:{l:{112:{l:{101:{l:{59:{c:[10840]}}}}}}}}}}},118:{l:{59:{c:[10842]}}}}},103:{l:{59:{c:[8736]},101:{l:{59:{c:[10660]}}},108:{l:{101:{l:{59:{c:[8736]}}}}},109:{l:{115:{l:{100:{l:{59:{c:[8737]},97:{l:{97:{l:{59:{c:[10664]}}},98:{l:{59:{c:[10665]}}},99:{l:{59:{c:[10666]}}},100:{l:{59:{c:[10667]}}},101:{l:{59:{c:[10668]}}},102:{l:{59:{c:[10669]}}},103:{l:{59:{c:[10670]}}},104:{l:{59:{c:[10671]}}}}}}}}}}},114:{l:{116:{l:{59:{c:[8735]},118:{l:{98:{l:{59:{c:[8894]},100:{l:{59:{c:[10653]}}}}}}}}}}},115:{l:{112:{l:{104:{l:{59:{c:[8738]}}}}},116:{l:{59:{c:[197]}}}}},122:{l:{97:{l:{114:{l:{114:{l:{59:{c:[9084]}}}}}}}}}}}}},111:{l:{103:{l:{111:{l:{110:{l:{59:{c:[261]}}}}}}},112:{l:{102:{l:{59:{c:[120146]}}}}}}},112:{l:{59:{c:[8776]},69:{l:{59:{c:[10864]}}},97:{l:{99:{l:{105:{l:{114:{l:{59:{c:[10863]}}}}}}}}},101:{l:{59:{c:[8778]}}},105:{l:{100:{l:{59:{c:[8779]}}}}},111:{l:{115:{l:{59:{c:[39]}}}}},112:{l:{114:{l:{111:{l:{120:{l:{59:{c:[8776]},101:{l:{113:{l:{59:{c:[8778]}}}}}}}}}}}}}}},114:{l:{105:{l:{110:{l:{103:{l:{59:{c:[229]}},c:[229]}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119990]}}}}},116:{l:{59:{c:[42]}}},121:{l:{109:{l:{112:{l:{59:{c:[8776]},101:{l:{113:{l:{59:{c:[8781]}}}}}}}}}}}}},116:{l:{105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[227]}},c:[227]}}}}}}}}},117:{l:{109:{l:{108:{l:{59:{c:[228]}},c:[228]}}}}},119:{l:{99:{l:{111:{l:{110:{l:{105:{l:{110:{l:{116:{l:{59:{c:[8755]}}}}}}}}}}}}},105:{l:{110:{l:{116:{l:{59:{c:[10769]}}}}}}}}}}},98:{l:{78:{l:{111:{l:{116:{l:{59:{c:[10989]}}}}}}},97:{l:{99:{l:{107:{l:{99:{l:{111:{l:{110:{l:{103:{l:{59:{c:[8780]}}}}}}}}},101:{l:{112:{l:{115:{l:{105:{l:{108:{l:{111:{l:{110:{l:{59:{c:[1014]}}}}}}}}}}}}}}},112:{l:{114:{l:{105:{l:{109:{l:{101:{l:{59:{c:[8245]}}}}}}}}}}},115:{l:{105:{l:{109:{l:{59:{c:[8765]},101:{l:{113:{l:{59:{c:[8909]}}}}}}}}}}}}}}},114:{l:{118:{l:{101:{l:{101:{l:{59:{c:[8893]}}}}}}},119:{l:{101:{l:{100:{l:{59:{c:[8965]},103:{l:{101:{l:{59:{c:[8965]}}}}}}}}}}}}}}},98:{l:{114:{l:{107:{l:{59:{c:[9141]},116:{l:{98:{l:{114:{l:{107:{l:{59:{c:[9142]}}}}}}}}}}}}}}},99:{l:{111:{l:{110:{l:{103:{l:{59:{c:[8780]}}}}}}},121:{l:{59:{c:[1073]}}}}},100:{l:{113:{l:{117:{l:{111:{l:{59:{c:[8222]}}}}}}}}},101:{l:{99:{l:{97:{l:{117:{l:{115:{l:{59:{c:[8757]},101:{l:{59:{c:[8757]}}}}}}}}}}},109:{l:{112:{l:{116:{l:{121:{l:{118:{l:{59:{c:[10672]}}}}}}}}}}},112:{l:{115:{l:{105:{l:{59:{c:[1014]}}}}}}},114:{l:{110:{l:{111:{l:{117:{l:{59:{c:[8492]}}}}}}}}},116:{l:{97:{l:{59:{c:[946]}}},104:{l:{59:{c:[8502]}}},119:{l:{101:{l:{101:{l:{110:{l:{59:{c:[8812]}}}}}}}}}}}}},102:{l:{114:{l:{59:{c:[120095]}}}}},105:{l:{103:{l:{99:{l:{97:{l:{112:{l:{59:{c:[8898]}}}}},105:{l:{114:{l:{99:{l:{59:{c:[9711]}}}}}}},117:{l:{112:{l:{59:{c:[8899]}}}}}}},111:{l:{100:{l:{111:{l:{116:{l:{59:{c:[10752]}}}}}}},112:{l:{108:{l:{117:{l:{115:{l:{59:{c:[10753]}}}}}}}}},116:{l:{105:{l:{109:{l:{101:{l:{115:{l:{59:{c:[10754]}}}}}}}}}}}}},115:{l:{113:{l:{99:{l:{117:{l:{112:{l:{59:{c:[10758]}}}}}}}}},116:{l:{97:{l:{114:{l:{59:{c:[9733]}}}}}}}}},116:{l:{114:{l:{105:{l:{97:{l:{110:{l:{103:{l:{108:{l:{101:{l:{100:{l:{111:{l:{119:{l:{110:{l:{59:{c:[9661]}}}}}}}}},117:{l:{112:{l:{59:{c:[9651]}}}}}}}}}}}}}}}}}}}}},117:{l:{112:{l:{108:{l:{117:{l:{115:{l:{59:{c:[10756]}}}}}}}}}}},118:{l:{101:{l:{101:{l:{59:{c:[8897]}}}}}}},119:{l:{101:{l:{100:{l:{103:{l:{101:{l:{59:{c:[8896]}}}}}}}}}}}}}}},107:{l:{97:{l:{114:{l:{111:{l:{119:{l:{59:{c:[10509]}}}}}}}}}}},108:{l:{97:{l:{99:{l:{107:{l:{108:{l:{111:{l:{122:{l:{101:{l:{110:{l:{103:{l:{101:{l:{59:{c:[10731]}}}}}}}}}}}}}}},115:{l:{113:{l:{117:{l:{97:{l:{114:{l:{101:{l:{59:{c:[9642]}}}}}}}}}}}}},116:{l:{114:{l:{105:{l:{97:{l:{110:{l:{103:{l:{108:{l:{101:{l:{59:{c:[9652]},100:{l:{111:{l:{119:{l:{110:{l:{59:{c:[9662]}}}}}}}}},108:{l:{101:{l:{102:{l:{116:{l:{59:{c:[9666]}}}}}}}}},114:{l:{105:{l:{103:{l:{104:{l:{116:{l:{59:{c:[9656]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},110:{l:{107:{l:{59:{c:[9251]}}}}}}},107:{l:{49:{l:{50:{l:{59:{c:[9618]}}},52:{l:{59:{c:[9617]}}}}},51:{l:{52:{l:{59:{c:[9619]}}}}}}},111:{l:{99:{l:{107:{l:{59:{c:[9608]}}}}}}}}},110:{l:{101:{l:{59:{c:[61,8421]},113:{l:{117:{l:{105:{l:{118:{l:{59:{c:[8801,8421]}}}}}}}}}}},111:{l:{116:{l:{59:{c:[8976]}}}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120147]}}}}},116:{l:{59:{c:[8869]},116:{l:{111:{l:{109:{l:{59:{c:[8869]}}}}}}}}},119:{l:{116:{l:{105:{l:{101:{l:{59:{c:[8904]}}}}}}}}},120:{l:{68:{l:{76:{l:{59:{c:[9559]}}},82:{l:{59:{c:[9556]}}},108:{l:{59:{c:[9558]}}},114:{l:{59:{c:[9555]}}}}},72:{l:{59:{c:[9552]},68:{l:{59:{c:[9574]}}},85:{l:{59:{c:[9577]}}},100:{l:{59:{c:[9572]}}},117:{l:{59:{c:[9575]}}}}},85:{l:{76:{l:{59:{c:[9565]}}},82:{l:{59:{c:[9562]}}},108:{l:{59:{c:[9564]}}},114:{l:{59:{c:[9561]}}}}},86:{l:{59:{c:[9553]},72:{l:{59:{c:[9580]}}},76:{l:{59:{c:[9571]}}},82:{l:{59:{c:[9568]}}},104:{l:{59:{c:[9579]}}},108:{l:{59:{c:[9570]}}},114:{l:{59:{c:[9567]}}}}},98:{l:{111:{l:{120:{l:{59:{c:[10697]}}}}}}},100:{l:{76:{l:{59:{c:[9557]}}},82:{l:{59:{c:[9554]}}},108:{l:{59:{c:[9488]}}},114:{l:{59:{c:[9484]}}}}},104:{l:{59:{c:[9472]},68:{l:{59:{c:[9573]}}},85:{l:{59:{c:[9576]}}},100:{l:{59:{c:[9516]}}},117:{l:{59:{c:[9524]}}}}},109:{l:{105:{l:{110:{l:{117:{l:{115:{l:{59:{c:[8863]}}}}}}}}}}},112:{l:{108:{l:{117:{l:{115:{l:{59:{c:[8862]}}}}}}}}},116:{l:{105:{l:{109:{l:{101:{l:{115:{l:{59:{c:[8864]}}}}}}}}}}},117:{l:{76:{l:{59:{c:[9563]}}},82:{l:{59:{c:[9560]}}},108:{l:{59:{c:[9496]}}},114:{l:{59:{c:[9492]}}}}},118:{l:{59:{c:[9474]},72:{l:{59:{c:[9578]}}},76:{l:{59:{c:[9569]}}},82:{l:{59:{c:[9566]}}},104:{l:{59:{c:[9532]}}},108:{l:{59:{c:[9508]}}},114:{l:{59:{c:[9500]}}}}}}}}},112:{l:{114:{l:{105:{l:{109:{l:{101:{l:{59:{c:[8245]}}}}}}}}}}},114:{l:{101:{l:{118:{l:{101:{l:{59:{c:[728]}}}}}}},118:{l:{98:{l:{97:{l:{114:{l:{59:{c:[166]}},c:[166]}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119991]}}}}},101:{l:{109:{l:{105:{l:{59:{c:[8271]}}}}}}},105:{l:{109:{l:{59:{c:[8765]},101:{l:{59:{c:[8909]}}}}}}},111:{l:{108:{l:{59:{c:[92]},98:{l:{59:{c:[10693]}}},104:{l:{115:{l:{117:{l:{98:{l:{59:{c:[10184]}}}}}}}}}}}}}}},117:{l:{108:{l:{108:{l:{59:{c:[8226]},101:{l:{116:{l:{59:{c:[8226]}}}}}}}}},109:{l:{112:{l:{59:{c:[8782]},69:{l:{59:{c:[10926]}}},101:{l:{59:{c:[8783]},113:{l:{59:{c:[8783]}}}}}}}}}}}}},99:{l:{97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[263]}}}}}}}}},112:{l:{59:{c:[8745]},97:{l:{110:{l:{100:{l:{59:{c:[10820]}}}}}}},98:{l:{114:{l:{99:{l:{117:{l:{112:{l:{59:{c:[10825]}}}}}}}}}}},99:{l:{97:{l:{112:{l:{59:{c:[10827]}}}}},117:{l:{112:{l:{59:{c:[10823]}}}}}}},100:{l:{111:{l:{116:{l:{59:{c:[10816]}}}}}}},115:{l:{59:{c:[8745,65024]}}}}},114:{l:{101:{l:{116:{l:{59:{c:[8257]}}}}},111:{l:{110:{l:{59:{c:[711]}}}}}}}}},99:{l:{97:{l:{112:{l:{115:{l:{59:{c:[10829]}}}}},114:{l:{111:{l:{110:{l:{59:{c:[269]}}}}}}}}},101:{l:{100:{l:{105:{l:{108:{l:{59:{c:[231]}},c:[231]}}}}}}},105:{l:{114:{l:{99:{l:{59:{c:[265]}}}}}}},117:{l:{112:{l:{115:{l:{59:{c:[10828]},115:{l:{109:{l:{59:{c:[10832]}}}}}}}}}}}}},100:{l:{111:{l:{116:{l:{59:{c:[267]}}}}}}},101:{l:{100:{l:{105:{l:{108:{l:{59:{c:[184]}},c:[184]}}}}},109:{l:{112:{l:{116:{l:{121:{l:{118:{l:{59:{c:[10674]}}}}}}}}}}},110:{l:{116:{l:{59:{c:[162]},101:{l:{114:{l:{100:{l:{111:{l:{116:{l:{59:{c:[183]}}}}}}}}}}}},c:[162]}}}}},102:{l:{114:{l:{59:{c:[120096]}}}}},104:{l:{99:{l:{121:{l:{59:{c:[1095]}}}}},101:{l:{99:{l:{107:{l:{59:{c:[10003]},109:{l:{97:{l:{114:{l:{107:{l:{59:{c:[10003]}}}}}}}}}}}}}}},105:{l:{59:{c:[967]}}}}},105:{l:{114:{l:{59:{c:[9675]},69:{l:{59:{c:[10691]}}},99:{l:{59:{c:[710]},101:{l:{113:{l:{59:{c:[8791]}}}}},108:{l:{101:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{108:{l:{101:{l:{102:{l:{116:{l:{59:{c:[8634]}}}}}}}}},114:{l:{105:{l:{103:{l:{104:{l:{116:{l:{59:{c:[8635]}}}}}}}}}}}}}}}}}}}}},100:{l:{82:{l:{59:{c:[174]}}},83:{l:{59:{c:[9416]}}},97:{l:{115:{l:{116:{l:{59:{c:[8859]}}}}}}},99:{l:{105:{l:{114:{l:{99:{l:{59:{c:[8858]}}}}}}}}},100:{l:{97:{l:{115:{l:{104:{l:{59:{c:[8861]}}}}}}}}}}}}}}}}},101:{l:{59:{c:[8791]}}},102:{l:{110:{l:{105:{l:{110:{l:{116:{l:{59:{c:[10768]}}}}}}}}}}},109:{l:{105:{l:{100:{l:{59:{c:[10991]}}}}}}},115:{l:{99:{l:{105:{l:{114:{l:{59:{c:[10690]}}}}}}}}}}}}},108:{l:{117:{l:{98:{l:{115:{l:{59:{c:[9827]},117:{l:{105:{l:{116:{l:{59:{c:[9827]}}}}}}}}}}}}}}},111:{l:{108:{l:{111:{l:{110:{l:{59:{c:[58]},101:{l:{59:{c:[8788]},113:{l:{59:{c:[8788]}}}}}}}}}}},109:{l:{109:{l:{97:{l:{59:{c:[44]},116:{l:{59:{c:[64]}}}}}}},112:{l:{59:{c:[8705]},102:{l:{110:{l:{59:{c:[8728]}}}}},108:{l:{101:{l:{109:{l:{101:{l:{110:{l:{116:{l:{59:{c:[8705]}}}}}}}}},120:{l:{101:{l:{115:{l:{59:{c:[8450]}}}}}}}}}}}}}}},110:{l:{103:{l:{59:{c:[8773]},100:{l:{111:{l:{116:{l:{59:{c:[10861]}}}}}}}}},105:{l:{110:{l:{116:{l:{59:{c:[8750]}}}}}}}}},112:{l:{102:{l:{59:{c:[120148]}}},114:{l:{111:{l:{100:{l:{59:{c:[8720]}}}}}}},121:{l:{59:{c:[169]},115:{l:{114:{l:{59:{c:[8471]}}}}}},c:[169]}}}}},114:{l:{97:{l:{114:{l:{114:{l:{59:{c:[8629]}}}}}}},111:{l:{115:{l:{115:{l:{59:{c:[10007]}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119992]}}}}},117:{l:{98:{l:{59:{c:[10959]},101:{l:{59:{c:[10961]}}}}},112:{l:{59:{c:[10960]},101:{l:{59:{c:[10962]}}}}}}}}},116:{l:{100:{l:{111:{l:{116:{l:{59:{c:[8943]}}}}}}}}},117:{l:{100:{l:{97:{l:{114:{l:{114:{l:{108:{l:{59:{c:[10552]}}},114:{l:{59:{c:[10549]}}}}}}}}}}},101:{l:{112:{l:{114:{l:{59:{c:[8926]}}}}},115:{l:{99:{l:{59:{c:[8927]}}}}}}},108:{l:{97:{l:{114:{l:{114:{l:{59:{c:[8630]},112:{l:{59:{c:[10557]}}}}}}}}}}},112:{l:{59:{c:[8746]},98:{l:{114:{l:{99:{l:{97:{l:{112:{l:{59:{c:[10824]}}}}}}}}}}},99:{l:{97:{l:{112:{l:{59:{c:[10822]}}}}},117:{l:{112:{l:{59:{c:[10826]}}}}}}},100:{l:{111:{l:{116:{l:{59:{c:[8845]}}}}}}},111:{l:{114:{l:{59:{c:[10821]}}}}},115:{l:{59:{c:[8746,65024]}}}}},114:{l:{97:{l:{114:{l:{114:{l:{59:{c:[8631]},109:{l:{59:{c:[10556]}}}}}}}}},108:{l:{121:{l:{101:{l:{113:{l:{112:{l:{114:{l:{101:{l:{99:{l:{59:{c:[8926]}}}}}}}}},115:{l:{117:{l:{99:{l:{99:{l:{59:{c:[8927]}}}}}}}}}}}}},118:{l:{101:{l:{101:{l:{59:{c:[8910]}}}}}}},119:{l:{101:{l:{100:{l:{103:{l:{101:{l:{59:{c:[8911]}}}}}}}}}}}}}}},114:{l:{101:{l:{110:{l:{59:{c:[164]}},c:[164]}}}}},118:{l:{101:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{108:{l:{101:{l:{102:{l:{116:{l:{59:{c:[8630]}}}}}}}}},114:{l:{105:{l:{103:{l:{104:{l:{116:{l:{59:{c:[8631]}}}}}}}}}}}}}}}}}}}}}}}}}}},118:{l:{101:{l:{101:{l:{59:{c:[8910]}}}}}}},119:{l:{101:{l:{100:{l:{59:{c:[8911]}}}}}}}}},119:{l:{99:{l:{111:{l:{110:{l:{105:{l:{110:{l:{116:{l:{59:{c:[8754]}}}}}}}}}}}}},105:{l:{110:{l:{116:{l:{59:{c:[8753]}}}}}}}}},121:{l:{108:{l:{99:{l:{116:{l:{121:{l:{59:{c:[9005]}}}}}}}}}}}}},100:{l:{65:{l:{114:{l:{114:{l:{59:{c:[8659]}}}}}}},72:{l:{97:{l:{114:{l:{59:{c:[10597]}}}}}}},97:{l:{103:{l:{103:{l:{101:{l:{114:{l:{59:{c:[8224]}}}}}}}}},108:{l:{101:{l:{116:{l:{104:{l:{59:{c:[8504]}}}}}}}}},114:{l:{114:{l:{59:{c:[8595]}}}}},115:{l:{104:{l:{59:{c:[8208]},118:{l:{59:{c:[8867]}}}}}}}}},98:{l:{107:{l:{97:{l:{114:{l:{111:{l:{119:{l:{59:{c:[10511]}}}}}}}}}}},108:{l:{97:{l:{99:{l:{59:{c:[733]}}}}}}}}},99:{l:{97:{l:{114:{l:{111:{l:{110:{l:{59:{c:[271]}}}}}}}}},121:{l:{59:{c:[1076]}}}}},100:{l:{59:{c:[8518]},97:{l:{103:{l:{103:{l:{101:{l:{114:{l:{59:{c:[8225]}}}}}}}}},114:{l:{114:{l:{59:{c:[8650]}}}}}}},111:{l:{116:{l:{115:{l:{101:{l:{113:{l:{59:{c:[10871]}}}}}}}}}}}}},101:{l:{103:{l:{59:{c:[176]}},c:[176]},108:{l:{116:{l:{97:{l:{59:{c:[948]}}}}}}},109:{l:{112:{l:{116:{l:{121:{l:{118:{l:{59:{c:[10673]}}}}}}}}}}}}},102:{l:{105:{l:{115:{l:{104:{l:{116:{l:{59:{c:[10623]}}}}}}}}},114:{l:{59:{c:[120097]}}}}},104:{l:{97:{l:{114:{l:{108:{l:{59:{c:[8643]}}},114:{l:{59:{c:[8642]}}}}}}}}},105:{l:{97:{l:{109:{l:{59:{c:[8900]},111:{l:{110:{l:{100:{l:{59:{c:[8900]},115:{l:{117:{l:{105:{l:{116:{l:{59:{c:[9830]}}}}}}}}}}}}}}},115:{l:{59:{c:[9830]}}}}}}},101:{l:{59:{c:[168]}}},103:{l:{97:{l:{109:{l:{109:{l:{97:{l:{59:{c:[989]}}}}}}}}}}},115:{l:{105:{l:{110:{l:{59:{c:[8946]}}}}}}},118:{l:{59:{c:[247]},105:{l:{100:{l:{101:{l:{59:{c:[247]},111:{l:{110:{l:{116:{l:{105:{l:{109:{l:{101:{l:{115:{l:{59:{c:[8903]}}}}}}}}}}}}}}}},c:[247]}}}}},111:{l:{110:{l:{120:{l:{59:{c:[8903]}}}}}}}}}}},106:{l:{99:{l:{121:{l:{59:{c:[1106]}}}}}}},108:{l:{99:{l:{111:{l:{114:{l:{110:{l:{59:{c:[8990]}}}}}}},114:{l:{111:{l:{112:{l:{59:{c:[8973]}}}}}}}}}}},111:{l:{108:{l:{108:{l:{97:{l:{114:{l:{59:{c:[36]}}}}}}}}},112:{l:{102:{l:{59:{c:[120149]}}}}},116:{l:{59:{c:[729]},101:{l:{113:{l:{59:{c:[8784]},100:{l:{111:{l:{116:{l:{59:{c:[8785]}}}}}}}}}}},109:{l:{105:{l:{110:{l:{117:{l:{115:{l:{59:{c:[8760]}}}}}}}}}}},112:{l:{108:{l:{117:{l:{115:{l:{59:{c:[8724]}}}}}}}}},115:{l:{113:{l:{117:{l:{97:{l:{114:{l:{101:{l:{59:{c:[8865]}}}}}}}}}}}}}}},117:{l:{98:{l:{108:{l:{101:{l:{98:{l:{97:{l:{114:{l:{119:{l:{101:{l:{100:{l:{103:{l:{101:{l:{59:{c:[8966]}}}}}}}}}}}}}}}}}}}}}}}}},119:{l:{110:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8595]}}}}}}}}}}},100:{l:{111:{l:{119:{l:{110:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{115:{l:{59:{c:[8650]}}}}}}}}}}}}}}}}}}}}},104:{l:{97:{l:{114:{l:{112:{l:{111:{l:{111:{l:{110:{l:{108:{l:{101:{l:{102:{l:{116:{l:{59:{c:[8643]}}}}}}}}},114:{l:{105:{l:{103:{l:{104:{l:{116:{l:{59:{c:[8642]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},114:{l:{98:{l:{107:{l:{97:{l:{114:{l:{111:{l:{119:{l:{59:{c:[10512]}}}}}}}}}}}}},99:{l:{111:{l:{114:{l:{110:{l:{59:{c:[8991]}}}}}}},114:{l:{111:{l:{112:{l:{59:{c:[8972]}}}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119993]}}},121:{l:{59:{c:[1109]}}}}},111:{l:{108:{l:{59:{c:[10742]}}}}},116:{l:{114:{l:{111:{l:{107:{l:{59:{c:[273]}}}}}}}}}}},116:{l:{100:{l:{111:{l:{116:{l:{59:{c:[8945]}}}}}}},114:{l:{105:{l:{59:{c:[9663]},102:{l:{59:{c:[9662]}}}}}}}}},117:{l:{97:{l:{114:{l:{114:{l:{59:{c:[8693]}}}}}}},104:{l:{97:{l:{114:{l:{59:{c:[10607]}}}}}}}}},119:{l:{97:{l:{110:{l:{103:{l:{108:{l:{101:{l:{59:{c:[10662]}}}}}}}}}}}}},122:{l:{99:{l:{121:{l:{59:{c:[1119]}}}}},105:{l:{103:{l:{114:{l:{97:{l:{114:{l:{114:{l:{59:{c:[10239]}}}}}}}}}}}}}}}}},101:{l:{68:{l:{68:{l:{111:{l:{116:{l:{59:{c:[10871]}}}}}}},111:{l:{116:{l:{59:{c:[8785]}}}}}}},97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[233]}},c:[233]}}}}}}},115:{l:{116:{l:{101:{l:{114:{l:{59:{c:[10862]}}}}}}}}}}},99:{l:{97:{l:{114:{l:{111:{l:{110:{l:{59:{c:[283]}}}}}}}}},105:{l:{114:{l:{59:{c:[8790]},99:{l:{59:{c:[234]}},c:[234]}}}}},111:{l:{108:{l:{111:{l:{110:{l:{59:{c:[8789]}}}}}}}}},121:{l:{59:{c:[1101]}}}}},100:{l:{111:{l:{116:{l:{59:{c:[279]}}}}}}},101:{l:{59:{c:[8519]}}},102:{l:{68:{l:{111:{l:{116:{l:{59:{c:[8786]}}}}}}},114:{l:{59:{c:[120098]}}}}},103:{l:{59:{c:[10906]},114:{l:{97:{l:{118:{l:{101:{l:{59:{c:[232]}},c:[232]}}}}}}},115:{l:{59:{c:[10902]},100:{l:{111:{l:{116:{l:{59:{c:[10904]}}}}}}}}}}},108:{l:{59:{c:[10905]},105:{l:{110:{l:{116:{l:{101:{l:{114:{l:{115:{l:{59:{c:[9191]}}}}}}}}}}}}},108:{l:{59:{c:[8467]}}},115:{l:{59:{c:[10901]},100:{l:{111:{l:{116:{l:{59:{c:[10903]}}}}}}}}}}},109:{l:{97:{l:{99:{l:{114:{l:{59:{c:[275]}}}}}}},112:{l:{116:{l:{121:{l:{59:{c:[8709]},115:{l:{101:{l:{116:{l:{59:{c:[8709]}}}}}}},118:{l:{59:{c:[8709]}}}}}}}}},115:{l:{112:{l:{49:{l:{51:{l:{59:{c:[8196]}}},52:{l:{59:{c:[8197]}}}}},59:{c:[8195]}}}}}}},110:{l:{103:{l:{59:{c:[331]}}},115:{l:{112:{l:{59:{c:[8194]}}}}}}},111:{l:{103:{l:{111:{l:{110:{l:{59:{c:[281]}}}}}}},112:{l:{102:{l:{59:{c:[120150]}}}}}}},112:{l:{97:{l:{114:{l:{59:{c:[8917]},115:{l:{108:{l:{59:{c:[10723]}}}}}}}}},108:{l:{117:{l:{115:{l:{59:{c:[10865]}}}}}}},115:{l:{105:{l:{59:{c:[949]},108:{l:{111:{l:{110:{l:{59:{c:[949]}}}}}}},118:{l:{59:{c:[1013]}}}}}}}}},113:{l:{99:{l:{105:{l:{114:{l:{99:{l:{59:{c:[8790]}}}}}}},111:{l:{108:{l:{111:{l:{110:{l:{59:{c:[8789]}}}}}}}}}}},115:{l:{105:{l:{109:{l:{59:{c:[8770]}}}}},108:{l:{97:{l:{110:{l:{116:{l:{103:{l:{116:{l:{114:{l:{59:{c:[10902]}}}}}}},108:{l:{101:{l:{115:{l:{115:{l:{59:{c:[10901]}}}}}}}}}}}}}}}}}}},117:{l:{97:{l:{108:{l:{115:{l:{59:{c:[61]}}}}}}},101:{l:{115:{l:{116:{l:{59:{c:[8799]}}}}}}},105:{l:{118:{l:{59:{c:[8801]},68:{l:{68:{l:{59:{c:[10872]}}}}}}}}}}},118:{l:{112:{l:{97:{l:{114:{l:{115:{l:{108:{l:{59:{c:[10725]}}}}}}}}}}}}}}},114:{l:{68:{l:{111:{l:{116:{l:{59:{c:[8787]}}}}}}},97:{l:{114:{l:{114:{l:{59:{c:[10609]}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[8495]}}}}},100:{l:{111:{l:{116:{l:{59:{c:[8784]}}}}}}},105:{l:{109:{l:{59:{c:[8770]}}}}}}},116:{l:{97:{l:{59:{c:[951]}}},104:{l:{59:{c:[240]}},c:[240]}}},117:{l:{109:{l:{108:{l:{59:{c:[235]}},c:[235]}}},114:{l:{111:{l:{59:{c:[8364]}}}}}}},120:{l:{99:{l:{108:{l:{59:{c:[33]}}}}},105:{l:{115:{l:{116:{l:{59:{c:[8707]}}}}}}},112:{l:{101:{l:{99:{l:{116:{l:{97:{l:{116:{l:{105:{l:{111:{l:{110:{l:{59:{c:[8496]}}}}}}}}}}}}}}}}},111:{l:{110:{l:{101:{l:{110:{l:{116:{l:{105:{l:{97:{l:{108:{l:{101:{l:{59:{c:[8519]}}}}}}}}}}}}}}}}}}}}}}}}},102:{l:{97:{l:{108:{l:{108:{l:{105:{l:{110:{l:{103:{l:{100:{l:{111:{l:{116:{l:{115:{l:{101:{l:{113:{l:{59:{c:[8786]}}}}}}}}}}}}}}}}}}}}}}}}},99:{l:{121:{l:{59:{c:[1092]}}}}},101:{l:{109:{l:{97:{l:{108:{l:{101:{l:{59:{c:[9792]}}}}}}}}}}},102:{l:{105:{l:{108:{l:{105:{l:{103:{l:{59:{c:[64259]}}}}}}}}},108:{l:{105:{l:{103:{l:{59:{c:[64256]}}}}},108:{l:{105:{l:{103:{l:{59:{c:[64260]}}}}}}}}},114:{l:{59:{c:[120099]}}}}},105:{l:{108:{l:{105:{l:{103:{l:{59:{c:[64257]}}}}}}}}},106:{l:{108:{l:{105:{l:{103:{l:{59:{c:[102,106]}}}}}}}}},108:{l:{97:{l:{116:{l:{59:{c:[9837]}}}}},108:{l:{105:{l:{103:{l:{59:{c:[64258]}}}}}}},116:{l:{110:{l:{115:{l:{59:{c:[9649]}}}}}}}}},110:{l:{111:{l:{102:{l:{59:{c:[402]}}}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120151]}}}}},114:{l:{97:{l:{108:{l:{108:{l:{59:{c:[8704]}}}}}}},107:{l:{59:{c:[8916]},118:{l:{59:{c:[10969]}}}}}}}}},112:{l:{97:{l:{114:{l:{116:{l:{105:{l:{110:{l:{116:{l:{59:{c:[10765]}}}}}}}}}}}}}}},114:{l:{97:{l:{99:{l:{49:{l:{50:{l:{59:{c:[189]}},c:[189]},51:{l:{59:{c:[8531]}}},52:{l:{59:{c:[188]}},c:[188]},53:{l:{59:{c:[8533]}}},54:{l:{59:{c:[8537]}}},56:{l:{59:{c:[8539]}}}}},50:{l:{51:{l:{59:{c:[8532]}}},53:{l:{59:{c:[8534]}}}}},51:{l:{52:{l:{59:{c:[190]}},c:[190]},53:{l:{59:{c:[8535]}}},56:{l:{59:{c:[8540]}}}}},52:{l:{53:{l:{59:{c:[8536]}}}}},53:{l:{54:{l:{59:{c:[8538]}}},56:{l:{59:{c:[8541]}}}}},55:{l:{56:{l:{59:{c:[8542]}}}}}}},115:{l:{108:{l:{59:{c:[8260]}}}}}}},111:{l:{119:{l:{110:{l:{59:{c:[8994]}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119995]}}}}}}}}},103:{l:{69:{l:{59:{c:[8807]},108:{l:{59:{c:[10892]}}}}},97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[501]}}}}}}}}},109:{l:{109:{l:{97:{l:{59:{c:[947]},100:{l:{59:{c:[989]}}}}}}}}},112:{l:{59:{c:[10886]}}}}},98:{l:{114:{l:{101:{l:{118:{l:{101:{l:{59:{c:[287]}}}}}}}}}}},99:{l:{105:{l:{114:{l:{99:{l:{59:{c:[285]}}}}}}},121:{l:{59:{c:[1075]}}}}},100:{l:{111:{l:{116:{l:{59:{c:[289]}}}}}}},101:{l:{59:{c:[8805]},108:{l:{59:{c:[8923]}}},113:{l:{59:{c:[8805]},113:{l:{59:{c:[8807]}}},115:{l:{108:{l:{97:{l:{110:{l:{116:{l:{59:{c:[10878]}}}}}}}}}}}}},115:{l:{59:{c:[10878]},99:{l:{99:{l:{59:{c:[10921]}}}}},100:{l:{111:{l:{116:{l:{59:{c:[10880]},111:{l:{59:{c:[10882]},108:{l:{59:{c:[10884]}}}}}}}}}}},108:{l:{59:{c:[8923,65024]},101:{l:{115:{l:{59:{c:[10900]}}}}}}}}}}},102:{l:{114:{l:{59:{c:[120100]}}}}},103:{l:{59:{c:[8811]},103:{l:{59:{c:[8921]}}}}},105:{l:{109:{l:{101:{l:{108:{l:{59:{c:[8503]}}}}}}}}},106:{l:{99:{l:{121:{l:{59:{c:[1107]}}}}}}},108:{l:{59:{c:[8823]},69:{l:{59:{c:[10898]}}},97:{l:{59:{c:[10917]}}},106:{l:{59:{c:[10916]}}}}},110:{l:{69:{l:{59:{c:[8809]}}},97:{l:{112:{l:{59:{c:[10890]},112:{l:{114:{l:{111:{l:{120:{l:{59:{c:[10890]}}}}}}}}}}}}},101:{l:{59:{c:[10888]},113:{l:{59:{c:[10888]},113:{l:{59:{c:[8809]}}}}}}},115:{l:{105:{l:{109:{l:{59:{c:[8935]}}}}}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120152]}}}}}}},114:{l:{97:{l:{118:{l:{101:{l:{59:{c:[96]}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[8458]}}}}},105:{l:{109:{l:{59:{c:[8819]},101:{l:{59:{c:[10894]}}},108:{l:{59:{c:[10896]}}}}}}}}},116:{l:{59:{c:[62]},99:{l:{99:{l:{59:{c:[10919]}}},105:{l:{114:{l:{59:{c:[10874]}}}}}}},100:{l:{111:{l:{116:{l:{59:{c:[8919]}}}}}}},108:{l:{80:{l:{97:{l:{114:{l:{59:{c:[10645]}}}}}}}}},113:{l:{117:{l:{101:{l:{115:{l:{116:{l:{59:{c:[10876]}}}}}}}}}}},114:{l:{97:{l:{112:{l:{112:{l:{114:{l:{111:{l:{120:{l:{59:{c:[10886]}}}}}}}}}}},114:{l:{114:{l:{59:{c:[10616]}}}}}}},100:{l:{111:{l:{116:{l:{59:{c:[8919]}}}}}}},101:{l:{113:{l:{108:{l:{101:{l:{115:{l:{115:{l:{59:{c:[8923]}}}}}}}}},113:{l:{108:{l:{101:{l:{115:{l:{115:{l:{59:{c:[10892]}}}}}}}}}}}}}}},108:{l:{101:{l:{115:{l:{115:{l:{59:{c:[8823]}}}}}}}}},115:{l:{105:{l:{109:{l:{59:{c:[8819]}}}}}}}}}},c:[62]},118:{l:{101:{l:{114:{l:{116:{l:{110:{l:{101:{l:{113:{l:{113:{l:{59:{c:[8809,65024]}}}}}}}}}}}}}}},110:{l:{69:{l:{59:{c:[8809,65024]}}}}}}}}},104:{l:{65:{l:{114:{l:{114:{l:{59:{c:[8660]}}}}}}},97:{l:{105:{l:{114:{l:{115:{l:{112:{l:{59:{c:[8202]}}}}}}}}},108:{l:{102:{l:{59:{c:[189]}}}}},109:{l:{105:{l:{108:{l:{116:{l:{59:{c:[8459]}}}}}}}}},114:{l:{100:{l:{99:{l:{121:{l:{59:{c:[1098]}}}}}}},114:{l:{59:{c:[8596]},99:{l:{105:{l:{114:{l:{59:{c:[10568]}}}}}}},119:{l:{59:{c:[8621]}}}}}}}}},98:{l:{97:{l:{114:{l:{59:{c:[8463]}}}}}}},99:{l:{105:{l:{114:{l:{99:{l:{59:{c:[293]}}}}}}}}},101:{l:{97:{l:{114:{l:{116:{l:{115:{l:{59:{c:[9829]},117:{l:{105:{l:{116:{l:{59:{c:[9829]}}}}}}}}}}}}}}},108:{l:{108:{l:{105:{l:{112:{l:{59:{c:[8230]}}}}}}}}},114:{l:{99:{l:{111:{l:{110:{l:{59:{c:[8889]}}}}}}}}}}},102:{l:{114:{l:{59:{c:[120101]}}}}},107:{l:{115:{l:{101:{l:{97:{l:{114:{l:{111:{l:{119:{l:{59:{c:[10533]}}}}}}}}}}},119:{l:{97:{l:{114:{l:{111:{l:{119:{l:{59:{c:[10534]}}}}}}}}}}}}}}},111:{l:{97:{l:{114:{l:{114:{l:{59:{c:[8703]}}}}}}},109:{l:{116:{l:{104:{l:{116:{l:{59:{c:[8763]}}}}}}}}},111:{l:{107:{l:{108:{l:{101:{l:{102:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8617]}}}}}}}}}}}}}}}}}}},114:{l:{105:{l:{103:{l:{104:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8618]}}}}}}}}}}}}}}}}}}}}}}}}},112:{l:{102:{l:{59:{c:[120153]}}}}},114:{l:{98:{l:{97:{l:{114:{l:{59:{c:[8213]}}}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119997]}}}}},108:{l:{97:{l:{115:{l:{104:{l:{59:{c:[8463]}}}}}}}}},116:{l:{114:{l:{111:{l:{107:{l:{59:{c:[295]}}}}}}}}}}},121:{l:{98:{l:{117:{l:{108:{l:{108:{l:{59:{c:[8259]}}}}}}}}},112:{l:{104:{l:{101:{l:{110:{l:{59:{c:[8208]}}}}}}}}}}}}},105:{l:{97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[237]}},c:[237]}}}}}}}}},99:{l:{59:{c:[8291]},105:{l:{114:{l:{99:{l:{59:{c:[238]}},c:[238]}}}}},121:{l:{59:{c:[1080]}}}}},101:{l:{99:{l:{121:{l:{59:{c:[1077]}}}}},120:{l:{99:{l:{108:{l:{59:{c:[161]}},c:[161]}}}}}}},102:{l:{102:{l:{59:{c:[8660]}}},114:{l:{59:{c:[120102]}}}}},103:{l:{114:{l:{97:{l:{118:{l:{101:{l:{59:{c:[236]}},c:[236]}}}}}}}}},105:{l:{59:{c:[8520]},105:{l:{105:{l:{110:{l:{116:{l:{59:{c:[10764]}}}}}}},110:{l:{116:{l:{59:{c:[8749]}}}}}}},110:{l:{102:{l:{105:{l:{110:{l:{59:{c:[10716]}}}}}}}}},111:{l:{116:{l:{97:{l:{59:{c:[8489]}}}}}}}}},106:{l:{108:{l:{105:{l:{103:{l:{59:{c:[307]}}}}}}}}},109:{l:{97:{l:{99:{l:{114:{l:{59:{c:[299]}}}}},103:{l:{101:{l:{59:{c:[8465]}}},108:{l:{105:{l:{110:{l:{101:{l:{59:{c:[8464]}}}}}}}}},112:{l:{97:{l:{114:{l:{116:{l:{59:{c:[8465]}}}}}}}}}}},116:{l:{104:{l:{59:{c:[305]}}}}}}},111:{l:{102:{l:{59:{c:[8887]}}}}},112:{l:{101:{l:{100:{l:{59:{c:[437]}}}}}}}}},110:{l:{59:{c:[8712]},99:{l:{97:{l:{114:{l:{101:{l:{59:{c:[8453]}}}}}}}}},102:{l:{105:{l:{110:{l:{59:{c:[8734]},116:{l:{105:{l:{101:{l:{59:{c:[10717]}}}}}}}}}}}}},111:{l:{100:{l:{111:{l:{116:{l:{59:{c:[305]}}}}}}}}},116:{l:{59:{c:[8747]},99:{l:{97:{l:{108:{l:{59:{c:[8890]}}}}}}},101:{l:{103:{l:{101:{l:{114:{l:{115:{l:{59:{c:[8484]}}}}}}}}},114:{l:{99:{l:{97:{l:{108:{l:{59:{c:[8890]}}}}}}}}}}},108:{l:{97:{l:{114:{l:{104:{l:{107:{l:{59:{c:[10775]}}}}}}}}}}},112:{l:{114:{l:{111:{l:{100:{l:{59:{c:[10812]}}}}}}}}}}}}},111:{l:{99:{l:{121:{l:{59:{c:[1105]}}}}},103:{l:{111:{l:{110:{l:{59:{c:[303]}}}}}}},112:{l:{102:{l:{59:{c:[120154]}}}}},116:{l:{97:{l:{59:{c:[953]}}}}}}},112:{l:{114:{l:{111:{l:{100:{l:{59:{c:[10812]}}}}}}}}},113:{l:{117:{l:{101:{l:{115:{l:{116:{l:{59:{c:[191]}},c:[191]}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119998]}}}}},105:{l:{110:{l:{59:{c:[8712]},69:{l:{59:{c:[8953]}}},100:{l:{111:{l:{116:{l:{59:{c:[8949]}}}}}}},115:{l:{59:{c:[8948]},118:{l:{59:{c:[8947]}}}}},118:{l:{59:{c:[8712]}}}}}}}}},116:{l:{59:{c:[8290]},105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[297]}}}}}}}}}}},117:{l:{107:{l:{99:{l:{121:{l:{59:{c:[1110]}}}}}}},109:{l:{108:{l:{59:{c:[239]}},c:[239]}}}}}}},106:{l:{99:{l:{105:{l:{114:{l:{99:{l:{59:{c:[309]}}}}}}},121:{l:{59:{c:[1081]}}}}},102:{l:{114:{l:{59:{c:[120103]}}}}},109:{l:{97:{l:{116:{l:{104:{l:{59:{c:[567]}}}}}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120155]}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[119999]}}}}},101:{l:{114:{l:{99:{l:{121:{l:{59:{c:[1112]}}}}}}}}}}},117:{l:{107:{l:{99:{l:{121:{l:{59:{c:[1108]}}}}}}}}}}},107:{l:{97:{l:{112:{l:{112:{l:{97:{l:{59:{c:[954]},118:{l:{59:{c:[1008]}}}}}}}}}}},99:{l:{101:{l:{100:{l:{105:{l:{108:{l:{59:{c:[311]}}}}}}}}},121:{l:{59:{c:[1082]}}}}},102:{l:{114:{l:{59:{c:[120104]}}}}},103:{l:{114:{l:{101:{l:{101:{l:{110:{l:{59:{c:[312]}}}}}}}}}}},104:{l:{99:{l:{121:{l:{59:{c:[1093]}}}}}}},106:{l:{99:{l:{121:{l:{59:{c:[1116]}}}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120156]}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[12e4]}}}}}}}}},108:{l:{65:{l:{97:{l:{114:{l:{114:{l:{59:{c:[8666]}}}}}}},114:{l:{114:{l:{59:{c:[8656]}}}}},116:{l:{97:{l:{105:{l:{108:{l:{59:{c:[10523]}}}}}}}}}}},66:{l:{97:{l:{114:{l:{114:{l:{59:{c:[10510]}}}}}}}}},69:{l:{59:{c:[8806]},103:{l:{59:{c:[10891]}}}}},72:{l:{97:{l:{114:{l:{59:{c:[10594]}}}}}}},97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[314]}}}}}}}}},101:{l:{109:{l:{112:{l:{116:{l:{121:{l:{118:{l:{59:{c:[10676]}}}}}}}}}}}}},103:{l:{114:{l:{97:{l:{110:{l:{59:{c:[8466]}}}}}}}}},109:{l:{98:{l:{100:{l:{97:{l:{59:{c:[955]}}}}}}}}},110:{l:{103:{l:{59:{c:[10216]},100:{l:{59:{c:[10641]}}},108:{l:{101:{l:{59:{c:[10216]}}}}}}}}},112:{l:{59:{c:[10885]}}},113:{l:{117:{l:{111:{l:{59:{c:[171]}},c:[171]}}}}},114:{l:{114:{l:{59:{c:[8592]},98:{l:{59:{c:[8676]},102:{l:{115:{l:{59:{c:[10527]}}}}}}},102:{l:{115:{l:{59:{c:[10525]}}}}},104:{l:{107:{l:{59:{c:[8617]}}}}},108:{l:{112:{l:{59:{c:[8619]}}}}},112:{l:{108:{l:{59:{c:[10553]}}}}},115:{l:{105:{l:{109:{l:{59:{c:[10611]}}}}}}},116:{l:{108:{l:{59:{c:[8610]}}}}}}}}},116:{l:{59:{c:[10923]},97:{l:{105:{l:{108:{l:{59:{c:[10521]}}}}}}},101:{l:{59:{c:[10925]},115:{l:{59:{c:[10925,65024]}}}}}}}}},98:{l:{97:{l:{114:{l:{114:{l:{59:{c:[10508]}}}}}}},98:{l:{114:{l:{107:{l:{59:{c:[10098]}}}}}}},114:{l:{97:{l:{99:{l:{101:{l:{59:{c:[123]}}},107:{l:{59:{c:[91]}}}}}}},107:{l:{101:{l:{59:{c:[10635]}}},115:{l:{108:{l:{100:{l:{59:{c:[10639]}}},117:{l:{59:{c:[10637]}}}}}}}}}}}}},99:{l:{97:{l:{114:{l:{111:{l:{110:{l:{59:{c:[318]}}}}}}}}},101:{l:{100:{l:{105:{l:{108:{l:{59:{c:[316]}}}}}}},105:{l:{108:{l:{59:{c:[8968]}}}}}}},117:{l:{98:{l:{59:{c:[123]}}}}},121:{l:{59:{c:[1083]}}}}},100:{l:{99:{l:{97:{l:{59:{c:[10550]}}}}},113:{l:{117:{l:{111:{l:{59:{c:[8220]},114:{l:{59:{c:[8222]}}}}}}}}},114:{l:{100:{l:{104:{l:{97:{l:{114:{l:{59:{c:[10599]}}}}}}}}},117:{l:{115:{l:{104:{l:{97:{l:{114:{l:{59:{c:[10571]}}}}}}}}}}}}},115:{l:{104:{l:{59:{c:[8626]}}}}}}},101:{l:{59:{c:[8804]},102:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8592]},116:{l:{97:{l:{105:{l:{108:{l:{59:{c:[8610]}}}}}}}}}}}}}}}}}}},104:{l:{97:{l:{114:{l:{112:{l:{111:{l:{111:{l:{110:{l:{100:{l:{111:{l:{119:{l:{110:{l:{59:{c:[8637]}}}}}}}}},117:{l:{112:{l:{59:{c:[8636]}}}}}}}}}}}}}}}}}}},108:{l:{101:{l:{102:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{115:{l:{59:{c:[8647]}}}}}}}}}}}}}}}}}}}}},114:{l:{105:{l:{103:{l:{104:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8596]},115:{l:{59:{c:[8646]}}}}}}}}}}}}},104:{l:{97:{l:{114:{l:{112:{l:{111:{l:{111:{l:{110:{l:{115:{l:{59:{c:[8651]}}}}}}}}}}}}}}}}},115:{l:{113:{l:{117:{l:{105:{l:{103:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8621]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},116:{l:{104:{l:{114:{l:{101:{l:{101:{l:{116:{l:{105:{l:{109:{l:{101:{l:{115:{l:{59:{c:[8907]}}}}}}}}}}}}}}}}}}}}}}}}},103:{l:{59:{c:[8922]}}},113:{l:{59:{c:[8804]},113:{l:{59:{c:[8806]}}},115:{l:{108:{l:{97:{l:{110:{l:{116:{l:{59:{c:[10877]}}}}}}}}}}}}},115:{l:{59:{c:[10877]},99:{l:{99:{l:{59:{c:[10920]}}}}},100:{l:{111:{l:{116:{l:{59:{c:[10879]},111:{l:{59:{c:[10881]},114:{l:{59:{c:[10883]}}}}}}}}}}},103:{l:{59:{c:[8922,65024]},101:{l:{115:{l:{59:{c:[10899]}}}}}}},115:{l:{97:{l:{112:{l:{112:{l:{114:{l:{111:{l:{120:{l:{59:{c:[10885]}}}}}}}}}}}}},100:{l:{111:{l:{116:{l:{59:{c:[8918]}}}}}}},101:{l:{113:{l:{103:{l:{116:{l:{114:{l:{59:{c:[8922]}}}}}}},113:{l:{103:{l:{116:{l:{114:{l:{59:{c:[10891]}}}}}}}}}}}}},103:{l:{116:{l:{114:{l:{59:{c:[8822]}}}}}}},115:{l:{105:{l:{109:{l:{59:{c:[8818]}}}}}}}}}}}}},102:{l:{105:{l:{115:{l:{104:{l:{116:{l:{59:{c:[10620]}}}}}}}}},108:{l:{111:{l:{111:{l:{114:{l:{59:{c:[8970]}}}}}}}}},114:{l:{59:{c:[120105]}}}}},103:{l:{59:{c:[8822]},69:{l:{59:{c:[10897]}}}}},104:{l:{97:{l:{114:{l:{100:{l:{59:{c:[8637]}}},117:{l:{59:{c:[8636]},108:{l:{59:{c:[10602]}}}}}}}}},98:{l:{108:{l:{107:{l:{59:{c:[9604]}}}}}}}}},106:{l:{99:{l:{121:{l:{59:{c:[1113]}}}}}}},108:{l:{59:{c:[8810]},97:{l:{114:{l:{114:{l:{59:{c:[8647]}}}}}}},99:{l:{111:{l:{114:{l:{110:{l:{101:{l:{114:{l:{59:{c:[8990]}}}}}}}}}}}}},104:{l:{97:{l:{114:{l:{100:{l:{59:{c:[10603]}}}}}}}}},116:{l:{114:{l:{105:{l:{59:{c:[9722]}}}}}}}}},109:{l:{105:{l:{100:{l:{111:{l:{116:{l:{59:{c:[320]}}}}}}}}},111:{l:{117:{l:{115:{l:{116:{l:{59:{c:[9136]},97:{l:{99:{l:{104:{l:{101:{l:{59:{c:[9136]}}}}}}}}}}}}}}}}}}},110:{l:{69:{l:{59:{c:[8808]}}},97:{l:{112:{l:{59:{c:[10889]},112:{l:{114:{l:{111:{l:{120:{l:{59:{c:[10889]}}}}}}}}}}}}},101:{l:{59:{c:[10887]},113:{l:{59:{c:[10887]},113:{l:{59:{c:[8808]}}}}}}},115:{l:{105:{l:{109:{l:{59:{c:[8934]}}}}}}}}},111:{l:{97:{l:{110:{l:{103:{l:{59:{c:[10220]}}}}},114:{l:{114:{l:{59:{c:[8701]}}}}}}},98:{l:{114:{l:{107:{l:{59:{c:[10214]}}}}}}},110:{l:{103:{l:{108:{l:{101:{l:{102:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[10229]}}}}}}}}}}},114:{l:{105:{l:{103:{l:{104:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[10231]}}}}}}}}}}}}}}}}}}}}}}}}}}}}},109:{l:{97:{l:{112:{l:{115:{l:{116:{l:{111:{l:{59:{c:[10236]}}}}}}}}}}}}},114:{l:{105:{l:{103:{l:{104:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[10230]}}}}}}}}}}}}}}}}}}}}}}}}},111:{l:{112:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{108:{l:{101:{l:{102:{l:{116:{l:{59:{c:[8619]}}}}}}}}},114:{l:{105:{l:{103:{l:{104:{l:{116:{l:{59:{c:[8620]}}}}}}}}}}}}}}}}}}}}}}}}},112:{l:{97:{l:{114:{l:{59:{c:[10629]}}}}},102:{l:{59:{c:[120157]}}},108:{l:{117:{l:{115:{l:{59:{c:[10797]}}}}}}}}},116:{l:{105:{l:{109:{l:{101:{l:{115:{l:{59:{c:[10804]}}}}}}}}}}},119:{l:{97:{l:{115:{l:{116:{l:{59:{c:[8727]}}}}}}},98:{l:{97:{l:{114:{l:{59:{c:[95]}}}}}}}}},122:{l:{59:{c:[9674]},101:{l:{110:{l:{103:{l:{101:{l:{59:{c:[9674]}}}}}}}}},102:{l:{59:{c:[10731]}}}}}}},112:{l:{97:{l:{114:{l:{59:{c:[40]},108:{l:{116:{l:{59:{c:[10643]}}}}}}}}}}},114:{l:{97:{l:{114:{l:{114:{l:{59:{c:[8646]}}}}}}},99:{l:{111:{l:{114:{l:{110:{l:{101:{l:{114:{l:{59:{c:[8991]}}}}}}}}}}}}},104:{l:{97:{l:{114:{l:{59:{c:[8651]},100:{l:{59:{c:[10605]}}}}}}}}},109:{l:{59:{c:[8206]}}},116:{l:{114:{l:{105:{l:{59:{c:[8895]}}}}}}}}},115:{l:{97:{l:{113:{l:{117:{l:{111:{l:{59:{c:[8249]}}}}}}}}},99:{l:{114:{l:{59:{c:[120001]}}}}},104:{l:{59:{c:[8624]}}},105:{l:{109:{l:{59:{c:[8818]},101:{l:{59:{c:[10893]}}},103:{l:{59:{c:[10895]}}}}}}},113:{l:{98:{l:{59:{c:[91]}}},117:{l:{111:{l:{59:{c:[8216]},114:{l:{59:{c:[8218]}}}}}}}}},116:{l:{114:{l:{111:{l:{107:{l:{59:{c:[322]}}}}}}}}}}},116:{l:{59:{c:[60]},99:{l:{99:{l:{59:{c:[10918]}}},105:{l:{114:{l:{59:{c:[10873]}}}}}}},100:{l:{111:{l:{116:{l:{59:{c:[8918]}}}}}}},104:{l:{114:{l:{101:{l:{101:{l:{59:{c:[8907]}}}}}}}}},105:{l:{109:{l:{101:{l:{115:{l:{59:{c:[8905]}}}}}}}}},108:{l:{97:{l:{114:{l:{114:{l:{59:{c:[10614]}}}}}}}}},113:{l:{117:{l:{101:{l:{115:{l:{116:{l:{59:{c:[10875]}}}}}}}}}}},114:{l:{80:{l:{97:{l:{114:{l:{59:{c:[10646]}}}}}}},105:{l:{59:{c:[9667]},101:{l:{59:{c:[8884]}}},102:{l:{59:{c:[9666]}}}}}}}},c:[60]},117:{l:{114:{l:{100:{l:{115:{l:{104:{l:{97:{l:{114:{l:{59:{c:[10570]}}}}}}}}}}},117:{l:{104:{l:{97:{l:{114:{l:{59:{c:[10598]}}}}}}}}}}}}},118:{l:{101:{l:{114:{l:{116:{l:{110:{l:{101:{l:{113:{l:{113:{l:{59:{c:[8808,65024]}}}}}}}}}}}}}}},110:{l:{69:{l:{59:{c:[8808,65024]}}}}}}}}},109:{l:{68:{l:{68:{l:{111:{l:{116:{l:{59:{c:[8762]}}}}}}}}},97:{l:{99:{l:{114:{l:{59:{c:[175]}},c:[175]}}},108:{l:{101:{l:{59:{c:[9794]}}},116:{l:{59:{c:[10016]},101:{l:{115:{l:{101:{l:{59:{c:[10016]}}}}}}}}}}},112:{l:{59:{c:[8614]},115:{l:{116:{l:{111:{l:{59:{c:[8614]},100:{l:{111:{l:{119:{l:{110:{l:{59:{c:[8615]}}}}}}}}},108:{l:{101:{l:{102:{l:{116:{l:{59:{c:[8612]}}}}}}}}},117:{l:{112:{l:{59:{c:[8613]}}}}}}}}}}}}},114:{l:{107:{l:{101:{l:{114:{l:{59:{c:[9646]}}}}}}}}}}},99:{l:{111:{l:{109:{l:{109:{l:{97:{l:{59:{c:[10793]}}}}}}}}},121:{l:{59:{c:[1084]}}}}},100:{l:{97:{l:{115:{l:{104:{l:{59:{c:[8212]}}}}}}}}},101:{l:{97:{l:{115:{l:{117:{l:{114:{l:{101:{l:{100:{l:{97:{l:{110:{l:{103:{l:{108:{l:{101:{l:{59:{c:[8737]}}}}}}}}}}}}}}}}}}}}}}}}},102:{l:{114:{l:{59:{c:[120106]}}}}},104:{l:{111:{l:{59:{c:[8487]}}}}},105:{l:{99:{l:{114:{l:{111:{l:{59:{c:[181]}},c:[181]}}}}},100:{l:{59:{c:[8739]},97:{l:{115:{l:{116:{l:{59:{c:[42]}}}}}}},99:{l:{105:{l:{114:{l:{59:{c:[10992]}}}}}}},100:{l:{111:{l:{116:{l:{59:{c:[183]}},c:[183]}}}}}}},110:{l:{117:{l:{115:{l:{59:{c:[8722]},98:{l:{59:{c:[8863]}}},100:{l:{59:{c:[8760]},117:{l:{59:{c:[10794]}}}}}}}}}}}}},108:{l:{99:{l:{112:{l:{59:{c:[10971]}}}}},100:{l:{114:{l:{59:{c:[8230]}}}}}}},110:{l:{112:{l:{108:{l:{117:{l:{115:{l:{59:{c:[8723]}}}}}}}}}}},111:{l:{100:{l:{101:{l:{108:{l:{115:{l:{59:{c:[8871]}}}}}}}}},112:{l:{102:{l:{59:{c:[120158]}}}}}}},112:{l:{59:{c:[8723]}}},115:{l:{99:{l:{114:{l:{59:{c:[120002]}}}}},116:{l:{112:{l:{111:{l:{115:{l:{59:{c:[8766]}}}}}}}}}}},117:{l:{59:{c:[956]},108:{l:{116:{l:{105:{l:{109:{l:{97:{l:{112:{l:{59:{c:[8888]}}}}}}}}}}}}},109:{l:{97:{l:{112:{l:{59:{c:[8888]}}}}}}}}}}},110:{l:{71:{l:{103:{l:{59:{c:[8921,824]}}},116:{l:{59:{c:[8811,8402]},118:{l:{59:{c:[8811,824]}}}}}}},76:{l:{101:{l:{102:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8653]}}}}}}}}}}},114:{l:{105:{l:{103:{l:{104:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8654]}}}}}}}}}}}}}}}}}}}}}}}}}}},108:{l:{59:{c:[8920,824]}}},116:{l:{59:{c:[8810,8402]},118:{l:{59:{c:[8810,824]}}}}}}},82:{l:{105:{l:{103:{l:{104:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8655]}}}}}}}}}}}}}}}}}}}}},86:{l:{68:{l:{97:{l:{115:{l:{104:{l:{59:{c:[8879]}}}}}}}}},100:{l:{97:{l:{115:{l:{104:{l:{59:{c:[8878]}}}}}}}}}}},97:{l:{98:{l:{108:{l:{97:{l:{59:{c:[8711]}}}}}}},99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[324]}}}}}}}}},110:{l:{103:{l:{59:{c:[8736,8402]}}}}},112:{l:{59:{c:[8777]},69:{l:{59:{c:[10864,824]}}},105:{l:{100:{l:{59:{c:[8779,824]}}}}},111:{l:{115:{l:{59:{c:[329]}}}}},112:{l:{114:{l:{111:{l:{120:{l:{59:{c:[8777]}}}}}}}}}}},116:{l:{117:{l:{114:{l:{59:{c:[9838]},97:{l:{108:{l:{59:{c:[9838]},115:{l:{59:{c:[8469]}}}}}}}}}}}}}}},98:{l:{115:{l:{112:{l:{59:{c:[160]}},c:[160]}}},117:{l:{109:{l:{112:{l:{59:{c:[8782,824]},101:{l:{59:{c:[8783,824]}}}}}}}}}}},99:{l:{97:{l:{112:{l:{59:{c:[10819]}}},114:{l:{111:{l:{110:{l:{59:{c:[328]}}}}}}}}},101:{l:{100:{l:{105:{l:{108:{l:{59:{c:[326]}}}}}}}}},111:{l:{110:{l:{103:{l:{59:{c:[8775]},100:{l:{111:{l:{116:{l:{59:{c:[10861,824]}}}}}}}}}}}}},117:{l:{112:{l:{59:{c:[10818]}}}}},121:{l:{59:{c:[1085]}}}}},100:{l:{97:{l:{115:{l:{104:{l:{59:{c:[8211]}}}}}}}}},101:{l:{59:{c:[8800]},65:{l:{114:{l:{114:{l:{59:{c:[8663]}}}}}}},97:{l:{114:{l:{104:{l:{107:{l:{59:{c:[10532]}}}}},114:{l:{59:{c:[8599]},111:{l:{119:{l:{59:{c:[8599]}}}}}}}}}}},100:{l:{111:{l:{116:{l:{59:{c:[8784,824]}}}}}}},113:{l:{117:{l:{105:{l:{118:{l:{59:{c:[8802]}}}}}}}}},115:{l:{101:{l:{97:{l:{114:{l:{59:{c:[10536]}}}}}}},105:{l:{109:{l:{59:{c:[8770,824]}}}}}}},120:{l:{105:{l:{115:{l:{116:{l:{59:{c:[8708]},115:{l:{59:{c:[8708]}}}}}}}}}}}}},102:{l:{114:{l:{59:{c:[120107]}}}}},103:{l:{69:{l:{59:{c:[8807,824]}}},101:{l:{59:{c:[8817]},113:{l:{59:{c:[8817]},113:{l:{59:{c:[8807,824]}}},115:{l:{108:{l:{97:{l:{110:{l:{116:{l:{59:{c:[10878,824]}}}}}}}}}}}}},115:{l:{59:{c:[10878,824]}}}}},115:{l:{105:{l:{109:{l:{59:{c:[8821]}}}}}}},116:{l:{59:{c:[8815]},114:{l:{59:{c:[8815]}}}}}}},104:{l:{65:{l:{114:{l:{114:{l:{59:{c:[8654]}}}}}}},97:{l:{114:{l:{114:{l:{59:{c:[8622]}}}}}}},112:{l:{97:{l:{114:{l:{59:{c:[10994]}}}}}}}}},105:{l:{59:{c:[8715]},115:{l:{59:{c:[8956]},100:{l:{59:{c:[8954]}}}}},118:{l:{59:{c:[8715]}}}}},106:{l:{99:{l:{121:{l:{59:{c:[1114]}}}}}}},108:{l:{65:{l:{114:{l:{114:{l:{59:{c:[8653]}}}}}}},69:{l:{59:{c:[8806,824]}}},97:{l:{114:{l:{114:{l:{59:{c:[8602]}}}}}}},100:{l:{114:{l:{59:{c:[8229]}}}}},101:{l:{59:{c:[8816]},102:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8602]}}}}}}}}}}},114:{l:{105:{l:{103:{l:{104:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8622]}}}}}}}}}}}}}}}}}}}}}}}}},113:{l:{59:{c:[8816]},113:{l:{59:{c:[8806,824]}}},115:{l:{108:{l:{97:{l:{110:{l:{116:{l:{59:{c:[10877,824]}}}}}}}}}}}}},115:{l:{59:{c:[10877,824]},115:{l:{59:{c:[8814]}}}}}}},115:{l:{105:{l:{109:{l:{59:{c:[8820]}}}}}}},116:{l:{59:{c:[8814]},114:{l:{105:{l:{59:{c:[8938]},101:{l:{59:{c:[8940]}}}}}}}}}}},109:{l:{105:{l:{100:{l:{59:{c:[8740]}}}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120159]}}}}},116:{l:{59:{c:[172]},105:{l:{110:{l:{59:{c:[8713]},69:{l:{59:{c:[8953,824]}}},100:{l:{111:{l:{116:{l:{59:{c:[8949,824]}}}}}}},118:{l:{97:{l:{59:{c:[8713]}}},98:{l:{59:{c:[8951]}}},99:{l:{59:{c:[8950]}}}}}}}}},110:{l:{105:{l:{59:{c:[8716]},118:{l:{97:{l:{59:{c:[8716]}}},98:{l:{59:{c:[8958]}}},99:{l:{59:{c:[8957]}}}}}}}}}},c:[172]}}},112:{l:{97:{l:{114:{l:{59:{c:[8742]},97:{l:{108:{l:{108:{l:{101:{l:{108:{l:{59:{c:[8742]}}}}}}}}}}},115:{l:{108:{l:{59:{c:[11005,8421]}}}}},116:{l:{59:{c:[8706,824]}}}}}}},111:{l:{108:{l:{105:{l:{110:{l:{116:{l:{59:{c:[10772]}}}}}}}}}}},114:{l:{59:{c:[8832]},99:{l:{117:{l:{101:{l:{59:{c:[8928]}}}}}}},101:{l:{59:{c:[10927,824]},99:{l:{59:{c:[8832]},101:{l:{113:{l:{59:{c:[10927,824]}}}}}}}}}}}}},114:{l:{65:{l:{114:{l:{114:{l:{59:{c:[8655]}}}}}}},97:{l:{114:{l:{114:{l:{59:{c:[8603]},99:{l:{59:{c:[10547,824]}}},119:{l:{59:{c:[8605,824]}}}}}}}}},105:{l:{103:{l:{104:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8603]}}}}}}}}}}}}}}}}}}},116:{l:{114:{l:{105:{l:{59:{c:[8939]},101:{l:{59:{c:[8941]}}}}}}}}}}},115:{l:{99:{l:{59:{c:[8833]},99:{l:{117:{l:{101:{l:{59:{c:[8929]}}}}}}},101:{l:{59:{c:[10928,824]}}},114:{l:{59:{c:[120003]}}}}},104:{l:{111:{l:{114:{l:{116:{l:{109:{l:{105:{l:{100:{l:{59:{c:[8740]}}}}}}},112:{l:{97:{l:{114:{l:{97:{l:{108:{l:{108:{l:{101:{l:{108:{l:{59:{c:[8742]}}}}}}}}}}}}}}}}}}}}}}}}},105:{l:{109:{l:{59:{c:[8769]},101:{l:{59:{c:[8772]},113:{l:{59:{c:[8772]}}}}}}}}},109:{l:{105:{l:{100:{l:{59:{c:[8740]}}}}}}},112:{l:{97:{l:{114:{l:{59:{c:[8742]}}}}}}},113:{l:{115:{l:{117:{l:{98:{l:{101:{l:{59:{c:[8930]}}}}},112:{l:{101:{l:{59:{c:[8931]}}}}}}}}}}},117:{l:{98:{l:{59:{c:[8836]},69:{l:{59:{c:[10949,824]}}},101:{l:{59:{c:[8840]}}},115:{l:{101:{l:{116:{l:{59:{c:[8834,8402]},101:{l:{113:{l:{59:{c:[8840]},113:{l:{59:{c:[10949,824]}}}}}}}}}}}}}}},99:{l:{99:{l:{59:{c:[8833]},101:{l:{113:{l:{59:{c:[10928,824]}}}}}}}}},112:{l:{59:{c:[8837]},69:{l:{59:{c:[10950,824]}}},101:{l:{59:{c:[8841]}}},115:{l:{101:{l:{116:{l:{59:{c:[8835,8402]},101:{l:{113:{l:{59:{c:[8841]},113:{l:{59:{c:[10950,824]}}}}}}}}}}}}}}}}}}},116:{l:{103:{l:{108:{l:{59:{c:[8825]}}}}},105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[241]}},c:[241]}}}}}}},108:{l:{103:{l:{59:{c:[8824]}}}}},114:{l:{105:{l:{97:{l:{110:{l:{103:{l:{108:{l:{101:{l:{108:{l:{101:{l:{102:{l:{116:{l:{59:{c:[8938]},101:{l:{113:{l:{59:{c:[8940]}}}}}}}}}}}}},114:{l:{105:{l:{103:{l:{104:{l:{116:{l:{59:{c:[8939]},101:{l:{113:{l:{59:{c:[8941]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},117:{l:{59:{c:[957]},109:{l:{59:{c:[35]},101:{l:{114:{l:{111:{l:{59:{c:[8470]}}}}}}},115:{l:{112:{l:{59:{c:[8199]}}}}}}}}},118:{l:{68:{l:{97:{l:{115:{l:{104:{l:{59:{c:[8877]}}}}}}}}},72:{l:{97:{l:{114:{l:{114:{l:{59:{c:[10500]}}}}}}}}},97:{l:{112:{l:{59:{c:[8781,8402]}}}}},100:{l:{97:{l:{115:{l:{104:{l:{59:{c:[8876]}}}}}}}}},103:{l:{101:{l:{59:{c:[8805,8402]}}},116:{l:{59:{c:[62,8402]}}}}},105:{l:{110:{l:{102:{l:{105:{l:{110:{l:{59:{c:[10718]}}}}}}}}}}},108:{l:{65:{l:{114:{l:{114:{l:{59:{c:[10498]}}}}}}},101:{l:{59:{c:[8804,8402]}}},116:{l:{59:{c:[60,8402]},114:{l:{105:{l:{101:{l:{59:{c:[8884,8402]}}}}}}}}}}},114:{l:{65:{l:{114:{l:{114:{l:{59:{c:[10499]}}}}}}},116:{l:{114:{l:{105:{l:{101:{l:{59:{c:[8885,8402]}}}}}}}}}}},115:{l:{105:{l:{109:{l:{59:{c:[8764,8402]}}}}}}}}},119:{l:{65:{l:{114:{l:{114:{l:{59:{c:[8662]}}}}}}},97:{l:{114:{l:{104:{l:{107:{l:{59:{c:[10531]}}}}},114:{l:{59:{c:[8598]},111:{l:{119:{l:{59:{c:[8598]}}}}}}}}}}},110:{l:{101:{l:{97:{l:{114:{l:{59:{c:[10535]}}}}}}}}}}}}},111:{l:{83:{l:{59:{c:[9416]}}},97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[243]}},c:[243]}}}}}}},115:{l:{116:{l:{59:{c:[8859]}}}}}}},99:{l:{105:{l:{114:{l:{59:{c:[8858]},99:{l:{59:{c:[244]}},c:[244]}}}}},121:{l:{59:{c:[1086]}}}}},100:{l:{97:{l:{115:{l:{104:{l:{59:{c:[8861]}}}}}}},98:{l:{108:{l:{97:{l:{99:{l:{59:{c:[337]}}}}}}}}},105:{l:{118:{l:{59:{c:[10808]}}}}},111:{l:{116:{l:{59:{c:[8857]}}}}},115:{l:{111:{l:{108:{l:{100:{l:{59:{c:[10684]}}}}}}}}}}},101:{l:{108:{l:{105:{l:{103:{l:{59:{c:[339]}}}}}}}}},102:{l:{99:{l:{105:{l:{114:{l:{59:{c:[10687]}}}}}}},114:{l:{59:{c:[120108]}}}}},103:{l:{111:{l:{110:{l:{59:{c:[731]}}}}},114:{l:{97:{l:{118:{l:{101:{l:{59:{c:[242]}},c:[242]}}}}}}},116:{l:{59:{c:[10689]}}}}},104:{l:{98:{l:{97:{l:{114:{l:{59:{c:[10677]}}}}}}},109:{l:{59:{c:[937]}}}}},105:{l:{110:{l:{116:{l:{59:{c:[8750]}}}}}}},108:{l:{97:{l:{114:{l:{114:{l:{59:{c:[8634]}}}}}}},99:{l:{105:{l:{114:{l:{59:{c:[10686]}}}}},114:{l:{111:{l:{115:{l:{115:{l:{59:{c:[10683]}}}}}}}}}}},105:{l:{110:{l:{101:{l:{59:{c:[8254]}}}}}}},116:{l:{59:{c:[10688]}}}}},109:{l:{97:{l:{99:{l:{114:{l:{59:{c:[333]}}}}}}},101:{l:{103:{l:{97:{l:{59:{c:[969]}}}}}}},105:{l:{99:{l:{114:{l:{111:{l:{110:{l:{59:{c:[959]}}}}}}}}},100:{l:{59:{c:[10678]}}},110:{l:{117:{l:{115:{l:{59:{c:[8854]}}}}}}}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120160]}}}}}}},112:{l:{97:{l:{114:{l:{59:{c:[10679]}}}}},101:{l:{114:{l:{112:{l:{59:{c:[10681]}}}}}}},108:{l:{117:{l:{115:{l:{59:{c:[8853]}}}}}}}}},114:{l:{59:{c:[8744]},97:{l:{114:{l:{114:{l:{59:{c:[8635]}}}}}}},100:{l:{59:{c:[10845]},101:{l:{114:{l:{59:{c:[8500]},111:{l:{102:{l:{59:{c:[8500]}}}}}}}}},102:{l:{59:{c:[170]}},c:[170]},109:{l:{59:{c:[186]}},c:[186]}}},105:{l:{103:{l:{111:{l:{102:{l:{59:{c:[8886]}}}}}}}}},111:{l:{114:{l:{59:{c:[10838]}}}}},115:{l:{108:{l:{111:{l:{112:{l:{101:{l:{59:{c:[10839]}}}}}}}}}}},118:{l:{59:{c:[10843]}}}}},115:{l:{99:{l:{114:{l:{59:{c:[8500]}}}}},108:{l:{97:{l:{115:{l:{104:{l:{59:{c:[248]}},c:[248]}}}}}}},111:{l:{108:{l:{59:{c:[8856]}}}}}}},116:{l:{105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[245]}},c:[245]}}}}},109:{l:{101:{l:{115:{l:{59:{c:[8855]},97:{l:{115:{l:{59:{c:[10806]}}}}}}}}}}}}}}},117:{l:{109:{l:{108:{l:{59:{c:[246]}},c:[246]}}}}},118:{l:{98:{l:{97:{l:{114:{l:{59:{c:[9021]}}}}}}}}}}},112:{l:{97:{l:{114:{l:{59:{c:[8741]},97:{l:{59:{c:[182]},108:{l:{108:{l:{101:{l:{108:{l:{59:{c:[8741]}}}}}}}}}},c:[182]},115:{l:{105:{l:{109:{l:{59:{c:[10995]}}}}},108:{l:{59:{c:[11005]}}}}},116:{l:{59:{c:[8706]}}}}}}},99:{l:{121:{l:{59:{c:[1087]}}}}},101:{l:{114:{l:{99:{l:{110:{l:{116:{l:{59:{c:[37]}}}}}}},105:{l:{111:{l:{100:{l:{59:{c:[46]}}}}}}},109:{l:{105:{l:{108:{l:{59:{c:[8240]}}}}}}},112:{l:{59:{c:[8869]}}},116:{l:{101:{l:{110:{l:{107:{l:{59:{c:[8241]}}}}}}}}}}}}},102:{l:{114:{l:{59:{c:[120109]}}}}},104:{l:{105:{l:{59:{c:[966]},118:{l:{59:{c:[981]}}}}},109:{l:{109:{l:{97:{l:{116:{l:{59:{c:[8499]}}}}}}}}},111:{l:{110:{l:{101:{l:{59:{c:[9742]}}}}}}}}},105:{l:{59:{c:[960]},116:{l:{99:{l:{104:{l:{102:{l:{111:{l:{114:{l:{107:{l:{59:{c:[8916]}}}}}}}}}}}}}}},118:{l:{59:{c:[982]}}}}},108:{l:{97:{l:{110:{l:{99:{l:{107:{l:{59:{c:[8463]},104:{l:{59:{c:[8462]}}}}}}},107:{l:{118:{l:{59:{c:[8463]}}}}}}}}},117:{l:{115:{l:{59:{c:[43]},97:{l:{99:{l:{105:{l:{114:{l:{59:{c:[10787]}}}}}}}}},98:{l:{59:{c:[8862]}}},99:{l:{105:{l:{114:{l:{59:{c:[10786]}}}}}}},100:{l:{111:{l:{59:{c:[8724]}}},117:{l:{59:{c:[10789]}}}}},101:{l:{59:{c:[10866]}}},109:{l:{110:{l:{59:{c:[177]}},c:[177]}}},115:{l:{105:{l:{109:{l:{59:{c:[10790]}}}}}}},116:{l:{119:{l:{111:{l:{59:{c:[10791]}}}}}}}}}}}}},109:{l:{59:{c:[177]}}},111:{l:{105:{l:{110:{l:{116:{l:{105:{l:{110:{l:{116:{l:{59:{c:[10773]}}}}}}}}}}}}},112:{l:{102:{l:{59:{c:[120161]}}}}},117:{l:{110:{l:{100:{l:{59:{c:[163]}},c:[163]}}}}}}},114:{l:{59:{c:[8826]},69:{l:{59:{c:[10931]}}},97:{l:{112:{l:{59:{c:[10935]}}}}},99:{l:{117:{l:{101:{l:{59:{c:[8828]}}}}}}},101:{l:{59:{c:[10927]},99:{l:{59:{c:[8826]},97:{l:{112:{l:{112:{l:{114:{l:{111:{l:{120:{l:{59:{c:[10935]}}}}}}}}}}}}},99:{l:{117:{l:{114:{l:{108:{l:{121:{l:{101:{l:{113:{l:{59:{c:[8828]}}}}}}}}}}}}}}},101:{l:{113:{l:{59:{c:[10927]}}}}},110:{l:{97:{l:{112:{l:{112:{l:{114:{l:{111:{l:{120:{l:{59:{c:[10937]}}}}}}}}}}}}},101:{l:{113:{l:{113:{l:{59:{c:[10933]}}}}}}},115:{l:{105:{l:{109:{l:{59:{c:[8936]}}}}}}}}},115:{l:{105:{l:{109:{l:{59:{c:[8830]}}}}}}}}}}},105:{l:{109:{l:{101:{l:{59:{c:[8242]},115:{l:{59:{c:[8473]}}}}}}}}},110:{l:{69:{l:{59:{c:[10933]}}},97:{l:{112:{l:{59:{c:[10937]}}}}},115:{l:{105:{l:{109:{l:{59:{c:[8936]}}}}}}}}},111:{l:{100:{l:{59:{c:[8719]}}},102:{l:{97:{l:{108:{l:{97:{l:{114:{l:{59:{c:[9006]}}}}}}}}},108:{l:{105:{l:{110:{l:{101:{l:{59:{c:[8978]}}}}}}}}},115:{l:{117:{l:{114:{l:{102:{l:{59:{c:[8979]}}}}}}}}}}},112:{l:{59:{c:[8733]},116:{l:{111:{l:{59:{c:[8733]}}}}}}}}},115:{l:{105:{l:{109:{l:{59:{c:[8830]}}}}}}},117:{l:{114:{l:{101:{l:{108:{l:{59:{c:[8880]}}}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[120005]}}}}},105:{l:{59:{c:[968]}}}}},117:{l:{110:{l:{99:{l:{115:{l:{112:{l:{59:{c:[8200]}}}}}}}}}}}}},113:{l:{102:{l:{114:{l:{59:{c:[120110]}}}}},105:{l:{110:{l:{116:{l:{59:{c:[10764]}}}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120162]}}}}}}},112:{l:{114:{l:{105:{l:{109:{l:{101:{l:{59:{c:[8279]}}}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[120006]}}}}}}},117:{l:{97:{l:{116:{l:{101:{l:{114:{l:{110:{l:{105:{l:{111:{l:{110:{l:{115:{l:{59:{c:[8461]}}}}}}}}}}}}}}},105:{l:{110:{l:{116:{l:{59:{c:[10774]}}}}}}}}}}},101:{l:{115:{l:{116:{l:{59:{c:[63]},101:{l:{113:{l:{59:{c:[8799]}}}}}}}}}}},111:{l:{116:{l:{59:{c:[34]}},c:[34]}}}}}}},114:{l:{65:{l:{97:{l:{114:{l:{114:{l:{59:{c:[8667]}}}}}}},114:{l:{114:{l:{59:{c:[8658]}}}}},116:{l:{97:{l:{105:{l:{108:{l:{59:{c:[10524]}}}}}}}}}}},66:{l:{97:{l:{114:{l:{114:{l:{59:{c:[10511]}}}}}}}}},72:{l:{97:{l:{114:{l:{59:{c:[10596]}}}}}}},97:{l:{99:{l:{101:{l:{59:{c:[8765,817]}}},117:{l:{116:{l:{101:{l:{59:{c:[341]}}}}}}}}},100:{l:{105:{l:{99:{l:{59:{c:[8730]}}}}}}},101:{l:{109:{l:{112:{l:{116:{l:{121:{l:{118:{l:{59:{c:[10675]}}}}}}}}}}}}},110:{l:{103:{l:{59:{c:[10217]},100:{l:{59:{c:[10642]}}},101:{l:{59:{c:[10661]}}},108:{l:{101:{l:{59:{c:[10217]}}}}}}}}},113:{l:{117:{l:{111:{l:{59:{c:[187]}},c:[187]}}}}},114:{l:{114:{l:{59:{c:[8594]},97:{l:{112:{l:{59:{c:[10613]}}}}},98:{l:{59:{c:[8677]},102:{l:{115:{l:{59:{c:[10528]}}}}}}},99:{l:{59:{c:[10547]}}},102:{l:{115:{l:{59:{c:[10526]}}}}},104:{l:{107:{l:{59:{c:[8618]}}}}},108:{l:{112:{l:{59:{c:[8620]}}}}},112:{l:{108:{l:{59:{c:[10565]}}}}},115:{l:{105:{l:{109:{l:{59:{c:[10612]}}}}}}},116:{l:{108:{l:{59:{c:[8611]}}}}},119:{l:{59:{c:[8605]}}}}}}},116:{l:{97:{l:{105:{l:{108:{l:{59:{c:[10522]}}}}}}},105:{l:{111:{l:{59:{c:[8758]},110:{l:{97:{l:{108:{l:{115:{l:{59:{c:[8474]}}}}}}}}}}}}}}}}},98:{l:{97:{l:{114:{l:{114:{l:{59:{c:[10509]}}}}}}},98:{l:{114:{l:{107:{l:{59:{c:[10099]}}}}}}},114:{l:{97:{l:{99:{l:{101:{l:{59:{c:[125]}}},107:{l:{59:{c:[93]}}}}}}},107:{l:{101:{l:{59:{c:[10636]}}},115:{l:{108:{l:{100:{l:{59:{c:[10638]}}},117:{l:{59:{c:[10640]}}}}}}}}}}}}},99:{l:{97:{l:{114:{l:{111:{l:{110:{l:{59:{c:[345]}}}}}}}}},101:{l:{100:{l:{105:{l:{108:{l:{59:{c:[343]}}}}}}},105:{l:{108:{l:{59:{c:[8969]}}}}}}},117:{l:{98:{l:{59:{c:[125]}}}}},121:{l:{59:{c:[1088]}}}}},100:{l:{99:{l:{97:{l:{59:{c:[10551]}}}}},108:{l:{100:{l:{104:{l:{97:{l:{114:{l:{59:{c:[10601]}}}}}}}}}}},113:{l:{117:{l:{111:{l:{59:{c:[8221]},114:{l:{59:{c:[8221]}}}}}}}}},115:{l:{104:{l:{59:{c:[8627]}}}}}}},101:{l:{97:{l:{108:{l:{59:{c:[8476]},105:{l:{110:{l:{101:{l:{59:{c:[8475]}}}}}}},112:{l:{97:{l:{114:{l:{116:{l:{59:{c:[8476]}}}}}}}}},115:{l:{59:{c:[8477]}}}}}}},99:{l:{116:{l:{59:{c:[9645]}}}}},103:{l:{59:{c:[174]}},c:[174]}}},102:{l:{105:{l:{115:{l:{104:{l:{116:{l:{59:{c:[10621]}}}}}}}}},108:{l:{111:{l:{111:{l:{114:{l:{59:{c:[8971]}}}}}}}}},114:{l:{59:{c:[120111]}}}}},104:{l:{97:{l:{114:{l:{100:{l:{59:{c:[8641]}}},117:{l:{59:{c:[8640]},108:{l:{59:{c:[10604]}}}}}}}}},111:{l:{59:{c:[961]},118:{l:{59:{c:[1009]}}}}}}},105:{l:{103:{l:{104:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8594]},116:{l:{97:{l:{105:{l:{108:{l:{59:{c:[8611]}}}}}}}}}}}}}}}}}}},104:{l:{97:{l:{114:{l:{112:{l:{111:{l:{111:{l:{110:{l:{100:{l:{111:{l:{119:{l:{110:{l:{59:{c:[8641]}}}}}}}}},117:{l:{112:{l:{59:{c:[8640]}}}}}}}}}}}}}}}}}}},108:{l:{101:{l:{102:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{115:{l:{59:{c:[8644]}}}}}}}}}}}}},104:{l:{97:{l:{114:{l:{112:{l:{111:{l:{111:{l:{110:{l:{115:{l:{59:{c:[8652]}}}}}}}}}}}}}}}}}}}}}}}}},114:{l:{105:{l:{103:{l:{104:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{115:{l:{59:{c:[8649]}}}}}}}}}}}}}}}}}}}}}}},115:{l:{113:{l:{117:{l:{105:{l:{103:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8605]}}}}}}}}}}}}}}}}}}}}},116:{l:{104:{l:{114:{l:{101:{l:{101:{l:{116:{l:{105:{l:{109:{l:{101:{l:{115:{l:{59:{c:[8908]}}}}}}}}}}}}}}}}}}}}}}}}}}},110:{l:{103:{l:{59:{c:[730]}}}}},115:{l:{105:{l:{110:{l:{103:{l:{100:{l:{111:{l:{116:{l:{115:{l:{101:{l:{113:{l:{59:{c:[8787]}}}}}}}}}}}}}}}}}}}}}}},108:{l:{97:{l:{114:{l:{114:{l:{59:{c:[8644]}}}}}}},104:{l:{97:{l:{114:{l:{59:{c:[8652]}}}}}}},109:{l:{59:{c:[8207]}}}}},109:{l:{111:{l:{117:{l:{115:{l:{116:{l:{59:{c:[9137]},97:{l:{99:{l:{104:{l:{101:{l:{59:{c:[9137]}}}}}}}}}}}}}}}}}}},110:{l:{109:{l:{105:{l:{100:{l:{59:{c:[10990]}}}}}}}}},111:{l:{97:{l:{110:{l:{103:{l:{59:{c:[10221]}}}}},114:{l:{114:{l:{59:{c:[8702]}}}}}}},98:{l:{114:{l:{107:{l:{59:{c:[10215]}}}}}}},112:{l:{97:{l:{114:{l:{59:{c:[10630]}}}}},102:{l:{59:{c:[120163]}}},108:{l:{117:{l:{115:{l:{59:{c:[10798]}}}}}}}}},116:{l:{105:{l:{109:{l:{101:{l:{115:{l:{59:{c:[10805]}}}}}}}}}}}}},112:{l:{97:{l:{114:{l:{59:{c:[41]},103:{l:{116:{l:{59:{c:[10644]}}}}}}}}},112:{l:{111:{l:{108:{l:{105:{l:{110:{l:{116:{l:{59:{c:[10770]}}}}}}}}}}}}}}},114:{l:{97:{l:{114:{l:{114:{l:{59:{c:[8649]}}}}}}}}},115:{l:{97:{l:{113:{l:{117:{l:{111:{l:{59:{c:[8250]}}}}}}}}},99:{l:{114:{l:{59:{c:[120007]}}}}},104:{l:{59:{c:[8625]}}},113:{l:{98:{l:{59:{c:[93]}}},117:{l:{111:{l:{59:{c:[8217]},114:{l:{59:{c:[8217]}}}}}}}}}}},116:{l:{104:{l:{114:{l:{101:{l:{101:{l:{59:{c:[8908]}}}}}}}}},105:{l:{109:{l:{101:{l:{115:{l:{59:{c:[8906]}}}}}}}}},114:{l:{105:{l:{59:{c:[9657]},101:{l:{59:{c:[8885]}}},102:{l:{59:{c:[9656]}}},108:{l:{116:{l:{114:{l:{105:{l:{59:{c:[10702]}}}}}}}}}}}}}}},117:{l:{108:{l:{117:{l:{104:{l:{97:{l:{114:{l:{59:{c:[10600]}}}}}}}}}}}}},120:{l:{59:{c:[8478]}}}}},115:{l:{97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[347]}}}}}}}}}}},98:{l:{113:{l:{117:{l:{111:{l:{59:{c:[8218]}}}}}}}}},99:{l:{59:{c:[8827]},69:{l:{59:{c:[10932]}}},97:{l:{112:{l:{59:{c:[10936]}}},114:{l:{111:{l:{110:{l:{59:{c:[353]}}}}}}}}},99:{l:{117:{l:{101:{l:{59:{c:[8829]}}}}}}},101:{l:{59:{c:[10928]},100:{l:{105:{l:{108:{l:{59:{c:[351]}}}}}}}}},105:{l:{114:{l:{99:{l:{59:{c:[349]}}}}}}},110:{l:{69:{l:{59:{c:[10934]}}},97:{l:{112:{l:{59:{c:[10938]}}}}},115:{l:{105:{l:{109:{l:{59:{c:[8937]}}}}}}}}},112:{l:{111:{l:{108:{l:{105:{l:{110:{l:{116:{l:{59:{c:[10771]}}}}}}}}}}}}},115:{l:{105:{l:{109:{l:{59:{c:[8831]}}}}}}},121:{l:{59:{c:[1089]}}}}},100:{l:{111:{l:{116:{l:{59:{c:[8901]},98:{l:{59:{c:[8865]}}},101:{l:{59:{c:[10854]}}}}}}}}},101:{l:{65:{l:{114:{l:{114:{l:{59:{c:[8664]}}}}}}},97:{l:{114:{l:{104:{l:{107:{l:{59:{c:[10533]}}}}},114:{l:{59:{c:[8600]},111:{l:{119:{l:{59:{c:[8600]}}}}}}}}}}},99:{l:{116:{l:{59:{c:[167]}},c:[167]}}},109:{l:{105:{l:{59:{c:[59]}}}}},115:{l:{119:{l:{97:{l:{114:{l:{59:{c:[10537]}}}}}}}}},116:{l:{109:{l:{105:{l:{110:{l:{117:{l:{115:{l:{59:{c:[8726]}}}}}}}}},110:{l:{59:{c:[8726]}}}}}}},120:{l:{116:{l:{59:{c:[10038]}}}}}}},102:{l:{114:{l:{59:{c:[120112]},111:{l:{119:{l:{110:{l:{59:{c:[8994]}}}}}}}}}}},104:{l:{97:{l:{114:{l:{112:{l:{59:{c:[9839]}}}}}}},99:{l:{104:{l:{99:{l:{121:{l:{59:{c:[1097]}}}}}}},121:{l:{59:{c:[1096]}}}}},111:{l:{114:{l:{116:{l:{109:{l:{105:{l:{100:{l:{59:{c:[8739]}}}}}}},112:{l:{97:{l:{114:{l:{97:{l:{108:{l:{108:{l:{101:{l:{108:{l:{59:{c:[8741]}}}}}}}}}}}}}}}}}}}}}}},121:{l:{59:{c:[173]}},c:[173]}}},105:{l:{103:{l:{109:{l:{97:{l:{59:{c:[963]},102:{l:{59:{c:[962]}}},118:{l:{59:{c:[962]}}}}}}}}},109:{l:{59:{c:[8764]},100:{l:{111:{l:{116:{l:{59:{c:[10858]}}}}}}},101:{l:{59:{c:[8771]},113:{l:{59:{c:[8771]}}}}},103:{l:{59:{c:[10910]},69:{l:{59:{c:[10912]}}}}},108:{l:{59:{c:[10909]},69:{l:{59:{c:[10911]}}}}},110:{l:{101:{l:{59:{c:[8774]}}}}},112:{l:{108:{l:{117:{l:{115:{l:{59:{c:[10788]}}}}}}}}},114:{l:{97:{l:{114:{l:{114:{l:{59:{c:[10610]}}}}}}}}}}}}},108:{l:{97:{l:{114:{l:{114:{l:{59:{c:[8592]}}}}}}}}},109:{l:{97:{l:{108:{l:{108:{l:{115:{l:{101:{l:{116:{l:{109:{l:{105:{l:{110:{l:{117:{l:{115:{l:{59:{c:[8726]}}}}}}}}}}}}}}}}}}}}},115:{l:{104:{l:{112:{l:{59:{c:[10803]}}}}}}}}},101:{l:{112:{l:{97:{l:{114:{l:{115:{l:{108:{l:{59:{c:[10724]}}}}}}}}}}}}},105:{l:{100:{l:{59:{c:[8739]}}},108:{l:{101:{l:{59:{c:[8995]}}}}}}},116:{l:{59:{c:[10922]},101:{l:{59:{c:[10924]},115:{l:{59:{c:[10924,65024]}}}}}}}}},111:{l:{102:{l:{116:{l:{99:{l:{121:{l:{59:{c:[1100]}}}}}}}}},108:{l:{59:{c:[47]},98:{l:{59:{c:[10692]},97:{l:{114:{l:{59:{c:[9023]}}}}}}}}},112:{l:{102:{l:{59:{c:[120164]}}}}}}},112:{l:{97:{l:{100:{l:{101:{l:{115:{l:{59:{c:[9824]},117:{l:{105:{l:{116:{l:{59:{c:[9824]}}}}}}}}}}}}},114:{l:{59:{c:[8741]}}}}}}},113:{l:{99:{l:{97:{l:{112:{l:{59:{c:[8851]},115:{l:{59:{c:[8851,65024]}}}}}}},117:{l:{112:{l:{59:{c:[8852]},115:{l:{59:{c:[8852,65024]}}}}}}}}},115:{l:{117:{l:{98:{l:{59:{c:[8847]},101:{l:{59:{c:[8849]}}},115:{l:{101:{l:{116:{l:{59:{c:[8847]},101:{l:{113:{l:{59:{c:[8849]}}}}}}}}}}}}},112:{l:{59:{c:[8848]},101:{l:{59:{c:[8850]}}},115:{l:{101:{l:{116:{l:{59:{c:[8848]},101:{l:{113:{l:{59:{c:[8850]}}}}}}}}}}}}}}}}},117:{l:{59:{c:[9633]},97:{l:{114:{l:{101:{l:{59:{c:[9633]}}},102:{l:{59:{c:[9642]}}}}}}},102:{l:{59:{c:[9642]}}}}}}},114:{l:{97:{l:{114:{l:{114:{l:{59:{c:[8594]}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[120008]}}}}},101:{l:{116:{l:{109:{l:{110:{l:{59:{c:[8726]}}}}}}}}},109:{l:{105:{l:{108:{l:{101:{l:{59:{c:[8995]}}}}}}}}},116:{l:{97:{l:{114:{l:{102:{l:{59:{c:[8902]}}}}}}}}}}},116:{l:{97:{l:{114:{l:{59:{c:[9734]},102:{l:{59:{c:[9733]}}}}}}},114:{l:{97:{l:{105:{l:{103:{l:{104:{l:{116:{l:{101:{l:{112:{l:{115:{l:{105:{l:{108:{l:{111:{l:{110:{l:{59:{c:[1013]}}}}}}}}}}}}}}},112:{l:{104:{l:{105:{l:{59:{c:[981]}}}}}}}}}}}}}}}}},110:{l:{115:{l:{59:{c:[175]}}}}}}}}},117:{l:{98:{l:{59:{c:[8834]},69:{l:{59:{c:[10949]}}},100:{l:{111:{l:{116:{l:{59:{c:[10941]}}}}}}},101:{l:{59:{c:[8838]},100:{l:{111:{l:{116:{l:{59:{c:[10947]}}}}}}}}},109:{l:{117:{l:{108:{l:{116:{l:{59:{c:[10945]}}}}}}}}},110:{l:{69:{l:{59:{c:[10955]}}},101:{l:{59:{c:[8842]}}}}},112:{l:{108:{l:{117:{l:{115:{l:{59:{c:[10943]}}}}}}}}},114:{l:{97:{l:{114:{l:{114:{l:{59:{c:[10617]}}}}}}}}},115:{l:{101:{l:{116:{l:{59:{c:[8834]},101:{l:{113:{l:{59:{c:[8838]},113:{l:{59:{c:[10949]}}}}}}},110:{l:{101:{l:{113:{l:{59:{c:[8842]},113:{l:{59:{c:[10955]}}}}}}}}}}}}},105:{l:{109:{l:{59:{c:[10951]}}}}},117:{l:{98:{l:{59:{c:[10965]}}},112:{l:{59:{c:[10963]}}}}}}}}},99:{l:{99:{l:{59:{c:[8827]},97:{l:{112:{l:{112:{l:{114:{l:{111:{l:{120:{l:{59:{c:[10936]}}}}}}}}}}}}},99:{l:{117:{l:{114:{l:{108:{l:{121:{l:{101:{l:{113:{l:{59:{c:[8829]}}}}}}}}}}}}}}},101:{l:{113:{l:{59:{c:[10928]}}}}},110:{l:{97:{l:{112:{l:{112:{l:{114:{l:{111:{l:{120:{l:{59:{c:[10938]}}}}}}}}}}}}},101:{l:{113:{l:{113:{l:{59:{c:[10934]}}}}}}},115:{l:{105:{l:{109:{l:{59:{c:[8937]}}}}}}}}},115:{l:{105:{l:{109:{l:{59:{c:[8831]}}}}}}}}}}},109:{l:{59:{c:[8721]}}},110:{l:{103:{l:{59:{c:[9834]}}}}},112:{l:{49:{l:{59:{c:[185]}},c:[185]},50:{l:{59:{c:[178]}},c:[178]},51:{l:{59:{c:[179]}},c:[179]},59:{c:[8835]},69:{l:{59:{c:[10950]}}},100:{l:{111:{l:{116:{l:{59:{c:[10942]}}}}},115:{l:{117:{l:{98:{l:{59:{c:[10968]}}}}}}}}},101:{l:{59:{c:[8839]},100:{l:{111:{l:{116:{l:{59:{c:[10948]}}}}}}}}},104:{l:{115:{l:{111:{l:{108:{l:{59:{c:[10185]}}}}},117:{l:{98:{l:{59:{c:[10967]}}}}}}}}},108:{l:{97:{l:{114:{l:{114:{l:{59:{c:[10619]}}}}}}}}},109:{l:{117:{l:{108:{l:{116:{l:{59:{c:[10946]}}}}}}}}},110:{l:{69:{l:{59:{c:[10956]}}},101:{l:{59:{c:[8843]}}}}},112:{l:{108:{l:{117:{l:{115:{l:{59:{c:[10944]}}}}}}}}},115:{l:{101:{l:{116:{l:{59:{c:[8835]},101:{l:{113:{l:{59:{c:[8839]},113:{l:{59:{c:[10950]}}}}}}},110:{l:{101:{l:{113:{l:{59:{c:[8843]},113:{l:{59:{c:[10956]}}}}}}}}}}}}},105:{l:{109:{l:{59:{c:[10952]}}}}},117:{l:{98:{l:{59:{c:[10964]}}},112:{l:{59:{c:[10966]}}}}}}}}}}},119:{l:{65:{l:{114:{l:{114:{l:{59:{c:[8665]}}}}}}},97:{l:{114:{l:{104:{l:{107:{l:{59:{c:[10534]}}}}},114:{l:{59:{c:[8601]},111:{l:{119:{l:{59:{c:[8601]}}}}}}}}}}},110:{l:{119:{l:{97:{l:{114:{l:{59:{c:[10538]}}}}}}}}}}},122:{l:{108:{l:{105:{l:{103:{l:{59:{c:[223]}},c:[223]}}}}}}}}},116:{l:{97:{l:{114:{l:{103:{l:{101:{l:{116:{l:{59:{c:[8982]}}}}}}}}},117:{l:{59:{c:[964]}}}}},98:{l:{114:{l:{107:{l:{59:{c:[9140]}}}}}}},99:{l:{97:{l:{114:{l:{111:{l:{110:{l:{59:{c:[357]}}}}}}}}},101:{l:{100:{l:{105:{l:{108:{l:{59:{c:[355]}}}}}}}}},121:{l:{59:{c:[1090]}}}}},100:{l:{111:{l:{116:{l:{59:{c:[8411]}}}}}}},101:{l:{108:{l:{114:{l:{101:{l:{99:{l:{59:{c:[8981]}}}}}}}}}}},102:{l:{114:{l:{59:{c:[120113]}}}}},104:{l:{101:{l:{114:{l:{101:{l:{52:{l:{59:{c:[8756]}}},102:{l:{111:{l:{114:{l:{101:{l:{59:{c:[8756]}}}}}}}}}}}}},116:{l:{97:{l:{59:{c:[952]},115:{l:{121:{l:{109:{l:{59:{c:[977]}}}}}}},118:{l:{59:{c:[977]}}}}}}}}},105:{l:{99:{l:{107:{l:{97:{l:{112:{l:{112:{l:{114:{l:{111:{l:{120:{l:{59:{c:[8776]}}}}}}}}}}}}},115:{l:{105:{l:{109:{l:{59:{c:[8764]}}}}}}}}}}},110:{l:{115:{l:{112:{l:{59:{c:[8201]}}}}}}}}},107:{l:{97:{l:{112:{l:{59:{c:[8776]}}}}},115:{l:{105:{l:{109:{l:{59:{c:[8764]}}}}}}}}},111:{l:{114:{l:{110:{l:{59:{c:[254]}},c:[254]}}}}}}},105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[732]}}}}}}},109:{l:{101:{l:{115:{l:{59:{c:[215]},98:{l:{59:{c:[8864]},97:{l:{114:{l:{59:{c:[10801]}}}}}}},100:{l:{59:{c:[10800]}}}},c:[215]}}}}},110:{l:{116:{l:{59:{c:[8749]}}}}}}},111:{l:{101:{l:{97:{l:{59:{c:[10536]}}}}},112:{l:{59:{c:[8868]},98:{l:{111:{l:{116:{l:{59:{c:[9014]}}}}}}},99:{l:{105:{l:{114:{l:{59:{c:[10993]}}}}}}},102:{l:{59:{c:[120165]},111:{l:{114:{l:{107:{l:{59:{c:[10970]}}}}}}}}}}},115:{l:{97:{l:{59:{c:[10537]}}}}}}},112:{l:{114:{l:{105:{l:{109:{l:{101:{l:{59:{c:[8244]}}}}}}}}}}},114:{l:{97:{l:{100:{l:{101:{l:{59:{c:[8482]}}}}}}},105:{l:{97:{l:{110:{l:{103:{l:{108:{l:{101:{l:{59:{c:[9653]},100:{l:{111:{l:{119:{l:{110:{l:{59:{c:[9663]}}}}}}}}},108:{l:{101:{l:{102:{l:{116:{l:{59:{c:[9667]},101:{l:{113:{l:{59:{c:[8884]}}}}}}}}}}}}},113:{l:{59:{c:[8796]}}},114:{l:{105:{l:{103:{l:{104:{l:{116:{l:{59:{c:[9657]},101:{l:{113:{l:{59:{c:[8885]}}}}}}}}}}}}}}}}}}}}}}}}},100:{l:{111:{l:{116:{l:{59:{c:[9708]}}}}}}},101:{l:{59:{c:[8796]}}},109:{l:{105:{l:{110:{l:{117:{l:{115:{l:{59:{c:[10810]}}}}}}}}}}},112:{l:{108:{l:{117:{l:{115:{l:{59:{c:[10809]}}}}}}}}},115:{l:{98:{l:{59:{c:[10701]}}}}},116:{l:{105:{l:{109:{l:{101:{l:{59:{c:[10811]}}}}}}}}}}},112:{l:{101:{l:{122:{l:{105:{l:{117:{l:{109:{l:{59:{c:[9186]}}}}}}}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[120009]}}},121:{l:{59:{c:[1094]}}}}},104:{l:{99:{l:{121:{l:{59:{c:[1115]}}}}}}},116:{l:{114:{l:{111:{l:{107:{l:{59:{c:[359]}}}}}}}}}}},119:{l:{105:{l:{120:{l:{116:{l:{59:{c:[8812]}}}}}}},111:{l:{104:{l:{101:{l:{97:{l:{100:{l:{108:{l:{101:{l:{102:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8606]}}}}}}}}}}}}}}}}}}},114:{l:{105:{l:{103:{l:{104:{l:{116:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8608]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},117:{l:{65:{l:{114:{l:{114:{l:{59:{c:[8657]}}}}}}},72:{l:{97:{l:{114:{l:{59:{c:[10595]}}}}}}},97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[250]}},c:[250]}}}}}}},114:{l:{114:{l:{59:{c:[8593]}}}}}}},98:{l:{114:{l:{99:{l:{121:{l:{59:{c:[1118]}}}}},101:{l:{118:{l:{101:{l:{59:{c:[365]}}}}}}}}}}},99:{l:{105:{l:{114:{l:{99:{l:{59:{c:[251]}},c:[251]}}}}},121:{l:{59:{c:[1091]}}}}},100:{l:{97:{l:{114:{l:{114:{l:{59:{c:[8645]}}}}}}},98:{l:{108:{l:{97:{l:{99:{l:{59:{c:[369]}}}}}}}}},104:{l:{97:{l:{114:{l:{59:{c:[10606]}}}}}}}}},102:{l:{105:{l:{115:{l:{104:{l:{116:{l:{59:{c:[10622]}}}}}}}}},114:{l:{59:{c:[120114]}}}}},103:{l:{114:{l:{97:{l:{118:{l:{101:{l:{59:{c:[249]}},c:[249]}}}}}}}}},104:{l:{97:{l:{114:{l:{108:{l:{59:{c:[8639]}}},114:{l:{59:{c:[8638]}}}}}}},98:{l:{108:{l:{107:{l:{59:{c:[9600]}}}}}}}}},108:{l:{99:{l:{111:{l:{114:{l:{110:{l:{59:{c:[8988]},101:{l:{114:{l:{59:{c:[8988]}}}}}}}}}}},114:{l:{111:{l:{112:{l:{59:{c:[8975]}}}}}}}}},116:{l:{114:{l:{105:{l:{59:{c:[9720]}}}}}}}}},109:{l:{97:{l:{99:{l:{114:{l:{59:{c:[363]}}}}}}},108:{l:{59:{c:[168]}},c:[168]}}},111:{l:{103:{l:{111:{l:{110:{l:{59:{c:[371]}}}}}}},112:{l:{102:{l:{59:{c:[120166]}}}}}}},112:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8593]}}}}}}}}}}},100:{l:{111:{l:{119:{l:{110:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{59:{c:[8597]}}}}}}}}}}}}}}}}}}},104:{l:{97:{l:{114:{l:{112:{l:{111:{l:{111:{l:{110:{l:{108:{l:{101:{l:{102:{l:{116:{l:{59:{c:[8639]}}}}}}}}},114:{l:{105:{l:{103:{l:{104:{l:{116:{l:{59:{c:[8638]}}}}}}}}}}}}}}}}}}}}}}}}},108:{l:{117:{l:{115:{l:{59:{c:[8846]}}}}}}},115:{l:{105:{l:{59:{c:[965]},104:{l:{59:{c:[978]}}},108:{l:{111:{l:{110:{l:{59:{c:[965]}}}}}}}}}}},117:{l:{112:{l:{97:{l:{114:{l:{114:{l:{111:{l:{119:{l:{115:{l:{59:{c:[8648]}}}}}}}}}}}}}}}}}}},114:{l:{99:{l:{111:{l:{114:{l:{110:{l:{59:{c:[8989]},101:{l:{114:{l:{59:{c:[8989]}}}}}}}}}}},114:{l:{111:{l:{112:{l:{59:{c:[8974]}}}}}}}}},105:{l:{110:{l:{103:{l:{59:{c:[367]}}}}}}},116:{l:{114:{l:{105:{l:{59:{c:[9721]}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[120010]}}}}}}},116:{l:{100:{l:{111:{l:{116:{l:{59:{c:[8944]}}}}}}},105:{l:{108:{l:{100:{l:{101:{l:{59:{c:[361]}}}}}}}}},114:{l:{105:{l:{59:{c:[9653]},102:{l:{59:{c:[9652]}}}}}}}}},117:{l:{97:{l:{114:{l:{114:{l:{59:{c:[8648]}}}}}}},109:{l:{108:{l:{59:{c:[252]}},c:[252]}}}}},119:{l:{97:{l:{110:{l:{103:{l:{108:{l:{101:{l:{59:{c:[10663]}}}}}}}}}}}}}}},118:{l:{65:{l:{114:{l:{114:{l:{59:{c:[8661]}}}}}}},66:{l:{97:{l:{114:{l:{59:{c:[10984]},118:{l:{59:{c:[10985]}}}}}}}}},68:{l:{97:{l:{115:{l:{104:{l:{59:{c:[8872]}}}}}}}}},97:{l:{110:{l:{103:{l:{114:{l:{116:{l:{59:{c:[10652]}}}}}}}}},114:{l:{101:{l:{112:{l:{115:{l:{105:{l:{108:{l:{111:{l:{110:{l:{59:{c:[1013]}}}}}}}}}}}}}}},107:{l:{97:{l:{112:{l:{112:{l:{97:{l:{59:{c:[1008]}}}}}}}}}}},110:{l:{111:{l:{116:{l:{104:{l:{105:{l:{110:{l:{103:{l:{59:{c:[8709]}}}}}}}}}}}}}}},112:{l:{104:{l:{105:{l:{59:{c:[981]}}}}},105:{l:{59:{c:[982]}}},114:{l:{111:{l:{112:{l:{116:{l:{111:{l:{59:{c:[8733]}}}}}}}}}}}}},114:{l:{59:{c:[8597]},104:{l:{111:{l:{59:{c:[1009]}}}}}}},115:{l:{105:{l:{103:{l:{109:{l:{97:{l:{59:{c:[962]}}}}}}}}},117:{l:{98:{l:{115:{l:{101:{l:{116:{l:{110:{l:{101:{l:{113:{l:{59:{c:[8842,65024]},113:{l:{59:{c:[10955,65024]}}}}}}}}}}}}}}}}},112:{l:{115:{l:{101:{l:{116:{l:{110:{l:{101:{l:{113:{l:{59:{c:[8843,65024]},113:{l:{59:{c:[10956,65024]}}}}}}}}}}}}}}}}}}}}},116:{l:{104:{l:{101:{l:{116:{l:{97:{l:{59:{c:[977]}}}}}}}}},114:{l:{105:{l:{97:{l:{110:{l:{103:{l:{108:{l:{101:{l:{108:{l:{101:{l:{102:{l:{116:{l:{59:{c:[8882]}}}}}}}}},114:{l:{105:{l:{103:{l:{104:{l:{116:{l:{59:{c:[8883]}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},99:{l:{121:{l:{59:{c:[1074]}}}}},100:{l:{97:{l:{115:{l:{104:{l:{59:{c:[8866]}}}}}}}}},101:{l:{101:{l:{59:{c:[8744]},98:{l:{97:{l:{114:{l:{59:{c:[8891]}}}}}}},101:{l:{113:{l:{59:{c:[8794]}}}}}}},108:{l:{108:{l:{105:{l:{112:{l:{59:{c:[8942]}}}}}}}}},114:{l:{98:{l:{97:{l:{114:{l:{59:{c:[124]}}}}}}},116:{l:{59:{c:[124]}}}}}}},102:{l:{114:{l:{59:{c:[120115]}}}}},108:{l:{116:{l:{114:{l:{105:{l:{59:{c:[8882]}}}}}}}}},110:{l:{115:{l:{117:{l:{98:{l:{59:{c:[8834,8402]}}},112:{l:{59:{c:[8835,8402]}}}}}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120167]}}}}}}},112:{l:{114:{l:{111:{l:{112:{l:{59:{c:[8733]}}}}}}}}},114:{l:{116:{l:{114:{l:{105:{l:{59:{c:[8883]}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[120011]}}}}},117:{l:{98:{l:{110:{l:{69:{l:{59:{c:[10955,65024]}}},101:{l:{59:{c:[8842,65024]}}}}}}},112:{l:{110:{l:{69:{l:{59:{c:[10956,65024]}}},101:{l:{59:{c:[8843,65024]}}}}}}}}}}},122:{l:{105:{l:{103:{l:{122:{l:{97:{l:{103:{l:{59:{c:[10650]}}}}}}}}}}}}}}},119:{l:{99:{l:{105:{l:{114:{l:{99:{l:{59:{c:[373]}}}}}}}}},101:{l:{100:{l:{98:{l:{97:{l:{114:{l:{59:{c:[10847]}}}}}}},103:{l:{101:{l:{59:{c:[8743]},113:{l:{59:{c:[8793]}}}}}}}}},105:{l:{101:{l:{114:{l:{112:{l:{59:{c:[8472]}}}}}}}}}}},102:{l:{114:{l:{59:{c:[120116]}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120168]}}}}}}},112:{l:{59:{c:[8472]}}},114:{l:{59:{c:[8768]},101:{l:{97:{l:{116:{l:{104:{l:{59:{c:[8768]}}}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[120012]}}}}}}}}},120:{l:{99:{l:{97:{l:{112:{l:{59:{c:[8898]}}}}},105:{l:{114:{l:{99:{l:{59:{c:[9711]}}}}}}},117:{l:{112:{l:{59:{c:[8899]}}}}}}},100:{l:{116:{l:{114:{l:{105:{l:{59:{c:[9661]}}}}}}}}},102:{l:{114:{l:{59:{c:[120117]}}}}},104:{l:{65:{l:{114:{l:{114:{l:{59:{c:[10234]}}}}}}},97:{l:{114:{l:{114:{l:{59:{c:[10231]}}}}}}}}},105:{l:{59:{c:[958]}}},108:{l:{65:{l:{114:{l:{114:{l:{59:{c:[10232]}}}}}}},97:{l:{114:{l:{114:{l:{59:{c:[10229]}}}}}}}}},109:{l:{97:{l:{112:{l:{59:{c:[10236]}}}}}}},110:{l:{105:{l:{115:{l:{59:{c:[8955]}}}}}}},111:{l:{100:{l:{111:{l:{116:{l:{59:{c:[10752]}}}}}}},112:{l:{102:{l:{59:{c:[120169]}}},108:{l:{117:{l:{115:{l:{59:{c:[10753]}}}}}}}}},116:{l:{105:{l:{109:{l:{101:{l:{59:{c:[10754]}}}}}}}}}}},114:{l:{65:{l:{114:{l:{114:{l:{59:{c:[10233]}}}}}}},97:{l:{114:{l:{114:{l:{59:{c:[10230]}}}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[120013]}}}}},113:{l:{99:{l:{117:{l:{112:{l:{59:{c:[10758]}}}}}}}}}}},117:{l:{112:{l:{108:{l:{117:{l:{115:{l:{59:{c:[10756]}}}}}}}}},116:{l:{114:{l:{105:{l:{59:{c:[9651]}}}}}}}}},118:{l:{101:{l:{101:{l:{59:{c:[8897]}}}}}}},119:{l:{101:{l:{100:{l:{103:{l:{101:{l:{59:{c:[8896]}}}}}}}}}}}}},121:{l:{97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[253]}},c:[253]}}}}},121:{l:{59:{c:[1103]}}}}}}},99:{l:{105:{l:{114:{l:{99:{l:{59:{c:[375]}}}}}}},121:{l:{59:{c:[1099]}}}}},101:{l:{110:{l:{59:{c:[165]}},c:[165]}}},102:{l:{114:{l:{59:{c:[120118]}}}}},105:{l:{99:{l:{121:{l:{59:{c:[1111]}}}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120170]}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[120014]}}}}}}},117:{l:{99:{l:{121:{l:{59:{c:[1102]}}}}},109:{l:{108:{l:{59:{c:[255]}},c:[255]}}}}}}},122:{l:{97:{l:{99:{l:{117:{l:{116:{l:{101:{l:{59:{c:[378]}}}}}}}}}}},99:{l:{97:{l:{114:{l:{111:{l:{110:{l:{59:{c:[382]}}}}}}}}},121:{l:{59:{c:[1079]}}}}},100:{l:{111:{l:{116:{l:{59:{c:[380]}}}}}}},101:{l:{101:{l:{116:{l:{114:{l:{102:{l:{59:{c:[8488]}}}}}}}}},116:{l:{97:{l:{59:{c:[950]}}}}}}},102:{l:{114:{l:{59:{c:[120119]}}}}},104:{l:{99:{l:{121:{l:{59:{c:[1078]}}}}}}},105:{l:{103:{l:{114:{l:{97:{l:{114:{l:{114:{l:{59:{c:[8669]}}}}}}}}}}}}},111:{l:{112:{l:{102:{l:{59:{c:[120171]}}}}}}},115:{l:{99:{l:{114:{l:{59:{c:[120015]}}}}}}},119:{l:{106:{l:{59:{c:[8205]}}},110:{l:{106:{l:{59:{c:[8204]}}}}}}}}}};

},{}],135:[function(require,module,exports){
"use strict";function isSurrogatePair(t,s){return t>=55296&&t<=56319&&s>=56320&&s<=57343}function getSurrogatePairCodePoint(t,s){return 1024*(t-55296)+9216+s}var UNICODE=require("../common/unicode"),$=UNICODE.CODE_POINTS,DEFAULT_BUFFER_WATERLINE=65536,Preprocessor=module.exports=function(){this.html=null,this.pos=-1,this.lastGapPos=-1,this.lastCharPos=-1,this.droppedBufferSize=0,this.gapStack=[],this.skipNextNewLine=!1,this.lastChunkWritten=!1,this.endOfChunkHit=!1,this.bufferWaterline=DEFAULT_BUFFER_WATERLINE};Object.defineProperty(Preprocessor.prototype,"sourcePos",{get:function(){return this.droppedBufferSize+this.pos}}),Preprocessor.prototype.dropParsedChunk=function(){this.pos>this.bufferWaterline&&(this.lastCharPos-=this.pos,this.droppedBufferSize+=this.pos,this.html=this.html.substring(this.pos),this.pos=0,this.lastGapPos=-1,this.gapStack=[])},Preprocessor.prototype._addGap=function(){this.gapStack.push(this.lastGapPos),this.lastGapPos=this.pos},Preprocessor.prototype._processHighRangeCodePoint=function(t){if(this.pos!==this.lastCharPos){var s=this.html.charCodeAt(this.pos+1);isSurrogatePair(t,s)&&(this.pos++,t=getSurrogatePairCodePoint(t,s),this._addGap())}else if(!this.lastChunkWritten)return this.endOfChunkHit=!0,$.EOF;return t},Preprocessor.prototype.write=function(t,s){this.html?this.html+=t:this.html=t,this.lastCharPos=this.html.length-1,this.endOfChunkHit=!1,this.lastChunkWritten=s},Preprocessor.prototype.insertHtmlAtCurrentPos=function(t){this.html=this.html.substring(0,this.pos+1)+t+this.html.substring(this.pos+1,this.html.length),this.lastCharPos=this.html.length-1,this.endOfChunkHit=!1},Preprocessor.prototype.advance=function(){if(++this.pos>this.lastCharPos)return this.lastChunkWritten||(this.endOfChunkHit=!0),$.EOF;var t=this.html.charCodeAt(this.pos);return this.skipNextNewLine&&t===$.LINE_FEED?(this.skipNextNewLine=!1,this._addGap(),this.advance()):t===$.CARRIAGE_RETURN?(this.skipNextNewLine=!0,$.LINE_FEED):(this.skipNextNewLine=!1,t>=55296?this._processHighRangeCodePoint(t):t)},Preprocessor.prototype.retreat=function(){this.pos===this.lastGapPos&&(this.lastGapPos=this.gapStack.pop(),this.pos--),this.pos--};

},{"../common/unicode":127}],136:[function(require,module,exports){
"use strict";exports.createDocument=function(){return{nodeName:"#document",quirksMode:!1,childNodes:[]}},exports.createDocumentFragment=function(){return{nodeName:"#document-fragment",quirksMode:!1,childNodes:[]}},exports.createElement=function(e,t,n){return{nodeName:e,tagName:e,attrs:n,namespaceURI:t,childNodes:[],parentNode:null}},exports.createCommentNode=function(e){return{nodeName:"#comment",data:e,parentNode:null}};var createTextNode=function(e){return{nodeName:"#text",value:e,parentNode:null}},appendChild=exports.appendChild=function(e,t){e.childNodes.push(t),t.parentNode=e},insertBefore=exports.insertBefore=function(e,t,n){var o=e.childNodes.indexOf(n);e.childNodes.splice(o,0,t),t.parentNode=e};exports.setTemplateContent=function(e,t){e.content=t},exports.getTemplateContent=function(e){return e.content},exports.setDocumentType=function(e,t,n,o){for(var r=null,d=0;d<e.childNodes.length;d++)if("#documentType"===e.childNodes[d].nodeName){r=e.childNodes[d];break}r?(r.name=t,r.publicId=n,r.systemId=o):appendChild(e,{nodeName:"#documentType",name:t,publicId:n,systemId:o})},exports.setQuirksMode=function(e){e.quirksMode=!0},exports.isQuirksMode=function(e){return e.quirksMode},exports.detachNode=function(e){if(e.parentNode){var t=e.parentNode.childNodes.indexOf(e);e.parentNode.childNodes.splice(t,1),e.parentNode=null}},exports.insertText=function(e,t){if(e.childNodes.length){var n=e.childNodes[e.childNodes.length-1];if("#text"===n.nodeName)return void(n.value+=t)}appendChild(e,createTextNode(t))},exports.insertTextBefore=function(e,t,n){var o=e.childNodes[e.childNodes.indexOf(n)-1];o&&"#text"===o.nodeName?o.value+=t:insertBefore(e,createTextNode(t),n)},exports.adoptAttributes=function(e,t){for(var n=[],o=0;o<e.attrs.length;o++)n.push(e.attrs[o].name);for(var r=0;r<t.length;r++)-1===n.indexOf(t[r].name)&&e.attrs.push(t[r])},exports.getFirstChild=function(e){return e.childNodes[0]},exports.getChildNodes=function(e){return e.childNodes},exports.getParentNode=function(e){return e.parentNode},exports.getAttrList=function(e){return e.attrs},exports.getTagName=function(e){return e.tagName},exports.getNamespaceURI=function(e){return e.namespaceURI},exports.getTextNodeContent=function(e){return e.value},exports.getCommentNodeContent=function(e){return e.data},exports.getDocumentTypeNodeName=function(e){return e.name},exports.getDocumentTypeNodePublicId=function(e){return e.publicId},exports.getDocumentTypeNodeSystemId=function(e){return e.systemId},exports.isTextNode=function(e){return"#text"===e.nodeName},exports.isCommentNode=function(e){return"#comment"===e.nodeName},exports.isDocumentTypeNode=function(e){return"#documentType"===e.nodeName},exports.isElementNode=function(e){return!!e.tagName};

},{}],137:[function(require,module,exports){
"use strict";function stringify(t){var i=xtend(t,this.data("settings"));this.Compiler=function(t){return toHTML(t,i)}}var xtend=require("xtend"),toHTML=require("hast-util-to-html");module.exports=stringify;

},{"hast-util-to-html":21,"xtend":237}],138:[function(require,module,exports){
"use strict";var trim=require("trim-trailing-lines"),C_NEWLINE="\n",C_TAB="\t",C_SPACE=" ",C_DOLLAR="$",MIN_FENCE_COUNT=2,CODE_INDENT_COUNT=4;module.exports=function(t){var e=this.Parser,r=e.prototype.blockTokenizers,i=e.prototype.blockMethods;r.math=function(t,e,r){for(var i,o,a,n,h,C,c,f,l,p,s=e.length+1,N=0,_="";N<s&&((a=e.charAt(N))===C_SPACE||a===C_TAB);)_+=a,N++;if(l=N,(a=e.charAt(N))===C_DOLLAR){for(N++,o=a,i=1,_+=a;N<s&&(a=e.charAt(N))===o;)_+=a,i++,N++;if(!(i<MIN_FENCE_COUNT)){for(;N<s&&(a=e.charAt(N))!==C_NEWLINE;){if(a===C_DOLLAR)return;_+=a,N++}if(a=e.charAt(N),r)return!0;for((p=t.now()).column+=_.length,p.offset+=_.length,n=c=f=h=C="";N<s;)if(a=e.charAt(N),h+=c,C+=f,c=f="",a===C_NEWLINE){for(h?(c+=a,f+=a):_+=a,n="",N++;N<s&&(a=e.charAt(N))===C_SPACE;)n+=a,N++;if(c+=n,f+=n.slice(l),!(n.length>=CODE_INDENT_COUNT)){for(n="";N<s&&(a=e.charAt(N))===o;)n+=a,N++;if(c+=n,f+=n,!(n.length<i)){for(n="";N<s&&(a=e.charAt(N))!==C_NEWLINE;)c+=a,f+=a,N++;break}}}else h+=a,f+=a,N++;_+=h+c;var u=trim(C);return t(_)({type:"math",value:u,data:{hName:"div",hProperties:{className:"math"},hChildren:[{type:"text",value:u}]}})}}},i.splice(i.indexOf("fencedCode")+1,0,"math");var o=e.prototype.interruptParagraph,a=e.prototype.interruptList,n=e.prototype.interruptBlockquote;o.splice(o.indexOf("fencedCode")+1,0,["math"]),a.splice(a.indexOf("fencedCode")+1,0,["math"]),n.splice(n.indexOf("fencedCode")+1,0,["math"]);var h=this.Compiler;null!=h&&(h.prototype.visitors.math=function(t){return"$$\n"+t.value+"\n$$"})};

},{"trim-trailing-lines":206}],139:[function(require,module,exports){
"use strict";var inlinePlugin=require("./inline"),blockPlugin=require("./block");module.exports=function(){var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};blockPlugin.call(this,i),inlinePlugin.call(this,i)};

},{"./block":138,"./inline":140}],140:[function(require,module,exports){
"use strict";function locator(e,t){return e.indexOf("$",t)}var ESCAPED_INLINE_MATH=/^\\\$/,INLINE_MATH=/^\$((?:\\\$|[^$])+)\$/,INLINE_MATH_DOUBLE=/^\$\$((?:\\\$|[^$])+)\$\$/;module.exports=function(e){function t(t,i,n){var r=!0,a=INLINE_MATH_DOUBLE.exec(i);a||(a=INLINE_MATH.exec(i),r=!1);var o=ESCAPED_INLINE_MATH.exec(i);if(o)return!!n||t(o[0])({type:"text",value:"$"});if(a){if(n)return!0;var l=a[1].trim();return t(a[0])({type:"inlineMath",value:l,data:{hName:"span",hProperties:{className:"inlineMath"+(r&&e.inlineMathDouble?" inlineMathDouble":"")},hChildren:[{type:"text",value:l}]}})}}t.locator=locator;var i=this.Parser,n=i.prototype.inlineTokenizers,r=i.prototype.inlineMethods;n.math=t,r.splice(r.indexOf("text"),0,"math");var a=this.Compiler;null!=a&&(a.prototype.visitors.inlineMath=function(e){return"$"+e.value+"$"})};

},{}],141:[function(require,module,exports){
"use strict";function parse(r){var e=unherit(Parser);e.prototype.options=xtend(e.prototype.options,this.data("settings"),r),this.Parser=e}var unherit=require("unherit"),xtend=require("xtend"),Parser=require("./lib/parser.js");module.exports=parse,parse.Parser=Parser;

},{"./lib/parser.js":155,"unherit":218,"xtend":237}],142:[function(require,module,exports){
module.exports=[
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "meta",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "pre",
  "section",
  "source",
  "title",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul"
]

},{}],143:[function(require,module,exports){
"use strict";function factory(e){function t(t){for(var n=e.offset,i=t.line,r=[];++i&&i in n;)r.push((n[i]||0)+1);return{start:t,indent:r}}function n(t,n,i){3!==i&&e.file.message(t,n)}function i(i,r,o){entities(i,{position:t(r),warning:n,text:o,reference:o,textContext:e,referenceContext:e})}return i.raw=function(e,i){return entities(e,{position:t(i),warning:n})},i}var entities=require("parse-entities");module.exports=factory;

},{"parse-entities":113}],144:[function(require,module,exports){
"use strict";module.exports={position:!0,gfm:!0,commonmark:!1,footnotes:!1,pedantic:!1,blocks:require("./block-elements.json")};

},{"./block-elements.json":142}],145:[function(require,module,exports){
"use strict";function locate(t,e){for(var r=t.indexOf("\n",e);r>e&&" "===t.charAt(r-1);)r--;return r}module.exports=locate;

},{}],146:[function(require,module,exports){
"use strict";function locate(e,t){return e.indexOf("`",t)}module.exports=locate;

},{}],147:[function(require,module,exports){
"use strict";function locate(e,t){return e.indexOf("~~",t)}module.exports=locate;

},{}],148:[function(require,module,exports){
"use strict";function locate(e,t){var n=e.indexOf("*",t),o=e.indexOf("_",t);return-1===o?n:-1===n?o:o<n?o:n}module.exports=locate;

},{}],149:[function(require,module,exports){
"use strict";function locate(e,t){return e.indexOf("\\",t)}module.exports=locate;

},{}],150:[function(require,module,exports){
"use strict";function locate(e,t){var n=e.indexOf("[",t),o=e.indexOf("![",t);return-1===o?n:n<o?n:o}module.exports=locate;

},{}],151:[function(require,module,exports){
"use strict";function locate(e,t){var n=e.indexOf("**",t),o=e.indexOf("__",t);return-1===o?n:-1===n?o:o<n?o:n}module.exports=locate;

},{}],152:[function(require,module,exports){
"use strict";function locate(e,t){return e.indexOf("<",t)}module.exports=locate;

},{}],153:[function(require,module,exports){
"use strict";function locate(t,O){var e,o=PROTOCOLS.length,r=-1,i=-1;if(!this.options.gfm)return-1;for(;++r<o;)-1!==(e=t.indexOf(PROTOCOLS[r],O))&&(e<i||-1===i)&&(i=e);return i}module.exports=locate;var PROTOCOLS=["https://","http://","mailto:"];

},{}],154:[function(require,module,exports){
"use strict";function parse(){var e,o=this,t=String(o.file),i={line:1,column:1,offset:0},r=xtend(i);return 65279===(t=t.replace(EXPRESSION_LINE_BREAKS,C_NEWLINE)).charCodeAt(0)&&(t=t.slice(1),r.column++,r.offset++),e={type:"root",children:o.tokenizeBlock(t,r),position:{start:i,end:o.eof||xtend(i)}},o.options.position||removePosition(e,!0),e}var xtend=require("xtend"),removePosition=require("unist-util-remove-position");module.exports=parse;var C_NEWLINE="\n",EXPRESSION_LINE_BREAKS=/\r\n|\r/g;

},{"unist-util-remove-position":225,"xtend":237}],155:[function(require,module,exports){
"use strict";function Parser(e,o){this.file=o,this.offset={},this.options=xtend(this.options),this.setOptions({}),this.inList=!1,this.inBlock=!1,this.inLink=!1,this.atStart=!0,this.toOffset=vfileLocation(o).toOffset,this.unescape=unescape(this,"escape"),this.decode=decode(this)}function keys(e){var o,t=[];for(o in e)t.push(o);return t}var xtend=require("xtend"),toggle=require("state-toggle"),vfileLocation=require("vfile-location"),unescape=require("./unescape"),decode=require("./decode"),tokenizer=require("./tokenizer");module.exports=Parser;var proto=Parser.prototype;proto.setOptions=require("./set-options"),proto.parse=require("./parse"),proto.options=require("./defaults"),proto.exitStart=toggle("atStart",!0),proto.enterList=toggle("inList",!1),proto.enterLink=toggle("inLink",!1),proto.enterBlock=toggle("inBlock",!1),proto.interruptParagraph=[["thematicBreak"],["atxHeading"],["fencedCode"],["blockquote"],["html"],["setextHeading",{commonmark:!1}],["definition",{commonmark:!1}],["footnote",{commonmark:!1}]],proto.interruptList=[["fencedCode",{pedantic:!1}],["thematicBreak",{pedantic:!1}],["definition",{commonmark:!1}],["footnote",{commonmark:!1}]],proto.interruptBlockquote=[["indentedCode",{commonmark:!0}],["fencedCode",{commonmark:!0}],["atxHeading",{commonmark:!0}],["setextHeading",{commonmark:!0}],["thematicBreak",{commonmark:!0}],["html",{commonmark:!0}],["list",{commonmark:!0}],["definition",{commonmark:!1}],["footnote",{commonmark:!1}]],proto.blockTokenizers={newline:require("./tokenize/newline"),indentedCode:require("./tokenize/code-indented"),fencedCode:require("./tokenize/code-fenced"),blockquote:require("./tokenize/blockquote"),atxHeading:require("./tokenize/heading-atx"),thematicBreak:require("./tokenize/thematic-break"),list:require("./tokenize/list"),setextHeading:require("./tokenize/heading-setext"),html:require("./tokenize/html-block"),footnote:require("./tokenize/footnote-definition"),definition:require("./tokenize/definition"),table:require("./tokenize/table"),paragraph:require("./tokenize/paragraph")},proto.inlineTokenizers={escape:require("./tokenize/escape"),autoLink:require("./tokenize/auto-link"),url:require("./tokenize/url"),html:require("./tokenize/html-inline"),link:require("./tokenize/link"),reference:require("./tokenize/reference"),strong:require("./tokenize/strong"),emphasis:require("./tokenize/emphasis"),deletion:require("./tokenize/delete"),code:require("./tokenize/code-inline"),break:require("./tokenize/break"),text:require("./tokenize/text")},proto.blockMethods=keys(proto.blockTokenizers),proto.inlineMethods=keys(proto.inlineTokenizers),proto.tokenizeBlock=tokenizer("block"),proto.tokenizeInline=tokenizer("inline"),proto.tokenizeFactory=tokenizer;

},{"./decode":143,"./defaults":144,"./parse":154,"./set-options":156,"./tokenize/auto-link":157,"./tokenize/blockquote":158,"./tokenize/break":159,"./tokenize/code-fenced":160,"./tokenize/code-indented":161,"./tokenize/code-inline":162,"./tokenize/definition":163,"./tokenize/delete":164,"./tokenize/emphasis":165,"./tokenize/escape":166,"./tokenize/footnote-definition":167,"./tokenize/heading-atx":168,"./tokenize/heading-setext":169,"./tokenize/html-block":170,"./tokenize/html-inline":171,"./tokenize/link":172,"./tokenize/list":173,"./tokenize/newline":174,"./tokenize/paragraph":175,"./tokenize/reference":176,"./tokenize/strong":177,"./tokenize/table":178,"./tokenize/text":179,"./tokenize/thematic-break":180,"./tokenize/url":181,"./tokenizer":182,"./unescape":183,"state-toggle":193,"vfile-location":233,"xtend":237}],156:[function(require,module,exports){
"use strict";function setOptions(e){var o,t,n=this,r=n.options;if(null==e)e={};else{if("object"!==(void 0===e?"undefined":_typeof(e)))throw new Error("Invalid value `"+e+"` for setting `options`");e=xtend(e)}for(o in defaults){if(null==(t=e[o])&&(t=r[o]),"blocks"!==o&&"boolean"!=typeof t||"blocks"===o&&"object"!==(void 0===t?"undefined":_typeof(t)))throw new Error("Invalid value `"+t+"` for setting `options."+o+"`");e[o]=t}return n.options=e,n.escape=escapes(e),n}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},xtend=require("xtend"),escapes=require("markdown-escapes"),defaults=require("./defaults");module.exports=setOptions;

},{"./defaults":144,"markdown-escapes":78,"xtend":237}],157:[function(require,module,exports){
"use strict";function autoLink(e,t,i){var r,n,a,o,c,L,T,l,s,A,_,u;if(t.charAt(0)===C_LT){for(r=this,n="",a=t.length,o=0,c="",T=!1,l="",o++,n=C_LT;o<a&&(L=t.charAt(o),!(whitespace(L)||L===C_GT||L===C_AT_SIGN||":"===L&&t.charAt(o+1)===C_SLASH));)c+=L,o++;if(c){if(l+=c,c="",L=t.charAt(o),l+=L,o++,L===C_AT_SIGN)T=!0;else{if(":"!==L||t.charAt(o+1)!==C_SLASH)return;l+=C_SLASH,o++}for(;o<a&&(L=t.charAt(o),!whitespace(L)&&L!==C_GT);)c+=L,o++;if(L=t.charAt(o),c&&L===C_GT)return!!i||(l+=c,A=l,n+=l+L,s=e.now(),s.column++,s.offset++,T&&(l.slice(0,MAILTO_LENGTH).toLowerCase()===MAILTO?(A=A.substr(MAILTO_LENGTH),s.column+=MAILTO_LENGTH,s.offset+=MAILTO_LENGTH):l=MAILTO+l),_=r.inlineTokenizers.escape,r.inlineTokenizers.escape=null,u=r.enterLink(),A=r.tokenizeInline(A,s),r.inlineTokenizers.escape=_,u(),e(n)({type:"link",title:null,url:decode(l),children:A}))}}}var whitespace=require("is-whitespace-character"),decode=require("parse-entities"),locate=require("../locate/tag");module.exports=autoLink,autoLink.locator=locate,autoLink.notInLink=!0;var C_LT="<",C_GT=">",C_AT_SIGN="@",C_SLASH="/",MAILTO="mailto:",MAILTO_LENGTH=MAILTO.length;

},{"../locate/tag":152,"is-whitespace-character":51,"parse-entities":113}],158:[function(require,module,exports){
"use strict";function blockquote(r,e,t){for(var i,o,n,u,c,C,l,_,f,h=this,s=h.offset,A=h.blockTokenizers,E=h.interruptBlockquote,k=r.now(),a=k.line,p=e.length,N=[],T=[],b=[],q=0;q<p&&((o=e.charAt(q))===C_SPACE||o===C_TAB);)q++;if(e.charAt(q)===C_GT){if(t)return!0;for(q=0;q<p;){for(l=q,_=!1,-1===(u=e.indexOf(C_NEWLINE,q))&&(u=p);q<p&&((o=e.charAt(q))===C_SPACE||o===C_TAB);)q++;if(e.charAt(q)===C_GT?(q++,_=!0,e.charAt(q)===C_SPACE&&q++):q=l,c=e.slice(q,u),!_&&!trim(c)){q=l;break}if(!_&&(n=e.slice(q),interrupt(E,A,h,[r,n,!0])))break;C=l===q?c:e.slice(l,u),b.push(q-l),N.push(C),T.push(c),q=u+1}for(q=-1,p=b.length,i=r(N.join(C_NEWLINE));++q<p;)s[a]=(s[a]||0)+b[q],a++;return f=h.enterBlock(),T=h.tokenizeBlock(T.join(C_NEWLINE),k),f(),i({type:"blockquote",children:T})}}var trim=require("trim"),interrupt=require("../util/interrupt");module.exports=blockquote;var C_NEWLINE="\n",C_TAB="\t",C_SPACE=" ",C_GT=">";

},{"../util/interrupt":186,"trim":207}],159:[function(require,module,exports){
"use strict";function hardBreak(r,e,a){for(var t,o=e.length,c=-1,n="";++c<o;){if("\n"===(t=e.charAt(c))){if(c<MIN_BREAK_LENGTH)return;return!!a||(n+=t,r(n)({type:"break"}))}if(" "!==t)return;n+=t}}var locate=require("../locate/break");module.exports=hardBreak,hardBreak.locator=locate;var MIN_BREAK_LENGTH=2;

},{"../locate/break":145}],160:[function(require,module,exports){
"use strict";function fencedCode(C,r,e){var t,_,E,f,N,i,A,n,o,a,c,T=this,h=T.options,l=r.length+1,I=0,s="";if(h.gfm){for(;I<l&&((E=r.charAt(I))===C_SPACE||E===C_TAB);)s+=E,I++;if(a=I,(E=r.charAt(I))===C_TILDE||E===C_TICK){for(I++,_=E,t=1,s+=E;I<l&&(E=r.charAt(I))===_;)s+=E,t++,I++;if(!(t<MIN_FENCE_COUNT)){for(;I<l&&((E=r.charAt(I))===C_SPACE||E===C_TAB);)s+=E,I++;for(f="",N="";I<l&&(E=r.charAt(I))!==C_NEWLINE&&E!==C_TILDE&&E!==C_TICK;)E===C_SPACE||E===C_TAB?N+=E:(f+=N+E,N=""),I++;if(!(E=r.charAt(I))||E===C_NEWLINE){if(e)return!0;for((c=C.now()).column+=s.length,c.offset+=s.length,s+=f,f=T.decode.raw(T.unescape(f),c),N&&(s+=N),N="",n="",o="",i="",A="";I<l;)if(E=r.charAt(I),i+=n,A+=o,n="",o="",E===C_NEWLINE){for(i?(n+=E,o+=E):s+=E,N="",I++;I<l&&(E=r.charAt(I))===C_SPACE;)N+=E,I++;if(n+=N,o+=N.slice(a),!(N.length>=CODE_INDENT_COUNT)){for(N="";I<l&&(E=r.charAt(I))===_;)N+=E,I++;if(n+=N,o+=N,!(N.length<t)){for(N="";I<l&&((E=r.charAt(I))===C_SPACE||E===C_TAB);)n+=E,o+=E,I++;if(!E||E===C_NEWLINE)break}}}else i+=E,o+=E,I++;return s+=i+n,C(s)({type:"code",lang:f||null,value:trim(A)})}}}}}var trim=require("trim-trailing-lines");module.exports=fencedCode;var C_NEWLINE="\n",C_TAB="\t",C_SPACE=" ",C_TILDE="~",C_TICK="`",MIN_FENCE_COUNT=3,CODE_INDENT_COUNT=4;

},{"trim-trailing-lines":206}],161:[function(require,module,exports){
"use strict";function indentedCode(e,r,t){for(var C,i,E,N=-1,a=r.length,_="",n="",A="",l="";++N<a;)if(C=r.charAt(N),E)if(E=!1,_+=A,n+=l,A="",l="",C===C_NEWLINE)A=C,l=C;else for(_+=C,n+=C;++N<a;){if(!(C=r.charAt(N))||C===C_NEWLINE){l=C,A=C;break}_+=C,n+=C}else if(C===C_SPACE&&r.charAt(N+1)===C&&r.charAt(N+2)===C&&r.charAt(N+3)===C)A+=CODE_INDENT,N+=3,E=!0;else if(C===C_TAB)A+=C,E=!0;else{for(i="";C===C_TAB||C===C_SPACE;)i+=C,C=r.charAt(++N);if(C!==C_NEWLINE)break;A+=i+C,l+=C}if(n)return!!t||e(_)({type:"code",lang:null,value:trim(n)})}var repeat=require("repeat-string"),trim=require("trim-trailing-lines");module.exports=indentedCode;var C_NEWLINE="\n",C_TAB="\t",C_SPACE=" ",CODE_INDENT_COUNT=4,CODE_INDENT=repeat(C_SPACE,CODE_INDENT_COUNT);

},{"repeat-string":190,"trim-trailing-lines":206}],162:[function(require,module,exports){
"use strict";function inlineCode(e,r,i){for(var t,a,n,c,o,C,l,f,h=r.length,u=0,s="",d="";u<h&&r.charAt(u)===C_TICK;)s+=C_TICK,u++;if(s){for(o=s,c=u,s="",f=r.charAt(u),n=0;u<h;){if(C=f,f=r.charAt(u+1),C===C_TICK?(n++,d+=C):(n=0,s+=C),n&&f!==C_TICK){if(n===c){o+=s+d,l=!0;break}s+=d,d=""}u++}if(!l){if(c%2!=0)return;s=""}if(i)return!0;for(t="",a="",h=s.length,u=-1;++u<h;)C=s.charAt(u),whitespace(C)?a+=C:(a&&(t&&(t+=a),a=""),t+=C);return e(o)({type:"inlineCode",value:t})}}var whitespace=require("is-whitespace-character"),locate=require("../locate/code-inline");module.exports=inlineCode,inlineCode.locator=locate;var C_TICK="`";

},{"../locate/code-inline":146,"is-whitespace-character":51}],163:[function(require,module,exports){
"use strict";function definition(C,r,e){for(var t,_,E,i,n,a,A,c,o=this,L=o.options.commonmark,h=0,N=r.length,f="";h<N&&((i=r.charAt(h))===C_SPACE||i===C_TAB);)f+=i,h++;if((i=r.charAt(h))===C_BRACKET_OPEN){for(h++,f+=i,E="";h<N&&(i=r.charAt(h))!==C_BRACKET_CLOSE;)i===C_BACKSLASH&&(E+=i,h++,i=r.charAt(h)),E+=i,h++;if(E&&r.charAt(h)===C_BRACKET_CLOSE&&r.charAt(h+1)===C_COLON){for(a=E,h=(f+=E+C_BRACKET_CLOSE+C_COLON).length,E="";h<N&&((i=r.charAt(h))===C_TAB||i===C_SPACE||i===C_NEWLINE);)f+=i,h++;if(i=r.charAt(h),E="",t=f,i===C_LT){for(h++;h<N&&(i=r.charAt(h),isEnclosedURLCharacter(i));)E+=i,h++;if((i=r.charAt(h))===isEnclosedURLCharacter.delimiter)f+=C_LT+E+i,h++;else{if(L)return;h-=E.length+1,E=""}}if(!E){for(;h<N&&(i=r.charAt(h),isUnclosedURLCharacter(i));)E+=i,h++;f+=E}if(E){for(A=E,E="";h<N&&((i=r.charAt(h))===C_TAB||i===C_SPACE||i===C_NEWLINE);)E+=i,h++;if(i=r.charAt(h),n=null,i===C_DOUBLE_QUOTE?n=C_DOUBLE_QUOTE:i===C_SINGLE_QUOTE?n=C_SINGLE_QUOTE:i===C_PAREN_OPEN&&(n=C_PAREN_CLOSE),n){if(!E)return;for(h=(f+=E+i).length,E="";h<N&&(i=r.charAt(h))!==n;){if(i===C_NEWLINE){if(h++,(i=r.charAt(h))===C_NEWLINE||i===n)return;E+=C_NEWLINE}E+=i,h++}if((i=r.charAt(h))!==n)return;_=f,f+=E+i,h++,c=E,E=""}else E="",h=f.length;for(;h<N&&((i=r.charAt(h))===C_TAB||i===C_SPACE);)f+=i,h++;return(i=r.charAt(h))&&i!==C_NEWLINE?void 0:!!e||(t=C(t).test().end,A=o.decode.raw(o.unescape(A),t),c&&(_=C(_).test().end,c=o.decode.raw(o.unescape(c),_)),C(f)({type:"definition",identifier:normalize(a),title:c||null,url:A}))}}}}function isEnclosedURLCharacter(C){return C!==C_GT&&C!==C_BRACKET_OPEN&&C!==C_BRACKET_CLOSE}function isUnclosedURLCharacter(C){return C!==C_BRACKET_OPEN&&C!==C_BRACKET_CLOSE&&!whitespace(C)}var whitespace=require("is-whitespace-character"),normalize=require("../util/normalize");module.exports=definition,definition.notInList=!0,definition.notInBlock=!0;var C_DOUBLE_QUOTE='"',C_SINGLE_QUOTE="'",C_BACKSLASH="\\",C_NEWLINE="\n",C_TAB="\t",C_SPACE=" ",C_BRACKET_OPEN="[",C_BRACKET_CLOSE="]",C_PAREN_OPEN="(",C_PAREN_CLOSE=")",C_COLON=":",C_LT="<",C_GT=">";isEnclosedURLCharacter.delimiter=C_GT;

},{"../util/normalize":187,"is-whitespace-character":51}],164:[function(require,module,exports){
"use strict";function strikethrough(e,t,r){var i,c,h,o=this,a="",s="",l="",n="";if(o.options.gfm&&t.charAt(0)===C_TILDE&&t.charAt(1)===C_TILDE&&!whitespace(t.charAt(2)))for(i=1,c=t.length,(h=e.now()).column+=2,h.offset+=2;++i<c;){if(!((a=t.charAt(i))!==C_TILDE||s!==C_TILDE||l&&whitespace(l)))return!!r||e(DOUBLE+n+DOUBLE)({type:"delete",children:o.tokenizeInline(n,h)});n+=s,l=s,s=a}}var whitespace=require("is-whitespace-character"),locate=require("../locate/delete");module.exports=strikethrough,strikethrough.locator=locate;var C_TILDE="~",DOUBLE="~~";

},{"../locate/delete":147,"is-whitespace-character":51}],165:[function(require,module,exports){
"use strict";function emphasis(e,r,i){var t,a,c,s,h,o,n,p=this,u=0,m=r.charAt(u);if(!(m!==C_ASTERISK&&m!==C_UNDERSCORE||(a=p.options.pedantic,h=m,c=m,o=r.length,u++,s="",m="",a&&whitespace(r.charAt(u)))))for(;u<o;){if(n=m,!((m=r.charAt(u))!==c||a&&whitespace(n))){if((m=r.charAt(++u))!==c){if(!trim(s)||n===c)return;if(!a&&c===C_UNDERSCORE&&word(m)){s+=c;continue}return!!i||(t=e.now(),t.column++,t.offset++,e(h+s+c)({type:"emphasis",children:p.tokenizeInline(s,t)}))}s+=c}a||"\\"!==m||(s+=m,m=r.charAt(++u)),s+=m,u++}}var trim=require("trim"),word=require("is-word-character"),whitespace=require("is-whitespace-character"),locate=require("../locate/emphasis");module.exports=emphasis,emphasis.locator=locate;var C_ASTERISK="*",C_UNDERSCORE="_";

},{"../locate/emphasis":148,"is-whitespace-character":51,"is-word-character":52,"trim":207}],166:[function(require,module,exports){
"use strict";function escape(e,t,a){var c,r,s=this;if("\\"===t.charAt(0)&&(c=t.charAt(1),-1!==s.escape.indexOf(c)))return!!a||(r="\n"===c?{type:"break"}:{type:"text",value:c},e("\\"+c)(r))}var locate=require("../locate/escape");module.exports=escape,escape.locator=locate;

},{"../locate/escape":149}],167:[function(require,module,exports){
"use strict";function footnoteDefinition(t,e,o){var n,C,i,r,A,_,f,E,c,a,h,l,B=this,N=B.offset;if(B.options.footnotes){for(n=0,C=e.length,i="",r=t.now(),A=r.line;n<C&&(c=e.charAt(n),whitespace(c));)i+=c,n++;if(e.charAt(n)===C_BRACKET_OPEN&&e.charAt(n+1)===C_CARET){for(n=(i+=C_BRACKET_OPEN+C_CARET).length,f="";n<C&&(c=e.charAt(n))!==C_BRACKET_CLOSE;)c===C_BACKSLASH&&(f+=c,n++,c=e.charAt(n)),f+=c,n++;if(f&&e.charAt(n)===C_BRACKET_CLOSE&&e.charAt(n+1)===C_COLON){if(o)return!0;for(a=normalize(f),n=(i+=f+C_BRACKET_CLOSE+C_COLON).length;n<C&&((c=e.charAt(n))===C_TAB||c===C_SPACE);)i+=c,n++;for(r.column+=i.length,r.offset+=i.length,f="",_="",E="";n<C;){if((c=e.charAt(n))===C_NEWLINE){for(E=c,n++;n<C&&(c=e.charAt(n))===C_NEWLINE;)E+=c,n++;for(f+=E,E="";n<C&&(c=e.charAt(n))===C_SPACE;)E+=c,n++;if(0===E.length)break;f+=E}f&&(_+=f,f=""),_+=c,n++}return i+=_,_=_.replace(EXPRESSION_INITIAL_TAB,function(t){return N[A]=(N[A]||0)+t.length,A++,""}),h=t(i),l=B.enterBlock(),_=B.tokenizeBlock(_,r),l(),h({type:"footnoteDefinition",identifier:a,children:_})}}}}var whitespace=require("is-whitespace-character"),normalize=require("../util/normalize");module.exports=footnoteDefinition,footnoteDefinition.notInList=!0,footnoteDefinition.notInBlock=!0;var C_BACKSLASH="\\",C_NEWLINE="\n",C_TAB="\t",C_SPACE=" ",C_BRACKET_OPEN="[",C_BRACKET_CLOSE="]",C_CARET="^",C_COLON=":",EXPRESSION_INITIAL_TAB=/^( {4}|\t)?/gm;

},{"../util/normalize":187,"is-whitespace-character":51}],168:[function(require,module,exports){
"use strict";function atxHeading(t,A,C){for(var e,r,_,n=this,a=n.options,i=A.length+1,f=-1,h=t.now(),o="",c="";++f<i;){if((e=A.charAt(f))!==C_SPACE&&e!==C_TAB){f--;break}o+=e}for(_=0;++f<=i;){if((e=A.charAt(f))!==C_HASH){f--;break}o+=e,_++}if(!(_>MAX_ATX_COUNT)&&_&&(a.pedantic||A.charAt(f+1)!==C_HASH)){for(i=A.length+1,r="";++f<i;){if((e=A.charAt(f))!==C_SPACE&&e!==C_TAB){f--;break}r+=e}if(a.pedantic||0!==r.length||!e||e===C_NEWLINE){if(C)return!0;for(o+=r,r="",c="";++f<i&&(e=A.charAt(f))&&e!==C_NEWLINE;)if(e===C_SPACE||e===C_TAB||e===C_HASH){for(;e===C_SPACE||e===C_TAB;)r+=e,e=A.charAt(++f);for(;e===C_HASH;)r+=e,e=A.charAt(++f);for(;e===C_SPACE||e===C_TAB;)r+=e,e=A.charAt(++f);f--}else c+=r+e,r="";return h.column+=o.length,h.offset+=o.length,o+=c+r,t(o)({type:"heading",depth:_,children:n.tokenizeInline(c,h)})}}}module.exports=atxHeading;var C_NEWLINE="\n",C_TAB="\t",C_SPACE=" ",C_HASH="#",MAX_ATX_COUNT=6;

},{}],169:[function(require,module,exports){
"use strict";function setextHeading(E,e,t){for(var A,_,r,n,S,C=this,i=E.now(),N=e.length,T=-1,a="";++T<N;){if((r=e.charAt(T))!==C_SPACE||T>=MAX_HEADING_INDENT){T--;break}a+=r}for(A="",_="";++T<N;){if((r=e.charAt(T))===C_NEWLINE){T--;break}r===C_SPACE||r===C_TAB?_+=r:(A+=_+r,_="")}if(i.column+=a.length,i.offset+=a.length,a+=A+_,r=e.charAt(++T),n=e.charAt(++T),r===C_NEWLINE&&SETEXT_MARKERS[n]){for(a+=r,_=n,S=SETEXT_MARKERS[n];++T<N;){if((r=e.charAt(T))!==n){if(r!==C_NEWLINE)return;T--;break}_+=r}return!!t||E(a+_)({type:"heading",depth:S,children:C.tokenizeInline(A,i)})}}module.exports=setextHeading;var C_NEWLINE="\n",C_TAB="\t",C_SPACE=" ",C_EQUALS="=",C_DASH="-",MAX_HEADING_INDENT=3,SETEXT_MARKERS={};SETEXT_MARKERS[C_EQUALS]=1,SETEXT_MARKERS[C_DASH]=2;

},{}],170:[function(require,module,exports){
"use strict";function blockHTML(e,t,i){for(var r,s,o,l,n,C,c,a=this.options.blocks,f=t.length,p=0,E=[[/^<(script|pre|style)(?=(\s|>|$))/i,/<\/(script|pre|style)>/i,!0],[/^<!--/,/-->/,!0],[/^<\?/,/\?>/,!0],[/^<![A-Za-z]/,/>/,!0],[/^<!\[CDATA\[/,/\]\]>/,!0],[new RegExp("^</?("+a.join("|")+")(?=(\\s|/?>|$))","i"),/^$/,!0],[new RegExp(openCloseTag.source+"\\s*$"),/^$/,!1]];p<f&&((l=t.charAt(p))===C_TAB||l===C_SPACE);)p++;if(t.charAt(p)===C_LT){for(r=-1===(r=t.indexOf(C_NEWLINE,p+1))?f:r,s=t.slice(p,r),o=-1,n=E.length;++o<n;)if(E[o][0].test(s)){C=E[o];break}if(C){if(i)return C[2];if(p=r,!C[1].test(s))for(;p<f;){if(r=t.indexOf(C_NEWLINE,p+1),r=-1===r?f:r,s=t.slice(p+1,r),C[1].test(s)){s&&(p=r);break}p=r}return c=t.slice(0,p),e(c)({type:"html",value:c})}}}var openCloseTag=require("../util/html").openCloseTag;module.exports=blockHTML;var C_TAB="\t",C_SPACE=" ",C_NEWLINE="\n",C_LT="<";

},{"../util/html":185}],171:[function(require,module,exports){
"use strict";function inlineHTML(t,i,a){var e,l,n=this,L=i.length;if(!("<"!==i.charAt(0)||L<3)&&(e=i.charAt(1),(alphabetical(e)||"?"===e||"!"===e||"/"===e)&&(l=i.match(tag))))return!!a||(l=l[0],!n.inLink&&EXPRESSION_HTML_LINK_OPEN.test(l)?n.inLink=!0:n.inLink&&EXPRESSION_HTML_LINK_CLOSE.test(l)&&(n.inLink=!1),t(l)({type:"html",value:l}))}var alphabetical=require("is-alphabetical"),locate=require("../locate/tag"),tag=require("../util/html").tag;module.exports=inlineHTML,inlineHTML.locator=locate;var EXPRESSION_HTML_LINK_OPEN=/^<a /i,EXPRESSION_HTML_LINK_CLOSE=/^<\/a>/i;

},{"../locate/tag":152,"../util/html":185,"is-alphabetical":44}],172:[function(require,module,exports){
"use strict";function link(e,_,C){var r,A,t,E,a,i,c,n,O,L,R,f,N,l,o,K,h,S,s,T=this,M="",P=0,p=_.charAt(0),u=T.options.pedantic,I=T.options.commonmark,w=T.options.gfm;if("!"===p&&(O=!0,M=p,p=_.charAt(++P)),p===C_BRACKET_OPEN&&(O||!T.inLink)){for(M+=p,o="",P++,f=_.length,l=0,(h=e.now()).column+=P,h.offset+=P;P<f;){if(p=_.charAt(P),i=p,p===C_TICK){for(A=1;_.charAt(P+1)===C_TICK;)i+=p,P++,A++;t?A>=t&&(t=0):t=A}else if(p===C_BACKSLASH)P++,i+=_.charAt(P);else if(t&&!w||p!==C_BRACKET_OPEN){if((!t||w)&&p===C_BRACKET_CLOSE){if(!l){if(!u)for(;P<f&&(p=_.charAt(P+1),whitespace(p));)i+=p,P++;if(_.charAt(P+1)!==C_PAREN_OPEN)return;i+=C_PAREN_OPEN,r=!0,P++;break}l--}}else l++;o+=i,i="",P++}if(r){for(L=o,M+=o+i,P++;P<f&&(p=_.charAt(P),whitespace(p));)M+=p,P++;if(p=_.charAt(P),n=I?COMMONMARK_LINK_MARKERS:LINK_MARKERS,o="",E=M,p===C_LT){for(P++,E+=C_LT;P<f&&(p=_.charAt(P))!==C_GT;){if(I&&"\n"===p)return;o+=p,P++}if(_.charAt(P)!==C_GT)return;M+=C_LT+o+C_GT,K=o,P++}else{for(p=null,i="";P<f&&(p=_.charAt(P),!i||!own.call(n,p));){if(whitespace(p)){if(!u)break;i+=p}else{if(p===C_PAREN_OPEN)l++;else if(p===C_PAREN_CLOSE){if(0===l)break;l--}o+=i,i="",p===C_BACKSLASH&&(o+=C_BACKSLASH,p=_.charAt(++P)),o+=p}P++}K=o,P=(M+=o).length}for(o="";P<f&&(p=_.charAt(P),whitespace(p));)o+=p,P++;if(p=_.charAt(P),M+=o,o&&own.call(n,p))if(P++,M+=p,o="",R=n[p],a=M,I){for(;P<f&&(p=_.charAt(P))!==R;)p===C_BACKSLASH&&(o+=C_BACKSLASH,p=_.charAt(++P)),P++,o+=p;if((p=_.charAt(P))!==R)return;for(N=o,M+=o+p,P++;P<f&&(p=_.charAt(P),whitespace(p));)M+=p,P++}else for(i="";P<f;){if((p=_.charAt(P))===R)c&&(o+=R+i,i=""),c=!0;else if(c){if(p===C_PAREN_CLOSE){M+=o+R+i,N=o;break}whitespace(p)?i+=p:(o+=R+i+p,i="",c=!1)}else o+=p;P++}if(_.charAt(P)===C_PAREN_CLOSE)return!!C||(M+=C_PAREN_CLOSE,K=T.decode.raw(T.unescape(K),e(E).test().end),N&&(a=e(a).test().end,N=T.decode.raw(T.unescape(N),a)),s={type:O?"image":"link",title:N||null,url:K},O?s.alt=T.decode.raw(T.unescape(L),h)||null:(S=T.enterLink(),s.children=T.tokenizeInline(L,h),S()),e(M)(s))}}}var whitespace=require("is-whitespace-character"),locate=require("../locate/link");module.exports=link,link.locator=locate;var own={}.hasOwnProperty,C_BACKSLASH="\\",C_BRACKET_OPEN="[",C_BRACKET_CLOSE="]",C_PAREN_OPEN="(",C_PAREN_CLOSE=")",C_LT="<",C_GT=">",C_TICK="`",C_DOUBLE_QUOTE='"',C_SINGLE_QUOTE="'",LINK_MARKERS={};LINK_MARKERS[C_DOUBLE_QUOTE]=C_DOUBLE_QUOTE,LINK_MARKERS[C_SINGLE_QUOTE]=C_SINGLE_QUOTE;var COMMONMARK_LINK_MARKERS={};COMMONMARK_LINK_MARKERS[C_DOUBLE_QUOTE]=C_DOUBLE_QUOTE,COMMONMARK_LINK_MARKERS[C_SINGLE_QUOTE]=C_SINGLE_QUOTE,COMMONMARK_LINK_MARKERS[C_PAREN_OPEN]=C_PAREN_CLOSE;

},{"../locate/link":150,"is-whitespace-character":51}],173:[function(require,module,exports){
"use strict";function list(e,t,E){for(var _,r,n,i,S,l,I,R,A,a,C,o,c,T,N,s,L,u,f,O,D,h,p,M,m=this,d=m.options.commonmark,B=m.options.pedantic,P=m.blockTokenizers,K=m.interruptList,g=0,v=t.length,k=null,U=0;g<v;){if((i=t.charAt(g))===C_TAB)U+=TAB_SIZE-U%TAB_SIZE;else{if(i!==C_SPACE)break;U++}g++}if(!(U>=TAB_SIZE)){if(i=t.charAt(g),_=d?LIST_ORDERED_COMMONMARK_MARKERS:LIST_ORDERED_MARKERS,!0===LIST_UNORDERED_MARKERS[i])S=i,n=!1;else{for(n=!0,r="";g<v&&(i=t.charAt(g),decimal(i));)r+=i,g++;if(i=t.charAt(g),!r||!0!==_[i])return;k=parseInt(r,10),S=i}if((i=t.charAt(++g))===C_SPACE||i===C_TAB){if(E)return!0;for(g=0,T=[],N=[],s=[];g<v;){for(I=g,R=!1,M=!1,-1===(l=t.indexOf(C_NEWLINE,g))&&(l=v),p=g+TAB_SIZE,U=0;g<v;){if((i=t.charAt(g))===C_TAB)U+=TAB_SIZE-U%TAB_SIZE;else{if(i!==C_SPACE)break;U++}g++}if(U>=TAB_SIZE&&(M=!0),L&&U>=L.indent&&(M=!0),i=t.charAt(g),A=null,!M){if(!0===LIST_UNORDERED_MARKERS[i])A=i,g++,U++;else{for(r="";g<v&&(i=t.charAt(g),decimal(i));)r+=i,g++;i=t.charAt(g),g++,r&&!0===_[i]&&(A=i,U+=r.length+1)}if(A)if((i=t.charAt(g))===C_TAB)U+=TAB_SIZE-U%TAB_SIZE,g++;else if(i===C_SPACE){for(p=g+TAB_SIZE;g<p&&t.charAt(g)===C_SPACE;)g++,U++;g===p&&t.charAt(g)===C_SPACE&&(g-=TAB_SIZE-1,U-=TAB_SIZE-1)}else i!==C_NEWLINE&&""!==i&&(A=null)}if(A){if(!B&&S!==A)break;R=!0}else d||M||t.charAt(I)!==C_SPACE?d&&L&&(M=U>=L.indent||U>TAB_SIZE):M=!0,R=!1,g=I;if(C=t.slice(I,l),a=I===g?C:t.slice(g,l),(A===C_ASTERISK||A===C_UNDERSCORE||A===C_DASH)&&P.thematicBreak.call(m,e,C,!0))break;if(o=c,c=!trim(a).length,M&&L)L.value=L.value.concat(s,C),N=N.concat(s,C),s=[];else if(R)0!==s.length&&(L.value.push(""),L.trail=s.concat()),L={value:[C],indent:U,trail:[]},T.push(L),N=N.concat(s,C),s=[];else if(c){if(o)break;s.push(C)}else{if(o)break;if(interrupt(K,P,m,[e,C,!0]))break;L.value=L.value.concat(s,C),N=N.concat(s,C),s=[]}g=l+1}for(D=e(N.join(C_NEWLINE)).reset({type:"list",ordered:n,start:k,loose:null,children:[]}),u=m.enterList(),f=m.enterBlock(),O=!1,g=-1,v=T.length;++g<v;)L=T[g].value.join(C_NEWLINE),h=e.now(),(L=e(L)(listItem(m,L,h),D)).loose&&(O=!0),L=T[g].trail.join(C_NEWLINE),g!==v-1&&(L+=C_NEWLINE),e(L);return u(),f(),D.loose=O,D}}}function listItem(e,t,E){var _,r,n=e.offset,i=null;return t=(e.options.pedantic?pedanticListItem:normalListItem).apply(null,arguments),e.options.gfm&&(_=t.match(EXPRESSION_TASK_ITEM))&&(r=_[0].length,i=_[1].toLowerCase()===C_X_LOWER,n[E.line]+=r,t=t.slice(r)),{type:"listItem",loose:EXPRESSION_LOOSE_LIST_ITEM.test(t)||t.charAt(t.length-1)===C_NEWLINE,checked:i,children:e.tokenizeBlock(t,E)}}function pedanticListItem(e,t,E){function _(e){return r[n]=(r[n]||0)+e.length,n++,""}var r=e.offset,n=E.line;return t=t.replace(EXPRESSION_PEDANTIC_BULLET,_),n=E.line,t.replace(EXPRESSION_INITIAL_INDENT,_)}function normalListItem(e,t,E){var _,r,n,i,S,l,I,R=e.offset,A=E.line;for(i=(t=t.replace(EXPRESSION_BULLET,function(e,t,E,i,S){return r=t+E+i,n=S,Number(E)<10&&r.length%2==1&&(E=C_SPACE+E),(_=t+repeat(C_SPACE,E.length)+i)+n})).split(C_NEWLINE),(S=removeIndent(t,getIndent(_).indent).split(C_NEWLINE))[0]=n,R[A]=(R[A]||0)+r.length,A++,l=0,I=i.length;++l<I;)R[A]=(R[A]||0)+i[l].length-S[l].length,A++;return S.join(C_NEWLINE)}var trim=require("trim"),repeat=require("repeat-string"),decimal=require("is-decimal"),getIndent=require("../util/get-indentation"),removeIndent=require("../util/remove-indentation"),interrupt=require("../util/interrupt");module.exports=list;var C_ASTERISK="*",C_UNDERSCORE="_",C_PLUS="+",C_DASH="-",C_DOT=".",C_SPACE=" ",C_NEWLINE="\n",C_TAB="\t",C_PAREN_CLOSE=")",C_X_LOWER="x",TAB_SIZE=4,EXPRESSION_LOOSE_LIST_ITEM=/\n\n(?!\s*$)/,EXPRESSION_TASK_ITEM=/^\[([ \t]|x|X)][ \t]/,EXPRESSION_BULLET=/^([ \t]*)([*+-]|\d+[.)])( {1,4}(?! )| |\t|$|(?=\n))([^\n]*)/,EXPRESSION_PEDANTIC_BULLET=/^([ \t]*)([*+-]|\d+[.)])([ \t]+)/,EXPRESSION_INITIAL_INDENT=/^( {1,4}|\t)?/gm,LIST_UNORDERED_MARKERS={};LIST_UNORDERED_MARKERS[C_ASTERISK]=!0,LIST_UNORDERED_MARKERS[C_PLUS]=!0,LIST_UNORDERED_MARKERS[C_DASH]=!0;var LIST_ORDERED_MARKERS={};LIST_ORDERED_MARKERS[C_DOT]=!0;var LIST_ORDERED_COMMONMARK_MARKERS={};LIST_ORDERED_COMMONMARK_MARKERS[C_DOT]=!0,LIST_ORDERED_COMMONMARK_MARKERS[C_PAREN_CLOSE]=!0;

},{"../util/get-indentation":184,"../util/interrupt":186,"../util/remove-indentation":188,"is-decimal":47,"repeat-string":190,"trim":207}],174:[function(require,module,exports){
"use strict";function newline(e,r,t){var i,n,a,c,h=r.charAt(0);if("\n"===h){if(t)return!0;for(c=1,i=r.length,n=h,a="";c<i&&(h=r.charAt(c),whitespace(h));)a+=h,"\n"===h&&(n+=a,a=""),c++;e(n)}}var whitespace=require("is-whitespace-character");module.exports=newline;

},{"is-whitespace-character":51}],175:[function(require,module,exports){
"use strict";function paragraph(i,r,e){for(var t,a,n,l,f,c=this,m=c.options,s=m.commonmark,u=m.gfm,E=c.blockTokenizers,o=c.interruptParagraph,p=r.indexOf(C_NEWLINE),_=r.length;p<_;){if(-1===p){p=_;break}if(r.charAt(p+1)===C_NEWLINE)break;if(s){for(l=0,t=p+1;t<_;){if((n=r.charAt(t))===C_TAB){l=TAB_SIZE;break}if(n!==C_SPACE)break;l++,t++}if(l>=TAB_SIZE){p=r.indexOf(C_NEWLINE,p+1);continue}}if(a=r.slice(p+1),interrupt(o,E,c,[i,a,!0]))break;if(E.list.call(c,i,a,!0)&&(c.inList||s||u&&!decimal(trim.left(a).charAt(0))))break;if(t=p,-1!==(p=r.indexOf(C_NEWLINE,p+1))&&""===trim(r.slice(t,p))){p=t;break}}return a=r.slice(0,p),""===trim(a)?(i(a),null):!!e||(f=i.now(),a=trimTrailingLines(a),i(a)({type:"paragraph",children:c.tokenizeInline(a,f)}))}var trim=require("trim"),decimal=require("is-decimal"),trimTrailingLines=require("trim-trailing-lines"),interrupt=require("../util/interrupt");module.exports=paragraph;var C_NEWLINE="\n",C_TAB="\t",C_SPACE=" ",TAB_SIZE=4;

},{"../util/interrupt":186,"is-decimal":47,"trim":207,"trim-trailing-lines":206}],176:[function(require,module,exports){
"use strict";function reference(e,E,_){var C,r,t,T,n,i,A,c,o=this,a=E.charAt(0),R=0,l=E.length,L="",O="",f=T_LINK,h=REFERENCE_TYPE_SHORTCUT;if("!"===a&&(f=T_IMAGE,O=a,a=E.charAt(++R)),a===C_BRACKET_OPEN){for(R++,O+=a,i="",o.options.footnotes&&f===T_LINK&&E.charAt(R)===C_CARET&&(O+=C_CARET,R++,f=T_FOOTNOTE),c=0;R<l;){if((a=E.charAt(R))===C_BRACKET_OPEN)A=!0,c++;else if(a===C_BRACKET_CLOSE){if(!c)break;c--}a===C_BACKSLASH&&(i+=C_BACKSLASH,a=E.charAt(++R)),i+=a,R++}if(L=i,C=i,(a=E.charAt(R))===C_BRACKET_CLOSE){for(R++,L+=a,i="";R<l&&(a=E.charAt(R),whitespace(a));)i+=a,R++;if(a=E.charAt(R),f!==T_FOOTNOTE&&a===C_BRACKET_OPEN){for(r="",i+=a,R++;R<l&&(a=E.charAt(R))!==C_BRACKET_OPEN&&a!==C_BRACKET_CLOSE;)a===C_BACKSLASH&&(r+=C_BACKSLASH,a=E.charAt(++R)),r+=a,R++;(a=E.charAt(R))===C_BRACKET_CLOSE?(h=r?REFERENCE_TYPE_FULL:REFERENCE_TYPE_COLLAPSED,i+=r+a,R++):r="",L+=i,i=""}else{if(!C)return;r=C}if(h===REFERENCE_TYPE_FULL||!A)return L=O+L,f===T_LINK&&o.inLink?null:!!_||(f===T_FOOTNOTE&&-1!==C.indexOf(" ")?e(L)({type:"footnote",children:this.tokenizeInline(C,e.now())}):(t=e.now(),t.column+=O.length,t.offset+=O.length,r=h===REFERENCE_TYPE_FULL?r:C,T={type:f+"Reference",identifier:normalize(r)},f!==T_LINK&&f!==T_IMAGE||(T.referenceType=h),f===T_LINK?(n=o.enterLink(),T.children=o.tokenizeInline(C,t),n()):f===T_IMAGE&&(T.alt=o.decode.raw(o.unescape(C),t)||null),e(L)(T)))}}}var whitespace=require("is-whitespace-character"),locate=require("../locate/link"),normalize=require("../util/normalize");module.exports=reference,reference.locator=locate;var T_LINK="link",T_IMAGE="image",T_FOOTNOTE="footnote",REFERENCE_TYPE_SHORTCUT="shortcut",REFERENCE_TYPE_COLLAPSED="collapsed",REFERENCE_TYPE_FULL="full",C_CARET="^",C_BACKSLASH="\\",C_BRACKET_OPEN="[",C_BRACKET_CLOSE="]";

},{"../locate/link":150,"../util/normalize":187,"is-whitespace-character":51}],177:[function(require,module,exports){
"use strict";function strong(t,r,e){var c,i,a,o,n,s,h,l=this,u=0,A=r.charAt(u);if(!(A!==C_ASTERISK&&A!==C_UNDERSCORE||r.charAt(++u)!==A||(i=l.options.pedantic,a=A,n=a+a,s=r.length,u++,o="",A="",i&&whitespace(r.charAt(u)))))for(;u<s;){if(h=A,!((A=r.charAt(u))!==a||r.charAt(u+1)!==a||i&&whitespace(h))&&(A=r.charAt(u+2))!==a){if(!trim(o))return;return!!e||(c=t.now(),c.column+=2,c.offset+=2,t(n+o+n)({type:"strong",children:l.tokenizeInline(o,c)}))}i||"\\"!==A||(o+=A,A=r.charAt(++u)),o+=A,u++}}var trim=require("trim"),whitespace=require("is-whitespace-character"),locate=require("../locate/strong");module.exports=strong,strong.locator=locate;var C_ASTERISK="*",C_UNDERSCORE="_";

},{"../locate/strong":151,"is-whitespace-character":51,"trim":207}],178:[function(require,module,exports){
"use strict";function table(e,_,t){var l,E,i,A,L,r,N,n,C,I,f,h,T,s,a,c,B,u,o,O,p,G,S,g,P=this;if(P.options.gfm){for(l=0,u=0,r=_.length+1,N=[];l<r;){if(G=_.indexOf(C_NEWLINE,l),S=_.indexOf(C_PIPE,l+1),-1===G&&(G=_.length),-1===S||S>G){if(u<MIN_TABLE_ROWS)return;break}N.push(_.slice(l,G)),u++,l=G+1}for(A=N.join(C_NEWLINE),l=0,r=(E=N.splice(1,1)[0]||[]).length,u--,i=!1,f=[];l<r;){if((C=E.charAt(l))===C_PIPE){if(I=null,!1===i){if(!1===g)return}else f.push(i),i=!1;g=!1}else if(C===C_DASH)I=!0,i=i||TABLE_ALIGN_NONE;else if(C===C_COLON)i=i===TABLE_ALIGN_LEFT?TABLE_ALIGN_CENTER:I&&i===TABLE_ALIGN_NONE?TABLE_ALIGN_RIGHT:TABLE_ALIGN_LEFT;else if(!whitespace(C))return;l++}if(!1!==i&&f.push(i),!(f.length<MIN_TABLE_COLUMNS)){if(t)return!0;for(B=-1,O=[],p=e(A).reset({type:"table",align:f,children:O});++B<u;){for(o=N[B],L={type:"tableRow",children:[]},B&&e(C_NEWLINE),e(o).reset(L,p),r=o.length+1,l=0,n="",h="",T=!0,s=null,a=null;l<r;)if((C=o.charAt(l))!==C_TAB&&C!==C_SPACE){if(""===C||C===C_PIPE)if(T)e(C);else{if(C&&a){n+=C,l++;continue}!h&&!C||T||(A=h,n.length>1&&(C?(A+=n.slice(0,n.length-1),n=n.charAt(n.length-1)):(A+=n,n="")),c=e.now(),e(A)({type:"tableCell",children:P.tokenizeInline(h,c)},L)),e(n+C),n="",h=""}else if(n&&(h+=n,n=""),h+=C,C===C_BACKSLASH&&l!==r-2&&(h+=o.charAt(l+1),l++),C===C_TICK){for(s=1;o.charAt(l+1)===C;)h+=C,l++,s++;a?s>=a&&(a=0):a=s}T=!1,l++}else h?n+=C:e(C),l++;B||e(C_NEWLINE+E)}return p}}}var whitespace=require("is-whitespace-character");module.exports=table;var C_BACKSLASH="\\",C_TICK="`",C_DASH="-",C_PIPE="|",C_COLON=":",C_SPACE=" ",C_NEWLINE="\n",C_TAB="\t",MIN_TABLE_COLUMNS=1,MIN_TABLE_ROWS=2,TABLE_ALIGN_LEFT="left",TABLE_ALIGN_CENTER="center",TABLE_ALIGN_RIGHT="right",TABLE_ALIGN_NONE=null;

},{"is-whitespace-character":51}],179:[function(require,module,exports){
"use strict";function text(e,t,i){var n,l,o,r,s,c,a,f,u,x,d=this;if(i)return!0;for(r=(n=d.inlineMethods).length,l=d.inlineTokenizers,o=-1,u=t.length;++o<r;)"text"!==(f=n[o])&&l[f]&&((a=l[f].locator)||e.file.fail("Missing locator: `"+f+"`"),-1!==(c=a.call(d,t,1))&&c<u&&(u=c));s=t.slice(0,u),x=e.now(),d.decode(s,x,function(t,i,n){e(n||t)({type:"text",value:t})})}module.exports=text;

},{}],180:[function(require,module,exports){
"use strict";function thematicBreak(C,_,E){for(var A,t,e,r,R=-1,S=_.length+1,a="";++R<S&&((A=_.charAt(R))===C_TAB||A===C_SPACE);)a+=A;if(A===C_ASTERISK||A===C_DASH||A===C_UNDERSCORE)for(t=A,a+=A,e=1,r="";++R<S;)if((A=_.charAt(R))===t)e++,a+=r+t,r="";else{if(A!==C_SPACE)return e>=THEMATIC_BREAK_MARKER_COUNT&&(!A||A===C_NEWLINE)?(a+=r,!!E||C(a)({type:"thematicBreak"})):void 0;r+=A}}module.exports=thematicBreak;var C_NEWLINE="\n",C_TAB="\t",C_SPACE=" ",C_ASTERISK="*",C_UNDERSCORE="_",C_DASH="-",THEMATIC_BREAK_MARKER_COUNT=3;

},{}],181:[function(require,module,exports){
"use strict";function url(O,e,t){var T,r,C,_,i,L,P,l,n,R,o,a,c=this;if(c.options.gfm){for(T="",_=-1,l=PROTOCOLS_LENGTH;++_<l;)if(L=PROTOCOLS[_],(P=e.slice(0,L.length)).toLowerCase()===L){T=P;break}if(T){for(_=T.length,l=e.length,n="",R=0;_<l&&(C=e.charAt(_),!whitespace(C)&&C!==C_LT)&&("."!==C&&","!==C&&":"!==C&&";"!==C&&'"'!==C&&"'"!==C&&")"!==C&&"]"!==C||(o=e.charAt(_+1))&&!whitespace(o))&&(C!==C_PAREN_OPEN&&C!==C_BRACKET_OPEN||R++,C!==C_PAREN_CLOSE&&C!==C_BRACKET_CLOSE||!(--R<0));)n+=C,_++;if(n){if(T+=n,r=T,L===MAILTO_PROTOCOL){if(-1===(i=n.indexOf(C_AT_SIGN))||i===l-1)return;r=r.substr(MAILTO_PROTOCOL.length)}return!!t||(a=c.enterLink(),r=c.tokenizeInline(r,O.now()),a(),O(T)({type:"link",title:null,url:decode(T),children:r}))}}}}var decode=require("parse-entities"),whitespace=require("is-whitespace-character"),locate=require("../locate/url");module.exports=url,url.locator=locate,url.notInLink=!0;var C_BRACKET_OPEN="[",C_BRACKET_CLOSE="]",C_PAREN_OPEN="(",C_PAREN_CLOSE=")",C_LT="<",C_AT_SIGN="@",HTTP_PROTOCOL="http://",HTTPS_PROTOCOL="https://",MAILTO_PROTOCOL="mailto:",PROTOCOLS=[HTTP_PROTOCOL,HTTPS_PROTOCOL,MAILTO_PROTOCOL],PROTOCOLS_LENGTH=PROTOCOLS.length;

},{"../locate/url":153,"is-whitespace-character":51,"parse-entities":113}],182:[function(require,module,exports){
"use strict";function mergeable(n){var t,e;return"text"!==n.type||!n.position||(t=n.position.start,e=n.position.end,t.line!==e.line||e.column-t.column===n.value.length)}function mergeText(n,t){return n.value+=t.value,n}function mergeBlockquote(n,t){return this.options.commonmark?t:(n.children=n.children.concat(t.children),n)}function factory(n){return function(t,e){function r(n){for(var t=-1,e=n.indexOf("\n");-1!==e;)B++,t=e,e=n.indexOf("\n",e+1);-1===t?L+=n.length:L=n.length-t,B in E&&(-1!==t?L+=E[B]:L<=E[B]&&(L=E[B]+1))}function i(){var n=[],t=B+1;return function(){for(var e=B+1;t<e;)n.push((E[t]||0)+1),t++;return n}}function o(){var n={line:B,column:L};return n.offset=d.toOffset(n),n}function l(n){this.start=n,this.end=o()}function u(n){t.substring(0,n.length)!==n&&d.file.fail(new Error("Incorrectly eaten value: please report this warning on http://git.io/vg5Ft"),o())}function c(){var n=o();return function(t,e){var r=t.position,i=r?r.start:n,o=[],u=r&&r.end.line,c=n.line;if(t.position=new l(i),r&&e&&r.indent){if(o=r.indent,u<c){for(;++u<c;)o.push((E[u]||0)+1);o.push(n.column)}e=o.concat(e)}return t.position.indent=e||[],t}}function f(n,t){var e=t?t.children:y,r=e[e.length-1];return r&&n.type===r.type&&n.type in MERGEABLE_NODES&&mergeable(r)&&mergeable(n)&&(n=MERGEABLE_NODES[n.type].call(d,r,n)),n!==r&&e.push(n),d.atStart&&0!==y.length&&d.exitStart(),n}function a(n){function e(n,t){return p(f(p(n),t),s)}function l(){var r=e.apply(null,arguments);return B=h.line,L=h.column,t=n+t,r}function a(){var e=p({});return B=h.line,L=h.column,t=n+t,e.position}var s=i(),p=c(),h=o();return u(n),e.reset=l,l.test=a,e.test=a,t=t.substring(n.length),r(n),s=s(),e}var s,p,h,g,m,v,d=this,E=d.offset,y=[],k=d[n+"Methods"],x=d[n+"Tokenizers"],B=e.line,L=e.column;if(!t)return y;for(a.now=o,a.file=d.file,r("");t;){for(s=-1,p=k.length,m=!1;++s<p&&(g=k[s],!(h=x[g])||h.onlyAtStart&&!d.atStart||h.notInList&&d.inList||h.notInBlock&&d.inBlock||h.notInLink&&d.inLink||(v=t.length,h.apply(d,[a,t]),!(m=v!==t.length))););m||d.file.fail(new Error("Infinite loop"),a.now())}return d.eof=o(),y}}module.exports=factory;var MERGEABLE_NODES={text:mergeText,blockquote:mergeBlockquote};

},{}],183:[function(require,module,exports){
"use strict";function factory(r,e){return function(n){for(var t,i=0,u=n.indexOf("\\"),c=r[e],f=[];-1!==u;)f.push(n.slice(i,u)),i=u+1,(t=n.charAt(i))&&-1!==c.indexOf(t)||f.push("\\"),u=n.indexOf("\\",i);return f.push(n.slice(i)),f.join("")}}module.exports=factory;

},{}],184:[function(require,module,exports){
"use strict";function indentation(t){for(var r,a=0,n=0,c=t.charAt(a),e={};c in characters;)n+=r=characters[c],r>1&&(n=Math.floor(n/r)*r),e[n]=a,c=t.charAt(++a);return{indent:n,stops:e}}module.exports=indentation;var characters={" ":1,"\t":4};

},{}],185:[function(require,module,exports){
"use strict";var attributeName="[a-zA-Z_:][a-zA-Z0-9:._-]*",unquoted="[^\"'=<>`\\u0000-\\u0020]+",singleQuoted="'[^']*'",doubleQuoted='"[^"]*"',attributeValue="(?:"+unquoted+"|"+singleQuoted+"|"+doubleQuoted+")",attribute="(?:\\s+"+attributeName+"(?:\\s*=\\s*"+attributeValue+")?)",openTag="<[A-Za-z][A-Za-z0-9\\-]*"+attribute+"*\\s*\\/?>",closeTag="<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>",comment="\x3c!----\x3e|\x3c!--(?:-?[^>-])(?:-?[^-])*--\x3e",processing="<[?].*?[?]>",declaration="<![A-Za-z]+\\s+[^>]*>",cdata="<!\\[CDATA\\[[\\s\\S]*?\\]\\]>";exports.openCloseTag=new RegExp("^(?:"+openTag+"|"+closeTag+")"),exports.tag=new RegExp("^(?:"+openTag+"|"+closeTag+"|"+comment+"|"+processing+"|"+declaration+"|"+cdata+")");

},{}],186:[function(require,module,exports){
"use strict";function interrupt(r,t,e,n){for(var o,i,p,u,a,f,c=["pedantic","commonmark"],l=c.length,m=r.length,s=-1;++s<m;){for(i=(o=r[s])[1]||{},p=o[0],u=-1,f=!1;++u<l;)if(a=c[u],void 0!==i[a]&&i[a]!==e.options[a]){f=!0;break}if(!f&&t[p].apply(e,n))return!0}return!1}module.exports=interrupt;

},{}],187:[function(require,module,exports){
"use strict";function normalize(e){return collapseWhiteSpace(e).toLowerCase()}var collapseWhiteSpace=require("collapse-white-space");module.exports=normalize;

},{"collapse-white-space":11}],188:[function(require,module,exports){
"use strict";function indentation(t,e){var n,i,r,o,a=t.split(C_NEWLINE),d=a.length+1,s=1/0,f=[];for(a.unshift(repeat(C_SPACE,e)+"!");d--;)if(i=getIndent(a[d]),f[d]=i.stops,0!==trim(a[d]).length){if(!i.indent){s=1/0;break}i.indent>0&&i.indent<s&&(s=i.indent)}if(s!==1/0)for(d=a.length;d--;){for(r=f[d],n=s;n&&!(n in r);)n--;o=0!==trim(a[d]).length&&s&&n!==s?C_TAB:"",a[d]=o+a[d].slice(n in r?r[n]+1:0)}return a.shift(),a.join(C_NEWLINE)}var trim=require("trim"),repeat=require("repeat-string"),getIndent=require("./get-indentation");module.exports=indentation;var C_SPACE=" ",C_NEWLINE="\n",C_TAB="\t";

},{"./get-indentation":184,"repeat-string":190,"trim":207}],189:[function(require,module,exports){
"use strict";function remark2rehype(t,r){return t&&!t.process&&(r=t,t=null),t?bridge(t,r):mutate(r)}function bridge(t,r){return function(e,n,u){t.run(mdast2hast(e,r),n,function(t){u(t)})}}function mutate(t){return function(r){return mdast2hast(r,t)}}var mdast2hast=require("mdast-util-to-hast");module.exports=remark2rehype;

},{"mdast-util-to-hast":81}],190:[function(require,module,exports){
"use strict";function repeat(e,r){if("string"!=typeof e)throw new TypeError("expected a string");if(1===r)return e;if(2===r)return e+e;var t=e.length*r;if(cache!==e||void 0===cache)cache=e,res="";else if(res.length>=t)return res.substr(0,t);for(;t>res.length&&r>1;)1&r&&(res+=e),r>>=1,e+=e;return res+=e,res=res.substr(0,t)}var res="",cache;module.exports=repeat;

},{}],191:[function(require,module,exports){
"use strict";function replaceExt(e,t){if("string"!=typeof e)return e;if(0===e.length)return e;var r=path.basename(e,path.extname(e))+t;return path.join(path.dirname(e),r)}var path=require("path");module.exports=replaceExt;

},{"path":114}],192:[function(require,module,exports){
"use strict";function parse(r){var t=trim(String(r||empty));return t===empty?[]:t.split(whiteSpace)}function stringify(r){return trim(r.join(space))}var trim=require("trim");exports.parse=parse,exports.stringify=stringify;var empty="",space=" ",whiteSpace=/[ \t\n\r\f]+/g;

},{"trim":207}],193:[function(require,module,exports){
"use strict";function factory(t,r,n){return function(){var o=n||this,u=o[t];return o[t]=!r,function(){o[t]=u}}}module.exports=factory;

},{}],194:[function(require,module,exports){
module.exports=[
  "cent",
  "copy",
  "divide",
  "gt",
  "lt",
  "not",
  "para",
  "times"
]

},{}],195:[function(require,module,exports){
"use strict";function encode(e,r){var n=r||{},t=n.subset,a=t?toExpression(t):EXPRESSION_ESCAPE,c=n.escapeOnly,o=n.omitOptionalSemicolons;return e=e.replace(a,function(e,r,t){return one(e,t.charAt(r+1),n)}),t||c?e:e.replace(EXPRESSION_SURROGATE_PAIR,function(e,r,n){return toHexReference(1024*(e.charCodeAt(0)-55296)+e.charCodeAt(1)-56320+65536,n.charAt(r+2),o)}).replace(EXPRESSION_BMP,function(e,r,t){return one(e,t.charAt(r+1),n)})}function escape(e){return encode(e,{escapeOnly:!0,useNamedReferences:!0})}function one(e,r,n){var t,a,c=n.useShortestReferences,o=n.omitOptionalSemicolons;return(c||n.useNamedReferences)&&own.call(characters,e)&&(t=toNamed(characters[e],r,o,n.attribute)),!c&&t||(a=toHexReference(e.charCodeAt(0),r,o)),t&&(!c||t.length<a.length)?t:a}function toNamed(e,r,n,t){var a="&"+e;return n&&own.call(legacy,e)&&-1===dangerous.indexOf(e)&&(!t||r&&"="!==r&&!alphanumerical(r))?a:a+";"}function toHexReference(e,r,n){var t="&#x"+e.toString(16).toUpperCase();return n&&r&&!hexadecimal(r)?t:t+";"}function toExpression(e){return new RegExp("["+e.join("")+"]","g")}function construct(){var e,r={};for(e in entities)r[entities[e]]=e;return r}var entities=require("character-entities-html4"),legacy=require("character-entities-legacy"),hexadecimal=require("is-hexadecimal"),alphanumerical=require("is-alphanumerical"),dangerous=require("./dangerous.json");module.exports=encode,encode.escape=escape;var own={}.hasOwnProperty,escapes=['"',"'","<",">","&","`"],characters=construct(),EXPRESSION_ESCAPE=toExpression(escapes),EXPRESSION_SURROGATE_PAIR=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,EXPRESSION_BMP=/[\x01-\t\x0B\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;

},{"./dangerous.json":194,"character-entities-html4":6,"character-entities-legacy":7,"is-alphanumerical":45,"is-hexadecimal":49}],196:[function(require,module,exports){
"use strict";function doRequest(e,t,o){var r=new XMLHttpRequest;if("string"!=typeof e)throw new TypeError("The method must be a string.");if("string"!=typeof t)throw new TypeError("The URL/path must be a string.");if(null!==o&&void 0!==o||(o={}),"object"!==(void 0===o?"undefined":_typeof(o)))throw new TypeError("Options must be an object (or null).");e=e.toUpperCase(),o.headers=o.headers||{};var s;!(!(s=/^([\w-]+:)?\/\/([^\/]+)/.exec(t))||s[2]==location.host)||(o.headers["X-Requested-With"]="XMLHttpRequest"),o.qs&&(t=handleQs(t,o.qs)),o.json&&(o.body=JSON.stringify(o.json),o.headers["content-type"]="application/json"),r.open(e,t,!1);for(var n in o.headers)r.setRequestHeader(n.toLowerCase(),o.headers[n]);r.send(o.body?o.body:null);var i={};return r.getAllResponseHeaders().split("\r\n").forEach(function(e){var t=e.split(":");t.length>1&&(i[t[0].toLowerCase()]=t.slice(1).join(":").trim())}),new Response(r.status,i,r.responseText)}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},Response=require("http-response-object"),handleQs=require("then-request/lib/handle-qs.js");module.exports=doRequest;

},{"http-response-object":41,"then-request/lib/handle-qs.js":198}],197:[function(require,module,exports){
"use strict";function clone(){for(var n={},r=arguments.length,e=0;e<r;e++){var t=arguments[e];for(var u in t)n[u]=t[u]}return n}module.exports=function(n){function r(){return e.apply(null,arguments)}function e(r,e){e=clone(n,e);for(var u=t.length,o=0;o<u;o++)r=t[o].apply(r,[r,e])||r;return r}var t=[];return n=n||{},r.exec=e,r.use=function(){return[].push.apply(t,arguments),r},r.mws=t,r};

},{}],198:[function(require,module,exports){
"use strict";function handleQs(r,s){var i=(r=r.split("?"))[0],e=(r[1]||"").split("#")[0],t=r[1]&&r[1].split("#").length>1?"#"+r[1].split("#")[1]:"",n=parse(e);for(var a in s)n[a]=s[a];return""!==(e=stringify(n))&&(e="?"+e),i+e+t}var parse=require("qs").parse,stringify=require("qs").stringify;module.exports=handleQs;

},{"qs":200}],199:[function(require,module,exports){
"use strict";var replace=String.prototype.replace,percentTwenties=/%20/g;module.exports={default:"RFC3986",formatters:{RFC1738:function(e){return replace.call(e,percentTwenties,"+")},RFC3986:function(e){return e}},RFC1738:"RFC1738",RFC3986:"RFC3986"};

},{}],200:[function(require,module,exports){
"use strict";var stringify=require("./stringify"),parse=require("./parse"),formats=require("./formats");module.exports={formats:formats,parse:parse,stringify:stringify};

},{"./formats":199,"./parse":201,"./stringify":202}],201:[function(require,module,exports){
"use strict";var utils=require("./utils"),has=Object.prototype.hasOwnProperty,defaults={allowDots:!1,allowPrototypes:!1,arrayLimit:20,decoder:utils.decode,delimiter:"&",depth:5,parameterLimit:1e3,plainObjects:!1,strictNullHandling:!1},parseValues=function(e,t){for(var r={},a=t.ignoreQueryPrefix?e.replace(/^\?/,""):e,l=t.parameterLimit===1/0?void 0:t.parameterLimit,i=a.split(t.delimiter,l),o=0;o<i.length;++o){var s,n,c=i[o],d=c.indexOf("]="),p=-1===d?c.indexOf("="):d+1;-1===p?(s=t.decoder(c,defaults.decoder),n=t.strictNullHandling?null:""):(s=t.decoder(c.slice(0,p),defaults.decoder),n=t.decoder(c.slice(p+1),defaults.decoder)),has.call(r,s)?r[s]=[].concat(r[s]).concat(n):r[s]=n}return r},parseObject=function(e,t,r){if(!e.length)return t;var a,l=e.shift();if("[]"===l)a=(a=[]).concat(parseObject(e,t,r));else{a=r.plainObjects?Object.create(null):{};var i="["===l.charAt(0)&&"]"===l.charAt(l.length-1)?l.slice(1,-1):l,o=parseInt(i,10);!isNaN(o)&&l!==i&&String(o)===i&&o>=0&&r.parseArrays&&o<=r.arrayLimit?(a=[])[o]=parseObject(e,t,r):a[i]=parseObject(e,t,r)}return a},parseKeys=function(e,t,r){if(e){var a=r.allowDots?e.replace(/\.([^.[]+)/g,"[$1]"):e,l=/(\[[^[\]]*])/g,i=/(\[[^[\]]*])/.exec(a),o=i?a.slice(0,i.index):a,s=[];if(o){if(!r.plainObjects&&has.call(Object.prototype,o)&&!r.allowPrototypes)return;s.push(o)}for(var n=0;null!==(i=l.exec(a))&&n<r.depth;){if(n+=1,!r.plainObjects&&has.call(Object.prototype,i[1].slice(1,-1))&&!r.allowPrototypes)return;s.push(i[1])}return i&&s.push("["+a.slice(i.index)+"]"),parseObject(s,t,r)}};module.exports=function(e,t){var r=t?utils.assign({},t):{};if(null!==r.decoder&&void 0!==r.decoder&&"function"!=typeof r.decoder)throw new TypeError("Decoder has to be a function.");if(r.ignoreQueryPrefix=!0===r.ignoreQueryPrefix,r.delimiter="string"==typeof r.delimiter||utils.isRegExp(r.delimiter)?r.delimiter:defaults.delimiter,r.depth="number"==typeof r.depth?r.depth:defaults.depth,r.arrayLimit="number"==typeof r.arrayLimit?r.arrayLimit:defaults.arrayLimit,r.parseArrays=!1!==r.parseArrays,r.decoder="function"==typeof r.decoder?r.decoder:defaults.decoder,r.allowDots="boolean"==typeof r.allowDots?r.allowDots:defaults.allowDots,r.plainObjects="boolean"==typeof r.plainObjects?r.plainObjects:defaults.plainObjects,r.allowPrototypes="boolean"==typeof r.allowPrototypes?r.allowPrototypes:defaults.allowPrototypes,r.parameterLimit="number"==typeof r.parameterLimit?r.parameterLimit:defaults.parameterLimit,r.strictNullHandling="boolean"==typeof r.strictNullHandling?r.strictNullHandling:defaults.strictNullHandling,""===e||null===e||void 0===e)return r.plainObjects?Object.create(null):{};for(var a="string"==typeof e?parseValues(e,r):e,l=r.plainObjects?Object.create(null):{},i=Object.keys(a),o=0;o<i.length;++o){var s=i[o],n=parseKeys(s,a[s],r);l=utils.merge(l,n,r)}return utils.compact(l)};

},{"./utils":203}],202:[function(require,module,exports){
"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},utils=require("./utils"),formats=require("./formats"),arrayPrefixGenerators={brackets:function(e){return e+"[]"},indices:function(e,r){return e+"["+r+"]"},repeat:function(e){return e}},toISO=Date.prototype.toISOString,defaults={delimiter:"&",encode:!0,encoder:utils.encode,encodeValuesOnly:!1,serializeDate:function(e){return toISO.call(e)},skipNulls:!1,strictNullHandling:!1},stringify=function e(r,t,o,n,i,a,l,f,s,u,c,d){var y=r;if("function"==typeof l)y=l(t,y);else if(y instanceof Date)y=u(y);else if(null===y){if(n)return a&&!d?a(t,defaults.encoder):t;y=""}if("string"==typeof y||"number"==typeof y||"boolean"==typeof y||utils.isBuffer(y))return a?[c(d?t:a(t,defaults.encoder))+"="+c(a(y,defaults.encoder))]:[c(t)+"="+c(String(y))];var p=[];if(void 0===y)return p;var m;if(Array.isArray(l))m=l;else{var v=Object.keys(y);m=f?v.sort(f):v}for(var b=0;b<m.length;++b){var g=m[b];i&&null===y[g]||(p=Array.isArray(y)?p.concat(e(y[g],o(t,g),o,n,i,a,l,f,s,u,c,d)):p.concat(e(y[g],t+(s?"."+g:"["+g+"]"),o,n,i,a,l,f,s,u,c,d)))}return p};module.exports=function(e,r){var t=e,o=r?utils.assign({},r):{};if(null!==o.encoder&&void 0!==o.encoder&&"function"!=typeof o.encoder)throw new TypeError("Encoder has to be a function.");var n=void 0===o.delimiter?defaults.delimiter:o.delimiter,i="boolean"==typeof o.strictNullHandling?o.strictNullHandling:defaults.strictNullHandling,a="boolean"==typeof o.skipNulls?o.skipNulls:defaults.skipNulls,l="boolean"==typeof o.encode?o.encode:defaults.encode,f="function"==typeof o.encoder?o.encoder:defaults.encoder,s="function"==typeof o.sort?o.sort:null,u=void 0!==o.allowDots&&o.allowDots,c="function"==typeof o.serializeDate?o.serializeDate:defaults.serializeDate,d="boolean"==typeof o.encodeValuesOnly?o.encodeValuesOnly:defaults.encodeValuesOnly;if(void 0===o.format)o.format=formats.default;else if(!Object.prototype.hasOwnProperty.call(formats.formatters,o.format))throw new TypeError("Unknown format option provided.");var y,p,m=formats.formatters[o.format];"function"==typeof o.filter?t=(p=o.filter)("",t):Array.isArray(o.filter)&&(y=p=o.filter);var v=[];if("object"!==(void 0===t?"undefined":_typeof(t))||null===t)return"";var b;b=o.arrayFormat in arrayPrefixGenerators?o.arrayFormat:"indices"in o?o.indices?"indices":"repeat":"indices";var g=arrayPrefixGenerators[b];y||(y=Object.keys(t)),s&&y.sort(s);for(var O=0;O<y.length;++O){var S=y[O];a&&null===t[S]||(v=v.concat(stringify(t[S],S,g,i,a,l?f:null,p,s,u,c,m,d)))}var k=v.join(n),w=!0===o.addQueryPrefix?"?":"";return k.length>0?w+k:""};

},{"./formats":199,"./utils":203}],203:[function(require,module,exports){
"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},has=Object.prototype.hasOwnProperty,hexTable=function(){for(var e=[],r=0;r<256;++r)e.push("%"+((r<16?"0":"")+r.toString(16)).toUpperCase());return e}();exports.arrayToObject=function(e,r){for(var t=r&&r.plainObjects?Object.create(null):{},o=0;o<e.length;++o)void 0!==e[o]&&(t[o]=e[o]);return t},exports.merge=function(e,r,t){if(!r)return e;if("object"!==(void 0===r?"undefined":_typeof(r))){if(Array.isArray(e))e.push(r);else{if("object"!==(void 0===e?"undefined":_typeof(e)))return[e,r];(t.plainObjects||t.allowPrototypes||!has.call(Object.prototype,r))&&(e[r]=!0)}return e}if("object"!==(void 0===e?"undefined":_typeof(e)))return[e].concat(r);var o=e;return Array.isArray(e)&&!Array.isArray(r)&&(o=exports.arrayToObject(e,t)),Array.isArray(e)&&Array.isArray(r)?(r.forEach(function(r,o){has.call(e,o)?e[o]&&"object"===_typeof(e[o])?e[o]=exports.merge(e[o],r,t):e.push(r):e[o]=r}),e):Object.keys(r).reduce(function(e,o){var n=r[o];return has.call(e,o)?e[o]=exports.merge(e[o],n,t):e[o]=n,e},o)},exports.assign=function(e,r){return Object.keys(r).reduce(function(e,t){return e[t]=r[t],e},e)},exports.decode=function(e){try{return decodeURIComponent(e.replace(/\+/g," "))}catch(r){return e}},exports.encode=function(e){if(0===e.length)return e;for(var r="string"==typeof e?e:String(e),t="",o=0;o<r.length;++o){var n=r.charCodeAt(o);45===n||46===n||95===n||126===n||n>=48&&n<=57||n>=65&&n<=90||n>=97&&n<=122?t+=r.charAt(o):n<128?t+=hexTable[n]:n<2048?t+=hexTable[192|n>>6]+hexTable[128|63&n]:n<55296||n>=57344?t+=hexTable[224|n>>12]+hexTable[128|n>>6&63]+hexTable[128|63&n]:(o+=1,n=65536+((1023&n)<<10|1023&r.charCodeAt(o)),t+=hexTable[240|n>>18]+hexTable[128|n>>12&63]+hexTable[128|n>>6&63]+hexTable[128|63&n])}return t},exports.compact=function(e,r){if("object"!==(void 0===e?"undefined":_typeof(e))||null===e)return e;var t=r||[],o=t.indexOf(e);if(-1!==o)return t[o];if(t.push(e),Array.isArray(e)){for(var n=[],c=0;c<e.length;++c)e[c]&&"object"===_typeof(e[c])?n.push(exports.compact(e[c],t)):void 0!==e[c]&&n.push(e[c]);return n}return Object.keys(e).forEach(function(r){e[r]=exports.compact(e[r],t)}),e},exports.isRegExp=function(e){return"[object RegExp]"===Object.prototype.toString.call(e)},exports.isBuffer=function(e){return null!==e&&void 0!==e&&!!(e.constructor&&e.constructor.isBuffer&&e.constructor.isBuffer(e))};

},{}],204:[function(require,module,exports){
"use strict";function toVFile(e){return("string"==typeof e||buffer(e))&&(e={path:String(e)}),vfile(e)}var buffer=require("is-buffer"),vfile=require("vfile");module.exports=toVFile;

},{"is-buffer":46,"vfile":234}],205:[function(require,module,exports){
"use strict";function trimLines(e){return String(e).replace(ws,newline)}module.exports=trimLines;var ws=/[ \t]*\n+[ \t]*/g,newline="\n";

},{}],206:[function(require,module,exports){
"use strict";function trimTrailingLines(i){for(var r=String(i),n=r.length;r.charAt(--n)===line;);return r.slice(0,n+1)}module.exports=trimTrailingLines;var line="\n";

},{}],207:[function(require,module,exports){
"use strict";function trim(r){return r.replace(/^\s*|\s*$/g,"")}exports=module.exports=trim,exports.left=function(r){return r.replace(/^\s*/,"")},exports.right=function(r){return r.replace(/\s*$/,"")};

},{}],208:[function(require,module,exports){
"use strict";function trough(){var n=[],t={};return t.run=function(){function t(e){var o=n[++l],c=slice.call(arguments,0).slice(1),i=r.length,a=-1;if(e)u(e);else{for(;++a<i;)null!==c[a]&&void 0!==c[a]||(c[a]=r[a]);r=c,o?wrap(o,t).apply(null,r):u.apply(null,[null].concat(r))}}var l=-1,r=slice.call(arguments,0,-1),u=arguments[arguments.length-1];if("function"!=typeof u)throw new Error("Expected function as last argument, not "+u);t.apply(null,[null].concat(r))},t.use=function(l){if("function"!=typeof l)throw new Error("Expected `fn` to be a function, not "+l);return n.push(l),t},t}function wrap(n,t){function l(){u||(u=!0,t.apply(null,arguments))}function r(n){l(null,n)}var u;return function(){var t,e=slice.call(arguments,0),o=n.length>e.length;o&&e.push(l);try{t=n.apply(null,e)}catch(n){if(o&&u)throw n;return l(n)}o||(t&&"function"==typeof t.then?t.then(r,l):t instanceof Error?l(t):r(t))}}module.exports=trough;var slice=[].slice;

},{}],209:[function(require,module,exports){
"use strict";module.exports=function(e){return e.replace(/s'(\s|$)/gim,"s’$1")};

},{}],210:[function(require,module,exports){
"use strict";module.exports=function(e){return e.replace(/ 'n' /gim," ’n’ ").replace(/'n'/gim,"’n’").replace(/(\S)'(\S)/gim,"$1’$2").replace(/'(\d0s)/gim,"’$1")};

},{}],211:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(e){return e.replace(/\(c\)/gim,"©").replace(/© *(\d)/gim,"© $1")},module.exports=exports.default;

},{}],212:[function(require,module,exports){
"use strict";module.exports=function(e){return e.replace(/\.{3}/gim,"…")};

},{}],213:[function(require,module,exports){
"use strict";module.exports=function(e){return e.replace(/--/gim,"—").replace(/ — /gim," — ")};

},{}],214:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(e){return e.replace(/(\d)-(\d)/gim,"$1–$2")},module.exports=exports.default;

},{}],215:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(e){return e.replace(/\(r\)/gim,"®")},module.exports=exports.default;

},{}],216:[function(require,module,exports){
"use strict";module.exports=function(e){return e.replace(/ +/gim," ")};

},{}],217:[function(require,module,exports){
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(e){return e.replace(/ *\(tm\)/gim,"™")},module.exports=exports.default;

},{}],218:[function(require,module,exports){
"use strict";function unherit(t){function n(n){return t.apply(this,n)}function e(){return this instanceof e?t.apply(this,arguments):new n(arguments)}var o,r,i;inherits(e,t),inherits(n,e),o=e.prototype;for(r in o)(i=o[r])&&"object"===(void 0===i?"undefined":_typeof(i))&&(o[r]="concat"in i?i.concat():xtend(i));return e}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},xtend=require("xtend"),inherits=require("inherits");module.exports=unherit;

},{"inherits":43,"xtend":237}],219:[function(require,module,exports){
"use strict";function pipelineParse(e,n){n.tree=e.parse(n.file)}function pipelineRun(e,n,r){e.run(n.tree,n.file,function(e,t,i){e?r(e):(n.tree=t,n.file=i,r())})}function pipelineStringify(e,n){n.file.contents=e.stringify(n.tree,n.file)}function unified(){function e(){for(var e=unified(),n=o.length,r=-1;++r<n;)e.use.apply(null,o[r]);return e.data(extend(!0,{},u)),e}function n(){var n,r,t,i;if(f)return e;for(;++l<o.length;)r=(n=o[l])[0],i=null,!1!==(t=n[1])&&(!0===t&&(n[1]=void 0),i=r.apply(e,n.slice(1)),func(i)&&s.use(i));return f=!0,l=1/0,e}function r(e){for(var n,r=o.length,t=-1;++t<r;)if((n=o[t])[0]===e)return n}function t(e,r,t){function i(n,i){s.run(e,vfile(r),function(r,o,s){o=o||e,r?i(r):n?n(o):t(null,o,s)})}if(assertNode(e),n(),!t&&func(r)&&(t=r,r=null),!t)return new Promise(i);i(null,t)}function i(r,t){function i(n,i){var o=vfile(r);pipeline.run(e,{file:o},function(e){e?i(e):n?n(o):t(null,o)})}if(n(),assertParser("process",e.Parser),assertCompiler("process",e.Compiler),!t)return new Promise(i);i(null,t)}var o=[],s=trough(),u={},f=!1,l=-1;return e.data=function(n,r){return string(n)?2===arguments.length?(assertUnfrozen("data",f),u[n]=r,e):own.call(u,n)&&u[n]||null:n?(assertUnfrozen("data",f),u=n,e):u},e.freeze=n,e.attachers=o,e.use=function(n){function t(e){s(e.plugins),e.settings&&(a=extend(a||{},e.settings))}function i(e){if(func(e))l(e);else{if("object"!==(void 0===e?"undefined":_typeof(e)))throw new Error("Expected usable value, not `"+e+"`");"length"in e?l.apply(null,e):t(e)}}function s(e){var n,r;if(null===e||void 0===e);else{if(!("object"===(void 0===e?"undefined":_typeof(e))&&"length"in e))throw new Error("Expected a list of plugins, not `"+e+"`");for(n=e.length,r=-1;++r<n;)i(e[r])}}function l(e,n){var t=r(e);t?(plain(t[1])&&plain(n)&&(n=extend(t[1],n)),t[1]=n):o.push(slice.call(arguments))}var a;if(assertUnfrozen("use",f),null===n||void 0===n);else if(func(n))l.apply(null,arguments);else{if("object"!==(void 0===n?"undefined":_typeof(n)))throw new Error("Expected usable value, not `"+n+"`");"length"in n?s(n):t(n)}return a&&(u.settings=extend(u.settings||{},a)),e},e.parse=function(r){var t,i=vfile(r);return n(),t=e.Parser,assertParser("parse",t),newable(t)?new t(String(i),i).parse():t(String(i),i)},e.stringify=function(r,t){var i,o=vfile(t);return n(),i=e.Compiler,assertCompiler("stringify",i),assertNode(r),newable(i)?new i(r,o).compile():i(r,o)},e.run=t,e.runSync=function(e,n){var r,i=!1;return t(e,n,function(e,n){i=!0,bail(e),r=n}),assertDone("runSync","run",i),r},e.process=i,e.processSync=function(r){var t,o=!1;return n(),assertParser("processSync",e.Parser),assertCompiler("processSync",e.Compiler),t=vfile(r),i(t,function(e){o=!0,bail(e)}),assertDone("processSync","process",o),t},e}function newable(e){return func(e)&&keys(e.prototype)}function keys(e){var n;for(n in e)return!0;return!1}function assertParser(e,n){if(!func(n))throw new Error("Cannot `"+e+"` without `Parser`")}function assertCompiler(e,n){if(!func(n))throw new Error("Cannot `"+e+"` without `Compiler`")}function assertUnfrozen(e,n){if(n)throw new Error("Cannot invoke `"+e+"` on a frozen processor.\nCreate a new processor first, by invoking it: use `processor()` instead of `processor`.")}function assertNode(e){if(!e||!string(e.type))throw new Error("Expected node, got `"+e+"`")}function assertDone(e,n,r){if(!r)throw new Error("`"+e+"` finished async. Use `"+n+"` instead")}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},extend=require("extend"),bail=require("bail"),vfile=require("vfile"),trough=require("trough"),string=require("x-is-string"),func=require("x-is-function"),plain=require("is-plain-obj");module.exports=unified().freeze();var slice=[].slice,own={}.hasOwnProperty,pipeline=trough().use(pipelineParse).use(pipelineRun).use(pipelineStringify);

},{"bail":1,"extend":14,"is-plain-obj":50,"trough":208,"vfile":234,"x-is-function":235,"x-is-string":236}],220:[function(require,module,exports){
"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},assign=require("object-assign");module.exports=function(o,t,r){return null!=r||"object"==(void 0===t?"undefined":_typeof(t))&&!Array.isArray(t)||(r=t,t={}),assign({},t,{type:String(o)},null!=r&&(Array.isArray(r)?{children:r}:{value:String(r)}))};

},{"object-assign":112}],221:[function(require,module,exports){
"use strict";function generated(o){var t=optional(optional(o).position),n=optional(t.start),e=optional(t.end);return!(n.line&&n.column&&e.line&&e.column)}function optional(o){return o&&"object"===(void 0===o?"undefined":_typeof(o))?o:{}}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o};module.exports=generated;

},{}],222:[function(require,module,exports){
"use strict";function noColor(o,n){return stripColor(inspect(o,n))}function inspect(o,n){var t,r,e,i;if(o&&Boolean(o.length)&&"string"!=typeof o){for(i=o.length,e=-1,t=[];++e<i;)t[e]=inspect(o[e]);return t.join("\n")}if(!o||!o.type)return String(o);if(t=[formatNode(o)],r=o.children,i=r&&r.length,e=-1,!i)return t[0];for(n&&"number"!=typeof n||(n="");++e<i;)o=r[e],e===i-1?t.push(formatNesting(n+STOP)+inspect(o,n+"   ")):t.push(formatNesting(n+CONTINUE)+inspect(o,n+CHAR_VERTICAL_LINE+"  "));return t.join("\n")}function formatNesting(o){return dim(o)}function compile(o){var n=[];return o?(n=[[o.line||1,o.column||1].join(":")],"offset"in o&&n.push(String(o.offset||0)),n):null}function stringify(o,n){function t(o){var n=compile(o);n&&(e.push(n[0]),n[1]&&i.push(n[1]))}var r=[],e=[],i=[];return t(o),t(n),0!==e.length&&r.push(e.join("-")),0!==i.length&&r.push(i.join("-")),r.join(", ")}function formatNode(o){var n,t,r=o.type,e=o.position||{},i=stringify(e.start,e.end),l=[];o.children?r+=dim("[")+yellow(o.children.length)+dim("]"):"string"==typeof o.value&&(r+=dim(": ")+green(JSON.stringify(o.value))),i&&(r+=" ("+i+")");for(n in o)t=o[n],-1!==ignore.indexOf(n)||null===t||void 0===t||"object"===(void 0===t?"undefined":_typeof(t))&&isEmpty(t)||l.push("["+n+"="+JSON.stringify(t)+"]");return 0!==l.length&&(r+=" "+l.join("")),r}function stripColor(o){return o.replace(COLOR_EXPRESSION,"")}function ansiColor(o,n){return function(t){return"["+o+"m"+t+"["+n+"m"}}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},isEmpty=require("is-empty"),color=!0;try{color="inspect"in require("util")}catch(o){color=!1}module.exports=color?inspect:noColor,inspect.color=inspect,noColor.color=inspect,inspect.noColor=noColor,noColor.noColor=noColor;var dim=ansiColor(2,22),yellow=ansiColor(33,39),green=ansiColor(32,39),COLOR_EXPRESSION=new RegExp("(?:(?:\\u001b\\[)|\\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\\u001b[A-M]","g"),CHAR_HORIZONTAL_LINE="─",CHAR_VERTICAL_LINE="│",CHAR_SPLIT="└",CHAR_CONTINUE_AND_SPLIT="├",CONTINUE=CHAR_CONTINUE_AND_SPLIT+CHAR_HORIZONTAL_LINE+" ",STOP=CHAR_SPLIT+CHAR_HORIZONTAL_LINE+" ",ignore=["type","value","children","position"];

},{"is-empty":48,"util":232}],223:[function(require,module,exports){
"use strict";function is(t,n,r,o,e){var i=null!==o&&void 0!==o,u=null!==r&&void 0!==r,f=convert(t);if(u&&("number"!=typeof r||r<0||r===1/0))throw new Error("Expected positive finite index or child node");if(i&&(!is(null,o)||!o.children))throw new Error("Expected parent node");if(!n||!n.type||"string"!=typeof n.type)return!1;if(i!==u)throw new Error("Expected both parent and index");return Boolean(f.call(e,n,r,o))}function convert(t){if("string"==typeof t)return typeFactory(t);if(null===t||void 0===t)return ok;if("object"===(void 0===t?"undefined":_typeof(t)))return("length"in t?anyFactory:matchesFactory)(t);if("function"==typeof t)return t;throw new Error("Expected function, string, or object as test")}function convertAll(t){for(var n=[],r=t.length,o=-1;++o<r;)n[o]=convert(t[o]);return n}function matchesFactory(t){return function(n){var r;for(r in t)if(n[r]!==t[r])return!1;return!0}}function anyFactory(t){var n=convertAll(t),r=n.length;return function(){for(var t=-1;++t<r;)if(n[t].apply(this,arguments))return!0;return!1}}function typeFactory(t){return function(n){return Boolean(n&&n.type===t)}}function ok(){return!0}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};module.exports=is;

},{}],224:[function(require,module,exports){
"use strict";function positionFactory(o){return function(t){var n=t&&t.position&&t.position[o]||{};return{line:n.line||null,column:n.column||null,offset:isNaN(n.offset)?null:n.offset}}}var position=exports;position.start=positionFactory("start"),position.end=positionFactory("end");

},{}],225:[function(require,module,exports){
"use strict";function removePosition(i,t){return visit(i,t?hard:soft),i}function hard(i){delete i.position}function soft(i){i.position=void 0}var visit=require("unist-util-visit");module.exports=removePosition;

},{"unist-util-visit":227}],226:[function(require,module,exports){
"use strict";function stringify(o){return o&&"object"===(void 0===o?"undefined":_typeof(o))?own.call(o,"position")||own.call(o,"type")?location(o.position):own.call(o,"start")||own.call(o,"end")?location(o):own.call(o,"line")||own.call(o,"column")?position(o):null:null}function position(o){return o&&"object"===(void 0===o?"undefined":_typeof(o))||(o={}),index(o.line)+":"+index(o.column)}function location(o){return o&&"object"===(void 0===o?"undefined":_typeof(o))||(o={}),position(o.start)+"-"+position(o.end)}function index(o){return o&&"number"==typeof o?o:1}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},own={}.hasOwnProperty;module.exports=stringify;

},{}],227:[function(require,module,exports){
"use strict";function visit(n,t,r,i){function u(n,i,u){var l;return i=i||(u?0:null),t&&n.type!==t||(l=r(n,i,u||null)),n.children&&!1!==l?e(n.children,n):l}function e(n,t){for(var r,e=i?-1:1,l=n.length,o=(i?l:-1)+e;o>-1&&o<l;){if((r=n[o])&&!1===u(r,o,t))return!1;o+=e}return!0}"function"==typeof t&&(i=r,r=t,t=null),u(n)}module.exports=visit;

},{}],228:[function(require,module,exports){
"use strict";function Url(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}function urlParse(t,s,e){if(t&&util.isObject(t)&&t instanceof Url)return t;var h=new Url;return h.parse(t,s,e),h}function urlFormat(t){return util.isString(t)&&(t=urlParse(t)),t instanceof Url?t.format():Url.prototype.format.call(t)}function urlResolve(t,s){return urlParse(t,!1,!0).resolve(s)}function urlResolveObject(t,s){return t?urlParse(t,!1,!0).resolveObject(s):s}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},punycode=require("punycode"),util=require("./util");exports.parse=urlParse,exports.resolve=urlResolve,exports.resolveObject=urlResolveObject,exports.format=urlFormat,exports.Url=Url;var protocolPattern=/^([a-z0-9.+-]+:)/i,portPattern=/:[0-9]*$/,simplePathPattern=/^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,delims=["<",">",'"',"`"," ","\r","\n","\t"],unwise=["{","}","|","\\","^","`"].concat(delims),autoEscape=["'"].concat(unwise),nonHostChars=["%","/","?",";","#"].concat(autoEscape),hostEndingChars=["/","?","#"],hostnameMaxLen=255,hostnamePartPattern=/^[+a-z0-9A-Z_-]{0,63}$/,hostnamePartStart=/^([+a-z0-9A-Z_-]{0,63})(.*)$/,unsafeProtocol={javascript:!0,"javascript:":!0},hostlessProtocol={javascript:!0,"javascript:":!0},slashedProtocol={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0},querystring=require("querystring");Url.prototype.parse=function(t,s,e){if(!util.isString(t))throw new TypeError("Parameter 'url' must be a string, not "+(void 0===t?"undefined":_typeof(t)));var h=t.indexOf("?"),r=-1!==h&&h<t.indexOf("#")?"?":"#",o=t.split(r),a=/\\/g;o[0]=o[0].replace(a,"/");var n=t=o.join(r);if(n=n.trim(),!e&&1===t.split("#").length){var i=simplePathPattern.exec(n);if(i)return this.path=n,this.href=n,this.pathname=i[1],i[2]?(this.search=i[2],this.query=s?querystring.parse(this.search.substr(1)):this.search.substr(1)):s&&(this.search="",this.query={}),this}var l=protocolPattern.exec(n);if(l){var u=(l=l[0]).toLowerCase();this.protocol=u,n=n.substr(l.length)}if(e||l||n.match(/^\/\/[^@\/]+@[^@\/]+/)){var p="//"===n.substr(0,2);!p||l&&hostlessProtocol[l]||(n=n.substr(2),this.slashes=!0)}if(!hostlessProtocol[l]&&(p||l&&!slashedProtocol[l])){for(var c=-1,f=0;f<hostEndingChars.length;f++)-1!==(y=n.indexOf(hostEndingChars[f]))&&(-1===c||y<c)&&(c=y);var m,v;-1!==(v=-1===c?n.lastIndexOf("@"):n.lastIndexOf("@",c))&&(m=n.slice(0,v),n=n.slice(v+1),this.auth=decodeURIComponent(m)),c=-1;for(f=0;f<nonHostChars.length;f++){var y=n.indexOf(nonHostChars[f]);-1!==y&&(-1===c||y<c)&&(c=y)}-1===c&&(c=n.length),this.host=n.slice(0,c),n=n.slice(c),this.parseHost(),this.hostname=this.hostname||"";var g="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1];if(!g)for(var d=this.hostname.split(/\./),f=0,P=d.length;f<P;f++){var b=d[f];if(b&&!b.match(hostnamePartPattern)){for(var q="",O=0,j=b.length;O<j;O++)b.charCodeAt(O)>127?q+="x":q+=b[O];if(!q.match(hostnamePartPattern)){var x=d.slice(0,f),U=d.slice(f+1),C=b.match(hostnamePartStart);C&&(x.push(C[1]),U.unshift(C[2])),U.length&&(n="/"+U.join(".")+n),this.hostname=x.join(".");break}}}this.hostname.length>hostnameMaxLen?this.hostname="":this.hostname=this.hostname.toLowerCase(),g||(this.hostname=punycode.toASCII(this.hostname));var A=this.port?":"+this.port:"",S=this.hostname||"";this.host=S+A,this.href+=this.host,g&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==n[0]&&(n="/"+n))}if(!unsafeProtocol[u])for(var f=0,P=autoEscape.length;f<P;f++){var w=autoEscape[f];if(-1!==n.indexOf(w)){var E=encodeURIComponent(w);E===w&&(E=escape(w)),n=n.split(w).join(E)}}var I=n.indexOf("#");-1!==I&&(this.hash=n.substr(I),n=n.slice(0,I));var R=n.indexOf("?");if(-1!==R?(this.search=n.substr(R),this.query=n.substr(R+1),s&&(this.query=querystring.parse(this.query)),n=n.slice(0,R)):s&&(this.search="",this.query={}),n&&(this.pathname=n),slashedProtocol[u]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){var A=this.pathname||"",k=this.search||"";this.path=A+k}return this.href=this.format(),this},Url.prototype.format=function(){var t=this.auth||"";t&&(t=(t=encodeURIComponent(t)).replace(/%3A/i,":"),t+="@");var s=this.protocol||"",e=this.pathname||"",h=this.hash||"",r=!1,o="";this.host?r=t+this.host:this.hostname&&(r=t+(-1===this.hostname.indexOf(":")?this.hostname:"["+this.hostname+"]"),this.port&&(r+=":"+this.port)),this.query&&util.isObject(this.query)&&Object.keys(this.query).length&&(o=querystring.stringify(this.query));var a=this.search||o&&"?"+o||"";return s&&":"!==s.substr(-1)&&(s+=":"),this.slashes||(!s||slashedProtocol[s])&&!1!==r?(r="//"+(r||""),e&&"/"!==e.charAt(0)&&(e="/"+e)):r||(r=""),h&&"#"!==h.charAt(0)&&(h="#"+h),a&&"?"!==a.charAt(0)&&(a="?"+a),e=e.replace(/[?#]/g,function(t){return encodeURIComponent(t)}),a=a.replace("#","%23"),s+r+e+a+h},Url.prototype.resolve=function(t){return this.resolveObject(urlParse(t,!1,!0)).format()},Url.prototype.resolveObject=function(t){if(util.isString(t)){var s=new Url;s.parse(t,!1,!0),t=s}for(var e=new Url,h=Object.keys(this),r=0;r<h.length;r++){var o=h[r];e[o]=this[o]}if(e.hash=t.hash,""===t.href)return e.href=e.format(),e;if(t.slashes&&!t.protocol){for(var a=Object.keys(t),n=0;n<a.length;n++){var i=a[n];"protocol"!==i&&(e[i]=t[i])}return slashedProtocol[e.protocol]&&e.hostname&&!e.pathname&&(e.path=e.pathname="/"),e.href=e.format(),e}if(t.protocol&&t.protocol!==e.protocol){if(!slashedProtocol[t.protocol]){for(var l=Object.keys(t),u=0;u<l.length;u++){var p=l[u];e[p]=t[p]}return e.href=e.format(),e}if(e.protocol=t.protocol,t.host||hostlessProtocol[t.protocol])e.pathname=t.pathname;else{for(P=(t.pathname||"").split("/");P.length&&!(t.host=P.shift()););t.host||(t.host=""),t.hostname||(t.hostname=""),""!==P[0]&&P.unshift(""),P.length<2&&P.unshift(""),e.pathname=P.join("/")}if(e.search=t.search,e.query=t.query,e.host=t.host||"",e.auth=t.auth,e.hostname=t.hostname||t.host,e.port=t.port,e.pathname||e.search){var c=e.pathname||"",f=e.search||"";e.path=c+f}return e.slashes=e.slashes||t.slashes,e.href=e.format(),e}var m=e.pathname&&"/"===e.pathname.charAt(0),v=t.host||t.pathname&&"/"===t.pathname.charAt(0),y=v||m||e.host&&t.pathname,g=y,d=e.pathname&&e.pathname.split("/")||[],P=t.pathname&&t.pathname.split("/")||[],b=e.protocol&&!slashedProtocol[e.protocol];if(b&&(e.hostname="",e.port=null,e.host&&(""===d[0]?d[0]=e.host:d.unshift(e.host)),e.host="",t.protocol&&(t.hostname=null,t.port=null,t.host&&(""===P[0]?P[0]=t.host:P.unshift(t.host)),t.host=null),y=y&&(""===P[0]||""===d[0])),v)e.host=t.host||""===t.host?t.host:e.host,e.hostname=t.hostname||""===t.hostname?t.hostname:e.hostname,e.search=t.search,e.query=t.query,d=P;else if(P.length)d||(d=[]),d.pop(),d=d.concat(P),e.search=t.search,e.query=t.query;else if(!util.isNullOrUndefined(t.search))return b&&(e.hostname=e.host=d.shift(),(C=!!(e.host&&e.host.indexOf("@")>0)&&e.host.split("@"))&&(e.auth=C.shift(),e.host=e.hostname=C.shift())),e.search=t.search,e.query=t.query,util.isNull(e.pathname)&&util.isNull(e.search)||(e.path=(e.pathname?e.pathname:"")+(e.search?e.search:"")),e.href=e.format(),e;if(!d.length)return e.pathname=null,e.search?e.path="/"+e.search:e.path=null,e.href=e.format(),e;for(var q=d.slice(-1)[0],O=(e.host||t.host||d.length>1)&&("."===q||".."===q)||""===q,j=0,x=d.length;x>=0;x--)"."===(q=d[x])?d.splice(x,1):".."===q?(d.splice(x,1),j++):j&&(d.splice(x,1),j--);if(!y&&!g)for(;j--;j)d.unshift("..");!y||""===d[0]||d[0]&&"/"===d[0].charAt(0)||d.unshift(""),O&&"/"!==d.join("/").substr(-1)&&d.push("");var U=""===d[0]||d[0]&&"/"===d[0].charAt(0);if(b){e.hostname=e.host=U?"":d.length?d.shift():"";var C=!!(e.host&&e.host.indexOf("@")>0)&&e.host.split("@");C&&(e.auth=C.shift(),e.host=e.hostname=C.shift())}return(y=y||e.host&&d.length)&&!U&&d.unshift(""),d.length?e.pathname=d.join("/"):(e.pathname=null,e.path=null),util.isNull(e.pathname)&&util.isNull(e.search)||(e.path=(e.pathname?e.pathname:"")+(e.search?e.search:"")),e.auth=t.auth||e.auth,e.slashes=e.slashes||t.slashes,e.href=e.format(),e},Url.prototype.parseHost=function(){var t=this.host,s=portPattern.exec(t);s&&(":"!==(s=s[0])&&(this.port=s.substr(1)),t=t.substr(0,t.length-s.length)),t&&(this.hostname=t)};

},{"./util":229,"punycode":117,"querystring":120}],229:[function(require,module,exports){
"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};module.exports={isString:function(t){return"string"==typeof t},isObject:function(t){return"object"===(void 0===t?"undefined":_typeof(t))&&null!==t},isNull:function(t){return null===t},isNullOrUndefined:function(t){return null==t}};

},{}],230:[function(require,module,exports){
"use strict";"function"==typeof Object.create?module.exports=function(t,e){t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})}:module.exports=function(t,e){t.super_=e;var o=function(){};o.prototype=e.prototype,t.prototype=new o,t.prototype.constructor=t};

},{}],231:[function(require,module,exports){
"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o};module.exports=function(o){return o&&"object"===(void 0===o?"undefined":_typeof(o))&&"function"==typeof o.copy&&"function"==typeof o.fill&&"function"==typeof o.readUInt8};

},{}],232:[function(require,module,exports){
(function (process,global){
"use strict";function inspect(e,r){var t={seen:[],stylize:stylizeNoColor};return arguments.length>=3&&(t.depth=arguments[2]),arguments.length>=4&&(t.colors=arguments[3]),isBoolean(r)?t.showHidden=r:r&&exports._extend(t,r),isUndefined(t.showHidden)&&(t.showHidden=!1),isUndefined(t.depth)&&(t.depth=2),isUndefined(t.colors)&&(t.colors=!1),isUndefined(t.customInspect)&&(t.customInspect=!0),t.colors&&(t.stylize=stylizeWithColor),formatValue(t,e,t.depth)}function stylizeWithColor(e,r){var t=inspect.styles[r];return t?"["+inspect.colors[t][0]+"m"+e+"["+inspect.colors[t][1]+"m":e}function stylizeNoColor(e,r){return e}function arrayToHash(e){var r={};return e.forEach(function(e,t){r[e]=!0}),r}function formatValue(e,r,t){if(e.customInspect&&r&&isFunction(r.inspect)&&r.inspect!==exports.inspect&&(!r.constructor||r.constructor.prototype!==r)){var n=r.inspect(t,e);return isString(n)||(n=formatValue(e,n,t)),n}var i=formatPrimitive(e,r);if(i)return i;var o=Object.keys(r),s=arrayToHash(o);if(e.showHidden&&(o=Object.getOwnPropertyNames(r)),isError(r)&&(o.indexOf("message")>=0||o.indexOf("description")>=0))return formatError(r);if(0===o.length){if(isFunction(r)){var u=r.name?": "+r.name:"";return e.stylize("[Function"+u+"]","special")}if(isRegExp(r))return e.stylize(RegExp.prototype.toString.call(r),"regexp");if(isDate(r))return e.stylize(Date.prototype.toString.call(r),"date");if(isError(r))return formatError(r)}var c="",l=!1,p=["{","}"];if(isArray(r)&&(l=!0,p=["[","]"]),isFunction(r)&&(c=" [Function"+(r.name?": "+r.name:"")+"]"),isRegExp(r)&&(c=" "+RegExp.prototype.toString.call(r)),isDate(r)&&(c=" "+Date.prototype.toUTCString.call(r)),isError(r)&&(c=" "+formatError(r)),0===o.length&&(!l||0==r.length))return p[0]+c+p[1];if(t<0)return isRegExp(r)?e.stylize(RegExp.prototype.toString.call(r),"regexp"):e.stylize("[Object]","special");e.seen.push(r);var a;return a=l?formatArray(e,r,t,s,o):o.map(function(n){return formatProperty(e,r,t,s,n,l)}),e.seen.pop(),reduceToSingleString(a,c,p)}function formatPrimitive(e,r){if(isUndefined(r))return e.stylize("undefined","undefined");if(isString(r)){var t="'"+JSON.stringify(r).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return e.stylize(t,"string")}return isNumber(r)?e.stylize(""+r,"number"):isBoolean(r)?e.stylize(""+r,"boolean"):isNull(r)?e.stylize("null","null"):void 0}function formatError(e){return"["+Error.prototype.toString.call(e)+"]"}function formatArray(e,r,t,n,i){for(var o=[],s=0,u=r.length;s<u;++s)hasOwnProperty(r,String(s))?o.push(formatProperty(e,r,t,n,String(s),!0)):o.push("");return i.forEach(function(i){i.match(/^\d+$/)||o.push(formatProperty(e,r,t,n,i,!0))}),o}function formatProperty(e,r,t,n,i,o){var s,u,c;if((c=Object.getOwnPropertyDescriptor(r,i)||{value:r[i]}).get?u=c.set?e.stylize("[Getter/Setter]","special"):e.stylize("[Getter]","special"):c.set&&(u=e.stylize("[Setter]","special")),hasOwnProperty(n,i)||(s="["+i+"]"),u||(e.seen.indexOf(c.value)<0?(u=isNull(t)?formatValue(e,c.value,null):formatValue(e,c.value,t-1)).indexOf("\n")>-1&&(u=o?u.split("\n").map(function(e){return"  "+e}).join("\n").substr(2):"\n"+u.split("\n").map(function(e){return"   "+e}).join("\n")):u=e.stylize("[Circular]","special")),isUndefined(s)){if(o&&i.match(/^\d+$/))return u;(s=JSON.stringify(""+i)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(s=s.substr(1,s.length-2),s=e.stylize(s,"name")):(s=s.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),s=e.stylize(s,"string"))}return s+": "+u}function reduceToSingleString(e,r,t){var n=0;return e.reduce(function(e,r){return n++,r.indexOf("\n")>=0&&n++,e+r.replace(/\u001b\[\d\d?m/g,"").length+1},0)>60?t[0]+(""===r?"":r+"\n ")+" "+e.join(",\n  ")+" "+t[1]:t[0]+r+" "+e.join(", ")+" "+t[1]}function isArray(e){return Array.isArray(e)}function isBoolean(e){return"boolean"==typeof e}function isNull(e){return null===e}function isNullOrUndefined(e){return null==e}function isNumber(e){return"number"==typeof e}function isString(e){return"string"==typeof e}function isSymbol(e){return"symbol"===(void 0===e?"undefined":_typeof(e))}function isUndefined(e){return void 0===e}function isRegExp(e){return isObject(e)&&"[object RegExp]"===objectToString(e)}function isObject(e){return"object"===(void 0===e?"undefined":_typeof(e))&&null!==e}function isDate(e){return isObject(e)&&"[object Date]"===objectToString(e)}function isError(e){return isObject(e)&&("[object Error]"===objectToString(e)||e instanceof Error)}function isFunction(e){return"function"==typeof e}function isPrimitive(e){return null===e||"boolean"==typeof e||"number"==typeof e||"string"==typeof e||"symbol"===(void 0===e?"undefined":_typeof(e))||void 0===e}function objectToString(e){return Object.prototype.toString.call(e)}function pad(e){return e<10?"0"+e.toString(10):e.toString(10)}function timestamp(){var e=new Date,r=[pad(e.getHours()),pad(e.getMinutes()),pad(e.getSeconds())].join(":");return[e.getDate(),months[e.getMonth()],r].join(" ")}function hasOwnProperty(e,r){return Object.prototype.hasOwnProperty.call(e,r)}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},formatRegExp=/%[sdj%]/g;exports.format=function(e){if(!isString(e)){for(var r=[],t=0;t<arguments.length;t++)r.push(inspect(arguments[t]));return r.join(" ")}for(var t=1,n=arguments,i=n.length,o=String(e).replace(formatRegExp,function(e){if("%%"===e)return"%";if(t>=i)return e;switch(e){case"%s":return String(n[t++]);case"%d":return Number(n[t++]);case"%j":try{return JSON.stringify(n[t++])}catch(e){return"[Circular]"}default:return e}}),s=n[t];t<i;s=n[++t])isNull(s)||!isObject(s)?o+=" "+s:o+=" "+inspect(s);return o},exports.deprecate=function(e,r){if(isUndefined(global.process))return function(){return exports.deprecate(e,r).apply(this,arguments)};if(!0===process.noDeprecation)return e;var t=!1;return function(){if(!t){if(process.throwDeprecation)throw new Error(r);process.traceDeprecation?console.trace(r):console.error(r),t=!0}return e.apply(this,arguments)}};var debugs={},debugEnviron;exports.debuglog=function(e){if(isUndefined(debugEnviron)&&(debugEnviron=process.env.NODE_DEBUG||""),e=e.toUpperCase(),!debugs[e])if(new RegExp("\\b"+e+"\\b","i").test(debugEnviron)){var r=process.pid;debugs[e]=function(){var t=exports.format.apply(exports,arguments);console.error("%s %d: %s",e,r,t)}}else debugs[e]=function(){};return debugs[e]},exports.inspect=inspect,inspect.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},inspect.styles={special:"cyan",number:"yellow",boolean:"yellow",undefined:"grey",null:"bold",string:"green",date:"magenta",regexp:"red"},exports.isArray=isArray,exports.isBoolean=isBoolean,exports.isNull=isNull,exports.isNullOrUndefined=isNullOrUndefined,exports.isNumber=isNumber,exports.isString=isString,exports.isSymbol=isSymbol,exports.isUndefined=isUndefined,exports.isRegExp=isRegExp,exports.isObject=isObject,exports.isDate=isDate,exports.isError=isError,exports.isFunction=isFunction,exports.isPrimitive=isPrimitive,exports.isBuffer=require("./support/isBuffer");var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];exports.log=function(){console.log("%s - %s",timestamp(),exports.format.apply(exports,arguments))},exports.inherits=require("inherits"),exports._extend=function(e,r){if(!r||!isObject(r))return e;for(var t=Object.keys(r),n=t.length;n--;)e[t[n]]=r[t[n]];return e};

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":231,"_process":115,"inherits":230}],233:[function(require,module,exports){
"use strict";function factory(n){var t=indices(String(n));return{toPosition:offsetToPositionFactory(t),toOffset:positionToOffsetFactory(t)}}function offsetToPositionFactory(n){return function(t){var o=-1,i=n.length;if(t<0)return{};for(;++o<i;)if(n[o]>t)return{line:o+1,column:t-(n[o-1]||0)+1,offset:t};return{}}}function positionToOffsetFactory(n){return function(t){var o=t&&t.line,i=t&&t.column;return!isNaN(o)&&!isNaN(i)&&o-1 in n?(n[o-2]||0)+i-1||0:-1}}function indices(n){for(var t=[],o=n.indexOf("\n");-1!==o;)t.push(o+1),o=n.indexOf("\n",o+1);return t.push(n.length+1),t}module.exports=factory;

},{}],234:[function(require,module,exports){
(function (process){
"use strict";function VFile(t){var e,r,s;if(t){if("string"==typeof t||buffer(t))t={contents:t};else if("message"in t&&"messages"in t)return t}else t={};if(!(this instanceof VFile))return new VFile(t);for(this.data={},this.messages=[],this.history=[],this.cwd=process.cwd(),r=-1,s=order.length;++r<s;)e=order[r],own.call(t,e)&&(this[e]=t[e]);for(e in t)-1===order.indexOf(e)&&(this[e]=t[e])}function toString(t){var e=this.contents||"";return buffer(e)?e.toString(t):String(e)}function message(t,e,r){var s,n,o=this.path,i=stringify(e)||"1:1";return s={start:{line:null,column:null},end:{line:null,column:null}},e&&e.position&&(e=e.position),e&&(e.start?(s=e,e=e.start):s.start=e),n=new VMessage(t.message||t),n.name=(o?o+":":"")+i,n.file=o||"",n.reason=t.message||t,n.line=e?e.line:null,n.column=e?e.column:null,n.location=s,n.ruleId=r||null,n.source=null,n.fatal=!1,t.stack&&(n.stack=t.stack),this.messages.push(n),n}function fail(){var t=this.message.apply(this,arguments);throw t.fatal=!0,t}function info(){var t=this.message.apply(this,arguments);return t.fatal=null,t}function VMessagePrototype(){}function VMessage(t){this.message=t}function assertPart(t,e){if(-1!==t.indexOf(path.sep))throw new Error("`"+e+"` cannot be a path: did not expect `"+path.sep+"`")}function assertNonEmpty(t,e){if(!t)throw new Error("`"+e+"` cannot be empty")}function assertPath(t,e){if(!t)throw new Error("Setting `"+e+"` requires `path` to be set too")}var path=require("path"),replace=require("replace-ext"),stringify=require("unist-util-stringify-position"),buffer=require("is-buffer");module.exports=VFile;var own={}.hasOwnProperty,proto=VFile.prototype;proto.toString=toString,proto.message=message,proto.info=info,proto.fail=fail,proto.warn=message;var order=["history","path","basename","stem","extname","dirname"];Object.defineProperty(proto,"path",{get:function(){return this.history[this.history.length-1]},set:function(t){assertNonEmpty(t,"path"),t!==this.path&&this.history.push(t)}}),Object.defineProperty(proto,"dirname",{get:function(){return"string"==typeof this.path?path.dirname(this.path):void 0},set:function(t){assertPath(this.path,"dirname"),this.path=path.join(t||"",this.basename)}}),Object.defineProperty(proto,"basename",{get:function(){return"string"==typeof this.path?path.basename(this.path):void 0},set:function(t){assertNonEmpty(t,"basename"),assertPart(t,"basename"),this.path=path.join(this.dirname||"",t)}}),Object.defineProperty(proto,"extname",{get:function(){return"string"==typeof this.path?path.extname(this.path):void 0},set:function(t){var e=t||"";if(assertPart(e,"extname"),assertPath(this.path,"extname"),e){if("."!==e.charAt(0))throw new Error("`extname` must start with `.`");if(-1!==e.indexOf(".",1))throw new Error("`extname` cannot contain multiple dots")}this.path=replace(this.path,e)}}),Object.defineProperty(proto,"stem",{get:function(){return"string"==typeof this.path?path.basename(this.path,this.extname):void 0},set:function(t){assertNonEmpty(t,"stem"),assertPart(t,"stem"),this.path=path.join(this.dirname||"",t+(this.extname||""))}}),VMessagePrototype.prototype=Error.prototype,VMessage.prototype=new VMessagePrototype,(proto=VMessage.prototype).file="",proto.name="",proto.reason="",proto.message="",proto.stack="",proto.fatal=null,proto.column=null,proto.line=null;

}).call(this,require('_process'))

},{"_process":115,"is-buffer":46,"path":114,"replace-ext":191,"unist-util-stringify-position":226}],235:[function(require,module,exports){
"use strict";module.exports=function(t){return"[object Function]"===Object.prototype.toString.call(t)};

},{}],236:[function(require,module,exports){
"use strict";function isString(t){return"[object String]"===toString.call(t)}var toString=Object.prototype.toString;module.exports=isString;

},{}],237:[function(require,module,exports){
"use strict";function extend(){for(var r={},e=0;e<arguments.length;e++){var t=arguments[e];for(var n in t)hasOwnProperty.call(t,n)&&(r[n]=t[n])}return r}module.exports=extend;var hasOwnProperty=Object.prototype.hasOwnProperty;

},{}],238:[function(require,module,exports){
"use strict";function all(e,r){for(var n=r&&r.children,o=n&&n.length,l=-1,t=[];++l<o;)t[l]=one(e,n[l],l,r);return t.join("")}var one=require("./one");module.exports=all;

},{"./one":251}],239:[function(require,module,exports){
"use strict";function abbr(r,a){var b=all(r,a),t=a.data.hProperties.title;return r.abbr&&"function"==typeof r.abbr?r.abbr(b,t):"\\abbr{"+b+"}{"+t+"}"}var all=require("../all");module.exports=abbr;

},{"../all":238}],240:[function(require,module,exports){
"use strict";function align(n,e){return(n[e.type]||defaultMacros[e.type]||defaultMacros.defaultType)(all(n,e),e.type)}var all=require("../all");module.exports=align;var defaultMacros={CenterAligned:function(n){return"\n\\begin{center}\n"+n+"\n\\end{center}\n"},RightAligned:function(n){return"\n\\begin{flushright}\n"+n+"\n\\end{flushright}\n"},defaultType:function(n,e){return"\n\\begin{"+e+"}\n"+n+"\n\\end{"+e+"}\n"}};

},{"../all":238}],241:[function(require,module,exports){
"use strict";function customBlock(e,t){return(e[t.type]||defaultMacros[t.type]||defaultMacros.defaultBlock)(all(e,t).trim(),t.type)}var all=require("../all");module.exports=customBlock;var defaultMacros={secretCustomBlock:function(e){return"\\addSecret{"+e+"}\n"},defaultBlock:function(e,t){var r=t.replace("CustomBlock","");return"\\begin{"+(r=r[0].toUpperCase()+r.substring(1))+"}\n"+e+"\n\\end{"+r+"}\n"}};

},{"../all":238}],242:[function(require,module,exports){
"use strict";function emoticon(o,e){var i=e.code;if(o.emoticons&&has(o.emoticons,i))return"\\smiley{"+o.emoticons[i]+"}"}var has=require("has");module.exports=emoticon;

},{"has":17}],243:[function(require,module,exports){
"use strict";function figure(n,e,r,i){var t=e.children[0].type,l=has(n,"figure")&&has(n.figure,t)&&n.figure[t]||has(defaultMacros,t)&&defaultMacros[t],a="";if(e.children.length&&(a=e.children.filter(function(n){return"figcaption"===n.type}).map(function(e){return all(n,e)}).join("")),e.caption=a,!l)return e.children[0].caption=a,one(n,e.children[0],0,e);var c=e.children[0];c.caption=e.caption,e.children=e.children.filter(function(n){return"figcaption"!==n.type}),1===e.children.length&&(e.children=e.children[0].children);var u=has(makeExtra,t)?makeExtra[t](c):void 0;return l((all(n,e)||e.value||"").trim(),a,u)}var all=require("../all"),one=require("../one"),has=require("has");module.exports=figure;var defaultMacros={blockquote:function(n){return"\\begin{Quotation}{"+(arguments.length>1&&void 0!==arguments[1]?arguments[1]:"Anonymous")+"}\n"+n+"\n\\end{Quotation}\n\n"},code:function(n,e,r){var i="["+e+"]";return r.lines&&(i+="["+r.lines+"]"),"\\begin{codeBlock}"+i+"{"+r.language+"}\n"+n+"\n\\end{codeBlock}\n\n"},table:function(n){return n},image:function(n,e,r){return"\\begin{center}\n    \\includegraphics"+(r.width?"["+r.width+"]":"")+"{"+r.url+"}\n\\captionof{"+e+"}\n\\end{center}"}},makeExtra={blockquote:function(n){},code:function(n){var e={language:n.lang.split(" ")[0]};if(n.lang.includes(" ")){var r=n.lang.split(" ")[1];r&&(e.lines=r.replace("hl_lines=","").trim())}return e},image:function(n){return{url:n.url,width:"\\linewidth"}}};

},{"../all":238,"../one":251,"has":17}],244:[function(require,module,exports){
"use strict";function overridenTableCell(e,r){var a=clone(e);a.tableCell=void 0;var l=baseCell(a,r).trim().replace(/\n/g," \\par ");return r.data.hProperties.rowspan>1?l="\\multirow{"+r.data.hProperties.rowspan+"}{*}{"+l+"}":r.data.hProperties.colspan>1&&(l="\\multicolumn{"+r.data.hProperties.colspan+"}{|c|}{"+l+"}"),l}function overridenHeaderParse(e){var r=e.map(function(e){return e.split("&").length}).sort()[0];return("|p{\\linewidth / "+r+"}").repeat(r)+"|"}function gridTable(e,r){var a=clone(e);return a.break=function(){return" \\par"},a.tableCell=overridenTableCell,a.headerParse=overridenHeaderParse,baseTable(a,r)}var baseCell=require("../types/tableCell"),baseTable=require("../types/table"),clone=require("clone");module.exports=gridTable;

},{"../types/table":276,"../types/tableCell":277,"clone":10}],245:[function(require,module,exports){
"use strict";function kbd(e,l){return"\\keys{"+all(e,l)+"}"}var all=require("../all");module.exports=kbd;

},{"../all":238}],246:[function(require,module,exports){
"use strict";function math(a,t,e,r){var n="math";if("inlineMath"===t.type)try{n=t.data.hProperties.className.split(" ").includes("inlineMathDouble")?"inlineMathDouble":"inlineMath"}catch(a){console.error(a,"This rebber math plugin is only compatible with remark-math.")}return(has(a,"math")&&has(a.math,n)&&a.math[n]||has(defaultMacros,n)&&defaultMacros[n])((all(a,t)||t.value||"").trim())}var all=require("../all"),has=require("has");module.exports=math;var defaultMacros={inlineMath:function(a){return"$"+a+"$"},inlineMathDouble:function(a){return"$$"+a+"$$"},math:function(a){return"\\[ "+a+" \\]\n\n"}};

},{"../all":238,"has":17}],247:[function(require,module,exports){
"use strict";function sub(r,t,u,e){return"\\textsubscript{"+all(r,t)+"}"}var all=require("../all");module.exports=sub;

},{"../all":238}],248:[function(require,module,exports){
"use strict";function sup(r,e,t,u){return"\\textsuperscript{"+all(r,e)+"}"}var all=require("../all");module.exports=sup;

},{"../all":238}],249:[function(require,module,exports){
"use strict";function encode(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=xtend(defaultEscapes,t),r=toExpression(Object.keys(n));return e=e.replace(r,function(e,t,r){return one(e,r.charAt(t+1),n)})}function one(e,t,n){return has(n,e)?n[e]:e}function toExpression(e){var t=e.map(escapeRegExp).join("|");return new RegExp("["+t+"]","g")}function escapeRegExp(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}var has=require("has"),xtend=require("xtend");module.exports=encode,encode.escape=escape;var defaultEscapes={"#":"\\#",$:"\\$","%":"\\%","&":"\\&","\\":"\\textbackslash{}","^":"\\textasciicircum{}",_:"\\_","{":"\\{","}":"\\}","~":"\\textasciitilde{}"};

},{"has":17,"xtend":237}],250:[function(require,module,exports){
"use strict";function toLaTeX(e,r,t){return one(r,e,void 0,void 0,t)}function stringify(e){var r=xtend(e,this.data("settings"));this.Compiler=function(e){return preprocess(r,e),toLaTeX(e,r,e)}}var xtend=require("xtend"),one=require("./one"),preprocess=require("./pre-visitors");module.exports=stringify;

},{"./one":251,"./pre-visitors":255,"xtend":237}],251:[function(require,module,exports){
"use strict";function one(e,r,t,n,s){var i=has(e,"override")?e.override:{},a=xtend(handlers,i),l=r&&r.type;if(!l)throw new Error("Expected node, not `"+r+"`");if(!has(a,l))throw new Error("Cannot compile unknown node `"+l+"`");return a[l](e,r,t,n,s)}var has=require("has"),xtend=require("xtend");module.exports=one;var handlers={};handlers.root=require("./all"),handlers.heading=require("./types/heading"),handlers.paragraph=require("./types/paragraph"),handlers.comment=require("./types/comment"),handlers.text=require("./types/text"),handlers.link=require("./types/link"),handlers.list=require("./types/list"),handlers.listItem=require("./types/listItem"),handlers.break=require("./types/break"),handlers.code=require("./types/code"),handlers.strong=require("./types/strong"),handlers.emphasis=require("./types/emphasis"),handlers.delete=require("./types/delete"),handlers.inlineCode=require("./types/inlinecode"),handlers.blockquote=require("./types/blockquote"),handlers.tableCell=require("./types/tableCell"),handlers.tableRow=require("./types/tableRow"),handlers.table=require("./types/table"),handlers.thematicBreak=require("./types/thematic-break"),handlers.footnote=require("./types/footnote"),handlers.footnoteDefinition=require("./types/footnoteDefinition"),handlers.footnoteReference=require("./types/footnoteReference"),handlers.linkReference=require("./types/linkReference"),handlers.definition=require("./types/definition"),handlers.tableHeader=require("./types/tableHeader"),handlers.image=require("./types/image");

},{"./all":238,"./types/blockquote":257,"./types/break":258,"./types/code":259,"./types/comment":260,"./types/definition":261,"./types/delete":262,"./types/emphasis":263,"./types/footnote":264,"./types/footnoteDefinition":265,"./types/footnoteReference":266,"./types/heading":267,"./types/image":268,"./types/inlinecode":269,"./types/link":270,"./types/linkReference":271,"./types/list":272,"./types/listItem":273,"./types/paragraph":274,"./types/strong":275,"./types/table":276,"./types/tableCell":277,"./types/tableHeader":278,"./types/tableRow":279,"./types/text":280,"./types/thematic-break":281,"has":17,"xtend":237}],252:[function(require,module,exports){
"use strict";function plugin(e,i){var t=e.codeAppendiceTitle||"Appendices";return{codeInTableVisitor:appendiceVisitorFactory({title:t,root:i})}}var visit=require("unist-util-visit");module.exports=plugin;var appendiceVisitorFactory=function(e){var i=e.title,t=e.root;return function(e){var n=[],r=1;visit(e,"code",function(e,i,t){n.push({type:"paragraph",children:[{type:"definition",identifier:"appendix-"+r,referenceType:"full",children:[{type:"text",value:"code"}]},{type:"text",value:"\n"},e]});var p={type:"linkReference",identifier:"appendix-"+r};t.children.splice(i,1,p),r++}),n.length&&(t.children.push({type:"heading",depth:1,children:[{type:"text",value:i}]}),n.forEach(function(e){return t.children.push(e)}))}};

},{"unist-util-visit":227}],253:[function(require,module,exports){
"use strict";function plugin(){arguments.length>0&&void 0!==arguments[0]&&arguments[0];return function n(t,e,i){"footnote"===t.type&&!0!==t.inHeading&&annotate(t),t.children&&t.children.map(function(e,i){return n(e,i,t)})}}function annotate(n){n.inHeading=!0}module.exports=plugin;

},{}],254:[function(require,module,exports){
"use strict";module.exports=function(e,r,i){var t={type:"link",url:e.data.hProperties.src,children:[{type:"text",value:e.data.hProperties.src}]},l={type:"image",url:e.data.thumbnail};if("figure"!==i.type){var n={type:"figure",children:[l,{type:"figcaption",children:[t]}]};i.children[r]=n}else i.children[r]=l,i.children[i.children.length-1].children.push(t)};

},{}],255:[function(require,module,exports){
"use strict";function preVisit(e,i){var r={tableCell:[codePlugin(e,i).codeInTableVisitor],definition:[referencePlugin(e).definitionVisitor],imageReference:[referencePlugin(e).imageReferenceVisitor],heading:[headingPlugin(e)],iframe:[iframePlugin]},n=xtend(r,e.preprocessors||{});Object.keys(n).forEach(function(e){Array.isArray(n[e])&&n[e].forEach(function(r){return visit(i,e,r)})})}var xtend=require("xtend"),visit=require("unist-util-visit"),codePlugin=require("./codeVisitor"),headingPlugin=require("./headingVisitor"),iframePlugin=require("./iframes"),referencePlugin=require("./referenceVisitor");module.exports=preVisit;

},{"./codeVisitor":252,"./headingVisitor":253,"./iframes":254,"./referenceVisitor":256,"unist-util-visit":227,"xtend":237}],256:[function(require,module,exports){
"use strict";function plugin(){arguments.length>0&&void 0!==arguments[0]&&arguments[0];return{definitionVisitor:definitionVisitor,imageReferenceVisitor:imageReferenceVisitor}}function definitionVisitor(i,e,t){for(var n=i.identifier;Object.keys(identifiers).includes(n);)n+="-1";identifiers[n]=i.url,i.identifier=n,"shortcut"===i.referenceType&&t.children.splice(e,1)}function imageReferenceVisitor(i){i.type="image",i.title="",i.url=identifiers[i.identifier]}module.exports=plugin;var identifiers={};

},{}],257:[function(require,module,exports){
"use strict";function blockquote(t,o){return(t.blockquote||defaultMacro)(all(t,o).trim())}var all=require("../all");module.exports=blockquote;var defaultMacro=function(t){return"\\begin{Quotation}\n"+t+"\n\\end{Quotation}\n\n"};

},{"../all":238}],258:[function(require,module,exports){
"use strict";function br(r,e){return(r.break?r.break:defaultMacro)(e)}module.exports=br;var defaultMacro=function(){return" \\\\\n"};

},{}],259:[function(require,module,exports){
"use strict";function code(e,n){return(e.code||defaultMacro)(n.value,n.lang)}module.exports=code;var defaultMacro=function(e,n){var l="";return n.indexOf("hl_lines=")>-1&&(l+="[]["+n.split("hl_lines=")[1].trim()+"]"),n=n.split(" ")[0],"\\begin{codeBlock}"+l+"{"+n+"}\n"+e+"\n\\end{codeBlock}\n\n"};

},{}],260:[function(require,module,exports){
"use strict";function comment(n,e){return"\\begin{comment}\n"+e.value+"\n\\end{comment}\n"}module.exports=comment;

},{}],261:[function(require,module,exports){
"use strict";function definition(e,i){return(e.definition?e.definition:defaultMacro)(e,i.identifier,i.url,i.title)}var all=require("../all");module.exports=definition;var defaultMacro=function(e,i,t,l){return"\\footnote{\\label{"+i+"}"+all(e,{children:[{type:"link",title:l,url:t,children:[{type:"text",value:t}]}]})+"}"};

},{"../all":238}],262:[function(require,module,exports){
"use strict";function deleteNode(e,l,t,r){return"\\sout{"+all(e,l)+"}"}var all=require("../all");module.exports=deleteNode;

},{"../all":238}],263:[function(require,module,exports){
"use strict";function emphasis(e,t,l,r){return"\\textit{"+all(e,t)+"}"}var all=require("../all");module.exports=emphasis;

},{"../all":238}],264:[function(require,module,exports){
"use strict";function notes(t,o,e,r){var n=t.footnote||defaultMacro,a=!!o.inHeading;return n(all(t,o),a)}var all=require("../all");module.exports=notes;var defaultMacro=function(t,o){return o?"\\protect\\footnote{"+t+"}":"\\footnote{"+t+"}"};

},{"../all":238}],265:[function(require,module,exports){
"use strict";function notes(t,e){return(t.footnoteDefinition||defaultMacro)(e.identifier,all(t,e).trim())}var all=require("../all");module.exports=notes;var defaultMacro=function(t,e){return"\\footnote{\\label{"+t+"}"+e+"}\n"};

},{"../all":238}],266:[function(require,module,exports){
"use strict";function notes(e,t){return(e.footnoteReference||defaultMacro)(t.identifier)}module.exports=notes;var defaultMacro=function(e){return"\\ref{"+e+"}"};

},{}],267:[function(require,module,exports){
"use strict";function heading(n,t){var r=t.depth,e=all(n,t),u=(n.heading||defaultHeadings)[t.depth];if("function"!=typeof u)throw new Error("Cannot compile heading of depth "+r+": not a function");return u(e)}var all=require("../all");module.exports=heading;var defaultHeadings=[function(n){return"\\part{"+n+"}\n"},function(n){return"\\chapter{"+n+"}\n"},function(n){return"\\section{"+n+"}\n"},function(n){return"\\subsection{"+n+"}\n"},function(n){return"\\subsubsection{"+n+"}\n"},function(n){return"\\paragraph{"+n+"}\n"},function(n){return"\\subparagaph{"+n+"}\n"}];

},{"../all":238}],268:[function(require,module,exports){
"use strict";function image(e,i,n,a){var r=e.image?e.image:defaultMacro;return"paragraph"===a.type&&a.children.length-1&&(r=e.inlineImage?e.inlineImage:defaultInline),r(i)}module.exports=image;var defaultInline=function(e){return"\\inlineImage{"+e.url+"}"},defaultMacro=function(e){return"\\includeGraphics"+(e.width?"[width="+e.width+"]":"")+"{"+e.url+"}"};

},{}],269:[function(require,module,exports){
"use strict";function inlineCode(e,t){return"\\texttt{"+escape(t.value)+"}"}module.exports=inlineCode;var escape=require("../escaper");

},{"../escaper":249}],270:[function(require,module,exports){
"use strict";function link(r,e){if(!e.url)return"";var a=r.link||{},l=has(a,"macro")?a.macro:defaultMacro,t=has(a,"prefix")?a.prefix:"",u=escape(e.url.startsWith("/")?t+e.url:e.url);return l(all(r,e),u,e.title)}var has=require("has"),all=require("../all"),escape=require("../escaper");module.exports=link;var defaultMacro=function(r,e,a){return"\\externalLink{"+r+"}{"+e+"}"};

},{"../all":238,"../escaper":249,"has":17}],271:[function(require,module,exports){
"use strict";function linkReference(e,r){var n=e.linkReference?e.linkReference:defaultMacro,l=all(e,r);return n(r.identifier,l)}var all=require("../all");module.exports=linkReference;var defaultMacro=function(e,r){return r+"\\ref{"+e+"}"};

},{"../all":238}],272:[function(require,module,exports){
"use strict";function list(e,r){return(has(e,"list")?e.list:defaultMacro)(all(e,r),r.ordered)}var all=require("../all"),has=require("has");module.exports=list;var defaultMacro=function(e,r){return r?"\\begin{enumerate}\n"+e+"\\end{enumerate}\n":"\\begin{itemize}\n"+e+"\\end{itemize}\n"};

},{"../all":238,"has":17}],273:[function(require,module,exports){
"use strict";function listItem(t,e){return(has(t,"listItem")?t.listItem:defaultMacro)(all(t,e).trim())}module.exports=listItem;var all=require("../all"),has=require("has"),defaultMacro=function(t){return"\\item "+t+"\n"};

},{"../all":238,"has":17}],274:[function(require,module,exports){
"use strict";function paragraph(r,a){return all(r,a).trim()+"\n\n"}var all=require("../all");module.exports=paragraph;

},{"../all":238}],275:[function(require,module,exports){
"use strict";function strong(r,t,e,l){return"\\textbf{"+all(r,t)+"}"}var all=require("../all");module.exports=strong;

},{"../all":238}],276:[function(require,module,exports){
"use strict";function table(e,n){return(e.table||defaultMacro)(e,n)}function cmp(e,n){return e<n?1:e>n?-1:0}var one=require("../one");module.exports=table;var defaultHeaderParse=function(e){var n=e.map(function(e){return e.split("&").length}).sort(cmp)[0],r="|";return r+="c|".repeat(n)},defaultMacro=function(e,n){var r=e.headerParse?e.headerParse:defaultHeaderParse,t=n.children.map(function(r,t){return one(e,r,t,n)}),a=t.join(""),u=r(t),o="";return n.caption&&(o="\n\\tableCaption{"+n.caption+"}\n"),"\\begin{longtabu}{"+u+"} \\hline\n"+a+o+"\\end{longtabu}\n\n"};

},{"../one":251}],277:[function(require,module,exports){
"use strict";function tableCell(l,e){return(l.tableCell||defaultMacro)(l,e)}var all=require("../all");module.exports=tableCell;var defaultMacro=function(l,e){return all(l,e)};

},{"../all":238}],278:[function(require,module,exports){
"use strict";var all=require("../all");module.exports=function(e,l){return(e.tableHeader?e.tableHeader:all)(e,l)};

},{"../all":238}],279:[function(require,module,exports){
"use strict";function tableRow(e,n){return(e.tableRow||defaultMacro)(e,n)}var one=require("../one");module.exports=tableRow;var defaultMacro=function(e,n){var r=[];return n.children.map(function(o,t){return r.push(one(e,o,t,n))}),r.join(" & ")+" \\\\ \\hline\n"};

},{"../one":251}],280:[function(require,module,exports){
"use strict";function text(e,t,r,a){var s=t.value;return isLiteral(a)?s:escaper(s,e.escapes)}function isLiteral(e){return e&&("script"===e.tagName||"style"===e.tagName)}var escaper=require("../escaper");module.exports=text;

},{"../escaper":249}],281:[function(require,module,exports){
"use strict";function thematicBreak(t,e,r,a){return(t.thematicBreak||"\\horizontalLine")+"\n\n"}module.exports=thematicBreak;

},{}],282:[function(require,module,exports){
"use strict";function plugin(){function i(i,t,s){if("a"===i.tagName&&i.properties.className&&i.properties.className.includes("footnote-backref")){var r=s.properties.id.slice(3),n=e.indexOf("$id"),o=void 0;-1!==n&&((o=e.split("")).splice(n,3,r),o=o.join("")),o||(o=r),i.properties.title=o}}var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return function(e){visit(e,"element",i)}}var visit=require("unist-util-visit");module.exports=plugin;

},{"unist-util-visit":227}],283:[function(require,module,exports){
"use strict";function plugin(){return transformer}function transformer(t){visit(t,"raw",visitor)}function visitor(t,e,i){var r=void 0;i&&(r=inline.includes(i.tagName)?{type:"text",value:t.value}:{type:"element",tagName:"p",properties:{},children:[{type:"text",value:t.value}]},i.children[e]=r)}var visit=require("unist-util-visit"),inline=["a","b","big","i","small","tt","abbr","acronym","cite","code","dfn","em","kbd","strong","samp","time","var","bdo","br","img","map","object","p","q","script","span","sub","sup","button","input","label","select","textarea"];module.exports=plugin;

},{"unist-util-visit":227}],284:[function(require,module,exports){
"use strict";function plugin(){function e(e,r,t){var i=new RegExp(/[*]\[([^\]]*)\]:\s*(.+)\n*/).exec(r);return t||(i&&0===i.index?e(i[0])({type:"abbr",abbr:i[1],children:[{type:"text",value:i[1]}],data:{hName:"abbr",hProperties:{title:i[2]}}}):void 0)}function r(e){return function(r,t,i){for(var n=0;n<r.children.length;n++){var l=r.children[n];"abbr"===l.type&&(e[l.abbr]=l,r.children.splice(n,1),n-=1)}0===r.children.length&&i.children.splice(t,1)}}function t(e){var r=Object.keys(e).map(function(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}).join("|"),t=new RegExp("\\b("+r+")\\b");return function(r,i,n){if(0!==Object.keys(e).length&&r.children)for(var l=0;l<r.children.length;l++){var a=r.children[l];if("abbr"!==r.type&&"text"===a.type&&t.test(a.value)){var c=a.value.split(t);r.children.splice(l,1);for(var p=0;p<c.length;p++){var o=c[p];e.hasOwnProperty(o)?r.children.splice(l+p,0,e[o]):r.children.splice(l+p,0,{type:"text",value:o})}}}}}e.locator=function(e,r){return e.indexOf("*[",r)};var i=this.Parser,n=i.prototype.inlineTokenizers,l=i.prototype.inlineMethods;return n.abbr=e,l.splice(0,0,"abbr"),function(e){var i={};visit(e,"paragraph",r(i)),visit(e,t(i))}}var visit=require("unist-util-visit");module.exports=plugin;

},{"unist-util-visit":227}],285:[function(require,module,exports){
"use strict";var C_NEWLINE="\n",C_NEWPARAGRAPH="\n\n";module.exports=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=new RegExp("[^\\\\]?->"),i=["->","<-"],t=this.Parser,r=t.prototype.blockTokenizers,l=t.prototype.blockMethods;r.align_blocks=function(t,r,l){var s=t.now(),o=n.exec(r);if(o&&0===o.index){if(l)return!0;for(var h=0,g=[],c=[],a="",d=!0,f=0;d;){var p=r.indexOf(C_NEWLINE,h+1),u=-1!==p?r.slice(h,p):r.slice(h),v=u.length>2&&"\\"===u[u.length-3];if(g.push(u),!v&&(p>f+2||-1===p)&&u.length>=2&&-1!==i.indexOf(u.slice(-2))){if(""===a&&(a=u.slice(-2)),c.push(g.join(C_NEWLINE)),r.indexOf("->",p)!==p+1)break;g=[],f=p+1}h=p+1,d=-1!==p}if(0!==c.length){for(var E="",N=c[0].substring(c[0].length-2,c[0].length),k=[],b=0;b<c.length;++b){var x=c[b];if(N!==x.substring(x.length-2,x.length))break;k.push(x),E+=x.slice(2,-2)+C_NEWPARAGRAPH}var A=t(k.join(C_NEWLINE)),C=this.enterBlock(),_=this.tokenizeBlock(E,s);C();var P="->"===a?"RightAligned":"CenterAligned",R=e.right?e.right:"align-right",W=e.center?e.center:"align-center";return A({type:P,children:_,data:{hName:"div",hProperties:{class:"->"===a?R:W}}})}}},l.splice(l.indexOf("fencedCode")+1,0,"align_blocks")};

},{}],286:[function(require,module,exports){
"use strict";function plugin(e){var t=xtend(legendBlock,e&&e.external||{}),i=xtend(internLegendBlock,e&&e.internal||{});return function(e){Object.keys(i).forEach(function(t){return visit(e,t,internLegendVisitor(i))}),Object.keys(t).forEach(function(i){return visit(e,i,externLegendVisitorCreator(t))})}}function internLegendVisitor(e){return function(t,i,n){if(!n||"figure"!==n.type){var r=t.children?getLast(t.children):n;if(!(!r||t.children&&"paragraph"!==r.type||!t.children&&"paragraph"!==n.type)){var l=-1;if(r.children.forEach(function(i,n){"text"===i.type&&(i.value.startsWith(e[t.type])||i.value.includes("\n"+e[t.type]))&&(l=n)}),!(-1===l||!t.children&&l<i)){var a=r.children[l].value.split("\n"),c=-1;a.forEach(function(i,n){i.startsWith(e[t.type])&&(c=n)});var u=clone(r.children[l]),d=a.slice(0,c).join("\n");r.children[l].value=d;var p=a.slice(c).join("\n").slice(e[t.type].length).trimLeft();u.value=p,r.children.splice(l+1,0,u);var h=r.children.slice(l+1);r.children=r.children.slice(0,l+1);var o={type:"figcaption",children:h,data:{hName:"figcaption"}},s={type:"figure",children:[clone(t),o],data:{hName:"figure"}};t.type=s.type,t.children=s.children,t.data=s.data}}}}}function externLegendVisitorCreator(e){return function(t,i,n){if(!(i>=n.children.length-1)&&"paragraph"===n.children[i+1].type){var r=n.children[i+1],l=r.children[0];if("text"===l.type&&l.value.startsWith(e[t.type])){var a=[],c=[],u=l.value.replace(e[t.type],"").split("\n")[0];l.value.includes("\n")&&c.push({type:"text",value:l.value.replace(e[t.type],"").split("\n")[1]}),a.push({type:"text",value:u.trimLeft()}),r.children.forEach(function(e,t){if(0!==t)if("text"===e.type){var i=e.value.split("\n")[0];e.value.includes("\n")&&(e.value=e.value.split("\n")[1],c.push(e)),a.push({type:"text",value:i})}else a.push(clone(e))});var d={type:"figcaption",children:a,data:{hName:"figcaption"}},p={type:"figure",children:[clone(t),d],data:{hName:"figure"}};t.type=p.type,t.children=p.children,t.data=p.data,c.length?n.children.splice(i+1,1,{type:"paragraph",children:c}):n.children.splice(i+1,1)}}}}function getLast(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=e.length;if(t)return e[t-1]}var clone=require("clone"),visit=require("unist-util-visit"),xtend=require("xtend"),legendBlock={table:"Table:",code:"Code:"},internLegendBlock={blockquote:"Source:",image:"Figure:"};module.exports=plugin;

},{"clone":10,"unist-util-visit":227,"xtend":237}],287:[function(require,module,exports){
"use strict";function plugin(){function e(e,r,i){var o=r.indexOf(n),a=r.indexOf(t);if(0===o&&-1!==a){if(i)return!0;var u=r.substring(n.length+1,a-1);return e(n+SPACE+u+SPACE+t)}}var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=beginMarkerFactory(r.beginMarker),t=endMarkerFactory(r.endMarker);e.locator=function(e,r){return e.indexOf(n,r)};var i=this.Parser,o=i.prototype.inlineTokenizers,a=i.prototype.inlineMethods;o.comments=e,a.splice(a.indexOf("text"),0,"comments")}var beginMarkerFactory=function(){return"<--"+(arguments.length>0&&void 0!==arguments[0]?arguments[0]:"COMMENTS")},endMarkerFactory=function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:"COMMENTS")+"--\x3e"},SPACE=" ";module.exports=plugin;

},{}],288:[function(require,module,exports){
"use strict";function escapeRegExp(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}var C_NEWLINE="\n",C_FENCE="|";module.exports=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},o=Object.keys(e).map(escapeRegExp).join("|");if(!o)throw new Error("remark-custom-blocks needs to be passed a configuration object as option");var t=new RegExp("\\[\\[("+o+")\\]\\]"),r=this.Parser,s=r.prototype.blockTokenizers,c=r.prototype.blockMethods;s.custom_blocks=function(o,r,s){var c=o.now(),i=t.exec(r);if(i&&0===i.index){if(s)return!0;for(var n=[],p=[],a=0;-1!==(a=r.indexOf(C_NEWLINE));){var l=r.indexOf(C_NEWLINE,a+1),d=-1!==l?r.slice(a+1,l):r.slice(a+1);if(d[0]!==C_FENCE)break;var u=d.slice(d.startsWith(C_FENCE+" ")?2:1);n.push(d),p.push(u),r=r.slice(a+1)}var E=p.join(C_NEWLINE),f=o(""+i[0]+C_NEWLINE+n.join(C_NEWLINE)),k=this.enterBlock(),C=this.tokenizeBlock(E,c);return k(),f({type:i[1]+"CustomBlock",children:C,data:{hName:"div",hProperties:{className:e[i[1]]}}})}},c.splice(c.indexOf("fencedCode")+1,0,"custom_blocks");var i=r.prototype.interruptParagraph,n=r.prototype.interruptList,p=r.prototype.interruptBlockquote;i.splice(i.indexOf("fencedCode")+1,0,["custom_blocks"]),n.splice(n.indexOf("fencedCode")+1,0,["custom_blocks"]),p.splice(p.indexOf("fencedCode")+1,0,["custom_blocks"])};

},{}],289:[function(require,module,exports){
"use strict";function plugin(){var r=this,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},o=n.block,e=void 0===o?[]:o,i=n.inline,t=void 0===i?[]:i;e.length&&e.filter(function(r){return Array.isArray(r)?e.map(function(r){return r[0]}).includes(r[0]):e.includes(r)}).forEach(function(n){Array.isArray(n)&&2===n.length?r.Parser.prototype.blockTokenizers[n[0]]=throwing(n[1]):r.Parser.prototype.blockTokenizers[n]=noop}),t.length&&t.filter(function(r){return Array.isArray(r)?t.map(function(r){return r[0]}).includes(r[0]):t.includes(r)}).forEach(function(n){var o=void 0,e=void 0;Array.isArray(n)&&2===n.length?(o=n[0],e=throwing(n[1])):(o=n,e=clone(noop)),Object.keys(r.Parser.prototype.inlineTokenizers[o]).forEach(function(n){e[n]=r.Parser.prototype.inlineTokenizers[o][n]}),r.Parser.prototype.inlineTokenizers[o]=e})}var clone=require("clone"),noop=function(){return!0},throwing=function(r){return function(){throw new Error(r)}};module.exports=plugin;

},{"clone":10}],290:[function(require,module,exports){
"use strict";function escapeRegExp(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}var SPACE=" ";module.exports=function(e){function t(e,t,o){var s=i.exec(t);if(s){if(0!==s.index)return!0;if(o)return!0;var a=s[0];a.charAt(a.length-1)===SPACE&&(a=a.substring(0,a.length-1));var c=a.trim(),p={type:"emoticon",code:c,data:{hName:"img",hProperties:{src:n[c],alt:c}}};r&&(p.data.hProperties.class=r),e(a)(p)}}var r=e&&e.classes,n=e&&e.emoticons,o=Object.keys(n).map(escapeRegExp).join("|");if(!o)throw new Error("remark-emoticons needs to be passed a configuration object as option");var i=new RegExp("(\\s|^)("+o+")(\\s|$)");t.locator=function(e,t){var r=i.exec(e);return r&&e[r.index]===SPACE?r.index+1:-1};var s=this.Parser,a=s.prototype.inlineTokenizers,c=s.prototype.inlineMethods;a.emoticons=t,c.splice(c.indexOf("text"),0,"emoticons")};

},{}],291:[function(require,module,exports){
"use strict";function _toConsumableArray(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)}function escapeRegExp(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}module.exports=function(){function e(e,r,t){var a=n.exec(r);if(a){if(0!==a.index)return!0;if(t)return!0;e(a[0])({type:"text",value:a[0]})}}var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:["&"];if(!Array.isArray(r)||!r.length)throw new Error("remark-escape-escaped needs to be passed a configuration array as option");var t=r.map(escapeRegExp).join("|"),n=new RegExp("("+t+")");e.locator=function(e,t){var n=r.map(function(r){return e.indexOf(r,t)});return Math.min.apply(Math,_toConsumableArray(n))};var a=this.Parser,i=a.prototype.inlineTokenizers,o=a.prototype.inlineMethods;i.keep_entities=e,o.splice(o.indexOf("text"),0,"keep_entities")};

},{}],292:[function(require,module,exports){
"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _slicedToArray=function(){function e(e,t){var n=[],r=!0,i=!1,s=void 0;try{for(var a,o=e[Symbol.iterator]();!(r=(a=o.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){i=!0,s=e}finally{try{!r&&o.return&&o.return()}finally{if(i)throw s}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),_createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),visit=require("unist-util-visit"),mainLineRegex=new RegExp(/((\+)|(\|)).+((\|)|(\+))/),totalMainLineRegex=new RegExp(/^((\+)|(\|)).+((\|)|(\+))$/),headerLineRegex=new RegExp(/^\+=[=+]+=\+$/),partLineRegex=new RegExp(/\+-[-+]+-\+/),separationLineRegex=new RegExp(/^\+-[-+]+-\+$/);module.exports=function(){function e(e,t,r){for(var i=e.split("\n"),s=0,a=[];s<i.length;++s){var o=i[s];if(n(o))break;if(0===o.length)break;a.push(o)}if(!i[s+1])return[null,null,null,null];for(var l=i[s+1].length,h=[],u=!1;s<i.length;++s){var c=i[s];if(!totalMainLineRegex.exec(c)||c.length!==l)break;var _=headerLineRegex.exec(c);if(_&&!u)u=!0;else if(_&&u)break;h.push(c)}if(!separationLineRegex.exec(h[h.length-1]))for(var f=h.length-1;f>=0&&!separationLineRegex.exec(h[f]);--f)h.pop(),s-=1;for(var p=[];s<i.length;++s){var d=i[s];if(0===d.length)break;p.push(d)}return[a,h,p,u]}function t(e,t,n){var r=e.join("\n");return r.length&&(r+="\n"),r+=t.join("\n"),n.join("\n").length&&(r+="\n"),r+=n.join("\n")}function n(e){return separationLineRegex.exec(e)}function r(e){return headerLineRegex.exec(e)}function i(e){return partLineRegex.exec(e)}function s(e,t){for(var n=[],r=0;r<e.length;++r){var i=e[r];t.includes(i)&&n.push(r)}return n}function a(e){return s(e,"+|")}function o(e){var t=[];return e.forEach(function(e){return e.forEach(function(e){t.includes(e)||t.push(e)})}),t.sort(function(e,t){return e-t})}function l(e){var t=[];return e.forEach(function(e){(r(e)||i(e))&&t.push(a(e))}),o(t)}function h(e,t,s){for(var a=new _(t),o=0;o<e.length;++o){var l=e[o],h=s&null!==r(l),u=h|null!==i(l);u?(a.lastPart().updateWithMainLine(l,u),0!==o&&(h?a.addPart():n(l)?a.lastPart().addRow():a.lastPart().updateWithPartLine(l)),a.lastPart().updateWithMainLine(l,u)):(a.lastPart().updateWithMainLine(l,u),a.lastPart().lastRow().updateContent(l))}return a.lastPart().removeLastRow(),a}function u(e,t,n){for(var r={type:"gridTable",children:[],data:{hName:"table"}},i=e._parts.length>1,s=0;s<e._parts.length;++s){for(var a=e._parts[s],o={type:"tableHeader",children:[],data:{hName:i&&0===s?"thead":"tbody"}},l=0;l<a._rows.length;++l){for(var h=a._rows[l],u={type:"tableRow",children:[],data:{hName:"tr"}},c=0;c<h._cells.length;++c){var _=h._cells[c],f={type:"tableCell",children:n.tokenizeBlock(_._lines.map(function(e){return e.trim()}).join("\n"),t),data:{hName:i&&0===s?"th":"td",hProperties:{colspan:_._colspan,rowspan:_._rowspan}}},p=l+_._rowspan;if(_._rowspan>1&&p-1<a._rows.length)for(var d=1;d<_._rowspan;++d)for(var g=0;g<a._rows[l+d]._cells.length;++g){var v=a._rows[l+d]._cells[g];_._startPosition===v._startPosition&&_._endPosition===v._endPosition&&_._colspan===v._colspan&&_._rowspan===v._rowspan&&_._lines===v._lines&&a._rows[l+d]._cells.splice(g,1)}u.children.push(f)}o.children.push(u)}r.children.push(o)}return r}function c(){return function(e,t,n){if(e.children){for(var r=[],i=!1,s=0;s<e.children.length;++s){var a=e.children[s];if("WrapperBlock"===a.tagName&&"element"===a.type){i=!0;for(var o=0;o<a.children.length;++o)r.push(a.children[o])}else r.push(a)}i&&(e.children=r)}}}var _=function(){function e(t){_classCallCheck(this,e),this._parts=[],this._linesInfos=t,this.addPart()}return _createClass(e,[{key:"lastPart",value:function(){return this._parts[this._parts.length-1]}},{key:"addPart",value:function(){this._parts.push(new f(this._linesInfos))}}]),e}(),f=function(){function e(t){_classCallCheck(this,e),this._rows=[],this._linesInfos=t,this.addRow()}return _createClass(e,[{key:"addRow",value:function(){this._rows.push(new p(this._linesInfos))}},{key:"removeLastRow",value:function(){this._rows.pop()}},{key:"lastRow",value:function(){return this._rows[this._rows.length-1]}},{key:"updateWithMainLine",value:function(e,t){for(var n=t?"+|":"|",r=[this.lastRow()._cells[0]],i=1;i<this.lastRow()._cells.length;++i){var s=this.lastRow()._cells[i];s._rowspan!==r[r.length-1]._rowspan||n.includes(e[s._startPosition-1])?r.push(s):r[r.length-1].mergeWith(s)}this.lastRow()._cells=r}},{key:"updateWithPartLine",value:function(e){for(var t=[],r=0;r<this.lastRow()._cells.length;++r){var i=this.lastRow()._cells[r];n(e.substring(i._startPosition-1,i._endPosition+1))||(i._lines.push(e.substring(i._startPosition,i._endPosition)),i._rowspan+=1,t.push(i))}this.addRow();for(var s=[],a=0;a<t.length;++a){for(var o=t[a],l=0;l<this.lastRow()._cells.length;++l){var h=this.lastRow()._cells[l];h._endPosition<o._startPosition&&!s.includes(h)&&s.push(h)}s.push(o);for(var u=0;u<this.lastRow()._cells.length;++u){var c=this.lastRow()._cells[u];c._startPosition>o._endPosition&&!s.includes(c)&&s.push(c)}}for(var _=0;_<s.length;++_)for(var f=s[_],p=0;p<s.length;++p)if(_!==p){var d=s[p];d._startPosition>=f._startPosition&&d._endPosition<=f._endPosition&&0===d._lines.length&&(s.splice(p,1),_>(p-=1)&&(f=s[_-=1]))}this.lastRow()._cells=s}}]),e}(),p=function(){function e(t){_classCallCheck(this,e),this._linesInfos=t,this._cells=[];for(var n=0;n<t.length-1;++n)this._cells.push(new d(t[n]+1,t[n+1]))}return _createClass(e,[{key:"updateContent",value:function(e){for(var t=0;t<this._cells.length;++t){var n=this._cells[t];n._lines.push(e.substring(n._startPosition,n._endPosition))}}}]),e}(),d=function(){function e(t,n){_classCallCheck(this,e),this._startPosition=t,this._endPosition=n,this._colspan=1,this._rowspan=1,this._lines=[]}return _createClass(e,[{key:"mergeWith",value:function(e){this._endPosition=e._endPosition,this._colspan+=e._colspan;for(var t=[],n=0;n<this._lines.length;++n)t.push(this._lines[n]+"|"+e._lines[n]);this._lines=t}}]),e}(),g=this.Parser,v=g.prototype.blockTokenizers,w=g.prototype.blockMethods;return v.grid_table=function(n,r,i){if(mainLineRegex.exec(r)){var s=e(r,n,this),a=_slicedToArray(s,4),o=a[0],c=a[1],_=a[2],f=a[3];if(c&&!(c.length<3)){var p=n.now(),d=u(h(c,l(c),f),p,this),g=t(o,c,_),v={type:"element",tagName:"WrapperBlock",children:[]};return o.length&&v.children.push(this.tokenizeBlock(o.join("\n"),p)[0]),v.children.push(d),_.length&&v.children.push(this.tokenizeBlock(_.join("\n"),p)[0]),n(g)(v)}}},w.splice(w.indexOf("fencedCode"),0,"grid_table"),function(e){visit(e,c())}};

},{"unist-util-visit":227}],293:[function(require,module,exports){
"use strict";function shifter(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return function(i){visit(i,"heading",function(i){t&&(i.depth+t<=1?i.depth=1:i.depth+t>=6?i.depth=6:i.depth+=t)})}}var visit=require("unist-util-visit");module.exports=shifter;

},{"unist-util-visit":227}],294:[function(require,module,exports){
"use strict";module.exports=function(){var e=this.Parser,t=e.prototype.blockTokenizers,n=e.prototype.blockMethods;t.heading_blocks=function(e,t,n){if(n)return!0;var i=t.match(/.*\n/g)||[];if(!/^$| +/.test(i[0])&&/^(-+|=+)\s+\n?$/.test(i[1])){var o=e.now(),r=e(i[0]+i[1]);return this.enterBlock()(),r({type:"heading",depth:"="===i[1][0]?1:2,children:this.tokenizeInline(i[0].slice(0,-1),o)})}},n.splice(n.indexOf("fencedCode")+1,0,"heading_blocks")};

},{}],295:[function(require,module,exports){
"use strict";function computeFinalUrl(e,t){var r=t;if(e.replace&&e.replace.length&&e.replace.forEach(function(e){var t=_slicedToArray(e,2),n=t[0],o=t[1];n&&o&&(r=r.replace(n,o))}),e.removeFileName){var n=urlParse(r);n.pathname=n.pathname.substring(0,n.pathname.lastIndexOf("/")),r=URL.format(n)}return e.append&&(r+=e.append),e.removeAfter&&r.includes(e.removeAfter)&&(r=r.substring(0,r.indexOf(e.removeAfter))),r}function computeThumbnail(e,t){var r="default image",n=e.thumbnail;return n&&n.format&&(r=n.format,Object.keys(n).filter(function(e){return"format"!==e}).forEach(function(e){var o=new RegExp("{"+e+"}","g"),a=new RegExp(n[e]).exec(t);a.length&&(r=r.replace(o,a[1]))})),r}function locator(e,t){return e.indexOf("!(http",t)}var _slicedToArray=function(){function e(e,t){var r=[],n=!0,o=!1,a=void 0;try{for(var i,u=e[Symbol.iterator]();!(n=(i=u.next()).done)&&(r.push(i.value),!t||r.length!==t);n=!0);}catch(e){o=!0,a=e}finally{try{!n&&u.return&&u.return()}finally{if(o)throw a}}return r}return function(t,r){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},URL=require("url"),urlParse=URL.parse;module.exports=function(e){function t(t){var r=urlParse(t).hostname;return e[r]}function r(e,r,n){for(var o="",a="",i=0;i<r.length&&")"!==r[i-1];i++)o+=r[i],"!"!==r[i]&&"("!==r[i]&&")"!==r[i]&&(a+=r[i]);if(n)return!0;var u=t(a);if(!u||!0===u.disabled||u.match&&u.match instanceof RegExp&&!u.match.test(a)){if(!o.startsWith("!(http"))return;e(o)({type:"text",value:o})}else{var f=computeFinalUrl(u,a),l=computeThumbnail(u,f);e(o)({type:"iframe",data:{hName:u.tag,hProperties:{src:f,width:u.width,height:u.height,allowfullscreen:!0,frameborder:"0"},thumbnail:l}})}}if("object"!==(void 0===e?"undefined":_typeof(e))||!Object.keys(e).length)throw new Error("remark-iframes needs to be passed a configuration object as option");r.locator=locator;var n=this.Parser,o=n.prototype.inlineTokenizers,a=n.prototype.inlineMethods;o.iframes=r,a.splice(a.indexOf("autoLink"),0,"iframes")};

},{"url":228}],296:[function(require,module,exports){
"use strict";function locator(t,e){return t.indexOf(DOUBLE,e)}function plugin(){function t(t,e,i){if(this.options.gfm&&e.charAt(0)===C_PIPE&&e.charAt(1)===C_PIPE&&!e.startsWith(C_PIPE.repeat(4))&&!whitespace(e.charAt(2))){var r="",o="",n="",a="",s=1,c=e.length,h=t.now();for(h.column+=2,h.offset+=2;++s<c;){if(!((r=e.charAt(s))!==C_PIPE||o!==C_PIPE||n&&whitespace(n)))return!!i||t(DOUBLE+a+DOUBLE)({type:"kbd",children:this.tokenizeInline(a,h),data:{hName:"kbd"}});a+=o,n=o,o=r}}}t.locator=locator;var e=this.Parser,i=e.prototype.inlineTokenizers,r=e.prototype.inlineMethods;i.kbd=t,r.splice(r.indexOf("text"),0,"kbd");var o=this.Compiler;o&&(o.prototype.visitors.kbd=function(t){return"||"+this.all(t).join("")+"||"})}var whitespace=require("is-whitespace-character"),C_PIPE="|",DOUBLE="||";module.exports=plugin;

},{"is-whitespace-character":51}],297:[function(require,module,exports){
"use strict";function plugin(){return transformer}function transformer(t){visit(t,"footnoteDefinition",visitor),visit(t,"footnoteReference",visitor)}function visitor(t,i,o){footnotes.hasOwnProperty(t.identifier)||(footnotes[t.identifier]=Object.keys(footnotes).length+1),t.identifier=footnotes[t.identifier]}var visit=require("unist-util-visit"),footnotes={};module.exports=plugin;

},{"unist-util-visit":227}],298:[function(require,module,exports){
"use strict";var visit=require("unist-util-visit"),helpMsg="remark-ping: expected configuration to be passed: {\n  pingUsername: (username) => bool,\n  userURL: (username) => string\n}";module.exports=function(e){function t(e,t,n){var s=a.exec(t);if(s&&!(s.index>0)){var o=s[0],p=s[2]?s[2]:s[1];if(!0===r(p)){var u=i(p);return e(o)({type:"ping",username:p,url:u,children:[{type:"text",value:p}],data:{hName:"a",hProperties:{href:u,class:"ping"}}})}return e(o[0])({type:"text",value:o[0]})}}var n=this,r=e.pingUsername,i=e.userURL,s=e.usernameRegex,a=void 0===s?/[\s'"(,:<]?@(?:\*\*([^*]+)\*\*|(\w+))/:s;if("function"!=typeof r||"function"!=typeof i)throw new Error(helpMsg);t.locator=function(e,t){var n=a.exec(e,t);return n?e.indexOf("@",n.index):-1};var o=this.Parser,p=o.prototype.inlineTokenizers,u=o.prototype.inlineMethods;p.ping=t,u.splice(u.indexOf("text"),0,"ping");var c=this.Compiler;return c&&(c.prototype.visitors.ping=function(e){return"@**"+n.all(e).join("")+"**"}),function(e,t){return visit(e,"ping",function(e){t.data[e.type]||(t.data[e.type]=[]),t.data[e.type].push(e.username)})}};

},{"unist-util-visit":227}],299:[function(require,module,exports){
"use strict";function locator(r,t){var e=-1,n=[],i=!0,s=!1,a=void 0;try{for(var o,l=Object.keys(markers)[Symbol.iterator]();!(i=(o=l.next()).done);i=!0){var u=o.value;-1===(e=r.indexOf(u,t))||n.push(e)}}catch(r){s=!0,a=r}finally{try{!i&&l.return&&l.return()}finally{if(s)throw a}}return n.length?(n.sort(function(r,t){return r-t}),n[0]):-1}function inlinePlugin(){function r(r,t,e){var n=!0,i=!1,s=void 0;try{for(var a,o=Object.keys(markers)[Symbol.iterator]();!(n=(a=o.next()).done);n=!0){var l=a.value;this.escape.includes(l)||this.escape.push(l)}}catch(r){i=!0,s=r}finally{try{!n&&o.return&&o.return()}finally{if(i)throw s}}var u=t[0],c=r.now();if(c.column+=1,c.offset+=1,markers.hasOwnProperty(u)&&!t.startsWith(u+SPACE)&&!t.startsWith(u+u)){for(var f=1;t[f]!==u&&f<t.length;f++);if(f===t.length)return;if(e)return!0;r(t.substring(0,f+1))({type:markers[u],children:this.tokenizeInline(t.substring(1,f),c),data:{hName:markers[u]}})}}r.locator=locator;var t=this.Parser,e=t.prototype.inlineTokenizers,n=t.prototype.inlineMethods;e.sub_super=r,n.splice(n.indexOf("text"),0,"sub_super")}var SPACE=" ",markers={"~":"sub","^":"sup"};module.exports=inlinePlugin;

},{}],300:[function(require,module,exports){
"use strict";var chars={"NARROW NO-BREAK SPACE":" "};module.exports={fr:chars["NARROW NO-BREAK SPACE"],"fr-sw":chars["NARROW NO-BREAK SPACE"]};

},{}],301:[function(require,module,exports){
"use strict";var db=require("./db");module.exports=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",r=(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).locale;if(!Object.keys(db).includes(r))return e;var t=db[r],n=/ :(\s|$)/gim;return e.replace(n,function(e,r){return t+":"+r})};

},{"./db":300}],302:[function(require,module,exports){
"use strict";var chars={"NARROW NO-BREAK SPACE":" "};module.exports={fr:chars["NARROW NO-BREAK SPACE"],"fr-sw":chars["NARROW NO-BREAK SPACE"]};

},{}],303:[function(require,module,exports){
"use strict";var db=require("./db");module.exports=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",r=(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).locale,n=/--/gm,t=e.replace(n,"—");if(Object.keys(db).includes(r)){var i=new RegExp("(^|\\s)(—)(\\s|$)"),s=db[r],d=t,l=!0,c=i.exec(d);for(t="";c;){t+=d.substring(0,c.index);var g=l?"$1$2"+s:s+"$2$3";t+=c[0].replace(i,g),d=d.substring(c.index+c[0].length,d.length),c=i.exec(d),l=!l}t+=d}return t};

},{"./db":302}],304:[function(require,module,exports){
"use strict";var chars={"NARROW NO-BREAK SPACE":" "};module.exports={fr:chars["NARROW NO-BREAK SPACE"],"fr-sw":chars["NARROW NO-BREAK SPACE"]};

},{}],305:[function(require,module,exports){
"use strict";var db=require("./db");module.exports=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",r=(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).locale;if(!Object.keys(db).includes(r))return e;var t=db[r],n=/ !(\s|$)/gim;return e.replace(n,function(e,r){return t+"!"+r})};

},{"./db":304}],306:[function(require,module,exports){
"use strict";var charsFr={"NARROW NO-BREAK SPACE":" ","LEFT-POINTING ANGLE QUOTATION MARK":"«","RIGHT-POINTING ANGLE QUOTATION MARK":"»"};module.exports={fr:charsFr,"fr-sw":charsFr};

},{}],307:[function(require,module,exports){
"use strict";var db=require("./db");module.exports=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",r=(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).locale;if(!Object.keys(db).includes(r))return e;var l=db[r],N=l["LEFT-POINTING ANGLE QUOTATION MARK"],a=l["RIGHT-POINTING ANGLE QUOTATION MARK"],c=l["NARROW NO-BREAK SPACE"],n=/<</gm,t=e.replace(n,N),A=new RegExp("("+N+")(\\s)","gm"),O=/>>/gm;t=(t=t.replace(A,"$1"+c)).replace(O,a);var d=new RegExp("(\\s)("+a+")","gm");return t.replace(d,c+"$2")};

},{"./db":306}],308:[function(require,module,exports){
"use strict";var chars={"NARROW NO-BREAK SPACE":" "};module.exports={fr:chars["NARROW NO-BREAK SPACE"],"fr-sw":chars["NARROW NO-BREAK SPACE"]};

},{}],309:[function(require,module,exports){
"use strict";var db=require("./db");module.exports=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",r=(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).locale;if(!Object.keys(db).includes(r))return e;var t=db[r],n=/ %(\s|$)/gim;return e.replace(n,function(e,r){return t+"%"+r})};

},{"./db":308}],310:[function(require,module,exports){
"use strict";var chars={"NARROW NO-BREAK SPACE":" "};module.exports={fr:chars["NARROW NO-BREAK SPACE"],"fr-sw":chars["NARROW NO-BREAK SPACE"]};

},{}],311:[function(require,module,exports){
"use strict";var db=require("./db");module.exports=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",r=(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).locale,t={"PER MILLE SIGN":"‰"},d=/%o/gim,i=e.replace(d,t["PER MILLE SIGN"]);if(Object.keys(db).includes(r)){var l=/( )(\u2030)/g;return i.replace(l,db[r]+"$2")}return i};

},{"./db":310}],312:[function(require,module,exports){
"use strict";var chars={"NARROW NO-BREAK SPACE":" "};module.exports={fr:chars["NARROW NO-BREAK SPACE"],"fr-sw":chars["NARROW NO-BREAK SPACE"]};

},{}],313:[function(require,module,exports){
"use strict";var db=require("./db");module.exports=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",r=(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).locale;if(!Object.keys(db).includes(r))return e;var t=db[r],n=/ \?(\s|$)/gim;return e.replace(n,function(e,r){return t+"?"+r})};

},{"./db":312}],314:[function(require,module,exports){
"use strict";var chars={"NARROW NO-BREAK SPACE":" "};module.exports={fr:chars["NARROW NO-BREAK SPACE"],"fr-sw":chars["NARROW NO-BREAK SPACE"]};

},{}],315:[function(require,module,exports){
"use strict";var db=require("./db");module.exports=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",r=(arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}).locale;if(!Object.keys(db).includes(r))return e;var t=db[r],n=/ ;(\s|$)/gim;return e.replace(n,function(e,r){return t+";"+r})};

},{"./db":314}],316:[function(require,module,exports){
"use strict";var request=require("sync-request"),textrApostrophes=require("typographic-apostrophes"),textrApostrophesForPlurals=require("typographic-apostrophes-for-possessive-plurals"),textrCopyright=require("typographic-copyright"),textrEllipses=require("typographic-ellipses"),textrEmDashes=require("typographic-em-dashes"),textrEnDashes=require("typographic-en-dashes"),textrRegisteredTrademark=require("typographic-registered-trademark"),textrSingleSpaces=require("typographic-single-spaces"),textrTrademark=require("typographic-trademark"),textrColon=require("typographic-colon"),textrEmDash=require("typographic-em-dash"),textrExclamationMark=require("typographic-exclamation-mark"),textrGuillemets=require("typographic-guillemets"),textrPercent=require("typographic-percent"),textrPermille=require("typographic-permille"),textrQuestionMark=require("typographic-question-mark"),textrSemicolon=require("typographic-semicolon"),defaultConfig={reParse:{gfm:!0,commonmark:!1,footnotes:!0,blocks:[]},textr:{plugins:[textrApostrophes,textrApostrophesForPlurals,textrEllipses,textrEmDashes,textrEnDashes,textrCopyright,textrRegisteredTrademark,textrSingleSpaces,textrTrademark,textrColon,textrEmDash,textrExclamationMark,textrGuillemets,textrPercent,textrPermille,textrQuestionMark,textrSemicolon],options:{locale:"fr"}},headingShifter:0,remark2rehype:{allowDangerousHTML:!0},footnotesTitles:"Retourner au texte de la note $id",alignBlocks:{center:"align-center",right:"align-right"},customBlocks:{secret:"spoiler",s:"spoiler",information:"information ico-after",i:"information ico-after",question:"question ico-after",q:"question ico-after",attention:"warning ico-after",a:"warning ico-after",erreur:"error ico-after",e:"error ico-after"},escapeEscaped:["&"],emoticons:{emoticons:{":ange:":"/static/smileys/ange.png",":colere:":"/static/smileys/angry.gif",o_O:"/static/smileys/blink.gif",";)":"/static/smileys/clin.png",":diable:":"/static/smileys/diable.png",":D":"/static/smileys/heureux.png","^^":"/static/smileys/hihi.png",":o":"/static/smileys/huh.png",":p":"/static/smileys/langue.png",":magicien:":"/static/smileys/magicien.png",":colere2:":"/static/smileys/mechant.png",":ninja:":"/static/smileys/ninja.png","x(":"/static/smileys/pinch.png",":pirate:":"/static/smileys/pirate.png",":'(":"/static/smileys/pleure.png",":lol:":"/static/smileys/rire.gif",":honte:":"/static/smileys/rouge.png",":-°":"/static/smileys/siffle.png",":)":"/static/smileys/smile.png",":soleil:":"/static/smileys/soleil.png",":(":"/static/smileys/triste.png",":euh:":"/static/smileys/unsure.gif",":waw:":"/static/smileys/waw.png",":zorro:":"/static/smileys/zorro.png"},classes:"smiley"},math:{inlineMathDouble:!0},katex:{inlineMathDoubleDisplay:!0},iframes:{"www.dailymotion.com":{tag:"iframe",width:480,height:270,disabled:!1,replace:[["video/","embed/video/"]],thumbnail:{format:"http://www.dailymotion.com/thumbnail/video/{id}",id:".+/(.+)$"}},"www.vimeo.com":{tag:"iframe",width:500,height:281,disabled:!1,replace:[["http://","https://"],["www.",""],["vimeo.com/","player.vimeo.com/video/"]]},"vimeo.com":{tag:"iframe",width:500,height:281,disabled:!1,replace:[["http://","https://"],["www.",""],["vimeo.com/","player.vimeo.com/video/"]]},"www.youtube.com":{tag:"iframe",width:560,height:315,disabled:!1,replace:[["watch?v=","embed/"],["http://","https://"]],thumbnail:{format:"http://img.youtube.com/vi/{id}/0.jpg",id:".+/(.+)$"},removeAfter:"&"},"youtube.com":{tag:"iframe",width:560,height:315,disabled:!1,replace:[["watch?v=","embed/"],["http://","https://"]],thumbnail:{format:"http://img.youtube.com/vi/{id}/0.jpg",id:".+/(.+)$"},removeAfter:"&"},"youtu.be":{tag:"iframe",width:560,height:315,disabled:!1,replace:[["watch?v=","embed/"],["youtu.be","www.youtube.com/embed"]],thumbnail:{format:"http://img.youtube.com/vi/{id}/0.jpg",id:".+/(.+)$"},removeAfter:"&"},"screen.yahoo.com":{tag:"iframe",width:624,height:351,disabled:!1,append:"?format=embed&player_autoplay=false"},"www.ina.fr":{tag:"iframe",width:620,height:349,disabled:!1,replace:[["www.","player."],["/video/","/player/embed/"]],append:"/1/1b0bd203fbcd702f9bc9b10ac3d0fc21/560/315/1/148db8",removeFileName:!0},"www.jsfiddle.net":{tag:"iframe",width:560,height:560,disabled:!1,replace:[["http://","https://"]],append:"embedded/result,js,html,css/",match:/https?:\/\/(www\.)?jsfiddle\.net\/([\w\d]+\/[\w\d]+\/\d+\/?|[\w\d]+\/\d+\/?|[\w\d]+\/?)$/,thumbnail:{format:"http://www.unixstickers.com/image/data/stickers/jsfiddle/JSfiddle-blue-w-type.sh.png"}},"jsfiddle.net":{tag:"iframe",width:560,height:560,disabled:!1,replace:[["http://","https://"]],append:"embedded/result,js,html,css/",match:/https?:\/\/(www\.)?jsfiddle\.net\/([\w\d]+\/[\w\d]+\/\d+\/?|[\w\d]+\/\d+\/?|[\w\d]+\/?)$/,thumbnail:{format:"http://www.unixstickers.com/image/data/stickers/jsfiddle/JSfiddle-blue-w-type.sh.png"}}},captions:{external:{table:"Table:",gridTable:"Table:",code:"Code:",math:"Equation:"},internal:{iframe:"Video:",math:"Equation:",inlineMath:"Equation:",image:"Figure:"}},ping:{pingUsername:function(e){try{return 200===request("HEAD","https://zestedesavoir.com/api/membres/exists/?search="+e,{timeout:300}).statusCode}catch(e){return console.error(e),!1}},userURL:function(e){return"/membres/voir/"+e+"/"}},disableTokenizers:{}},rebberConfig={override:{ping:require("rebber/dist/types/link"),emoticon:require("rebber/dist/custom-types/emoticon"),figure:require("rebber/dist/custom-types/figure"),sub:require("rebber/dist/custom-types/sub"),sup:require("rebber/dist/custom-types/sup"),kbd:require("rebber/dist/custom-types/kbd"),CenterAligned:require("rebber/dist/custom-types/align"),RightAligned:require("rebber/dist/custom-types/align"),informationCustomBlock:require("rebber/dist/custom-types/customBlocks"),secretCustomBlock:require("rebber/dist/custom-types/customBlocks"),errorCustomBlock:require("rebber/dist/custom-types/customBlocks"),warningCustomBlock:require("rebber/dist/custom-types/customBlocks"),questionCustomBlock:require("rebber/dist/custom-types/customBlocks"),abbr:require("rebber/dist/custom-types/abbr"),gridTable:require("rebber/dist/custom-types/gridTable"),math:require("rebber/dist/custom-types/math"),inlineMath:require("rebber/dist/custom-types/math")},emoticons:defaultConfig.emoticons,codeAppendiceTitle:"Annexes",link:{prefix:"http://zestedesavoir.com"}};Object.assign(rebberConfig.override,{eCustomBlock:function(e,t){return t.type="errorCustomBlock",rebberConfig.override.errorCustomBlock(e,t)},erreurCustomBlock:function(e,t){return t.type="errorCustomBlock",rebberConfig.override.errorCustomBlock(e,t)},iCustomBlock:function(e,t){return t.type="informationCustomBlock",rebberConfig.override.informationCustomBlock(e,t)},qCustomBlock:function(e,t){return t.type="questionCustomBlock",rebberConfig.override.questionCustomBlock(e,t)},sCustomBlock:function(e,t){return t.type="secretCustomBlock",rebberConfig.override.secretCustomBlock(e,t)},aCustomBlock:function(e,t){return t.type="warningCustomBlock",rebberConfig.override.warningCustomBlock(e,t)},attentionCustomBlock:function(e,t){return t.type="warningCustomBlock",rebberConfig.override.warningCustomBlock(e,t)}}),defaultConfig.rebber=rebberConfig,module.exports=defaultConfig;

},{"rebber/dist/custom-types/abbr":239,"rebber/dist/custom-types/align":240,"rebber/dist/custom-types/customBlocks":241,"rebber/dist/custom-types/emoticon":242,"rebber/dist/custom-types/figure":243,"rebber/dist/custom-types/gridTable":244,"rebber/dist/custom-types/kbd":245,"rebber/dist/custom-types/math":246,"rebber/dist/custom-types/sub":247,"rebber/dist/custom-types/sup":248,"rebber/dist/types/link":270,"sync-request":196,"typographic-apostrophes":210,"typographic-apostrophes-for-possessive-plurals":209,"typographic-colon":301,"typographic-copyright":211,"typographic-ellipses":212,"typographic-em-dash":303,"typographic-em-dashes":213,"typographic-en-dashes":214,"typographic-exclamation-mark":305,"typographic-guillemets":307,"typographic-percent":309,"typographic-permille":311,"typographic-question-mark":313,"typographic-registered-trademark":215,"typographic-semicolon":315,"typographic-single-spaces":216,"typographic-trademark":217}],317:[function(require,module,exports){
"use strict";var toVFile=require("to-vfile"),unified=require("unified"),inspect=require("unist-util-inspect"),visit=require("unist-util-visit"),remarkParse=require("remark-parse"),remarkAbbr=require("remark-abbr/src"),remarkAlign=require("remark-align/src"),remarkCaptions=require("remark-captions/src"),remarkComments=require("remark-comments/src"),remarkCustomBlocks=require("remark-custom-blocks/src"),remarkDisableTokenizers=require("remark-disable-tokenizers/src"),remarkEmoticons=require("remark-emoticons/src"),remarkEscapeEscaped=require("remark-escape-escaped/src"),remarkGridTables=require("remark-grid-tables/src"),remarkHeadingShifter=require("remark-heading-shift/src"),remarkIframes=require("remark-iframes/src"),remarkKbd=require("remark-kbd/src"),remarkMath=require("remark-math"),remarkNumberedFootnotes=require("remark-numbered-footnotes/src"),remarkPing=require("remark-ping/src"),remarkSubSuper=require("remark-sub-super/src"),remarkTextr=require("./remark-textr"),remarkTrailingSpaceHeading=require("remark-heading-trailing-spaces"),remark2rehype=require("remark-rehype"),rehypeKatex=require("rehype-katex"),rehypeFootnotesTitles=require("rehype-footnotes-title"),rehypeHTMLBlocks=require("rehype-html-blocks"),rehypeStringify=require("rehype-stringify"),rebberStringify=require("rebber"),defaultConfig=require("./config"),fromFile=function(e){return toVFile.readSync(e)},zmdParser=function(e){var r=unified().use(remarkParse,e.reParse);return e.isTest||r.use(remarkTextr,e.textr),r.use(remarkAbbr).use(remarkAlign,e.alignBlocks).use(remarkCaptions,e.captions).use(remarkComments).use(remarkCustomBlocks,e.customBlocks).use(remarkDisableTokenizers,e.disableTokenizers).use(remarkEmoticons,e.emoticons).use(remarkEscapeEscaped,e.escapeEscaped).use(remarkGridTables).use(remarkHeadingShifter,e.headingShifter).use(remarkIframes,e.iframes).use(remarkMath,e.math).use(remarkKbd).use(remarkNumberedFootnotes).use(remarkPing,e.ping).use(remarkSubSuper).use(remarkTrailingSpaceHeading),r},rendererFactory=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"html";return function(a,i){var s=zmdParser(e);if("html"===r&&s.use(remark2rehype,e.remark2rehype).use(rehypeHTMLBlocks).use(rehypeFootnotesTitles,e.footnotesTitles).use(rehypeKatex,e.katex).use(rehypeStringify),"latex"===r&&s.use(rebberStringify,e.rebber),"function"!=typeof i){var t=s.processSync(a);return{metadata:t.data,content:t.contents}}s.process(a,function(e,r){if(e)return i(e);var a={metadata:r.data,content:r.contents};i(null,a)})}},mdastParser=function(e){return function(r){return zmdParser(e).parse(r)}};module.exports=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:defaultConfig,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"html";return{config:e,inspect:inspect,parse:mdastParser(e),rendererFactory:rendererFactory,renderString:rendererFactory(e,r),renderFile:function(a,i){return rendererFactory(e,r)(fromFile(a),i)}}};

},{"./config":316,"./remark-textr":318,"rebber":250,"rehype-footnotes-title":282,"rehype-html-blocks":283,"rehype-katex":121,"rehype-stringify":137,"remark-abbr/src":284,"remark-align/src":285,"remark-captions/src":286,"remark-comments/src":287,"remark-custom-blocks/src":288,"remark-disable-tokenizers/src":289,"remark-emoticons/src":290,"remark-escape-escaped/src":291,"remark-grid-tables/src":292,"remark-heading-shift/src":293,"remark-heading-trailing-spaces":294,"remark-iframes/src":295,"remark-kbd/src":296,"remark-math":139,"remark-numbered-footnotes/src":297,"remark-parse":141,"remark-ping/src":298,"remark-rehype":189,"remark-sub-super/src":299,"to-vfile":204,"unified":219,"unist-util-inspect":222,"unist-util-visit":227}],318:[function(require,module,exports){
"use strict";function plugin(){function t(t){t.value=o(t.value)}var i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=i.plugins,u=void 0===e?[]:e,r=i.options,n=void 0===r?{}:r,o=void 0;return function(i){o=u.reduce(function(t,i){return t.use("string"==typeof i?require(i):i)},textr(n)),visit(i,"text",t)}}var visit=require("unist-util-visit"),textr=require("textr");module.exports=plugin;

},{"textr":197,"unist-util-visit":227}]},{},[317])(317)
});
//# sourceMappingURL=bundle.js.map
