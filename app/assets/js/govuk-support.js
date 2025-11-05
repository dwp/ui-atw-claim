(function () {

    var cls = document.body.className || "";
    if (cls.indexOf("govuk-frontend-supported") === -1) {
        document.body.className = (cls ? " " + cls + "" : "") + " govuk-frontend-supported"
    }
})();