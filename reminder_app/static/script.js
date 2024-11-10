document.getElementById("reminderForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const message = document.getElementById("message").value;
    const time = document.getElementById("time").value.replace("T", " ") + ":00";

    fetch("/add_reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, time }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.status);
        updateReminderList();
    });

    // Check for Notification permission
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                scheduleNotification(message, time);
            } else {
                alert("Notification permission denied!");
            }
        });
    } else {
        scheduleNotification(message, time);
    }
});

// Function to schedule the notification at the correct time
function scheduleNotification(message, time) {
    const notificationTime = new Date(time).getTime() - new Date().getTime();

    if (notificationTime > 0) {
        setTimeout(() => {
            showCustomNotification(message);
        }, notificationTime);
    } else {
        alert("The selected time is in the past. Please select a future time.");
    }
}

// Function to show custom notification
function showCustomNotification(message) {
    const notification = document.getElementById("customNotification");
    const messageElement = document.getElementById("notificationMessage");

    messageElement.textContent = message;
    notification.style.display = "block";

    // Automatically hide notification after 5 seconds
    setTimeout(closeNotification, 5000);
}

// Function to close/hide custom notification
function closeNotification() {
    const notification = document.getElementById("customNotification");
    notification.style.display = "none";
}

// Function to update the reminder list displayed on the page
function updateReminderList() {
    fetch('/get_reminders')
        .then(response => response.json())
        .then(reminders => {
            const reminderList = document.getElementById("reminderList");
            reminderList.innerHTML = "";
            reminders.forEach(reminder => {
                const row = document.createElement("tr");
                const messageCell = document.createElement("td");
                const timeCell = document.createElement("td");

                messageCell.textContent = reminder.message;
                timeCell.textContent = new Date(reminder.time).toLocaleString();

                row.appendChild(messageCell);
                row.appendChild(timeCell);
                reminderList.appendChild(row);
            });
        });
}
