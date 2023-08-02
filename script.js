document.addEventListener("DOMContentLoaded", () => {
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
    });

    partyInput.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-group")) {
            event.target.parentNode.remove();
        }
    });

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

    function fetchMonstersForPartyLevel(partyLevel) {
        monsterList.innerHTML = ""; // Clear existing list

        fetch("monsters.csv")
            .then(response => response.text())
            .then(data => {
                const lines = data.split("\n");
                for (const line of lines) {
                    const [level, name, size, role, type, source, page] = line.split(",");
                    if (!isNaN(level) && parseInt(level) <= partyLevel) {
                        const monsterItem = document.createElement("li");
                        monsterItem.textContent = `${name} (Level ${level}) - ${size}, ${role}, ${type} - ${source} (Page ${page})`;
                        monsterList.appendChild(monsterItem);
                    }
                }
            })
            .catch(error => {
                console.error("Error fetching monster data:", error);
            });
    }

    partyInput.addEventListener("input", () => {
        const totalPartyLevel = calculateTotalPartyLevel();
        fetchMonstersForPartyLevel(totalPartyLevel);
    });
});
