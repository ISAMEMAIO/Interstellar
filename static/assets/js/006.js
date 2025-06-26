// Settings.js - Cleaned for Interstellar

document.addEventListener("DOMContentLoaded", () => {
  const liteToggle = document.getElementById("lite-toggle");
  if (!liteToggle) {
    console.error("Lite Version toggle not found.");
    return;
  }
  liteToggle.addEventListener("change", () => {
    if (liteToggle.checked) {
      window.location.href = "https://google.com/";
    }
  });
});

}

  // Background Image
  const saveButton = document.getElementById("save-button");
  const backgroundInput = document.getElementById("background-input");
  const resetButton = document.getElementById("reset-button");
  if (saveButton && backgroundInput && resetButton) {
    saveButton.addEventListener("click", () => {
      const imageURL = backgroundInput.value;
      if (imageURL.trim() !== "") {
        localStorage.setItem("backgroundImage", imageURL);
        document.body.style.backgroundImage = `url('${imageURL}')`;
        backgroundInput.value = "";
      }
    });
    resetButton.addEventListener("click", () => {
      localStorage.removeItem("backgroundImage");
      document.body.style.backgroundImage = "url('default-background.jpg')";
      window.location.reload();
    });

    // Apply saved background on load
    const savedBg = localStorage.getItem("backgroundImage");
    if (savedBg) {
      document.body.style.backgroundImage = `url('${savedBg}')`;
    }
  }

  // Search Engine Dropdown
  const engineDropdown = document.getElementById("engine");
  if (engineDropdown) {
    const selectedEngineName = localStorage.getItem("enginename");
    if (selectedEngineName) {
      engineDropdown.value = selectedEngineName;
    }
  }

  // Theme Dropdown
  const themeDropdown = document.getElementById("dropdown");
  if (themeDropdown) {
    const selectedValue = localStorage.getItem("selectedOption") || "d";
    themeDropdown.value = selectedValue;

    themeDropdown.addEventListener("change", () => {
      const selected = themeDropdown.value;
      localStorage.setItem("selectedOption", selected);
      // Optionally: applyTheme(selected);
      // location.reload(); // if needed
    });
  }
});

// Search Engine Change
function EngineChange(dropdown) {
  const selectedEngine = dropdown.value;
  const engineUrls = {
    Google: "https://www.google.com/search?q=",
    Bing: "https://www.bing.com/search?q=",
    DuckDuckGo: "https://duckduckgo.com/?q=",
    Qwant: "https://www.qwant.com/?q=",
    Startpage: "https://www.startpage.com/search?q=",
    SearchEncrypt: "https://www.searchencrypt.com/search/?q=",
    Ecosia: "https://www.ecosia.org/search?q=",
  };
  localStorage.setItem("engine", engineUrls[selectedEngine]);
  localStorage.setItem("enginename", selectedEngine);
  dropdown.value = selectedEngine;
}

// Save Custom Engine
function SaveEngine() {
  const customEngine = document.getElementById("engine-form").value;
  if (customEngine.trim() !== "") {
    localStorage.setItem("engine", customEngine);
    localStorage.setItem("enginename", "Custom");
  }
}

// Export/Import Save Data
function exportSaveData() {
  const getCookies = () => {
    const cookies = document.cookie.split("; ");
    const cookieObj = {};
    cookies.forEach(cookie => {
      const [name, value] = cookie.split("=");
      cookieObj[name] = value;
    });
    return cookieObj;
  };
  const getLocalStorage = () => {
    const localStorageObj = {};
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorageObj[key] = localStorage.getItem(key);
      }
    }
    return localStorageObj;
  };
  const data = {
    cookies: getCookies(),
    localStorage: getLocalStorage(),
  };
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "save_data.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importSaveData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.onchange = event => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.cookies) {
          Object.entries(data.cookies).forEach(([key, value]) => {
            document.cookie = `${key}=${value}; path=/`;
          });
        }
        if (data.localStorage) {
          Object.entries(data.localStorage).forEach(([key, value]) => {
            localStorage.setItem(key, value);
          });
        }
        alert("Your save data has been imported. Please test it out.");
        alert("If you find any issues then report it in GitHub or the Interstellar Discord.");
      } catch (error) {
        console.error("Error parsing JSON file:", error);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}
