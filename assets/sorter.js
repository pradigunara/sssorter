import TripleSBiasSorter from "./TripleSBiasSorter.js";

const memberData = {
  SeoYeon: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/03bf1f18-da5a-4554-5b57-50ca30b32200/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/416910dd-7cb6-4a59-c32d-2747d6ed0f00/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/b97887cf-c357-42c0-a828-e16fe2f7a100/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/6f8b3a9c-9231-4e01-9b49-dacdf2908d00/2x",
    color: "#21AEFE",
    emoji: "🐶",
    sNumber: "S1",
  },
  HyeRin: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/4b672dca-5fdf-4c23-29dc-ed3764a6fc00/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/bb6be3f1-66c3-42a7-d09c-aebfac5f0c00/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/f0dea376-64dd-4595-261e-779574759700/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/9f85fe1e-9a65-48f6-250e-d25ce6078800/2x",
    color: "#830CE8",
    emoji: "🐱",
    sNumber: "S2",
  },
  JiWoo: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/c83c9cc2-d5f3-48b6-0199-79294c10d700/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/2b65ae80-386b-45bd-bd6b-85d9bf897700/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/cd7a6354-f140-4cf6-7e60-b653d3801000/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/6e2575bb-a943-4541-b909-49e5ea59ea00/2x",
    color: "#FDF70A",
    emoji: "🐻",
    sNumber: "S3",
  },
  ChaeYeon: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/0716217f-31d3-433d-6dee-a1efeeea5700/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/2caae720-b7d2-4ddd-4ff0-883bd855a400/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/30c1e20d-9fc8-47e4-151e-bed2427fa100/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/d2bec75c-2fa7-4386-039d-5a1a1cba4600/2x",
    color: "#98C64A",
    emoji: "🦌",
    sNumber: "S4",
  },
  YooYeon: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/3f4bdbcc-6909-4a88-b7dd-48674005ae00/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/249f63f8-bd12-4996-fa6f-e1c657c07e00/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/ff672444-6de5-46d7-6e20-006150048e00/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/534e1c60-b1e2-4b06-198b-49cd98069500/2x",
    color: "#DC0B74",
    emoji: "🐰",
    sNumber: "S5",
  },
  SooMin: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/dc9cebef-a368-4874-b48f-c570d8bd4700/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/f9385887-1827-4fe7-06bb-df8522e53000/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/aaf4d6d3-fca8-402c-ec6b-0513d9fde200/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/7705db9e-325d-4d94-ebce-cae9570fb600/2x",
    color: "#F985A4",
    emoji: "🐿️",
    sNumber: "S6",
  },
  NaKyoung: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/b4ac57ba-dcff-43cd-0d3a-34d209fb8e00/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/92072b2a-f286-48a1-fe2a-17be5c230900/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/501728a9-9df5-4b08-ff62-091cffb3f900/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/ba1e37ac-ba7d-48d2-4948-ca34a27c8b00/2x",
    color: "#659AA0",
    emoji: "🐈",
    sNumber: "S7",
  },
  YuBin: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/c1a86acc-aed8-4696-cbe7-7d70c040f100/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/54d2a3b5-9b4f-40a9-e8ad-e6fec9f8fb00/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/e2b293a7-f129-4aea-96fa-b6f391e6ed00/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/df0ee1ae-b6b5-4caf-58c7-f1d4a470a600/2x",
    color: "#FDE4E0",
    emoji: "🐯",
    sNumber: "S8",
  },
  Kaede: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/5465661c-d6f2-4e01-3aea-9c0d3432f900/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/0a71c37d-aea0-4084-3082-487d1cbed500/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/c2471b88-ff29-4abe-6612-9e1793d30c00/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/f01a7cd6-b8ec-4092-1ca1-204fdada1100/2x",
    color: "#FDB634",
    emoji: "🍁",
    sNumber: "S9",
  },
  DaHyun: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/b833c51a-759d-4791-e1b6-ba022316ab00/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/525c992f-f833-419a-6ccd-17ed2c041f00/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/5f28a8e7-392c-4c19-1bca-b3f8fd295000/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/1586be14-581d-495d-2c3e-6bae64091400/2x",
    color: "#FE9BD6",
    emoji: "🍒",
    sNumber: "S10",
  },
  Kotone: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/d0c9a702-684f-4b82-184c-006b47eb9d00/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/afef654a-db00-4d42-26f4-88569ec5f500/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/4e9bbee8-ae13-47cf-6563-32a87aa59f00/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/d7cb509c-736c-448d-55cb-9b45fd90ef00/2x",
    color: "#E3C500",
    emoji: "🦭",
    sNumber: "S11",
  },
  YeonJi: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/756121b9-5039-48c2-0631-ac6c699e2f00/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/0f41f89c-60f0-49c4-2afd-33c3f9913e00/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/6ec23f74-e9ef-4680-ee30-99645a8bd100/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/d1b0ab30-b3c2-4900-915a-1e48da76c300/2x",
    color: "#5974FA",
    emoji: "🦆",
    sNumber: "S12",
  },
  Nien: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/d9359e03-f4b9-46f1-51e5-bfd19e621000/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/ed3911e2-3df1-4e60-cc6f-ede8044a4000/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/6c7b13bc-b785-4af2-1161-c7314f0d5000/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/d07869c3-6423-40cb-ea24-126704655500/2x",
    color: "#FD963D",
    emoji: "🐑",
    sNumber: "S13",
  },
  SoHyun: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/76e1fa01-c28f-4827-bbe6-4c3bdee9b200/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/278653e6-39f6-40b1-3fc8-4468be6a3900/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/cbfd7149-9268-4382-b2bf-be144a4bf400/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/70f2c3c1-6461-4053-8367-19641c3fce00/2x",
    color: "#1223B2",
    emoji: "🐺",
    sNumber: "S14",
  },
  Xinyu: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/bc561ebd-7357-4608-c4a3-7bad047a1400/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/c79dc356-1a81-4695-8e6a-123f9c1adf00/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/0f10339c-bf4e-48c4-fa36-93c9631b6700/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/51a4cc9e-d295-49e5-8b65-f6098f6eaf00/2x",
    color: "#CA1E20",
    emoji: "🦊",
    sNumber: "S15",
  },
  Mayu: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/84eba7a0-bb87-4e95-5839-15a8c66dbf00/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/26935eb3-8c0f-4155-ab44-a0e761a73a00/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/35e47ea3-252b-44d6-acae-08a15af93e00/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/268170a7-eb3d-4d76-ce21-66d0e3cf1a00/2x",
    color: "#FB9074",
    emoji: "🐇",
    sNumber: "S16",
  },
  Lynn: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/c2297057-ab06-4ce3-c20d-388f9c54b500/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/b5b3221a-223b-48f6-eb58-db7c56188f00/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/fad62fa9-f2aa-4c08-e19a-96a42b249a00/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/c391b879-c81c-405f-05b4-0bbef8838d00/2x",
    color: "#AC60B8",
    emoji: "🦈",
    sNumber: "S17",
  },
  JooBin: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/08688a9e-f754-48e5-2471-6a53341b5700/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/cd8122d6-4449-4cf3-0f5b-25863f11cc00/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/2f622bea-832e-41e2-1e66-74c914aa0f00/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/3d7b55b6-6137-4003-e205-78b6e6964e00/2x",
    color: "#B7F54C",
    emoji: "🐣",
    sNumber: "S18",
  },
  HaYeon: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/26bb202c-5394-40c3-6cf6-abde96d63400/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/f35df853-be65-4c19-19c0-df9aee081700/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/a1aeb5d6-a752-47b7-2530-8e3f3a89ca00/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/b3b0fdd5-50de-4c9b-8a8a-23a22f904500/2x",
    color: "#52D8BB",
    emoji: "🐹",
    sNumber: "S19",
  },
  ShiOn: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/8766df55-2d91-49c7-1806-497aea1d5600/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/6d5233e1-62bf-4542-f1bd-1fc09f13cd00/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/7ebf7501-ba0a-4adb-9d3a-bc9c9c107300/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/14d056f6-cada-4cbd-690a-32639d066800/2x",
    color: "#FF428A",
    emoji: "🍞",
    sNumber: "S20",
  },
  ChaeWon: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/a2dbeaea-4219-461c-e78a-4d55ed582d00/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/4e0122aa-d8e7-4ddf-9384-ddb41b068800/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/b5849b3f-f388-4a00-0836-c1518f8f6f00/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/e8ef96e9-912f-46fb-6783-219e79379d00/2x",
    color: "#C3A4E0",
    emoji: "🎀",
    sNumber: "S21",
  },
  Sullin: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/835cc6d6-7091-4df0-a81b-61682fb5d400/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/4387873a-eb92-4cc7-57a3-c8261581b500/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/7a8bf04f-b935-4add-1e15-6a7e88e33f00/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/d1ba0d7f-349a-44ec-73e5-fbb964ba2200/2x",
    color: "#7DBA8D",
    emoji: "⛄️",
    sNumber: "S22",
  },
  SeoAh: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/004c4f40-ea3f-4162-d018-fb6bf34ccb00/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/5e319a09-95ce-4475-4ddb-34cc07e4dd00/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/52bb3ac7-273c-49ac-51a4-415f76f22a00/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/46cf9aaa-dba6-4f7c-30d9-bb8e14323f00/2x",
    color: "#D0F3FF",
    emoji: "☀️",
    sNumber: "S23",
  },
  JiYeon: {
    picSet1: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/5cf73b72-b10b-4065-02dc-6c2c997a1900/2x",
    picSet2: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/fea28064-76ee-4af9-0608-677efbd50e00/2x",
    picSet3: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/98d134ac-bb5e-4fdb-82f6-cd39119d0c00/2x",
    picSet4: "https://imagedelivery.net/qQuMkbHJ-0s6rwu8vup_5w/6e3b3fb9-4042-447a-541f-ca039d59a900/2x",
    color: "#FFAB64",
    emoji: "🦢",
    sNumber: "S24",
  },
};

