// 색상 배열 정의 (각 강의마다 다른 색을 적용)
const colorPalette = [
    '#d9e9ff', '#c6e9ff', '#b1e2ff', '#89ceff', '#6297bd', '#6290bd', '#597eac', '#6b88ac', '#5084a6'
];

let colorIndex = 0; // 색상을 순서대로 선택하기 위한 인덱스

// 강의 정보를 추가할 때마다 색상과 시간을 추적하기 위한 객체
const courseColorMap = {};

// 강의 목록에서 항목을 클릭할 때 시간표를 채우는 함수
function fillTimeTable(course, isTemporary = false) {
    const dayOfWeekMap = {
        '월': 'mon',
        '화': 'tue',
        '수': 'wed',
        '목': 'thu',
        '금': 'fri'
    };

    if (!course.formattedTime) {
        console.error("The course data does not have a formattedTime attribute:", course);
        return;
    }

    const daysAndPeriods = course.formattedTime.split(', '); // ex. "월 1-2, 목 5" 형식
    console.log("Parsed days and periods:", daysAndPeriods);

    daysAndPeriods.forEach(slot => {
        const [day, periodRange] = slot.split(' ');

        if (!day || !periodRange) {
            console.error("Invalid slot data:", slot);
            return;
        }

        const dayCode = dayOfWeekMap[day]; // 요일 매핑

        const [startPeriod, endPeriod] = periodRange.includes('-')
            ? periodRange.split('-').map(Number)
            : [parseFloat(periodRange), parseFloat(periodRange)]; // 단일 교시 처리

        const finalEndPeriod = endPeriod || startPeriod;

        for (let period = startPeriod; period <= finalEndPeriod; period++) {
            const cellId = `${dayCode}-${period}`;
            const cell = document.getElementById(cellId);

            if (cell && !isTemporary) {
                if (!cell.dataset.originalColor) {
                    cell.dataset.originalColor = cell.style.backgroundColor || '';
                }

                cell.style.backgroundColor = course.color || 'lightblue'; // 강의 색상 적용
                cell.classList.add('occupied'); // 셀에 점유 표시

                if (period === startPeriod) {
                    cell.innerHTML = `${course.courseName} (${course.professorName})`;
                    cell.style.verticalAlign = 'middle';
                } else {
                    cell.innerHTML = '';
                }
            }
        }
    });
}

function highlightTemporary(course) {
    const dayOfWeekMap = {
        '월': 'mon',
        '화': 'tue',
        '수': 'wed',
        '목': 'thu',
        '금': 'fri'
    };

    // 필요한 필드가 있는지 확인
    if (!course.formattedTime) {
        console.error("Invalid course data: Missing formattedTime:", course);
        return;
    }

    const daysAndPeriods = course.formattedTime.split(', '); // "월 1.0-2.0, 화 3.0-4.0" 형태

    daysAndPeriods.forEach(slot => {
        if (!slot.includes(' ')) {
            console.error("Invalid slot data:", slot);
            return; // 유효하지 않은 데이터 건너뜀
        }

        const [day, periodRange] = slot.split(' ');
        const dayCode = dayOfWeekMap[day]; // 요일 매핑

        if (!dayCode) {
            console.error("Invalid day code:", day);
            return; // 유효하지 않은 요일 건너뜀
        }

        const [startPeriod, endPeriod] = periodRange.includes('-')
            ? periodRange.split('-').map(Number)
            : [parseFloat(periodRange), parseFloat(periodRange)]; // 단일 교시 처리

        if (isNaN(startPeriod) || isNaN(endPeriod)) {
            console.error("Invalid period data:", startPeriod, endPeriod);
            return; // 유효하지 않은 교시 건너뜀
        }

        const finalEndPeriod = endPeriod || startPeriod;

        // 셀을 연하게 칠하기
        for (let period = startPeriod; period <= finalEndPeriod; period++) {
            const cellId = `${dayCode}-${period}`;
            const cell = document.getElementById(cellId);

            if (cell) {
                // 기존 색상을 덮어쓰지 않도록 수정
                if (!cell.dataset.originalColor) {
                    cell.dataset.originalColor = cell.style.backgroundColor || '';
                }

                // 회색으로 임시 표시
                cell.style.backgroundColor = 'rgba(220,220,220,0.63)';
                cell.classList.add('highlighted-temporary');
            }
        }
    });
}

