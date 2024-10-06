document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains('deleteButton')) {
        document.querySelector('.list').style.display = 'none'; // 목록 닫기
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');

    if (searchButton) {
        searchButton.addEventListener('click', function () {
            console.log('Search button clicked');

            // 입력된 값들 가져오기
            const department = document.getElementById('department').value.trim();
            const division = document.getElementById('division').value.trim();
            const credit = document.getElementById('credit').value.trim();
            const searchOption = document.getElementById('search-option').value.trim();
            const searchQuery = document.getElementById('search-query').value.trim();

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
            // 서버로 필터링된 데이터를 요청
            fetch(`http://localhost:8080/courses/filtered?${params.toString()}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Filtered data:', data);
                    makeList(data);  // 필터링된 데이터를 이용해 목록 생성
                })
                .catch(error => console.error('Error fetching filtered data:', error));
        });
    } else {
        console.error("Search button not found");
    }
});

// 색상 배열 정의 (각 강의마다 다른 색을 적용)
// 색상 배열 정의 (각 강의마다 다른 색을 적용)
const colorPalette = [
    '#f6c7c7', '#bad4f1', '#fdeebd', '#ccffcc', '#ffccff', '#cc99ff', '#ffff99', '#99ff99', '#99ffff'
];
let colorIndex = 0; // 색상을 순서대로 선택하기 위한 인덱스

// 이미 추가된 강의 시간을 추적하는 배열
const addedCourses = [];

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
    const courseColor = colorPalette[colorIndex % colorPalette.length]; // 색상 선택
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

        // 추가된 강의를 시간표에 기록
        addedCourses.push({ dayCode, startPeriod, endPeriod: finalEndPeriod, courseName: course.courseName, professorName: course.professorName });
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

            if (cell && !cell.classList.contains('occupied')) {
                cell.style.backgroundColor = 'rgba(236,214,239,0.63)'; // 연한 색으로 표시
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
                if (cell.classList.contains('occupied')) {
                    // 이미 추가된 수업이면 원래 색상(`data-color`)으로 복원
                    cell.style.backgroundColor = cell.getAttribute('data-color');
                } else {
                    // 그렇지 않으면 색상 초기화
                    cell.style.backgroundColor = '';
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