const memberNames = Object.keys(memberData);
let sorter = new TripleSBiasSorter(memberNames, memberData);
let memberPicId = {};

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

function initMemberPic() {
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  const picSet = isDarkMode ? "picSet4" : "picSet2";
  memberPicId = {};
  for (const memberName of memberNames) {
    memberPicId[memberName] = memberData[memberName][picSet];
  }
}

// Preload images
function preloadImages() {
  for (const memberName of memberNames) {
    for (let i = 1; i <= 4; i++) {
      const img = new Image();
      img.src = memberData[memberName][`picSet${i}`];
    }
  }
}

// Dark mode functionality
function toggleDarkMode() {
  const body = document.body;
  const isDarkMode = body.classList.toggle("dark-mode");
  const themeToggleText = document.querySelector(".theme-toggle-text");
  const themeToggleIcon = document.querySelector(".theme-toggle-icon svg");

  // Update toggle text and icon
  if (isDarkMode) {
    themeToggleText.textContent = "Light Mode";
    themeToggleIcon.innerHTML =
      '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
  } else {
    themeToggleText.textContent = "#DarkMode";
    themeToggleIcon.innerHTML =
      '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
  }

  // Save preference to localStorage
  localStorage.setItem("darkMode", isDarkMode);
  initMemberPic();
  showFinal({ skipIncrement: true });
}

