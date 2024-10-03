document.querySelector('.deleteButton').addEventListener('click', function() {
    document.querySelector('.list').style.display = 'none'; // 목록 닫기
});

fetch("http://localhost:8080/courses/list")
    .then(response => response.json())
    .then(data => {
        console.log(data);  // 받아온 데이터를 출력해 확인
        // 받아온 데이터를 HTML에 렌더링하는 로직 추가
    })
    .catch(error => console.error("Error fetching courses list:", error));

document.getElementById('searchButton').addEventListener('click', function () {
    const department = document.getElementById('department').value;
    const division = document.getElementById('division').value;
    const credit = document.getElementById('credit').value;
    const searchOption = document.getElementById('search-option').value;
    const searchQuery = document.getElementById('search-query').value;

    // 서버에 선택된 옵션을 전달하여 필터링된 데이터를 요청
    fetch(`http://localhost:8080/courses/filtered?department=${department}&division=${division}&credit=${credit}&searchOption=${searchOption}&searchQuery=${searchQuery}`)
        .then(response => response.json())
        .then(data => {
            console.log('Filtered data:', data);
            makeList(data);  // 필터링된 데이터를 이용해 목록 생성
        })
        .catch(error => console.error('Error fetching filtered data:', error));
});
