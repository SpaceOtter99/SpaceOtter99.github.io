document.addEventListener("DOMContentLoaded", () => {
    const monstersPerPage = 10;
    const maxVisiblePages = 5;
    let currentPage = 1;
    let totalMonsters = 0;

    const partyInput = document.getElementById("party-input");
    const addGroupButton = document.getElementById("add-group");
    const monsterList = document.getElementById("monster-list");

    addGroupButton.addEventListener("click", () => {
        const newGroup = document.createElement("div");
        newGroup.className = "player-group";
        newGroup.innerHTML = `
            <label for="group-players">Players:</label>
            <input type="number" class="group-players" min="1" value="1">

            <label for="group-level">Level:</label>
            <input type="number" class="group-level" min="1" value="1">

            <button class="remove-group">X</button>
        `;
        partyInput.appendChild(newGroup);
        updateMonsterList();
    });

    partyInput.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-group")) {
            event.target.parentNode.remove();
            updateMonsterList();
        }
    });

    function updatePageNumbers(totalPages) {
        const pageNumbersContainer = document.getElementById("page-numbers");
        pageNumbersContainer.innerHTML = "";

        const pageNumbersToShow = Math.min(maxVisiblePages, totalPages);
        const currentPageIndex = currentPage - 1;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbersContainer.appendChild(createPageNumberButton(i));
            }
        } else {
            if (currentPageIndex <= 2) {
                for (let i = 1; i <= pageNumbersToShow; i++) {
                    pageNumbersContainer.appendChild(createPageNumberButton(i));
                }
                pageNumbersContainer.appendChild(createEllipsis());
                pageNumbersContainer.appendChild(createPageNumberButton(totalPages));
            } else if (currentPageIndex >= totalPages - 3) {
                pageNumbersContainer.appendChild(createPageNumberButton(1));
                pageNumbersContainer.appendChild(createEllipsis());
                for (let i = totalPages - pageNumbersToShow + 1; i <= totalPages; i++) {
                    pageNumbersContainer.appendChild(createPageNumberButton(i));
                }
            } else {
                pageNumbersContainer.appendChild(createPageNumberButton(1));
                pageNumbersContainer.appendChild(createEllipsis());
                for (let i = currentPageIndex - 1; i <= currentPageIndex + 1; i++) {
                    pageNumbersContainer.appendChild(createPageNumberButton(i + 1));
                }
                pageNumbersContainer.appendChild(createEllipsis());
                pageNumbersContainer.appendChild(createPageNumberButton(totalPages));
            }
        }
    }

    function createPageNumberButton(pageNumber) {
        const button = document.createElement("button");
        button.textContent = pageNumber;
        button.addEventListener("click", () => {
            currentPage = pageNumber;
            updateMonsterPage();
        });
        return button;
    }

    function createEllipsis() {
        const ellipsis = document.createElement("span");
        ellipsis.textContent = "...";
        return ellipsis;
    }

    function updateMonsterPage() {
        console.log("Updating Monster Pages")
        const totalPartyLevel = calculateTotalPartyLevel();
        fetchMonstersForPartyLevel(totalPartyLevel, currentPage);

        const totalPages = Math.ceil(totalMonsters / monstersPerPage);
        updatePageNumbers(totalPages);
    }

    function calculateTotalPartyLevel() {
        let totalLevel = 0;
        const groupElements = document.querySelectorAll(".player-group");
        
        groupElements.forEach(group => {
            const groupLevel = parseInt(group.querySelector(".group-level").value);
            const groupPlayers = parseInt(group.querySelector(".group-players").value);
            totalLevel += groupLevel * groupPlayers;
        });
        console.log(totalLevel);
        return totalLevel;
    }

    function fetchMonstersForPartyLevel(partyLevel, pageNumber) {
    const startIndex = (pageNumber - 1) * monstersPerPage;
    const endIndex = startIndex + monstersPerPage;

    const monsterTbody = document.getElementById("monster-list");
    monsterTbody.innerHTML = ""; // Clear existing table body

    fetch("monsters.csv")
        .then(response => response.text())
        .then(data => {
            const lines = data.split("\n");
            let count = 0;
            for (const line of lines) {
                const [level, name, size, role, type, source, page] = line.split(",");
                if (!isNaN(level) && parseInt(level) <= partyLevel + 1 && parseInt(level) >= partyLevel - 1) {
                    if (count >= startIndex && count < endIndex) {
                        const monsterRow = document.createElement("tr");
                        monsterRow.innerHTML = `
                            <td>${name}</td>
                            <td>${level}</td>
                            <td>${size}</td>
                            <td>${role}</td>
                            <td>${type}</td>
                            <td>${source}</td>
                            <td>${page}</td>
                        `;
                        monsterTbody.appendChild(monsterRow);
                    }
                    count++;
                }
            }
            totalMonsters = count;
        })
        .catch(error => {
            console.error("Error fetching monster data:", error);
        });
    }

    partyInput.addEventListener("input", () => {
        updateMonsterList();
    });

    function updateMonsterList() {        
        const totalPartyLevel = calculateTotalPartyLevel();
        fetchMonstersForPartyLevel(totalPartyLevel);
    }
});