// Check for saved theme preference on page load
document.addEventListener("DOMContentLoaded", function () {
  const savedDarkMode = localStorage.getItem("darkMode");
  initMemberPic();

  if (savedDarkMode === "true") {
    document.body.classList.add("dark-mode");
    document.querySelector(".theme-toggle-text").textContent = "Light Mode";
    document.querySelector(".theme-toggle-icon svg").innerHTML =
      '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
  }

  // Call preloadImages
  preloadImages();
});

function initList() {
  const memEmojis = memberNames.map((m) => memberData[m].emoji);
  const topEmojis = memEmojis.slice(0, 12).join(" ");
  const botEmojis = memEmojis.slice(12).join(" ");
  document.getElementById("member-emojis").innerHTML =
    `${topEmojis}<br/>${botEmojis}`;
  sorter.reset();
}

// Preload critical member images for first comparison
function preloadInitialImages() {
  const comparison = sorter.getCurrentComparison();
  if (comparison) {
    const { memberAName, memberBName } = comparison;

    // Preload all image sets for these members
    for (let i = 1; i <= 4; i++) {
      const picSet = `picSet${i}`;
      if (memberData[memberAName][picSet]) {
        const imgA = new Image();
        imgA.src = memberData[memberAName][picSet];
      }
      if (memberData[memberBName][picSet]) {
        const imgB = new Image();
        imgB.src = memberData[memberBName][picSet];
      }
    }
  }
}

