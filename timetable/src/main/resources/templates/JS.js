const searchButton = document.querySelector('.button'); //검색 버튼 불러오기
const deleteButton = document.querySelector('.deleteButton'); //삭제 버튼 불러오기
const list = document.querySelector('.list');

searchButton.addEventListener('click', () => {
    list.style.display = 'block';
});

deleteButton.addEventListener('click', () => {
    list.style.display = 'none';
});