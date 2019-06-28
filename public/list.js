function compareHeight(a, b) {
    var h1 = a.querySelector("td[id=height]").value;
    var h2 = b.querySelector("td[id=height]").value;
    if (h1 < h2) {
        return -1;
    }
    if (h1 > h2) {
        return 1;
    }
    return 0;
}
function sortHeight() {
    var tab = document.querySelector("tbody");
    var arr = [].slice.call(tab);
    arr.sort(compareHeight);
}
