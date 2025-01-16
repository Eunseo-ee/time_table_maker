let selectedDate=null;

document.addEventListener("DOMContentLoaded", function () {
    const calendarDates = document.getElementById("calendarDates");
    const currentMonthLabel = document.getElementById("currentMonth");
    const prevMonthButton = document.getElementById("prevMonth");
    const nextMonthButton = document.getElementById("nextMonth");
    const saveTodoButton = document.getElementById("saveTodo");
    const modal = document.getElementById("todoModal");
    const courseButtonsContainer = document.getElementById("courseButtons"); // 강의 버튼 컨테이너

    const addTodoButton = document.getElementById("addTodo");
    const totalTodoButton = document.getElementById("totalTodo");
    const closeModal = document.getElementById("closeModal");

    // 모달창 입력 필드
    const taskNameInput = document.getElementById("taskName"); // 할일 이름 입력 필드
    const mandatoryButton = document.getElementById("mandatoryButton"); // 필수 여부 체크박스
    const dueDateInput = document.getElementById("dueDate"); // 기한 입력 필드
    const dueDateSection = document.getElementById("dueDateSection"); // 기한 입력 섹션

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let selectedCourseName = null; // 선택된 강의명을 저장

    let isMandatory = false;

    fetchDueDates();
    renderCalendar(currentYear, currentMonth); // 캘린더 렌더링

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

    // 전체 대답
    totalTodoButton.addEventListener("click", () => {
        selectedDate = null;
        const highlightedDate = calendarDates.querySelector(".highlighted");
        highlightedDate.classList.remove("highlighted");
        fetchTodos()
    });

    // 저장 버튼 클릭 시
    saveTodoButton.addEventListener("click", saveTodo);

    // 엔터 키로 저장
    taskNameInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            saveTodo();
        }
    });

    // 필수 체크박스에 따른 기한 활성화
    mandatoryButton.addEventListener("click", () => {
        isMandatory = !isMandatory; // 상태 토글
        if (isMandatory) {
            dueDateSection.style.display = "block"; // 기한 입력 부분 보이기
            dueDateInput.disabled = false; // 활성화
            mandatoryButton.textContent = "OFF"; // 버튼 텍스트 변경
        } else {
            dueDateSection.style.display = "none"; // 기한 입력 부분 숨기기
            dueDateInput.disabled = true; // 비활성화
            dueDateInput.value = ""; // 값 초기화
            mandatoryButton.textContent = "필수"; // 버튼 텍스트 변경
        }
    });

    function renderCalendar(year, month) {
        currentMonthLabel.textContent = `${year}년 ${month + 1}월`;

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        let startDay = firstDayOfMonth.getDay();
        startDay = startDay === 0 ? 6 : startDay - 1; // 월요일 시작으로 변환

        calendarDates.innerHTML = "";

        // 빈 칸 채우기
        for (let i = 0; i < startDay; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.classList.add("empty");
            calendarDates.appendChild(emptyCell);
        }

        // 날짜 채우기
        for (let date = 1; date <= lastDayOfMonth.getDate(); date++) {
            const dateCell = document.createElement("div");
            dateCell.textContent = date;

            // 현재 날짜의 YYYY-MM-DD 형식 계산
            const currentDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;

            // 빨간 점 추가
            if (dueDates.includes(currentDate)) {
                dateCell.classList.add("has-due-date"); // 해당 날짜에 클래스 추가
            }

            // 클릭 이벤트 추가
            dateCell.addEventListener("click", function () {
                // 이전 선택된 날짜 초기화
                const highlightedDate = calendarDates.querySelector(".highlighted");
                if (highlightedDate) {
                    highlightedDate.classList.remove("highlighted");
                }

                // 현재 선택된 날짜 하이라이트 추가
                selectedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
                dateCell.classList.add("highlighted");
                console.log(`Selected date: ${selectedDate}`);
                fetchTodos();
            });

            calendarDates.appendChild(dateCell);
        }
    }

    prevMonthButton.addEventListener("click", function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentYear, currentMonth);
    });

    nextMonthButton.addEventListener("click", function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentYear, currentMonth);
    });

    // 강의 버튼 생성 및 클릭 처리
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
                // 기존 선택된 버튼 초기화
                const previouslySelected = courseButtonsContainer.querySelector(".subject-button.selected");
                if (previouslySelected) {
                    previouslySelected.classList.remove("selected");
                }

                // 현재 버튼 선택
                button.classList.add("selected");
                selectedCourseName = courseName; // 강의명 저장
                console.log(`Selected course: ${selectedCourseName}`);
            });

            courseButtonsContainer.appendChild(button);
        });
    }

    // 할 일 저장 함수
    async function saveTodo() {
        if (!selectedDate) {
            alert("날짜를 선택하세요.");
            return;
        }

        if (!selectedCourseName) {
            alert("강의를 선택하세요.");
            return;
        }

        const taskName = taskNameInput.value.trim();
        const dueDate = isMandatory ? dueDateInput.value : null;

        if (!taskName) {
            alert("할 일을 입력하세요.");
            return;
        }

        const todoData = {
            userId: 1,
            subjectName: selectedCourseName,
            taskName: taskName,
            isMandatory: isMandatory,
            dueDate: dueDate,
            taskDate: selectedDate,
            status: "EMPTY",
        };

        try {
            const response = await fetch("http://localhost:8080/api/todos", {
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
    }


    // 초기화 함수
    function resetModal() {
        selectedDate = null;
        selectedCourseName = null;
        taskNameInput.value = "";

        isMandatory = false; // 상태 초기화
        dueDateSection.style.display = "none"; // 기한 입력창 숨기기
        dueDateInput.disabled = true; // 비활성화
        dueDateInput.value = ""; // 값 초기화
        mandatoryButton.textContent = "필수"; // 버튼 텍스트 초기화

        const highlightedDate = calendarDates.querySelector(".highlighted");
        if (highlightedDate) {
            highlightedDate.classList.remove("highlighted");
        }

        const selectedButton = courseButtonsContainer.querySelector(".subject-button.selected");
        if (selectedButton) {
            selectedButton.classList.remove("selected");
        }
    }

    // 초기 렌더링
    renderCalendar(currentYear, currentMonth);
    populateCourseButtons(); // 강의 버튼 생성
});
