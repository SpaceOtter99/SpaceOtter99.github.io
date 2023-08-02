document.addEventListener("DOMContentLoaded", () => {
    const partyLevelInput = document.getElementById("party-level");
    const monsterList = document.getElementById("monster-list");

    partyLevelInput.addEventListener("input", () => {
        const partyLevel = parseInt(partyLevelInput.value);
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
    });
});
