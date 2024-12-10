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

    // 강의 버튼 추가
    function populateCourseButtons() {
        courseButtonsContainer.innerHTML = ""; // 기존 버튼 제거
        const confirmedTimetable = JSON.parse(localStorage.getItem("confirmedTimetable"));
        const savedTimetables = JSON.parse(localStorage.getItem("savedTimetables")) || [];
        const courseNames = new Set();

        if (confirmedTimetable) {
            const timetableIndex = confirmedTimetable.index;
            const courses = savedTimetables[timetableIndex] || [];

            courses.forEach((course) => {
                courseNames.add(course.courseName);
            });
        }

        courseNames.forEach((courseName) => {
            const button = document.createElement("button");
            button.textContent = courseName;
            button.className = "subject-button";

            // 버튼 클릭 이벤트
            button.addEventListener("click", () => {
                // 기존에 선택된 버튼에서 'selected' 클래스 제거
                const previouslySelected = courseButtonsContainer.querySelector(".subject-button.selected");
                if (previouslySelected) {
                    previouslySelected.classList.remove("selected");
                }

                // 현재 버튼에 'selected' 클래스 추가
                button.classList.add("selected");
                selectedCourseName = courseName; // 선택된 강의명 저장
            });

            courseButtonsContainer.appendChild(button);
        });
    }


    // 모달 초기화
    function resetModal() {
        selectedCourseName = null;
        mandatoryCheckbox.checked = false;
        dueDateInput.disabled = true;
        taskNameInput.value = "";
    }

    // 저장 버튼 클릭 시
    saveTodoButton.addEventListener("click", async () => {
        if (!selectedCourseName) {
            alert("강의를 선택하세요.");
            return;
        }

        const taskName = taskNameInput.value.trim();
        const isMandatory = mandatoryCheckbox.checked;
        const dueDate = isMandatory ? dueDateInput.value : null;

        if (!taskName) {
            alert("할 일을 입력하세요.");
            return;
        }

        const todoData = {
            courseName: selectedCourseName,
            taskName,
            isMandatory,
            dueDate,
        };

        try {
            const response = await fetch("/api/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(todoData),
            });

            if (!response.ok) {
                throw new Error("할 일을 저장하지 못했습니다.");
            }

            alert("할 일이 저장되었습니다.");
            modal.style.display = "none";
            resetModal();
        } catch (error) {
            console.error(error.message);
            alert("할 일을 저장하는 데 문제가 발생했습니다.");
        }
    });
});
