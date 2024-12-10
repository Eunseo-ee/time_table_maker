let activeTimetableIndex = null; // 현재 활성화된 시간표 인덱스를 관리하기 위한 전역 변수
let savedTimetables = JSON.parse(localStorage.getItem('savedTimetables')) || []; // 로컬 스토리지에서 저장된 시간표 불러오기

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

function updateTimetableChoices() {
    savedTimetables = JSON.parse(localStorage.getItem('savedTimetables')) || [];
    confirmedTimetable = JSON.parse(localStorage.getItem('confirmedTimetable')) || null; // 확정된 시간표를 로드하거나 초기화

    const choiceContainer = document.querySelector('#timetableChoices');
    const currentContainer = document.querySelector('#currentChoices');

    if (!choiceContainer) {
        console.error("Cannot find the choice container element.");
        return;
    }

    // 기존 목록 초기화
    choiceContainer.innerHTML = '';
    currentContainer.innerHTML = '';

    // 저장된 시간표 데이터를 리스트에 추가
    savedTimetables.forEach((timetable, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'timetable-item';
        listItem.dataset.index = index; // 시간표 인덱스를 저장

        const button = document.createElement('button');
        button.textContent = `시간표${index + 1}`;
        button.className = 'timetable-button';

        listItem.appendChild(button);

        // 확정된 시간표인지 확인
        if (confirmedTimetable && confirmedTimetable.index === index) {
            currentContainer.appendChild(listItem);
        } else {
            choiceContainer.appendChild(listItem);
        }

        // 왼쪽 클릭 이벤트 추가 - 시간표 활성화 및 메인 테이블에 시간표 표시
        button.addEventListener('click', () => {
            console.log(`시간표 ${index + 1} 클릭됨`);
            activeTimetableIndex = index; // 활성화된 시간표 인덱스를 설정

            // 로컬 스토리지에서 해당 시간표 데이터를 가져와 메인 테이블에 표시
            let savedTimetables = JSON.parse(localStorage.getItem('savedTimetables')) || [];
            if (activeTimetableIndex < savedTimetables.length) {
                displayTimetableInView(savedTimetables[activeTimetableIndex]);
            } else {
                console.error(`저장된 시간표 데이터에 접근할 수 없습니다: 인덱스 ${activeTimetableIndex}`);
            }

            console.log(`활성화된 시간표 인덱스: ${activeTimetableIndex}`);
        });

        // 오른쪽 클릭 이벤트 추가 - 삭제 및 확정 팝업 표시
        button.addEventListener('contextmenu', (event) => {
            event.preventDefault(); // 기본 컨텍스트 메뉴 방지

            // 팝업 창 생성
            const popup = document.createElement('div');
            popup.className = 'popup-menu';
            popup.style.top = `${event.clientY}px`;
            popup.style.left = `${event.clientX}px`;

            // 삭제 버튼 추가
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '삭제';
            deleteButton.className = 'popup-button delete-button';
            deleteButton.addEventListener('click', () => {
                const confirmDelete = confirm(`시간표 ${index + 1}을(를) 삭제하시겠습니까?`);
                if (confirmDelete) {
                    savedTimetables.splice(index, 1); // 해당 시간표 삭제
                    localStorage.setItem('savedTimetables', JSON.stringify(savedTimetables)); // 로컬 스토리지 업데이트
                    updateTimetableChoices(); // 삭제 후 시간표 목록 업데이트
                    console.log(`시간표 ${index + 1} 삭제됨`);
                }
                document.body.removeChild(popup); // 팝업 제거
            });

            // 확정 버튼 추가
            const confirmButton = document.createElement('button');
            confirmButton.textContent = '확정';
            confirmButton.className = 'popup-button confirm-button';
            confirmButton.addEventListener('click', () => {
                // 기존에 확정된 시간표가 있다면 timetableChoices로 되돌리기
                if (confirmedTimetable) {
                    const previousConfirmedIndex = confirmedTimetable.index;
                    const previousConfirmedItem = document.querySelector(`[data-index='${previousConfirmedIndex}']`);
                    if (previousConfirmedItem) {
                        choiceContainer.insertBefore(previousConfirmedItem, newTimetableItem); // 새 시간표 만들기 버튼 위로 추가
                    }
                }

                // 새로운 시간표를 확정하고 currentChoices로 이동
                confirmedTimetable = { index: index };
                localStorage.setItem('confirmedTimetable', JSON.stringify(confirmedTimetable));

                currentContainer.appendChild(listItem);
                console.log(`시간표 ${index + 1} 확정됨`);
                document.body.removeChild(popup); // 팝업 제거

                // 시간표 목록을 로컬 스토리지 순서에 맞게 갱신
                updateTimetableChoices();
            });

            // 팝업에 버튼 추가
            popup.appendChild(deleteButton);
            popup.appendChild(confirmButton);

            // 팝업을 body에 추가
            document.body.appendChild(popup);

            // 팝업 외부 클릭 시 팝업 제거
            document.addEventListener('click', function handleClickOutside(event) {
                if (popup && popup.parentNode) {
                    if (!popup.contains(event.target)) {
                        popup.parentNode.removeChild(popup); // 부모 노드에 자식 노드가 있는 경우만 삭제
                        document.removeEventListener('click', handleClickOutside); // 이벤트 리스너 제거
                    }
                } else {
                    console.warn("Popup is already removed or does not exist.");
                }
            });

        });
    });

    // '새 시간표 만들기' 옵션 추가
    const newTimetableItem = document.createElement('li');
    const newTimetableButton = document.createElement('button');
    newTimetableButton.textContent = '새 시간표 만들기';
    newTimetableButton.className = 'new-timetable-button';

    newTimetableButton.addEventListener('click', () => {
        console.log('새 시간표 만들기 버튼 클릭됨');
        savedTimetables.push([]); // 빈 시간표 추가
        localStorage.setItem('savedTimetables', JSON.stringify(savedTimetables));
        updateTimetableChoices(); // 갱신하여 새로운 시간표 추가 반영
    });

    newTimetableItem.appendChild(newTimetableButton);
    choiceContainer.appendChild(newTimetableItem);
}

