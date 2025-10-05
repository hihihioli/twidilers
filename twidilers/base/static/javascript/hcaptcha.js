function resizeCaptcha() {
    captchaElem = document.getElementsByClassName("h-captcha")[0]
    captchaWidth = captchaElem.children[0].offsetWidth;
    parentWidth = document.getElementById('password').offsetWidth;
    scale = parentWidth/captchaWidth
    captchaElem.style.transform = "scale(" + (scale+","+1.025*scale ) + ")";
}
window.onload = function () {
    setTimeout(function () {
        let captchaElem = document.getElementsByClassName("h-captcha")[0]
        captchaElem.style.display = "flex";
    }
    ,20)
    window.onresize = resizeCaptcha

    resizeCaptcha()
}