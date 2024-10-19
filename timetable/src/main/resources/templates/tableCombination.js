document.addEventListener('DOMContentLoaded', function () {
    let selectedTimes = [];

    // 과 선택 버튼 및 강의 체크박스 표시 기능
    const departmentButton = document.getElementById('departmentButton');
    const departmentList = document.getElementById('departmentList');
    const departmentContainer = document.getElementById('departmentContainer'); // HTML에 이 ID가 있는지 확인하세요.

    // small-table의 모든 td 요소를 선택
    const cells = document.querySelectorAll(".small-table td");

    // 각 셀에 클릭 이벤트 리스너 추가
    cells.forEach(cell => {
        cell.addEventListener("click", function () {
            toggleTimeSelection(cell.id); // 클릭 시 toggleTimeSelection 함수 호출
        });
    });

    // 적용 버튼 클릭 시 필터링 수행
    const applyButton = document.getElementById("applyButton");
    applyButton.addEventListener("click", function () {
        console.log("Selected times for filtering:", selectedTimes);  // 선택된 시간 배열을 콘솔에 표시
        executeFiltering(); // 필터링 함수 실행
    });

    // 초기화 버튼 클릭 시 선택 초기화
    const resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click", function () {
        selectedTimes = [];
        cells.forEach(cell => cell.classList.remove("selected-time")); // 모든 셀 선택 해제
        console.log("Reset selected times.");
    });

    // 시간 선택 토글 함수
    function toggleTimeSelection(cellId) {
        const cell = document.getElementById(cellId);
        if (cell) {
            cell.classList.toggle("selected-time"); // 클래스 추가/제거
            if (selectedTimes.includes(cellId)) {
                selectedTimes = selectedTimes.filter(time => time !== cellId);
            } else {
                selectedTimes.push(cellId);
            }
            console.log("Selected times:", selectedTimes);  // 선택된 시간 배열 확인
        }
    }

    // Generate Timetable 버튼 기능
    const generateButton = document.getElementById('generateButton');
    generateButton.addEventListener('click', async function () {
        const department = document.getElementById('departmentButton').dataset.value;
        const totalCredits = document.getElementById('totalCreditButton').dataset.value;
        const availableTimesString = consolidateSelectedTimes(selectedTimes);

        // 서버로 필터링 요청
        try {
            const params = new URLSearchParams({
                department: department,
                totalCredits: totalCredits,
            });

            // availableTimes를 문자열로 변환하여 URL에 추가
            if (availableTimesString) params.append("availableTimes", availableTimesString);

            const response = await fetch(`http://localhost:8080/courses/generateTimetable?${params.toString()}`);
            timetableCombinations = await response.json();

            // 시간표 슬라이더 초기화 및 첫 시간표 표시
            currentIndex = 0;
            displayTimetable(currentIndex);
        } catch (error) {
            console.error('Error fetching timetable combinations:', error);
        }
    });

    // 요일 및 숫자를 변환하고 범위로 합치는 함수
    function consolidateSelectedTimes(selectedTimes) {
        const dayMap = { mon: '월', tue: '화', wed: '수', thu: '목', fri: '금' };
        const consolidated = {}; // 요일별로 셀을 그룹화할 객체

        // 요일별로 선택된 시간 정리
        selectedTimes.forEach(time => {
            const day = dayMap[time.slice(0, 3)]; // 요일을 한글로 변환
            const period = parseInt(time.slice(3)); // 교시 추출

            if (!consolidated[day]) consolidated[day] = [];
            consolidated[day].push(period);
        });

        // 각 요일의 시간을 연속 범위로 합치기
        const ranges = Object.keys(consolidated).map(day => {
            const periods = consolidated[day].sort((a, b) => a - b); // 정렬
            let rangeStr = `${day}`;
            let start = periods[0];
            let end = start;

            for (let i = 1; i < periods.length; i++) {
                if (periods[i] === end + 1) {
                    end = periods[i];
                } else {
                    rangeStr += ` ${start}-${end}, `;
                    start = periods[i];
                    end = start;
                }
            }
            rangeStr += ` ${start}-${end}`;
            return rangeStr;
        });

        return ranges.join(','); // 예: "화 1-3, 수 2-4"
    }

    // 드롭다운 메뉴 버튼 클릭 시 표시/숨김 및 위치 조정
    document.querySelectorAll('.dropdown-button').forEach(button => {
        button.addEventListener('click', function () {
            const menu = button.nextElementSibling;

            // 드롭다운 메뉴 표시
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';

            // 버튼 바로 아래에 위치하도록 설정
            const buttonRect = button.getBoundingClientRect();
            menu.style.left = `${buttonRect.left + window.scrollX}px`; // 버튼과 같은 수평 위치

            // 드롭다운 메뉴의 화면 위치 계산
            const rect = menu.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // 화면 위로 벗어날 경우 아래로 위치 조정
            if (rect.top < 0) {
                menu.style.top = `${button.offsetHeight}px`;
                menu.style.bottom = 'auto';
            }
            // 화면 아래로 벗어날 경우 위로 위치 조정
            else if (rect.bottom > viewportHeight) {
                menu.style.top = 'auto';
                menu.style.bottom = `${button.offsetHeight}px`;
            } else {
                menu.style.top = `${button.offsetHeight}px`;
                menu.style.bottom = 'auto';
            }
        });
    });

    // 드롭다운 메뉴 항목 클릭 시 값 변경, 메뉴 숨기기
    document.querySelectorAll('.dropdown-menu li').forEach(item => {
        item.addEventListener('click', function () {
            const button = item.parentElement.previousElementSibling;

            // 데이터 값 업데이트 및 메뉴 숨기기
            button.dataset.value = item.getAttribute('data-value');
            item.parentElement.style.display = 'none';

            // 학과 선택 시 체크박스 리스트 생성
            if (button.id === 'departmentButton') {
                const departmentValue = button.dataset.value;
                if (departmentValue) {
                    fetchCoursesByDepartment(departmentValue);
                }
            }
        });
    });

    // 시간표 조합 표시 함수
    let currentIndex = 0;
    let timetableCombinations = [];
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const timetableSlider = document.getElementById('timetableSlider');

    prevButton.addEventListener('click', function () {
        if (currentIndex > 0) {
            currentIndex--;
            displayTimetable(currentIndex);
        }
    });

    nextButton.addEventListener('click', function () {
        if (currentIndex < timetableCombinations.length - 1) {
            currentIndex++;
            displayTimetable(currentIndex);
        }
    });

    function displayTimetable(index) {
        timetableSlider.innerHTML = ''; // 기존 시간표 지우기

        if (timetableCombinations.length === 0) {
            timetableSlider.innerHTML = '<p>No timetables available</p>';
            return;
        }

        const combination = timetableCombinations[index];
        const timetable = document.createElement('div');
        timetable.className = 'timetable';

        combination.forEach(course => {
            const courseElement = document.createElement('div');
            courseElement.className = 'course';
            courseElement.innerHTML = `
                <p><strong>${course.courseName}</strong></p>
                <p>${course.dayOfWeek} ${course.startPeriod}-${course.endPeriod}</p>
                <p>${course.classroom}</p>
            `;
            timetable.appendChild(courseElement);
        });

        timetableSlider.appendChild(timetable);
    }

    // 과 선택 버튼을 눌렀을 때 드롭다운 메뉴 표시/숨김
    departmentButton.addEventListener('click', function () {
        departmentList.style.display = departmentList.style.display === 'block' ? 'none' : 'block';
    });

    // 드롭다운 메뉴에서 과를 선택했을 때
    departmentList.addEventListener('click', function (event) {
        if (event.target.tagName === 'LI') {
            const selectedDepartment = event.target.textContent;
            const selectedDepartmentValue = event.target.dataset.value;

            departmentButton.textContent = selectedDepartment; // 버튼 텍스트 변경
            departmentButton.dataset.value = selectedDepartmentValue; // 데이터 값 변경

            departmentList.style.display = 'none'; // 드롭다운 메뉴 숨기기

            if (selectedDepartmentValue) {
                // 선택된 학과의 모든 강의 가져오기
                fetchCoursesByDepartment(selectedDepartmentValue);
            }
        }
    });

    // 선택된 학과에 해당하는 모든 강의를 가져오는 함수
    async function fetchCoursesByDepartment(departmentId) {
        try {
            const response = await fetch(`http://localhost:8080/courses/filtered?department=${departmentId}`);
            const courses = await response.json();
            displayCoursesCheckboxList(courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }

    // 가져온 강의들을 체크박스 리스트 형태로 표시하는 함수
    function displayCoursesCheckboxList(courses) {
        departmentContainer.innerHTML = ''; // 기존 강의 리스트 초기화

        if (courses.length === 0) {
            departmentContainer.innerHTML = '<p>No courses available for the selected department.</p>';
            return;
        }

        const form = document.createElement('form');
        form.className = 'coursesForm';

        // 강의명 중복 제거
        const uniqueCourses = Array.from(new Set(courses.map(course => course.courseName)));

        uniqueCourses.forEach(courseName => {
            const checkboxWrapper = document.createElement('div');
            checkboxWrapper.className = 'checkbox-wrapper';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `course-${courseName}`;
            checkbox.name = 'courses';
            checkbox.value = courseName;

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = `${courseName}`;

            checkboxWrapper.appendChild(checkbox);
            checkboxWrapper.appendChild(label);
            form.appendChild(checkboxWrapper);
        });

        departmentContainer.appendChild(form);
    }
});