function handleSort(preference) {
  if (sorter.isComplete()) return;

  if (preference === "A") {
    sorter.preferMemberA();
  } else if (preference === "B") {
    sorter.preferMemberB();
  } else {
    sorter.declareTie();
  }

  if (sorter.isComplete()) {
    const progress = sorter.getProgress();
    const heartCount = 5;
    const filledHearts = Math.floor((progress.progressPercent / 100) * heartCount);
    const heartDisplay =
      "♥".repeat(filledHearts) + "♡".repeat(heartCount - filledHearts);
    const str = `<strong>Gravity #${progress.currentQuestion}</strong><br>${heartDisplay} ${progress.progressPercent}% sorted`;
    document.getElementById("battleNumber").innerHTML = str;
    showResult();
  } else {
    // Pass the flag to showFinal - defer to allow interaction response to paint first
    requestAnimationFrame(() => {
      showFinal({ selectedFlag: preference });
    });
  }
}

function showResult({ full = false } = {}) {
  let ranking = 1;
  let sameRank = 1;
  let str = "";
  const listResult = [];
  const sortedMembers = sorter.getSortedMembers();

  const iterCount = full ? sortedMembers.length : sortedMembers.length / 2;

  str += "<div class='results-list'><h2>Bias Ranking Result</h2><ul>";
  for (let i = 0; i < iterCount; i++) {
    const mem = sortedMembers[i];
    const disp = `${mem}${memberData[mem].emoji}`;
    listResult.push(disp);

    str += "<li><span class='number'>" + ranking + "</span> " + disp + "</li>";

    if (i < iterCount - 1) {
      if (sorter.equal[i] == i + 1) {
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

  document.getElementById("showMore").style.display = "inline";

  const shareText = `My %23tripleS Bias Ranking:%0A${listResult.join("%0A")}%0A> https://sssorter.pages.dev`;
  const tweetBtn = document.getElementById("tweet-button");

  tweetBtn.style.display = "inline-block";
  tweetBtn.href = `https://twitter.com/intent/tweet?text=${shareText}`;

  const sssongsBtn = document.getElementById("sssongs-button");
  sssongsBtn.style.display = "inline-block";
}

function toggleResult() {
  const showMoreText = document.getElementById("showMore").innerText;

  if (showMoreText === "Show More") {
    document.getElementById("showMore").innerText = "Show Less";
    showResult({ full: true });
  } else {
    document.getElementById("showMore").innerText = "Show More";
    showResult({ full: false });
  }
}

function showFinal({ skipIncrement = false, selectedFlag = "" } = {}) {
  if (!skipIncrement) {
    const progress = sorter.getProgress();
    const heartCount = 5;
    const filledHearts = Math.floor((progress.progressPercent / 100) * heartCount);
    const heartDisplay =
      "♥".repeat(filledHearts) + "♡".repeat(heartCount - filledHearts);
    var str0 = `<strong>Gravity #${progress.currentQuestion}</strong><br>${heartDisplay} ${progress.progressPercent}% sorted`;
    document.getElementById("battleNumber").innerHTML = str0;
  }

  const optionA = document.getElementById("optionA");
  const optionB = document.getElementById("optionB");

  const comparison = sorter.getCurrentComparison();

  // Get the member indices currently displayed in optionA and optionB
  // Use -1 as a default if the data attribute is not set (initial load)
  const currentMemberIndexA = parseInt(optionA.dataset.memberIndex, 10) || -1;
  const currentMemberIndexB = parseInt(optionB.dataset.memberIndex, 10) || -1;

  // Determine the next member indices
  const nextMemberIndexA = comparison.memberA;
  const nextMemberIndexB = comparison.memberB;

  // Determine the next content
  const nextContentA = toNameFace(comparison.memberAName);
  const nextContentB = toNameFace(comparison.memberBName);

  // Batch DOM cleanup operations
  optionA.classList.remove(
    "fade-out",
    "fade-in",
    "flip-out",
    "flip-in",
    "selected-glow",
  );
  optionA.style.cssText = ""; // Clear all inline styles at once

  optionB.classList.remove(
    "fade-out",
    "fade-in",
    "flip-out",
    "flip-in",
    "selected-glow",
  );
  optionB.style.cssText = ""; // Clear all inline styles at once

  if (selectedFlag === "") {
    // Initial state or tie (if tie were active) - batch all updates
    optionA.innerHTML = nextContentA;
    optionA.style.setProperty(
      "--member-color",
      memberData[comparison.memberAName].color,
    );
    optionA.dataset.memberIndex = nextMemberIndexA;
    optionA.style.visibility = "visible";
    optionA.style.opacity = 1;

    optionB.innerHTML = nextContentB;
    optionB.style.setProperty(
      "--member-color",
      memberData[comparison.memberBName].color,
    );
    optionB.dataset.memberIndex = nextMemberIndexB;
    optionB.style.visibility = "visible";
    optionB.style.opacity = 1;
    return; // Exit the function
  }

  // Apply initial animation states based on content change and selection
  // Compare the member indices to see if the content is changing
  const optionAContentChanged = currentMemberIndexA !== nextMemberIndexA;
  const optionBContentChanged = currentMemberIndexB !== nextMemberIndexB;

  if (optionAContentChanged) {
    optionA.classList.add("flip-out");
  } else {
    // optionA.classList.add("fade-out"); // Use fade for no content change
  }

  if (optionBContentChanged) {
    optionB.classList.add("flip-out");
  } else {
    // optionB.classList.add("fade-out"); // Use fade for no content change
  }

  // Add glow to the selected option
  if (selectedFlag === "A") {
    // Option A was selected
    optionA.classList.add("selected-glow");
  } else {
    // Option B was selected
    optionB.classList.add("selected-glow");
  }

  // Wait for the fade-out/flip-out transition to complete
  setTimeout(() => {
    // Batch DOM updates to prevent layout thrashing
    requestAnimationFrame(() => {
      // Update content and properties in batch
      optionA.innerHTML = nextContentA;
      optionA.style.setProperty(
        "--member-color",
        memberData[comparison.memberAName].color,
      );
      optionA.dataset.memberIndex = nextMemberIndexA;

      optionB.innerHTML = nextContentB;
      optionB.style.setProperty(
        "--member-color",
        memberData[comparison.memberBName].color,
      );
      optionB.dataset.memberIndex = nextMemberIndexB;

      // Apply animations after DOM updates
      if (optionAContentChanged) {
        optionA.classList.remove("flip-out");
        optionA.classList.add("flip-in");
      } else {
        optionA.classList.remove("fade-out");
        optionA.classList.add("fade-in");
      }

      if (optionBContentChanged) {
        optionB.classList.remove("flip-out");
        optionB.classList.add("flip-in");
      } else {
        optionB.classList.remove("fade-out");
        optionB.classList.add("fade-in");
      }
    });

    // After the second transition, remove the animation classes and glow
    setTimeout(() => {
      optionA.classList.remove("fade-in", "flip-in", "selected-glow");
      optionB.classList.remove("fade-in", "flip-in", "selected-glow");
      // Ensure final state is visible and not transformed
      optionA.style.opacity = 1;
      optionB.style.opacity = 1;
      optionA.style.transform = "rotateY(0deg)";
      optionB.style.transform = "rotateY(0deg)";
    }, 200); // Match the transition duration
  }, 200); // Match the transition duration
}

function toNameFace(mem) {
  const disp = `
    <div class='photocard-image-container'>
      <img src='${memberPicId[mem]}' alt='${mem}' class='photocard-image'/>
      <div class='member-badge'>${memberData[mem].sNumber}</div>
    </div>
    <div class='photocard-info'>
      <div class='member-name' style='color: ${memberData[mem].color};'>${mem} ${memberData[mem].emoji || ""}</div>
    </div>
  `;

  return disp;
}

document.addEventListener("DOMContentLoaded", () => {
  initMemberPic();
  initList();
  preloadInitialImages();
  showFinal();

  document.getElementById("optionA").addEventListener("click", () => handleSort("A"));
  document.getElementById("optionB").addEventListener("click", () => handleSort("B"));
  document.querySelector(".theme-toggle").addEventListener("click", toggleDarkMode);
  document.getElementById("showMore").addEventListener("click", toggleResult);
});