function clearTemporary(course) {
    const dayOfWeekMap = {
        '월': 'mon',
        '화': 'tue',
        '수': 'wed',
        '목': 'thu',
        '금': 'fri'
    };

    // course.time이 유효한지 확인
    if (!course || !course.formattedTime) {
        console.error("Invalid course data:", course);
        return; // 유효하지 않은 데이터라면 함수 종료
    }

    const daysAndPeriods = course.formattedTime.split(', '); // "월 1-2, 목 5" 형식

    daysAndPeriods.forEach(slot => {
        // slot이 올바른 형식인지 확인
        if (!slot.includes(' ')) {
            console.error("Invalid slot data:", slot);
            return; // 유효하지 않은 데이터라면 해당 slot 건너뜀
        }

        const [day, periodRange] = slot.split(' ');
        const dayCode = dayOfWeekMap[day]; // 요일 매핑

        if (!dayCode) {
            console.error("Invalid day code:", day);
            return; // 유효하지 않은 요일이라면 건너뜀
        }

        const [startPeriod, endPeriod] = periodRange.includes('-')
            ? periodRange.split('-').map(Number)
            : [parseInt(periodRange), parseInt(periodRange)]; // 단일 교시 처리

        const finalEndPeriod = endPeriod || startPeriod;

        // 셀 색상 초기화
        for (let period = startPeriod; period <= finalEndPeriod; period++) {
            const cellId = `${dayCode}-${period}`;
            const cell = document.getElementById(cellId);

            if (cell && cell.classList.contains('highlighted-temporary')) {
                // 임시 색상만 복원
                const originalColor = cell.dataset.originalColor;
                cell.style.backgroundColor = originalColor !== undefined ? originalColor : '';
                delete cell.dataset.originalColor; // 복원 후 제거
                cell.classList.remove('highlighted-temporary');
            }
        }
    });
}


// 강의 목록에서 마우스를 올리고 내릴 때 이벤트 설정
document.getElementById('mainList').addEventListener('mouseover', function(event) {
    const target = event.target.closest('li');

    if (target) {
        const course = {
            id: parseInt(target.querySelector('div:nth-child(1)').textContent),  // 강의 번호 (id)
            departmentName: target.querySelector('div:nth-child(2)').textContent, // 과
            courseName: target.querySelector('div:nth-child(3)').textContent,     // 과목명
            division: target.querySelector('div:nth-child(4)').textContent,       // 이수구분
            professorName: target.querySelector('div:nth-child(5)').textContent,  // 담당교수
            credit: parseInt(target.querySelector('div:nth-child(6)').textContent), // 학점
            formattedTime: target.querySelector('div:nth-child(7)').textContent,  // 시간
            classroom: target.querySelector('div:nth-child(8)').textContent       // 강의실
        };


        highlightTemporary(course);  // 임시로 시간표 셀을 칠함
    }
});

document.getElementById('mainList').addEventListener('mouseout', function(event) {
    const target = event.target.closest('li');

    if (target) {
        const course = {
            id: parseInt(target.querySelector('div:nth-child(1)').textContent),  // 강의 번호 (id)
            departmentName: target.querySelector('div:nth-child(2)').textContent, // 과
            courseName: target.querySelector('div:nth-child(3)').textContent,     // 과목명
            division: target.querySelector('div:nth-child(4)').textContent,       // 이수구분
            professorName: target.querySelector('div:nth-child(5)').textContent,  // 담당교수
            credit: parseInt(target.querySelector('div:nth-child(6)').textContent), // 학점
            formattedTime: target.querySelector('div:nth-child(7)').textContent,  // 시간
            classroom: target.querySelector('div:nth-child(8)').textContent       // 강의실
        };


        clearTemporary(course);  // 색상 초기화
    }
});

