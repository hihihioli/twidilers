// checkboxHandler will be called automatically by settings.js after DOM is ready

let checkbox = [
    'reaction-toggle',
    'follow-toggle',
    'post-notif-toggle'
];

// handles checkboxes
async function checkboxHandler() {
    for (let i = 0; i < checkbox.length; i++) {
        const checkboxID = document.getElementById(checkbox[i]);
        const res = await fetch(`/api/settings/${checkbox[i]}`, { method: "POST" });
        const json = await res.json();
        if (!json) {
            console.error(`No data received for ${checkbox[i]}`);
        }
        const data = json[checkbox[i]];
        // set the checkbox state based on the fetched value
        checkboxID.checked = data;
    }
    // add event listeners for each checkbox
    checkbox.forEach(id => {
        const checkboxElement = document.getElementById(id);
        checkboxElement.addEventListener("change", async () => {
            const newValue = checkboxElement.checked; // get the new checked state
            // send the new value to the server
            const res = await fetch(`/api/settings/${id}/toggle`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value: newValue })
            });
            // catch problem
            if (!res.ok) {
                console.error(`Failed to toggle ${id}:`, res.status);
                checkboxElement.checked = !newValue;
                return;
            }
            const verifyRes = await fetch(`/api/settings/${id}`, { method: "POST" });
            const verifyJson = await verifyRes.json();
            const serverValue = verifyJson[id];
            // verify the server updated correctly

            if (serverValue !== newValue) {
                console.error(`Mismatch for ${id}. UI: ${newValue}, Server: ${serverValue}`);
            } else {
                console.log(`${id} set to ${newValue}`);
            }
        });
    });
}
