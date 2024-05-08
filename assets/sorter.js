var picSet1 = {
  Seoyeon: "dcc6dc8a-81f1-47eb-b0f5-d853a8c26100",
  Hyerin: "d7b9432c-c0fc-4cfb-37bd-f4b088800200",
  Jiwoo: "edbcd6fe-b11e-496d-fad5-39cdfffb4200",
  Chaeyeon: "a7089ece-89c8-4c54-3b32-804d0f452400",
  Yooyeon: "69c5ee85-6787-481f-3532-ae47f4254700",
  Soomin: "99243004-807a-469d-b2d2-79fe44241900",
  Nakyoung: "7645e9bd-4247-4bab-1ff1-e4a8d383df00",
  Yubin: "64ab77ec-1724-4824-ef9a-31d586f2d300",
  Kaede: "a873565b-3605-4523-e3a6-45cf88deab00",
  Dahyun: "b1d8e55a-e672-4c7f-7ec5-295f24c3a700",
  Kotone: "6206faaa-51f9-4feb-62d0-c5631b1f9300",
  Yeonji: "f4e0f53a-c30a-4ad4-f583-c251b8e72d00",
  Nien: "d3fa4827-2d20-4149-806e-c07841a38000",
  Sohyun: "78e368f2-614f-4548-acbd-9cce27082c00",
  Xinyu: "58bbb237-983c-4bfe-9a44-22896dc2c200",
  Mayu: "281a51fb-9b08-46de-c509-75d6e85aa000",
  Lynn: "6165a55b-d286-4608-3fe1-02173a61d600",
  Joobin: "2d938ba4-3797-43be-6b5e-36a8f6bf5500",
  Hayeon: "6e64c029-7024-411d-335f-631dbf5ddb00",
  Shion: "42ff8905-abd8-4c69-5851-be37ddd19a00",
  Chaewon: "87620cea-8844-4fbe-51de-48998dfa4900",
  Sullin: "7a0a188b-eaa4-4c8c-4f3b-e4fe151eae00",
  Seoah: "9ad024db-35e5-41cf-2183-9fa20dc60200",
  Jiyeon: "6882311f-63a5-4fc4-ec6e-17f7de2a0400",
};

var rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
// var memberPicId = [picSet1][rand(0, 1)];
var memberPicId = picSet1;

var toPicUrl = (id) =>
  `https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/${id}/2x`;

var memberColor = {
  Seoyeon: "#21AEFE",
  Hyerin: "#830CE8",
  Jiwoo: "#FDF70A",
  Chaeyeon: "#98C64A",
  Yooyeon: "#DC0B74",
  Soomin: "#F985A4",
  Nakyoung: "#659AA0",
  Yubin: "#FDE4E0",
  Kaede: "#FDB634",
  Dahyun: "#FE9BD6",
  Kotone: "#E3C500",
  Yeonji: "#5974FA",
  Nien: "#FD963D",
  Sohyun: "#1223B2",
  Xinyu: "#CA1E20",
  Mayu: "#FB9074",
  Lynn: "#AC60B8",
  Joobin: "#B7F54C",
  Hayeon: "#52D8BB",
  Shion: "#FF428A",
  Chaewon: "#C3A4E0",
  Sullin: "#7DBA8D",
  Seoah: "#D0F3FF",
  Jiyeon: "#FFAB64",
};

var memberEmoji = {
  Seoyeon: "🐶",
  Hyerin: "🐱",
  Jiwoo: "🐻",
  Chaeyeon: "🦌",
  Yooyeon: "🐰",
  Soomin: "🐿️",
  Nakyoung: "🐈",
  Yubin: "🐯",
  Kaede: "🍁",
  Dahyun: "🍒",
  Kotone: "🦭",
  Yeonji: "🦆",
  Nien: "🐑",
  Sohyun: "🐺",
  Xinyu: "🦊",
  Mayu: "🐇",
  Lynn: "🦈",
  Joobin: "🐣",
  Hayeon: "🐹",
  Shion: "🍞",
  Chaewon: "🎀",
  Sullin: "⛄️",
  Seoah: "☀️",
  Jiyeon: "🦢",
};

var namMember = new Array(
  "Seoyeon",
  "Hyerin",
  "Jiwoo",
  "Chaeyeon",
  "Yooyeon",
  "Soomin",
  "Nakyoung",
  "Yubin",
  "Kaede",
  "Dahyun",
  "Kotone",
  "Yeonji",
  "Nien",
  "Sohyun",
  "Xinyu",
  "Mayu",
  "Lynn",
  "Joobin",
  "Hayeon",
  "Shion",
  "Chaewon",
  "Sullin",
  "Seoah",
  "Jiyeon",
);

var lstMember = new Array();
var parent = new Array();
var equal = new Array();
var rec = new Array();
var cmp1, cmp2;
var head1, head2;
var nrec;
var numQuestion;
var totalSize;
var finishSize;
var finishFlag;

function initList() {
  const memEmojis = Object.values(memberEmoji);
  const topEmojis = memEmojis.slice(0, 12).join(" ");
  const botEmojis = memEmojis.slice(12).join(" ");
  document.getElementById("member-emojis").innerHTML =
    `${topEmojis}<br/>${botEmojis}`;
  namMember.sort(() => 0.5 - Math.random());

  var n = 0;
  var mid;
  var i;

  lstMember[n] = new Array();

  for (i = 0; i < namMember.length; i++) {
    lstMember[n][i] = i;
  }

  parent[n] = -1;
  totalSize = 0;
  n++;

  for (i = 0; i < lstMember.length; i++) {
    if (lstMember[i].length >= 2) {
      mid = Math.ceil(lstMember[i].length / 2);
      lstMember[n] = new Array();
      lstMember[n] = lstMember[i].slice(0, mid);
      totalSize += lstMember[n].length;
      parent[n] = i;
      n++;
      lstMember[n] = new Array();
      lstMember[n] = lstMember[i].slice(mid, lstMember[i].length);
      totalSize += lstMember[n].length;
      parent[n] = i;
      n++;
    }
  }

  for (i = 0; i < namMember.length; i++) {
    rec[i] = 0;
  }

  nrec = 0;

  for (i = 0; i <= namMember.length; i++) {
    equal[i] = -1;
  }

  cmp1 = lstMember.length - 2;
  cmp2 = lstMember.length - 1;
  head1 = 0;
  head2 = 0;
  numQuestion = 1;
  finishSize = 0;
  finishFlag = 0;
}