document.getElementById('mainList').addEventListener('click', function (event) {
    // 클릭된 li 요소를 찾음
    const target = event.target.closest('li');

    if (target) {
        // li 요소의 data-course-id 속성을 이용해 강의 ID 가져오기
        const courseId = parseInt(target.getAttribute('data-course-id'));

        if (courseId) {
            // Fetch API를 사용해 백엔드로 해당 강의 ID의 정보를 요청함
            fetch(`http://localhost:8080/courses/${courseId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(courseData => {
                    console.log("Fetched course data:", courseData);
                    // 해당 강의의 데이터를 가져온 후, 이후 ID들을 확인하여 같은 강의인지 확인

                    // 현재 강의 ID 이후부터 데이터베이스의 다른 항목들과 비교
                    let courseList = [];
                    courseList.push(courseData); // 첫 번째로 가져온 항목 추가

                    // 다음 항목들을 반복적으로 조회
                    const nextCourseId = courseId + 1;

                    function fetchNextCourse(nextId) {
                        fetch(`http://localhost:8080/courses/${nextId}`)
                            .then(response => {
                                if (response.ok) {
                                    return response.json();
                                } else {
                                    throw new Error('No more matching courses found.');
                                }
                            })
                            .then(nextCourseData => {
                                // 시간 정보만 다르고 나머지 정보가 같은지 비교
                                if (
                                    courseData.departmentName === nextCourseData.departmentName &&
                                    courseData.courseCode === nextCourseData.courseCode &&
                                    courseData.courseName === nextCourseData.courseName &&
                                    courseData.courseNumber === nextCourseData.courseNumber &&
                                    courseData.professorName === nextCourseData.professorName &&
                                    courseData.credit === nextCourseData.credit &&
                                    courseData.division === nextCourseData.division &&
                                    courseData.capacity === nextCourseData.capacity &&
                                    courseData.classroom === nextCourseData.classroom
                                ) {
                                    courseList.push(nextCourseData);
                                    fetchNextCourse(nextId + 1); // 재귀 호출로 다음 항목 조회
                                } else {
                                    console.log('No more matching courses found.');
                                    processCourseData(courseList);
                                }
                            })
                            .catch(() => {
                                processCourseData(courseList);
                            });
                    }

                    fetchNextCourse(nextCourseId);
                })
                .catch(error => {
                    console.error(`There has been a problem with your fetch operation: ${error.message}`);
                });
        } else {
            console.error("강의 ID를 찾을 수 없습니다.");
        }
    }
});

