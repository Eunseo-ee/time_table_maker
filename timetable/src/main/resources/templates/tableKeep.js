// comparing 테이블에 시간표 출력 함수
function fillComparingTable(timetableCombination) {
    const dayOfWeekMap = {
        '월': 'mon',
        '화': 'tue',
        '수': 'wed',
        '목': 'thu',
        '금': 'fri'
    };

    // comparing 테이블 셀 초기화 (초기화를 하지 않으면 기존 내용이 유지될 수 있음)
    clearTimeTable('comparing');

    timetableCombination.forEach(course => {
        const dayCode = dayOfWeekMap[course.dayOfWeek];
        if (!dayCode) {
            console.error("Invalid day code for course:", course);
            return;
        }

        const startPeriod = parseInt(course.startPeriod);
        const endPeriod = parseInt(course.endPeriod) || startPeriod;

        // 강의 색상 설정
        const courseColor = courseColorMap[course.courseName];

        // comparing 테이블에 각 강의를 색칠
        for (let period = startPeriod; period <= endPeriod; period++) {
            const cellId = `${dayCode}-${period}`;
            const cell = document.getElementById(cellId);

            if (cell) {
                cell.style.backgroundColor = courseColor; // 셀 배경색 설정
                cell.classList.add('occupied'); // 점유된 셀 표시

                // 셀의 텍스트 정렬 설정
                if (period === startPeriod) {
                    cell.innerHTML = `<strong style="font-size: 14px; color: #2e2e2e;">${course.courseName}</strong><br><span style="font-size: 11px; color: #8c8c8c;">${course.professorName}</span>`;
                    cell.classList.add('left-top-align');
                } else {
                    cell.innerHTML = '';
                    cell.classList.add('left-top-align');
                }
            } else {
                console.error("Cell not found:", cellId);
            }
        }
    });

    // 첫 번째 행과 첫 번째 열의 셀 중앙 정렬 적용
    applyCentralAlign('comparing');
}

// 화살표 버튼 클릭 시 keep 테이블의 시간표 업데이트 (comparing 테이블은 그대로 유지)
document.getElementById('some_arrow_button').addEventListener('click', function() {
    if (timetableCombinations.length > 0) {
        currentIndex = (currentIndex + 1) % timetableCombinations.length; // 다음 시간표로 이동
        keepCombination = timetableCombinations[currentIndex]; // 새로운 keep 조합 설정
        fillTimeTable('keep', keepCombination); // keep 테이블에 새로운 시간표 조합 출력
    }

    console.log("'keep' table updated, but 'comparing' table remains unchanged.");
});