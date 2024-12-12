document.addEventListener("DOMContentLoaded", function () {
    const todoListContainer = document.getElementById("todoListContainer");

    // 초기 할일 목록 불러오기
    fetchTodos();

    async function fetchTodos() {
        try {
            const response = await fetch("http://localhost:8080/api/todos/user/1"); // userId는 예시
            if (!response.ok) throw new Error("할일 목록을 가져올 수 없습니다.");
            const todos = await response.json();
            renderTodos(todos);
            // 체크박스 상태 업데이트
            todos.forEach(todo => {
                const checkBox = document.querySelector(`.todo-check[data-id="${todo.id}"]`);
                const status = checkBox.dataset.status;
                if (checkBox) {
                    checkBox.className = "todo-check"; // 기존 클래스 초기화
                    if (status === "clear") {
                        checkBox.classList.add("todo-clear");
                    } else if (status === "notdone") {
                        checkBox.classList.add("todo-notdone");
                    } else if (status === "no") {
                        checkBox.classList.add("todo-no");
                    } else {
                        checkBox.classList.add("empty"); // 빈 상태
                    }
                }
            });
        } catch (error) {
            console.error(error.message);
        }
    }

    // 할일 렌더링
    function renderTodos(todos) {
        todoListContainer.innerHTML = ""; // 기존 목록 초기화

        // 강의별 그룹화
        const groupedTodos = groupBy(todos, "subjectName");
        Object.entries(groupedTodos).forEach(([subjectName, subjectTodos]) => {
            const section = document.createElement("div");
            section.classList.add("todo-section");

            const title = document.createElement("h3");
            title.textContent = subjectName;

            const ul = document.createElement("ul");
            ul.classList.add("todo-list");
            subjectTodos.forEach((todo) => {
                const li = document.createElement("li");
                li.classList.add("todo-item");

                const checkBox = document.createElement("div");
                checkBox.classList.add("todo-check");
                checkBox.dataset.id = todo.id; // 할일 ID 저장
                updateCheckBoxState(checkBox, todo.status); // 저장된 상태로 체크박스 초기화

                checkBox.addEventListener("click", async function () {
                    const newStatus = cycleStatus(checkBox);
                    await updateTodoStatus(todo.id, newStatus);
                });

                const taskText = document.createElement("span");
                taskText.textContent = todo.taskName;

                li.appendChild(checkBox);
                li.appendChild(taskText);
                ul.appendChild(li);
            });

            section.appendChild(title);
            section.appendChild(ul);
            todoListContainer.appendChild(section);
        });
    }

    // 상태 순환
    function cycleStatus(checkBox) {
        const states = ["CLEAR", "NOTDONE", "NO", ""];
        let currentIndex = states.indexOf(checkBox.dataset.status || "");
        const nextIndex = (currentIndex + 1) % states.length;
        const newStatus = states[nextIndex];
        checkBox.dataset.status = newStatus;
        updateCheckBoxState(checkBox, newStatus);
        return newStatus;
    }

    // 체크박스 상태 업데이트
    function updateCheckBoxState(checkBox, status) {
        checkBox.dataset.status = status; // 상태를 데이터 속성으로 저장
        checkBox.className = "todo-check"; // 기본 클래스 초기화
        if (status === "CLEAR") {
            checkBox.classList.add("todo-clear");
        } else if (status === "NOTDONE") {
            checkBox.classList.add("todo-notdone");
        } else if (status === "NO") {
            checkBox.classList.add("todo-no");
        } else {
            checkBox.classList.add("empty"); // 빈 상태
        }
    }


    // 서버에 상태 업데이트
    async function updateTodoStatus(id, status) {
        try {
            const response = await fetch(`http://localhost:8080/api/todos/${id}/status?status=${status}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error("할일 상태를 업데이트하지 못했습니다.");
        } catch (error) {
            console.error(error.message);
        }
    }

    // 할일 그룹화
    function groupBy(array, key) {
        return array.reduce((result, item) => {
            (result[item[key]] = result[item[key]] || []).push(item);
            return result;
        }, {});
    }
});