function processCourseData(courseList) {
    // 여러 날에 걸친 강의 데이터 처리
    const daysAndPeriods = courseList.map(course => course.formattedTime);
    console.log("Parsed days and periods:", daysAndPeriods);

    courseList.forEach(course => {
        const conflict = fillTimeTable(course, true);

        if (!conflict) {
            // 시간이 중복되지 않으면 실제로 시간표에 추가
            fillTimeTable(course, false);
            // 로컬 스토리지에 시간표 업데이트
            updateLocalStorageWithTimetable(course);
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    addRightClickListenerToCells();

    // 함수: 모든 timetable td 셀에 우클릭 이벤트 리스너 추가
    function addRightClickListenerToCells() {
        const timetableCells = document.querySelectorAll('.timetable td');

        timetableCells.forEach(cell => {
            // 우클릭 이벤트 리스너 추가
            cell.addEventListener('contextmenu', function (event) {
                // 우클릭 이벤트 기본 메뉴를 비활성화
                event.preventDefault();

                console.log("Right-click detected on:", cell);  // 우클릭된 셀 확인용 로그

                const courseName = cell.querySelector('strong')?.textContent.trim();
                const professorName = cell.querySelector('span')?.textContent.trim();

                if (!courseName || !professorName) {
                    console.error("해당 셀에서 강의 정보를 찾을 수 없습니다.");
                    return;
                }

                // 삭제 확인창 표시
                const confirmDelete = confirm(`강의 "${courseName}" (${professorName})를 삭제하시겠습니까?`);
                if (confirmDelete) {
                    // 로컬 스토리지에서 해당 강의를 삭제하고 시간표를 업데이트
                    removeCourseFromLocalStorage(courseName, professorName);
                    refreshTimetable();
                }
            });
        });
    }

    // 로컬 스토리지에서 강의 삭제
    function removeCourseFromLocalStorage(courseName, professorName) {
        const currentIndex = localStorage.getItem('currentTimetableIndex');
        let timetableCombinations = JSON.parse(localStorage.getItem('timetableCombinations'));

        if (timetableCombinations && timetableCombinations.length > currentIndex) {
            let currentCombination = timetableCombinations[currentIndex];

            // 강의명과 교수명으로 일치하는 강의를 찾아서 삭제
            currentCombination = currentCombination.filter(course => {
                return !(course.courseName === courseName && course.professorName === professorName);
            });

            // 업데이트된 시간표를 로컬 스토리지에 저장
            timetableCombinations[currentIndex] = currentCombination;
            localStorage.setItem('timetableCombinations', JSON.stringify(timetableCombinations));
        } else {
            console.error("현재 활성화된 시간표를 찾을 수 없습니다.");
        }
    }

    // 시간표를 새로고침하는 함수
    function refreshTimetable() {
        // 시간표를 모두 초기화
        document.querySelectorAll('.timetable td').forEach(cell => {
            cell.innerHTML = '';
            cell.style.backgroundColor = ''; // 기존 색상 제거
            cell.classList.remove('occupied'); // occupied 클래스 제거
        });

        // 현재 시간표 조합 인덱스를 가져와 다시 표시
        const currentIndex = localStorage.getItem('currentTimetableIndex');
        if (currentIndex !== null) {
            displayTimetable(parseInt(currentIndex));
        } else {
            console.error("현재 시간표 인덱스를 찾을 수 없습니다.");
        }
    }

    // 시간표 조합을 화면에 표시하는 함수
    function displayTimetable(index) {
        let timetableCombinations = JSON.parse(localStorage.getItem('timetableCombinations'));
        if (timetableCombinations && timetableCombinations.length > index) {
            let combination = timetableCombinations[index];

            combination.forEach(course => {
                fillTimeTable(course, false);
            });

            // 시간표가 업데이트된 후 다시 우클릭 이벤트 리스너 추가
            addRightClickListenerToCells();
        } else {
            console.error("해당 인덱스의 시간표 조합을 찾을 수 없습니다.");
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const departmentButton = document.getElementById('departmentButton');
    const creditButton = document.getElementById('creditButton');
    const divisionButton = document.getElementById('divisionButton');
    const searchOptionButton = document.getElementById('searchOptionButton');

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

    // 드롭다운 메뉴 항목 클릭 시 값 변경, 메뉴 숨기기, 필터링 실행
    document.querySelectorAll('.dropdown-menu li').forEach(item => {
        item.addEventListener('click', function () {
            const button = item.parentElement.previousElementSibling;

            // 검색 항목 버튼 클릭 시에만 텍스트 변경
            if (button.id === 'searchOptionButton') {
                button.textContent = item.textContent; // 선택한 항목으로 버튼 텍스트 변경
            }

            // 모든 항목에 대해 값 업데이트 및 메뉴 숨기기
            button.dataset.value = item.getAttribute('data-value');
            item.parentElement.style.display = 'none';

            // 선택된 옵션에 따라 즉시 필터링 실행
            executeFiltering();
        });
    });


    if (searchButton) {
        searchButton.addEventListener('click', executeFiltering);
    }

    // 닫기 버튼 클릭 시 목록 닫기
    if (deleteButton) {
        deleteButton.addEventListener('click', function () {
            document.querySelector('.list').style.display = 'none';
        });
    }

    function executeFiltering() {
        console.log('Filtering started');

        // 드롭다운에서 선택한 값들 가져오기
        const department = departmentButton.dataset.value;
        const division = divisionButton.dataset.value;
        const credit = creditButton.dataset.value;
        const searchOption = searchOptionButton.dataset.value;
        const searchQuery = document.getElementById('searchQuery').value.trim();
        const selectedTimes = Array.from(document.querySelectorAll('.small-timetable td.selected'))
            .map(cell => cell.id) // 선택된 셀의 id 가져오기

        // 빈 값이 아닌 파라미터만 요청에 포함시키기 위해 객체 생성
        let params = new URLSearchParams();

        // 각 필터링 옵션들이 비어 있지 않으면 URL에 추가
        if (department) params.append("department", department);
        if (division) params.append("division", division);
        if (credit) params.append("credit", credit);
        if (searchOption && searchQuery) {
            params.append("searchOption", searchOption);
            params.append("searchQuery", searchQuery); // 검색어가 있을 때만 추가
        }
        if (selectedTimes.length) {
            params.append("selectedTimes", selectedTimes.join(',')); // 선택된 시간 목록을 ,로 구분하여 추가
        }

        // 서버로 필터링된 데이터를 요청
        fetch(`http://localhost:8080/courses/filtered?${params.toString()}`)
            .then(response => response.json())
            .then(data => {
                console.log('Filtered data:', data);
                makeList(data);  // 필터링된 데이터를 이용해 목록 생성
            })
            .catch(error => console.error('Error fetching filtered data:', error));
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const timeButton = document.querySelector('.timeButton');
    const timeModal = document.getElementById('timeModal');
    const modalClose = document.getElementById('modalClose');

    // .timeButton 클릭 시 모달 열기
    timeButton.addEventListener('click', function () {
        timeModal.style.display = 'block';
    });

    // 닫기 버튼 클릭 시 모달 닫기
    modalClose.addEventListener('click', function () {
        timeModal.style.display = 'none';
    });

    // 모달 외부 클릭 시 모달 닫기
    window.addEventListener('click', function (event) {
        if (event.target === timeModal) {
            timeModal.style.display = 'none';
        }
    });
});

let selectedTimes = [];

document.addEventListener("DOMContentLoaded", function () {
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
        document.getElementById("timeModal").style.display = 'none'; // 모달 닫기
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
                cell.style.backgroundColor = 'rgba(134,164,204,0.7)';
            }
            console.log("Selected times:", selectedTimes);  // 선택된 시간 배열 확인
        }
    }
});

// 요일 및 숫자를 변환하고 범위로 합치는 함수
function consolidateSelectedTimes(selectedTimes) {
    const dayMap = { mon: '월', tue: '화', wed: '수', thu: '목', fri: '금' };
    const consolidated = {}; // 요일별로 셀을 그룹화할 객체

    // 요일별로 선택된 시간 정리
    selectedTimes.forEach(time => {
        const day = dayMap[time.slice(0, 3)]; // 요일을 한글로 변환
        const period = parseFloat(time.slice(3)) + 0.0; // 숫자를 소수점 형식으로 변환

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
                rangeStr += ` ${start.toFixed(1)}-${end.toFixed(1)}, `;
                start = periods[i];
                end = start;
            }
        }
        rangeStr += ` ${start.toFixed(1)}-${end.toFixed(1)}`;
        return rangeStr;
    });

    return ranges.join(','); // 예: "화 1.0-3.0, 수 2.0-4.0"
}

function executeFiltering() {
    const department = departmentButton?.dataset.value || '';
    const division = divisionButton?.dataset.value || '';
    const credit = creditButton?.dataset.value || '';
    const searchOption = searchOptionButton?.dataset.value || '';
    const searchQuery = document.getElementById("searchQuery")?.value.trim() || '';

    // 선택된 시간들을 범위 형식으로 변환
    const selectedTimesString = consolidateSelectedTimes(selectedTimes);

    let params = new URLSearchParams();
    if (department) params.append("department", department);
    if (division) params.append("division", division);
    if (credit) params.append("credit", credit);
    if (searchOption && searchQuery) {
        params.append("searchOption", searchOption);
        params.append("searchQuery", searchQuery);
    }
    if (selectedTimesString) {
        params.append("selectedTimes", selectedTimesString);
    }

    console.log('Requesting filtered data with params:', params.toString());

    fetch(`http://localhost:8080/courses/filtered?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            console.log('Filtered data:', data);
            makeList(data);  // 필터링된 데이터로 목록 생성
        })
        .catch(error => console.error('Error fetching filtered data:', error));
}