document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("intro-video");
    const status = document.getElementById("status");
    const roomsInfo = document.getElementById("rooms-info");

    // Перевірка, чи відео вже запускалося
    const videoWatched = localStorage.getItem("videoWatched");

    if (videoWatched) {
        // Якщо відео вже переглядали
        if (video) video.style.display = "none";
        if (status) status.style.display = "none";
        if (roomsInfo) roomsInfo.style.display = "block";
        fetchRoomStatus(); // Завантаження статусу кімнат
    } else {
        // Відтворення відео
        if (video) {
            video.play().then(() => {
                status.textContent = "Відео відтворюється...";
            }).catch(() => {
                status.textContent = "Натисніть для відтворення.";
                video.addEventListener("click", () => {
                    video.play();
                    status.textContent = " ";
                });
            });

            video.addEventListener("ended", () => {
                status.textContent = "Привітання і вступ завершено, перейдімо до квестів";
                video.style.display = "none";
                if (roomsInfo) roomsInfo.style.display = "block";
                localStorage.setItem("videoWatched", "true"); // Зберігаємо статус
                fetchRoomStatus(); // Завантаження статусу кімнат
            });
        }
    }

    // Функція для завантаження статусів кімнат
    function fetchRoomStatus() {
        fetch("/api/quest-status")
            .then((response) => {
                if (!response.ok) throw new Error("Не вдалося отримати дані");
                return response.json();
            })
            .then((data) => {
                if (data.error) {
                    roomsInfo.innerHTML = `<div class="error">${data.error}</div>`;
                } else {
                    updateRoomStatus(data);
                }
            })
            .catch((error) => {
                roomsInfo.innerHTML = `<div class="error">Помилка: ${error.message}</div>`;
            });
    }

    // Оновлення інформації про кімнати
    function updateRoomStatus(data) {
        roomsInfo.innerHTML = ""; // Очищаємо попередній контент
        for (const room in data) {
            const status = data[room] ? "Виконано" : "Не виконано";
            const color = data[room] ? "#4caf50" : "#f44336"; // Зелений/червоний
            roomsInfo.innerHTML += `<div class="room" style="color: ${color};">${room}: ${status}</div>`;
        }
    }
});