// 페이지 로드 시 확정된 시간표 복원
document.addEventListener('DOMContentLoaded', () => {
    updateTimetableChoices();
});

function updateLocalStorageWithTimetable(course) {
    if (activeTimetableIndex !== null && activeTimetableIndex >= 0) {
        let savedTimetables = JSON.parse(localStorage.getItem('savedTimetables')) || [];

        if (activeTimetableIndex < savedTimetables.length) {
            console.log(`현재 활성화된 시간표 인덱스: ${activeTimetableIndex}`);
            console.log(`기존 저장된 시간표:`, savedTimetables);

            // 현재 활성화된 시간표에 강의를 추가
            if (!savedTimetables[activeTimetableIndex]) {
                savedTimetables[activeTimetableIndex] = [];
            }

            // 강의가 이미 추가되어 있는지 확인 후 중복 추가 방지
            const isAlreadyAdded = savedTimetables[activeTimetableIndex].some(
                savedCourse => savedCourse.courseName === course.courseName && savedCourse.formattedTime === course.formattedTime
            );

            if (!isAlreadyAdded) {
                // 강의 데이터를 일관된 형식으로 저장
                const newCourse = {
                    id: course.id || null,
                    departmentId: course.departmentId || null,
                    departmentName: course.departmentName || '',
                    courseCode: course.courseCode || null,
                    courseName: course.courseName || '',
                    courseNumber: course.courseNumber || null,
                    professorName: course.professorName || '',
                    credit: course.credit || null,
                    division: course.division || '',
                    classroom: course.classroom || '',
                    formattedTime: course.formattedTime || '',
                    capacity: course.capacity || null,
                    dayOfWeek: course.dayOfWeek || '',
                    startPeriod: course.startPeriod || null,
                    endPeriod: course.endPeriod || null
                };

                savedTimetables[activeTimetableIndex].push(newCourse);
                localStorage.setItem('savedTimetables', JSON.stringify(savedTimetables));
                console.log(`시간표 ${activeTimetableIndex + 1}에 강의가 추가되었습니다.`);
            } else {
                console.log(`강의가 이미 추가되어 있습니다: ${course.courseName}`);
            }

            console.log(`업데이트된 시간표:`, savedTimetables);
        } else {
            console.error(`잘못된 시간표 인덱스: ${activeTimetableIndex}`);
        }
    } else {
        console.error("활성화된 시간표가 없습니다. 시간표를 먼저 선택하세요.");
    }
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
            cell.style.borderRight = '';     // 경계선 초기화
            cell.style.borderBottom = '';     // 경계선 초기화
            cell.style.borderLeft = '';     // 경계선 초기화
            cell.classList.remove('left-top-align'); // 왼쪽 상단 정렬 클래스 제거
        }
    }
}
