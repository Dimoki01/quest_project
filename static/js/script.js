document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("intro-video");
    const status = document.getElementById("status");
    const roomsInfo = document.getElementById("rooms-info");
    const usersInfo = document.getElementById("users-info");
    const roomsContainer = document.getElementById("rooms");
    const usersContainer = document.getElementById("users");

    // Функція для завантаження статусу кімнат
    function fetchRoomStatus() {
        fetch("/api/quest-status")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Не вдалося отримати дані з сервера");
                }
                return response.json();
            })
            .then(data => {
                // Перевірка структури даних
                if (!data.quests || typeof data.quests !== "object") {
                    throw new Error("Невірна структура даних для quests");
                }
                if (!data.users || typeof data.users !== "object") {
                    throw new Error("Невірна структура даних для users");
                }

                // Оновлення кімнат
                roomsContainer.innerHTML = ""; // Очищення контейнера
                Object.entries(data.quests).forEach(([room, completed]) => {
                    const roomDiv = document.createElement("div");
                    roomDiv.className = "room";
                    roomDiv.style.color = completed ? "green" : "red"; // Зелені, якщо виконано; червоні, якщо ні
                    roomDiv.textContent = `${room}: ${completed ? "Виконано" : "Не виконано"}`;
                    roomsContainer.appendChild(roomDiv);
                });

                // Оновлення очок гравців
                const maxPoints = Math.max(...Object.values(data.users));
                const minPoints = Math.min(...Object.values(data.users));

                usersContainer.innerHTML = ""; // Очищення контейнера
                Object.entries(data.users).forEach(([user, points]) => {
                    const color = points === maxPoints ? "green" : points === minPoints ? "red" : "black";
                    const userDiv = document.createElement("div");
                    userDiv.className = "user";
                    userDiv.style.color = color;
                    userDiv.textContent = `${user}: ${points} очок`;
                    usersContainer.appendChild(userDiv);
                });
            })
            .catch(error => {
                // Обробка помилок
                console.error("Помилка:", error.message);
                roomsContainer.innerHTML = "<div class='error'>Не вдалося завантажити статус кімнат</div>";
                usersContainer.innerHTML = "<div class='error'>Не вдалося завантажити статус гравців</div>";
            });
    }

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
});
