document.addEventListener('DOMContentLoaded', function () {
    let selectedTimes = [];
    let courseNames = [];
    let requiredCourses = [];

    // 과 선택 버튼 및 강의 체크박스 표시 기능
    const departmentButton = document.getElementById('departmentButton');
    const departmentList = document.getElementById('departmentList');
    const departmentContainer = document.getElementById('departmentContainer'); // HTML에 이 ID가 있는지 확인하세요.
    const totalCreditButton = document.getElementById('totalCreditButton');

    let selectedDepartment = ''; // 선택된 학과 저장
    let selectedTotalCredits = ''; // 선택된 학점 저장

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
        console.log("Apply button clicked");
        // 선택된 시간들을 availableTimes에 저장
        availableTimes = [];
        cells.forEach(cell => {
            if (cell.classList.contains("selected-time")) {
                availableTimes.push(cell.id);
            }
        });
        console.log("Selected times saved:", availableTimes);
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
        console.log("Generate button clicked"); // 클릭 이벤트 발생 확인용 로그

        const department_id = document.getElementById('departmentButton').dataset.value;
        const totalCredits = document.getElementById('totalCreditButton').dataset.value;
        const availableTimesString = consolidateSelectedTimes(selectedTimes);

        // courseNames와 requiredCourses 설정
        const courseNames = [];
        const requiredCourses = [];

        // 모든 체크박스를 조회하여 courseNames와 requiredCourses 설정
        document.querySelectorAll('.styled-checkbox-input').forEach(checkbox => {
            const clickCount = parseInt(checkbox.dataset.clickCount) || 0;
            if (clickCount === 1) {
                courseNames.push(checkbox.value);
            } else if (clickCount === 2) {
                courseNames.push(checkbox.value);
                requiredCourses.push(checkbox.value);
            }
        });

        // 서버로 필터링 요청
        try {
            const params = new URLSearchParams({
                department_id: department_id,
                totalCredits: totalCredits,
                availableTimes: availableTimesString,
                courseNames: courseNames.join(','),
                requiredCourses: requiredCourses.join(',')
            });

            const response = await fetch(`http://localhost:8080/courses/generateTimetable?${params.toString()}`);
            const responseJson = await response.json();
            console.log('Response JSON:', responseJson);
            timetableCombinations = responseJson;

            // 콘솔에 전달된 조건 출력
            console.log("Parameters for timetable generation:");
            console.log("Department_id:", department_id);
            console.log("Total Credits:", totalCredits);
            console.log("Available Times:", availableTimes);
            console.log("Course Names:", courseNames);
            console.log("Required Courses:", requiredCourses);
            await findFilteredCombinations();

            console.log("Generated timetable combinations:", timetableCombinations);
        } catch (error) {
            console.error('Error fetching timetable combinations:', error);
        }

        // 시간표 슬라이더 초기화 및 첫 시간표 표시
        currentIndex = 0;
        displayTimetable(currentIndex);
    });

    // 요일 및 숫자를 변환하고 범위로 합치는 함수
    function consolidateSelectedTimes(selectedTimes) {
        const dayMap = { mon: '월', tue: '화', wed: '수', thu: '목', fri: '금' };
        const consolidated = {}; // 요일별로 셀을 그룹화할 객체

        console.log("Selected times before consolidation:", selectedTimes);
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
            console.log(`Periods for ${day}:`, periods);

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
            console.log(`Range string for ${day}:`, rangeStr);
            return rangeStr;
        });

        console.log("Final consolidated time string:", ranges.join(','));
        return ranges.map(range => range.trim()).join(', '); // 예: "화 1-3, 수 2-4"
    }

    // 드롭다운 메뉴 버튼 클릭 시 표시/숨김 및 위치 조정
    document.querySelectorAll('.dropdown-button').forEach(button => {
        button.addEventListener('click', function (event) {
            event.stopPropagation(); // 이벤트 전파 중지
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
        item.addEventListener('click', function (event) {
            event.stopPropagation(); // 이벤트 전파 중지
            const button = item.parentElement.previousElementSibling;

            // 데이터 값 업데이트 및 메뉴 숨기기
            button.dataset.value = item.getAttribute('data-value');
            item.parentElement.style.display = 'none';

            // 학과 선택 시 학과 값 업데이트
            if (button.id === 'departmentButton') {
                selectedDepartment = button.dataset.value;
                console.log("Selected department_id:", selectedDepartment);
                if (selectedDepartment) {
                    fetchCoursesByDepartment(selectedDepartment);
                }
            }

            // 학점 선택 시 학점 값 업데이트
            if (button.id === 'totalCreditButton') {
                selectedTotalCredits = button.dataset.value;
                console.log("Selected total credits:", selectedTotalCredits);
            }
        });
    });

    // 선택된 학과에 해당하는 모든 강의를 가져오는 함수
    async function fetchCoursesByDepartment(departmentId) {
        try {
            const response = await fetch(`http://localhost:8080/courses/filtered?department=${departmentId}`);
            const courses = await response.json();
            console.log(`Fetched courses for department ${departmentId}:`, courses); // 과에 맞는 강의들 확인용 로그
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
            checkboxWrapper.className = 'checkbox-wrapper styled-checkbox'; // CSS 클래스 추가

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `course-${courseName}`;
            checkbox.name = 'courses';
            checkbox.value = courseName;
            checkbox.className = 'styled-checkbox-input'; // 체크박스에 스타일 클래스 추가

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = `${courseName}`;
            label.className = 'styled-checkbox-label'; // 라벨에 스타일 클래스 추가

            checkboxWrapper.appendChild(checkbox);
            checkboxWrapper.appendChild(label);
            form.appendChild(checkboxWrapper);

            // 체크박스 상태 변경 로직
            let clickCount = 0; // 클릭 횟수 추적
            checkbox.addEventListener('click', function (e) {
                e.preventDefault(); // 기본 체크 동작 방지
                clickCount = (clickCount + 1) % 3; // 0, 1, 2 반복

                if (clickCount === 0) {
                    checkbox.checked = false;
                    checkbox.setAttribute('data-state', 'unchecked');
                    courseNames = courseNames.filter(name => name !== courseName);
                    requiredCourses = requiredCourses.filter(name => name !== courseName);
                } else if (clickCount === 1) {
                    checkbox.checked = true;
                    checkbox.setAttribute('data-state', 'checked');
                    courseNames.push(courseName);
                    requiredCourses = requiredCourses.filter(name => name !== courseName);
                } else if (clickCount === 2) {
                    checkbox.checked = false;
                    checkbox.setAttribute('data-state', 'intermediate');
                    requiredCourses.push(courseName);
                }

                updateCheckboxAppearance(checkbox);
                console.log(`Checkbox ${courseName} state: ${checkbox.getAttribute('data-state')}`);
            });
        });

        departmentContainer.appendChild(form);
    }

    // 체크박스 상태에 따라 스타일을 업데이트하는 함수
    function updateCheckboxAppearance(checkbox) {
        if (checkbox.getAttribute('data-state') === 'checked') {
            checkbox.classList.add('checked-state');
            checkbox.classList.remove('intermediate-state');
        } else if (checkbox.getAttribute('data-state') === 'intermediate') {
            checkbox.classList.add('intermediate-state');
            checkbox.classList.remove('checked-state');
        } else {
            checkbox.classList.remove('checked-state');
            checkbox.classList.remove('intermediate-state');
        }
    }

    // 조건에 맞는 시간표 조합 찾기 함수
    async function findFilteredCombinations() {
        try {
            // 현재 선택된 필터링 조건을 콘솔에 출력
            console.log("Before calling findFilteredCombinations:");
            console.log('Selected Department:', selectedDepartment);
            console.log('Selected Total Credits:', selectedTotalCredits);
            console.log('Selected Available Times:', availableTimes);
            console.log('Selected Course Names:', courseNames);
            console.log('Selected Required Courses:', requiredCourses);

            const params = new URLSearchParams({
                department_id: selectedDepartment,
                totalCredits: selectedTotalCredits,
                availableTimes: consolidateSelectedTimes(selectedTimes),
                courseNames: courseNames.join(','),
                requiredCourses: requiredCourses.join(',')
            });

            console.log('Generated URL Parameters:', params.toString()); // URL 파라미터 확인

            const response = await fetch(`http://localhost:8080/courses/generateTimetable?${params.toString()}`);
            const responseJson = await response.json();

            // 시간표 조합들을 timetableCombinations 배열에 저장
            timetableCombinations = responseJson;

            // 첫 번째 시간표 조합을 표시
            if (timetableCombinations.length > 0) {
                currentIndex = 0;
                displayTimetable(currentIndex);
            } else {
                console.log("No timetable combinations found");
                clearTimeTable();
            }
        } catch (error) {
            console.error('Error generating timetable combinations:', error);
        }
    }

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
        clearTimeTable(); // 기존 시간표 초기화
        const combination = timetableCombinations[index];
        if (combination) {
            fillTimeTable(combination); // 새 시간표 조합을 셀에 색칠
            keepCombination=combination;
        } else {
            console.log("No timetable combination available at index:", index);
        }
    }
});