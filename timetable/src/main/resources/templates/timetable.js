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
            if (department) params.append("department", department);
            if (division) params.append("division", division);
            if (credit) params.append("credit", credit);
            if (searchOption) params.append("searchOption", searchOption);
            if (searchQuery) params.append("searchQuery", searchQuery);

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

// 강의 목록에서 항목을 클릭할 때 시간표를 채우는 함수
function fillTimeTable(course) {
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
        const [startPeriod, endPeriod] = periodRange.split('-').map(Number);

        // endPeriod가 없으면 startPeriod로 지정 (단일 교시인 경우)
        const finalEndPeriod = endPeriod || startPeriod;

        const rowspan = finalEndPeriod - startPeriod + 1;  // 병합할 셀의 개수

        // 시작 셀을 찾음
        const startCellId = `${dayCode}-${startPeriod}`;
        const startCell = document.getElementById(startCellId);

        // 시간표의 각 교시에 해당하는 셀을 채움
        if (startCell) {
            // 시작 셀에 rowspan 적용 및 수업 정보 표시
            startCell.innerHTML = `${course.courseName} (${course.professorName})`;
            startCell.style.backgroundColor = '#bbc5e4';  // 시각적 구분을 위한 배경색
            startCell.style.verticalAlign = 'middle';  // 텍스트 수직 가운데 정렬
            startCell.rowSpan = rowspan;  // 셀 병합

            // 병합한 셀의 나머지 셀은 숨김 처리
            for (let period = startPeriod + 1; period <= finalEndPeriod; period++) {
                const cellId = `${dayCode}-${period}`;
                const cell = document.getElementById(cellId);
                if (cell) {
                    cell.style.display = 'none';  // 셀 숨기기
                }
            }
        }
    });
}



// 강의 목록을 클릭할 때 실행될  이벤트 설정 (이벤트 위임 방식)
document.getElementById('mainList').addEventListener('click', function(event) {
    // 클릭한 대상이 li 내부의 div 요소일 경우, li 요소까지 찾아서 강의 데이터를 가져옴
    const target = event.target.closest('li');

    if (target) {
        // 강의 데이터를 가져오기 위한 예시: 클릭된 li 요소에서 데이터를 가져옴
        const course = {
            courseName: target.querySelector('div:nth-child(2)').textContent,
            professorName: target.querySelector('div:nth-child(4)').textContent,
            time: target.querySelector('div:nth-child(6)').textContent.trim() // ex: 월 1-2, 목 5-6
        };

        fillTimeTable(course);  // 시간표에 강의를 반영
    }
});
