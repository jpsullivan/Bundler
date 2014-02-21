String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.startsWith = function (str) {
    return this.indexOf(str) === 0;
};

String.prototype.endsWithAny = function (endings) {
    var str = this;
    return endings.some(function (ending) { return str.endsWith(ending); });
};

String.prototype.NormalizeSlash = function (addInitialSlash, removeFinalSlash) {

    var ret = this;
    if (addInitialSlash && !ret.startsWith('/')) {
        ret = "/" + ret;
    }

    if (removeFinalSlash && ret.endsWith("/")) {
        ret = ret.substring(0, this.length - 1);
    }
    return ret;
};

String.prototype.isJs = function () {
    if (this.endsWith('.min.js')) return false;
    if (this.endsWithAny(['.js', '.coffee', '.ls', '.ts', '.mustache'])) return true;
    return false;
}

String.prototype.isCss = function () {
    if (this.endsWith('.min.css')) return false;
    if (this.endsWithAny(['.css', '.less', '.sass', '.scss', '.styl'])) return true;
    return false;
}