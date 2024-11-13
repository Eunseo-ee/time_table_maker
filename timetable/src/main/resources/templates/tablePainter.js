// 색상 배열 정의 (각 강의마다 다른 색을 적용)
const colorPalette = ['#d9e9ff', '#c6e9ff', '#b1e2ff', '#89ceff', '#6297bd', '#6290bd', '#597eac', '#6b88ac', '#5084a6'];
let colorIndex = 0; // 색상을 순서대로 선택하기 위한 인덱스
const courseColorMap = {}; // 강의 이름별로 색상을 저장하는 객체

let keepCombination = []; // 현재 keep 테이블의 시간표 조합

// keep_button 클릭 시 'keep' 테이블의 내용을 'comparing' 테이블로 복사
document.getElementById('keep_button').addEventListener('click', function() {
    console.log("keep_button");

    fillComparingTable(keepCombination); // comparing 테이블에 시간표 출력

});

// 시간표 테이블에 색칠하는 함수
function fillTimeTable(timetableCombination) {
    const dayOfWeekMap = {
        '월': 'mon',
        '화': 'tue',
        '수': 'wed',
        '목': 'thu',
        '금': 'fri'
    };

    // 테이블 셀 초기화 (keep 테이블에 대한 초기화)
    clearTimeTable('keep');

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
            const cellId = `${dayCode}_${period}`;
            const cell = document.getElementById(cellId);

            if (cell) {
                console.log("Cell found. Attempting to apply color:", cellId);
                cell.style.backgroundColor = courseColor; // 셀 배경색 설정
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
            } else {
                console.error("Cell not found:", cellId);
            }
        }
    });
    // 첫 번째 행과 첫 번째 열의 셀 중앙 정렬 적용
    applyCentralAlign('keep');
}

function applyCentralAlign(tableId) {
    const table = document.getElementById(tableId);
    if (table) {
        const rows = table.rows;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            for (let j = 0; j < row.cells.length; j++) {
                const cell = row.cells[j];
                if (i === 0 || j === 0) {
                    cell.style.textAlign = 'center';
                    cell.style.verticalAlign = 'middle';
                }
            }
        }
    }
}

// 특정 테이블을 초기화하는 함수
function clearTimeTable(tableId) {
    const cells = document.querySelectorAll(`#${tableId} td`);
    cells.forEach((cell) => {
        // 첫 번째 행과 첫 번째 열은 지우지 않도록 조건을 추가합니다.
        const row = cell.parentElement.rowIndex;  // 행 인덱스 가져오기
        const col = cell.cellIndex;               // 열 인덱스 가져오기

        if (row > 0 && col > 0) {
            cell.style.backgroundColor = '';  // 배경색 초기화
            cell.innerHTML = '';              // 내용 초기화
            cell.classList.remove('occupied'); // 점유 클래스 제거
            cell.style.borderTop = '';        // 경계선 초기화
            cell.style.borderBottom = '';     // 경계선 초기화
        }
    });
}


