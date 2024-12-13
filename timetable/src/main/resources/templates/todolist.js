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

    // 링크 버튼 렌더링 함수
    async function renderLinkButtons(todoListContainer) {
        const todos = await fetchTodos(); // fetchTodos.js에서 데이터 가져오기

        todos.forEach((todo) => {
            const linkButton = document.createElement("button");
            linkButton.classList.add("link-btn");
            linkButton.textContent = "🖇️";

            // 링크 버튼 클릭 이벤트 처리
            linkButton.addEventListener("click", async () => {
                if (!todo.link || todo.link.trim() === "") {
                    // 링크가 없으면 입력창 표시
                    const linkInput = prompt("사이트 주소를 입력하세요:");
                    if (linkInput) {
                        todo.link = linkInput; // 로컬 업데이트
                        await updateTodoLink(todo.id, linkInput); // 서버 업데이트
                        alert("주소가 저장되었습니다.");
                    }
                } else {
                    // 링크가 있으면 새 탭에서 열기
                    window.open(todo.link, "_blank");
                }
            });

            // 링크가 이미 저장된 경우 스타일 변경
            if (todo.link && todo.link.trim() !== "") {
                linkButton.classList.add("has-link"); // 스타일 클래스 추가
            }

            // 할일 목록 요소에 버튼 추가
            const todoItem = todoListContainer.querySelector(`.todo-item[data-id="${todo.id}"]`);
            if (todoItem) {
                todoItem.appendChild(linkButton);
            }
        });
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

                // 체크박스 추가
                const checkBox = document.createElement("div");
                checkBox.classList.add("todo-check");
                checkBox.dataset.id = todo.id; // 할일 ID 저장
                updateCheckBoxState(checkBox, todo.status); // 저장된 상태로 체크박스 초기화

                checkBox.addEventListener("click", async function () {
                    const newStatus = cycleStatus(checkBox);
                    await updateTodoStatus(todo.id, newStatus);
                });

                // 할일 이름 추가
                const taskText = document.createElement("span");
                taskText.textContent = todo.taskName;

                // "🖇️" 버튼 추가
                const linkButton = document.createElement("button");
                linkButton.classList.add("link-btn");
                linkButton.textContent = "🖇️";

                // "⁝" 버튼 추가
                const optionsButton = document.createElement("button");
                optionsButton.classList.add("options-btn");
                optionsButton.textContent = "⁝";

                // 옵션 메뉴 추가
                const optionsMenu = document.createElement("div");
                optionsMenu.classList.add("options-menu");

                // 수정 버튼
                const editButton = document.createElement("button");
                editButton.classList.add("edit-btn");
                editButton.textContent = "수정";
                editButton.addEventListener("click", () => {
                    openEditModal(todo); // 수정 모달 열기
                    optionsMenu.classList.remove("active"); // 메뉴 닫기
                });

                // 삭제 버튼
                const deleteButton = document.createElement("button");
                deleteButton.classList.add("delete-btn");
                deleteButton.textContent = "삭제";
                deleteButton.addEventListener("click", async () => {
                    await deleteTodoItem(todo.id); // 삭제 API 호출
                    optionsMenu.classList.remove("active"); // 메뉴 닫기
                });

                // 메뉴에 버튼 추가
                optionsMenu.appendChild(editButton);
                optionsMenu.appendChild(deleteButton);

                // "🖇️" 버튼 클릭 시 메뉴 표시/숨김
                linkButton.addEventListener("click", (event) => {
                    event.stopPropagation(); // 클릭 이벤트 전파 방지
                    optionsMenu.classList.toggle("active");
                });

                // "..." 버튼 클릭 시 메뉴 표시/숨김
                optionsButton.addEventListener("click", (event) => {
                    event.stopPropagation(); // 클릭 이벤트 전파 방지
                    optionsMenu.classList.toggle("active");
                });

                // 외부 클릭 시 메뉴 닫기
                document.addEventListener("click", (event) => {
                    if (!optionsMenu.contains(event.target) && event.target !== optionsButton) {
                        optionsMenu.classList.remove("active");
                    }
                });

                li.appendChild(checkBox);
                li.appendChild(taskText);
                li.appendChild(linkButton);
                li.appendChild(optionsButton);
                li.appendChild(optionsMenu);
                ul.appendChild(li);
            });

            section.appendChild(title);
            section.appendChild(ul);
            todoListContainer.appendChild(section);
        });
        // 링크 버튼 렌더링 호출
        renderLinkButtons(todoListContainer);
    }

    // 수정 모달 열기
    function openEditModal(todo) {
        const modal = document.getElementById("todoModal");
        const taskNameInput = document.getElementById("taskName");
        const mandatoryButton = document.getElementById("mandatoryButton"); // 필수 여부 버튼
        const dueDateInput = document.getElementById("dueDate");

        let originalTaskDate = todo.taskDate; // 기존 taskDate를 저장

        // 기존 데이터 채우기
        taskNameInput.value = todo.taskName;
        isMandatory = todo.isMandatory;
        mandatoryButton.textContent = isMandatory ? "OFF" : "필수";
        dueDateInput.value = todo.dueDate || "";

        // 저장 버튼 이벤트 수정
        const saveButton = document.getElementById("saveTodo");
        saveButton.onclick = async function () {
            await updateTodoItem(todo.id, originalTaskDate); // 기존 taskDate 유지
            modal.style.display = "none"; // 모달 닫기
            fetchTodos(); // 할일 목록 새로고침
        };

        modal.style.display = "block";
    }


    // 삭제 처리
    async function deleteTodoItem(todoId) {
        if (confirm("정말 삭제하시겠습니까?")) {
            try {
                const response = await fetch(`http://localhost:8080/api/todos/${todoId}`, {
                    method: "DELETE",
                });
                if (!response.ok) throw new Error("할 일을 삭제하지 못했습니다.");
                alert("할 일이 삭제되었습니다.");
                fetchTodos(); // 목록 새로고침
            } catch (error) {
                console.error(error.message);
                alert("할 일을 삭제하는 데 문제가 발생했습니다.");
            }
        }
    }

    // 서버에 링크 업데이트
    async function updateTodoLink(todoId, link) {
        try {
            const response = await fetch(`http://localhost:8080/api/todos/${todoId}/link`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ link: link }),
            });

            if (!response.ok) {
                throw new Error("링크를 저장하지 못했습니다.");
            }
        } catch (error) {
            console.error(error.message);
            alert("링크 저장 중 문제가 발생했습니다.");
        }
    }

    // 할일 수정 API 호출
    async function updateTodoItem(todoId, taskDate) {
        const taskName = document.getElementById("taskName").value.trim();
        const dueDate = document.getElementById("dueDate").value;

        if (!taskName) {
            alert("할 일을 입력하세요.");
            return;
        }

        const todoData = {
            taskName: taskName,
            isMandatory: isMandatory,
            dueDate: dueDate,
            taskDate: taskDate, // 기존 taskDate 유지
        };

        try {
            const response = await fetch(`http://localhost:8080/api/todos/${todoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(todoData),
            });

            if (!response.ok) {
                throw new Error("할 일을 수정하지 못했습니다.");
            }
            alert("할 일이 수정되었습니다.");
        } catch (error) {
            console.error(error.message);
            alert("할 일을 수정하는 데 문제가 발생했습니다.");
        }
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

    // URL을 올바르게 포맷팅하는 함수
    function formatLink(link) {
        // URL이 'http://' 또는 'https://'로 시작하지 않으면 추가
        if (!/^https?:\/\//i.test(link)) {
            return `https://${link}`;
        }
        return link;
    }
});
