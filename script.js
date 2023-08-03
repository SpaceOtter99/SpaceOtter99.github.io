document.addEventListener("DOMContentLoaded", () => {
    const monstersPerPage = 10;
    const maxVisiblePages = 9;
    let currentPage = 1;
    let totalMonsters = 0;
    let monstersData = [];

    const partyInput = document.getElementById("party-input");
    const addGroupButton = document.getElementById("add-group");
    const monsterList = document.getElementById("monster-list");

    addGroupButton.addEventListener("click", () => {
        const newGroup = document.createElement("div");
        newGroup.className = "player-group";
        newGroup.innerHTML = `
            <label class="group-players-label" for="group-players">Players:</label>

            <label class="group-level-label" for="group-level">Level:</label>

            <div> </div>

            <input type="number" class="group-players" min="1" value="1">

            <input type="number" class="group-level" min="1" value="1">

            <button class="remove-group"></button>
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

    function fetchMonstersCSV() {
        return fetch("monsters.csv")
            .then(response => response.text())
            .then(data => {
                monstersData = data.split("\n").map(line => parseCSVLine(line));
            })
            .catch(error => {
                console.error("Error fetching monster data:", error);
            });
    }

    // Call fetchMonstersCSV once when the DOM is loaded
    fetchMonstersCSV().then(() => {
        partyInput.innerHTML = "";
        // Call addGroup function to set up initial UI
        addGroup();
    });

    function updatePageNumbers(totalPages) {
        const pageNumbersContainer = document.getElementById("page-numbers");
        pageNumbersContainer.innerHTML = "";

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
                for (let i = totalPages - maxVisiblePages + 3; i <= totalPages; i++) {
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
        if (pageNumber == currentPage)
        {
            button.setAttribute("disabled", "disabled");
        }
        button.className = "page-number"
        
        button.addEventListener("click", () => {
            currentPage = pageNumber;
            updateMonsterList();
        });
        return button;
    }

    function createEllipsis() {
        const ellipsis = document.createElement("button");
        ellipsis.className = "ellipsis";
        ellipsis.setAttribute("disabled", "disabled");
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

        const filteredMonsters = monstersData.filter(values => {
            const [level] = values;
            return !isNaN(level) && parseInt(level) <= partyLevel + 1 && parseInt(level) >= partyLevel - 1;
        });

        for (let i = startIndex; i < endIndex && i < filteredMonsters.length; i++) {
            const [level, name, size, role, type, source, page] = filteredMonsters[i];
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

        totalMonsters = filteredMonsters.length;
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

    function updateMonsterList() {        
        const totalPartyLevel = calculateTotalPartyLevel();
        fetchMonstersForPartyLevel(totalPartyLevel, currentPage);

        const totalPages = Math.ceil(totalMonsters / monstersPerPage);
        updatePageNumbers(totalPages);
    }
});
