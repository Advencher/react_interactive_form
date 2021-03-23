import extract from "extract-json-from-string";
import * as CryptoJS from "crypto-js";
import Cookies from "universal-cookie";
import * as Aes from "../utils/aes-ctr";


const api_key = "475f49b4766e7021f4b2ecfe5afa0dfe";
class ApiService {

  constructor() {
    this.postNewTicket = this.postNewTicket.bind(this);
  }

  async getAllItems(objectType) {
    let cookies = new Cookies();
    let items = await fetch(
      `http://82.112.59.85:5000/projeqtor/api/${objectType}/all`,
      {
        method: "GET",
        cache: "no-cache",
        Accept: "*/*",
        Connection: "keep-alive",
        headers: {
          Authorization: "Basic YXBpX3Byb3ZpZGVyOjU5Qkh3bjd1Z015aQ==", //api_provider
        },
        redirect: "follow"
      }
    );
    items = await items.json();
    cookies.remove("PHPSESSID", {path: "/", domain: "82.112.59.85"});
    return items;
  }

  async validateHuman (RECAPTCHA_SERVER_KEY, humanKey) {

    let data = new FormData();
    data.append("secret", RECAPTCHA_SERVER_KEY);
    data.append("response", humanKey);

    const isHuman = await fetch(`http://82.112.59.85:5000/react/corsproxy/proxy.php`, {
        method: "post",
        body: data
      })
        .then(res => {
          
          res.text();})  
        .then(json => console.log(json + " validation google"))
        .catch(err => {
          throw new Error(`Error in Google Siteverify API. ${err.message}`)
    });

    return isHuman;
  }

  async getProjeqtorCookie() {
    const cookies = new Cookies();
    if (cookies.get("projeqtor") !== undefined) {
      console.log("уже есть");
      return JSON.stringify({
        success: "в браузере уже был установлен куки берем готовую",
      });
    }

    if (cookies.get("PHPSESSID") === undefined) {
      const setSessionCookie = await fetch(
        `http://82.112.59.85:5000/projeqtor/view/main.php`,
        {
          headers: {
            redirect: "follow",
            Accept: "/*",
          },
        }
      );
    }
    let sessionCookie = cookies.get("PHPSESSID");
    //console.log("куки: " + sessionCookie);
    let loginCrypted = Aes.encrypt("admin", CryptoJS.MD5(sessionCookie), 128);
    //console.log("результат aes-ctr: " + loginCrypted);
    const getHash = await fetch(
      `http://82.112.59.85:5000/projeqtor/tool/getHash.php?username=${encodeURIComponent(
        loginCrypted
      )}`,
      {
        headers: {
          redirect: "follow",
          Accept: "/*",
        },
      }
    );
    let userArray = await getHash.text();
    userArray = userArray.split(";");
    console.log(userArray);
    loginCrypted = Aes.encrypt("admin", userArray[2], 128);
    let pwdCrypted;
    if (userArray[0] == "md5") {
      pwdCrypted = CryptoJS.MD5("admin" + userArray[1]);
      pwdCrypted = CryptoJS.MD5(pwdCrypted + userArray[2]);
    } else if (userArray[0] == "sha256") {
      pwdCrypted = CryptoJS.SHA256("admin" + userArray[1]);
      pwdCrypted = CryptoJS.SHA256(pwdCrypted + userArray[2]);
    } else {
      pwdCrypted = Aes.encrypt("admin", userArray[2], 128);
    }

    var details = {
      login: loginCrypted,
      password: pwdCrypted,
      rememberMe: "off",
      isLoginPage: "true",
    };

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const url = `http://82.112.59.85:5000/projeqtor/tool/loginCheck.php?xhrPostTimestamp=${Date.now()}`;
    const setProjeqtorCookie = await fetch(url, {
      method: "POST",
      headers: {
        redirect: "follow",
        Connection: "keep-alive",
        DNT: 1,
        Cookie: `PHPSESSID=${sessionCookie}`,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: formBody,
    });
    let projeqtorCookie = cookies.get("projeqtor");
    console.log("куки получен такой " + projeqtorCookie );
    if (projeqtorCookie !== undefined) {
      console.log("success PogU");
      return JSON.stringify({ success: "удалось авторизироваться в projeqtor" });
    } else {
      return JSON.stringify({ error: "не удалось авторизироваться в projeqtor" });
    }
  }

  //перенести в бэкенд или Redux ()
  async postNewTicket(data, objectType, files) {
    const dataCrypted = Aes.encrypt(data.get('data'), api_key, 128);
    data.delete('data');
    data.append('data', dataCrypted);
    let response;
    const cookies = new Cookies();
    let res = await fetch(
      `http://82.112.59.85:5000/projeqtor/api/${objectType}`,
      {
        method: "POST",
        cache: "no-cache",
        Accept: "*/*",
        Connection: "keep-alive",
        "Content-Type": "multipart/form-data",
        headers: {
          Authorization: "Basic YXBpX3Byb3ZpZGVyOjU5Qkh3bjd1Z015aQ==",
        },
        redirect: "follow",
        body: data,
      }
    );
    res = await res.json();
    cookies.remove("PHPSESSID", { path: "/", domain: "82.112.59.85"});
    let IdTicket;
    //let extractedObjects = extract(res);
    if (res.items[0].apiResult === "OK") {
      let cookie = await this.getProjeqtorCookie();
      if (cookie.error) {
        response = {
          Error: "Проблема с авторизацией в projeqtor"
        }
        return response;
      }
      IdTicket = res.items[0].id;
      console.log("Успешно добавлен новый тикет");
      response = {
        "Комментарий": "Успешно добавлен новый тикет",
        "Идентификатор нового тикета": IdTicket,
        "Проект": res.items[0].nameProject,
        "Время создания": res.items[0].creationDateTime,
        success: true
      }
      this.uploadFile(IdTicket, files)
    } else if (res.error || res.error) {
      console.log("Ошибка во время добавления тикета");
      response = {
        "Комментарий": "Ошибка во время добавления тикета",
        "Ответ от сервера": JSON.stringify(res),
        success:false
      }
    }
    return response;
  }

  uploadFile(IdTicket, files) {
    const cookies = new Cookies();
    const filedata = new FormData();
    while (IdTicket.length < 6) {
      IdTicket = `0${IdTicket}`;
    }
    console.log(IdTicket);
    filedata.append("attachmentRefId", IdTicket);
    filedata.append("attachmentId", "");
    filedata.append("attachmentRefType", "Ticket");
    filedata.append("attachmentType", "file");
    filedata.append("attachmentPrivacy", "1");
    filedata.append("uploadType", "html5");
    console.log(files);
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        filedata.append("attachmentFiles[]", files[i]);
      }
      console.log("куки прожектор" + cookies.get("projeqtor"));
      fetch("http://82.112.59.85:5000/projeqtor/tool/saveAttachment.php", {
        method: "POST",
        Accept: "application/json",
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundaryQDNGfxmlTzHBTOSU",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        Connection: "keep-alive",
        Cookie: `PHPSESSID=${cookies.get("projeqtor")}; projeqtor=${cookies.get(
          "projeqtor"
        )}`,
        redirect: "follow",
        body: filedata,
      })
        .then((res) => res.text())
        .then((text) => {
          cookies.remove("projeqtor", { path: "/", domain: "82.112.59.85" });
          console.log(text);
        });
      //удаление куки
    }
  }


}

export default new ApiService();
