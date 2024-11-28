// comparing 테이블의 1행 1열 클릭 이벤트
document.getElementById('KEEP_keep_button').addEventListener('click', function() {
    console.log('KEEPKEEP_button_clicked');
    saveTimetable(keepCombination);
});

// 시간표 객체의 데이터를 정렬하여 JSON 문자열로 변환하는 함수
function sortTimetable(timetable) {
    // 각 시간표의 키를 정렬하여 순서에 관계없이 비교할 수 있도록 함
    return timetable.map(course => {
        return Object.keys(course).sort().reduce((sorted, key) => {
            sorted[key] = course[key];
            return sorted;
        }, {});
    }).sort((a, b) => {
        return JSON.stringify(a).localeCompare(JSON.stringify(b));
    });
}

function saveTimetable(timetableData) {
    let savedTimetables = JSON.parse(localStorage.getItem('savedTimetables')) || [];
    let newTimetableString = JSON.stringify(sortTimetable(timetableData));

    let isDuplicate = savedTimetables.some(savedTimetable => JSON.stringify(sortTimetable(savedTimetable)) === newTimetableString);

    if (!isDuplicate) {
        savedTimetables.push(timetableData);
        localStorage.setItem('savedTimetables', JSON.stringify(savedTimetables));
    }
}

// let timetableToDelete = { /* 삭제하고 싶은 시간표 데이터 */ };
// deleteTimetable(timetableToDelete);

function deleteTimetable(timetableData) {
    // 로컬 스토리지에서 저장된 시간표 목록을 불러오기
    let savedTimetables = JSON.parse(localStorage.getItem('savedTimetables')) || [];

    // 삭제하려는 시간표를 찾고 필터링하여 새로운 배열 생성
    savedTimetables = savedTimetables.filter(savedTimetable => JSON.stringify(savedTimetable) !== JSON.stringify(timetableData));

    // 필터링된 시간표 목록을 로컬 스토리지에 다시 저장
    localStorage.setItem('savedTimetables', JSON.stringify(savedTimetables));
}


function updateTimetableChoices() {
    let savedTimetables = JSON.parse(localStorage.getItem('savedTimetables')) || [];

    const choiceContainer = document.querySelector('#timetableChoices');

    if (!choiceContainer) {
        console.error("Cannot find the choice container element.");
        return;
    }

    // 기존 목록 초기화
    choiceContainer.innerHTML = '';

    // 저장된 시간표 데이터를 리스트에 추가
    savedTimetables.forEach((timetable, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'timetable-item';

        const button = document.createElement('button');
        button.textContent = `시간표${index + 1}`;
        button.className = 'timetable-button';

        // 클릭 이벤트 추가
        button.addEventListener('click', (event) => {
            console.log(`시간표 ${index + 1} 클릭됨`);
            displayTimetableInView(timetable);
        });

        listItem.appendChild(button);
        choiceContainer.appendChild(listItem);

        console.log(`Added event listener to timetable ${index + 1}`);
    });

    // '새 시간표 만들기' 옵션 추가
    const newTimetableItem = document.createElement('li');
    const newTimetableButton = document.createElement('button');
    newTimetableButton.textContent = '새 시간표 만들기';
    newTimetableButton.className = 'new-timetable-button';

    newTimetableButton.addEventListener('click', () => {
        console.log('새 시간표 만들기 버튼 클릭됨');
    });

    newTimetableItem.appendChild(newTimetableButton);
    choiceContainer.appendChild(newTimetableItem);
}

// 시간표 테이블에 시간표를 표시하는 함수
function displayTimetableInView(timetableCombination) {
    const dayOfWeekMap = {
        '월': 'mon',
        '화': 'tue',
        '수': 'wed',
        '목': 'thu',
        '금': 'fri'
    };

    // 테이블 셀 초기화 (메인 테이블에 대한 초기화)
    clearTimeTable('main');

    timetableCombination.forEach(course => {
        const dayCode = dayOfWeekMap[course.dayOfWeek];
        if (!dayCode) {
            console.error("Invalid day code for course:", course);
            return;
        }

        const startPeriod = parseInt(course.startPeriod);
        const endPeriod = parseInt(course.endPeriod);
        const finalEndPeriod = endPeriod || startPeriod;

        // 강의 색상 설정
        const courseColor = courseColorMap[course.courseName] || colorPalette[colorIndex % colorPalette.length];
        if (!courseColorMap[course.courseName]) {
            courseColorMap[course.courseName] = courseColor; // 강의 색상 저장
            colorIndex++; // 다음 강의는 다른 색상 사용
        }

        // 시간표에 각 강의를 색칠
        for (let period = startPeriod; period <= finalEndPeriod; period++) {
            const cellId = `${dayCode}-${period}`;
            const cell = document.getElementById(cellId);

            if (cell) {
                cell.style.backgroundColor = courseColor; // 셀 배경색 설정
                cell.style.borderColor = courseColor; // 셀 구분선을 배경색과 동일하게 설정
                cell.classList.add('occupied'); // 점유된 셀 표시

                // 셀의 텍스트 정렬 설정
                if (period === startPeriod) {
                    // 첫 번째 셀에만 강의명과 교수명 표시 및 왼쪽 상단 정렬
                    cell.innerHTML = `<strong style="font-size: 14px; color: #2e2e2e;">${course.courseName}</strong><br><span style="font-size: 11px; color: #8c8c8c;">${course.professorName}</span>`;
                    cell.classList.add('left-top-align');
                } else {
                    // 나머지 셀은 비워두고 같은 색상 유지
                    cell.innerHTML = '';
                    cell.classList.add('left-top-align');
                }

                // 구분선 조정 (강의 시간 외부와 맞닿는 부분은 기본 구분선 유지)
                if (period === startPeriod) {
                    cell.style.borderTop = '1px solid #d1d1d1'; // 강의의 시작 부분은 기본 구분선 유지
                }
                if (period === finalEndPeriod) {
                    cell.style.borderBottom = '1px solid #d1d1d1'; // 강의의 끝 부분은 기본 구분선 유지
                }
                if (dayCode === 'mon') {
                    cell.style.borderLeft = '1px solid #d1d1d1'; // 월요일의 왼쪽 구분선 유지
                }
                if (dayCode === '금') {
                    cell.style.borderRight = '1px solid #d1d1d1'; // 금요일의 오른쪽 구분선 유지
                }
            } else {
                console.error("Cell not found:", cellId);
            }
        }
    });
}

// 특정 테이블을 초기화하는 함수
function clearTimeTable(tableId) {
    const table = document.getElementById(tableId);
    if (!table) {
        console.error("Table not found:", tableId);
        return;
    }

    const rows = table.getElementsByTagName('tr');
    for (let i = 1; i < rows.length; i++) { // 첫 번째 행은 건너뜀 (요일 헤더 행)
        const cells = rows[i].getElementsByTagName('td');
        for (let j = 1; j < cells.length; j++) { // 첫 번째 열은 건너뜀 (시간 헤더 열)
            const cell = cells[j];
            cell.style.backgroundColor = '';  // 배경색 초기화
            cell.innerHTML = '';              // 내용 초기화
            cell.classList.remove('occupied'); // 점유 클래스 제거
            cell.style.borderTop = '';        // 경계선 초기화
            cell.style.borderBottom = '';     // 경계선 초기화
            cell.classList.remove('left-top-align'); // 왼쪽 상단 정렬 클래스 제거
        }
    }
}
