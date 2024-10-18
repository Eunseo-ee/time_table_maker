document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.getElementById('generateButton');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const timetableSlider = document.getElementById('timetableSlider');

    let currentIndex = 0;
    let timetableCombinations = [];

    generateButton.addEventListener('click', async function () {
        const department = document.getElementById('departmentInput').value.trim();
        const courseNames = document.getElementById('courseNamesInput').value.trim().split(',').map(name => name.trim());
        const totalCredits = parseInt(document.getElementById('totalCreditsInput').value);
        const availableTimes = document.getElementById('availableTimesInput').value.trim().split(',').map(time => time.trim());
        const requiredCourses = document.getElementById('requiredCoursesInput').value.trim().split(',').map(name => name.trim());

        // 서버로 필터링 요청
        try {
            const params = new URLSearchParams({
                department: department,
                totalCredits: totalCredits,
            });

            // courseNames와 availableTimes와 requiredCourses를 각각 문자열로 변환하여 URL에 추가
            if (courseNames.length > 0) params.append("courseNames", courseNames.join(','));
            if (availableTimes.length > 0) params.append("availableTimes", availableTimes.join(','));
            if (requiredCourses.length > 0) params.append("requiredCourses", requiredCourses.join(','));

            const response = await fetch(`http://localhost:8080/courses/generateTimetable?${params.toString()}`);
            timetableCombinations = await response.json();

            // 시간표 슬라이더 초기화 및 첫 시간표 표시
            currentIndex = 0;
            displayTimetable(currentIndex);
        } catch (error) {
            console.error('Error fetching timetable combinations:', error);
        }
    });

    prevButton.addEventListener('click', function () {
        if (currentIndex > 0) {
            currentIndex--;
            displayTimetable(currentIndex);
        }
    });

    nextButton.addEventListener('click', function () {
        if (currentIndex < timetableCombinations.length - 1) {
            currentIndex++;
            displayTimetable(currentIndex);
        }
    });

    function displayTimetable(index) {
        timetableSlider.innerHTML = ''; // 기존 시간표 지우기

        if (timetableCombinations.length === 0) {
            timetableSlider.innerHTML = '<p>No timetables available</p>';
            return;
        }

        const combination = timetableCombinations[index];

        const timetable = document.createElement('div');
        timetable.className = 'timetable';

        combination.forEach(course => {
            const courseElement = document.createElement('div');
            courseElement.className = 'course';
            courseElement.innerHTML = `
                <p><strong>${course.courseName}</strong> (${course.professorName})</p>
                <p>${course.dayOfWeek} ${course.startPeriod}-${course.endPeriod}</p>
                <p>${course.classroom}</p>
            `;
            timetable.appendChild(courseElement);
        });

        timetableSlider.appendChild(timetable);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const departmentButton = document.getElementById('departmentButton');
    const creditButton = document.getElementById('creditButton');
    const divisionButton = document.getElementById('divisionButton');
    const searchOptionButton = document.getElementById('searchOptionButton');

    // 드롭다운 메뉴 버튼 클릭 시 표시/숨김 및 위치 조정
    document.querySelectorAll('.dropdown-button').forEach(button => {
        button.addEventListener('click', function () {
            const menu = button.nextElementSibling;

            // 드롭다운 메뉴 표시
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';

            // 버튼 바로 아래에 위치하도록 설정
            const buttonRect = button.getBoundingClientRect();
            menu.style.left = `${buttonRect.left + window.scrollX}px`; // 버튼과 같은 수평 위치

            // 드롭다운 메뉴의 화면 위치 계산
            const rect = menu.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // 화면 위로 벗어날 경우 아래로 위치 조정
            if (rect.top < 0) {
                menu.style.top = `${button.offsetHeight}px`;
                menu.style.bottom = 'auto';
            }
            // 화면 아래로 벗어날 경우 위로 위치 조정
            else if (rect.bottom > viewportHeight) {
                menu.style.top = 'auto';
                menu.style.bottom = `${button.offsetHeight}px`;
            } else {
                menu.style.top = `${button.offsetHeight}px`;
                menu.style.bottom = 'auto';
            }
        });
    });

    // 드롭다운 메뉴 항목 클릭 시 값 변경, 메뉴 숨기기, 필터링 실행
    document.querySelectorAll('.dropdown-menu li').forEach(item => {
        item.addEventListener('click', function () {
            const button = item.parentElement.previousElementSibling;

            // 검색 항목 버튼 클릭 시에만 텍스트 변경
            if (button.id === 'searchOptionButton') {
                button.textContent = item.textContent; // 선택한 항목으로 버튼 텍스트 변경
            }

            // 모든 항목에 대해 값 업데이트 및 메뉴 숨기기
            button.dataset.value = item.getAttribute('data-value');
            item.parentElement.style.display = 'none';

            // 선택된 옵션에 따라 즉시 필터링 실행
            executeFiltering();
        });
    });


    if (searchButton) {
        searchButton.addEventListener('click', executeFiltering);
    }
    //
    // // 닫기 버튼 클릭 시 목록 닫기
    // if (deleteButton) {
    //     deleteButton.addEventListener('click', function () {
    //         document.querySelector('.list').style.display = 'none';
    //     });
    // }

    function executeFiltering() {
        console.log('Filtering started');

        // 드롭다운에서 선택한 값들 가져오기
        const department = departmentButton.dataset.value;
        const division = divisionButton.dataset.value;
        const credit = creditButton.dataset.value;
        const searchOption = searchOptionButton.dataset.value;
        const searchQuery = document.getElementById('searchQuery').value.trim();
        const selectedTimes = Array.from(document.querySelectorAll('.small-timetable td.selected'))
            .map(cell => cell.id) // 선택된 셀의 id 가져오기

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
        if (selectedTimes.length) {
            params.append("selectedTimes", selectedTimes.join(',')); // 선택된 시간 목록을 ,로 구분하여 추가
        }

        // 서버로 필터링된 데이터를 요청
        fetch(`http://localhost:8080/courses/filtered?${params.toString()}`)
            .then(response => response.json())
            .then(data => {
                console.log('Filtered data:', data);
                makeList(data);  // 필터링된 데이터를 이용해 목록 생성
            })
            .catch(error => console.error('Error fetching filtered data:', error));
    }
});