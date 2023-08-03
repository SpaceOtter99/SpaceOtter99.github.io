document.addEventListener("DOMContentLoaded", () => {
    const monstersPerPage = 10;
    const maxVisiblePages = 9;
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

        console.log("I am here");

        const pageNumbersToShow = Math.min(maxVisiblePages, totalPages);
        const maxCentrePages = maxVisiblePages - 4;
        const centrePageGap = Math.floor(maxCentrePages / 2);


        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbersContainer.appendChild(createPageNumberButton(i));
            }
        } else {
            if (currentPage <= maxCentrePages)
            {
                // Page number close to start, no initial ellipsis
                for (let i = 1; i <= maxVisiblePages - 2; i++) {
                    pageNumbersContainer.appendChild(createPageNumberButton(i));
                }
                pageNumbersContainer.appendChild(createEllipsis());
                pageNumbersContainer.appendChild(createPageNumberButton(totalPages));
            } else if (currentPage >= totalPages - maxCentrePages) {
                // Page number close to end, no final ellipsis
                pageNumbersContainer.appendChild(createPageNumberButton(1));
                pageNumbersContainer.appendChild(createEllipsis());
                for (let i = totalPages - maxVisiblePages + 2; i <= totalPages; i++) {
                    pageNumbersContainer.appendChild(createPageNumberButton(i));
                }
            } else {
                //Somewhere in the middle, ellipsis both sides
                pageNumbersContainer.appendChild(createPageNumberButton(1));
                pageNumbersContainer.appendChild(createEllipsis());
                for (let i =  currentPage - centrePageGap; i <= currentPage + centrePageGap; i++) {
                    pageNumbersContainer.appendChild(createPageNumberButton(i));
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
            updateMonsterList();
        });
        return button;
    }

    function createEllipsis() {
        const ellipsis = document.createElement("span");
        ellipsis.textContent = "...";
        return ellipsis;
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
                const values = parseCSVLine(line);
                const [level, name, size, role, type, source, page] = values;

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

    function parseCSVLine(line) {
        const values = [];
        let currentVal = "";
        let withinQuotes = false;

        for (const char of line) {
            if (char === '"') {
                withinQuotes = !withinQuotes;
            } else if (char === ',' && !withinQuotes) {
                values.push(currentVal.trim());
                currentVal = "";
            } else {
                currentVal += char;
            }
        }

        values.push(currentVal.trim());
        return values;
    }

    function attachInputListeners(groupElement) {
        const playerInput = groupElement.querySelector(".group-players");
        const levelInput = groupElement.querySelector(".group-level");

        playerInput.addEventListener("input", updateMonsterList);
        levelInput.addEventListener("input", updateMonsterList);
    }

    function addGroup() {
        const newGroup = document.createElement("div");
        newGroup.className = "player-group";
        newGroup.innerHTML = `
            <label for="group-players">Players:</label>
            <input type="number" class="group-players" min="1" value="1">

            <label for="group-level">Level:</label>
            <input type="number" class="group-level" min="1" value="1">

            <button class="remove-group">X</button>
        `;

        const removeButton = newGroup.querySelector(".remove-group");
        removeButton.addEventListener("click", () => {
            newGroup.remove();
            updateMonsterList();
        });

        partyInput.appendChild(newGroup);
        attachInputListeners(newGroup); // Attach listeners to the new group
        updateMonsterList();
    }
    addGroup();

    function updateMonsterList() {        
        console.log("Updating Monster Pages");
        const totalPartyLevel = calculateTotalPartyLevel();
        fetchMonstersForPartyLevel(totalPartyLevel, currentPage);

        const totalPages = Math.ceil(totalMonsters / monstersPerPage);
        updatePageNumbers(totalPages);
    }
});
