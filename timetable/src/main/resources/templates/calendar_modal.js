document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("todoModal");
    const addTodoButton = document.getElementById("addTodo");
    const closeModal = document.getElementById("closeModal");
    const courseButtonsContainer = document.getElementById("courseButtons");
    const mandatoryCheckbox = document.getElementById("mandatoryCheckbox");
    const dueDateInput = document.getElementById("dueDate");
    const saveTodoButton = document.getElementById("saveTodo");
    const taskNameInput = document.getElementById("taskName");

    let selectedCourseName = null;

    // 모달 열기
    addTodoButton.addEventListener("click", () => {
        populateCourseButtons(); // 강의 버튼 추가
        modal.style.display = "block";
    });

    // 모달 닫기
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
        resetModal();
    });

    // 필수 체크박스에 따른 기한 활성화
    mandatoryCheckbox.addEventListener("change", () => {
        dueDateInput.disabled = !mandatoryCheckbox.checked;
    });

    async function fetchTodos() {
        try {
            const response = await fetch("/api/todos/user/1"); // 현재 사용자 ID에 맞는 할일 조회
            const todos = await response.json();
            renderTodos(todos); // UI에 할일 렌더링
        } catch (error) {
            console.error("할 일을 불러오는 데 문제가 발생했습니다.", error);
        }
    }

    function renderTodos(todos) {
        const todoList = document.getElementById("todoList"); // HTML의 할일 목록 컨테이너
        todoList.innerHTML = ""; // 기존 목록 초기화

        todos.forEach(todo => {
            const listItem = document.createElement("li");
            listItem.textContent = `${todo.taskName} (${todo.courseName}) - ${todo.dueDate || "기한 없음"}`;
            todoList.appendChild(listItem);
        });
    }
});
