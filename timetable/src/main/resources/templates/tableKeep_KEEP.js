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
    // 로컬 스토리지에서 시간표 데이터를 불러오기 (JSON 파싱)
    let savedTimetables = JSON.parse(localStorage.getItem('savedTimetables')) || [];

    // 시간표 데이터를 정렬된 JSON 문자열로 변환
    let newTimetableString = JSON.stringify(sortTimetable(timetableData));

    // 중복 확인: 기존 시간표와 동일한 조합이 있는지 확인
    let isDuplicate = savedTimetables.some(savedTimetable => JSON.stringify(sortTimetable(savedTimetable)) === newTimetableString);

    // 중복이 아닌 경우에만 저장
    if (!isDuplicate) {
        savedTimetables.push(timetableData);
        localStorage.setItem('savedTimetables', JSON.stringify(savedTimetables));
    }

    updateTimetableChoices();
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

    // `.choice` 요소에서 기존 시간표 항목 제거 (중복 업데이트 방지)
    let choiceContainer = document.querySelector('.choice ul');
    choiceContainer.innerHTML = '';

    // 저장된 시간표 목록을 순회하며 UI에 반영
    savedTimetables.forEach((timetable, index) => {
        // 새로운 li 요소 생성
        let listItem = document.createElement('li');
        let link = document.createElement('a');
        link.href = '#'; // 클릭 시 특정 시간표 보기 기능 추가 가능
        // link.addEventListener('click', () => loadTimetable(index)); // 해당 시간표를 로드하는 기능

        // li 요소에 시간표 정보를 설정
        let span = document.createElement('span');
        span.innerHTML = `시간표 ${index + 1}`;

        // 요소 구성
        link.appendChild(listItem);
        listItem.appendChild(span);
        choiceContainer.appendChild(link);
    });
}

function displayTimetableInView(timetable) {
    // 시간표 데이터를 view.html의 테이블에 표시하는 로직 작성
    // 예: 특정 테이블 요소를 업데이트합니다.
    console.log('Displaying timetable:', timetable);
}