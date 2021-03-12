process.env['UV_THREADPOOL_SIZE'] = 128;
import extract from "extract-json-from-string";
import axios from "axios";
import date from "locutus/php/datetime/date";



class ApiService {
  async getAllProjects() {
    let projects = await fetch(
      "http://82.112.59.85:5000/projeqtor/api/Project/all",
      {
        method: "GET",
        cache: "no-cache",
        Accept: "*/*",
        Connection: "keep-alive",
        headers: {
          Authorization: "Basic YXBpX3Byb3ZpZGVyOjU5Qkh3bjd1Z015aQ==",
        },
        redirect: "follow",
      }
    );

    projects = await projects.json();
    return projects;
  }

  async getAllPeople() {
    let people = await fetch(
      "http://82.112.59.85:5000/projeqtor/api/User/all",
      {
        method: "GET",
        cache: "no-cache",
        Accept: "*/*",
        Connection: "keep-alive",
        headers: {
          Authorization: "Basic YXBpX3Byb3ZpZGVyOjU5Qkh3bjd1Z015aQ==",
        },
        redirect: "follow",
      }
    );

    people = await people.json();
    return people;
  }

  async getAllTicketTypes() {
    let types = await fetch(
      "http://82.112.59.85:5000/projeqtor/api/TicketType/all",
      {
        method: "GET",
        cache: "no-cache",
        Accept: "*/*",
        Connection: "keep-alive",

        headers: {
          Authorization: "Basic YXBpX3Byb3ZpZGVyOjU5Qkh3bjd1Z015aQ==",
        },
        redirect: "follow",
      }
    );

    types = await types.json();
    return types;
  }

  async getAllStatus() {
    let statuses = await fetch(
      "http://82.112.59.85:5000/projeqtor/api/Status/all",
      {
        method: "GET",
        cache: "no-cache",
        Accept: "*/*",
        Connection: "keep-alive",

        headers: {
          Authorization: "Basic YXBpX3Byb3ZpZGVyOjU5Qkh3bjd1Z015aQ==",
        },
        redirect: "follow",
      }
    );

    statuses = await statuses.json();
    return statuses;
  }

  async postNewTicket(data, objectType) {
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
    res = await res.text();
    return res;
  }

  uploadFile(newTiket, files) {
    let filedata = new FormData();
    let IdTicket;
    let extractedObjects = extract(newTiket);
    if (extractedObjects.length > 1) {
      IdTicket = extractedObjects[1].items[0].id;
    }

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

      fetch("https://82.112.59.85:5000/projeqtor/tool/saveAttachment.php", {
        method: "POST",
        Accept: "application/json",
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundaryQDNGfxmlTzHBTOSU",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        Connection: "keep-alive",
        redirect: "follow",
        body: filedata,
      })
        .then((res) => res.text())
        .then((text) => console.log(text));
    }
  }

  async getProjeqtorCookie() {


  let algorithm = 'aes-128-ctr';
  let encrypt = 1; // Encrypt
  let key = "testkey111111111";
  let iv = "testkey111111111";
  let plaintext = "admin_form";

  cryptoAsync.cipher(algorithm, encrypt, key, iv, plaintext,
    function(error, ciphertext) {
      if (error) throw error;
      console.log('ciphertext:', ciphertext.toString('hex'));
    }
  );

    // let aesStrPassword = CryptoJS.MD5("testseessioncookie");
    // console.log(aesStrPassword);
    // const loginCrypted = CryptoJS.AES.encrypt("admin_form",
    //  aesStrPassword,
    // { mode: modeCTR, iv: "randomiv", padding: NoPadding });
    // console.log(loginCrypted);

    const cookies = new Cookies();
    axios.defaults.withCredentials = true;

    const setSessionCookie = await fetch(
      `http://82.112.59.85:5000/projeqtor/view/main.php`,
      {
        headers: {
          redirect: "follow",
          //crossDomain: true,
          Accept: "/*",
          "access-control-allow-headers": "*",
          "Access-Control-Allow-Origin": "*",
          mode: "no-cors",
        },
        withCredentials: true,
      }
    );
    let sessionCookie = cookies.get("PHPSESSID");
    console.log(sessionCookie);
    cookies.remove('PHPSESSID');

    let loginData = new FormData();
    let currentDateTimestamp = date("YmdHis");
    let pwdCrypted = "a5a80606043c40d1153d0f48fc3b0092"; //Rxl2PMC3jY58
    pwdCrypted = CryptoJS.MD5(pwdCrypted + currentDateTimestamp);

  
    loginData
      .append("login", loginCrypted)
      .append("password", pwdCrypted)
      .append("rememberMe", "off")
      .append("isLoginPage", "false");

    const setProjeqtorCookie = await axios.post(
      `http://82.112.59.85:5000/projeqtor/tool/loginCheck.php`,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: loginData,
      }
    );

    let projeqtorCookie = cookies.get("projeqtor");
    console.log(projeqtorCookie);
    cookies.remove('projeqtor');
    // console.log(response.data);
    // return response.data;
  }
}

export default new ApiService();
