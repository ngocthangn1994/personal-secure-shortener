const linkForm = document.getElementById("linkForm");
const statusMessage = document.getElementById("statusMessage");
const linksContainer = document.getElementById("linksContainer");

// Load all links when page opens
document.addEventListener("DOMContentLoaded", () => {
  loadLinks();
});

// Handle form submit
linkForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const short = document.getElementById("short").value.trim();
  const longUrl = document.getElementById("longUrl").value.trim();
  const userName = document.getElementById("userName").value.trim();
  const passWord = document.getElementById("passWord").value.trim();

  try {
    const response = await fetch("/api/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        short,
        longUrl,
        userName,
        passWord
      })
    });

    const result = await response.json();

    if (!response.ok) {
      statusMessage.textContent = result.message || "Failed to create link";
      statusMessage.style.color = "red";
      return;
    }

    statusMessage.textContent = result.message;
    statusMessage.style.color = "green";

    linkForm.reset();

    // reload saved links after adding a new one
    loadLinks();
  } catch (error) {
    console.error("Error creating link:", error);
    statusMessage.textContent = "Something went wrong";
    statusMessage.style.color = "red";
  }
});

// Load and display all links
async function loadLinks() {
  try {
    const response = await fetch("/api/links");
    const result = await response.json();

    if (!response.ok) {
      linksContainer.innerHTML = "<p>Failed to load links.</p>";
      return;
    }

    const links = result.data;

    if (!links || links.length === 0) {
      linksContainer.innerHTML = "<p>No saved links yet.</p>";
      return;
    }

    linksContainer.innerHTML = "";

    links.forEach((link) => {
      const linkCard = document.createElement("div");
      linkCard.className = "link-card";

      linkCard.innerHTML = `
        <p><strong>Short:</strong> ${link.short}</p>
        <p><strong>Long URL:</strong> <a href="${link.longUrl}" target="_blank">${link.longUrl}</a></p>
        <button class="view-btn" data-short="${link.short}">View Credentials</button>
        <div class="credentials" id="cred-${link.short}"></div>
      `;

      linksContainer.appendChild(linkCard);
    });

    // Add click event for all buttons after rendering
    const buttons = document.querySelectorAll(".view-btn");

    buttons.forEach((button) => {
      button.addEventListener("click", async () => {
        const short = button.getAttribute("data-short");
        await viewCredentials(short);
      });
    });
  } catch (error) {
    console.error("Error loading links:", error);
    linksContainer.innerHTML = "<p>Something went wrong while loading links.</p>";
  }
}

// Fetch and display decrypted credentials for one link
async function viewCredentials(short) {
  try {
    const response = await fetch(`/api/links/${short}`);
    const result = await response.json();

    const credentialsDiv = document.getElementById(`cred-${short}`);

    if (!response.ok) {
      credentialsDiv.innerHTML = `<p style="color:red;">${result.message || "Failed to load credentials"}</p>`;
      return;
    }

    const link = result.data;

    credentialsDiv.innerHTML = `
      <p><strong>Username:</strong> ${link.userName}</p>
      <p><strong>Password:</strong> ${link.passWord}</p>
    `;
  } catch (error) {
    console.error("Error viewing credentials:", error);
    const credentialsDiv = document.getElementById(`cred-${short}`);
    credentialsDiv.innerHTML = `<p style="color:red;">Something went wrong</p>`;
  }
}