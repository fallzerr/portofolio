document.addEventListener("DOMContentLoaded", () => {
    // 1. Logika Hamburger Menu (Mobile Responsive)
    const mobileMenu = document.getElementById("mobile-menu");
    const navMenu = document.querySelector(".nav-menu");

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener("click", (e) => {
            e.stopPropagation();
            navMenu.classList.toggle("active");
        });

        document.addEventListener("click", (e) => {
            if (!mobileMenu.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove("active");
            }
        });
    }

    // 2. Logika Theme Switcher (Dark / Cream Light)
    const themeToggleBtn = document.getElementById("theme-toggle");
    
    if (themeToggleBtn) {
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "dark") {
            document.body.classList.add("dark-mode");
            themeToggleBtn.textContent = "Light";
        } else {
            themeToggleBtn.textContent = "Dark";
        }

        themeToggleBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            document.body.classList.toggle("dark-mode");
            
            if (document.body.classList.contains("dark-mode")) {
                localStorage.setItem("theme", "dark");
                themeToggleBtn.textContent = "Light";
            } else {
                localStorage.setItem("theme", "light");
                themeToggleBtn.textContent = "Dark";
            }
        });
    }

    // 3. Logika Load Data Proyek Dinamis (JSON)
    const projectContainer = document.getElementById("dynamic-projects");
    if (projectContainer) {
        fetch("assets/js/projects-data.json")
            .then(response => response.json())
            .then(data => {
                projectContainer.innerHTML = "";
                data.forEach(proj => {
                    const card = document.createElement("div");
                    card.className = "content-card";
                    card.innerHTML = `
                        <div class="card-header-flex">
                            <h2 class="card-title-style">${proj.title}</h2>
                            <span class="card-badge">${proj.category}</span>
                        </div>
                        <p class="card-desc">${proj.description}</p>
                        <div class="card-tags-flex">
                            ${proj.tags.map(tag => `<span class="card-tag-item">${tag}</span>`).join("")}
                        </div>
                    `;
                    projectContainer.appendChild(card);
                });
            })
            .catch(err => console.log("Gagal memuat data proyek:", err));
    }

    // 4. Logika Live Analytics API Fetch (Backend Integration)
    const statVisits = document.getElementById("stat-visits");
    const apiStatusBadge = document.getElementById("api-status-badge");

    if (statVisits) {
        const apiUrl = window.location.port === "8000" ? "/api/stats" : null;

        if (apiUrl) {
            fetch(apiUrl)
                .then(res => res.json())
                .then(data => {
                    statVisits.textContent = data.total_visitors;
                    if (apiStatusBadge) {
                        apiStatusBadge.textContent = "API Online";
                        apiStatusBadge.style.color = "#10B981";
                    }
                })
                .catch(() => {
                    statVisits.textContent = "482 (Demo)";
                    if (apiStatusBadge) apiStatusBadge.textContent = "Offline Mode";
                });
        } else {
            statVisits.textContent = "482 (Static)";
            if (apiStatusBadge) {
                apiStatusBadge.textContent = "Static Mode";
            }
        }
    }

    // 5. Logika Tombol Salin Perintah Terminal (Quick Connect)
    const copyBtn = document.getElementById("copy-btn");
    const terminalCode = document.getElementById("terminal-code");

    if (copyBtn && terminalCode) {
        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(terminalCode.textContent).then(() => {
                copyBtn.textContent = "Copied!";
                copyBtn.style.color = "#10B981";
                setTimeout(() => {
                    copyBtn.textContent = "Copy";
                    copyBtn.style.color = "var(--text-main)";
                }, 2000);
            });
        });
    }

    // Logika Jam & Status Minimalis
    const localTimeValue = document.getElementById("local-time-value");
    const workStatusText = document.getElementById("work-status-text");
    const timezoneName = document.getElementById("timezone-name");

    if (localTimeValue && workStatusText) {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (timezoneName) timezoneName.textContent = tz.split('/').pop().replace('_', ' ');
        } catch (e) {}

        const updateClock = () => {
            const now = new Date();
            localTimeValue.textContent = now.toLocaleTimeString();

            const hours = now.getHours();
            if (hours >= 8 && hours < 21) {
                workStatusText.textContent = "Available for work";
                workStatusText.style.color = "#10B981";
            } else {
                workStatusText.textContent = "Currently offline";
                workStatusText.style.color = "var(--text-muted)";
            }
        };

        updateClock();
        setInterval(updateClock, 1000);
    }

    // 8. Logika Interactive Web Shell / Terminal
    const shellInput = document.getElementById("shell-input");
    const shellOutput = document.getElementById("shell-output");

    if (shellInput && shellOutput) {
        shellInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const cmd = shellInput.value.trim();
                if (!cmd) return;

                const userLine = document.createElement("div");
                userLine.className = "shell-line";
                userLine.innerHTML = `<span style="color: #10B981;">visitor@fall:~$</span> ${cmd}`;
                shellOutput.appendChild(userLine);

                shellInput.value = "";

                const isServerActive = window.location.port === "8000";
                
                if (isServerActive) {
                    fetch("/api/exec", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ command: cmd })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.output === "__CLEAR__") {
                            shellOutput.innerHTML = "";
                            return;
                        }
                        const resLine = document.createElement("div");
                        resLine.className = "shell-line";
                        resLine.style.color = "#CBD5E1";
                        resLine.textContent = data.output;
                        shellOutput.appendChild(resLine);
                        shellOutput.scrollTop = shellOutput.scrollHeight;
                    })
                    .catch(() => {
                        printShellError("Gagal terhubung ke backend server.");
                    });
                } else {
                    setTimeout(() => {
                        let reply = "Perintah tereksekusi (Static Mode).";
                        if (cmd === "help") reply = "Perintah: help, whoami, status, clear";
                        else if (cmd === "whoami") reply = "guest-user";
                        else if (cmd === "status") reply = "Running on Client Browser Fallback";
                        else if (cmd === "clear") {
                            shellOutput.innerHTML = "";
                            return;
                        }
                        
                        const resLine = document.createElement("div");
                        resLine.className = "shell-line";
                        resLine.style.color = "#CBD5E1";
                        resLine.textContent = reply;
                        shellOutput.appendChild(resLine);
                        shellOutput.scrollTop = shellOutput.scrollHeight;
                    }, 200);
                }
            }
        });
    }

    function printShellError(msg) {
        const errLine = document.createElement("div");
        errLine.className = "shell-line";
        errLine.style.color = "#EF4444";
        errLine.textContent = msg;
        shellOutput.appendChild(errLine);
    }

    // 9. Logika Command Palette Popup (Ctrl+K / ⌘K)
    const cmdModal = document.getElementById("cmd-palette-modal");
    const cmdInput = document.getElementById("cmd-search-input");
    const cmdTriggerBtn = document.getElementById("cmd-trigger-btn");

    const toggleCmdPalette = (open) => {
        if (!cmdModal) return;
        if (open) {
            cmdModal.classList.add("active");
            if (cmdInput) {
                cmdInput.value = "";
                cmdInput.focus();
            }
        } else {
            cmdModal.classList.remove("active");
        }
    };

    if (cmdTriggerBtn) {
        cmdTriggerBtn.addEventListener("click", () => toggleCmdPalette(true));
    }

    document.addEventListener("keydown", (e) => {
        // Shortcut Ctrl + K atau Cmd + K
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            const isOpen = cmdModal.classList.contains("active");
            toggleCmdPalette(!isOpen);
        }
        // Tombol ESC untuk menutup
        if (e.key === "Escape") {
            toggleCmdPalette(false);
        }
    });

    if (cmdModal) {
        cmdModal.addEventListener("click", (e) => {
            if (e.target === cmdModal) toggleCmdPalette(false);
        });
    }

    // Aksi navigasi cepat dari item popup
    document.querySelectorAll(".cmd-item").forEach(item => {
        item.addEventListener("click", () => {
            const action = item.getAttribute("data-action");
            if (action === "home") window.location.href = "index.html";
            if (action === "projects") window.location.href = "projects.html";
            if (action === "contact") window.location.href = "contact.html";
            if (action === "theme") {
                const themeBtn = document.getElementById("theme-toggle");
                if (themeBtn) themeBtn.click();
            }
            toggleCmdPalette(false);
        });
    });
});

