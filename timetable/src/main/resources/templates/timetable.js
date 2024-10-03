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