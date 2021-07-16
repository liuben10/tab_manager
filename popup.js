// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");
let inputSearch = document.getElementById("inputSearch");
let tabSelection = document.getElementById("tabSelection");
let closeAll = document.getElementById("closeAll");
let searchText = "";

// This is used to initialize and render the tabs right now. TODO
// probably something in chrome lifecycle we could use to initialize.
chrome.storage.sync.get("color", async ({ _color }) => {
  clearAndRenderAllTabs();
});

closeAll.addEventListener("click", async () => {
    let searchText = inputSearch.value;
    let allOpenTabs = await chrome.tabs.query({currentWindow: true });

    filteredTabs = filterTabsBySearchText(allOpenTabs, searchText);

    idx = 0;
    for (let tab of filteredTabs) {
        chrome.tabs.remove(tab.id);
    }
})

inputSearch.addEventListener("input", async (event) => { 
    let allOpenTabs = await chrome.tabs.query({currentWindow: true });

    let searchText = inputSearch.value;

    removeAllChildNodes(tabSelection);

    filteredTabs = filterTabsBySearchText(allOpenTabs, searchText);

    idx = 0;
    for (let tab of filteredTabs) {
        let tabListingName = "tab_" + tab.id;
        let tabOption = document.createElement("div");
        tabOption.textContent = trunc(tab.title);
        tabOption.classList.add("option")
        tabSelection.appendChild(tabOption);
        idx += 1;
    }
});

function filterTabsBySearchText(allOpenTabs, searchText) {
    if (searchText == "") {
        return allOpenTabs;
    }
    let filteredTabs = [];
    for (let tab of allOpenTabs) {
        if (tab.title !== null && tab.title.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
            filteredTabs.push(tab);
        } else if (tab.url !== null && tab.url.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
            filteredTabs.push(tab);
        }
    }
    return filteredTabs;
}

async function clearAndRenderAllTabs() {
    let tabList = await chrome.tabs.query({});

    removeAllChildNodes(tabSelection);

    idx = 0;
    for (let tab of tabList) {
        let tabListingName = "tab_" + tab.id;
        let tabOption = document.createElement("div");
        tabOption.textContent = trunc(tab.title);
        tabOption.classList.add("option")
        tabSelection.appendChild(tabOption);
        idx += 1;
    }    
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function trunc(text) {
    if (text.length > 16) {
        return text.substring(0, 16) + "...";
    }
    return text;    
}