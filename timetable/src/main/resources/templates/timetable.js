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
    let isConflict = false; // 시간 중복 여부를 확인하는 변수

    const daysAndPeriods = course.time.split(', '); // ex. "월 1-2, 목 5" 형식
    const courseColor = courseColorMap[course.courseName] || colorPalette[colorIndex % colorPalette.length]; // 강의 색상
    courseColorMap[course.courseName] = courseColor; // 강의 색상 저장
    colorIndex++; // 다음 강의는 다른 색상 사용

    // 중복된 시간 여부를 우선 확인
    daysAndPeriods.forEach(slot => {
        const [day, periodRange] = slot.split(' ');
        const dayCode = dayOfWeekMap[day]; // 요일 매핑

        const [startPeriod, endPeriod] = periodRange.includes('-')
            ? periodRange.split('-').map(Number)
            : [parseInt(periodRange), parseInt(periodRange)]; // 단일 교시 처리

        const finalEndPeriod = endPeriod || startPeriod;

        // 각 교시별로 중복 여부를 확인
        for (let period = startPeriod; period <= finalEndPeriod; period++) {
            const cellId = `${dayCode}-${period}`;
            const cell = document.getElementById(cellId);

            // 중복된 셀이 발견되면 전체 추가를 막음
            if (cell && cell.classList.contains('occupied')) {
                isConflict = true; // 하나라도 중복된 시간이 있으면 강의 전체를 추가하지 않음
            }
        }
    });

    // 강의의 전체 시간이 유효하지 않으면 추가하지 않음
    if (isConflict) {
        alert(`시간이 중복되어 추가할 수 없습니다.`);
        return true; // 중복된 강의는 추가하지 않음
    }

    // 유효한 강의일 경우에만 시간표에 추가
    daysAndPeriods.forEach(slot => {
        const [day, periodRange] = slot.split(' ');
        const dayCode = dayOfWeekMap[day]; // 요일 매핑

        const [startPeriod, endPeriod] = periodRange.includes('-')
            ? periodRange.split('-').map(Number)
            : [parseInt(periodRange), parseInt(periodRange)]; // 단일 교시 처리

        const finalEndPeriod = endPeriod || startPeriod;

        // 각 셀에 동일한 색상을 적용하고 첫 셀에만 강의 정보 표시
        for (let period = startPeriod; period <= finalEndPeriod; period++) {
            const cellId = `${dayCode}-${period}`;
            const cell = document.getElementById(cellId);

            if (cell && !isTemporary) {
                cell.style.backgroundColor = courseColor; // 모든 셀에 같은 배경색 적용
                cell.setAttribute('data-color', courseColor); // 셀에 배경색을 저장

                // 연속된 강의 시간에서는 윗경계선과 아래경계선 색상을 배경색과 일치
                if (period > startPeriod) {
                    const previousCell = document.getElementById(`${dayCode}-${period - 1}`);
                    if (previousCell && previousCell.getAttribute('data-color') === courseColor) {
                        cell.style.borderTop = `2px solid ${courseColor}`; // 위쪽 경계선을 배경색으로 설정
                        previousCell.style.borderBottom = `2px solid ${courseColor}`; // 아래쪽 경계선을 배경색으로 설정
                        cell.setAttribute('data-border-top', courseColor); // 경계선 색상 저장
                        previousCell.setAttribute('data-border-bottom', courseColor);
                    }
                }

                if (period === startPeriod) {
                    // 시작 셀에만 강의 정보 표시
                    cell.innerHTML = `${course.courseName} (${course.professorName})`;
                    cell.style.verticalAlign = 'middle';
                } else {
                    // 나머지 셀은 비워둠
                    cell.innerHTML = '';
                }
                cell.classList.add('occupied'); // 셀에 "occupied" 클래스 추가 (이미 점유된 시간)
            }
        }
    });

    return isConflict;
}

