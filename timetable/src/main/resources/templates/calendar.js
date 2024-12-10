document.addEventListener('DOMContentLoaded', function () {
    const calendarContainer = document.getElementById('calendar');
    const calendarDates = document.getElementById('calendarDates');
    const currentMonthLabel = document.getElementById('currentMonth');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let selectedDate = null; // 선택된 날짜를 추적

    // 캘린더 위에 확정된 시간표 과목명 표시 영역 추가
    const confirmedSubjectsContainer = document.createElement('div');
    confirmedSubjectsContainer.id = 'confirmedSubjectsContainer';
    confirmedSubjectsContainer.className = 'confirmed-subjects';
    calendarContainer.insertBefore(confirmedSubjectsContainer, calendarContainer.firstChild); // 캘린더 바로 위에 추가

    function loadConfirmedSubjects() {
        const savedTimetables = JSON.parse(localStorage.getItem('savedTimetables')) || [];
        const confirmedTimetable = JSON.parse(localStorage.getItem('confirmedTimetable'));

        confirmedSubjectsContainer.innerHTML = ''; // 기존 버튼 초기화

        if (!confirmedTimetable || confirmedTimetable.index == null) {
            confirmedSubjectsContainer.innerHTML = '<p>확정된 시간표가 없습니다.</p>';
            return;
        }

        const confirmedIndex = confirmedTimetable.index;
        const confirmedTimetableData = savedTimetables[confirmedIndex];

        if (!confirmedTimetableData || confirmedTimetableData.length === 0) {
            confirmedSubjectsContainer.innerHTML = '<p>확정된 시간표에 과목이 없습니다.</p>';
            return;
        }

        // 과목명을 중복 없이 수집
        const uniqueSubjects = Array.from(new Set(confirmedTimetableData.map(subject => subject.courseName)));

        // 과목명으로 버튼 생성
        uniqueSubjects.forEach(courseName => {
            const subjectButton = document.createElement('button');
            subjectButton.textContent = courseName; // 과목명 표시
            subjectButton.className = 'subject-button';
            subjectButton.addEventListener('click', () => {
                console.log(`Clicked on subject: ${courseName}`);
                // 필요한 추가 동작을 이곳에 작성
            });
            confirmedSubjectsContainer.appendChild(subjectButton);
        });
    }

    function renderCalendar(year, month) {
        // 월 이름 및 연도 표시
        currentMonthLabel.textContent = `${year}년 ${month + 1}월`;

        // 첫 번째 날 및 마지막 날 계산
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        // 첫 번째 날의 요일 계산 (0: 월요일, ..., 6: 일요일)
        let startDay = firstDayOfMonth.getDay();
        startDay = startDay === 0 ? 6 : startDay - 1; // 월요일 시작으로 변환

        // 달력 날짜 초기화
        calendarDates.innerHTML = '';

        // 빈 칸 채우기 (첫 번째 주 앞에 필요한 빈 셀 추가)
        for (let i = 0; i < startDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('empty');
            calendarDates.appendChild(emptyCell);
        }

        // 날짜 채우기
        for (let date = 1; date <= lastDayOfMonth.getDate(); date++) {
            const dateCell = document.createElement('div');
            dateCell.textContent = date;

            const dayOfWeek = (startDay + date - 1) % 7;

            // 일요일 및 토요일 색상 적용
            if (dayOfWeek === 5) {
                dateCell.classList.add('saturday'); // 토요일
            } else if (dayOfWeek === 6) {
                dateCell.classList.add('sunday'); // 일요일
            }

            // 날짜 클릭 이벤트 추가
            dateCell.addEventListener('click', function () {
                // 이전 선택된 날짜의 하이라이트 제거
                if (selectedDate) {
                    selectedDate.classList.remove('highlighted');
                }

                // 새로운 선택된 날짜에 하이라이트 적용
                selectedDate = dateCell;
                dateCell.classList.add('highlighted');
                console.log(`Selected date: ${year}-${month + 1}-${date}`);
            });

            calendarDates.appendChild(dateCell);
        }
    }

    // 이전 및 다음 버튼 이벤트 리스너 추가
    prevMonthButton.addEventListener('click', function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentYear, currentMonth);
    });

    nextMonthButton.addEventListener('click', function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentYear, currentMonth);
    });

    // 현재 월 달력 렌더링
    renderCalendar(currentYear, currentMonth);
    loadConfirmedSubjects(); // 확정된 과목 로드
});
