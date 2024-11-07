// 전역 변수로 현재 keep 테이블의 시간표 조합을 저장할 변수
let keepCombination = [];

// keep_button 클릭 시 'keep' 테이블의 내용을 'comparing' 테이블로 복사
document.getElementById('keep_button').addEventListener('click', function() {
    // 현재 keep 테이블의 내용을 keepCombination 변수에 저장합니다.
    keepCombination = getTimetableCombination('keep');
    // keep 테이블의 내용을 comparing 테이블로 복사합니다.
    fillComparingTable(keepCombination)

// 'keep' 테이블의 시간표를 'comparing' 테이블에 복사하는 함수
// 시간표 테이블에 색칠하는 함수
    function fillComparingTable(timetableCombination) {
        const dayOfWeekMap = {
            '월': 'mon',
            '화': 'tue',
            '수': 'wed',
            '목': 'thu',
            '금': 'fri'
        };

        // 테이블 셀 초기화 (keep 테이블에 대한 초기화)
        clearTimeTable('comparing');

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

// 특정 테이블의 시간표 데이터를 가져오는 함수
    function getTimetableCombination(tableId) {
        const dayCodes = ['mon', 'tue', 'wed', 'thu', 'fri'];
        const periods = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let timetableCombination = [];

        dayCodes.forEach(day => {
            periods.forEach(period => {
                const cellId = `${day}_${period}`;
                const cell = document.getElementById(cellId);

                if (cell && cell.classList.contains('occupied')) {
                    const courseName = cell.querySelector('strong')?.textContent || '';
                    const professorName = cell.querySelector('span')?.textContent || '';
                    timetableCombination.push({
                        dayOfWeek: day,
                        startPeriod: period,
                        courseName: courseName,
                        professorName: professorName
                    });
                }
            });
        });

        return timetableCombination;
    }
})