// 강의 목록 위에 마우스를 올리면 임시로 셀을 연하게 칠하는 함수
function highlightTemporary(course) {
    const dayOfWeekMap = {
        '월': 'mon',
        '화': 'tue',
        '수': 'wed',
        '목': 'thu',
        '금': 'fri'
    };

    const daysAndPeriods = course.time.split(', '); // ex. "월 1-2, 목 5" 형식

    daysAndPeriods.forEach(slot => {
        const [day, periodRange] = slot.split(' ');
        const dayCode = dayOfWeekMap[day]; // 요일 매핑

        const [startPeriod, endPeriod] = periodRange.includes('-')
            ? periodRange.split('-').map(Number)
            : [parseInt(periodRange), parseInt(periodRange)]; // 단일 교시 처리

        const finalEndPeriod = endPeriod || startPeriod;

        // 셀을 연하게 칠하기 (addedCourses에 상관없이 모든 셀에 적용)
        for (let period = startPeriod; period <= finalEndPeriod; period++) {
            const cellId = `${dayCode}-${period}`;
            const cell = document.getElementById(cellId);

            if (cell) {
                cell.style.backgroundColor = 'rgba(220,220,220,0.63)'; // 연한 색으로 표시
            }
        }
    });
}

// 마우스를 다른 곳으로 옮기면 셀 색상을 초기화하는 함수
function clearTemporary(course) {
    const dayOfWeekMap = {
        '월': 'mon',
        '화': 'tue',
        '수': 'wed',
        '목': 'thu',
        '금': 'fri'
    };

    const daysAndPeriods = course.time.split(', '); // ex. "월 1-2, 목 5" 형식

    daysAndPeriods.forEach(slot => {
        const [day, periodRange] = slot.split(' ');
        const dayCode = dayOfWeekMap[day]; // 요일 매핑
        const [startPeriod, endPeriod] = periodRange.includes('-')
            ? periodRange.split('-').map(Number)
            : [parseInt(periodRange), parseInt(periodRange)]; // 단일 교시 처리

        const finalEndPeriod = endPeriod || startPeriod;

        // 셀 색상 초기화
        for (let period = startPeriod; period <= finalEndPeriod; period++) {
            const cellId = `${dayCode}-${period}`;
            const cell = document.getElementById(cellId);

            if (cell) {
                const originalColor = cell.getAttribute('data-color');
                cell.style.backgroundColor = originalColor ? originalColor : ''; // 저장된 색상 사용, 없으면 기본값

                // 경계선 복원
                if (cell.getAttribute('data-border-top')) {
                    cell.style.borderTop = `2px solid ${cell.getAttribute('data-border-top')}`;
                } else {
                    cell.style.borderTop = ''; // 기본 경계선으로 복원
                }
                if (cell.getAttribute('data-border-bottom')) {
                    cell.style.borderBottom = `2px solid ${cell.getAttribute('data-border-bottom')}`;
                } else {
                    cell.style.borderBottom = ''; // 기본 경계선으로 복원
                }
            }
        }
    });
}

// 강의 목록에서 마우스를 올리고 내릴 때 이벤트 설정
document.getElementById('mainList').addEventListener('mouseover', function(event) {
    const target = event.target.closest('li');

    if (target) {
        const course = {
            courseName: target.querySelector('div:nth-child(2)').textContent,
            professorName: target.querySelector('div:nth-child(4)').textContent,
            time: target.querySelector('div:nth-child(6)').textContent // ex. "월 1-2, 목 5"
        };

        highlightTemporary(course);  // 임시로 시간표 셀을 칠함
    }
});

document.getElementById('mainList').addEventListener('mouseout', function(event) {
    const target = event.target.closest('li');

    if (target) {
        const course = {
            courseName: target.querySelector('div:nth-child(2)').textContent,
            professorName: target.querySelector('div:nth-child(4)').textContent,
            time: target.querySelector('div:nth-child(6)').textContent // ex. "월 1-2, 목 5"
        };

        clearTemporary(course);  // 색상 초기화
    }
});

// 강의 목록을 클릭할 때 실행될 이벤트 설정
document.getElementById('mainList').addEventListener('click', function(event) {
    const target = event.target.closest('li');

    if (target) {
        // 강의 데이터를 가져오기 위한 예시: 클릭된 li 요소에서 데이터를 가져옴
        const course = {
            courseName: target.querySelector('div:nth-child(2)').textContent,
            professorName: target.querySelector('div:nth-child(4)').textContent,
            time: target.querySelector('div:nth-child(6)').textContent // ex. "월 1-2, 목 5"
        };

        // 새로 추가할 강의 시간이 이미 시간표에 있는지 임시로 확인
        const conflict = fillTimeTable(course, true);

        if (!conflict) {
            // 시간이 중복되지 않으면 실제로 시간표에 추가
            fillTimeTable(course, false);
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