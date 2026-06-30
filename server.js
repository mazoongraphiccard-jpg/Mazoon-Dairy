// 🔥 ضع إعدادات Firebase الخاصة بك هنا
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let name = prompt("اكتب اسمك الوهمي:");

function send() {
  const msg = document.getElementById("msg").value;

  db.ref("messages").push({
    name: name,
    text: msg
  });

  document.getElementById("msg").value = "";
}

// عرض الرسائل
db.ref("messages").on("child_added", function(snapshot) {
  const data = snapshot.val();

  const div = document.createElement("div");
  div.className = "msg";
  div.innerText = data.name + ": " + data.text;

  document.getElementById("messages").appendChild(div);
});