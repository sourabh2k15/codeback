var isStoreEmpty = true;
var start = Math.floor(Date.now());
var codeUpdates = [];

var codeHistory = localStorage.getItem("codeHistory");
console.log(codeHistory);

var codeString = "";

if (codeHistory != null) {
    isStoreEmpty = false;
    code = codeHistory;
}

$(document).ready(function() {
    if (!isStoreEmpty) {
        $("#code").html(codeHistory);
        codeString = codeHistory;
        codeUpdates = JSON.parse(localStorage.getItem("checkpoints"));
    }

    $("#code").keyup(function(e) {
        recordChange();

        localStorage.setItem("codeHistory", codeString);
        localStorage.setItem("checkpoints", JSON.stringify(codeUpdates));
    });

    $("#replay").click(function() {
        $("#code").val("");
        (function playBack(i) {
            if (i < codeUpdates.length) {
                $("#code").val(codeUpdates[i].code);

                setTimeout(function() {
                    playBack(i + 1);
                }, 100);

            }
        })(0);
    });

    $("#submit").click(function() {
        post(codeString);
    })
});

function recordChange() {
    var timestamp = Math.floor(Date.now());
    codeString = $("#code").val();

    codeUpdates.push({ "time": timestamp, "code": codeString });
}

function post(code) {
    $.ajax({
        url: '/execute',
        method: 'POST',
        data: { "code": JSON.stringify(code), "lang": "cpp" },
        success: function(resp) {
            console.log(resp);
            $("#result").html(resp);
        },
        error: function() {
            console.log("error");
        }
    })
}