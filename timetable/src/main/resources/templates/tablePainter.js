// 색상 배열 정의 (각 강의마다 다른 색을 적용)
const colorPalette = ['#d9e9ff', '#c6e9ff', '#b1e2ff', '#89ceff', '#6297bd', '#6290bd', '#597eac', '#6b88ac', '#5084a6'];
let colorIndex = 0; // 색상을 순서대로 선택하기 위한 인덱스
const courseColorMap = {}; // 강의 이름별로 색상을 저장하는 객체

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
        console.log(timetableCombination);

        const startPeriod = parseInt(course.startPeriod);
        const endPeriod = parseInt(course.endPeriod);
        const finalEndPeriod = endPeriod || startPeriod;

        const courseColor = courseColorMap[course.courseName] || colorPalette[colorIndex % colorPalette.length];
        courseColorMap[course.courseName] = courseColor; // 강의 색상 저장
        colorIndex++; // 다음 강의는 다른 색상 사용

        // 시간표에 각 강의를 색칠
        for (let period = startPeriod; period <= finalEndPeriod; period++) {
            const cellId = `${dayCode}_${period}`;
            const cell = document.getElementById(cellId);

            if(cell){
                console.log("Cell found. Attempting to apply color.");
                cell.style.backgroundColor = `${courseColor} !important`; // 셀 배경색 설정 (중요도를 높여 설정)
                cell.innerHTML = `<strong>${course.courseName}</strong><br>${course.professorName}`;
                cell.classList.add('occupied'); // 점유된 셀 표시
            }
        }
    });
}

// 테이블 초기화 함수
function clearTimeTable(tableId) {
    // 특정 테이블 ID에 해당하는 셀만 선택하여 초기화
    const table = document.getElementById(tableId);
    if (table) {
        const cells = table.querySelectorAll("td");
        cells.forEach(cell => {
            cell.style.backgroundColor = ''; // 배경색 초기화
            cell.innerHTML = ''; // 내용 초기화
            cell.classList.remove('occupied'); // 점유 클래스 제거
        });
    }
}