function sortList(flag) {
  var i;
  var str;

  if (flag < 0) {
    rec[nrec] = lstMember[cmp1][head1];
    head1++;
    nrec++;
    finishSize++;

    while (equal[rec[nrec - 1]] != -1) {
      rec[nrec] = lstMember[cmp1][head1];
      head1++;
      nrec++;
      finishSize++;
    }
  } else if (flag > 0) {
    rec[nrec] = lstMember[cmp2][head2];
    head2++;
    nrec++;
    finishSize++;

    while (equal[rec[nrec - 1]] != -1) {
      rec[nrec] = lstMember[cmp2][head2];
      head2++;
      nrec++;
      finishSize++;
    }
  } else {
    rec[nrec] = lstMember[cmp1][head1];
    head1++;
    nrec++;
    finishSize++;
    while (equal[rec[nrec - 1]] != -1) {
      rec[nrec] = lstMember[cmp1][head1];
      head1++;
      nrec++;
      finishSize++;
    }
    equal[rec[nrec - 1]] = lstMember[cmp2][head2];
    rec[nrec] = lstMember[cmp2][head2];
    head2++;
    nrec++;
    finishSize++;
    while (equal[rec[nrec - 1]] != -1) {
      rec[nrec] = lstMember[cmp2][head2];
      head2++;
      nrec++;
      finishSize++;
    }
  }

  if (head1 < lstMember[cmp1].length && head2 == lstMember[cmp2].length) {
    while (head1 < lstMember[cmp1].length) {
      rec[nrec] = lstMember[cmp1][head1];
      head1++;
      nrec++;
      finishSize++;
    }
  } else if (
    head1 == lstMember[cmp1].length &&
    head2 < lstMember[cmp2].length
  ) {
    while (head2 < lstMember[cmp2].length) {
      rec[nrec] = lstMember[cmp2][head2];
      head2++;
      nrec++;
      finishSize++;
    }
  }

  if (head1 == lstMember[cmp1].length && head2 == lstMember[cmp2].length) {
    for (i = 0; i < lstMember[cmp1].length + lstMember[cmp2].length; i++) {
      lstMember[parent[cmp1]][i] = rec[i];
    }

    lstMember.pop();
    lstMember.pop();
    cmp1 = cmp1 - 2;
    cmp2 = cmp2 - 2;
    head1 = 0;
    head2 = 0;

    if (head1 == 0 && head2 == 0) {
      for (i = 0; i < namMember.length; i++) {
        rec[i] = 0;
      }
      nrec = 0;
    }
  }

  if (cmp1 < 0) {
    str =
      "Round " +
      (numQuestion - 1) +
      " (" +
      Math.floor((finishSize * 100) / totalSize) +
      "% complete)";
    document.getElementById("battleNumber").innerHTML = str;
    showResult();
    finishFlag = 1;
  } else {
    showFinal();
  }
}

function showResult() {
  var ranking = 1;
  var sameRank = 1;
  var str = "";
  var i;
  var listResult = [];

  str += "<div class='results-list'><h2>Bias Ranking Result</h2><ul>";
  for (i = 0; i < namMember.length; i++) {
    const mem = namMember[lstMember[0][i]];
    const disp = `${mem}${memberEmoji[mem]}`;
    listResult.push(disp);

    str += "<li><span class='number'>" + ranking + "</span> " + disp + "</li>";

    if (i < namMember.length - 1) {
      if (equal[lstMember[0][i]] == lstMember[0][i + 1]) {
        sameRank++;
      } else {
        ranking += sameRank;
        sameRank = 1;
      }
    }
  }

  str += "</ul>";
  document.getElementById("battleResult").innerHTML = str;
  document.getElementById("page-sorter").style.display = "none";

  const shareText = `My %23tripleS Bias Ranking:%0A${listResult.join("%0A")}%0A> https://sssorter.pages.dev`;
  const tweetBtn = document.getElementById("tweet-button");
  tweetBtn.style.display = "inline";
  tweetBtn.href = `https://twitter.com/intent/tweet?text=${shareText}`;
}

function showFinal() {
  var str0 =
    "Round " +
    numQuestion +
    " (" +
    Math.floor((finishSize * 100) / totalSize) +
    "% complete)";
  var str1 = "" + toNameFace(lstMember[cmp1][head1]);
  var str2 = "" + toNameFace(lstMember[cmp2][head2]);

  document.getElementById("battleNumber").innerHTML = str0;
  document.getElementById("optionA").innerHTML = str1;
  document.getElementById("optionB").innerHTML = str2;
  numQuestion++;
}

function toNameFace(n) {
  const mem = namMember[n];
  const disp = `<div>
  <span style='color:${memberColor[mem]};text-shadow: 1px 2px #808080;'>${mem}</span><br><span>${memberEmoji[mem] || ""}</span> 
  <img src='${toPicUrl(memberPicId[mem])}' style='max-height:100%;max-width:100%'/>
</div>`;

  return disp;
}
