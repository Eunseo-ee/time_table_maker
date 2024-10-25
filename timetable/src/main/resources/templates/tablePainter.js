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

    // 테이블 셀 초기화
    clearTimeTable();

    timetableCombination.forEach(course => {
        const daysAndPeriods = course.time.split(', '); // 예: "월 1-3, 수 2-4"
        const courseColor = courseColorMap[course.courseName] || colorPalette[colorIndex % colorPalette.length];
        courseColorMap[course.courseName] = courseColor; // 강의 색상 저장
        colorIndex++; // 다음 강의는 다른 색상 사용

        // 시간표에 각 강의를 색칠
        daysAndPeriods.forEach(slot => {
            const [day, periodRange] = slot.split(' ');
            const dayCode = dayOfWeekMap[day];

            const [startPeriod, endPeriod] = periodRange.includes('-') ? periodRange.split('-').map(Number) : [parseInt(periodRange), parseInt(periodRange)];
            const finalEndPeriod = endPeriod || startPeriod;

            for (let period = startPeriod; period <= finalEndPeriod; period++) {
                const cellId = `${dayCode}-${period}`;
                const cell = document.getElementById(cellId);

                if (cell) {
                    cell.style.backgroundColor = courseColor; // 셀 배경색 설정
                    cell.innerHTML = `<strong>${course.courseName}</strong><br>${course.professorName}`;
                    cell.classList.add('occupied'); // 점유된 셀 표시
                }
            }
        });
    });
}

// 테이블 초기화 함수
function clearTimeTable() {
    const cells = document.querySelectorAll(".main-table td");
    cells.forEach(cell => {
        cell.style.backgroundColor = ''; // 배경색 초기화
        cell.innerHTML = ''; // 내용 초기화
        cell.classList.remove('occupied'); // 점유 클래스 제거
    });
}
